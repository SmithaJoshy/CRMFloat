const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const cron = require('node-cron');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Database connection (MongoDB Atlas - Free tier)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/design-pipeline-crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Cloudinary configuration (Free tier)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Email configuration (Gmail SMTP - Free)
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Twilio configuration (Free trial)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Models
const User = require('./models/User');
const Client = require('./models/Client');
const Deal = require('./models/Deal');
const Payment = require('./models/Payment');
const Document = require('./models/Document');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/deals', require('./routes/deals'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/automation', require('./routes/automation'));

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Automated Payment Reminder System
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily payment reminder check...');
  
  try {
    const overduePayments = await Payment.find({
      status: { $ne: 'Collected' },
      dueDate: { $lt: new Date() }
    }).populate('dealId').populate('clientId');

    for (const payment of overduePayments) {
      const daysOverdue = Math.floor((new Date() - payment.dueDate) / (1000 * 60 * 60 * 24));
      
      // Send reminder based on days overdue
      if (daysOverdue === 1) {
        await sendPaymentReminder(payment, 'gentle');
      } else if (daysOverdue === 3) {
        await sendPaymentReminder(payment, 'follow-up');
      } else if (daysOverdue === 7) {
        await sendPaymentReminder(payment, 'urgent');
      } else if (daysOverdue >= 14) {
        await sendPaymentReminder(payment, 'final');
        await sendEscalationAlert(payment);
      }
    }
  } catch (error) {
    console.error('Payment reminder error:', error);
  }
});

// Payment reminder function
async function sendPaymentReminder(payment, type) {
  const templates = {
    gentle: {
      subject: 'Friendly Reminder - Payment Due',
      text: `Dear ${payment.clientId.name},\n\nThis is a friendly reminder that your payment of ₹${payment.amount} for ${payment.dealId.projectName} is due on ${payment.dueDate.toDateString()}.\n\nPlease process the payment at your earliest convenience.\n\nBest regards,\nDesign Pipeline Team`
    },
    follow-up: {
      subject: 'Follow-up Reminder - Payment Due',
      text: `Dear ${payment.clientId.name},\n\nThis is a follow-up reminder that your payment of ₹${payment.amount} for ${payment.dealId.projectName} was due on ${payment.dueDate.toDateString()}.\n\nPlease process the payment to avoid any delays in your project timeline.\n\nBest regards,\nDesign Pipeline Team`
    },
    urgent: {
      subject: 'URGENT - Payment Overdue',
      text: `Dear ${payment.clientId.name},\n\nYour payment of ₹${payment.amount} for ${payment.dealId.projectName} was due on ${payment.dueDate.toDateString()} and is now overdue.\n\nTo avoid any delays in your project timeline, please process the payment immediately.\n\nBest regards,\nDesign Pipeline Team`
    },
    final: {
      subject: 'FINAL NOTICE - Payment Overdue',
      text: `Dear ${payment.clientId.name},\n\nThis is the final notice for your overdue payment of ₹${payment.amount} for ${payment.dealId.projectName}.\n\nIf payment is not received within 48 hours, we may need to suspend your project.\n\nPlease contact us immediately to resolve this matter.\n\nBest regards,\nDesign Pipeline Team`
    }
  };

  const template = templates[type];
  
  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: payment.clientId.email,
    subject: template.subject,
    text: template.text
  });

  // Send SMS for urgent and final notices
  if (type === 'urgent' || type === 'final') {
    try {
      await twilioClient.messages.create({
        body: template.text,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: payment.clientId.phone
      });
    } catch (error) {
      console.error('SMS sending failed:', error);
    }
  }

  // Update reminder count
  await Payment.findByIdAndUpdate(payment._id, {
    $inc: { reminderCount: 1 },
    lastReminderDate: new Date()
  });
}

// Escalation alert function
async function sendEscalationAlert(payment) {
  const escalationEmail = process.env.ESCALATION_EMAIL || process.env.EMAIL_USER;
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: escalationEmail,
    subject: 'CRITICAL - Payment Overdue - Escalation Required',
    text: `Payment of ₹${payment.amount} from ${payment.clientId.name} for ${payment.dealId.projectName} is ${Math.floor((new Date() - payment.dueDate) / (1000 * 60 * 60 * 24))} days overdue.\n\nImmediate action required.\n\nCRM System`
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Design Pipeline CRM Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api`);
});

module.exports = app;
