import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    betreuer: [],
    teams: [],
    disziplins: [],
    ergebnisse: [],
    schueler: [],
    teamStudents: [],
    studentScores: [],
    zeitplan: [],
  });
  const [loading, setLoading] = useState(true);
  const [zeitplanLoading, setZeitplanLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zeitplanError, setZeitplanError] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/all`);
      if (!res.ok) throw new Error(`Fehler beim Laden der allgemeinen Daten: ${res.statusText}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Unbekannter Fehler bei allgemeinen Daten');

      setData(prevData => ({ ...prevData, ...json.data }));
    } catch (err) {
      console.error('❌ Fehler beim Laden der allgemeinen Daten:', err);
      setError(err.message || 'Fehler beim Abrufen der allgemeinen Daten');
      
      // Falls /all nicht funktioniert, versuchen wir, die Daten einzeln zu laden
      try {
        // Betreuer laden
        const betreuerRes = await fetch(`${API}/betreuer`);
        const betreuerJson = await betreuerRes.json();
        
        // Teams laden
        const teamsRes = await fetch(`${API}/teams`);
        const teamsJson = await teamsRes.json();
        
        // Disziplinen laden
        const disziplinsRes = await fetch(`${API}/disziplins`);
        const disziplinsJson = await disziplinsRes.json();
        
        // Ergebnisse laden
        const ergebnisseRes = await fetch(`${API}/ergebnisse`);
        const ergebnisseJson = await ergebnisseRes.json();
        
        // Schüler laden
        const studentsRes = await fetch(`${API}/schueler`);
        const studentsJson = await studentsRes.json();
        
        setData({
          betreuer: betreuerJson.success ? betreuerJson.data : [],
          teams: teamsJson.success ? teamsJson.data : [],
          disziplins: disziplinsJson.success ? disziplinsJson.data : [],
          ergebnisse: ergebnisseJson.success ? ergebnisseJson.data : [],
          schueler: studentsJson.success ? studentsJson.data : [],
          studentScores: ergebnisseJson.success ? ergebnisseJson.data.filter(result => result.SCHUELERID) : [],
          zeitplan: ergebnisseJson.success ? ergebnisseJson.data.filter(result => result.ZEITPLANID) : []
        });
        
        setError(null);
      } catch (fallbackErr) {
        console.error('❌ Fehler beim Laden der einzelnen Daten:', fallbackErr);
        setError('Fehler beim Laden der Daten. Bitte versuchen Sie es später erneut.');
      }
    } finally {
      setLoading(false);
    }
  }, [API]);

  const fetchZeitplanData = useCallback(async () => {
    setZeitplanLoading(true);
    setZeitplanError(null);
    try {
      const res = await fetch(`${API}/zeitplan`);
      if (!res.ok) throw new Error(`Fehler beim Laden des Zeitplans: ${res.statusText}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Unbekannter Fehler beim Laden des Zeitplans');
      
      setData(prevData => ({ ...prevData, zeitplan: json.data || [] }));
    } catch (err) {
      console.error('❌ Fehler beim Laden des Zeitplans:', err);
      setZeitplanError(err.message || 'Fehler beim Abrufen des Zeitplans');
    } finally {
      setZeitplanLoading(false);
    }
  }, [API]);

  // Save student points to the database
  const saveStudentPoints = useCallback(async (scoreData) => {
    try {
      const response = await fetch(`${API}/studentpoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scores: scoreData }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Fehler beim Speichern der Punkte');
      }
      
      // Return the saved data
      return result.data;
    } catch (error) {
      console.error('Error saving student points:', error);
      throw error;
    }
  }, [API]);

  useEffect(() => {
    fetchAllData();
    fetchZeitplanData();
  }, [fetchAllData, fetchZeitplanData]);

  return (
    <DataContext.Provider 
      value={{ 
        ...data, 
        loading, 
        error, 
        zeitplanLoading,
        zeitplanError,
        refetchData: fetchAllData,
        fetchZeitplan: fetchZeitplanData,
        saveStudentPoints
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);