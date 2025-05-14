import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Map, User, X, AlertTriangle, CheckCircle, ChevronDown, Plus, Search } from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';
import { useMediaQuery } from '../utils/responsive';

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const BetreuerCreationForm = ({ 
  onSubmit, 
  onCancel,
  betreuer = null, // If provided, we are in edit mode
  isLoading = false
}) => {
  // Responsive design hooks
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Form state
  const [formData, setFormData] = useState({
    NAME: '',
    PASSWORT: '',
    ROLLE: 'stationaer', // Default to stationaer
  });
  
  const [disziplinenOptions, setDisziplinenOptions] = useState([]);
  const [selectedDisziplinen, setSelectedDisziplinen] = useState([]);
  const [disziplinenSearch, setDisziplinenSearch] = useState('');
  
  const [teamOptions, setTeamOptions] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teamsSearch, setTeamsSearch] = useState('');
  
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Initialize form with betreuer data if editing
  useEffect(() => {
    if (betreuer) {
      setFormData({
        BETREUERID: betreuer.BETREUERID,
        NAME: betreuer.NAME || '',
        PASSWORT: '', // Don't populate password for security
        ROLLE: betreuer.ROLLE || 'stationaer'
      });
      
      // Set selected disziplinen if available
      if (betreuer.disziplinen && Array.isArray(betreuer.disziplinen)) {
        setSelectedDisziplinen(betreuer.disziplinen.map(d => ({ 
          id: d.DISZIPLINID, 
          name: d.NAME 
        })));
      }
      
      // Set selected teams if available
      if (betreuer.teams && Array.isArray(betreuer.teams)) {
        setSelectedTeams(betreuer.teams.map(t => ({ 
          id: t.TEAMID, 
          name: t.NAME 
        })));
      }
    }
  }, [betreuer]);
  
  // Load disziplinen and team options
  useEffect(() => {
    fetchOptions();
  }, []);
  
  // Fetch disziplinen and team options from API
  const fetchOptions = async () => {
    try {
      setError(null);
      
      // Fetch disziplinen
      const disziplinenResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/disziplins`);
      
      if (!disziplinenResponse.ok) {
        throw new Error(`HTTP error when fetching disziplinen: ${disziplinenResponse.status}`);
      }
      
      const disziplinenResult = await disziplinenResponse.json();
      
      if (disziplinenResult.success) {
        setDisziplinenOptions(disziplinenResult.data.map(d => ({
          id: d.DISZIPLINID,
          name: d.NAME
        })));
      }
      
      // Fetch teams
      const teamsResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/teams`);
      
      if (!teamsResponse.ok) {
        throw new Error(`HTTP error when fetching teams: ${teamsResponse.status}`);
      }
      
      const teamsResult = await teamsResponse.json();
      
      if (teamsResult.success) {
        setTeamOptions(teamsResult.data.map(t => ({
          id: t.TEAMID,
          name: t.NAME
        })));
      }
    } catch (err) {
      console.error('Error fetching options:', err);
      setError(err.message);
    }
  };
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If role changes, reset the appropriate selections
    if (name === 'ROLLE') {
      triggerHapticFeedback('selection');
      if (value === 'stationaer') {
        setSelectedTeams([]);
      } else if (value === 'laufend') {
        setSelectedDisziplinen([]);
      }
    }
    
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      
      // Validate form
      if (!formData.NAME || formData.NAME.trim() === '') {
        throw new Error('Name is required');
      }
      
      // For new betreuer, password is required
      if (!betreuer && (!formData.PASSWORT || formData.PASSWORT.trim() === '')) {
        throw new Error('Password is required for new betreuer');
      }
      
      // Validate role-specific selections
      if (formData.ROLLE === 'stationaer' && selectedDisziplinen.length === 0) {
        throw new Error('Please select at least one Disziplin for a stationärer Betreuer');
      }
      
      if (formData.ROLLE === 'laufend' && selectedTeams.length === 0) {
        throw new Error('Please select at least one Team for a laufender Betreuer');
      }
      
      // Convert selected items to IDs
      const disziplinenIDs = selectedDisziplinen.map(d => d.id);
      const teamIDs = selectedTeams.map(t => t.id);
      
      // Call onSubmit with all data
      if (onSubmit) {
        triggerHapticFeedback('success');
        await onSubmit({
          ...formData,
          disziplinen: disziplinenIDs,
          teams: teamIDs
        });
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message);
      triggerHapticFeedback('error');
    }
  };
  
  // Handle selecting a disziplin
  const handleSelectDisziplin = (disziplin) => {
    // Check if already selected
    const isSelected = selectedDisziplinen.some(d => d.id === disziplin.id);
    
    if (isSelected) {
      // Remove if already selected
      setSelectedDisziplinen(prev => prev.filter(d => d.id !== disziplin.id));
    } else {
      // Add if not selected
      setSelectedDisziplinen(prev => [...prev, disziplin]);
      triggerHapticFeedback('selection');
    }
  };
  
  // Handle selecting a team
  const handleSelectTeam = (team) => {
    // Check if already selected
    const isSelected = selectedTeams.some(t => t.id === team.id);
    
    if (isSelected) {
      // Remove if already selected
      setSelectedTeams(prev => prev.filter(t => t.id !== team.id));
    } else {
      // Add if not selected
      setSelectedTeams(prev => [...prev, team]);
      triggerHapticFeedback('selection');
    }
  };
  
  // Filtered options based on search
  const filteredDisziplinen = disziplinenOptions.filter(d => 
    d.name.toLowerCase().includes(disziplinenSearch.toLowerCase())
  );
  
  const filteredTeams = teamOptions.filter(t => 
    t.name.toLowerCase().includes(teamsSearch.toLowerCase())
  );
  
  // Get role display text and icon
  const getRoleDisplay = (rolle) => {
    switch (rolle) {
      case 'stationaer':
        return {
          label: 'Stationärer Betreuer',
          icon: <MapPin size={18} className="text-blue-500" />,
          description: 'Verantwortlich für bestimmte Disziplinen',
          color: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
        };
      case 'laufend':
        return {
          label: 'Laufender Betreuer',
          icon: <Map size={18} className="text-green-500" />,
          description: 'Verantwortlich für bestimmte Teams',
          color: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
        };
      default:
        return {
          label: 'Unbekannter Typ',
          icon: <User size={18} className="text-gray-500" />,
          description: 'Typ nicht definiert',
          color: 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800'
        };
    }
  };
  
  const currentRoleDisplay = getRoleDisplay(formData.ROLLE);
  
  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden w-full max-w-2xl mx-auto"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {betreuer ? 'Betreuer bearbeiten' : 'Neuen Betreuer erstellen'}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {betreuer 
            ? 'Aktualisieren Sie die Daten und Zuweisungen des Betreuers' 
            : 'Erstellen Sie einen neuen Betreuer und weisen Sie Disziplinen oder Teams zu'}
        </p>
      </div>
      
      {/* Notification */}
      {notification && (
        <div className={`p-4 ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' 
              ? <CheckCircle className="h-5 w-5 mr-2" /> 
              : <AlertTriangle className="h-5 w-5 mr-2" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            Grundlegende Informationen
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                name="NAME"
                value={formData.NAME}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Passwort {betreuer && <span className="text-xs text-gray-500">(leer lassen, um unverändert zu bleiben)</span>}
              </label>
              <input
                type="password"
                name="PASSWORT"
                value={formData.PASSWORT}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required={!betreuer}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rolle
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {['stationaer', 'laufend'].map(rolle => {
                  const roleInfo = getRoleDisplay(rolle);
                  const isSelected = formData.ROLLE === rolle;
                  
                  return (
                    <label 
                      key={rolle}
                      className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? `${roleInfo.color} border-2` 
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ROLLE"
                        value={rolle}
                        checked={isSelected}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        {roleInfo.icon}
                      </div>
                      <div>
                        <p className="font-medium">{roleInfo.label}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{roleInfo.description}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Role-specific assignments section */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
            {formData.ROLLE === 'stationaer' 
              ? 'Disziplinen zuweisen' 
              : 'Teams zuweisen'}
          </h3>
          
          {formData.ROLLE === 'stationaer' ? (
            /* Disziplinen selection for stationaer */
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Disziplinen suchen..."
                  value={disziplinenSearch}
                  onChange={(e) => setDisziplinenSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedDisziplinen.map(disziplin => (
                  <div 
                    key={disziplin.id}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <span>{disziplin.name}</span>
                    <button 
                      type="button"
                      onClick={() => handleSelectDisziplin(disziplin)}
                      className="ml-1.5 p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/30"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {selectedDisziplinen.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Keine Disziplinen ausgewählt
                  </div>
                )}
              </div>
              
              <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg">
                {filteredDisziplinen.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredDisziplinen.map(disziplin => {
                      const isSelected = selectedDisziplinen.some(d => d.id === disziplin.id);
                      
                      return (
                        <div 
                          key={disziplin.id}
                          className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                            isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => handleSelectDisziplin(disziplin)}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                              isSelected 
                                ? 'bg-blue-500 text-white' 
                                : 'border border-gray-300 dark:border-gray-600'
                            }`}>
                              {isSelected && <CheckCircle size={14} />}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {disziplin.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Keine Disziplinen gefunden
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Teams selection for laufend */
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Teams suchen..."
                  value={teamsSearch}
                  onChange={(e) => setTeamsSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedTeams.map(team => (
                  <div 
                    key={team.id}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  >
                    <span>{team.name}</span>
                    <button 
                      type="button"
                      onClick={() => handleSelectTeam(team)}
                      className="ml-1.5 p-0.5 rounded-full hover:bg-green-200 dark:hover:bg-green-800/30"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {selectedTeams.length === 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Keine Teams ausgewählt
                  </div>
                )}
              </div>
              
              <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg">
                {filteredTeams.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTeams.map(team => {
                      const isSelected = selectedTeams.some(t => t.id === team.id);
                      
                      return (
                        <div 
                          key={team.id}
                          className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                            isSelected ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                          onClick={() => handleSelectTeam(team)}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                              isSelected 
                                ? 'bg-green-500 text-white' 
                                : 'border border-gray-300 dark:border-gray-600'
                            }`}>
                              {isSelected && <CheckCircle size={14} />}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {team.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Keine Teams gefunden
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              triggerHapticFeedback('light');
              if (onCancel) onCancel();
            }}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            disabled={isLoading}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="mr-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Verarbeitung...</span>
              </>
            ) : (
              <>
                <CheckCircle size={16} className="mr-2" />
                <span>{betreuer ? 'Aktualisieren' : 'Erstellen'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BetreuerCreationForm;
