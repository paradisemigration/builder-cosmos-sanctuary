# 🚀 Create Fly.io App "thevisabay"

## Issue

❌ **Error**: Could not find App "thevisabay"  
✅ **Solution**: Create the app first, then deploy

## Step 1: Create the App

```bash
flyctl apps create thevisabay --org personal
```

## Step 2: Create Volume for Database

```bash
flyctl volumes create thevisabay_data --region sin --size 3 --app thevisabay
```

## Step 3: Set Environment Variables

```bash
flyctl secrets set NODE_ENV=production --app thevisabay
flyctl secrets set PORT=8080 --app thevisabay
```

## Step 4: Deploy

```bash
cd code
flyctl deploy --app thevisabay
```

## Alternative: Use Existing App

If you prefer to use your existing app, update fly.toml:

```toml
app = "a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e"
```

## Commands Summary

```bash
# Create app
flyctl apps create thevisabay --org personal

# Create volume
flyctl volumes create thevisabay_data --region sin --size 3 --app thevisabay

# Set secrets
flyctl secrets set NODE_ENV=production --app thevisabay
flyctl secrets set PORT=8080 --app thevisabay

# Deploy
cd code
flyctl deploy --app thevisabay
```

Your app will be available at: `https://thevisabay.fly.dev`
