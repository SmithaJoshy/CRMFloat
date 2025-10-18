# Design Pipeline CRM - Free Functional App

A complete, functional CRM application built with **100% free technologies** for interior design businesses. This app implements the 13-step workflow pipeline with automated payment reminders, role-based access control, and mobile-responsive design.

## 🚀 **Completely Free Stack**

| Component | Technology | Cost | Justification |
|-----------|------------|------|---------------|
| **Backend** | Node.js + Express | Free | Open source, no licensing fees |
| **Database** | MongoDB Atlas | Free | 512MB free tier, perfect for MVP |
| **Frontend** | React + TypeScript | Free | Modern, responsive UI framework |
| **Email** | Gmail SMTP | Free | 15GB free storage, reliable delivery |
| **SMS** | Twilio Trial | Free | $15 free credit, 1000+ messages |
| **File Storage** | Cloudinary | Free | 25GB free storage, CDN included |
| **Hosting** | Vercel/Netlify | Free | Automatic deployments, SSL included |
| **Total Monthly Cost** | **₹0** | **Free** | **100% free to run and scale** |

## 🏗️ Technical Architecture

### Core Stack
- **Data Storage**: Airtable or Notion (flexible schema for custom fields)
- **Interface**: Kanban boards with drag-and-drop functionality
- **Automation**: Make (formerly Integromat) or Zapier
- **Mobile Access**: Glide or built-in LCNC apps
- **Hosting**: LCNC provider hosting

### Key Features
- ✅ 13-step sequential pipeline tracking
- ✅ Automated payment reminder system
- ✅ Role-based access control (RBAC)
- ✅ Mobile-first responsive design
- ✅ Executive dashboard with KPI tracking
- ✅ Custom questionnaire data capture

## 📋 13-Step Workflow Pipeline

1. **Lead Generation** - Capture contact info and auto-assign to sales manager
2. **Initial Engagement** - Send portfolio and detailed questionnaire
3. **Scheduling Visit** - Experience centre visit with automated reminders
4. **Consultation & Data Capture** - Log MoM notes and questionnaire responses
5. **Design in Progress** - Schedule presentation deadline
6. **Design Presentation & Fee Due** - Generate design fee invoice (₹35K–₹48K)
7. **Costing Shared** - Upload detailed costing and await confirmation
8. **Contract Signed (50% Due)** - Trigger 50% advance invoice with automated reminders
9. **Site Measurement Visit** - Upload site visit checklist
10. **Detailed Drawings & Vendor Coordination** - Share final drawings
11. **Production (40% Interim Due)** - Trigger 40% interim invoice
12. **Project Closure (Final 10% Payment)** - Present handover pack and final invoice
13. **Project Completed** - Log case holder assignment and capture testimonial

## 🗄️ Database Schema

### Table 1: Clients
- Client ID (Primary Key)
- Associated Deals
- Style Preferences
- Functionality Goals
- Target Budget
- Key Material Preferences
- Questionnaire Upload Link

### Table 2: Deals/Projects
- Deal ID (Primary Key)
- Current Stage (1-13)
- Total Project Value
- Associated Client
- Associated Payments
- Testimonial Captured

### Table 3: Documents
- Document ID (Primary Key)
- Document Type
- File Link/Attachment
- Associated Project
- Upload Date

### Table 4: Payments and Invoicing
- Payment ID (Primary Key)
- Invoice Stage
- Due Date
- Payment Status
- Associated Project
- Reminder Automation

## 👥 Role-Based Access Control

| Role | Workflow Focus | Key Permissions |
|------|----------------|-----------------|
| **Founder/Executive** | Strategy & Oversight | Read/View All, Limited Edit |
| **Lead & Sales Manager** | Acquisition & Qualification (Steps 1-4) | Create/Edit Client Records, Edit Pipeline Status |
| **Design Team** | Creative & Costing (Steps 5-7, 10) | View Questionnaire, Upload Documents |
| **Finance & Payments** | Revenue Collection (Steps 6, 8, 11, 12) | Create/Edit Payment Records, Manage Reminders |
| **Project Manager** | Execution & Closure (Steps 9-13) | Upload Documents, Edit Execution Status |

## 🤖 Automation Features

### Automated Payment Reminder System
- **Trigger Events**: When pipeline stage updates to payment milestones
- **Reminder Logic**: Continuous check for overdue payments
- **Escalation**: High-priority alerts for overdue payments (Day 7+)

### Revenue Assurance Logic
- Design Fee Invoice (₹35K–₹48K) - Step 6
- 50% Advance Invoice - Step 8
- 40% Interim Invoice - Step 11
- Final 10% Payment - Step 12

## 📊 Executive Dashboard KPIs

- **Total Pipeline Value** - Strategic revenue assessment
- **Overdue Payments Count** - Risk indicator (prominent red card)
- **Stage Distribution** - Real-time Kanban board status
- **Funnel Drop-off Rate** - Process bottleneck identification
- **Testimonial Capture Rate** - Post-sale follow-up success

## 🚀 Getting Started

1. **Phase I**: Set up LCNC platform (Airtable/Notion)
2. **Phase II**: Configure automation workflows (Make/Zapier)
3. **Phase III**: Implement mobile access (Glide)
4. **Phase IV**: Deploy and train users

## 📁 Project Structure

```
├── docs/
│   ├── database-schema.md
│   ├── workflow-mapping.md
│   ├── automation-logic.md
│   └── rbac-specification.md
├── implementation/
│   ├── airtable-setup/
│   ├── automation-workflows/
│   └── mobile-app-config/
└── README.md
```

## 🎨 Design Principles

- **Tailored Simplicity**: Low-friction interface with minimal feature set
- **Workflow Visualization**: Intuitive Kanban boards with drag-and-drop
- **Mobile-First**: Fully responsive design for on-the-go access
- **Action-Centric Dashboard**: Maximum 10 visualizations, logically organized

## 📈 Success Metrics

- User adoption rate > 90%
- Payment collection efficiency improvement
- Process automation reduction in manual tasks
- ROI demonstration to investors

## 🔧 Development Status

- [x] Project specification and architecture
- [x] Database schema design
- [x] Workflow mapping
- [ ] LCNC platform setup
- [ ] Automation configuration
- [ ] Mobile app development
- [ ] User testing and deployment

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Status**: Ready for Phase I Development
