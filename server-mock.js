const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// Mock Database (In-Memory)
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@designpipeline.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
    role: 'Founder/Executive',
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

// Mock leads data
let leads = [
  {
    _id: '1',
    leadId: 'LEAD-001',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-9876543210',
    company: 'Kumar Enterprises',
    leadSource: 'Website',
    leadStatus: 'New Lead',
    budget: 500000,
    projectType: 'Residential',
    requirements: 'Modern 3BHK apartment design with contemporary furniture',
    assignedTo: 'Sarah Johnson',
    priority: 'High',
    followUpDate: '2024-01-15',
    notes: 'Interested in modular kitchen and living room design',
    createdAt: '2024-01-10T10:00:00Z',
    isActive: true
  },
  {
    _id: '2',
    leadId: 'LEAD-002',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543211',
    company: 'Sharma & Associates',
    leadSource: 'Referral',
    leadStatus: 'Contacted',
    budget: 750000,
    projectType: 'Commercial',
    requirements: 'Office interior design for 2000 sq ft space',
    assignedTo: 'Mike Chen',
    priority: 'Medium',
    followUpDate: '2024-01-12',
    notes: 'Looking for professional office setup with meeting rooms',
    createdAt: '2024-01-08T14:30:00Z',
    isActive: true
  },
  {
    _id: '3',
    leadId: 'LEAD-003',
    name: 'Amit Patel',
    email: 'amit.patel@email.com',
    phone: '+91-9876543212',
    company: 'Patel Industries',
    leadSource: 'Google Ads',
    leadStatus: 'Qualified',
    budget: 1200000,
    projectType: 'Luxury',
    requirements: 'Luxury villa interior with premium finishes',
    assignedTo: 'Sarah Johnson',
    priority: 'High',
    followUpDate: '2024-01-14',
    notes: 'High-end client, budget confirmed, ready for proposal',
    createdAt: '2024-01-05T09:15:00Z',
    isActive: true
  },
  {
    _id: '4',
    leadId: 'LEAD-004',
    name: 'Neha Gupta',
    email: 'neha.gupta@email.com',
    phone: '+91-9876543213',
    company: 'Gupta Group',
    leadSource: 'Social Media',
    leadStatus: 'Proposal Sent',
    budget: 300000,
    projectType: 'Renovation',
    requirements: 'Kitchen and bedroom renovation',
    assignedTo: 'Mike Chen',
    priority: 'Medium',
    followUpDate: '2024-01-16',
    notes: 'Proposal sent, waiting for client response',
    createdAt: '2024-01-03T16:45:00Z',
    isActive: true
  },
  {
    _id: '5',
    leadId: 'LEAD-005',
    name: 'Vikram Singh',
    email: 'vikram.singh@email.com',
    phone: '+91-9876543214',
    company: 'Singh Constructions',
    leadSource: 'Walk-in',
    leadStatus: 'Converted',
    budget: 800000,
    projectType: 'Residential',
    requirements: 'Complete home interior design',
    assignedTo: 'Sarah Johnson',
    priority: 'High',
    followUpDate: '2024-01-18',
    notes: 'Successfully converted to client, project started',
    createdAt: '2024-01-01T11:20:00Z',
    isActive: true
  }
];

let clients = [
  {
    _id: '1',
    clientId: 'CLI-001',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+91-9876543210',
    stylePreferences: ['Modern', 'Minimalist'],
    targetBudget: 500000,
    leadSource: 'Website',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '2',
    clientId: 'CLI-002',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+91-9876543211',
    stylePreferences: ['Traditional', 'Contemporary'],
    targetBudget: 750000,
    leadSource: 'Referral',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '3',
    clientId: 'CLI-003',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543212',
    stylePreferences: ['Contemporary', 'Industrial'],
    targetBudget: 1200000,
    leadSource: 'Social Media',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '4',
    clientId: 'CLI-004',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91-9876543213',
    stylePreferences: ['Scandinavian', 'Bohemian'],
    targetBudget: 800000,
    leadSource: 'Google Ads',
    isActive: true,
    createdAt: new Date()
  }
];

