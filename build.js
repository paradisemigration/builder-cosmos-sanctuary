#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Building static HTML for Vercel deployment...");

// Create dist directory
const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
  console.log("✅ Created dist directory");
}

// Copy index.html to dist (index.html is in project root, one level up from code directory)
const sourceFile = path.join(__dirname, "..", "index.html");
const destFile = path.join(distDir, "index.html");

console.log("Looking for index.html at:", sourceFile);
console.log("Will copy to:", destFile);

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log("✅ Copied index.html to dist/index.html");
} else {
  console.error("❌ Source index.html not found at:", sourceFile);
  process.exit(1);
}

console.log("🎉 Build completed successfully - Ready for Vercel deployment");
