/**
 * CRMFloat - Interior Design Industry Package
 * 
 * This configuration is optimized for interior design businesses.
 * Includes design-specific workflows, fields, and modules.
 * 
 * Package: Interior Design Pro
 * Original Configuration: GHS (Design Pipeline)
 */

const defaultConfig = require('./default.config');

module.exports = {
  ...defaultConfig,
  
  // Business Information
  business: {
    ...defaultConfig.business,
    type: 'interior-design',
    industry: 'Interior Design & Architecture',
    packageName: 'Interior Design Pro',
    packageVersion: '1.0.0'
  },

  // Module Configuration
  modules: {
    ...defaultConfig.modules,
    
    // Enable design-specific modules
    designers: { 
      enabled: true,
      displayName: 'Designers',
      icon: 'palette',
      package: 'interior-design'
    },
    properties: { 
      enabled: true,
      displayName: 'Properties',
      icon: 'home',
      package: 'interior-design'
    },
    warranty: { 
      enabled: true,
      displayName: 'Warranty',
      icon: 'verified_user',
      package: 'interior-design'
    },
    siteVisits: {
      enabled: true,
      displayName: 'Site Visits',
      icon: 'location_on',
      package: 'interior-design'
    },
    materials: {
      enabled: true,
      displayName: 'Materials',
      icon: 'texture',
      package: 'interior-design'
    },
    vendors: {
      enabled: true,
      displayName: 'Vendors',
      icon: 'store',
      package: 'interior-design'
    }
  },

  // Terminology Configuration
  terminology: {
    deal: {
      singular: 'Project',
      plural: 'Projects'
    },
    client: {
      singular: 'Client',
      plural: 'Clients'
    },
    team: {
      singular: 'Designer',
      plural: 'Designers'
    },
    pipeline: {
      singular: 'Design Pipeline',
      plural: 'Design Pipelines'
    }
  },

  // Workflow Configuration - Interior Design Specific
  workflow: {
    defaultPipeline: 'design-process',
    pipelines: {
      'design-process': {
        name: 'Design Project Pipeline',
        stages: [
          { 
            id: 'lead-generation', 
            name: 'Lead Generation', 
            color: '#2196F3', 
            probability: 5,
            order: 1,
            description: 'Initial lead capture and qualification'
          },
          { 
            id: 'initial-engagement', 
            name: 'Initial Engagement', 
            color: '#00BCD4', 
            probability: 10,
            order: 2,
            description: 'First contact with potential client'
          },
          { 
            id: 'scheduling-visit', 
            name: 'Scheduling Visit', 
            color: '#4CAF50', 
            probability: 20,
            order: 3,
            description: 'Site visit appointment scheduled'
          },
          { 
            id: 'consultation', 
            name: 'Consultation & Data Capture', 
            color: '#8BC34A', 
            probability: 30,
            order: 4,
            description: 'Site visit completed, requirements gathered'
          },
          { 
            id: 'design-brief', 
            name: 'Design Brief & Proposal', 
            color: '#CDDC39', 
            probability: 40,
            order: 5,
            description: 'Design proposal and quotation prepared'
          },
          { 
            id: 'design-development', 
            name: 'Design Development', 
            color: '#FFC107', 
            probability: 50,
            order: 6,
            description: 'Design concepts and mood boards'
          },
          { 
            id: 'detailed-drawings', 
            name: 'Detailed Drawings & Vendor Coordination', 
            color: '#FF9800', 
            probability: 60,
            order: 7,
            description: 'Technical drawings and vendor selection'
          },
          { 
            id: 'project-execution', 
            name: 'Project Execution', 
            color: '#FF5722', 
            probability: 75,
            order: 8,
            description: 'Active construction/implementation'
          },
          { 
            id: 'handover', 
            name: 'Handover', 
            color: '#9C27B0', 
            probability: 90,
            order: 9,
            description: 'Project completion and client handover'
          },
          { 
            id: 'project-closure', 
            name: 'Project Closure', 
            color: '#4CAF50', 
            probability: 100,
            order: 10,
            description: 'Final sign-off and documentation',
            isClosed: true,
            isWon: true
          },
          { 
            id: 'warranty-period', 
            name: 'Warranty Period', 
            color: '#2196F3', 
            probability: 100,
            order: 11,
            description: 'Post-completion warranty support'
          }
        ]
      }
    },
    
    // Kanban Configuration (Simplified for Project Management)
    kanban: {
      columns: [
        { id: 'todo', name: 'To Do', color: '#2196F3', order: 1 },
        { id: 'in-progress', name: 'In Progress', color: '#FF9800', order: 2 },
        { id: 'blocked', name: 'Blocked', color: '#F44336', order: 3 },
        { id: 'paused', name: 'Paused', color: '#9E9E9E', order: 4 },
        { id: 'done', name: 'Done', color: '#4CAF50', order: 5 },
        { id: 'canceled', name: 'Canceled', color: '#757575', order: 6 }
      ],
      defaultColumn: 'todo'
    }
  },

  // Custom Fields Configuration - Interior Design Specific
  fields: {
    client: {
      ...defaultConfig.fields.client,
      custom: [
        {
          name: 'propertyType',
          label: 'Property Type',
          type: 'select',
          options: ['Residential', 'Commercial', 'Mixed Use', 'Hospitality', 'Healthcare'],
          required: false,
          showInList: true
        },
        {
          name: 'propertySize',
          label: 'Property Size (sq ft)',
          type: 'number',
          required: false,
          showInList: true
        },
        {
          name: 'designStyle',
          label: 'Preferred Design Style',
          type: 'multi-select',
          options: ['Modern', 'Contemporary', 'Traditional', 'Minimalist', 'Industrial', 'Rustic', 'Eclectic'],
          required: false,
          showInList: false
        }
      ]
    },
    deal: {
      ...defaultConfig.fields.deal,
      custom: [
        {
          name: 'propertyType',
          label: 'Property Type',
          type: 'select',
          options: ['Residential', 'Commercial', 'Mixed Use', 'Industrial', 'Hospitality', 'Healthcare', 'Educational', 'Other'],
          required: true,
          showInList: true
        },
        {
          name: 'dealType',
          label: 'Project Type',
          type: 'select',
          options: ['New Construction', 'Renovation', 'Interior Design', 'Consultation', 'Turnkey Project'],
          required: true,
          showInList: true
        },
        {
          name: 'projectSize',
          label: 'Size (sq ft)',
          type: 'number',
          required: false,
          showInList: true
        },
        {
          name: 'designStyle',
          label: 'Design Style',
          type: 'select',
          options: ['Modern', 'Contemporary', 'Traditional', 'Minimalist', 'Industrial', 'Rustic', 'Scandinavian', 'Mid-Century', 'Bohemian', 'Eclectic'],
          required: false,
          showInList: false
        },
        {
          name: 'roomsIncluded',
          label: 'Rooms/Areas',
          type: 'multi-select',
          options: ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining Room', 'Office', 'Outdoor Space', 'Entire Home'],
          required: false,
          showInList: false
        },
        {
          name: 'siteAddress',
          label: 'Site Address',
          type: 'textarea',
          required: false,
          showInList: false
        },
        {
          name: 'expectedStartDate',
          label: 'Expected Start Date',
          type: 'date',
          required: false,
          showInList: false
        },
        {
          name: 'estimatedDuration',
          label: 'Estimated Duration (weeks)',
          type: 'number',
          required: false,
          showInList: false
        }
      ]
    },
    team: {
      ...defaultConfig.fields.team,
      custom: [
        {
          name: 'designSpecialty',
          label: 'Design Specialty',
          type: 'multi-select',
          options: ['Residential', 'Commercial', '3D Visualization', 'Space Planning', 'Material Selection', 'Lighting Design', 'Kitchen Design', 'Bathroom Design'],
          required: false,
          showInList: true
        },
        {
          name: 'certifications',
          label: 'Certifications',
          type: 'textarea',
          required: false,
          showInList: false
        },
        {
          name: 'portfolioLink',
          label: 'Portfolio URL',
          type: 'url',
          required: false,
          showInList: false
        }
      ]
    }
  },

  // Feature Flags - Interior Design Specific
  features: {
    ...defaultConfig.features,
    
    // Design-specific features
    materialLibrary: true,
    vendorManagement: true,
    siteVisitScheduling: true,
    visualizationLinks: true,
    warrantyTracking: true,
    projectPhotos: true,
    beforeAfterGallery: true,
    designApprovals: true
  },

  // Additional Settings for Interior Design
  designSettings: {
    // Material Categories
    materialCategories: [
      'Flooring',
      'Wall Finishes',
      'Ceiling',
      'Furniture',
      'Lighting',
      'Fixtures',
      'Soft Furnishing',
      'Art & Decor'
    ],
    
    // Room Types
    roomTypes: [
      'Living Room',
      'Bedroom',
      'Kitchen',
      'Bathroom',
      'Dining Room',
      'Home Office',
      'Family Room',
      'Outdoor Space',
      'Entrance/Foyer',
      'Utility Room'
    ],
    
    // Standard Deliverables
    deliverables: [
      '2D Floor Plans',
      '3D Visualizations',
      'Mood Boards',
      'Material Board',
      'Lighting Plan',
      'Furniture Layout',
      'Electrical Plan',
      'Plumbing Layout',
      'Detail Drawings',
      'Project Schedule'
    ],
    
    // Warranty Periods
    warrantyPeriods: {
      standard: 12, // months
      extended: 24,
      premium: 36
    }
  },

  // Default Values - Interior Design Specific
  defaults: {
    ...defaultConfig.defaults,
    dealStage: 'lead-generation',
    kanbanColumn: 'todo',
    propertyType: 'Residential',
    dealType: 'Interior Design',
    warrantyPeriod: 12
  }
};

