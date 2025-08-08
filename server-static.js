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
    "https://a4b9f79f9f7045e490b1cf64b782d096-a17cadd7e83c497ba4098bf4e.fly.dev",
    "https://thevisabay.com",
    /^https:\/\/.*\.fly\.dev$/
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// API proxy to backend
app.use('/api/*', (req, res) => {
  const apiUrl = `http://localhost:3011${req.originalUrl}`;
  fetch(apiUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  })
  .then(response => response.json())
  .then(data => res.json(data))
  .catch(error => res.status(500).json({ error: error.message }));
});

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Static server running on port ${PORT}`);
  console.log(`🌐 Serving static files from dist/`);
  console.log(`🔗 API proxy to http://localhost:3011`);
});
