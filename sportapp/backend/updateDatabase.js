// updateDatabase.js
// Script to run database updates and ensure routes are registered

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Import the database configuration
const dbConfig = require('./dbController').dbConfig;

/**
 * Function to execute SQL script file
 * @param {string} filePath - Path to the SQL script file
 */
async function executeSQLFile(filePath) {
  try {
    // Read SQL file
    const sqlScript = fs.readFileSync(filePath, 'utf8');
    
    // Split script into individual statements by semicolon
    // But take care not to split inside string literals
    const statements = [];
    let currentStatement = '';
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < sqlScript.length; i++) {
      const char = sqlScript[i];
      
      if (escapeNext) {
        escapeNext = false;
        currentStatement += char;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        currentStatement += char;
        continue;
      }
      
      if (char === "'" && !inString) {
        inString = true;
        currentStatement += char;
        continue;
      }
      
      if (char === "'" && inString) {
        inString = false;
        currentStatement += char;
        continue;
      }
      
      if (char === ';' && !inString) {
        if (currentStatement.trim()) {
          statements.push(currentStatement + ';');
        }
        currentStatement = '';
        continue;
      }
      
      currentStatement += char;
    }
    
    // Add the last statement if it doesn't end with a semicolon
    if (currentStatement.trim()) {
      statements.push(currentStatement);
    }
    
    // Create database connection
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('Connected to database');
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          await connection.query(statement);
          console.log(`[${i + 1}/${statements.length}] Executed: ${statement.substring(0, 50)}${statement.length > 50 ? '...' : ''}`);
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY' || error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log(`[${i + 1}/${statements.length}] Skipped (already exists): ${statement.substring(0, 50)}${statement.length > 50 ? '...' : ''}`);
          } else if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
            console.log(`[${i + 1}/${statements.length}] Skipped (drop field/key not exists): ${statement.substring(0, 50)}${statement.length > 50 ? '...' : ''}`);
          } else {
            console.error(`[${i + 1}/${statements.length}] Error executing: ${statement.substring(0, 50)}${statement.length > 50 ? '...' : ''}`);
            console.error(error);
          }
        }
      }
    }
    
    await connection.end();
    console.log('Database update completed successfully');
    return true;
  } catch (error) {
    console.error('Error executing SQL file:', error);
    return false;
  }
}

/**
 * Check if tables exist
 */
async function checkTables() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    console.log('Checking database tables...');
    
    // Check SCHUELER table
    const [schuelerTable] = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_name = 'SCHUELER'",
      [dbConfig.database]
    );
    
    if (schuelerTable.length === 0) {
      console.log('SCHUELER table does not exist');
      return false;
    }
    
    // Check BETREUER_DISZIPLIN table
    const [betreuerDisziplinTable] = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_name = 'BETREUER_DISZIPLIN'",
      [dbConfig.database]
    );
    
    if (betreuerDisziplinTable.length === 0) {
      console.log('BETREUER_DISZIPLIN table does not exist');
      return false;
    }
    
    // Check BETREUER_TEAM table
    const [betreuerTeamTable] = await connection.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_name = 'BETREUER_TEAM'",
      [dbConfig.database]
    );
    
    if (betreuerTeamTable.length === 0) {
      console.log('BETREUER_TEAM table does not exist');
      return false;
    }
    
    // Check if ROLLE column exists in BETREUER table
    const [betreuerRolleColumn] = await connection.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = ? AND table_name = 'BETREUER' AND column_name = 'ROLLE'",
      [dbConfig.database]
    );
    
    if (betreuerRolleColumn.length === 0) {
      console.log('ROLLE column does not exist in BETREUER table');
      return false;
    }
    
    console.log('All required tables and columns exist');
    return true;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  } finally {
    await connection.end();
  }
}

/**
 * Main function to update database
 */
async function updateDatabase() {
  console.log('Starting database update...');
  
  // Check if tables already exist
  const tablesExist = await checkTables();
  
  if (tablesExist) {
    console.log('Database already updated, skipping schema update');
  } else {
    console.log('Executing schema update script...');
    const schemaUpdated = await executeSQLFile(path.join(__dirname, 'schema_updates.sql'));
    
    if (!schemaUpdated) {
      console.error('Failed to update database schema');
      process.exit(1);
    }
  }
  
  console.log('Database update completed.');
  console.log('Ensure that the server.js properly imports and applies routesExtension.js');
}

// Run the function if this script is executed directly
if (require.main === module) {
  updateDatabase()
    .then(() => {
      console.log('Done');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = {
  updateDatabase
};
