/**
 * CRMFloat Configuration API
 * 
 * Provides configuration endpoints for frontend to adapt UI based on business settings
 */

const express = require('express');
const configLoader = require('../config/configLoader');
const { auth, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Get public configuration (no auth required)
router.get('/public', (req, res) => {
  try {
    const config = configLoader.getConfig();
    
    // Return only public/safe configuration
    const publicConfig = {
      business: {
        name: config.business.name,
        type: config.business.type,
        industry: config.business.industry,
        currency: config.business.currency,
        dateFormat: config.business.dateFormat,
        timeFormat: config.business.timeFormat
      },
      modules: config.modules,
      terminology: config.terminology,
      workflow: {
        defaultPipeline: config.workflow.defaultPipeline,
        pipelines: config.workflow.pipelines,
        kanban: config.workflow.kanban
      },
      display: config.display,
      features: config.features
    };
    
    res.json(publicConfig);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ message: 'Failed to fetch configuration' });
  }
});

// Get full configuration (auth required)
router.get('/', auth, (req, res) => {
  try {
    const config = configLoader.getConfig();
    res.json(config);
  } catch (error) {
    console.error('Error fetching configuration:', error);
    res.status(500).json({ message: 'Failed to fetch configuration' });
  }
});

// Get workflow stages
router.get('/workflow/stages', auth, (req, res) => {
  try {
    const { pipeline } = req.query;
    const stages = configLoader.getWorkflowStages(pipeline);
    res.json({ stages });
  } catch (error) {
    console.error('Error fetching workflow stages:', error);
    res.status(500).json({ message: 'Failed to fetch workflow stages' });
  }
});

// Get Kanban columns
router.get('/kanban/columns', auth, (req, res) => {
  try {
    const columns = configLoader.getKanbanColumns();
    res.json({ columns });
  } catch (error) {
    console.error('Error fetching Kanban columns:', error);
    res.status(500).json({ message: 'Failed to fetch Kanban columns' });
  }
});

// Get custom fields for a model
router.get('/fields/:modelName', auth, (req, res) => {
  try {
    const { modelName } = req.params;
    const fields = configLoader.getCustomFields(modelName);
    res.json({ fields });
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    res.status(500).json({ message: 'Failed to fetch custom fields' });
  }
});

// Get terminology
router.get('/terminology', auth, (req, res) => {
  try {
    const config = configLoader.getConfig();
    res.json({ terminology: config.terminology });
  } catch (error) {
    console.error('Error fetching terminology:', error);
    res.status(500).json({ message: 'Failed to fetch terminology' });
  }
});

// Update configuration (admin only)
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    // TODO: Implement configuration update logic
    // This would save to custom.config.js
    res.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error updating configuration:', error);
    res.status(500).json({ message: 'Failed to update configuration' });
  }
});

// Reload configuration (admin only)
router.post('/reload', auth, adminOnly, (req, res) => {
  try {
    configLoader.reload();
    res.json({ message: 'Configuration reloaded successfully' });
  } catch (error) {
    console.error('Error reloading configuration:', error);
    res.status(500).json({ message: 'Failed to reload configuration' });
  }
});

// Get available industry packages
router.get('/packages', (req, res) => {
  try {
    const packages = [
      {
        id: 'generic',
        name: 'Generic Business',
        description: 'Basic CRM for any business type',
        price: 0,
        features: ['Core CRM', 'Pipeline', 'Kanban', 'Customer Success']
      },
      {
        id: 'interior-design',
        name: 'Interior Design Pro',
        description: 'Complete solution for interior design businesses',
        price: 10,
        features: ['Design Workflow', 'Property Management', 'Material Tracking', 'Site Visits', 'Warranty Management']
      },
      {
        id: 'consulting',
        name: 'Professional Services',
        description: 'Optimized for consulting and professional services',
        price: 10,
        features: ['Engagement Tracking', 'Time Tracking', 'Consultant Management', 'Deliverables']
      },
      {
        id: 'real-estate',
        name: 'Real Estate Pro',
        description: 'Complete real estate CRM',
        price: 10,
        features: ['Property Listings', 'Showings', 'Offer Management', 'Agent Commissions']
      },
      {
        id: 'saas',
        name: 'SaaS Sales',
        description: 'Optimized for SaaS and subscription sales',
        price: 10,
        features: ['Trial Management', 'Demo Tracking', 'Subscription Metrics', 'MRR/ARR']
      }
    ];
    
    res.json({ packages });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
});

module.exports = router;

