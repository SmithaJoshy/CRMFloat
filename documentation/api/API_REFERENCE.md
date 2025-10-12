# Design Pipeline CRM - API Documentation

## Base URL
- Development: `http://localhost:3002/api`
- Production: `https://your-domain.com/api`

## Authentication

All API endpoints (except `/auth/login` and `/health`) require authentication via JWT token.

### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

## Endpoints

### Authentication

#### POST `/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "admin@designpipeline.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "Admin User",
    "email": "admin@designpipeline.com",
    "role": "admin"
  }
}
```

#### POST `/auth/register`
Register a new user (admin only).

**Request Body:**
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "sales"
}
```

#### GET `/auth/verify`
Verify JWT token validity.

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Clients

#### GET `/clients`
Get all clients with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in name, email, company
- `status` (optional): Filter by status (active, inactive, prospect)

**Response:**
```json
{
  "clients": [
    {
      "_id": "client_id",
      "name": "John Smith",
      "email": "john@example.com",
      "phone": "+1234567890",
      "company": "ABC Corp",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalClients": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET `/clients/:id`
Get a single client by ID.

#### POST `/clients`
Create a new client.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ABC Corp",
  "targetBudget": 100000,
  "source": "website"
}
```

#### PUT `/clients/:id`
Update an existing client.

#### DELETE `/clients/:id`
Soft delete a client (set status to inactive).

### Deals/Projects

#### GET `/deals`
Get all deals with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search in project name, client name, deal ID
- `stage` (optional): Filter by current stage
- `status` (optional): Filter by project status

**Response:**
```json
{
  "deals": [
    {
      "_id": "deal_id",
      "projectName": "Modern Apartment Design",
      "clientId": "client_id",
      "clientName": "John Smith",
      "dealId": "DEAL-001",
      "currentStage": "In Progress",
      "totalProjectValue": 500000,
      "priorityLevel": "High",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalDeals": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### GET `/deals/:id`
Get a single deal by ID with populated client and designer information.

#### POST `/deals`
Create a new deal/project.

**Request Body:**
```json
{
  "projectName": "Modern Apartment Design",
  "clientId": "client_id",
  "totalProjectValue": 500000,
  "priorityLevel": "High",
  "assignedTeam": {
    "assignedDesigner": "designer_id"
  },
  "propertyType": {
    "propertyType": "Residential",
    "dealType": "Interior Design"
  }
}
```

#### PUT `/deals/:id`
Update an existing deal.

**Special Note:** When updating with notes, the system automatically adds to notes history:
```json
{
  "currentStage": "Done",
  "notes": "Project completed successfully",
  "noteType": "status_change"
}
```

#### DELETE `/deals/:id`
Delete a deal (hard delete).

### Designers

#### GET `/designers`
Get all designers with filtering.

**Query Parameters:**
- `search` (optional): Search in name, email, role
- `availability` (optional): Filter by availability
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status

**Response:**
```json
{
  "designers": [
    {
      "_id": "designer_id",
      "name": "Sarah Johnson",
      "email": "sarah@designpipeline.com",
      "phone": "+1234567890",
      "role": "Senior Interior Designer",
      "availability": "Available",
      "skills": ["Residential Design", "3D Visualization"],
      "isActive": true
    }
  ]
}
```

#### GET `/designers/:id`
Get a single designer by ID.

#### POST `/designers`
Create a new designer (manager/admin only).

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah@designpipeline.com",
  "phone": "+1234567890",
  "role": "Senior Interior Designer",
  "skills": ["Residential Design", "3D Visualization"],
  "experience": "8 years"
}
```

#### PUT `/designers/:id`
Update an existing designer (manager/admin only).

#### DELETE `/designers/:id`
Soft delete a designer (manager/admin only).

#### POST `/designers/:id/send-email`
Send email to designer.

**Request Body:**
```json
{
  "subject": "Project Update",
  "message": "Please review the latest project changes."
}
```

#### POST `/designers/:id/send-sms`
Send SMS to designer.

**Request Body:**
```json
{
  "message": "Urgent: Please check your email for project updates."
}
```

### Valued Customers (Beyond Care)

#### GET `/valued-customers`
Get all valued customers with metrics and related data.

