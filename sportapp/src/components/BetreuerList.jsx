import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Map, User, Search, AlertTriangle, Edit, Trash2, Plus, X, ChevronDown, MoreVertical } from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';
import { useMediaQuery } from '../utils/responsive';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * BetreuerList component displays a list of betreuer with their roles and assignments
 */
const BetreuerList = ({ 
  betreuer = [],
  isLoading = false, 
  error = null,
  onAddNew,
  onEdit,
  onDelete
}) => {
  // Responsive hooks
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle role filter change
  const handleRoleFilterChange = (role) => {
    triggerHapticFeedback('selection');
    setRoleFilter(role);
  };
  
  // Toggle card expansion
  const toggleCardExpansion = (id) => {
    triggerHapticFeedback('light');
    setExpandedCard(expandedCard === id ? null : id);
  };
  
  // Filter betreuer list based on search and role filter
  const filteredBetreuer = betreuer.filter(b => {
    const matchesSearch = !searchTerm || 
      b.NAME.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || 
      (roleFilter === 'stationaer' && b.ROLLE === 'stationaer') || 
      (roleFilter === 'laufend' && b.ROLLE === 'laufend');
    
    return matchesSearch && matchesRole;
  });
  
  // Get role display data
  const getRoleDisplay = (rolle) => {
    switch (rolle) {
      case 'stationaer':
        return {
          label: 'Stationärer Betreuer',
          shortLabel: 'Stationär',
          icon: <MapPin size={16} className="text-blue-500" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300'
        };
      case 'laufend':
        return {
          label: 'Laufender Betreuer',
          shortLabel: 'Laufend',
          icon: <Map size={16} className="text-green-500" />,
          color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300'
        };
      default:
        return {
          label: 'Unbekannter Typ',
          shortLabel: 'Unbekannt',
          icon: <User size={16} className="text-gray-500" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300'
        };
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="space-y-3 md:space-y-0 md:flex md:justify-between md:items-center">
        {/* Search */}
        <div className="relative w-full md:w-64 lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Betreuer suchen..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        {/* Role filter */}
        <div className="flex space-x-2">
          {['all', 'stationaer', 'laufend'].map((role) => {
            const isActive = roleFilter === role;
            let label, bgColor;
            
            switch (role) {
              case 'stationaer':
                label = isMobile ? 'Stationär' : 'Stationäre';
                bgColor = isActive ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
                break;
              case 'laufend':
                label = 'Laufende';
                bgColor = isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
                break;
              default:
                label = 'Alle';
                bgColor = isActive ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
            }
            
            return (
              <button
                key={role}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${bgColor} transition-colors`}
                onClick={() => handleRoleFilterChange(role)}
              >
                {label}
              </button>
            );
          })}
          
          {onAddNew && (
            <button
              className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 transition-colors"
              onClick={() => {
                triggerHapticFeedback('success');
                onAddNew();
              }}
            >
              <Plus size={16} className="mr-1" />
              <span>Neu</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 flex items-center">
          <AlertTriangle size={20} className="flex-shrink-0 mr-3" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && !error && filteredBetreuer.length === 0 && (
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-gray-400 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Keine Betreuer gefunden</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || roleFilter !== 'all' 
              ? 'Versuchen Sie andere Suchparameter oder Filter'
              : 'Fügen Sie einen neuen Betreuer hinzu, um loszulegen'}
          </p>
          {onAddNew && (
            <button
              className="mt-6 inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              onClick={() => {
                triggerHapticFeedback('success');
                onAddNew();
              }}
            >
              <Plus size={18} className="mr-2" />
              Betreuer hinzufügen
            </button>
          )}
        </div>
      )}
      
      {/* Betreuer list */}
      {!isLoading && !error && filteredBetreuer.length > 0 && (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredBetreuer.map((betreuer) => {
            const roleDisplay = getRoleDisplay(betreuer.ROLLE);
            const isExpanded = expandedCard === betreuer.BETREUERID;
            
            // Get assignments count
            const disziplinenCount = betreuer.disziplinen?.length || 0;
            const teamsCount = betreuer.teams?.length || 0;
            
            return (
              <motion.div
                key={betreuer.BETREUERID}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                variants={itemVariants}
              >
                {/* Basic info */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl font-bold w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 flex items-center justify-center">
                        {betreuer.NAME.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {betreuer.NAME}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleDisplay.color}`}>
                            {roleDisplay.icon}
                            <span className="ml-1">{isMobile ? roleDisplay.shortLabel : roleDisplay.label}</span>
                          </span>
                          
                          {/* Assignment counts */}
                          {betreuer.ROLLE === 'stationaer' && disziplinenCount > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {disziplinenCount} {disziplinenCount === 1 ? 'Disziplin' : 'Disziplinen'}
                            </span>
                          )}
                          
                          {betreuer.ROLLE === 'laufend' && teamsCount > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {teamsCount} {teamsCount === 1 ? 'Team' : 'Teams'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Action buttons for larger screens */}
                      {!isMobile && (
                        <>
                          {onEdit && (
                            <button
                              onClick={() => {
                                triggerHapticFeedback('light');
                                onEdit(betreuer);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                              aria-label="Edit betreuer"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          
                          {onDelete && (
                            <button
                              onClick={() => {
                                triggerHapticFeedback('warning');
                                onDelete(betreuer);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                              aria-label="Delete betreuer"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </>
                      )}
                      
                      {/* More menu for mobile */}
                      {isMobile && (onEdit || onDelete) && (
                        <div className="relative">
                          <button
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                            aria-label="More options"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      )}
                      
                      {/* Expand/collapse button */}
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        onClick={() => toggleCardExpansion(betreuer.BETREUERID)}
                      >
                        <ChevronDown 
                          size={20} 
                          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {betreuer.ROLLE === 'stationaer' ? 'Zugewiesene Disziplinen' : 'Zugewiesene Teams'}
                    </h4>
                    
                    {/* Display assignments */}
                    {betreuer.ROLLE === 'stationaer' && (
                      <div className="flex flex-wrap gap-2">
                        {disziplinenCount > 0 ? (
                          betreuer.disziplinen.map(disziplin => (
                            <span 
                              key={disziplin.DISZIPLINID}
                              className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs dark:bg-blue-900/30 dark:text-blue-300"
                            >
                              {disziplin.NAME}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Keine Disziplinen zugewiesen
                          </span>
                        )}
                      </div>
                    )}
                    
                    {betreuer.ROLLE === 'laufend' && (
                      <div className="flex flex-wrap gap-2">
                        {teamsCount > 0 ? (
                          betreuer.teams.map(team => (
                            <span 
                              key={team.TEAMID}
                              className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs dark:bg-green-900/30 dark:text-green-300"
                            >
                              <span 
                                className="w-2 h-2 rounded-full mr-1.5"
                                style={{ backgroundColor: team.FARBE || '#10B981' }}
                              />
                              {team.NAME}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                            Keine Teams zugewiesen
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default BetreuerList;
