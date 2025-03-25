// routes.js
const express = require('express');
const router = express.Router();
const {
  BetreuerController,
  TeamController,
  DisziplinController,
  ErgebnisController,
  getTableSchema
} = require('./dbController');

// Middleware to handle errors
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Get table schema information
router.get('/schema/:tableName', asyncHandler(async (req, res) => {
  const result = await getTableSchema(req.params.tableName);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// BETREUER ROUTES
// Get all betreuer
router.get('/betreuer', asyncHandler(async (req, res) => {
  const result = await BetreuerController.getAll();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Get betreuer by ID
router.get('/betreuer/:id', asyncHandler(async (req, res) => {
  const result = await BetreuerController.getById(req.params.id);
  if (result.success) {
    if (result.data.length === 0) {
      res.status(404).json({ success: false, error: 'Betreuer not found' });
    } else {
      res.json(result);
    }
  } else {
    res.status(500).json(result);
  }
}));

// Create betreuer
router.post('/betreuer', asyncHandler(async (req, res) => {
  const result = await BetreuerController.create(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Update betreuer
router.put('/betreuer/:id', asyncHandler(async (req, res) => {
  const result = await BetreuerController.update(req.params.id, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Delete betreuer
router.delete('/betreuer/:id', asyncHandler(async (req, res) => {
  const result = await BetreuerController.delete(req.params.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// TEAM ROUTES
// Get all teams
router.get('/teams', asyncHandler(async (req, res) => {
  const result = await TeamController.getAll();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Get team by ID
router.get('/teams/:id', asyncHandler(async (req, res) => {
  const result = await TeamController.getById(req.params.id);
  if (result.success) {
    if (result.data.length === 0) {
      res.status(404).json({ success: false, error: 'Team not found' });
    } else {
      res.json(result);
    }
  } else {
    res.status(500).json(result);
  }
}));

// Create team
router.post('/teams', asyncHandler(async (req, res) => {
  const result = await TeamController.create(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Update team
router.put('/teams/:id', asyncHandler(async (req, res) => {
  const result = await TeamController.update(req.params.id, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Delete team
router.delete('/teams/:id', asyncHandler(async (req, res) => {
  const result = await TeamController.delete(req.params.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// DISZIPLIN ROUTES
// Get all disziplins
router.get('/disziplins', asyncHandler(async (req, res) => {
  const result = await DisziplinController.getAll();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Get disziplin by ID
router.get('/disziplins/:id', asyncHandler(async (req, res) => {
  const result = await DisziplinController.getById(req.params.id);
  if (result.success) {
    if (result.data.length === 0) {
      res.status(404).json({ success: false, error: 'Disziplin not found' });
    } else {
      res.json(result);
    }
  } else {
    res.status(500).json(result);
  }
}));

// Create disziplin
router.post('/disziplins', asyncHandler(async (req, res) => {
  const result = await DisziplinController.create(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Update disziplin
router.put('/disziplins/:id', asyncHandler(async (req, res) => {
  const result = await DisziplinController.update(req.params.id, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Delete disziplin
router.delete('/disziplins/:id', asyncHandler(async (req, res) => {
  const result = await DisziplinController.delete(req.params.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// ERGEBNIS ROUTES
// Get all ergebnis
router.get('/ergebnisse', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.getAll();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Get ergebnis by ID
router.get('/ergebnisse/:id', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.getById(req.params.id);
  if (result.success) {
    if (result.data.length === 0) {
      res.status(404).json({ success: false, error: 'Ergebnis not found' });
    } else {
      res.json(result);
    }
  } else {
    res.status(500).json(result);
  }
}));

// Get ergebnis by team ID
router.get('/ergebnisse/team/:teamId', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.getByTeamId(req.params.teamId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Get ergebnis by disziplin ID
router.get('/ergebnisse/disziplin/:disziplinId', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.getByDisziplinId(req.params.disziplinId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Create ergebnis
router.post('/ergebnisse', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.create(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Update ergebnis
router.put('/ergebnisse/:id', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.update(req.params.id, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Delete ergebnis
router.delete('/ergebnisse/:id', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.delete(req.params.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));




// Add this to your routes.js file

// Get data from all tables at once
router.get('/all', asyncHandler(async (req, res) => {
    try {
      // Run all queries in parallel for better performance
      const [betreuerResult, teamsResult, disziplinsResult, ergebnisseResult] = await Promise.all([
        BetreuerController.getAll(),
        TeamController.getAll(),
        DisziplinController.getAll(),
        ErgebnisController.getAll()
      ]);
      
      // Check if all queries were successful
      if (betreuerResult.success && teamsResult.success && 
          disziplinsResult.success && ergebnisseResult.success) {
        
        // Return all data in a single response
        res.json({
          success: true,
          data: {
            betreuer: betreuerResult.data,
            teams: teamsResult.data,
            disziplins: disziplinsResult.data,
            ergebnisse: ergebnisseResult.data
          }
        });
      } else {
        // Collect errors from failed queries
        const errors = [];
        if (!betreuerResult.success) errors.push(`Betreuer: ${betreuerResult.error}`);
        if (!teamsResult.success) errors.push(`Teams: ${teamsResult.error}`);
        if (!disziplinsResult.success) errors.push(`Disziplins: ${disziplinsResult.error}`);
        if (!ergebnisseResult.success) errors.push(`Ergebnisse: ${ergebnisseResult.error}`);
        
        res.status(500).json({
          success: false,
          error: 'Failed to retrieve all data',
          details: errors
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: err.message
      });
    }
  }));


















module.exports = router;