# Database Schema Specification

## Overview

The database schema is designed to support the 13-step interior design workflow with proper relationships between entities. The schema uses **One-to-Many (1:M)** and **Many-to-One (M:1)** relationships to maintain data integrity and support the CRM's core functionality.

## Table 1: Clients (Contact Management & Custom Requirements)

This table handles custom data capture essential for design and costing phases.

| Field Name | Data Type/Format | Purpose in Workflow | Required | Example |
|------------|------------------|-------------------|----------|---------|
| **Client ID** | Unique ID (Primary Key) | Unique identifier for the client | Yes | `CLI-001` |
| **Associated Deals** | Link to Deals Table | Relationship: One Client to Many Projects (1:M) | Yes | `DEAL-001, DEAL-002` |
| **Client Name** | Text | Full name of the client | Yes | `John Smith` |
| **Email** | Email | Primary contact email | Yes | `john@example.com` |
| **Phone** | Phone Number | Primary contact phone | Yes | `+91-9876543210` |
| **Company/Address** | Long Text | Business or residential address | No | `123 Business Park, Mumbai` |
| **Style Preference(s)** | Multi-Select | Informs the 3D Design (Step 5) | Yes | `Modern, Minimalist, Industrial` |
| **Functionality Goals** | Long Text | Captures lifestyle needs; crucial input for Design Team | Yes | `Open kitchen for entertaining, home office space` |
| **Target Budget (Hard Limit)** | Currency | Critical input for Detailed Costing (Step 7) | Yes | `₹5,00,000` |
| **Key Material Preferences** | Multi-Select | Guides costing and material selection | No | `Wood, Marble, Glass` |
| **Questionnaire Upload Link** | File Link/Attachment | Stores the full questionnaire document (Step 2) | No | `https://drive.google.com/file/...` |
| **Lead Source** | Single Select | Marketing channel tracking | No | `Website, Referral, Social Media` |
| **Created Date** | Date | Record creation timestamp | Yes | `2024-12-01` |
| **Last Modified** | Date | Last update timestamp | Yes | `2024-12-15` |

### Style Preferences Options
- Modern
- Traditional
- Minimalist
- Industrial
- Scandinavian
- Contemporary
- Rustic
- Art Deco

### Key Material Preferences Options
- Wood (Teak, Oak, Pine)
- Marble
- Granite
- Glass
- Metal (Steel, Brass, Copper)
- Fabric
- Leather
- Ceramic

## Table 2: Deals/Projects (The 13-Step Pipeline Tracker)

This is the central entity that drives the Kanban board view.

| Field Name | Data Type/Format | Purpose | Required | Example |
|------------|------------------|---------|----------|---------|
| **Deal ID** | Unique ID (Primary Key) | Unique identifier for the project | Yes | `DEAL-001` |
| **Current Stage** | Single Select (1-13 stages) | Drives the Kanban board view | Yes | `Step 5: Design in Progress` |
| **Project Name** | Text | Descriptive name for the project | Yes | `Modern Living Room Renovation` |
| **Total Project Value** | Currency | Final detailed costing amount (from Step 7) | No | `₹4,50,000` |
| **Associated Client** | Link to Clients Table | Links project back to client's requirements (M:1) | Yes | `CLI-001` |
| **Associated Payments** | Link to Payments Table | Links to invoicing records (1:M) | No | `PAY-001, PAY-002` |
| **Testimonial Captured** | Checkbox/Boolean | Status of post-sale feedback (Step 13) | No | `True/False` |
| **Project Start Date** | Date | When the project was initiated | Yes | `2024-12-01` |
| **Expected Completion** | Date | Projected completion date | No | `2024-03-15` |
| **Actual Completion** | Date | Actual project completion date | No | `2024-03-20` |
| **Project Status** | Single Select | Overall project status | Yes | `Active, On Hold, Completed, Cancelled` |
| **Priority Level** | Single Select | Project priority for resource allocation | No | `High, Medium, Low` |
| **Assigned Designer** | Text | Designer responsible for the project | No | `Sarah Johnson` |
| **Created Date** | Date | Record creation timestamp | Yes | `2024-12-01` |
| **Last Modified** | Date | Last update timestamp | Yes | `2024-12-15` |

### Current Stage Options (13 Steps)
1. Lead Generation
2. Initial Engagement
3. Scheduling Visit
4. Consultation & Data Capture
5. Design in Progress
6. Design Presentation & Fee Due
7. Costing Shared
8. Contract Signed (50% Due)
9. Site Measurement Visit
10. Detailed Drawings & Vendor Coordination
11. Production (40% Interim Due)
12. Project Closure (Final 10% Payment)
13. Project Completed

## Table 3: Documents (File Management)

This table manages all project-related documents and files.

