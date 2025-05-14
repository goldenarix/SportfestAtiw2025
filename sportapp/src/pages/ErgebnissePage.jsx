import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataContext } from '../../backend/DataLoader';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TeamDisciplineScoreModal from '../components/TeamDisciplineScoreModal';
import { triggerHapticFeedback } from '../utils/haptics';
import { 
  Trophy, 
  AlertTriangle, 
  Search, 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  AlignLeft, 
  BarChart3, 
  RefreshCw, 
  List, 
  Grid, 
  Layout,
  X,
  Edit,
  Trash2,
  Save,
  Plus,
  CheckCircle,
  Sparkles,
  Calendar,
  MessageSquare,
  FileText,
  User,
  MapPin,
  Map
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// Animation variants for page transition
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Animation variants for cards and elements
const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: index * 0.05 }
  }),
  hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

// Animation variants for modal
const modalVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

// Animation variants for backdrop
const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const ErgebnissePage = () => {
  // Initialize with local state instead of context
  const [ergebnisse, setErgebnisse] = useState([]);
  const [teams, setTeams] = useState([]);
  const [disziplinen, setDisziplinen] = useState([]);
  const [betreuer, setBetreuer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Try to use context if available
  const contextData = useDataContext ? useDataContext() : null;
  
  // Auth state
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedDisziplin, setSelectedDisziplin] = useState('all');
  const [viewMode, setViewMode] = useState('card'); // 'card', 'table', 'chart'
  const [sortBy, setSortBy] = useState('punkte'); // 'punkte', 'team', 'disziplin'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Student score modal state
  const [showStudentScoreModal, setShowStudentScoreModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentDisziplin, setCurrentDisziplin] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTeamSelectionModal, setShowTeamSelectionModal] = useState(false);
  const [showDisziplinSelectionModal, setShowDisziplinSelectionModal] = useState(false);
  const [currentErgebnis, setCurrentErgebnis] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    TEAMID: '',
    DISZIPLINID: '',
    PUNKTE: '',
    DATUM: new Date().toISOString().split('T')[0],
    KOMMENTAR: ''
  });
  
  // Notification state
  const [notification, setNotification] = useState(null);

  // Current betreuer information with role and assignments
  const [currentBetreuerData, setCurrentBetreuerData] = useState(null);

  // Load data from context if available
  useEffect(() => {
    if (contextData) {
      if (contextData.ergebnisse) setErgebnisse(contextData.ergebnisse);
      if (contextData.teams) setTeams(contextData.teams);
      if (contextData.disziplins) setDisziplinen(contextData.disziplins);
      if (contextData.loading !== undefined) setLoading(contextData.loading);
      if (contextData.error !== undefined) setError(contextData.error);
    } else {
      // If context is not available, fetch data directly
      fetchAllData();
    }
  }, [contextData]);

  // Get current betreuer data when user is available
  useEffect(() => {
    if (user && user.id) {
      fetchBetreuerData(user.id);
    }
  }, [user]);

  // Initialize form data when teams and disciplines data is available
  useEffect(() => {
    if (teams.length > 0 && disziplinen.length > 0) {
      resetForm();
    }
  }, [teams, disziplinen]);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchBetreuerData = async (betreuerID) => {
    try {
      setLoading(true);
      
      const baseUrl = import.meta.env.VITE_API_URL || '';
      console.log("Betreuer ID beim Abrufen:", betreuerID);
      const response = await fetch(`${baseUrl}/betreuer/${betreuerID}?withAssignments=true`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch betreuer data: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log("Betreuer data loaded:", result.data);
        console.log("Zugewiesene Teams:", result.data.teams);
        console.log("Betreuer Rolle:", result.data.ROLLE);
        setCurrentBetreuerData(result.data);
      } else {
        throw new Error('Failed to load betreuer data');
      }
    } catch (err) {
      console.error('Error fetching betreuer data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Example direct API fetch - replace with your actual API endpoints
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const [ergebnisseRes, teamsRes, disziplinenRes, betreuerRes] = await Promise.all([
        fetch(`${baseUrl}/ergebnisse`),
        fetch(`${baseUrl}/teams`),
        fetch(`${baseUrl}/disziplins`),
        fetch(`${baseUrl}/betreuer?withAssignments=true`)
      ]);
      
      // Check for errors
      if (!ergebnisseRes.ok || !teamsRes.ok || !disziplinenRes.ok || !betreuerRes.ok) {
        throw new Error(`HTTP error: ${ergebnisseRes.status} / ${teamsRes.status} / ${disziplinenRes.status} / ${betreuerRes.status}`);
      }
      
      // Parse JSON responses
      const ergebnisseData = await ergebnisseRes.json();
      const teamsData = await teamsRes.json();
      const disziplinenData = await disziplinenRes.json();
      const betreuerData = await betreuerRes.json();
      
      // Update state if all requests were successful
      if (ergebnisseData.success && teamsData.success && disziplinenData.success && betreuerData.success) {
        setErgebnisse(ergebnisseData.data || []);
        setTeams(teamsData.data || []);
        setDisziplinen(disziplinenData.data || []);
        setBetreuer(betreuerData.data || []);
        setError(null);
      } else {
        throw new Error('One or more API requests failed');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddErgebnis = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${baseUrl}/ergebnisse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Ergebnis erfolgreich hinzugefügt!'
        });
        fetchAllData();
        setShowAddModal(false);
        resetForm();
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Failed to add result');
      }
    } catch (err) {
      console.error('Error adding result:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  const handleEditErgebnis = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${baseUrl}/ergebnisse/${currentErgebnis.ERGEBNISID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Ergebnis erfolgreich aktualisiert!'
        });
        fetchAllData();
        setShowEditModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Failed to update result');
      }
    } catch (err) {
      console.error('Error updating result:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  const handleDeleteErgebnis = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${baseUrl}/ergebnisse/${currentErgebnis.ERGEBNISID}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Ergebnis erfolgreich gelöscht!'
        });
        fetchAllData();
        setShowDeleteModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Failed to delete result');
      }
    } catch (err) {
      console.error('Error deleting result:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (ergebnis) => {
    setCurrentErgebnis(ergebnis);
    setFormData({
      TEAMID: ergebnis.TEAMID,
      DISZIPLINID: ergebnis.DISZIPLINID,
      PUNKTE: ergebnis.POINTSID || ergebnis.PUNKTE, // Supports both variants
      DATUM: ergebnis.DATUM || new Date().toISOString().split('T')[0],
      KOMMENTAR: ergebnis.KOMMENTAR || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (ergebnis) => {
    setCurrentErgebnis(ergebnis);
    setShowDeleteModal(true);
  };

  const openStudentScoreModal = (ergebnis) => {
    // Find the full team object based on the TEAMID
    const teamObject = teams.find(team => team.TEAMID === ergebnis.TEAMID) || {
      TEAMID: ergebnis.TEAMID,
      NAME: ergebnis.teamName
    };
    
    setCurrentTeam(teamObject);
    setShowStudentScoreModal(true);
  };

  const openDisziplinDetailPage = (disziplin) => {
    triggerHapticFeedback('light');
    navigate(`/disziplin/${disziplin.DISZIPLINID}`, { state: { disziplin } });
  };

  const openTeamDetailPage = (team) => {
    triggerHapticFeedback('light');
    navigate(`/team-detail/${team.TEAMID}`, { state: { team } });
  };

  const openDisziplinSelectionModal = (team) => {
    setCurrentTeam(team);
    setShowDisziplinSelectionModal(true);
  };

  const openTeamSelectionModal = (disziplin) => {
    setCurrentDisziplin(disziplin);
    setShowTeamSelectionModal(true);
  };

  const resetForm = () => {
    setFormData({
      TEAMID: teams.length > 0 ? teams[0].TEAMID : '',
      DISZIPLINID: disziplinen.length > 0 ? disziplinen[0].DISZIPLINID : '',
      PUNKTE: '',
      DATUM: new Date().toISOString().split('T')[0],
      KOMMENTAR: ''
    });
  };

  // Enhanced ergebnisse data with team and disziplin names
  const enhancedErgebnisse = useMemo(() => {
    return ergebnisse.map(ergebnis => {
      const team = teams.find(t => t.TEAMID === ergebnis.TEAMID);
      const disziplin = disziplinen.find(d => d.DISZIPLINID === ergebnis.DISZIPLINID);
      
      return {
        ...ergebnis,
        teamName: team?.NAME || `Team ${ergebnis.TEAMID}`,
        disziplinName: disziplin?.NAME || `Disziplin ${ergebnis.DISZIPLINID}`,
        // Use POINTSID instead of PUNKTE for the score
        PUNKTE: ergebnis.POINTSID || ergebnis.PUNKTE, // Ensure we handle both formats
        punkteNumber: parseFloat(ergebnis.POINTSID || ergebnis.PUNKTE) || 0 // Convert for numeric operations
      };
    });
  }, [ergebnisse, teams, disziplinen]);


// Korrigierte accessibleItems Funktion
const accessibleItems = useMemo(() => {
  if (!currentBetreuerData || isAdmin) {
    // Admins können alles sehen
    return {
      disziplinen: disziplinen,
      teams: teams,
      isDisziplinenRestricted: false,
      isTeamsRestricted: false
    };
  }

  // Zugewiesene Disziplinen auf Basis der Rolle holen
  const betreuerDisziplinen = 
    currentBetreuerData.ROLLE === 'stationaer' && currentBetreuerData.disziplinen 
      ? disziplinen.filter(d => currentBetreuerData.disziplinen.some(bd => bd.DISZIPLINID === d.DISZIPLINID))
      : [];

  // Zugewiesene Teams - unabhängig von der Rolle
  const betreuerTeams = 
    currentBetreuerData.teams && currentBetreuerData.teams.length > 0
      ? teams.filter(t => currentBetreuerData.teams.some(bt => bt.TEAMID === t.TEAMID))
      : [];

  console.log("Betreuer ID:", currentBetreuerData.BETREUERID);
  console.log("Zugewiesene Teams für Betreuer:", betreuerTeams);

  return {
    // Stationäre Betreuer sehen nur zugewiesene Disziplinen
    disziplinen: currentBetreuerData.ROLLE === 'stationaer' ? betreuerDisziplinen : disziplinen,
    
    // Alle Betreuer sehen nur ihre zugewiesenen Teams - unabhängig von der Rolle
    teams: betreuerTeams,
    
    isDisziplinenRestricted: currentBetreuerData.ROLLE === 'stationaer',
    isTeamsRestricted: true // Immer auf true für nicht-Admin-Benutzer
  };
}, [currentBetreuerData, disziplinen, teams, isAdmin]);

  // Filtered and sorted ergebnisse
  const filteredErgebnisse = useMemo(() => {
    return enhancedErgebnisse
      .filter(ergebnis => {
        // Apply search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          ergebnis.teamName.toLowerCase().includes(searchLower) ||
          ergebnis.disziplinName.toLowerCase().includes(searchLower) ||
          String(ergebnis.PUNKTE).includes(searchLower);
        
        // Apply team filter
        const matchesTeam = selectedTeam === 'all' || ergebnis.TEAMID === parseInt(selectedTeam);
        
        // Apply disziplin filter
        const matchesDisziplin = selectedDisziplin === 'all' || ergebnis.DISZIPLINID === parseInt(selectedDisziplin);
        
        // Apply role-based filter
        let matchesRole = true;
        if (currentBetreuerData && !isAdmin) {
          if (currentBetreuerData.ROLLE === 'stationaer') {
            // Stationäre Betreuer can only see results for their assigned disciplines
            matchesRole = currentBetreuerData.disziplinen?.some(d => d.DISZIPLINID === ergebnis.DISZIPLINID) || false;
          } else {
            // Alle anderen Betreuer sehen nur Ergebnisse für ihre zugewiesenen Teams
            matchesRole = currentBetreuerData.teams?.some(t => t.TEAMID === ergebnis.TEAMID) || false;
          }
        }
        
        return matchesSearch && matchesTeam && matchesDisziplin && matchesRole;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === 'punkte') {
          return sortOrder === 'desc' 
            ? b.punkteNumber - a.punkteNumber
            : a.punkteNumber - b.punkteNumber;
        } else if (sortBy === 'team') {
          return sortOrder === 'desc'
            ? b.teamName.localeCompare(a.teamName)
            : a.teamName.localeCompare(b.teamName);
        } else if (sortBy === 'disziplin') {
          return sortOrder === 'desc'
            ? b.disziplinName.localeCompare(a.disziplinName)
            : a.disziplinName.localeCompare(b.disziplinName);
        }
        return 0;
      });
  }, [enhancedErgebnisse, searchQuery, selectedTeam, selectedDisziplin, sortBy, sortOrder, currentBetreuerData, isAdmin]);

  // Data for charts
  const chartData = useMemo(() => {
    // Filter teams and disziplinen based on betreuer role
    const filteredTeams = accessibleItems.isTeamsRestricted ? accessibleItems.teams : teams;
    const filteredDisziplinen = accessibleItems.isDisziplinenRestricted ? accessibleItems.disziplinen : disziplinen;
    
    // Group by team
    const teamData = filteredTeams.map(team => {
      const teamErgebnisse = enhancedErgebnisse.filter(e => e.TEAMID === team.TEAMID);
      const totalPoints = teamErgebnisse.reduce((sum, e) => sum + parseFloat(e.PUNKTE || 0), 0);
      
      return {
        name: team.NAME || `Team ${team.TEAMID}`,
        punkte: totalPoints,
        anzahlDisziplinen: teamErgebnisse.length
      };
    }).sort((a, b) => b.punkte - a.punkte);

    // Group by disziplin
    const disziplinData = filteredDisziplinen.map(disziplin => {
      const disziplinErgebnisse = enhancedErgebnisse.filter(e => e.DISZIPLINID === disziplin.DISZIPLINID);
      const avgPoints = disziplinErgebnisse.length > 0
        ? disziplinErgebnisse.reduce((sum, e) => sum + parseFloat(e.PUNKTE || 0), 0) / disziplinErgebnisse.length
        : 0;
      
      return {
        name: disziplin.NAME || `Disziplin ${disziplin.DISZIPLINID}`,
        durchschnitt: parseFloat(avgPoints.toFixed(2)),
        anzahlTeams: disziplinErgebnisse.length
      };
    });
    
    return { teamData, disziplinData };
  }, [enhancedErgebnisse, teams, disziplinen, accessibleItems]);

  // Color scale function to get colors based on points
  const getPointsColor = (points) => {
    const max = Math.max(...enhancedErgebnisse.map(e => e.punkteNumber), 1);
    const percentage = max > 0 ? points / max : 0;
    
    if (percentage >= 0.9) return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
    if (percentage >= 0.7) return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
    if (percentage >= 0.5) return 'text-green-500 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
    if (percentage >= 0.3) return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
  };

  // Get medal icon for top positions
  const getMedalIcon = (index) => {
    if (index === 0) return <Trophy className="text-yellow-400" size={20} />;
    if (index === 1) return <Trophy className="text-gray-400" size={20} />;
    if (index === 2) return <Trophy className="text-amber-700" size={20} />;
    return null;
  };

  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTeam('all');
    setSelectedDisziplin('all');
    setSortBy('punkte');
    setSortOrder('desc');
  };

  // Get role display text
  const getRoleDisplay = (betreuer) => {
    if (!betreuer) return { role: "Nicht zugewiesen", icon: null };
    
    switch (betreuer.ROLLE) {
      case 'stationaer':
        return { 
          role: "Stationärer Betreuer", 
          icon: <MapPin className="ml-2 text-blue-500" size={16} />
        };
      case 'laufend':
        return { 
          role: "Laufender Betreuer", 
          icon: <Map className="ml-2 text-green-500" size={16} />
        };
      default:
        return { role: betreuer.ROLLE || "Unbekannte Rolle", icon: null };
    }
  };

  // Render function for stationaer betreuer (discipline cards)
  const renderStationaerView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {accessibleItems.disziplinen.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <MapPin size={64} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Keine Disziplinen zugewiesen</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ihnen wurden noch keine Disziplinen zugewiesen. Bitte kontaktieren Sie einen Administrator.
            </p>
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center"
              onClick={() => navigate('/dashboard')}
            >
              Zurück zum Dashboard
            </button>
          </div>
        ) : (
          accessibleItems.disziplinen.map((disziplin, index) => (
            <motion.div
              key={disziplin.DISZIPLINID}
              className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700"
              variants={itemVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              custom={index}
              whileHover="hover"
              onClick={() => openDisziplinDetailPage(disziplin)}
              layout
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                      {disziplin.NAME}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                      {disziplin.BESCHREIBUNG || "Keine Beschreibung verfügbar"}
                    </p>
                  </div>
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <MapPin size={20} />
                  </div>
                </div>
                
                <div className="mt-4 grid gap-2">
                  {ergebnisse
                    .filter(e => e.DISZIPLINID === disziplin.DISZIPLINID)
                    .slice(0, 3)
                    .map((ergebnis, idx) => {
                      const team = teams.find(t => t.TEAMID === ergebnis.TEAMID);
                      return (
                        <div key={ergebnis.ERGEBNISID} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {idx === 0 && <Trophy className="text-yellow-400 mr-2" size={16} />}
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {team?.NAME || `Team ${ergebnis.TEAMID}`}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getPointsColor(ergebnis.PUNKTE)}`}>
                              {ergebnis.PUNKTE || 0}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                <button 
                  className="mt-4 w-full py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-800/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    openTeamSelectionModal(disziplin);
                  }}
                >
                  <Plus size={16} className="mr-2" />
                  Team auswählen
                </button>
              </div>
              
              {/* Gradient bottom border */}
              <div className="h-1" style={{ 
                background: 'linear-gradient(90deg, #5865F2 0%, #EB459E 100%)'
              }}></div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );

  // Render function for laufend betreuer (team cards)
  const renderLaufendView = () => {
    // Hier explizit loggen, welche Teams angezeigt werden
    console.log("Anzahl Teams in renderLaufendView:", accessibleItems.teams.length);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {accessibleItems.teams.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
              <Map size={64} className="mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Keine Teams zugewiesen</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ihnen wurden noch keine Teams zugewiesen. Bitte kontaktieren Sie einen Administrator.
              </p>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center"
                onClick={() => navigate('/dashboard')}
              >
                Zurück zum Dashboard
              </button>
            </div>
          ) : (
            accessibleItems.teams.map((team, index) => (
              <motion.div
                key={team.TEAMID}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700"
                variants={itemVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index}
                whileHover="hover"
                onClick={() => openTeamDetailPage(team)}
                layout
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                        {team.NAME}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                        {team.BESCHREIBUNG || "Keine Beschreibung verfügbar"}
                      </p>
                    </div>
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                      <Map size={20} />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid gap-2">
                    {enhancedErgebnisse
                      .filter(e => e.TEAMID === team.TEAMID)
                      .sort((a, b) => b.punkteNumber - a.punkteNumber)
                      .slice(0, 3)
                      .map((ergebnis) => {
                        const disziplin = disziplinen.find(d => d.DISZIPLINID === ergebnis.DISZIPLINID);
                        return (
                          <div key={ergebnis.ERGEBNISID} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {disziplin?.NAME || `Disziplin ${ergebnis.DISZIPLINID}`}
                                </span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getPointsColor(ergebnis.PUNKTE)}`}>
                                {ergebnis.PUNKTE || 0}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  
                  <button 
                    className="mt-4 w-full py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-800/30 text-green-600 dark:text-green-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDisziplinSelectionModal(team);
                    }}
                  >
                    <Plus size={16} className="mr-2" />
                    Disziplin auswählen
                  </button>
                </div>
                
                {/* Gradient bottom border */}
                <div className="h-1" style={{ 
                  background: 'linear-gradient(90deg, #57F287 0%, #3BA55C 100%)'
                }}></div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    );
  };

 
      console.log("Accessible Teams:", accessibleItems.teams);
      console.log("All Teams:", teams);

      


  return (
    <motion.div 
      className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto" 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header with role indicator */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Ergebnisse</h1>
        {currentBetreuerData && (
          <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm">
            <User className="w-4 h-4 mr-1" />
            <span>Angemeldet als {currentBetreuerData.NAME}</span>
            <div className="flex items-center ml-4">
              {getRoleDisplay(currentBetreuerData).icon}
              <span className="ml-1">{getRoleDisplay(currentBetreuerData).role}</span>
            </div>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-400">
          {currentBetreuerData?.ROLLE === 'stationaer' 
            ? 'Verwalten Sie Ergebnisse für Ihre zugewiesenen Disziplinen' 
            : currentBetreuerData?.ROLLE === 'laufend'
            ? 'Verfolgen Sie die Ergebnisse Ihrer Teams in allen Disziplinen'
            : 'Übersicht aller Wettbewerbsergebnisse'}
        </p>
      </div>

      {/* Search and filter controls - different UIs for admin vs betreuer */}
      {!loading && !error && (
        <>
          {/* Admin UI with advanced filters */}
          {isAdmin ? (
            <div className="mb-6 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Nach Team oder Disziplin suchen..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* View mode selector */}
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  className={`p-2 rounded ${viewMode === 'card' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setViewMode('card')}
                  aria-label="Card view"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  className={`p-2 rounded ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setViewMode('table')}
                  aria-label="Table view"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  className={`p-2 rounded ${viewMode === 'chart' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                  onClick={() => setViewMode('chart')}
                  aria-label="Chart view"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
              
              {/* Team selector */}
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="all">Alle Teams</option>
                  {teams.map(team => (
                    <option key={team.TEAMID} value={team.TEAMID}>{team.NAME}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              
              {/* Disziplin selector */}
              <div className="relative">
                <select
                  className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 appearance-none"
                  value={selectedDisziplin}
                  onChange={(e) => setSelectedDisziplin(e.target.value)}
                >
                  <option value="all">Alle Disziplinen</option>
                  {disziplinen.map(disziplin => (
                    <option key={disziplin.DISZIPLINID} value={disziplin.DISZIPLINID}>{disziplin.NAME}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
              
              {/* Reset filters button */}
              <button
                className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                onClick={resetFilters}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Filter zurücksetzen
              </button>
              
              {/* Add result button */}
              <button
                className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg ml-auto"
                onClick={() => {
                  openAddModal();
                  triggerHapticFeedback('light');
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Ergebnis hinzufügen
              </button>
            </div>
          ) : (
            /* Simplified Betreuer UI with just search and view toggle */
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Schnellsuche..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                    <button
                      className={`p-2 rounded ${viewMode === 'card' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                      onClick={() => setViewMode('card')}
                      aria-label="Card view"
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      className={`p-2 rounded ${viewMode === 'table' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
                      onClick={() => setViewMode('table')}
                      aria-label="Table view"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={() => {
                      openAddModal();
                      triggerHapticFeedback('light');
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ergebnis hinzufügen
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
{/* Content based on user role and active view */}
      {!loading && !error && (
        <>
          {/* Bei Betreuer ohne Teams spezielle Nachricht anzeigen */}
          {!isAdmin && currentBetreuerData && accessibleItems.teams.length === 0 && currentBetreuerData.ROLLE !== 'stationaer' && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
              <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Keine Teams zugewiesen</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
                Ihrem Konto wurden noch keine Teams zugewiesen. 
                Bitte kontaktieren Sie einen Administrator, um Teams zugewiesen zu bekommen.
              </p>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center"
                onClick={() => navigate('/dashboard')}
              >
                Zurück zum Dashboard
              </button>
            </div>
          )}

          {/* Different views for different roles */}
          {!isAdmin && currentBetreuerData && (
            <>
              {/* Show role-specific views for betreuer */}
              {currentBetreuerData.ROLLE === 'stationaer' ? (
                renderStationaerView()
              ) : currentBetreuerData.ROLLE === 'laufend' && accessibleItems.teams.length > 0 ? (
                renderLaufendView()
              ) : accessibleItems.teams.length > 0 ? (
                renderLaufendView() // Default to team view if teams assigned
              ) : currentBetreuerData.ROLLE === 'stationaer' ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                  <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Keine Disziplinen zugewiesen</h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-4">
                    Ihrem Konto wurden noch keine Disziplinen zugewiesen. 
                    Bitte kontaktieren Sie einen Administrator für weitere Unterstützung.
                  </p>
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center"
                    onClick={() => navigate('/dashboard')}
                  >
                    Zurück zum Dashboard
                  </button>
                </div>
              ) : null
              /* Die "Keine Teams" Nachricht wird schon oben gezeigt */
              }
            </>
          )}
          
          {/* Admin view - shows all results in selected view mode */}
          {(isAdmin || !currentBetreuerData) && (
            <>
              {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredErgebnisse.map((ergebnis, index) => (
                      <motion.div
                        key={ergebnis.ERGEBNISID}
                        className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
                        variants={itemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={index}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div onClick={() => openTeamDetailPage({ TEAMID: ergebnis.TEAMID, NAME: ergebnis.teamName })} className="cursor-pointer">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                                {getMedalIcon(index)}
                                <span className={index < 3 ? 'ml-2' : ''}>{ergebnis.teamName}</span>
                              </h3>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getPointsColor(ergebnis.punkteNumber)}`}>
                              {ergebnis.PUNKTE}
                            </div>
                          </div>
                          <div onClick={() => openDisziplinDetailPage({ DISZIPLINID: ergebnis.DISZIPLINID, NAME: ergebnis.disziplinName })} className="cursor-pointer">
                            <p className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {ergebnis.disziplinName}
                            </p>
                          </div>
                          
                          {ergebnis.DATUM && (
                            <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(ergebnis.DATUM).toLocaleDateString()}
                            </div>
                          )}
                          
                          {ergebnis.KOMMENTAR && (
                            <div className="flex items-start mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <MessageSquare className="w-3 h-3 mr-1 mt-0.5" />
                              <span className="line-clamp-2">{ergebnis.KOMMENTAR}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex justify-end space-x-2">
                          <button
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-800/30 rounded-md"
                            onClick={() => {
                              openStudentScoreModal(ergebnis);
                              triggerHapticFeedback('light');
                            }}
                            title="Einzelpunkte anzeigen"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-800/30 rounded-md"
                            onClick={() => {
                              openEditModal(ergebnis);
                              triggerHapticFeedback('light');
                            }}
                            title="Ergebnis bearbeiten"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-800/30 rounded-md"
                            onClick={() => {
                              openDeleteModal(ergebnis);
                              triggerHapticFeedback('light');
                            }}
                            title="Ergebnis löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              {viewMode === 'table' && (
                <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('team')}
                        >
                          <div className="flex items-center">
                            Team
                            {sortBy === 'team' && (
                              <ChevronDown className={`ml-1 w-4 h-4 transform ${sortOrder === 'asc' ? 'rotate-180' : 'rotate-0'}`} />
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('disziplin')}
                        >
                          <div className="flex items-center">
                            Disziplin
                            {sortBy === 'disziplin' && (
                              <ChevronDown className={`ml-1 w-4 h-4 transform ${sortOrder === 'asc' ? 'rotate-180' : 'rotate-0'}`} />
                            )}
                          </div>
                        </th>
                        <th 
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('punkte')}
                        >
                          <div className="flex items-center">
                            Punkte
                            {sortBy === 'punkte' && (
                              <ChevronDown className={`ml-1 w-4 h-4 transform ${sortOrder === 'asc' ? 'rotate-180' : 'rotate-0'}`} />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Datum
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Aktionen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredErgebnisse.length > 0 ? (
                        filteredErgebnisse.map((ergebnis, index) => (
                          <tr 
                            key={ergebnis.ERGEBNISID}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                              hoveredItem === ergebnis.ERGEBNISID ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                            onMouseEnter={() => setHoveredItem(ergebnis.ERGEBNISID)}
                            onMouseLeave={() => setHoveredItem(null)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getMedalIcon(index)}
                                <div className={`font-medium text-gray-900 dark:text-white ${index < 3 ? 'ml-2' : ''}`}>
                                  {ergebnis.teamName}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-200">{ergebnis.disziplinName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPointsColor(ergebnis.punkteNumber)}`}>
                                {ergebnis.PUNKTE}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {ergebnis.DATUM ? new Date(ergebnis.DATUM).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
                                onClick={() => {
                                  openStudentScoreModal(ergebnis);
                                  triggerHapticFeedback('light');
                                }}
                              >
                                <FileText className="w-4 h-4 inline" />
                              </button>
                              <button
                                className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 mr-3"
                                onClick={() => {
                                  openEditModal(ergebnis);
                                  triggerHapticFeedback('light');
                                }}
                              >
                                <Edit className="w-4 h-4 inline" />
                              </button>
                              <button
                                className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                onClick={() => {
                                  openDeleteModal(ergebnis);
                                  triggerHapticFeedback('light');
                                }}
                              >
                                <Trash2 className="w-4 h-4 inline" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Keine Ergebnisse gefunden
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              
              {viewMode === 'chart' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Team points chart */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Teams nach Gesamtpunkten</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData.teamData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="punkte" name="Punkte" fill="#5865F2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Disziplin average points chart */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Durchschnittspunkte pro Disziplin</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData.disziplinData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="durchschnitt" name="Durchschnitt" fill="#EB459E" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* No results message */}
      {!loading && !error && filteredErgebnisse.length === 0 && viewMode !== 'chart' && (
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Noch keine Ergebnisse</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {currentBetreuerData?.ROLLE === 'stationaer' 
              ? 'Fügen Sie Ergebnisse für Ihre zugewiesenen Disziplinen hinzu.' 
              : currentBetreuerData?.ROLLE === 'laufend'
              ? 'Ihre Teams haben noch keine Ergebnisse. Besuchen Sie Disziplinen, um Punkte zu sammeln.'
              : 'Fügen Sie neue Ergebnisse hinzu, um die Punktestände zu verfolgen.'}
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-flex items-center"
            onClick={() => {
              openAddModal();
              triggerHapticFeedback('light');
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ergebnis hinzufügen
          </button>
        </div>
      )}
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertTriangle className="w-5 h-5 mr-2" />
              )}
              <p>{notification.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add/Edit Result Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-gray-700 p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {showAddModal ? 'Ergebnis hinzufügen' : 'Ergebnis bearbeiten'}
                  </h3>
                  <button
                    onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <form>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
                      <select
                        name="TEAMID"
                        value={formData.TEAMID}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                        disabled={currentBetreuerData?.ROLLE === 'laufend' && !isAdmin}
                      >
                        <option value="">Team auswählen</option>
                        {accessibleItems.teams.map(team => (
                          <option key={team.TEAMID} value={team.TEAMID}>{team.NAME}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Disziplin</label>
                      <select
                        name="DISZIPLINID"
                        value={formData.DISZIPLINID}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                        disabled={currentBetreuerData?.ROLLE === 'stationaer' && !isAdmin}
                      >
                        <option value="">Disziplin auswählen</option>
                        {accessibleItems.disziplinen.map(disziplin => (
                          <option key={disziplin.DISZIPLINID} value={disziplin.DISZIPLINID}>{disziplin.NAME}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Punkte</label>
                      <input
                        type="number"
                        name="PUNKTE"
                        value={formData.PUNKTE}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Datum</label>
                      <input
                        type="date"
                        name="DATUM"
                        value={formData.DATUM}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kommentar</label>
                      <textarea
                        name="KOMMENTAR"
                        value={formData.KOMMENTAR}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        rows="3"
                      ></textarea>
                    </div>
                  </form>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-gray-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg mr-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => showAddModal ? setShowAddModal(false) : setShowEditModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      if (showAddModal) {
                        handleAddErgebnis();
                      } else {
                        handleEditErgebnis();
                      }
                      triggerHapticFeedback('success');
                    }}
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    {showAddModal ? 'Hinzufügen' : 'Speichern'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && currentErgebnis && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowDeleteModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-gray-700 p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Ergebnis löschen</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Sind Sie sicher, dass Sie das Ergebnis von "{currentErgebnis.teamName}" in der Disziplin "{currentErgebnis.disziplinName}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400 dark:border-amber-500 p-4">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-amber-400 dark:text-amber-500 mr-2" />
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Beim Löschen gehen alle zugehörigen Daten unwiderruflich verloren.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-gray-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg mr-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => {
                      handleDeleteErgebnis();
                      triggerHapticFeedback('error');
                    }}
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Löschen
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* TeamDisciplineScoreModal */}
      {showStudentScoreModal && currentTeam && (
        <TeamDisciplineScoreModal
          team={currentTeam}
          onClose={() => setShowStudentScoreModal(false)}
        />
      )}
      
      {/* Team Selection Modal (for stationäre Betreuer) */}
      <AnimatePresence>
        {showTeamSelectionModal && currentDisziplin && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowTeamSelectionModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-gray-700 p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Team für {currentDisziplin.NAME} auswählen
                  </h3>
                  <button
                    onClick={() => setShowTeamSelectionModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div 
                        key={team.TEAMID}
                        className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                        onClick={() => {
                          // Add a new score for this team
                          setFormData({
                            ...formData,
                            TEAMID: team.TEAMID,
                            DISZIPLINID: currentDisziplin.DISZIPLINID
                          });
                          setShowTeamSelectionModal(false);
                          setShowAddModal(true);
                          triggerHapticFeedback('selection');
                        }}
                      >
                        <h4 className="font-medium text-gray-900 dark:text-white">{team.NAME}</h4>
                        {/* Show existing score if available */}
                        {enhancedErgebnisse.some(e => e.TEAMID === team.TEAMID && e.DISZIPLINID === currentDisziplin.DISZIPLINID) && (
                          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Bereits bewertet: 
                            <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">
                              {enhancedErgebnisse.find(e => e.TEAMID === team.TEAMID && e.DISZIPLINID === currentDisziplin.DISZIPLINID)?.PUNKTE || 0} Punkte
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-gray-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setShowTeamSelectionModal(false)}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Disziplin Selection Modal (for laufende Betreuer) */}
      <AnimatePresence>
        {showDisziplinSelectionModal && currentTeam && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowDisziplinSelectionModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-gray-700 p-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Disziplin für {currentTeam.NAME} auswählen
                  </h3>
                  <button
                    onClick={() => setShowDisziplinSelectionModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {disziplinen.map((disziplin) => {
                      // Prüfen, ob dieses Ergebnis bereits existiert
                      const existingResult = enhancedErgebnisse.find(e => 
                        e.TEAMID === currentTeam.TEAMID && e.DISZIPLINID === disziplin.DISZIPLINID
                      );
                      
                      return (
                        <div 
                          key={disziplin.DISZIPLINID}
                          className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
                          onClick={() => {
                            // Add a new score for this disziplin or edit existing one
                            setFormData({
                              ...formData,
                              TEAMID: currentTeam.TEAMID,
                              DISZIPLINID: disziplin.DISZIPLINID,
                              PUNKTE: existingResult ? existingResult.PUNKTE : '',
                              DATUM: existingResult ? existingResult.DATUM : new Date().toISOString().split('T')[0],
                              KOMMENTAR: existingResult ? existingResult.KOMMENTAR : ''
                            });
                            setShowDisziplinSelectionModal(false);
                            
                            if (existingResult) {
                              setCurrentErgebnis(existingResult);
                              setShowEditModal(true);
                            } else {
                              setShowAddModal(true);
                            }
                            
                            triggerHapticFeedback('selection');
                          }}
                        >
                          <h4 className="font-medium text-gray-900 dark:text-white">{disziplin.NAME}</h4>
                          {existingResult && (
                            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Bereits bewertet: 
                              <span className="ml-1 text-green-600 dark:text-green-400 font-medium">
                                {existingResult.PUNKTE || 0} Punkte
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-gray-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => setShowDisziplinSelectionModal(false)}
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ErgebnissePage;