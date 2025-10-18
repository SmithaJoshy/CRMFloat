const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Get industry package from environment
// Design Pipeline CRM - Original Configuration
const INDUSTRY_PACKAGE = 'interior-design';
console.log(`🎯 Loading ${INDUSTRY_PACKAGE} industry package`);

// Industry-specific mock data generator
const getIndustryData = (industryPackage) => {
  if (industryPackage === 'interior-design') {
    // Interior Design specific data (existing GHS data)
    return {
      clients: [
        {
          _id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          company: 'Smith Residence',
          address: '123 Main St, San Francisco, CA 94102',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          tags: ['VIP', 'Repeat Customer'],
          notes: 'Prefers modern design style, budget: $150K',
          isActive: true,
          // Add missing fields that frontend expects
          clientId: 'CLI-001',
          targetBudget: 150000,
          totalValue: 150000,
          leadSource: 'Website',
          stylePreferences: ['Modern', 'Minimalist']
        },
        {
          _id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 234-5678',
          company: 'Johnson Family',
          address: '456 Oak Ave, Los Angeles, CA 90210',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20'),
          tags: ['New Lead'],
          notes: 'Interested in kitchen renovation, timeline: 3 months',
          isActive: true,
          // Add missing fields that frontend expects
          clientId: 'CLI-002',
          targetBudget: 75000,
          totalValue: 75000,
          leadSource: 'Referral',
          stylePreferences: ['Contemporary', 'Family-friendly']
        },
        {
          _id: '3',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '+1 (555) 345-6789',
          company: 'TechStart Inc',
          address: '789 Business Blvd, San Francisco, CA 94105',
          createdAt: new Date('2024-01-25'),
          updatedAt: new Date('2024-01-25'),
          tags: ['VIP', 'Commercial'],
          notes: 'Tech startup looking for modern office design',
          isActive: true,
          clientId: 'CLI-003',
          targetBudget: 200000,
          totalValue: 200000,
          leadSource: 'Website',
          stylePreferences: ['Professional', 'Modern']
        },
        {
          _id: '4',
          name: 'Emma Wilson',
          email: 'emma.wilson@email.com',
          phone: '+1 (555) 456-7890',
          company: 'Wilson Estate',
          address: '1000 Hillside Dr, Beverly Hills, CA 90210',
          createdAt: new Date('2023-12-01'),
          updatedAt: new Date('2024-01-30'),
          tags: ['VIP', 'Luxury'],
          notes: 'High-end luxury villa interior design',
          isActive: true,
          clientId: 'CLI-004',
          targetBudget: 500000,
          totalValue: 500000,
          leadSource: 'Referral',
          stylePreferences: ['Luxury', 'Elegant']
        },
        {
          _id: '5',
          name: 'Carlos Rodriguez',
          email: 'carlos.rodriguez@email.com',
          phone: '+1 (555) 567-8901',
          company: 'Rodriguez Restaurant Group',
          address: '555 Restaurant Row, San Francisco, CA 94102',
          createdAt: new Date('2023-09-15'),
          updatedAt: new Date('2024-01-28'),
          tags: ['Commercial', 'Repeat Customer'],
          notes: 'Restaurant chain owner, multiple locations',
          isActive: true,
          clientId: 'CLI-005',
          targetBudget: 300000,
          totalValue: 300000,
          leadSource: 'Referral',
          stylePreferences: ['Contemporary', 'Functional']
        }
      ],
      deals: [
        {
          _id: '1',
          dealId: 'DEAL-001',
          projectName: 'Modern Apartment Design',
          clientId: '1',
          clientName: 'John Smith',
          currentStage: 'Design Development',
          projectStatus: 'Active',
          projectValue: 125000,
          totalProjectValue: 125000,
          expectedStartDate: new Date('2024-02-01'),
          expectedCompletionDate: new Date('2024-05-01'),
          assignedDesigner: 'Alice Designer',
          priorityLevel: 'High',
          propertyType: 'Residential',
          dealType: 'Interior Design',
          projectSize: 1200,
          designStyle: 'Modern',
          roomsIncluded: ['Living Room', 'Kitchen', 'Bedroom'],
          siteAddress: '123 Main St, San Francisco, CA 94102',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          notes: 'Client prefers minimalist design with natural materials',
          isActive: true,
          notesHistory: [
            {
              note: 'Initial consultation completed - client very interested',
              author: 'Alice Designer',
              timestamp: new Date('2024-01-15T10:00:00Z')
            }
          ]
        },
        {
          _id: '2',
          dealId: 'DEAL-002',
          projectName: 'Kitchen Renovation',
          clientId: '2',
          clientName: 'Sarah Johnson',
          currentStage: 'Lead Generation',
          projectStatus: 'Active',
          projectValue: 75000,
          totalProjectValue: 75000,
          expectedStartDate: new Date('2024-03-01'),
          expectedCompletionDate: new Date('2024-06-01'),
          assignedDesigner: 'Bob Architect',
          priorityLevel: 'Medium',
          propertyType: 'Residential',
          dealType: 'Interior Design',
          projectSize: 800,
          designStyle: 'Contemporary',
          roomsIncluded: ['Kitchen', 'Dining Room'],
          siteAddress: '456 Oak Ave, Los Angeles, CA 90210',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20'),
          notes: 'Kitchen renovation with modern appliances',
          isActive: true,
          notesHistory: []
        },
        {
          _id: '3',
          dealId: 'DEAL-003',
          projectName: 'Office Space Design',
          clientId: '3',
          clientName: 'Mike Chen',
          currentStage: 'Consultation',
          projectStatus: 'Active',
          projectValue: 200000,
          totalProjectValue: 200000,
          expectedStartDate: new Date('2024-04-01'),
          expectedCompletionDate: new Date('2024-08-01'),
          assignedDesigner: 'Alice Designer',
          priorityLevel: 'High',
          propertyType: 'Commercial',
          dealType: 'Interior Design',
          projectSize: 2500,
          designStyle: 'Professional',
          roomsIncluded: ['Reception', 'Conference Room', 'Open Office'],
          siteAddress: '789 Business Blvd, San Francisco, CA 94105',
          createdAt: new Date('2024-01-25'),
          updatedAt: new Date('2024-01-25'),
          notes: 'Modern office space for tech startup',
          isActive: true,
          notesHistory: []
        },
        {
          _id: '4',
          dealId: 'DEAL-004',
          projectName: 'Luxury Villa Interior',
          clientId: '4',
          clientName: 'Emma Wilson',
          currentStage: 'Project Execution',
          projectStatus: 'Active',
          projectValue: 500000,
          totalProjectValue: 500000,
          expectedStartDate: new Date('2024-01-01'),
          expectedCompletionDate: new Date('2024-12-01'),
          assignedDesigner: 'Bob Architect',
          priorityLevel: 'High',
          propertyType: 'Residential',
          dealType: 'Interior Design',
          projectSize: 5000,
          designStyle: 'Luxury',
          roomsIncluded: ['Living Room', 'Kitchen', 'Master Bedroom', 'Guest Rooms', 'Home Office'],
          siteAddress: '1000 Hillside Dr, Beverly Hills, CA 90210',
          createdAt: new Date('2023-12-01'),
          updatedAt: new Date('2024-01-30'),
          notes: 'High-end luxury villa with premium finishes',
          isActive: true,
          notesHistory: []
        },
        {
          _id: '5',
          dealId: 'DEAL-005',
          projectName: 'Restaurant Design',
          clientId: '5',
          clientName: 'Carlos Rodriguez',
          currentStage: 'Handover',
          projectStatus: 'Active',
          projectValue: 300000,
          totalProjectValue: 300000,
          expectedStartDate: new Date('2023-10-01'),
          expectedCompletionDate: new Date('2024-02-01'),
          assignedDesigner: 'Alice Designer',
          priorityLevel: 'Medium',
          propertyType: 'Commercial',
          dealType: 'Interior Design',
          projectSize: 3000,
          designStyle: 'Contemporary',
          roomsIncluded: ['Dining Area', 'Kitchen', 'Bar', 'Restrooms'],
          siteAddress: '555 Restaurant Row, San Francisco, CA 94102',
          createdAt: new Date('2023-09-15'),
          updatedAt: new Date('2024-01-28'),
          notes: 'Modern restaurant with open kitchen concept',
          isActive: true,
          notesHistory: []
        }
      ],
      leads: [
        {
          _id: '1',
          leadId: 'LEAD-001',
          name: 'John Smith',
          email: 'john.smith@email.com',
          phone: '+1 (555) 123-4567',
          company: 'Smith Residence',
          leadSource: 'Website',
          leadStatus: 'New Lead',
          budget: 150000,
          projectType: 'Residential',
          requirements: 'Modern apartment design with contemporary furniture',
          assignedTo: 'Alice Designer',
          priority: 'High',
          followUpDate: '2024-01-15',
          notes: 'Interested in modern design style',
          createdAt: '2024-01-10T10:00:00Z',
          isActive: true
        }
      ],
      designers: [
        {
          _id: '1',
          name: 'Alice Designer',
          email: 'alice@designstudio.com',
          phone: '+1 (555) 100-0001',
          role: 'Senior Designer',
          specialization: 'Modern Design',
          specializations: ['Modern Design', 'Minimalist', 'Contemporary'],
          skills: ['Space Planning', '3D Visualization', 'Color Theory', 'Material Selection'],
          experience: '5 years',
          isActive: true,
          availability: 'Available'
        },
        {
          _id: '2',
          name: 'Bob Architect',
          email: 'bob@designstudio.com',
          phone: '+1 (555) 100-0002',
          role: 'Lead Architect',
          specialization: 'Commercial Design',
          specializations: ['Commercial Design', 'Office Spaces', 'Retail'],
          skills: ['Architectural Planning', 'Building Codes', 'Project Management', 'Client Relations'],
          experience: '8 years',
          isActive: true,
          availability: 'Available'
        },
        {
          _id: '3',
          name: 'Carol Interior',
          email: 'carol@designstudio.com',
          phone: '+1 (555) 100-0003',
          role: 'Interior Designer',
          specialization: 'Luxury Residential',
          specializations: ['Luxury Residential', 'High-end Finishes', 'Custom Furniture'],
          skills: ['Luxury Design', 'Custom Millwork', 'Furniture Design', 'Lighting Design'],
          experience: '6 years',
          isActive: true,
          availability: 'Busy'
        }
      ],
      invoices: [],
      payments: [],
      documents: []
    };
  } else {
    // Generic retail/small business data
    return {
      clients: [
        {
          _id: '1',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 123-4567',
          company: 'Rodriguez & Associates',
          address: '123 Business Ave, Austin, TX 78701',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          tags: ['VIP', 'Repeat Customer'],
          notes: 'Marketing consultant, interested in CRM solution',
          isActive: true,
          // Add missing fields that frontend expects
          clientId: 'CLI-001',
          targetBudget: 5000,
          totalValue: 5000,
          leadSource: 'Website',
          stylePreferences: ['Modern', 'Professional']
        },
        {
          _id: '2',
          name: 'David Kim',
          email: 'david.kim@email.com',
          phone: '+1 (555) 234-5678',
          company: 'Kim Electronics',
          address: '456 Retail St, Portland, OR 97201',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20'),
          tags: ['New Lead'],
          notes: 'Electronics retailer, needs customer management system',
          isActive: true,
          // Add missing fields that frontend expects
          clientId: 'CLI-002',
          targetBudget: 8000,
          totalValue: 8000,
          leadSource: 'Referral',
          stylePreferences: ['Contemporary', 'Functional']
        },
        {
          _id: '3',
          name: 'Lisa Thompson',
          email: 'lisa.thompson@email.com',
          phone: '+1 (555) 345-6789',
          company: 'Thompson Consulting',
          address: '789 Service Rd, Denver, CO 80201',
          createdAt: new Date('2024-01-25'),
          updatedAt: new Date('2024-01-25'),
          tags: ['Hot Lead'],
          notes: 'Business consultant, evaluating CRM options',
          isActive: true,
          // Add missing fields that frontend expects
          clientId: 'CLI-003',
          targetBudget: 12000,
          totalValue: 12000,
          leadSource: 'Google Ads',
          stylePreferences: ['Professional', 'Clean']
        }
      ],
      deals: [
        {
          _id: '1',
          dealId: 'DEAL-001',
          projectName: 'CRM Implementation',
          clientId: '1',
          clientName: 'Emily Rodriguez',
          currentStage: 'In Progress',
          projectStatus: 'Active',
          projectValue: 5000,
          totalProjectValue: 5000,
          expectedStartDate: new Date('2024-02-01'),
          expectedCompletionDate: new Date('2024-03-01'),
          assignedDesigner: 'Alex Sales',
          priorityLevel: 'High',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          notes: 'Client needs basic CRM setup for small team',
          isActive: true,
          // Add missing fields that frontend expects
          projectSize: 100,
          propertyType: 'Office',
          dealType: 'Software Implementation',
          designStyle: 'Modern',
          roomsIncluded: ['Office Space'],
          siteAddress: '123 Business Ave, Austin, TX 78701',
          notesHistory: [
            {
              note: 'Initial demo completed - client very interested',
              author: 'Alex Sales',
              timestamp: new Date('2024-01-15T10:00:00Z')
            },
            {
              note: 'Follow-up call scheduled for next week',
              author: 'Alex Sales',
              timestamp: new Date('2024-01-16T14:30:00Z')
            }
          ]
        },
        {
          _id: '2',
          dealId: 'DEAL-002',
          projectName: 'Customer Management System',
          clientId: '2',
          clientName: 'David Kim',
          currentStage: 'ToDo',
          projectStatus: 'Active',
          projectValue: 8000,
          totalProjectValue: 8000,
          expectedStartDate: new Date('2024-02-15'),
          expectedCompletionDate: new Date('2024-04-15'),
          assignedDesigner: 'Sarah Sales',
          priorityLevel: 'Medium',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-01-20'),
          notes: 'Electronics retailer needs customer tracking system',
          isActive: true,
          // Add missing fields that frontend expects
          projectSize: 150,
          propertyType: 'Retail',
          dealType: 'Software Implementation',
          designStyle: 'Contemporary',
          roomsIncluded: ['Retail Space'],
          siteAddress: '456 Retail St, Portland, OR 97201',
          notesHistory: []
        },
        {
          _id: '3',
          dealId: 'DEAL-003',
          projectName: 'Business CRM Setup',
          clientId: '3',
          clientName: 'Lisa Thompson',
          currentStage: 'Done',
          projectStatus: 'Active',
          projectValue: 12000,
          totalProjectValue: 12000,
          expectedStartDate: new Date('2024-03-01'),
          expectedCompletionDate: new Date('2024-05-01'),
          assignedDesigner: 'Mike Sales',
          priorityLevel: 'High',
          createdAt: new Date('2024-01-25'),
          updatedAt: new Date('2024-01-25'),
          notes: 'Consulting firm needs comprehensive CRM solution',
          isActive: true,
          // Add missing fields that frontend expects
          projectSize: 200,
          propertyType: 'Office',
          dealType: 'Software Implementation',
          designStyle: 'Professional',
          roomsIncluded: ['Consulting Office'],
          siteAddress: '789 Service Rd, Denver, CO 80201',
          notesHistory: []
        }
      ],
      leads: [
        {
          _id: '1',
          leadId: 'LEAD-001',
          name: 'Emily Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 123-4567',
          company: 'Rodriguez & Associates',
          leadSource: 'Website',
          leadStatus: 'New Lead',
          budget: 5000,
          projectType: 'Software',
          requirements: 'CRM implementation for small marketing team',
          assignedTo: 'Alex Sales',
          priority: 'High',
          followUpDate: '2024-01-15',
          notes: 'Marketing consultant, interested in CRM solution',
          createdAt: '2024-01-10T10:00:00Z',
          isActive: true
        },
        {
          _id: '2',
          leadId: 'LEAD-002',
          name: 'David Kim',
          email: 'david.kim@email.com',
          phone: '+1 (555) 234-5678',
          company: 'Kim Electronics',
          leadSource: 'Referral',
          leadStatus: 'Contacted',
          budget: 8000,
          projectType: 'Software',
          requirements: 'Customer management system for electronics retailer',
          assignedTo: 'Sarah Sales',
          priority: 'Medium',
          followUpDate: '2024-01-20',
          notes: 'Electronics retailer, needs customer tracking system',
          createdAt: '2024-01-08T14:30:00Z',
          isActive: true
        },
        {
          _id: '3',
          leadId: 'LEAD-003',
          name: 'Lisa Thompson',
          email: 'lisa.thompson@email.com',
          phone: '+1 (555) 345-6789',
          company: 'Thompson Consulting',
          leadSource: 'Google Ads',
          leadStatus: 'Qualified',
          budget: 12000,
          projectType: 'Software',
          requirements: 'Comprehensive CRM solution for consulting firm',
          assignedTo: 'Mike Sales',
          priority: 'High',
          followUpDate: '2024-01-25',
          notes: 'Business consultant, evaluating CRM options',
          createdAt: '2024-01-05T09:15:00Z',
          isActive: true
        }
      ],
      designers: [
        {
          _id: '1',
          name: 'Alex Sales',
          email: 'alex@crmfloat.com',
          phone: '+1 (555) 200-0001',
          role: 'Sales Manager',
          specialization: 'CRM Implementation',
          experience: '3 years',
          isActive: true,
          availability: 'Available'
        },
        {
          _id: '2',
          name: 'Sarah Sales',
          email: 'sarah@crmfloat.com',
          phone: '+1 (555) 200-0002',
          role: 'Sales Representative',
          specialization: 'Customer Management',
          experience: '2 years',
          isActive: true,
          availability: 'Available'
        },
        {
          _id: '3',
          name: 'Mike Sales',
          email: 'mike@crmfloat.com',
          phone: '+1 (555) 200-0003',
          role: 'Senior Sales',
          specialization: 'Business Solutions',
          experience: '4 years',
          isActive: true,
          availability: 'Available'
        }
      ],
      invoices: [],
      payments: [],
      documents: []
    };
  }
};

// Load industry-specific data
const industryData = getIndustryData(INDUSTRY_PACKAGE);
console.log(`📊 Loaded ${industryData.clients.length} clients, ${industryData.deals.length} deals, and ${industryData.leads.length} leads for ${INDUSTRY_PACKAGE} package`);

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

// Rate limiting - Disabled for development (mock server)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // limit each IP to 1000 requests per windowMs
//   skipSuccessfulRequests: true,
//   skipFailedRequests: false
// });
// app.use(limiter);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Health check endpoint for deployment
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Design Pipeline CRM Server is running',
    product: 'Design Pipeline CRM',
    tagline: 'Interior Design Project Management',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Workflow stages endpoint
app.get('/api/workflow-stages', (req, res) => {
  const workflowStages = [
    {
      id: 'lead-generation',
      name: 'Lead Generation',
      description: 'Initial lead capture and qualification',
      color: '#2196F3',
      icon: 'person_add'
    },
    {
      id: 'initial-engagement',
      name: 'Initial Engagement',
      description: 'First contact with potential client',
      color: '#00BCD4',
      icon: 'handshake'
    },
    {
      id: 'scheduling-visit',
      name: 'Scheduling Visit',
      description: 'Site visit appointment scheduled',
      color: '#4CAF50',
      icon: 'schedule'
    },
    {
      id: 'consultation',
      name: 'Consultation',
      description: 'Site visit completed, requirements gathered',
      color: '#8BC34A',
      icon: 'room_preferences'
    },
    {
      id: 'design-brief',
      name: 'Design Brief',
      description: 'Design proposal and quotation prepared',
      color: '#CDDC39',
      icon: 'description'
    },
    {
      id: 'design-development',
      name: 'Design Development',
      description: 'Design concepts and mood boards',
      color: '#FFC107',
      icon: 'palette'
    },
    {
      id: 'detailed-drawings',
      name: 'Detailed Drawings',
      description: 'Technical drawings and vendor selection',
      color: '#FF9800',
      icon: 'architecture'
    },
    {
      id: 'project-execution',
      name: 'Project Execution',
      description: 'Active construction/implementation',
      color: '#FF5722',
      icon: 'construction'
    },
    {
      id: 'handover',
      name: 'Handover',
      description: 'Project completion and client handover',
      color: '#9C27B0',
      icon: 'home'
    },
    {
      id: 'project-closure',
      name: 'Project Closure',
      description: 'Final sign-off and documentation',
      color: '#4CAF50',
      icon: 'check_circle'
    },
    {
      id: 'warranty-period',
      name: 'Warranty Period',
      description: 'Post-completion warranty support',
      color: '#2196F3',
      icon: 'verified_user'
    }
  ];
  
  res.json({ stages: workflowStages });
});

