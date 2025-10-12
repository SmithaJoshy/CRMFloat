# CRMFloat - Configuration Quick Start Guide

## 🎯 Choose Your Industry Package

CRMFloat can be configured for any business type. Choose the configuration that best matches your needs.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Choose Your Package

```bash
cd /Users/smitha/Documents/Shwetha/CRM/CRMProjects/CRMFloat/config
```

**Available Packages:**
- `default.config.js` - Generic business (works for everyone)
- `interior-design.config.js` - Interior design & architecture (GHS original)
- `consulting.config.js` - Consulting & professional services
- `real-estate.config.js` - Real estate agencies
- Create your own `custom.config.js`

### Step 2: Set Your Configuration

**Option A: Use a Pre-built Package**
```bash
# Set environment variable
export INDUSTRY_PACKAGE=interior-design
# or
export INDUSTRY_PACKAGE=consulting
# or  
export INDUSTRY_PACKAGE=real-estate
```

**Option B: Create Custom Configuration**
```bash
# Copy a template
cp config/interior-design.config.js config/custom.config.js

# Edit custom.config.js with your preferences
nano config/custom.config.js
```

### Step 3: Start CRMFloat

```bash
# Start with your configuration
npm start
```

That's it! CRMFloat will automatically load your configuration.

---

## 📋 Configuration Comparison

### Generic Business (Default)

**Best For:** Any business type  
**Terminology:**
- Deals = "Deals"
- Clients = "Clients"  
- Team = "Team Members"

**Workflow Stages:**
1. New
2. Contacted
3. Qualified
4. Proposal
5. Won
6. Lost

**Features:**
- ✅ Core CRM
- ✅ Pipeline
- ✅ Kanban
- ✅ Customer Success
- ❌ Industry-specific features

---

### Interior Design Pro (GHS Original)

**Best For:** Interior designers, architects, design studios  
**Terminology:**
- Deals = "Projects"
- Clients = "Clients"
- Team = "Designers"

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

**Features:**
- ✅ All Generic Features
- ✅ Property management
- ✅ Design workflow
- ✅ Site visits
- ✅ Material tracking
- ✅ Vendor coordination
- ✅ Warranty management

**Custom Fields:**
- Property Type (Residential, Commercial, etc.)
- Project Type (New Construction, Renovation, etc.)
- Size (square footage)
- Design Style
- Rooms/Areas

---

### Professional Services (Consulting)

**Best For:** Consultants, agencies, professional services  
**Terminology:**
- Deals = "Engagements"
- Clients = "Clients"
- Team = "Consultants"

**Workflow Stages:**
1. New Lead
2. Discovery Call
3. Needs Analysis
4. Proposal
5. Contract Negotiation
6. Client Onboarding
7. Service Delivery
8. Completed
9. Lost

**Features:**
- ✅ All Generic Features
- ✅ Time tracking
- ✅ Consultant management
- ✅ Project scoping
- ✅ Billable hours

**Custom Fields:**
- Service Type (Strategy, Implementation, etc.)
- Estimated Hours
- Hourly Rate
- Billing Type (Fixed, Hourly, Retainer)

---

### Real Estate

**Best For:** Real estate agencies, brokers, agents  
**Terminology:**
- Deals = "Property Deals"
- Clients = "Clients"
- Team = "Agents"

**Workflow Stages:**
1. New Lead
2. Viewing Scheduled
3. Viewed
4. Offer Made
5. Negotiating
6. Under Contract
7. Closed
8. Fell Through

**Features:**
- ✅ All Generic Features
- ✅ Property listings
- ✅ Viewing management
- ✅ Offer tracking
- ✅ Agent commissions

**Custom Fields:**
- Property Address
- Property Type (Single Family, Condo, etc.)
- Bedrooms/Bathrooms
- Square Feet
- Listing Price
- Commission Rate

---

## 🔧 Customizing Your Configuration

### Example: Custom Configuration for Your Business

1. **Copy a template:**
```bash
cp config/default.config.js config/custom.config.js
```

2. **Edit `custom.config.js`:**
```javascript
module.exports = {
  business: {
    type: 'my-business',
    name: 'Acme Corporation',
    industry: 'Your Industry',
    currency: {
      code: 'USD',
      symbol: '$',
      format: 'symbol-before'
    }
  },
  
  terminology: {
    deal: {
      singular: 'Opportunity',  // Change to your preference
      plural: 'Opportunities'
    },
    client: {
      singular: 'Account',      // Change to your preference
      plural: 'Accounts'
    },
    team: {
      singular: 'Rep',          // Change to your preference
      plural: 'Reps'
    }
  },
  
  workflow: {
    pipelines: {
      'my-pipeline': {
        name: 'My Sales Process',
        stages: [
          { id: 'stage1', name: 'Stage 1', color: '#2196F3', probability: 20, order: 1 },
          { id: 'stage2', name: 'Stage 2', color: '#4CAF50', probability: 50, order: 2 },
          { id: 'stage3', name: 'Won', color: '#4CAF50', probability: 100, order: 3, isClosed: true, isWon: true }
        ]
      }
    }
  },
  
  // Add your custom fields
  fields: {
    client: {
      custom: [
        {
          name: 'yourField',
          label: 'Your Field Name',
          type: 'text',
          required: false,
          showInList: true
        }
      ]
    }
  }
};
```

