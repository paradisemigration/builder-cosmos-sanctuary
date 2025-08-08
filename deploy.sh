#!/bin/bash

# TheVisaBay.com Production Deployment Script
set -e

echo "🚀 Starting TheVisaBay.com deployment..."

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.cache/

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Step 3: Build the application
echo "🏗️  Building client..."
npm run build:client

echo "🏗️  Building server..."
npm run build:server

# Step 4: Copy database and assets
echo "📄 Copying database..."
npm run copy:database

# Step 5: Create health check endpoint
echo "❤️  Setting up health check..."
cat > dist/server/health.js << 'EOF'
export const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TheVisaBay.com',
    version: process.env.npm_package_version || '1.0.0'
  });
};
EOF

# Step 6: Verify build
echo "✅ Verifying build..."
if [ ! -d "dist/spa" ] || [ ! -d "dist/server" ]; then
  echo "❌ Build verification failed!"
  exit 1
fi

echo "✅ Build completed successfully!"
echo "📊 Build summary:"
echo "   - Client build: $(du -sh dist/spa 2>/dev/null || echo 'N/A')"
echo "   - Server build: $(du -sh dist/server 2>/dev/null || echo 'N/A')"
echo "   - Database: $(ls -lh dist/server/*.db 2>/dev/null || echo 'No database found')"

echo "🎉 Ready for deployment to thevisabay.com!"
