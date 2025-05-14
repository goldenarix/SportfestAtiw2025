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
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { triggerHapticFeedback } from '../utils/haptics';
import { useMediaQuery } from '../utils/responsive';
import { useTheme } from '../contexts/ThemeProvider';
import StatCard from '../components/ui/StatCard';

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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  // Responsive design breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Team rankings for leaderboard
  const [teamRankings, setTeamRankings] = useState([]);
  
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
  
  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header with refresh button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Übersicht des aktuellen Sportfests
          </p>
        </div>
        
        <button 
          className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${refreshing ? 'animate-spin' : ''}`}
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label="Refresh dashboard"
        >
          <RefreshCw size={20} />
        </button>
      </div>
      
      {/* Role-specific greeting */}
      {!loading && user && (
        <motion.div 
          className="mb-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl text-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.2,
            duration: 0.5,
            type: "spring", 
            stiffness: 100 
          }}
        >
          <div className="flex items-start space-x-4">
            <div className="bg-white/20 p-3 rounded-xl shadow-inner">
              {betreuerStats.role === 'stationaer' ? (
                <MapPin size={28} />
              ) : betreuerStats.role === 'laufend' ? (
                <Map size={28} />
              ) : (
                <User size={28} />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold flex items-center">
                {timeBasedGreeting}{betreuerStats.name ? `, ${betreuerStats.name}` : user?.name ? `, ${user.name}` : ''}!
              </h2>
              <p className="mt-1 text-indigo-100 text-opacity-90">
                {betreuerStats.role === 'stationaer' 
                  ? `Sie sind als stationärer Betreuer angemeldet mit ${betreuerStats.assignedDisciplines.length} zugewiesenen Disziplinen.`
                  : betreuerStats.role === 'laufend'
                  ? `Sie sind als laufender Betreuer angemeldet mit ${betreuerStats.assignedTeams.length} zugewiesenen Teams.` 
                  : user && !betreuerStats.role
                  ? 'Sie sind angemeldet, aber Ihnen wurden noch keine Rolle oder Aufgaben zugewiesen.'
                  : 'Sie sind als Administrator angemeldet und haben Zugriff auf alle Funktionen.'}
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
                    ? '/teams'
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
            className="space-y-8"
          >
            {/* Top stats */}
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
            
            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team rankings / leaderboard */}
              <motion.div 
                variants={itemVariants}
                className={`${isTablet ? '' : 'lg:col-span-2'} bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Trophy className="mr-2 text-amber-500" size={22} />
                    Rangliste
                  </h2>
                  
                  <button 
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center group"
                    onClick={() => {
                      navigateWithHaptics('/leaderboard');
                    }}
                  >
                    Komplette Rangliste
                    <ChevronRight size={16} className="ml-1 group-hover:ml-2 transition-all" />
                  </button>
                </div>
                
                {teamRankings.length > 0 ? (
                  <div className="space-y-3">
                    {teamRankings.slice(0, 5).map((team, index) => (
                      <motion.div 
                        key={team.TEAMID || `team-ranking-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                        onClick={() => navigateWithHaptics(`/team-detail/${team.TEAMID}`)}
                      >
                        <div className="flex items-center">
                          <div className={`w-10 h-10 flex items-center justify-center rounded-full mr-3 ${
                            index === 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 
                            index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 
                            index === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {index === 0 ? (
                              <Trophy size={18} />
                            ) : index === 1 ? (
                              <Medal size={18} />
                            ) : index === 2 ? (
                              <Medal size={18} />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{team.NAME || `Team ${index + 1}`}</span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {index > 0 && (
                                <span className="flex items-center">
                                  {Math.abs(parseFloat(team.formattedPoints) - parseFloat(teamRankings[index-1].formattedPoints)).toFixed(1)} Punkte hinter Platz {index}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {team.formattedPoints}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Trophy className="mx-auto h-12 w-12 mb-3 opacity-30" />
                    <p>Noch keine Teamergebnisse vorhanden</p>
                  </div>
                )}
              </motion.div>
              
              {/* Betreuer overview */}
              <motion.div 
                variants={itemVariants}
                className={`${isTablet ? '' : 'lg:col-span-1'} bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <User className="mr-2 text-blue-500" size={22} />
                    Meine Übersicht
                  </h2>
                </div>
                
                {user ? (
                  <div className="space-y-6">
                    {/* Role indicator */}
                    <div className="flex items-center mb-4">
                      <div className={`p-2.5 rounded-lg mr-3 ${
                        betreuerStats.role === 'stationaer' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                          : betreuerStats.role === 'laufend'
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                      }`}>
                        {betreuerStats.role === 'stationaer' ? (
                          <MapPin size={20} />
                        ) : betreuerStats.role === 'laufend' ? (
                          <Map size={20} />
                        ) : (
                          <User size={20} />
                        )}
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Rolle</span>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {betreuerStats.role === 'stationaer' 
                            ? 'Stationärer Betreuer' 
                            : betreuerStats.role === 'laufend'
                            ? 'Laufender Betreuer'
                            : betreuerStats.role 
                            ? betreuerStats.role 
                            : 'Kein Rolle zugewiesen'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Assignments with animation */}
                    {betreuerStats.role === 'stationaer' ? (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <MapPin size={16} className="mr-2 text-blue-500" />
                          Zugewiesene Disziplinen
                        </h3>
                        <div className="space-y-2">
                          {betreuerStats.assignedDisciplines && betreuerStats.assignedDisciplines.length > 0 ? (
                            betreuerStats.assignedDisciplines.map((disziplin, index) => (
                              <motion.div 
                                key={disziplin.DISZIPLINID || `discipline-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-3 py-2.5 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-blue-800 dark:text-blue-300 text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors flex justify-between items-center group"
                                onClick={() => {
                                  navigateWithHaptics(`/disziplin/${disziplin.DISZIPLINID}`);
                                }}
                              >
                                <span>{disziplin.NAME || `Disziplin ${index + 1}`}</span>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                              <MapPin size={24} className="mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                              Keine Disziplinen zugewiesen
                              <p className="mt-1 text-xs">
                                Sprechen Sie einen Administrator an, um Disziplinen zugewiesen zu bekommen.
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          className="mt-4 w-full py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center shadow-sm hover:shadow"
                          onClick={() => {
                            triggerHapticFeedback('light');
                            navigate('/ergebnisse');
                          }}
                        >
                          Zu meinen Disziplinen
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    ) : betreuerStats.role === 'laufend' ? (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <Map size={16} className="mr-2 text-green-500" />
                          Zugewiesene Teams
                        </h3>
                        <div className="space-y-2">
                          {betreuerStats.assignedTeams && betreuerStats.assignedTeams.length > 0 ? (
                            betreuerStats.assignedTeams.map((team, index) => (
                              <motion.div 
                                key={team.TEAMID || `team-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="px-3 py-2.5 bg-green-50 dark:bg-green-900/10 rounded-lg text-green-800 dark:text-green-300 text-sm cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors flex justify-between items-center group"
                                onClick={() => {
                                  navigateWithHaptics(`/team-detail/${team.TEAMID}`);
                                }}
                              >
                                <span>{team.NAME || `Team ${index + 1}`}</span>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                              <Map size={24} className="mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                              Keine Teams zugewiesen
                              <p className="mt-1 text-xs">
                                Sprechen Sie einen Administrator an, um Teams zugewiesen zu bekommen.
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <button 
                          className="mt-4 w-full py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center justify-center shadow-sm hover:shadow"
                          onClick={() => {
                            triggerHapticFeedback('light');
                            navigate('/ergebnisse');
                          }}
                        >
                          Zu meinen Teams
                          <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <User size={16} className="mr-2 text-indigo-500" />
                          Administrator-Funktionen
                        </h3>
                        <div className="space-y-2 mt-3">
                          <button 
                            className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/10 dark:hover:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center group"
                            onClick={() => {
                              navigateWithHaptics('/user-management');
                            }}
                          >
                            <Users size={16} className="mr-2" />
                            Benutzerverwaltung
                            <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <button 
                            className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/10 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center group"
                            onClick={() => {
                              navigateWithHaptics('/disziplinen');
                            }}
                          >
                            <Flag size={16} className="mr-2" />
                            Disziplinen verwalten
                            <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <button 
                            className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg transition-colors text-sm font-medium flex items-center justify-center group"
                            onClick={() => {
                              navigateWithHaptics('/teams');
                            }}
                          >
                            <Users size={16} className="mr-2" />
                            Team-Verwaltung
                            <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Activity stats */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Ihre Aktivitäten
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {betreuerStats.completedResults}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Erfasste Ergebnisse
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">
                            {betreuerStats.role === 'stationaer' 
                              ? betreuerStats.assignedDisciplines?.length || 0
                              : betreuerStats.role === 'laufend'
                              ? betreuerStats.assignedTeams?.length || 0
                              : stats.totalTeams + stats.totalDisziplinen}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {betreuerStats.role === 'stationaer' 
                              ? 'Zugewiesene Disziplinen' 
                              : betreuerStats.role === 'laufend'
                              ? 'Zugewiesene Teams'
                              : 'Verwaltete Elemente'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <User className="mx-auto h-12 w-12 mb-3 opacity-30" />
                    <p>Bitte melden Sie sich an</p>
                    <button
                      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm shadow-sm hover:shadow"
                      onClick={() => navigateWithHaptics('/login')}
                    >
                      Anmelden
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Quick access buttons */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <button
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                onClick={() => {
                  navigateWithHaptics('/ergebnisse');
                }}
              >
                <Activity size={24} className="text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-gray-800 dark:text-white text-sm font-medium">Ergebnisse</span>
              </button>
              
              <button
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                onClick={() => {
                  navigateWithHaptics('/leaderboard');
                }}
              >
                <ListOrdered size={24} className="text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-gray-800 dark:text-white text-sm font-medium">Rangliste</span>
              </button>
              
              <button
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                onClick={() => {
                  navigateWithHaptics('/statistics');
                }}
              >
                <BarChart2 size={24} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-gray-800 dark:text-white text-sm font-medium">Statistiken</span>
              </button>
              
              <button
                className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                onClick={() => {
                  navigateWithHaptics('/disziplinen');
                }}
              >
                <Flag size={24} className="text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-gray-800 dark:text-white text-sm font-medium">Disziplinen</span>
              </button>
            </motion.div>
            
            {/* Event timeline (conditionally shown for admins) */}
            {user && !betreuerStats.role && (
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-6">
                  <Calendar className="mr-2 text-purple-500" size={22} />
                  Zeitplan
                </h2>
                
                <div className="relative">
                  {/* Timeline bar */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-indigo-100 dark:bg-indigo-900/30"></div>
                  
                  <div className="space-y-6">
                    {/* Event item - Current */}
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/20">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-green-800 dark:text-green-400">Aktuell</h4>
                          <span className="text-xs text-green-700 dark:text-green-500 bg-green-100 dark:bg-green-800/40 px-2 py-0.5 rounded-full">
                            In Bearbeitung
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Übung 1-3 (Laufen/Springen)</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} className="mr-1" />
                          09:00 - 12:00 Uhr
                        </div>
                      </div>
                    </div>
                    
                    {/* Event item - Upcoming */}
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                        <Clock size={16} className="text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Mittagspause</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Mensa &amp; Außenbereich</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} className="mr-1" />
                          12:00 - 13:00 Uhr
                        </div>
                      </div>
                    </div>
                    
                    {/* Event item - Upcoming */}
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                        <Clock size={16} className="text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Übung 4-6 (Werfen/Stoßen)</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Sportplatz - Feld A</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} className="mr-1" />
                          13:00 - 15:30 Uhr
                        </div>
                      </div>
                    </div>
                  </div>
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