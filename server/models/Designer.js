const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
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
  role: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    default: 'Design'
  },
  skills: [{
    type: String,
    trim: true
  }],
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'Away', 'Unavailable'],
    default: 'Available'
  },
  experience: {
    type: String,
    trim: true
  },
  specializations: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  smsEnabled: {
    type: Boolean,
    default: true
  },
  emailEnabled: {
    type: Boolean,
    default: true
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String,
    maxlength: 500
  },
  hourlyRate: {
    type: Number,
    min: 0
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
designerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
designerSchema.index({ email: 1 });
designerSchema.index({ name: 1 });
designerSchema.index({ availability: 1 });
designerSchema.index({ isActive: 1 });

module.exports = mongoose.model('Designer', designerSchema);
