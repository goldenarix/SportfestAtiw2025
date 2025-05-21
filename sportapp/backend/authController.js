// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const { executeQuery } = require('./dbController');

// Load JWT secret from environment variables or use a default (only for development)
const JWT_SECRET = process.env.JWT_SECRET || 'sportapp-jwt-secret-2025';
const JWT_EXPIRY = '24h'; // Token expiry time

/**
 * Authentication Controller
 * Handles login, token validation, and user management for different roles
 */

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.ID || user.BETREUERID, 
      role: user.ROLE || 'betreuer',
      name: user.NAME
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRY }
  );
};

// Authenticate a Betreuer user
const loginBetreuer = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Nutzername und Passwort werden benötigt' 
    });
  }
  
  try {
    // Find user by username (which is stored in the NAME field)
    const result = await executeQuery(
      'SELECT * FROM Betreuer WHERE NAME = :name',
      [username]
    );
    
    if (!result.success || result.data.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Ungültiger Nutzername oder Passwort' 
      });
    }
    
    const user = result.data[0];
    
    // For existing users with plain text passwords, we need to compare directly
    // In a real app, we would only use bcrypt.compare with hashed passwords
    // This handling allows for both plain text passwords and future bcrypt hashed passwords
    let passwordMatches = false;
    
    if (user.PASSWORT.startsWith('$2b$') || user.PASSWORT.startsWith('$2a$')) {
      // Password is bcrypt hashed
      passwordMatches = await bcrypt.compare(password, user.PASSWORT);
    } else {
      // Password is stored in plain text (temporary for development)
      passwordMatches = password === user.PASSWORT;
    }
    
    if (!passwordMatches) {
      return res.status(401).json({ 
        success: false, 
        error: 'Ungültiger Nutzername oder Passwort' 
      });
    }
    
    // Add role to user object
    user.ROLE = 'betreuer';
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user info and token
    res.json({
      success: true,
      message: 'Anmeldung erfolgreich',
      user: {
        id: user.BETREUERID,
        name: user.NAME,
        role: 'betreuer'
      },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler bei der Anmeldung' 
    });
  }
};

// Authenticate an Organisator (Admin) user
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Nutzername und Passwort werden benötigt' 
    });
  }
  
  try {
    // Find user by username in the Organisator table
    const result = await executeQuery(
      'SELECT * FROM Organisator WHERE USERNAME = :username',
      [username]
    );
    
    if (!result.success || result.data.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Ungültiger Nutzername oder Passwort' 
      });
    }
    
    const user = result.data[0];
    
    // Compare passwords using same logic as above for both hashed and plain text
    let passwordMatches = false;
    
    if (user.PASSWORD.startsWith('$2b$') || user.PASSWORD.startsWith('$2a$')) {
      // Password is bcrypt hashed
      passwordMatches = await bcrypt.compare(password, user.PASSWORD);
    } else {
      // Password is stored in plain text (temporary for development)
      passwordMatches = password === user.PASSWORD;
    }
    
    if (!passwordMatches) {
      return res.status(401).json({ 
        success: false, 
        error: 'Ungültiger Nutzername oder Passwort' 
      });
    }
    
    // Add role to user object
    user.ROLE = 'admin';
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return user info and token
    res.json({
      success: true,
      message: 'Anmeldung erfolgreich',
      user: {
        id: user.ID,
        name: user.NAME,
        role: 'admin'
      },
      token
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler bei der Anmeldung' 
    });
  }
};

