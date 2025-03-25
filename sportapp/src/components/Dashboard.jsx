








// import React, { useState, useEffect } from 'react';
// import { PieChart, LineChart, ArrowUpRight, Users, Medal, Activity, Zap, ArrowRight } from 'lucide-react';

// const FuturisticDashboard = () => {
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   const stats = [
//     {
//       title: 'Teilnehmer',
//       value: '142',
//       change: '+12.3%',
//       icon: <Users className="w-6 h-6 text-indigo-500" />,
//       trend: 'up',
//       color: 'from-indigo-500 to-purple-500'
//     },
//     {
//       title: 'Stationen aktiv',
//       value: '8',
//       change: '+2',
//       icon: <Activity className="w-6 h-6 text-emerald-500" />,
//       trend: 'up',
//       color: 'from-emerald-500 to-teal-500'
//     },
//     {
//       title: 'Durchschnitt Punkte',
//       value: '72.4',
//       change: '+4.6%',
//       icon: <PieChart className="w-6 h-6 text-blue-500" />,
//       trend: 'up',
//       color: 'from-blue-500 to-cyan-500'
//     },
//     {
//       title: 'Medaillen vergeben',
//       value: '24',
//       change: '+8',
//       icon: <Medal className="w-6 h-6 text-amber-500" />,
//       trend: 'up',
//       color: 'from-amber-500 to-orange-500'
//     },
//   ];

//   // Beispiel-Daten für das Chart
//   const chartData = [
//     { day: 'Mo', value: 420 },
//     { day: 'Di', value: 380 },
//     { day: 'Mi', value: 510 },
//     { day: 'Do', value: 350 },
//     { day: 'Fr', value: 610 },
//     { day: 'Sa', value: 580 },
//     { day: 'So', value: 420 },
//   ];

//   const maxValue = Math.max(...chartData.map(item => item.value));

//   const activities = [
//     {
//       time: '14:30',
//       title: 'Staffellauf Finale',
//       location: 'Station 3',
//       participants: 12,
//       color: 'bg-indigo-500'
//     },
//     {
//       time: '15:45',
//       title: 'Weitsprung',
//       location: 'Station 5',
//       participants: 24,
//       color: 'bg-amber-500'
//     },
//     {
//       time: '16:30',
//       title: 'Siegerehrung',
//       location: 'Hauptbühne',
//       participants: 'Alle',
//       color: 'bg-emerald-500'
//     }
//   ];

//   const leaders = [
//     {
//       id: 1,
//       name: 'Max Schmidt',
//       points: 248,
//       team: 'Team Blau',
//       avatar: '/api/placeholder/40/40',
//       change: 0
//     },
//     {
//       id: 2,
//       name: 'Jana Weber',
//       points: 232,
//       team: 'Team Rot',
//       avatar: '/api/placeholder/40/40',
//       change: 2
//     },
//     {
//       id: 3,
//       name: 'Tim Müller',
//       points: 225,
//       team: 'Team Gelb',
//       avatar: '/api/placeholder/40/40',
//       change: -1
//     }
//   ];

//   const transitionClasses = "transition-all duration-300 ease-in-out";

//   return (
//     <div className="p-4 md:p-8 relative overflow-hidden">
//       {/* Background decorative elements */}
//       <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
//       <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-t from-purple-500/10 to-transparent rounded-full blur-3xl -z-10"></div>
      
//       {/* Header */}
//       <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${transitionClasses}`}>
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
//             Sportfest Dashboard
//           </h1>
//           <p className="text-slate-500 mt-1 dark:text-slate-400">24. März 2025 • Sportanlage Musterhausen</p>
//         </div>
        
//         <button 
//           className={`mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center group hover:scale-105 ${transitionClasses}`}
//         >
//           <ArrowUpRight className={`mr-2 h-4 w-4 group-hover:rotate-12 ${transitionClasses}`} /> 
//           Export Ergebnisse
//         </button>
//       </div>

//       {/* Stat Cards with Cyberpunk/Futuristic Style */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
//         {stats.map((stat, index) => (
//           <div
//             key={index}
//             className={`relative bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md hover:scale-105 ${transitionClasses} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//             style={{
//               transitionDelay: `${index * 100}ms`,
//               boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
//             }}
//           >
//             {/* Futuristic Scanner Line Animation */}
//             <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
//               <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent scanner-line"></div>
//             </div>
            
//             {/* Cyberpunk Corner Accents */}
//             <div className="absolute top-0 left-0 w-8 h-1 bg-indigo-500"></div>
//             <div className="absolute top-0 left-0 w-1 h-8 bg-indigo-500"></div>
//             <div className="absolute bottom-0 right-0 w-8 h-1 bg-indigo-500"></div>
//             <div className="absolute bottom-0 right-0 w-1 h-8 bg-indigo-500"></div>
            
//             {/* Background gradient decoration */}
//             <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mt-8 -mr-8`}></div>
            
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 shadow-inner">
//                   {stat.icon}
//                 </div>
                
//                 <span className={`inline-flex items-center text-xs font-medium rounded-full px-2.5 py-1 ${
//                   stat.trend === 'up' 
//                     ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' 
//                     : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
//                 }`}>
//                   {stat.change}
//                 </span>
//               </div>
              
//               <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</h3>
//               <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Main Content Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Chart Section - Futuristic Style */}
//         <div 
//           className={`lg:col-span-2 bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl p-6 relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md ${transitionClasses} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//           style={{
//             transitionDelay: '400ms',
//             boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
//           }}
//         >
//           {/* Futuristic Scanner Line Animation */}
//           <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
//             <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent scanner-line-reverse"></div>
//           </div>
          
//           {/* Cyberpunk Corner Accents */}
//           <div className="absolute top-0 left-0 w-16 h-1 bg-blue-500"></div>
//           <div className="absolute top-0 left-0 w-1 h-16 bg-blue-500"></div>
          
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
//             <span className="mr-2 inline-block w-2 h-6 bg-blue-500"></span>
//             Gesamtpunkte pro Tag
//           </h3>
          
//           {/* Futuristic Chart */}
//           <div className="h-64 w-full">
//             <div className="flex items-end justify-between h-56 pr-4 mt-4 pb-1 border-b border-slate-200 dark:border-slate-700">
//               {chartData.map((item, index) => (
//                 <div key={index} className="relative flex flex-col items-center flex-1">
//                   <div 
//                     className="relative w-full max-w-[30px] rounded-t-lg overflow-hidden group"
//                     style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '10%' }}
//                   >
//                     {/* Glowing Neon Bar */}
//                     <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 to-violet-500 glow-sm"></div>
//                     <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-transparent via-white to-transparent cyberpunk-scan"></div>
                    
//                     {/* Hover tooltip */}
//                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                       <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
//                         {item.value} Punkte
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.day}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Leaderboard & Activities - Futuristic Style */}
//         <div className="space-y-8">
//           {/* Leaderboard */}
//           <div 
//             className={`bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl p-6 relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md ${transitionClasses} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//             style={{
//               transitionDelay: '500ms',
//               boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
//             }}
//           >
//             {/* Futuristic Scanner Line Animation */}
//             <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
//               <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent scanner-line-slow"></div>
//             </div>
            
