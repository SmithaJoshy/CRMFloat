/**
 * CRMFloat - Consulting/Professional Services Package
 * 
 * Optimized for consulting firms, agencies, and professional services.
 */

const defaultConfig = require('./default.config');

module.exports = {
  ...defaultConfig,
  
  business: {
    ...defaultConfig.business,
    type: 'consulting',
    industry: 'Professional Services',
    packageName: 'Professional Services Package'
  },

  terminology: {
    deal: {
      singular: 'Engagement',
      plural: 'Engagements'
    },
    client: {
      singular: 'Client',
      plural: 'Clients'
    },
    team: {
      singular: 'Consultant',
      plural: 'Consultants'
    }
  },

  workflow: {
    defaultPipeline: 'consulting-process',
    pipelines: {
      'consulting-process': {
        name: 'Consulting Engagement Pipeline',
        stages: [
          { id: 'lead', name: 'New Lead', color: '#2196F3', probability: 10, order: 1 },
          { id: 'discovery', name: 'Discovery Call', color: '#00BCD4', probability: 25, order: 2 },
          { id: 'needs-analysis', name: 'Needs Analysis', color: '#4CAF50', probability: 40, order: 3 },
          { id: 'proposal', name: 'Proposal', color: '#FF9800', probability: 60, order: 4 },
          { id: 'negotiation', name: 'Contract Negotiation', color: '#F44336', probability: 75, order: 5 },
          { id: 'onboarding', name: 'Client Onboarding', color: '#9C27B0', probability: 85, order: 6 },
          { id: 'delivery', name: 'Service Delivery', color: '#FF5722', probability: 90, order: 7 },
          { id: 'completed', name: 'Completed', color: '#4CAF50', probability: 100, order: 8, isClosed: true, isWon: true },
          { id: 'lost', name: 'Lost', color: '#9E9E9E', probability: 0, order: 9, isClosed: true, isLost: true }
        ]
      }
    }
  },

  fields: {
    client: {
      ...defaultConfig.fields.client,
      custom: [
        {
          name: 'industry',
          label: 'Industry',
          type: 'select',
          options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Government', 'Non-Profit', 'Other'],
          required: false,
          showInList: true
        },
        {
          name: 'companySize',
          label: 'Company Size',
          type: 'select',
          options: ['1-10', '11-50', '51-200', '201-500', '500+'],
          required: false,
          showInList: true
        },
        {
          name: 'annualRevenue',
          label: 'Annual Revenue Range',
          type: 'select',
          options: ['< $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', '> $100M'],
          required: false,
          showInList: false
        }
      ]
    },
    deal: {
      ...defaultConfig.fields.deal,
      custom: [
        {
          name: 'serviceType',
          label: 'Service Type',
          type: 'select',
          options: ['Strategy', 'Implementation', 'Advisory', 'Training', 'Audit', 'Other'],
          required: true,
          showInList: true
        },
        {
          name: 'projectScope',
          label: 'Project Scope',
          type: 'textarea',
          required: false,
          showInList: false
        },
        {
          name: 'estimatedHours',
          label: 'Estimated Hours',
          type: 'number',
          required: false,
          showInList: true
        },
        {
          name: 'hourlyRate',
          label: 'Hourly Rate',
          type: 'currency',
          required: false,
          showInList: false
        },
        {
          name: 'billingType',
          label: 'Billing Type',
          type: 'select',
          options: ['Fixed Fee', 'Hourly', 'Retainer', 'Value-Based'],
          required: false,
          showInList: true
        }
      ]
    }
  }
};

