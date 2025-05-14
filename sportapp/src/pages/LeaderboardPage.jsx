import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeProvider';
import { 
  Trophy,
  Medal,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Users as UsersIcon,
  Flag,
  Tag,
  Share,
  Download,
  AlertTriangle,
  X,
  ChevronUp,
  ChevronDown,
  Info,
  PlusCircle,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Clock
} from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';
import { useMediaQuery } from '../utils/responsive';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  },
  exit: { opacity: 0 }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const UltraModernLeaderboard = () => {
  // Refs
  const scrollRef = useRef(null);
  const topTeamsRef = useRef(null);
  
  // State
  const [teams, setTeams] = useState([]);
  const [ergebnisse, setErgebnisse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('points');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Pull to refresh state
  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const pullStartY = useRef(0);
  
  // Hooks
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolled(scrollRef.current.scrollTop > 100);
      }
    };
    
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Handle pull to refresh
  const handleTouchStart = (e) => {
    if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
      pullStartY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  };
  
  const handleTouchMove = (e) => {
    if (isPulling && scrollRef.current && scrollRef.current.scrollTop <= 0) {
      const pullDistance = Math.max(0, e.touches[0].clientY - pullStartY.current);
      const newProgress = Math.min(100, (pullDistance / 80) * 100);
      setPullProgress(newProgress);
    }
  };
  
  const handleTouchEnd = () => {
    if (isPulling) {
      if (pullProgress >= 100) {
        // Trigger refresh
        handleRefresh();
        triggerHapticFeedback('heavy');
      }
      setIsPulling(false);
      setPullProgress(0);
    }
  };
  
  // Fetch data
  const fetchData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const [teamsRes, ergebnisseRes] = await Promise.all([
        fetch(`${baseUrl}/teams`),
        fetch(`${baseUrl}/ergebnisse`)
      ]);
      
      if (!teamsRes.ok || !ergebnisseRes.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const teamsData = await teamsRes.json();
      const ergebnisseData = await ergebnisseRes.json();
      
      if (teamsData.success && ergebnisseData.success) {
        setTeams(teamsData.data || []);
        setErgebnisse(ergebnisseData.data || []);
        setLastUpdated(new Date());
      } else {
        throw new Error('Error in API response');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Handle manual refresh
  const handleRefresh = () => {
    triggerHapticFeedback('medium');
    fetchData(true);
  };
  
  // Process team rankings with total points
  const teamRankings = useMemo(() => {
    // Group results by team
    const teamResults = teams.map(team => {
      const teamScores = ergebnisse.filter(e => e.TEAMID === team.TEAMID);
      const totalPoints = teamScores.reduce((sum, result) => {
        // Handle both PUNKTE and POINTSID fields
        const points = result.PUNKTE !== undefined ? parseFloat(result.PUNKTE) : 
                       result.POINTSID !== undefined ? parseFloat(result.POINTSID) : 0;
        return sum + points;
      }, 0);
      
      const participationCount = new Set(teamScores.map(s => s.DISZIPLINID)).size;
      
      return {
        ...team,
        totalPoints: totalPoints,
        formattedPoints: totalPoints.toFixed(1),
        participationCount,
        avgPoints: participationCount > 0 ? (totalPoints / participationCount).toFixed(1) : '0.0'
      };
    });
    
    // Sort teams based on user preference
    return teamResults.sort((a, b) => {
      if (sortBy === 'points') {
        return sortOrder === 'desc' ? b.totalPoints - a.totalPoints : a.totalPoints - b.totalPoints;
      } else if (sortBy === 'name') {
        const nameA = a.NAME || '';
        const nameB = b.NAME || '';
        return sortOrder === 'desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
      } else if (sortBy === 'participation') {
        return sortOrder === 'desc' 
          ? b.participationCount - a.participationCount 
          : a.participationCount - b.participationCount;
      }
      return 0;
    });
  }, [teams, ergebnisse, sortBy, sortOrder]);
  
  // Filter teams based on search
  const filteredTeams = useMemo(() => {
    if (!searchQuery) return teamRankings;
    
    const query = searchQuery.toLowerCase();
    return teamRankings.filter(team => 
      (team.NAME && team.NAME.toLowerCase().includes(query))
    );
  }, [teamRankings, searchQuery]);
  
  // Calculate team stats
  const teamStats = useMemo(() => {
    if (teamRankings.length === 0) return null;
    
    const totalTeams = teamRankings.length;
    const totalParticipations = teamRankings.reduce((sum, team) => sum + team.participationCount, 0);
    const avgParticipation = totalTeams > 0 ? totalParticipations / totalTeams : 0;
    const totalPoints = teamRankings.reduce((sum, team) => sum + team.totalPoints, 0);
    const avgPoints = totalTeams > 0 ? totalPoints / totalTeams : 0;
    const highestPoints = Math.max(...teamRankings.map(team => team.totalPoints));
    const lowestPoints = Math.min(...teamRankings.map(team => team.totalPoints));
    
    return {
      totalTeams,
      totalParticipations,
      avgParticipation: avgParticipation.toFixed(1),
      totalPoints: totalPoints.toFixed(1),
      avgPoints: avgPoints.toFixed(1),
      highestPoints: highestPoints.toFixed(1),
      lowestPoints: lowestPoints.toFixed(1),
      pointsRange: (highestPoints - lowestPoints).toFixed(1)
    };
  }, [teamRankings]);
  
  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    triggerHapticFeedback('selection');
  };
  
  // Team details bottom sheet
  const renderTeamDetailsSheet = () => {
    if (!activeTeam) return null;
    
    return (
      <motion.div 
        className="fixed inset-x-0 bottom-0 z-40 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl border-t border-gray-200 dark:border-gray-700"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="p-6 max-h-[70vh] overflow-auto">
          <div className="w-12 h-1 mx-auto bg-gray-300 dark:bg-gray-600 rounded-full mb-4"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeTeam.NAME || `Team ${activeTeam.TEAMID}`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                Platz {teamRankings.findIndex(t => t.TEAMID === activeTeam.TEAMID) + 1}
              </p>
            </div>
            
            <button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              onClick={() => {
                setActiveTeam(null);
                triggerHapticFeedback('light');
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Team Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
              <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Gesamtpunkte</p>
              <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
                {activeTeam.formattedPoints}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Disziplinen</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {activeTeam.participationCount}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Performance
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Durchschnittliche Punkte
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activeTeam.avgPoints}
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (parseFloat(activeTeam.avgPoints) / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teilnahme
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activeTeam.participationCount} Disziplinen
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (activeTeam.participationCount / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center"
              onClick={() => {
                navigate(`/team-detail/${activeTeam.TEAMID}`);
                triggerHapticFeedback('medium');
              }}
            >
              Team Details
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </button>
            
            <button
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl flex items-center justify-center"
              onClick={() => {
                triggerHapticFeedback('light');
                setActiveTeam(null);
              }}
            >
              Schließen
            </button>
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Get medal for top ranks
  const getMedal = (rank) => {
    if (rank === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-amber-700" />;
    return null;
  };
  
  // Format date
  const formatUpdateTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins} Uhr`;
  };

  return (
    <div 
      className="relative h-full flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {isPulling && (
        <div className="absolute top-0 inset-x-0 flex justify-center pt-4 z-50 pointer-events-none">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{ 
                rotate: pullProgress >= 100 ? 360 : pullProgress * 3.6,
                scale: Math.min(1, pullProgress / 50)
              }}
              className="text-indigo-600 dark:text-indigo-400 mb-1"
            >
              <RefreshCw size={24} />
            </motion.div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {pullProgress >= 100 ? 'Loslassen zum Aktualisieren' : 'Ziehen zum Aktualisieren'}
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <motion.div 
        className={`sticky top-0 z-30 py-4 px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-900 ${
          isScrolled ? 'shadow-md dark:border-b dark:border-gray-800' : ''
        }`}
        animate={{ 
          height: isScrolled ? 'auto' : 'auto',
          paddingTop: isScrolled ? 8 : 16,
          paddingBottom: isScrolled ? 8 : 16,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col"
            animate={{ height: isScrolled ? 'auto' : 'auto' }}
          >
            <div className="flex justify-between items-center mb-4">
              <motion.h1 
                className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
                animate={{ fontSize: isScrolled ? '1.25rem' : '1.875rem' }}
                transition={{ duration: 0.2 }}
              >
                Rangliste
              </motion.h1>
              
              <div className="flex items-center space-x-2">
                {!isScrolled && (
                  <button
                    onClick={() => {
                      setShowStats(!showStats);
                      triggerHapticFeedback('light');
                      if (!showStats && topTeamsRef.current) {
                        topTeamsRef.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {showStats ? <ChevronUp size={20} /> : <BarChart3 size={20} />}
                  </button>
                )}
                
                <button
                  onClick={() => {
                    handleRefresh();
                  }}
                  className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 ${refreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
            
            {!isScrolled && (
              <motion.p 
                className="text-gray-600 dark:text-gray-400 mb-4"
                animate={{ opacity: isScrolled ? 0 : 1, height: isScrolled ? 0 : 'auto' }}
              >
                Aktueller Stand aller Teams im Wettbewerb
              </motion.p>
            )}
            
            {/* Search and filter controls */}
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Team suchen..."
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => {
                  setShowFilters(!showFilters);
                  triggerHapticFeedback('light');
                }}
                className={`px-3 py-2 rounded-xl flex items-center 
                  ${showFilters 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
          
          {/* Last update time */}
          {lastUpdated && (
            <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Aktualisiert: {formatUpdateTime(lastUpdated)}
            </div>
          )}
          
          {/* Extended filter options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, height: 0, marginTop: 0 },
                  visible: { opacity: 1, height: 'auto', marginTop: 16 }
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Sortierung & Filter
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      className={`p-3 rounded-xl flex items-center justify-between ${
                        sortBy === 'points' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                      onClick={() => toggleSort('points')}
                    >
                      <div className="flex items-center">
                        <Trophy className="w-5 h-5 mr-2" />
                        <span className="font-medium">Nach Punkten</span>
                      </div>
                      {sortBy === 'points' && (
                        sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      className={`p-3 rounded-xl flex items-center justify-between ${
                        sortBy === 'name' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                      onClick={() => toggleSort('name')}
                    >
                      <div className="flex items-center">
                        <Tag className="w-5 h-5 mr-2" />
                        <span className="font-medium">Nach Name</span>
                      </div>
                      {sortBy === 'name' && (
                        sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button
                      className={`p-3 rounded-xl flex items-center justify-between ${
                        sortBy === 'participation' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                      onClick={() => toggleSort('participation')}
                    >
                      <div className="flex items-center">
                        <Flag className="w-5 h-5 mr-2" />
                        <span className="font-medium">Nach Teilnahmen</span>
                      </div>
                      {sortBy === 'participation' && (
                        sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Reset button */}
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSortBy('points');
                        setSortOrder('desc');
                        setShowFilters(false);
                        triggerHapticFeedback('light');
                      }}
                      className="mt-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center justify-center"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Filter zurücksetzen
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Stats overview */}
          <AnimatePresence>
            {showStats && teamStats && !loading && (
              <motion.div 
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  hidden: { opacity: 0, height: 0, marginTop: 0 },
                  visible: { opacity: 1, height: 'auto', marginTop: 16 }
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistik-Übersicht
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">Gesamtpunkte</p>
                      <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                        {teamStats.totalPoints}
                      </p>
                      <p className="text-xs text-indigo-500 dark:text-indigo-500">
                        Ø {teamStats.avgPoints} pro Team
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
                      <p className="text-xs text-green-600 dark:text-green-400">Teams</p>
                      <p className="text-xl font-bold text-green-700 dark:text-green-300">
                        {teamStats.totalTeams}
                      </p>
                      <p className="text-xs text-green-500 dark:text-green-500">
                        {teamStats.totalParticipations} Teilnahmen
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3">
                      <p className="text-xs text-amber-600 dark:text-amber-400">Höchste Punktzahl</p>
                      <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                        {teamStats.highestPoints}
                      </p>
                      <p className="text-xs text-amber-500 dark:text-amber-500">
                        {filteredTeams[0]?.NAME || "Kein Team"}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                      <p className="text-xs text-blue-600 dark:text-blue-400">Durchschnitt</p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                        {teamStats.avgParticipation}
                      </p>
                      <p className="text-xs text-blue-500 dark:text-blue-500">
                        Teilnahmen pro Team
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Main content area */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto scrollbar-hide"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-24">
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-indigo-500 animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Daten werden geladen...</p>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 p-4 rounded-xl my-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-2 text-sm bg-red-200 dark:bg-red-800 px-3 py-1 rounded-lg inline-flex items-center"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Erneut versuchen
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Team rankings */}
          {!loading && !error && (
            <>
              {filteredTeams.length > 0 ? (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                  className="space-y-6"
                >
                  {/* Top 3 Teams */}
                  <div ref={topTeamsRef} className="py-2">
                    <motion.div 
                      variants={fadeVariants}
                      className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:justify-center mt-2 md:mb-8"
                    >
                      {filteredTeams.slice(0, 3).map((team, index) => (
                        <motion.div 
                          key={team.TEAMID || `top-team-${index}`}
                          variants={itemVariants}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setActiveTeam(team);
                            triggerHapticFeedback('medium');
                          }}
                          className={`relative p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${
                            index === 0 
                              ? 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-amber-900/20 dark:to-yellow-900/10 order-first md:order-1 md:transform md:scale-110 z-10' 
                              : index === 1 
                              ? 'bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/30 order-2 md:order-0 md:self-start' 
                              : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/5 order-3 md:self-start'
                          }`}
                        >
                          {/* Medal Badge */}
                          <div className="absolute -top-3 -right-3 w-12 h-12 flex items-center justify-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              'bg-amber-700'
                            } shadow-md text-white`}>
                              {index === 0 ? '1' : index === 1 ? '2' : '3'}
                            </div>
                          </div>
                        
                          {/* Team Content */}
                          <div className="flex items-center mb-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                              index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                              index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : 
                              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            }`}>
                              {getMedal(index)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {team.NAME || `Team ${team.TEAMID}`}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {team.participationCount} Disziplinen
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Gesamtpunkte</p>
                              <p className={`text-2xl font-bold ${
                                index === 0 ? 'text-yellow-600 dark:text-yellow-400' : 
                                index === 1 ? 'text-gray-600 dark:text-gray-300' : 
                                'text-amber-700 dark:text-amber-400'
                              }`}>
                                {team.formattedPoints}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Ø {team.avgPoints}
                              <span className="text-xs ml-1">pro Disziplin</span>
                            </p>
                          </div>
                          
                          {/* Bottom gradient */}
                          <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 
                            index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' : 
                            'bg-gradient-to-r from-amber-700 to-amber-600'
                          }`}></div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* All Teams List */}
                  <motion.div 
                    variants={fadeVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden"
                  >
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredTeams.map((team, index) => (
                        <motion.div 
                          key={team.TEAMID || `team-${index}`}
                          variants={itemVariants}
                          className={`${
                            index < 3 ? 'hidden md:flex' : 'flex'
                          } items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer`}
                          onClick={() => {
                            setActiveTeam(team);
                            triggerHapticFeedback('light');
                          }}
                        >
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full mr-4 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </div>
                          
                          <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {team.NAME || `Team ${team.TEAMID}`}
                              </h3>
                              
                              <div className="flex items-center">
                                <div className="flex items-center mr-4">
                                  <Flag className="w-4 h-4 text-blue-500 mr-1" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {team.participationCount}
                                  </span>
                                </div>
                                
                                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                                  {team.formattedPoints}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full rounded-full"
                                style={{ 
                                  width: `${Math.min(100, (team.totalPoints / (filteredTeams[0]?.totalPoints || 1)) * 100)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <ChevronDown className="w-5 h-5 text-gray-400 rotate-270" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Action buttons */}
                  <motion.div 
                    variants={fadeVariants}
                    className="mt-8 flex flex-wrap justify-center gap-4"
                  >
                    <button
                      className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center shadow-sm"
                      onClick={() => {
                        triggerHapticFeedback('medium');
                        // Share implementation here
                      }}
                    >
                      <Share className="w-5 h-5 mr-2" />
                      Rangliste teilen
                    </button>
                    <button
                      className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl flex items-center shadow-sm"
                      onClick={() => {
                        triggerHapticFeedback('medium');
                        // Export implementation here
                      }}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Exportieren
                    </button>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <UsersIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Keine Teams gefunden</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto mt-2">
                    Es wurden keine Teams gefunden, die den Filterkriterien entsprechen.
                  </p>
                  <button
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg inline-flex items-center"
                    onClick={() => {
                      setSearchQuery('');
                      setSortBy('points');
                      setSortOrder('desc');
                      triggerHapticFeedback('light');
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Filter zurücksetzen
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Add Team Button (only visible for admins) */}
      {user && !loading && filteredTeams.length > 0 && (
        <div className="fixed right-6 bottom-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex items-center justify-center"
            onClick={() => {
              triggerHapticFeedback('medium');
              navigate('/team-new');
            }}
          >
            <PlusCircle size={28} />
          </motion.button>
        </div>
      )}
      
      {/* Team details sheet */}
      <AnimatePresence>
        {activeTeam && renderTeamDetailsSheet()}
      </AnimatePresence>
    </div>
  );
};

export default UltraModernLeaderboard;