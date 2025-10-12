# GHS Customization Deployment Guide

## 🎨 **CRMFloat - GHS Interior Design Customization**

This guide will help you deploy CRMFloat with GHS interior design customization for your business.

## 🚀 **Quick Deployment**

### **Option 1: Automated Deployment (Recommended)**
```bash
# Clone CRMFloat
git clone https://github.com/SmithaJoshy/CRMFloat.git
cd CRMFloat

# Run GHS deployment script
./ghs-customization/scripts/deploy-ghs.sh
```

### **Option 2: Manual Deployment**
```bash
# 1. Install dependencies
npm install
cd client && npm install && cd ..

# 2. Apply GHS configuration
cp ghs-customization/config/interior-design.config.js config/
cp ghs-customization/config/ghs-branding.json config/

# 3. Set environment variables
export INDUSTRY_PACKAGE=interior-design
export BUSINESS_TYPE=interior-design
export TENANT_ID=ghs

# 4. Build and start
npm run build
npm start
```

## 🌐 **Deployment Options**

### **Option A: Subdomain Deployment**
```
https://ghs.crmfloat.io
```

**Setup:**
1. Configure DNS to point `ghs.crmfloat.io` to your server
2. Set up SSL certificate
3. Deploy with subdomain routing enabled

### **Option B: Custom Domain**
```
https://ghs-crm.com
https://ghs-pipeline.com
```

**Setup:**
1. Purchase custom domain
2. Configure DNS records
3. Set up SSL certificate
4. Deploy with custom domain configuration

### **Option C: Path-based Deployment**
```
https://crmfloat.io/ghs
```

**Setup:**
1. Deploy as subdirectory
2. Configure reverse proxy
3. Set up path-based routing

## 🔧 **Environment Configuration**

### **Required Environment Variables:**
```bash
# Core Configuration
NODE_ENV=production
PORT=8080
INDUSTRY_PACKAGE=interior-design
BUSINESS_TYPE=interior-design
TENANT_ID=ghs
TENANT_DOMAIN=ghs.crmfloat.io

# GHS Specific
GHS_BRANDING=true
GHS_WORKFLOW=true
GHS_CUSTOM_FIELDS=true

# Database (if using real database)
MONGODB_URI=mongodb://localhost:27017/crmfloat_ghs

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### **Optional Environment Variables:**
```bash
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET_NAME=your-bucket-name

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## 📦 **Production Deployment**

### **1. Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y
```

### **2. Application Deployment**
```bash
# Clone and deploy
git clone https://github.com/SmithaJoshy/CRMFloat.git
cd CRMFloat

# Run GHS deployment
./ghs-customization/scripts/deploy-ghs.sh

# Copy to production directory
sudo cp -r deploy/ghs /opt/crmfloat-ghs
cd /opt/crmfloat-ghs

# Install production dependencies
npm install --production

