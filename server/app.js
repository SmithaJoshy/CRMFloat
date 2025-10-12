const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();

// Environment-aware port configuration
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8081 : 3002);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

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

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Health check endpoint for deployment
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'CRMFloat Server is running',
    product: 'CRMFloat',
    tagline: 'Where Customer Relationships Flow Seamlessly',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const dealRoutes = require('./routes/deals');
const documentRoutes = require('./routes/documents');
const paymentRoutes = require('./routes/payments');
const designerRoutes = require('./routes/designers');
const valuedCustomerRoutes = require('./routes/valuedCustomers');
const configRoutes = require('./routes/config');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/designers', designerRoutes);
app.use('/api/valued-customers', valuedCustomerRoutes);
app.use('/api/config', configRoutes);

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CRMFloat Server running on port ${PORT}`);
  console.log(`💧 Where Customer Relationships Flow Seamlessly`);
  console.log(`📊 Server is ready and listening on all interfaces`);
  console.log(`🔧 API endpoints available at /api`);
  console.log(`📱 Frontend served from root path`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n🔑 Demo Login Credentials:`);
    console.log(`   Email: admin@crmfloat.com`);
    console.log(`   Password: admin123`);
  }
});

module.exports = app;
