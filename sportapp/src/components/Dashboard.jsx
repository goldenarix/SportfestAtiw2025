








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
import { PieChart, LineChart, ArrowUpRight, Users, Medal, Activity, Zap, ArrowRight, ChevronRight, ChevronLeft, Menu, X, Filter, Download, BarChart3, RefreshCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const UltraModernDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [chartType, setChartType] = useState('daily');
  const [is3dMode, setIs3dMode] = useState(true);
  const [showOverview, setShowOverview] = useState(true);

  // Reference for 3D effect
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();

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
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      trend: 'up',
      color: 'from-indigo-500 to-purple-500',
      description: 'Aktive Teilnehmer, die am Sportfest registriert sind'
    },
    {
      title: 'Stationen aktiv',
      value: '8',
      change: '+2',
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
      trend: 'up',
      color: 'from-emerald-500 to-teal-500',
      description: 'Laufende Sportstationen in diesem Moment'
    },
    {
      title: 'Durchschnitt Punkte',
      value: '72.4',
      change: '+4.6%',
      icon: <PieChart className="w-6 h-6 text-blue-500" />,
      trend: 'up',
      color: 'from-blue-500 to-cyan-500',
      description: 'Durchschnittliche Punkte pro Teilnehmer'
    },
    {
      title: 'Medaillen vergeben',
      value: '24',
      change: '+8',
      icon: <Medal className="w-6 h-6 text-amber-500" />,
      trend: 'up',
      color: 'from-amber-500 to-orange-500',
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

  const leaders = [
    {
      id: 1,
      name: 'Max Schmidt',
      points: 248,
      team: 'Team Blau',
      avatar: '/api/placeholder/40/40',
      change: 0
    },
    {
      id: 2,
      name: 'Jana Weber',
      points: 232,
      team: 'Team Rot',
      avatar: '/api/placeholder/40/40',
      change: 2
    },
    {
      id: 3,
      name: 'Tim Müller',
      points: 225,
      team: 'Team Gelb',
      avatar: '/api/placeholder/40/40',
      change: -1
    }
  ];

  // Generate 3D transform based on mouse position
  const get3DTransform = (factor = 1) => {
    if (!is3dMode) return {};
    
    const rotateX = (mousePosition.y - 0.5) * 5 * factor;
    const rotateY = (mousePosition.x - 0.5) * -5 * factor;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s',
    };
  };

  return (
    <div ref={containerRef} className="p-4 md:p-8 relative overflow-hidden bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Interactive Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[80px] animate-blob animation-delay-2000 opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/5 to-cyan-500/10 blur-[80px] animate-blob animation-delay-4000 opacity-70"></div>
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-500/5 to-rose-500/10 blur-[80px] animate-blob opacity-70"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-5"></div>
        
        {/* Holographic scan lines */}
        <div className="absolute inset-0">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent holographic-scanner"></div>
        </div>
      </div>

      {/* Page Content */}
      <div className={`relative z-10 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 inline-flex items-center">
              <span className="relative mr-2">
                <span className="absolute -left-2 -top-2 h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
                <span className="absolute -left-2 -top-2 h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Sportfest Dashboard
              <span className="ml-2 text-xs text-white bg-indigo-600 px-2 py-0.5 rounded-full">LIVE</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 flex items-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 pulse"></span>
              24. März 2025 • ATIW Sport Fest
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            
            {/* Export Button */}
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Exportieren
            </button>
            
            {/* Refresh Button */}
            <button 
              className="flex items-center justify-center w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center mb-8 overflow-x-auto hide-scrollbar">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm">
            {['overview', 'stations', 'participants', 'schedule'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-lg transition-all
                  ${activeTab === tab 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/30'}
                `}
              >
                {activeTab === tab && (
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg"></span>
                )}
                <span className="relative">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Content Area */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards Section */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      ...get3DTransform(hoveredCard === index ? 1.5 : 0.7),
                      transition: 'all 0.3s ease',
                    }}
                    className={`
                      relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50
                      ${hoveredCard === index ? 'scale-105 z-10' : ''}
                      transform-gpu hover:shadow-xl transition-all duration-300
                    `}
                  >
                    <div className="absolute inset-0 bg-white dark:bg-slate-800 opacity-90 backdrop-blur-sm"></div>
                    
                    {/* Decorative elements */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mt-10 -mr-10`}></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-grid-pattern opacity-10"></div>
                    
                    {/* Card content */}
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`
                          w-12 h-12 flex items-center justify-center rounded-xl
                          bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800
                          shadow-inner
                        `}>
                          {stat.icon}
                        </div>
                        
                        <span className={`
                          inline-flex items-center text-xs font-medium rounded-full px-2.5 py-1
                          ${stat.trend === 'up' 
                            ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' 
                            : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'}
                        `}>
                          {stat.change}
                        </span>
                      </div>
                      
                      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</h3>
                      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white data-loader">
                        <span className="inline-block w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></span>
                      </p>
                      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white hidden">
                        {stat.value}
                      </p>
                      
                      {/* Expanded info on hover */}
                      <div className={`
                        mt-3 text-xs text-slate-500 dark:text-slate-400
                        transition-all duration-300 ease-in-out
                        ${hoveredCard === index ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}
                      `}>
                        {stat.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div 
                  style={get3DTransform(0.3)}
                  className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transform-gpu"
                >
                  <div className="absolute inset-0 bg-white dark:bg-slate-800 opacity-90"></div>
                  
                  {/* Chart Header */}
                  <div className="relative p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5 text-indigo-500" />
                        Gesamtpunkte Verlauf
                      </h3>
                      
                      {/* Chart Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                          {['daily', 'weekly', 'monthly'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setChartType(type)}
                              className={`
                                px-3 py-1 text-xs font-medium rounded-md transition-all
                                ${chartType === type 
                                  ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm' 
                                  : 'text-slate-600 dark:text-slate-300'}
                              `}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                        
                        <button className="p-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                          <Filter className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="relative p-6">
                    <div className="h-64 w-full">
                      <div className="flex items-end justify-between h-56 pr-4 mt-4 pb-1 border-b border-slate-200 dark:border-slate-700">
                        {chartData.map((item, index) => (
                          <div key={index} className="relative flex flex-col items-center flex-1 group">
                            <div 
                              className="relative w-full max-w-[30px] rounded-t-lg overflow-hidden data-loader"
                              style={{ height: '60%' }}
                            >
                              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                            </div>
                            <div 
                              className="relative w-full max-w-[30px] rounded-t-lg overflow-hidden hidden"
                              style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '10%' }}
                            >
                              {/* 3D Bar with gradient and lighting effect */}
                              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500 to-violet-500"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                              <div className="absolute inset-y-0 left-0 w-1/3 bg-black/10 dark:bg-white/10"></div>
                              
                              {/* Tooltip on hover */}
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.value} Punkte
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.day}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Side Panel - Stats and Activities */}
                <div className="space-y-6">
                  {/* Leaderboard */}
                  <div 
                    style={get3DTransform(0.3)}
                    className="relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transform-gpu"
                  >
                    <div className="absolute inset-0 bg-white dark:bg-slate-800 opacity-90"></div>
                    
                    <div className="relative p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mr-3">
                            <Medal className="w-4 h-4 text-amber-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Bestenliste</h3>
                        </div>
                        <button className="text-indigo-600 dark:text-indigo-400 text-sm flex items-center hover:underline">
                          Alle <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        {leaders.map((leader, index) => (
                          <div 
                            key={leader.id} 
                            className="flex items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all duration-200 cursor-pointer"
                          >
                            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-lg mr-3">
                              {index + 1}
                            </div>
                            
                            <div className="h-10 w-10 relative rounded-full overflow-hidden mr-3 ring-2 ring-white dark:ring-slate-700 shadow-lg">
                              <img 
                                src={leader.avatar} 
                                alt={leader.name} 
                                className="h-full w-full object-cover"
                              />
                              {leader.change !== 0 && (
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                                  leader.change > 0 ? 'bg-emerald-500' : 'bg-red-500'
                                }`}>
                                  {leader.change > 0 ? '+' : ''}
                                  {leader.change}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-white">{leader.name}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{leader.team}</p>
                            </div>
                            
                            <div className="font-semibold text-lg text-slate-900 dark:text-white flex items-baseline">
                              {leader.points}
                              <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">pts</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Activities Timeline */}
                  <div 
                    style={get3DTransform(0.3)}
                    className="relative overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transform-gpu"
                  >
                    <div className="absolute inset-0 bg-white dark:bg-slate-800 opacity-90"></div>
                    
                    <div className="relative p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                        <Activity className="w-5 h-5 text-indigo-500 mr-2" />
                        Nächste Aktivitäten
                      </h3>
                      
                      <div className="space-y-5">
                        {activities.map((activity, index) => (
                          <div key={index} className="flex items-center group">
                            <div className="relative mr-4">
                              <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-lg ${activity.color} hover:scale-110 transition-all duration-200`}>
                                <span className="font-medium">{activity.time}</span>
                              </div>
                              {index < activities.length - 1 && (
                                <div className="absolute top-full left-1/2 w-0.5 h-5 -translate-x-1/2 bg-slate-200 dark:bg-slate-700"></div>
                              )}
                            </div>
                            
                            <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 group-hover:bg-slate-100 dark:group-hover:bg-slate-700/50 transition-all duration-200">
                              <h4 className="font-medium text-slate-900 dark:text-white">{activity.title}</h4>
                              <div className="mt-1 flex items-center text-sm text-slate-500 dark:text-slate-400">
                                <span>{activity.location}</span>
                                <span className="inline-block h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600 mx-2"></span>
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
              
              {/* Quick Actions - 3D Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {title: 'Teilnehmerliste', icon: <Users className="w-4 h-4" />, color: 'from-blue-500 to-indigo-500'},
                  {title: 'Punkte eintragen', icon: <Medal className="w-4 h-4" />, color: 'from-purple-500 to-pink-500'},
                  {title: 'Rangliste anzeigen', icon: <ArrowUpRight className="w-4 h-4" />, color: 'from-emerald-500 to-teal-500'}
                ].map((action, index) => (
                  <button
                    key={index}
                    style={get3DTransform(0.5)}
                    className="relative p-4 rounded-xl overflow-hidden transform-gpu hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {/* Gradient background with lighting effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.color}`}></div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                    <div className="absolute inset-y-0 left-0 w-16 bg-white opacity-10 skew-x-12"></div>
                    
                    <div className="relative flex items-center justify-between">
                      <span className="font-medium text-white">{action.title}</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                        {action.icon}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs */}
          {activeTab !== 'overview' && (
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-500">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab
              </h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Dieser Bereich ist in der Demo noch nicht implementiert
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UltraModernDashboard;