**Response:**
```json
{
  "valuedCustomers": [
    {
      "_id": "vc-customer_id",
      "clientId": "customer_id",
      "clientName": "John Smith",
      "email": "john@example.com",
      "isValued": true,
      "totalProjects": 3,
      "totalValue": 750000,
      "npsScore": 9,
      "referralCount": 2,
      "testimonials": [...],
      "projectMedia": [...],
      "rewards": [...]
    }
  ]
}
```

#### PUT `/valued-customers/:id/mark-valued`
Mark a customer as valued.

#### POST `/valued-customers/:id/testimonials`
Add testimonial for valued customer.

**Request Body:**
```json
{
  "projectName": "Luxury Villa Design",
  "rating": 5,
  "review": "Excellent work and beautiful design!",
  "isPublic": true
}
```

#### POST `/valued-customers/:id/media`
Add project media for valued customer.

**Request Body:**
```json
{
  "projectName": "Modern Apartment",
  "type": "photo",
  "caption": "Beautiful living room design",
  "url": "https://example.com/photo.jpg",
  "isPublic": true
}
```

#### POST `/valued-customers/:id/rewards`
Add reward for valued customer.

**Request Body:**
```json
{
  "type": "loyalty_bonus",
  "title": "Customer Appreciation Bonus",
  "description": "Thank you for being a valued customer",
  "value": 5000,
  "status": "awarded"
}
```

#### PUT `/valued-customers/:id/follow-up`
Schedule follow-up for valued customer.

**Request Body:**
```json
{
  "nextFollowUpDate": "2024-02-01T00:00:00.000Z"
}
```

### Documents

#### GET `/documents`
Get all documents with filtering.

**Query Parameters:**
- `clientId` (optional): Filter by client
- `projectId` (optional): Filter by project

#### POST `/documents`
Upload a new document.

**Request:** Multipart form data with file upload
- `file`: The document file
- `clientId`: Client ID (optional)
- `projectId`: Project ID (optional)
- `description`: Document description (optional)

#### DELETE `/documents/:id`
Delete a document.

### Payments

#### GET `/payments`
Get all payments with filtering.

**Query Parameters:**
- `clientId` (optional): Filter by client
- `projectId` (optional): Filter by project
- `status` (optional): Filter by payment status

#### POST `/payments`
Record a new payment.

**Request Body:**
```json
{
  "clientId": "client_id",
  "projectId": "project_id",
  "amount": 250000,
  "paymentDate": "2024-01-15T00:00:00.000Z",
  "status": "completed",
  "method": "bank_transfer",
  "reference": "TXN123456",
  "notes": "Initial payment for project"
}
```

#### PUT `/payments/:id`
Update an existing payment.

#### DELETE `/payments/:id`
Delete a payment.

### Health Check

#### GET `/health`
Application health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Design Pipeline CRM Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited:
- **Limit:** 100 requests per 15 minutes per IP
- **Headers:** Rate limit information included in response headers

## File Upload

- **Max file size:** 10MB
- **Supported formats:** PDF, images, documents
- **Storage:** Files stored as base64 in database (configure cloud storage for production)

## WebSocket Support

Real-time features (optional):
- Project status updates
- Live notifications
- Collaborative editing

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://your-domain.com/api',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Get all clients
const clients = await api.get('/clients');

// Create new deal
const deal = await api.post('/deals', {
  projectName: 'New Project',
  clientId: 'client_id',
  totalProjectValue: 100000
});
```

### Python

```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Get all clients
response = requests.get('https://your-domain.com/api/clients', headers=headers)
clients = response.json()

# Create new deal
deal_data = {
    'projectName': 'New Project',
    'clientId': 'client_id',
    'totalProjectValue': 100000
}
response = requests.post('https://your-domain.com/api/deals', json=deal_data, headers=headers)
```

## Testing

### Postman Collection

Import the provided Postman collection for API testing:
- Authentication flows
- CRUD operations
- Error scenarios
- Rate limiting tests

### Automated Tests

Run the test suite:
```bash
npm test
```

## Support

For API support:
- Check error responses for detailed information
- Review request/response examples
- Contact development team for assistance
