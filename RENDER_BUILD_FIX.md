# Render Build Fix for Vite

## Problem

`vite: not found` - Render doesn't install devDependencies by default

## Solution

Update Render build settings:

**Build Command**: `npm install --include=dev && npm run build`
**Start Command**: `npm run prod`

## Environment Variables (Add these in Render dashboard)

```
AWS_ACCESS_KEY_ID=AKIAZ6UGK7KX2BFFZHGO
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=visaconsult-images
PORT=3010
GOOGLE_PLACES_API_KEY=AIzaSyCLdVuLJI-sCmDe8dcQ5i8R_3rxWTzmxl8
NODE_ENV=production
```

## Alternative Fix

Move vite to dependencies instead of devDependencies in package.json

The `--include=dev` flag ensures vite and other build tools are installed during deployment.
