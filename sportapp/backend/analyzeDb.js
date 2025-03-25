// analyzeDb.js
// Run this script to analyze the database structure and generate accurate models
require('dotenv').config();
const oracledb = require('oracledb');

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_SERVER})(PORT=${process.env.DB_PORT}))(CONNECT_DATA=(SID=${process.env.DB_SID})))`
};

// Tables to analyze
const tables = ['BETREUER', 'TEAM', 'DISZIPLIN', 'ERGEBNIS'];

async function analyzeTable(connection, tableName) {
  console.log(`\n=== Analyzing table: ${tableName} ===`);
  
  // Get column information
  const columns = await connection.execute(
    `SELECT column_name, data_type, data_length, nullable, data_precision, data_scale
     FROM user_tab_columns
     WHERE table_name = :tableName
     ORDER BY column_id`,
    [tableName],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  
  console.log('Columns:');
  columns.rows.forEach(col => {
    let typeInfo = `${col.DATA_TYPE}`;
    if (col.DATA_TYPE.includes('VARCHAR')) {
      typeInfo += `(${col.DATA_LENGTH})`;
    } else if (col.DATA_TYPE === 'NUMBER' && col.DATA_PRECISION !== null) {
      typeInfo += `(${col.DATA_PRECISION}, ${col.DATA_SCALE})`;
    }
    console.log(`  - ${col.COLUMN_NAME}: ${typeInfo} ${col.NULLABLE === 'Y' ? 'NULL' : 'NOT NULL'}`);
  });
  
  // Get primary key information
  const primaryKeys = await connection.execute(
    `SELECT cols.column_name
     FROM all_constraints cons, all_cons_columns cols
     WHERE cols.table_name = :tableName
     AND cons.constraint_type = 'P'
     AND cons.constraint_name = cols.constraint_name
     AND cons.owner = cols.owner
     ORDER BY cols.position`,
    [tableName],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  
  if (primaryKeys.rows.length > 0) {
    console.log('Primary Key:');
    primaryKeys.rows.forEach(pk => {
      console.log(`  - ${pk.COLUMN_NAME}`);
    });
  }
  
  // Get foreign key information
  const foreignKeys = await connection.execute(
    `SELECT a.column_name, a.constraint_name, c_pk.table_name r_table_name, 
            b.column_name r_column_name
     FROM all_cons_columns a
     JOIN all_constraints c ON a.owner = c.owner AND a.constraint_name = c.constraint_name
     JOIN all_constraints c_pk ON c.r_owner = c_pk.owner AND c.r_constraint_name = c_pk.constraint_name
     JOIN all_cons_columns b ON c_pk.owner = b.owner AND c_pk.constraint_name = b.constraint_name 
        AND b.position = a.position
     WHERE c.constraint_type = 'R'
       AND a.table_name = :tableName`,
    [tableName],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  
  if (foreignKeys.rows.length > 0) {
    console.log('Foreign Keys:');
    foreignKeys.rows.forEach(fk => {
      console.log(`  - ${fk.COLUMN_NAME} -> ${fk.R_TABLE_NAME}.${fk.R_COLUMN_NAME}`);
    });
  }
  
  // Get sample data
  const sampleData = await connection.execute(
    `SELECT * FROM ${tableName} WHERE ROWNUM <= 3`,
    [],
    { outFormat: oracledb.OUT_FORMAT_OBJECT }
  );
  
  if (sampleData.rows.length > 0) {
    console.log('Sample Data:');
    sampleData.rows.forEach((row, idx) => {
      console.log(`  Row ${idx + 1}:`);
      Object.entries(row).forEach(([key, value]) => {
        console.log(`    ${key}: ${value !== null ? value : 'NULL'}`);
      });
    });
  } else {
    console.log('No sample data available (table is empty)');
  }
  
  // Generate model suggestion
  console.log('\nSuggested Model:');
  
  console.log(`const ${tableName.toLowerCase()}Schema = {`);
  columns.rows.forEach(col => {
    const colName = col.COLUMN_NAME.toLowerCase();
    const isPrimaryKey = primaryKeys.rows.some(pk => pk.COLUMN_NAME === col.COLUMN_NAME);
    
    let jsType = 'string';
    if (col.DATA_TYPE === 'NUMBER') {
      jsType = 'number';
    } else if (col.DATA_TYPE === 'DATE') {
      jsType = 'Date';
    } else if (col.DATA_TYPE === 'BLOB') {
      jsType = 'Buffer';
    }
    
    console.log(`  ${colName}: {`);
    console.log(`    type: ${jsType},`);
    if (isPrimaryKey) {
      console.log(`    primaryKey: true,`);
    }
    
    // Check if it's a foreign key
    const foreignKey = foreignKeys.rows.find(fk => fk.COLUMN_NAME === col.COLUMN_NAME);
    if (foreignKey) {
      console.log(`    references: {`);
      console.log(`      table: '${foreignKey.R_TABLE_NAME.toLowerCase()}',`);
      console.log(`      field: '${foreignKey.R_COLUMN_NAME.toLowerCase()}'`);
      console.log(`    },`);
    }
    
    if (col.NULLABLE === 'N') {
      console.log(`    allowNull: false,`);
    }
    
    console.log(`  },`);
  });
  console.log(`};\n`);
  
  // Generate controller methods
  console.log(`// Controller methods for ${tableName}`);
  const pkColumn = primaryKeys.rows.length > 0 ? primaryKeys.rows[0].COLUMN_NAME : null;
  
  console.log(`
// Get all ${tableName.toLowerCase()}
const getAll${tableName} = async () => {
  return await executeQuery('SELECT * FROM ${tableName}');
};

// Get ${tableName.toLowerCase()} by ID
const get${tableName}ById = async (id) => {
  return await executeQuery(
    'SELECT * FROM ${tableName} WHERE ${pkColumn} = :id',
    [id]
  );
};

// Create new ${tableName.toLowerCase()}
const create${tableName} = async (data) => {
  const columns = [${columns.rows.filter(col => !isPrimaryKeyAutoIncrement(col.COLUMN_NAME, primaryKeys.rows)).map(col => `'${col.COLUMN_NAME.toLowerCase()}'`).join(', ')}];
  const placeholders = columns.map(col => \`:$\{col\}\`).join(', ');
  
  return await executeQuery(
    \`INSERT INTO ${tableName} (\${columns.join(', ')}) 
     VALUES (\${placeholders})
     ${pkColumn ? `RETURNING ${pkColumn} INTO :id` : ''}\`,
    {
      ...objectifyParams(data),
      ${pkColumn ? `id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }` : ''}
    },
    { autoCommit: true }
  );
};
  `);
  
  return {
    name: tableName,
    columns: columns.rows,
    primaryKeys: primaryKeys.rows,
    foreignKeys: foreignKeys.rows,
    sampleData: sampleData.rows
  };
}

