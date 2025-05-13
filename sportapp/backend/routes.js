// routes.js - Konsolidierte Routen-Definitionen
const express = require('express');
const router = express.Router();
const {
  BetreuerController,
  TeamController,
  DisziplinController,
  ErgebnisController,
  SchuelerController,
  StationController,
  getTableSchema
} = require('./dbController');

// Middleware zur Fehlerbehandlung
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ===== SCHÜLER-ROUTEN =====
// Alle Schüler abrufen
router.get('/schueler', asyncHandler(async (req, res) => {
  const result = await SchuelerController.getAll();
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Abrufen der Schüler'
    });
  }
}));

// Schüler nach ID abrufen
router.get('/schueler/:id', asyncHandler(async (req, res) => {
  const result = await SchuelerController.getById(req.params.id);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(404).json({
      success: false,
      error: result.error || 'Schüler nicht gefunden'
    });
  }
}));

// Schüler nach Team-ID abrufen
router.get('/schueler/team/:teamId', asyncHandler(async (req, res) => {
  const result = await SchuelerController.getByTeamId(req.params.teamId);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Abrufen der Schüler für das Team'
    });
  }
}));

// Neuen Schüler erstellen
router.post('/schueler', asyncHandler(async (req, res) => {
  const result = await SchuelerController.create(req.body);
  
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Erstellen des Schülers'
    });
  }
}));

// Schüler aktualisieren
router.put('/schueler/:id', asyncHandler(async (req, res) => {
  const result = await SchuelerController.update(req.params.id, req.body);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Aktualisieren des Schülers'
    });
  }
}));

// Schüler löschen
router.delete('/schueler/:id', asyncHandler(async (req, res) => {
  const result = await SchuelerController.delete(req.params.id);
  
  if (result.success) {
    res.json({
      success: true,
      message: 'Schüler erfolgreich gelöscht'
    });
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Löschen des Schülers'
    });
  }
}));

// ===== BETREUER-ROUTEN =====
// Alle Betreuer abrufen
router.get('/betreuer', asyncHandler(async (req, res) => {
  // Prüfen, ob erweiterte Daten angefordert werden
  const withAssignments = req.query.withAssignments === 'true';
  
  let result;
  if (withAssignments) {
    result = await BetreuerController.getAllWithAssignments();
  } else {
    result = await BetreuerController.getAll();
  }
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Abrufen der Betreuer'
    });
  }
}));

// Betreuer nach ID abrufen
router.get('/betreuer/:id', asyncHandler(async (req, res) => {
  // Prüfen, ob erweiterte Daten angefordert werden
  const withAssignments = req.query.withAssignments === 'true';
  
  let result;
  if (withAssignments) {
    result = await BetreuerController.getByIdWithAssignments(req.params.id);
  } else {
    result = await BetreuerController.getById(req.params.id);
  }
  
  if (result.success) {
    if (!result.data || (Array.isArray(result.data) && result.data.length === 0)) {
      res.status(404).json({
        success: false,
        error: 'Betreuer nicht gefunden'
      });
    } else {
      res.json(result);
    }
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Abrufen des Betreuers'
    });
  }
}));

// Neuen Betreuer erstellen
router.post('/betreuer', asyncHandler(async (req, res) => {
  const result = await BetreuerController.create(req.body);
  
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Erstellen des Betreuers'
    });
  }
}));

// Betreuer aktualisieren
router.put('/betreuer/:id', asyncHandler(async (req, res) => {
  const result = await BetreuerController.update(req.params.id, req.body);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Aktualisieren des Betreuers'
    });
  }
}));

// Betreuer löschen
router.delete('/betreuer/:id', asyncHandler(async (req, res) => {
  const result = await BetreuerController.delete(req.params.id);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Löschen des Betreuers'
    });
  }
}));

// Disziplinen für Betreuer abrufen
router.get('/betreuer/:id/disziplinen', asyncHandler(async (req, res) => {
  const result = await BetreuerController.getDisziplinenByBetreuer(req.params.id);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Abrufen der Disziplinen für den Betreuer'
    });
  }
}));

