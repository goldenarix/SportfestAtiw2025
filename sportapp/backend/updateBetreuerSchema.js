// updateBetreuerSchema.js
require('dotenv').config();
const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_SERVER})(PORT=${process.env.DB_PORT}))(CONNECT_DATA=(SID=${process.env.DB_SID})))`
};

/**
 * Executes the schema update SQL script
 */
async function updateSchema() {
  let connection;

  try {
    console.log('Starting database schema update...');
    
    // Connect to database
    console.log('Connecting to database...');
    connection = await oracledb.getConnection(dbConfig);
    console.log('Connected successfully');
    
    // Read schema update SQL
    const schemaFilePath = path.join(__dirname, 'schema_betreuer_update.sql');
    console.log(`Reading schema file from: ${schemaFilePath}`);
    const schemaSql = fs.readFileSync(schemaFilePath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = schemaSql
      .replace(/--.*$/gm, '') // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .split(/;[\r\n]+/) // Split on semicolon followed by newline
      .filter(stmt => stmt.trim()); // Remove empty statements
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      
      try {
        console.log(`Executing statement ${i+1}/${statements.length}...`);
        // Special handling for PL/SQL blocks (e.g., BEGIN ... END blocks)
        if (stmt.toUpperCase().includes('BEGIN')) {
          await connection.execute(stmt);
        } else {
          await connection.execute(stmt);
        }
        console.log(`Statement ${i+1} executed successfully`);
      } catch (err) {
        // If statement fails because object already exists, continue
        if (err.message.includes('name is already used by an existing object')
            || err.message.includes('table or view does not exist')) {
          console.log(`Note: ${err.message}`);
        } else {
          throw err;
        }
      }
    }
    
    // Commit changes
    await connection.commit();
    console.log('All changes committed successfully');
    
    console.log('Schema updated successfully!');
    console.log('\nSummary of changes:');
    console.log('1. Added ROLLE column to BETREUER table');
    console.log('2. Created BETREUER_DISZIPLIN junction table');
    console.log('3. Created BETREUER_TEAM junction table');
    console.log('4. Migrated existing team-betreuer relationships');
    console.log('5. Dropped BETREUERID column from TEAM table');
    console.log('6. Created views for easier data access');
  } catch (err) {
    console.error('Error during schema update:', err);
    if (connection) {
      try {
        // Rollback on error
        await connection.rollback();
        console.log('Changes rolled back due to error');
      } catch (rollbackErr) {
        console.error('Error during rollback:', rollbackErr);
      }
    }
    throw err;
  } finally {
    if (connection) {
      try {
        // Close connection
        await connection.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Run the update function
updateSchema()
  .then(() => {
    console.log('Schema update complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Schema update failed:', err);
    process.exit(1);
  });
