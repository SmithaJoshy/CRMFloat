# CRMFloat - Quick Start Instructions

## 🚀 Start CRMFloat with Different Configurations

### Option 1: Generic Business (Default)
```bash
cd /Users/smitha/Documents/Shwetha/CRM/CRMProjects/CRMFloat
npm run dev:mock
```
- **Access:** http://localhost:3002
- **Login:** admin@crmfloat.com / admin123
- **Terminology:** Deals, Clients, Team Members
- **Workflow:** Simple 6-stage pipeline

---

### Option 2: Interior Design Pro (GHS Original)
```bash
cd /Users/smitha/Documents/Shwetha/CRM/CRMProjects/CRMFloat
INDUSTRY_PACKAGE=interior-design npm run dev:mock
```
- **Access:** http://localhost:3002
- **Login:** admin@crmfloat.com / admin123
- **Terminology:** Projects, Clients, Designers
- **Workflow:** 11-stage design pipeline
- **Features:** Property types, site visits, materials, warranty

---

### Option 3: Professional Services (Consulting)
```bash
cd /Users/smitha/Documents/Shwetha/CRM/CRMProjects/CRMFloat
INDUSTRY_PACKAGE=consulting npm run dev:mock
```
- **Access:** http://localhost:3002
- **Login:** admin@crmfloat.com / admin123
- **Terminology:** Engagements, Clients, Consultants
- **Workflow:** 9-stage consulting pipeline
- **Features:** Time tracking, hourly billing, deliverables

---

### Option 4: Real Estate
```bash
cd /Users/smitha/Documents/Shwetha/CRM/CRMProjects/CRMFloat
INDUSTRY_PACKAGE=real-estate npm run dev:mock
```
- **Access:** http://localhost:3002
- **Login:** admin@crmfloat.com / admin123
- **Terminology:** Property Deals, Clients, Agents
- **Workflow:** 8-stage property sales pipeline
- **Features:** Property fields, viewings, commissions

---

## 🧪 Testing Configuration Changes

### Test 1: Compare Generic vs Interior Design

**Terminal 1:**
```bash
cd /Users/smitha/Documents/Shwetha/CRM/CRMProjects/CRMFloat
npm run dev:mock
```
Open browser: http://localhost:3002
- Notice: "Deals" terminology, simple workflow

**Stop server (Ctrl+C), then Terminal 2:**
```bash
INDUSTRY_PACKAGE=interior-design npm run dev:mock
```
Open browser: http://localhost:3002 (refresh)
- Notice: "Projects" terminology, design workflow, additional fields

### Test 2: Custom Configuration

1. **Create custom config:**
```bash
cd /Users/smitha/Documents/Shwetha/CRM/CRMProjects/CRMFloat
cp config/default.config.js config/custom.config.js
```

2. **Edit `config/custom.config.js`:**
```javascript
// Change terminology
terminology: {
  deal: {
    singular: 'Opportunity',
    plural: 'Opportunities'
  },
  client: {
    singular: 'Account',
    plural: 'Accounts'
  }
}
```

3. **Restart server:**
```bash
npm run dev:mock
```

4. **Verify changes in UI**

---

## 📊 What to Look For

### UI Changes by Configuration

**Generic Package:**
- Navigation: "Deals", "Clients", "Team"
- Workflow: 6 stages (Lead → Won/Lost)
- Kanban: 5 columns
- Forms: Basic fields only

**Interior Design Package:**
- Navigation: "Projects", "Clients", "Designers"
- Workflow: 11 stages (Lead Generation → Warranty)
- Additional tabs: "Warranty"
- Forms: Property type, size, design style, etc.

**Consulting Package:**
- Navigation: "Engagements", "Clients", "Consultants"
- Workflow: 9 stages (Lead → Completed/Lost)
- Forms: Service type, hours, billing type

---

## 🔍 Configuration API Testing

### Test the Configuration Endpoint

```bash
# Start CRMFloat with a package
INDUSTRY_PACKAGE=interior-design npm run dev:mock

# In another terminal, test the config API:
curl http://localhost:3002/api/config/public | json_pp
```

**Expected Response:**
```json
{
  "business": {
    "name": "Your Business Name",
    "type": "interior-design",
    "industry": "Interior Design & Architecture"
  },
  "terminology": {
    "deal": {
      "singular": "Project",
      "plural": "Projects"
    }
  },
  "workflow": {
    "stages": [
      {"id": "lead-generation", "name": "Lead Generation", ...},
      // ... 11 stages total
    ]
  }
}
```

---

## 🎯 Customization Test Scenarios

### Scenario 1: Change Business Name
```javascript
// Edit config/custom.config.js
business: {
  name: 'Acme Design Studio' // Your company name
}
```

### Scenario 2: Custom Workflow Stages
```javascript
// Edit config/custom.config.js
workflow: {
  pipelines: {
    'my-process': {
      stages: [
        { id: 'new', name: 'New Lead', color: '#2196F3' },
        { id: 'contact', name: 'First Contact', color: '#4CAF50' },
        { id: 'qualified', name: 'Qualified', color: '#FF9800' },
        { id: 'proposal', name: 'Proposal Sent', color: '#F44336' },
        { id: 'won', name: 'Won', color: '#4CAF50', isClosed: true, isWon: true }
      ]
    }
  }
}
```

### Scenario 3: Custom Kanban Columns
```javascript
// Edit config/custom.config.js
workflow: {
  kanban: {
    columns: [
      { id: 'backlog', name: 'Backlog', color: '#9E9E9E' },
      { id: 'ready', name: 'Ready', color: '#2196F3' },
      { id: 'working', name: 'Working', color: '#FF9800' },
      { id: 'review', name: 'In Review', color: '#9C27B0' },
      { id: 'done', name: 'Done', color: '#4CAF50' }
    ]
  }
}
```

---

## 🛠️ Troubleshooting

### Server Won't Start?
```bash
# Check if port 3002 is in use
lsof -i :3002

# Kill existing process
pkill -f "node server-mock-v2.js"

# Try again
npm run dev:mock
```

### Configuration Not Loading?
```bash
# Check file exists
ls -la config/

# Check syntax
node -c config/custom.config.js

# Check server logs for "Configuration loaded"
```

### Changes Not Appearing?
1. Stop server (Ctrl+C)
2. Clear browser cache (Cmd+Shift+R)
3. Restart server
4. Hard refresh browser

---

## 📚 Learn More

- **Full Configuration Guide:** CONFIGURATION_QUICK_START.md
- **Customization Options:** CUSTOMIZATION_GUIDE.md
- **Industry Packages:** INDUSTRY_PACKAGES.md
- **User Guide:** documentation/user-guides/USER_GUIDE.md

---

**CRMFloat** - Test the configurations and see the magic! 💧

© 2024 CRMFloat. All rights reserved.
