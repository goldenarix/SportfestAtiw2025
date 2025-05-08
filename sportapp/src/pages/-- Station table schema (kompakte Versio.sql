-- Station table schema (kompakte Version wegen Speicherplatzproblemen)
CREATE TABLE Station (
    STATIONID NUMBER PRIMARY KEY,
    NAME VARCHAR2(100) NOT NULL,
    BESCHREIBUNG VARCHAR2(200),
    ORT VARCHAR2(50),
    AKTIV CHAR(1) DEFAULT 'Y' CHECK (AKTIV IN ('Y', 'N'))
);

-- Minimale Testdaten
INSERT INTO Station (STATIONID, NAME, BESCHREIBUNG, ORT, AKTIV) 
VALUES (1, 'Station 1', 'Laufbahn', 'Sportplatz Nord', 'Y');

INSERT INTO Station (STATIONID, NAME, BESCHREIBUNG, ORT, AKTIV) 
VALUES (2, 'Station 2', 'Weitsprung', 'Sportplatz Ost', 'Y');

COMMIT;