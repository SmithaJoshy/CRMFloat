# Automation Logic and RBAC Requirements

## Overview

This document outlines the automation logic for the CRM system, including the Automated Payment Reminder System and Role-Based Access Control (RBAC) implementation.

## Automated Payment Reminder System

### Core Automation Logic

The system implements a comprehensive revenue assurance mechanism through automated payment tracking and reminder workflows.

#### Trigger Events

**WHEN** the `Current Stage` in **Table 2 (Deals/Projects)** is updated to a payment milestone (Steps 6, 8, 11, or 12), **THEN** the following actions are triggered:

1. **New Payment Record Creation**: A new payment record is created in **Table 4 (Payments and Invoicing)**
2. **Invoice Generation**: Appropriate invoice is generated based on the stage
3. **Payment Status Initialization**: `Payment Status` is set to 'Sent'
4. **Due Date Assignment**: `Due Date` is set based on payment terms
5. **Reminder System Activation**: Automated reminder system is activated

#### Payment Milestone Triggers

| Stage | Trigger Event | Invoice Type | Amount Range | Due Date |
|-------|---------------|--------------|--------------|----------|
| **Step 6** | Design Presentation & Fee Due | Design Fee Invoice | ₹35,000 – ₹48,000 | 7 days from trigger |
| **Step 8** | Contract Signed (50% Due) | 50% Advance Invoice | 50% of Total Project Value | 14 days from trigger |
| **Step 11** | Production (40% Interim Due) | 40% Interim Invoice | 40% of Total Project Value | 14 days from trigger |
| **Step 12** | Project Closure (Final 10% Payment) | Final Invoice | 10% of Total Project Value | 7 days from trigger |

### Automated Reminder Sequence

The system runs a continuous check for overdue conditions using the following logic:

#### Reminder Logic
```
IF (Payment Status is NOT 'Collected') 
AND (Due Date < Today) 
THEN Execute Reminder Sequence
```

#### Reminder Schedule

| Days Overdue | Action | Recipient | Method | Escalation Level |
|--------------|--------|-----------|--------|------------------|
| **Day 1** | Gentle Reminder | Client | Email | Low |
| **Day 3** | Follow-up Reminder | Client | Email + SMS | Medium |
| **Day 7** | Urgent Reminder | Client | Email + SMS + WhatsApp | High |
| **Day 10** | Final Notice | Client | Email + Phone Call | Critical |
| **Day 14** | Escalation Alert | Founder/Executive | Email + Dashboard Alert | Critical |

#### Reminder Message Templates

**Day 1 - Gentle Reminder:**
```
Subject: Friendly Reminder - Payment Due

Dear [Client Name],

This is a friendly reminder that your payment of ₹[Amount] for [Project Name] is due on [Due Date].

Please process the payment at your earliest convenience.

Best regards,
[Company Name] Team
```

**Day 7 - Urgent Reminder:**
```
Subject: URGENT - Payment Overdue - [Project Name]

Dear [Client Name],

Your payment of ₹[Amount] for [Project Name] was due on [Due Date] and is now overdue.

To avoid any delays in your project timeline, please process the payment immediately.

Contact us if you have any questions.

Best regards,
[Company Name] Team
```

**Day 14 - Escalation Alert (Internal):**
```
Subject: CRITICAL - Payment Overdue - [Client Name] - [Project Name]

[Founder/Executive Name],

Payment of ₹[Amount] from [Client Name] for [Project Name] is 14 days overdue.

Client: [Client Name]
Project: [Project Name]
Amount: ₹[Amount]
Due Date: [Due Date]
Days Overdue: 14

Immediate action required.

CRM System
```

### Escalation Management

#### Escalation Triggers
- **Day 7**: High-priority task/alert assigned to **Founder/Executive** role
- **Day 14**: Critical escalation with multiple notification methods
- **Day 21**: Project status review and potential suspension

#### Escalation Actions
1. **Internal Alerts**: Dashboard notifications to management
2. **Client Communication**: Multiple communication channels activated
3. **Project Impact**: Potential project timeline adjustments
4. **Financial Review**: Payment terms and conditions review

## Role-Based Access Control (RBAC)

### RBAC Implementation Strategy

The system implements **RBAC** to ensure users only have access to data and features relevant to their roles, simplifying the user experience and ensuring high adoption.

### Role Definitions

#### 1. Founder/Executive
**Workflow Focus**: Strategy & Oversight (All Steps)

**Key Access/Permissions**:
- **Read/View All** tables and Dashboards
- **Limited Edit** rights for critical data
- **Executive Dashboard** access with KPI metrics
- **Financial Overview** with payment status
- **Pipeline Analytics** and reporting
- **User Management** and role assignments
- **System Configuration** access

**Data Access**:
- All client records (read-only)
- All project records (read-only)
- All payment records (read-only)
- All documents (read-only)
- Executive dashboard with KPIs
- Financial reports and analytics

**Restrictions**:
- Cannot delete critical records
- Cannot modify payment amounts
- Cannot change user roles without approval

#### 2. Lead & Sales Manager
**Workflow Focus**: Acquisition & Qualification (Steps 1–4)

