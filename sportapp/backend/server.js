// server.js - Hauptanwendungsdatei
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initialize } = require('./dbController');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Erweiterte CORS-Einrichtung
app.use(cors({
  origin: '*', // Alle Ursprünge während der Entwicklung erlauben
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Für Debugging, alle Anfragen protokollieren
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// JSON-Anfragen parsen
app.use(express.json());

// Gesundheitscheck-Endpunkt
app.get('/', (req, res) => {
  res.json({ message: 'Backend-Server läuft', version: '1.0' });
});

// API-Routen verwenden
app.use('/api', apiRoutes);

// Fehlerbehandlung-Middleware
app.use((err, req, res, next) => {
  console.error('Unbehandelter Fehler:', err);
  res.status(500).json({
    success: false,
    error: 'Serverfehler',
    message: err.message
  });
});

// Server starten und Datenbank initialisieren
async function startServer() {
  try {
    // Oracle-Verbindungspool initialisieren
    await initialize();
    
    // Auf Anfragen warten
    app.listen(PORT, () => {
      console.log(`Server läuft auf Port ${PORT}`);
      console.log(`Lokale API verfügbar unter: http://localhost:${PORT}/api`);
      console.log(`Web-Service-API verfügbar unter: https://padersport-api.onrender.com/api`);
      console.log(`Verfügbare Endpunkte:`);
      console.log(`  GET    /api/betreuer           - Alle Betreuer abrufen`);
      console.log(`  GET    /api/betreuer/:id       - Betreuer nach ID abrufen`);
      console.log(`  POST   /api/betreuer           - Neuen Betreuer erstellen`);
      console.log(`  PUT    /api/betreuer/:id       - Betreuer aktualisieren`);
      console.log(`  DELETE /api/betreuer/:id       - Betreuer löschen`);
      console.log(`  GET    /api/teams              - Alle Teams abrufen`);
      console.log(`  GET    /api/teams/:id          - Team nach ID abrufen`);
      console.log(`  POST   /api/teams              - Neues Team erstellen`);
      console.log(`  PUT    /api/teams/:id          - Team aktualisieren`);
      console.log(`  DELETE /api/teams/:id          - Team löschen`);
      console.log(`  GET    /api/disziplins         - Alle Disziplinen abrufen`);
      console.log(`  GET    /api/disziplins/:id     - Disziplin nach ID abrufen`);
      console.log(`  POST   /api/disziplins         - Neue Disziplin erstellen`);
      console.log(`  PUT    /api/disziplins/:id     - Disziplin aktualisieren`);
      console.log(`  DELETE /api/disziplins/:id     - Disziplin löschen`);
      console.log(`  GET    /api/ergebnisse         - Alle Ergebnisse abrufen`);
      console.log(`  GET    /api/ergebnisse/:id     - Ergebnis nach ID abrufen`);
      console.log(`  GET    /api/ergebnisse/team/:teamId - Ergebnisse nach Team-ID abrufen`);
      console.log(`  GET    /api/ergebnisse/disziplin/:disziplinId - Ergebnisse nach Disziplin-ID abrufen`);
      console.log(`  POST   /api/ergebnisse         - Neues Ergebnis erstellen`);
      console.log(`  PUT    /api/ergebnisse/:id     - Ergebnis aktualisieren`);
      console.log(`  DELETE /api/ergebnisse/:id     - Ergebnis löschen`);
      console.log(`  GET    /api/schueler           - Alle Schüler abrufen`);
      console.log(`  GET    /api/schueler/:id       - Schüler nach ID abrufen`);
      console.log(`  POST   /api/schueler           - Neuen Schüler erstellen`);
      console.log(`  PUT    /api/schueler/:id       - Schüler aktualisieren`);
      console.log(`  DELETE /api/schueler/:id       - Schüler löschen`);
      console.log(`  GET    /api/all                - Alle Daten auf einmal abrufen`);
    });
  } catch (err) {
    console.error('Fehler beim Starten des Servers:', err);
    process.exit(1);
  }
}

// Server ausführen
startServer();