// Mock Database (In-Memory) - Enhanced Structure
let users = [
  {
    _id: '1',
    name: 'Admin User',
    email: 'admin@crmfloat.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
    role: 'Founder/Executive',
    isActive: true,
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

// Enhanced data structure with proper relationships
// Use industry-specific data instead of static data
let leads = industryData.leads.length > 0 ? industryData.leads : [
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
    name: 'Deepika Singh',
    email: 'deepika.singh@email.com',
    phone: '+91-9876543213',
    company: 'Singh Constructions',
    leadSource: 'Social Media',
    leadStatus: 'New Lead',
    budget: 300000,
    projectType: 'Residential',
    requirements: 'Budget-friendly 2BHK design with smart storage solutions',
    assignedTo: 'Mike Chen',
    priority: 'Medium',
    followUpDate: '2024-01-16',
    notes: 'First-time home buyer, needs guidance on design options',
    createdAt: '2024-01-12T11:20:00Z',
    isActive: true
  },
  {
    _id: '5',
    leadId: 'LEAD-005',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@email.com',
    phone: '+91-9876543214',
    company: 'Mehta Group',
    leadSource: 'Trade Show',
    leadStatus: 'Converted',
    budget: 2000000,
    projectType: 'Luxury',
    requirements: 'Penthouse design with panoramic city views',
    assignedTo: 'Sarah Johnson',
    priority: 'High',
    followUpDate: '2024-01-18',
    notes: 'Converted to project - Luxury Penthouse Design',
    createdAt: '2024-01-03T16:45:00Z',
    isActive: true
  },
  {
    _id: '6',
    leadId: 'LEAD-006',
    name: 'Anita Reddy',
    email: 'anita.reddy@email.com',
    phone: '+91-9876543215',
    company: 'Reddy Healthcare',
    leadSource: 'Referral',
    leadStatus: 'Contacted',
    budget: 800000,
    projectType: 'Commercial',
    requirements: 'Medical clinic interior with patient-friendly design',
    assignedTo: 'Mike Chen',
    priority: 'Medium',
    followUpDate: '2024-01-20',
    notes: 'Healthcare professional, needs specialized medical interior design',
    createdAt: '2024-01-11T13:30:00Z',
    isActive: true
  }
];

// Mock Designers Data
// Use industry-specific data instead of static data
let designers = industryData.designers.length > 0 ? industryData.designers : [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@crmfloat.com',
    phone: '+91-9876543211',
    role: 'Senior Interior Designer',
    department: 'Design',
    skills: ['Residential Design', 'Commercial Spaces', '3D Visualization'],
    availability: 'Available',
    experience: '8 years',
    specializations: ['Modern', 'Contemporary', 'Minimalist'],
    isActive: true,
    smsEnabled: true,
    emailEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@crmfloat.com',
    phone: '+91-9876543212',
    role: 'Junior Interior Designer',
    department: 'Design',
    skills: ['Space Planning', 'Material Selection', 'Client Presentations'],
    availability: 'Available',
    experience: '3 years',
    specializations: ['Traditional', 'Eclectic'],
    isActive: true,
    smsEnabled: true,
    emailEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Priya Sharma',
    email: 'priya@crmfloat.com',
    phone: '+91-9876543213',
    role: 'Design Lead',
    department: 'Design',
    skills: ['Project Management', 'Team Leadership', 'Client Relations'],
    availability: 'Busy',
    experience: '10 years',
    specializations: ['Luxury Residential', 'Hospitality Design'],
    isActive: true,
    smsEnabled: false,
    emailEnabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Use industry-specific data instead of static data
let clients = industryData.clients.length > 0 ? industryData.clients : [
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
    stylePreferences: ['Contemporary', 'Scandinavian'],
    targetBudget: 750000,
    leadSource: 'Referral',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '3',
    clientId: 'CLI-003',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    phone: '+91-9876543212',
    stylePreferences: ['Traditional', 'Luxury'],
    targetBudget: 1200000,
    leadSource: 'Google Ads',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '4',
    clientId: 'CLI-004',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    phone: '+91-9876543213',
    stylePreferences: ['Contemporary', 'Professional'],
    targetBudget: 800000,
    leadSource: 'Referral',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '5',
    clientId: 'CLI-005',
    name: 'Vikram Mehta',
    email: 'vikram.mehta@email.com',
    phone: '+91-9876543214',
    stylePreferences: ['Luxury', 'Modern'],
    targetBudget: 2000000,
    leadSource: 'Trade Show',
    isActive: true,
    createdAt: new Date()
  },
  {
    _id: '6',
    clientId: 'CLI-006',
    name: 'Deepika Singh',
    email: 'deepika.singh@email.com',
    phone: '+91-9876543215',
    stylePreferences: ['Modern', 'Industrial'],
    targetBudget: 300000,
    leadSource: 'Social Media',
    isActive: true,
    createdAt: new Date()
  }
];

// Enhanced invoice data with multiple invoices per project
// Use industry-specific data instead of static data
let invoices = industryData.invoices.length > 0 ? industryData.invoices : [
  {
    _id: "INV-001",
    invoiceNumber: "INV-2024-001",
    projectId: "1",
    dealId: "DEAL-001",
    clientId: "1",
    clientName: "John Smith",
    invoiceStage: "Design Fee",
    amount: 35000,
    dueDate: "2024-02-15",
    paymentStatus: "Sent",
    paymentMethod: null,
    paymentDate: null,
    reminderCount: 0,
    lastReminderDate: null,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
    isActive: true
  },
  {
    _id: "INV-002", 
    invoiceNumber: "INV-2024-002",
    projectId: "1",
    dealId: "DEAL-001",
    clientId: "1",
    clientName: "John Smith",
    invoiceStage: "50% Advance",
    amount: 225000,
    dueDate: "2024-03-15",
    paymentStatus: "Collected",
    paymentMethod: "Bank Transfer",
    paymentDate: "2024-03-10",
    reminderCount: 0,
    lastReminderDate: null,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
    isActive: true
  },
  {
    _id: "INV-003",
    invoiceNumber: "INV-2024-003", 
    projectId: "2",
    dealId: "DEAL-002",
    clientId: "2",
    clientName: "Sarah Wilson",
    invoiceStage: "Design Fee",
    amount: 48000,
    totalAmount: 48000,
    dueDate: "2024-02-20",
    paymentStatus: "Overdue",
    paymentMethod: null,
    paymentDate: null,
    reminderCount: 3,
    lastReminderDate: "2024-02-25",
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-02-25T00:00:00Z",
    isActive: true
  },
  {
    _id: "INV-004",
    invoiceNumber: "INV-2024-004",
    projectId: "2", 
    dealId: "DEAL-002",
    clientId: "2",
    clientName: "Sarah Wilson",
    invoiceStage: "50% Advance",
    amount: 300000,
    dueDate: "2024-04-20",
    paymentStatus: "Sent",
    paymentMethod: null,
    paymentDate: null,
    reminderCount: 0,
    lastReminderDate: null,
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-04-01T00:00:00Z",
    isActive: true
  },
  {
    _id: "INV-005",
    invoiceNumber: "INV-2024-005",
    projectId: "3",
    dealId: "DEAL-003", 
    clientId: "3",
    clientName: "Mike Chen",
    invoiceStage: "40% Interim",
    amount: 240000,
    dueDate: "2024-05-15",
    paymentStatus: "Collected",
    paymentMethod: "Online",
    paymentDate: "2024-05-12",
    reminderCount: 0,
    lastReminderDate: null,
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2024-05-12T00:00:00Z",
    isActive: true
  },
  {
    _id: "INV-006",
    invoiceNumber: "INV-2024-006",
    projectId: "3",
    dealId: "DEAL-003",
    clientId: "3", 
    clientName: "Mike Chen",
    invoiceStage: "Final 10%",
    amount: 60000,
    dueDate: "2024-06-15",
    paymentStatus: "Sent",
    paymentMethod: null,
    paymentDate: null,
    reminderCount: 1,
    lastReminderDate: "2024-06-20",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2024-06-20T00:00:00Z",
    isActive: true
  }
];

// Use industry-specific data instead of static data
let deals = industryData.deals.length > 0 ? industryData.deals : [
  {
    _id: '1',
    dealId: 'DEAL-001',
    projectName: 'Modern Apartment Design',
    clientId: '1',
    clientName: 'John Smith',
    
    // === LEAD DETAILS REFERENCE ===
    leadDetails: {
      originalLeadId: 'LEAD-001',
      leadSource: 'Website',
      leadName: 'John Smith',
      leadEmail: 'john@example.com',
      leadPhone: '+91-9876543210',
      leadCompany: 'John Smith Enterprises'
    },
    
    // === PROPERTY TYPE ===
    propertyType: {
      dealType: 'Residential',
      propertyType: 'Residential - Apartment'
    },
    
    // === SIZE ===
    size: {
      area: 1200,
      bhk: 3,
      unit: 'Sqft',
      displayText: '1200 Sqft, 3BHK'
    },
    
    // === LOCATION ===
    location: {
      address: '123 MG Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      coordinates: null
    },
    
    // === CONSTRUCTION STATUS ===
    constructionStatus: 'Under Construction',
    
    // === TENTATIVE HANDOVER DATE ===
    handoverDate: {
      tentativeHandoverDate: '2024-06-15',
      isFlexible: true,
      notes: 'Client prefers weekend handover'
    },
    
    // === CATEGORY ===
    category: 'Standard',
    
    // === SPECIAL REQUIREMENTS ===
    specialRequirements: {
      requirements: 'Modern 3BHK apartment design with contemporary furniture, modular kitchen and living room design',
      tags: ['Residential', 'Website', 'Modern'],
      priority: 'High'
    },
    
    // === PROJECT MANAGEMENT ===
    currentStage: 'Proposal', // Generic workflow stage
    projectStatus: 'Active',
    totalProjectValue: 500000,
    projectStartDate: '2024-01-15',
    expectedCompletionDate: '2024-03-15',
    
    // === NOTES HISTORY ===
    notesHistory: [
      {
        id: 'note-1',
        content: 'Initial project discussion completed. Client prefers modern design with neutral colors.',
        addedBy: 'Sarah Johnson',
        addedAt: '2024-01-15T10:00:00Z',
        type: 'general'
      },
      {
        id: 'note-2',
        content: 'Client requested changes to kitchen layout - prefers island counter.',
        addedBy: 'Mike Chen',
        addedAt: '2024-01-20T14:30:00Z',
        type: 'design_change'
      }
    ],
    
    // === ASSIGNED TEAM ===
    assignedTeam: {
      assignedDesigner: 'Sarah Johnson',
      assignedPM: 'Mike Chen',
      assignedSales: 'Alex Kumar',
      teamMembers: ['Sarah Johnson', 'Mike Chen'],
      assignmentDate: '2024-01-15',
      assignmentNotes: 'Initial team assignment'
    },
    
    // === DESIGN PACKAGE ===
    designPackage: {
      packageType: 'Standard',
      features: ['2D Layouts', 'Basic Material Selection', 'Design Consultation'],
      deliverables: ['2D Layouts', 'Material List', 'Basic Drawings'],
      timeline: 30,
      price: 500000,
      customizations: []
    },
    
    // === DESIGN STATUS TRACKING ===
    designStatus: {
      moodBoardShared: true,
      moodBoardDate: '2024-01-20',
      moodBoardFeedback: 'Client loved the color scheme',
      
      design3DStatus: 'Proposal',
      design3DProgress: 60,
      design3DVersion: '2.1',
      design3DLastUpdated: '2024-01-25',
      
      design2DStatus: 'Ready',
      design2DProgress: 100,
      design2DVersion: '1.5',
      design2DLastUpdated: '2024-01-22',
      
      materialSelectionStatus: 'Proposal',
      materialSelectionProgress: 40,
      materialSelectionDate: '2024-01-23',
      
      clientApprovalDate: null,
      revisionCount: 2,
      lastRevisionDate: '2024-01-25'
    },
    
    // === ACTIVITIES TAB FIELDS ===
    activities: {
      tasks: [
        { id: '1', title: 'Initial consultation', status: 'Completed', dueDate: '2024-01-20', assignedTo: 'Sarah Johnson', description: 'Client requirements discussion', priority: 'High' },
        { id: '2', title: 'Site survey', status: 'Proposal', dueDate: '2024-01-25', assignedTo: 'Mike Chen', description: 'Measurements and site analysis', priority: 'Medium' },
        { id: '3', title: '3D visualization', status: 'Pending', dueDate: '2024-02-01', assignedTo: 'Sarah Johnson', description: 'Create 3D mockups', priority: 'High' }
      ],
      calls: [
        { id: '1', type: 'Follow-up', date: '2024-01-18', duration: 15, notes: 'Discussed requirements', outcome: 'Positive response', phoneNumber: '+91-9876543210' },
        { id: '2', type: 'Consultation', date: '2024-01-20', duration: 30, notes: 'Budget discussion', outcome: 'Budget approved', phoneNumber: '+91-9876543210' }
      ],
      meetings: [
        { id: '1', type: 'Initial Meeting', date: '2024-01-15', duration: 120, attendees: ['John Smith', 'Sarah Johnson'], location: 'Office', agenda: 'Project kickoff', status: 'Completed' },
        { id: '2', type: 'Design Review', date: '2024-01-25', duration: 90, attendees: ['John Smith', 'Sarah Johnson', 'Mike Chen'], location: 'Client Site', agenda: 'Design presentation', status: 'Scheduled' }
      ],
      presentations: [
        { id: '1', type: 'Concept Presentation', date: '2024-01-25', duration: 60, attendees: ['John Smith'], status: 'Scheduled', materials: '3D renders, mood boards', outcome: 'Pending' }
      ],
      surveys: [
        { id: '1', type: 'Client Satisfaction', date: '2024-01-20', questions: 10, responses: 8, score: 4.5, feedback: 'Very satisfied with progress', status: 'Completed' }
      ],
      interviews: [
        { id: '1', type: 'Requirements Gathering', date: '2024-01-15', duration: 60, participants: ['John Smith', 'Sarah Johnson'], notes: 'Detailed requirements documented', keyFindings: ['Prefers modern style', 'Budget conscious'] }
      ]
    },
    
    // === ADDITIONAL PROJECT FIELDS ===
    projectDescription: 'Modern 3BHK apartment design with contemporary furniture',
    projectNotes: 'Client prefers minimalist design with smart storage solutions',
    projectTags: ['Residential', 'Website', 'Modern'],
    
    // === LEAD SOURCE SPECIFIC DATA ===
    referralDetails: null,
    paidLeadDetails: null,
    socialMediaDetails: null,
    walkInDetails: null,
    
    // === SYSTEM FIELDS ===
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
    isActive: true,
    createdBy: 'System',
    lastModifiedBy: 'System'
  },
  {
    _id: '2',
    dealId: 'DEAL-002',
    projectName: 'Luxury Villa Interior Design',
    clientId: '2',
    clientName: 'Sarah Johnson',
    
    // === LEAD DETAILS REFERENCE ===
    leadDetails: {
      originalLeadId: 'LEAD-002',
      leadSource: 'Referral',
      leadName: 'Sarah Johnson',
      leadEmail: 'sarah@example.com',
      leadPhone: '+91-9876543211',
      leadCompany: 'Johnson Enterprises'
    },
    
    // === PROPERTY TYPE ===
    propertyType: {
      dealType: 'Residential',
      propertyType: 'Residential - Villa'
    },
    
    // === SIZE ===
    size: {
      area: 2500,
      bhk: 4,
      unit: 'Sqft',
      displayText: '2500 Sqft, 4BHK'
    },
    
    // === LOCATION ===
    location: {
      address: '456 Juhu Beach Road, Juhu',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400049',
      coordinates: null
    },
    
    // === CONSTRUCTION STATUS ===
    constructionStatus: 'New Construction',
    
    // === TENTATIVE HANDOVER DATE ===
    handoverDate: {
      tentativeHandoverDate: '2024-08-30',
      isFlexible: false,
      notes: 'Fixed handover date as per construction schedule'
    },
    
    // === CATEGORY ===
    category: 'Luxury',
    
    // === SPECIAL REQUIREMENTS ===
    specialRequirements: {
      requirements: 'Luxury villa with premium finishes, smart home integration, and landscape design',
      tags: ['Residential', 'Referral', 'Luxury', 'Villa'],
      priority: 'High'
    },
    
    // === PROJECT MANAGEMENT ===
    currentStage: 'Negotiation',
    projectStatus: 'Active',
    totalProjectValue: 1500000,
    projectStartDate: '2024-01-20',
    expectedCompletionDate: '2024-08-30',
    
    // === NOTES HISTORY ===
    notesHistory: [
      {
        id: 'note-3',
        content: 'Luxury villa project initiated. Client has high-end requirements and premium budget.',
        addedBy: 'Mike Chen',
        addedAt: '2024-01-20T09:00:00Z',
        type: 'general'
      },
      {
        id: 'note-4',
        content: 'Project blocked due to pending client approval on premium material selection.',
        addedBy: 'Sarah Johnson',
        addedAt: '2024-01-25T16:00:00Z',
        type: 'status_change'
      }
    ],
    
    // === ASSIGNED TEAM ===
    assignedTeam: {
      assignedDesigner: 'Mike Chen',
      assignedPM: 'Sarah Johnson',
      assignedSales: 'Alex Kumar',
      teamMembers: ['Mike Chen', 'Sarah Johnson'],
      assignmentDate: '2024-01-20',
      assignmentNotes: 'Luxury project team assignment'
    },
    
    // === DESIGN PACKAGE ===
    designPackage: {
      packageType: 'Luxury',
      features: ['3D Visualization', 'Material Selection', 'Site Visits', 'Premium Materials', 'Custom Design'],
      deliverables: ['3D Renders', 'Material Samples', 'Detailed Drawings', 'Mood Boards'],
      timeline: 60,
      price: 1500000,
      customizations: ['Smart Home Integration', 'Landscape Design']
    },
    
    // === DESIGN STATUS TRACKING ===
    designStatus: {
      moodBoardShared: true,
      moodBoardDate: '2024-01-25',
      moodBoardFeedback: 'Client approved luxury theme',
      
      design3DStatus: 'Ready',
      design3DProgress: 100,
      design3DVersion: '3.0',
      design3DLastUpdated: '2024-01-28',
      
      design2DStatus: 'Ready',
      design2DProgress: 100,
      design2DVersion: '2.0',
      design2DLastUpdated: '2024-01-26',
      
      materialSelectionStatus: 'Ready',
      materialSelectionProgress: 100,
      materialSelectionDate: '2024-01-27',
      
      clientApprovalDate: '2024-01-28',
      revisionCount: 1,
      lastRevisionDate: '2024-01-28'
    },
    
    // === ACTIVITIES TAB FIELDS ===
    activities: {
      tasks: [
        { id: '1', title: 'Site visit and measurements', status: 'Completed', dueDate: '2024-01-22', assignedTo: 'Mike Chen', description: 'Detailed site analysis', priority: 'High' },
        { id: '2', title: 'Luxury material selection', status: 'Completed', dueDate: '2024-01-30', assignedTo: 'Sarah Johnson', description: 'Premium material sourcing', priority: 'High' },
        { id: '3', title: '3D visualization', status: 'Completed', dueDate: '2024-02-05', assignedTo: 'Mike Chen', description: 'Luxury 3D renders', priority: 'High' }
      ],
      calls: [
        { id: '1', type: 'Initial Consultation', date: '2024-01-20', duration: 45, notes: 'Luxury requirements discussion', outcome: 'High-end specifications confirmed', phoneNumber: '+91-9876543211' }
      ],
      meetings: [
        { id: '1', type: 'Luxury Design Meeting', date: '2024-01-22', duration: 180, attendees: ['Sarah Johnson', 'Mike Chen', 'Client'], location: 'Client Villa', agenda: 'Luxury design specifications', status: 'Completed' }
      ],
      presentations: [
        { id: '1', type: 'Luxury Concept Presentation', date: '2024-02-05', duration: 120, attendees: ['Client'], status: 'Completed', materials: 'Luxury 3D renders, material samples', outcome: 'Approved' }
      ],
      surveys: [
        { id: '1', type: 'Luxury Requirements Survey', date: '2024-01-25', questions: 15, responses: 15, score: 4.8, feedback: 'Excellent luxury specifications', status: 'Completed' }
      ],
      interviews: [
        { id: '1', type: 'Luxury Requirements Interview', date: '2024-01-22', duration: 120, participants: ['Sarah Johnson', 'Mike Chen'], notes: 'Luxury requirements documented', keyFindings: ['Premium materials preferred', 'Smart home integration required'] }
      ]
    },
    
    // === ADDITIONAL PROJECT FIELDS ===
    projectDescription: 'Luxury villa interior design with premium finishes',
    projectNotes: 'Client wants smart home integration and landscape design',
    projectTags: ['Residential', 'Referral', 'Luxury', 'Villa'],
    
    // === LEAD SOURCE SPECIFIC DATA ===
    referralDetails: {
      referrerName: 'Priya Sharma',
      referrerContact: '+91-9876543212',
      referrerProjectNumber: 'DEAL-001'
    },
    paidLeadDetails: null,
    socialMediaDetails: null,
    walkInDetails: null,
    
    // === SYSTEM FIELDS ===
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
    isActive: true,
    createdBy: 'System',
    lastModifiedBy: 'System'
  },
  {
    _id: '3',
    dealId: 'DEAL-003',
    projectName: 'Office Space Design',
    clientId: '3',
    clientName: 'Rajesh Kumar',
    
    // === LEAD DETAILS REFERENCE ===
    leadDetails: {
      originalLeadId: 'LEAD-003',
      leadSource: 'Instagram',
      leadName: 'Rajesh Kumar',
      leadEmail: 'rajesh@example.com',
      leadPhone: '+91-9876543213',
      leadCompany: 'Kumar Technologies'
    },
    
    // === PROPERTY TYPE ===
    propertyType: {
      dealType: 'Commercial',
      propertyType: 'Commercial - Office Spaces'
    },
    
    // === SIZE ===
    size: {
      area: 2000,
      bhk: null,
      unit: 'Sqft',
      displayText: '2000 Sqft'
    },
    
    // === LOCATION ===
    location: {
      address: '789 Cyber City, Gurgaon',
      city: 'Delhi',
      state: 'NCR',
      pincode: '122002',
      coordinates: null
    },
    
    // === CONSTRUCTION STATUS ===
    constructionStatus: 'Existing Building',
    
    // === TENTATIVE HANDOVER DATE ===
    handoverDate: {
      tentativeHandoverDate: '2024-05-15',
      isFlexible: true,
      notes: 'Flexible based on office renovation schedule'
    },
    
    // === CATEGORY ===
    category: 'Standard',
    
    // === SPECIAL REQUIREMENTS ===
    specialRequirements: {
      requirements: 'Modern office design with open workspace, meeting rooms, and reception area',
      tags: ['Commercial', 'Instagram', 'Office', 'Modern'],
      priority: 'Medium'
    },
    
    // === PROJECT MANAGEMENT ===
    currentStage: 'Closed Won',
    projectStatus: 'Active',
    totalProjectValue: 800000,
    projectStartDate: '2024-01-23',
    expectedCompletionDate: '2024-05-15',
    
    // === ASSIGNED TEAM ===
    assignedTeam: {
      assignedDesigner: 'Sarah Johnson',
      assignedPM: 'Mike Chen',
      assignedSales: 'Alex Kumar',
      teamMembers: ['Sarah Johnson', 'Mike Chen'],
      assignmentDate: '2024-01-23',
      assignmentNotes: 'Commercial project team'
    },
    
    // === DESIGN PACKAGE ===
    designPackage: {
      packageType: 'Standard',
      features: ['2D Layouts', 'Basic Material Selection', 'Design Consultation'],
      deliverables: ['2D Layouts', 'Material List', 'Basic Drawings'],
      timeline: 30,
      price: 800000,
      customizations: []
    },
    
    // === DESIGN STATUS TRACKING ===
    designStatus: {
      moodBoardShared: false,
      moodBoardDate: null,
      moodBoardFeedback: null,
      
      design3DStatus: 'Not Started',
      design3DProgress: 0,
      design3DVersion: '1.0',
      design3DLastUpdated: '2024-01-23',
      
      design2DStatus: 'Proposal',
      design2DProgress: 30,
      design2DVersion: '1.2',
      design2DLastUpdated: '2024-01-26',
      
      materialSelectionStatus: 'Not Started',
      materialSelectionProgress: 0,
      materialSelectionDate: null,
      
      clientApprovalDate: null,
      revisionCount: 0,
      lastRevisionDate: null
    },
    
    // === ACTIVITIES TAB FIELDS ===
    activities: {
      tasks: [
        { id: '1', title: 'Office space analysis', status: 'Completed', dueDate: '2024-01-25', assignedTo: 'Sarah Johnson', description: 'Space planning and analysis', priority: 'High' },
        { id: '2', title: 'Workplace design concepts', status: 'Proposal', dueDate: '2024-02-01', assignedTo: 'Mike Chen', description: 'Modern workplace design', priority: 'Medium' }
      ],
      calls: [
        { id: '1', type: 'Discovery Call', date: '2024-01-23', duration: 30, notes: 'Office requirements discussion', outcome: 'Requirements documented', phoneNumber: '+91-9876543213' }
      ],
      meetings: [
        { id: '1', type: 'Office Design Meeting', date: '2024-01-25', duration: 120, attendees: ['Rajesh Kumar', 'Sarah Johnson'], location: 'Office Site', agenda: 'Office design specifications', status: 'Completed' }
      ],
      presentations: [
        { id: '1', type: 'Office Design Presentation', date: '2024-02-01', duration: 90, attendees: ['Rajesh Kumar'], status: 'Scheduled', materials: 'Office layouts, 3D renders', outcome: 'Pending' }
      ],
      surveys: [
        { id: '1', type: 'Workplace Survey', date: '2024-01-25', questions: 15, responses: 12, score: 4.2, feedback: 'Good understanding of requirements', status: 'Completed' }
      ],
      interviews: [
        { id: '1', type: 'Stakeholder Interview', date: '2024-01-25', duration: 60, participants: ['Rajesh Kumar', 'Team Members'], notes: 'Team requirements gathered', keyFindings: ['Open workspace preferred', 'Meeting rooms essential'] }
      ]
    },
    
    // === ADDITIONAL PROJECT FIELDS ===
    projectDescription: 'Modern office space design with open workspace concept',
    projectNotes: 'Client wants flexible workspace with modern amenities',
    projectTags: ['Commercial', 'Instagram', 'Office', 'Modern'],
    
    // === LEAD SOURCE SPECIFIC DATA ===
    referralDetails: null,
    paidLeadDetails: null,
    socialMediaDetails: {
      platform: 'Instagram',
      campaignName: 'Office Design Campaign',
      postUrl: 'https://instagram.com/p/xyz123'
    },
    walkInDetails: null,
    
    // === SYSTEM FIELDS ===
    createdAt: '2024-01-23T00:00:00Z',
    updatedAt: '2024-01-26T00:00:00Z',
    isActive: true,
    createdBy: 'System',
    lastModifiedBy: 'System'
  },
  {
    _id: '3',
    dealId: 'DEAL-003',
    projectName: 'Office Space Design',
    clientId: '3',
    clientName: 'Rajesh Kumar',
    
    // === LEAD DETAILS REFERENCE ===
    originalLeadId: 'LEAD-003',
    leadSource: 'Instagram',
    leadName: 'Rajesh Kumar',
    leadEmail: 'rajesh@example.com',
    leadPhone: '+91-9876543213',
    leadCompany: 'Kumar Technologies',
    
    // === PROJECT DETAILS ===
    pipelineType: 'Design Only',
    dealType: 'Commercial',
    propertyType: 'Commercial - Office Spaces',
    size: '2000 Sqft',
    location: 'Delhi, NCR',
    constructionStatus: 'Existing Building',
    tentativeHandoverDate: '2024-05-15',
    category: 'Standard',
    specialRequirements: 'Modern office design with open workspace, meeting rooms, and reception area',
    
    // === ACTIVITIES TAB FIELDS ===
    activities: {
      tasks: [
        { id: '1', title: 'Office space analysis', status: 'Completed', dueDate: '2024-01-25', assignedTo: 'Sarah Johnson', description: 'Space planning and analysis' },
        { id: '2', title: 'Workplace design concepts', status: 'Proposal', dueDate: '2024-02-01', assignedTo: 'Mike Chen', description: 'Modern workplace design' }
      ],
      calls: [
        { id: '1', type: 'Discovery Call', date: '2024-01-23', duration: '30 minutes', notes: 'Office requirements discussion', outcome: 'Requirements documented' }
      ],
      meetings: [
        { id: '1', type: 'Office Design Meeting', date: '2024-01-25', duration: '2 hours', attendees: ['Rajesh Kumar', 'Sarah Johnson'], location: 'Office Site', agenda: 'Office design specifications' }
      ],
      presentations: [
        { id: '1', type: 'Office Design Presentation', date: '2024-02-01', duration: '1.5 hours', attendees: ['Rajesh Kumar'], status: 'Scheduled', materials: 'Office layouts, 3D renders' }
      ],
      surveys: [
        { id: '1', type: 'Workplace Survey', date: '2024-01-25', questions: 15, responses: 12, score: 4.2, feedback: 'Good understanding of requirements' }
      ],
      interviews: [
        { id: '1', type: 'Stakeholder Interview', date: '2024-01-25', duration: '1 hour', participants: ['Rajesh Kumar', 'Team Members'], notes: 'Team requirements gathered' }
      ]
    },
    
    // === PROJECT MANAGEMENT FIELDS ===
    currentStage: 'Proposal',
    projectStatus: 'Active',
    totalProjectValue: 800000,
    assignedDesigner: 'Sarah Johnson',
    priorityLevel: 'Medium',
    projectStartDate: '2024-01-23',
    expectedCompletionDate: '2024-05-15',
    
    // === ADDITIONAL PROJECT FIELDS ===
    projectDescription: 'Modern office space design with open workspace concept',
    projectNotes: 'Client wants flexible workspace with modern amenities',
    projectTags: ['Commercial', 'Instagram', 'Office', 'Modern'],
    
    // === REFERRAL INFORMATION ===
    referralDetails: null,
    
    // === PAID LEAD INFORMATION ===
    paidLeadDetails: null,
    
    // === SOCIAL MEDIA LEAD INFORMATION ===
    socialMediaDetails: {
      platform: 'Instagram',
      campaignName: 'Office Design Campaign',
      postUrl: 'https://instagram.com/p/xyz123'
    },
    
    // === WALK-IN/EXPO INFORMATION ===
    walkInDetails: null,
    
    // === SYSTEM FIELDS ===
    createdAt: '2024-01-23T00:00:00Z',
    updatedAt: '2024-01-23T00:00:00Z',
    isActive: true,
    createdBy: 'System',
    lastModifiedBy: 'System'
  },
  {
    _id: '4',
    dealId: 'DEAL-004',
    projectName: 'Restaurant Interior Design',
    clientId: '4',
    clientName: 'Priya Sharma',
    
    // === LEAD DETAILS REFERENCE ===
    originalLeadId: 'LEAD-004',
    leadSource: 'Paid Lead',
    leadName: 'Priya Sharma',
    leadEmail: 'priya@example.com',
    leadPhone: '+91-9876543214',
    leadCompany: 'Sharma Restaurants',
    
    // === PROJECT DETAILS ===
    pipelineType: 'Design & Execution',
    dealType: 'Commercial',
    propertyType: 'Commercial - Restaurant',
    size: '1500 Sqft',
    location: 'Pune, Maharashtra',
    constructionStatus: 'Under Construction',
    tentativeHandoverDate: '2024-07-20',
    category: 'Standard',
    specialRequirements: 'Contemporary restaurant design with bar area, dining space, and kitchen layout',
    
    // === ACTIVITIES TAB FIELDS ===
    activities: {
      tasks: [
        { id: '1', title: 'Restaurant concept development', status: 'Completed', dueDate: '2024-01-28', assignedTo: 'Mike Chen', description: 'Restaurant design concept' },
        { id: '2', title: 'Kitchen layout design', status: 'Proposal', dueDate: '2024-02-05', assignedTo: 'Sarah Johnson', description: 'Commercial kitchen planning' }
      ],
      calls: [
        { id: '1', type: 'Project Kickoff', date: '2024-01-26', duration: '45 minutes', notes: 'Restaurant requirements', outcome: 'Project scope defined' }
      ],
      meetings: [
        { id: '1', type: 'Restaurant Design Meeting', date: '2024-01-28', duration: '2.5 hours', attendees: ['Priya Sharma', 'Mike Chen'], location: 'Restaurant Site', agenda: 'Restaurant design specifications' }
      ],
      presentations: [
        { id: '1', type: 'Restaurant Concept Presentation', date: '2024-02-05', duration: '2 hours', attendees: ['Priya Sharma'], status: 'Scheduled', materials: 'Restaurant layouts, mood boards' }
      ],
      surveys: [],
      interviews: [
        { id: '1', type: 'Restaurant Requirements', date: '2024-01-28', duration: '1.5 hours', participants: ['Priya Sharma', 'Chef'], notes: 'Kitchen and dining requirements' }
      ]
    },
    
    // === PROJECT MANAGEMENT FIELDS ===
    currentStage: 'Closed Lost',
    projectStatus: 'Active',
    totalProjectValue: 1200000,
    assignedDesigner: 'Mike Chen',
    priorityLevel: 'High',
    projectStartDate: '2024-01-26',
    expectedCompletionDate: '2024-07-20',
    
    // === ADDITIONAL PROJECT FIELDS ===
    projectDescription: 'Contemporary restaurant design with bar and dining areas',
    projectNotes: 'Client wants modern restaurant with efficient kitchen layout',
    projectTags: ['Commercial', 'Paid Lead', 'Restaurant', 'Contemporary'],
    
    // === REFERRAL INFORMATION ===
    referralDetails: null,
    
    // === PAID LEAD INFORMATION ===
    paidLeadDetails: {
      agentName: 'Ravi Singh',
      agencyName: 'Property Connect',
      agentContact: '+91-9876543215'
    },
    
    // === SOCIAL MEDIA LEAD INFORMATION ===
    socialMediaDetails: null,
    
    // === WALK-IN/EXPO INFORMATION ===
    walkInDetails: null,
    
    // === SYSTEM FIELDS ===
    createdAt: '2024-01-26T00:00:00Z',
    updatedAt: '2024-01-26T00:00:00Z',
    isActive: true,
    createdBy: 'System',
    lastModifiedBy: 'System'
  },
  {
    _id: '5',
    dealId: 'DEAL-005',
    projectName: 'Healthcare Clinic Design',
    clientId: '5',
    clientName: 'Dr. Amit Patel',
    
    // === LEAD DETAILS REFERENCE ===
    originalLeadId: 'LEAD-005',
    leadSource: 'Expo',
    leadName: 'Dr. Amit Patel',
    leadEmail: 'amit@example.com',
    leadPhone: '+91-9876543216',
    leadCompany: 'Patel Healthcare',
    
    // === PROJECT DETAILS ===
    pipelineType: 'Design & Execution',
    dealType: 'Commercial',
    propertyType: 'Commercial - Healthcare',
    size: '1800 Sqft',
    location: 'Ahmedabad, Gujarat',
    constructionStatus: 'New Construction',
    tentativeHandoverDate: '2024-09-15',
    category: 'Standard',
    specialRequirements: 'Modern healthcare clinic with patient rooms, waiting area, and medical equipment integration',
    
    // === ACTIVITIES TAB FIELDS ===
    activities: {
      tasks: [
        { id: '1', title: 'Healthcare compliance review', status: 'Completed', dueDate: '2024-01-30', assignedTo: 'Sarah Johnson', description: 'Medical facility compliance check' },
        { id: '2', title: 'Medical equipment planning', status: 'Proposal', dueDate: '2024-02-08', assignedTo: 'Mike Chen', description: 'Equipment integration design' }
      ],
      calls: [
        { id: '1', type: 'Healthcare Consultation', date: '2024-01-28', duration: '1 hour', notes: 'Medical facility requirements', outcome: 'Compliance requirements understood' }
      ],
      meetings: [
        { id: '1', type: 'Healthcare Design Meeting', date: '2024-01-30', duration: '3 hours', attendees: ['Dr. Amit Patel', 'Sarah Johnson', 'Medical Consultant'], location: 'Clinic Site', agenda: 'Healthcare design specifications' }
      ],
      presentations: [
        { id: '1', type: 'Healthcare Design Presentation', date: '2024-02-08', duration: '2 hours', attendees: ['Dr. Amit Patel'], status: 'Scheduled', materials: 'Healthcare layouts, compliance documentation' }
      ],
      surveys: [
        { id: '1', type: 'Healthcare Requirements Survey', date: '2024-01-30', questions: 20, responses: 18, score: 4.6, feedback: 'Comprehensive requirements captured' }
      ],
      interviews: [
        { id: '1', type: 'Medical Staff Interview', date: '2024-01-30', duration: '2 hours', participants: ['Dr. Amit Patel', 'Nursing Staff'], notes: 'Workflow and space requirements' }
      ]
    },
    
    // === PROJECT MANAGEMENT FIELDS ===
    currentStage: 'Proposal',
    projectStatus: 'Active',
    totalProjectValue: 900000,
    assignedDesigner: 'Sarah Johnson',
    priorityLevel: 'Medium',
    projectStartDate: '2024-01-28',
    expectedCompletionDate: '2024-09-15',
    
    // === ADDITIONAL PROJECT FIELDS ===
    projectDescription: 'Modern healthcare clinic with patient-focused design',
    projectNotes: 'Client emphasizes patient comfort and medical workflow efficiency',
    projectTags: ['Commercial', 'Expo', 'Healthcare', 'Medical'],
    
    // === REFERRAL INFORMATION ===
    referralDetails: null,
    
    // === PAID LEAD INFORMATION ===
    paidLeadDetails: null,
    
    // === SOCIAL MEDIA LEAD INFORMATION ===
    socialMediaDetails: null,
    
    // === WALK-IN/EXPO INFORMATION ===
    walkInDetails: {
      sourceType: 'Expo',
      eventName: 'Healthcare Design Expo 2024',
      boothNumber: 'B-15'
    },
    
    // === SYSTEM FIELDS ===
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
    isActive: true,
    createdBy: 'System',
    lastModifiedBy: 'System'
  },
  {
    _id: '6',
    dealId: 'DEAL-006',
    projectName: 'Retail Shop Design',
    clientId: '6',
    clientName: 'Sarah Johnson',
    // Lead Details Reference
    originalLeadId: 'LEAD-002',
    leadSource: 'Referral',
    // Project Details
    pipelineType: 'Design & Execution',
    dealType: 'Commercial',
    propertyType: 'Commercial - Office Spaces',
    size: '2000 Sqft, Office Space',
    location: 'Mumbai, Maharashtra',
    constructionStatus: 'Completed',
    tentativeHandoverDate: '2024-05-20',
    category: 'Standard',
    specialRequirements: 'Professional office setup with meeting rooms, modern workspace design',
    // Project Management
    currentStage: 'Negotiation',
    projectStatus: 'Active',
    totalProjectValue: 750000,
    assignedDesigner: 'Mike Chen',
    priorityLevel: 'Medium',
    projectStartDate: '2024-01-20',
    expectedCompletionDate: '2024-04-20',
    createdAt: '2024-01-20T00:00:00Z',
    isActive: true
  },
  {
    _id: '3',
    dealId: 'DEAL-003',
    projectName: 'Luxury Villa Interior',
    clientId: '3',
    clientName: 'Rajesh Kumar',
    // Lead Details Reference
    originalLeadId: 'LEAD-003',
    leadSource: 'Google Ads',
    // Project Details
    pipelineType: 'Design & Execution',
    dealType: 'Residential',
    propertyType: 'Residential - Villa',
    size: '3500 Sqft, 4BHK Villa',
    location: 'Delhi, NCR',
    constructionStatus: 'Completed',
    tentativeHandoverDate: '2024-02-10',
    category: 'Luxury',
    specialRequirements: 'Luxury villa interior with premium finishes, high-end client requirements',
    // Project Management
    currentStage: 'Closed Won',
    projectStatus: 'Active',
    totalProjectValue: 1200000,
    assignedDesigner: 'Sarah Johnson',
    priorityLevel: 'High',
    projectStartDate: '2024-01-10',
    expectedCompletionDate: '2024-02-10',
    createdAt: '2024-01-10T00:00:00Z',
    isActive: true
  },
  {
    _id: '4',
    dealId: 'DEAL-004',
    projectName: 'Kitchen Renovation',
    clientId: '4',
    clientName: 'Priya Sharma',
    currentStage: 'Closed Won',
    projectStatus: 'Completed',
    totalProjectValue: 300000,
    assignedDesigner: 'Mike Chen',
    priorityLevel: 'Medium',
    projectStartDate: '2023-12-01',
    expectedCompletionDate: '2024-01-01',
    completionDate: '2024-01-01',
    createdAt: '2023-12-01T00:00:00Z',
    isActive: true
  },
  {
    _id: '5',
    dealId: 'DEAL-005',
    projectName: 'Luxury Villa Interior',
    clientId: '5',
    clientName: 'Rajesh Kumar',
    currentStage: 'Lead',
    projectStatus: 'Active',
    totalProjectValue: 1500000,
    assignedDesigner: 'Sarah Johnson',
    priorityLevel: 'High',
    projectStartDate: '2024-01-20',
    expectedCompletionDate: '2024-04-20',
    createdAt: '2024-01-20T00:00:00Z',
    isActive: true
  },
  {
    _id: '6',
    dealId: 'DEAL-006',
    projectName: 'Modern Office Space',
    clientId: '6',
    clientName: 'Tech Startup Ltd',
    currentStage: 'Qualified',
    projectStatus: 'Active',
    totalProjectValue: 800000,
    assignedDesigner: 'Mike Chen',
    priorityLevel: 'Medium',
    projectStartDate: '2024-01-25',
    expectedCompletionDate: '2024-03-25',
    createdAt: '2024-01-25T00:00:00Z',
    isActive: true
  },
  {
    _id: '7',
    dealId: 'DEAL-007',
    projectName: 'Restaurant Interior Design',
    clientId: '7',
    clientName: 'Foodie Paradise',
    currentStage: 'Closed Lost',
    projectStatus: 'Active',
    totalProjectValue: 600000,
    assignedDesigner: 'Alex Kumar',
    priorityLevel: 'High',
    projectStartDate: '2024-01-28',
    expectedCompletionDate: '2024-04-28',
    createdAt: '2024-01-28T00:00:00Z',
    isActive: true
  },
  {
    _id: '8',
    dealId: 'DEAL-008',
    projectName: 'Healthcare Clinic Design',
    clientId: '8',
    clientName: 'Dr. Wellness Clinic',
    currentStage: 'Qualified',
    projectStatus: 'Active',
    totalProjectValue: 400000,
    assignedDesigner: 'Sarah Johnson',
    priorityLevel: 'Medium',
    projectStartDate: '2024-02-01',
    expectedCompletionDate: '2024-05-01',
    createdAt: '2024-02-01T00:00:00Z',
    isActive: true
  },
  {
    _id: '9',
    dealId: 'DEAL-009',
    projectName: 'Boutique Hotel Lobby',
    clientId: '9',
    clientName: 'Paradise Hotels',
    currentStage: 'Negotiation',
    projectStatus: 'Active',
    totalProjectValue: 1200000,
    assignedDesigner: 'Mike Chen',
    priorityLevel: 'High',
    projectStartDate: '2024-02-05',
    expectedCompletionDate: '2024-05-05',
    createdAt: '2024-02-05T00:00:00Z',
    isActive: true
  },
  {
    _id: '10',
    dealId: 'DEAL-010',
    projectName: 'Co-working Space Design',
    clientId: '10',
    clientName: 'Innovation Hub',
    currentStage: 'Proposal',
    projectStatus: 'Active',
    totalProjectValue: 700000,
    assignedDesigner: 'Alex Kumar',
    priorityLevel: 'Medium',
    projectStartDate: '2024-02-10',
    expectedCompletionDate: '2024-05-10',
    createdAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    _id: '11',
    dealId: 'DEAL-011',
    projectName: 'Retail Store Design',
    clientId: '11',
    clientName: 'Fashion Forward',
    currentStage: 'Proposal',
    projectStatus: 'Active',
    totalProjectValue: 500000,
    assignedDesigner: 'Sarah Johnson',
    priorityLevel: 'Medium',
    projectStartDate: '2024-02-15',
    expectedCompletionDate: '2024-05-15',
    createdAt: '2024-02-15T00:00:00Z',
    isActive: true
  },
  {
    _id: '12',
    dealId: 'DEAL-012',
    projectName: 'Gym & Fitness Center',
    clientId: '12',
    clientName: 'FitLife Gym',
    currentStage: 'Negotiation',
    projectStatus: 'Active',
    totalProjectValue: 900000,
    assignedDesigner: 'Mike Chen',
    priorityLevel: 'High',
    projectStartDate: '2024-02-20',
    expectedCompletionDate: '2024-05-20',
    createdAt: '2024-02-20T00:00:00Z',
    isActive: true
  },
  {
    _id: '13',
    dealId: 'DEAL-013',
    projectName: 'Spa & Wellness Center',
    clientId: '13',
    clientName: 'Zen Spa',
    currentStage: 'Qualified',
    projectStatus: 'Active',
    totalProjectValue: 650000,
    assignedDesigner: 'Alex Kumar',
    priorityLevel: 'Medium',
    projectStartDate: '2024-02-25',
    expectedCompletionDate: '2024-05-25',
    createdAt: '2024-02-25T00:00:00Z',
    isActive: true
  },
  {
    _id: '14',
    dealId: 'DEAL-014',
    projectName: 'Library & Study Center',
    clientId: '14',
    clientName: 'Knowledge Hub',
    currentStage: 'Proposal',
    projectStatus: 'Active',
    totalProjectValue: 350000,
    assignedDesigner: 'Sarah Johnson',
    priorityLevel: 'Low',
    projectStartDate: '2024-03-01',
    expectedCompletionDate: '2024-06-01',
    createdAt: '2024-03-01T00:00:00Z',
    isActive: true
  },
  {
    _id: '15',
    dealId: 'DEAL-015',
    projectName: 'Art Gallery Space',
    clientId: '15',
    clientName: 'Creative Arts Gallery',
    currentStage: 'Negotiation',
    projectStatus: 'Active',
    totalProjectValue: 450000,
    assignedDesigner: 'Mike Chen',
    priorityLevel: 'Medium',
    projectStartDate: '2024-03-05',
    expectedCompletionDate: '2024-06-05',
    createdAt: '2024-03-05T00:00:00Z',
    isActive: true
  },
  {
    _id: '16',
    dealId: 'DEAL-016',
    projectName: 'Conference Center',
    clientId: '16',
    clientName: 'Business Solutions Inc',
    currentStage: 'Closed Won',
    projectStatus: 'Active',
    totalProjectValue: 1100000,
    assignedDesigner: 'Alex Kumar',
    priorityLevel: 'High',
    projectStartDate: '2024-03-10',
    expectedCompletionDate: '2024-06-10',
    createdAt: '2024-03-10T00:00:00Z',
    isActive: true
  }
];

// Use industry-specific data instead of static data
let payments = industryData.payments.length > 0 ? industryData.payments : [
  {
    _id: '1',
    paymentId: 'PAY-001',
    dealId: '1',
    clientId: '1',
    clientName: 'John Smith',
    invoiceNumber: 'INV-2024-001',
    amount: 48000,
    totalAmount: 48000,
    paymentStage: 'Design Fee',
    dueDate: '2024-01-25',
    status: 'Paid',
    paymentDate: '2024-01-20',
    createdAt: '2024-01-15T00:00:00Z',
    isActive: true
  },
  {
    _id: '2',
    paymentId: 'PAY-002',
    dealId: '1',
    clientId: '1',
    clientName: 'John Smith',
    invoiceNumber: 'INV-2024-002',
    amount: 250000,
    paymentStage: '50% Advance',
    dueDate: '2024-02-05',
    status: 'Sent',
    createdAt: '2024-01-28T00:00:00Z',
    isActive: true
  },
  {
    _id: '3',
    paymentId: 'PAY-003',
    dealId: '2',
    clientId: '2',
    clientName: 'Sarah Johnson',
    invoiceNumber: 'INV-2024-003',
    amount: 45000,
    paymentStage: 'Design Fee',
    dueDate: '2024-02-15',
    status: 'Overdue',
    createdAt: '2024-02-01T00:00:00Z',
    isActive: true
  },
  {
    _id: '4',
    paymentId: 'PAY-004',
    dealId: '3',
    clientId: '3',
    clientName: 'Rajesh Kumar',
    invoiceNumber: 'INV-2024-004',
    amount: 480000,
    totalAmount: 480000,
    paymentStage: '40% Interim',
    dueDate: '2024-02-20',
    status: 'Paid',
    paymentDate: '2024-02-18',
    createdAt: '2024-02-10T00:00:00Z',
    isActive: true
  },
  {
    _id: '5',
    paymentId: 'PAY-005',
    dealId: '4',
    clientId: '4',
    clientName: 'Priya Sharma',
    invoiceNumber: 'INV-2024-005',
    amount: 30000,
    paymentStage: 'Final 10% Payment',
    dueDate: '2024-01-15',
    status: 'Paid',
    paymentDate: '2024-01-10',
    createdAt: '2024-01-01T00:00:00Z',
    isActive: true
  }
];

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

// Authentication Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.isActive);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // For demo purposes, use simple password comparison
    const isMatch = password === 'admin123';
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const user = users.find(u => u._id === decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Leads Routes
app.get('/api/leads', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch leads', error: error.message });
  }
});

