const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  targetBudget: {
    type: Number,
    min: 0
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'advertisement', 'walk_in', 'other'],
    default: 'website'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'prospect'],
    default: 'prospect'
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastContactDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps
clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
clientSchema.index({ email: 1 });
clientSchema.index({ name: 1 });
clientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Client', clientSchema);
