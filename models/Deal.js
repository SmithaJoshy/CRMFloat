const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  dealId: {
    type: String,
    required: true,
    unique: true,
    default: () => `DEAL-${Date.now()}`
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  currentStage: {
    type: String,
    enum: [
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
    ],
    default: 'Lead Generation'
  },
  totalProjectValue: {
    type: Number,
    min: 0,
    default: 0
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  testimonialCaptured: {
    type: Boolean,
    default: false
  },
  projectStartDate: {
    type: Date,
    default: Date.now
  },
  expectedCompletion: {
    type: Date
  },
  actualCompletion: {
    type: Date
  },
  projectStatus: {
    type: String,
    enum: ['Active', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  priorityLevel: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  assignedDesigner: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
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
dealSchema.index({ clientId: 1 });
dealSchema.index({ currentStage: 1 });
dealSchema.index({ projectStatus: 1 });
dealSchema.index({ projectStartDate: -1 });

// Virtual for stage number
dealSchema.virtual('stageNumber').get(function() {
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
  return stages.indexOf(this.currentStage) + 1;
});

// Method to get stage progress percentage
dealSchema.methods.getProgressPercentage = function() {
  return (this.stageNumber / 13) * 100;
};

// Method to check if stage is payment stage
dealSchema.methods.isPaymentStage = function() {
  const paymentStages = [
    'Design Presentation & Fee Due',
    'Contract Signed (50% Due)',
    'Production (40% Interim Due)',
    'Project Closure (Final 10% Payment)'
  ];
  return paymentStages.includes(this.currentStage);
};

module.exports = mongoose.model('Deal', dealSchema);
