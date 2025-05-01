-- Organisator table schema for admin users
CREATE TABLE Organisator (
    ID NUMBER PRIMARY KEY,
    NAME VARCHAR2(100) NOT NULL,
    USERNAME VARCHAR2(50) UNIQUE NOT NULL,
    PASSWORD VARCHAR2(100) NOT NULL
);

-- Add initial admin user 
INSERT INTO Organisator (ID, NAME, USERNAME, PASSWORD) 
VALUES (1, 'Admin', 'admin', 'password123');

COMMIT;
