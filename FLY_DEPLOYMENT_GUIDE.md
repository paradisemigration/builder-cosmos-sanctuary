# Complete Fly.io Deployment Guide

## Step-by-Step Deployment Process

### Prerequisites
1. **Install Fly.io CLI**
   ```bash
   # On macOS
   brew install flyctl
   
   # On Linux/WSL
   curl -L https://fly.io/install.sh | sh
   
   # On Windows
   pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login to Fly.io**
   ```bash
   flyctl auth login
   ```

### Current Project Status
✅ **App Name**: `thevisabay`  
✅ **Region**: `sin` (Singapore)  
✅ **Configuration**: `fly.toml` ready  
✅ **Dockerfile**: Configured  
✅ **Database**: SQLite with persistent storage  
✅ **Domain**: Custom domain configuration ready  

### Deployment Steps

#### Step 1: Create Volume for Database
```bash
flyctl volumes create thevisabay_data --region sin --size 3
```

#### Step 2: Set Environment Variables
```bash
flyctl secrets set NODE_ENV=production
flyctl secrets set PORT=8080
```

#### Step 3: Deploy Application
```bash
# Build and deploy
npm run build
flyctl deploy

# Or use the package.json script
npm run deploy:fly
```

#### Step 4: Check Deployment Status
```bash
flyctl status
flyctl logs
```

#### Step 5: Open Application
```bash
flyctl open
```

### Current Configuration Details

**Fly.toml Settings:**
- **App**: thevisabay
- **Region**: sin (Singapore)
- **Memory**: 1GB
- **CPU**: 1 shared CPU
- **Port**: 8080
- **Auto-scaling**: Enabled
- **Health checks**: Configured at `/api/health`
- **Persistent storage**: `/data` volume

**Database:**
- SQLite with persistent volume
- 1,572 businesses
- 7,707 reviews  
- 1,926 images

### Troubleshooting

**Common Issues:**
1. **Build failures**: Check Dockerfile and dependencies
2. **Database not found**: Ensure volume is mounted
3. **Health check fails**: Verify `/api/health` endpoint

**Debug Commands:**
```bash
flyctl logs --app thevisabay
flyctl ssh console --app thevisabay
flyctl status --app thevisabay
```

### Post-Deployment

1. **Custom Domain** (if needed):
   ```bash
   flyctl certs create yourdomain.com
   flyctl certs create www.yourdomain.com
   ```

2. **SSL Certificate**: Automatically managed by Fly.io

3. **Monitoring**: Available in Fly.io dashboard

## Ready to Deploy!

Your application is configured and ready for Fly.io deployment with:
- ✅ Production-ready configuration
- ✅ Persistent database storage
- ✅ Health monitoring
- ✅ Auto-scaling capabilities
- ✅ HTTPS/SSL enabled
