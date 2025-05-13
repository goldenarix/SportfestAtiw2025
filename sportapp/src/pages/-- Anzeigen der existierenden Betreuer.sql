-- Anzeigen der existierenden Betreuer
SELECT * FROM BETREUER ORDER BY BETREUERID;

-- Prüfen, ob Betreuer mit bestimmten Namen bereits existieren
SELECT NAME, COUNT(*) FROM BETREUER 
WHERE NAME IN ('LEW', 'Anna', 'Ina', 'HES', 'Sportlehrer', 'BOE', 'SEPE', 'GEM')
GROUP BY NAME;

-- Wenn die Daten nicht angezeigt werden, obwohl sie existieren sollten:
-- 1. COMMIT ausführen, um Änderungen zu bestätigen
COMMIT;

-- 2. Alternative Einfüge-Methode mit höherem Start-ID-Wert
-- Wir verwenden eine hohe Start-ID (1000), um Konflikte zu vermeiden
DECLARE
  v_max_id NUMBER;
  v_name VARCHAR2(50);
  v_names SYS.ODCIVARCHAR2LIST := SYS.ODCIVARCHAR2LIST(
    'LEW', 'Anna', 'Ina', 'HES', 'Sportlehrer', 'BOE', 'SEPE', 'GEM', 'BUN', 'LOR',
    'MAR', 'STF', 'SAL', 'MUE', 'FES', 'HNK', 'SIG', 'SON', 'DRO', 'STR',
    'WEL', 'LES', 'MEY', 'HAP', 'PAN'
  );
BEGIN
  -- Höchste ID finden
  SELECT NVL(MAX(BETREUERID), 1000) INTO v_max_id FROM BETREUER;
  
  -- Daten einfügen, wenn nicht vorhanden
  FOR i IN 1..v_names.COUNT LOOP
    v_name := v_names(i);
    
    -- Prüfen ob Name bereits existiert
    IF NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = v_name) THEN
      -- Neue ID und Name einfügen
      v_max_id := v_max_id + 1;
      
      -- Debug-Ausgabe
      DBMS_OUTPUT.PUT_LINE('Füge ein: ' || v_max_id || ' - ' || v_name);
      
      -- Einfügen
      INSERT INTO BETREUER (BETREUERID, NAME) VALUES (v_max_id, v_name);
    ELSE
      DBMS_OUTPUT.PUT_LINE('Überspringe: ' || v_name || ' (bereits vorhanden)');
    END IF;
  END LOOP;
  
  -- Änderungen bestätigen
  COMMIT;
END;
/

-- Alternative Methode mit einzelnen Statements, falls PL/SQL nicht funktioniert
-- Alle Betreuer mit hohen IDs einfügen, um Konflikte zu vermeiden
-- Wir verwenden 2000+ als Startwert

-- LEW einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2001, 'LEW' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'LEW');

-- Anna einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2002, 'Anna' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'Anna');

-- Ina einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2003, 'Ina' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'Ina');

-- HES einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2004, 'HES' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'HES');

-- Sportlehrer einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2005, 'Sportlehrer' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'Sportlehrer');

-- BOE einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2006, 'BOE' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'BOE');

-- SEPE einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2007, 'SEPE' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'SEPE');

-- GEM einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2008, 'GEM' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'GEM');

-- BUN einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2009, 'BUN' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'BUN');

-- LOR einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2010, 'LOR' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'LOR');

-- MAR einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2011, 'MAR' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'MAR');

-- STF einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2012, 'STF' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'STF');

-- SAL einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2013, 'SAL' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'SAL');

-- MUE einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2014, 'MUE' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'MUE');

-- FES einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2015, 'FES' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'FES');

-- HNK einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2016, 'HNK' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'HNK');

-- SIG einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2017, 'SIG' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'SIG');

-- SON einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2018, 'SON' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'SON');

-- DRO einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2019, 'DRO' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'DRO');

-- STR einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2020, 'STR' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'STR');

-- WEL einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2021, 'WEL' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'WEL');

-- LES einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2022, 'LES' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'LES');

-- MEY einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2023, 'MEY' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'MEY');

-- HAP einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2024, 'HAP' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'HAP');

-- PAN einfügen, wenn nicht vorhanden
INSERT INTO BETREUER (BETREUERID, NAME)
SELECT 2025, 'PAN' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM BETREUER WHERE NAME = 'PAN');

-- Änderungen dauerhaft speichern
COMMIT;

-- Prüfen, ob Daten jetzt vorhanden sind
SELECT * FROM BETREUER ORDER BY BETREUERID;