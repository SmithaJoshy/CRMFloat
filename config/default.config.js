/**
 * CRMFloat - Default Generic Configuration
 * 
 * This is the default configuration for CRMFloat.
 * Copy this file to custom.config.js and customize for your business.
 */

module.exports = {
  // Business Information
  business: {
    type: 'generic',
    name: 'Your Business Name',
    industry: 'Professional Services',
    logo: '/assets/logo.png',
    timezone: 'America/New_York',
    currency: {
      code: 'USD',
      symbol: '$',
      format: 'symbol-before' // 'symbol-before' or 'symbol-after'
    },
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h' // '12h' or '24h'
  },

  // Module Configuration
  modules: {
    // Core Modules (Always Enabled)
    clients: { 
      enabled: true,
      displayName: 'Clients',
      icon: 'people'
    },
    deals: { 
      enabled: true,
      displayName: 'Deals',
      icon: 'business_center'
    },
    pipeline: { 
      enabled: true,
      displayName: 'Pipeline',
      icon: 'timeline'
    },
    kanban: { 
      enabled: true,
      displayName: 'Kanban',
      icon: 'view_kanban'
    },
    
    // Optional Modules
    beyondCare: { 
      enabled: true,
      displayName: 'Customer Success',
      icon: 'favorite'
    },
    team: { 
      enabled: true,
      displayName: 'Team',
      icon: 'group'
    },
    documents: { 
      enabled: true,
      displayName: 'Documents',
      icon: 'folder'
    },
    invoices: { 
      enabled: true,
      displayName: 'Invoices',
      icon: 'receipt'
    },
    payments: { 
      enabled: true,
      displayName: 'Payments',
      icon: 'payment'
    },
    
    // Industry-Specific Modules (Disabled by Default)
    warranty: { 
      enabled: false,
      displayName: 'Warranty',
      icon: 'verified_user',
      package: 'interior-design'
    },
    properties: { 
      enabled: false,
      displayName: 'Properties',
      icon: 'home',
      package: 'real-estate'
    }
  },

  // Terminology Configuration
  terminology: {
    deal: {
      singular: 'Deal',
      plural: 'Deals'
    },
    client: {
      singular: 'Client',
      plural: 'Clients'
    },
    team: {
      singular: 'Team Member',
      plural: 'Team Members'
    },
    pipeline: {
      singular: 'Pipeline',
      plural: 'Pipelines'
    }
  },

  // Workflow Configuration
  workflow: {
    defaultPipeline: 'sales',
    pipelines: {
      sales: {
        name: 'Sales Pipeline',
        stages: [
          { 
            id: 'lead', 
            name: 'Lead', 
            color: '#2196F3', 
            probability: 10,
            order: 1
          },
          { 
            id: 'contacted', 
            name: 'Contacted', 
            color: '#00BCD4', 
            probability: 20,
            order: 2
          },
          { 
            id: 'qualified', 
            name: 'Qualified', 
            color: '#4CAF50', 
            probability: 40,
            order: 3
          },
          { 
            id: 'proposal', 
            name: 'Proposal', 
            color: '#FF9800', 
            probability: 60,
            order: 4
          },
          { 
            id: 'negotiation', 
            name: 'Negotiation', 
            color: '#F44336', 
            probability: 80,
            order: 5
          },
          { 
            id: 'won', 
            name: 'Closed Won', 
            color: '#4CAF50', 
            probability: 100,
            order: 6,
            isClosed: true,
            isWon: true
          },
          { 
            id: 'lost', 
            name: 'Closed Lost', 
            color: '#9E9E9E', 
            probability: 0,
            order: 7,
            isClosed: true,
            isLost: true
          }
        ]
      }
    },
    
    // Kanban Configuration
    kanban: {
      columns: [
        { id: 'todo', name: 'To Do', color: '#2196F3', order: 1 },
        { id: 'in-progress', name: 'In Progress', color: '#FF9800', order: 2 },
        { id: 'blocked', name: 'Blocked', color: '#F44336', order: 3 },
        { id: 'done', name: 'Done', color: '#4CAF50', order: 4 },
        { id: 'canceled', name: 'Canceled', color: '#9E9E9E', order: 5 }
      ],
      defaultColumn: 'todo'
    }
  },

  // Custom Fields Configuration
  fields: {
    client: {
      standard: [
        'name', 'email', 'phone', 'company', 'address', 
        'targetBudget', 'source', 'status', 'notes'
      ],
      custom: [
        {
          name: 'industry',
          label: 'Industry',
          type: 'select',
          options: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Other'],
          required: false,
          showInList: true
        },
        {
          name: 'companySize',
          label: 'Company Size',
          type: 'select',
          options: ['1-10', '11-50', '51-200', '201-500', '500+'],
          required: false,
          showInList: false
        }
      ]
    },
    deal: {
      standard: [
        'projectName', 'clientId', 'clientName', 'totalProjectValue',
        'currentStage', 'priorityLevel', 'assignedTeam', 'notes'
      ],
      custom: [
        {
          name: 'dealSource',
          label: 'Deal Source',
          type: 'select',
          options: ['Inbound', 'Outbound', 'Referral', 'Partner'],
          required: false,
          showInList: true
        },
        {
          name: 'dealType',
          label: 'Deal Type',
          type: 'select',
          options: ['New Business', 'Upsell', 'Cross-sell', 'Renewal'],
          required: false,
          showInList: true
        }
      ]
    },
    team: {
      standard: [
        'name', 'email', 'phone', 'role', 'department',
        'availability', 'skills'
      ],
      custom: []
    }
  },

  // Feature Flags
  features: {
    // Core Features
    multiCurrency: false,
    customFields: true,
    advancedReporting: false,
    apiAccess: true,
    
    // Integration Features
    emailIntegration: false,
    calendarSync: false,
    webhooks: false,
    
    // Advanced Features
    workflowAutomation: false,
    aiInsights: false,
    customDashboards: false,
    bulkOperations: true
  },

  // User Roles & Permissions
  roles: {
    admin: {
      name: 'Admin',
      permissions: ['all']
    },
    manager: {
      name: 'Manager',
      permissions: ['clients.*', 'deals.*', 'team.view', 'reports.*']
    },
    sales: {
      name: 'Sales',
      permissions: ['clients.*', 'deals.*', 'own-records']
    },
    viewer: {
      name: 'Viewer',
      permissions: ['clients.view', 'deals.view']
    }
  },

  // Notification Settings
  notifications: {
    email: {
      enabled: true,
      events: ['deal.won', 'deal.lost', 'client.new', 'payment.received']
    },
    inApp: {
      enabled: true,
      events: ['deal.stage_change', 'deal.assigned', 'client.note_added']
    },
    sms: {
      enabled: false,
      events: []
    }
  },

  // Default Values
  defaults: {
    dealPriority: 'Medium',
    dealStage: 'lead',
    clientStatus: 'prospect',
    kanbanColumn: 'todo',
    currency: 'USD'
  },

  // Display Settings
  display: {
    itemsPerPage: 25,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    firstDayOfWeek: 0, // 0 = Sunday, 1 = Monday
    dashboardLayout: 'default',
    theme: 'light' // 'light' or 'dark'
  },

  // Integration Settings
  integrations: {
    email: {
      provider: null, // 'gmail', 'outlook', 'sendgrid'
      apiKey: null
    },
    calendar: {
      provider: null, // 'google', 'outlook'
      apiKey: null
    },
    payment: {
      provider: null, // 'stripe', 'paypal'
      apiKey: null
    },
    storage: {
      provider: 'local', // 'local', 's3', 'gcs'
      bucket: null
    }
  }
};

