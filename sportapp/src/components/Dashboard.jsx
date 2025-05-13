import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  BarChart2, 
  ArrowUpRight, 
  Users, 
  Medal, 
  Activity, 
  Zap, 
  Download,
  ChevronRight, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [disziplinen, setDisziplinen] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stationen, setStationen] = useState([]);
  const [ergebnisse, setErgebnisse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load animations
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const API = import.meta.env.VITE_API_URL;

        const [disziplinenResponse, teamsResponse, stationenResponse, ergebnisseResponse] = await Promise.all([
          fetch(`${API}/disziplins`),
          fetch(`${API}/teams`),
          fetch(`${API}/stations`),
          fetch(`${API}/ergebnisse`)
        ]);
        
        
        // Process responses
        const disziplinenData = await disziplinenResponse.json();
        const teamsData = await teamsResponse.json();
        const stationenData = await stationenResponse.json();
        const ergebnisseData = await ergebnisseResponse.json();
        
        // Set data
        if (disziplinenData.success) setDisziplinen(disziplinenData.data || []);
        if (teamsData.success) setTeams(teamsData.data || []);
        if (stationenData.success) setStationen(stationenData.data || []);
        if (ergebnisseData.success) setErgebnisse(ergebnisseData.data || []);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Fehler beim Laden der Daten');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate stats from data
  const getStats = () => {
    return {
      participants: teams.length || 142,
      disciplineCount: disziplinen.length || 8,
      avgPoints: ergebnisse.length > 0 ? 
        (ergebnisse.reduce((acc, e) => acc + (parseFloat(e.PUNKTE || e.POINTSID) || 0), 0) / ergebnisse.length).toFixed(1) : 
        '72.4',
      medals: ergebnisse.filter(e => parseFloat(e.PUNKTE || e.POINTSID) > 80).length || 24
    };
  };
  
  const stats = getStats();
  
  // Generate chart data
  const chartData = [
    { day: 'Mo', value: 420 },
    { day: 'Di', value: 380 },
    { day: 'Mi', value: 510 },
    { day: 'Do', value: 350 },
    { day: 'Fr', value: 610 },
    { day: 'Sa', value: 580 },
    { day: 'So', value: 420 },
  ];
  
  const maxValue = Math.max(...chartData.map(item => item.value));

  // Generate team completion status
  const getTeamStationStatus = () => {
    // In real implementation, check which teams have been to which stations
    return [
      {
        teamName: 'Team Blau',
        completedCount: 3,
        totalCount: 5,
        stations: [
          { stationName: 'Station 1', completed: true },
          { stationName: 'Station 2', completed: true },
          { stationName: 'Station 3', completed: true },
          { stationName: 'Station 4', completed: false },
          { stationName: 'Station 5', completed: false }
        ]
      },
      {
        teamName: 'Team Rot',
        completedCount: 2,
        totalCount: 5,
        stations: [
          { stationName: 'Station 1', completed: true },
          { stationName: 'Station 2', completed: false },
          { stationName: 'Station 3', completed: true },
          { stationName: 'Station 4', completed: false },
          { stationName: 'Station 5', completed: false }
        ]
      },
      {
        teamName: 'Team Gelb',
        completedCount: 1,
        totalCount: 5,
        stations: [
          { stationName: 'Station 1', completed: true },
          { stationName: 'Station 2', completed: false },
          { stationName: 'Station 3', completed: false },
          { stationName: 'Station 4', completed: false },
          { stationName: 'Station 5', completed: false }
        ]
      }
    ];
  };
  
  const teamStationStatus = getTeamStationStatus();

  // Leaderboard data
  const leaders = [
    {
      id: 1,
      name: 'Max Schmidt',
      points: 248,
      team: 'Team Blau',
      change: 0
    },
    {
      id: 2,
      name: 'Jana Weber',
      points: 232,
      team: 'Team Rot',
      change: 2
    },
    {
      id: 3,
      name: 'Tim Müller',
      points: 225,
      team: 'Team Gelb',
      change: -1
    }
  ];

  // Upcoming activities
  const activities = [
    {
      time: '14:30',
      title: 'Staffellauf Finale',
      location: 'Station 3',
      participants: 12,
      color: 'bg-indigo-500'
    },
    {
      time: '15:45',
      title: 'Weitsprung',
      location: 'Station 5',
      participants: 24,
      color: 'bg-amber-500'
    },
    {
      time: '16:30',
      title: 'Siegerehrung',
      location: 'Hauptbühne',
      participants: 'Alle',
      color: 'bg-emerald-500'
    }
  ];

  // Animation classes
  const transitionClasses = 'transition-all duration-300 ease-in-out';

  return (
    <div className="p-4 md:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-purple-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      </div>
      
      {/* Header with title and actions */}
      <motion.div 
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${transitionClasses}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            Sportfest Dashboard
          </h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">
            {new Date().toLocaleDateString('de-DE', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })} • Sportanlage Musterhausen
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <RefreshCw size={18} />
          </button>
          
          <button 
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-500 dark:to-violet-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center group hover:scale-105 transition-all duration-200"
          >
            <Download className="mr-2 h-4 w-4" /> 
            Export Ergebnisse
          </button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-1 rounded-full shadow-sm border border-slate-200/60 dark:border-slate-700/60">
        {['overview', 'stations', 'teams', 'disziplinen'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all min-w-[100px] ${
              activeTab === tab 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400"></span>
            )}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-8 flex items-start">
          <AlertCircle className="text-red-500 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 dark:text-red-300 font-medium">Fehler beim Laden der Dashboard-Daten</h3>
            <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-700 dark:text-red-300 flex items-center hover:underline"
            >
              <RefreshCw size={14} className="mr-1" /> Neu laden
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">Dashboard-Daten werden geladen...</p>
        </div>
      )}
      
      {/* Main Content - Overview Tab */}
      {!loading && !error && activeTab === 'overview' && (
        <>
          {/* Stat Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[
              {
                title: 'Teilnehmende Teams',
                value: stats.participants,
                change: '+12.3%',
                icon: <Users className="w-6 h-6 text-indigo-500" />,
                trend: 'up',
                color: 'from-indigo-500 to-purple-500',
                link: '/participants'
              },
              {
                title: 'Anzahl Disziplinen',
                value: stats.disciplineCount,
                change: '+2',
                icon: <Activity className="w-6 h-6 text-emerald-500" />,
                trend: 'up',
                color: 'from-emerald-500 to-teal-500',
                link: '/disziplinen'
              },
              {
                title: 'Durchschnitt Punkte',
                value: stats.avgPoints,
                change: '+4.6%',
                icon: <PieChart className="w-6 h-6 text-blue-500" />,
                trend: 'up',
                color: 'from-blue-500 to-cyan-500',
                link: '/stats'
              },
              {
                title: 'Medaillen vergeben',
                value: stats.medals,
                change: '+8',
                icon: <Medal className="w-6 h-6 text-amber-500" />,
                trend: 'up',
                color: 'from-amber-500 to-orange-500',
                link: '/leaderboard'
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`relative bg-white/80 dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md hover:scale-105 shadow-sm hover:shadow-md ${transitionClasses}`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-8 h-1 bg-indigo-500"></div>
                <div className="absolute top-0 left-0 w-1 h-8 bg-indigo-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-1 bg-indigo-500"></div>
                <div className="absolute bottom-0 right-0 w-1 h-8 bg-indigo-500"></div>
                
                {/* Background gradient */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mt-8 -mr-8`}></div>
                
                <Link to={stat.link} className="block p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 shadow-inner">
                      {stat.icon}
                    </div>
                    
                    <span className={`inline-flex items-center text-xs font-medium rounded-full px-2.5 py-1 ${
                      stat.trend === 'up' 
                        ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' 
                        : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</h3>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </Link>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Team Rankings Section */}
            <div className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-md p-6 relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center mr-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <Medal size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                    Rangliste
                  </h3>
                </div>
                <Link to="/leaderboard" className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center hover:underline transition-all">
                  Vollständige Rangliste <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              {/* Team Rankings */}
              <div className="space-y-4">
                {teams.length === 0 ? (
                  <div className="flex items-center justify-center h-56 text-slate-500 dark:text-slate-400">
                    Keine Teams verfügbar
                  </div>
                ) : (
                  teams
                    .map(team => {
                      // Calculate total team points
                      const teamResults = ergebnisse.filter(e => e.TEAMID === team.TEAMID);
                      const totalPoints = teamResults.reduce((sum, result) => 
                        sum + parseFloat(result.PUNKTE || result.POINTSID || 0), 0);
                      
                      return {
                        ...team,
                        totalPoints,
                        resultCount: teamResults.length
                      };
                    })
                    .sort((a, b) => b.totalPoints - a.totalPoints)
                    .slice(0, 5) // Display top 5 teams
                    .map((team, index) => (
                      <div 
                        key={team.TEAMID} 
                        className="flex items-center p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm mr-4">
                          {index + 1}
                        </div>
                        
                        <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white text-lg">
                              {team.NAME || `Team ${team.TEAMID}`}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {team.resultCount} Disziplinen abgeschlossen
                            </p>
                          </div>
                          
                          <div className="mt-2 md:mt-0 flex items-center">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold text-xl px-4 py-1 rounded-lg">
                              {team.totalPoints} <span className="text-xs">Punkte</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-8">
              {/* Leaderboard */}
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-md p-6 relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3">
                      <Medal className="w-4 h-4 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bestenliste</h3>
                  </div>
                  <Link to="/leaderboard" className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center hover:underline transition-all">
                    Alle anzeigen <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {leaders.map((leader, index) => (
                    <div 
                      key={leader.id} 
                      className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer"
                    >
                      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-lg mr-3">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">{leader.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{leader.team}</p>
                      </div>
                      
                      <div className="font-semibold text-lg text-slate-900 dark:text-white">
                        {leader.points}
                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Discipline completion status */}
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-md p-6 relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 flex items-center justify-center mr-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                    <Activity size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Disziplinen-Fortschritt
                  </h3>
                </div>
                
                <div className="space-y-5">
                  {teams.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
                      Keine Teams verfügbar
                    </div>
                  ) : (
                    teams.slice(0, 5).map((team) => {
                      // Find disciplines this team has completed
                      const teamResults = ergebnisse.filter(e => e.TEAMID === team.TEAMID);
                      const uniqueDisciplinesCompleted = [...new Set(teamResults.map(r => r.DISZIPLINID))];
                      const totalDisciplines = disziplinen.length || 1; // Prevent division by zero
                      
                      return (
                        <div key={team.TEAMID} className="pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0 space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-slate-900 dark:text-white">
                              {team.NAME || `Team ${team.TEAMID}`}
                            </h4>
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                              {uniqueDisciplinesCompleted.length}/{totalDisciplines} Disziplinen
                            </span>
                          </div>
                          
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                            <div 
                              className="bg-emerald-500 h-2.5 rounded-full" 
                              style={{ 
                                width: `${Math.round((uniqueDisciplinesCompleted.length / totalDisciplines) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Placeholder for other tabs */}
      {!loading && !error && activeTab !== 'overview' && (
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl shadow-md p-8 text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Zap className="h-8 w-8 text-indigo-500" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}-Ansicht
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Diese Ansicht ist in der aktuellen Version noch in Entwicklung. 
            Bitte nutzen Sie vorerst die Übersichtsseite.
          </p>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Teilnehmerliste', path: '/participants', icon: <Users size={16} /> },
          { name: 'Punkte eintragen', path: '/score-entry', icon: <Zap size={16} /> },
          { name: 'Disziplinen', path: '/disziplinen', icon: <BarChart2 size={16} /> }
        ].map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <span className="font-medium text-slate-900 dark:text-white">{action.name}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
              {action.icon}
            </div>
          </Link>
        ))}
      </div>
      
      {/* CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        
        .scanner-line {
          animation: scan 3s linear infinite;
        }
        
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
