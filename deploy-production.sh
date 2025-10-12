#!/bin/bash

# Production Deployment Script
echo "🚀 Deploying to Production (Railway)..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📋 Uncommitted changes detected. Adding all changes..."
    git add .
    
    echo "💬 Please enter a commit message:"
    read -r commit_message
    
    if [ -z "$commit_message" ]; then
        commit_message="Update CRM application"
    fi
    
    git commit -m "$commit_message"
fi

# Push to GitHub (which triggers Railway deployment)
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Deployment initiated!"
echo "🔍 Check your Railway dashboard for deployment status"
echo "🌐 Your app will be available at your Railway domain once deployed"


