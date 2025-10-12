# Design Pipeline CRM - Production Ready

A comprehensive Customer Relationship Management system designed specifically for interior design businesses. This application streamlines the entire design process from lead generation to project completion and beyond-care customer management.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Design Pipeline CRM                      │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React + Material-UI)  │  Backend (Node.js + Express) │
│  - Client Management             │  - RESTful API               │
│  - Project Pipeline              │  - Authentication & Auth     │
│  - Kanban Board                  │  - File Upload Handling      │
│  - Beyond Care                   │  - Email/SMS Integration     │
│  - Designer Management           │  - Data Validation           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │     MongoDB         │
                    │  - User Management  │
                    │  - Client Data      │
                    │  - Project Data     │
                    │  - File Storage     │
                    └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** 8+
- **MongoDB** 6.0+
- **Docker** & **Docker Compose** (optional)

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd design-pipeline-crm

# Copy environment configuration
cp config.env.example .env

# Edit .env with your production values
nano .env
```

### 2. Database Setup

```bash
# Start MongoDB (using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Or install MongoDB locally
# Ubuntu/Debian: sudo apt-get install mongodb
# macOS: brew install mongodb-community
```

### 3. Application Setup

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install

# Build frontend for production
npm run build

# Seed the database with sample data
cd ../server
npm run seed

# Start the application
npm start
```

### 4. Access the Application

- **Frontend:** http://localhost:8081
- **API:** http://localhost:8081/api
- **Health Check:** http://localhost:8081/api/health

**Default Login Credentials:**
- Email: `admin@designpipeline.com`
- Password: `admin123`

## 📁 Project Structure

```
design-pipeline-crm/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Application pages
│   │   ├── services/                # API service layer
│   │   ├── contexts/                # React contexts
│   │   ├── hooks/                   # Custom hooks
│   │   └── utils/                   # Utility functions
│   ├── public/                      # Static assets
│   └── build/                       # Production build
├── server/                          # Node.js Backend
│   ├── models/                      # MongoDB models
│   ├── routes/                      # API routes
│   ├── middleware/                  # Express middleware
│   ├── config/                      # Configuration files
│   ├── utils/                       # Utility functions
│   └── server.js                    # Server entry point
├── deployment/                      # Deployment configurations
│   ├── docker/                      # Docker configurations
│   ├── kubernetes/                  # Kubernetes manifests
│   └── scripts/                     # Deployment scripts
├── docs/                            # Documentation
│   ├── api/                         # API documentation
│   ├── deployment/                  # Deployment guides
│   └── development/                 # Development guides
└── config.env.example               # Environment template
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `PORT` | Server port | `3002` | No |
| `MONGODB_URI` | Database connection string | `mongodb://localhost:27017/designpipeline_crm` | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` | Yes |
| `SMTP_HOST` | Email server host | - | No |
| `SMTP_USER` | Email username | - | No |
| `SMTP_PASS` | Email password | - | No |
| `AWS_ACCESS_KEY_ID` | AWS access key for file storage | - | No |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - | No |
| `AWS_S3_BUCKET` | S3 bucket name | - | No |

### Database Configuration

The application uses MongoDB with the following collections:
- **users** - User authentication and authorization
- **clients** - Customer information and contact details
- **deals** - Projects and deals with status tracking
- **designers** - Designer profiles and availability
- **documents** - File attachments and project documents

## 🚢 Deployment Options

### Option 1: Docker Deployment

```bash
cd deployment/docker
docker-compose up -d
```

### Option 2: Kubernetes Deployment

```bash
kubectl apply -f deployment/kubernetes/namespace.yaml
kubectl apply -f deployment/kubernetes/mongodb.yaml
kubectl apply -f deployment/kubernetes/app.yaml
```

### Option 3: Traditional Server Deployment

```bash
# Install dependencies
npm install --production

# Build frontend
cd client && npm run build

# Start with PM2
npm install -g pm2
pm2 start server/server.js --name design-pipeline-crm
pm2 startup
pm2 save
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt encryption for user passwords
- **Rate Limiting** - API request rate limiting (100 req/15min)
- **CORS Protection** - Configurable cross-origin resource sharing
- **Input Validation** - Comprehensive request validation
- **Helmet.js** - Security headers for Express.js
- **Environment-based Config** - Secure environment variable management

## 📊 Key Features

### 1. Client Management
- Complete client profiles with contact information
- Project history and relationship tracking
- Document management and file uploads
- Communication logs and follow-up scheduling

### 2. Project Pipeline
- Visual project stages (ToDo, In Progress, Blocked, Done, etc.)
- Drag-and-drop Kanban board interface
- Project status tracking and priority management
- Team assignment and collaboration tools

### 3. Beyond Care
- Valued customer identification and management
- Testimonial collection and management
- Project media showcase
- Rewards and referral program management
- Anniversary tracking and follow-up scheduling

### 4. Designer Management
- Designer profiles with skills and availability
- Role-based access control
- Email and SMS communication integration
- Project assignment and workload management

### 5. Workflow Management
- Lead generation and conversion tracking
- Project stage progression
- Notes history and change tracking
- Custom workflow configuration

## 🔌 API Documentation

The application provides a comprehensive REST API:

- **Authentication:** `/api/auth/*`
- **Clients:** `/api/clients/*`
- **Deals/Projects:** `/api/deals/*`
- **Designers:** `/api/designers/*`
- **Valued Customers:** `/api/valued-customers/*`
- **Documents:** `/api/documents/*`
- **Payments:** `/api/payments/*`

For detailed API documentation, see [API_DOCUMENTATION.md](docs/api/API_DOCUMENTATION.md).

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run integration tests
npm run test:integration
```

## 📈 Monitoring & Maintenance

### Health Checks
- Application health: `GET /api/health`
- Database connectivity monitoring
- File system and disk space monitoring

### Logging
- Structured logging with timestamps
- Error tracking and reporting
- Performance metrics collection

### Backup Strategy
- Automated database backups
- File system backup procedures
- Disaster recovery planning

## 🔄 Updates & Maintenance

### Application Updates
```bash
# Backup database
mongodump --out=/backups/pre-update

# Update code
git pull origin main

# Install dependencies
npm install

# Restart application
pm2 restart design-pipeline-crm
```

### Database Maintenance
- Regular index optimization
- Query performance monitoring
- Data cleanup and archival procedures

## 🤝 Support & Contributing

### Getting Help
- Check the [API Documentation](docs/api/API_DOCUMENTATION.md)
- Review [Deployment Guide](docs/deployment/PRODUCTION_DEPLOYMENT.md)
- Contact the development team

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Version History

- **v1.0.0** - Initial production release
  - Complete CRM functionality
  - Kanban project management
  - Beyond Care customer management
  - Designer management system
  - RESTful API with authentication
  - Docker and Kubernetes deployment support

## 🔗 Links

- **Production Deployment Guide:** [docs/deployment/PRODUCTION_DEPLOYMENT.md](docs/deployment/PRODUCTION_DEPLOYMENT.md)
- **API Documentation:** [docs/api/API_DOCUMENTATION.md](docs/api/API_DOCUMENTATION.md)
- **Development Guide:** [docs/development/DEVELOPMENT.md](docs/development/DEVELOPMENT.md)

---

**Ready for Production Deployment** 🚀

This codebase is production-ready and includes all necessary configurations, documentation, and deployment options for a professional CRM system.
