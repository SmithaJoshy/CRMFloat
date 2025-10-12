# CRMFloat - Customization & Configuration Guide

## 🎯 Making CRMFloat Industry-Agnostic

CRMFloat is now designed to be **industry-agnostic** with configurable workflows, fields, and modules that can be tailored to any business type.

---

## 🔧 Configuration System

### Configuration File Structure

```javascript
// config/businessConfig.js
module.exports = {
  business: {
    type: 'generic', // 'generic', 'interior-design', 'consulting', 'real-estate', etc.
    name: 'Your Business Name',
    industry: 'Professional Services',
  },
  
  modules: {
    // Core modules (always enabled)
    clients: { enabled: true },
    deals: { enabled: true },
    pipeline: { enabled: true },
    kanban: { enabled: true },
    
    // Optional modules
    beyondCare: { enabled: true },
    designers: { enabled: false }, // Industry-specific
    warranty: { enabled: false },  // Industry-specific
    customModule1: { enabled: false },
  },
  
  workflow: {
    stages: [
      'Lead Generation',
      'Qualification',
      'Proposal',
      'Negotiation',
      'Closed Won',
      'Closed Lost'
    ],
    kanbanColumns: [
      'To Do',
      'In Progress',
      'Blocked',
      'Done',
      'Canceled'
    ]
  },
  
  fields: {
    client: {
      custom: [
        { name: 'industry', type: 'text', required: false },
        { name: 'companySize', type: 'select', options: ['1-10', '11-50', '51-200', '200+'], required: false }
      ]
    },
    deal: {
      custom: [
        { name: 'dealType', type: 'select', options: ['New Business', 'Upsell', 'Renewal'], required: false }
      ]
    }
  },
  
  terminology: {
    deal: 'Deal',      // or 'Project', 'Opportunity', 'Case'
    client: 'Client',  // or 'Customer', 'Account', 'Contact'
    team: 'Team',      // or 'Designer', 'Consultant', 'Agent'
  }
};
```

---

## 📋 Generic vs Industry-Specific Features

### ✅ Generic Core Features (All Industries)

#### 1. Client Management
- **Generic Fields:**
  - Name, Email, Phone
  - Company/Organization
  - Address
  - Source (How they found you)
  - Status (Active, Inactive, Prospect)
  - Budget/Target Value
  - Notes
  - Tags
  
- **Configurable:**
  - Custom fields based on industry
  - Additional contact types
  - Custom tags and categories

#### 2. Deal/Opportunity Management
- **Generic Fields:**
  - Deal Name
  - Client
  - Value
  - Stage
  - Priority
  - Assigned To
  - Expected Close Date
  - Status
  - Notes History
  
- **Configurable:**
  - Custom stages
  - Custom fields
  - Deal types

#### 3. Pipeline Management
- **Generic Features:**
  - Visual pipeline view
  - Drag-and-drop stage progression
  - Filtering and search
  - Stage conversion metrics
  
- **Configurable:**
  - Custom stage names
  - Number of stages
  - Stage requirements

#### 4. Kanban Board
- **Generic Features:**
  - Visual task management
  - Drag-and-drop
  - Status columns
  - Card customization
  
- **Configurable:**
  - Column names
  - Column count
  - Card fields

#### 5. Beyond Care (Customer Success)
- **Generic Features:**
  - Customer loyalty tracking
  - Testimonial management
  - Follow-up scheduling
  - Rewards & referrals
  - NPS tracking
  
- **Configurable:**
  - Loyalty criteria
  - Reward types
  - Follow-up templates

#### 6. Team Management
- **Generic Features:**
  - Team member profiles
  - Availability tracking
  - Workload management
  - Communication tools
  
- **Configurable:**
  - Role names (Designer → Consultant → Agent)
  - Custom skills
  - Department structure

#### 7. Invoicing & Payments
- **Generic Features:**
  - Invoice creation
  - Payment tracking
  - Payment reminders
  - Revenue reporting
  
