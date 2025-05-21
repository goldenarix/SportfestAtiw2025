import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDataContext } from '../../backend/DataLoader';
import { useAuth } from '../contexts/AuthContext';
import { triggerHapticFeedback } from '../utils/haptics';
import { ChevronLeft, Save, AlertTriangle, Loader2, User, Award, ListChecks, Info, UserPlus, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const ScoreEntryForSelectionPage = () => {
  const { teamId, disziplinId } = useParams();
  const navigate = useNavigate();
  const { teams, disziplins, schueler, ergebnisse, loading: dataLoading, error: dataError, refetchData } = useDataContext();
  const { user, loading: authLoading } = useAuth();

  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentDisziplin, setCurrentDisziplin] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [scores, setScores] = useState({}); // { [schuelerId]: punkte }
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }
  const [isSaving, setIsSaving] = useState(false);

  // Daten-Initialisierung
  useEffect(() => {
    if (teams && teamId) {
      setCurrentTeam(teams.find(t => t.TEAMID === parseInt(teamId)) || null);
    }
    if (disziplins && disziplinId) {
      setCurrentDisziplin(disziplins.find(d => d.DISZIPLINID === parseInt(disziplinId)) || null);
    }
  }, [teams, disziplins, teamId, disziplinId]);

  // Teammitglieder laden und existierende Scores setzen
  useEffect(() => {
    // NEUE DEBUG-AUSGABEN GANZ AM ANFANG
    console.log("🔴 ScoreEntryPage: useEffect für Teammitglieder - START");
    console.log("🔴 ScoreEntryPage: schueler:", schueler);
    console.log("🔴 ScoreEntryPage: currentTeam:", currentTeam);

    // Striktere Prüfung: Nur fortfahren, wenn schueler ein Array ist UND currentTeam existiert
    if (Array.isArray(schueler) && currentTeam) {
      // DEBUGGING: Logge die Struktur des ersten Schülers und die TeamID des aktuellen Teams
      if (schueler.length > 0) {
        console.log("🔍 ScoreEntryPage: Erster Schüler aus Kontext:", JSON.stringify(schueler[0]));
      }
      console.log("🔍 ScoreEntryPage: currentTeam.TEAMID für Filterung:", currentTeam.TEAMID, typeof currentTeam.TEAMID);
      console.log("🔍 ScoreEntryPage: schueler Array (die ersten 3):", schueler.slice(0,3));

      const members = schueler.filter(s => {
        // DEBUGGING: Logge die TeamID jedes Schülers beim Filtern
        // console.log(`   Filtere Schüler ${s.SCHUELERID || s.id}: s.TEAMID = ${s.TEAMID} (Typ: ${typeof s.TEAMID}) vs. currentTeam.TEAMID = ${currentTeam.TEAMID} (Typ: ${typeof currentTeam.TEAMID})`);
        return s.TEAMID === currentTeam.TEAMID;
      });
      setTeamMembers(members);

      // Existierende Scores für diese Teammitglieder und Disziplin laden
      if (ergebnisse && currentDisziplin) {
        const initialScores = {};
        members.forEach(member => {
          const existingScore = ergebnisse.find(
            e => e.SCHUELERID === member.SCHUELERID && 
                 e.DISZIPLINID === currentDisziplin.DISZIPLINID &&
                 e.TEAMID === currentTeam.TEAMID // Sicherstellen, dass es der Score für DIESES Team ist
          );
          if (existingScore) {
            initialScores[member.SCHUELERID] = existingScore.POINTSID || existingScore.PUNKTE || '';
          }
        });
        setScores(initialScores);
      }
    }
  }, [schueler, currentTeam, currentDisziplin, ergebnisse]);

  const handleScoreChange = (schuelerId, value) => {
    const newScores = { ...scores };
    newScores[schuelerId] = value === '' ? '' : parseFloat(value) || 0; // Erlaube leere Eingabe, parse als Zahl
    setScores(newScores);
  };

  const calculateTeamTotal = useMemo(() => {
    return Object.values(scores).reduce((total, score) => total + (parseFloat(score) || 0), 0);
  }, [scores]);

  const handleSubmitScores = async () => {
    if (!currentTeam || !currentDisziplin) return;
    setIsSaving(true);
    setNotification(null);
    triggerHapticFeedback('heavy');

    const scoresToSubmit = teamMembers
      .map(member => ({
        SCHUELERID: member.SCHUELERID,
        TEAMID: currentTeam.TEAMID,
        DISZIPLINID: currentDisziplin.DISZIPLINID,
        PUNKTE: scores[member.SCHUELERID] !== undefined && scores[member.SCHUELERID] !== '' ? parseFloat(scores[member.SCHUELERID]) : null,
      }))
      .filter(score => score.PUNKTE !== null); // Nur Scores senden, die einen Wert haben
    
    // Wenn keine Scores zum Senden, dann nicht submitten
    if (scoresToSubmit.length === 0) {
        setNotification({
            type: 'info',
            message: 'Keine Punkte zum Speichern eingegeben.'
        });
        setIsSaving(false);
        return;
    }

    try {
      // Hier wird die neue studentpoints Route verwendet
      const response = await fetch(`${import.meta.env.VITE_API_URL}/studentpoints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: scoresToSubmit }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNotification({ type: 'success', message: 'Punkte erfolgreich gespeichert!' });
        await refetchData(); // Korrigiere refreshData zu refetchData beim Aufruf
        // Optional: Zurück zur Auswahlseite oder Ergebnisseite navigieren
        // navigate(`/ergebnisse/team/${teamId}/disziplin-auswahl`); // Beispiel
      } else {
        throw new Error(result.error || 'Fehler beim Speichern der Punkte.');
      }
    } catch (error) {
      console.error("Fehler beim Speichern der Punkte:", error);
      setNotification({ type: 'error', message: error.message || 'Ein unerwarteter Fehler ist aufgetreten.' });
    } finally {
      setIsSaving(false);
    }
  };
  
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);


  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900">
        <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mb-4" />
        <p className="text-slate-700 dark:text-slate-300">Lade Punkteingabe...</p>
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
      </div>
    );
  }

  if (!currentTeam || !currentDisziplin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-50 dark:bg-amber-900/20">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
        <p className="text-amber-700 dark:text-amber-300 text-center">
          Team oder Disziplin nicht gefunden. Bitte versuchen Sie es erneut.
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
  
  const headerColor = currentTeam.NAME.length % 2 === 0 ? "from-purple-600 to-pink-600" : "from-teal-600 to-cyan-600";

  return (
    <motion.div 
      className="min-h-screen bg-slate-100 dark:bg-slate-900 pb-20"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */} 
        <div className={`p-6 sm:p-8 rounded-b-3xl shadow-lg bg-gradient-to-br ${headerColor} mb-8`}>
            <div className="flex items-center justify-between mb-6">
                <button 
                onClick={() => navigate(-1)} 
                className="flex items-center text-white/80 hover:text-white transition-colors p-2 -ml-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                aria-label="Zurück"
                >
                <ChevronLeft size={28} />
                </button>
                <div className="flex items-center space-x-3">
                    <Award size={32} className="text-yellow-300"/>
                    <ListChecks size={32} className="text-sky-300"/>
                </div> 
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
                Punkte für {currentTeam.NAME}
            </h1>
            <p className="text-lg text-white/90 text-center">
                Disziplin: <span className="font-semibold">{currentDisziplin.NAME}</span>
            </p>
        </div>

        {/* Teammitglieder und Punkteingabe */} 
        {teamMembers.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
            <UserPlus className="w-20 h-20 text-slate-400 dark:text-slate-500 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Keine Mitglieder im Team
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Für das Team "{currentTeam.NAME}" sind noch keine Mitglieder erfasst worden.
              Bitte fügen Sie zuerst Teammitglieder hinzu, um Punkte eintragen zu können.
            </p>
            <button
              onClick={() => navigate(`/participants?teamId=${currentTeam.TEAMID}`)} // Annahme: Route zur Teilnehmerverwaltung
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-base font-medium flex items-center mx-auto"
            >
              <UserPlus size={20} className="mr-2" /> Mitglieder verwalten
            </button>
          </div>
        ) : (
          <div className="space-y-4 px-4">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.SCHUELERID} 
                className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
              >
                <div className="flex items-center space-x-3 flex-grow">
                  <div className="w-12 h-12 bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-semibold text-lg">
                    {member.VORNAME.charAt(0)}{member.NACHNAME.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                      {member.VORNAME} {member.NACHNAME}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Klasse: {member.KLASSE || 'N/A'}</p>
                  </div>
                </div>
                <input 
                  type="number"
                  value={scores[member.SCHUELERID] || ''}
                  onChange={(e) => handleScoreChange(member.SCHUELERID, e.target.value)}
                  placeholder="Punkte"
                  className="w-full sm:w-32 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-center text-lg font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Gesamtpunktzahl und Speicherbutton - Nur anzeigen wenn Mitglieder vorhanden */} 
        {teamMembers.length > 0 && (
            <div className="sticky bottom-0 left-0 right-0 mt-8 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-top z-10">
                <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center text-slate-700 dark:text-slate-200">
                        <TrendingUp size={28} className="mr-3 text-green-500" />
                        <div>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Gesamtpunktzahl des Teams:</span>
                            <p className="font-bold text-2xl text-green-600 dark:text-green-400">{calculateTeamTotal.toLocaleString()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSubmitScores}
                        disabled={isSaving}
                        className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
                    >
                        {isSaving ? (
                        <Loader2 size={24} className="animate-spin mr-2" />
                        ) : (
                        <Save size={24} className="mr-2" />
                        )}
                        {isSaving ? 'Speichert...' : 'Punkte speichern'}
                    </button>
                </div>
            </div>
        )}
      </div>
        
      {/* Notification */} 
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed top-5 right-5 p-4 rounded-xl shadow-xl max-w-sm z-50 border-l-4
              ${notification.type === 'success' ? 'bg-green-50 dark:bg-green-800 border-green-500 dark:border-green-400 text-green-700 dark:text-green-200' : 
                notification.type === 'error' ? 'bg-red-50 dark:bg-red-800 border-red-500 dark:border-red-400 text-red-700 dark:text-red-200' : 
                'bg-blue-50 dark:bg-blue-800 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-200'}
            `}
          >
            <div className="flex items-center">
              {notification.type === 'success' && <Award size={20} className="mr-2" />}
              {notification.type === 'error' && <AlertTriangle size={20} className="mr-2" />}
              {notification.type === 'info' && <Info size={20} className="mr-2" />}
              <p className="font-medium">{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ScoreEntryForSelectionPage; 