**Key Access/Permissions**:
- **Create/Edit** Client Records (Table 1)
- **Create/Edit** Deal Cards (Table 2)
- **Edit** pipeline status up to Step 7
- **Lead Management** tools
- **Client Communication** tools
- **Sales Analytics** and reporting

**Data Access**:
- Client records (full access)
- Project records (create/edit for Steps 1-7)
- Lead generation tools
- Client communication history
- Sales pipeline reports

**Restrictions**:
- Cannot access financial/payment data
- Cannot modify completed projects
- Cannot access design team documents
- Cannot change project values

#### 3. Design Team
**Workflow Focus**: Creative & Costing (Steps 5–7, 10)

**Key Access/Permissions**:
- **View** Client Questionnaire Responses (Table 1)
- **Upload/Edit** Documents (Table 3)
- **Edit** pipeline status in relevant design stages
- **Design Tools** and resources
- **Client Requirements** access
- **Design Portfolio** management

**Data Access**:
- Client questionnaire responses
- Project requirements and specifications
- Design documents and files
- Material preferences and budgets
- Design stage project records

**Restrictions**:
- Cannot access financial data
- Cannot modify client contact information
- Cannot change project values
- Cannot access payment information

#### 4. Finance & Payments
**Workflow Focus**: Revenue Collection (Steps 6, 8, 11, 12)

**Key Access/Permissions**:
- **Create/Edit** Payment/Invoice records (Table 4)
- **Manage** Automated Reminder System settings
- **Financial Reporting** and analytics
- **Payment Tracking** tools
- **Invoice Management** system

**Data Access**:
- All payment and invoice records
- Financial reports and analytics
- Payment reminder settings
- Client payment history
- Revenue tracking data

**Restrictions**:
- Cannot modify client requirements
- Cannot change project stages
- Cannot access design documents
- Cannot modify client contact information

#### 5. Project Manager/Site Ops
**Workflow Focus**: Execution & Closure (Steps 9–13)

**Key Access/Permissions**:
- **Upload/Edit** Documents (Site Checklist)
- **Edit** execution-related pipeline status (Steps 9–13)
- **Project Timeline** management
- **Vendor Coordination** tools
- **Site Visit** documentation

**Data Access**:
- Project execution records
- Site visit checklists
- Vendor coordination data
- Project timeline information
- Handover documentation

**Restrictions**:
- Cannot access financial data
- Cannot modify client requirements
- Cannot change project values
- Cannot access design documents

### Permission Matrix

| Feature | Founder/Executive | Lead & Sales Manager | Design Team | Finance & Payments | Project Manager |
|--------|------------------|---------------------|-------------|-------------------|-----------------|
| **View All Clients** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Create/Edit Clients** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **View All Projects** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Create/Edit Projects** | ✅ | ✅ (Steps 1-7) | ✅ (Steps 5-7, 10) | ❌ | ✅ (Steps 9-13) |
| **View Payments** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Create/Edit Payments** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Upload Documents** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **View Financial Reports** | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Manage Users** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **System Configuration** | ✅ | ❌ | ❌ | ❌ | ❌ |

### Security Implementation

#### Authentication
- **Multi-factor Authentication** for all users
- **Password Policy** enforcement
- **Session Management** with timeout
- **Login Attempt** monitoring

#### Authorization
- **Role-based Permissions** enforcement
- **Data Access Control** by role
- **Feature Access Control** by role
- **Audit Trail** for all actions

#### Data Protection
- **Encryption** for sensitive data
- **Access Logging** for all data access
- **Backup and Recovery** procedures
- **Data Retention** policies

### Audit and Compliance

#### Audit Trail
- **User Actions** logging
- **Data Changes** tracking
- **Access Attempts** monitoring
- **System Events** recording

#### Compliance Requirements
- **Data Privacy** compliance
- **Financial Data** protection
- **Client Information** security
- **Payment Data** security

## Automation Workflow Examples

### Example 1: New Lead Automation
```
Trigger: New lead captured
Action: 
1. Create client record
2. Create project record
3. Assign to sales manager
4. Send welcome email
5. Create follow-up task
```

### Example 2: Payment Overdue Automation
```
Trigger: Payment due date < today AND status != 'Collected'
Action:
1. Send reminder email
2. Update reminder count
3. Log reminder activity
4. If days overdue > 7, escalate to management
```

### Example 3: Stage Progression Automation
```
Trigger: Project stage updated
Action:
1. Validate required data
2. Create next stage tasks
3. Send notifications to relevant team
4. Update project timeline
5. If payment stage, trigger invoice generation
```

## Implementation Notes

### Automation Platform Configuration
- **Make (Integromat)**: Primary automation platform
- **Zapier**: Alternative automation platform
- **Webhooks**: For real-time triggers
- **API Integration**: For data synchronization

### Monitoring and Maintenance
- **Automation Health** monitoring
- **Error Handling** and recovery
- **Performance Optimization** regular reviews
- **User Feedback** integration for improvements

### Scalability Considerations
- **Automation Limits** planning
- **Data Volume** handling
- **User Growth** accommodation
- **Feature Expansion** readiness
