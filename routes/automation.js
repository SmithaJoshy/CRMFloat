const express = require('express');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const Payment = require('../models/Payment');
const Deal = require('../models/Deal');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Twilio configuration
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send payment reminder manually
router.post('/send-reminder/:paymentId', auth, authorize('Founder/Executive', 'Finance & Payments'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('clientId')
      .populate('dealId');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const { type = 'gentle' } = req.body;
    
    const templates = {
      gentle: {
        subject: 'Friendly Reminder - Payment Due',
        text: `Dear ${payment.clientId.name},\n\nThis is a friendly reminder that your payment of ₹${payment.amount} for ${payment.dealId.projectName} is due on ${payment.dueDate.toDateString()}.\n\nPlease process the payment at your earliest convenience.\n\nBest regards,\nDesign Pipeline Team`
      },
      followUp: {
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
    payment.reminderCount += 1;
    payment.lastReminderDate = new Date();
    await payment.save();

    res.json({ message: 'Reminder sent successfully' });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send escalation alert
router.post('/send-escalation/:paymentId', auth, authorize('Founder/Executive', 'Finance & Payments'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate('clientId')
      .populate('dealId');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const escalationEmail = process.env.ESCALATION_EMAIL || process.env.EMAIL_USER;
    const daysOverdue = Math.floor((new Date() - payment.dueDate) / (1000 * 60 * 60 * 24));
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: escalationEmail,
      subject: 'CRITICAL - Payment Overdue - Escalation Required',
      text: `Payment of ₹${payment.amount} from ${payment.clientId.name} for ${payment.dealId.projectName} is ${daysOverdue} days overdue.\n\nClient: ${payment.clientId.name}\nProject: ${payment.dealId.projectName}\nAmount: ₹${payment.amount}\nDue Date: ${payment.dueDate.toDateString()}\nDays Overdue: ${daysOverdue}\n\nImmediate action required.\n\nCRM System`
    });

    res.json({ message: 'Escalation alert sent successfully' });
  } catch (error) {
    console.error('Send escalation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send stage progression notification
router.post('/stage-notification/:dealId', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId)
      .populate('clientId');
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const { message, subject } = req.body;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: deal.clientId.email,
      subject: subject || `Project Update - ${deal.projectName}`,
      text: message || `Dear ${deal.clientId.name},\n\nYour project ${deal.projectName} has moved to the next stage: ${deal.currentStage}.\n\nWe will keep you updated on the progress.\n\nBest regards,\nDesign Pipeline Team`
    });

    res.json({ message: 'Stage notification sent successfully' });
  } catch (error) {
    console.error('Send stage notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send welcome email to new client
router.post('/welcome-email/:clientId', auth, authorize('Founder/Executive', 'Sales Manager'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: 'Welcome to Design Pipeline - Interior Design Services',
      text: `Dear ${client.name},\n\nThank you for your interest in our interior design services!\n\nWe're excited to work with you and will be in touch soon to discuss your project requirements.\n\nIn the meantime, please feel free to explore our portfolio and let us know if you have any questions.\n\nBest regards,\nDesign Pipeline Team`
    });

    res.json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Send welcome email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send project completion email
router.post('/completion-email/:dealId', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId)
      .populate('clientId');
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: deal.clientId.email,
      subject: 'Project Completed - Thank You!',
      text: `Dear ${deal.clientId.name},\n\nCongratulations! Your project ${deal.projectName} has been completed successfully.\n\nWe hope you're delighted with the results. Please take a moment to share your experience with us.\n\nThank you for choosing Design Pipeline for your interior design needs.\n\nBest regards,\nDesign Pipeline Team`
    });

    res.json({ message: 'Completion email sent successfully' });
  } catch (error) {
    console.error('Send completion email error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send testimonial request
router.post('/testimonial-request/:dealId', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.dealId)
      .populate('clientId');
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: deal.clientId.email,
      subject: 'Share Your Experience - Testimonial Request',
      text: `Dear ${deal.clientId.name},\n\nWe would love to hear about your experience with ${deal.projectName}.\n\nYour feedback helps us improve our services and helps other clients make informed decisions.\n\nPlease take a moment to share your thoughts by replying to this email.\n\nThank you for your time!\n\nBest regards,\nDesign Pipeline Team`
    });

    res.json({ message: 'Testimonial request sent successfully' });
  } catch (error) {
    console.error('Send testimonial request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get automation statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalReminders = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$reminderCount' } } }
    ]);

    const overduePayments = await Payment.countDocuments({
      status: { $ne: 'Collected' },
      dueDate: { $lt: new Date() }
    });

    const recentReminders = await Payment.find({
      lastReminderDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).populate('clientId', 'name').populate('dealId', 'projectName');

    res.json({
      totalReminders: totalReminders[0]?.total || 0,
      overduePayments,
      recentReminders
    });
  } catch (error) {
    console.error('Get automation stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test email configuration
router.post('/test-email', auth, authorize('Founder/Executive'), async (req, res) => {
  try {
    const { email } = req.body;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Test Email - Design Pipeline CRM',
      text: 'This is a test email from Design Pipeline CRM. If you receive this, your email configuration is working correctly.'
    });

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Email configuration error' });
  }
});

// Test SMS configuration
router.post('/test-sms', auth, authorize('Founder/Executive'), async (req, res) => {
  try {
    const { phone } = req.body;
    
    await twilioClient.messages.create({
      body: 'This is a test SMS from Design Pipeline CRM. If you receive this, your SMS configuration is working correctly.',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    res.json({ message: 'Test SMS sent successfully' });
  } catch (error) {
    console.error('Test SMS error:', error);
    res.status(500).json({ message: 'SMS configuration error' });
  }
});

module.exports = router;
