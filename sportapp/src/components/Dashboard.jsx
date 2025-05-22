import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Flag, 
  Trophy, 
  Activity, 
  Clock, 
  Award, 
  Medal,
  ChevronRight,
  BarChart2,
  ListOrdered,
  User,
  MapPin,
  Map,
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
  Clock3,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Shield,
  LogOut,
  Briefcase,
  CalendarClock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { triggerHapticFeedback } from '../utils/haptics';
import { useMediaQuery } from '../utils/responsive';
import { useTheme } from '../contexts/ThemeProvider';
import StatCard from '../components/ui/StatCard';
import { useDataContext } from '../../backend/DataLoader';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      when: "beforeChildren"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalDisziplinen: 0,
    totalCompetitors: 0,
    completedDisciplines: 0,
    topTeam: null,
    upcomingEvents: []
  });
  
  const [betreuerStats, setBetreuerStats] = useState({
    assignedTeams: [],
    assignedDisciplines: [],
    completedResults: 0,
    role: null,
    name: null
  });
  
  const [nextAssignedEvent, setNextAssignedEvent] = useState(null);
  const [nextEventLoading, setNextEventLoading] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser: user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { zeitplan, zeitplanLoading, fetchZeitplan: fetchZeitplanDataFromContext, disziplins: allDisziplins } = useDataContext();
  
  // Responsive design breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Team rankings for leaderboard
  const [teamRankings, setTeamRankings] = useState([]);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false); // New state for leaderboard toggle
  
  // Greeting based on time of day
  const timeBasedGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  }, []);
  
  // Fetch all stats for dashboard
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const baseUrl = import.meta.env.VITE_API_URL || '';
      console.log('Fetching dashboard data from API URL:', baseUrl);
      
      // Fetch general stats
      const [teamsRes, disziplinenRes, schuelersRes, ergebnisseRes] = await Promise.all([
        fetch(`${baseUrl}/teams`),
        fetch(`${baseUrl}/disziplins`),
        fetch(`${baseUrl}/schueler`),
        fetch(`${baseUrl}/ergebnisse`)
      ]);
      
      if ([teamsRes, disziplinenRes, schuelersRes, ergebnisseRes].some(res => !res.ok)) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const [teamsData, disziplinenData, schuelersData, ergebnisseData] = await Promise.all([
        teamsRes.json(),
        disziplinenRes.json(),
        schuelersRes.json(),
        ergebnisseRes.json()
      ]);
      
      // Fetch betreuer-specific data if logged in
      let betreuerData = null;
      if (user?.id) {
        console.log('Fetching betreuer data for user ID:', user.id);
        try {
          const betreuerRes = await fetch(`${baseUrl}/betreuer/${user.id}?withAssignments=true`);
          if (betreuerRes.ok) {
            betreuerData = await betreuerRes.json();
            console.log('Betreuer data received:', betreuerData);
          } else {
            console.error('Failed to fetch betreuer data:', await betreuerRes.text());
          }
        } catch (err) {
          console.error('Error fetching betreuer data:', err);
        }
      }
      
      // Process team rankings
      const teams = teamsData.success ? teamsData.data : [];
      const ergebnisse = ergebnisseData.success ? ergebnisseData.data : [];
      
      const processedTeams = teams.map(team => {
        const teamScores = ergebnisse.filter(e => e.TEAMID === team.TEAMID);
        const totalPoints = teamScores.reduce((sum, result) => {
          // Handle both PUNKTE and POINTSID fields
          const points = result.PUNKTE !== undefined ? parseFloat(result.PUNKTE) : 
                         result.POINTSID !== undefined ? parseFloat(result.POINTSID) : 0;
          return sum + points;
        }, 0);
        
        return {
          ...team,
          totalPoints: totalPoints,
          formattedPoints: totalPoints.toFixed(1)
        };
      }).sort((a, b) => b.totalPoints - a.totalPoints);
      
      setTeamRankings(processedTeams);
      
      // Find top team
      const topTeam = processedTeams.length > 0 ? processedTeams[0] : null;
      
      // Count completed disciplines
      const uniqueCompletedDisciplines = new Set(ergebnisse.map(e => e.DISZIPLINID));
      
      // Update general stats
      setStats({
        totalTeams: teams.length,
        totalDisziplinen: disziplinenData.success ? disziplinenData.data.length : 0,
        totalCompetitors: schuelersData.success ? schuelersData.data.length : 0,
        completedDisciplines: uniqueCompletedDisciplines.size,
        topTeam: topTeam,
        upcomingEvents: [] // Would be populated from a schedule API
      });
      
      // Update betreuer stats if available
      if (betreuerData && betreuerData.success) {
        const betreuer = betreuerData.data;
        console.log('Successfully parsed betreuer data:', betreuer);
        
        // Calculate results completed by this betreuer
        let completedResults = 0;
        
        if (betreuer.ROLLE === 'stationaer' && betreuer.disziplinen) {
          // For stationaer betreuer, count results in their disciplines
          const disziplinIds = betreuer.disziplinen.map(d => d.DISZIPLINID);
          completedResults = ergebnisse.filter(e => disziplinIds.includes(e.DISZIPLINID)).length;
        } else if (betreuer.ROLLE === 'laufend' && betreuer.teams) {
          // For laufend betreuer, count results from their teams
          const teamIds = betreuer.teams.map(t => t.TEAMID);
          completedResults = ergebnisse.filter(e => teamIds.includes(e.TEAMID)).length;
        }
        
        setBetreuerStats({
          assignedTeams: betreuer.teams || [],
          assignedDisciplines: betreuer.disziplinen || [],
          completedResults,
          role: betreuer.ROLLE,
          name: betreuer.NAME
        });
        
        console.log('Updated betreuer stats:', {
          teams: betreuer.teams?.length || 0,
          disciplines: betreuer.disziplinen?.length || 0,
          role: betreuer.ROLLE
        });
      } else {
        console.warn('No betreuer data available or invalid format');
        
        // If we have user data but no betreuer assignment data, still set the user name
        if (user?.name) {
          setBetreuerStats(prev => ({
            ...prev,
            name: user.name
          }));
        }
      }
      
      // Ensure Zeitplan data is fetched if not already loading or available
      if (fetchZeitplanDataFromContext && !zeitplanLoading && (!zeitplan || zeitplan.length === 0)) {
        console.log("Dashboard: Triggering Zeitplan fetch.");
        fetchZeitplanDataFromContext();
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    if (!user || (!zeitplan && !zeitplanLoading)) {
      // If zeitplan is not loaded and not currently loading, try fetching it.
      if (fetchZeitplanDataFromContext && !zeitplanLoading) {
         // console.log("Dashboard: useEffect[user, zeitplan] - Zeitplan seems empty and not loading, fetching...");
         // fetchZeitplanDataFromContext(); // This might cause too many fetches if zeitplan is genuinely empty
      }
      // return; // Don't return yet, allow processing if zeitplan becomes available
    }
    
    if (!zeitplan || zeitplan.length === 0 || authLoading) {
        // console.log("Dashboard: Next event processing skipped (no zeitplan, or auth loading).");
        setNextAssignedEvent(null); // Clear if no data
        return;
    }

    setNextEventLoading(true);
    // console.log("Dashboard: Processing next assigned event. Betreuer role:", betreuerStats.role);
    // console.log("Dashboard: Assigned Teams:", betreuerStats.assignedTeams);
    // console.log("Dashboard: Assigned Disciplines:", betreuerStats.assignedDisciplines);

    const now = new Date();
    let relevantEvents = [];

    const parsedZeitplan = zeitplan.map(event => ({
      ...event,
      STARTZEIT_DATE: new Date(event.STARTZEIT),
      ENDEZEIT_DATE: new Date(event.ENDEZEIT),
    })).filter(event => event.ENDEZEIT_DATE > now) // Filter out past events
       .sort((a, b) => a.STARTZEIT_DATE - b.STARTZEIT_DATE); // Sort by start time

    if (user.role === 'admin' && (!betreuerStats.role || betreuerStats.role === 'admin_only_viewer')) { // Hypothetical role if admin is not a betreuer
        relevantEvents = parsedZeitplan;
        // console.log("Dashboard: Admin view - considering all upcoming events:", relevantEvents.length);
    } else if (betreuerStats.role === 'laufend' && betreuerStats.assignedTeams?.length > 0) {
      const assignedTeamIds = betreuerStats.assignedTeams.map(t => t.TEAMID);
      relevantEvents = parsedZeitplan.filter(event => assignedTeamIds.includes(event.TEAMID));
      // console.log("Dashboard: Laufender Betreuer - relevant events for teams:", relevantEvents.length, assignedTeamIds);
    } else if (betreuerStats.role === 'stationaer' && betreuerStats.assignedDisciplines?.length > 0) {
      const assignedDisciplineIds = betreuerStats.assignedDisciplines.map(d => d.DISZIPLINID);
      relevantEvents = parsedZeitplan.filter(event => assignedDisciplineIds.includes(event.DISZIPLINID));
      // console.log("Dashboard: Stationärer Betreuer - relevant events for disciplines:", relevantEvents.length, assignedDisciplineIds);
    } else {
      // Fallback for Betreuer without specific role details yet, or other cases
      // console.log("Dashboard: No specific Betreuer role for event filtering, or no assignments. Showing general next event if admin, or none.");
      if(user.role === 'admin') relevantEvents = parsedZeitplan; // Admin sees general if no betreuer role
      else relevantEvents = []; // Non-admin betreuer with no assignments sees nothing here
    }
    
    setNextAssignedEvent(relevantEvents.length > 0 ? relevantEvents[0] : null);
    // console.log("Dashboard: Next assigned event set to:", relevantEvents.length > 0 ? relevantEvents[0] : "null");
    setNextEventLoading(false);

  }, [user, zeitplan, betreuerStats.assignedTeams, betreuerStats.assignedDisciplines, betreuerStats.role, authLoading, fetchZeitplanDataFromContext, zeitplanLoading]);
  
  const handleRefresh = () => {
    setRefreshing(true);
    triggerHapticFeedback('medium');
    fetchDashboardData();
  };
  
  // Navigation handlers with haptic feedback
  const navigateWithHaptics = (path) => {
    triggerHapticFeedback('light');
    navigate(path);
  };
  
  // Get completion percentage
  const getCompletionPercentage = () => {
    if (stats.totalDisziplinen === 0) return 0;
    return Math.round((stats.completedDisciplines / stats.totalDisziplinen) * 100);
  };
  
  // Generate progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage < 30) return 'from-rose-500 to-red-500';
    if (percentage < 70) return 'from-amber-500 to-orange-500';
    return 'from-green-500 to-emerald-500';
  };

  const formatEventTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDatePretty = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return `Heute, ${formatEventTime(date)}`;
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Morgen, ${formatEventTime(date)}`;
    }
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' }) + ` ${formatEventTime(date)}`;
  };

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Role-specific greeting - now includes refresh button and is at the top */}
      {!loading && !authLoading && user && (
        <motion.div 
          className="p-6 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl text-white shadow-xl relative" // Added relative positioning
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.1, // Adjusted delay for quicker appearance
            duration: 0.5,
            type: "spring", 
            stiffness: 100 
          }}
        >
          {/* Refresh Button - Moved inside and to top right */}
          <button 
            className={`absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ${refreshing ? 'animate-spin' : ''}`}
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh dashboard"
          >
            <RefreshCw size={20} />
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-xl shadow-inner">
              {user.role === 'admin' ? (
                <Shield size={28} />
              ) : betreuerStats.role === 'stationaer' ? (
                <MapPin size={28} />
              ) : betreuerStats.role === 'laufend' ? (
                <Map size={28} />
              ) : (
                <User size={28} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold flex items-center">
                {timeBasedGreeting}
                {user.role === 'admin' ? `, Administrator ${user.name}` : betreuerStats.name ? `, ${betreuerStats.name}` : user?.name ? `, ${user.name}` : ''}!
              </h2>
              <p className="mt-1 text-indigo-100 text-opacity-90 max-w-md"> {/* Added max-w-md for better text flow */}
                {user.role === 'admin' ? (
                  `Verwalte das Sportfest und behalte den Überblick.`
                ) : betreuerStats.role === 'stationaer' ? (
                  `Sie sind als stationärer Betreuer angemeldet mit ${betreuerStats.assignedDisciplines.length} zugewiesenen Disziplinen.`
                ) : betreuerStats.role === 'laufend' ? (
                  `Sie sind als laufender Betreuer angemeldet mit ${betreuerStats.assignedTeams.length} zugewiesenen Teams.` 
                ) : (
                  'Sie sind angemeldet. Willkommen zum Sportfest!'
                )}
              </p>
              
              {/* Last login info */}
              <div className="mt-2 flex items-center text-xs text-indigo-100/70">
                <Clock3 size={14} className="mr-1" />
                <span>Letzte Aktivität: Heute, 09:45 Uhr</span>
              </div>
              
              {/* Quick action button */}
              <button 
                className="mt-4 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-lg flex items-center text-sm font-medium transition-all shadow-sm hover:shadow"
                onClick={() => {
                  triggerHapticFeedback('medium');
                  navigate(betreuerStats.role === 'stationaer' 
                    ? '/disziplinen' 
                    : betreuerStats.role === 'laufend'
                    ? '/participants'
                    : user.role === 'admin'
                    ? '/ergebnisse'
                    : '/ergebnisse');
                }}
              >
                {betreuerStats.role === 'stationaer' 
                  ? 'Zu meinen Disziplinen' 
                  : betreuerStats.role === 'laufend'
                  ? 'Zu meinen Teams'
                  : 'Zu den Ergebnissen'}
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 dark:border-indigo-900/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          </div>
        </div>
      ) : error ? (
        <motion.div 
          className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-5 mb-6 rounded-lg shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <AlertCircle className="mr-3 flex-shrink-0" size={24} />
            <p className="font-medium">{error}</p>
          </div>
          <button 
            className="mt-3 px-4 py-2 bg-red-200 dark:bg-red-800 hover:bg-red-300 dark:hover:bg-red-700 text-red-800 dark:text-red-200 rounded-lg transition-colors text-sm flex items-center"
            onClick={handleRefresh}
          >
            <RefreshCw size={14} className="mr-2" />
            Neu laden
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`space-y-8 ${(!loading && !authLoading && user) ? 'mt-6' : ''}`} // Add margin-top if welcome banner is shown
          >
            {/* === REORDERED SECTION: Meine Übersicht & Rangliste FIRST === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Removed mb-8 to let space-y handle it */}
              {/* Betreuer overview / "Meine Übersicht" - now larger and first on mobile */}
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 order-first lg:order-none flex flex-col"
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Briefcase className="mr-2.5 text-blue-500 dark:text-blue-400" size={24} />
                    Meine Übersicht
                  </h2>
                </div>
                
                {authLoading ? (
                  <div className="flex justify-center items-center py-8 flex-grow">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-5 flex-grow flex flex-col">
                    {/* Role indicator */}
                    <div className="flex items-start p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700/80">
                      <div className={`p-2.5 rounded-lg mr-3.5 shadow-sm ${
                        betreuerStats.role === 'stationaer' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                          : betreuerStats.role === 'laufend'
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : user.role === 'admin'
                          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {betreuerStats.role === 'stationaer' ? (
                          <MapPin size={20} />
                        ) : betreuerStats.role === 'laufend' ? (
                          <Map size={20} />
                        ) : user.role === 'admin' ? (
                           <Shield size={20}/>
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Ihre Rolle</span>
                        <p className="font-semibold text-gray-800 dark:text-white text-base">
                          {user.role === 'admin' && (!betreuerStats.role || betreuerStats.role === 'admin_only_viewer')
                            ? 'Administrator'
                            : betreuerStats.role === 'stationaer' 
                            ? 'Stationärer Betreuer' 
                            : betreuerStats.role === 'laufend'
                            ? 'Laufender Betreuer'
                            : betreuerStats.role 
                            ? betreuerStats.role.charAt(0).toUpperCase() + betreuerStats.role.slice(1)
                            : 'Nutzer'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Next Assigned Event Section */}
                    {(user.role === 'betreuer' || betreuerStats.role ) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                        className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => {
                          triggerHapticFeedback('light');
                          navigate('/zeitplan');
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold flex items-center">
                            <CalendarClock size={18} className="mr-2 opacity-90" />
                            Nächster Einsatz
                          </h3>
                          {(nextEventLoading || zeitplanLoading && !nextAssignedEvent) && (
                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                          )}
                        </div>
                        {nextAssignedEvent ? (
                          <div className="space-y-1.5">
                            <p className="text-lg font-bold truncate" title={nextAssignedEvent.DISZIPLIN_NAME}>
                              {nextAssignedEvent.DISZIPLIN_NAME || 'Unbekannte Disziplin'}
                            </p>
                            <div className="text-xs opacity-80 space-y-0.5">
                              <p className="flex items-center">
                                <Users size={13} className="mr-1.5 flex-shrink-0" /> 
                                Team: {nextAssignedEvent.TEAM_NAME || 'N/A'}
                              </p>
                              <p className="flex items-center">
                                <Clock size={13} className="mr-1.5 flex-shrink-0" /> 
                                Zeit: {formatDatePretty(nextAssignedEvent.STARTZEIT_DATE)}
                              </p>
                              {nextAssignedEvent.ORT && (
                                <p className="flex items-center">
                                  <MapPin size={13} className="mr-1.5 flex-shrink-0" />
                                  Ort: {nextAssignedEvent.ORT}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (!nextEventLoading && !zeitplanLoading) ? (
                          <p className="text-sm text-indigo-100/80 py-2 text-center">
                            Momentan keine bevorstehenden Einsätze für Sie im Zeitplan.
                          </p>
                        ) : (
                           <p className="text-sm text-indigo-100/80 py-2 text-center">Lade nächste Einsätze...</p>
                        )}
                      </motion.div>
                    )}

                    {/* Assignments with animation */}
                    {betreuerStats.role === 'stationaer' ? (
                      <div className="pt-3">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                          <Flag size={15} className="mr-1.5 text-blue-500 dark:text-blue-400" />
                          Ihre Disziplinen
                        </h3>
                        <div className="space-y-1.5">
                          {betreuerStats.assignedDisciplines && betreuerStats.assignedDisciplines.length > 0 ? (
                            betreuerStats.assignedDisciplines.slice(0, isMobile ? 2 : 4).map((disziplin, index) => (
                              <motion.div 
                                key={disziplin.DISZIPLINID || `discipline-${index}`}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-300 text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex justify-between items-center group"
                                onClick={() => {
                                  navigateWithHaptics(`/disziplinen/${disziplin.DISZIPLINID}`);
                                }}
                              >
                                <span className="truncate">{disziplin.NAME || `Disziplin ${index + 1}`}</span>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0" />
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-700/60">
                              <MapPin size={20} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
                              Keine Disziplinen zugewiesen.
                            </div>
                          )}
                           {betreuerStats.assignedDisciplines?.length > (isMobile ? 2 : 4) && (
                             <button onClick={() => navigateWithHaptics('/disziplinen')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1.5">Alle anzeigen</button>
                           )}
                        </div>
                      </div>
                    ) : betreuerStats.role === 'laufend' ? (
                      <div className="pt-3">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                           <Users size={15} className="mr-1.5 text-green-500 dark:text-green-400" />
                          Ihre Teams
                        </h3>
                        <div className="space-y-1.5">
                          {betreuerStats.assignedTeams && betreuerStats.assignedTeams.length > 0 ? (
                            betreuerStats.assignedTeams.slice(0, isMobile ? 2 : 4).map((team, index) => (
                              <motion.div 
                                key={team.TEAMID || `team-${index}`}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-300 text-sm cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex justify-between items-center group"
                                onClick={() => {
                                  // Navigate to score entry for this team
                                  navigateWithHaptics(`/ergebnisse/team/${team.TEAMID}/disziplin-auswahl`);
                                }}
                                title={`Punkte eintragen für ${team.NAME || `Team ${index + 1}`}`}
                              >
                                <span className="truncate">{team.NAME || `Team ${index + 1}`}</span>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                                  <span className="text-xs mr-1">Punkte</span>
                                  <ChevronRight size={16} />
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/40 rounded-lg border border-gray-200 dark:border-gray-700/60">
                              <Map size={20} className="mx-auto mb-1 text-gray-400 dark:text-gray-500" />
                              Keine Teams zugewiesen.
                            </div>
                          )}
                          {betreuerStats.assignedTeams?.length > (isMobile ? 2 : 4) && (
                             <button onClick={() => navigateWithHaptics('/participants')} className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1.5">Alle Teams anzeigen</button> // Navigate to general team/participant list
                           )}
                        </div>
                      </div>
                    ) : user.role === 'admin' ? ( // Admin specific quick actions if not a betreuer
                       <div className="pt-3">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                           <Shield size={15} className="mr-1.5 text-indigo-500 dark:text-indigo-400" />
                          Admin-Aktionen
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                           <button 
                            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors text-xs font-medium flex items-center justify-center group"
                            onClick={() => navigateWithHaptics('/users')} // Assuming '/users' is UserManagementPage
                          >
                            <Users size={14} className="mr-1.5" /> Nutzerverwaltung
                          </button>
                          <button 
                            className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg transition-colors text-xs font-medium flex items-center justify-center group"
                            onClick={() => navigateWithHaptics('/zeitplan')}
                          >
                            <CalendarClock size={14} className="mr-1.5" /> Zeitplan
                          </button>
                        </div>
                      </div>
                    ) : null }
                    
                    {/* Activity stats - kept for all users */}
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/80">
                      <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Ihre Aktivitäten
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-gray-100 dark:bg-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-700/80">
                          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {betreuerStats.completedResults || 0}
                          </div>
                          <div className="text-[0.7rem] text-gray-500 dark:text-gray-400 leading-tight">
                            Erfasste Ergebnisse
                          </div>
                        </div>
                        
                        <div className="p-2.5 bg-gray-100 dark:bg-gray-700/60 rounded-lg border border-gray-200 dark:border-gray-700/80">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {user.role === 'admin' && (!betreuerStats.role || betreuerStats.role === 'admin_only_viewer')
                              ? (stats.totalTeams + stats.totalDisziplinen)
                              : betreuerStats.role === 'stationaer' 
                              ? betreuerStats.assignedDisciplines?.length || 0
                              : betreuerStats.role === 'laufend'
                              ? betreuerStats.assignedTeams?.length || 0
                              : 0}
                          </div>
                          <div className="text-[0.7rem] text-gray-500 dark:text-gray-400 leading-tight">
                            {user.role === 'admin' && (!betreuerStats.role || betreuerStats.role === 'admin_only_viewer')
                              ? 'Verw. Elemente'
                              : betreuerStats.role === 'stationaer' 
                              ? 'Zugew. Disziplinen' 
                              : betreuerStats.role === 'laufend'
                              ? 'Zugew. Teams'
                              : 'Elemente'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Logout Button */}
                    <motion.button
                      variants={itemVariants}
                      className="w-full mt-4 py-2.5 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      onClick={() => {
                        triggerHapticFeedback('medium');
                        logout();
                        navigate('/login');
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Abmelden
                    </motion.button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex-grow flex flex-col justify-center items-center">
                    <User className="mx-auto h-10 w-10 mb-2 opacity-50" />
                    <p className="text-sm">Bitte melden Sie sich an.</p>
                    <button
                      className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      onClick={() => navigateWithHaptics('/login')}
                    >
                      Anmelden
                    </button>
                  </div>
                )}
              </motion.div>
              
              {/* Team rankings / leaderboard - now smaller and second on mobile */}
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Trophy size={22} className="mr-2 text-amber-500 dark:text-amber-400" />
                    Rangliste
                  </h2>
                  <button 
                    onClick={() => {
                        navigateWithHaptics('/leaderboard');
                        triggerHapticFeedback('light');
                    }}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mehr <ChevronRight size={14} className="inline-block -mt-px" />
                  </button>
                </div>
                
                {teamRankings.length > 0 ? (
                  <div className="space-y-3">
                    {teamRankings.slice(0, showFullLeaderboard ? teamRankings.length : 5).map((team, index) => (
                      <motion.div 
                        key={team.TEAMID || `team-ranking-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => navigateWithHaptics(`/participants`)} // Simplified: navigate to general participants/teams page
                        title={`Details zu Team ${team.NAME || `Team ${index + 1}`}`}
                      >
                        <div className="flex items-center truncate mr-2">
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full mr-2.5 sm:mr-3 flex-shrink-0 text-xs sm:text-sm font-semibold ${
                            index === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                            index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 
                            index === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                            'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {index === 0 ? (
                              <Trophy size={16} />
                            ) : index === 1 ? (
                              <Medal size={16} />
                            ) : index === 2 ? (
                              <Award size={16} />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>
                          <div className="truncate">
                            <span className="font-medium text-gray-900 dark:text-white text-sm truncate block" title={team.NAME || `Team ${index + 1}`}>{team.NAME || `Team ${index + 1}`}</span>
                            {/* Optional: Points difference can be added back if desired */}
                          </div>
                        </div>
                        
                        <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                          {team.formattedPoints}
                        </div>
                      </motion.div>
                    ))}
                    {teamRankings.length > 5 && (
                        <button 
                            onClick={() => {
                                setShowFullLeaderboard(!showFullLeaderboard);
                                triggerHapticFeedback('light');
                            }}
                            className="w-full mt-2 py-1.5 text-xs text-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                        >
                            {showFullLeaderboard ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                        </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <ListOrdered className="mx-auto h-10 w-10 mb-3 opacity-30" />
                    <p className="text-sm">Noch keine Teamergebnisse vorhanden</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* === END OF REORDERED SECTION === */}

            {/* Top stats (StatCards) */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard 
                title="Teams"
                value={stats.totalTeams}
                icon={<Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                change={{ value: "+3", status: "increase", label: "letzte Woche" }}
                onClick={() => navigateWithHaptics('/teams')}
              />
              <StatCard 
                title="Teilnehmer"
                value={stats.totalCompetitors}
                icon={<Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
                change={{ value: "+12", status: "increase", label: "letzte Woche" }}
                onClick={() => navigateWithHaptics('/participants')}
              />
              <StatCard 
                title="Disziplinen"
                value={stats.totalDisziplinen}
                icon={<Flag className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
                change={{ value: "0", status: "neutral", label: "letzte Woche" }}
                onClick={() => navigateWithHaptics('/disziplinen')}
              />
              
              {/* Completion progress card */}
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => navigateWithHaptics('/ergebnisse')}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/20 rounded-lg">
                    <Activity className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Fortschritt
                  </span>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {getCompletionPercentage()}%
                  </h3>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
                    <div 
                      className={`h-2.5 rounded-full bg-gradient-to-r ${getProgressColor(getCompletionPercentage())}`}
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
                    {stats.completedDisciplines} von {stats.totalDisziplinen} Disziplinen
                  </p>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/10 dark:to-rose-900/30 rounded-full opacity-70 dark:opacity-40 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/10 dark:to-indigo-900/30 rounded-full opacity-70 dark:opacity-40 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            </motion.div>
            
            {/* Event timeline (conditionally shown for admins) */}
            {user && user.role === 'admin' && (!betreuerStats.role || betreuerStats.role === 'admin_only_viewer') && (
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Calendar className="mr-2.5 text-purple-500 dark:text-purple-400" size={24} />
                    Gesamter Zeitplan (Admin-Ansicht)
                  </h2>
                  <button 
                    onClick={() => {
                        navigateWithHaptics('/zeitplan');
                        triggerHapticFeedback('light');
                    }}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Vollansicht <ChevronRight size={14} className="inline-block -mt-px" />
                  </button>
                </div>
                
                <div className="relative">
                  {/* Timeline bar */}
                  <div className="absolute left-3.5 top-0 bottom-0 w-1 bg-indigo-100 dark:bg-indigo-900/40 rounded-full"></div>
                  
                  {zeitplanLoading && (!zeitplan || zeitplan.length === 0) ? (
                     <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                       <div className="w-5 h-5 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                       Lade Zeitplan...
                     </div>
                  ) : !zeitplan || zeitplan.filter(e => new Date(e.ENDEZEIT) > new Date()).length === 0 ? (
                     <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                       <CalendarClock size={28} className="mx-auto mb-2 opacity-50" />
                       Keine bevorstehenden Termine im Zeitplan.
                     </div>
                  ) : (
                    <div className="space-y-4">
                      {zeitplan
                        .map(event => ({...event, STARTZEIT_DATE: new Date(event.STARTZEIT), ENDEZEIT_DATE: new Date(event.ENDEZEIT)}))
                        .filter(event => event.ENDEZEIT_DATE > new Date()) // Only upcoming
                        .sort((a,b) => a.STARTZEIT_DATE - b.STARTZEIT_DATE) // Sort by start time
                        .slice(0, 5) // Show top 5 upcoming
                        .map((event, index) => {
                          const isCurrent = new Date() >= event.STARTZEIT_DATE && new Date() <= event.ENDEZEIT_DATE;
                          const eventBaseColor = allDisziplins?.find(d => d.DISZIPLINID === event.DISZIPLINID)?.COLOR || (isDarkMode ? '#505A7A' : '#D9E2EC'); // Example color
                          return (
                            <motion.div 
                              key={event.ZEITPLANID || `timeline-${index}`}
                              className="relative pl-10"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0, transition:{ delay: index * 0.07} }}
                            >
                              <div className={`absolute left-0 top-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md border-2 ${
                                isCurrent 
                                ? 'bg-green-500 border-green-600 dark:bg-green-600 dark:border-green-700' 
                                : 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600'
                                }`}>
                                {isCurrent 
                                  ? <Activity size={14} className="text-white animate-pulse" /> 
                                  : <Clock3 size={14} className="text-gray-600 dark:text-gray-300" />
                                }
                              </div>
                              <div className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                                isCurrent 
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/50 shadow-green-500/20'
                                : `bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/70 hover:border-indigo-300 dark:hover:border-indigo-600/70`
                                }`}
                                style={!isCurrent ? { borderColor: eventBaseColor } : {}}
                                >
                                <div className="flex justify-between items-start">
                                  <h4 className={`font-medium text-sm truncate ${isCurrent ? 'text-green-800 dark:text-green-300' : 'text-gray-800 dark:text-gray-100'}`} title={event.DISZIPLIN_NAME}>
                                    {event.DISZIPLIN_NAME || 'Event'}
                                  </h4>
                                  {isCurrent && (
                                    <span className="text-xs text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-800/50 px-1.5 py-0.5 rounded-full font-medium">
                                      Live
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 truncate" title={event.TEAM_NAME}>
                                  Team: {event.TEAM_NAME || 'N/A'}
                                </p>
                                <div className="flex items-center mt-1.5 text-[0.7rem] text-gray-500 dark:text-gray-400">
                                  <Clock3 size={11} className="mr-1 flex-shrink-0" />
                                  {formatDatePretty(event.STARTZEIT_DATE)} - {formatEventTime(event.ENDEZEIT_DATE)}
                                  {event.ORT && <span className="mx-1.5 opacity-50">|</span>}
                                  {event.ORT && <><MapPin size={11} className="mr-0.5 flex-shrink-0" /> {event.ORT}</>}
                                </div>
                              </div>
                            </motion.div>
                          );
                      })}
                    </div>
                  )}
                   {zeitplan && zeitplan.filter(e => new Date(e.ENDEZEIT) > new Date()).length > 5 && (
                        <button 
                            onClick={() => navigateWithHaptics('/zeitplan')}
                            className="mt-4 w-full text-center py-2 px-3 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors"
                        >
                            Vollständigen Zeitplan anzeigen <ChevronRight size={14} className="inline-block ml-0.5" />
                        </button>
                    )}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default Dashboard;