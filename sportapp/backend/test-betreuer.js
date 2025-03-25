// test-betreuer.js
// Save this in your backend folder and run with: node test-betreuer.js

require('dotenv').config();
const oracledb = require('oracledb');

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_SERVER})(PORT=${process.env.DB_PORT}))(CONNECT_DATA=(SID=${process.env.DB_SID})))`
};

console.log('Attempting to query the Betreuer table...');

async function testBetreuerQuery() {
  let connection;
  
  try {
    // Establish connection to the database
    console.log('Connecting to database...');
    connection = await oracledb.getConnection(dbConfig);
    console.log('Connection successful!');
    
    // Query the Betreuer table
    console.log('Executing query: SELECT * FROM Betreuer');
    const result = await connection.execute(
      'SELECT * FROM Betreuer WHERE ROWNUM <= 10',
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    console.log('\nQuery executed successfully!');
    console.log(`Retrieved ${result.rows.length} rows from Betreuer table.`);
    
    // Display column names
    if (result.rows.length > 0) {
      console.log('\nColumns:');
      const columns = Object.keys(result.rows[0]);
      columns.forEach(col => console.log(`  - ${col}`));
      
      // Display first row as sample
      console.log('\nSample row:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }
    
    return { success: true, data: result.rows };
  } catch (err) {
    console.error('ERROR:', err.message);
    
    if (err.message.includes('ORA-00942')) {
      console.error('\nTROUBLESHOOTING: Table BETREUER might not exist or you might not have permission to access it.');
      console.error('Try checking the exact table name with case sensitivity:');
      console.error('SELECT table_name FROM user_tables WHERE UPPER(table_name) LIKE \'%BETREUER%\'');
    }
    
    return { success: false, error: err.message };
  } finally {
    // Release the connection
    if (connection) {
      try {
        await connection.close();
        console.log('\nConnection closed.');
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
}

testBetreuerQuery()
  .then(result => {
    if (result.success) {
      console.log('\nSUCCESS! Query executed successfully.');
    } else {
      console.log('\nFAILED: Could not query the Betreuer table. See error messages above.');
    }
  });