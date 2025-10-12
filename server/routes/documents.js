const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all documents
router.get('/', auth, async (req, res) => {
  try {
    const { clientId, projectId } = req.query;
    
    // TODO: Implement document fetching from database
    // This is a mock response for now
    const documents = [
      {
        _id: 'doc-1',
        name: 'Project Proposal.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedBy: req.user.name,
        uploadedAt: new Date().toISOString(),
        clientId: clientId || '1',
        projectId: projectId || '1'
      }
    ];
    
    res.json({ documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
});

// Upload document
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { clientId, projectId, description } = req.body;
    
    // TODO: Implement file storage logic (AWS S3, Google Cloud Storage, etc.)
    // For now, we'll store file data as base64 in the response
    const fileData = {
      _id: `doc-${Date.now()}`,
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer.toString('base64'),
      clientId,
      projectId,
      description,
      uploadedBy: req.user.name,
      uploadedAt: new Date().toISOString()
    };
    
    res.status(201).json({
      message: 'Document uploaded successfully',
      document: fileData
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
});

// Delete document
router.delete('/:id', auth, async (req, res) => {
  try {
    // TODO: Implement document deletion logic
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
});

module.exports = router;
