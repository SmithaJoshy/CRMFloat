# 13-Step Workflow Pipeline Documentation

## Overview

The CRM pipeline is designed to track interior design projects through 13 sequential stages, from initial lead generation to project completion. Each stage has specific data requirements, automation triggers, and role-based responsibilities.

## Pipeline Stages

### Step 1: Lead Generation
**Description**: Potential clients are identified through various marketing and referral channels.

**Required Data Input (Manual)**:
- Contact Information (Name, Email, Phone)
- Lead Source (Website, Referral, Social Media, etc.)
- Initial Interest Level
- Company/Address (if business client)

**Required Action/Automation Trigger**:
- Auto-assign lead to Sales Manager
- Create new Client record in Table 1
- Create new Deal record in Table 2 with Stage = "Lead Generation"
- Send welcome email to client

**Role Responsibilities**:
- **Lead & Sales Manager**: Capture and qualify leads
- **Founder/Executive**: Review lead quality and assignment

**Success Criteria**:
- Complete contact information captured
- Lead assigned to appropriate sales manager
- Initial client record created

---

### Step 2: Initial Engagement
**Description**: A company portfolio is shared with the client, and a detailed questionnaire is sent to understand their requirements, style preferences, and expectations.

**Required Data Input (Manual)**:
- Portfolio Sent confirmation (checkbox)
- Questionnaire sent confirmation (checkbox)
- Client response tracking

**Required Action/Automation Trigger**:
- Task: Send detailed questionnaire
- Automated email with portfolio attachment
- Follow-up reminder if questionnaire not completed within 3 days

**Role Responsibilities**:
- **Lead & Sales Manager**: Send portfolio and questionnaire
- **Design Team**: Review questionnaire responses

**Success Criteria**:
- Portfolio delivered to client
- Questionnaire sent and responses received
- Client requirements documented

---

### Step 3: Scheduling Visit
**Description**: Clients are invited to the experience centre to explore product offerings, design samples, and finishes.

**Required Data Input (Manual)**:
- Experience Centre Visit date/time
- Visit confirmation from client
- Visit type (in-person/virtual)

**Required Action/Automation Trigger**:
- Schedule visit via Notion integration
- Send reminder message to client (automated)
- Calendar invitation sent
- Pre-visit preparation checklist

**Role Responsibilities**:
- **Lead & Sales Manager**: Schedule and coordinate visits
- **Design Team**: Prepare experience centre

**Success Criteria**:
- Visit scheduled and confirmed
- Client receives reminder notifications
- Experience centre prepared for visit

---

### Step 4: Consultation & Data Capture
**Description**: A thorough discussion is held to dive deeper into the client's needs, lifestyle, and space functionality.

**Required Data Input (Manual)**:
- MoM (Minutes of Meeting) notes
- Detailed questionnaire responses
- Style preferences
- Functionality goals
- Target budget
- Material preferences
- Space measurements (if available)

**Required Action/Automation Trigger**:
- Log notes in CRM + MoM
- Feed detailed questionnaire responses into custom CRM fields
- Task: Validate all custom fields are populated
- Create project brief document

**Role Responsibilities**:
- **Lead & Sales Manager**: Conduct consultation and capture data
- **Design Team**: Review requirements and prepare for design phase

**Success Criteria**:
- All questionnaire fields completed
- MoM notes documented
- Client requirements fully captured
- Project brief created

---

### Step 5: Design in Progress
**Description**: Based on the consultation, a 3D design is created to visually represent the proposed concept.

**Required Data Input (Manual)**:
- Design start date
- Designer assignment
- Design brief confirmation
- Progress updates

**Required Action/Automation Trigger**:
- Schedule Presentation deadline
- Task: Designer must meet presentation deadline
- Progress tracking notifications
- Design review checkpoints

**Role Responsibilities**:
- **Design Team**: Create 3D designs and concepts
- **Project Manager**: Track progress and deadlines

