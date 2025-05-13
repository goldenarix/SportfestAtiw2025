import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    betreuer: [],
    teams: [],
    disziplins: [],
    ergebnisse: [],
    students: [],
    teamStudents: [],
    studentScores: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/all`);
      if (!res.ok) throw new Error(`Fehler beim Laden der Daten: ${res.statusText}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Unbekannter Fehler');

      setData(json.data);
      setError(null);
    } catch (err) {
      console.error('❌ Fehler beim Laden der Daten:', err);
      setError(err.message || 'Fehler beim Abrufen der Daten');
    } finally {
      setLoading(false);
    }
  };

  // Save student points to the database
  const saveStudentPoints = async (scoreData) => {
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
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <DataContext.Provider 
      value={{ 
        ...data, 
        loading, 
        error, 
        refetchData: fetchAllData,
        saveStudentPoints
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