// Helper to determine if a column is an auto-incrementing primary key
function isPrimaryKeyAutoIncrement(columnName, primaryKeys) {
  // This is a heuristic - Oracle doesn't have auto_increment like MySQL
  // Typically we'd check if there's a sequence and trigger for this column
  return primaryKeys.some(pk => pk.COLUMN_NAME === columnName) && 
         columnName.endsWith('ID');
}

// Helper to convert array of objects to a single object with parameter bindings
function objectifyParams(data) {
  if (!data) return {};
  const result = {};
  Object.entries(data).forEach(([key, value]) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

async function analyzeDatabase() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await oracledb.getConnection(dbConfig);
    console.log('Connection successful!\n');
    
    // Get list of tables
    const userTables = await connection.execute(
      `SELECT table_name
       FROM user_tables
       ORDER BY table_name`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    console.log('Available tables:');
    userTables.rows.forEach((row, idx) => {
      console.log(`  ${idx + 1}. ${row.TABLE_NAME}`);
    });
    
    console.log('\nAnalyzing specified tables...');
    
    // Analyze each specified table
    const tableResults = [];
    for (const tableName of tables) {
      try {
        const result = await analyzeTable(connection, tableName);
        tableResults.push(result);
      } catch (err) {
        console.error(`Error analyzing table ${tableName}:`, err.message);
      }
    }
    
    console.log('\nDatabase analysis complete!');
    return tableResults;
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Database connection closed.');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Run the analysis
analyzeDatabase()
  .then(() => {
    console.log('Exiting...');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });