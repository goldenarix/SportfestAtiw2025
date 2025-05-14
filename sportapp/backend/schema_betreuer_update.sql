-- Schema Update Script für Betreuer-Zuweisungen
-- Dieses Skript aktualisiert das Datenbankschema für die erweiterten Betreuer-Funktionen:
-- 1. Fügt ROLLE zur BETREUER-Tabelle hinzu
-- 2. Erstellt Verknüpfungstabellen für BETREUER_DISZIPLIN und BETREUER_TEAM
-- 3. Migriert bestehende Beziehungen
-- 4. Entfernt BETREUERID aus der TEAM-Tabelle
-- 5. Erstellt Hilfsviews für besseren Datenzugriff

-- 1. ROLLE-Spalte zur BETREUER-Tabelle hinzufügen falls noch nicht existiert
BEGIN
  DECLARE
    v_column_exists NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_column_exists
    FROM user_tab_columns 
    WHERE table_name = 'BETREUER' AND column_name = 'ROLLE';
    
    IF v_column_exists = 0 THEN
      EXECUTE IMMEDIATE 'ALTER TABLE BETREUER ADD ROLLE VARCHAR2(20) DEFAULT ''stationaer''';
      EXECUTE IMMEDIATE 'COMMENT ON COLUMN BETREUER.ROLLE IS ''Rolle des Betreuers (stationaer oder laufend)''';
      DBMS_OUTPUT.PUT_LINE('ROLLE-Spalte zur BETREUER-Tabelle hinzugefügt');
    ELSE
      DBMS_OUTPUT.PUT_LINE('ROLLE-Spalte existiert bereits');
    END IF;
  END;
END;
/

-- 2. Erstellung der BETREUER_DISZIPLIN-Tabelle
CREATE TABLE BETREUER_DISZIPLIN (
  ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  BETREUERID NUMBER NOT NULL,
  DISZIPLINID NUMBER NOT NULL,
  CONSTRAINT FK_BD_BETREUER FOREIGN KEY (BETREUERID) REFERENCES BETREUER(BETREUERID),
  CONSTRAINT FK_BD_DISZIPLIN FOREIGN KEY (DISZIPLINID) REFERENCES DISZIPLIN(DISZIPLINID),
  CONSTRAINT UQ_BETREUER_DISZIPLIN UNIQUE (BETREUERID, DISZIPLINID)
);

COMMENT ON TABLE BETREUER_DISZIPLIN IS 'Verknüpfungstabelle zwischen Betreuern und ihren zugewiesenen Disziplinen (für stationäre Betreuer)';

-- 3. Erstellung der BETREUER_TEAM-Tabelle
CREATE TABLE BETREUER_TEAM (
  ID NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  BETREUERID NUMBER NOT NULL,
  TEAMID NUMBER NOT NULL,
  CONSTRAINT FK_BT_BETREUER FOREIGN KEY (BETREUERID) REFERENCES BETREUER(BETREUERID),
  CONSTRAINT FK_BT_TEAM FOREIGN KEY (TEAMID) REFERENCES TEAM(TEAMID),
  CONSTRAINT UQ_BETREUER_TEAM UNIQUE (BETREUERID, TEAMID)
);

COMMENT ON TABLE BETREUER_TEAM IS 'Verknüpfungstabelle zwischen Betreuern und ihren zugewiesenen Teams (für laufende Betreuer)';

-- 4. Migration der bestehenden Betreuer-Team-Beziehungen
-- WICHTIG: Nur ausführen, wenn BETREUERID noch in der TEAM-Tabelle existiert
BEGIN
  DECLARE
    v_column_exists NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_column_exists
    FROM user_tab_columns 
    WHERE table_name = 'TEAM' AND column_name = 'BETREUERID';
    
    IF v_column_exists > 0 THEN
      -- Teams mit Betreuer-Zuweisungen in die neue Verknüpfungstabelle kopieren
      EXECUTE IMMEDIATE '
        INSERT INTO BETREUER_TEAM (BETREUERID, TEAMID)
        SELECT BETREUERID, TEAMID FROM TEAM
        WHERE BETREUERID IS NOT NULL
      ';
      
      -- Rollen für zugewiesene Betreuer auf "laufend" setzen basierend auf TEAM-Zuordnung
      EXECUTE IMMEDIATE '
        UPDATE BETREUER b
        SET b.ROLLE = ''laufend''
        WHERE EXISTS (
          SELECT 1 FROM TEAM t
          WHERE t.BETREUERID = b.BETREUERID
        )
      ';
      
      DBMS_OUTPUT.PUT_LINE('Bestehende Betreuer-Team-Beziehungen wurden migriert');
    ELSE
      DBMS_OUTPUT.PUT_LINE('BETREUERID-Spalte in TEAM existiert nicht mehr, keine Migration nötig');
    END IF;
  END;
END;
/

-- 5. BETREUERID-Spalte aus der TEAM-Tabelle entfernen
BEGIN
  DECLARE
    v_column_exists NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_column_exists
    FROM user_tab_columns 
    WHERE table_name = 'TEAM' AND column_name = 'BETREUERID';
    
    IF v_column_exists > 0 THEN
      EXECUTE IMMEDIATE 'ALTER TABLE TEAM DROP COLUMN BETREUERID';
      DBMS_OUTPUT.PUT_LINE('BETREUERID-Spalte aus der TEAM-Tabelle entfernt');
    ELSE
      DBMS_OUTPUT.PUT_LINE('BETREUERID-Spalte existiert nicht mehr in der TEAM-Tabelle');
    END IF;
  END;
END;
/

-- 6. View für Betreuer-Zuweisungen erstellen
CREATE OR REPLACE VIEW V_BETREUER_ASSIGNMENTS AS
SELECT 
  b.BETREUERID,
  b.NAME AS BETREUER_NAME,
  b.ROLLE,
  t.TEAMID,
  t.NAME AS TEAM_NAME,
  d.DISZIPLINID,
  d.NAME AS DISZIPLIN_NAME
FROM 
  BETREUER b
LEFT JOIN BETREUER_TEAM bt ON b.BETREUERID = bt.BETREUERID
LEFT JOIN TEAM t ON bt.TEAMID = t.TEAMID
LEFT JOIN BETREUER_DISZIPLIN bd ON b.BETREUERID = bd.BETREUERID
LEFT JOIN DISZIPLIN d ON bd.DISZIPLINID = d.DISZIPLINID;

-- 7. View für Schüler-Team-Zuweisungen erstellen
CREATE OR REPLACE VIEW V_STUDENT_TEAM AS
SELECT 
  s.SCHUELERID,
  s.VORNAME,
  s.NACHNAME,
  s.GEBURTSDATUM,
  s.GESCHLECHT,
  s.KLASSE,
  s.TEAMID,
  t.NAME AS TEAM_NAME
FROM 
  SCHUELER s
LEFT JOIN TEAM t ON s.TEAMID = t.TEAMID;

-- Commit Änderungen
COMMIT;

-- Ende des Skripts
