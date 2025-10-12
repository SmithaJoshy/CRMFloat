const express = require('express');
const Designer = require('../models/Designer');
const { auth, managerOrAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all designers with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { search, availability, role, isActive } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (availability) {
      query.availability = availability;
    }
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const designers = await Designer.find(query).sort({ createdAt: -1 });
    
    res.json({ designers });
  } catch (error) {
    console.error('Error fetching designers:', error);
    res.status(500).json({ message: 'Failed to fetch designers' });
  }
});

// Get single designer
router.get('/:id', auth, async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id);
    
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    res.json({ designer });
  } catch (error) {
    console.error('Error fetching designer:', error);
    res.status(500).json({ message: 'Failed to fetch designer' });
  }
});

// Create new designer
router.post('/', auth, managerOrAdmin, async (req, res) => {
  try {
    const designer = new Designer(req.body);
    await designer.save();
    
    res.status(201).json({
      message: 'Designer created successfully',
      designer
    });
  } catch (error) {
    console.error('Error creating designer:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Designer with this email already exists' });
    }
    
    res.status(500).json({ message: 'Failed to create designer' });
  }
});

// Update designer
router.put('/:id', auth, managerOrAdmin, async (req, res) => {
  try {
    const designer = await Designer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    res.json({
      message: 'Designer updated successfully',
      designer
    });
  } catch (error) {
    console.error('Error updating designer:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Designer with this email already exists' });
    }
    
    res.status(500).json({ message: 'Failed to update designer' });
  }
});

// Delete designer (soft delete)
router.delete('/:id', auth, managerOrAdmin, async (req, res) => {
  try {
    const designer = await Designer.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    res.json({ message: 'Designer deactivated successfully' });
  } catch (error) {
    console.error('Error deleting designer:', error);
    res.status(500).json({ message: 'Failed to delete designer' });
  }
});

// Send email to designer
router.post('/:id/send-email', auth, async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id);
    
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    const { subject, message } = req.body;
    
    // TODO: Implement actual email sending logic here
    console.log(`📧 Email sent to ${designer.email}:`, { subject, message });
    
    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Send SMS to designer
router.post('/:id/send-sms', auth, async (req, res) => {
  try {
    const designer = await Designer.findById(req.params.id);
    
    if (!designer) {
      return res.status(404).json({ message: 'Designer not found' });
    }
    
    const { message } = req.body;
    
    // TODO: Implement actual SMS sending logic here
    console.log(`📱 SMS sent to ${designer.phone}:`, message);
    
    res.json({ message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
});

module.exports = router;
