#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Building static HTML for Vercel deployment...');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log('✅ Created dist directory');
}

// Copy index.html to dist
const sourceFile = path.join(__dirname, '../index.html');
const destFile = path.join(distDir, 'index.html');

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log('✅ Copied index.html to dist/index.html');
} else {
  console.error('❌ Source index.html not found at:', sourceFile);
  process.exit(1);
}

console.log('🎉 Build completed successfully - Ready for Vercel deployment');
