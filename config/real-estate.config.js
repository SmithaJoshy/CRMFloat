/**
 * CRMFloat - Real Estate Package
 * 
 * Optimized for real estate agencies and property management.
 */

const defaultConfig = require('./default.config');

module.exports = {
  ...defaultConfig,
  
  business: {
    ...defaultConfig.business,
    type: 'real-estate',
    industry: 'Real Estate',
    packageName: 'Real Estate Pro'
  },

  terminology: {
    deal: {
      singular: 'Property Deal',
      plural: 'Property Deals'
    },
    client: {
      singular: 'Client',
      plural: 'Clients'
    },
    team: {
      singular: 'Agent',
      plural: 'Agents'
    }
  },

  workflow: {
    defaultPipeline: 'property-sales',
    pipelines: {
      'property-sales': {
        name: 'Property Sales Pipeline',
        stages: [
          { id: 'new-lead', name: 'New Lead', color: '#2196F3', probability: 10, order: 1 },
          { id: 'viewing-scheduled', name: 'Viewing Scheduled', color: '#00BCD4', probability: 25, order: 2 },
          { id: 'viewed', name: 'Viewed', color: '#4CAF50', probability: 40, order: 3 },
          { id: 'offer-made', name: 'Offer Made', color: '#FF9800', probability: 60, order: 4 },
          { id: 'negotiating', name: 'Negotiating', color: '#F44336', probability: 75, order: 5 },
          { id: 'under-contract', name: 'Under Contract', color: '#9C27B0', probability: 90, order: 6 },
          { id: 'closed', name: 'Closed', color: '#4CAF50', probability: 100, order: 7, isClosed: true, isWon: true },
          { id: 'fell-through', name: 'Fell Through', color: '#9E9E9E', probability: 0, order: 8, isClosed: true, isLost: true }
        ]
      }
    }
  },

  fields: {
    deal: {
      ...defaultConfig.fields.deal,
      custom: [
        {
          name: 'propertyAddress',
          label: 'Property Address',
          type: 'textarea',
          required: true,
          showInList: true
        },
        {
          name: 'propertyType',
          label: 'Property Type',
          type: 'select',
          options: ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Commercial', 'Land'],
          required: true,
          showInList: true
        },
        {
          name: 'bedrooms',
          label: 'Bedrooms',
          type: 'number',
          required: false,
          showInList: true
        },
        {
          name: 'bathrooms',
          label: 'Bathrooms',
          type: 'number',
          required: false,
          showInList: true
        },
        {
          name: 'squareFeet',
          label: 'Square Feet',
          type: 'number',
          required: false,
          showInList: true
        },
        {
          name: 'listingPrice',
          label: 'Listing Price',
          type: 'currency',
          required: true,
          showInList: true
        },
        {
          name: 'commissionRate',
          label: 'Commission Rate (%)',
          type: 'number',
          required: false,
          showInList: false
        }
      ]
    }
  }
};