3. **Restart CRMFloat:**
```bash
npm start
```

---

## 🎨 Customization Options

### Business Information
- Business name and logo
- Industry type
- Currency and format
- Date/time format
- Timezone

### Terminology
- Rename "Deals" to "Projects", "Opportunities", "Cases", etc.
- Rename "Clients" to "Customers", "Accounts", "Contacts", etc.
- Rename "Team" to "Designers", "Consultants", "Agents", etc.

### Workflow Stages
- Add/remove/rename stages
- Change stage colors
- Set probability percentages
- Reorder stages
- Define win/loss stages

### Kanban Columns
- Customize column names
- Change colors
- Add/remove columns
- Set default column

### Custom Fields
- Add fields to Clients
- Add fields to Deals
- Add fields to Team
- Field types: text, number, select, date, currency, etc.

### Modules
- Enable/disable features
- Show/hide navigation items
- Configure module settings

---

## 🔄 Switching Configurations

### Method 1: Environment Variable
```bash
# Set industry package
export INDUSTRY_PACKAGE=interior-design
npm start

# Or
INDUSTRY_PACKAGE=consulting npm start
```

### Method 2: Custom Config File
```bash
# Create custom.config.js
cp config/consulting.config.js config/custom.config.js

# Edit as needed
nano config/custom.config.js

# Restart (automatically uses custom.config.js)
npm start
```

### Method 3: Runtime API (Coming Soon)
```javascript
// Update via admin panel UI
POST /api/config
{
  "business": { "type": "consulting" },
  "terminology": { "deal": "Engagement" }
}
```

---

## 📱 How Configuration Affects UI

### Navigation Menu
- Shows/hides modules based on `modules.*.enabled`
- Uses `displayName` for menu labels
- Uses `icon` for menu icons

### Page Titles
- "Deals" → "Projects" (interior-design)
- "Deals" → "Engagements" (consulting)
- "Deals" → "Properties" (real-estate)

### Form Fields
- Standard fields always shown
- Custom fields added based on configuration
- Field validation based on `required` flag

### Workflow View
- Displays stages from active pipeline
- Stage colors from configuration
- Stage names from terminology

### Kanban Board
- Column names from configuration
- Column colors from configuration
- Default column for new items

---

## 🎯 Recommended Configuration by Business Type

### SaaS Companies
```bash
INDUSTRY_PACKAGE=saas npm start
```
- Terminology: Opportunities, Accounts, Sales Reps
- Features: Trial tracking, MRR metrics, demo management

### Design Agencies (Like GHS)
```bash
INDUSTRY_PACKAGE=interior-design npm start
```
- Terminology: Projects, Clients, Designers
- Features: Property management, design workflow, warranties

### Consulting Firms
```bash
INDUSTRY_PACKAGE=consulting npm start
```
- Terminology: Engagements, Clients, Consultants
- Features: Time tracking, deliverables, hourly billing

### Real Estate
```bash
INDUSTRY_PACKAGE=real-estate npm start
```
- Terminology: Property Deals, Clients, Agents
- Features: Property listings, showings, commissions

### Generic Business
```bash
# No package needed - default
npm start
```
- Terminology: Deals, Clients, Team Members
- Features: Core CRM only

---

## 💡 Pro Tips

### Start Generic, Add Features Later
1. Start with default configuration
2. Test core functionality
3. Add industry package when needed
4. Customize incrementally

### Test Before Production
1. Use `dev:mock` for testing configurations
2. Verify all pages load correctly
3. Test custom fields appear
4. Check terminology updates

### Backup Configuration
```bash
# Before making changes
cp config/custom.config.js config/custom.config.js.backup
```

### Version Control
```bash
# Track configuration changes
git add config/custom.config.js
git commit -m "Update business configuration"
```

---

## 🆘 Troubleshooting

### Configuration Not Loading?
```bash
# Check file exists
ls -la config/custom.config.js

# Check syntax errors
node -c config/custom.config.js

# Check server logs
npm start
# Look for "Configuration loaded successfully"
```

### Custom Fields Not Showing?
- Verify field definition in config
- Check `showInList: true` for list views
- Restart server after config changes
- Clear browser cache

### Wrong Terminology Displayed?
- Check terminology section in config
- Ensure both singular and plural are set
- Restart application
- Hard refresh browser (Cmd+Shift+R)

---

## 📞 Need Help?

**Configuration Support:**
- 📧 Email: support@crmfloat.com
- 📖 Docs: [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)
- 💬 Community Forum
- 🎥 Video Tutorials

---

**CRMFloat** - Your CRM, Your Way 💧

Flexible • Configurable • Universal

© 2024 CRMFloat. All rights reserved.
