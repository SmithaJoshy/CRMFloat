# CRMFloat - Generic CRM Specification

## 🎯 Truly Generic CRM (Like Zoho/Odoo/HubSpot)

This is the bare-minimum, truly generic CRM that works for ANY business.  
**NO industry-specific features** in the base product.

---

## 📋 Generic Navigation Structure

```
CRMFloat
├── 📊 Dashboard
├── 👥 Contacts (was "Clients")
├── 💼 Deals
├── 📈 Pipeline  
├── 📋 Kanban
├── 👔 Team
├── 🌟 Customer Success (was "Beyond Care")
├── 📄 Documents
├── 💰 Invoices
├── 💳 Payments
└── ⚙️  Settings (NEW - for configuration)
```

---

## 🔄 Generic Workflow (Default)

**Simple 6-Stage Sales Pipeline:**
```
1. Lead - New prospects
2. Qualified - Verified leads
3. Proposal - Proposal sent
4. Negotiation - In negotiation
5. Closed Won - Successfully closed
6. Closed Lost - Did not win
```

**Color Scheme:**
- Lead: Blue (#2196F3)
- Qualified: Cyan (#00BCD4)
- Proposal: Orange (#FF9800)
- Negotiation: Red (#F44336)
- Closed Won: Green (#4CAF50)
- Closed Lost: Grey (#9E9E9E)

---

## 📊 Generic Kanban (Default)

**5 Simple Columns:**
```
1. To Do
2. In Progress  
3. Blocked
4. Done
5. Canceled
```

---

## 📝 Generic Fields

### Contact (was Client)
**Standard Fields:**
- Name *(required)*
- Email *(required)*
- Phone *(required)*
- Company
- Address (Street, City, State, Zip, Country)
- Source (Website, Referral, Cold Call, etc.)
- Status (Active, Inactive)
- Tags
- Notes

**NO Design-Specific Fields**

### Deal
**Standard Fields:**
- Deal Name *(required)*
- Contact *(required)*
- Value *(required)*
- Expected Close Date
- Priority (Low, Medium, High)
- Stage
- Status (Open, Won, Lost)
- Assigned To
- Deal Source
- Notes

**NO Property Types, NO Size, NO Design Styles**

### Team Member (was Designer)
**Standard Fields:**
- Name *(required)*
- Email *(required)*
- Phone
- Role *(required)*
- Department
- Skills/Expertise
- Availability (Available, Busy, Away)
- Is Active

**NO Design Specializations**

---

## ⚙️ Settings Page (NEW!)

### Configuration Sections:

#### 1. Business Profile
- Company Name
- Industry Type
- Logo Upload
- Timezone
- Currency
- Date/Time Format

#### 2. Workflow Configuration
```
Pipeline Settings:
  ├── Add Stage
  ├── Edit Stage (name, color, probability)
  ├── Remove Stage
  ├── Reorder Stages
  └── Save Configuration
```

#### 3. Kanban Configuration
```
Kanban Board Settings:
  ├── Add Column
  ├── Edit Column (name, color)
  ├── Remove Column
  ├── Reorder Columns
  └── Save Configuration
```

#### 4. Custom Fields (Future)
```
Custom Fields Manager:
  ├── Contact Fields
  ├── Deal Fields
  ├── Team Fields
  └── Add/Edit/Remove Fields
```

#### 5. Team & Permissions
- User Roles
- Permissions
- Access Control

#### 6. Integrations (Future)
- Email Integration
- Calendar Sync
- Payment Gateways
- Webhooks

---

## 🏢 Multi-Tenant Architecture

### Subdomain-Based Tenants

**Generic CRM:** app.crmfloat.com  
**GHS Tenant:** ghs.crmfloat.com (Interior Design package)  
**Acme Tenant:** acme.crmfloat.com (Consulting package)

### Tenant Configuration Storage

```javascript
// Database: tenants collection
{
  _id: "ghs",
  subdomain: "ghs",
  companyName: "GHS Design Studio",
  industry: "interior-design",
  configFile: "interior-design.config.js",
  customization: {
    logo: "https://cdn.crmfloat.com/tenants/ghs/logo.png",
    primaryColor: "#2196F3",
    workflow: {
      stages: [...] // Custom stages
    }
  },
  subscription: {
    plan: "enterprise",
    packages: ["interior-design"],
    users: 10
  }
}
```

---

## 🎨 Generic UI Updates Needed

### Pages to Update:

1. **✅ Layout.tsx**
   - Change "Design Pipeline CRM" → "CRMFloat"
   - Change "Designers" → "Team"
   - Change "Beyond Care" → "Customer Success"

2. **⏭️ Workflow.tsx**
   - Remove all 11 design stages
   - Use simple 6-stage pipeline
   - Make stages configurable from Settings

3. **⏭️ Kanban.tsx**
   - Keep simple 5-column layout
   - Make columns configurable from Settings

4. **⏭️ Designers.tsx**
   - Rename to "Team.tsx" (keep file name for now, update labels)
   - Change all "Designer" references to "Team Member"
   - Remove "Design" from department default

5. **⏭️ BeyondCare.tsx**
   - Update page title to "Customer Success"
   - Keep all functionality (it's actually generic!)

6. **⏭️ NEW: Settings.tsx**
   - Create settings page for configuration
   - Workflow editor
   - Kanban editor
   - Business profile

---

## 🔧 Implementation Plan

### Phase 1: Strip GHS-Specific Features (Immediate)
- [x] Rename "Design Pipeline CRM" → "CRMFloat"
- [x] Change "Designers" → "Team" in navigation
- [x] Change "Beyond Care" → "Customer Success"
- [ ] Simplify Workflow to 6 generic stages
- [ ] Update all page titles and labels
- [ ] Remove property-specific fields from base UI

### Phase 2: Make Configurable (Week 1)
- [ ] Create Settings page with workflow editor
- [ ] Create Kanban column editor
- [ ] Create visual stage builder (drag-drop)
- [ ] Save configuration to database per tenant
- [ ] Load configuration dynamically

### Phase 3: Multi-Tenant (Week 2)
- [ ] Implement subdomain routing
- [ ] Tenant detection middleware
- [ ] Per-tenant configuration loading
- [ ] White-label logo/branding per tenant
- [ ] GHS becomes first tenant (ghs.crmfloat.io)

### Phase 4: AI Configuration Assistant (Week 3)
- [ ] Add chatbot widget
- [ ] "Configure my workflow" command
- [ ] "Add a pipeline stage" command
- [ ] "Change terminology" command
- [ ] Natural language configuration

---

## 💡 Generic CRM Examples to Reference

### Zoho CRM (Simple)
- Leads → Contacts → Deals → Accounts
- Simple pipeline: Lead → Qualified → Proposal → Won/Lost
- Clean, minimal interface

### HubSpot CRM
- Contacts → Companies → Deals → Tasks
- Visual pipeline with drag-drop
- Customizable stages

### Pipedrive
- Leads → Deals → Activities
- Pipeline-focused
- Simple, visual

---

## 🎯 CRMFloat Generic Should Be Like:

**Simplicity of:** Pipedrive  
**Flexibility of:** Zoho  
**Beauty of:** HubSpot  
**Configurability of:** Odoo  

**Plus:**
- Industry packages (our unique value)
- Multi-tenant architecture
- AI-powered configuration
- White-label ready

---

## 🚀 Immediate Changes Needed

### Remove from Base CRM:
- ❌ Property Type field
- ❌ Design Style field  
- ❌ Size/Square Footage
- ❌ Rooms selection
- ❌ Material tracking
- ❌ Site visits
- ❌ Warranty tab
- ❌ 11-stage design workflow

### Keep in Base CRM:
- ✅ Simple 6-stage workflow
- ✅ Basic client/contact management
- ✅ Deal/opportunity tracking
- ✅ Team management (generic)
- ✅ Kanban (5 columns)
- ✅ Customer Success (testimonials, loyalty)
- ✅ Invoicing & Payments
- ✅ Documents

### Add to Base CRM:
- ➕ Settings page for configuration
- ➕ Workflow stage editor
- ➕ Kanban column editor
- ➕ Business profile settings
- ➕ Configuration API

---

## 📊 Example: How GHS Would Configure

**Step 1: Sign up for CRMFloat**
- URL: app.crmfloat.com/signup
- Choose plan: Enterprise
- Get subdomain: ghs.crmfloat.io

**Step 2: Go to Settings > Workflow Configuration**
- Click "Use Template: Interior Design"
- OR manually add stages:
  1. Lead Generation
  2. Initial Engagement
  3. Scheduling Visit
  ... (11 total stages)

**Step 3: Settings > Business Profile**
- Change "Deals" to "Projects"
- Change "Team" to "Designers"
- Add custom fields: Property Type, Size, etc.

**Step 4: Settings > Modules**
- Enable: Warranty module
- Enable: Site Visits
- Enable: Material Library

**Result:** GHS now has their exact workflow at ghs.crmfloat.io

---

## 🎨 White-Label Architecture

```javascript
// Per-Tenant Branding
tenant: {
  subdomain: "ghs",
  branding: {
    companyName: "GHS Design Studio",
    logo: "/tenants/ghs/logo.png",
    primaryColor: "#your-color",
    favicon: "/tenants/ghs/favicon.ico"
  },
  configuration: {
    workflow: interior-design.config.js,
    terminology: {
      deal: "Project",
      team: "Designer"
    }
  }
}
```

---

**This Makes CRMFloat:**
- ✅ Truly universal (works for anyone)
- ✅ White-label ready (each customer gets subdomain)
- ✅ Fully configurable (no code changes needed)
- ✅ Premium product (charge for configuration + packages)

**GHS becomes a reference customer, not the base product!**

---

Let me now implement these changes...

© 2024 CRMFloat. All rights reserved.
