# Render Deployment Configuration

## AWS Environment Variables for Render

Add these exact environment variables in your Render dashboard:

```
AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO
AWS_SECRET_ACCESS_KEY=yWGu4E12n/OtJXk3zn4YTdMMGV24A3teg1hkZVpn
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=visaconsult-images
PORT=3010
GOOGLE_PLACES_API_KEY=AIzaSyCLdVuLJI-sCmDe8dcQ5i8R_3rxWTzmxl8
NODE_ENV=production
```

## Fix Render Build Issue

The Rollup error is caused by missing server build config. Update package.json:

1. **Build Command**: `npm install && npm run build:client`
2. **Start Command**: `npm run prod`

## Render Service Settings

- **Environment**: Node.js
- **Node Version**: 18
- **Build Command**: `npm install && npm run build:client`
- **Start Command**: `npm run prod`
- **Auto-Deploy**: Yes

## Custom Domain Setup

After deployment:

1. Go to Settings → Custom Domains
2. Add: `thevisabay.com` and `www.thevisabay.com`
3. Update DNS records at your domain provider:
   - A record: `@` → Render IP
   - CNAME record: `www` → your-app.onrender.com

## Test After Deployment

1. Browse page: Check business listings load
2. Image uploads: Test consultant image uploads
3. Search functionality: Verify search works
4. Custom domain: Test both www and non-www

Your app will work perfectly on Render with AWS S3 image storage!
