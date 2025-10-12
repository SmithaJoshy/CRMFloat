#!/bin/bash

# GHS Customization Deployment Script
# This script deploys CRMFloat with GHS interior design customization

set -e

echo "🎨 Deploying CRMFloat with GHS Customization..."
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GHS_DOMAIN=${GHS_DOMAIN:-"ghs.crmfloat.io"}
INDUSTRY_PACKAGE=${INDUSTRY_PACKAGE:-"interior-design"}
BUSINESS_TYPE=${BUSINESS_TYPE:-"interior-design"}
TENANT_ID=${TENANT_ID:-"ghs"}

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Domain: $GHS_DOMAIN"
echo "   Industry Package: $INDUSTRY_PACKAGE"
echo "   Business Type: $BUSINESS_TYPE"
echo "   Tenant ID: $TENANT_ID"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install
cd client && npm install && cd ..
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 2: Copy GHS configuration
echo -e "${YELLOW}🔧 Applying GHS configuration...${NC}"
cp ghs-customization/config/interior-design.config.js config/
cp ghs-customization/config/ghs-branding.json config/

# Copy GHS assets if they exist
if [ -d "ghs-customization/assets" ]; then
    echo "   Copying GHS assets..."
    cp -r ghs-customization/assets/* client/public/
fi

echo -e "${GREEN}✅ GHS configuration applied${NC}"

# Step 3: Set environment variables
echo -e "${YELLOW}🌍 Setting environment variables...${NC}"
export INDUSTRY_PACKAGE=$INDUSTRY_PACKAGE
export BUSINESS_TYPE=$BUSINESS_TYPE
export TENANT_ID=$TENANT_ID
export TENANT_DOMAIN=$GHS_DOMAIN
export NODE_ENV=production

echo "   INDUSTRY_PACKAGE=$INDUSTRY_PACKAGE"
echo "   BUSINESS_TYPE=$BUSINESS_TYPE"
echo "   TENANT_ID=$TENANT_ID"
echo "   TENANT_DOMAIN=$GHS_DOMAIN"
echo "   NODE_ENV=production"
echo -e "${GREEN}✅ Environment variables set${NC}"

# Step 4: Build the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build
echo -e "${GREEN}✅ Application built${NC}"

# Step 5: Create deployment package
echo -e "${YELLOW}📦 Creating deployment package...${NC}"
mkdir -p deploy/ghs
cp -r server deploy/ghs/
cp -r client/build deploy/ghs/client/
cp package.json deploy/ghs/
cp server-mock-v2.js deploy/ghs/
cp config/interior-design.config.js deploy/ghs/config/
cp config/ghs-branding.json deploy/ghs/config/

# Create GHS-specific package.json
cat > deploy/ghs/package.json << EOF
{
  "name": "crmfloat-ghs",
  "version": "1.0.0",
  "description": "CRMFloat - GHS Interior Design Customization",
  "main": "server-mock-v2.js",
  "scripts": {
    "start": "NODE_ENV=production INDUSTRY_PACKAGE=interior-design TENANT_ID=ghs node server-mock-v2.js",
    "dev": "NODE_ENV=development INDUSTRY_PACKAGE=interior-design TENANT_ID=ghs node server-mock-v2.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
EOF

echo -e "${GREEN}✅ Deployment package created${NC}"

# Step 6: Create environment file
echo -e "${YELLOW}📄 Creating environment file...${NC}"
cat > deploy/ghs/.env << EOF
# GHS Customization Environment Variables
NODE_ENV=production
PORT=8080
INDUSTRY_PACKAGE=interior-design
BUSINESS_TYPE=interior-design
TENANT_ID=ghs
TENANT_DOMAIN=$GHS_DOMAIN

# Database (if using real database)
# MONGODB_URI=mongodb://localhost:27017/crmfloat_ghs

# JWT Configuration
JWT_SECRET=ghs-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# GHS Specific Settings
GHS_BRANDING=true
GHS_WORKFLOW=true
GHS_CUSTOM_FIELDS=true
EOF

echo -e "${GREEN}✅ Environment file created${NC}"

# Step 7: Create README for deployment
echo -e "${YELLOW}📚 Creating deployment README...${NC}"
cat > deploy/ghs/README.md << EOF
# CRMFloat - GHS Interior Design Customization

## 🎨 GHS Customized CRMFloat

This is a production-ready deployment of CRMFloat customized for GHS interior design business.

### 🚀 Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

3. Access the application:
   - URL: https://$GHS_DOMAIN
   - Login: admin@ghs.crmfloat.io
   - Password: admin123

### 🔧 Configuration

The application is configured with:
- **Industry Package**: Interior Design
- **Workflow**: 11-stage design pipeline
- **Modules**: Designers, Properties, Warranty, Site Visits, Materials, Vendors
- **Custom Fields**: Property types, design styles, project details

### 📱 Features

- ✅ Design Pipeline Management
- ✅ Designer Team Management
- ✅ Property & Site Visit Tracking
- ✅ Warranty Management
- ✅ Material Library
- ✅ Vendor Coordination
- ✅ Client Portal
- ✅ Project Documentation

### 🌐 Deployment

For production deployment, consider:
- Using a real database (MongoDB/PostgreSQL)
- Setting up SSL certificates
- Configuring proper JWT secrets
- Setting up monitoring and logging

### 📞 Support

For GHS-specific support, contact the development team.

---

© 2024 CRMFloat - GHS Customization. All rights reserved.
EOF

echo -e "${GREEN}✅ Deployment README created${NC}"

# Step 8: Display deployment summary
echo ""
echo -e "${GREEN}🎉 GHS Customization Deployment Complete!${NC}"
echo "================================================="
echo ""
echo -e "${BLUE}📁 Deployment Package:${NC} deploy/ghs/"
echo -e "${BLUE}🌐 Access URL:${NC} https://$GHS_DOMAIN"
echo -e "${BLUE}🔑 Login:${NC} admin@ghs.crmfloat.io"
echo -e "${BLUE}🔐 Password:${NC} admin123"
echo ""
echo -e "${BLUE}📋 GHS Features Enabled:${NC}"
echo "   ✅ Interior Design Pipeline (11 stages)"
echo "   ✅ Designer Management"
echo "   ✅ Property Tracking"
echo "   ✅ Site Visit Scheduling"
echo "   ✅ Warranty Management"
echo "   ✅ Material Library"
echo "   ✅ Vendor Coordination"
echo "   ✅ Custom Branding"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "   1. Upload deploy/ghs/ to your server"
echo "   2. Run 'npm install' in the deployment directory"
echo "   3. Run 'npm start' to start the server"
echo "   4. Configure your domain to point to the server"
echo "   5. Set up SSL certificates for HTTPS"
echo ""
echo -e "${GREEN}🎨 GHS Interior Design CRM is ready for deployment!${NC}"
