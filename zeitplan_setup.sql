-- Oracle SQL Script for ZEITPLAN Table and Dummy Data

-- Good practice to avoid issues with '&' in comments or data
SET DEFINE OFF;

-- Drop existing objects (optional, for clean setup)
BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE ZEITPLAN';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -942 THEN
      RAISE;
    END IF;
END;
/

BEGIN
  EXECUTE IMMEDIATE 'DROP SEQUENCE zeitplan_seq';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -2289 THEN
      RAISE;
    END IF;
END;
/

-- --------------------------------------------------------------------------------
-- Optional Section: Create TEAM and DISZIPLIN tables with dummy data
-- --------------------------------------------------------------------------------
-- Uncomment and adapt this section if your TEAM and DISZIPLIN tables do not exist
-- or if you want to ensure some sample data is present for testing.
-- If these tables already exist and are populated, you can skip this section.
-- Make sure the TEAMID and DISZIPLINID values used in the ZEITPLAN dummy data
-- below match existing IDs in your TEAM and DISZIPLIN tables.
-- --------------------------------------------------------------------------------
/*
-- Create TEAM table (minimal example based on your ERD)
CREATE TABLE TEAM (
    TEAMID NUMBER NOT NULL PRIMARY KEY,
    NAME VARCHAR2(100 CHAR) NOT NULL UNIQUE
);

-- Create DISZIPLIN table (minimal example based on your ERD)
CREATE TABLE DISZIPLIN (
    DISZIPLINID NUMBER NOT NULL PRIMARY KEY,
    NAME VARCHAR2(100 CHAR) NOT NULL UNIQUE,
    BESCHREIBUNG VARCHAR2(255 CHAR)
);

-- Insert dummy TEAM data
INSERT INTO TEAM (TEAMID, NAME) VALUES (1, 'Die flotten Geparden');
INSERT INTO TEAM (TEAMID, NAME) VALUES (2, 'Die springenden Kängurus');
INSERT INTO TEAM (TEAMID, NAME) VALUES (3, 'Die listigen Füchse');
INSERT INTO TEAM (TEAMID, NAME) VALUES (4, 'Die starken Bären');
INSERT INTO TEAM (TEAMID, NAME) VALUES (5, 'Die schnellen Adler');

-- Insert dummy DISZIPLIN data
INSERT INTO DISZIPLIN (DISZIPLINID, NAME, BESCHREIBUNG) VALUES (1, '100m Sprint', 'Kurzstreckenlauf auf der Tartanbahn');
INSERT INTO DISZIPLIN (DISZIPLINID, NAME, BESCHREIBUNG) VALUES (2, 'Weitsprung', 'Anlauf und Sprung in die Sandgrube');
INSERT INTO DISZIPLIN (DISZIPLINID, NAME, BESCHREIBUNG) VALUES (3, 'Kugelstoßen', 'Stoßen einer Eisenkugel auf Weite');
INSERT INTO DISZIPLIN (DISZIPLINID, NAME, BESCHREIBUNG) VALUES (4, 'Hochsprung', 'Überqueren einer Latte');
INSERT INTO DISZIPLIN (DISZIPLINID, NAME, BESCHREIBUNG) VALUES (5, 'Staffellauf 4x100m', 'Team-Laufdisziplin');

COMMIT;
*/
-- --------------------------------------------------------------------------------
-- End of Optional Section
-- --------------------------------------------------------------------------------

-- Create ZEITPLAN table
CREATE TABLE ZEITPLAN (
    ZEITPLANID NUMBER NOT NULL,
    TEAMID NUMBER NOT NULL,
    DISZIPLINID NUMBER NOT NULL,
    STARTZEIT TIMESTAMP NOT NULL,
    ENDEZEIT TIMESTAMP NOT NULL,
    ORT VARCHAR2(255 CHAR),
    NOTIZ VARCHAR2(1000 CHAR),
    CONSTRAINT pk_zeitplan PRIMARY KEY (ZEITPLANID),
    CONSTRAINT fk_zeitplan_team FOREIGN KEY (TEAMID) REFERENCES TEAM(TEAMID) ON DELETE CASCADE,
    CONSTRAINT fk_zeitplan_disziplin FOREIGN KEY (DISZIPLINID) REFERENCES DISZIPLIN(DISZIPLINID) ON DELETE CASCADE,
    CONSTRAINT chk_zeitplan_endzeit CHECK (ENDEZEIT > STARTZEIT)
);

