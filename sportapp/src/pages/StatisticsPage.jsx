import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, BarChart3, Award, Target } from 'lucide-react';

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [disziplinen, setDisziplinen] = useState([]);
  const [teams, setTeams] = useState([]);
  const [ergebnisse, setErgebnisse] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || '';
        
        // Fetch disciplines
        const disziplinenRes = await fetch(`${baseUrl}/disziplins`);
        if (disziplinenRes.ok) {
          const data = await disziplinenRes.json();
          if (data.success) {
            setDisziplinen(data.data || []);
          }
        }

        // Fetch teams for statistics
        const teamsRes = await fetch(`${baseUrl}/teams`);
        if (teamsRes.ok) {
          const data = await teamsRes.json();
          if (data.success) {
            setTeams(data.data || []);
          }
        }

        // Fetch results
        const ergebnisseRes = await fetch(`${baseUrl}/ergebnisse`);
        if (ergebnisseRes.ok) {
          const data = await ergebnisseRes.json();
          if (data.success) {
            setErgebnisse(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics summary
  const totalDisciplines = disziplinen.length;
  const totalTeams = teams.length;
  const totalResults = ergebnisse.length;
  
  const avgPointsPerResult = ergebnisse.length > 0 
    ? ergebnisse.reduce((sum, r) => {
        const points = r.PUNKTE !== undefined ? parseFloat(r.PUNKTE) : 
                       r.POINTSID !== undefined ? parseFloat(r.POINTSID) : 0;
        return sum + points;
      }, 0) / ergebnisse.length
    : 0;

  return (
    <motion.div 
      className="p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Statistiken</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">Detaillierte Auswertungen des Sportfests</p>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Statistics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Disziplinen</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Insgesamt</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalDisciplines}</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
                  <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Teams</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aktive Teams</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalTeams}</div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg mr-4">
                  <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">Ø Punktzahl</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pro Teilnahme</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{avgPointsPerResult.toFixed(1)}</div>
            </div>
          </div>
          
          {/* Additional Statistics Content */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8">
            <div className="flex items-center mb-6">
              <BarChart3 className="h-6 w-6 text-indigo-500 mr-3" />
              <h2 className="text-xl font-medium text-slate-900 dark:text-white">Übersicht</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Bisher wurden insgesamt <strong>{totalResults}</strong> Ergebnisse bei <strong>{totalDisciplines}</strong> Disziplinen erfasst.
              </p>
              
              <div className="bg-gray-100 dark:bg-slate-700 rounded-lg p-4 mt-4">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  Weitere statistische Auswertungen sind in Bearbeitung und werden bald verfügbar sein.
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Hier werden in Zukunft detaillierte Grafiken und Analysen zu Teams, Disziplinen und individuellen Leistungen erscheinen.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default StatisticsPage;
