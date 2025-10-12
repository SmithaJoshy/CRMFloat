const express = require('express');
const Payment = require('../models/Payment');
const Deal = require('../models/Deal');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all payments with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      stage, 
      overdue,
      sortBy = 'dueDate',
      sortOrder = 'asc'
    } = req.query;
    
    const query = { isActive: true };
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by stage
    if (stage) {
      query.invoiceStage = stage;
    }
    
    // Filter overdue payments
    if (overdue === 'true') {
      query.status = { $ne: 'Collected' };
      query.dueDate = { $lt: new Date() };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const payments = await Payment.find(query)
      .populate('dealId', 'projectName currentStage')
      .populate('clientId', 'name email phone')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('dealId')
      .populate('clientId');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new payment
router.post('/', auth, authorize('Founder/Executive', 'Finance & Payments'), async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Verify deal exists
    const deal = await Deal.findById(paymentData.dealId);
    if (!deal) {
      return res.status(400).json({ message: 'Deal not found' });
    }

    const payment = new Payment(paymentData);
    await payment.save();

    // Populate related data
    await payment.populate('dealId clientId');

    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment
router.put('/:id', auth, authorize('Founder/Executive', 'Finance & Payments'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const { 
      amount, 
      dueDate, 
      status, 
      paymentMethod, 
      paymentDate, 
      notes 
    } = req.body;
    
    // Update payment data
    if (amount !== undefined) payment.amount = amount;
    if (dueDate) payment.dueDate = dueDate;
    if (status) payment.status = status;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (paymentDate) payment.paymentDate = paymentDate;
    if (notes) payment.notes = notes;

    // If payment is marked as collected, set payment date
    if (status === 'Collected' && !payment.paymentDate) {
      payment.paymentDate = new Date();
    }

    await payment.save();

    res.json({
      message: 'Payment updated successfully',
      payment
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark payment as collected
router.post('/:id/collect', auth, authorize('Founder/Executive', 'Finance & Payments'), async (req, res) => {
  try {
    const { paymentMethod, notes } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = 'Collected';
    payment.paymentDate = new Date();
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (notes) payment.notes = notes;

    await payment.save();

    res.json({
      message: 'Payment marked as collected',
      payment
    });
  } catch (error) {
    console.error('Collect payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get overdue payments
router.get('/overdue/list', auth, async (req, res) => {
  try {
    const overduePayments = await Payment.getOverduePayments();
    res.json(overduePayments);
  } catch (error) {
    console.error('Get overdue payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments({ isActive: true });
    const collectedPayments = await Payment.countDocuments({ 
      isActive: true, 
      status: 'Collected' 
    });
    const overduePayments = await Payment.countDocuments({
      isActive: true,
      status: { $ne: 'Collected' },
      dueDate: { $lt: new Date() }
    });
    
    const totalAmount = await Payment.aggregate([
      { $match: { isActive: true, status: 'Collected' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const overdueAmount = await Payment.aggregate([
      { 
        $match: { 
          isActive: true, 
          status: { $ne: 'Collected' },
          dueDate: { $lt: new Date() }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const statusStats = await Payment.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const stageStats = await Payment.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$invoiceStage', count: { $sum: 1 } } }
    ]);

    res.json({
      totalPayments,
      collectedPayments,
      overduePayments,
      totalAmount: totalAmount[0]?.total || 0,
      overdueAmount: overdueAmount[0]?.total || 0,
      statusStats,
      stageStats
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send payment reminder
router.post('/:id/remind', auth, authorize('Founder/Executive', 'Finance & Payments'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('clientId')
      .populate('dealId');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // This would trigger the reminder system
    // The actual reminder sending is handled by the cron job
    payment.reminderCount += 1;
    payment.lastReminderDate = new Date();
    await payment.save();

    res.json({ message: 'Reminder sent successfully' });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payments by deal
router.get('/deal/:dealId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ 
      dealId: req.params.dealId,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error('Get payments by deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete payment (soft delete)
router.delete('/:id', auth, authorize('Founder/Executive'), async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if payment is collected
    if (payment.status === 'Collected') {
      return res.status(400).json({ 
        message: 'Cannot delete collected payment' 
      });
    }

    payment.isActive = false;
    await payment.save();

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
