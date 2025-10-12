const express = require('express');
const Client = require('../models/Client');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all clients with pagination and search
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email');
    
    const total = await Client.countDocuments(query);
    
    res.json({
      clients,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalClients: total,
        hasNext: skip + clients.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Failed to fetch clients' });
  }
});

// Get single client
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ client });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Failed to fetch client' });
  }
});

// Create new client
router.post('/', auth, async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const client = new Client(clientData);
    await client.save();
    
    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    console.error('Error creating client:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }
    
    res.status(500).json({ message: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    console.error('Error updating client:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Client with this email already exists' });
    }
    
    res.status(500).json({ message: 'Failed to update client' });
  }
});

// Delete client (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    );
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json({ message: 'Client deactivated successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Failed to delete client' });
  }
});

module.exports = router;
