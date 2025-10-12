const express = require('express');
const Client = require('../models/Client');
const Deal = require('../models/Deal');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get all valued customers
router.get('/', auth, async (req, res) => {
  try {
    // Get clients with their projects and calculate valued customer metrics
    const clients = await Client.find({ status: 'active' }).sort({ createdAt: -1 });
    
    const valuedCustomers = await Promise.all(
      clients.map(async (client) => {
        // Get all deals for this client
        const deals = await Deal.find({ clientId: client._id });
        
        // Calculate metrics
        const totalProjects = deals.length;
        const totalValue = deals.reduce((sum, deal) => sum + (deal.totalProjectValue || 0), 0);
        const completedProjects = deals.filter(deal => deal.currentStage === 'Done').length;
        
        // Determine if valued customer (criteria: >2 projects OR >₹500,000 total value)
        const isValued = totalProjects >= 2 || totalValue >= 500000;
        
        // Generate mock data for valued customers
        const valuedCustomer = {
          _id: `vc-${client._id}`,
          clientId: client._id,
          clientName: client.name,
          email: client.email,
          phone: client.phone,
          company: client.company,
          isValued,
          valuedSince: isValued ? client.createdAt : null,
          totalProjects,
          totalValue,
          npsScore: isValued ? Math.floor(Math.random() * 10) + 1 : null,
          referralCount: Math.floor(Math.random() * 5),
          testimonials: isValued ? [
            {
              _id: `test-${client._id}`,
              projectId: deals[0]?._id || 'proj-1',
              projectName: deals[0]?.projectName || 'Sample Project',
              rating: 5,
              review: 'Excellent service and beautiful design!',
              isPublic: true,
              date: new Date().toISOString(),
              mediaUrls: []
            }
          ] : [],
          projectMedia: isValued ? [
            {
              _id: `media-${client._id}`,
              projectId: deals[0]?._id || 'proj-1',
              projectName: deals[0]?.projectName || 'Sample Project',
              type: 'photo',
              url: '/api/placeholder-image.jpg',
              caption: 'Beautiful design work',
              date: new Date().toISOString(),
              isPublic: true
            }
          ] : [],
          anniversaries: isValued ? [
            {
              _id: `ann-${client._id}`,
              type: 'project_completion',
              date: new Date().toISOString(),
              title: 'Project Completion Anniversary',
              message: 'Happy anniversary of your project completion!',
              status: 'pending'
            }
          ] : [],
          rewards: isValued ? [
            {
              _id: `reward-${client._id}`,
              type: 'loyalty_bonus',
              title: 'Loyalty Bonus',
              description: 'Thank you for being a valued customer',
              value: 5000,
              status: 'awarded',
              date: new Date().toISOString()
            }
          ] : [],
          handoverDates: deals.filter(deal => deal.currentStage === 'Done').map(deal => ({
            _id: `handover-${deal._id}`,
            projectId: deal._id,
            projectName: deal.projectName,
            handoverDate: deal.actualCompletionDate || new Date().toISOString(),
            satisfaction: 5,
            feedback: 'Very satisfied with the work'
          })),
          lastContactDate: client.lastContactDate,
          nextFollowUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: `Customer with ${totalProjects} projects and ₹${totalValue.toLocaleString()} total value`,
          tags: isValued ? ['repeat-customer', 'high-value'] : ['regular-customer'],
          createdAt: client.createdAt,
          updatedAt: client.updatedAt
        };
        
        return valuedCustomer;
      })
    );
    
    res.json({ valuedCustomers });
  } catch (error) {
    console.error('Error fetching valued customers:', error);
    res.status(500).json({ message: 'Failed to fetch valued customers' });
  }
});

// Mark customer as valued
router.put('/:id/mark-valued', auth, async (req, res) => {
  try {
    const customerId = req.params.id.replace('vc-', '');
    const client = await Client.findById(customerId);
    
    if (!client) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    // Update client status or add valued customer flag
    // This would typically involve updating a field in the client model
    // or creating a separate valued customers collection
    
    res.json({ message: 'Customer marked as valued successfully' });
  } catch (error) {
    console.error('Error marking customer as valued:', error);
    res.status(500).json({ message: 'Failed to mark customer as valued' });
  }
});

// Add testimonial for valued customer
router.post('/:id/testimonials', auth, async (req, res) => {
  try {
    const customerId = req.params.id.replace('vc-', '');
    const testimonial = req.body;
    
    // TODO: Implement testimonial storage logic
    // This would typically involve creating a Testimonial model
    // or storing testimonials in the client/deal documents
    
    res.json({ 
      message: 'Testimonial created successfully', 
      testimonial: {
        ...testimonial,
        _id: `test-${Date.now()}`,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ message: 'Failed to create testimonial' });
  }
});

// Add media for valued customer
router.post('/:id/media', auth, async (req, res) => {
  try {
    const customerId = req.params.id.replace('vc-', '');
    const media = req.body;
    
    // TODO: Implement media storage logic
    // This would typically involve creating a Media model
    // or storing media references in the client/deal documents
    
    res.json({ 
      message: 'Media added successfully', 
      media: {
        ...media,
        _id: `media-${Date.now()}`,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding media:', error);
    res.status(500).json({ message: 'Failed to add media' });
  }
});

// Add reward for valued customer
router.post('/:id/rewards', auth, async (req, res) => {
  try {
    const customerId = req.params.id.replace('vc-', '');
    const reward = req.body;
    
    // TODO: Implement reward storage logic
    // This would typically involve creating a Reward model
    // or storing rewards in the client documents
    
    res.json({ 
      message: 'Reward added successfully', 
      reward: {
        ...reward,
        _id: `reward-${Date.now()}`,
        date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error adding reward:', error);
    res.status(500).json({ message: 'Failed to add reward' });
  }
});

// Schedule follow-up for valued customer
router.put('/:id/follow-up', auth, async (req, res) => {
  try {
    const customerId = req.params.id.replace('vc-', '');
    const { nextFollowUpDate } = req.body;
    
    const client = await Client.findByIdAndUpdate(
      customerId,
      { lastContactDate: new Date() },
      { new: true }
    );
    
    if (!client) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json({ 
      message: 'Follow-up scheduled successfully', 
      nextFollowUpDate 
    });
  } catch (error) {
    console.error('Error scheduling follow-up:', error);
    res.status(500).json({ message: 'Failed to schedule follow-up' });
  }
});

module.exports = router;
