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

// Find index.html - try multiple possible locations
const possibleSources = [
  path.join(__dirname, "..", "index.html"),  // One level up from code directory
  path.join(process.cwd(), "index.html"),    // In current working directory
  path.join(__dirname, "index.html"),        // In same directory as build script
  "/vercel/index.html"                       // Direct path in Vercel
];

let sourceFile = null;
for (const possibleSource of possibleSources) {
  console.log("Checking for index.html at:", possibleSource);
  if (fs.existsSync(possibleSource)) {
    sourceFile = possibleSource;
    console.log("✅ Found index.html at:", sourceFile);
    break;
  }
}

const destFile = path.join(distDir, "index.html");
console.log("Will copy to:", destFile);

if (sourceFile && fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log("✅ Copied index.html to dist/index.html");
} else {
  console.error("❌ Source index.html not found in any of the expected locations:");
  possibleSources.forEach(source => console.error("  - " + source));

  // List all files in current directory for debugging
  console.log("📁 Current working directory:", process.cwd());
  console.log("📁 Build script directory:", __dirname);
  try {
    const files = fs.readdirSync(process.cwd());
    console.log("📁 Files in working directory:", files.slice(0, 10));
  } catch (e) {
    console.log("Could not list working directory files");
  }

  process.exit(1);
}

console.log("🎉 Build completed successfully - Ready for Vercel deployment");
