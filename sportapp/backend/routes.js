// routes.js - Konsolidierte Routen-Definitionen
const express = require('express');
const router = express.Router();
const multer = require('multer'); // For file uploads
const xlsx = require('xlsx'); // For Excel parsing
const {
  BetreuerController,
  TeamController,
  DisziplinController,
  ErgebnisController,
  SchuelerController,
  StationController,
  ZeitplanController, // Ensure ZeitplanController is imported
  getTableSchema
} = require('./dbController');

const authController = require('./authController');
// Middleware zur Fehlerbehandlung
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Multer setup for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ===== ZEITPLAN-ROUTEN =====

// Alle Zeitplan-Einträge abrufen
router.get('/zeitplan', asyncHandler(async (req, res) => {
  const result = await ZeitplanController.getAll();
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({ success: false, error: result.error || 'Fehler beim Abrufen des Zeitplans' });
  }
}));

// Zeitplan-Einträge für ein bestimmtes Team abrufen
router.get('/zeitplan/team/:teamId', asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  if (isNaN(teamId)) {
    return res.status(400).json({ success: false, error: 'Ungültige Team ID' });
  }
  const result = await ZeitplanController.getByTeamId(teamId);
  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({ success: false, error: result.error || 'Fehler beim Abrufen des Zeitplans für das Team' });
  }
}));

