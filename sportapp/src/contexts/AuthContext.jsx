import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext(null);

// JWT storage key
const TOKEN_KEY = 'sportapp_auth_token';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL; //|| 'http://localhost:3001/api';

  // Initialize auth from stored token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setError('Verbindungsfehler beim Überprüfen der Authentifizierung');
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login function (works for both betreuer and admin)
  const login = async (username, password, role = 'betreuer') => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = role === 'admin' ? 'admin' : 'betreuer';
      
      // For betreuer, the username is stored in the NAME field
      // For admin, it's stored in the USERNAME field
      const payload = role === 'admin' 
        ? { username, password } 
        : { username, password }; // Both use the same fields in the API

      const response = await fetch(`${API_URL}/auth/login/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token in localStorage
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setCurrentUser(data.user);
        return true;
      } else {
        setError(data.error || 'Anmeldung fehlgeschlagen');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Verbindungsfehler bei der Anmeldung');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
  };

  // Register a new betreuer (admin only)
  const registerBetreuer = async (name, password) => {
    if (!token || !currentUser || currentUser.role !== 'admin') {
      setError('Nur Administratoren können neue Betreuer registrieren');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register/betreuer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, id: data.id };
      } else {
        setError(data.error || 'Registrierung fehlgeschlagen');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Verbindungsfehler bei der Registrierung');
      return { success: false, error: 'Verbindungsfehler' };
    } finally {
      setLoading(false);
    }
  };

  // Register a new admin (admin only)
  const registerAdmin = async (name, username, password) => {
    if (!token || !currentUser || currentUser.role !== 'admin') {
      setError('Nur Administratoren können neue Administratoren registrieren');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, id: data.id };
      } else {
        setError(data.error || 'Registrierung fehlgeschlagen');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Admin registration error:', err);
      setError('Verbindungsfehler bei der Registrierung');
      return { success: false, error: 'Verbindungsfehler' };
    } finally {
      setLoading(false);
    }
  };

  // Get all betreuer accounts (admin only)
  const getAllBetreuer = async () => {
    if (!token || !currentUser || currentUser.role !== 'admin') {
      setError('Nur Administratoren können alle Betreuer anzeigen');
      return { success: false, error: 'Nicht berechtigt' };
    }

    try {
      const response = await fetch(`${API_URL}/auth/betreuer`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data: data.data };
      } else {
        setError(data.error || 'Fehler beim Abrufen der Betreuer');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Get all betreuer error:', err);
      setError('Verbindungsfehler beim Abrufen der Betreuer');
      return { success: false, error: 'Verbindungsfehler' };
    }
  };

  // Get all admin accounts (admin only)
  const getAllAdmins = async () => {
    if (!token || !currentUser || currentUser.role !== 'admin') {
      setError('Nur Administratoren können alle Administratoren anzeigen');
      return { success: false, error: 'Nicht berechtigt' };
    }

    try {
      const response = await fetch(`${API_URL}/auth/admins`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data: data.data };
      } else {
        setError(data.error || 'Fehler beim Abrufen der Administratoren');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Get all admins error:', err);
      setError('Verbindungsfehler beim Abrufen der Administratoren');
      return { success: false, error: 'Verbindungsfehler' };
    }
  };

  // Change password
  const changePassword = async (id, newPassword, accountType = 'betreuer') => {
    if (!token || !currentUser) {
      setError('Nicht angemeldet');
      return { success: false, error: 'Nicht angemeldet' };
    }

    // Check if user is changing their own password or is an admin
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      setError('Keine Berechtigung, das Passwort eines anderen Nutzers zu ändern');
      return { success: false, error: 'Nicht berechtigt' };
    }

    try {
      const endpoint = accountType === 'admin' ? 'admin' : 'betreuer';
      const response = await fetch(`${API_URL}/auth/${endpoint}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, newPassword })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        setError(data.error || 'Fehler beim Ändern des Passworts');
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Change password error:', err);
      setError('Verbindungsfehler beim Ändern des Passworts');
      return { success: false, error: 'Verbindungsfehler' };
    }
  };

  // Delete a user account (admin only)
  const deleteUser = async (id, accountType = 'betreuer') => {
    if (!token || !currentUser || currentUser.role !== 'admin') {
      setError('Nur Administratoren können Benutzer löschen');
      return { success: false, error: 'Nicht berechtigt' };
    }

    try {
      const endpoint = accountType === 'admin' ? 'admin' : 'betreuer';
      const response = await fetch(`${API_URL}/auth/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        setError(data.error || `Fehler beim Löschen des ${accountType === 'admin' ? 'Administrators' : 'Betreuers'}`);
        return { success: false, error: data.error };
      }
    } catch (err) {
      console.error('Delete user error:', err);
      setError(`Verbindungsfehler beim Löschen des ${accountType === 'admin' ? 'Administrators' : 'Betreuers'}`);
      return { success: false, error: 'Verbindungsfehler' };
    }
  };

  // Helper function to check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser && !!token;
  };

  // Helper function to check if user is an admin
  const isAdmin = () => {
    return isAuthenticated() && currentUser.role === 'admin';
  };

  // Provide auth context value
  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    registerBetreuer,
    registerAdmin,
    getAllBetreuer,
    getAllAdmins,
    changePassword,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
