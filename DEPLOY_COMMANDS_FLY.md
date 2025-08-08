# Fly.io Deployment Commands

Execute these commands in order to deploy your application to Fly.io:

## 1. Install Fly.io CLI (if not installed)
```bash
# macOS
brew install flyctl

# Linux/WSL
curl -L https://fly.io/install.sh | sh

# Windows
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

## 2. Login to Fly.io
```bash
flyctl auth login
```

## 3. Create Volume for Database Storage
```bash
flyctl volumes create thevisabay_data --region sin --size 3 --app thevisabay
```

## 4. Set Environment Variables
```bash
flyctl secrets set NODE_ENV=production --app thevisabay
flyctl secrets set PORT=8080 --app thevisabay
```

## 5. Deploy Application
```bash
# Build the application first
npm run build

# Deploy to Fly.io
flyctl deploy --app thevisabay
```

## 6. Check Deployment Status
```bash
flyctl status --app thevisabay
flyctl logs --app thevisabay
```

## 7. Open Your Application
```bash
flyctl open --app thevisabay
```

## Your App Configuration
- **App Name**: thevisabay
- **Region**: Singapore (sin)
- **URL**: https://thevisabay.fly.dev
- **Memory**: 1GB
- **Storage**: 3GB persistent volume
- **Database**: SQLite with 1,572+ businesses

## Troubleshooting Commands
```bash
# View recent logs
flyctl logs --app thevisabay

# SSH into the app
flyctl ssh console --app thevisabay

# Check app status
flyctl status --app thevisabay

# Restart app
flyctl apps restart thevisabay
```

## Next Steps After Deployment
1. Test all functionality on the live site
2. Set up custom domain (if needed)
3. Monitor performance and logs
4. Set up automatic deployments (optional)

Your application is ready to deploy! The configuration files are already set up correctly.