app.post('/api/leads', (req, res) => {
  try {
    const newLead = {
      _id: (leads.length + 1).toString(),
      leadId: `LEAD-${String(leads.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date().toISOString()
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

// Enhanced Lead to Project Conversion
app.post('/api/leads/:id/convert-to-project', (req, res) => {
  try {
    const leadId = req.params.id;
    const lead = leads.find(l => l._id === leadId && l.isActive);
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check if client already exists, if not create one
    let client = clients.find(c => c.email === lead.email && c.isActive);
    if (!client) {
      const newClient = {
        _id: (clients.length + 1).toString(),
        clientId: `CLI-${String(clients.length + 1).padStart(3, '0')}`,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        stylePreferences: lead.projectType === 'Luxury' ? ['Luxury', 'Modern'] : ['Modern', 'Contemporary'],
        targetBudget: lead.budget,
        leadSource: lead.leadSource,
        isActive: true,
        createdAt: new Date()
      };
      clients.push(newClient);
      client = newClient;
    }

    // Intelligent field mapping from lead to project with COMPREHENSIVE SCHEMA
    const projectData = {
      _id: (deals.length + 1).toString(),
      dealId: `DEAL-${String(deals.length + 1).padStart(3, '0')}`,
      projectName: `${lead.name} - ${lead.projectType} Project`,
      clientId: client._id,
      clientName: client.name,
      
      // === LEAD DETAILS REFERENCE ===
      leadDetails: {
        originalLeadId: lead.leadId,
        leadSource: lead.leadSource,
        leadName: lead.name,
        leadEmail: lead.email,
        leadPhone: lead.phone,
        leadCompany: lead.company
      },
      
      // === PROPERTY TYPE ===
      propertyType: {
        dealType: lead.projectType === 'Commercial' ? 'Commercial' : 'Residential',
        propertyType: lead.projectType === 'Commercial' ? 
          (lead.requirements.includes('office') ? 'Commercial - Office Spaces' : 
           lead.requirements.includes('healthcare') ? 'Commercial - Healthcare' :
           lead.requirements.includes('restaurant') ? 'Commercial - Restaurant' : 'Commercial - Retail Shops') :
          (lead.requirements.includes('villa') ? 'Residential - Villa' : 
           lead.requirements.includes('house') ? 'Residential - Independent House' : 'Residential - Apartment')
      },
      
      // === SIZE ===
      size: {
        area: lead.requirements.includes('3BHK') ? 1200 : 
              lead.requirements.includes('2BHK') ? 1000 : 
              lead.requirements.includes('4BHK') ? 1500 : 
              lead.requirements.includes('1BHK') ? 800 : 1000,
        bhk: lead.requirements.includes('3BHK') ? 3 : 
             lead.requirements.includes('2BHK') ? 2 : 
             lead.requirements.includes('4BHK') ? 4 : 
             lead.requirements.includes('1BHK') ? 1 : 2,
        unit: 'Sqft',
        displayText: `${lead.requirements.includes('3BHK') ? 1200 : 
                      lead.requirements.includes('2BHK') ? 1000 : 
                      lead.requirements.includes('4BHK') ? 1500 : 
                      lead.requirements.includes('1BHK') ? 800 : 1000} Sqft, ${lead.requirements.includes('3BHK') ? '3BHK' : 
                      lead.requirements.includes('2BHK') ? '2BHK' : 
                      lead.requirements.includes('4BHK') ? '4BHK' : 
                      lead.requirements.includes('1BHK') ? '1BHK' : '2BHK'}`
      },
      
      // === LOCATION ===
      location: {
        address: req.body.address || 'To be confirmed',
        city: req.body.city || 'To be confirmed',
        state: req.body.state || 'To be confirmed',
        pincode: req.body.pincode || null,
        coordinates: req.body.coordinates || null
      },
      
      // === CONSTRUCTION STATUS ===
      constructionStatus: req.body.constructionStatus || 'Under Construction',
      
      // === TENTATIVE HANDOVER DATE ===
      handoverDate: {
        tentativeHandoverDate: req.body.tentativeHandoverDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isFlexible: req.body.isFlexible || true,
        notes: req.body.handoverNotes || null
      },
      
      // === CATEGORY ===
      category: lead.budget > 1000000 ? 'Luxury' : 'Standard',
      
      // === SPECIAL REQUIREMENTS ===
      specialRequirements: {
        requirements: lead.requirements,
        tags: [lead.projectType, lead.leadSource],
        priority: lead.priority === 'High' ? 'High' : lead.priority === 'Medium' ? 'Medium' : 'Low'
      },
      
      // === PROJECT MANAGEMENT ===
      currentStage: 'Lead',
      projectStatus: 'Active',
      totalProjectValue: lead.budget,
      projectStartDate: new Date().toISOString().split('T')[0],
      expectedCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      
      // === ASSIGNED TEAM ===
      assignedTeam: {
        assignedDesigner: lead.assignedTo,
        assignedPM: req.body.assignedPM || 'To be assigned',
        assignedSales: req.body.assignedSales || null,
        teamMembers: [lead.assignedTo],
        assignmentDate: new Date().toISOString().split('T')[0],
        assignmentNotes: 'Auto-assigned from lead conversion'
      },
      
      // === DESIGN PACKAGE ===
      designPackage: {
        packageType: lead.budget > 1000000 ? 'Luxury' : 'Standard',
        features: lead.budget > 1000000 ? 
          ['3D Visualization', 'Material Selection', 'Site Visits', 'Premium Materials', 'Custom Design'] :
          ['2D Layouts', 'Basic Material Selection', 'Design Consultation'],
        deliverables: lead.budget > 1000000 ?
          ['3D Renders', 'Material Samples', 'Detailed Drawings', 'Mood Boards'] :
          ['2D Layouts', 'Material List', 'Basic Drawings'],
        timeline: lead.budget > 1000000 ? 60 : 30,
        price: lead.budget,
        customizations: []
      },
      
      // === DESIGN STATUS TRACKING ===
      designStatus: {
        moodBoardShared: false,
        moodBoardDate: null,
        moodBoardFeedback: null,
        
        design3DStatus: 'Not Started',
        design3DProgress: 0,
        design3DVersion: '1.0',
        design3DLastUpdated: new Date().toISOString(),
        
        design2DStatus: 'Not Started',
        design2DProgress: 0,
        design2DVersion: '1.0',
        design2DLastUpdated: new Date().toISOString(),
        
        materialSelectionStatus: 'Not Started',
        materialSelectionProgress: 0,
        materialSelectionDate: null,
        
        clientApprovalDate: null,
        revisionCount: 0,
        lastRevisionDate: null
      },
      
      // === ACTIVITIES TAB FIELDS ===
      activities: {
        tasks: [],
        calls: [],
        meetings: [],
        presentations: [],
        surveys: [],
        interviews: []
      },
      
      // === ADDITIONAL PROJECT FIELDS ===
      projectDescription: lead.requirements,
      projectNotes: lead.notes || '',
      projectTags: [lead.projectType, lead.leadSource],
      
      // === LEAD SOURCE SPECIFIC DATA ===
      referralDetails: lead.leadSource === 'Referral' ? {
        referrerName: req.body.referrerName || 'Not specified',
        referrerContact: req.body.referrerContact || 'Not specified',
        referrerProjectNumber: req.body.referrerProjectNumber || 'Not specified'
      } : null,
      
      paidLeadDetails: lead.leadSource === 'Paid Lead' ? {
        agentName: req.body.agentName || 'Not specified',
        agencyName: req.body.agencyName || 'Not specified',
        agentContact: req.body.agentContact || 'Not specified'
      } : null,
      
      socialMediaDetails: ['Instagram', 'Facebook', 'YouTube'].includes(lead.leadSource) ? {
        platform: lead.leadSource,
        campaignName: req.body.campaignName || 'Not specified',
        postUrl: req.body.postUrl || 'Not specified'
      } : null,
      
      walkInDetails: ['Walk-In', 'Expo'].includes(lead.leadSource) ? {
        sourceType: lead.leadSource,
        eventName: req.body.eventName || 'Not specified',
        boothNumber: req.body.boothNumber || 'Not specified'
      } : null,
      
      // === SYSTEM FIELDS ===
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      createdBy: 'System',
      lastModifiedBy: 'System'
    };

    // Add the new project
    deals.push(projectData);

    // Update lead status to converted
    const leadIndex = leads.findIndex(l => l._id === leadId);
    leads[leadIndex].leadStatus = 'Converted';
    leads[leadIndex].convertedAt = new Date().toISOString();

    res.status(201).json({ 
      message: 'Lead converted to project successfully', 
      project: projectData,
      client: client,
      lead: leads[leadIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to convert lead to project', error: error.message });
  }
});

// Design Status Management Routes
app.get('/api/projects/:id/design-status', (req, res) => {
  try {
    const project = deals.find(d => d._id === req.params.id && d.isActive);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ designStatus: project.designStatus || {} });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch design status', error: error.message });
  }
});

app.put('/api/projects/:id/design-status', (req, res) => {
  try {
    const projectIndex = deals.findIndex(d => d._id === req.params.id && d.isActive);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    deals[projectIndex].designStatus = {
      ...deals[projectIndex].designStatus,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    deals[projectIndex].updatedAt = new Date().toISOString();
    
    res.json({ message: 'Design status updated successfully', designStatus: deals[projectIndex].designStatus });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update design status', error: error.message });
  }
});

// Team Assignment Routes
app.get('/api/projects/:id/team', (req, res) => {
  try {
    const project = deals.find(d => d._id === req.params.id && d.isActive);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ assignedTeam: project.assignedTeam || {} });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team assignment', error: error.message });
  }
});

app.put('/api/projects/:id/team', (req, res) => {
  try {
    const projectIndex = deals.findIndex(d => d._id === req.params.id && d.isActive);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    deals[projectIndex].assignedTeam = {
      ...deals[projectIndex].assignedTeam,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    deals[projectIndex].updatedAt = new Date().toISOString();
    
    res.json({ message: 'Team assignment updated successfully', assignedTeam: deals[projectIndex].assignedTeam });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update team assignment', error: error.message });
  }
});

// Design Package Routes
app.get('/api/projects/:id/design-package', (req, res) => {
  try {
    const project = deals.find(d => d._id === req.params.id && d.isActive);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ designPackage: project.designPackage || {} });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch design package', error: error.message });
  }
});

app.put('/api/projects/:id/design-package', (req, res) => {
  try {
    const projectIndex = deals.findIndex(d => d._id === req.params.id && d.isActive);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    deals[projectIndex].designPackage = {
      ...deals[projectIndex].designPackage,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    deals[projectIndex].updatedAt = new Date().toISOString();
    
    res.json({ message: 'Design package updated successfully', designPackage: deals[projectIndex].designPackage });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update design package', error: error.message });
  }
});

// Activities Management Routes
app.get('/api/projects/:id/activities', (req, res) => {
  try {
    const project = deals.find(d => d._id === req.params.id && d.isActive);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ activities: project.activities || { tasks: [], calls: [], meetings: [], presentations: [], surveys: [], interviews: [] } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch activities', error: error.message });
  }
});

app.post('/api/projects/:id/activities/:type', (req, res) => {
  try {
    const projectIndex = deals.findIndex(d => d._id === req.params.id && d.isActive);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const activityType = req.params.type; // tasks, calls, meetings, presentations, surveys, interviews
    const newActivity = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    if (!deals[projectIndex].activities) {
      deals[projectIndex].activities = { tasks: [], calls: [], meetings: [], presentations: [], surveys: [], interviews: [] };
    }
    
    deals[projectIndex].activities[activityType].push(newActivity);
    deals[projectIndex].updatedAt = new Date().toISOString();
    
    res.status(201).json({ message: 'Activity added successfully', activity: newActivity });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add activity', error: error.message });
  }
});

app.put('/api/projects/:id/activities/:type/:activityId', (req, res) => {
  try {
    const projectIndex = deals.findIndex(d => d._id === req.params.id && d.isActive);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const activityType = req.params.type;
    const activityId = req.params.activityId;
    
    if (!deals[projectIndex].activities || !deals[projectIndex].activities[activityType]) {
      return res.status(404).json({ message: 'Activity type not found' });
    }
    
    const activityIndex = deals[projectIndex].activities[activityType].findIndex(a => a.id === activityId);
    if (activityIndex === -1) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    deals[projectIndex].activities[activityType][activityIndex] = {
      ...deals[projectIndex].activities[activityType][activityIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    deals[projectIndex].updatedAt = new Date().toISOString();
    
    res.json({ message: 'Activity updated successfully', activity: deals[projectIndex].activities[activityType][activityIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update activity', error: error.message });
  }
});

app.delete('/api/projects/:id/activities/:type/:activityId', (req, res) => {
  try {
    const projectIndex = deals.findIndex(d => d._id === req.params.id && d.isActive);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const activityType = req.params.type;
    const activityId = req.params.activityId;
    
    if (!deals[projectIndex].activities || !deals[projectIndex].activities[activityType]) {
      return res.status(404).json({ message: 'Activity type not found' });
    }
    
    const activityIndex = deals[projectIndex].activities[activityType].findIndex(a => a.id === activityId);
    if (activityIndex === -1) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    
    deals[projectIndex].activities[activityType].splice(activityIndex, 1);
    deals[projectIndex].updatedAt = new Date().toISOString();
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete activity', error: error.message });
  }
});

// Clients Routes
app.get('/api/clients', (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let filteredClients = clients.filter(c => c.isActive !== false);
    
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clients', error: error.message });
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

// Designers Routes

// Get all designers
app.get('/api/designers', (req, res) => {
  try {
    const { page = 1, limit = 10, search, availability, role } = req.query;
    
    let filteredDesigners = designers.filter(d => d.isActive);
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDesigners = filteredDesigners.filter(designer => 
        designer.name.toLowerCase().includes(searchLower) ||
        designer.email.toLowerCase().includes(searchLower) ||
        designer.role.toLowerCase().includes(searchLower) ||
        designer.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }
    
    // Availability filter
    if (availability) {
      filteredDesigners = filteredDesigners.filter(designer => designer.availability === availability);
    }
    
    // Role filter
    if (role) {
      filteredDesigners = filteredDesigners.filter(designer => designer.role === role);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedDesigners = filteredDesigners.slice(startIndex, endIndex);
    
    res.json({
      designers: paginatedDesigners,
      total: filteredDesigners.length,
      page: parseInt(page),
      pages: Math.ceil(filteredDesigners.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch designers', error: error.message });
  }
});

// Get single designer
app.get('/api/designers/:id', (req, res) => {
  try {
    const designer = designers.find(d => d.id === req.params.id && d.isActive);
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    res.json(designer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch designer', error: error.message });
  }
});

// Create new designer
app.post('/api/designers', (req, res) => {
  try {
    const newDesigner = {
      id: (designers.length + 1).toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    designers.push(newDesigner);
    res.status(201).json({ message: 'Designer created successfully', designer: newDesigner });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create designer', error: error.message });
  }
});

// Update designer
app.put('/api/designers/:id', (req, res) => {
  try {
    const designerIndex = designers.findIndex(designer => designer.id === req.params.id);
    if (designerIndex === -1) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    designers[designerIndex] = { 
      ...designers[designerIndex], 
      ...req.body, 
      updatedAt: new Date().toISOString() 
    };
    
    res.json({ message: 'Designer updated successfully', designer: designers[designerIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update designer', error: error.message });
  }
});

// Delete designer (soft delete)
app.delete('/api/designers/:id', (req, res) => {
  try {
    const designerIndex = designers.findIndex(designer => designer.id === req.params.id);
    if (designerIndex === -1) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    designers[designerIndex].isActive = false;
    designers[designerIndex].updatedAt = new Date().toISOString();
    
    res.json({ message: 'Designer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete designer', error: error.message });
  }
});

// Send email to designer
app.post('/api/designers/:id/send-email', (req, res) => {
  try {
    const designer = designers.find(d => d.id === req.params.id && d.isActive);
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    if (!designer.emailEnabled) {
      return res.status(400).json({ message: 'Email notifications are disabled for this designer' });
    }
    
    const { subject, message, projectId } = req.body;
    
    // Mock email sending - in real implementation, integrate with email service
    console.log(`📧 Email sent to ${designer.name} (${designer.email})`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Message: ${message}`);
    if (projectId) {
      console.log(`   Project ID: ${projectId}`);
    }
    
    res.json({ 
      message: 'Email sent successfully', 
      recipient: designer.name,
      email: designer.email,
      subject,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

// Send SMS to designer
app.post('/api/designers/:id/send-sms', (req, res) => {
  try {
    const designer = designers.find(d => d.id === req.params.id && d.isActive);
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    if (!designer.smsEnabled) {
      return res.status(400).json({ message: 'SMS notifications are disabled for this designer' });
    }
    
    const { message, projectId } = req.body;
    
    // Mock SMS sending - in real implementation, integrate with SMS service
    console.log(`📱 SMS sent to ${designer.name} (${designer.phone})`);
    console.log(`   Message: ${message}`);
    if (projectId) {
      console.log(`   Project ID: ${projectId}`);
    }
    
    res.json({ 
      message: 'SMS sent successfully', 
      recipient: designer.name,
      phone: designer.phone,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send SMS', error: error.message });
  }
});

// Deals Routes

// Update project stage
app.put('/api/deals/:id/stage', (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    
    const dealIndex = deals.findIndex(deal => deal._id === id);
    if (dealIndex === -1) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    deals[dealIndex].currentStage = stage;
    deals[dealIndex].updatedAt = new Date().toISOString();
    
    res.json({
      message: 'Project stage updated successfully',
      deal: deals[dealIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update project stage', error: error.message });
  }
});

app.get('/api/deals', (req, res) => {
  try {
    const { page = 1, limit = 10, stage, status } = req.query;
    
    let filteredDeals = deals.filter(d => d.isActive !== false);
    
    if (stage) {
      filteredDeals = filteredDeals.filter(d => d.currentStage === stage);
    }
    
    if (status) {
      filteredDeals = filteredDeals.filter(d => d.projectStatus === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedDeals = filteredDeals.slice(startIndex, endIndex);

    res.json({
      deals: paginatedDeals,
      totalPages: Math.ceil(filteredDeals.length / limit),
      currentPage: parseInt(page),
      total: filteredDeals.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deals', error: error.message });
  }
});

app.post('/api/deals', (req, res) => {
  try {
    console.log('📝 Creating new deal with data:', req.body);
    
    // Validate required fields
    if (!req.body.projectName || !req.body.clientId) {
      return res.status(400).json({ 
        message: 'Project name and client ID are required.' 
      });
    }

    // Check for duplicate project name (case-insensitive)
    const existingDeal = deals.find(deal => 
      deal.projectName && req.body.projectName &&
      deal.projectName.toLowerCase().trim() === req.body.projectName.toLowerCase().trim() && 
      deal.isActive
    );
    
    if (existingDeal) {
      console.log('❌ Duplicate project name found:', req.body.projectName);
      return res.status(400).json({ 
        message: `A project with the name "${req.body.projectName}" already exists. Please choose a different name.` 
      });
    }

    // Get client name if clientId is provided
    let clientName = req.body.clientName || 'Unknown Client';
    if (req.body.clientId && !clientName) {
      const client = clients.find(c => c._id === req.body.clientId);
      clientName = client ? client.name : 'Unknown Client';
    }

    const newDeal = {
      _id: (deals.length + 1).toString(),
      dealId: `DEAL-${String(deals.length + 1).padStart(3, '0')}`,
      projectName: req.body.projectName.trim(),
      clientId: req.body.clientId,
      clientName: clientName,
      currentStage: req.body.currentStage || 'ToDo',
      projectStatus: req.body.projectStatus || 'Active',
      totalProjectValue: req.body.totalProjectValue || 0,
      assignedDesigner: req.body.assignedDesigner || '',
      priorityLevel: req.body.priorityLevel || 'Medium',
      projectStartDate: req.body.projectStartDate || new Date().toISOString().split('T')[0],
      expectedCompletionDate: req.body.expectedCompletionDate,
      description: req.body.description || '',
      notes: req.body.notes || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    deals.push(newDeal);
    console.log('✅ Deal created successfully:', newDeal.dealId, newDeal.projectName);
    
    res.status(201).json({ message: 'Deal created successfully', deal: newDeal });
  } catch (error) {
    console.error('❌ Error creating deal:', error);
    res.status(500).json({ message: 'Failed to create deal', error: error.message });
  }
});

app.put('/api/deals/:id', (req, res) => {
  try {
    console.log('🔄 PUT /api/deals/:id - Request:', { id: req.params.id, body: req.body });
    const dealIndex = deals.findIndex(deal => deal._id === req.params.id);
    if (dealIndex === -1) {
      console.log('❌ Deal not found:', req.params.id);
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    console.log('📊 Found deal:', { 
      id: deals[dealIndex]._id, 
      name: deals[dealIndex].projectName, 
      currentStage: deals[dealIndex].currentStage 
    });
    
    // Handle notes history separately
    if (req.body.notes && req.body.notes.trim()) {
      const newNote = {
        id: `note-${Date.now()}`,
        content: req.body.notes.trim(),
        addedBy: req.body.addedBy || 'System',
        addedAt: new Date().toISOString(),
        type: req.body.noteType || 'general'
      };
      
      // Initialize notesHistory if it doesn't exist
      if (!deals[dealIndex].notesHistory) {
        deals[dealIndex].notesHistory = [];
      }
      
      // Add new note to history
      deals[dealIndex].notesHistory.push(newNote);
      
      // Remove the notes field from req.body to avoid overwriting notesHistory
      const { notes, addedBy, noteType, ...updateData } = req.body;
      deals[dealIndex] = { ...deals[dealIndex], ...updateData };
    } else {
      deals[dealIndex] = { ...deals[dealIndex], ...req.body };
    }
    
    console.log('✅ Deal updated:', { 
      id: deals[dealIndex]._id, 
      name: deals[dealIndex].projectName, 
      newStage: deals[dealIndex].currentStage 
    });
    
    res.json({ message: 'Deal updated successfully', deal: deals[dealIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update deal', error: error.message });
  }
});

// Payments Routes
app.get('/api/payments', (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filteredPayments = payments.filter(p => p.isActive);
    
    if (status) {
      filteredPayments = filteredPayments.filter(p => p.status === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

    res.json({
      payments: paginatedPayments,
      totalPages: Math.ceil(filteredPayments.length / limit),
      currentPage: parseInt(page),
      total: filteredPayments.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments', error: error.message });
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
      createdAt: new Date().toISOString()
    };
    payments.push(newPayment);
    res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment', error: error.message });
  }
});

// Warranty Routes
app.get('/api/warranties', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch warranties', error: error.message });
  }
});

app.post('/api/warranties', (req, res) => {
  try {
    const newWarranty = {
      _id: (warranties.length + 1).toString(),
      warrantyId: `WAR-${String(warranties.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    warranties.push(newWarranty);
    res.status(201).json({ message: 'Warranty created successfully', warranty: newWarranty });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create warranty', error: error.message });
  }
});

// Anniversary Routes
app.get('/api/anniversaries', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch anniversaries', error: error.message });
  }
});

app.post('/api/anniversaries', (req, res) => {
  try {
    const newAnniversary = {
      _id: (anniversaries.length + 1).toString(),
      anniversaryId: `ANN-${String(anniversaries.length + 1).padStart(3, '0')}`,
      ...req.body,
      isActive: true,
      createdAt: new Date().toISOString()
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
      sentDate: new Date().toISOString()
    };
    res.json({ message: 'Anniversary message sent successfully', anniversary: anniversaries[anniversaryIndex] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send anniversary message', error: error.message });
  }
});

// Dashboard Stats Route
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const totalPipeline = deals.filter(d => d.isActive && d.projectStatus === 'Active')
      .reduce((sum, deal) => sum + deal.totalProjectValue, 0);
    
    const overduePayments = payments.filter(p => p.isActive && p.status === 'Overdue').length;
    
    const activeProjects = deals.filter(d => d.isActive && d.projectStatus === 'Active').length;
    
    const totalLeads = leads.filter(l => l.isActive).length;
    
    const convertedLeads = leads.filter(l => l.isActive && l.leadStatus === 'Converted').length;
    
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads * 100).toFixed(1) : 0;

    res.json({
      totalPipeline,
      overduePayments,
      activeProjects,
      totalLeads,
      convertedLeads,
      conversionRate: parseFloat(conversionRate)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
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

// Single deal endpoint
app.get('/api/deals/:id', (req, res) => {
  try {
    const deal = deals.find(d => d._id === req.params.id && d.isActive);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    res.json({ deal });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deal', error: error.message });
  }
});

// Sample valued customers data
let valuedCustomers = [
  {
    _id: '1',
    clientId: '1',
    clientName: 'John Smith',
    email: 'john@example.com',
    phone: '+91-9876543210',
    company: 'John Smith Enterprises',
    isValued: true,
    valuedSince: '2024-01-15T00:00:00Z',
    totalProjects: 2,
    totalValue: 850000,
    npsScore: 9,
    referralCount: 3,
    testimonials: [
      {
        _id: '1',
        projectId: '1',
        projectName: 'Modern Apartment Design',
        rating: 5,
        review: 'Exceptional service and attention to detail. The team exceeded our expectations and delivered a beautiful, functional space.',
        isPublic: true,
        date: '2024-01-20T00:00:00Z',
        mediaUrls: ['/testimonials/john-apartment.jpg']
      }
    ],
    projectMedia: [
      {
        _id: '1',
        projectId: '1',
        projectName: 'Modern Apartment Design',
        type: 'photo',
        url: '/media/john-apartment-living-room.jpg',
        caption: 'Beautiful living room with modern furniture',
        date: '2024-01-25T00:00:00Z',
        isPublic: true
      },
      {
        _id: '2',
        projectId: '1',
        projectName: 'Modern Apartment Design',
        type: 'photo',
        url: '/media/john-apartment-kitchen.jpg',
        caption: 'Modern kitchen with premium finishes',
        date: '2024-01-25T00:00:00Z',
        isPublic: true
      }
    ],
    anniversaries: [
      {
        _id: '1',
        type: 'project_completion',
        date: '2024-01-25',
        title: 'Project Completion Anniversary',
        message: 'Celebrating one year of your beautiful modern apartment!',
        sentDate: '2024-01-25T00:00:00Z',
        status: 'sent'
      }
    ],
    rewards: [
      {
        _id: '1',
        type: 'referral_bonus',
        title: 'Referral Bonus',
        description: 'Bonus for referring 3 new clients',
        value: 25000,
        status: 'awarded',
        date: '2024-02-01T00:00:00Z'
      }
    ],
    handoverDates: [
      {
        _id: '1',
        projectId: '1',
        projectName: 'Modern Apartment Design',
        handoverDate: '2024-01-25T00:00:00Z',
        satisfaction: 5,
        feedback: 'Perfect handover process, everything was exactly as promised.'
      }
    ],
    lastContactDate: '2024-02-15T00:00:00Z',
    nextFollowUpDate: '2024-03-15T00:00:00Z',
    notes: 'Excellent client, always punctual with payments, very satisfied with our work.',
    tags: ['valued', 'referral_source', 'high_satisfaction'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    _id: '2',
    clientId: '2',
    clientName: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+91-9876543211',
    company: 'Johnson Enterprises',
    isValued: true,
    valuedSince: '2024-01-20T00:00:00Z',
    totalProjects: 1,
    totalValue: 1500000,
    npsScore: 10,
    referralCount: 2,
    testimonials: [
      {
        _id: '2',
        projectId: '2',
        projectName: 'Luxury Villa Interior Design',
        rating: 5,
        review: 'Outstanding luxury design that transformed our villa into a dream home. Highly recommend!',
        isPublic: true,
        date: '2024-01-28T00:00:00Z'
      }
    ],
    projectMedia: [
      {
        _id: '3',
        projectId: '2',
        projectName: 'Luxury Villa Interior Design',
        type: 'photo',
        url: '/media/sarah-villa-master-bedroom.jpg',
        caption: 'Luxurious master bedroom with premium finishes',
        date: '2024-01-30T00:00:00Z',
        isPublic: true
      }
    ],
    anniversaries: [],
    rewards: [
      {
        _id: '2',
        type: 'nps_reward',
        title: 'NPS Champion Reward',
        description: 'Reward for giving us a perfect NPS score',
        value: 15000,
        status: 'awarded',
        date: '2024-02-01T00:00:00Z'
      }
    ],
    handoverDates: [
      {
        _id: '2',
        projectId: '2',
        projectName: 'Luxury Villa Interior Design',
        handoverDate: '2024-01-28T00:00:00Z',
        satisfaction: 5,
        feedback: 'Beyond expectations! The luxury finishes and attention to detail are exceptional.'
      }
    ],
    lastContactDate: '2024-02-10T00:00:00Z',
    nextFollowUpDate: '2024-03-10T00:00:00Z',
    notes: 'Luxury client with high standards, very pleased with our premium service.',
    tags: ['valued', 'luxury', 'nps_champion'],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z'
  },
  {
    _id: '3',
    clientId: '3',
    clientName: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543213',
    company: 'Kumar Technologies',
    isValued: false,
    valuedSince: null,
    totalProjects: 1,
    totalValue: 800000,
    npsScore: 7,
    referralCount: 0,
    testimonials: [],
    projectMedia: [],
    anniversaries: [],
    rewards: [],
    handoverDates: [
      {
        _id: '3',
        projectId: '3',
        projectName: 'Office Space Design',
        handoverDate: '2024-02-01T00:00:00Z',
        satisfaction: 4,
        feedback: 'Good work overall, some minor issues but resolved quickly.'
      }
    ],
    lastContactDate: '2024-02-01T00:00:00Z',
    nextFollowUpDate: '2024-03-01T00:00:00Z',
    notes: 'Regular client, satisfied with work, potential for future projects.',
    tags: ['regular', 'office', 'potential_valued'],
    createdAt: '2024-01-23T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  }
];

// Valued Customers API endpoints
app.get('/api/valued-customers', (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    let filteredCustomers = valuedCustomers;
    
    // Filter by status
    if (status && status !== 'All') {
      filteredCustomers = filteredCustomers.filter(customer => 
        status === 'Valued' ? customer.isValued : !customer.isValued
      );
    }
    
    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.clientName.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.company?.toLowerCase().includes(searchTerm)
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
    
    res.json({
      valuedCustomers: paginatedCustomers,
      total: filteredCustomers.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredCustomers.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch valued customers', error: error.message });
  }
});

app.get('/api/valued-customers/:id', (req, res) => {
  try {
    const customer = valuedCustomers.find(c => c._id === req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Valued customer not found' });
    }
    
    res.json({ customer });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch valued customer', error: error.message });
  }
});

app.put('/api/valued-customers/:id/mark-valued', (req, res) => {
  try {
    const customerIndex = valuedCustomers.findIndex(c => c._id === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    valuedCustomers[customerIndex].isValued = !valuedCustomers[customerIndex].isValued;
    valuedCustomers[customerIndex].valuedSince = valuedCustomers[customerIndex].isValued ? 
      new Date().toISOString() : null;
    valuedCustomers[customerIndex].updatedAt = new Date().toISOString();
    
    res.json({ 
      message: `Customer ${valuedCustomers[customerIndex].isValued ? 'marked as valued' : 'removed from valued'}`,
      customer: valuedCustomers[customerIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update customer status', error: error.message });
  }
});

app.post('/api/valued-customers/:id/testimonials', (req, res) => {
  try {
    const customerIndex = valuedCustomers.findIndex(c => c._id === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    const newTestimonial = {
      _id: (valuedCustomers[customerIndex].testimonials.length + 1).toString(),
      ...req.body,
      date: new Date().toISOString()
    };
    
    valuedCustomers[customerIndex].testimonials.push(newTestimonial);
    valuedCustomers[customerIndex].updatedAt = new Date().toISOString();
    
    res.status(201).json({ 
      message: 'Testimonial added successfully',
      testimonial: newTestimonial
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add testimonial', error: error.message });
  }
});

app.put('/api/valued-customers/:id/follow-up', (req, res) => {
  try {
    const customerIndex = valuedCustomers.findIndex(c => c._id === req.params.id);
    
    if (customerIndex === -1) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    valuedCustomers[customerIndex].nextFollowUpDate = req.body.nextFollowUpDate;
    valuedCustomers[customerIndex].lastContactDate = new Date().toISOString();
    valuedCustomers[customerIndex].updatedAt = new Date().toISOString();
    
    res.json({ 
      message: 'Follow-up scheduled successfully',
      customer: valuedCustomers[customerIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to schedule follow-up', error: error.message });
  }
});

// Sample documents data
// Use industry-specific data instead of static data
let documents = industryData.documents.length > 0 ? industryData.documents : [
  {
    _id: '1',
    documentId: 'DOC-001',
    name: 'Project Proposal - Modern Apartment',
    type: 'Proposal',
    clientId: '1',
    clientName: 'John Smith',
    projectId: '1',
    projectName: 'Modern Apartment Design',
    size: '2.5 MB',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2024-01-15T10:30:00Z',
    access: 'Team',
    url: '/documents/proposal-modern-apartment.pdf',
    description: 'Initial project proposal and scope of work',
    tags: ['proposal', 'residential', 'modern'],
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    documentId: 'DOC-002',
    name: '3D Design Renders',
    type: 'Design',
    clientId: '2',
    clientName: 'Sarah Johnson',
    projectId: '2',
    projectName: 'Luxury Villa Interior Design',
    size: '15.2 MB',
    uploadedBy: 'Mike Chen',
    uploadDate: '2024-01-20T14:15:00Z',
    access: 'Client',
    url: '/documents/3d-renders-villa.pdf',
    description: '3D visualization renders for luxury villa',
    tags: ['design', '3d', 'luxury', 'villa'],
    isActive: true,
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    _id: '3',
    documentId: 'DOC-003',
    name: 'Material Selection Sheet',
    type: 'Specification',
    clientId: '3',
    clientName: 'Rajesh Kumar',
    projectId: '3',
    projectName: 'Office Space Design',
    size: '1.8 MB',
    uploadedBy: 'Sarah Johnson',
    uploadDate: '2024-01-25T09:45:00Z',
    access: 'Team',
    url: '/documents/material-selection-office.pdf',
    description: 'Detailed material specifications and selections',
    tags: ['materials', 'office', 'commercial'],
    isActive: true,
    createdAt: '2024-01-25T09:45:00Z',
    updatedAt: '2024-01-25T09:45:00Z'
  }
];

// Documents API endpoints
app.get('/api/documents', (req, res) => {
  try {
    const { page = 1, limit = 10, type, search, clientId } = req.query;
    
    let filteredDocuments = documents.filter(doc => doc.isActive);
    
    // Filter by clientId
    if (clientId) {
      filteredDocuments = filteredDocuments.filter(doc => doc.clientId === clientId);
    }
    
    // Filter by type
    if (type && type !== 'all') {
      filteredDocuments = filteredDocuments.filter(doc => doc.type === type);
    }
    
    // Filter by search term
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredDocuments = filteredDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm) ||
        doc.clientName.toLowerCase().includes(searchTerm) ||
        doc.projectName.toLowerCase().includes(searchTerm)
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);
    
    res.json({
      documents: paginatedDocuments,
      total: filteredDocuments.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(filteredDocuments.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
  }
});

app.get('/api/documents/:id', (req, res) => {
  try {
    const document = documents.find(doc => doc._id === req.params.id && doc.isActive);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json({ document });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch document', error: error.message });
  }
});

app.post('/api/documents', upload.single('file'), (req, res) => {
  try {
    const file = req.file;
    const { clientId, projectId, description, tags } = req.body;
    
    // Find client and project names
    const client = clients.find(c => c._id === clientId);
    const project = deals.find(d => d._id === projectId);
    
    const newDocument = {
      _id: (documents.length + 1).toString(),
      documentId: `DOC-${String(documents.length + 1).padStart(3, '0')}`,
      name: file ? file.originalname : req.body.name || 'Untitled Document',
      type: file ? file.mimetype.split('/')[1].toUpperCase() : req.body.type || 'Other',
      clientId: clientId || null,
      clientName: client ? client.name : 'Unknown Client',
      projectId: projectId || null,
      projectName: project ? project.projectName : 'No Project',
      size: file ? `${(file.size / 1024).toFixed(1)} KB` : req.body.size || '0 KB',
      uploadedBy: 'Current User', // In real app, get from auth
      uploadDate: new Date().toISOString(),
      access: req.body.access || 'Team',
      url: file ? `/uploads/${file.originalname}` : req.body.url || '',
      description: description || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fileData: file ? {
        buffer: file.buffer.toString('base64'),
        mimetype: file.mimetype,
        originalname: file.originalname
      } : null
    };
    
    documents.push(newDocument);
    
    res.status(201).json({ 
      message: 'Document uploaded successfully', 
      document: newDocument 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload document', error: error.message });
  }
});

app.put('/api/documents/:id', (req, res) => {
  try {
    const documentIndex = documents.findIndex(doc => doc._id === req.params.id && doc.isActive);
    
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    documents[documentIndex] = {
      ...documents[documentIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ 
      message: 'Document updated successfully', 
      document: documents[documentIndex] 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update document', error: error.message });
  }
});

app.delete('/api/documents/:id', (req, res) => {
  try {
    const documentIndex = documents.findIndex(doc => doc._id === req.params.id && doc.isActive);
    
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    documents[documentIndex].isActive = false;
    documents[documentIndex].updatedAt = new Date().toISOString();
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete document', error: error.message });
  }
});

// Invoice Routes
app.get('/api/invoices', (req, res) => {
  try {
    const { page = 1, limit = 10, projectId, status, stage } = req.query;
    
    let filteredInvoices = invoices.filter(inv => inv.isActive);
    
    if (projectId) {
      filteredInvoices = filteredInvoices.filter(inv => inv.projectId === projectId);
    }
    
    if (status) {
      filteredInvoices = filteredInvoices.filter(inv => inv.paymentStatus === status);
    }
    
    if (stage) {
      filteredInvoices = filteredInvoices.filter(inv => inv.invoiceStage === stage);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

    res.json({
      invoices: paginatedInvoices,
      totalCount: filteredInvoices.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredInvoices.length / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices', error: error.message });
  }
});

app.get('/api/invoices/:id', (req, res) => {
  try {
    const { id } = req.params;
    const invoice = invoices.find(inv => inv._id === id && inv.isActive);
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoice', error: error.message });
  }
});

app.post('/api/invoices', (req, res) => {
  try {
    const {
      projectId,
      dealId,
      clientId,
      clientName,
      invoiceStage,
      amount,
      dueDate,
      paymentStatus = 'Sent'
    } = req.body;

    if (!projectId || !dealId || !clientId || !invoiceStage || !amount || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newInvoice = {
      _id: `INV-${Date.now()}`,
      invoiceNumber: `INV-2024-${invoices.length + 1}`,
      projectId,
      dealId,
      clientId,
      clientName,
      invoiceStage,
      amount: parseFloat(amount),
      dueDate,
      paymentStatus,
      paymentMethod: null,
      paymentDate: null,
      reminderCount: 0,
      lastReminderDate: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    invoices.push(newInvoice);
    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create invoice', error: error.message });
  }
});

app.put('/api/invoices/:id', (req, res) => {
  try {
    const { id } = req.params;
    const invoiceIndex = invoices.findIndex(inv => inv._id === id && inv.isActive);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const updatedInvoice = {
      ...invoices[invoiceIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    invoices[invoiceIndex] = updatedInvoice;
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update invoice', error: error.message });
  }
});

app.put('/api/invoices/:id/payment', (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod, paymentDate } = req.body;
    
    const invoiceIndex = invoices.findIndex(inv => inv._id === id && inv.isActive);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoices[invoiceIndex] = {
      ...invoices[invoiceIndex],
      paymentStatus: 'Collected',
      paymentMethod,
      paymentDate: paymentDate || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json(invoices[invoiceIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment', error: error.message });
  }
});

app.post('/api/invoices/:id/reminder', (req, res) => {
  try {
    const { id } = req.params;
    const invoiceIndex = invoices.findIndex(inv => inv._id === id && inv.isActive);
    
    if (invoiceIndex === -1) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    invoices[invoiceIndex] = {
      ...invoices[invoiceIndex],
      reminderCount: invoices[invoiceIndex].reminderCount + 1,
      lastReminderDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'Payment reminder sent successfully',
      invoice: invoices[invoiceIndex]
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reminder', error: error.message });
  }
});

// Beyond Care / Valued Customers Routes
app.get('/api/valued-customers', (req, res) => {
  try {
    // Convert clients to valued customers format
    const valuedCustomers = clients.map((client, index) => ({
      _id: `vc-${client._id}`,
      clientId: client._id,
      clientName: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      isValued: index < 3, // First 3 clients are valued
      valuedSince: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      totalProjects: Math.floor(Math.random() * 5) + 1,
      totalValue: Math.floor(Math.random() * 2000000) + 100000,
      npsScore: Math.floor(Math.random() * 10) + 1,
      referralCount: Math.floor(Math.random() * 5),
      testimonials: [
        {
          _id: `test-${index}`,
          projectId: `proj-${index}`,
          projectName: `Project ${index + 1}`,
          rating: 5,
          review: `Excellent service and beautiful design!`,
          isPublic: true,
          date: new Date().toISOString(),
          mediaUrls: []
        }
      ],
      projectMedia: [
        {
          _id: `media-${index}`,
          projectId: `proj-${index}`,
          projectName: `Project ${index + 1}`,
          type: 'photo',
          url: `/api/placeholder-image.jpg`,
          caption: `Beautiful design work`,
          date: new Date().toISOString(),
          isPublic: true
        }
      ],
      anniversaries: [
        {
          _id: `ann-${index}`,
          type: 'project_completion',
          date: new Date().toISOString(),
          title: 'Project Completion Anniversary',
          message: 'Happy anniversary of your project completion!',
          status: 'pending'
        }
      ],
      rewards: [
        {
          _id: `reward-${index}`,
          type: 'loyalty_bonus',
          title: 'Loyalty Bonus',
          description: 'Thank you for being a valued customer',
          value: 5000,
          status: 'awarded',
          date: new Date().toISOString()
        }
      ],
      handoverDates: [
        {
          _id: `handover-${index}`,
          projectId: `proj-${index}`,
          projectName: `Project ${index + 1}`,
          handoverDate: new Date().toISOString(),
          satisfaction: 5,
          feedback: 'Very satisfied with the work'
        }
      ],
      lastContactDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      nextFollowUpDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `Valued customer with excellent feedback`,
      tags: ['repeat-customer', 'high-satisfaction'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    res.json({ valuedCustomers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch valued customers', error: error.message });
  }
});

app.put('/api/valued-customers/:id/mark-valued', (req, res) => {
  try {
    const { id } = req.params;
    // In a real app, this would update the database
    console.log(`📌 Marking valued customer ${id} as valued`);
    res.json({ message: 'Customer marked as valued successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark customer as valued', error: error.message });
  }
});

app.post('/api/valued-customers/:id/testimonials', (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = req.body;
    console.log(`📝 Creating testimonial for valued customer ${id}:`, testimonial);
    res.json({ message: 'Testimonial created successfully', testimonial });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create testimonial', error: error.message });
  }
});

app.put('/api/valued-customers/:id/follow-up', (req, res) => {
  try {
    const { id } = req.params;
    const { nextFollowUpDate } = req.body;
    console.log(`📅 Scheduling follow-up for valued customer ${id}:`, nextFollowUpDate);
    res.json({ message: 'Follow-up scheduled successfully', nextFollowUpDate });
  } catch (error) {
    res.status(500).json({ message: 'Failed to schedule follow-up', error: error.message });
  }
});

app.post('/api/valued-customers/:id/media', (req, res) => {
  try {
    const { id } = req.params;
    const media = req.body;
    console.log(`📸 Adding media for valued customer ${id}:`, media);
    res.json({ message: 'Media added successfully', media });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add media', error: error.message });
  }
});

app.post('/api/valued-customers/:id/rewards', (req, res) => {
  try {
    const { id } = req.params;
    const reward = req.body;
    console.log(`🎁 Adding reward for valued customer ${id}:`, reward);
    res.json({ message: 'Reward added successfully', reward });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add reward', error: error.message });
  }
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Design Pipeline CRM Server running on port ${PORT}`);
  console.log(`🎨 Interior Design Project Management`);
  console.log(`🎯 Industry Package: ${INDUSTRY_PACKAGE.toUpperCase()}`);
  console.log(`📊 Server is ready and listening on all interfaces`);
  console.log(`🔧 API endpoints available at /api`);
  console.log(`📱 Frontend served from root path`);
  console.log(`\n🔑 Demo Login Credentials:`);
  console.log(`   Email: admin@designpipeline.com`);
  console.log(`   Password: admin123`);
  console.log(`\n💾 Using Enhanced Mock Database (In-Memory)`);
  console.log(`   - Interior Design workflow (11 stages)`);
  console.log(`   - Design-specific features enabled`);
  console.log(`   - All data is stored in memory`);
  console.log(`   - Data will be lost when server restarts`);
  console.log(`   - Perfect for testing and development`);
});
