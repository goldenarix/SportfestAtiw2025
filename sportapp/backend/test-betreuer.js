// test-betreuer.js
// This script provides a simple API to test the betreuer functionality with roles

const oracledb = require('oracledb');
const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Import controllers
const dbControllerExtension = require('./dbControllerExtension');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Get database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING
};

// Port for the test server
const PORT = process.env.TEST_PORT || 3001;

// Test data for stationärer Betreuer
const stationaererBetreuer = {
  NAME: 'Stationär Tester',
  PASSWORT: 'test123',
  ROLLE: 'stationaer'
};

// Test data for laufender Betreuer
const laufenderBetreuer = {
  NAME: 'Laufend Tester',
  PASSWORT: 'test123',
  ROLLE: 'laufend'
};

// Helper function to create test data
async function createTestData() {
  console.log('Creating test data...');
  
  try {
    // Create a stationärer Betreuer
    const stationaerResult = await dbControllerExtension.createBetreuer(
      stationaererBetreuer,
      [1, 2, 3], // Assign first 3 disziplinen
      []
    );
    
    if (stationaerResult.success) {
      console.log(`Created stationärer Betreuer with ID: ${stationaerResult.id}`);
    } else {
      console.error('Failed to create stationärer Betreuer:', stationaerResult.error);
    }
    
    // Create a laufender Betreuer
    const laufendResult = await dbControllerExtension.createBetreuer(
      laufenderBetreuer,
      [],
      [1, 2, 3] // Assign first 3 teams
    );
    
    if (laufendResult.success) {
      console.log(`Created laufender Betreuer with ID: ${laufendResult.id}`);
    } else {
      console.error('Failed to create laufender Betreuer:', laufendResult.error);
    }
    
    return {
      stationaerID: stationaerResult.success ? stationaerResult.id : null,
      laufendID: laufendResult.success ? laufendResult.id : null
    };
  } catch (err) {
    console.error('Error creating test data:', err);
    return { stationaerID: null, laufendID: null };
  }
}

// Create test routes
app.get('/create-test-betreuer', async (req, res) => {
  try {
    const result = await createTestData();
    res.json({
      success: true,
      message: 'Test betreuer created',
      data: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Route to get betreuer details
app.get('/betreuer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbControllerExtension.getBetreuerDetails(id, true);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json({
        success: false,
        error: `Betreuer with ID ${id} not found`
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Route to add disziplinen to a betreuer
app.post('/betreuer/:id/disziplinen', async (req, res) => {
  try {
    const { id } = req.params;
    const { disziplinen } = req.body;
    
    if (!disziplinen || !Array.isArray(disziplinen)) {
      return res.status(400).json({
        success: false,
        error: 'disziplinen array is required'
      });
    }
    
    const betreuerResult = await dbControllerExtension.getBetreuerDetails(id);
    
    if (!betreuerResult.success) {
      return res.status(404).json({
        success: false,
        error: `Betreuer with ID ${id} not found`
      });
    }
    
    const result = await dbControllerExtension.updateBetreuer(id, { ROLLE: 'stationaer' }, disziplinen, []);
    
    if (result.success) {
      res.json({
        success: true,
        message: `${disziplinen.length} disziplinen assigned to betreuer ${id}`
      });
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Route to add teams to a betreuer
app.post('/betreuer/:id/teams', async (req, res) => {
  try {
    const { id } = req.params;
    const { teams } = req.body;
    
    if (!teams || !Array.isArray(teams)) {
      return res.status(400).json({
        success: false,
        error: 'teams array is required'
      });
    }
    
    const betreuerResult = await dbControllerExtension.getBetreuerDetails(id);
    
    if (!betreuerResult.success) {
      return res.status(404).json({
        success: false,
        error: `Betreuer with ID ${id} not found`
      });
    }
    
    const result = await dbControllerExtension.updateBetreuer(id, { ROLLE: 'laufend' }, [], teams);
    
    if (result.success) {
      res.json({
        success: true,
        message: `${teams.length} teams assigned to betreuer ${id}`
      });
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Route to get all teams
app.get('/teams', async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    
    const result = await connection.execute(
      `SELECT * FROM TEAM ORDER BY NAME`,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    await connection.close();
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Route to get all disziplinen
app.get('/disziplinen', async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    
    const result = await connection.execute(
      `SELECT * FROM DISZIPLIN ORDER BY NAME`,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    await connection.close();
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Route to get assigned disziplinen for a betreuer
app.get('/betreuer/:id/disziplinen', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbControllerExtension.getBetreuerDisziplinen(id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Route to get assigned teams for a betreuer
app.get('/betreuer/:id/teams', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dbControllerExtension.getBetreuerTeams(id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/create-test-betreuer to create test betreuer`);
  console.log(`After creating test betreuer, you can test the role-based functionality in the app`);
});
