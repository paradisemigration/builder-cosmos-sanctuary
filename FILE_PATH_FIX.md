# 🔧 Fix Database File Path Issue

## Error Resolved

❌ **Error**: `/server/database.sqlite.js not found`  
✅ **Fix**: Let build process handle file copying automatically

## Root Cause

The Dockerfile was trying to manually copy `server/database.sqlite.js` but Docker couldn't find it in the build context, even though the file exists.

## Solution: Ultra-Simple Dockerfile

Use this approach that lets the npm build process handle all file management:

```dockerfile
FROM node:18-alpine

# Add minimal build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the application (this handles all file copying)
RUN npm run build

# Expose port for Fly.io
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
```

## Deploy Commands

### Option 1: Use Ultra-Simple Dockerfile

```bash
mv Dockerfile Dockerfile.old
mv Dockerfile.ultra-simple Dockerfile
flyctl deploy --app thevisabay-app
```

### Option 2: Deploy Without Volume

If still having issues, edit `fly.toml`:

```toml
# Comment out volume mount temporarily
# [[mounts]]
# source = "thevisabay_data"
# destination = "/data"
```

Then deploy:

```bash
flyctl deploy --app thevisabay-app
```

## Why This Works

- ✅ No manual file copying that can fail
- ✅ Lets `npm run build` handle all file management
- ✅ Uses the build script from package.json
- ✅ Minimal dependencies for faster builds

## Check Your Build Script

Make sure your `package.json` has the correct build command:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server && npm run copy:database"
  }
}
```

This approach should eliminate the file path issues! 🚀
