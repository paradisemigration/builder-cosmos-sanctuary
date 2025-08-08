# 🌐 Custom Domain Setup for TheVisaBay

## Current Status
✅ **Your app is working**: `https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev/`

## Option 1: Add Domain to Existing App (Recommended)
Since your app is already working perfectly, add a custom domain to it:

### Step 1: Add SSL Certificate
```bash
# Replace yourdomain.com with your actual domain
flyctl certs create yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e

# If you want www subdomain too
flyctl certs create www.yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

### Step 2: Get DNS Configuration
```bash
flyctl certs show yourdomain.com --app a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e
```

### Step 3: Configure DNS Records
Add these DNS records to your domain registrar:

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: [IP from flyctl certs show]
TTL: 300
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev
TTL: 300
```

## Option 2: Deploy New App Without Volume
If you want to create the new "thevisabay-app":

### Step 1: Deploy Without Volume
```bash
# The fly.toml has been updated to comment out the volume mount
flyctl deploy --app thevisabay-app
```

### Step 2: Add Custom Domain
```bash
flyctl certs create yourdomain.com --app thevisabay-app
flyctl certs create www.yourdomain.com --app thevisabay-app
```

## Volume Workaround
I've commented out the volume mount in fly.toml. This allows deployment without capacity issues. The database will be stored in the container (non-persistent), which is fine for testing.

To re-enable persistent storage later:
```toml
[[mounts]]
source = "thevisabay_data"
destination = "/data"
```

## Deploy Commands

### Without Volume (Bypasses Capacity Issues)
```bash
cd code
flyctl deploy --app thevisabay-app
```

### Add Domain After Deployment
```bash
# Add SSL certificate
flyctl certs create yourdomain.com --app thevisabay-app

# Check certificate status
flyctl certs list --app thevisabay-app

# Get DNS instructions
flyctl certs show yourdomain.com --app thevisabay-app
```

## DNS Configuration Example
If your domain is `thevisabay.com`:

```bash
# Create certificates
flyctl certs create thevisabay.com --app thevisabay-app
flyctl certs create www.thevisabay.com --app thevisabay-app

# Add DNS records at your registrar:
# A record: @ → [Fly.io IP]
# CNAME record: www → thevisabay-app.fly.dev
```

## Verification
After DNS propagation (5-60 minutes):
- Visit `https://yourdomain.com`
- Check SSL certificate is valid
- Verify all features work

Your app will be accessible via your custom domain! 🚀
