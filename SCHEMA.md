# Design Pipeline CRM - Comprehensive Schema Definition

## Deal/Project Schema

### A. Lead Details Reference
```typescript
interface LeadDetails {
  originalLeadId: string;           // Reference to original lead
  leadSource: LeadSource;           // Source of the lead
  leadName: string;                 // Lead's name
  leadEmail: string;                // Lead's email
  leadPhone: string;                // Lead's phone number
  leadCompany?: string;             // Lead's company (optional)
}
```

### B. Property Type
```typescript
interface PropertyType {
  dealType: 'Residential' | 'Commercial';
  propertyType: 
    // Residential Types
    | 'Residential - Independent House'
    | 'Residential - Apartment' 
    | 'Residential - Villa'
    // Commercial Types
    | 'Commercial - Retail Shops'
    | 'Commercial - Healthcare'
    | 'Commercial - Restaurant'
    | 'Commercial - Office Spaces';
}
```

### C. Size
```typescript
interface Size {
  area: number;                     // Area in square feet
  bhk?: number;                     // BHK for residential (1, 2, 3, 4, 5+)
  unit: 'Sqft';                     // Unit of measurement
  displayText: string;              // Formatted display (e.g., "1200 Sqft, 3BHK")
}
```

### D. Location
```typescript
interface Location {
  address: string;                  // Full address
  city: string;                     // City name
  state: string;                    // State name
  pincode?: string;                 // PIN code (optional)
  coordinates?: {                   // GPS coordinates (optional)
    latitude: number;
    longitude: number;
  };
}
```

### E. Construction Status
```typescript
type ConstructionStatus = 
  | 'New Construction'
  | 'Under Construction'
  | 'Existing Building'
  | 'Renovation'
  | 'Completed';
```

### F. Tentative Handover Date
```typescript
interface HandoverDate {
  tentativeHandoverDate: string;   // ISO date string (YYYY-MM-DD)
  isFlexible: boolean;              // Whether date is flexible
  notes?: string;                   // Additional notes about handover
}
```

### G. Category
```typescript
type Category = 'Standard' | 'Luxury';
```

### H. Special Requirements
```typescript
interface SpecialRequirements {
  requirements: string;             // Free text requirements
  tags: string[];                   // Categorized tags
  priority: 'Low' | 'Medium' | 'High'; // Priority level
}
```

## Activities Tab Schema