// Disziplinen für Betreuer festlegen
router.post('/betreuer/:id/disziplinen', asyncHandler(async (req, res) => {
  if (!req.body.disziplinen || !Array.isArray(req.body.disziplinen)) {
    return res.status(400).json({
      success: false,
      error: 'Request muss ein disziplinen Array enthalten'
    });
  }
  
  // Betreuer-Details abrufen, um Rolle zu prüfen
  const betreuerResult = await BetreuerController.getByIdWithAssignments(req.params.id);
  
  if (!betreuerResult.success) {
    return res.status(500).json({
      success: false,
      error: betreuerResult.error || 'Fehler beim Abrufen des Betreuers'
    });
  }
  
  // Update mit geänderten Feldern
  const updateData = {
    disziplinen: req.body.disziplinen
  };
  
  // Rolle auf stationaer setzen, wenn nötig
  if (betreuerResult.data.ROLLE !== 'stationaer') {
    updateData.ROLLE = 'stationaer';
  }
  
  const updateResult = await BetreuerController.update(req.params.id, updateData);
  
  if (updateResult.success) {
    res.json({
      success: true,
      message: `${req.body.disziplinen.length} Disziplin(en) dem Betreuer zugewiesen`
    });
  } else {
    res.status(500).json({
      success: false,
      error: updateResult.error || 'Fehler beim Aktualisieren des Betreuers'
    });
  }
}));

// Teams für Betreuer abrufen
router.get('/betreuer/:id/teams', asyncHandler(async (req, res) => {
  const result = await BetreuerController.getTeamsByBetreuer(req.params.id);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Abrufen der Teams für den Betreuer'
    });
  }
}));

// Teams für Betreuer festlegen
router.post('/betreuer/:id/teams', asyncHandler(async (req, res) => {
  if (!req.body.teams || !Array.isArray(req.body.teams)) {
    return res.status(400).json({
      success: false,
      error: 'Request muss ein teams Array enthalten'
    });
  }
  
  // Betreuer-Details abrufen, um Rolle zu prüfen
  const betreuerResult = await BetreuerController.getByIdWithAssignments(req.params.id);
  
  if (!betreuerResult.success) {
    return res.status(500).json({
      success: false,
      error: betreuerResult.error || 'Fehler beim Abrufen des Betreuers'
    });
  }
  
  // Update mit geänderten Feldern
  const updateData = {
    teams: req.body.teams
  };
  
  // Rolle auf laufend setzen, wenn nötig
  if (betreuerResult.data.ROLLE !== 'laufend') {
    updateData.ROLLE = 'laufend';
  }
  
  const updateResult = await BetreuerController.update(req.params.id, updateData);
  
  if (updateResult.success) {
    res.json({
      success: true,
      message: `${req.body.teams.length} Team(s) dem Betreuer zugewiesen`
    });
  } else {
    res.status(500).json({
      success: false,
      error: updateResult.error || 'Fehler beim Aktualisieren des Betreuers'
    });
  }
}));

