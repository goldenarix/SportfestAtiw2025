import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    betreuer: [],
    teams: [],
    disziplins: [],
    ergebnisse: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL;

    const fetchAllData = async () => {
      try {
        const res = await fetch(`${API}/all`);
        if (!res.ok) throw new Error(`Fehler beim Laden der Daten: ${res.statusText}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Unbekannter Fehler');

        setData(json.data);
      } catch (err) {
        console.error('❌ Fehler beim Laden der Daten:', err);
        setError(err.message || 'Fehler beim Abrufen der Daten');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <DataContext.Provider value={{ ...data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => useContext(DataContext);
