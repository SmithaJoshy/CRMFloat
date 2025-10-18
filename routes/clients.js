const express = require('express');
const Client = require('../models/Client');
const Deal = require('../models/Deal');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, leadSource, style } = req.query;
    
    const query = { isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by lead source
    if (leadSource) {
      query.leadSource = leadSource;
    }
    
    // Filter by style preference
    if (style) {
      query.stylePreferences = { $in: [style] };
    }

    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('deals', 'projectName currentStage totalProjectValue');

    const total = await Client.countDocuments(query);

    res.json({
      clients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('deals');
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new client
router.post('/', auth, authorize('Founder/Executive', 'Sales Manager'), async (req, res) => {
  try {
    const clientData = req.body;
    
    // Check if client with email already exists
    const existingClient = await Client.findOne({ email: clientData.email });
    if (existingClient) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }

    const client = new Client(clientData);
    await client.save();

    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update client
router.put('/:id', auth, authorize('Founder/Executive', 'Sales Manager'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Update client data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        client[key] = req.body[key];
      }
    });

    await client.save();

    res.json({
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete client (soft delete)
router.delete('/:id', auth, authorize('Founder/Executive'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Check if client has active deals
    const activeDeals = await Deal.find({ 
      clientId: client._id, 
      projectStatus: 'Active' 
    });

    if (activeDeals.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete client with active projects' 
      });
    }

    client.isActive = false;
    await client.save();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalClients = await Client.countDocuments({ isActive: true });
    const newClientsThisMonth = await Client.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    const leadSourceStats = await Client.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$leadSource', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const stylePreferenceStats = await Client.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$stylePreferences' },
      { $group: { _id: '$stylePreferences', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalClients,
      newClientsThisMonth,
      leadSourceStats,
      stylePreferenceStats
    });
  } catch (error) {
    console.error('Get client stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get client's deals
router.get('/:id/deals', auth, async (req, res) => {
  try {
    const deals = await Deal.find({ 
      clientId: req.params.id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json(deals);
  } catch (error) {
    console.error('Get client deals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add note to client
router.post('/:id/notes', auth, authorize('Founder/Executive', 'Sales Manager'), async (req, res) => {
  try {
    const { note } = req.body;
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    client.notes = note;
    await client.save();

    res.json({ message: 'Note added successfully' });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
