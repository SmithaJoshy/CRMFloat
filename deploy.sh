#!/bin/bash

# 🚀 CRM Application Deployment Script
# This script helps you deploy your CRM application

echo "🚀 CRM Application Deployment Helper"
echo "====================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "server-mock-v2.js" ]; then
    echo "❌ Error: Please run this script from the CRM project root directory"
    exit 1
fi

echo "✅ Found CRM project files"
echo ""

# Check if Railway CLI is installed
if command -v railway &> /dev/null; then
    echo "✅ Railway CLI is installed"
    echo ""
    echo "🚀 Ready to deploy to Railway!"
    echo ""
    echo "Next steps:"
    echo "1. Run: railway login"
    echo "2. Run: railway init"
    echo "3. Run: railway up"
    echo ""
else
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
    echo ""
    echo "🚀 Ready to deploy to Railway!"
    echo ""
    echo "Next steps:"
    echo "1. Run: railway login"
    echo "2. Run: railway init"
    echo "3. Run: railway up"
    echo ""
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI is installed"
    echo ""
    echo "🌐 Ready to deploy frontend to Vercel!"
    echo ""
    echo "Next steps:"
    echo "1. Run: cd client"
    echo "2. Run: vercel --prod"
    echo ""
else
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
    echo ""
    echo "🌐 Ready to deploy frontend to Vercel!"
    echo ""
    echo "Next steps:"
    echo "1. Run: cd client"
    echo "2. Run: vercel --prod"
    echo ""
fi

echo "📋 Deployment Checklist:"
echo "========================"
echo "✅ Backend: Railway (server-mock-v2.js)"
echo "✅ Frontend: Vercel (client/build)"
echo "✅ Environment: Configured for production"
echo "✅ Health Check: /api/health endpoint added"
echo ""
echo "🎯 Your team will be able to access the CRM at:"
echo "   Frontend URL: (Vercel deployment URL)"
echo "   Login: admin@designpipeline.com / admin123"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🚀 Happy deploying!"
