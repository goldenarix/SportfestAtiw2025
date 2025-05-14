import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataContext } from '../../backend/DataLoader'; // Annahme: Dein DataContext existiert hier
import { useAuth } from '../contexts/AuthContext';
import { triggerHapticFeedback } from '../utils/haptics';
import { ChevronLeft, ListFilter, Search, AlertTriangle, Loader2, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: index * 0.05 },
  }),
  hover: { scale: 1.02, backgroundColor: 'rgba(var(--color-primary-500), 0.1)' }, // Dynamische Farbe für Hover
};

const SelectTeamForDisciplinePage = () => {
  const { disziplinId } = useParams();
  const navigate = useNavigate();
  const { teams, disziplins, ergebnisse, loading: dataLoading, error: dataError } = useDataContext();
  const { user, loading: authLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentDisziplin, setCurrentDisziplin] = useState(null);

  useEffect(() => {
    if (disziplins && disziplinId) {
      const foundDisziplin = disziplins.find(d => d.DISZIPLINID === parseInt(disziplinId));
      setCurrentDisziplin(foundDisziplin || null);
    }
  }, [disziplins, disziplinId]);

  const filteredAndSortedTeams = useMemo(() => {
    if (!teams) return [];
    return teams
      .filter(team => 
        team.NAME.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.NAME.localeCompare(b.NAME));
  }, [teams, searchTerm]);

  const handleTeamSelect = (team) => {
    triggerHapticFeedback('medium');
    if (currentDisziplin && team) {
      // Navigiere zur neuen dedizierten Punkteingabe-Seite
      navigate(`/ergebnisse/disziplin/${currentDisziplin.DISZIPLINID}/team/${team.TEAMID}/punkte`);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
        <p className="text-slate-700 dark:text-slate-300">Lade Team-Auswahl...</p>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-700 dark:text-red-300 text-center">
          Fehler beim Laden der Daten: {dataError.message || dataError}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <ChevronLeft size={18} className="mr-1" /> Zurück
        </button>
      </div>
    );
  }

  if (!currentDisziplin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50 dark:bg-amber-900/20">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <p className="text-amber-700 dark:text-amber-300 text-center">
          Disziplin nicht gefunden oder ungültige ID.
        </p>
        <button
          onClick={() => navigate('/ergebnisse')}
          className="mt-6 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center"
        >
          <ChevronLeft size={18} className="mr-1" /> Zu den Ergebnissen
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden">
        {/* Header */} 
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-white hover:text-indigo-200 transition-colors p-2 -ml-2 rounded-md"
              aria-label="Zurück"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Team für {currentDisziplin.NAME} auswählen
                </h1>
                {currentDisziplin.BESCHREIBUNG && (
                    <p className="text-sm text-indigo-200 mt-1 truncate max-w-xs sm:max-w-md">
                        {currentDisziplin.BESCHREIBUNG}
                    </p>
                )}
            </div>
            <div className="w-8"> {/* Platzhalter für Symmetrie */} </div>
          </div>
        </div>

        {/* Suchleiste */} 
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Team suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Teamliste */} 
        <div className="p-2 sm:p-4 max-h-[calc(100vh-280px)] overflow-y-auto styled-scrollbar">
          {filteredAndSortedTeams.length === 0 ? (
            <div className="text-center py-10">
              <ListFilter className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {searchTerm ? 'Keine Teams mit diesem Namen gefunden.' : 'Keine Teams verfügbar.'}
              </p>
              {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Suche zurücksetzen
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {filteredAndSortedTeams.map((team, index) => {
                // Finde das beste Ergebnis des Teams in dieser Disziplin
                const teamResultsInDiscipline = ergebnisse
                  .filter(e => e.TEAMID === team.TEAMID && e.DISZIPLINID === parseInt(disziplinId))
                  .sort((a, b) => (b.POINTSID || b.PUNKTE || 0) - (a.POINTSID || a.PUNKTE || 0));
                const bestScore = teamResultsInDiscipline.length > 0 ? (teamResultsInDiscipline[0].POINTSID || teamResultsInDiscipline[0].PUNKTE || 0) : null;

                return (
                  <motion.div
                    key={team.TEAMID}
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    custom={index}
                    whileHover="hover"
                    onClick={() => handleTeamSelect(team)}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-all duration-150 hover:shadow-md dark:hover:bg-slate-700/60 bg-slate-50 dark:bg-slate-800/40"
                    style={{ '--color-primary-500': '96, 165, 250' /* Tailwind blue-400 als RGB */ }}
                  >
                    <h3 className="font-semibold text-slate-800 dark:text-white text-lg truncate">{team.NAME}</h3>
                    {team.BESCHREIBUNG && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {team.BESCHREIBUNG}
                      </p>
                    )}
                    {bestScore !== null && (
                      <div className="mt-2 flex items-center text-xs text-amber-600 dark:text-amber-400">
                        <Trophy size={14} className="mr-1.5" />
                        <span>Aktueller Punktestand: <span className="font-bold">{bestScore}</span></span>
                      </div>
                    )}
                     {bestScore === null && (
                         <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Noch keine Punkte in dieser Disziplin.
                         </p>
                     )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SelectTeamForDisciplinePage; 