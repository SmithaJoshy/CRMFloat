const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Client = require('../models/Client');
const Deal = require('../models/Deal');
const Designer = require('../models/Designer');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/designpipeline_crm');
    console.log('✅ MongoDB connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  console.log('🌱 Seeding users...');
  
  const users = [
    {
      name: 'Admin User',
      email: 'admin@designpipeline.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Manager User',
      email: 'manager@designpipeline.com',
      password: 'manager123',
      role: 'manager'
    },
    {
      name: 'Sales User',
      email: 'sales@designpipeline.com',
      password: 'sales123',
      role: 'sales'
    }
  ];

  for (const userData of users) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${userData.email}`);
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`);
    }
  }
};

const seedDesigners = async () => {
  console.log('🌱 Seeding designers...');
  
  const designers = [
    {
      name: 'Sarah Johnson',
      email: 'sarah@designpipeline.com',
      phone: '+91-9876543211',
      role: 'Senior Interior Designer',
      department: 'Design',
      skills: ['Residential Design', 'Commercial Spaces', '3D Visualization'],
      availability: 'Available',
      experience: '8 years',
      specializations: ['Modern', 'Contemporary', 'Minimalist'],
      isActive: true,
      smsEnabled: true,
      emailEnabled: true
    },
    {
      name: 'Michael Chen',
      email: 'michael@designpipeline.com',
      phone: '+91-9876543212',
      role: 'Junior Interior Designer',
      department: 'Design',
      skills: ['Space Planning', 'Material Selection', 'Client Presentations'],
      availability: 'Available',
      experience: '3 years',
      specializations: ['Traditional', 'Eclectic'],
      isActive: true,
      smsEnabled: true,
      emailEnabled: true
    },
    {
      name: 'Priya Sharma',
      email: 'priya@designpipeline.com',
      phone: '+91-9876543213',
      role: 'Design Lead',
      department: 'Design',
      skills: ['Project Management', 'Team Leadership', 'Client Relations'],
      availability: 'Busy',
      experience: '10 years',
      specializations: ['Luxury Residential', 'Hospitality Design'],
      isActive: true,
      smsEnabled: false,
      emailEnabled: true
    }
  ];

  for (const designerData of designers) {
    const existingDesigner = await Designer.findOne({ email: designerData.email });
    if (!existingDesigner) {
      const designer = new Designer(designerData);
      await designer.save();
      console.log(`✅ Created designer: ${designerData.name}`);
    } else {
      console.log(`⏭️  Designer already exists: ${designerData.name}`);
    }
  }
};

const seedClients = async () => {
  console.log('🌱 Seeding clients...');
  
  const adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    console.log('❌ Admin user not found. Please seed users first.');
    return;
  }

  const clients = [
    {
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91-9876543210',
      company: 'Tech Solutions Pvt Ltd',
      address: {
        street: '123 MG Road',
        city: 'Bangalore',
        state: 'Karnataka',
        zipCode: '560001',
        country: 'India'
      },
      targetBudget: 1500000,
      source: 'website',
      status: 'active',
      notes: 'Interested in modern office design',
      createdBy: adminUser._id,
      lastContactDate: new Date()
    },
    {
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      phone: '+91-9876543211',
      company: 'Singh Enterprises',
      address: {
        street: '456 Park Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      targetBudget: 800000,
      source: 'referral',
      status: 'active',
      notes: 'Looking for luxury residential design',
      createdBy: adminUser._id,
      lastContactDate: new Date()
    },
    {
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+91-9876543212',
      company: 'Patel Group',
      address: {
        street: '789 Commercial Street',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380001',
        country: 'India'
      },
      targetBudget: 2000000,
      source: 'advertisement',
      status: 'prospect',
      notes: 'Commercial space renovation project',
      createdBy: adminUser._id,
      lastContactDate: new Date()
    }
  ];

  for (const clientData of clients) {
    const existingClient = await Client.findOne({ email: clientData.email });
    if (!existingClient) {
      const client = new Client(clientData);
      await client.save();
      console.log(`✅ Created client: ${clientData.name}`);
    } else {
      console.log(`⏭️  Client already exists: ${clientData.name}`);
    }
  }
};

