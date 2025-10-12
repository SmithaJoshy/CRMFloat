# 🚀 Deployment Guide

## Local Development

### Quick Start (Recommended)
```bash
# Install dependencies and build
npm run install-all

# Start local development server (port 3002)
npm run dev
```

### Alternative Commands
```bash
# Local development with specific port
npm run local

# Build and run locally
npm run dev:build
```

### Local URLs
- **Application:** http://localhost:3002
- **API Health:** http://localhost:3002/api/health
- **Login:** admin@designpipeline.com / admin123

---

## Production Deployment (Railway)

### Automatic Deployment
1. Push changes to GitHub main branch
2. Railway automatically detects changes and deploys
3. Monitor deployment in Railway dashboard

### Manual Deployment
```bash
# Build for production
npm run build

# Test production build locally
npm run production
```

### Railway Configuration
- **Port:** Automatically assigned by Railway
- **Environment:** Production
- **Health Check:** `/api/health`
- **Build Command:** `npm run install-all && npm run build`
- **Start Command:** `NODE_ENV=production node server-mock-v2.js`

---

## Environment Variables

### Local Development (.env.local)
```env
NODE_ENV=development
PORT=3002
REACT_APP_API_URL=/api
JWT_SECRET=dev-super-secret-jwt-key-for-local-development
```

### Production (Railway Environment Variables)
```env
NODE_ENV=production
PORT=8081
REACT_APP_API_URL=/api
JWT_SECRET=your-production-jwt-secret
```

---

## Switching Between Environments

### From Local to Production
1. Commit and push changes: `git add . && git commit -m "Update" && git push origin main`
2. Railway automatically deploys
3. Check Railway dashboard for deployment status

### From Production to Local
1. Pull latest changes: `git pull origin main`
2. Install dependencies: `npm run install-all`
3. Start locally: `npm run dev`

---

## Troubleshooting

### Local Development Issues
- **Port conflicts:** Use `npm run local` for port 3002
- **Build issues:** Run `npm run build` first
- **API not working:** Check if server is running on correct port

### Production Deployment Issues
- **Build failures:** Check Railway logs for specific errors
- **Health check failures:** Verify `/api/health` endpoint
- **Static files not serving:** Ensure `client/build` exists

---

## File Structure
```
├── server-mock-v2.js          # Main server file
├── client/                    # React frontend
│   ├── build/                # Production build (auto-generated)
│   ├── src/                  # Source code
│   └── package.json          # Frontend dependencies
├── package.json              # Root dependencies and scripts
├── railway.json              # Railway deployment config
├── Procfile                  # Alternative deployment config
└── .railwayignore            # Files to ignore in deployment
```