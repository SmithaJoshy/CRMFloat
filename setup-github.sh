#!/bin/bash

# 🚀 GitHub Setup Helper Script
# This script helps you connect your local repository to GitHub

echo "🚀 GitHub Setup Helper"
echo "====================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    echo "Please run this script from your CRM project directory"
    exit 1
fi

echo "✅ Found git repository"
echo ""

# Check if remote is already configured
if git remote -v | grep -q "origin"; then
    echo "✅ Remote repository already configured"
    echo ""
    echo "Current remotes:"
    git remote -v
    echo ""
    echo "To push your code:"
    echo "git push origin main"
    echo ""
else
    echo "📋 GitHub Repository Setup Required"
    echo "=================================="
    echo ""
    echo "1. Go to https://github.com and create a new repository"
    echo "2. Name it: design-pipeline-crm (or your preferred name)"
    echo "3. Make it Private (recommended for business)"
    echo "4. Don't initialize with README (we already have one)"
    echo "5. Click 'Create repository'"
    echo ""
    echo "After creating the repository, GitHub will show you setup commands."
    echo "Run these commands in your terminal:"
    echo ""
    echo "git remote add origin https://github.com/YOUR_USERNAME/design-pipeline-crm.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    echo ""
    echo "Replace YOUR_USERNAME with your actual GitHub username"
    echo ""
fi

echo "📋 What's Ready to Push:"
echo "========================"
echo "✅ Complete CRM system"
echo "✅ All frontend pages and components"
echo "✅ Backend server with API endpoints"
echo "✅ Deployment configurations"
echo "✅ Team README and documentation"
echo "✅ Login credentials: admin@designpipeline.com / admin123"
echo ""

echo "🎯 After pushing to GitHub:"
echo "==========================="
echo "1. Deploy backend to Railway (see DEPLOYMENT.md)"
echo "2. Deploy frontend to Vercel (see DEPLOYMENT.md)"
echo "3. Share README.md with your team"
echo "4. Team can start using the CRM immediately"
echo ""

echo "📖 For detailed instructions, see:"
echo "- README.md (for your team)"
echo "- DEPLOYMENT.md (for deployment)"
echo "- GITHUB_SETUP.md (for GitHub setup)"
echo ""

echo "🚀 Happy coding!"
