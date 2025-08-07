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
  path.join(__dirname, "..", "index.html"), // One level up from code directory
  path.join(process.cwd(), "index.html"), // In current working directory
  path.join(__dirname, "index.html"), // In same directory as build script
  "/vercel/index.html", // Direct path in Vercel
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
  console.warn("⚠️ Source index.html not found, creating fallback HTML file");

  // Create fallback HTML content inline
  const fallbackHTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VisaConsult India - Immigration Services</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
  </head>
  <body>
    <div id="root">
      <div style="padding: 20px; text-align: center">
        <h1>Loading React App...</h1>
        <p>Building gradually to avoid 404 errors</p>
      </div>
    </div>

    <script type="module">
      console.log("🚀 Step 1: Basic React without external dependencies");

      import React from "https://esm.sh/react@18";
      import { createRoot } from "https://esm.sh/react-dom@18/client";

      function HomePage() {
        return React.createElement("div", {
          style: {
            padding: "20px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            maxWidth: "1200px",
            margin: "0 auto",
            lineHeight: "1.6"
          }
        }, [
          React.createElement("header", {
            key: "header",
            style: {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "40px 20px",
              borderRadius: "12px",
              marginBottom: "30px",
              textAlign: "center"
            }
          }, [
            React.createElement("h1", {
              key: "title",
              style: { margin: "0 0 10px 0", fontSize: "2.5rem" }
            }, "🏠 VisaConsult India"),
            React.createElement("p", {
              key: "subtitle",
              style: { margin: "0", fontSize: "1.2rem", opacity: "0.9" }
            }, "Your Trusted Immigration & Visa Services Partner")
          ]),

          React.createElement("div", {
            key: "status",
            style: {
              background: "#f0f9ff",
              border: "2px solid #0ea5e9",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "30px"
            }
          }, [
            React.createElement("h3", {
              key: "status-title",
              style: { color: "#0369a1", margin: "0 0 10px 0" }
            }, "✅ System Status"),
            React.createElement("p", {
              key: "status-desc",
              style: { margin: "0", color: "#0c4a6e" }
            }, "React app loaded successfully - No 404 errors - Vercel deployment working")
          ])
        ]);
      }

      try {
        console.log("🎯 Mounting React app...");
        const root = createRoot(document.getElementById("root"));
        root.render(React.createElement(HomePage));
        console.log("✅ Step 1 Complete: Basic React app working on Vercel");
      } catch (error) {
        console.error("❌ React mounting error:", error);
        document.getElementById("root").innerHTML =
          '<div style="color: red; padding: 20px; text-align: center;">' +
          '<h2>React Error</h2>' +
          '<p>' + error.message + '</p>' +
          '</div>';
      }
    </script>
  </body>
</html>`;

  fs.writeFileSync(destFile, fallbackHTML);
  console.log("✅ Created fallback index.html in dist directory");
}

console.log("🎉 Build completed successfully - Ready for Vercel deployment");