- **Universal:** Works for all industries

#### 8. Documents & Files
- **Generic Features:**
  - File upload and storage
  - Document organization
  - Version control
  
- **Universal:** Works for all industries

---

### 🎨 Industry-Specific Features (Optional Modules)

#### Interior Design Module (GHS Customization)
**Module Name:** `interior-design-pro`

**Specific Features:**
- Property type tracking (Residential, Commercial, etc.)
- Size/square footage
- Room-specific planning
- Material selection
- Vendor coordination
- Design milestones
- Site visit scheduling
- 3D visualization links

**Workflow Stages:**
1. Lead Generation
2. Initial Engagement
3. Scheduling Visit
4. Consultation & Data Capture
5. Design Brief & Proposal
6. Design Development
7. Detailed Drawings & Vendor Coordination
8. Project Execution
9. Handover
10. Project Closure
11. Warranty Period

**Custom Fields:**
- Property Type
- Deal Type (New Construction, Renovation, etc.)
- Size (sq ft)
- Design Style
- Material Preferences

---

## 🔄 Configuration Templates

### Template 1: Consulting/Professional Services

```javascript
{
  business: {
    type: 'consulting',
    name: 'Your Consulting Firm'
  },
  
  terminology: {
    deal: 'Project',
    client: 'Client',
    team: 'Consultant'
  },
  
  workflow: {
    stages: [
      'Lead',
      'Discovery Call',
      'Proposal',
      'Contract Negotiation',
      'Onboarding',
      'In Progress',
      'Completed',
      'Lost'
    ]
  },
  
  modules: {
    clients: { enabled: true },
    deals: { enabled: true },
    pipeline: { enabled: true },
    kanban: { enabled: true },
    beyondCare: { enabled: true },
    designers: { enabled: false },
    consultants: { enabled: true }, // Replaces designers
    warranty: { enabled: false }
  }
}
```

### Template 2: Real Estate

```javascript
{
  business: {
    type: 'real-estate',
    name: 'Your Real Estate Agency'
  },
  
  terminology: {
    deal: 'Property',
    client: 'Client',
    team: 'Agent'
  },
  
  workflow: {
    stages: [
      'New Lead',
      'Viewing Scheduled',
      'Viewed',
      'Offer Made',
      'Negotiating',
      'Under Contract',
      'Closed',
      'Fell Through'
    ]
  },
  
  modules: {
    clients: { enabled: true },
    deals: { enabled: true },
    pipeline: { enabled: true },
    kanban: { enabled: true },
    beyondCare: { enabled: true },
    properties: { enabled: true },
    agents: { enabled: true }
  }
}
```

### Template 3: Sales/SaaS

```javascript
{
  business: {
    type: 'saas-sales',
    name: 'Your SaaS Company'
  },
  
  terminology: {
    deal: 'Opportunity',
    client: 'Account',
    team: 'Sales Rep'
  },
  
  workflow: {
    stages: [
      'Lead',
      'Qualified',
      'Demo Scheduled',
      'Demo Complete',
      'Proposal',
      'Negotiation',
      'Closed Won',
      'Closed Lost'
    ]
  },
  
  modules: {
    clients: { enabled: true },
    deals: { enabled: true },
    pipeline: { enabled: true },
    kanban: { enabled: true },
    beyondCare: { enabled: true },
    salesReps: { enabled: true }
  }
}
```

### Template 4: Generic Business

```javascript
{
  business: {
    type: 'generic',
    name: 'Your Business'
  },
  
  terminology: {
    deal: 'Deal',
    client: 'Client',
    team: 'Team Member'
  },
  
  workflow: {
    stages: [
      'New',
      'Contacted',
      'Qualified',
      'Proposal',
      'Won',
      'Lost'
    ]
  },
  
  modules: {
    clients: { enabled: true },
    deals: { enabled: true },
    pipeline: { enabled: true },
    kanban: { enabled: true },
    beyondCare: { enabled: true },
    team: { enabled: true }
  }
}
```