//             {/* Cyberpunk Corner Accents */}
//             <div className="absolute top-0 right-0 w-16 h-1 bg-amber-500"></div>
//             <div className="absolute top-0 right-0 w-1 h-16 bg-amber-500"></div>
            
//             <div className="flex items-center justify-between mb-6">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3">
//                   <Medal className="w-4 h-4 text-amber-500" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bestenliste</h3>
//               </div>
//               <button className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center hover:underline transition-all">
//                 Alle anzeigen <ArrowRight className="w-4 h-4 ml-1" />
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               {leaders.map((leader, index) => (
//                 <div 
//                   key={leader.id} 
//                   className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer"
//                 >
//                   <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-lg mr-3">
//                     {index + 1}
//                   </div>
                  
//                   <div className="h-10 w-10 relative rounded-full overflow-hidden mr-3 ring-2 ring-white dark:ring-slate-700 shadow-lg">
//                     <img 
//                       src={leader.avatar} 
//                       alt={leader.name} 
//                       className="h-full w-full object-cover"
//                     />
//                     {leader.change !== 0 && (
//                       <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
//                         leader.change > 0 ? 'bg-emerald-500' : 'bg-red-500'
//                       }`}>
//                         {leader.change > 0 ? '+' : ''}
//                         {leader.change}
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="flex-1">
//                     <h4 className="font-medium text-slate-900 dark:text-white">{leader.name}</h4>
//                     <p className="text-sm text-slate-500 dark:text-slate-400">{leader.team}</p>
//                   </div>
                  
//                   <div className="font-semibold text-lg text-slate-900 dark:text-white flex items-baseline">
//                     {leader.points}
//                     <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">pts</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
          
//           {/* Activities - Futuristic Timeline */}
//           <div 
//             className={`bg-white dark:bg-slate-800/80 rounded-2xl shadow-xl p-6 relative overflow-hidden border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md ${transitionClasses} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
//             style={{
//               transitionDelay: '600ms',
//               boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
//             }}
//           >
//             {/* Futuristic Scanner Line Animation */}
//             <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
//               <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent scanner-line-reverse"></div>
//             </div>
            
//             {/* Cyberpunk Corner Accents */}
//             <div className="absolute bottom-0 left-0 w-16 h-1 bg-emerald-500"></div>
//             <div className="absolute bottom-0 left-0 w-1 h-16 bg-emerald-500"></div>
            
//             <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center">
//               <span className="mr-2 inline-block w-2 h-6 bg-emerald-500"></span>
//               Nächste Aktivitäten
//             </h3>
            
//             <div className="space-y-5">
//               {activities.map((activity, index) => (
//                 <div key={index} className="flex items-center group">
//                   <div className="relative mr-4">
//                     <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg ${activity.color} hover:scale-110 ${transitionClasses} glow-sm`}>
//                       <span className="font-medium">{activity.time}</span>
//                     </div>
//                     {index < activities.length - 1 && (
//                       <div className="absolute top-full left-1/2 w-0.5 h-5 -translate-x-1/2 bg-slate-200 dark:bg-slate-700"></div>
//                     )}
//                   </div>
                  
//                   <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 group-hover:bg-slate-100 dark:group-hover:bg-slate-700/50 transition-colors duration-200">
//                     <h4 className="font-medium text-slate-900 dark:text-white">{activity.title}</h4>
//                     <div className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400">
//                       <span>{activity.location}</span>
//                       <span className="inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600 mx-2"></span>
//                       <span>{activity.participants} Teilnehmer</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Quick Actions - Futuristic Buttons */}
//       <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
//         {['Teilnehmerliste', 'Punkte eintragen', 'Rangliste anzeigen'].map((action, index) => (
//           <button
//             key={index}
//             className={`p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1 ${transitionClasses} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} glow-sm`}
//             style={{ transitionDelay: `${600 + (index * 100)}ms` }}
//           >
//             <span className="font-medium text-slate-900 dark:text-white">{action}</span>
//             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
//               <Zap className="w-4 h-4" />
//             </div>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FuturisticDashboard;
















import React, { useState, useEffect, useRef } from 'react';
import { 
  PieChart, 
  LineChart, 
  BarChart2, 
  ArrowUpRight, 
  Users, 
  Medal, 
  Activity, 
  Zap, 
  Download, 
  RefreshCw, 
  ChevronRight, 
  Filter,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  Crown,
  Menu,
  X,
  Clock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import boy_userIMG from '../assets/boy_user.svg';
import girl_userIMG from '../assets/girl_user.svg';
import boy2_userIMG from '../assets/boy_user2.svg';

const ArtisticDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [chartType, setChartType] = useState('daily');
  const [is3dMode, setIs3dMode] = useState(true);
  const [showOverview, setShowOverview] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Reference for artwork effects
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  
  // Artistic color palette with harmonious colors
  const colors = {
    // Primary palette
    primary: '#3f51b5',    // Indigo
    secondary: '#795548',  // Brown
    accent: '#f1c40f',     // Artistic gold
    
    // Soft palette for artwork
    soft: {
      blue: '#5b9bd5',
      pink: '#e191bf',
      green: '#71b16a',
      orange: '#ec9e52',
      purple: '#9b6bb3',
      teal: '#4cbbb8',
    },
    
    // Artwork gradients
    gradients: {
      gold: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      azure: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      sunset: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
      morning: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      leaf: 'linear-gradient(135deg, #9be15d 0%, #00e3ae 100%)',
      lavender: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    },
    
    // UI Color themes
    light: {
      bg: '#f9fafc',
      surface: '#ffffff',
      border: '#eeeeee',
      borderAccent: '#e5e9f0',
      text: '#2e3440',
      textSecondary: '#5e6472',
      shadow: '0 4px 20px rgba(0,0,0,0.05)',
      shadowHover: '0 8px 30px rgba(0,0,0,0.1)',
    },
    dark: {
      bg: '#222831',
      surface: '#2d333f',
      border: '#373e4c',
      borderAccent: '#3b4252',
      text: '#eceff4',
      textSecondary: '#c8cdd9',
      shadow: '0 4px 20px rgba(0,0,0,0.2)',
      shadowHover: '0 8px 30px rgba(0,0,0,0.25)',
    },
    
    // Chart colors with high visibility in both modes
    charts: {
      bar: ['#6a7feb', '#5d8bf4', '#4e9df7', '#4ad5f8', '#41e8f8'],
      line: '#5f85db',
      point: '#f1c40f',
      grid: 'rgba(180,180,180,0.1)'
    },
    
    // Category colors with specific meaning
    categories: {
      participants: '#5b9bd5',
      stations: '#71b16a',
      points: '#ec9e52',
      medals: '#e191bf'
    }
  };

  // Detect current theme from DOM
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');
    
    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setCurrentTheme(isDark ? 'dark' : 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Current theme colors
  const t = colors[currentTheme];

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => {
      // Simulate a data loading animation
      document.querySelectorAll('.data-loader').forEach((el) => {
        el.classList.remove('data-loader');
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const stats = [
    {
      title: 'Teilnehmer',
      value: '142',
      change: '+12.3%',
      icon: <Users size={22} />,
      trend: 'up',
      color: colors.categories.participants,
      description: 'Aktive Teilnehmer, die am Sportfest registriert sind'
    },
    {
      title: 'Stationen aktiv',
      value: '8',
      change: '+2',
      icon: <Activity size={22} />,
      trend: 'up',
      color: colors.categories.stations,
      description: 'Laufende Sportstationen in diesem Moment'
    },
    {
      title: 'Durchschnitt Punkte',
      value: '72.4',
      change: '+4.6%',
      icon: <PieChart size={22} />,
      trend: 'up',
      color: colors.categories.points,
      description: 'Durchschnittliche Punkte pro Teilnehmer'
    },
    {
      title: 'Medaillen vergeben',
      value: '24',
      change: '+8',
      icon: <Medal size={22} />,
      trend: 'up',
      color: colors.categories.medals,
      description: 'Insgesamt vergebene Auszeichnungen'
    },
  ];

  // Sample chart data
  const dailyChartData = [
    { day: 'Mo', value: 420 },
    { day: 'Di', value: 380 },
    { day: 'Mi', value: 510 },
    { day: 'Do', value: 350 },
    { day: 'Fr', value: 610 },
    { day: 'Sa', value: 580 },
    { day: 'So', value: 420 },
  ];

  const weeklyChartData = [
    { day: 'W1', value: 1200 },
    { day: 'W2', value: 1400 },
    { day: 'W3', value: 1100 },
    { day: 'W4', value: 1600 },
  ];

  const monthlyChartData = [
    { day: 'Jan', value: 4200 },
    { day: 'Feb', value: 3800 },
    { day: 'Mär', value: 5100 },
    { day: 'Apr', value: 3500 },
    { day: 'Mai', value: 6100 },
    { day: 'Jun', value: 5800 },
  ];

  const chartData = chartType === 'daily' ? dailyChartData : 
                   chartType === 'weekly' ? weeklyChartData : monthlyChartData;

  const maxValue = Math.max(...chartData.map(item => item.value));

  const activities = [
    {
      time: '14:30',
      title: 'Staffellauf Finale',
      location: 'Station 3',
      participants: 12,
      color: colors.categories.participants
    },
    {
      time: '15:45',
      title: 'Weitsprung',
      location: 'Station 5',
      participants: 24,
      color: colors.categories.medals
    },
    {
      time: '16:30',
      title: 'Siegerehrung',
      location: 'Hauptbühne',
      participants: 'Alle',
      color: colors.categories.stations
    }
  ];

  const leaders = [
    {
      id: 1,
      name: 'Max Schmidt',
      points: 248,
      team: 'Team Blau',
      avatar: boy_userIMG,
      change: 0,
      color: colors.soft.blue
    },
    {
      id: 2,
      name: 'Jana Weber',
      points: 232,
      team: 'Team Rot',
      avatar: girl_userIMG,
      change: 2,
      color: colors.soft.pink
    },
    {
      id: 3,
      name: 'Tim Müller',
      points: 225,
      team: 'Team Gelb',
      avatar: boy2_userIMG,
      change: -1,
      color: colors.soft.orange
    }
  ];

  // Artistic transform for hover and interaction effects
  const getArtisticTransform = (factor = 1, elementIndex = 0) => {
    if (!is3dMode) return {};
    
    // Calculate rotation based on mouse position
    const rotateX = (mousePosition.y - 0.5) * 4 * factor;
    const rotateY = (mousePosition.x - 0.5) * -4 * factor;
    
    // Add subtle float effect unique to each element
    const floatOffset = Math.sin(Date.now() / 2000 + elementIndex) * 2;
    
    return {
      transform: `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${floatOffset}px)`,
      transition: 'transform 0.3s ease-out',
    };
  };
  
  // Helper to generate wave path for curved sections
  const generateWavePath = (width, height, amplitude = 20, frequency = 0.05) => {
    let path = `M0,${height} `;
    
    // Generate a smooth wave
    for (let x = 0; x <= width; x += 10) {
      const y = height - amplitude * Math.sin(x * frequency);
      path += `L${x},${y} `;
    }
    
    path += `L${width},${height} Z`;
    return path;
  };

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen overflow-hidden"
      style={{ 
        background: t.bg,
        color: t.text,
        padding: '24px'
      }}
    >
      {/* Artistic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Artistic Color Flow - Organic shapes with gradient flows */}
        <div 
          className="absolute top-0 right-0 w-full h-full opacity-[0.035]"
          style={{ 
            background: 'radial-gradient(circle at 80% 20%, rgba(91, 155, 213, 0.8) 0%, rgba(91, 155, 213, 0.01) 60%)'
          }}
        ></div>
        
        <div 
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.025]"
          style={{ 
            background: 'radial-gradient(circle, rgba(241, 196, 15, 0.6) 0%, rgba(241, 196, 15, 0.01) 70%)'
          }}
        ></div>
        
        {/* Abstract Artistic Patterns */}
        <svg className="absolute top-1/4 right-1/4 w-96 h-96 opacity-[0.02]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke={colors.accent} strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke={colors.accent} strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke={colors.accent} strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke={colors.accent} strokeWidth="0.3" />
          <line x1="50" y1="0" x2="50" y2="100" stroke={colors.accent} strokeWidth="0.3" />
        </svg>
        
        <svg className="absolute bottom-1/5 left-1/3 w-96 h-96 opacity-[0.015]" viewBox="0 0 100 100">
          <path d="M10,50 L30,30 L50,50 L70,30 L90,50" fill="none" stroke={colors.primary} strokeWidth="0.5" />
          <path d="M10,60 L30,40 L50,60 L70,40 L90,60" fill="none" stroke={colors.primary} strokeWidth="0.5" />
          <path d="M10,70 L30,50 L50,70 L70,50 L90,70" fill="none" stroke={colors.primary} strokeWidth="0.5" />
        </svg>
        
        {/* Golden Ratio Spiral - Fine Art Element */}
        <svg className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] opacity-[0.02]" viewBox="0 0 100 100">
          <path 
            d="M98,98 C98,55.4 64.6,22 22,22 C22,41.8 38.2,58 58,58 C58,47.6 49.4,39 39,39 C39,44.6 43.4,49 49,49 C49,45.5 46.5,43 43,43 C43,44.7 44.3,46 46,46" 
            fill="none" 
            stroke={colors.accent} 
            strokeWidth="0.3"
          />
        </svg>
        
        {/* Fine Art Grid System */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ 
            backgroundImage: `
              linear-gradient(to right, ${t.borderAccent} 1px, transparent 1px),
              linear-gradient(to bottom, ${t.borderAccent} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0'
          }}
        ></div>
        
        {/* Flowing Dots for Movement */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full opacity-[0.1]"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                background: i % 3 === 0 ? colors.soft.green : i % 3 === 1 ? colors.soft.blue : colors.soft.orange,
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                transform: `translateY(${Math.sin(Date.now() / 1000 + i) * 10}px)`,
                transition: 'transform 2s ease-in-out',
                animation: `float ${Math.random() * 10 + 20}s infinite ease-in-out`
              }}
            ></div>
          ))}
        </div>
        
        {/* Dynamic Line Art following mouse */}
        <svg 
          className="absolute inset-0 h-full w-full opacity-[0.07] pointer-events-none"
          style={{ overflow: 'visible' }}
        >
          <line 
            x1={mousePos.x} 
            y1="0" 
            x2={mousePos.x} 
            y2="100%" 
            stroke={colors.primary} 
            strokeWidth="1" 
            strokeDasharray="4 12"
            style={{ transition: 'all 1s ease-out' }}
          />
          <line 
            x1="0" 
            y1={mousePos.y} 
            x2="100%" 
            y2={mousePos.y} 
            stroke={colors.primary} 
            strokeWidth="1"
            strokeDasharray="4 12"
            style={{ transition: 'all 1s ease-out' }}
          />
        </svg>
      </div>

      {/* Page Content with Artistic Layout */}
      <div className={`relative transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header Section - Artistic Design */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center mb-6 md:mb-0">
            {/* Header Art Element */}
            <div className="relative mr-4">
              <div 
                className="absolute top-0 left-0 w-10 h-10 rounded-full opacity-10"
                style={{ background: colors.gradients.gold }}
              ></div>
              <div 
                className="relative w-12 h-12 flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${t.surface}, ${t.bg})`,
                  borderRadius: '12px',
                  boxShadow: t.shadow
                }}
              >
                <div className="relative">
                  <Zap size={22} color={colors.primary} />
                  <div 
                    className="absolute -top-1 -right-1 h-2 w-2 rounded-full"
                    style={{ background: colors.accent }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div>
              <h1 
                className="text-2xl font-light tracking-wide relative"
                style={{ color: t.text }}
              >
                <span className="font-normal">Sport</span>fest 
                <span 
                  className="absolute -top-2 -right-10 text-xs py-0.5 px-2 rounded-full"
                  style={{ 
                    background: colors.gradients.morning,
                    color: '#2e3440',
                    fontSize: '10px',
                    letterSpacing: '0.5px'
                  }}
                >
                  2025
                </span>
              </h1>
              <div className="flex items-center mt-1">
                <Clock size={14} style={{ color: t.textSecondary, marginRight: '6px' }} />
                <p 
                  className="text-sm tracking-wide"
                  style={{ color: t.textSecondary }}
                >
                  24. März • ATIW Event
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {/* Artistic Action Buttons */}
            <button 
              className="flex items-center justify-center w-10 h-10 transition-all hover:scale-105"
              style={{ 
                background: t.surface,
                borderRadius: '10px',
                boxShadow: t.shadow,
                color: t.textSecondary
              }}
            >
              <RefreshCw size={16} />
            </button>
            
            <button 
              className="flex items-center gap-2 px-4 py-2 transition-all hover:scale-105"
              style={{ 
                background: t.surface,
                borderRadius: '10px',
                boxShadow: t.shadow,
                color: colors.primary
              }}
            >
              <Download size={16} />
              <span className="text-sm tracking-wide">Export</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Artistic Curved Design */}
        <div className="relative mb-10 overflow-hidden">
          <div className="overflow-x-auto hide-scrollbar">
            <div 
              className="flex p-1.5 rounded-full"
              style={{ 
                background: t.surface,
                boxShadow: t.shadow,
                border: `1px solid ${t.border}`,
                width: 'fit-content'
              }}
            >
              {['overview', 'stations', 'participants', 'schedule'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative px-5 py-2 text-sm tracking-wide transition-all rounded-full"
                  style={{ 
                    background: activeTab === tab ? colors.primary : 'transparent',
                    color: activeTab === tab ? '#ffffff' : t.textSecondary,
                    fontWeight: activeTab === tab ? 400 : 300,
                    minWidth: '100px',
                    textAlign: 'center'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  
                  {/* Artistic Circle Accent */}
                  {activeTab === tab && (
                    <>
                      <div 
                        className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" 
                        style={{ background: colors.accent }}
                      ></div>
                      <div 
                        className="absolute -bottom-0.5 -left-0.5 h-1.5 w-1.5 rounded-full" 
                        style={{ background: 'rgba(255,255,255,0.5)' }}
                      ></div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Artistic accent lines */}
          <div 
            className="absolute left-0 bottom-0 h-px w-1/3"
            style={{ 
              background: `linear-gradient(to right, ${colors.accent}, transparent)`,
              opacity: 0.2
            }}
          ></div>
          <div 
            className="absolute right-0 bottom-0 h-px w-1/5"
            style={{ 
              background: `linear-gradient(to left, ${colors.soft.purple}, transparent)`,
              opacity: 0.2 
            }}
          ></div>
        </div>
        
        {/* Content Area with Artistic Layout */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards Section - Artistic Curved Cards */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      ...getArtisticTransform(hoveredCard === index ? 1.5 : 0.8, index),
                      background: t.surface,
                      borderRadius: '16px',
                      boxShadow: hoveredCard === index ? t.shadowHover : t.shadow,
                      transition: 'all 0.3s ease',
                    }}
                    className="relative overflow-hidden group"
                  >
                    {/* Artistic background accents */}
                    <div 
                      className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] -mt-8 -mr-8 group-hover:opacity-[0.1] transition-opacity"
                      style={{ background: stat.color }}
                    ></div>
                    
                    {/* Artistic accent line */}
                    <div 
                      className="absolute left-0 top-0 h-full w-1"
                      style={{ 
                        background: `linear-gradient(to bottom, ${stat.color}, transparent)`,
                        opacity: 0.5,
                        borderRadius: '4px 0 0 4px' 
                      }}
                    ></div>
                    
                    {/* Card content */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          className="flex items-center justify-center h-10 w-10 rounded-xl"
                          style={{ 
                            background: `${stat.color}15`,
                            color: stat.color
                          }}
                        >
                          {stat.icon}
                        </div>
                        
                        <span 
                          className="text-xs font-light px-2.5 py-1 rounded-lg"
                          style={{ 
                            color: stat.trend === 'up' ? '#10b981' : '#ef4444',
                            background: stat.trend === 'up' ? '#10b98110' : '#ef444410',
                          }}
                        >
                          {stat.change}
                        </span>
                      </div>
                      
                      <h3 
                        className="text-sm tracking-wide mb-1"
                        style={{ color: t.textSecondary }}
                      >
                        {stat.title}
                      </h3>
                      
                      {/* Value with artistic loading animation */}
                      <p 
                        className="text-3xl font-light data-loader"
                        style={{ color: t.text }}
                      >
                        <span 
                          className="inline-block h-10 w-24 rounded-lg animate-pulse"
                          style={{ background: t.border }}
                        ></span>
                      </p>
                      
                      <p 
                        className="text-3xl font-light hidden"
                        style={{ color: t.text }}
                      >
                        {stat.value}
                        
                        {/* Artistic decorative element */}
                        <span 
                          className="inline-block w-1.5 h-1.5 rounded-full ml-2 align-middle"
                          style={{ background: stat.color, opacity: 0.5 }}
                        ></span>
                      </p>
                      
                      {/* Expanded info with artistic transition */}
                      <div 
                        className="mt-3 text-xs overflow-hidden transition-all duration-500 ease-out"
                        style={{ 
                          color: t.textSecondary,
                          maxHeight: hoveredCard === index ? '40px' : '0px',
                          opacity: hoveredCard === index ? 1 : 0,
                          transform: `translateY(${hoveredCard === index ? '0' : '10px'})`,
                        }}
                      >
                        {stat.description}
                        
                        {/* Art accent */}
                        <div 
                          className="w-10 h-px mt-2 opacity-30"
                          style={{ background: stat.color }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid - Artistic Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Chart Section - Artistic Canvas */}
                <div 
                  style={{
                    ...getArtisticTransform(0.3, 0),
                    background: t.surface,
                    borderRadius: '16px',
                    boxShadow: t.shadow,
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="lg:col-span-2"
                >
                  {/* Artistic background accents */}
                  <div 
                    className="absolute top-full left-0 w-full h-48 -mt-6 opacity-[0.02]"
                    style={{ 
                      background: 'radial-gradient(ellipse at center, rgba(91, 155, 213, 0.5) 0%, rgba(91, 155, 213, 0.01) 70%)'
                    }}
                  ></div>
                  
                  <div 
                    className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-[0.03]"
                    style={{ background: colors.soft.teal }}
                  ></div>
                  
                  {/* Chart Header */}
                  <div 
                    className="p-5 border-b relative"
                    style={{ borderColor: t.border }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 flex items-center justify-center mr-3 rounded-xl"
                          style={{ 
                            background: `${colors.primary}15`,
                            color: colors.primary
                          }}
                        >
                          <BarChart2 size={18} />
                        </div>
                        <h3 
                          className="text-lg font-light tracking-wide"
                          style={{ color: t.text }}
                        >
                          Punkteverlauf
                        </h3>
                      </div>
                      
                      {/* Chart Controls with Artistic Design */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex rounded-full p-1"
                          style={{ 
                            background: t.bg,
                            border: `1px solid ${t.borderAccent}`
                          }}
                        >
                          {['daily', 'weekly', 'monthly'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setChartType(type)}
                              className="relative px-3 py-1 text-xs rounded-full transition-all"
                              style={{ 
                                background: chartType === type ? t.surface : 'transparent',
                                color: chartType === type ? colors.primary : t.textSecondary,
                                fontWeight: chartType === type ? 400 : 300,
                                boxShadow: chartType === type ? t.shadow : 'none'
                              }}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                              
                              {/* Decorative accent */}
                              {chartType === type && (
                                <span
                                  className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full"
                                  style={{ background: colors.accent }}
                                ></span>
                              )}
                            </button>
                          ))}
                        </div>
                        
                        <button 
                          className="p-1 rounded-full transition-all hover:scale-110"
                          style={{ 
                            color: t.textSecondary,
                            background: t.bg
                          }}
                        >
                          <Filter size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Artistic line accent */}
                    <div 
                      className="absolute bottom-0 left-14 w-20 h-px"
                      style={{ 
                        background: `linear-gradient(to right, ${colors.accent}, transparent)`,
                        opacity: 0.4
                      }}
                    ></div>
                  </div>
                  
                  {/* Chart Visualization - Artistic Style */}
                  <div className="p-5 pt-7">
                    <div className="h-72 w-full">
                      {/* Chart grid lines - artistic dashed style */}
                      <div 
                        className="h-64 w-full mb-2 relative"
                        style={{ 
                          backgroundImage: `
                            linear-gradient(to right, ${colors.charts.grid} 1px, transparent 1px),
                            linear-gradient(to bottom, ${colors.charts.grid} 1px, transparent 1px)
                          `,
                          backgroundSize: `${100 / chartData.length}% 25%`,
                          borderRadius: '8px'
                        }}
                      >
                        {/* Y-axis markers */}
                        <div 
                          className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs"
                          style={{ color: t.textSecondary }}
                        >
                          {[4, 3, 2, 1, 0].map(num => (
                            <div key={num} className="flex items-center">
                              <span>{maxValue * num / 4}</span>
                              <div 
                                className="ml-2 h-px w-2"
                                style={{ background: t.textSecondary, opacity: 0.5 }}
                              ></div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Rendering bars with artistic styling */}
                        <div className="flex items-end justify-between h-full pr-2 pt-2 pb-1">
                          {chartData.map((item, index) => (
                            <div key={index} className="relative flex flex-col items-center flex-1 group">
                              {/* Artistic loading placeholder */}
                              <div 
                                className="relative w-full max-w-[30px] mx-auto rounded-2xl overflow-hidden data-loader"
                                style={{ 
                                  height: '60%', 
                                  background: t.border,
                                  opacity: 0.7,
                                  animation: 'pulse 1.5s infinite ease-in-out'
                                }}
                              ></div>
                              
                              {/* Actual chart bar - with gradient and artistic effects */}
                              <div 
                                className="relative w-full max-w-[30px] mx-auto rounded-2xl overflow-hidden hidden group-hover:scale-105 transition-transform"
                                style={{ 
                                  height: `${(item.value / maxValue) * 100}%`, 
                                  minHeight: '8%',
                                  background: `linear-gradient(to top, ${colors.charts.bar[index % colors.charts.bar.length]}, ${colors.charts.bar[index % colors.charts.bar.length]}cc)`,
                                }}
                              >
                                {/* Light reflection effect */}
                                <div 
                                  className="absolute inset-0 opacity-30"
                                  style={{ 
                                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)' 
                                  }}
                                ></div>
                                
                                {/* Top glow */}
                                <div 
                                  className="absolute top-0 left-0 right-0 h-1 opacity-60"
                                  style={{ background: 'rgba(255,255,255,0.5)' }}
                                ></div>
                                
                                {/* Artistic tooltip on hover */}
                                <div 
                                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-xs"
                                  style={{ 
                                    background: t.surface,
                                    color: t.text,
                                    boxShadow: t.shadowHover,
                                    border: `1px solid ${t.borderAccent}`,
                                    transform: 'translateY(0px) scale(0.95)',
                                    transformOrigin: 'bottom',
                                  }}
                                >
                                  <strong>{item.value}</strong> Punkte
                                  
                                  {/* Artistic arrow */}
                                  <div 
                                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                                    style={{ 
                                      background: t.surface,
                                      borderRight: `1px solid ${t.borderAccent}`,
                                      borderBottom: `1px solid ${t.borderAccent}`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Day label */}
                              <div 
                                className="mt-3 text-xs font-light tracking-wide"
                                style={{ color: t.textSecondary }}
                              >
                                {item.day}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Panel - Stats and Activities */}
                <div className="space-y-6">
                  {/* Leaderboard - Artistic Design */}
                  <div 
                    style={{
                      ...getArtisticTransform(0.3, 1),
                      background: t.surface,
                      borderRadius: '16px',
                      boxShadow: t.shadow,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Artistic background accents */}
                    <div 
                      className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-[0.03]"
                      style={{ background: colors.categories.medals }}
                    ></div>
                    
                    <div 
                      className="absolute top-1/3 left-0 w-full h-px"
                      style={{ 
                        background: `linear-gradient(to right, ${colors.accent}00, ${colors.accent}20, ${colors.accent}00)` 
                      }}
                    ></div>
                    
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 flex items-center justify-center mr-3 rounded-xl"
                            style={{ 
                              background: `${colors.categories.medals}15`,
                              color: colors.categories.medals
                            }}
                          >
                            <Crown size={18} />
                          </div>
                          <h3 
                            className="text-lg font-light tracking-wide"
                            style={{ color: t.text }}
                          >
                            Bestenliste
                          </h3>
                        </div>
                        
                        <button
                          className="flex items-center text-xs tracking-wide hover:underline"
                          style={{ color: colors.primary }}
                        >
                          Alle <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {leaders.map((leader, index) => (
                          <div 
                            key={leader.id} 
                            className="relative flex items-center p-3 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02]"
                            style={{ 
                              background: t.bg,
                              boxShadow: 'none',
                              border: `1px solid ${t.borderAccent}`,
                            }}
                          >
                            {/* Accent curved line */}
                            <div
                              className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                              style={{ background: leader.color, opacity: 0.6 }}
                            ></div>
                            
                            {/* Leader position - artistic design */}
                            <div 
                              className="w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm"
                              style={{ 
                                background: index === 0 ? colors.gradients.gold : 
                                          index === 1 ? 'linear-gradient(135deg, #e0e0e0, #b8b8b8)' : 
                                          'linear-gradient(135deg, #cd7f32, #b36a24)',
                                color: index === 0 ? '#000' : '#fff',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                fontWeight: 500
                              }}
                            >
                              {index + 1}
                            </div>
                            
                            {/* Avatar with artistic frame */}
                            <div className="relative h-10 w-10 mr-3">
                              <div 
                                className="absolute inset-0 rounded-lg overflow-hidden border-2"
                                style={{ borderColor: leader.color }}
                              >
                                <img 
                                  src={leader.avatar} 
                                  alt={leader.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              
                              {/* Change indicator - artistic badge */}
                              {leader.change !== 0 && (
                                <div 
                                  className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[8px] font-medium"
                                  style={{ 
                                    background: leader.change > 0 ? '#10b981' : '#ef4444',
                                    color: 'white',
                                    boxShadow: '0 0 0 2px white'
                                  }}
                                >
                                  {leader.change > 0 ? '+' : ''}
                                  {leader.change}
                                </div>
                              )}
                            </div>
                            
                            {/* User info */}
                            <div className="flex-1">
                              <h4 
                                className="text-sm font-medium"
                                style={{ color: t.text }}
                              >
                                {leader.name}
                              </h4>
                              <p 
                                className="text-xs tracking-wide"
                                style={{ color: t.textSecondary }}
                              >
                                {leader.team}
                              </p>
                            </div>
                            
                            {/* Points display - artistic design */}
                            <div 
                              className="text-lg font-light flex items-baseline"
                              style={{ color: t.text }}
                            >
                              {leader.points}
                              <span 
                                className="text-xs ml-1"
                                style={{ color: t.textSecondary }}
                              >
                                pts
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Activities Timeline - Artistic Design */}
                  <div 
                    style={{
                      ...getArtisticTransform(0.3, 2),
                      background: t.surface,
                      borderRadius: '16px',
                      boxShadow: t.shadow,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Artistic decorative elements */}
                    <div 
                      className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-[0.025]"
                      style={{ background: colors.categories.stations }}
                    ></div>
                    
                    <svg className="absolute right-0 bottom-0 h-20 w-20 opacity-[0.03]" viewBox="0 0 100 100">
                      <circle cx="70" cy="70" r="30" fill="none" stroke={colors.categories.stations} strokeWidth="1" />
                      <circle cx="70" cy="70" r="15" fill="none" stroke={colors.categories.stations} strokeWidth="1" />
                    </svg>
                    
                    <div className="p-5">
                      <div className="flex items-center mb-5">
                        <div 
                          className="w-8 h-8 flex items-center justify-center mr-3 rounded-xl"
                          style={{ 
                            background: `${colors.categories.stations}15`,
                            color: colors.categories.stations
                          }}
                        >
                          <Activity size={18} />
                        </div>
                        <h3 
                          className="text-lg font-light tracking-wide"
                          style={{ color: t.text }}
                        >
                          Nächste Aktivitäten
                        </h3>
                      </div>
                      
                      <div className="space-y-5 relative">
                        {/* Vertical timeline line */}
                        <div 
                          className="absolute left-6 top-4 bottom-4 w-px"
                          style={{ 
                            background: `linear-gradient(to bottom, ${t.borderAccent}, ${t.borderAccent}50)` 
                          }}
                        ></div>
                        
                        {activities.map((activity, index) => (
                          <div key={index} className="flex group">
                            {/* Time display - artistic design */}
                            <div className="relative mr-5 flex-shrink-0">
                              <div 
                                className="w-12 h-12 flex items-center justify-center rounded-full text-sm font-medium z-10 relative group-hover:scale-105 transition-transform"
                                style={{ 
                                  background: t.bg,
                                  color: activity.color,
                                  border: `2px solid ${activity.color}`,
                                  boxShadow: t.shadow
                                }}
                              >
                                {activity.time}
                              </div>
                              
                              {/* Connection dot */}
                              <div 
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full z-20"
                                style={{ background: activity.color }}
                              ></div>
                            </div>
                            
                            {/* Activity details */}
                            <div 
                              className="flex-1 p-3 rounded-xl transition-all duration-300 group-hover:scale-[1.01] relative"
                              style={{ 
                                background: t.bg,
                                border: `1px solid ${t.borderAccent}`,
                                borderLeft: `3px solid ${activity.color}`,
                              }}
                            >
                              {/* Decorative corner accents */}
                              <div 
                                className="absolute top-0 right-0 w-3 h-3"
                                style={{ 
                                  borderTop: `2px solid ${activity.color}`, 
                                  borderRight: `2px solid ${activity.color}`,
                                  opacity: 0.3,
                                  borderRadius: '0 4px 0 0'
                                }}
                              ></div>
                              <div 
                                className="absolute bottom-0 left-0 w-3 h-3"
                                style={{ 
                                  borderBottom: `2px solid ${activity.color}`, 
                                  borderLeft: `2px solid ${activity.color}`,
                                  opacity: 0.3,
                                  borderRadius: '0 0 0 4px'
                                }}
                              ></div>
                              
                              <h4 
                                className="text-sm font-medium"
                                style={{ color: t.text }}
                              >
                                {activity.title}
                              </h4>
                              <div 
                                className="mt-1 flex items-center text-xs tracking-wide"
                                style={{ color: t.textSecondary }}
                              >
                                <span>{activity.location}</span>
                                <div 
                                  className="mx-2 w-1 h-1 rounded-full"
                                  style={{ background: t.textSecondary, opacity: 0.5 }}
                                ></div>
                                <span>{activity.participants} Teilnehmer</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions - Artistic Gradient Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Teilnehmerliste', 
                    icon: <Users size={18} />, 
                    color: colors.categories.participants,
                    gradient: colors.gradients.morning
                  },
                  {
                    title: 'Punkte eintragen', 
                    icon: <Medal size={18} />, 
                    color: colors.categories.points,
                    gradient: colors.gradients.lavender
                  },
                  {
                    title: 'Rangliste anzeigen', 
                    icon: <ArrowUpRight size={18} />, 
                    color: colors.categories.stations,
                    gradient: colors.gradients.leaf
                  }
                ].map((action, index) => (
                  <button
                    key={index}
                    style={{
                      ...getArtisticTransform(0.5, index + 3),
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '16px',
                      boxShadow: t.shadow
                    }}
                    className="p-4 h-20 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
                  >
                    {/* Gradient background with artistic overlay */}
                    <div 
                      className="absolute inset-0 opacity-90"
                      style={{ background: action.gradient }}
                    ></div>
                    
                    {/* Artistic pattern overlay */}
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{ 
                        backgroundImage: `radial-gradient(circle at 30% 50%, black 1px, transparent 1px)`,
                        backgroundSize: '15px 15px'
                      }}
                    ></div>
                    
                    {/* Light reflection effect */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1/2 opacity-20 group-hover:opacity-30 transition-opacity"
                      style={{ 
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)' 
                      }}
                    ></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center justify-between">
                      <span 
                        className="text-base font-medium tracking-wide"
                        style={{ color: '#2e3440' }}
                      >
                        {action.title}
                      </span>
                      <div 
                        className="w-10 h-10 flex items-center justify-center rounded-xl"
                        style={{ 
                          background: 'rgba(255,255,255,0.25)',
                          backdropFilter: 'blur(5px)',
                          color: '#2e3440'
                        }}
                      >
                        {action.icon}
                      </div>
                    </div>
                    
                    {/* Artistic corner accent */}
                    <div 
                      className="absolute bottom-2 left-2 w-3 h-3"
                      style={{ 
                        background: 'rgba(255,255,255,0.3)',
                        borderRadius: '50%'
                      }}
                    ></div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {activeTab !== 'overview' && (
            <div 
              style={{ 
                background: t.surface,
                borderRadius: '16px',
                boxShadow: t.shadow,
                position: 'relative',
                overflow: 'hidden'
              }}
              className="py-16 px-10 text-center"
            >
              {/* Artistic empty state */}
              <div className="relative inline-block mb-6">
                <div 
                  className="w-16 h-16 mx-auto rounded-full opacity-10"
                  style={{ background: colors.primary }}
                ></div>
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
                  style={{ background: colors.accent, opacity: 0.1 }}
                ></div>
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-px"
                  style={{ background: colors.accent, opacity: 0.3 }}
                ></div>
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-px"
                  style={{ background: colors.accent, opacity: 0.3 }}
                ></div>
              </div>
              
              <h3 
                className="text-xl font-light tracking-wide mb-3"
                style={{ color: t.text }}
              >
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
              <p 
                className="text-sm tracking-wide max-w-md mx-auto"
                style={{ color: t.textSecondary }}
              >
                Dieser Bereich ist in der Demo noch nicht implementiert. Die künstlerische Gestaltung wird in nächsten Versionen verfügbar sein.
              </p>
              
              {/* Artistic accent line */}
              <div 
                className="h-px w-24 mx-auto mt-6"
                style={{ 
                  background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)`,
                  opacity: 0.3
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ArtisticDashboard;