const seedDeals = async () => {
  console.log('🌱 Seeding deals...');
  
  const adminUser = await User.findOne({ role: 'admin' });
  const clients = await Client.find();
  const designers = await Designer.find();
  
  if (!adminUser || clients.length === 0 || designers.length === 0) {
    console.log('❌ Required data not found. Please seed users, clients, and designers first.');
    return;
  }

  const deals = [
    {
      projectName: 'Modern Apartment Design',
      clientId: clients[0]._id,
      clientName: clients[0].name,
      dealId: 'DEAL-001',
      currentStage: 'In Progress',
      projectStatus: 'Active',
      totalProjectValue: 750000,
      priorityLevel: 'High',
      assignedTeam: {
        assignedDesigner: designers[0]._id,
        projectManager: adminUser._id,
        salesRep: adminUser._id
      },
      propertyType: {
        propertyType: 'Residential',
        dealType: 'Interior Design'
      },
      location: {
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India'
      },
      size: 1200,
      projectStartDate: new Date(),
      expectedCompletionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      notes: 'Modern design with smart home integration',
      notesHistory: [
        {
          id: 'note-1',
          content: 'Initial project discussion completed. Client prefers modern design with neutral colors.',
          addedBy: 'Sarah Johnson',
          addedAt: new Date(),
          type: 'general'
        },
        {
          id: 'note-2',
          content: 'Client requested changes to kitchen layout - prefers island counter.',
          addedBy: 'Admin User',
          addedAt: new Date(),
          type: 'design_change'
        }
      ],
      createdBy: adminUser._id
    },
    {
      projectName: 'Luxury Villa Interior Design',
      clientId: clients[1]._id,
      clientName: clients[1].name,
      dealId: 'DEAL-002',
      currentStage: 'Blocked',
      projectStatus: 'On Hold',
      totalProjectValue: 1200000,
      priorityLevel: 'Medium',
      assignedTeam: {
        assignedDesigner: designers[2]._id,
        projectManager: adminUser._id,
        salesRep: adminUser._id
      },
      propertyType: {
        propertyType: 'Residential',
        dealType: 'Interior Design'
      },
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
      },
      size: 2500,
      projectStartDate: new Date(),
      expectedCompletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
      notes: 'Luxury villa with premium materials and finishes',
      notesHistory: [
        {
          id: 'note-3',
          content: 'Luxury villa project initiated. Client has high-end requirements and premium budget.',
          addedBy: 'Priya Sharma',
          addedAt: new Date(),
          type: 'general'
        },
        {
          id: 'note-4',
          content: 'Project blocked due to pending client approval on premium material selection.',
          addedBy: 'Admin User',
          addedAt: new Date(),
          type: 'status_change'
        }
      ],
      createdBy: adminUser._id
    },
    {
      projectName: 'Office Space Design',
      clientId: clients[2]._id,
      clientName: clients[2].name,
      dealId: 'DEAL-003',
      currentStage: 'Done',
      projectStatus: 'Completed',
      totalProjectValue: 950000,
      priorityLevel: 'Low',
      assignedTeam: {
        assignedDesigner: designers[1]._id,
        projectManager: adminUser._id,
        salesRep: adminUser._id
      },
      propertyType: {
        propertyType: 'Commercial',
        dealType: 'Interior Design'
      },
      location: {
        city: 'Ahmedabad',
        state: 'Gujarat',
        country: 'India'
      },
      size: 1800,
      projectStartDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      expectedCompletionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      actualCompletionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      notes: 'Modern office space with collaborative work areas',
      notesHistory: [
        {
          id: 'note-5',
          content: 'Office design project completed successfully. Client very satisfied.',
          addedBy: 'Michael Chen',
          addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          type: 'status_change'
        }
      ],
      createdBy: adminUser._id
    }
  ];

  for (const dealData of deals) {
    const existingDeal = await Deal.findOne({ dealId: dealData.dealId });
    if (!existingDeal) {
      const deal = new Deal(dealData);
      await deal.save();
      console.log(`✅ Created deal: ${dealData.projectName}`);
    } else {
      console.log(`⏭️  Deal already exists: ${dealData.projectName}`);
    }
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting database seeding...');
    
    await seedUsers();
    await seedDesigners();
    await seedClients();
    await seedDeals();
    
    console.log('✅ Database seeding completed successfully!');
    
    // Display summary
    const userCount = await User.countDocuments();
    const designerCount = await Designer.countDocuments();
    const clientCount = await Client.countDocuments();
    const dealCount = await Deal.countDocuments();
    
    console.log('\n📊 Database Summary:');
    console.log(`👥 Users: ${userCount}`);
    console.log(`🎨 Designers: ${designerCount}`);
    console.log(`👤 Clients: ${clientCount}`);
    console.log(`📋 Deals: ${dealCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