---

## 🛠️ Implementation Plan

### Phase 1: Configuration System

**Create Configuration Files:**

```
CRMFloat/
├── config/
│   ├── default.config.js          # Default generic config
│   ├── interior-design.config.js  # Interior design template
│   ├── consulting.config.js       # Consulting template
│   ├── real-estate.config.js      # Real estate template
│   ├── saas.config.js             # SaaS sales template
│   └── custom.config.js           # User customization (gitignored)
```

### Phase 2: Rename Generic Components

**Current → New:**
- `Designers` → `Team Members` (configurable to any role)
- `Project` → `Deal/Opportunity` (configurable terminology)
- `Beyond Care` → `Customer Success` (generic name)
- `Warranty` → Optional module (disabled by default)

### Phase 3: Dynamic Field System

**Implement Custom Fields:**
```javascript
// Example: Adding custom fields
customFields: {
  client: [
    { name: 'industry', label: 'Industry', type: 'select', 
      options: ['Technology', 'Healthcare', 'Finance', 'Other'] },
    { name: 'annualRevenue', label: 'Annual Revenue', type: 'currency' },
    { name: 'employeeCount', label: 'Employee Count', type: 'number' }
  ],
  deal: [
    { name: 'dealSource', label: 'Deal Source', type: 'select',
      options: ['Inbound', 'Outbound', 'Referral', 'Partner'] },
    { name: 'competitorInfo', label: 'Competitors', type: 'text' }
  ]
}
```

### Phase 4: Workflow Engine

**Dynamic Workflow Configuration:**
```javascript
// Define custom workflows
workflows: {
  sales: {
    name: 'Sales Process',
    stages: [
      { id: 'lead', name: 'Lead', color: '#2196F3', probability: 10 },
      { id: 'qualified', name: 'Qualified', color: '#4CAF50', probability: 25 },
      { id: 'proposal', name: 'Proposal', color: '#FF9800', probability: 50 },
      { id: 'negotiation', name: 'Negotiation', color: '#F44336', probability: 75 },
      { id: 'won', name: 'Closed Won', color: '#4CAF50', probability: 100 },
      { id: 'lost', name: 'Closed Lost', color: '#9E9E9E', probability: 0 }
    ]
  }
}
```

---

## 📱 UI Configuration

### Admin Settings Page

**New Settings Section:**
```
Settings > Business Configuration
  ├── Basic Information
  │   ├── Business Name
  │   ├── Industry Type
  │   └── Logo Upload
  ├── Terminology
  │   ├── Deal Name (Deal/Project/Opportunity/Case)
  │   ├── Client Name (Client/Customer/Account/Contact)
  │   └── Team Name (Team/Designer/Consultant/Agent)
  ├── Workflow Configuration
  │   ├── Pipeline Stages (Add/Edit/Remove/Reorder)
  │   ├── Kanban Columns (Add/Edit/Remove/Reorder)
  │   └── Stage Probabilities
  ├── Custom Fields
  │   ├── Client Fields (Add/Edit/Remove)
  │   ├── Deal Fields (Add/Edit/Remove)
  │   └── Field Validation Rules
  └── Modules
      ├── Enable/Disable Modules
      ├── Module-Specific Settings
      └── Industry Packages
```

---

## 🎨 Industry Packages

### Pre-built Industry Configurations

**Available Packages:**

1. **Generic Business** (Default)
   - Basic CRM features
   - Customizable for any business
   - No industry-specific fields

2. **Interior Design Pro** (GHS Original)
   - Property management
   - Design workflow
   - Material tracking
   - Site visits

3. **Professional Services**
   - Project-based workflows
   - Time tracking
   - Consultant management
   - Deliverables tracking

4. **Real Estate**
   - Property listings
   - Showing management
   - Offer tracking
   - Agent commission

5. **SaaS Sales**
   - Trial management
   - Demo tracking
   - Subscription handling
   - MRR/ARR metrics

