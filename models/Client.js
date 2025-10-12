const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    unique: true,
    default: () => `CLI-${Date.now()}`
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
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
    type: String,
    trim: true
  },
  stylePreferences: [{
    type: String,
    enum: ['Modern', 'Traditional', 'Minimalist', 'Industrial', 'Scandinavian', 'Contemporary', 'Rustic', 'Art Deco']
  }],
  functionalityGoals: {
    type: String,
    trim: true
  },
  targetBudget: {
    type: Number,
    required: true,
    min: 0
  },
  materialPreferences: [{
    type: String,
    enum: ['Wood (Teak)', 'Wood (Oak)', 'Wood (Pine)', 'Marble', 'Granite', 'Glass', 'Metal (Steel)', 'Metal (Brass)', 'Metal (Copper)', 'Fabric', 'Leather', 'Ceramic']
  }],
  questionnaireLink: {
    type: String,
    trim: true
  },
  leadSource: {
    type: String,
    enum: ['Website', 'Referral', 'Social Media', 'Advertisement', 'Trade Show', 'Other'],
    default: 'Website'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
clientSchema.index({ email: 1 });
clientSchema.index({ name: 1 });
clientSchema.index({ leadSource: 1 });

module.exports = mongoose.model('Client', clientSchema);
