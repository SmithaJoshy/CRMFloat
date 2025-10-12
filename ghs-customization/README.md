# GHS Customization Package for CRMFloat

## 🎨 **Interior Design CRM Customization**

This package provides a complete customization for CRMFloat specifically designed for interior design businesses, originally developed for GHS (Design Pipeline CRM).

## 🚀 **Quick Start**

### **1. Install CRMFloat**
```bash
git clone https://github.com/SmithaJoshy/CRMFloat.git
cd CRMFloat
npm install
```

### **2. Apply GHS Customization**
```bash
# Copy GHS configuration
cp ghs-customization/config/interior-design.config.js config/
cp ghs-customization/assets/* client/public/

# Set environment variables
export INDUSTRY_PACKAGE=interior-design
export BUSINESS_TYPE=interior-design
export TENANT_ID=ghs
```

### **3. Start GHS Customized CRMFloat**
```bash
npm run start:ghs
```

## 🎯 **What's Included**

### **Configuration Files:**
- `interior-design.config.js` - Complete GHS workflow configuration
- `ghs-branding.json` - GHS-specific branding and styling
- `ghs-fields.json` - Custom field definitions
- `ghs-workflow.json` - 11-stage design pipeline

### **Assets:**
- `ghs-logo.png` - GHS branding assets
- `ghs-favicon.ico` - Custom favicon
- `ghs-styles.css` - Custom styling

### **Documentation:**
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment
- `CUSTOMIZATION_GUIDE.md` - How to modify for other design businesses
- `API_REFERENCE.md` - GHS-specific API endpoints

## 🔧 **GHS-Specific Features**

### **11-Stage Design Pipeline:**
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

### **Design-Specific Modules:**
- **Designers** - Team management with design specialties
- **Properties** - Site visits and location tracking
- **Warranty** - Post-completion support management
- **Site Visits** - Appointment scheduling and tracking
- **Materials** - Design resource library
- **Vendors** - Supplier and contractor management

### **Custom Fields:**
- Property Type (Residential, Commercial, etc.)
- Design Style (Modern, Contemporary, Traditional, etc.)
- Project Size (sq ft)
- Rooms/Areas (Living Room, Kitchen, etc.)
- Site Address
- Design Specialty (for designers)
- Certifications and Portfolio Links

## 🌐 **Deployment Options**

### **Option 1: Subdomain (Recommended)**
```
https://ghs.crmfloat.io
```

### **Option 2: Custom Domain**
```
https://ghs-crm.com
https://ghs-pipeline.com
```

### **Option 3: Path-based**
```
https://crmfloat.io/ghs
```

## 📱 **GHS UI Features**

### **Dashboard:**
- Design Pipeline Overview
- Active Projects by Stage
- Designer Performance Metrics
- Warranty Tracking
- Site Visit Schedule

### **Project Management:**
- Property Type Badges
- Design Style Tags
- Project Size Display
- Designer Assignment
- Site Address Tracking
- Expected Start Dates

### **Forms:**
- Property Type Dropdowns
- Design Style Multi-select
- Rooms/Areas Selection
- Site Address Fields
- Design Specialty Selection

## 🎨 **Customization for Other Design Businesses**

### **Easy Modifications:**
1. **Company Branding:**
   ```javascript
   // Update branding in ghs-branding.json
   {
     "companyName": "Your Design Company",
     "logo": "your-logo.png",
     "primaryColor": "#your-color",
     "secondaryColor": "#your-color"
   }
   ```

2. **Workflow Stages:**
   ```javascript
   // Modify stages in interior-design.config.js
   stages: [
     { id: 'your-stage', name: 'Your Stage Name', color: '#color' }
   ]
   ```

3. **Custom Fields:**
   ```javascript
   // Add/remove fields in ghs-fields.json
   {
     "name": "yourField",
     "label": "Your Field Label",
     "type": "text|select|textarea|number|date"
   }
   ```

## 🔧 **Developer Setup**

### **Environment Variables:**
```bash
# Required for GHS customization
INDUSTRY_PACKAGE=interior-design
BUSINESS_TYPE=interior-design
TENANT_ID=ghs
TENANT_DOMAIN=ghs.crmfloat.io

# Optional customizations
CUSTOM_BRANDING=true
CUSTOM_WORKFLOW=true
CUSTOM_FIELDS=true
```

### **Development Commands:**
```bash
# Start GHS customized version
npm run dev:ghs

# Build for production
npm run build:ghs

# Deploy GHS version
npm run deploy:ghs

# Test GHS features
npm run test:ghs
```

## 📚 **API Endpoints (GHS-Specific)**

### **Design Pipeline:**
```
GET /api/workflow/design-process
PUT /api/projects/:id/stage
GET /api/site-visits
POST /api/site-visits
```

### **Designer Management:**
```
GET /api/designers
POST /api/designers
PUT /api/designers/:id/specialty
GET /api/designers/portfolio/:id
```

### **Property Tracking:**
```
GET /api/properties
POST /api/properties
PUT /api/properties/:id/visit
GET /api/properties/:id/history
```

### **Warranty Management:**
```
GET /api/warranty
POST /api/warranty
PUT /api/warranty/:id/status
GET /api/warranty/expiring
```

## 🎯 **Benefits**

✅ **Industry-Specific** - Built for interior design workflows  
✅ **Fully Customizable** - Easy to adapt for other design businesses  
✅ **Professional UI** - Clean, modern design interface  
✅ **Complete Workflow** - From lead to warranty management  
✅ **Team Management** - Designer specialties and assignments  
✅ **Project Tracking** - Site visits, materials, vendors  
✅ **Client Management** - Property details, design preferences  
✅ **Financial Tracking** - Invoicing and payment management  

## 📞 **Support**

For questions about GHS customization:
- **Documentation:** See `docs/` folder
- **Issues:** GitHub Issues
- **Custom Development:** Contact development team

## 📄 **License**

This GHS customization package is part of CRMFloat and follows the same license terms.

---

**Transform CRMFloat into a specialized interior design CRM with this complete GHS customization package!** 🎨

© 2024 CRMFloat. All rights reserved.
