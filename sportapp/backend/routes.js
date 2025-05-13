// routes.js
const express = require('express');
const router = express.Router();
const {
  BetreuerController,
  TeamController,
  DisziplinController,
  ErgebnisController,
  StationController,
  getTableSchema
} = require('./dbController');
const authController = require('./authController');

// Middleware to handle errors
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ===== AUTHENTICATION ROUTES =====
// Login routes
router.post('/auth/login/betreuer', asyncHandler(authController.loginBetreuer));
router.post('/auth/login/admin', asyncHandler(authController.loginAdmin));

// Registration routes (admin only can create other users)
router.post('/auth/register/betreuer', 
  authController.authenticateToken, 
  authController.requireAdmin, 
  asyncHandler(authController.registerBetreuer)
);
router.post('/auth/register/admin', 
  authController.authenticateToken, 
  authController.requireAdmin, 
  asyncHandler(authController.registerAdmin)
);

// User management routes
router.get('/auth/me', 
  authController.authenticateToken, 
  authController.getCurrentUser
);

router.get('/auth/betreuer', 
  authController.authenticateToken, 
  authController.requireAdmin,
  asyncHandler(authController.getAllBetreuer)
);

router.get('/auth/admins', 
  authController.authenticateToken, 
  authController.requireAdmin,
  asyncHandler(authController.getAllAdmins)
);

// Password management
router.put('/auth/betreuer/password', 
  authController.authenticateToken, 
  asyncHandler(authController.changeBetreuerPassword)
);

router.put('/auth/admin/password', 
  authController.authenticateToken, 
  asyncHandler(authController.changeAdminPassword)
);

// Delete accounts (admin only)
router.delete('/auth/betreuer/:id', 
  authController.authenticateToken, 
  authController.requireAdmin,
  asyncHandler(authController.deleteBetreuer)
);

router.delete('/auth/admin/:id', 
  authController.authenticateToken, 
  authController.requireAdmin,
  asyncHandler(authController.deleteAdmin)
);

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

// Get students for a specific team
router.get('/teams/:id/students', asyncHandler(async (req, res) => {
  try {
    const teamId = req.params.id;
    
    // Query to get students associated with this team
    const query = `
      SELECT s.* 
      FROM SCHUELER s
      JOIN TEAM_SCHUELER ts ON s.SCHUELERID = ts.SCHUELERID
      WHERE ts.TEAMID = :teamId
      ORDER BY s.NAME, s.VORNAME
    `;
    
    const { executeQuery } = require('./dbController');
    const result = await executeQuery(query, [teamId]);
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data || []
      });
    } else {
      throw new Error(result.error || 'Failed to retrieve team students');
    }
  } catch (err) {
    console.error('Error getting team students:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}));

// Update/set students for a team
router.post('/teams/:id/students', asyncHandler(async (req, res) => {
  try {
    const teamId = req.params.id;
    const { studentIds } = req.body;
    
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: studentIds array is required'
      });
    }
    
    const { getConnection, executeQuery } = require('./dbController');
    
    // Start a transaction
    const connection = await getConnection();
    
    try {
      // First delete all existing associations for this team
      await executeQuery(
        'DELETE FROM TEAM_SCHUELER WHERE TEAMID = :teamId',
        [teamId]
      );
      
      // Then insert new associations
      if (studentIds.length > 0) {
        // Insert each student-team association
        for (const studentId of studentIds) {
          await executeQuery(
            'INSERT INTO TEAM_SCHUELER (TEAMID, SCHUELERID) VALUES (:teamId, :studentId)',
            [teamId, studentId]
          );
        }
      }
      
      res.json({
        success: true,
        message: `Updated team students. Added ${studentIds.length} students to team ${teamId}.`
      });
    } catch (err) {
      // Rollback transaction in case of error
      await connection.rollback();
      throw err;
    } finally {
      // Release connection
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  } catch (err) {
    console.error('Error updating team students:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
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











// Stations routes
router.get('/stations', StationController.getAll);
router.get('/stations/:id', StationController.getById);
router.post('/stations', authController.authenticateToken, StationController.create);
router.put('/stations/:id', authController.authenticateToken, StationController.update);
router.delete('/stations/:id', authController.authenticateToken, StationController.delete);


// Add this to your routes.js file

// Save student points (scores)
router.post('/studentpoints', asyncHandler(async (req, res) => {
  try {
    const { scores } = req.body;
    
    if (!scores || !Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Ungültige Punktedaten. Eine Liste von Schülerpunkten wird erwartet.'
      });
    }
    
    // Array to store results
    const results = [];
    
    // Process each score entry
    for (const score of scores) {
      // Validate required fields
      if (!score.SCHUELERID || !score.DISZIPLINID || score.PUNKTE === undefined || score.PUNKTE === null) {
        return res.status(400).json({
          success: false,
          error: 'Jeder Punkteintrag muss SCHUELERID, DISZIPLINID und PUNKTE enthalten'
        });
      }
      
      // Check if an entry already exists for this student and discipline
      const existingResult = await ErgebnisController.getByStudentAndDiscipline(
        score.SCHUELERID, 
        score.DISZIPLINID
      );
      
      let result;
      
      if (existingResult.success && existingResult.data.length > 0) {
        // Update existing record
        const existingId = existingResult.data[0].ERGEBNISID;
        result = await ErgebnisController.update(existingId, {
          SCHUELERID: score.SCHUELERID,
          DISZIPLINID: score.DISZIPLINID,
          PUNKTE: score.PUNKTE,
          TEAMID: score.TEAMID
        });
      } else {
        // Create new record
        result = await ErgebnisController.create({
          SCHUELERID: score.SCHUELERID,
          DISZIPLINID: score.DISZIPLINID,
          PUNKTE: score.PUNKTE,
          TEAMID: score.TEAMID
        });
      }
      
      if (result.success) {
        results.push(result.data);
      } else {
        // If any score fails to save, return an error
        return res.status(500).json({
          success: false,
          error: `Fehler beim Speichern der Punkte für Schüler ${score.SCHUELERID}: ${result.error}`
        });
      }
    }
    
    res.status(201).json({
      success: true,
      message: `${results.length} Punkteeinträge erfolgreich gespeichert`,
      data: results
    });
    
  } catch (err) {
    console.error('Error saving student points:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      message: err.message
    });
  }
}));

// Get data from all tables at once
router.get('/all', asyncHandler(async (req, res) => {
    try {
      // Run all queries in parallel for better performance
      const [betreuerResult, teamsResult, disziplinsResult, ergebnisseResult, studentsResult, teamStudentsResult] = await Promise.all([
        BetreuerController.getAll(),
        TeamController.getAll(),
        DisziplinController.getAll(),
        ErgebnisController.getAll(),
        // Add queries for students and team-student relationships
        db.query("SELECT * FROM schueler"),
        db.query("SELECT * FROM team_schueler")
      ]);
      
      // Check if all queries were successful
      if (betreuerResult.success && teamsResult.success && 
          disziplinsResult.success && ergebnisseResult.success && 
          studentsResult && teamStudentsResult) {
        
        // Return all data in a single response
        res.json({
          success: true,
          data: {
            betreuer: betreuerResult.data,
            teams: teamsResult.data,
            disziplins: disziplinsResult.data,
            ergebnisse: ergebnisseResult.data,
            students: studentsResult.rows || [],
            teamStudents: teamStudentsResult.rows || [],
            studentScores: ergebnisseResult.data.filter(result => result.SCHUELERID)
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
