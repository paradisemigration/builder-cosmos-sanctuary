#!/bin/bash

echo "🚀 Starting Fly.io Deployment for TheVisaBay"
echo "============================================"

# Step 1: Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl not found. Please install it first:"
    echo "   curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Step 2: Login check
echo "📝 Checking Fly.io authentication..."
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Please login to Fly.io first:"
    echo "   flyctl auth login"
    exit 1
fi

# Step 3: Check if app exists
echo "🔍 Checking if app exists..."
if flyctl status --app thevisabay &> /dev/null; then
    echo "✅ App 'thevisabay' found. Proceeding with deployment."
else
    echo "⚠️  App 'thevisabay' not found. Creating new app..."
    flyctl launch --name thevisabay --region sin --no-deploy
fi

# Step 4: Create volume if it doesn't exist
echo "💾 Setting up persistent storage..."
if ! flyctl volumes list --app thevisabay | grep -q thevisabay_data; then
    echo "Creating volume for database..."
    flyctl volumes create thevisabay_data --region sin --size 3 --app thevisabay
else
    echo "✅ Volume already exists"
fi

# Step 5: Set environment variables
echo "⚙️  Setting environment variables..."
flyctl secrets set NODE_ENV=production --app thevisabay
flyctl secrets set PORT=8080 --app thevisabay

# Step 6: Build application
echo "🔨 Building application..."
npm run build

# Step 7: Deploy
echo "🚀 Deploying to Fly.io..."
flyctl deploy --app thevisabay

# Step 8: Check status
echo "📊 Checking deployment status..."
flyctl status --app thevisabay

echo ""
echo "🎉 Deployment Complete!"
echo "🌐 Your app should be available at: https://thevisabay.fly.dev"
echo "📱 To open in browser: flyctl open --app thevisabay"
echo "📋 To view logs: flyctl logs --app thevisabay"
