#!/bin/bash

# TheVisaBay.com Development Server Startup Script
echo "🚀 Starting TheVisaBay.com development environment..."

# Kill any existing processes on common ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3010,3011,8080,8081 | xargs kill -9 2>/dev/null || true

# Start both frontend and backend
echo "▶️  Starting API server and frontend..."
npm run dev

echo "✅ Development servers started:"
echo "   🎯 Frontend: http://localhost:8081"
echo "   🔧 Backend API: http://localhost:3011"
echo "   📊 Database: 1,572+ businesses ready"
echo ""
echo "🎉 TheVisaBay.com is ready for development!"
