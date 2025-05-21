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
      console.log("🔒 AuthContext: useEffect [token] - Starte Token Verifizierung.");
      console.log("🔒 AuthContext: Aktueller Token:", token ? token.substring(0, 20) + "..." : "nicht vorhanden");

      if (!token) {
        console.log("🔒 AuthContext: Kein Token vorhanden. Setze currentUser auf null und setLoading(false).");
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("🔒 AuthContext: Sende /auth/me Anfrage...");
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log("🔒 AuthContext: /auth/me erfolgreich. User-Daten empfangen:", data.user);
          if (data.user && data.user.id) {
            setCurrentUser(data.user);
            console.log("🔒 AuthContext: currentUser wurde durch /auth/me gesetzt auf:", data.user);
          } else {
            console.warn("🔒 AuthContext: /auth/me war ok, aber User-Daten sind unvollständig oder fehlen. data:", data);
            logout(); // Behandle als Fehler, wenn User-Daten nicht korrekt sind
          }
        } else {
          const errorBody = await response.text(); // Versuche, den Fehler-Body zu lesen
          console.error(`🔒 AuthContext: /auth/me Anfrage fehlgeschlagen oder Token ungültig. Status: ${response.status} ${response.statusText}.`);
          console.error("🔒 AuthContext: Fehlerdetails vom Server (falls vorhanden):", errorBody);
          logout(); // Token ist ungültig oder Anfrage schlug fehl -> Logout
        }
      } catch (err) {
        console.error('🔒 AuthContext: Kritischer Fehler bei der Token Verifizierung (z.B. Netzwerkproblem):', err);
        setError('Verbindungsfehler beim Überprüfen der Authentifizierung.');
        logout();
      } finally {
        console.log("🔒 AuthContext: Token Verifizierung abgeschlossen, setLoading(false).");
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Login function (works for both betreuer and admin)
  const login = async (username, password, role = 'betreuer') => {
    setLoading(true);
    setError(null);
    console.log(`🔑 AuthContext: login() aufgerufen für ${role} - ${username}`);

    try {
      const endpoint = role === 'admin' ? 'admin' : 'betreuer';
      
      console.log(`🔐 Versuche Login als ${role}: ${username}`);
      
      const payload = role === 'admin' 
        ? { username, password } 
        : { username, password };

      const response = await fetch(`${API_URL}/auth/login/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`✅ Login erfolgreich als ${role}:`, data.user);
        console.log(`🔑 Token erhalten:`, data.token ? data.token.substring(0, 20) + "..." : 'Nein (ungültig)');
        
        localStorage.setItem(TOKEN_KEY, data.token);
        // WICHTIG: Setze currentUser hier SOFORT, damit die App reagieren kann,
        // auch bevor der verifyToken useEffect komplett durch ist.
        if (data.user && data.user.id) {
            setCurrentUser(data.user);
            console.log(`👤 currentUser wurde direkt via login() gesetzt auf:`, data.user);
        } else {
            console.error("❌ Login war erfolgreich, aber User-Daten vom Backend sind unvollständig!", data);
            setError("Fehlerhafte Benutzerdaten vom Server nach Login.");
            setLoading(false);
            return false;
        }
        
        setToken(data.token); // Dies triggert den oberen useEffect zur Verifizierung
        
        setLoading(false); // setLoading hier auch schon, da User-Daten da sind
        return true;
      } else {
        console.log(`❌ Login fehlgeschlagen:`, data.error);
        setError(data.error || 'Anmeldung fehlgeschlagen');
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Verbindungsfehler bei der Anmeldung');
      setLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    console.log("🚪 AuthContext: logout() aufgerufen.");
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
    console.log("🚪 AuthContext: User und Token entfernt.");
  };

  // Updated to include rolle, disziplinen, and teams
  const registerBetreuer = async (name, password, rolle, disziplinen, teams) => {
    console.log("🔒 AuthContext: Registriere Betreuer - Name:", name, "Rolle:", rolle, "Disziplinen:", disziplinen, "Teams:", teams);
    setLoading(true);
    try {
      const payload = {
        name,
        password,
        rolle: rolle || 'stationaer', // Default rolle if not provided
      };

      if (payload.rolle === 'stationaer' && disziplinen) {
        payload.disziplinen = disziplinen;
      } else if (payload.rolle === 'laufend' && teams) {
        payload.teams = teams;
      }

      console.log("🔒 AuthContext: Sende Payload für Betreuer Registrierung:", payload);

      const response = await fetch(`${API_URL}/auth/register/betreuer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      console.log("🔒 AuthContext: Antwort von Betreuer Registrierung:", data);
      
      if (data.success) {
        // Optional: login the user directly after registration or refresh list
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error || 'Registrierung fehlgeschlagen' };
      }
    } catch (error) {
      console.error("🔒 AuthContext: Fehler bei Betreuer Registrierung:", error);
      return { success: false, error: 'Netzwerkfehler oder Server nicht erreichbar' };
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

  // Function to update Betreuer details
  const updateBetreuer = async (betreuerId, dataToUpdate) => {
    console.log(`🔒 AuthContext: Aktualisiere Betreuer ${betreuerId} mit Daten:`, dataToUpdate);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/betreuer/${betreuerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Make sure token is included
        },
        body: JSON.stringify(dataToUpdate),
      });
      const data = await response.json();
      console.log("🔒 AuthContext: Antwort von Betreuer Update:", data);
      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, error: data.error || 'Update fehlgeschlagen' };
      }
    } catch (error) {
      console.error("🔒 AuthContext: Fehler bei Betreuer Update:", error);
      return { success: false, error: 'Netzwerkfehler oder Server nicht erreichbar beim Update' };
    } finally {
      setLoading(false);
    }
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
    deleteUser,
    updateBetreuer
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
