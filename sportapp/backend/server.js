
// server.js - Main application file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initialize } = require('./dbController');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS setup
app.use(cors({
  origin: '*', // Allow all origins during development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// For debugging, log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running', version: '1.0' });
});

// Use the API routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Server error',
    message: err.message
  });
});

// Start the server and initialize the database
async function startServer() {
  try {
    // Initialize Oracle connection pool
    await initialize();
    
    // Start listening for requests
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Lokale API available at: http://localhost:${PORT}/api`);
      console.log(`Web Service API available at: https://padersport-api.onrender.com/api`);
      console.log(`Available endpoints:`);
      console.log(`  GET    /api/betreuer           - Get all betreuer`);
      console.log(`  GET    /api/betreuer/:id       - Get betreuer by ID`);
      console.log(`  POST   /api/betreuer           - Create new betreuer`);
      console.log(`  PUT    /api/betreuer/:id       - Update betreuer`);
      console.log(`  DELETE /api/betreuer/:id       - Delete betreuer`);
      console.log(`  GET    /api/teams              - Get all teams`);
      console.log(`  GET    /api/teams/:id          - Get team by ID`);
      console.log(`  POST   /api/teams              - Create new team`);
      console.log(`  PUT    /api/teams/:id          - Update team`);
      console.log(`  DELETE /api/teams/:id          - Delete team`);
      console.log(`  GET    /api/disziplins         - Get all disziplins`);
      console.log(`  GET    /api/disziplins/:id     - Get disziplin by ID`);
      console.log(`  POST   /api/disziplins         - Create new disziplin`);
      console.log(`  PUT    /api/disziplins/:id     - Update disziplin`);
      console.log(`  DELETE /api/disziplins/:id     - Delete disziplin`);
      console.log(`  GET    /api/ergebnisse         - Get all ergebnisse`);
      console.log(`  GET    /api/ergebnisse/:id     - Get ergebnis by ID`);
      console.log(`  GET    /api/ergebnisse/team/:teamId - Get ergebnisse by team ID`);
      console.log(`  GET    /api/ergebnisse/disziplin/:disziplinId - Get ergebnisse by disziplin ID`);
      console.log(`  POST   /api/ergebnisse         - Create new ergebnis`);
      console.log(`  PUT    /api/ergebnisse/:id     - Update ergebnis`);
      console.log(`  DELETE /api/ergebnisse/:id     - Delete ergebnis`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Run the server
startServer();