# GHS Customization URL Structure

## 🌐 **GHS Customized CRMFloat URLs**

When GHS customization is deployed, the URL structure will be:

### **Option 1: Subdomain Routing (Recommended)**
```
https://ghs.crmfloat.io
https://ghs.crmfloat.com
https://ghs.crmfloat.app
```

### **Option 2: Path-based Routing**
```
https://crmfloat.io/ghs
https://crmfloat.com/ghs
https://crmfloat.app/ghs
```

### **Option 3: Custom Domain (Premium)**
```
https://ghs-crm.com
https://ghs-crm.io
https://ghs-pipeline.com
```

---

## 🔧 **How It Works**

### **1. Environment Configuration**
```bash
# GHS Environment Variables
INDUSTRY_PACKAGE=interior-design
BUSINESS_TYPE=interior-design
TENANT_ID=ghs
TENANT_DOMAIN=ghs.crmfloat.io
```

### **2. Configuration Loading**
The system automatically loads the `interior-design.config.js` which includes:

- **GHS-Specific Workflow Stages:**
  - Lead Generation
  - Initial Engagement
  - Scheduling Visit
  - Consultation & Data Capture
  - Design Brief & Proposal
  - Design Development
  - Detailed Drawings & Vendor Coordination
  - Project Execution
  - Handover
  - Project Closure
  - Warranty Period

- **GHS-Specific Modules:**
  - Designers (instead of Team)
  - Properties
  - Warranty
  - Site Visits
  - Materials
  - Vendors

- **GHS-Specific Fields:**
  - Property Type
  - Design Style
  - Project Size
  - Rooms/Areas
  - Site Address
  - Design Specialty

---

## 🎯 **GHS-Specific Features**

### **Navigation Menu (GHS Version):**
```
🏠 Dashboard
📋 Leads
📊 Design Pipeline
📋 Kanban
🔄 Workflow
🎨 Designers
👥 Clients
🛡️ Warranty
📄 Invoices
💰 Payments
📁 Documents
```

### **Workflow Stages (GHS Version):**
```
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
```

### **Kanban Columns (GHS Version):**
```
📋 To Do
🔄 In Progress
🚫 Blocked
⏸️ Paused
✅ Done
❌ Canceled
```

---

## 🚀 **Deployment Options**

### **Option A: Multi-Tenant SaaS**
```
https://crmfloat.io
├── https://ghs.crmfloat.io (GHS customization)
├── https://consulting.crmfloat.io (Consulting customization)
├── https://realestate.crmfloat.io (Real Estate customization)
└── https://generic.crmfloat.io (Generic CRM)
```

### **Option B: White-Label Deployment**
```
https://ghs-crm.com (Dedicated GHS instance)
https://consulting-crm.com (Dedicated Consulting instance)
https://realestate-crm.com (Dedicated Real Estate instance)
```

### **Option C: On-Premise Deployment**
```
https://ghs.internal.company.com
https://crm.ghs.com
https://pipeline.ghs.com
```

---

## 🔧 **Technical Implementation**

### **1. Subdomain Detection**
```javascript
// server/middleware/tenant.js
const getTenantFromSubdomain = (req) => {
  const host = req.get('host');
  const subdomain = host.split('.')[0];
  
  switch(subdomain) {
    case 'ghs':
      return 'interior-design';
    case 'consulting':
      return 'consulting';
    case 'realestate':
      return 'real-estate';
    default:
      return 'generic';
  }
};
```

### **2. Configuration Loading**
```javascript
// server/config/configLoader.js
const loadConfig = (tenant) => {
  switch(tenant) {
    case 'interior-design':
      return require('../config/interior-design.config.js');
    case 'consulting':
      return require('../config/consulting.config.js');
    case 'real-estate':
      return require('../config/real-estate.config.js');
    default:
      return require('../config/default.config.js');
  }
};
```

### **3. Frontend Configuration**
```javascript
// client/src/config/tenantConfig.js
const getTenantConfig = () => {
  const subdomain = window.location.hostname.split('.')[0];
  
  switch(subdomain) {
    case 'ghs':
      return {
        industry: 'interior-design',
        workflow: 'design-process',
        modules: ['designers', 'properties', 'warranty'],
        terminology: {
          deal: 'Project',
          team: 'Designer',
          pipeline: 'Design Pipeline'
        }
      };
    // ... other tenants
  }
};
```

---

## 📱 **GHS-Specific UI Elements**

### **Dashboard (GHS Version):**
- Design Pipeline Overview
- Active Projects by Stage
- Designer Performance
- Warranty Tracking
- Site Visit Schedule

### **Project Cards (GHS Version):**
- Property Type Badge
- Design Style Tag
- Project Size
- Designer Assignment
- Site Address
- Expected Start Date

### **Forms (GHS Version):**
- Property Type Dropdown
- Design Style Multi-select
- Rooms/Areas Selection
- Site Address Field
- Design Specialty for Team Members

---

## 🌟 **Benefits of GHS Customization**

✅ **Industry-Specific Workflow** - 11-stage design process  
✅ **Designer Management** - Specialized team roles  
✅ **Property Tracking** - Site visits and locations  
✅ **Warranty Management** - Post-completion support  
✅ **Material Library** - Design resources  
✅ **Vendor Coordination** - Supplier management  
✅ **Project Photos** - Before/after galleries  
✅ **Design Approvals** - Client sign-off process  

---

## 🎯 **Next Steps for GHS Deployment**

1. **Configure Environment:**
   ```bash
   INDUSTRY_PACKAGE=interior-design
   TENANT_ID=ghs
   TENANT_DOMAIN=ghs.crmfloat.io
   ```

2. **Deploy with GHS Configuration:**
   ```bash
   npm run deploy:ghs
   ```

3. **Access GHS Instance:**
   ```
   https://ghs.crmfloat.io
   Login: admin@ghs.crmfloat.io
   Password: admin123
   ```

4. **Custom Domain Setup:**
   ```
   https://ghs-crm.com
   https://ghs-pipeline.com
   https://design-pipeline.ghs.com
   ```

---

**The GHS customization transforms CRMFloat into a specialized interior design CRM with the exact workflow and features needed for design businesses!** 🎨

© 2024 CRMFloat. All rights reserved.