| Field Name | Data Type/Format | Purpose | Required | Example |
|------------|------------------|---------|----------|---------|
| **Document ID** | Unique ID (Primary Key) | Unique identifier for the document | Yes | `DOC-001` |
| **Document Type** | Single Select | Type of document for categorization | Yes | `Questionnaire, Estimate, Contract, Drawing` |
| **Document Name** | Text | Descriptive name of the document | Yes | `Client Questionnaire - John Smith` |
| **File Link/Attachment** | File Link/Attachment | Actual file storage link | Yes | `https://drive.google.com/file/...` |
| **Associated Project** | Link to Deals Table | Links document to specific project (M:1) | Yes | `DEAL-001` |
| **Upload Date** | Date | When the document was uploaded | Yes | `2024-12-01` |
| **Uploaded By** | Text | User who uploaded the document | Yes | `Sarah Johnson` |
| **File Size** | Number | File size in MB | No | `2.5` |
| **Version** | Text | Document version number | No | `v1.2` |
| **Is Active** | Checkbox/Boolean | Whether document is current/active | Yes | `True/False` |
| **Access Level** | Single Select | Who can access this document | Yes | `Public, Team, Restricted` |

### Document Type Options
- Questionnaire
- Portfolio
- Estimate Sheet
- Costing Document
- Contract
- Site Visit Checklist
- 3D Design
- Technical Drawing
- Handover Pack
- Testimonial
- Other

## Table 4: Payments and Invoicing (Revenue Assurance Logic)

This table tracks financial milestones and triggers the automated reminder system.

| Field Name | Data Type/Format | Purpose | Required | Example |
|------------|------------------|---------|----------|---------|
| **Payment ID** | Unique ID (Primary Key) | Unique identifier for the invoice/payment | Yes | `PAY-001` |
| **Invoice Stage** | Single Select | Payment milestone stage | Yes | `Design Fee, 50% Advance, 40% Interim, Final 10%` |
| **Invoice Number** | Text | Unique invoice number | Yes | `INV-2024-001` |
| **Amount** | Currency | Payment amount | Yes | `₹35,000` |
| **Due Date** | Date | Deadline for the payment | Yes | `2024-12-15` |
| **Payment Status** | Single Select | Current payment status | Yes | `Sent, Overdue, Collected, Cancelled` |
| **Associated Project** | Link to Deals Table | Links payment to the master deal record (M:1) | Yes | `DEAL-001` |
| **Payment Method** | Single Select | How payment was made | No | `Bank Transfer, Cheque, Cash, Online` |
| **Payment Date** | Date | When payment was actually received | No | `2024-12-10` |
| **Reminder Count** | Number | Number of reminders sent | No | `2` |
| **Last Reminder Date** | Date | Date of last reminder sent | No | `2024-12-20` |
| **Reminder Automation** | Formula/Logic | Logic trigger for automated follow-up | Yes | `IF(Status != 'Collected' AND Due Date < Today, 'Send Reminder', 'No Action')` |
| **Created Date** | Date | Record creation timestamp | Yes | `2024-12-01` |
| **Last Modified** | Date | Last update timestamp | Yes | `2024-12-15` |

### Invoice Stage Options
- Design Fee (₹35K–₹48K)
- 50% Advance
- 40% Interim
- Final 10%

### Payment Status Options
- Sent
- Overdue
- Collected
- Cancelled
- Disputed

## Relationships

### Primary Relationships
1. **Clients ↔ Deals**: One-to-Many (1:M)
   - One client can have multiple projects
   - Each project belongs to one client

2. **Deals ↔ Payments**: One-to-Many (1:M)
   - One project can have multiple payment milestones
   - Each payment belongs to one project

3. **Deals ↔ Documents**: One-to-Many (1:M)
   - One project can have multiple documents
   - Each document belongs to one project

### Data Integrity Rules
- Client records cannot be deleted if they have associated deals
- Deal records cannot be deleted if they have associated payments or documents
- Payment amounts must be positive numbers
- Due dates cannot be in the past when creating new payments
- Current Stage must be one of the 13 defined steps

## Indexing Strategy

### Primary Indexes
- Client ID (Primary Key)
- Deal ID (Primary Key)
- Document ID (Primary Key)
- Payment ID (Primary Key)

### Secondary Indexes
- Client Email (for quick lookups)
- Deal Current Stage (for Kanban board filtering)
- Payment Due Date (for reminder automation)
- Document Upload Date (for chronological sorting)

## Data Validation Rules

### Client Table
- Email must be valid format
- Phone number must follow international format
- Target Budget must be positive number
- Style Preferences must be from predefined list

### Deals Table
- Current Stage must be 1-13
- Total Project Value must be positive
- Project Start Date cannot be in the future
- Expected Completion must be after Project Start Date

### Payments Table
- Amount must be positive
- Due Date cannot be in the past
- Payment Status must be from predefined list
- Invoice Number must be unique

### Documents Table
- File Link must be valid URL
- Document Type must be from predefined list
- Upload Date cannot be in the future
