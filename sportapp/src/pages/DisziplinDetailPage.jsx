import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Medal, 
  Users, 
  User, 
  Award, 
  ChevronDown, 
  BarChart2, 
  ListFilter,
  Loader2,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  initial: { opacity: 0, scale: 0.96, y: 10 },
  animate: (index) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, delay: index * 0.05 }
  }),
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

const DisziplinDetailPage = () => {
  const { id } = useParams();
  const [disziplin, setDisziplin] = useState(null);
  const [teamErgebnisse, setTeamErgebnisse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('teams'); // 'teams' or 'individuals'
  const [sortBy, setSortBy] = useState('points'); // 'points', 'name'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch discipline details and results in parallel
        const [disziplinResponse, ergebnisseResponse, teamsResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/disziplins/${id}`),
          fetch(`http://localhost:3001/api/ergebnisse/disziplin/${id}`),
          fetch('http://localhost:3001/api/teams')
        ]);
        
        // Check for errors
        if (!disziplinResponse.ok || !ergebnisseResponse.ok || !teamsResponse.ok) {
          throw new Error('Ein oder mehrere API-Anfragen fehlgeschlagen');
        }
        
        // Parse the responses
        const disziplinResult = await disziplinResponse.json();
        const ergebnisseResult = await ergebnisseResponse.json();
        const teamsResult = await teamsResponse.json();
        
        if (disziplinResult.success && ergebnisseResult.success && teamsResult.success) {
          // Set discipline data
          if (disziplinResult.data && disziplinResult.data.length > 0) {
            setDisziplin(disziplinResult.data[0]);
          } else {
            throw new Error('Disziplin nicht gefunden');
          }
          
          // Process results with team data
          if (ergebnisseResult.data && teamsResult.data) {
            const teamMap = {};
            teamsResult.data.forEach(team => {
              teamMap[team.TEAMID] = team;
            });
            
            // Combine ergebnisse with team data
            const enhancedErgebnisse = ergebnisseResult.data.map(ergebnis => {
              const team = teamMap[ergebnis.TEAMID] || { NAME: `Team ${ergebnis.TEAMID}` };
              return {
                ...ergebnis,
                teamName: team.NAME,
                team: team
              };
            });
            
            setTeamErgebnisse(enhancedErgebnisse);
          }
          
          setError(null);
        } else {
          throw new Error('Fehler beim Laden der Daten');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Sort and filter the results
  const sortedResults = [...teamErgebnisse].sort((a, b) => {
    if (sortBy === 'points') {
      // Use POINTSID for sorting since that's the field in the database
      const aValue = parseFloat(a.POINTSID || 0);
      const bValue = parseFloat(b.POINTSID || 0);
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    } else if (sortBy === 'name') {
      return sortOrder === 'desc' 
        ? b.teamName.localeCompare(a.teamName)
        : a.teamName.localeCompare(b.teamName);
    }
    return 0;
  });

  // Top 3 performers
  const topPerformers = sortedResults.slice(0, 3);

  // Calculate statistics
  const calculateStatistics = () => {
    if (teamErgebnisse.length === 0) return { avg: 0, max: 0, min: 0, count: 0 };
    
    const points = teamErgebnisse.map(e => parseFloat(e.POINTSID || 0));
    const sum = points.reduce((acc, val) => acc + val, 0);
    const max = Math.max(...points);
    const min = Math.min(...points);
    const avg = sum / points.length;
    
    return {
      avg: avg.toFixed(1),
      max,
      min,
      count: teamErgebnisse.length
    };
  };
  
  const stats = calculateStatistics();

  // Toggle sort
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc'); // Default to descending when changing sort field
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="p-6 max-w-7xl mx-auto"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-slate-500 dark:text-slate-400">Daten werden geladen...</span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="p-6 max-w-7xl mx-auto"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 dark:text-red-300 font-medium">Fehler beim Laden</h3>
              <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
              <Link 
                to="/disziplinen"
                className="mt-3 inline-flex items-center text-red-700 dark:text-red-400 hover:text-red-600"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Zurück zur Übersicht
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="p-6 max-w-7xl mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header with discipline info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Link 
            to="/disziplinen"
            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
              {disziplin?.NAME || 'Disziplin'}
              <span className="ml-2 text-xs py-0.5 px-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                ID: {disziplin?.DISZIPLINID}
              </span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {disziplin?.BESCHREIBUNG || `Kategorie: ${disziplin?.KATEGORIE || 'Allgemein'}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </button>
          
          <button 
            className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors"
            onClick={() => alert('Export Funktion würde hier starten')}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportieren
          </button>
        </div>
      </div>
      
      {/* Stats and Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Teams</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{stats.count}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mr-3">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Durchschnitt</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{stats.avg} Punkte</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-3">
            <Medal className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Bestes Ergebnis</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white">{stats.max} Punkte</p>
          </div>
        </div>
        
        {/* View Controls */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-slate-500 dark:text-slate-400">Ansicht</label>
            <button 
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Aktualisieren
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              className={`flex-1 py-1 px-3 text-sm rounded ${
                viewMode === 'teams' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              onClick={() => setViewMode('teams')}
            >
              Teams
            </button>
            <button
              className={`flex-1 py-1 px-3 text-sm rounded ${
                viewMode === 'individuals' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              onClick={() => setViewMode('individuals')}
            >
              Einzeln
            </button>
          </div>
        </div>
      </div>
      
      {/* Top Performers */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <Medal className="mr-2 h-5 w-5 text-amber-500" />
          Top Platzierungen
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPerformers.map((result, index) => (
            <motion.div
              key={result.ERGEBNISID}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden"
              variants={itemVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              custom={index}
              style={{ position: 'relative' }}
            >
              {/* Position indicator */}
              <div 
                className={`absolute top-0 left-0 w-16 h-16 flex items-center justify-center text-white font-bold text-2xl transform rotate-45 translate-x-[-20px] translate-y-[-20px] ${
                  index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'
                }`}
              >
                <span className="transform -rotate-45 translate-y-6 translate-x-5">{index + 1}</span>
              </div>
              
              <div className="p-4 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{result.teamName}</h3>
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    {result.POINTSID} Punkte
                  </span>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700/30 rounded p-2 text-xs text-slate-600 dark:text-slate-300">
                  {result.DATUM ? (
                    <p>Datum: {new Date(result.DATUM).toLocaleDateString()}</p>
                  ) : (
                    <p>Team ID: {result.TEAMID}</p>
                  )}
                  {result.KOMMENTAR && (
                    <p className="mt-1 line-clamp-2">{result.KOMMENTAR}</p>
                  )}
                </div>
              </div>
              
              {/* Position ribbon */}
              <div className="h-1.5 w-full" style={{ 
                background: index === 0 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 
                              index === 1 ? 'linear-gradient(90deg, #9ca3af, #d1d5db)' : 
                              'linear-gradient(90deg, #b45309, #d97706)'
              }}></div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Results Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-0">
            {viewMode === 'teams' ? 'Team Ergebnisse' : 'Individuelle Ergebnisse'}
          </h2>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                className="appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 py-1.5 pl-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <option value="points-desc">Punkte (Höchste zuerst)</option>
                <option value="points-asc">Punkte (Niedrigste zuerst)</option>
                <option value="name-desc">Team (Z-A)</option>
                <option value="name-asc">Team (A-Z)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" size={14} />
            </div>
            
            <button
              className="p-1.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-slate-600 dark:text-slate-300 flex items-center"
              onClick={resetFilters}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
        
        {/* Table or grid view depending on viewMode */}
        {viewMode === 'teams' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center">
                      Team
                      {sortBy === 'name' && (
                        <ChevronDown 
                          size={14}
                          className={`ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Disziplin
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSort('points')}
                  >
                    <div className="flex items-center">
                      Punkte
                      {sortBy === 'points' && (
                        <ChevronDown 
                          size={14}
                          className={`ml-1 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} 
                        />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Datum
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Aktionen</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
                {filteredErgebnisse.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                      Keine Ergebnisse gefunden
                    </td>
                  </tr>
                ) : (
                  filteredErgebnisse.map((result, index) => (
                    <tr 
                      key={result.ERGEBNISID}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-white">
                        {result.teamName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {result.disziplinName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          index < 3 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 
                                  'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {result.POINTSID} Punkte
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                        {result.DATUM ? new Date(result.DATUM).toLocaleDateString() : 'Kein Datum'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"
                          onClick={() => openEditModal(result)}
                        >
                          Bearbeiten
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredErgebnisse.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 dark:text-slate-400 py-8">
                Keine Ergebnisse gefunden
              </div>
            ) : (
              filteredErgebnisse.map((result, index) => (
                <div 
                  key={result.ERGEBNISID}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-700/30"
                >
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mr-3">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-white">{result.teamName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{result.disziplinName}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      index < 3 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' : 
                               'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {result.POINTSID} Punkte
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {result.DATUM ? new Date(result.DATUM).toLocaleDateString() : 'Kein Datum'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const openEditModal = (result) => {
  // This would typically open an edit modal
  console.log('Edit result:', result);
  alert(`Bearbeiten von Ergebnis ${result.ERGEBNISID} würde hier einen Dialog öffnen`);
};

const resetFilters = () => {
  // This would reset all filters
  console.log('Reset filters');
  window.location.reload();
};

export default DisziplinDetailPage;
