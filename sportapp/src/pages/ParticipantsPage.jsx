import React, { useState, useEffect, useMemo, itemVariants} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  ChevronDown, 
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  AlertTriangle,
  CheckCircle,
  User,
  UserPlus,
  Shield,
  RefreshCw,
  UserCog,
  Filter,
  ArrowUpDown,
  Eye,
  EyeOff,
  Lock, 
  Grid,
  List,
  
} from 'lucide-react';


// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: (index) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: index * 0.05 }
  }),
  hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const TeilnehmerPage = () => {
  // State management
  const [teams, setTeams] = useState([]);
  const [betreuer, setBetreuer] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'betreuer'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [viewMode, setViewMode] = useState('card'); // 'card', 'table'
  const [showPasswords, setShowPasswords] = useState(false);
  
  // Modal states
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [showAddBetreuerModal, setShowAddBetreuerModal] = useState(false);
  const [showEditBetreuerModal, setShowEditBetreuerModal] = useState(false);
  const [showDeleteBetreuerModal, setShowDeleteBetreuerModal] = useState(false);
  
  // Current items for editing/deleting
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentBetreuer, setCurrentBetreuer] = useState(null);
  
  // Form data
  const [teamFormData, setTeamFormData] = useState({
    NAME: '',
    BETREUERID: ''
  });
  
  const [betreuerFormData, setBetreuerFormData] = useState({
    NAME: '',
    PASSWORT: ''
  });
  
  // Notification state
  const [notification, setNotification] = useState(null);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
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
  
  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch teams and betreuer in parallel
      const [teamsResponse, betreuerResponse] = await Promise.all([
        fetch('http://localhost:3001/api/teams'),
        fetch('http://localhost:3001/api/betreuer')
      ]);
      
      // Check responses
      if (!teamsResponse.ok || !betreuerResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      // Parse JSON
      const teamsData = await teamsResponse.json();
      const betreuerData = await betreuerResponse.json();
      
      // Update state
      if (teamsData.success && betreuerData.success) {
        setTeams(teamsData.data || []);
        setBetreuer(betreuerData.data || []);
        setError(null);
      } else {
        throw new Error('API returned error');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle team form input change
  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData({ ...teamFormData, [name]: value });
  };
  
  // Handle betreuer form input change
  const handleBetreuerFormChange = (e) => {
    const { name, value } = e.target;
    setBetreuerFormData({ ...betreuerFormData, [name]: value });
  };
  
  // Add team
  const handleAddTeam = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Team erfolgreich hinzugefügt!'
        });
        fetchData();
        setShowAddTeamModal(false);
        resetTeamForm();
      } else {
        throw new Error(result.error || 'Failed to add team');
      }
    } catch (err) {
      console.error('Error adding team:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Edit team
  const handleEditTeam = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/teams/${currentTeam.TEAMID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Team erfolgreich aktualisiert!'
        });
        fetchData();
        setShowEditTeamModal(false);
      } else {
        throw new Error(result.error || 'Failed to update team');
      }
    } catch (err) {
      console.error('Error updating team:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Delete team
  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/teams/${currentTeam.TEAMID}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Team erfolgreich gelöscht!'
        });
        fetchData();
        setShowDeleteTeamModal(false);
      } else {
        throw new Error(result.error || 'Failed to delete team');
      }
    } catch (err) {
      console.error('Error deleting team:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Add betreuer
  const handleAddBetreuer = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/betreuer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betreuerFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Betreuer erfolgreich hinzugefügt!'
        });
        fetchData();
        setShowAddBetreuerModal(false);
        resetBetreuerForm();
      } else {
        throw new Error(result.error || 'Failed to add betreuer');
      }
    } catch (err) {
      console.error('Error adding betreuer:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Edit betreuer
  const handleEditBetreuer = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/betreuer/${currentBetreuer.BETREUERID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(betreuerFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Betreuer erfolgreich aktualisiert!'
        });
        fetchData();
        setShowEditBetreuerModal(false);
      } else {
        throw new Error(result.error || 'Failed to update betreuer');
      }
    } catch (err) {
      console.error('Error updating betreuer:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Delete betreuer
  const handleDeleteBetreuer = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/betreuer/${currentBetreuer.BETREUERID}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Betreuer erfolgreich gelöscht!'
        });
        fetchData();
        setShowDeleteBetreuerModal(false);
      } else {
        throw new Error(result.error || 'Failed to delete betreuer');
      }
    } catch (err) {
      console.error('Error deleting betreuer:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Reset team form
  const resetTeamForm = () => {
    setTeamFormData({
      NAME: '',
      BETREUERID: betreuer.length > 0 ? betreuer[0].BETREUERID : ''
    });
  };
  
  // Reset betreuer form
  const resetBetreuerForm = () => {
    setBetreuerFormData({
      NAME: '',
      PASSWORT: ''
    });
  };
  
  // Open edit team modal
  const openEditTeamModal = (team) => {
    setCurrentTeam(team);
    setTeamFormData({
      NAME: team.NAME || '',
      BETREUERID: team.BETREUERID || ''
    });
    setShowEditTeamModal(true);
  };
  
  // Open delete team modal
  const openDeleteTeamModal = (team) => {
    setCurrentTeam(team);
    setShowDeleteTeamModal(true);
  };
  
  // Open edit betreuer modal
  const openEditBetreuerModal = (betreuer) => {
    setCurrentBetreuer(betreuer);
    setBetreuerFormData({
      NAME: betreuer.NAME || '',
      PASSWORT: betreuer.PASSWORT || ''
    });
    setShowEditBetreuerModal(true);
  };
  
  // Open delete betreuer modal
  const openDeleteBetreuerModal = (betreuer) => {
    setCurrentBetreuer(betreuer);
    setShowDeleteBetreuerModal(true);
  };
  
  // Toggle sort order
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  // Enhanced data with betreuer names
  const enhancedTeams = useMemo(() => {
    return teams.map(team => {
      const teamBetreuer = betreuer.find(b => b.BETREUERID === team.BETREUERID);
      return {
        ...team,
        betreuerName: teamBetreuer ? teamBetreuer.NAME : 'Kein Betreuer',
        betreuerData: teamBetreuer || null
      };
    });
  }, [teams, betreuer]);
  
  // Filtered and sorted teams
  const filteredTeams = useMemo(() => {
    return enhancedTeams
      .filter(team => {
        const searchLower = searchQuery.toLowerCase();
        return (
          team.NAME.toLowerCase().includes(searchLower) ||
          team.betreuerName.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          const compareResult = a.NAME.localeCompare(b.NAME);
          return sortOrder === 'asc' ? compareResult : -compareResult;
        } else if (sortBy === 'betreuer') {
          const compareResult = a.betreuerName.localeCompare(b.betreuerName);
          return sortOrder === 'asc' ? compareResult : -compareResult;
        }
        return 0;
      });
  }, [enhancedTeams, searchQuery, sortBy, sortOrder]);
  
  // Filtered betreuer
  const filteredBetreuer = useMemo(() => {
    return betreuer
      .filter(b => {
        const searchLower = searchQuery.toLowerCase();
        return b.NAME.toLowerCase().includes(searchLower);
      })
      .sort((a, b) => {
        const compareResult = a.NAME.localeCompare(b.NAME);
        return sortOrder === 'asc' ? compareResult : -compareResult;
      });
  }, [betreuer, searchQuery, sortOrder]);
  
  // Check if a betreuer has associated teams
  const betreuerHasTeams = (betreuerID) => {
    return teams.some(team => team.BETREUERID === betreuerID);
  };
  
  // Render card view
  const renderCardView = () => (
    <div className="space-y-8">
      {/* Teams section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
            <Users className="mr-2 text-indigo-500" size={20} />
            Teams
          </h2>
          <button
            onClick={() => {
              resetTeamForm();
              setShowAddTeamModal(true);
            }}
            className="flex items-center px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm"
          >
            <Plus size={16} className="mr-1" />
            Team hinzufügen
          </button>
        </div>
        
        {filteredTeams.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <User className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              Keine Teams gefunden.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredTeams.map((team, index) => (
                <motion.div
                  key={team.TEAMID}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-700"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={index}
                  whileHover="hover"
                  layout
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                          {team.NAME}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-slate-600 dark:text-slate-300">
                          <Shield size={14} className="mr-1 text-indigo-400" />
                          Betreuer: {team.betreuerName}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <motion.button 
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => openEditTeamModal(team)}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button 
                          className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => openDeleteTeamModal(team)}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                    
                    {team.betreuerData && (
                      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm text-slate-700 dark:text-slate-300">
                            {team.betreuerData.NAME}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            ID: {team.betreuerData.BETREUERID}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center text-xs">
                          <div className="mr-2 text-slate-500 dark:text-slate-400">Passwort:</div>
                          <div className="font-mono bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                            {showPasswords ? team.betreuerData.PASSWORT : '••••••••'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Discord-style gradient bottom border */}
                  <div className="h-1" style={{ 
                    background: 'linear-gradient(90deg, #5865F2 0%, #EB459E 100%)'
                  }}></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Betreuer section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
            <Shield className="mr-2 text-indigo-500" size={20} />
            Betreuer
          </h2>
          <button
            onClick={() => {
              resetBetreuerForm();
              setShowAddBetreuerModal(true);
            }}
            className="flex items-center px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm"
          >
            <UserPlus size={16} className="mr-1" />
            Betreuer hinzufügen
          </button>
        </div>
        
        {filteredBetreuer.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <Shield className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              Keine Betreuer gefunden.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredBetreuer.map((betreuer, index) => (
                <motion.div
                  key={betreuer.BETREUERID}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 dark:border-slate-700"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={index}
                  whileHover="hover"
                  layout
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                          {betreuer.NAME}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-center space-x-1">
                            <Lock size={14} className="text-indigo-400" />
                            <span>
                              {showPasswords ? betreuer.PASSWORT : '••••••••'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <motion.button 
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          onClick={() => openEditBetreuerModal(betreuer)}
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button 
                          className={`p-1.5 rounded-lg text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${betreuerHasTeams(betreuer.BETREUERID) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          whileHover={{ scale: betreuerHasTeams(betreuer.BETREUERID) ? 1 : 1.05 }}
                          onClick={() => !betreuerHasTeams(betreuer.BETREUERID) && openDeleteBetreuerModal(betreuer)}
                          disabled={betreuerHasTeams(betreuer.BETREUERID)}
                          title={betreuerHasTeams(betreuer.BETREUERID) ? "Kann nicht gelöscht werden (hat zugeordnete Teams)" : "Betreuer löschen"}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div>ID: {betreuer.BETREUERID}</div>
                        {betreuerHasTeams(betreuer.BETREUERID) ? (
                          <div className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                            Hat Teams
                          </div>
                        ) : (
                          <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                            Keine Teams
                          </div>
                        )}
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
        )}
      </div>
    </div>
  );
  
  // Render table view
  const renderTableView = () => (
    <div className="space-y-8">
      {/* Teams table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
            <Users className="mr-2 text-indigo-500" size={20} />
            Teams
          </h2>
          <button
            onClick={() => {
              resetTeamForm();
              setShowAddTeamModal(true);
            }}
            className="flex items-center px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm"
          >
            <Plus size={16} className="mr-1" />
            Team hinzufügen
          </button>
        </div>
        
        {filteredTeams.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <User className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              Keine Teams gefunden.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('name')}
                    >
                      <div className="flex items-center">
                        Team Name
                        <ChevronDown 
                          size={16} 
                          className={`ml-1 transition-transform ${sortBy === 'name' && sortOrder === 'asc' ? 'rotate-180' : ''} ${sortBy !== 'name' ? 'opacity-0' : 'opacity-100'}`} 
                        />
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider cursor-pointer"
                      onClick={() => toggleSort('betreuer')}
                    >
                      <div className="flex items-center">
                        Betreuer
                        <ChevronDown 
                          size={16} 
                          className={`ml-1 transition-transform ${sortBy === 'betreuer' && sortOrder === 'asc' ? 'rotate-180' : ''} ${sortBy !== 'betreuer' ? 'opacity-0' : 'opacity-100'}`} 
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Betreuer Details
                    </th>
                    <th scope="col" className="relative px-6 py-3.5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  <AnimatePresence>
                    {filteredTeams.map((team, index) => (
                      <motion.tr 
                        key={team.TEAMID}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        variants={itemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={index}
                        layout
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 dark:text-white">{team.NAME}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-slate-600 dark:text-slate-300">{team.betreuerName}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {team.betreuerData && (
                            <div className="text-sm">
                              <div className="text-slate-600 dark:text-slate-300">
                                ID: {team.betreuerData.BETREUERID}
                              </div>
                              <div className="flex items-center mt-1">
                                <div className="mr-2 text-slate-500 dark:text-slate-400">Passwort:</div>
                                <div className="font-mono bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 text-xs">
                                  {showPasswords ? team.betreuerData.PASSWORT : '••••••••'}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <motion.button 
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => openEditTeamModal(team)}
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button 
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => openDeleteTeamModal(team)}
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
        )}
      </div>
      
      {/* Betreuer table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center">
            <Shield className="mr-2 text-indigo-500" size={20} />
            Betreuer
          </h2>
          <button
            onClick={() => {
              resetBetreuerForm();
              setShowAddBetreuerModal(true);
            }}
            className="flex items-center px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm"
          >
            <UserPlus size={16} className="mr-1" />
            Betreuer hinzufügen
          </button>
        </div>
        
        {filteredBetreuer.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <Shield className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 dark:text-slate-400">
              Keine Betreuer gefunden.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Passwort
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
                    {filteredBetreuer.map((betreuer, index) => (
                      <motion.tr 
                        key={betreuer.BETREUERID}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                        variants={itemVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={index}
                        layout
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {betreuer.BETREUERID}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-slate-800 dark:text-white">{betreuer.NAME}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-mono bg-slate-100 dark:bg-slate-600 px-2 py-0.5 rounded inline-block text-slate-700 dark:text-slate-300 text-xs">
                            {showPasswords ? betreuer.PASSWORT : '••••••••'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {betreuerHasTeams(betreuer.BETREUERID) ? (
                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs">
                              Hat Teams
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                              Keine Teams
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <motion.button 
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => openEditBetreuerModal(betreuer)}
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button 
                              className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ${betreuerHasTeams(betreuer.BETREUERID) ? 'opacity-50 cursor-not-allowed' : ''}`}
                              whileHover={{ scale: betreuerHasTeams(betreuer.BETREUERID) ? 1 : 1.05 }}
                              onClick={() => !betreuerHasTeams(betreuer.BETREUERID) && openDeleteBetreuerModal(betreuer)}
                              disabled={betreuerHasTeams(betreuer.BETREUERID)}
                              title={betreuerHasTeams(betreuer.BETREUERID) ? "Kann nicht gelöscht werden (hat zugeordnete Teams)" : "Betreuer löschen"}
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
        )}
      </div>
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
              <Users className="inline-block mr-2" size={28} />
              Teilnehmer
            </h1>
            <p className="text-white/80">
              Verwaltung aller Teams und Betreuer
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <motion.button
              className="bg-white/10 backdrop-blur-sm p-2 rounded-lg transition-colors hover:bg-white/20"
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowPasswords(!showPasswords)}
              title={showPasswords ? "Passwörter verbergen" : "Passwörter anzeigen"}
            >
              {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
            <motion.button
              className="bg-white/10 backdrop-blur-sm p-2 rounded-lg transition-colors hover:bg-white/20"
              whileHover={{ scale: 1.05 }}
              onClick={fetchData}
              title="Daten aktualisieren"
            >
              <RefreshCw size={20} />
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

      {/* Search and Filter Bar */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent sm:text-sm"
              placeholder="Suche nach Namen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              className={`flex items-center px-3 py-2 rounded-lg border ${
                sortBy === 'name' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-400' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => toggleSort('name')}
            >
              <ArrowUpDown size={16} className="mr-2" />
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            
            <button
              className={`flex items-center px-3 py-2 rounded-lg border ${
                sortBy === 'betreuer' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-400' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => toggleSort('betreuer')}
            >
              <Filter size={16} className="mr-2" />
              Betreuer {sortBy === 'betreuer' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            
            <button
              className={`p-2 rounded-lg border ${
                viewMode === 'card' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-400' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => setViewMode('card')}
              title="Kartenansicht"
            >
              <Grid size={20} />
            </button>
            
            <button
              className={`p-2 rounded-lg border ${
                viewMode === 'table' 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-400' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => setViewMode('table')}
              title="Tabellenansicht"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Daten werden geladen...</p>
        </div>
      )}

      {/* Error state */}
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
                onClick={fetchData}
                className="mt-2 flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 text-red-800 dark:text-red-300 rounded-lg transition-colors"
              >
                <RefreshCw size={14} className="mr-2" />
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      {!loading && !error && (
        <>
          {viewMode === 'card' && renderCardView()}
          {viewMode === 'table' && renderTableView()}
        </>
      )}
      
      {/* Add Team Modal */}
      <AnimatePresence>
        {showAddTeamModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowAddTeamModal(false)}
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
                    <Plus className="mr-2" size={18} />
                    Neues Team hinzufügen
                  </h3>
                  <button 
                    onClick={() => setShowAddTeamModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Team Name*
                      </label>
                      <input
                        type="text"
                        name="NAME"
                        value={teamFormData.NAME}
                        onChange={handleTeamFormChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="z.B. Team Alpha"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Betreuer
                      </label>
                      <select
                        name="BETREUERID"
                        value={teamFormData.BETREUERID}
                        onChange={handleTeamFormChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      >
                        <option value="">Keinen Betreuer zuweisen</option>
                        {betreuer.map(b => (
                          <option key={b.BETREUERID} value={b.BETREUERID}>
                            {b.NAME}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowAddTeamModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleAddTeam}
                      disabled={!teamFormData.NAME}
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
      
      {/* Edit Team Modal */}
      <AnimatePresence>
        {showEditTeamModal && currentTeam && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowEditTeamModal(false)}
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
                    Team bearbeiten
                  </h3>
                  <button 
                    onClick={() => setShowEditTeamModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Team Name*
                      </label>
                      <input
                        type="text"
                        name="NAME"
                        value={teamFormData.NAME}
                        onChange={handleTeamFormChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="z.B. Team Alpha"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Betreuer
                      </label>
                      <select
                        name="BETREUERID"
                        value={teamFormData.BETREUERID}
                        onChange={handleTeamFormChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      >
                        <option value="">Keinen Betreuer zuweisen</option>
                        {betreuer.map(b => (
                          <option key={b.BETREUERID} value={b.BETREUERID}>
                            {b.NAME}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowEditTeamModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleEditTeam}
                      disabled={!teamFormData.NAME}
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
      
      {/* Delete Team Modal */}
      <AnimatePresence>
        {showDeleteTeamModal && currentTeam && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowDeleteTeamModal(false)}
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
                    Team löschen
                  </h3>
                  <button 
                    onClick={() => setShowDeleteTeamModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Sind Sie sicher, dass Sie das Team <span className="font-semibold">{currentTeam.NAME}</span> löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      Das Löschen dieses Teams entfernt auch alle zugehörigen Ergebnisse aus der Datenbank.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowDeleteTeamModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleDeleteTeam}
                    >
                      <Trash2 size={18} className="mr-2" />
                      Team löschen
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Add Betreuer Modal */}
      <AnimatePresence>
        {showAddBetreuerModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowAddBetreuerModal(false)}
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
                    <UserPlus className="mr-2" size={18} />
                    Neuen Betreuer hinzufügen
                  </h3>
                  <button 
                    onClick={() => setShowAddBetreuerModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Name*
                      </label>
                      <input
                        type="text"
                        name="NAME"
                        value={betreuerFormData.NAME}
                        onChange={handleBetreuerFormChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="z.B. Max Mustermann"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Passwort*
                      </label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        name="PASSWORT"
                        value={betreuerFormData.PASSWORT}
                        onChange={handleBetreuerFormChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Passwort"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowAddBetreuerModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleAddBetreuer}
                      disabled={!betreuerFormData.NAME || !betreuerFormData.PASSWORT}
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
      
      {/* Edit Betreuer Modal */}
      <AnimatePresence>
        {showEditBetreuerModal && currentBetreuer && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowEditBetreuerModal(false)}
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
                    <UserCog className="mr-2" size={18} />
                    Betreuer bearbeiten
                  </h3>
                  <button 
                    onClick={() => setShowEditBetreuerModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Name*
                      </label>
                      <input
                        type="text"
                        name="NAME"
                        value={betreuerFormData.NAME}
                        onChange={handleBetreuerFormChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="z.B. Max Mustermann"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Passwort*
                      </label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        name="PASSWORT"
                        value={betreuerFormData.PASSWORT}
                        onChange={handleBetreuerFormChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="Passwort"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowEditBetreuerModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleEditBetreuer}
                      disabled={!betreuerFormData.NAME || !betreuerFormData.PASSWORT}
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
      
      {/* Delete Betreuer Modal */}
      <AnimatePresence>
        {showDeleteBetreuerModal && currentBetreuer && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowDeleteBetreuerModal(false)}
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
                    Betreuer löschen
                  </h3>
                  <button 
                    onClick={() => setShowDeleteBetreuerModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    Sind Sie sicher, dass Sie den Betreuer <span className="font-semibold">{currentBetreuer.NAME}</span> löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  
                  {betreuerHasTeams(currentBetreuer.BETREUERID) ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
                      <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                        Dieser Betreuer kann nicht gelöscht werden, da er Teams zugeordnet ist.
                      </p>
                      <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                        Bitte entfernen Sie zuerst die Teams oder weisen Sie ihnen einen anderen Betreuer zu.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        Dieser Betreuer hat keine zugeordneten Teams und kann sicher gelöscht werden.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowDeleteBetreuerModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center ${betreuerHasTeams(currentBetreuer.BETREUERID) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleDeleteBetreuer}
                      disabled={betreuerHasTeams(currentBetreuer.BETREUERID)}
                    >
                      <Trash2 size={18} className="mr-2" />
                      Betreuer löschen
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* CSS for Discord-inspired styles */}
      <style jsx>{`
        /* Animation für das Pulsieren von Badges und anderen Elementen */
        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.7; transform: scale(0.95); }
        }
        
        .pulse-badge {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </motion.div>
  );
};

export default TeilnehmerPage;