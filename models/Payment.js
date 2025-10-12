const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    default: () => `PAY-${Date.now()}`
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    default: () => `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  },
  invoiceStage: {
    type: String,
    enum: ['Design Fee (₹35K–₹48K)', '50% Advance', '40% Interim', 'Final 10%'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Sent', 'Overdue', 'Collected', 'Cancelled', 'Disputed'],
    default: 'Sent'
  },
  dealId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Cheque', 'Cash', 'Online', 'Other']
  },
  paymentDate: {
    type: Date
  },
  reminderCount: {
    type: Number,
    default: 0
  },
  lastReminderDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
paymentSchema.index({ dealId: 1 });
paymentSchema.index({ clientId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ invoiceStage: 1 });

// Virtual for days overdue
paymentSchema.virtual('daysOverdue').get(function() {
  if (this.status === 'Collected') return 0;
  if (this.dueDate >= new Date()) return 0;
  return Math.floor((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
paymentSchema.virtual('isOverdue').get(function() {
  return this.status !== 'Collected' && this.dueDate < new Date();
});

// Method to update status based on due date
paymentSchema.methods.updateStatus = function() {
  if (this.status === 'Collected' || this.status === 'Cancelled') {
    return;
  }
  
  if (this.dueDate < new Date()) {
    this.status = 'Overdue';
  } else {
    this.status = 'Sent';
  }
};

// Pre-save middleware to update status
paymentSchema.pre('save', function(next) {
  this.updateStatus();
  next();
});

// Static method to get overdue payments
paymentSchema.statics.getOverduePayments = function() {
  return this.find({
    status: { $ne: 'Collected' },
    dueDate: { $lt: new Date() }
  }).populate('dealId clientId');
};

// Static method to get payments by stage
paymentSchema.statics.getPaymentsByStage = function(stage) {
  return this.find({ invoiceStage: stage }).populate('dealId clientId');
};

module.exports = mongoose.model('Payment', paymentSchema);
