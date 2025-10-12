# Design Pipeline CRM - Production Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Design Pipeline CRM system to production environments. The application consists of a React frontend and Node.js backend with MongoDB database.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Node.js API   │    │   MongoDB       │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
│   Port: 3000    │    │   Port: 8081    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

- Node.js 18+ and npm 8+
- MongoDB 6.0+
- Docker & Docker Compose (for containerized deployment)
- Kubernetes cluster (for K8s deployment)
- SSL certificates (for production HTTPS)
- Domain name and DNS configuration

## Quick Start

### 1. Environment Setup

Copy the environment template:
```bash
cp config.env.example .env
```

Update `.env` with your production values:
```bash
NODE_ENV=production
PORT=8081
MONGODB_URI=mongodb://localhost:27017/designpipeline_crm
JWT_SECRET=your-super-secure-jwt-secret-key
FRONTEND_URL=https://your-domain.com
```

### 2. Database Setup

#### MongoDB Installation
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

#### Database Initialization
```bash
# Create database and admin user
mongo
> use designpipeline_crm
> db.createUser({
    user: "admin",
    pwd: "secure_password",
    roles: [{ role: "readWrite", db: "designpipeline_crm" }]
  })
```

### 3. Application Deployment

#### Option A: Direct Deployment

1. **Install Dependencies**
```bash
# Backend
cd server
npm install --production

# Frontend
cd ../client
npm install
npm run build
```

2. **Start Application**
```bash
cd server
npm start
```

#### Option B: Docker Deployment

1. **Build and Run with Docker Compose**
```bash
cd deployment/docker
docker-compose up -d
```

2. **Check Status**
```bash
docker-compose ps
docker-compose logs app
```

#### Option C: Kubernetes Deployment

1. **Create Namespace**
```bash
kubectl apply -f deployment/kubernetes/namespace.yaml
```

2. **Deploy Database**
```bash
kubectl apply -f deployment/kubernetes/mongodb.yaml
```

3. **Deploy Application**
```bash
kubectl apply -f deployment/kubernetes/app.yaml
```

4. **Check Deployment**
```bash
kubectl get pods -n design-pipeline-crm
kubectl get services -n design-pipeline-crm
```

## Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `8081` |
| `MONGODB_URI` | Database connection string | `mongodb://user:pass@host:port/db` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://your-domain.com` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_USER` | Email username | `your-email@gmail.com` |
| `SMTP_PASS` | Email password | `your-app-password` |

### SSL/TLS Configuration

For production, configure HTTPS:

1. **Obtain SSL Certificates**
```bash
# Using Let's Encrypt
certbot certonly --standalone -d your-domain.com
```

2. **Update Nginx Configuration**
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Database Management

### Backup Strategy

1. **Automated Backups**
```bash
#!/bin/bash
# backup.sh
mongodump --uri="mongodb://admin:password@localhost:27017/designpipeline_crm" --out=/backups/$(date +%Y%m%d)
```

2. **Restore from Backup**
```bash
mongorestore --uri="mongodb://admin:password@localhost:27017/designpipeline_crm" /backups/20231201/designpipeline_crm
```

### Database Monitoring

- Set up MongoDB monitoring with tools like MongoDB Compass or Ops Manager
- Configure alerts for disk space, memory usage, and slow queries
- Regular performance analysis and index optimization

## Security Considerations

### 1. Authentication & Authorization
- Use strong JWT secrets (32+ characters)
- Implement rate limiting
- Regular password rotation for database users

### 2. Network Security
- Use HTTPS in production
- Configure firewall rules
- Implement IP whitelisting for database access

### 3. Data Protection
- Encrypt sensitive data at rest
- Use secure file upload handling
- Implement proper CORS policies

### 4. Monitoring & Logging
- Set up application monitoring (e.g., PM2, New Relic)
- Configure log rotation
- Implement error tracking (e.g., Sentry)

## Scaling

### Horizontal Scaling

1. **Load Balancer Configuration**
```nginx
upstream app_servers {
    server app1:8081;
    server app2:8081;
    server app3:8081;
}

server {
    location / {
        proxy_pass http://app_servers;
    }
}
```

2. **Database Scaling**
- Set up MongoDB replica sets
- Implement read replicas for heavy read workloads
- Consider sharding for large datasets

### Vertical Scaling

- Monitor CPU and memory usage
- Scale up server resources as needed
- Optimize database queries and indexes

## Monitoring & Maintenance

### Health Checks

The application provides health check endpoints:
- `GET /api/health` - Application health status

### Log Management

1. **Log Rotation**
```bash
# /etc/logrotate.d/design-pipeline
/var/log/design-pipeline/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 app app
}
```

2. **Application Monitoring**
```bash
# Using PM2
npm install -g pm2
pm2 start server/server.js --name design-pipeline-crm
pm2 startup
pm2 save
```

### Updates & Maintenance

1. **Application Updates**
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

2. **Database Maintenance**
- Regular index optimization
- Monitor query performance
- Clean up old data as needed

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
```bash
# Check MongoDB status
systemctl status mongod

# Test connection
mongo --host localhost --port 27017
```

2. **Application Won't Start**
```bash
# Check logs
pm2 logs design-pipeline-crm

# Check port availability
netstat -tulpn | grep :8081
```

3. **File Upload Issues**
- Check file size limits
- Verify upload directory permissions
- Monitor disk space

### Performance Issues

1. **Slow Database Queries**
- Use MongoDB explain() to analyze queries
- Add appropriate indexes
- Optimize query patterns

2. **High Memory Usage**
- Monitor Node.js heap usage
- Implement proper garbage collection
- Scale horizontally if needed

## Support

For technical support and questions:
- Check application logs first
- Review this documentation
- Contact the development team

## Version History

- v1.0.0 - Initial production release
- Includes: Full CRM functionality, Kanban boards, Beyond Care features
- Database: MongoDB with Mongoose ODM
- Frontend: React with Material-UI
- Backend: Node.js with Express.js
