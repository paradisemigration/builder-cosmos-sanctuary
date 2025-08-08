# 🚀 TheVisaBay.com Deployment Guide

Complete step-by-step guide to deploy your application to thevisabay.com domain.

## Prerequisites

1. **Fly.io Account**: Create account at https://fly.io
2. **Domain Access**: Access to thevisabay.com DNS settings
3. **Environment Variables**: Prepare your production secrets

## Step 1: Install Fly CLI

```bash
# macOS
brew install flyctl

# Linux/WSL
curl -L https://fly.io/install.sh | sh

# Windows
iwr https://fly.io/install.ps1 -useb | iex
```

## Step 2: Authenticate with Fly.io

```bash
fly auth login
```

## Step 3: Build and Deploy

```bash
# 1. Build the application
npm run build

# 2. Create Fly app (if not exists)
fly apps create thevisabay --generate-name=false

# 3. Create persistent volume for database
fly volumes create thevisabay_data --size 3 --region sin

# 4. Set environment variables
fly secrets set NODE_ENV=production
fly secrets set SESSION_SECRET="your-secure-random-string-here"
fly secrets set GOOGLE_PLACES_API_KEY="your-google-places-api-key"

# 5. Deploy to Fly.io
fly deploy
```

## Step 4: Configure Custom Domain

### A. Add Domain to Fly.io

```bash
# Add your custom domain
fly certs create thevisabay.com

# Add www subdomain
fly certs create www.thevisabay.com
```

### B. Update DNS Settings

In your domain registrar (GoDaddy, Namecheap, etc.), add these records:

```dns
# A Records
A     @              66.241.124.64
A     www            66.241.124.64

# AAAA Records (IPv6)
AAAA  @              2a09:8280:1::4:20ac
AAAA  www            2a09:8280:1::4:20ac

# CNAME for verification (if required)
CNAME _acme-challenge.thevisabay.com    thevisabay.com.flydns.net
```

### C. Verify Domain

```bash
# Check certificate status
fly certs show thevisabay.com

# Check domain resolution
fly certs check thevisabay.com
```

## Step 5: Production Environment Setup

### Environment Variables Checklist

```bash
# Required
fly secrets set NODE_ENV=production
fly secrets set PORT=8080
fly secrets set DOMAIN=thevisabay.com
fly secrets set APP_URL=https://thevisabay.com

# Security
fly secrets set SESSION_SECRET="$(openssl rand -base64 32)"

# Optional Services
fly secrets set GOOGLE_PLACES_API_KEY="your-api-key"
fly secrets set SMTP_HOST="smtp.gmail.com"
fly secrets set SMTP_USER="your-email@gmail.com"
fly secrets set SMTP_PASS="your-app-password"

# Backup
fly secrets set BACKUP_ENABLED=true
```

## Step 6: Database Migration

```bash
# Connect to your app
fly ssh console

# Inside the container:
cd /app
ls -la dist/server/

# Verify database exists
sqlite3 dist/server/visaconsult.db ".tables"
```

## Step 7: Monitor Deployment

### Check Application Status

```bash
# View app status
fly status

# View logs
fly logs

# Check health
curl https://thevisabay.com/api/health
```

### Expected Health Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "service": "TheVisaBay.com",
  "uptime": 3600,
  "version": "1.0.0"
}
```

## Step 8: SSL Certificate Verification

### Check HTTPS

1. Visit https://thevisabay.com
2. Verify SSL certificate is valid
3. Check automatic HTTP → HTTPS redirect

### SSL Troubleshooting

```bash
# Force certificate renewal
fly certs show thevisabay.com

# If stuck in "pending", check DNS
dig A thevisabay.com
dig AAAA thevisabay.com
```

## Step 9: Performance Optimization

### Enable Caching

```bash
# In fly.toml, add:
[env]
  CACHE_CONTROL="max-age=31536000"
```

### Monitor Performance

```bash
# Check response times
fly logs --app thevisabay

# Monitor metrics
fly dashboard thevisabay
```

## Step 10: Backup Strategy

### Database Backup

```bash
# Automated backup (if configured)
fly ssh console
cd /app && node scripts/create-backup.js
```

### Code Backup

```bash
# Always backup your code to Git
git push origin main

# Tag releases
git tag -a v1.0.0 -m "Production Release"
git push origin v1.0.0
```

## Troubleshooting

### Common Issues

1. **Domain not resolving**
   - Check DNS propagation: https://dnschecker.org
   - Verify A/AAAA records point to Fly.io IPs

2. **SSL Certificate issues**
   ```bash
   fly certs show thevisabay.com
   # If "failed", check DNS and wait 24-48 hours
   ```

3. **App not starting**
   ```bash
   fly logs
   # Check for missing environment variables or build issues
   ```

4. **Database not found**
   ```bash
   fly ssh console
   ls -la /data/
   ls -la dist/server/
   # Ensure database was copied during build
   ```

### Emergency Rollback

```bash
# Rollback to previous release
fly releases

# Deploy specific release
fly deploy --image thevisabay:v1.0.0
```

## Success Checklist

- [ ] Domain resolves to your app
- [ ] HTTPS certificate is valid
- [ ] Health endpoint returns 200
- [ ] Main pages load correctly
- [ ] Database queries work
- [ ] Search functionality works
- [ ] Images load properly
- [ ] Admin panel accessible

## Post-Deployment

### Monitoring Setup

1. **Error Tracking**: Consider adding Sentry
2. **Uptime Monitoring**: Set up status page
3. **Analytics**: Add Google Analytics
4. **Performance**: Monitor Core Web Vitals

### Regular Maintenance

1. **Security Updates**: Monthly dependency updates
2. **Database Backups**: Weekly automated backups
3. **Performance Monitoring**: Weekly metrics review
4. **SSL Renewal**: Automatic with Fly.io

---

🎉 **Congratulations!** Your TheVisaBay.com is now live in production!

Visit: https://thevisabay.com

For support: contact your development team or Fly.io support.
