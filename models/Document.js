const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
    unique: true,
    default: () => `DOC-${Date.now()}`
  },
  documentName: {
    type: String,
    required: true,
    trim: true
  },
  documentType: {
    type: String,
    enum: [
      'Questionnaire',
      'Portfolio',
      'Estimate Sheet',
      'Costing Document',
      'Contract',
      'Site Visit Checklist',
      '3D Design',
      'Technical Drawing',
      'Handover Pack',
      'Testimonial',
      'Other'
    ],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    min: 0
  },
  mimeType: {
    type: String,
    trim: true
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
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  accessLevel: {
    type: String,
    enum: ['Public', 'Team', 'Restricted'],
    default: 'Team'
  },
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for better query performance
documentSchema.index({ dealId: 1 });
documentSchema.index({ clientId: 1 });
documentSchema.index({ documentType: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ uploadDate: -1 });

// Virtual for file extension
documentSchema.virtual('fileExtension').get(function() {
  return this.fileUrl.split('.').pop().toLowerCase();
});

// Virtual for formatted file size
documentSchema.virtual('formattedFileSize').get(function() {
  if (!this.fileSize) return 'Unknown';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.fileSize) / Math.log(1024));
  return Math.round(this.fileSize / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Method to check if file is image
documentSchema.methods.isImage = function() {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  return imageExtensions.includes(this.fileExtension);
};

// Method to check if file is document
documentSchema.methods.isDocument = function() {
  const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  return docExtensions.includes(this.fileExtension);
};

// Static method to get documents by type
documentSchema.statics.getDocumentsByType = function(type) {
  return this.find({ documentType: type, isActive: true }).populate('dealId clientId uploadedBy');
};

// Static method to get documents by deal
documentSchema.statics.getDocumentsByDeal = function(dealId) {
  return this.find({ dealId: dealId, isActive: true }).populate('clientId uploadedBy');
};

module.exports = mongoose.model('Document', documentSchema);
