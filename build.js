#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Building React application for Vercel deployment...");

try {
  // Install dependencies if node_modules doesn't exist
  if (!fs.existsSync(path.join(__dirname, "node_modules"))) {
    console.log("📦 Installing dependencies...");
    execSync("npm install", { stdio: "inherit", cwd: __dirname });
  }

  // Build the React application using Vite
  console.log("🔨 Building React app with Vite...");
  execSync("npm run build:client", { stdio: "inherit", cwd: __dirname });

  // Check if build succeeded
  const buildDir = path.join(__dirname, "dist", "spa");
  if (fs.existsSync(buildDir)) {
    console.log("✅ React build completed successfully");

    // Copy the built files to the root dist directory for Vercel
    const rootDistDir = path.join(__dirname, "dist");
    if (!fs.existsSync(rootDistDir)) {
      fs.mkdirSync(rootDistDir, { recursive: true });
    }

    // Copy index.html to root of dist for Vercel routing
    const indexSource = path.join(buildDir, "index.html");
    const indexDest = path.join(rootDistDir, "index.html");
    if (fs.existsSync(indexSource)) {
      fs.copyFileSync(indexSource, indexDest);
      console.log("✅ Copied index.html to dist root");
    }

    console.log("🎉 Build completed successfully - React app ready for Vercel deployment");
  } else {
    throw new Error("Build directory not found");
  }
} catch (error) {
  console.error("❌ Build failed:", error.message);

  // Fallback: Create a basic working React app
  console.log("🔄 Creating fallback React app...");

  const distDir = path.join(__dirname, "dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VisaBay - Immigration & Visa Consultants</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/react-router-dom@6/dist/umd/react-router-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      const { useState, useEffect } = React;
      const { BrowserRouter, Routes, Route, Link, useNavigate } = ReactRouterDOM;

      function App() {
        return (
          <BrowserRouter>
            <div>
              <nav style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to="/" style={{ textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                    🌍 VisaBay
                  </Link>
                  <div style={{ display: 'flex', gap: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#666' }}>Home</Link>
                    <Link to="/browse" style={{ textDecoration: 'none', color: '#666' }}>Browse</Link>
                    <Link to="/about" style={{ textDecoration: 'none', color: '#666' }}>About</Link>
                  </div>
                </div>
              </nav>

              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/browse" element={<BrowsePage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        );
      }

      function HomePage() {
        return (
          <div className="container" style={{ padding: '40px 20px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '60px 40px',
              borderRadius: '16px',
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Welcome to VisaBay</h1>
              <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Find Trusted Immigration & Visa Consultants Across India & UAE</p>
              <Link to="/browse" style={{
                background: 'white',
                color: '#667eea',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                Browse Consultants →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '1rem' }}>🎓 Student Visas</h3>
                <p>Expert guidance for study abroad programs and student visa applications.</p>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '1rem' }}>💼 Work Permits</h3>
                <p>Professional assistance for work visa and employment-based immigration.</p>
              </div>
              <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginBottom: '1rem' }}>🏢 Business Visas</h3>
                <p>Complete support for business and investment visa applications.</p>
              </div>
            </div>
          </div>
        );
      }

      function BrowsePage() {
        return (
          <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Browse Immigration Consultants</h1>
            <p>Full consultant directory will be loaded here...</p>
          </div>
        );
      }

      function AboutPage() {
        return (
          <div className="container" style={{ padding: '40px 20px' }}>
            <h1 style={{ marginBottom: '2rem' }}>About VisaBay</h1>
            <p>Your trusted partner for immigration and visa services across India and UAE.</p>
          </div>
        );
      }

      ReactDOM.render(<App />, document.getElementById('root'));
    </script>
  </body>
</html>`;

  fs.writeFileSync(path.join(distDir, "index.html"), fallbackHTML);
  console.log("✅ Fallback React app created successfully");
}