# Start with PM2
pm2 start npm --name "crmfloat-ghs" -- start
pm2 save
pm2 startup
```

### **3. Nginx Configuration**
```nginx
# /etc/nginx/sites-available/ghs.crmfloat.io
server {
    listen 80;
    server_name ghs.crmfloat.io;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### **4. SSL Certificate (Let's Encrypt)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d ghs.crmfloat.io

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🗄️ **Database Setup**

### **Option 1: MongoDB (Recommended)**
```bash
# Install MongoDB
sudo apt install mongodb -y

# Create database
mongo
use crmfloat_ghs
db.createUser({
  user: "crmfloat_user",
  pwd: "your-secure-password",
  roles: ["readWrite"]
})
exit

# Update environment variables
MONGODB_URI=mongodb://crmfloat_user:your-secure-password@localhost:27017/crmfloat_ghs
```

### **Option 2: PostgreSQL**
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Create database and user
sudo -u postgres psql
CREATE DATABASE crmfloat_ghs;
CREATE USER crmfloat_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE crmfloat_ghs TO crmfloat_user;
\q

# Update environment variables
DATABASE_URL=postgresql://crmfloat_user:your-secure-password@localhost:5432/crmfloat_ghs
```

## 🔒 **Security Configuration**

### **1. Firewall Setup**
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow application port (if direct access needed)
sudo ufw allow 8080
```

### **2. Environment Security**
```bash
# Secure environment file
sudo chmod 600 /opt/crmfloat-ghs/.env
sudo chown www-data:www-data /opt/crmfloat-ghs/.env
```

### **3. JWT Security**
```bash
# Generate secure JWT secret
openssl rand -base64 64

# Update environment
JWT_SECRET=your-generated-secret-key
JWT_EXPIRES_IN=24h
```

## 📊 **Monitoring & Logging**

### **1. PM2 Monitoring**
```bash
# View application status
pm2 status

# View logs
pm2 logs crmfloat-ghs

# Monitor resources
pm2 monit
```

### **2. Log Rotation**
```bash
# Install logrotate
sudo apt install logrotate -y

# Configure log rotation
sudo nano /etc/logrotate.d/crmfloat-ghs
```

### **3. Health Checks**
```bash
# Create health check script
cat > /opt/crmfloat-ghs/health-check.sh << EOF
#!/bin/bash
curl -f http://localhost:8080/api/health || exit 1
EOF

chmod +x /opt/crmfloat-ghs/health-check.sh

# Add to crontab for monitoring
crontab -e
# Add: */5 * * * * /opt/crmfloat-ghs/health-check.sh
```

## 🔄 **Backup & Recovery**

### **1. Database Backup**
```bash
# MongoDB backup
mongodump --db crmfloat_ghs --out /backup/mongodb/$(date +%Y%m%d)

# PostgreSQL backup
pg_dump crmfloat_ghs > /backup/postgresql/crmfloat_ghs_$(date +%Y%m%d).sql
```

### **2. Application Backup**
```bash
# Create backup script
cat > /opt/crmfloat-ghs/backup.sh << EOF
#!/bin/bash
tar -czf /backup/app/crmfloat-ghs-$(date +%Y%m%d).tar.gz /opt/crmfloat-ghs
find /backup/app -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /opt/crmfloat-ghs/backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /opt/crmfloat-ghs/backup.sh
```

## 🚀 **Deployment Checklist**

### **Pre-Deployment:**
- [ ] Server provisioned and configured
- [ ] Domain registered and DNS configured
- [ ] SSL certificate obtained
- [ ] Database installed and configured
- [ ] Environment variables prepared

### **Deployment:**
- [ ] Application deployed
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Database connected
- [ ] Application started

### **Post-Deployment:**
- [ ] SSL certificate configured
- [ ] Reverse proxy configured
- [ ] Firewall configured
- [ ] Monitoring set up
- [ ] Backup configured
- [ ] Health checks working

### **Testing:**
- [ ] Application accessible via domain
- [ ] Login functionality working
- [ ] All GHS features functional
- [ ] Database operations working
- [ ] File uploads working
- [ ] Email notifications working

## 📞 **Support & Troubleshooting**

### **Common Issues:**

**1. Application won't start:**
```bash
# Check logs
pm2 logs crmfloat-ghs

# Check environment variables
cat .env

# Restart application
pm2 restart crmfloat-ghs
```

**2. Database connection issues:**
```bash
# Test database connection
mongo crmfloat_ghs
# or
psql crmfloat_ghs

# Check connection string
echo $MONGODB_URI
```

**3. SSL certificate issues:**
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

### **Getting Help:**
- **Documentation:** Check `docs/` folder
- **Issues:** GitHub Issues
- **Support:** Contact development team

---

## 🎉 **Congratulations!**

Your GHS Interior Design CRM is now deployed and ready to use!

**Access your CRM:**
- **URL:** https://ghs.crmfloat.io
- **Login:** admin@ghs.crmfloat.io
- **Password:** admin123

**GHS Features Available:**
- ✅ 11-Stage Design Pipeline
- ✅ Designer Management
- ✅ Property Tracking
- ✅ Site Visit Scheduling
- ✅ Warranty Management
- ✅ Material Library
- ✅ Vendor Coordination
- ✅ Custom Branding

---

© 2024 CRMFloat - GHS Customization. All rights reserved.