// Register a new Betreuer account
const registerBetreuer = async (req, res) => {
  const { name, password, rolle, disziplinen, teams } = req.body;
  
  if (!name || !password) {
    return res.status(400).json({ success: false, error: 'Name und Passwort sind erforderlich' });
  }
  
  if (rolle && !['stationaer', 'laufend'].includes(rolle)) {
    return res.status(400).json({ success: false, error: 'Ungültige Rolle. Erlaubt sind \'stationaer\' oder \'laufend\'.' });
  }
  
  try {
    // Check if user already exists
    const checkResult = await executeQuery(
      'SELECT * FROM Betreuer WHERE NAME = :name',
      [name]
    );
    
    if (checkResult.success && checkResult.data.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ein Nutzer mit diesem Namen existiert bereits' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the Betreuer with controller (using the existing controller)
    const { BetreuerController } = require('./dbController');
    
    const createResult = await BetreuerController.create({
      NAME: name,
      PASSWORT: hashedPassword,
      ROLLE: rolle || 'stationaer', // Default to 'stationaer' if not provided
      disziplinen: rolle === 'stationaer' ? disziplinen : undefined, 
      teams: rolle === 'laufend' ? teams : undefined
    });
    
    if (!createResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Fehler beim Erstellen des Betreuers' 
      });
    }
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Betreuer wurde erfolgreich registriert',
      id: createResult.id
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler bei der Registrierung' 
    });
  }
};

// Register a new Admin (Organisator) account
const registerAdmin = async (req, res) => {
  const { name, username, password } = req.body;
  
  if (!name || !username || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, Nutzername und Passwort werden benötigt' 
    });
  }
  
  try {
    // Check if admin already exists
    const checkResult = await executeQuery(
      'SELECT * FROM Organisator WHERE USERNAME = :username',
      [username]
    );
    
    if (checkResult.success && checkResult.data.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ein Administrator mit diesem Nutzernamen existiert bereits' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let connection;
    
    try {
      // Get connection from pool
      connection = await oracledb.getConnection('appPool');
      
      // 1. Get next ID from max ID in table
      const getMaxIdResult = await connection.execute(
        'SELECT NVL(MAX(ID), 0) + 1 as NEXT_ID FROM Organisator',
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      
      const nextId = getMaxIdResult.rows[0].NEXT_ID;
      
      // 2. Insert with explicit ID
      const insertResult = await connection.execute(
        `INSERT INTO Organisator (ID, NAME, USERNAME, PASSWORD) 
         VALUES (:id, :name, :username, :password)`,
        {
          id: nextId,
          name: name,
          username: username,
          password: hashedPassword
        },
        { autoCommit: true }
      );
      
      // Return success response
      res.status(201).json({
        success: true,
        message: 'Administrator wurde erfolgreich registriert',
        id: nextId
      });
    } catch (err) {
      console.error('Admin creation error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Fehler beim Erstellen des Administrators' 
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
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler bei der Registrierung' 
    });
  }
};

// Get current user information from token
const getCurrentUser = (req, res) => {
  // This assumes the authorization middleware has already validated the token
  // and attached the user object to the request
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Nicht authentifiziert' 
    });
  }
  
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      role: req.user.role
    }
  });
};

// Create middleware to verify JWT tokens
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Zugriff verweigert. Token fehlt.'
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Ungültiger oder abgelaufener Token.'
      });
    }
    
    // Save user data in request for use in subsequent middleware or route handlers
    req.user = user;
    next();
  });
};

// Check if user is an admin
const requireAdmin = (req, res, next) => {
  // This should be used after authenticateToken middleware
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Nicht authentifiziert.'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Zugriff verweigert. Admin-Rechte erforderlich.'
    });
  }
  
  next();
};

// Get all Betreuer accounts (admin only)
const getAllBetreuer = async (req, res) => {
  try {
    const result = await executeQuery('SELECT BETREUERID, NAME FROM Betreuer ORDER BY NAME');
    
    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Fehler beim Abrufen der Betreuer' 
      });
    }
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (err) {
    console.error('Error getting Betreuer:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler beim Abrufen der Betreuer' 
    });
  }
};

// Get all admin accounts (admin only)
const getAllAdmins = async (req, res) => {
  try {
    const result = await executeQuery('SELECT ID, NAME, USERNAME FROM Organisator ORDER BY NAME');
    
    if (!result.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Fehler beim Abrufen der Administratoren' 
      });
    }
    
    res.json({
      success: true,
      data: result.data
    });
  } catch (err) {
    console.error('Error getting admins:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler beim Abrufen der Administratoren' 
    });
  }
};