// ===== TEAM-ROUTEN =====
// Alle Teams abrufen
router.get('/teams', asyncHandler(async (req, res) => {
  const result = await TeamController.getAll();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Team nach ID abrufen
router.get('/teams/:id', asyncHandler(async (req, res) => {
  const result = await TeamController.getById(req.params.id);
  if (result.success) {
    if (result.data.length === 0) {
      res.status(404).json({ success: false, error: 'Team nicht gefunden' });
    } else {
      res.json(result);
    }
  } else {
    res.status(500).json(result);
  }
}));

// Neues Team erstellen
router.post('/teams', asyncHandler(async (req, res) => {
  const result = await TeamController.create(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Team aktualisieren
router.put('/teams/:id', asyncHandler(async (req, res) => {
  const result = await TeamController.update(req.params.id, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Team löschen
router.delete('/teams/:id', asyncHandler(async (req, res) => {
  const result = await TeamController.delete(req.params.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Schüler für Team abrufen
router.get('/teams/:id/students', asyncHandler(async (req, res) => {
  const result = await SchuelerController.getByTeamId(req.params.id);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      error: result.error || 'Fehler beim Abrufen der Schüler für das Team'
    });
  }
}));

// Schüler zu Team zuweisen
router.post('/teams/:id/students', asyncHandler(async (req, res) => {
  const teamId = req.params.id;
  const { studentIds } = req.body;
  
  if (!studentIds || !Array.isArray(studentIds)) {
    return res.status(400).json({
      success: false,
      error: 'Request muss ein studentIds Array enthalten'
    });
  }
  
  // Jeder Schüler wird dem Team zugewiesen
  const promises = studentIds.map(studentId => 
    SchuelerController.update(studentId, { teamId })
  );
  
  try {
    await Promise.all(promises);
    
    res.json({
      success: true,
      message: `${studentIds.length} Schüler dem Team zugewiesen`
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || 'Fehler beim Zuweisen der Schüler zum Team'
    });
  }
}));

// ===== DISZIPLIN-ROUTEN =====
// Alle Disziplinen abrufen
router.get('/disziplins', asyncHandler(async (req, res) => {
  const result = await DisziplinController.getAll();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Disziplin nach ID abrufen
router.get('/disziplins/:id', asyncHandler(async (req, res) => {
  const result = await DisziplinController.getById(req.params.id);
  if (result.success) {
    if (result.data.length === 0) {
      res.status(404).json({ success: false, error: 'Disziplin nicht gefunden' });
    } else {
      res.json(result);
    }
  } else {
    res.status(500).json(result);
  }
}));

// Neue Disziplin erstellen
router.post('/disziplins', asyncHandler(async (req, res) => {
  const result = await DisziplinController.create(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Disziplin aktualisieren
router.put('/disziplins/:id', asyncHandler(async (req, res) => {
  const result = await DisziplinController.update(req.params.id, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Disziplin löschen
router.delete('/disziplins/:id', asyncHandler(async (req, res) => {
  const result = await DisziplinController.delete(req.params.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// ===== ERGEBNIS-ROUTEN =====
// Alle Ergebnisse abrufen
router.get('/ergebnisse', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.getAll();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Ergebnis nach ID abrufen
router.get('/ergebnisse/:id', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.getById(req.params.id);
  if (result.success) {
    if (result.data.length === 0) {
      res.status(404).json({ success: false, error: 'Ergebnis nicht gefunden' });
    } else {
      res.json(result);
    }
  } else {
    res.status(500).json(result);
  }
}));

// Ergebnisse nach Team-ID abrufen
router.get('/ergebnisse/team/:teamId', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.getByTeamId(req.params.teamId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Ergebnisse nach Disziplin-ID abrufen
router.get('/ergebnisse/disziplin/:disziplinId', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.getByDisziplinId(req.params.disziplinId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Neues Ergebnis erstellen
router.post('/ergebnisse', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.create(req.body);
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Ergebnis aktualisieren
router.put('/ergebnisse/:id', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.update(req.params.id, req.body);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// Ergebnis löschen
router.delete('/ergebnisse/:id', asyncHandler(async (req, res) => {
  const result = await ErgebnisController.delete(req.params.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// ===== STATION-ROUTEN =====
// Alle Stationen abrufen
router.get('/stations', StationController.getAll);
// Station nach ID abrufen
router.get('/stations/:id', StationController.getById);
// Neue Station erstellen
router.post('/stations', StationController.create);
// Station aktualisieren
router.put('/stations/:id', StationController.update);
// Station löschen
router.delete('/stations/:id', StationController.delete);

// ===== SCHEMAINFO-ROUTE =====
// Schema-Informationen abrufen
router.get('/schema/:tableName', asyncHandler(async (req, res) => {
  const result = await getTableSchema(req.params.tableName);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
}));

// ===== STUDENTPOINTS-ROUTE =====
// Schülerpunkte speichern
router.post('/studentpoints', asyncHandler(async (req, res) => {
  try {
    const { scores } = req.body;
    
    if (!scores || !Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Ungültige Punktedaten. Eine Liste von Schülerpunkten wird erwartet.'
      });
    }
    
    // Array für Ergebnisse
    const results = [];
    
    // Jeden Punkteeintrag verarbeiten
    for (const score of scores) {
      // Pflichtfelder prüfen
      if (!score.SCHUELERID || !score.DISZIPLINID || score.PUNKTE === undefined || score.PUNKTE === null) {
        return res.status(400).json({
          success: false,
          error: 'Jeder Punkteeintrag muss SCHUELERID, DISZIPLINID und PUNKTE enthalten'
        });
      }
      
      // Prüfen, ob bereits ein Eintrag für diesen Schüler und diese Disziplin existiert
      const existingResult = await ErgebnisController.getByStudentAndDiscipline(
        score.SCHUELERID, 
        score.DISZIPLINID
      );
      
      let result;
      
      if (existingResult.success && existingResult.data.length > 0) {
        // Vorhandenen Eintrag aktualisieren
        const existingId = existingResult.data[0].ERGEBNISID;
        result = await ErgebnisController.update(existingId, {
          SCHUELERID: score.SCHUELERID,
          DISZIPLINID: score.DISZIPLINID,
          PUNKTE: score.PUNKTE,
          TEAMID: score.TEAMID
        });
      } else {
        // Neuen Eintrag erstellen
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
        // Fehler, wenn ein Punkteeintrag nicht gespeichert werden kann
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
      error: 'Server-Fehler',
      message: err.message
    });
  }
}));

// ===== ALL-ROUTE =====
// Daten von allen Tabellen auf einmal abrufen
router.get('/all', asyncHandler(async (req, res) => {
  try {
    // Alle Abfragen parallel ausführen
    const [
      betreuerResult, 
      teamsResult, 
      disziplinsResult, 
      ergebnisseResult, 
      studentsResult
    ] = await Promise.all([
      BetreuerController.getAll(),
      TeamController.getAll(),
      DisziplinController.getAll(),
      ErgebnisController.getAll(),
      SchuelerController.getAll()
    ]);
    
    // Prüfen, ob alle Abfragen erfolgreich waren
    if (betreuerResult.success && 
        teamsResult.success && 
        disziplinsResult.success && 
        ergebnisseResult.success && 
        studentsResult.success) {
      
      // Alle Daten in einer Antwort zurückgeben
      res.json({
        success: true,
        data: {
          betreuer: betreuerResult.data || [],
          teams: teamsResult.data || [],
          disziplins: disziplinsResult.data || [],
          ergebnisse: ergebnisseResult.data || [],
          students: studentsResult.data || [],
          studentScores: (ergebnisseResult.data || []).filter(result => result.SCHUELERID)
        }
      });
    } else {
      // Fehler aus fehlgeschlagenen Abfragen sammeln
      const errors = [];
      if (!betreuerResult.success) errors.push(`Betreuer: ${betreuerResult.error}`);
      if (!teamsResult.success) errors.push(`Teams: ${teamsResult.error}`);
      if (!disziplinsResult.success) errors.push(`Disziplins: ${disziplinsResult.error}`);
      if (!ergebnisseResult.success) errors.push(`Ergebnisse: ${ergebnisseResult.error}`);
      if (!studentsResult.success) errors.push(`Students: ${studentsResult.error}`);
      
      res.status(500).json({
        success: false,
        error: 'Fehler beim Abrufen aller Daten',
        details: errors
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Server-Fehler',
      message: err.message
    });
  }
}));

// ===== AUTHENTIFIZIERUNGS-ROUTEN =====
// ===== AUTHENTIFIZIERUNGS-ROUTEN =====
// Importiere den Auth-Controller
const authController = require('./authController');

// Öffentliche Routen (ohne Authentifizierung)
// Login-Routen
router.post('/auth/login/betreuer', asyncHandler(async (req, res) => {
  await authController.loginBetreuer(req, res);
}));

router.post('/auth/login/admin', asyncHandler(async (req, res) => {
  await authController.loginAdmin(req, res);
}));

// Registrierungsrouten
router.post('/auth/register/betreuer', asyncHandler(async (req, res) => {
  await authController.registerBetreuer(req, res);
}));

router.post('/auth/register/admin', asyncHandler(async (req, res) => {
  await authController.registerAdmin(req, res);
}));

// Geschützte Routen - benötigen JWT Token
// Middleware anwenden für alle auth/* Routen außer login und register
router.use('/auth/(?!(login|register)).*', authController.authenticateToken);

// Routen für alle authentifizierten Benutzer
router.get('/auth/current-user', asyncHandler(async (req, res) => {
  await authController.getCurrentUser(req, res);
}));

// Passwort-Änderung (für eigene Accounts oder von Admins)
router.post('/auth/change-password/betreuer', asyncHandler(async (req, res) => {
  await authController.changeBetreuerPassword(req, res);
}));

router.post('/auth/change-password/admin', asyncHandler(async (req, res) => {
  await authController.changeAdminPassword(req, res);
}));

// Admin-only Routen - benötigen Admin-Rolle
router.use('/auth/admin', authController.requireAdmin);

// Benutzerverwaltungs-Routen (nur für Admins)
router.get('/auth/admin/betreuer', asyncHandler(async (req, res) => {
  await authController.getAllBetreuer(req, res);
}));

router.get('/auth/admin/admins', asyncHandler(async (req, res) => {
  await authController.getAllAdmins(req, res);
}));

router.delete('/auth/admin/betreuer/:id', asyncHandler(async (req, res) => {
  await authController.deleteBetreuer(req, res);
}));

router.delete('/auth/admin/admin/:id', asyncHandler(async (req, res) => {
  await authController.deleteAdmin(req, res);
}));


module.exports = router;