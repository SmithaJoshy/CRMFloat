const express = require('express');
const Deal = require('../models/Deal');
const Client = require('../models/Client');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all deals with pagination and filtering
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, stage, status } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { projectName: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { dealId: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (stage) {
      query.currentStage = stage;
    }
    
    if (status) {
      query.projectStatus = status;
    }
    
    const deals = await Deal.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('clientId', 'name email phone')
      .populate('createdBy', 'name email');
    
    const total = await Deal.countDocuments(query);
    
    res.json({
      deals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDeals: total,
        hasNext: skip + deals.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching deals:', error);
    res.status(500).json({ message: 'Failed to fetch deals' });
  }
});

// Get single deal
router.get('/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('clientId', 'name email phone company')
      .populate('createdBy', 'name email')
      .populate('assignedTeam.assignedDesigner', 'name email role');
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    res.json({ deal });
  } catch (error) {
    console.error('Error fetching deal:', error);
    res.status(500).json({ message: 'Failed to fetch deal' });
  }
});

// Create new deal
router.post('/', auth, async (req, res) => {
  try {
    // Validate client exists
    const client = await Client.findById(req.body.clientId);
    if (!client) {
      return res.status(400).json({ message: 'Client not found' });
    }
    
    // Check for duplicate project name
    const existingDeal = await Deal.findOne({
      projectName: { $regex: new RegExp(`^${req.body.projectName}$`, 'i') }
    });
    
    if (existingDeal) {
      return res.status(400).json({ message: 'Project with this name already exists' });
    }
    
    // Generate unique deal ID
    const dealCount = await Deal.countDocuments();
    const dealId = `DEAL-${String(dealCount + 1).padStart(3, '0')}`;
    
    const dealData = {
      ...req.body,
      dealId,
      clientName: client.name,
      createdBy: req.user.id
    };
    
    const deal = new Deal(dealData);
    await deal.save();
    
    await deal.populate('clientId', 'name email phone');
    
    res.status(201).json({
      message: 'Deal created successfully',
      deal
    });
  } catch (error) {
    console.error('Error creating deal:', error);
    res.status(500).json({ message: 'Failed to create deal' });
  }
});

// Update deal
router.put('/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    // Handle notes history
    if (req.body.notes && req.body.notes.trim()) {
      const newNote = {
        id: `note-${Date.now()}`,
        content: req.body.notes.trim(),
        addedBy: req.user.name || 'System',
        addedAt: new Date(),
        type: req.body.noteType || 'general'
      };
      
      // Add new note to history
      deal.notesHistory.push(newNote);
      
      // Remove notes field from update data to avoid overwriting notesHistory
      const { notes, addedBy, noteType, ...updateData } = req.body;
      Object.assign(deal, updateData);
    } else {
      // Update without adding notes
      Object.assign(deal, req.body);
    }
    
    await deal.save();
    
    res.json({
      message: 'Deal updated successfully',
      deal
    });
  } catch (error) {
    console.error('Error updating deal:', error);
    res.status(500).json({ message: 'Failed to update deal' });
  }
});

// Delete deal
router.delete('/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    res.status(500).json({ message: 'Failed to delete deal' });
  }
});

module.exports = router;