**Success Criteria**:
- 3D design completed
- Presentation scheduled
- Design meets client requirements
- Quality review completed

---

### Step 6: Design Presentation & Fee Due
**Description**: The design is presented to the client along with a walkthrough. This stage is a paid service.

**Required Data Input (Manual)**:
- Presentation date/time
- Client feedback
- Design approval status
- Estimate sheet upload

**Required Action/Automation Trigger**:
- Upload Estimate Sheet and Presentation Guide
- **Automation (Revenue Trigger 1)**: Trigger generation/sharing of Design Fee Invoice (₹35K–₹48K)
- Payment tracking setup
- Follow-up scheduling

**Role Responsibilities**:
- **Design Team**: Present design and gather feedback
- **Finance & Payments**: Generate and send invoice
- **Lead & Sales Manager**: Follow up on payment

**Success Criteria**:
- Design presented to client
- Invoice generated and sent
- Payment tracking initiated
- Client feedback documented

---

### Step 7: Costing Shared
**Description**: Detailed costing is prepared and shared with the client for approval.

**Required Data Input (Manual)**:
- Detailed costing document
- Cost breakdown by category
- Material specifications
- Timeline estimates

**Required Action/Automation Trigger**:
- Upload Detailed Costing to CRM
- Task: Await Client Confirmation/Agreement
- Costing review and approval process
- Budget alignment check

**Role Responsibilities**:
- **Design Team**: Prepare detailed costing
- **Finance & Payments**: Review and validate costs
- **Lead & Sales Manager**: Present costing to client

**Success Criteria**:
- Detailed costing completed
- Costing shared with client
- Client approval received
- Budget alignment confirmed

---

### Step 8: Contract Signed (50% Due)
**Description**: Contract is signed and 50% advance payment is due.

**Required Data Input (Manual)**:
- Contract signed confirmation
- Contract document upload
- Payment terms confirmation
- Project timeline agreement

**Required Action/Automation Trigger**:
- Contract signed confirmation
- **Automation (Revenue Trigger 2)**: Trigger 50% Advance Invoice
- **Automation**: Activate Automated Reminder System until payment is collected
- Project kickoff preparation

**Role Responsibilities**:
- **Lead & Sales Manager**: Finalize contract
- **Finance & Payments**: Generate advance invoice
- **Project Manager**: Prepare for project execution

**Success Criteria**:
- Contract signed by both parties
- 50% advance invoice sent
- Payment reminder system activated
- Project execution plan ready

---

### Step 9: Site Measurement Visit
**Description**: Team visits the site for final measurements and site assessment.

**Required Data Input (Manual)**:
- Site visit date/time
- Site visit checklist completion
- Measurement data
- Site photos
- Site conditions assessment

**Required Action/Automation Trigger**:
- Upload Site Visit Checklist
- Task: Team visits the site for final measurements
- Site assessment documentation
- Measurement verification

**Role Responsibilities**:
- **Project Manager**: Coordinate site visit
- **Design Team**: Conduct measurements and assessment
- **Site Ops**: Document site conditions

**Success Criteria**:
- Site visit completed
- Measurements documented
- Site conditions assessed
- Final drawings updated

---

### Step 10: Detailed Drawings & Vendor Coordination
**Description**: Final technical drawings are prepared and vendor coordination begins.

**Required Data Input (Manual)**:
- Final technical drawings
- Vendor quotations
- Material specifications
- Production timeline

**Required Action/Automation Trigger**:
- Share final drawings confirmation
- Status updates shared with Design Team
- Vendor coordination tracking
- Production planning

**Role Responsibilities**:
- **Design Team**: Finalize technical drawings
- **Project Manager**: Coordinate with vendors
- **Site Ops**: Plan production logistics

**Success Criteria**:
- Final drawings completed
- Vendors coordinated
- Production plan ready
- Timeline confirmed

