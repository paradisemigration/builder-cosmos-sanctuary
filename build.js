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

if (fs.existsSync(sourceFile)) {
  fs.copyFileSync(sourceFile, destFile);
  console.log("✅ Copied index.html to dist/index.html");
} else {
  console.error("❌ Source index.html not found at:", sourceFile);
  process.exit(1);
}

console.log("🎉 Build completed successfully - Ready for Vercel deployment");
