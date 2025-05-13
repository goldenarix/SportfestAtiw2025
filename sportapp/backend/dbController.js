// dbController.js
require('dotenv').config();
const oracledb = require('oracledb');

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_SERVER})(PORT=${process.env.DB_PORT}))(CONNECT_DATA=(SID=${process.env.DB_SID})))`
};

// Initialize connection pool for better performance
async function initialize() {
  try {
    await oracledb.createPool({
      ...dbConfig,
      poolAlias: 'appPool',
      poolIncrement: 1,
      poolMin: 1,
      poolMax: 5,
      poolTimeout: 60
    });
    console.log('Connection pool created successfully');
  } catch (err) {
    console.error('Error creating connection pool:', err);
    throw err;
  }
}

// Execute a query and handle connections
async function executeQuery(query, params = [], options = {}) {
  let connection;
  try {
    // Get connection from pool
    connection = await oracledb.getConnection('appPool');
    
    // Set default options
    const queryOptions = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options
    };
    
    // Execute query
    const result = await connection.execute(query, params, queryOptions);
    return { success: true, data: result.rows, metadata: result.metaData };
  } catch (err) {
    console.error('Database query error:', err);
    return { success: false, error: err.message };
  } finally {
    // Release connection back to the pool
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}





// BETREUER table operations mit manueller ID-Generierung
const BetreuerController = {
  // Get all betreuer
  getAll: async () => {
    return await executeQuery('SELECT * FROM Betreuer ORDER BY BETREUERID');
  },
  
  // Get betreuer by ID
  getById: async (id) => {
    return await executeQuery(
      'SELECT * FROM Betreuer WHERE BETREUERID = :id',
      [id]
    );
  },
  
  // Get betreuer by name
  getByName: async (name) => {
    return await executeQuery(
      'SELECT * FROM Betreuer WHERE NAME = :name',
      [name]
    );
  },
  
  // Create new betreuer with debugging and manual ID - now with ROLLE support
  create: async (betreuer) => {
    let connection;
    
    try {
      console.log('Creating new Betreuer with data:', betreuer);
      
      // Get connection directly for better control
      connection = await oracledb.getConnection('appPool');
      
      // 1. Get next ID from max ID in table
      const getMaxIdResult = await connection.execute(
        'SELECT NVL(MAX(BETREUERID), 0) + 1 as NEXT_ID FROM Betreuer',
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      
      const nextId = getMaxIdResult.rows[0].NEXT_ID;
      console.log('Next Betreuer ID:', nextId);
      
      // 2. Insert with explicit ID - now includes ROLLE
      const insertQuery = `INSERT INTO Betreuer (BETREUERID, NAME, PASSWORT, ROLLE) 
                           VALUES (:id, :name, :passwort, :rolle)`;
      
      console.log('Insert query:', insertQuery);
      
      // Ensure we have values for required fields
      const name = betreuer.NAME || betreuer.name || 'Neuer Betreuer';
      const passwort = betreuer.PASSWORT || betreuer.passwort || 'password123';
      const rolle = betreuer.ROLLE || betreuer.rolle || 'stationaer'; // Default to stationaer
      
      const binds = {
        id: nextId,
        name: name,
        passwort: passwort,
        rolle: rolle
      };
      
      console.log('Binds:', binds);
      
      const insertResult = await connection.execute(
        insertQuery,
        binds,
        { autoCommit: true }
      );
      
      console.log('Insert result:', insertResult);
      
      // For simple cases, let the extended controller handle assignments
      return { 
        success: true, 
        id: nextId,
        rowsAffected: insertResult.rowsAffected
      };
    } catch (err) {
      console.error('Error creating Betreuer:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },
  
  // Update betreuer with debugging - now with ROLLE support
  update: async (id, betreuer) => {
    console.log('Updating Betreuer:', id, betreuer);
    
    let connection;
    
    try {
      // Get connection directly for better control
      connection = await oracledb.getConnection('appPool');
      
      // Build dynamic SET clause based on provided fields
      let setClauses = [];
      let binds = { id: id };
      
      // Handle both uppercase and lowercase field names for flexibility
      if (betreuer.NAME !== undefined || betreuer.name !== undefined) {
        setClauses.push('NAME = :name');
        binds.name = betreuer.NAME || betreuer.name;
      }
      
      if (betreuer.PASSWORT !== undefined || betreuer.passwort !== undefined) {
        setClauses.push('PASSWORT = :passwort');
        binds.passwort = betreuer.PASSWORT || betreuer.passwort;
      }
      
      if (betreuer.ROLLE !== undefined || betreuer.rolle !== undefined) {
        setClauses.push('ROLLE = :rolle');
        binds.rolle = betreuer.ROLLE || betreuer.rolle;
      }
      
      // Return early if no fields to update
      if (setClauses.length === 0) {
        console.log('No fields to update');
        return { success: false, error: 'No fields to update' };
      }
      
      // Construct the final UPDATE query
      const query = `UPDATE Betreuer SET ${setClauses.join(', ')} WHERE BETREUERID = :id`;
      console.log('Update query:', query);
      console.log('Binds:', binds);
      
      const updateResult = await connection.execute(
        query,
        binds,
        { autoCommit: true }
      );
      
      console.log('Update result:', updateResult);
      
      return { 
        success: true, 
        rowsAffected: updateResult.rowsAffected
      };
    } catch (err) {
      console.error('Error updating Betreuer:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },
  
  // Delete betreuer with cascade delete for all associations
  delete: async (id) => {
    console.log('Deleting Betreuer with ID:', id);
    
    let connection;
    
    try {
      connection = await oracledb.getConnection('appPool');
      
      // Start transaction
      await connection.execute('SET TRANSACTION READ WRITE');
      
      // First delete all associated disziplin records
      const deleteDisziplinAssoc = await connection.execute(
        'DELETE FROM BETREUER_DISZIPLIN WHERE BETREUERID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteDisziplinAssoc.rowsAffected} BETREUER_DISZIPLIN records`);
      
      // Then delete all associated team records
      const deleteTeamAssoc = await connection.execute(
        'DELETE FROM BETREUER_TEAM WHERE BETREUERID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteTeamAssoc.rowsAffected} BETREUER_TEAM records`);
      
      // Finally delete the betreuer
      const deleteResult = await connection.execute(
        'DELETE FROM Betreuer WHERE BETREUERID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteResult.rowsAffected} Betreuer records`);
      
      // Commit transaction
      await connection.commit();
      
      return { 
        success: true, 
        rowsDeleted: deleteResult.rowsAffected,
        disziplinAssocDeleted: deleteDisziplinAssoc.rowsAffected,
        teamAssocDeleted: deleteTeamAssoc.rowsAffected
      };
    } catch (err) {
      console.error('Error deleting Betreuer:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }
};








// TEAM table operations mit Debugging und ID-Sequenz
const TeamController = {
  // Get all teams
  getAll: async () => {
    return await executeQuery('SELECT * FROM Team ORDER BY TEAMID');
  },
  
  // Get team by ID
  getById: async (id) => {
    return await executeQuery(
      'SELECT * FROM Team WHERE TEAMID = :id',
      [id]
    );
  },
  
  // Create new team with debugging and manual ID
  create: async (team) => {
    let connection;
    
    try {
      console.log('Creating new Team with data:', team);
      
      // Get connection directly for better control
      connection = await oracledb.getConnection('appPool');
      
      // 1. Get next ID from max ID in table
      const getMaxIdResult = await connection.execute(
        'SELECT NVL(MAX(TEAMID), 0) + 1 as NEXT_ID FROM Team',
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      
      const nextId = getMaxIdResult.rows[0].NEXT_ID;
      console.log('Next Team ID:', nextId);
      
      // 2. Insert with explicit ID - Note: BETREUERID column has been removed
      const insertResult = await connection.execute(
        `INSERT INTO Team (TEAMID, NAME) 
         VALUES (:id, :name)`,
        {
          id: nextId,
          name: team.NAME || 'Neues Team'
        },
        { autoCommit: true }
      );
      
      console.log('Insert result:', insertResult);
      
      // 3. Add betreuer association if provided (uses new BETREUER_TEAM table)
      if (team.BETREUERID) {
        console.log('Adding betreuer association:', team.BETREUERID);
        
        await connection.execute(
          'INSERT INTO BETREUER_TEAM (BETREUERID, TEAMID) VALUES (:betreuerid, :teamid)',
          {
            betreuerid: team.BETREUERID,
            teamid: nextId
          },
          { autoCommit: true }
        );
      }
      
      return { 
        success: true, 
        id: nextId,
        rowsAffected: insertResult.rowsAffected
      };
    } catch (err) {
      console.error('Error creating Team:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },
  
  // Update team with debugging - Now handles betreuer associations separately
  update: async (id, team) => {
    console.log('Updating Team:', id, team);
    let connection;
    
    try {
      // Get connection directly for better control
      connection = await oracledb.getConnection('appPool');

      // Update team name if provided
      if (team.NAME !== undefined) {
        const updateQuery = 'UPDATE Team SET NAME = :name WHERE TEAMID = :id';
        console.log('Update query:', updateQuery);
        
        const updateResult = await connection.execute(
          updateQuery,
          { name: team.NAME, id: id },
          { autoCommit: false }
        );
        
        console.log('Update team result:', updateResult);
      }
      
      // Handle betreuer association update if provided
      if (team.BETREUERID !== undefined) {
        // First check if association already exists
        const checkResult = await connection.execute(
          'SELECT COUNT(*) as COUNT FROM BETREUER_TEAM WHERE BETREUERID = :betreuerid AND TEAMID = :teamid',
          { betreuerid: team.BETREUERID, teamid: id },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        
        const exists = checkResult.rows[0].COUNT > 0;
        
        if (!exists) {
          // First delete any existing associations
          await connection.execute(
            'DELETE FROM BETREUER_TEAM WHERE TEAMID = :id',
            [id],
            { autoCommit: false }
          );
          
          // Then create the new association
          await connection.execute(
            'INSERT INTO BETREUER_TEAM (BETREUERID, TEAMID) VALUES (:betreuerid, :teamid)',
            { betreuerid: team.BETREUERID, teamid: id },
            { autoCommit: false }
          );
          
          console.log('Updated betreuer association for team');
        } else {
          console.log('Betreuer association already exists, no change needed');
        }
      }
      
      // Commit the transaction
      await connection.commit();
      
      return { 
        success: true,
        message: 'Team updated successfully'
      };
    } catch (err) {
      // Rollback in case of error
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackErr) {
          console.error('Error during rollback:', rollbackErr);
        }
      }
      
      console.error('Error updating Team:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },
  
  // Delete team with cascade delete for all associations
  delete: async (id) => {
    console.log('Deleting Team with ID:', id);
    
    let connection;
    
    try {
      connection = await oracledb.getConnection('appPool');
      
      // Start transaction
      await connection.execute('SET TRANSACTION READ WRITE');
      
      // First delete team-student associations
      const deleteTeamStudentResult = await connection.execute(
        'DELETE FROM TEAM_SCHUELER WHERE TEAMID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteTeamStudentResult.rowsAffected} TEAM_SCHUELER records`);
      
      // Delete betreuer-team associations
      const deleteBetreuerTeamResult = await connection.execute(
        'DELETE FROM BETREUER_TEAM WHERE TEAMID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteBetreuerTeamResult.rowsAffected} BETREUER_TEAM records`);
      
      // Delete related ergebnis records
      const deleteErgebnisResult = await connection.execute(
        'DELETE FROM Ergebnis WHERE TEAMID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteErgebnisResult.rowsAffected} Ergebnis records`);
      
      // Finally delete the team
      const deleteTeamResult = await connection.execute(
        'DELETE FROM Team WHERE TEAMID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteTeamResult.rowsAffected} Team records`);
      
      // Commit the transaction
      await connection.commit();
      
      return { 
        success: true, 
        teamRowsDeleted: deleteTeamResult.rowsAffected,
        ergebnisRowsDeleted: deleteErgebnisResult.rowsAffected,
        teamStudentRowsDeleted: deleteTeamStudentResult.rowsAffected,
        betreuerTeamRowsDeleted: deleteBetreuerTeamResult.rowsAffected
      };
    } catch (err) {
      // Rollback in case of error
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackErr) {
          console.error('Error during rollback:', rollbackErr);
        }
      }
      
      console.error('Error deleting Team:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }
};




// DISZIPLIN table operations mit Debugging und ID-Sequenz
const DisziplinController = {
  // Get all disziplins
  getAll: async () => {
    return await executeQuery('SELECT * FROM Disziplin ORDER BY DISZIPLINID');
  },
  
  // Get disziplin by ID
  getById: async (id) => {
    return await executeQuery(
      'SELECT * FROM Disziplin WHERE DISZIPLINID = :id',
      [id]
    );
  },
  
  // Create new disziplin with debugging
  create: async (disziplin) => {
    let connection;
    
    try {
      console.log('Creating new Disziplin with data:', disziplin);
      
      // Get connection directly for better control
      connection = await oracledb.getConnection('appPool');
      
      // 1. Get next ID from max ID in table
      const getMaxIdResult = await connection.execute(
        'SELECT NVL(MAX(DISZIPLINID), 0) + 1 as NEXT_ID FROM Disziplin',
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      
      const nextId = getMaxIdResult.rows[0].NEXT_ID;
      console.log('Next Disziplin ID:', nextId);
      
      // 2. Insert with explicit ID
      const insertResult = await connection.execute(
        `INSERT INTO Disziplin (DISZIPLINID, NAME, BESCHREIBUNG) 
         VALUES (:id, :name, :beschreibung)`,
        {
          id: nextId,
          name: disziplin.NAME || 'Neue Disziplin',
          beschreibung: disziplin.BESCHREIBUNG || null
        },
        { autoCommit: true }
      );
      
      console.log('Insert result:', insertResult);
      
      return { 
        success: true, 
        id: nextId,
        rowsAffected: insertResult.rowsAffected
      };
    } catch (err) {
      console.error('Error creating Disziplin:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },
  
  // Rest of methods stay the same
  update: async (id, disziplin) => {
    console.log('Updating Disziplin:', id, disziplin);
    return await executeQuery(
      `UPDATE Disziplin 
       SET NAME = :name,
           BESCHREIBUNG = :beschreibung
       WHERE DISZIPLINID = :id`,
      {
        name: disziplin.NAME,
        beschreibung: disziplin.BESCHREIBUNG || null,
        id: id
      },
      { autoCommit: true }
    );
  },
  
  delete: async (id) => {
    let connection;
    
    try {
      console.log('Deleting Disziplin with ID:', id);
      connection = await oracledb.getConnection('appPool');
      
      // Start transaction
      await connection.execute('SET TRANSACTION READ WRITE');
      
      // First delete betreuer-disziplin associations
      const deleteBetreuerDisziplinResult = await connection.execute(
        'DELETE FROM BETREUER_DISZIPLIN WHERE DISZIPLINID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteBetreuerDisziplinResult.rowsAffected} BETREUER_DISZIPLIN records`);
      
      // Delete related ergebnis records
      const deleteErgebnisResult = await connection.execute(
        'DELETE FROM Ergebnis WHERE DISZIPLINID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteErgebnisResult.rowsAffected} related Ergebnis records`);
      
      // Then delete the disziplin
      const deleteDisziplinResult = await connection.execute(
        'DELETE FROM Disziplin WHERE DISZIPLINID = :id',
        [id],
        { autoCommit: false }
      );
      
      console.log(`Deleted ${deleteDisziplinResult.rowsAffected} Disziplin records`);
      
      // Commit the transaction
      await connection.commit();
      
      return { 
        success: true, 
        ergebnisRowsDeleted: deleteErgebnisResult.rowsAffected,
        disziplinRowsDeleted: deleteDisziplinResult.rowsAffected,
        betreuerDisziplinRowsDeleted: deleteBetreuerDisziplinResult.rowsAffected
      };
    } catch (err) {
      // Rollback in case of error
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackErr) {
          console.error('Error during rollback:', rollbackErr);
        }
      }
      
      console.error('Error deleting Disziplin:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }
};




// ERGEBNIS table operations mit korrekten Spaltennamen
const ErgebnisController = {
  // Get all ergebnis
  getAll: async () => {
    return await executeQuery('SELECT * FROM Ergebnis ORDER BY ERGEBNISID');
  },
  
  // Get ergebnis by ID
  getById: async (id) => {
    return await executeQuery(
      'SELECT * FROM Ergebnis WHERE ERGEBNISID = :id',
      [id]
    );
  },
  
  // Get ergebnis by team ID
  getByTeamId: async (teamId) => {
    return await executeQuery(
      'SELECT * FROM Ergebnis WHERE TEAMID = :teamId',
      [teamId]
    );
  },
  
  // Get ergebnis by disziplin ID
  getByDisziplinId: async (disziplinId) => {
    return await executeQuery(
      'SELECT * FROM Ergebnis WHERE DISZIPLINID = :disziplinId',
      [disziplinId]
    );
  },
  
  // Get ergebnis by student and discipline
  getByStudentAndDiscipline: async (studentId, disciplineId) => {
    console.log(`Getting scores for student ${studentId} and discipline ${disciplineId}`);
    return await executeQuery(
      'SELECT * FROM Ergebnis WHERE SCHUELERID = :studentId AND DISZIPLINID = :disciplineId',
      { studentId, disciplineId }
    );
  },
  
  // Create new ergebnis with debugging and manual ID
  create: async (ergebnis) => {
    let connection;
    
    try {
      console.log('Creating new Ergebnis with data:', ergebnis);
      
      // Validate required fields
      if (!ergebnis.TEAMID || !ergebnis.DISZIPLINID) {
        console.error('Missing required fields:', { TEAMID: ergebnis.TEAMID, DISZIPLINID: ergebnis.DISZIPLINID });
        return { success: false, error: 'TEAMID and DISZIPLINID are required' };
      }
      
      // Get connection directly for better control
      connection = await oracledb.getConnection('appPool');
      
      // 1. Get next ID from max ID in table
      const getMaxIdResult = await connection.execute(
        'SELECT NVL(MAX(ERGEBNISID), 0) + 1 as NEXT_ID FROM Ergebnis',
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      
      const nextId = getMaxIdResult.rows[0].NEXT_ID;
      console.log('Next Ergebnis ID:', nextId);
      
      // Prepare points value - Note we're using pointsID instead of PUNKTE!
      // Convert the input PUNKTE to pointsID
      const pointsID = ergebnis.PUNKTE !== undefined ? ergebnis.PUNKTE : 0;
      
      // 2. Insert with explicit ID and correct column names
      const insertQuery = `INSERT INTO Ergebnis (ERGEBNISID, TEAMID, DISZIPLINID, POINTSID) 
                          VALUES (:id, :teamId, :disziplinId, :pointsId)`;
      
      console.log('Insert query:', insertQuery);
      
      const binds = {
        id: nextId,
        teamId: ergebnis.TEAMID,
        disziplinId: ergebnis.DISZIPLINID,
        pointsId: pointsID  // Note the change from punkte to pointsId
      };
      
      console.log('Binds:', binds);
      
      const insertResult = await connection.execute(
        insertQuery,
        binds,
        { autoCommit: true }
      );
      
      console.log('Insert result:', insertResult);
      
      return { 
        success: true, 
        id: nextId,
        rowsAffected: insertResult.rowsAffected
      };
    } catch (err) {
      console.error('Error creating Ergebnis:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },
  
  // Update ergebnis with improved debugging
  update: async (id, ergebnis) => {
    console.log('Updating Ergebnis:', id, ergebnis);
    
    let connection;
    
    try {
      // Get connection directly for better control
      connection = await oracledb.getConnection('appPool');
      
      // Build dynamic SET clause based on provided fields
      let setClauses = [];
      let binds = { id: id };
      
      // Add fields that exist in the database - note correct column names!
      if (ergebnis.TEAMID !== undefined) {
        setClauses.push('TEAMID = :teamId');
        binds.teamId = ergebnis.TEAMID;
      }
      
      if (ergebnis.DISZIPLINID !== undefined) {
        setClauses.push('DISZIPLINID = :disziplinId');
        binds.disziplinId = ergebnis.DISZIPLINID;
      }
      
      // We're using pointsID in the database, but the frontend sends PUNKTE
      if (ergebnis.PUNKTE !== undefined) {
        setClauses.push('POINTSID = :pointsId');  // Note the change!
        binds.pointsId = ergebnis.PUNKTE;
      }
      
      // Return early if no fields to update
      if (setClauses.length === 0) {
        console.log('No fields to update');
        return { success: false, error: 'No fields to update' };
      }
      
      // Construct the final UPDATE query
      const query = `UPDATE Ergebnis SET ${setClauses.join(', ')} WHERE ERGEBNISID = :id`;
      console.log('Update query:', query);
      console.log('Binds:', binds);
      
      const updateResult = await connection.execute(
        query,
        binds,
        { autoCommit: true }
      );
      
      console.log('Update result:', updateResult);
      
      return { 
        success: true, 
        rowsAffected: updateResult.rowsAffected
      };
    } catch (err) {
      console.error('Error updating Ergebnis:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },
  
  // Delete ergebnis with debugging
  delete: async (id) => {
    console.log('Deleting Ergebnis with ID:', id);
    
    let connection;
    
    try {
      connection = await oracledb.getConnection('appPool');
      
      // Delete the ergebnis
      const deleteResult = await connection.execute(
        'DELETE FROM Ergebnis WHERE ERGEBNISID = :id',
        [id],
        { autoCommit: true }
      );
      
      console.log(`Deleted ${deleteResult.rowsAffected} Ergebnis records`);
      
      return { 
        success: true, 
        rowsDeleted: deleteResult.rowsAffected
      };
    } catch (err) {
      console.error('Error deleting Ergebnis:', err);
      return { success: false, error: err.message };
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  }
};

// STATION table operations
const StationController = {
  // Get all stations
  getAll: async (req, res) => {
    try {
      const result = await executeQuery('SELECT * FROM Station ORDER BY STATIONID');
      
      if (result.success) {
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Fehler beim Abrufen der Stationen'
        });
      }
    } catch (err) {
      console.error('Error getting stations:', err);
      res.status(500).json({
        success: false,
        error: 'Serverfehler beim Abrufen der Stationen'
      });
    }
  },

  // Get station by ID
  getById: async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Stations-ID ist erforderlich'
      });
    }
    
    try {
      const result = await executeQuery(
        'SELECT * FROM Station WHERE STATIONID = :id',
        [id]
      );
      
      if (result.success) {
        if (result.data.length === 0) {
          return res.status(404).json({
            success: false,
            error: 'Station nicht gefunden'
          });
        }
        
        res.json({
          success: true,
          data: result.data
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Fehler beim Abrufen der Station'
        });
      }
    } catch (err) {
      console.error('Error getting station by ID:', err);
      res.status(500).json({
        success: false,
        error: 'Serverfehler beim Abrufen der Station'
      });
    }
  },

  // Create a new station with debugging and manual ID
  create: async (req, res) => {
    const { NAME, BESCHREIBUNG, ORT, AKTIV } = req.body;
    
    if (!NAME) {
      return res.status(400).json({
        success: false,
        error: 'Name ist erforderlich'
      });
    }
    
    let connection;
    
    try {
      console.log('Creating new Station with data:', req.body);
      
      // Get connection directly for better control
      connection = await oracledb.getConnection('appPool');
      
      // 1. Get next ID from max ID in table
      const getMaxIdResult = await connection.execute(
        'SELECT NVL(MAX(STATIONID), 0) + 1 as NEXT_ID FROM Station',
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      
      const nextId = getMaxIdResult.rows[0].NEXT_ID;
      console.log('Next Station ID:', nextId);
      
      // 2. Insert with explicit ID
      const insertQuery = `
        INSERT INTO Station (STATIONID, NAME, BESCHREIBUNG, ORT, AKTIV) 
        VALUES (:id, :name, :beschreibung, :ort, :aktiv)
      `;
      
      console.log('Insert query:', insertQuery);
      
      const binds = {
        id: nextId,
        name: NAME,
        beschreibung: BESCHREIBUNG || null,
        ort: ORT || null,
        aktiv: AKTIV || 'Y'
      };
      
      console.log('Binds:', binds);
      
      const insertResult = await connection.execute(
        insertQuery,
        binds,
        { autoCommit: true }
      );
      
      console.log('Insert result:', insertResult);
      
      res.status(201).json({
        success: true,
        message: 'Station erfolgreich erstellt',
        id: nextId
      });
    } catch (err) {
      console.error('Error creating Station:', err);
      res.status(500).json({
        success: false,
        error: 'Fehler beim Erstellen der Station: ' + err.message
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error('Error closing connection:', err);
        }
      }
    }
  },

  // Update a station with debugging
  update: async (req, res) => {
    const { id } = req.params;
    const { NAME, BESCHREIBUNG, ORT, AKTIV } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Stations-ID ist erforderlich'
      });
    }
    
    console.log('Updating Station:', id, req.body);
    
    // Build SET clause and parameters dynamically based on provided data
    const updates = [];
    const params = { id };
    
    if (NAME !== undefined) {
      updates.push('NAME = :name');
      params.name = NAME;
    }
    
    if (BESCHREIBUNG !== undefined) {
      updates.push('BESCHREIBUNG = :beschreibung');
      params.beschreibung = BESCHREIBUNG;
    }
    
    if (ORT !== undefined) {
      updates.push('ORT = :ort');
      params.ort = ORT;
    }
    
    if (AKTIV !== undefined) {
      updates.push('AKTIV = :aktiv');
      params.aktiv = AKTIV;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keine Änderungen angegeben'
      });
    }
    
    const updateQuery = `
      UPDATE Station 
      SET ${updates.join(', ')} 
      WHERE STATIONID = :id
    `;
    
    console.log('Update query:', updateQuery);
    console.log('Params:', params);
    
    try {
      const result = await executeQuery(updateQuery, params, { autoCommit: true });
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Station erfolgreich aktualisiert'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Fehler beim Aktualisieren der Station'
        });
      }
    } catch (err) {
      console.error('Error updating Station:', err);
      res.status(500).json({
        success: false,
        error: 'Serverfehler beim Aktualisieren der Station'
      });
    }
  },

  // Delete a station with debugging
  delete: async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Stations-ID ist erforderlich'
      });
    }
    
    console.log('Deleting Station with ID:', id);
    
    try {
      // First check if station exists
      const checkResult = await executeQuery(
        'SELECT STATIONID FROM Station WHERE STATIONID = :id',
        [id]
      );
      
      if (checkResult.success && checkResult.data.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Station nicht gefunden'
        });
      }
      
      // Delete the station
      const result = await executeQuery(
        'DELETE FROM Station WHERE STATIONID = :id',
        [id],
        { autoCommit: true }
      );
      
      if (result.success) {
        res.json({
          success: true,
          message: 'Station erfolgreich gelöscht'
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error || 'Fehler beim Löschen der Station'
        });
      }
    } catch (err) {
      console.error('Error deleting Station:', err);
      res.status(500).json({
        success: false,
        error: 'Serverfehler beim Löschen der Station'
      });
    }
  }
};








// Get table schema information
async function getTableSchema(tableName) {
  return await executeQuery(
    `SELECT column_name, data_type, data_length, nullable
     FROM user_tab_columns
     WHERE table_name = :tableName
     ORDER BY column_id`,
    [tableName.toUpperCase()]
  );
}

// Export the controllers
module.exports = {
  initialize,
  executeQuery,
  BetreuerController,
  TeamController,
  DisziplinController,
  ErgebnisController,
  getTableSchema,
  schuelerController,
  StationController
};
