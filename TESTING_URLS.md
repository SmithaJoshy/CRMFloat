# 🧪 CRMFloat Testing URLs

## ✅ **Industry-Specific Data Now Working!**

Both generic and GHS customization now have proper sample data loaded based on the industry package.

---

## 🌐 **Testing URLs**

### **1. Generic CRMFloat (Retail/Small Business)**
```
http://localhost:3003
```
**Start Command:**
```bash
PORT=3003 INDUSTRY_PACKAGE=generic NODE_ENV=development node server-mock-v2.js
```

**Sample Data:**
- **Clients:** Emily Rodriguez (Marketing Consultant), David Kim (Electronics Retailer), Lisa Thompson (Business Consultant)
- **Projects:** CRM Implementation ($5K), Customer Management System ($8K), Business CRM Setup ($12K)
- **Workflow:** Lead → Qualified → Proposal → Negotiation → Closed Won → Closed Lost
- **Navigation:** Team Management, Clients, Customer Success, etc.

### **2. GHS Interior Design Customization**
```
http://localhost:3004
```
**Start Command:**
```bash
PORT=3004 INDUSTRY_PACKAGE=interior-design NODE_ENV=development node server-mock-v2.js
```

**Sample Data:**
- **Clients:** John Smith (Smith Residence), Sarah Johnson (Johnson Family)
- **Projects:** Modern Apartment Design ($125K), Kitchen Renovation ($75K)
- **Workflow:** Lead Generation → Initial Engagement → Scheduling Visit → Consultation → Design Brief → Design Development → Detailed Drawings → Project Execution → Handover → Project Closure → Warranty Period
- **Navigation:** Designers, Properties, Warranty, Site Visits, Materials, Vendors

---

## 🔧 **How to Switch Between Configurations**

### **Option 1: Different Ports (Recommended)**
```bash
# Terminal 1 - Generic CRMFloat
PORT=3003 INDUSTRY_PACKAGE=generic npm start
# Access: http://localhost:3003

# Terminal 2 - GHS Customization  
PORT=3004 INDUSTRY_PACKAGE=interior-design npm start
# Access: http://localhost:3004
```

### **Option 2: Environment Variables**
```bash
# Generic CRMFloat
export INDUSTRY_PACKAGE=generic
npm start
# Access: http://localhost:3003

# GHS Customization
export INDUSTRY_PACKAGE=interior-design
npm start
# Access: http://localhost:3003 (same port, different data)
```

### **Option 3: GHS Deployment Script**
```bash
# Automatically sets GHS configuration
./ghs-customization/scripts/deploy-ghs.sh
# Access: http://localhost:3003 (with GHS features)
```

---

## 📊 **Data Comparison**

### **Generic CRMFloat Data:**
```json
{
  "clients": [
    {
      "name": "Emily Rodriguez",
      "company": "Rodriguez & Associates",
      "notes": "Marketing consultant, interested in CRM solution"
    },
    {
      "name": "David Kim", 
      "company": "Kim Electronics",
      "notes": "Electronics retailer, needs customer management system"
    }
  ],
  "deals": [
    {
      "projectName": "CRM Implementation",
      "projectValue": 5000,
      "currentStage": "Proposal"
    },
    {
      "projectName": "Customer Management System", 
      "projectValue": 8000,
      "currentStage": "Lead"
    }
  ]
}
```

### **GHS Interior Design Data:**
```json
{
  "clients": [
    {
      "name": "John Smith",
      "company": "Smith Residence", 
      "notes": "Prefers modern design style, budget: $150K"
    },
    {
      "name": "Sarah Johnson",
      "company": "Johnson Family",
      "notes": "Interested in kitchen renovation, timeline: 3 months"
    }
  ],
  "deals": [
    {
      "projectName": "Modern Apartment Design",
      "projectValue": 125000,
      "currentStage": "Proposal",
      "propertyType": "Residential",
      "designStyle": "Modern"
    }
  ]
}
```

---

## 🎯 **What You'll See**

### **Generic CRMFloat (localhost:3003):**
- ✅ **Retail/Small Business Clients** - Marketing consultants, electronics retailers, business consultants
- ✅ **Small Project Values** - $5K-$12K projects
- ✅ **Generic Workflow** - 6-stage sales pipeline
- ✅ **Standard Navigation** - Team, Clients, Customer Success, etc.
- ✅ **Business-Focused Features** - CRM setup, customer management systems

### **GHS Customization (localhost:3004):**
- ✅ **Interior Design Clients** - Homeowners, families, property owners
- ✅ **Large Project Values** - $75K-$125K projects  
- ✅ **Design Workflow** - 11-stage design pipeline
- ✅ **Design Navigation** - Designers, Properties, Warranty, Site Visits, Materials, Vendors
- ✅ **Design-Specific Features** - Property types, design styles, site visits, warranty tracking

---

## 🚀 **Server Console Output**

### **Generic CRMFloat:**
```
🎯 Loading generic industry package
🚀 CRMFloat Server running on port 3003
💧 Simple CRM for Startups
🎯 Industry Package: GENERIC
📊 Server is ready and listening on all interfaces
💾 Using Enhanced Mock Database (In-Memory)
   - Generic CRM workflow (6 stages)
   - Retail/Small business sample data
```

### **GHS Customization:**
```
🎯 Loading interior-design industry package
🚀 CRMFloat Server running on port 3004
💧 Simple CRM for Startups
🎯 Industry Package: INTERIOR-DESIGN
📊 Server is ready and listening on all interfaces
💾 Using Enhanced Mock Database (In-Memory)
   - Interior Design workflow (11 stages)
   - Design-specific features enabled
```

---

## 🔑 **Login Credentials**

**Both configurations use the same login:**
- **Email:** admin@crmfloat.com
- **Password:** admin123

---

## ✅ **Testing Checklist**

### **Generic CRMFloat (localhost:3003):**
- [ ] Server starts with "GENERIC" industry package
- [ ] Clients show retail/small business data
- [ ] Projects show small business CRM implementations
- [ ] Workflow has 6 generic stages
- [ ] Navigation shows standard CRM modules

### **GHS Customization (localhost:3004):**
- [ ] Server starts with "INTERIOR-DESIGN" industry package  
- [ ] Clients show interior design clients
- [ ] Projects show large design projects ($75K+)
- [ ] Workflow has 11 design-specific stages
- [ ] Navigation shows design modules (Designers, Properties, Warranty, etc.)

---

## 🎉 **Perfect! Both Configurations Now Working**

**Generic CRMFloat:** http://localhost:3003 - Retail/small business sample data  
**GHS Customization:** http://localhost:3004 - Interior design sample data  

Both URLs now have proper, industry-specific sample data that matches their respective workflows and features! 🚀

---

© 2024 CRMFloat. All rights reserved.
