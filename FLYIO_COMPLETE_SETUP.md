# 🚀 Complete Fly.io Setup Guide

## Current Status ✅
Your app is **ALREADY WORKING** at:
**https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/**

## Step 1: Install Fly CLI
```bash
# Install Fly CLI (if not already installed)
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
fly auth login
```

## Step 2: Find Your App Name
```bash
# List all your apps
fly apps list

# You should see your app name (likely "thevisabay" or similar)
```

## Step 3: Add AWS Credentials (Fix Image Uploads)
Replace `YOUR_APP_NAME` with your actual app name from Step 2:

```bash
# Add AWS S3 credentials for image uploads
fly secrets set AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO --app YOUR_APP_NAME
fly secrets set AWS_SECRET_ACCESS_KEY=yWGu4E12n/OtJXk3zn4YTdMMGV24A3teg1hkZVpn --app YOUR_APP_NAME
fly secrets set AWS_REGION=us-east-1 --app YOUR_APP_NAME
fly secrets set AWS_S3_BUCKET_NAME=visaconsult-images --app YOUR_APP_NAME

# Add Google Places API key
fly secrets set GOOGLE_PLACES_API_KEY=AIzaSyCLdVuLJI-sCmDe8dcQ5i8R_3rxWTzmxl8 --app YOUR_APP_NAME
```

## Step 4: Add Custom Domain
```bash
# Add your domain
fly certs create thevisabay.com --app YOUR_APP_NAME
fly certs create www.thevisabay.com --app YOUR_APP_NAME

# Check certificate status
fly certs list --app YOUR_APP_NAME
```

## Step 5: Configure DNS Records
Go to your domain registrar (GoDaddy, Namecheap, etc.) and add these DNS records:

### DNS Records to Add:
```
Type: A
Name: @
Value: 66.241.125.44
TTL: 3600

Type: A  
Name: www
Value: 66.241.125.44
TTL: 3600
```

## Step 6: Verify Setup
```bash
# Check app status
fly status --app YOUR_APP_NAME

# Check logs
fly logs --app YOUR_APP_NAME

# Check secrets (will show names only, not values)
fly secrets list --app YOUR_APP_NAME
```

## Step 7: Test Everything
1. **Current working URL**: https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/
2. **Test image uploads**: Go to Admin Panel → Add consultant → Upload image
3. **Wait for DNS**: Your custom domain may take 5-30 minutes to work
4. **Test custom domain**: https://thevisabay.com and https://www.thevisabay.com

## Expected Results ✅
- ✅ App working at Fly.io URL
- ✅ Image uploads working (after AWS secrets)
- ✅ Custom domain working (after DNS propagation)
- ✅ SSL certificates auto-generated
- ✅ All 1,572+ consultants visible
- ✅ All features working

## Troubleshooting
If domain doesn't work after 30 minutes:
```bash
# Check certificate status
fly certs show thevisabay.com --app YOUR_APP_NAME

# If issues, try:
fly certs add thevisabay.com --app YOUR_APP_NAME
```

## Your AWS Credentials (for reference)
```
AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO
AWS_SECRET_ACCESS_KEY=yWGu4E12n/OtJXk3zn4YTdMMGV24A3teg1hkZVpn
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=visaconsult-images
```

**Your app is already perfect - just needs AWS secrets and domain setup!**
