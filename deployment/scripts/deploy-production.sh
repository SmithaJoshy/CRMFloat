#!/bin/bash

# Design Pipeline CRM - Production Deployment Script
# This script deploys the application to production environment

set -e  # Exit on any error

echo "🚀 Starting Design Pipeline CRM Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v mongod &> /dev/null && ! docker ps &> /dev/null; then
        print_warning "MongoDB is not installed locally and Docker is not available"
        print_warning "Please ensure MongoDB is accessible"
    fi
    
    print_success "Dependencies check completed"
}

# Check environment configuration
check_environment() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found, creating from template..."
        if [ -f "config.env.example" ]; then
            cp config.env.example .env
            print_warning "Please update .env file with your production values"
            print_warning "Especially: MONGODB_URI, JWT_SECRET, FRONTEND_URL"
            read -p "Press Enter to continue after updating .env file..."
        else
            print_error "config.env.example not found"
            exit 1
        fi
    fi
    
    print_success "Environment configuration checked"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install --production
    
    # Install server dependencies
    cd server
    npm install --production
    cd ..
    
    # Install and build client
    cd client
    npm install
    npm run build
    cd ..
    
    print_success "Dependencies installed successfully"
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if MongoDB is running
    if command -v mongod &> /dev/null; then
        if ! pgrep -x "mongod" > /dev/null; then
            print_warning "MongoDB is not running. Please start MongoDB service:"
            print_warning "sudo systemctl start mongod"
            read -p "Press Enter after starting MongoDB..."
        fi
    fi
    
    # Seed database if needed
    if [ "$1" = "--seed" ]; then
        print_status "Seeding database with sample data..."
        cd server
        npm run seed
        cd ..
        print_success "Database seeded successfully"
    fi
    
    print_success "Database setup completed"
}

# Start application with PM2
start_application() {
    print_status "Starting application with PM2..."
    
    # Install PM2 if not already installed
    if ! command -v pm2 &> /dev/null; then
        print_status "Installing PM2..."
        npm install -g pm2
    fi
    
    # Stop existing application if running
    pm2 stop design-pipeline-crm 2>/dev/null || true
    pm2 delete design-pipeline-crm 2>/dev/null || true
    
    # Start application
    pm2 start server/server.js --name design-pipeline-crm --env production
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    print_success "Application started with PM2"
}

# Setup Nginx (optional)
setup_nginx() {
    if [ "$1" = "--nginx" ]; then
        print_status "Setting up Nginx configuration..."
        
        if ! command -v nginx &> /dev/null; then
            print_warning "Nginx is not installed. Skipping Nginx setup."
            return
        fi
        
        # Create Nginx configuration
        sudo tee /etc/nginx/sites-available/design-pipeline-crm > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8081;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/design-pipeline-crm /etc/nginx/sites-enabled/
        
        # Test and reload Nginx
        sudo nginx -t && sudo systemctl reload nginx
        
        print_success "Nginx configuration completed"
    fi
}

# Setup SSL with Let's Encrypt (optional)
setup_ssl() {
    if [ "$1" = "--ssl" ]; then
        print_status "Setting up SSL with Let's Encrypt..."
        
        if ! command -v certbot &> /dev/null; then
            print_warning "Certbot is not installed. Please install certbot first."
            return
        fi
        
        read -p "Enter your domain name: " domain
        
        sudo certbot --nginx -d $domain
        
        print_success "SSL setup completed"
    fi
}

# Create systemd service (alternative to PM2)
create_systemd_service() {
    if [ "$1" = "--systemd" ]; then
        print_status "Creating systemd service..."
        
        sudo tee /etc/systemd/system/design-pipeline-crm.service > /dev/null <<EOF
[Unit]
Description=Design Pipeline CRM
After=network.target mongod.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
Environment=PORT=8081
ExecStart=/usr/bin/node server/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
        
        sudo systemctl daemon-reload
        sudo systemctl enable design-pipeline-crm
        sudo systemctl start design-pipeline-crm
        
        print_success "Systemd service created and started"
    fi
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    sleep 5  # Wait for application to start
    
    if curl -f http://localhost:8081/api/health > /dev/null 2>&1; then
        print_success "Application is healthy and responding"
    else
        print_error "Application health check failed"
        print_status "Checking application logs..."
        pm2 logs design-pipeline-crm --lines 20
        exit 1
    fi
}

# Main deployment function
main() {
    echo "🏗️  Design Pipeline CRM Production Deployment"
    echo "=============================================="
    
    check_dependencies
    check_environment
    install_dependencies
    setup_database "$@"
    
    # Choose deployment method
    if [[ "$*" == *"--systemd"* ]]; then
        create_systemd_service "$@"
    else
        start_application
    fi
    
    setup_nginx "$@"
    setup_ssl "$@"
    health_check
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your DNS to point to this server"
    echo "2. Configure your firewall (ports 80, 443, 8081)"
    echo "3. Set up monitoring and log rotation"
    echo "4. Configure automated backups"
    echo ""
    echo "🔗 Application URLs:"
    echo "   - Application: http://localhost:8081"
    echo "   - Health Check: http://localhost:8081/api/health"
    echo ""
    echo "📊 Management Commands:"
    echo "   - View logs: pm2 logs design-pipeline-crm"
    echo "   - Restart: pm2 restart design-pipeline-crm"
    echo "   - Status: pm2 status"
    echo "   - Stop: pm2 stop design-pipeline-crm"
}

# Show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --seed      Seed database with sample data"
    echo "  --nginx     Setup Nginx reverse proxy"
    echo "  --ssl       Setup SSL with Let's Encrypt"
    echo "  --systemd   Use systemd instead of PM2"
    echo "  --help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Basic deployment with PM2"
    echo "  $0 --seed             # Deploy with sample data"
    echo "  $0 --nginx --ssl      # Deploy with Nginx and SSL"
    echo "  $0 --systemd --seed   # Deploy with systemd and sample data"
}

# Parse command line arguments
case "$1" in
    --help|-h)
        show_help
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
