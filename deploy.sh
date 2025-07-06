#!/bin/bash

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Built files are in the 'dist/spa' directory"
    echo "🌐 You can now upload these files to your hosting provider"
    echo ""
    echo "📋 Next steps:"
    echo "1. Upload the contents of 'dist/spa' to your web server"
    echo "2. Configure your domain to point to the uploaded files"
    echo "3. Ensure your web server supports client-side routing"
    echo ""
    echo "🎉 Your Dubai Immigration website is ready for production!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