6. **Insurance**
   - Policy management
   - Claim tracking
   - Renewal management
   - Agent tracking

7. **Legal Services**
   - Case management
   - Billable hours
   - Court date tracking
   - Document management

8. **Healthcare**
   - Patient management
   - Appointment scheduling
   - Treatment tracking
   - HIPAA compliance

---

## 🔌 Plugin System (Future)

### Extensibility Framework

```javascript
// Example plugin structure
const MyIndustryPlugin = {
  name: 'my-industry-plugin',
  version: '1.0.0',
  
  fields: {
    client: [/* custom fields */],
    deal: [/* custom fields */]
  },
  
  workflows: {
    /* custom workflows */
  },
  
  components: {
    /* custom UI components */
  },
  
  api: {
    /* custom API endpoints */
  }
};
```

---

## 📊 Migration from Design-Specific to Generic

### Current Design-Specific Elements

**To Be Made Generic:**

1. **"Designers" Tab**
   → Rename to "Team Members"
   → Configurable role name

2. **"Property Type" Field**
   → Move to interior-design module
   → Generic equivalent: "Deal Type"

3. **"Beyond Care" Terminology**
   → Rename to "Customer Success"
   → Keep all features, generic language

4. **Workflow Stages**
   → Use generic default stages
   → Allow full customization
   → Provide industry templates

5. **Size/Square Footage**
   → Move to interior-design module
   → Generic equivalent: "Deal Size"

---

## 🎯 Configuration Priority

### Must Have (v1.0)
- [x] Configuration file system
- [x] Generic terminology
- [x] Customizable workflow stages
- [x] Module enable/disable
- [x] Industry templates

### Should Have (v1.1)
- [ ] UI for configuration (Admin panel)
- [ ] Custom field builder
- [ ] Workflow visual editor
- [ ] Import/export configurations

### Nice to Have (v2.0)
- [ ] Plugin system
- [ ] Marketplace for industry packages
- [ ] Community templates
- [ ] A/B testing workflows

---

## 📝 Usage Example

### Setup for a Consulting Firm

1. **Copy Template:**
   ```bash
   cp config/consulting.config.js config/custom.config.js
   ```

2. **Customize:**
   ```javascript
   // config/custom.config.js
   module.exports = {
     business: {
       type: 'consulting',
       name: 'Acme Consulting',
       industry: 'Management Consulting'
     },
     
     terminology: {
       deal: 'Engagement',
       client: 'Client',
       team: 'Consultant'
     },
     
     workflow: {
       stages: [
         'Initial Contact',
         'Discovery',
         'Proposal',
         'Contract',
         'Delivery',
         'Completed'
       ]
     }
   };
   ```

3. **Apply Configuration:**
   ```bash
   npm run configure
   ```

4. **Start CRMFloat:**
   ```bash
   npm start
   ```

---

## 🚀 Benefits of Generic Approach

### For Users:
✅ **Flexibility** - Adapt to any business type
✅ **Scalability** - Grow with your business
✅ **Simplicity** - Only see what you need
✅ **Cost-Effective** - One tool, multiple uses

### For CRMFloat:
✅ **Wider Market** - Sell to any industry
✅ **Easier Maintenance** - One codebase
✅ **Faster Development** - Reusable components
✅ **Higher Value** - Premium customization options

---

## 💼 Pricing Impact

### New Pricing Model:

**Free Tier**
- Generic CRM only
- No industry packages
- Standard workflows

**Professional** - $29/user/month
- All generic features
- 1 industry package included
- Custom workflows

**Enterprise** - Custom
- All features
- Unlimited industry packages
- Custom module development
- White-label options

**Industry Packages** - $10/user/month each
- Interior Design Pro
- Real Estate Plus
- Professional Services
- SaaS Sales
- etc.

---

**CRMFloat** - Flexible, Configurable, Universal 💧

Your CRM, Your Way

© 2024 CRMFloat. All rights reserved.
