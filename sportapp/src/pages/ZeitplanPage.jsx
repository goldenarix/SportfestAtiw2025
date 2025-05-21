import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDataContext } from '../../backend/DataLoader'; // Or your context/hook for fetching all data
import { Clock, ListFilter, Upload, AlertTriangle, CheckCircle, Users, Activity, MapPin, CalendarDays, Info } from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: (index) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: index * 0.05 }
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

const ZeitplanPage = () => {
  const { currentUser, isAdmin, token } = useAuth(); // Assuming token is available for API calls
  const dataContext = useDataContext(); // Using a generic data context

  const [zeitplanEntries, setZeitplanEntries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: string }

  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all'); // 'all' or teamId
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch initial data (Zeitplan and Teams)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const zeitplanResponse = await fetch(`${import.meta.env.VITE_API_URL}/zeitplan`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const teamsResponse = await fetch(`${import.meta.env.VITE_API_URL}/teams`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!zeitplanResponse.ok || !teamsResponse.ok) {
          let errorMsg = 'Fehler beim Laden der Daten.';
          if (!zeitplanResponse.ok) errorMsg += ` Zeitplan: ${zeitplanResponse.statusText}.`;
          if (!teamsResponse.ok) errorMsg += ` Teams: ${teamsResponse.statusText}.`;
          throw new Error(errorMsg);
        }

        const zeitplanData = await zeitplanResponse.json();
        const teamsData = await teamsResponse.json();

        if (zeitplanData.success) {
          // Parse STARTZEIT and ENDEZEIT into Date objects
          const parsedEntries = (zeitplanData.data || []).map(entry => ({
            ...entry,
            STARTZEIT: new Date(entry.STARTZEIT),
            ENDEZEIT: new Date(entry.ENDEZEIT)
          }));
          setZeitplanEntries(parsedEntries);
        } else {
          throw new Error(zeitplanData.error || 'Fehler beim Laden des Zeitplans');
        }

        if (teamsData.success) {
          setTeams(teamsData.data || []);
        } else {
          throw new Error(teamsData.error || 'Fehler beim Laden der Teams');
        }

      } catch (err) {
        console.error('Fetch Data Error:', err);
        setError(err.message);
        triggerHapticFeedback('error');
      } finally {
        setLoading(false);
      }
    };

    if (token) { // Only fetch if token is available
        fetchData();
    }
  }, [token]);

  // Update current time every minute for the timeline indicator
  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timerId);
  }, []);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filtered Zeitplan entries based on selectedTeamFilter
  const filteredZeitplan = useMemo(() => {
    if (selectedTeamFilter === 'all') {
      return zeitplanEntries;
    }
    return zeitplanEntries.filter(entry => entry.TEAMID === parseInt(selectedTeamFilter));
  }, [zeitplanEntries, selectedTeamFilter]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setNotification(null);
    triggerHapticFeedback('light');

    const formData = new FormData();
    formData.append('zeitplanFile', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/zeitplan/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Content-Type is set automatically by FormData
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setNotification({ type: 'success', message: result.message || 'Zeitplan erfolgreich importiert!' });
        triggerHapticFeedback('success');
        // Refetch data
        const zeitplanResponse = await fetch(`${import.meta.env.VITE_API_URL}/zeitplan`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const newZeitplanData = await zeitplanResponse.json();
        if (newZeitplanData.success) {
             const parsedEntries = (newZeitplanData.data || []).map(entry => ({
                ...entry,
                STARTZEIT: new Date(entry.STARTZEIT),
                ENDEZEIT: new Date(entry.ENDEZEIT)
              }));
            setZeitplanEntries(parsedEntries);
        }
      } else {
        setError(result.error || 'Fehler beim Importieren des Zeitplans.');
        setNotification({ type: 'error', message: result.error || 'Import fehlgeschlagen.' });
        triggerHapticFeedback('error');
      }
    } catch (err) {
      console.error('Import Error:', err);
      setError('Ein Netzwerkfehler ist beim Import aufgetreten.');
      setNotification({ type: 'error', message: 'Netzwerkfehler beim Import.' });
      triggerHapticFeedback('error');
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = null;
    }
  };
  
  // ----- TIMELINE LOGIC -----
  const timelineStartHour = 5;
  const timelineEndHour = 22;
  const hours = Array.from({ length: timelineEndHour - timelineStartHour + 1 }, (_, i) => timelineStartHour + i);

  const getPositionAndWidth = (startTime, endTime) => {
    const timelineDurationMinutes = (timelineEndHour - timelineStartHour + 1) * 60;
    
    const startOfDay = new Date(startTime);
    startOfDay.setHours(timelineStartHour, 0, 0, 0);

    const entryStartMinutes = (startTime.getTime() - startOfDay.getTime()) / 60000;
    const entryEndMinutes = (endTime.getTime() - startOfDay.getTime()) / 60000;

    const leftPercentage = (entryStartMinutes / timelineDurationMinutes) * 100;
    const widthPercentage = ((entryEndMinutes - entryStartMinutes) / timelineDurationMinutes) * 100;

    return {
      left: `${Math.max(0, leftPercentage)}%`,
      width: `${Math.min(100 - Math.max(0, leftPercentage), widthPercentage)}%`,
    };
  };
  
  const getCurrentTimePosition = () => {
    if (!currentTime) return '0%';
    const timelineDurationMinutes = (timelineEndHour - timelineStartHour + 1) * 60;
    const startOfDayTimeline = new Date(currentTime);
    startOfDayTimeline.setHours(timelineStartHour, 0, 0, 0);

    const currentMinutesInTimeline = (currentTime.getTime() - startOfDayTimeline.getTime()) / 60000;
    const leftPercentage = (currentMinutesInTimeline / timelineDurationMinutes) * 100;
    return `${Math.max(0, Math.min(100, leftPercentage))}%`;
  };


  if (loading && zeitplanEntries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="p-4 md:p-6 lg:p-8 max-w-full mx-auto bg-slate-50 dark:bg-slate-900 min-h-screen"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Zeitplan Sportfest</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {isAdmin && (
            <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out flex items-center">
              <Upload size={20} className="mr-2" />
              Zeitplan importieren (.xlsx)
              <input type="file" accept=".xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
          <div className="relative w-full sm:w-auto min-w-[200px]">
            <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select 
              value={selectedTeamFilter}
              onChange={(e) => {
                setSelectedTeamFilter(e.target.value);
                triggerHapticFeedback('light');
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-shadow appearance-none"
            >
              <option value="all">Alle Teams anzeigen</option>
              {teams.map(team => (
                <option key={team.TEAMID} value={team.TEAMID}>{team.NAME}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notification Area */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-4 p-3 rounded-lg shadow flex items-center text-sm font-medium ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-200'}`}
        >
          {notification.type === 'success' ? <CheckCircle size={20} className="mr-2" /> : <AlertTriangle size={20} className="mr-2" />}
          {notification.message}
        </motion.div>
      )}
      {error && !notification && (
         <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mb-4 p-3 rounded-lg shadow flex items-center text-sm font-medium bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-200`}
        >
          <AlertTriangle size={20} className="mr-2" />
          {error}
        </motion.div>
      )}

      {/* Timeline Container */}
      {loading && zeitplanEntries.length > 0 && (
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center z-50">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl p-4 md:p-6 overflow-x-auto relative min-h-[600px]">
        {/* Time Gutter (Hours) */}
        <div className="flex sticky left-0 bg-white dark:bg-slate-800 z-20 border-b border-slate-200 dark:border-slate-700">
          <div className="w-24 md:w-28 flex-shrink-0 py-2 border-r border-slate-200 dark:border-slate-700"> {/* Time column header */}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Team</span>
          </div>
          <div className="flex-grow grid grid-cols-[repeat(18,minmax(0,1fr))]"> {/* 18 hours from 5 to 22 */}
            {hours.map(hour => (
              <div key={hour} className="h-10 flex items-center justify-center border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{`${String(hour).padStart(2, '0')}:00`}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Time Indicator Line - Relative to the content area after the gutter */}
        <div 
            className="absolute h-full top-0 bottom-0 border-l-2 border-red-500 z-10" 
            style={{ left: `calc(100px + ${getCurrentTimePosition()})`}} // 100px approx for gutter width (w-24/w-28) - adjust if gutter width changes
        >
            <div className="absolute -top-2 -ml-2.5 bg-red-500 text-white text-[10px] px-1 py-0.5 rounded-full shadow-lg">Jetzt</div>
        </div>

        {/* Team Rows */}
        <AnimatePresence>
        {(selectedTeamFilter === 'all' ? teams : teams.filter(t => t.TEAMID === parseInt(selectedTeamFilter)))
          .sort((a, b) => a.NAME.localeCompare(b.NAME))
          .map((team, teamIndex) => (
          <motion.div 
            key={team.TEAMID} 
            className="flex border-b border-slate-200 dark:border-slate-700 last:border-b-0"
            variants={itemVariants}
            initial="initial"
            animate="animate"
            custom={teamIndex}
          >
            {/* Team Name Gutter */}
            <div className="w-24 md:w-28 flex-shrink-0 py-3 px-2 flex items-center justify-start border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 sticky left-0 z-10">
              <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 truncate" title={team.NAME}>{team.NAME}</span>
            </div>

            {/* Timeline Grid for events */}
            <div className="flex-grow relative h-auto"> {/* Each team row has its own relative container for events */}
              {/* Background Grid Lines for each hour slot (visual aid) */}
              <div className="absolute inset-0 grid grid-cols-[repeat(18,minmax(0,1fr))] pointer-events-none">
                {hours.map(hour => (
                  <div key={`bg-${hour}-${team.TEAMID}`} className="border-r border-slate-100 dark:border-slate-700/50 last:border-r-0 h-full"></div>
                ))}
              </div>

              {filteredZeitplan
                .filter(entry => entry.TEAMID === team.TEAMID)
                .map((entry, entryIndex) => {
                  const { left, width } = getPositionAndWidth(entry.STARTZEIT, entry.ENDEZEIT);
                  const isPast = entry.ENDEZEIT < currentTime;
                  const isCurrent = entry.STARTZEIT <= currentTime && entry.ENDEZEIT >= currentTime;
                  const isUpcoming = entry.STARTZEIT > currentTime;
                  
                  let bgColor = 'bg-blue-500 hover:bg-blue-600';
                  if (isPast) bgColor = 'bg-slate-400 hover:bg-slate-500';
                  if (isCurrent) bgColor = 'bg-green-500 hover:bg-green-600 ring-2 ring-offset-2 ring-green-400 dark:ring-offset-slate-800';

                  return (
                    <motion.div
                      key={entry.ZEITPLANID}
                      className={`absolute my-1.5 p-2 rounded-lg shadow-md text-white cursor-pointer transition-all duration-150 ease-in-out ${bgColor}`}
                      style={{ left, width, minWidth: '50px'}} // Ensure minWidth for very short events
                      title={`${entry.TEAM_NAME} - ${entry.DISZIPLIN_NAME}\n${entry.STARTZEIT.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} - ${entry.ENDEZEIT.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}\nOrt: ${entry.ORT || 'N/A'}${entry.NOTIZ ? '\nNotiz: ' + entry.NOTIZ : ''}`}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      custom={entryIndex}
                      whileHover={{ scale: 1.03, zIndex: 10 }}
                      onClick={() => triggerHapticFeedback('light')}
                    >
                      <p className="text-xs font-semibold truncate">{entry.DISZIPLIN_NAME}</p>
                      <p className="text-[10px] truncate">
                        {entry.STARTZEIT.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})} - {entry.ENDEZEIT.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      {entry.ORT && <p className="text-[10px] truncate"><MapPin size={10} className="inline mr-1"/>{entry.ORT}</p>}
                    </motion.div>
                  );
              })}
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
        {filteredZeitplan.length === 0 && !loading && (
            <div className="text-center py-10 col-span-full">
                <CalendarDays size={48} className="mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                <p className="text-slate-500 dark:text-slate-400">
                    {selectedTeamFilter === 'all' ? 'Keine Zeitplan-Einträge vorhanden.' : 'Für dieses Team sind keine Zeitplan-Einträge vorhanden.'}
                </p>
                {isAdmin && selectedTeamFilter === 'all' && (
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Importieren Sie eine Excel-Datei, um den Zeitplan zu füllen.</p>
                )}
            </div>
        )}
      </div>
    </motion.div>
  );
};

export default ZeitplanPage; 