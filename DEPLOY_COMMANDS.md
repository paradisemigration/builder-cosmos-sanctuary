# 🚀 Quick Deployment Commands for TheVisaBay.com

## 1. Build the Application

```bash
# Build client (React app)
npm run build:client

# Build server (Node.js API)
npm run build:server

# Copy database
npm run copy:database

# Or build everything at once
npm run build
```

## 2. Fly.io Setup & Deployment

```bash
# Install Fly CLI (if not installed)
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login

# Create app (replace 'thevisabay' with your preferred name)
fly apps create thevisabay

# Create persistent volume for database
fly volumes create thevisabay_data --size 3 --region sin

# Set environment variables
fly secrets set NODE_ENV=production
fly secrets set SESSION_SECRET="$(openssl rand -base64 32)"
fly secrets set DOMAIN=thevisabay.com
fly secrets set APP_URL=https://thevisabay.com

# Deploy
fly deploy

# Add custom domain
fly certs create thevisabay.com
fly certs create www.thevisabay.com
```

## 3. DNS Configuration

Add these records to your domain registrar:

```
Type    Name    Value               TTL
A       @       66.241.124.64       300
A       www     66.241.124.64       300
AAAA    @       2a09:8280:1::4:20ac 300
AAAA    www     2a09:8280:1::4:20ac 300
```

## 4. Verify Deployment

```bash
# Check app status
fly status

# View logs
fly logs

# Check SSL certificates
fly certs show thevisabay.com

# Test health endpoint
curl https://thevisabay.com/api/health
```

## 5. Alternative: Vercel Deployment

If you prefer Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add domain
vercel domains add thevisabay.com
```

## Ready-to-Run Commands (Copy & Paste)

```bash
# Complete deployment in one go
npm run build && \
fly deploy && \
fly certs create thevisabay.com && \
echo "✅ Deployment complete! Check https://thevisabay.com"
```

## Environment Variables Template

```bash
# Copy these and update with your values
fly secrets set NODE_ENV=production
fly secrets set SESSION_SECRET="your-secure-32-char-string"
fly secrets set GOOGLE_PLACES_API_KEY="your-google-api-key"
fly secrets set DOMAIN=thevisabay.com
fly secrets set APP_URL=https://thevisabay.com
```

## Success Checklist

- [ ] `npm run build` completes successfully
- [ ] `fly deploy` shows "Deployment successful"
- [ ] `fly certs show thevisabay.com` shows "issued"
- [ ] https://thevisabay.com loads your app
- [ ] https://thevisabay.com/api/health returns 200
