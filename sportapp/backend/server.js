// // server.js with enhanced CORS handling
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const oracledb = require('oracledb');

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Enhanced CORS setup - allow all origins during development
// app.use(cors({
//   origin: '*', // Allow all origins during development
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//   credentials: true
// }));

// // For debugging, log all requests
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
//   next();
// });

// app.use(express.json());

// // Database connection configuration
// const dbConfig = {
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_SERVER})(PORT=${process.env.DB_PORT}))(CONNECT_DATA=(SID=${process.env.DB_SID})))`
// };

// // Test route to check if server is running
// app.get('/', (req, res) => {
//   res.json({ message: 'Backend server is running', version: '1.0' });
// });

// // Test endpoint that queries the Betreuer table
// app.get('/api/test', async (req, res) => {
//   let connection;
  
//   try {
//     console.log('API request received for /api/test');
//     console.log('Headers:', req.headers);
    
//     // Establish connection to the database
//     console.log('Connecting to database...');
//     connection = await oracledb.getConnection(dbConfig);
//     console.log('Connection successful');
    
//     // Query the Betreuer table
//     console.log('Executing query: SELECT * FROM Betreuer');
//     const result = await connection.execute(
//       'SELECT * FROM Betreuer',
//       [], // No bind variables
//       { outFormat: oracledb.OUT_FORMAT_OBJECT } // Return object instead of array
//     );
    
//     console.log(`Query executed successfully, retrieved ${result.rows.length} rows`);
    
//     // Set correct content type header
//     res.setHeader('Content-Type', 'application/json');
//     res.json({ success: true, data: result.rows });
//   } catch (err) {
//     console.error('Database error:', err);
    
//     // Set correct content type header
//     res.setHeader('Content-Type', 'application/json');
//     res.status(500).json({ success: false, error: err.message });
//   } finally {
//     // Release the connection
//     if (connection) {
//       try {
//         await connection.close();
//         console.log('Connection closed');
//       } catch (err) {
//         console.error('Error closing connection:', err);
//       }
//     }
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log(`Test endpoint available at: http://localhost:${PORT}/api/test`);
//   console.log(`Root endpoint available at: http://localhost:${PORT}/`);
// });










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
      console.log(`API available at: http://localhost:${PORT}/api`);
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