// Zeitplan aus Excel-Datei importieren (nur für Admins)
router.post('/zeitplan/import',
  authController.authenticateToken,
  authController.requireAdmin,
  upload.single('zeitplanFile'), // 'zeitplanFile' should be the name attribute of your file input
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Keine Datei hochgeladen' });
    }

    try {
      // 1. Fetch Teams and Disciplines for Name-to-ID mapping
      const teamsResult = await TeamController.getAll();
      const disziplinsResult = await DisziplinController.getAll();

      if (!teamsResult.success || !disziplinsResult.success) {
        return res.status(500).json({ success: false, error: 'Fehler beim Abrufen von Team- oder Disziplindaten für den Import' });
      }

      const teamsMap = new Map(teamsResult.data.map(team => [team.NAME.toLowerCase(), team.TEAMID]));
      const disziplinsMap = new Map(disziplinsResult.data.map(d => [d.NAME.toLowerCase(), d.DISZIPLINID]));

      // 2. Parse Excel
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // header:1 to get array of arrays

      if (jsonData.length < 2) { // Header + at least one data row
        return res.status(400).json({ success: false, error: 'Die Excel-Datei ist leer oder hat kein gültiges Format.' });
      }
      
      const headerRow = jsonData[0].map(h => String(h).trim().toLowerCase());
      const expectedHeaders = ['team name', 'discipline name', 'start time', 'duration (minutes)'];
      const optionalHeaders = ['location', 'notes'];

      // Validate headers (simple check, can be more robust)
      const requiredHeaderCheck = expectedHeaders.every(eh => headerRow.includes(eh));
      if (!requiredHeaderCheck) {
          return res.status(400).json({ success: false, error: `Fehlende Spaltenüberschriften. Erwartet: ${expectedHeaders.join(', ')}`});
      }

      // Get column indices
      const teamNameIndex = headerRow.indexOf('team name');
      const disciplineNameIndex = headerRow.indexOf('discipline name');
      const startTimeIndex = headerRow.indexOf('start time');
      const durationIndex = headerRow.indexOf('duration (minutes)');
      const locationIndex = headerRow.indexOf('location');
      const notesIndex = headerRow.indexOf('notes');

      const entries = [];
      const importDate = new Date(); // Assuming Sportfest is today
      const year = importDate.getFullYear();
      const month = String(importDate.getMonth() + 1).padStart(2, '0');
      const day = String(importDate.getDate()).padStart(2, '0');
      const sportfestDateStr = `${year}-${month}-${day}`;

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row.length === 0 || row.every(cell => cell === null || String(cell).trim() === '')) continue; // Skip empty rows

        const teamName = String(row[teamNameIndex] || '').trim();
        const disciplineName = String(row[disciplineNameIndex] || '').trim();
        const startTimeStr = String(row[startTimeIndex] || '').trim(); // e.g., "09:00" or 0.375 for Excel time
        const durationMinutes = parseInt(row[durationIndex], 10);
        
        const location = (locationIndex !== -1 && row[locationIndex]) ? String(row[locationIndex]).trim() : null;
        const notes = (notesIndex !== -1 && row[notesIndex]) ? String(row[notesIndex]).trim() : null;

        if (!teamName || !disciplineName || !startTimeStr || isNaN(durationMinutes)) {
          console.warn(`Zeile ${i + 1} übersprungen: Unvollständige Pflichtdaten - Team: '${teamName}', Disziplin: '${disciplineName}', Start: '${startTimeStr}', Dauer: ${row[durationIndex]}`);
          continue;
        }

        const TEAMID = teamsMap.get(teamName.toLowerCase());
        const DISZIPLINID = disziplinsMap.get(disciplineName.toLowerCase());

        if (!TEAMID) {
          console.warn(`Zeile ${i + 1} übersprungen: Team "${teamName}" nicht gefunden.`);
          continue;
        }
        if (!DISZIPLINID) {
          console.warn(`Zeile ${i + 1} übersprungen: Disziplin "${disciplineName}" nicht gefunden.`);
          continue;
        }
        
        let hours, minutes;
        if (typeof row[startTimeIndex] === 'number' && row[startTimeIndex] < 1) { // Excel time value (fraction of a day)
            const excelTime = row[startTimeIndex];
            const totalMinutes = Math.round(excelTime * 24 * 60);
            hours = Math.floor(totalMinutes / 60);
            minutes = totalMinutes % 60;
        } else if (typeof startTimeStr === 'string' && startTimeStr.includes(':')) { // "HH:mm" string
            [hours, minutes] = startTimeStr.split(':').map(Number);
        } else {
            console.warn(`Zeile ${i + 1} übersprungen: Ungültiges Startzeitformat "${startTimeStr}". Erwartet "HH:mm" oder Excel-Zeitwert.`);
            continue;
        }

        if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            console.warn(`Zeile ${i + 1} übersprungen: Ungültige Startzeitwerte nach Parse "${startTimeStr}".`);
            continue;
        }

        const startDate = new Date(importDate.getFullYear(), importDate.getMonth(), importDate.getDate(), hours, minutes, 0);
        const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

        const formatDateTime = (dateObj) => {
          const YYYY = dateObj.getFullYear();
          const MM = String(dateObj.getMonth() + 1).padStart(2, '0');
          const DD = String(dateObj.getDate()).padStart(2, '0');
          const HH = String(dateObj.getHours()).padStart(2, '0');
          const MIN = String(dateObj.getMinutes()).padStart(2, '0');
          const SS = String(dateObj.getSeconds()).padStart(2, '0');
          return `${YYYY}-${MM}-${DD} ${HH}:${MIN}:${SS}`;
        };
        
        entries.push({
          TEAMID,
          DISZIPLINID,
          STARTZEIT: formatDateTime(startDate),
          ENDEZEIT: formatDateTime(endDate),
          ORT: location,
          NOTIZ: notes
        });
      }

      if (entries.length === 0) {
        return res.status(400).json({ success: false, error: 'Keine gültigen Einträge in der Excel-Datei gefunden oder alle Zeilen hatten Fehler.' });
      }

      // 3. Delete existing Zeitplan entries
      const deleteResult = await ZeitplanController.deleteAll();
      if (!deleteResult.success) {
        return res.status(500).json({ success: false, error: 'Fehler beim Löschen des alten Zeitplans: ' + deleteResult.error });
      }

      // 4. Bulk insert new entries
      const importResult = await ZeitplanController.createBulk(entries);
      if (importResult.success) {
        res.json({ success: true, message: `${importResult.rowsAffected} Zeitplan-Einträge erfolgreich importiert.` });
      } else {
        res.status(500).json({ success: false, error: 'Fehler beim Importieren des Zeitplans: ' + importResult.error });
      }

    } catch (error) {
      console.error('Fehler beim Zeitplan-Import:', error);
      res.status(500).json({ success: false, error: 'Serverfehler beim Import: ' + error.message });
    }
  })
);

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
          schueler: studentsResult.data || [],
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
      if (!studentsResult.success) errors.push(`Schueler: ${studentsResult.error}`);
      
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

module.exports = router;