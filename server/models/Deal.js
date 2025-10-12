const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  dealId: {
    type: String,
    unique: true,
    required: true
  },
  currentStage: {
    type: String,
    enum: ['ToDo', 'In Progress', 'Blocked', 'Paused', 'Done', 'Canceled'],
    default: 'ToDo'
  },
  projectStatus: {
    type: String,
    enum: ['Active', 'On Hold', 'Completed', 'Cancelled'],
    default: 'Active'
  },
  totalProjectValue: {
    type: Number,
    required: true,
    min: 0
  },
  priorityLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  assignedTeam: {
    assignedDesigner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Designer'
    },
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    salesRep: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  propertyType: {
    propertyType: {
      type: String,
      enum: ['Residential', 'Commercial', 'Mixed Use', 'Industrial', 'Hospitality', 'Healthcare', 'Educational', 'Other']
    },
    dealType: {
      type: String,
      enum: ['New Construction', 'Renovation', 'Interior Design', 'Consultation', 'Other']
    }
  },
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  size: {
    type: Number,
    min: 0
  },
  projectStartDate: {
    type: Date
  },
  expectedCompletionDate: {
    type: Date
  },
  actualCompletionDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: 2000
  },
  notesHistory: [{
    id: String,
    content: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['general', 'status_change', 'design_change', 'meeting', 'call'],
      default: 'general'
    }
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
dealSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
dealSchema.index({ projectName: 1 });
dealSchema.index({ clientId: 1 });
dealSchema.index({ currentStage: 1 });
dealSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Deal', dealSchema);
