# Migration Guide: From Mock to Production

## Overview

This guide helps the technical team migrate from the current mock server setup to a production-ready MongoDB-based system while maintaining all existing functionality and API endpoints.

## Current vs Production Architecture

### Current Setup (Mock Server)
```
server-mock-v2.js (Single file with all logic)
├── In-memory data storage
├── Mock API endpoints
└── No database persistence
```

### Production Setup (Clean Architecture)
```
server/
├── app.js (Express application setup)
├── server.js (Entry point)
├── models/ (MongoDB schemas)
├── routes/ (API route handlers)
├── middleware/ (Authentication, validation)
├── config/ (Database configuration)
└── utils/ (Helper functions)
```

## Migration Steps

### 1. Database Setup

#### Install MongoDB
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y mongodb

# macOS
brew install mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

#### Create Database and User
```bash
mongo
> use designpipeline_crm
> db.createUser({
    user: "admin",
    pwd: "secure_password",
    roles: [{ role: "readWrite", db: "designpipeline_crm" }]
  })
```

### 2. Environment Configuration

Copy and update environment variables:
```bash
cp config.env.example .env
```

Update `.env` with production values:
```bash
NODE_ENV=production
PORT=8081
MONGODB_URI=mongodb://admin:secure_password@localhost:27017/designpipeline_crm
JWT_SECRET=your-super-secure-jwt-secret-key-change-this
FRONTEND_URL=https://your-domain.com
```

### 3. Data Migration

#### Seed Database with Sample Data
```bash
cd server
npm run seed
```

This creates:
- Admin user: `admin@designpipeline.com` / `admin123`
- Sample designers, clients, and projects
- All data matches the current mock structure

#### Manual Data Migration (if needed)
If you have existing data to migrate:

1. **Export from mock server:**
```javascript
// Add to server-mock-v2.js temporarily
app.get('/api/export-data', (req, res) => {
  res.json({
    users: users,
    clients: clients,
    deals: deals,
    designers: designers
  });
});
```

2. **Import to MongoDB:**
```javascript
// Create migration script in server/utils/migrateData.js
const migrateData = async () => {
  // Import logic here
};
```

### 4. API Compatibility

All existing API endpoints are maintained:

| Endpoint | Status | Notes |
|----------|--------|-------|
| `GET /api/health` | ✅ Compatible | Enhanced with version info |
| `POST /api/auth/login` | ✅ Compatible | JWT-based authentication |
| `GET /api/clients` | ✅ Compatible | Pagination added |
| `POST /api/clients` | ✅ Compatible | Validation enhanced |
| `GET /api/deals` | ✅ Compatible | Advanced filtering |
| `POST /api/deals` | ✅ Compatible | Notes history support |
| `GET /api/designers` | ✅ Compatible | Role-based access |
| `POST /api/designers` | ✅ Compatible | Manager/admin only |
| `GET /api/valued-customers` | ✅ Compatible | Enhanced metrics |
| `POST /api/documents` | ✅ Compatible | File upload support |
| `GET /api/payments` | ✅ Compatible | Payment tracking |

### 5. Frontend Compatibility

No frontend changes required:
- All API calls remain the same
- Authentication flow unchanged
- UI components work identically
- File uploads function the same

### 6. Deployment Options

#### Option A: Direct Deployment
```bash
# Install dependencies
npm run install-all

# Build frontend
npm run build

# Start production server
npm start
```

#### Option B: Docker Deployment
```bash
cd deployment/docker
docker-compose up -d
```

#### Option C: Kubernetes Deployment
```bash
kubectl apply -f deployment/kubernetes/
```

#### Option D: Production Script
```bash
chmod +x deployment/scripts/deploy-production.sh
./deployment/scripts/deploy-production.sh --seed --nginx
```

### 7. Testing Migration

#### 1. Health Check
```bash
curl http://localhost:8081/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Design Pipeline CRM Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

#### 2. Authentication Test
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@designpipeline.com","password":"admin123"}'
```

#### 3. Data Verification
```bash
# Test clients endpoint
curl -H "Authorization: Bearer <token>" http://localhost:8081/api/clients

# Test deals endpoint
curl -H "Authorization: Bearer <token>" http://localhost:8081/api/deals
```

### 8. Performance Optimizations

#### Database Indexes
The production setup includes optimized indexes:
```javascript
// Automatic indexes in models
clientSchema.index({ email: 1 });
clientSchema.index({ name: 1 });
dealSchema.index({ projectName: 1 });
dealSchema.index({ currentStage: 1 });
```

#### Caching (Optional)
Add Redis for session management:
```bash
# Install Redis
sudo apt-get install redis-server

# Update .env
REDIS_URL=redis://localhost:6379
```

#### File Storage (Optional)
Configure cloud storage for file uploads:
```bash
# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name

# Or Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEYFILE=path/to/service-account-key.json
```

### 9. Monitoring Setup

#### Application Monitoring
```bash
# Install PM2 for process management
npm install -g pm2

# Start with PM2
pm2 start server/server.js --name design-pipeline-crm
pm2 startup
pm2 save
```

#### Log Management
```bash
# Configure log rotation
sudo tee /etc/logrotate.d/design-pipeline <<EOF
/var/log/design-pipeline/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 app app
}
EOF
```

### 10. Security Enhancements

#### SSL/HTTPS Setup
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com
```

#### Firewall Configuration
```bash
# Configure UFW
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

#### Database Security
```bash
# Secure MongoDB
sudo nano /etc/mongod.conf

# Add authentication
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

## Rollback Plan

If issues arise, you can quickly rollback:

### 1. Stop Production Server
```bash
pm2 stop design-pipeline-crm
# or
sudo systemctl stop design-pipeline-crm
```

### 2. Start Mock Server
```bash
npm run dev:mock
```

### 3. Update Frontend API URL
```javascript
// In client/src/services/api.ts
const API_BASE_URL = 'http://localhost:3002/api';
```

## Verification Checklist

- [ ] MongoDB is running and accessible
- [ ] Environment variables are configured
- [ ] Database is seeded with sample data
- [ ] Health check endpoint responds
- [ ] Authentication works with existing credentials
- [ ] All API endpoints respond correctly
- [ ] Frontend loads and functions normally
- [ ] File uploads work (if enabled)
- [ ] Email/SMS features work (if configured)
- [ ] Monitoring and logging are active
- [ ] SSL certificate is valid (if using HTTPS)
- [ ] Backup procedures are in place

## Support

For migration assistance:
1. Check application logs: `pm2 logs design-pipeline-crm`
2. Verify database connectivity: `mongo designpipeline_crm`
3. Test individual endpoints with curl/Postman
4. Review error logs in `/var/log/design-pipeline/`

## Post-Migration Tasks

1. **Update DNS** to point to production server
2. **Configure monitoring** alerts and dashboards
3. **Set up automated backups** for database and files
4. **Implement log rotation** and retention policies
5. **Configure email notifications** for system alerts
6. **Test disaster recovery** procedures
7. **Train users** on any new features or changes
8. **Document** any custom configurations or modifications

---

**Migration Complete!** 🎉

The system is now running on a production-ready MongoDB backend with all existing functionality preserved and enhanced.