COMMENT ON COLUMN ZEITPLAN.ZEITPLANID IS 'Primärschlüssel für den Zeitplaneintrag';
COMMENT ON COLUMN ZEITPLAN.TEAMID IS 'Fremdschlüssel zur TEAM Tabelle';
COMMENT ON COLUMN ZEITPLAN.DISZIPLINID IS 'Fremdschlüssel zur DISZIPLIN Tabelle';
COMMENT ON COLUMN ZEITPLAN.STARTZEIT IS 'Startzeitpunkt der Aktivität';
COMMENT ON COLUMN ZEITPLAN.ENDEZEIT IS 'Endzeitpunkt der Aktivität';
COMMENT ON COLUMN ZEITPLAN.ORT IS 'Austragungsort der Aktivität (optional)';
COMMENT ON COLUMN ZEITPLAN.NOTIZ IS 'Zusätzliche Notizen zur Aktivität (optional)';

-- Create sequence for ZEITPLANID
CREATE SEQUENCE zeitplan_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

-- Create trigger to auto-populate ZEITPLANID from sequence
CREATE OR REPLACE TRIGGER trg_zeitplan_pk
BEFORE INSERT ON ZEITPLAN
FOR EACH ROW
BEGIN
  IF :NEW.ZEITPLANID IS NULL THEN
    SELECT zeitplan_seq.NEXTVAL
    INTO :NEW.ZEITPLANID
    FROM DUAL;
  END IF;
END;
/

-- Insert dummy data into ZEITPLAN
-- IMPORTANT: 
-- 1. Ensure the TEAMID and DISZIPLINID values below correspond to actual IDs
--    in your TEAM and DISZIPLIN tables. If you used the optional section above,
--    IDs 1-5 for teams and 1-5 for disciplines should exist.
-- 2. Change the date '2024-07-20' to the desired date for your sportfest.

INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (1, 1, TO_TIMESTAMP('2024-07-20 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 08:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Stadion - Bahn 1', 'Aufwärmen und erste Runde Sprint');

INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (2, 1, TO_TIMESTAMP('2024-07-20 08:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Stadion - Bahn 2', 'Sprint Gruppe B');

INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (3, 2, TO_TIMESTAMP('2024-07-20 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'Sprunggrube West', 'Weitsprung Qualifikation');

INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (4, 3, TO_TIMESTAMP('2024-07-20 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'Wurffeld Nord', 'Kugelstoßen Herren');

INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (1, 4, TO_TIMESTAMP('2024-07-20 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Hochsprunganlage', 'Hochsprung Gruppe A');

INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (5, 5, TO_TIMESTAMP('2024-07-20 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Stadion - Rundbahn', 'Staffellauf Vorläufe');

INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (2, 2, TO_TIMESTAMP('2024-07-20 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 11:45:00', 'YYYY-MM-DD HH24:MI:SS'), 'Sprunggrube Ost', 'Weitsprung Finale Damen');

-- Example for later in the day
INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (3, 5, TO_TIMESTAMP('2024-07-20 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 16:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Stadion - Rundbahn', 'Staffellauf Finale');

-- Example for end of the day
INSERT INTO ZEITPLAN (TEAMID, DISZIPLINID, STARTZEIT, ENDEZEIT, ORT, NOTIZ)
VALUES (1, 3, TO_TIMESTAMP('2024-07-20 20:30:00', 'YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2024-07-20 21:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Hauptbühne', 'Siegerehrung und Abschlussfeier');


COMMIT;

-- Verify data
SELECT * FROM ZEITPLAN ORDER BY STARTZEIT;

SELECT 
    t.NAME AS TEAM_NAME, 
    d.NAME AS DISZIPLIN_NAME, 
    z.STARTZEIT, 
    z.ENDEZEIT, 
    z.ORT, 
    z.NOTIZ
FROM ZEITPLAN z
JOIN TEAM t ON z.TEAMID = t.TEAMID
JOIN DISZIPLIN d ON z.DISZIPLINID = d.DISZIPLINID
ORDER BY z.STARTZEIT, t.NAME;

PROMPT ZEITPLAN table and dummy data created successfully. 