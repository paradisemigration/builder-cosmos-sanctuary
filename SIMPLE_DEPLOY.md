# 🚀 Simple Fly.io Deployment Guide

## Your Simple Dockerfile Fix

Good approach! I've created an improved version that fixes the key issues:

### Issues Fixed

1. ✅ **Port**: Changed from 3000 to 8080 (required for Fly.io)
2. ✅ **Build**: Added `npm run build` step
3. ✅ **Database**: Copy database files to correct location
4. ✅ **Dependencies**: Added minimal SQLite build tools

## Deploy Commands

### Step 1: Use the Simple Dockerfile

```bash
# Switch to the simple version
mv Dockerfile Dockerfile.complex
mv Dockerfile.simple-new Dockerfile
```

### Step 2: Deploy

```bash
# Create app (if not done)
flyctl apps create thevisabay --org personal

# Deploy with simple Dockerfile
flyctl deploy --app thevisabay
```

### Step 3: If Volume Error, Skip Volume

Edit `fly.toml` and comment out volume:

```toml
# [[mounts]]
# source = "thevisabay_data"
# destination = "/data"
```

Then deploy again:

```bash
flyctl deploy --app thevisabay
```

## Your Simple Dockerfile (Fixed Version)

```dockerfile
FROM node:18-alpine

# Add basic build dependencies for SQLite
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build application
RUN npm run build

# Copy database file
RUN mkdir -p ./dist/server/
RUN cp server/visaconsult.db ./dist/server/ || echo "Database will be created"
RUN cp server/database.sqlite.js ./dist/server/

# Use port 8080 for Fly.io
EXPOSE 8080

CMD ["npm", "start"]
```

## Alternative: Keep Your Working App

Remember, your app is already working perfectly at:
`https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev`

This simple approach should work much better! 🎉
