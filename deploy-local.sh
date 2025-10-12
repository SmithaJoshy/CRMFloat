#!/bin/bash

# Local Development Deployment Script
echo "🚀 Starting Local Development Environment..."

# Kill any existing server processes
echo "📋 Stopping any existing servers..."
pkill -f "node server-mock-v2.js" 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build frontend
echo "🔨 Building React frontend..."
npm run build

# Start development server
echo "🌟 Starting development server on port 3002..."
echo "📍 Application URL: http://localhost:3002"
echo "🔑 Login: admin@designpipeline.com / admin123"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev


