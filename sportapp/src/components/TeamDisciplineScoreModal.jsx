import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Database, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import StudentScoreEntry from './StudentScoreEntry';

const TeamDisciplineScoreModal = ({ team, onClose }) => {
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState({
    disciplines: true,
    students: false,
    saving: false
  });
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Load disciplines from API
  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        setLoading(prev => ({ ...prev, disciplines: true }));
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/disziplins`);
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setDisciplines(result.data || []);
        } else {
          throw new Error(result.error || 'Failed to load disciplines');
        }
        
      } catch (err) {
        console.error('Error loading disciplines:', err);
        setError(`Disziplinen konnten nicht geladen werden: ${err.message}`);
      } finally {
        setLoading(prev => ({ ...prev, disciplines: false }));
      }
    };
    
    fetchDisciplines();
  }, []);
  
  // Load students when team and discipline are selected
  useEffect(() => {
    if (team?.TEAMID && selectedDisciplineId) {
      const fetchTeamStudents = async () => {
        try {
          setLoading(prev => ({ ...prev, students: true }));
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/teams/${team.TEAMID}/students`);
          
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          
          const result = await response.json();
          
          if (result.success) {
            setStudents(result.data || []);
          } else {
            throw new Error(result.error || 'Failed to load team students');
          }
          
        } catch (err) {
          console.error('Error loading team students:', err);
          setError(`Schüler konnten nicht geladen werden: ${err.message}`);
        } finally {
          setLoading(prev => ({ ...prev, students: false }));
        }
      };
      
      fetchTeamStudents();
    } else {
      setStudents([]);
    }
  }, [team?.TEAMID, selectedDisciplineId]);
  
  // Handle discipline selection
  const handleDisciplineChange = (e) => {
    setSelectedDisciplineId(e.target.value);
  };
  
  // Handle score save
  const handleSaveScores = async (scores) => {
    if (scores.length === 0) {
      setNotification({
        type: 'warning',
        message: 'Keine Punkte zum Speichern eingegeben.'
      });
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, saving: true }));
      
      // Make sure each score has the team ID
      const scoresWithTeam = scores.map(score => ({
        ...score,
        TEAMID: team.TEAMID
      }));
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/studentpoints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scores: scoresWithTeam }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: `${result.message || 'Punkte erfolgreich gespeichert!'}`
        });
      } else {
        throw new Error(result.error || 'Failed to save scores');
      }
      
    } catch (err) {
      console.error('Error saving scores:', err);
      setNotification({
        type: 'error',
        message: `Fehler beim Speichern der Punkte: ${err.message}`
      });
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };
  
  // Overlay animation
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };
  
  // Modal animation
  const modalVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        {/* Modal content */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center">
              <Award className="mr-2" />
              Punkte für Team: <span className="ml-2 text-indigo-600 dark:text-indigo-400">{team?.NAME || 'Team'}</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Modal body */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Notification */}
            <AnimatePresence>
              {notification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`m-4 p-3 rounded-lg flex items-center ${
                    notification.type === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : notification.type === 'warning'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}
                >
                  {notification.type === 'success' 
                    ? <CheckCircle className="h-5 w-5 mr-2" /> 
                    : notification.type === 'warning' 
                      ? <AlertTriangle className="h-5 w-5 mr-2" />
                      : <AlertTriangle className="h-5 w-5 mr-2" />}
                  <span>{notification.message}</span>
                  <button 
                    onClick={() => setNotification(null)}
                    className="ml-auto p-1 rounded-full hover:bg-white/20"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Discipline selector */}
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Disziplin auswählen*
                </label>
                <div className="relative">
                  {loading.disciplines ? (
                    <div className="flex items-center justify-center py-2">
                      <RefreshCw size={20} className="animate-spin mr-2 text-indigo-500" />
                      <span className="text-slate-600 dark:text-slate-300">Lade Disziplinen...</span>
                    </div>
                  ) : (
                    <select
                      value={selectedDisciplineId}
                      onChange={handleDisciplineChange}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                      required
                    >
                      <option value="">Bitte wählen...</option>
                      {disciplines.map(discipline => (
                        <option key={discipline.DISZIPLINID} value={discipline.DISZIPLINID}>
                          {discipline.NAME || `Disziplin ${discipline.DISZIPLINID}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>
              
              {/* Student score entry section */}
              {selectedDisciplineId && (
                <div className="mt-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                  <h4 className="text-md font-medium text-slate-800 dark:text-white mb-2 flex items-center">
                    <Database size={18} className="mr-2" />
                    Punkte für Schüler vergeben
                  </h4>
                  
                  <StudentScoreEntry 
                    students={students}
                    disciplineId={selectedDisciplineId}
                    teamId={team?.TEAMID}
                    onSaveScores={handleSaveScores}
                    isLoading={loading.saving}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Modal footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Schließen
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeamDisciplineScoreModal;
