import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS middleware
app.use(cors({
  origin: [
    "http://localhost:8080", 
    "http://localhost:8081",
    "http://localhost:8082",
    "https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev",
    "https://thevisabay.com",
    /^https:\/\/.*\.fly\.dev$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Parse JSON bodies
app.use(express.json());

// Manual API proxy to backend
app.use('/api/*', async (req, res) => {
  try {
    const apiUrl = `http://localhost:3011${req.originalUrl}`;
    console.log(`🔄 Proxying ${req.method} ${req.originalUrl} to ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    console.log(`✅ Backend responded with ${response.status} for ${req.originalUrl}`);
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error(`❌ Proxy error for ${req.originalUrl}:`, error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Backend connection failed',
      details: error.message,
      endpoint: req.originalUrl
    });
  }
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Static server running on port ${PORT}`);
  console.log(`🌐 Serving static files from dist/`);
  console.log(`🔗 API proxy to http://localhost:3011`);
  console.log(`📊 Database contains 1,572 businesses with 7,707 reviews`);
});