---

### Step 11: Production (40% Interim Due)
**Description**: Material orders are placed and production begins.

**Required Data Input (Manual)**:
- Material orders placed confirmation
- Production start date
- Vendor delivery schedules
- Quality checkpoints

**Required Action/Automation Trigger**:
- Material orders placed confirmation
- **Automation (Revenue Trigger 3)**: Trigger 40% Interim Invoice
- **Automation**: Continue/Activate Automated Reminder System until payment is collected
- Production progress tracking

**Role Responsibilities**:
- **Project Manager**: Coordinate production
- **Finance & Payments**: Generate interim invoice
- **Site Ops**: Monitor production progress

**Success Criteria**:
- Materials ordered and confirmed
- 40% interim invoice sent
- Production started
- Progress tracking active

---

### Step 12: Project Closure (Final 10% Payment)
**Description**: Project is completed and handover pack is presented.

**Required Data Input (Manual)**:
- Project completion confirmation
- Handover pack preparation
- Final quality check
- Client acceptance

**Required Action/Automation Trigger**:
- Present Handover Pack confirmation
- **Automation (Revenue Trigger 4)**: Trigger Final Invoice
- **Automation**: Continue/Activate Automated Reminder System until payment is collected
- Project closure documentation

**Role Responsibilities**:
- **Project Manager**: Complete project closure
- **Finance & Payments**: Generate final invoice
- **Site Ops**: Prepare handover documentation

**Success Criteria**:
- Project completed successfully
- Handover pack presented
- Final invoice sent
- Client satisfaction confirmed

---

### Step 13: Project Completed
**Description**: Project is fully completed, final payment received, and testimonial captured.

**Required Data Input (Manual)**:
- Final payment received confirmation
- Case Holder Assignment details
- Testimonial capture
- Project evaluation

**Required Action/Automation Trigger**:
- Log Case Holder Assignment details
- Capture Testimonial
- Project moved to "Testimonial/Referral" list for future outreach
- Success metrics calculation

**Role Responsibilities**:
- **Finance & Payments**: Confirm final payment
- **Lead & Sales Manager**: Capture testimonial
- **Founder/Executive**: Review project success

**Success Criteria**:
- Final payment received
- Testimonial captured
- Project marked as completed
- Referral potential assessed

## Workflow Automation Rules

### Stage Progression Rules
1. **Sequential Progression**: Stages must be completed in order (1→2→3...→13)
2. **Prerequisites**: Each stage has specific prerequisites that must be met
3. **Role Permissions**: Only authorized roles can move projects between stages
4. **Data Validation**: Required data must be captured before stage progression

### Automation Triggers
1. **Email Notifications**: Automated emails at each stage transition
2. **Payment Reminders**: Automated payment follow-up system
3. **Task Assignments**: Automatic task creation for next stage
4. **Deadline Tracking**: Automated deadline monitoring and alerts

### Quality Gates
1. **Data Completeness**: All required fields must be populated
2. **Document Upload**: Required documents must be uploaded
3. **Approval Workflows**: Client approvals required at key stages
4. **Financial Validation**: Payment confirmations required for revenue stages

## Success Metrics

### Pipeline Health Metrics
- **Stage Distribution**: Number of projects in each stage
- **Average Stage Duration**: Time spent in each stage
- **Drop-off Rate**: Projects that don't progress to next stage
- **Conversion Rate**: Lead to completed project ratio

### Revenue Metrics
- **Pipeline Value**: Total value of active projects
- **Payment Collection Rate**: Percentage of invoices paid on time
- **Revenue Recognition**: Revenue recognized by stage
- **Overdue Payments**: Number and value of overdue payments

### Operational Metrics
- **Resource Utilization**: Team workload by stage
- **Client Satisfaction**: Feedback scores by stage
- **Process Efficiency**: Time to complete each stage
- **Quality Metrics**: Rework and revision rates
