const express = require('express');
const Deal = require('../models/Deal');
const Client = require('../models/Client');
const Payment = require('../models/Payment');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all deals with filtering and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      stage, 
      status, 
      priority, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { isActive: true };
    
    // Filter by stage
    if (stage) {
      query.currentStage = stage;
    }
    
    // Filter by status
    if (status) {
      query.projectStatus = status;
    }
    
    // Filter by priority
    if (priority) {
      query.priorityLevel = priority;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const deals = await Deal.find(query)
      .populate('clientId', 'name email phone')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Deal.countDocuments(query);

    res.json({
      deals,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get deals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get deal by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('clientId')
      .populate('payments');
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    console.error('Get deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new deal
router.post('/', auth, authorize('Founder/Executive', 'Sales Manager'), async (req, res) => {
  try {
    const dealData = req.body;
    
    // Check for duplicate project name
    const existingDeal = await Deal.findOne({ 
      projectName: dealData.projectName,
      isActive: true 
    });
    if (existingDeal) {
      return res.status(400).json({ 
        message: 'A project with this name already exists. Please choose a different name.' 
      });
    }
    
    // Verify client exists
    const client = await Client.findById(dealData.clientId);
    if (!client) {
      return res.status(400).json({ message: 'Client not found' });
    }

    const deal = new Deal(dealData);
    await deal.save();

    // Populate client data
    await deal.populate('clientId');

    res.status(201).json({
      message: 'Deal created successfully',
      deal
    });
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update deal
router.put('/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const { currentStage, totalProjectValue, projectStatus, priorityLevel, assignedDesigner, notes } = req.body;
    
    // Check if stage is being updated
    const stageChanged = currentStage && currentStage !== deal.currentStage;
    
    // Update deal data
    if (currentStage) deal.currentStage = currentStage;
    if (totalProjectValue !== undefined) deal.totalProjectValue = totalProjectValue;
    if (projectStatus) deal.projectStatus = projectStatus;
    if (priorityLevel) deal.priorityLevel = priorityLevel;
    if (assignedDesigner) deal.assignedDesigner = assignedDesigner;
    if (notes) deal.notes = notes;

    await deal.save();

    // If stage changed to a payment stage, create payment record
    if (stageChanged && deal.isPaymentStage()) {
      await createPaymentForStage(deal);
    }

    res.json({
      message: 'Deal updated successfully',
      deal
    });
  } catch (error) {
    console.error('Update deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete deal (soft delete)
router.delete('/:id', auth, authorize('Founder/Executive'), async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    // Check if deal has payments
    const payments = await Payment.find({ dealId: deal._id });
    if (payments.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete deal with payment records' 
      });
    }

    deal.isActive = false;
    await deal.save();

    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Delete deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pipeline statistics
router.get('/stats/pipeline', auth, async (req, res) => {
  try {
    const stageStats = await Deal.aggregate([
      { $match: { isActive: true, projectStatus: 'Active' } },
      { $group: { _id: '$currentStage', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const totalPipelineValue = await Deal.aggregate([
      { $match: { isActive: true, projectStatus: 'Active' } },
      { $group: { _id: null, total: { $sum: '$totalProjectValue' } } }
    ]);

    const priorityStats = await Deal.aggregate([
      { $match: { isActive: true, projectStatus: 'Active' } },
      { $group: { _id: '$priorityLevel', count: { $sum: 1 } } }
    ]);

    res.json({
      stageStats,
      totalPipelineValue: totalPipelineValue[0]?.total || 0,
      priorityStats
    });
  } catch (error) {
    console.error('Get pipeline stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get deals by stage
router.get('/stage/:stage', auth, async (req, res) => {
  try {
    const deals = await Deal.find({ 
      currentStage: req.params.stage,
      isActive: true 
    })
    .populate('clientId', 'name email phone')
    .sort({ createdAt: -1 });

    res.json(deals);
  } catch (error) {
    console.error('Get deals by stage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Move deal to next stage
router.post('/:id/next-stage', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    const stages = [
      'Lead Generation',
      'Initial Engagement',
      'Scheduling Visit',
      'Consultation & Data Capture',
      'Design in Progress',
      'Design Presentation & Fee Due',
      'Costing Shared',
      'Contract Signed (50% Due)',
      'Site Measurement Visit',
      'Detailed Drawings & Vendor Coordination',
      'Production (40% Interim Due)',
      'Project Closure (Final 10% Payment)',
      'Project Completed'
    ];

    const currentIndex = stages.indexOf(deal.currentStage);
    if (currentIndex < stages.length - 1) {
      deal.currentStage = stages[currentIndex + 1];
      
      // If moving to a payment stage, create payment record
      if (deal.isPaymentStage()) {
        await createPaymentForStage(deal);
      }
      
      await deal.save();
    }

    res.json({
      message: 'Deal moved to next stage',
      deal
    });
  } catch (error) {
    console.error('Move to next stage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to create payment for stage
async function createPaymentForStage(deal) {
  const paymentStages = {
    'Design Presentation & Fee Due': { stage: 'Design Fee (₹35K–₹48K)', amount: 35000, days: 7 },
    'Contract Signed (50% Due)': { stage: '50% Advance', amount: deal.totalProjectValue * 0.5, days: 14 },
    'Production (40% Interim Due)': { stage: '40% Interim', amount: deal.totalProjectValue * 0.4, days: 14 },
    'Project Closure (Final 10% Payment)': { stage: 'Final 10%', amount: deal.totalProjectValue * 0.1, days: 7 }
  };

  const paymentConfig = paymentStages[deal.currentStage];
  if (paymentConfig) {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + paymentConfig.days);

    const payment = new Payment({
      dealId: deal._id,
      clientId: deal.clientId,
      invoiceStage: paymentConfig.stage,
      amount: paymentConfig.amount,
      dueDate: dueDate
    });

    await payment.save();
  }
}

module.exports = router;
