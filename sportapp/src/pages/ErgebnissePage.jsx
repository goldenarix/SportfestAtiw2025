import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  User
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
  // State for data
  const [ergebnisse, setErgebnisse] = useState([]);
  const [teams, setTeams] = useState([]);
  const [disziplinen, setDisziplinen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [selectedDisziplin, setSelectedDisziplin] = useState('all');
  const [viewMode, setViewMode] = useState('card'); // 'card', 'table', 'chart'
  const [sortBy, setSortBy] = useState('punkte'); // 'punkte', 'team', 'disziplin'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  // Fetch all required data
  useEffect(() => {
    fetchAllData();
  }, []);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel for better performance
      const [ergebnisseRes, teamsRes, disziplinenRes] = await Promise.all([
        fetch('http://localhost:3001/api/ergebnisse'),
        fetch('http://localhost:3001/api/teams'),
        fetch('http://localhost:3001/api/disziplins')
      ]);
      
      // Check for errors
      if (!ergebnisseRes.ok || !teamsRes.ok || !disziplinenRes.ok) {
        throw new Error(`HTTP error: ${ergebnisseRes.status} / ${teamsRes.status} / ${disziplinenRes.status}`);
      }
      
      // Parse JSON responses
      const ergebnisseData = await ergebnisseRes.json();
      const teamsData = await teamsRes.json();
      const disziplinenData = await disziplinenRes.json();
      
      // Update state if all requests were successful
      if (ergebnisseData.success && teamsData.success && disziplinenData.success) {
        setErgebnisse(ergebnisseData.data || []);
        setTeams(teamsData.data || []);
        setDisziplinen(disziplinenData.data || []);
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
      const response = await fetch('http://localhost:3001/api/ergebnisse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Ergebnis erfolgreich hinzugefügt!'
        });
        fetchAllData();
        setShowAddModal(false);
        resetForm();
      } else {
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
      const response = await fetch(`http://localhost:3001/api/ergebnisse/${currentErgebnis.ERGEBNISID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Ergebnis erfolgreich aktualisiert!'
        });
        fetchAllData();
        setShowEditModal(false);
      } else {
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
      const response = await fetch(`http://localhost:3001/api/ergebnisse/${currentErgebnis.ERGEBNISID}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Ergebnis erfolgreich gelöscht!'
        });
        fetchAllData();
        setShowDeleteModal(false);
      } else {
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

    // Beispielsweise in der openEditModal-Funktion:
    const openEditModal = (ergebnis) => {
        setCurrentErgebnis(ergebnis);
        setFormData({
        TEAMID: ergebnis.TEAMID,
        DISZIPLINID: ergebnis.DISZIPLINID,
        PUNKTE: ergebnis.POINTSID || ergebnis.PUNKTE, // Unterstützt beide Varianten
        DATUM: ergebnis.DATUM || new Date().toISOString().split('T')[0],
        KOMMENTAR: ergebnis.KOMMENTAR || ''
        });
        setShowEditModal(true);
    };

  const openDeleteModal = (ergebnis) => {
    setCurrentErgebnis(ergebnis);
    setShowDeleteModal(true);
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
            // Verwende POINTSID statt PUNKTE für die Punktzahl
            PUNKTE: ergebnis.POINTSID, // Auf Frontend-Seite bleibt PUNKTE als Begriff
            punkteNumber: parseFloat(ergebnis.POINTSID) || 0 // Umwandlung für numerische Operationen
        };
        });
    }, [ergebnisse, teams, disziplinen]);

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
        
        return matchesSearch && matchesTeam && matchesDisziplin;
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
  }, [enhancedErgebnisse, searchQuery, selectedTeam, selectedDisziplin, sortBy, sortOrder]);

  // Data for charts
  const chartData = useMemo(() => {
    // Group by team
    const teamData = teams.map(team => {
      const teamErgebnisse = enhancedErgebnisse.filter(e => e.TEAMID === team.TEAMID);
      const totalPoints = teamErgebnisse.reduce((sum, e) => sum + parseFloat(e.PUNKTE || 0), 0);
      
      return {
        name: team.NAME || `Team ${team.TEAMID}`,
        punkte: totalPoints,
        anzahlDisziplinen: teamErgebnisse.length
      };
    }).sort((a, b) => b.punkte - a.punkte);

    // Group by disziplin
    const disziplinData = disziplinen.map(disziplin => {
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
  }, [enhancedErgebnisse, teams, disziplinen]);

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

  // Render functions for different view modes
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {filteredErgebnisse.map((ergebnis, index) => (
          <motion.div
            key={ergebnis.ERGEBNISID}
            className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700"
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={index}
            whileHover="hover"
            onMouseEnter={() => setHoveredItem(ergebnis.ERGEBNISID)}
            onMouseLeave={() => setHoveredItem(null)}
            layout
          >
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {getMedalIcon(index)}
                  <div className="ml-2">
                    <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                      {ergebnis.teamName}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      {ergebnis.disziplinName}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center justify-center h-12 w-12 rounded-lg font-bold ${getPointsColor(ergebnis.punkteNumber)}`}>
                  {ergebnis.PUNKTE}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-gradient-to-r from-[#5865F2] to-[#EB459E] h-2.5 rounded-full" 
                    style={{ width: `${(ergebnis.punkteNumber / 100) * 100}%` }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">DATUM</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {ergebnis.DATUM || 'Unbekannt'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">STATUS</p>
                    <p className="text-sm font-medium text-green-500 dark:text-green-400">
                      Bestätigt
                    </p>
                  </div>
                </div>
                
                {ergebnis.KOMMENTAR && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                    <div className="flex items-start">
                      <MessageSquare size={14} className="mt-0.5 mr-2 text-slate-400" />
                      <p className="line-clamp-2">{ergebnis.KOMMENTAR}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  ID: {ergebnis.ERGEBNISID}
                </div>
                <div className="flex space-x-2">
                  <motion.button 
                    className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => openEditModal(ergebnis)}
                  >
                    <Edit size={16} />
                  </motion.button>
                  <motion.button 
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => openDeleteModal(ergebnis)}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Discord-style gradient bottom border */}
            <div className="h-1" style={{ 
              background: 'linear-gradient(90deg, #5865F2 0%, #EB459E 100%)'
            }}></div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('team')}
              >
                <div className="flex items-center">
                  Team
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform ${sortBy === 'team' && sortOrder === 'asc' ? 'rotate-180' : ''} ${sortBy !== 'team' ? 'opacity-0' : 'opacity-100'}`} 
                  />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('disziplin')}
              >
                <div className="flex items-center">
                  Disziplin
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform ${sortBy === 'disziplin' && sortOrder === 'asc' ? 'rotate-180' : ''} ${sortBy !== 'disziplin' ? 'opacity-0' : 'opacity-100'}`} 
                  />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort('punkte')}
              >
                <div className="flex items-center">
                  Punkte
                  <ChevronDown 
                    size={16} 
                    className={`ml-1 transition-transform ${sortBy === 'punkte' && sortOrder === 'asc' ? 'rotate-180' : ''} ${sortBy !== 'punkte' ? 'opacity-0' : 'opacity-100'}`} 
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Datum
              </th>
              <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3.5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            <AnimatePresence>
              {filteredErgebnisse.map((ergebnis, index) => (
                <motion.tr 
                  key={ergebnis.ERGEBNISID}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={index}
                  layout
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMedalIcon(index)}
                      <span className={`flex items-center ${index < 3 ? 'ml-2' : ''}`}>
                        <span className="font-medium text-slate-800 dark:text-white">{ergebnis.teamName}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-slate-600 dark:text-slate-300">{ergebnis.disziplinName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPointsColor(ergebnis.punkteNumber)}`}>
                      {ergebnis.PUNKTE}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {ergebnis.DATUM || 'Unbekannt'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      Bestätigt
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <motion.button 
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openEditModal(ergebnis)}
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button 
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDeleteModal(ergebnis)}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderChartView = () => (
    <div className="space-y-8">
      {/* Team Performance Chart */}
      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700 p-5"
        variants={itemVariants}
        initial="initial"
        animate="animate"
        custom={0}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Team Performance
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Auto-Update</span>
            <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.teamData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#55555522" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--chart-text-color, #64748b)' }} 
                axisLine={{ stroke: '#55555522' }}
              />
              <YAxis 
                tick={{ fill: 'var(--chart-text-color, #64748b)' }} 
                axisLine={{ stroke: '#55555522' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  borderColor: 'var(--tooltip-border, #e2e8f0)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  borderRadius: '0.5rem'
                }} 
                cursor={{ fill: 'var(--chart-hover, #f8fafc33)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar 
                dataKey="punkte" 
                name="Gesamtpunkte" 
                fill="#5865F2" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="anzahlDisziplinen" 
                name="Anzahl Disziplinen" 
                fill="#EB459E" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
      {/* Disziplin Performance Chart */}
      <motion.div 
        className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700 p-5"
        variants={itemVariants}
        initial="initial"
        animate="animate"
        custom={1}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
            Durchschnittliche Punktzahl pro Disziplin
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Auto-Update</span>
            <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData.disziplinData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#55555522" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--chart-text-color, #64748b)' }} 
                axisLine={{ stroke: '#55555522' }}
              />
              <YAxis 
                tick={{ fill: 'var(--chart-text-color, #64748b)' }} 
                axisLine={{ stroke: '#55555522' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tooltip-bg, #fff)', 
                  borderColor: 'var(--tooltip-border, #e2e8f0)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  borderRadius: '0.5rem'
                }} 
                cursor={{ stroke: 'var(--chart-hover, #f8fafc33)' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="durchschnitt" 
                name="Durchschnittl. Punkte" 
                stroke="#5865F2" 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="anzahlTeams" 
                name="Anzahl Teams" 
                stroke="#EB459E" 
                strokeWidth={2} 
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header with Discord-inspired design */}
      <div className="mb-6 bg-gradient-to-r from-[#5865F2] to-[#EB459E] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Discord-style background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="flex flex-wrap items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Trophy className="inline-block mr-2" size={28} />
              Ergebnisse
            </h1>
            <p className="text-white/80">
              Übersicht aller Wettbewerbsergebnisse
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {filteredErgebnisse.length} Ergebnisse
            </motion.div>
            
            <motion.button 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              onClick={openAddModal}
            >
              <Plus size={20} />
            </motion.button>
          </div>
        </div>
        
        {/* Discord-style decorative elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16"></div>
        <div className="absolute top-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mt-8"></div>
      </div>
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-lg flex items-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {notification.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-3" /> : 
              <AlertTriangle className="h-5 w-5 mr-3" />
            }
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

      {/* Filter and Search Bar - Discord Style */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent sm:text-sm"
              placeholder="Suche nach Teams oder Disziplinen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <select
              className="block w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent sm:text-sm"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="all">Alle Teams</option>
              {teams.map(team => (
                <option key={team.TEAMID} value={team.TEAMID}>
                  {team.NAME || `Team ${team.TEAMID}`}
                </option>
              ))}
            </select>
            
            <select
              className="block w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent sm:text-sm"
              value={selectedDisziplin}
              onChange={(e) => setSelectedDisziplin(e.target.value)}
            >
              <option value="all">Alle Disziplinen</option>
              {disziplinen.map(disziplin => (
                <option key={disziplin.DISZIPLINID} value={disziplin.DISZIPLINID}>
                  {disziplin.NAME || `Disziplin ${disziplin.DISZIPLINID}`}
                </option>
              ))}
            </select>
            
            <button
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-800/30 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors flex items-center"
              onClick={resetFilters}
            >
              <RefreshCw size={16} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* View Options Bar */}
      <div className="mb-6 flex justify-between items-center bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-3">
        <div className="flex items-center space-x-1">
          <button
            className={`p-2 rounded-lg ${viewMode === 'card' ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}
            onClick={() => setViewMode('card')}
            title="Card View"
          >
            <Grid size={20} />
          </button>
          <button
            className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            <List size={20} />
          </button>
          <button
            className={`p-2 rounded-lg ${viewMode === 'chart' ? 'bg-indigo-50 text-indigo-600 dark:bg-slate-700 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}
            onClick={() => setViewMode('chart')}
            title="Chart View"
          >
            <BarChart3 size={20} />
          </button>
        </div>
        
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300">
          <span className="hidden sm:inline mr-2">Sortieren nach:</span>
          <div className="relative">
            <button
              className="flex items-center space-x-1 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700"
              onClick={() => {
                if (sortBy === 'punkte') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortBy('punkte');
                  setSortOrder('desc');
                }
              }}
            >
              <span>
                {sortBy === 'punkte' ? 'Punkte' : 
                 sortBy === 'team' ? 'Team' : 'Disziplin'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown menu would go here in a production implementation */}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Daten werden geladen...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 dark:text-red-300 font-medium">Fehler beim Laden der Daten</h3>
              <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
              <p className="text-red-700 dark:text-red-400 mt-2">
                Bitte stellen Sie sicher, dass der Server läuft und die Datenbankverbindung funktioniert.
              </p>
              <button 
                onClick={fetchAllData}
                className="mt-2 flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 text-red-800 dark:text-red-300 rounded-lg transition-colors"
              >
                <RefreshCw size={14} className="mr-2" />
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && filteredErgebnisse.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center shadow-sm border border-slate-100 dark:border-slate-700">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMiAxNkMxNC4yMDkxIDE2IDE2IDE0LjIwOTEgMTYgMTJDMTYgOS43OTA4NiAxNC4yMDkxIDggMTIgOEM5Ljc5MDg2IDggOCA5Ljc5MDg2IDggMTJDOCAxNC4yMDkxIDkuNzkwODYgMTYgMTIgMTZaIiBzdHJva2U9IiM1ODY1RjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTMgMTZWOEMzIDUuMjM4NTggNSAzIDggM0gxNkMxOC43NjE0IDMgMjEgNS4yMzg1OCAyMSA4VjE2QzIxIDE4Ljc2MTQgMTguNzYxNCAyMSAxNiAyMUg4QzUgMjEgMyAxOC43NjE0IDMgMTZaIiBzdHJva2U9IiM1ODY1RjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTE3LjUgNi41VjYuNTEiIHN0cm9rZT0iIzU4NjVGMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=" 
            alt="No results"
            className="mx-auto h-24 w-24 mb-4 opacity-30"
          />
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Keine Ergebnisse gefunden</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            {searchQuery || selectedTeam !== 'all' || selectedDisziplin !== 'all'
              ? 'Keine Ergebnisse entsprechen Ihren Filterkriterien. Versuchen Sie, Ihre Filter anzupassen.'
              : 'Es wurden keine Ergebnisse in der Datenbank gefunden. Fügen Sie Ergebnisse hinzu, um sie hier anzuzeigen.'}
          </p>
          {searchQuery || selectedTeam !== 'all' || selectedDisziplin !== 'all' ? (
            <button 
              className="inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
              onClick={resetFilters}
            >
              <RefreshCw size={18} className="mr-2" />
              Filter zurücksetzen
            </button>
          ) : (
            <button 
              className="inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
              onClick={openAddModal}
            >
              <Plus size={18} className="mr-2" />
              Neues Ergebnis hinzufügen
            </button>
          )}
        </div>
      )}

      {!loading && !error && filteredErgebnisse.length > 0 && (
        <>
          {viewMode === 'card' && renderCardView()}
          {viewMode === 'table' && renderTableView()}
          {viewMode === 'chart' && renderChartView()}
        </>
      )}
      
      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden">
                {/* Discord-style header */}
                <div className="bg-gradient-to-r from-[#5865F2] to-[#EB459E] p-4 text-white flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Sparkles className="mr-2" size={18} />
                    Neues Ergebnis hinzufügen
                  </h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Team*
                      </label>
                      <select
                        name="TEAMID"
                        value={formData.TEAMID}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        required
                      >
                        <option value="" disabled>Team auswählen</option>
                        {teams.map(team => (
                          <option key={team.TEAMID} value={team.TEAMID}>
                            {team.NAME || `Team ${team.TEAMID}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Disziplin*
                      </label>
                      <select
                        name="DISZIPLINID"
                        value={formData.DISZIPLINID}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        required
                      >
                        <option value="" disabled>Disziplin auswählen</option>
                        {disziplinen.map(disziplin => (
                          <option key={disziplin.DISZIPLINID} value={disziplin.DISZIPLINID}>
                            {disziplin.NAME || `Disziplin ${disziplin.DISZIPLINID}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Punkte*
                        </label>
                        <input
                          type="number"
                          name="PUNKTE"
                          value={formData.PUNKTE}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="z.B. 85"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Datum
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className="text-slate-400" />
                          </div>
                          <input
                            type="date"
                            name="DATUM"
                            value={formData.DATUM}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Kommentar
                      </label>
                      <textarea
                        name="KOMMENTAR"
                        value={formData.KOMMENTAR}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Optionaler Kommentar zu diesem Ergebnis"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowAddModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleAddErgebnis}
                    >
                      <Save size={18} className="mr-2" />
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && currentErgebnis && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#5865F2] to-[#EB459E] p-4 text-white flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Edit className="mr-2" size={18} />
                    Ergebnis bearbeiten
                  </h3>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Team*
                      </label>
                      <select
                        name="TEAMID"
                        value={formData.TEAMID}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        required
                      >
                        {teams.map(team => (
                          <option key={team.TEAMID} value={team.TEAMID}>
                            {team.NAME || `Team ${team.TEAMID}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Disziplin*
                      </label>
                      <select
                        name="DISZIPLINID"
                        value={formData.DISZIPLINID}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        required
                      >
                        {disziplinen.map(disziplin => (
                          <option key={disziplin.DISZIPLINID} value={disziplin.DISZIPLINID}>
                            {disziplin.NAME || `Disziplin ${disziplin.DISZIPLINID}`}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Punkte*
                        </label>
                        <input
                          type="number"
                          name="PUNKTE"
                          value={formData.PUNKTE}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="z.B. 85"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Datum
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className="text-slate-400" />
                          </div>
                          <input
                            type="date"
                            name="DATUM"
                            value={formData.DATUM}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Kommentar
                      </label>
                      <textarea
                        name="KOMMENTAR"
                        value={formData.KOMMENTAR}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Optionaler Kommentar zu diesem Ergebnis"
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowEditModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleEditErgebnis}
                    >
                      <Save size={18} className="mr-2" />
                      Änderungen speichern
                    </button>
                  </div>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden">
                <div className="bg-red-500 p-4 text-white flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center">
                    <AlertTriangle className="mr-2" size={18} />
                    Ergebnis löschen
                  </h3>
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Sind Sie sicher, dass Sie das Ergebnis von <span className="font-semibold">{currentErgebnis.teamName}</span> für die Disziplin <span className="font-semibold">{currentErgebnis.disziplinName}</span> löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                    <p className="text-red-700 dark:text-red-400 text-sm">
                      Die Punktzahl von {currentErgebnis.PUNKTE} wird dauerhaft gelöscht.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleDeleteErgebnis}
                    >
                      <Trash2 size={18} className="mr-2" />
                      Ergebnis löschen
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* CSS Variables for dark mode support in charts */}
      <style jsx>{`
        :root {
          --chart-text-color: #64748b;
          --tooltip-bg: #ffffff;
          --tooltip-border: #e2e8f0;
          --chart-hover: #f8fafc33;
        }
        
        .dark {
          --chart-text-color: #94a3b8;
          --tooltip-bg: #1e293b;
          --tooltip-border: #334155;
          --chart-hover: #1e293b80;
        }
      `}</style>
    </motion.div>
  );
};

export default ErgebnissePage;