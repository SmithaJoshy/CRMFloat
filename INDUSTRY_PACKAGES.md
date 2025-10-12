# CRMFloat - Industry Packages Overview

## 🎯 One CRM, Any Industry

CRMFloat is designed to adapt to any business type through configurable industry packages.

---

## 📦 Package Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CRMFloat Core                      │
│  (Always Included - Works for Any Business)         │
├─────────────────────────────────────────────────────┤
│  • Client Management       • Kanban Board            │
│  • Deal/Pipeline          • Document Management     │
│  • Team Management        • Invoicing & Payments    │
│  • Customer Success       • Reports & Analytics     │
└─────────────────────────────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │  Configuration Layer   │
            │   (Industry Package)   │
            └───────────┬───────────┘
                        │
    ┌───────────────────┼───────────────────┬─────────────────┐
    │                   │                   │                 │
┌───▼────┐      ┌──────▼──────┐    ┌──────▼──────┐  ┌──────▼──────┐
│Generic │      │  Interior   │    │ Consulting  │  │ Real Estate │
│Business│      │   Design    │    │  Services   │  │             │
└────────┘      └─────────────┘    └─────────────┘  └─────────────┘
  Free            +$10/user/mo       +$10/user/mo     +$10/user/mo
```

---

## 📋 Package Comparison

| Feature | Generic | Interior Design | Consulting | Real Estate |
|---------|---------|----------------|------------|-------------|
| **Core CRM** | ✅ | ✅ | ✅ | ✅ |
| **Pipeline** | ✅ | ✅ | ✅ | ✅ |
| **Kanban** | ✅ | ✅ | ✅ | ✅ |
| **Customer Success** | ✅ | ✅ | ✅ | ✅ |
| **Custom Workflows** | 6 stages | 11 stages | 9 stages | 8 stages |
| **Property Management** | ❌ | ✅ | ❌ | ✅ |
| **Design Tools** | ❌ | ✅ | ❌ | ❌ |
| **Time Tracking** | ❌ | ❌ | ✅ | ❌ |
| **Warranty** | ❌ | ✅ | ❌ | ❌ |
| **Agent Commission** | ❌ | ❌ | ❌ | ✅ |
| **Viewing Schedule** | ❌ | ❌ | ❌ | ✅ |
| **Material Tracking** | ❌ | ✅ | ❌ | ❌ |
| **Site Visits** | ❌ | ✅ | ❌ | ❌ |

---

## 🎨 Package Details

### 1. Generic Business Package
**Price:** FREE (Included in all plans)  
**Perfect For:** Any business type

**Features:**
- Complete CRM functionality
- Visual pipeline management
- Kanban project boards
- Customer success tracking
- Team management
- Invoicing & payments
- Document storage

**Workflow:**
```
Lead → Contacted → Qualified → Proposal → Won/Lost
```

**Use Cases:**
- Small businesses starting out
- Businesses with unique workflows
- Companies wanting to customize everything
- Testing before choosing specific package

---

### 2. Interior Design Pro Package
**Price:** +$10/user/month  
**Perfect For:** Interior designers, architects, design studios

**All Generic Features PLUS:**
- ✅ **Design-Specific Workflow** (11 stages)
- ✅ **Property Management** (type, size, style)
- ✅ **Site Visit Scheduling**
- ✅ **Material & Vendor Tracking**
- ✅ **Design Deliverables Management**
- ✅ **3D Visualization Links**
- ✅ **Warranty Period Tracking**
- ✅ **Before/After Photo Gallery**
- ✅ **Room-by-Room Planning**

**Workflow:**
```
Lead Generation → Initial Engagement → Site Visit → 
Consultation → Design Brief → Design Development → 
Detailed Drawings → Execution → Handover → 
Project Closure → Warranty
```

**Custom Fields:**
- Property Type, Deal Type, Size, Design Style
- Rooms Included, Site Address
- Materials, Vendors, Deliverables

**Target Users:**
- Residential designers
- Commercial designers
- Architecture firms
- Design-build companies

---

### 3. Professional Services Package
**Price:** +$10/user/month  
**Perfect For:** Consultants, agencies, professional services

**All Generic Features PLUS:**
- ✅ **Engagement Tracking**
- ✅ **Time & Hours Management**
- ✅ **Consultant Profiles**
- ✅ **Project Scoping Tools**
- ✅ **Deliverable Tracking**
- ✅ **Hourly Billing Support**
- ✅ **Retainer Management**

**Workflow:**
```
New Lead → Discovery → Needs Analysis → 
Proposal → Negotiation → Onboarding → 
Delivery → Completed/Lost
```

**Custom Fields:**
- Service Type, Estimated Hours, Hourly Rate
- Billing Type, Project Scope, Deliverables

**Target Users:**
- Management consultants
- IT consultants
- Marketing agencies
- Legal firms
- Accounting firms

---

### 4. Real Estate Package
**Price:** +$10/user/month  
**Perfect For:** Real estate agencies, brokers, agents

**All Generic Features PLUS:**
- ✅ **Property Listings**
- ✅ **Viewing Management**
- ✅ **Offer Tracking**
- ✅ **Agent Commission Calculator**
- ✅ **Property Photos**
- ✅ **Multiple Listing Service (MLS) Integration Ready**

**Workflow:**
```
New Lead → Viewing Scheduled → Viewed → 
Offer Made → Negotiating → Under Contract → 
Closed/Fell Through
```

**Custom Fields:**
- Property Address, Type, Bedrooms, Bathrooms
- Square Feet, Listing Price, Commission Rate

**Target Users:**
- Real estate agents
- Brokerages
- Property managers
- Real estate investors

---

## 🔌 Package Installation

### Current Installation Method

1. **Choose Package:**
```bash
export INDUSTRY_PACKAGE=interior-design
```

2. **Start CRMFloat:**
```bash
npm start
```

### Future: Admin UI (Coming in v1.1)

```
Settings > Business Configuration > Industry Package
  [ ] Generic Business (Free)
  [x] Interior Design Pro (+$10/user)
  [ ] Professional Services (+$10/user)
  [ ] Real Estate Pro (+$10/user)
  
  [Apply Configuration]
```

---

## 💼 Pricing Summary

### Base Plans (All Include Generic Package)

**Free Tier**
- $0/month
- Generic package only
- Up to 3 users, 50 clients, 25 deals

**Professional**
- $29/user/month
- Includes 1 industry package
- Unlimited users, clients, deals

**Enterprise**
- Custom pricing
- Includes all industry packages
- White-label options

### Add-On Industry Packages

**Per Package:** +$10/user/month  
**Available Packages:**
- Interior Design Pro
- Professional Services
- Real Estate Pro  
- SaaS Sales (coming soon)
- Insurance (coming soon)
- Legal Services (coming soon)
- Healthcare (coming soon)

**Enterprise:** All packages included

---

## 🚀 Package Roadmap

### Q1 2025
- [x] Generic Business (Default)
- [x] Interior Design Pro
- [x] Professional Services
- [x] Real Estate

### Q2 2025
- [ ] SaaS Sales
- [ ] Insurance
- [ ] Legal Services
- [ ] Healthcare

### Q3 2025
- [ ] Manufacturing
- [ ] Retail
- [ ] Hospitality
- [ ] Non-Profit

### Q4 2025
- [ ] Education
- [ ] Government
- [ ] Custom Package Builder
- [ ] Package Marketplace

---

## 🎨 Package Development

### Want a Custom Industry Package?

**Option 1: DIY Configuration**
- Use `config/default.config.js` as template
- Create `config/custom.config.js`
- Customize for your industry
- No additional cost

**Option 2: Request Package Development**
- Contact: sales@crmfloat.com
- Provide industry requirements
- We build custom package
- Pricing: Starting at $2,500 one-time

**Option 3: Enterprise Custom**
- Complete custom solution
- Dedicated development team
- Full integration support
- Contact for pricing

---

## 📊 Feature Matrix by Package

### Core Features (All Packages)

| Feature | Description | All Packages |
|---------|-------------|--------------|
| Clients | Full client management | ✅ |
| Deals | Deal/opportunity tracking | ✅ |
| Pipeline | Visual sales pipeline | ✅ |
| Kanban | Project task management | ✅ |
| Team | Team member profiles | ✅ |
| Documents | File management | ✅ |
| Invoices | Billing and invoicing | ✅ |
| Payments | Payment tracking | ✅ |
| Reports | Basic analytics | ✅ |
| Customer Success | Beyond Care features | ✅ |

### Industry-Specific Features

| Feature | Generic | Interior Design | Consulting | Real Estate |
|---------|---------|----------------|------------|-------------|
| Custom Workflow | 6 stages | 11 stages | 9 stages | 8 stages |
| Property Fields | ❌ | ✅ | ❌ | ✅ |
| Time Tracking | ❌ | ❌ | ✅ | ❌ |
| Design Tools | ❌ | ✅ | ❌ | ❌ |
| Material Library | ❌ | ✅ | ❌ | ❌ |
| Warranty | ❌ | ✅ | ❌ | ❌ |
| Site Visits | ❌ | ✅ | ❌ | ✅ (as Viewings) |
| Hourly Billing | ❌ | ❌ | ✅ | ❌ |
| Commission Calc | ❌ | ❌ | ❌ | ✅ |

---

## 🎁 Package Benefits

### Why Choose an Industry Package?

✅ **Pre-configured Workflows** - No setup needed  
✅ **Industry-Specific Fields** - Relevant data capture  
✅ **Specialized Features** - Tools for your business  
✅ **Best Practices** - Proven workflows  
✅ **Time Savings** - Start productive immediately  
✅ **Professional** - Industry-standard terminology  

### Generic Package Benefits

✅ **Maximum Flexibility** - Customize everything  
✅ **No Lock-in** - Adapt as you grow  
✅ **Lower Cost** - Free with all plans  
✅ **Universal** - Works for any business  
✅ **Simple** - Clean, minimal interface  

---

## 🔄 Switching Packages

### Can I Switch Later?

**Yes!** You can switch industry packages anytime:

1. **Change Environment Variable:**
```bash
INDUSTRY_PACKAGE=consulting npm start
```

2. **Or Update Config:**
```bash
cp config/consulting.config.js config/custom.config.js
npm start
```

3. **Data is Preserved:**
- All your clients, deals, and data remain intact
- Only UI, terminology, and workflow change
- Custom fields from old package become hidden (not deleted)

**Note:** Enterprise customers can run multiple packages simultaneously for different departments.

---

## 💡 Choosing the Right Package

### Decision Tree

```
Start Here: What's your primary business?

├─ Selling products/services to clients?
│  ├─ Physical products → Generic or Custom
│  ├─ Professional services → Consulting Package
│  └─ Design/Creative → Interior Design Package
│
├─ Selling property/real estate?
│  └─ Real Estate Package
│
├─ Multiple business types?
│  └─ Enterprise (all packages)
│
└─ Not sure yet?
   └─ Start with Generic, upgrade later
```

---

## 📞 Package Support

**Questions About Packages?**
- 📧 Email: sales@crmfloat.com
- 💬 Chat: Available in app
- 📖 Docs: Full package documentation
- 🎥 Videos: Package comparison videos

**Custom Package Development:**
- 📧 Email: enterprise@crmfloat.com
- 📞 Phone: Schedule consultation
- 💼 Enterprise Solutions Team

---

**CRMFloat** - One Platform, Every Industry 💧

© 2024 CRMFloat. All rights reserved.
