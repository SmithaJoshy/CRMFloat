const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Document = require('../models/Document');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Get all documents with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      dealId,
      search,
      sortBy = 'uploadDate',
      sortOrder = 'desc'
    } = req.query;
    
    const query = { isActive: true };
    
    // Filter by document type
    if (type) {
      query.documentType = type;
    }
    
    // Filter by deal
    if (dealId) {
      query.dealId = dealId;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { documentName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const documents = await Document.find(query)
      .populate('dealId', 'projectName currentStage')
      .populate('clientId', 'name email')
      .populate('uploadedBy', 'name email')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Document.countDocuments(query);

    res.json({
      documents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get document by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('dealId')
      .populate('clientId')
      .populate('uploadedBy');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { dealId, clientId, documentType, documentName, description, tags, accessLevel } = req.body;
    
    // Verify deal and client exist
    const deal = await Deal.findById(dealId);
    if (!deal) {
      return res.status(400).json({ message: 'Deal not found' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'design-pipeline-crm'
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'File upload failed' });
        }

        try {
          const document = new Document({
            documentName: documentName || req.file.originalname,
            documentType,
            fileUrl: result.secure_url,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            dealId,
            clientId,
            uploadedBy: req.userId,
            description,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            accessLevel: accessLevel || 'Team'
          });

          await document.save();
          await document.populate('dealId clientId uploadedBy');

          res.status(201).json({
            message: 'Document uploaded successfully',
            document
          });
        } catch (error) {
          console.error('Document save error:', error);
          res.status(500).json({ message: 'Document save failed' });
        }
      }
    );

    // Start the upload
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'design-pipeline-crm' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'File upload failed' });
        }

        try {
          const document = new Document({
            documentName: documentName || req.file.originalname,
            documentType,
            fileUrl: result.secure_url,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            dealId,
            clientId,
            uploadedBy: req.userId,
            description,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            accessLevel: accessLevel || 'Team'
          });

          await document.save();
          await document.populate('dealId clientId uploadedBy');

          res.status(201).json({
            message: 'Document uploaded successfully',
            document
          });
        } catch (error) {
          console.error('Document save error:', error);
          res.status(500).json({ message: 'Document save failed' });
        }
      }
    );

    // Pipe the file buffer to the upload stream
    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update document
router.put('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const { 
      documentName, 
      documentType, 
      description, 
      tags, 
      accessLevel 
    } = req.body;
    
    // Update document data
    if (documentName) document.documentName = documentName;
    if (documentType) document.documentType = documentType;
    if (description) document.description = description;
    if (tags) document.tags = tags.split(',').map(tag => tag.trim());
    if (accessLevel) document.accessLevel = accessLevel;

    await document.save();

    res.json({
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has permission to delete
    if (document.uploadedBy.toString() !== req.userId && req.userRole !== 'Founder/Executive') {
      return res.status(403).json({ message: 'Access denied' });
    }

    document.isActive = false;
    await document.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get documents by deal
router.get('/deal/:dealId', auth, async (req, res) => {
  try {
    const documents = await Document.getDocumentsByDeal(req.params.dealId);
    res.json(documents);
  } catch (error) {
    console.error('Get documents by deal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get documents by type
router.get('/type/:type', auth, async (req, res) => {
  try {
    const documents = await Document.getDocumentsByType(req.params.type);
    res.json(documents);
  } catch (error) {
    console.error('Get documents by type error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get document statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalDocuments = await Document.countDocuments({ isActive: true });
    
    const typeStats = await Document.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$documentType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const sizeStats = await Document.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalSize: { $sum: '$fileSize' }, avgSize: { $avg: '$fileSize' } } }
    ]);

    const recentUploads = await Document.find({ isActive: true })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalDocuments,
      typeStats,
      sizeStats: sizeStats[0] || { totalSize: 0, avgSize: 0 },
      recentUploads
    });
  } catch (error) {
    console.error('Get document stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Download document
router.get('/:id/download', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Redirect to Cloudinary URL for download
    res.redirect(document.fileUrl);
  } catch (error) {
    console.error('Download document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