// Method to change a betreuer's password - can be used by admin or the betreuer themself
const changeBetreuerPassword = async (req, res) => {
  const { id, newPassword } = req.body;
  
  if (!id || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      error: 'ID und neues Passwort werden benötigt' 
    });
  }
  
  // If not admin, check if user is changing their own password
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({
      success: false,
      error: 'Keine Berechtigung, das Passwort eines anderen Nutzers zu ändern'
    });
  }
  
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    const { BetreuerController } = require('./dbController');
    
    const updateResult = await BetreuerController.update(id, {
      PASSWORT: hashedPassword
    });
    
    if (!updateResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Fehler beim Aktualisieren des Passworts' 
      });
    }
    
    res.json({
      success: true,
      message: 'Passwort erfolgreich aktualisiert'
    });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler beim Ändern des Passworts' 
    });
  }
};

// Method to change an admin's password
const changeAdminPassword = async (req, res) => {
  const { id, newPassword } = req.body;
  
  if (!id || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      error: 'ID und neues Passwort werden benötigt' 
    });
  }
  
  // If not admin, check if user is changing their own password
  if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
    return res.status(403).json({
      success: false,
      error: 'Keine Berechtigung, das Passwort eines anderen Administrators zu ändern'
    });
  }
  
  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    const updateResult = await executeQuery(
      'UPDATE Organisator SET PASSWORD = :password WHERE ID = :id',
      { 
        password: hashedPassword,
        id: id
      }
    );
    
    if (!updateResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Fehler beim Aktualisieren des Passworts' 
      });
    }
    
    res.json({
      success: true,
      message: 'Passwort erfolgreich aktualisiert'
    });
  } catch (err) {
    console.error('Error changing admin password:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler beim Ändern des Passworts' 
    });
  }
};

// Method to delete a betreuer account (admin only)
const deleteBetreuer = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ 
      success: false, 
      error: 'ID wird benötigt' 
    });
  }
  
  try {
    // Delete the betreuer
    const { BetreuerController } = require('./dbController');
    
    const deleteResult = await BetreuerController.delete(id);
    
    if (!deleteResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: deleteResult.error || 'Fehler beim Löschen des Betreuers' 
      });
    }
    
    res.json({
      success: true,
      message: 'Betreuer erfolgreich gelöscht'
    });
  } catch (err) {
    console.error('Error deleting betreuer:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler beim Löschen des Betreuers' 
    });
  }
};

// Method to delete an admin account (admin only)
const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ 
      success: false, 
      error: 'ID wird benötigt' 
    });
  }
  
  // Check if attempting to delete the last admin
  try {
    const countResult = await executeQuery('SELECT COUNT(*) as COUNT FROM Organisator');
    
    if (countResult.success && countResult.data[0].COUNT <= 1) {
      return res.status(400).json({
        success: false,
        error: 'Der letzte Administrator kann nicht gelöscht werden'
      });
    }
    
    // Also check if trying to delete own account
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        error: 'Sie können Ihren eigenen Account nicht löschen'
      });
    }
    
    // Delete the admin
    const deleteResult = await executeQuery(
      'DELETE FROM Organisator WHERE ID = :id',
      [id]
    );
    
    if (!deleteResult.success) {
      return res.status(500).json({ 
        success: false, 
        error: 'Fehler beim Löschen des Administrators' 
      });
    }
    
    res.json({
      success: true,
      message: 'Administrator erfolgreich gelöscht'
    });
  } catch (err) {
    console.error('Error deleting admin:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Serverfehler beim Löschen des Administrators' 
    });
  }
};

// Export the controller functions
module.exports = {
  loginBetreuer,
  loginAdmin,
  registerBetreuer,
  registerAdmin,
  getCurrentUser,
  authenticateToken,
  requireAdmin,
  getAllBetreuer,
  getAllAdmins,
  changeBetreuerPassword,
  changeAdminPassword,
  deleteBetreuer,
  deleteAdmin
};