let deals = [
  {
    _id: '1',
    dealId: 'DEAL-001',
    projectName: 'Modern Living Room Renovation',
    currentStage: 'Design in Progress',
    totalProjectValue: 450000,
    clientId: '1',
    projectStatus: 'Active',
    priorityLevel: 'High',
    assignedDesigner: 'Alice Designer',
    projectStartDate: new Date(),
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '2',
    dealId: 'DEAL-002',
    projectName: 'Kitchen Makeover',
    currentStage: 'Contract Signed (50% Due)',
    totalProjectValue: 600000,
    clientId: '2',
    projectStatus: 'Active',
    priorityLevel: 'Medium',
    assignedDesigner: 'Bob Designer',
    projectStartDate: new Date(),
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '3',
    dealId: 'DEAL-003',
    projectName: 'Complete Home Renovation',
    currentStage: 'Project Handover & Completion',
    totalProjectValue: 1200000,
    clientId: '3',
    projectStatus: 'Completed',
    priorityLevel: 'High',
    assignedDesigner: 'Charlie Designer',
    projectStartDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    projectEndDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    isActive: true,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000) // 120 days ago
  },
  {
    _id: '4',
    dealId: 'DEAL-004',
    projectName: 'Scandinavian Apartment Design',
    currentStage: 'Follow-up & Warranty Service',
    totalProjectValue: 800000,
    clientId: '4',
    projectStatus: 'Warranty',
    priorityLevel: 'Low',
    assignedDesigner: 'Diana Designer',
    projectStartDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
    projectEndDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    warrantyEndDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000), // 1 year from now
    isActive: true,
    createdAt: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000) // 210 days ago
  }
];

let payments = [
  {
    _id: '1',
    paymentId: 'PAY-001',
    invoiceNumber: 'INV-2024-001',
    invoiceStage: 'Design Fee (₹35K–₹48K)',
    amount: 35000,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'Sent',
    dealId: '1',
    clientId: '1',
    reminderCount: 0,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '2',
    paymentId: 'PAY-002',
    invoiceNumber: 'INV-2024-002',
    invoiceStage: '50% Advance',
    amount: 300000,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago (overdue)
    status: 'Overdue',
    dealId: '2',
    clientId: '2',
    reminderCount: 2,
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '3',
    paymentId: 'PAY-003',
    invoiceNumber: 'INV-2024-003',
    invoiceStage: '50% Advance',
    amount: 600000,
    dueDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 120 days ago
    status: 'Paid',
    dealId: '3',
    clientId: '3',
    reminderCount: 0,
    paymentDate: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000), // 115 days ago
    isActive: true,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '4',
    paymentId: 'PAY-004',
    invoiceNumber: 'INV-2024-004',
    invoiceStage: 'Final Payment',
    amount: 600000,
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    status: 'Paid',
    dealId: '3',
    clientId: '3',
    reminderCount: 0,
    paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '5',
    paymentId: 'PAY-005',
    invoiceNumber: 'INV-2024-005',
    invoiceStage: '50% Advance',
    amount: 400000,
    dueDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
    status: 'Paid',
    dealId: '4',
    clientId: '4',
    reminderCount: 0,
    paymentDate: new Date(Date.now() - 175 * 24 * 60 * 60 * 1000), // 175 days ago
    isActive: true,
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '6',
    paymentId: 'PAY-006',
    invoiceNumber: 'INV-2024-006',
    invoiceStage: 'Final Payment',
    amount: 400000,
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    status: 'Paid',
    dealId: '4',
    clientId: '4',
    reminderCount: 0,
    paymentDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  }
];

let documents = [
  {
    _id: '1',
    documentId: 'DOC-001',
    documentName: 'Client Questionnaire - John Smith',
    documentType: 'Questionnaire',
    fileUrl: 'https://via.placeholder.com/300x200?text=Questionnaire',
    fileSize: 1024000,
    dealId: '1',
    clientId: '1',
    uploadedBy: '1',
    uploadDate: new Date(),
    accessLevel: 'Team',
    isActive: true
  }
];

// Helper function to populate references
const populateReferences = (item, refs) => {
  if (refs.includes('clientId') && item.clientId) {
    item.clientId = clients.find(c => c._id === item.clientId) || { name: 'Unknown Client' };
  }
  if (refs.includes('dealId') && item.dealId) {
    item.dealId = deals.find(d => d._id === item.dealId) || { projectName: 'Unknown Project' };
  }
  if (refs.includes('uploadedBy') && item.uploadedBy) {
    item.uploadedBy = users.find(u => u._id === item.uploadedBy) || { name: 'Unknown User' };
  }
  return item;
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.isActive);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // For demo purposes, use simple password comparison
    const isMatch = password === 'admin123';
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = users.find(u => u._id === decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Clients Routes
app.get('/api/clients', (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  
  let filteredClients = clients.filter(c => c.isActive);
  
  if (search) {
    filteredClients = filteredClients.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  res.json({
    clients: paginatedClients,
    totalPages: Math.ceil(filteredClients.length / limit),
    currentPage: parseInt(page),
    total: filteredClients.length
  });
});

// Leads Routes
app.get('/api/leads', (req, res) => {
  const { page = 1, limit = 10, search, status, source } = req.query;
  
  let filteredLeads = leads.filter(l => l.isActive);
  
  if (search) {
    filteredLeads = filteredLeads.filter(l => 
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.company?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search)
    );
  }
  
  if (status) {
    filteredLeads = filteredLeads.filter(l => l.leadStatus === status);
  }
  
  if (source) {
    filteredLeads = filteredLeads.filter(l => l.leadSource === source);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  res.json({
    leads: paginatedLeads,
    totalPages: Math.ceil(filteredLeads.length / limit),
    currentPage: parseInt(page),
    total: filteredLeads.length
  });
});

app.get('/api/leads/:id', (req, res) => {
  const lead = leads.find(l => l._id === req.params.id && l.isActive);
  if (!lead) {
    return res.status(404).json({ message: 'Lead not found' });
  }
  res.json(lead);
});

app.post('/api/leads', (req, res) => {
  try {
    const newLead = {
      _id: (leads.length + 1).toString(),
      leadId: `LEAD-${String(leads.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date()
    };
    leads.push(newLead);
    res.status(201).json({ message: 'Lead created successfully', lead: newLead });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create lead', error: error.message });
  }
});

app.put('/api/leads/:id', (req, res) => {
  try {
    const leadIndex = leads.findIndex(lead => lead._id === req.params.id);
    if (leadIndex === -1) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    leads[leadIndex] = { ...leads[leadIndex], ...req.body };
    res.json({ message: 'Lead updated successfully', lead: leads[leadIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lead', error: error.message });
  }
});

app.delete('/api/leads/:id', (req, res) => {
  try {
    const leadIndex = leads.findIndex(lead => lead._id === req.params.id);
    if (leadIndex === -1) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    leads[leadIndex].isActive = false;
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete lead', error: error.message });
  }
});

// Mock warranty data
let warranties = [
  {
    _id: '1',
    warrantyId: 'WAR-001',
    clientId: '1',
    clientName: 'John Smith',
    projectId: '1',
    projectName: 'Modern Apartment Design',
    warrantyType: 'Standard',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2025-01-01T00:00:00Z',
    status: 'Active',
    description: '1-year warranty on all furniture and fixtures',
    notes: 'Standard warranty coverage',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    _id: '2',
    warrantyId: 'WAR-002',
    clientId: '2',
    clientName: 'Sarah Johnson',
    projectId: '2',
    projectName: 'Office Interior Design',
    warrantyType: 'Extended',
    startDate: '2023-12-01T00:00:00Z',
    endDate: '2025-12-01T00:00:00Z',
    status: 'Active',
    description: '2-year extended warranty on all installations',
    notes: 'Premium warranty package',
    createdAt: '2023-12-01T00:00:00Z',
    isActive: true
  },
  {
    _id: '3',
    warrantyId: 'WAR-003',
    clientId: '3',
    clientName: 'Rajesh Kumar',
    projectId: '3',
    projectName: 'Luxury Villa Interior',
    warrantyType: 'Premium',
    startDate: '2023-06-01T00:00:00Z',
    endDate: '2024-06-01T00:00:00Z',
    status: 'Expired',
    description: '1-year premium warranty on all luxury finishes',
    notes: 'Warranty expired, client notified',
    createdAt: '2023-06-01T00:00:00Z',
    isActive: true
  }
];

// Mock anniversary data
let anniversaries = [
  {
    _id: '1',
    anniversaryId: 'ANN-001',
    clientId: '1',
    clientName: 'John Smith',
    projectId: '1',
    projectName: 'Modern Apartment Design',
    anniversaryType: '1 Year Anniversary',
    anniversaryDate: '2025-01-01T00:00:00Z',
    status: 'Scheduled',
    message: 'Happy 1-year anniversary! Thank you for choosing our services.',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  },
  {
    _id: '2',
    anniversaryId: 'ANN-002',
    clientId: '2',
    clientName: 'Sarah Johnson',
    projectId: '2',
    projectName: 'Office Interior Design',
    anniversaryType: 'Project Completion',
    anniversaryDate: '2024-12-01T00:00:00Z',
    status: 'Scheduled',
    message: 'Congratulations on your beautiful new office space!',
    createdAt: '2023-12-01T00:00:00Z',
    isActive: true
  },
  {
    _id: '3',
    anniversaryId: 'ANN-003',
    clientId: '3',
    clientName: 'Rajesh Kumar',
    projectId: '3',
    projectName: 'Luxury Villa Interior',
    anniversaryType: '1 Year Anniversary',
    anniversaryDate: '2024-06-01T00:00:00Z',
    status: 'Sent',
    message: 'Happy 1-year anniversary! We hope you\'re enjoying your beautiful home.',
    sentDate: '2024-06-01T00:00:00Z',
    createdAt: '2023-06-01T00:00:00Z',
    isActive: true
  }
];

// Deals Routes
app.get('/api/deals', (req, res) => {
  const { page = 1, limit = 10, stage, status } = req.query;
  
  let filteredDeals = deals.filter(d => d.isActive);
  
  if (stage) {
    filteredDeals = filteredDeals.filter(d => d.currentStage === stage);
  }
  
  if (status) {
    filteredDeals = filteredDeals.filter(d => d.projectStatus === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

  // Populate client references
  const dealsWithClients = paginatedDeals.map(deal => ({
    ...deal,
    clientId: clients.find(c => c._id === deal.clientId) || { name: 'Unknown Client' }
  }));

  res.json({
    deals: dealsWithClients,
    totalPages: Math.ceil(filteredDeals.length / limit),
    currentPage: parseInt(page),
    total: filteredDeals.length
  });
});

app.get('/api/deals/stats/pipeline', (req, res) => {
  const activeDeals = deals.filter(d => d.isActive && d.projectStatus === 'Active');
  const totalPipelineValue = activeDeals.reduce((sum, deal) => sum + deal.totalProjectValue, 0);
  
  const stageStats = activeDeals.reduce((acc, deal) => {
    acc[deal.currentStage] = (acc[deal.currentStage] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalPipelineValue,
    stageStats
  });
});

// Payments Routes
app.get('/api/payments', (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  
  let filteredPayments = payments.filter(p => p.isActive);
  
  if (status) {
    filteredPayments = filteredPayments.filter(p => p.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  // Populate references
  const paymentsWithRefs = paginatedPayments.map(payment => ({
    ...payment,
    clientId: clients.find(c => c._id === payment.clientId) || { name: 'Unknown Client' },
    dealId: deals.find(d => d._id === payment.dealId) || { projectName: 'Unknown Project' },
    daysOverdue: payment.status === 'Overdue' ? Math.floor((new Date() - new Date(payment.dueDate)) / (1000 * 60 * 60 * 24)) : 0
  }));

  res.json({
    payments: paymentsWithRefs,
    totalPages: Math.ceil(filteredPayments.length / limit),
    currentPage: parseInt(page),
    total: filteredPayments.length
  });
});

app.get('/api/payments/stats/overview', (req, res) => {
  const totalPayments = payments.filter(p => p.isActive).length;
  const collectedPayments = payments.filter(p => p.isActive && p.status === 'Collected').length;
  const overduePayments = payments.filter(p => p.isActive && p.status === 'Overdue').length;
  
  const totalAmount = payments
    .filter(p => p.isActive && p.status === 'Collected')
    .reduce((sum, p) => sum + p.amount, 0);

  const overdueAmount = payments
    .filter(p => p.isActive && p.status === 'Overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({
    totalPayments,
    collectedPayments,
    overduePayments,
    totalAmount,
    overdueAmount
  });
});

// Documents Routes
app.get('/api/documents', (req, res) => {
  const { page = 1, limit = 10, type } = req.query;
  
  let filteredDocuments = documents.filter(d => d.isActive);
  
  if (type) {
    filteredDocuments = filteredDocuments.filter(d => d.documentType === type);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Populate references
  const documentsWithRefs = paginatedDocuments.map(doc => ({
    ...doc,
    clientId: clients.find(c => c._id === doc.clientId) || { name: 'Unknown Client' },
    dealId: deals.find(d => d._id === doc.dealId) || { projectName: 'Unknown Project' },
    uploadedBy: users.find(u => u._id === doc.uploadedBy) || { name: 'Unknown User' }
  }));

  res.json({
    documents: documentsWithRefs,
    totalPages: Math.ceil(filteredDocuments.length / limit),
    currentPage: parseInt(page),
    total: filteredDocuments.length
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: 'Mock (In-Memory)'
  });
});

// CRUD endpoints for testing
app.post('/api/deals', (req, res) => {
  try {
    const newDeal = {
      _id: (deals.length + 1).toString(),
      dealId: `DEAL-${String(deals.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date()
    };
    deals.push(newDeal);
    res.status(201).json({ message: 'Deal created successfully', deal: newDeal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create deal', error: error.message });
  }
});

app.put('/api/deals/:id', (req, res) => {
  try {
    const dealIndex = deals.findIndex(deal => deal._id === req.params.id);
    if (dealIndex === -1) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    deals[dealIndex] = { ...deals[dealIndex], ...req.body };
    res.json({ message: 'Deal updated successfully', deal: deals[dealIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update deal', error: error.message });
  }
});

app.post('/api/clients', (req, res) => {
  try {
    const newClient = {
      _id: (clients.length + 1).toString(),
      clientId: `CLI-${String(clients.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date()
    };
    clients.push(newClient);
    res.status(201).json({ message: 'Client created successfully', client: newClient });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create client', error: error.message });
  }
});

app.put('/api/clients/:id', (req, res) => {
  try {
    const clientIndex = clients.findIndex(client => client._id === req.params.id);
    if (clientIndex === -1) {
      return res.status(404).json({ message: 'Client not found' });
    }
    clients[clientIndex] = { ...clients[clientIndex], ...req.body };
    res.json({ message: 'Client updated successfully', client: clients[clientIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update client', error: error.message });
  }
});

app.post('/api/payments', (req, res) => {
  try {
    const newPayment = {
      _id: (payments.length + 1).toString(),
      paymentId: `PAY-${String(payments.length + 1).padStart(3, '0')}`,
      invoiceNumber: `INV-2024-${String(payments.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date()
    };
    payments.push(newPayment);
    res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
});

// Warranty Routes
app.get('/api/warranties', (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  
  let filteredWarranties = warranties.filter(w => w.isActive);
  
  if (search) {
    filteredWarranties = filteredWarranties.filter(w => 
      w.clientName.toLowerCase().includes(search.toLowerCase()) ||
      w.projectName.toLowerCase().includes(search.toLowerCase()) ||
      w.warrantyId.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (status) {
    filteredWarranties = filteredWarranties.filter(w => w.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedWarranties = filteredWarranties.slice(startIndex, endIndex);

  res.json({
    warranties: paginatedWarranties,
    totalPages: Math.ceil(filteredWarranties.length / limit),
    currentPage: parseInt(page),
    total: filteredWarranties.length
  });
});

app.post('/api/warranties', (req, res) => {
  try {
    const newWarranty = {
      _id: (warranties.length + 1).toString(),
      warrantyId: `WAR-${String(warranties.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date()
    };
    warranties.push(newWarranty);
    res.status(201).json({ message: 'Warranty created successfully', warranty: newWarranty });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create warranty', error: error.message });
  }
});

app.put('/api/warranties/:id', (req, res) => {
  try {
    const warrantyIndex = warranties.findIndex(w => w._id === req.params.id);
    if (warrantyIndex === -1) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    warranties[warrantyIndex] = { ...warranties[warrantyIndex], ...req.body };
    res.json({ message: 'Warranty updated successfully', warranty: warranties[warrantyIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update warranty', error: error.message });
  }
});

app.delete('/api/warranties/:id', (req, res) => {
  try {
    const warrantyIndex = warranties.findIndex(w => w._id === req.params.id);
    if (warrantyIndex === -1) {
      return res.status(404).json({ message: 'Warranty not found' });
    }
    warranties[warrantyIndex].isActive = false;
    res.json({ message: 'Warranty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete warranty', error: error.message });
  }
});

// Anniversary Routes
app.get('/api/anniversaries', (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  
  let filteredAnniversaries = anniversaries.filter(a => a.isActive);
  
  if (search) {
    filteredAnniversaries = filteredAnniversaries.filter(a => 
      a.clientName.toLowerCase().includes(search.toLowerCase()) ||
      a.projectName.toLowerCase().includes(search.toLowerCase()) ||
      a.anniversaryId.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (status) {
    filteredAnniversaries = filteredAnniversaries.filter(a => a.status === status);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedAnniversaries = filteredAnniversaries.slice(startIndex, endIndex);

  res.json({
    anniversaries: paginatedAnniversaries,
    totalPages: Math.ceil(filteredAnniversaries.length / limit),
    currentPage: parseInt(page),
    total: filteredAnniversaries.length
  });
});

app.post('/api/anniversaries', (req, res) => {
  try {
    const newAnniversary = {
      _id: (anniversaries.length + 1).toString(),
      anniversaryId: `ANN-${String(anniversaries.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date()
    };
    anniversaries.push(newAnniversary);
    res.status(201).json({ message: 'Anniversary created successfully', anniversary: newAnniversary });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create anniversary', error: error.message });
  }
});

app.post('/api/anniversaries/:id/send', (req, res) => {
  try {
    const anniversaryIndex = anniversaries.findIndex(a => a._id === req.params.id);
    if (anniversaryIndex === -1) {
      return res.status(404).json({ message: 'Anniversary not found' });
    }
    anniversaries[anniversaryIndex] = { 
      ...anniversaries[anniversaryIndex], 
      status: 'Sent',
      sentDate: new Date()
    };
    res.json({ message: 'Anniversary message sent successfully', anniversary: anniversaries[anniversaryIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send anniversary message', error: error.message });
  }
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
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`\n🔑 Demo Login Credentials:`);
  console.log(`   Email: admin@designpipeline.com`);
  console.log(`   Password: admin123`);
  console.log(`\n💾 Using Mock Database (In-Memory)`);
  console.log(`   - All data is stored in memory`);
  console.log(`   - Data will be lost when server restarts`);
  console.log(`   - Perfect for testing and development`);
});

module.exports = app;