### Tasks
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo: string;               // User ID or name
  dueDate: string;                  // ISO date string
  completedDate?: string;           // ISO date string
  estimatedHours?: number;          // Estimated hours to complete
  actualHours?: number;             // Actual hours spent
  tags: string[];                   // Task categorization
  dependencies?: string[];          // IDs of dependent tasks
  createdAt: string;                // ISO date string
  updatedAt: string;                // ISO date string
}
```

### Calls
```typescript
interface Call {
  id: string;
  type: 'Incoming' | 'Outgoing' | 'Follow-up' | 'Consultation' | 'Support';
  phoneNumber: string;              // Phone number called/from
  duration: number;                 // Duration in minutes
  date: string;                     // ISO date string
  time: string;                     // Time of call (HH:MM)
  outcome: 'Successful' | 'No Answer' | 'Busy' | 'Voicemail' | 'Callback Requested';
  notes: string;                    // Call notes
  nextAction?: string;              // Next action required
  assignedTo: string;              // User who made/received call
  relatedTo: 'Lead' | 'Deal' | 'Client'; // What the call is related to
  relatedId: string;                // ID of related entity
  createdAt: string;                // ISO date string
}
```

### Meetings
```typescript
interface Meeting {
  id: string;
  type: 'Initial Meeting' | 'Design Review' | 'Progress Meeting' | 'Final Presentation' | 'Site Visit';
  title: string;
  description?: string;
  date: string;                     // ISO date string
  time: string;                     // Time (HH:MM)
  duration: number;                 // Duration in minutes
  location: string;                 // Meeting location
  locationType: 'Office' | 'Client Site' | 'Virtual' | 'Other';
  attendees: string[];              // Array of attendee names/IDs
  agenda: string;                   // Meeting agenda
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  notes?: string;                  // Meeting notes
  actionItems: string[];            // Action items from meeting
  followUpDate?: string;           // ISO date string
  relatedTo: 'Lead' | 'Deal' | 'Client';
  relatedId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Presentations
```typescript
interface Presentation {
  id: string;
  type: 'Concept Presentation' | 'Design Review' | 'Final Presentation' | 'Proposal';
  title: string;
  description?: string;
  date: string;                     // ISO date string
  time: string;                     // Time (HH:MM)
  duration: number;                 // Duration in minutes
  location: string;                 // Presentation location
  attendees: string[];              // Array of attendee names/IDs
  materials: string[];              // Materials used (3D renders, mood boards, etc.)
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  outcome: 'Approved' | 'Rejected' | 'Pending Review' | 'Revisions Required';
  feedback?: string;                // Client feedback
  nextSteps?: string;               // Next steps after presentation
  relatedTo: 'Lead' | 'Deal' | 'Client';
  relatedId: string;
  createdAt: string;
  updatedAt: string;
}
```

### Surveys
```typescript
interface Survey {
  id: string;
  type: 'Client Satisfaction' | 'Requirements Survey' | 'Feedback Survey' | 'Post-Project Survey';
  title: string;
  description?: string;
  date: string;                     // ISO date string
  questions: number;                // Number of questions
  responses: number;                // Number of responses received
  score: number;                    // Average score (1-5)
  maxScore: number;                 // Maximum possible score
  feedback: string;                 // Overall feedback
  responses: SurveyResponse[];      // Detailed responses
  status: 'Draft' | 'Active' | 'Completed' | 'Closed';
  relatedTo: 'Lead' | 'Deal' | 'Client';
  relatedId: string;
  createdAt: string;
  updatedAt: string;
}

interface SurveyResponse {
  questionId: string;
  question: string;
  answer: string | number;
  score?: number;                   // If scored question
}
```

### Interviews
```typescript
interface Interview {
  id: string;
  type: 'Requirements Gathering' | 'Stakeholder Interview' | 'User Research' | 'Feedback Session';
  title: string;
  description?: string;
  date: string;                     // ISO date string
  duration: number;                 // Duration in minutes
  participants: string[];           // Array of participant names/IDs
  interviewer: string;              // Person conducting interview
  notes: string;                    // Interview notes
  keyFindings: string[];            // Key findings from interview
  actionItems: string[];            // Action items from interview
  recording?: string;                // Link to recording (if applicable)
  transcript?: string;              // Interview transcript
  relatedTo: 'Lead' | 'Deal' | 'Client';
  relatedId: string;
  createdAt: string;
  updatedAt: string;
}
```

## Internal/Designer Tracking Schema

### User Management
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Designer' | 'Project Manager' | 'Sales' | 'Admin';
  department: 'Design' | 'Project Management' | 'Sales' | 'Operations';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Assigned Team
```typescript
interface AssignedTeam {
  assignedDesigner: string;         // User ID of assigned designer
  assignedPM: string;               // User ID of assigned project manager
  assignedSales?: string;            // User ID of assigned sales person
  teamMembers: string[];            // Additional team member IDs
  assignmentDate: string;           // ISO date string
  assignmentNotes?: string;         // Notes about assignment
}
```

### Design Package
```typescript
interface DesignPackage {
  packageType: 'Standard' | 'Luxury' | 'Premium' | 'Custom';
  features: string[];               // Features included in package
  deliverables: string[];            // What will be delivered
  timeline: number;                  // Timeline in days
  price: number;                     // Package price
  customizations?: string[];         // Custom features if Custom package
}
```

### Design Status Tracking
```typescript
interface DesignStatus {
  moodBoardShared: boolean;         // Whether mood board has been shared
  moodBoardDate?: string;           // ISO date string when shared
  moodBoardFeedback?: string;       // Client feedback on mood board
  
  design3DStatus: 'Not Started' | 'In Progress' | 'Ready' | 'Client Review' | 'Approved';
  design3DProgress: number;         // Progress percentage (0-100)
  design3DVersion: string;          // Current version number
  design3DLastUpdated: string;      // ISO date string
  
  design2DStatus: 'Not Started' | 'In Progress' | 'Ready' | 'Client Review' | 'Approved';
  design2DProgress: number;         // Progress percentage (0-100)
  design2DVersion: string;          // Current version number
  design2DLastUpdated: string;      // ISO date string
  
  materialSelectionStatus: 'Not Started' | 'In Progress' | 'Ready' | 'Client Review' | 'Approved';
  materialSelectionProgress: number; // Progress percentage (0-100)
  materialSelectionDate?: string;   // ISO date string
  
  clientApprovalDate?: string;      // ISO date string when client approved
  revisionCount: number;            // Number of revisions made
  lastRevisionDate?: string;        // ISO date string of last revision
}
```

## Complete Deal Schema
```typescript
interface Deal {
  // Basic Information
  _id: string;
  dealId: string;                    // Auto-generated deal ID
  projectName: string;
  clientId: string;
  clientName: string;
  
  // Lead Details Reference
  leadDetails: LeadDetails;
  
  // Property Information
  propertyType: PropertyType;
  size: Size;
  location: Location;
  constructionStatus: ConstructionStatus;
  handoverDate: HandoverDate;
  category: Category;
  specialRequirements: SpecialRequirements;
  
  // Project Management
  currentStage: string;
  projectStatus: 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  totalProjectValue: number;
  projectStartDate: string;
  expectedCompletionDate: string;
  actualCompletionDate?: string;
  
  // Internal Tracking
  assignedTeam: AssignedTeam;
  designPackage: DesignPackage;
  designStatus: DesignStatus;
  
  // Activities
  activities: {
    tasks: Task[];
    calls: Call[];
    meetings: Meeting[];
    presentations: Presentation[];
    surveys: Survey[];
    interviews: Interview[];
  };
  
  // Lead Source Specific Data
  referralDetails?: {
    referrerName: string;
    referrerContact: string;
    referrerProjectNumber: string;
  };
  
  paidLeadDetails?: {
    agentName: string;
    agencyName: string;
    agentContact: string;
  };
  
  socialMediaDetails?: {
    platform: 'Instagram' | 'Facebook' | 'YouTube' | 'LinkedIn';
    campaignName: string;
    postUrl: string;
  };
  
  walkInDetails?: {
    sourceType: 'Walk-In' | 'Expo' | 'Event';
    eventName: string;
    boothNumber?: string;
  };
  
  // System Fields
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  createdBy: string;
  lastModifiedBy: string;
}
```

## Validation Rules

### Required Fields
- projectName, clientId, clientName
- leadDetails (all fields)
- propertyType.dealType, propertyType.propertyType
- size.area, size.unit
- location.address, location.city, location.state
- constructionStatus
- handoverDate.tentativeHandoverDate
- category
- assignedTeam.assignedDesigner, assignedTeam.assignedPM
- designPackage.packageType

### Validation Constraints
- area must be > 0
- bhk must be 1-5 for residential properties
- tentativeHandoverDate must be in the future
- totalProjectValue must be > 0
- email addresses must be valid format
- phone numbers must be valid format
- dates must be valid ISO format

### Business Rules
- Luxury projects must have area > 1000 sqft
- Commercial projects don't require BHK
- Referral projects must have referrer details
- Social media projects must have platform and post URL
- Paid lead projects must have agent details
- Expo projects must have event details
