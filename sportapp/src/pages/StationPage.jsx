// import React, { useState, useRef, useEffect } from 'react';
// import { Plus, Search, Filter, SlidersHorizontal, Grid, List, Map, Check, Settings, ChevronRight, 
//   MoreVertical, Activity, Users, Calendar, Trophy, ChevronDown, ArrowRight, Clock, MapPin, 
//   Target, Zap, Sparkles } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate, useLocation } from 'react-router-dom';

// const StationsPage = () => {
//   const [viewMode, setViewMode] = useState('grid');
//   const [showStatsExpanded, setShowStatsExpanded] = useState(false);
//   const navigate = useNavigate();
//   const [stations, setStations] = useState([
//     {
//       id: 1,
//       name: 'Staffellauf',
//       location: 'Nordfeld',
//       status: 'active',
//       participants: 32,
//       image: '/api/placeholder/400/250',
//       nextEvent: '14:30',
//       maxPoints: 100,
//       progress: 68,
//       coordinator: 'M. Schmidt'
//     },
//     {
//       id: 2,
//       name: 'Weitsprung',
//       location: 'Westbereich',
//       status: 'active',
//       participants: 28,
//       image: '/api/placeholder/400/250',
//       nextEvent: '15:15',
//       maxPoints: 50,
//       progress: 45,
//       coordinator: 'L. Weber'
//     },
//     {
//       id: 3,
//       name: 'Kugelstoßen',
//       location: 'Sportfeld Ost',
//       status: 'inactive',
//       participants: 0,
//       image: '/api/placeholder/400/250',
//       nextEvent: '16:00',
//       maxPoints: 80,
//       progress: 0,
//       coordinator: 'S. Müller'
//     },
//     {
//       id: 4,
//       name: 'Sprint',
//       location: 'Hauptbahn',
//       status: 'active',
//       participants: 42,
//       image: '/api/placeholder/400/250',
//       nextEvent: '13:45',
//       maxPoints: 100,
//       progress: 82,
//       coordinator: 'A. Becker'
//     },
//     {
//       id: 5,
//       name: 'Hochsprung',
//       location: 'Hallenbereich',
//       status: 'scheduled',
//       participants: 15,
//       image: '/api/placeholder/400/250',
//       nextEvent: '15:30',
//       maxPoints: 60,
//       progress: 0,
//       coordinator: 'T. Krause'
//     }
//   ]);
  
//   const containerRef = useRef(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [scrollY, setScrollY] = useState(0);

//   useEffect(() => {
//     const handleMouseMove = (event) => {
//       if (!containerRef.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       const x = (event.clientX - rect.left) / rect.width;
//       const y = (event.clientY - rect.top) / rect.height;
//       setMousePosition({ x, y });
//     };

//     const handleScroll = () => {
//       setScrollY(window.scrollY);
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('scroll', handleScroll);
    
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   // Get 3D transform based on mouse position
//   const get3DTransform = (factor = 1) => {
//     const rotateX = (mousePosition.y - 0.5) * 5 * factor;
//     const rotateY = (mousePosition.x - 0.5) * -5 * factor;
    
//     return {
//       transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
//       transition: 'transform 0.1s',
//     };
//   };

//   // Get parallax position based on mouse and scroll
//   const getParallaxStyle = (factor = 0.05) => {
//     const x = (mousePosition.x - 0.5) * factor * 100;
//     const y = (mousePosition.y - 0.5) * factor * 100 - scrollY * factor;
    
//     return {
//       transform: `translate(${x}px, ${y}px)`,
//     };
//   };

//   // Dashboard Stats
//   const stats = [
//     { id: 1, title: 'Aktive Stationen', value: stations.filter(s => s.status === 'active').length, icon: <Activity size={18} />, color: 'bg-emerald-500' },
//     { id: 2, title: 'Teilnehmer Gesamt', value: stations.reduce((acc, s) => acc + s.participants, 0), icon: <Users size={18} />, color: 'bg-indigo-500' },
//     { id: 3, title: 'Nächste Station', value: stations.sort((a, b) => a.nextEvent.localeCompare(b.nextEvent))[0]?.name, icon: <Calendar size={18} />, color: 'bg-purple-500' },
//     { id: 4, title: 'Max. Punkte', value: stations.reduce((acc, s) => acc + s.maxPoints, 0), icon: <Trophy size={18} />, color: 'bg-amber-500' },
//   ];

//   const flowVariants = {
//     initial: (i) => ({
//       x: i % 2 === 0 ? -20 : 20,
//       y: -20,
//       opacity: 0,
//       scale: 0.95,
//     }),
//     animate: {
//       x: 0,
//       y: 0,
//       opacity: 1,
//       scale: 1,
//       transition: {
//         duration: 0.5,
//         ease: "easeOut"
//       }
//     },
//     exit: (i) => ({
//       x: i % 2 === 0 ? -10 : 10,
//       y: 10,
//       opacity: 0,
//       scale: 0.95,
//       transition: {
//         duration: 0.3,
//         ease: "easeIn"
//       }
//     })
//   };

//   return (
//     <motion.div 
//       ref={containerRef}
//       className="p-6 md:p-8 relative"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.4 }}
//     >
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
//         <motion.div 
//           className="absolute top-0 right-0 w-[1000px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-[120px]"
//           animate={{
//             x: [0, 20, 0],
//             y: [0, 15, 0],
//           }}
//           transition={{
//             duration: 15,
//             ease: "easeInOut",
//             repeat: Infinity,
//             repeatType: "reverse"
//           }}
//           style={getParallaxStyle(0.03)}
//         ></motion.div>
//         <motion.div 
//           className="absolute bottom-0 left-0 w-[800px] h-[600px] rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-[150px]"
//           animate={{
//             x: [0, -20, 0],
//             y: [0, 20, 0],
//           }}
//           transition={{
//             duration: 18,
//             ease: "easeInOut",
//             repeat: Infinity,
//             repeatType: "reverse"
//           }}
//           style={getParallaxStyle(0.02)}
//         ></motion.div>
        
//         {/* Particle dots */}
//         <div className="absolute inset-0">
//           {[...Array(20)].map((_, i) => (
//             <motion.div
//               key={i}
//               className="absolute w-1 h-1 bg-indigo-500/30 rounded-full"
//               style={{
//                 top: `${Math.random() * 100}%`,
//                 left: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 opacity: [0.2, 0.8, 0.2],
//                 scale: [1, 1.5, 1],
//               }}
//               transition={{
//                 duration: 4 + Math.random() * 6,
//                 repeat: Infinity,
//                 delay: Math.random() * 5,
//               }}
//             />
//           ))}
//         </div>
//       </div>
      
//       {/* Header with animated gradient text */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
//         <div>
//           <h1 className="text-4xl font-display font-bold relative inline-block">
//             <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 animate-gradient-x">
//               Stationen
//             </span>
//             <motion.div 
//               className="absolute -right-6 -top-3 text-indigo-400"
//               animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
//               transition={{ duration: 5, repeat: Infinity }}
//             >
//               <Sparkles size={20} />
//             </motion.div>
//           </h1>
//           <p className="text-slate-500 dark:text-slate-400 mt-1">Verwalte alle Sportfest-Stationen</p>
//         </div>
        
//         <div className="flex flex-wrap items-center gap-3">
//           <div className="relative w-full md:w-auto">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Station suchen..." 
//               className="h-10 w-full md:w-64 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm pl-10 pr-4 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-300"
//             />
//           </div>
          
//           <button className="h-10 px-4 rounded-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 flex items-center">
//             <Filter size={16} className="mr-2" /> Filter
//           </button>
          
//           <motion.button 
//             className="h-10 px-4 rounded-lg bg-indigo-600 text-white flex items-center shadow-md hover:shadow-lg hover:bg-indigo-700 transition-all duration-300"
//             whileHover={{ scale: 1.03 }}
//             whileTap={{ scale: 0.97 }}
//           >
//             <Plus size={16} className="mr-2" /> Station hinzufügen
//           </motion.button>
//         </div>
//       </div>

//       {/* Stats Dashboard */}
//       <motion.div 
//         className={`w-full mb-8 overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm transition-all duration-500 ${showStatsExpanded ? 'max-h-[600px]' : 'max-h-28'}`}
//         style={get3DTransform(0.2)}
//         whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
//       >
//         <div 
//           className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
//           onClick={() => setShowStatsExpanded(!showStatsExpanded)}
//         >
//           <div className="flex items-center">
//             <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
//               <Activity className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
//             </div>
//             <h2 className="text-lg font-medium text-slate-900 dark:text-white">Sportfest Dashboard</h2>
//           </div>
//           <motion.div 
//             animate={{ rotate: showStatsExpanded ? 180 : 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <ChevronDown className="h-5 w-5 text-slate-400" />
//           </motion.div>
//         </div>

//         <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           {stats.map(stat => (
//             <motion.div 
//               key={stat.id}
//               className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800"
//               whileHover={{ y: -4, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
//               transition={{ duration: 0.2 }}
//             >
//               <div className="flex items-center mb-2">
//                 <div className={`h-8 w-8 rounded-lg ${stat.color} flex items-center justify-center mr-3`}>
//                   {stat.icon}
//                 </div>
//                 <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</h3>
//               </div>
//               <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
//             </motion.div>
//           ))}
          
//           {/* Extended stats section (visible when expanded) */}
//           <AnimatePresence>
//             {showStatsExpanded && (
//               <>
//                 <motion.div 
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 20 }}
//                   transition={{ duration: 0.3, delay: 0.1 }}
//                   className="col-span-full p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800"
//                 >
//                   <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4">Stationen Status</h3>
//                   <div className="flex items-center gap-8">
//                     <div className="flex flex-col">
//                       <div className="flex items-center gap-2 mb-1">
//                         <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
//                         <span className="text-sm text-slate-600 dark:text-slate-300">Aktiv</span>
//                       </div>
//                       <div className="text-xl font-semibold text-slate-900 dark:text-white">
//                         {stations.filter(s => s.status === 'active').length}
//                       </div>
//                     </div>
//                     <div className="flex flex-col">
//                       <div className="flex items-center gap-2 mb-1">
//                         <div className="h-3 w-3 rounded-full bg-amber-500"></div>
//                         <span className="text-sm text-slate-600 dark:text-slate-300">Geplant</span>
//                       </div>
//                       <div className="text-xl font-semibold text-slate-900 dark:text-white">
//                         {stations.filter(s => s.status === 'scheduled').length}
//                       </div>
//                     </div>
//                     <div className="flex flex-col">
//                       <div className="flex items-center gap-2 mb-1">
//                         <div className="h-3 w-3 rounded-full bg-red-500"></div>
//                         <span className="text-sm text-slate-600 dark:text-slate-300">Inaktiv</span>
//                       </div>
//                       <div className="text-xl font-semibold text-slate-900 dark:text-white">
//                         {stations.filter(s => s.status === 'inactive').length}
//                       </div>
//                     </div>
                    
//                     <div className="h-16 w-px bg-slate-200 dark:bg-slate-700 mx-4"></div>
                    
//                     {/* Progress bar */}
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between mb-1">
//                         <span className="text-sm text-slate-600 dark:text-slate-300">Gesamtfortschritt</span>
//                         <span className="text-sm font-medium text-slate-900 dark:text-white">
//                           {Math.round(stations.reduce((acc, s) => acc + s.progress, 0) / stations.length)}%
//                         </span>
//                       </div>
//                       <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                         <motion.div 
//                           className="h-full bg-gradient-to-r from-indigo-600 to-purple-500"
//                           initial={{ width: 0 }}
//                           animate={{ width: `${Math.round(stations.reduce((acc, s) => acc + s.progress, 0) / stations.length)}%` }}
//                           transition={{ duration: 1, ease: "easeOut" }}
//                         ></motion.div>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 <motion.div 
//                   className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 20 }}
//                   transition={{ duration: 0.3, delay: 0.2 }}
//                 >
//                   {/* Next events timeline */}
//                   <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
//                     <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4 flex items-center">
//                       <Clock size={16} className="mr-2 text-indigo-500" /> Nächste Events
//                     </h3>
//                     <div className="space-y-3">
//                       {stations
//                         .sort((a, b) => a.nextEvent.localeCompare(b.nextEvent))
//                         .slice(0, 3)
//                         .map((station, i) => (
//                         <div key={station.id} className="flex items-center gap-3">
//                           <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
//                             {i + 1}
//                           </div>
//                           <div>
//                             <div className="font-medium text-slate-900 dark:text-white">{station.name}</div>
//                             <div className="text-xs text-slate-500">{station.nextEvent} Uhr</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {/* Top stations by participants */}
//                   <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
//                     <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4 flex items-center">
//                       <Users size={16} className="mr-2 text-purple-500" /> Top Stationen
//                     </h3>
//                     <div className="space-y-3">
//                       {stations
//                         .sort((a, b) => b.participants - a.participants)
//                         .slice(0, 3)
//                         .map((station) => (
//                         <div key={station.id} className="flex items-center justify-between">
//                           <div className="flex items-center">
//                             <div className="h-2 w-2 rounded-full bg-purple-500 mr-2"></div>
//                             <span className="text-slate-900 dark:text-white">{station.name}</span>
//                           </div>
//                           <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
//                             {station.participants} Teilnehmer
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
                  
//                   {/* Point distribution */}
//                   <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
//                     <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-4 flex items-center">
//                       <Target size={16} className="mr-2 text-amber-500" /> Punkteverteilung
//                     </h3>
//                     <div className="space-y-3">
//                       {stations.map((station) => (
//                         <div key={station.id} className="flex items-center gap-3">
//                           <div className="w-20 text-xs text-slate-500 dark:text-slate-400">{station.name}</div>
//                           <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                             <div 
//                               className="h-full bg-amber-500" 
//                               style={{ width: `${(station.maxPoints / 100) * 100}%` }}
//                             ></div>
//                           </div>
//                           <div className="w-8 text-right text-xs font-medium text-slate-900 dark:text-white">{station.maxPoints}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </motion.div>
//               </>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>
      
//       {/* View Controls with modern tabs */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
//         <div className="flex items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60">
//           <button 
//             onClick={() => setViewMode('grid')}
//             className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
//               viewMode === 'grid' 
//                 ? 'bg-indigo-500 text-white shadow-md' 
//                 : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
//             }`}
//           >
//             <Grid size={16} className="mr-2" /> 
//             <span className="text-sm font-medium">Grid</span>
//           </button>
//           <button 
//             onClick={() => setViewMode('list')}
//             className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
//               viewMode === 'list' 
//                 ? 'bg-indigo-500 text-white shadow-md' 
//                 : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
//             }`}
//           >
//             <List size={16} className="mr-2" /> 
//             <span className="text-sm font-medium">Liste</span>
//           </button>
//           <button 
//             onClick={() => setViewMode('flow')}
//             className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
//               viewMode === 'flow' 
//                 ? 'bg-indigo-500 text-white shadow-md' 
//                 : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
//             }`}
//           >
//             <Zap size={16} className="mr-2" /> 
//             <span className="text-sm font-medium">Flow</span>
//           </button>
//           <button 
//             onClick={() => setViewMode('map')}
//             className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${
//               viewMode === 'map' 
//                 ? 'bg-indigo-500 text-white shadow-md' 
//                 : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
//             }`}
//           >
//             <Map size={16} className="mr-2" /> 
//             <span className="text-sm font-medium">Karte</span>
//           </button>
//         </div>
        
//         <div className="text-sm text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
//           {stations.length} Stationen
//         </div>
//       </div>
      
//       {/* Stations Grid - Modern Version */}
//       <AnimatePresence mode="wait">
//         {viewMode === 'grid' && (
//           <motion.div 
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             key="grid-view"
//           >
//             {stations.map((station, i) => (
//               <Link 
//                 to={`/stations/${station.id}`} 
//                 key={station.id}
//                 className="group block"
//               >
//                 <motion.div 
//                   className="relative rounded-xl overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl transition-all duration-300"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: i * 0.05 }}
//                   style={get3DTransform(0.3)}
//                   whileHover={{ y: -5 }}
//                 >
//                   {/* Station Image with overlay and gradient */}
//                   <div className="relative h-48 w-full overflow-hidden">
//                     <motion.img 
//                       src={station.image} 
//                       alt={station.name} 
//                       className="h-full w-full object-cover transition-transform duration-500"
//                       whileHover={{ scale: 1.05 }}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>
                    
//                     {/* Glowing status indicator */}
//                     <div className="absolute top-3 right-3">
//                       <span className={`
//                         inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                         ${station.status === 'active' 
//                           ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50' 
//                           : station.status === 'inactive'
//                           ? 'bg-red-500/20 text-red-400 ring-1 ring-red-500/50'
//                           : 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50'}
//                         shadow-glow
//                       `}>
//                         {station.status === 'active' ? 'Aktiv' : station.status === 'inactive' ? 'Inaktiv' : 'Geplant'}
//                       </span>
//                     </div>
                    
//                     {/* Station Location with icon */}
//                     <div className="absolute bottom-12 left-3 flex items-center">
//                       <MapPin size={14} className="text-white/70 mr-1" />
//                       <p className="text-xs text-white/80">{station.location}</p>
//                     </div>
                    
//                     {/* Station Name with gradient underline animation */}
//                     <div className="absolute bottom-3 left-3 right-3">
//                       <h3 className="text-lg font-medium text-white group-hover:text-white/90 transition-colors duration-300 relative inline-block">
//                         {station.name}
//                         <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
//                       </h3>
//                     </div>
//                   </div>
                  
//                   {/* Station Details with progress bar */}
//                   <div className="p-4">
//                     <div className="mb-4">
//                       <div className="flex items-center justify-between text-sm mb-1">
//                         <div className="text-slate-500 dark:text-slate-400">Fortschritt</div>
//                         <div className="font-medium text-slate-900 dark:text-white">{station.progress}%</div>
//                       </div>
//                       <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                         <div 
//                           className={`h-full ${
//                             station.progress > 70 
//                               ? 'bg-emerald-500' 
//                               : station.progress > 30 
//                               ? 'bg-amber-500' 
//                               : 'bg-red-500'
//                           }`}
//                           style={{ width: `${station.progress}%` }}
//                         ></div>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center justify-between text-sm mb-3">
//                       <div className="flex items-center text-slate-500 dark:text-slate-400">
//                         <Users size={14} className="mr-1.5" /> Teilnehmer
//                       </div>
//                       <div className="font-medium text-slate-900 dark:text-white">{station.participants}</div>
//                     </div>
                    
//                     <div className="flex items-center justify-between text-sm mb-3">
//                       <div className="flex items-center text-slate-500 dark:text-slate-400">
//                         <Clock size={14} className="mr-1.5" /> Nächster Event
//                       </div>
//                       <div className="font-medium text-slate-900 dark:text-white">{station.nextEvent} Uhr</div>
//                     </div>
                    
//                     <div className="flex items-center justify-between text-sm">
//                       <div className="flex items-center text-slate-500 dark:text-slate-400">
//                         <Trophy size={14} className="mr-1.5" /> Max. Punkte
//                       </div>
//                       <div className="font-medium text-slate-900 dark:text-white">{station.maxPoints}</div>
//                     </div>
//                   </div>
                  
//                   {/* Action Button with hover effect */}
//                   <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
//                     <div className="flex justify-between items-center">
//                       <Link 
//                         to={`/stations/${station.id}/score`}
//                         className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center"
//                       >
//                         Punkte eintragen
//                         <motion.div
//                           initial={{ x: 0, opacity: 0.5 }}
//                           whileHover={{ x: 3, opacity: 1 }}
//                           transition={{ duration: 0.2 }}
//                         >
//                           <ArrowRight size={14} className="ml-1.5" />
//                         </motion.div>
//                       </Link>
//                       <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
//                         <MoreVertical size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </motion.div>
//               </Link>
//             ))}
            
//             {/* Add Station Card */}
//             <motion.div 
//               className="flex items-center justify-center h-full min-h-[320px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500/70 transition-colors cursor-pointer bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm group"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: stations.length * 0.05 }}
//               style={get3DTransform(0.3)}
//               whileHover={{ y: -5, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
//             >
//               <div className="text-center p-6">
//                 <motion.div 
//                   className="mx-auto w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-indigo-500"
//                   whileHover={{ rotate: 90 }}
//                 >
//                   <Plus className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300" />
//                 </motion.div>
//                 <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Neue Station</h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">Füge eine weitere Station zum Sportfest hinzu</p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
        
//         {/* Stations List - Modern Version */}
//         {viewMode === 'list' && (
//           <motion.div 
//             className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             key="list-view"
//           >
//             <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur-sm grid grid-cols-12 gap-4">
//               <div className="col-span-4 font-medium text-slate-900 dark:text-white">Name</div>
//               <div className="col-span-2 font-medium text-slate-900 dark:text-white">Status</div>
//               <div className="col-span-2 font-medium text-slate-900 dark:text-white">Teilnehmer</div>
//               <div className="col-span-2 font-medium text-slate-900 dark:text-white">Nächster Event</div>
//               <div className="col-span-2 font-medium text-slate-900 dark:text-white text-right">Aktionen</div>
//             </div>
            
//             <div className="max-h-[600px] overflow-y-auto">
//               {stations.map((station, i) => (
//                 <motion.div 
//                   key={station.id}
//                   className="p-4 border-b border-slate-100 dark:border-slate-700 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all duration-200 relative group"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.2, delay: i * 0.03 }}
//                   whileHover={{ x: 5 }}
//                 >
//                   {/* Status indicator line */}
//                   <div className={`absolute left-0 top-0 bottom-0 w-1 ${
//                     station.status === 'active' 
//                       ? 'bg-emerald-500' 
//                       : station.status === 'inactive'
//                       ? 'bg-red-500'
//                       : 'bg-amber-500'
//                   }`}></div>
                  
//                   <div className="col-span-4 flex items-center">
//                     <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden mr-3 flex-shrink-0 group-hover:shadow-md transition-all duration-200">
//                       <img 
//                         src={station.image} 
//                         alt={station.name} 
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-slate-900 dark:text-white">{station.name}</h3>
//                       <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
//                         <MapPin size={10} className="mr-1" /> {station.location}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <div className="col-span-2">
//                     <span className={`
//                       inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
//                       ${station.status === 'active' 
//                         ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 ring-1 ring-emerald-500/30' 
//                         : station.status === 'inactive'
//                         ? 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-500/30'
//                         : 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 ring-1 ring-amber-500/30'}
//                     `}>
//                       {station.status === 'active' ? 'Aktiv' : station.status === 'inactive' ? 'Inaktiv' : 'Geplant'}
//                     </span>
//                   </div>
                  
//                   <div className="col-span-2 text-slate-900 dark:text-white flex items-center">
//                     <Users size={14} className="mr-2 text-slate-400" />
//                     {station.participants}
//                   </div>
                  
//                   <div className="col-span-2 text-slate-900 dark:text-white flex items-center">
//                     <Clock size={14} className="mr-2 text-slate-400" />
//                     {station.nextEvent} Uhr
//                   </div>
                  
//                   <div className="col-span-2 flex items-center justify-end gap-2">
//                     <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
//                       <Link 
//                         to={`/stations/${station.id}/score`}
//                         className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
//                       >
//                         <Check size={16} />
//                       </Link>
//                     </motion.div>
//                     <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
//                       <Link 
//                         to={`/stations/${station.id}`}
//                         className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                       >
//                         <Settings size={16} />
//                       </Link>
//                     </motion.div>
//                     <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
//                       <button className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
//                         <MoreVertical size={16} />
//                       </button>
//                     </motion.div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
            
//             {/* Add button in list view */}
//             <div className="p-4 flex justify-center">
//               <motion.button 
//                 className="flex items-center px-4 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
//                 whileHover={{ y: -2 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Plus size={16} className="mr-2" /> Neue Station hinzufügen
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
        
//         {/* NEW: Flow View - A futuristic card flow layout */}
//         {viewMode === 'flow' && (
//           <motion.div 
//             className="w-full"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             key="flow-view"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
//               {/* Active stations column */}
//               <div className="flex flex-col gap-4">
//                 <div className="bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl p-3 mb-2">
//                   <h3 className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
//                     <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
//                     Aktive Stationen
//                   </h3>
//                 </div>
                
//                 {stations
//                   .filter(station => station.status === 'active')
//                   .map((station, i) => (
//                   <motion.div
//                     key={station.id}
//                     custom={i}
//                     variants={flowVariants}
//                     initial="initial"
//                     animate="animate"
//                     exit="exit"
//                     whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
//                     transition={{ duration: 0.2 }}
//                     className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden cursor-pointer"
//                   >
//                     <div className="relative h-32 overflow-hidden">
//                       <img 
//                         src={station.image} 
//                         alt={station.name} 
//                         className="h-full w-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//                       <div className="absolute bottom-2 left-3">
//                         <h3 className="text-white font-medium">{station.name}</h3>
//                         <div className="flex items-center text-white/80 text-xs">
//                           <MapPin size={10} className="mr-1" /> {station.location}
//                         </div>
//                       </div>
//                       <div className="absolute top-2 right-2">
//                         <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50">
//                           Aktiv
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="p-3">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
//                           <Users size={12} className="mr-1" /> {station.participants} Teilnehmer
//                         </div>
//                         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
//                           <Clock size={12} className="mr-1" /> {station.nextEvent} Uhr
//                         </div>
//                       </div>
                      
//                       <div className="mb-1 flex items-center justify-between text-xs">
//                         <span className="text-slate-500 dark:text-slate-400">Fortschritt</span>
//                         <span className="font-medium text-slate-700 dark:text-slate-300">{station.progress}%</span>
//                       </div>
//                       <div className="h-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-emerald-500"
//                           style={{ width: `${station.progress}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
                
//                 <motion.div
//                   whileHover={{ scale: 1.03 }}
//                   transition={{ duration: 0.2 }}
//                   className="mt-2 flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-emerald-300/30 dark:border-emerald-700/30 hover:border-emerald-500 dark:hover:border-emerald-500/70 text-emerald-600 dark:text-emerald-400 cursor-pointer"
//                 >
//                   <Plus size={16} className="mr-2" /> Aktive Station hinzufügen
//                 </motion.div>
//               </div>
              
//               {/* Scheduled stations column */}
//               <div className="flex flex-col gap-4">
//                 <div className="bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-xl p-3 mb-2">
//                   <h3 className="text-amber-600 dark:text-amber-400 font-medium flex items-center">
//                     <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
//                     Geplante Stationen
//                   </h3>
//                 </div>
                
//                 {stations
//                   .filter(station => station.status === 'scheduled')
//                   .map((station, i) => (
//                   <motion.div
//                     key={station.id}
//                     custom={i}
//                     variants={flowVariants}
//                     initial="initial"
//                     animate="animate"
//                     exit="exit"
//                     whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
//                     transition={{ duration: 0.2 }}
//                     className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden cursor-pointer"
//                   >
//                     <div className="relative h-32 overflow-hidden">
//                       <img 
//                         src={station.image} 
//                         alt={station.name} 
//                         className="h-full w-full object-cover"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//                       <div className="absolute bottom-2 left-3">
//                         <h3 className="text-white font-medium">{station.name}</h3>
//                         <div className="flex items-center text-white/80 text-xs">
//                           <MapPin size={10} className="mr-1" /> {station.location}
//                         </div>
//                       </div>
//                       <div className="absolute top-2 right-2">
//                         <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50">
//                           Geplant
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="p-3">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
//                           <Users size={12} className="mr-1" /> {station.participants} Teilnehmer
//                         </div>
//                         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
//                           <Clock size={12} className="mr-1" /> {station.nextEvent} Uhr
//                         </div>
//                       </div>
                      
//                       <div className="h-8 flex items-center justify-center border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg text-xs text-amber-700 dark:text-amber-400">
//                         Station startet bald
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
                
//                 <motion.div
//                   whileHover={{ scale: 1.03 }}
//                   transition={{ duration: 0.2 }}
//                   className="mt-2 flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-amber-300/30 dark:border-amber-700/30 hover:border-amber-500 dark:hover:border-amber-500/70 text-amber-600 dark:text-amber-400 cursor-pointer"
//                 >
//                   <Plus size={16} className="mr-2" /> Geplante Station hinzufügen
//                 </motion.div>
//               </div>
              
//               {/* Inactive stations column */}
//               <div className="flex flex-col gap-4">
//                 <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-3 mb-2">
//                   <h3 className="text-red-600 dark:text-red-400 font-medium flex items-center">
//                     <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
//                     Inaktive Stationen
//                   </h3>
//                 </div>
                
//                 {stations
//                   .filter(station => station.status === 'inactive')
//                   .map((station, i) => (
//                   <motion.div
//                     key={station.id}
//                     custom={i}
//                     variants={flowVariants}
//                     initial="initial"
//                     animate="animate"
//                     exit="exit"
//                     whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
//                     transition={{ duration: 0.2 }}
//                     className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden cursor-pointer"
//                   >
//                     <div className="relative h-32 overflow-hidden">
//                       <img 
//                         src={station.image} 
//                         alt={station.name} 
//                         className="h-full w-full object-cover grayscale"
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
//                       <div className="absolute bottom-2 left-3">
//                         <h3 className="text-white font-medium">{station.name}</h3>
//                         <div className="flex items-center text-white/80 text-xs">
//                           <MapPin size={10} className="mr-1" /> {station.location}
//                         </div>
//                       </div>
//                       <div className="absolute top-2 right-2">
//                         <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 ring-1 ring-red-500/50">
//                           Inaktiv
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="p-3">
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
//                           <Users size={12} className="mr-1" /> {station.participants} Teilnehmer
//                         </div>
//                         <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
//                           <Clock size={12} className="mr-1" /> {station.nextEvent} Uhr
//                         </div>
//                       </div>
                      
//                       <div className="h-8 flex items-center justify-center border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-lg text-xs text-red-700 dark:text-red-400">
//                         Station deaktiviert
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
                
//                 <motion.div
//                   whileHover={{ scale: 1.03 }}
//                   transition={{ duration: 0.2 }}
//                   className="mt-2 flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-red-300/30 dark:border-red-700/30 hover:border-red-500 dark:hover:border-red-500/70 text-red-600 dark:text-red-400 cursor-pointer"
//                 >
//                   <Plus size={16} className="mr-2" /> Inaktive Station hinzufügen
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         )}
        
//         {/* Map View - Enhanced with 3D perspective */}
//         {viewMode === 'map' && (
//           <motion.div 
//             className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden h-[600px] relative"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             key="map-view"
//             style={get3DTransform(0.2)}
//           >
//             {/* 3D Field with Stations */}
//             <div className="absolute inset-0 bg-gradient-to-b from-green-100/30 to-green-200/20 dark:from-green-900/20 dark:to-green-800/10"></div>
            
//             {/* Field lines */}
//             <div className="absolute top-1/4 left-0 right-0 h-px bg-white/20 dark:bg-white/10"></div>
//             <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40 dark:bg-white/20"></div>
//             <div className="absolute top-3/4 left-0 right-0 h-px bg-white/20 dark:bg-white/10"></div>
//             <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white/20 dark:bg-white/10"></div>
//             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40 dark:bg-white/20"></div>
//             <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white/20 dark:bg-white/10"></div>
            
//             {/* Station Markers */}
//             <div className="absolute top-[30%] left-[20%]">
//               <motion.div 
//                 className="w-12 h-12 -mt-6 -ml-6 relative cursor-pointer"
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping"></div>
//                 <div className="absolute inset-0 bg-emerald-500 rounded-full scale-[0.4] flex items-center justify-center text-white font-bold">1</div>
//                 <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs font-medium shadow-md whitespace-nowrap">
//                   Staffellauf
//                 </div>
//               </motion.div>
//             </div>
            
//             <div className="absolute top-[40%] left-[70%]">
//               <motion.div 
//                 className="w-12 h-12 -mt-6 -ml-6 relative cursor-pointer"
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping"></div>
//                 <div className="absolute inset-0 bg-emerald-500 rounded-full scale-[0.4] flex items-center justify-center text-white font-bold">2</div>
//                 <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs font-medium shadow-md whitespace-nowrap">
//                   Weitsprung
//                 </div>
//               </motion.div>
//             </div>
            
//             <div className="absolute top-[70%] left-[80%]">
//               <motion.div 
//                 className="w-12 h-12 -mt-6 -ml-6 relative cursor-pointer"
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ping opacity-50"></div>
//                 <div className="absolute inset-0 bg-red-500 rounded-full scale-[0.4] flex items-center justify-center text-white font-bold">3</div>
//                 <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs font-medium shadow-md whitespace-nowrap">
//                   Kugelstoßen
//                 </div>
//               </motion.div>
//             </div>
            
//             <div className="absolute top-[60%] left-[30%]">
//               <motion.div 
//                 className="w-12 h-12 -mt-6 -ml-6 relative cursor-pointer"
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div className="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping"></div>
//                 <div className="absolute inset-0 bg-emerald-500 rounded-full scale-[0.4] flex items-center justify-center text-white font-bold">4</div>
//                 <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs font-medium shadow-md whitespace-nowrap">
//                   Sprint
//                 </div>
//               </motion.div>
//             </div>
            
//             <div className="absolute top-[20%] left-[50%]">
//               <motion.div 
//                 className="w-12 h-12 -mt-6 -ml-6 relative cursor-pointer"
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <div className="absolute inset-0 bg-amber-500/30 rounded-full animate-ping opacity-75"></div>
//                 <div className="absolute inset-0 bg-amber-500 rounded-full scale-[0.4] flex items-center justify-center text-white font-bold">5</div>
//                 <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md text-xs font-medium shadow-md whitespace-nowrap">
//                   Hochsprung
//                 </div>
//               </motion.div>
//             </div>
            
//             {/* Map Legend */}
//             <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200/60 dark:border-slate-700/60">
//               <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Legende</h3>
              
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
//                   <span className="text-xs text-slate-600 dark:text-slate-300">Aktive Station</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
//                   <span className="text-xs text-slate-600 dark:text-slate-300">Geplante Station</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                   <span className="text-xs text-slate-600 dark:text-slate-300">Inaktive Station</span>
//                 </div>
//               </div>
//             </div>
            
//             {/* Map Controls */}
//             <div className="absolute bottom-4 right-4 flex flex-col gap-2">
//               <button className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
//                 <Plus size={16} />
//               </button>
//               <button className="w-8 h-8 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
//                 <div className="w-4 h-0.5 bg-current"></div>
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
      
//       {/* Add CSS for the glow effect and animated gradients */}
//       <style jsx>{`
//         .shadow-glow {
//           box-shadow: 0 0 15px rgba(var(--glow-color, 74, 222, 128), 0.3);
//         }
        
//         @keyframes gradient-x {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }
        
//         .animate-gradient-x {
//           background-size: 200% 100%;
//           animation: gradient-x 8s ease infinite;
//         }
//       `}</style>
//     </motion.div>
//   );
// };

// export default StationsPage;








import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, SlidersHorizontal, Grid, List, Map, Check, Settings, ChevronRight, 
  MoreVertical, Activity, Users, Calendar, Trophy, ChevronDown, ArrowRight, Clock, MapPin, 
  Target, Zap, Sparkles, Star, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';


import staffellaufImg from '../assets/staffellauf.jpg';
import weitsprungImg from '../assets/weitsprung.jpg';
import kugelstoessenImg from '../assets/kugelstoßen.jpg';
import hochsprungImg from '../assets/hochsprung.jpg';
import sprintImg from '../assets/sprint.jpg';


const StationsPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [stations, setStations] = useState([
    {
      id: 1,
      name: 'Staffellauf',
      location: 'Nordfeld',
      status: 'active',
      participants: 32,
      image: staffellaufImg,
      nextEvent: '14:30',
      maxPoints: 100,
      progress: 68,
      coordinator: 'M. Schmidt'
    },
    {
      id: 2,
      name: 'Weitsprung',
      location: 'Westbereich',
      status: 'active',
      participants: 28,
      image: weitsprungImg,
      nextEvent: '15:15',
      maxPoints: 50,
      progress: 45,
      coordinator: 'L. Weber'
    },
    {
      id: 3,
      name: 'Kugelstoßen',
      location: 'Sportfeld Ost',
      status: 'inactive',
      participants: 0,
      image: kugelstoessenImg,
      nextEvent: '16:00',
      maxPoints: 80,
      progress: 0,
      coordinator: 'S. Müller'
    },
    {
      id: 4,
      name: 'Sprint',
      location: 'Hauptbahn',
      status: 'active',
      participants: 42,
      image: sprintImg,
      nextEvent: '13:45',
      maxPoints: 100,
      progress: 82,
      coordinator: 'A. Becker'
    },
    {
      id: 5,
      name: 'Hochsprung',
      location: 'Hallenbereich',
      status: 'scheduled',
      participants: 15,
      image: hochsprungImg,
      nextEvent: '15:30',
      maxPoints: 60,
      progress: 0,
      coordinator: 'T. Krause'
    }
  ]);
  
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredStation, setHoveredStation] = useState(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorSize = useMotionValue(16);

  // Filter stations based on active filter
  const filteredStations = stations.filter(station => {
    if (activeFilter === 'all') return true;
    return station.status === activeFilter;
  }).filter(station => {
    if (!searchQuery) return true;
    return station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           station.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      
      // Update cursor position
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      
      // Increase cursor size when near interactive elements
      const isNearButton = document.elementsFromPoint(event.clientX, event.clientY)
        .some(el => el.tagName === 'BUTTON' || el.tagName === 'A' || el.classList.contains('interactive'));
      
      cursorSize.set(isNearButton ? 32 : 16);
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cursorSize, cursorX, cursorY]);

  // Get 3D transform based on mouse position
  const get3DTransform = (factor = 1) => {
    const rotateX = (mousePosition.y - 0.5) * 5 * factor;
    const rotateY = (mousePosition.x - 0.5) * -5 * factor;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s',
    };
  };

  // Get parallax position based on mouse and scroll
  const getParallaxStyle = (factor = 0.05) => {
    const x = (mousePosition.x - 0.5) * factor * 100;
    const y = (mousePosition.y - 0.5) * factor * 100 - scrollY * factor;
    
    return {
      transform: `translate3d(${x}px, ${y}px, 0)`,
    };
  };

  // Get glow effect based on mouse position
  const getGlowStyle = (x, y, color = 'rgba(99, 102, 241, 0.3)') => {
    return {
      background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${color}, transparent 50%)`,
    };
  };

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }),
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      transition: {
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      transition: {
        duration: 0.1,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  // Filtering animations
  const filterVariants = {
    active: {
      backgroundColor: "rgba(99, 102, 241, 1)",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
      scale: 1.05,
      y: -2
    },
    inactive: {
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      color: "#64748b",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
      scale: 1,
      y: 0
    },
    hover: {
      scale: 1.05,
      y: -2,
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)"
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
    }
  };

  // Add button variants
  const addButtonVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 20px rgba(99, 102, 241, 0.4)"
    },
    tap: {
      scale: 0.98,
      boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)"
    }
  };

  // Container for viewable stations
  const stationContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  // Flow layout variants
  const flowVariants = {
    initial: (i) => ({
      x: i % 2 === 0 ? -20 : 20,
      y: -20,
      opacity: 0,
      scale: 0.95,
    }),
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: (i) => ({
      x: i % 2 === 0 ? -10 : 10,
      y: 10,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    })
  };

  // Get status color based on station status
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return { bg: 'bg-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-500/50', light: 'bg-emerald-500/20', glow: 'rgba(16, 185, 129, 0.3)' };
      case 'inactive': return { bg: 'bg-red-500', text: 'text-red-400', ring: 'ring-red-500/50', light: 'bg-red-500/20', glow: 'rgba(239, 68, 68, 0.3)' };
      case 'scheduled': return { bg: 'bg-amber-500', text: 'text-amber-400', ring: 'ring-amber-500/50', light: 'bg-amber-500/20', glow: 'rgba(245, 158, 11, 0.3)' };
      default: return { bg: 'bg-blue-500', text: 'text-blue-400', ring: 'ring-blue-500/50', light: 'bg-blue-500/20', glow: 'rgba(59, 130, 246, 0.3)' };
    }
  };

  // Custom cursor component
  const CustomCursor = () => {
    const size = useTransform(cursorSize, value => `${value}px`);
    const opacity = useTransform(cursorSize, [16, 32], [0.3, 0.5]);
    
    return (
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: size,
          height: size,
          backgroundColor: 'white',
          opacity: opacity,
          transform: 'translate(-50%, -50%)'
        }}
      />
    );
  };

  return (
    <motion.div 
      ref={containerRef}
      className="p-6 md:p-8 relative min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          className="absolute top-0 right-0 w-[1200px] h-[800px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-[150px]"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={getParallaxStyle(0.03)}
        ></motion.div>
        <motion.div 
          className="absolute bottom-0 left-0 w-[1000px] h-[800px] rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-[180px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 23,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={getParallaxStyle(0.02)}
        ></motion.div>
        
        {/* Particle dots */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-500/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-500/[0.02] to-transparent" style={{ backgroundSize: '20px 20px', backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)' }}></div>
      </div>
      
      {/* Header with animated gradient text */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold relative inline-block">
              <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 animate-gradient-x">
                Stationen
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                ></motion.span>
              </span>
              <motion.div 
                className="absolute -right-8 -top-5 text-indigo-400"
                animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Sparkles size={24} />
              </motion.div>
            </h1>
          
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search with animated focus state */}
            <motion.div 
              className={`relative w-full md:w-auto transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}
              animate={{ boxShadow: isSearchFocused ? '0 8px 30px rgba(0,0,0,0.12)' : '0 2px 10px rgba(0,0,0,0.05)' }}
            >
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-indigo-500' : 'text-slate-400'}`} size={18} />
              <input 
                type="text" 
                placeholder="Station suchen..." 
                className="h-11 w-full md:w-64 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md pl-10 pr-4 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-indigo-400/30 transition-all duration-300"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              {searchQuery && (
                <motion.button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 180 }}
                  exit={{ scale: 0, rotate: 0 }}
                  onClick={() => setSearchQuery('')}
                >
                  <Plus size={16} className="rotate-45" />
                </motion.button>
              )}
            </motion.div>
            
            {/* Filter button with hover effects */}
            <motion.button 
              className="h-11 px-5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 flex items-center interactive"
              whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
              whileTap={{ y: 0, scale: 0.98, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
            >
              <Filter size={16} className="mr-2" /> Filter
            </motion.button>
            
            {/* Add Station button with glow effect */}
            <motion.button 
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white flex items-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all duration-300 interactive"
              variants={addButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div
                animate={{ rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              >
                <Plus size={16} className="mr-2" />
              </motion.div>
              Station hinzufügen
              
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-xl opacity-60 -z-10 blur-md"
                animate={{ 
                  background: [
                    'linear-gradient(90deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 100%)',
                    'linear-gradient(180deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 100%)',
                    'linear-gradient(270deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 100%)',
                    'linear-gradient(0deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 100%)',
                    'linear-gradient(90deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 100%)'
                  ]
                }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              />
            </motion.button>
          </div>
        </div>
        
        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <motion.button
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 interactive relative"
            variants={filterVariants}
            animate={activeFilter === 'all' ? 'active' : 'inactive'}
            whileHover={activeFilter !== 'all' ? 'hover' : undefined}
            whileTap="tap"
            onClick={() => setActiveFilter('all')}
          >
            Alle
            {activeFilter === 'all' && (
              <motion.span 
                className="absolute inset-0 -z-10 rounded-full opacity-30 blur-sm bg-indigo-500"
                layoutId="activeFilterGlow"
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            )}
          </motion.button>
          
          <motion.button
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 interactive relative"
            variants={filterVariants}
            animate={activeFilter === 'active' ? 'active' : 'inactive'}
            whileHover={activeFilter !== 'active' ? 'hover' : undefined}
            whileTap="tap"
            onClick={() => setActiveFilter('active')}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 mr-2 bg-emerald-500 rounded-full"></span>
              Aktiv
            </span>
            {activeFilter === 'active' && (
              <motion.span 
                className="absolute inset-0 -z-10 rounded-full opacity-30 blur-sm bg-emerald-500"
                layoutId="activeFilterGlow"
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            )}
          </motion.button>
          
          <motion.button
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 interactive relative"
            variants={filterVariants}
            animate={activeFilter === 'scheduled' ? 'active' : 'inactive'}
            whileHover={activeFilter !== 'scheduled' ? 'hover' : undefined}
            whileTap="tap"
            onClick={() => setActiveFilter('scheduled')}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 mr-2 bg-amber-500 rounded-full"></span>
              Geplant
            </span>
            {activeFilter === 'scheduled' && (
              <motion.span 
                className="absolute inset-0 -z-10 rounded-full opacity-30 blur-sm bg-amber-500"
                layoutId="activeFilterGlow"
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            )}
          </motion.button>
          
          <motion.button
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 interactive relative"
            variants={filterVariants}
            animate={activeFilter === 'inactive' ? 'active' : 'inactive'}
            whileHover={activeFilter !== 'inactive' ? 'hover' : undefined}
            whileTap="tap"
            onClick={() => setActiveFilter('inactive')}
          >
            <span className="flex items-center">
              <span className="w-2 h-2 mr-2 bg-red-500 rounded-full"></span>
              Inaktiv
            </span>
            {activeFilter === 'inactive' && (
              <motion.span 
                className="absolute inset-0 -z-10 rounded-full opacity-30 blur-sm bg-red-500"
                layoutId="activeFilterGlow"
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            )}
          </motion.button>
        </div>
        
        {/* View Controls with modern tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 relative z-10">
          <div className="flex items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-xl p-1.5 border border-slate-200/60 dark:border-slate-700/60 shadow-lg">
            <motion.button 
              onClick={() => setViewMode('grid')}
              className="relative px-4 py-2.5 rounded-lg flex items-center transition-all duration-200 interactive"
              whileHover={viewMode !== 'grid' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              
              
              
              {viewMode === 'grid' && (
                <motion.div 
                  className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={viewMode === 'grid' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}>
                <Grid size={18} className="mr-2" /> 
                <span className="text-sm font-medium">Grid</span>
              </span>
            </motion.button>
            
            <motion.button 
              onClick={() => setViewMode('list')}
              className="relative px-4 py-2.5 rounded-lg flex items-center transition-all duration-200 interactive"
              whileHover={viewMode !== 'list' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              {viewMode === 'list' && (
                <motion.div 
                  className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={viewMode === 'list' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}>
                <List size={18} className="mr-2" /> 
                <span className="text-sm font-medium">Liste</span>
              </span>
            </motion.button>
            
            <motion.button 
              onClick={() => setViewMode('flow')}
              className="relative px-4 py-2.5 rounded-lg flex items-center transition-all duration-200 interactive"
              whileHover={viewMode !== 'flow' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              {viewMode === 'flow' && (
                <motion.div 
                  className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={viewMode === 'flow' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}>
                <Zap size={18} className="mr-2" /> 
                <span className="text-sm font-medium">Flow</span>
              </span>
            </motion.button>
            
            <motion.button 
              onClick={() => setViewMode('map')}
              className="relative px-4 py-2.5 rounded-lg flex items-center transition-all duration-200 interactive"
              whileHover={viewMode !== 'map' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              {viewMode === 'map' && (
                <motion.div 
                  className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className={viewMode === 'map' ? 'text-white' : 'text-slate-600 dark:text-slate-300'}>
                <Map size={18} className="mr-2" /> 
                <span className="text-sm font-medium">Karte</span>
              </span>
            </motion.button>
          </div>
          
          <motion.div 
            className="text-sm text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg px-4 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg"
            whileHover={{ y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
          >
            {filteredStations.length} Stationen
          </motion.div>
        </div>
      </div>
      
      {/* Stations Display with View Transitions */}
      <AnimatePresence mode="wait">
        {/* Grid View - Ultra Modern Version */}
        {viewMode === 'grid' && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10"
            variants={stationContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            key="grid-view"
          >
            {filteredStations.map((station, i) => {
              const statusColors = getStatusColor(station.status);
              
              return (
                <motion.div 
                  key={station.id}
                  className="relative group"
                  custom={i}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onHoverStart={() => setHoveredStation(station.id)}
                  onHoverEnd={() => setHoveredStation(null)}
                >
                  <Link to={`/stations/${station.id}`} className="block">
                    <motion.div 
                      className="relative rounded-2xl overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 shadow-xl h-full z-10"
                      style={get3DTransform(0.3)}
                    >
                      {/* Glow effect on hover */}
                      <motion.div 
                        className={`absolute -inset-0.5 rounded-2xl ${statusColors.light} opacity-0 group-hover:opacity-100 blur-md -z-10 transition-opacity duration-300`}
                        style={{ boxShadow: `0 0 40px ${statusColors.glow}` }}
                      />
                      
                      {/* Station Image with overlay and gradient */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <motion.img 
                          src={station.image} 
                          alt={station.name} 
                          className="h-full w-full object-cover transition-transform duration-700"
                          animate={{ scale: hoveredStation === station.id ? 1.1 : 1 }}
                          transition={{ duration: 0.7, ease: [0.43, 0.13, 0.23, 0.96] }}
                        />
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"
                          animate={{ opacity: hoveredStation === station.id ? 0.8 : 1 }}
                        />
                        
                        {/* Glowing status indicator */}
                        <div className="absolute top-3 right-3">
                          <motion.div
                            className="relative"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className={`
                              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                              ${statusColors.light} ${statusColors.text} ring-1 ${statusColors.ring}
                            `}>
                              {station.status === 'active' ? 'Aktiv' : station.status === 'inactive' ? 'Inaktiv' : 'Geplant'}
                            </span>
                            <motion.span 
                              className={`absolute inset-0 rounded-full ${statusColors.light} blur-md -z-10`}
                              animate={{ 
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                              }}
                            />
                          </motion.div>
                        </div>
                        
                        {/* Station Location with icon */}
                        <div className="absolute bottom-12 left-3 flex items-center">
                          <motion.div 
                            className="p-1 rounded-full bg-white/10 backdrop-blur-md mr-1"
                            animate={{
                              y: [0, -3, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: i * 0.1
                            }}
                          >
                            <MapPin size={12} className="text-white/90" />
                          </motion.div>
                          <p className="text-xs text-white/90">{station.location}</p>
                        </div>
                        
                        {/* Station Name with gradient underline animation */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-xl font-medium text-white group-hover:text-white/90 transition-colors duration-300 relative inline-block">
                            {station.name}
                            <motion.span 
                              className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: hoveredStation === station.id ? '100%' : 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </h3>
                        </div>
                      </div>
                      
                      {/* Station Details with animated progress bar */}
                      <div className="p-4">
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <div className="text-slate-500 dark:text-slate-400">Fortschritt</div>
                            <div className="font-medium text-slate-900 dark:text-white">{station.progress}%</div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${
                                station.progress > 70 
                                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                                  : station.progress > 30 
                                  ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                                  : 'bg-gradient-to-r from-red-500 to-red-400'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${station.progress}%` }}
                              transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <Users size={14} className="mr-1.5" /> Teilnehmer
                          </div>
                          <div className="font-medium text-slate-900 dark:text-white flex items-center">
                            <motion.span
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: i * 0.1 + 0.3 }}
                            >
                              {station.participants}
                            </motion.span>
                            {station.status === 'active' && station.participants > 30 && (
                              <motion.div 
                                className="ml-1.5 p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.1 + 0.5 }}
                              >
                                <Flame size={12} />
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <Clock size={14} className="mr-1.5" /> Nächster Event
                          </div>
                          <div className="font-medium text-slate-900 dark:text-white">{station.nextEvent} Uhr</div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <Trophy size={14} className="mr-1.5" /> Max. Punkte
                          </div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.1 + 0.4 }}
                              className="flex items-center"
                            >
                              {station.maxPoints}
                              {station.maxPoints >= 100 && (
                                <motion.div 
                                  className="ml-1.5 text-amber-500"
                                  animate={{ 
                                    rotate: [0, 10, -10, 10, 0],
                                    scale: [1, 1.2, 1, 1.2, 1]
                                  }}
                                  transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 4
                                  }}
                                >
                                  <Star size={12} fill="currentColor" />
                                </motion.div>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button with hover effect and backdrop blur */}
                      <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
                        <div className="flex justify-between items-center">
                          <Link 
                            to={`/stations/${station.id}/score`}
                            className="relative text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center group interactive overflow-hidden px-3 py-1 rounded-lg"
                          >
                            <motion.div 
                              className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.98 }}
                            />
                            
                            Punkte eintragen
                            <motion.div
                              className="inline-block ml-1.5"
                              initial={{ x: 0 }}
                              whileHover={{ x: 3 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight size={14} />
                            </motion.div>
                          </Link>
                          <motion.button 
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-700/80 backdrop-blur-md transition-colors interactive"
                            whileHover={{ rotate: 90, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <MoreVertical size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
            
            {/* Add Station Card */}
            <motion.div 
              className="relative rounded-2xl overflow-hidden h-full group"
              variants={cardVariants}
              custom={filteredStations.length}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div 
                className="flex items-center justify-center h-full min-h-[360px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500/70 transition-colors cursor-pointer bg-white/30 dark:bg-slate-800/30 backdrop-blur-lg interactive"
                style={get3DTransform(0.3)}
              >
                <div className="text-center p-8">
                  <motion.div 
                    className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-indigo-500 relative"
                    whileHover={{ rotate: 90 }}
                  >
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-indigo-500/30 -z-10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{ 
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <Plus className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors duration-300" />
                  </motion.div>
                  <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-1">Neue Station</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Füge eine weitere Station zum Sportfest hinzu</p>
                  
                  <motion.div 
                    className="mt-4 h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ 
                      y: [0, -8, 0],
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <ArrowRight className="w-5 h-5 text-indigo-500" />
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Gradient Border Animation */}
              <motion.div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[-1]"
                animate={{ 
                  background: [
                    'linear-gradient(0deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 25%, rgba(99,102,241,0.5) 50%, rgba(168,85,247,0.5) 75%, rgba(99,102,241,0.5) 100%)',
                    'linear-gradient(90deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 25%, rgba(99,102,241,0.5) 50%, rgba(168,85,247,0.5) 75%, rgba(99,102,241,0.5) 100%)',
                    'linear-gradient(180deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 25%, rgba(99,102,241,0.5) 50%, rgba(168,85,247,0.5) 75%, rgba(99,102,241,0.5) 100%)',
                    'linear-gradient(270deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 25%, rgba(99,102,241,0.5) 50%, rgba(168,85,247,0.5) 75%, rgba(99,102,241,0.5) 100%)',
                    'linear-gradient(0deg, rgba(99,102,241,0.5) 0%, rgba(168,85,247,0.5) 25%, rgba(99,102,241,0.5) 50%, rgba(168,85,247,0.5) 75%, rgba(99,102,241,0.5) 100%)',
                  ]
                }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
        
        {/* List View - Ultra Modern Version */}
        {viewMode === 'list' && (
          <motion.div 
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            key="list-view"
          >
            <motion.div 
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl overflow-hidden"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 backdrop-blur-sm grid grid-cols-12 gap-4">
                <div className="col-span-4 font-medium text-slate-900 dark:text-white">Name</div>
                <div className="col-span-2 font-medium text-slate-900 dark:text-white">Status</div>
                <div className="col-span-2 font-medium text-slate-900 dark:text-white">Teilnehmer</div>
                <div className="col-span-2 font-medium text-slate-900 dark:text-white">Nächster Event</div>
                <div className="col-span-2 font-medium text-slate-900 dark:text-white text-right">Aktionen</div>
              </div>
              
              <div className="max-h-[650px] overflow-y-auto">
                {filteredStations.map((station, i) => {
                  const statusColors = getStatusColor(station.status);
                  
                  return (
                    <motion.div 
                      key={station.id}
                      className="relative p-4 border-b border-slate-100 dark:border-slate-700 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-all duration-200 group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      whileHover={{ x: 5, backgroundColor: statusColors.light.replace('bg-', 'rgb-').replace('/20', '/5') }}
                    >
                      {/* Highlight effect on hover */}
                      <motion.div 
                        className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"
                        style={{ background: `radial-gradient(circle at 50% 50%, ${statusColors.glow}, transparent 70%)` }}
                      />
                      
                      {/* Status indicator line */}
                      <motion.div 
                        className={`absolute left-0 top-0 bottom-0 w-1 ${statusColors.bg}`}
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                      
                      <div className="col-span-4 flex items-center">
                        <motion.div 
                          className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden mr-3 flex-shrink-0 group-hover:shadow-lg transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <img 
                            src={station.image} 
                            alt={station.name} 
                            className="h-full w-full object-cover"
                          />
                        </motion.div>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white flex items-center">
                            {station.name}
                            {station.maxPoints >= 100 && (
                              <motion.div 
                                className="ml-2 text-amber-500"
                                animate={{ rotate: [0, 15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                              >
                                <Star size={14} fill="currentColor" />
                              </motion.div>
                            )}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                            <MapPin size={10} className="mr-1" /> {station.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <motion.span 
                          className={`
                            inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                            ${statusColors.light} ${statusColors.text} ring-1 ${statusColors.ring} backdrop-blur-sm
                          `}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          {station.status === 'active' ? 'Aktiv' : station.status === 'inactive' ? 'Inaktiv' : 'Geplant'}
                        </motion.span>
                      </div>
                      
                      <div className="col-span-2 text-slate-900 dark:text-white flex items-center">
                        <motion.div 
                          className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-2 text-indigo-600 dark:text-indigo-400"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          <Users size={12} />
                        </motion.div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                          {station.participants}
                        </motion.span>
                      </div>
                      
                      <div className="col-span-2 text-slate-900 dark:text-white flex items-center">
                        <motion.div 
                          className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2 text-purple-600 dark:text-purple-400"
                          whileHover={{ scale: 1.2, rotate: -10 }}
                        >
                          <Clock size={12} />
                        </motion.div>
                        {station.nextEvent} Uhr
                      </div>
                      
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.15, y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link 
                            to={`/stations/${station.id}/score`}
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors interactive"
                          >
                            <Check size={18} />
                          </Link>
                          <motion.div 
                            className="absolute inset-0 bg-indigo-500/20 rounded-lg -z-10 opacity-0 hover:opacity-100 blur-md transition-opacity duration-200"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.15, y: -2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link 
                            to={`/stations/${station.id}`}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors interactive"
                          >
                            <Settings size={18} />
                          </Link>
                          <motion.div 
                            className="absolute inset-0 bg-slate-500/20 rounded-lg -z-10 opacity-0 hover:opacity-100 blur-md transition-opacity duration-200"
                          />
                        </motion.div>
                        
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.15, y: -2, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <button 
                            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors interactive"
                          >
                            <MoreVertical size={18} />
                          </button>
                          <motion.div 
                            className="absolute inset-0 bg-slate-500/20 rounded-lg -z-10 opacity-0 hover:opacity-100 blur-md transition-opacity duration-200"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Ultra Modern Add button in list view */}
              <motion.div 
                className="p-5 flex justify-center border-t border-slate-100 dark:border-slate-700 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.button 
                  className="relative flex items-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 interactive overflow-hidden group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 -z-10"
                    animate={{
                      background: [
                        'linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(79,70,229,1) 100%)',
                        'linear-gradient(180deg, rgba(99,102,241,1) 0%, rgba(79,70,229,1) 100%)',
                        'linear-gradient(270deg, rgba(99,102,241,1) 0%, rgba(79,70,229,1) 100%)',
                        'linear-gradient(0deg, rgba(99,102,241,1) 0%, rgba(79,70,229,1) 100%)',
                        'linear-gradient(90deg, rgba(99,102,241,1) 0%, rgba(79,70,229,1) 100%)'
                      ]
                    }}
                    transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                  />
                  
                  {/* Particle effect */}
                  <motion.div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{ 
                          x: '50%', 
                          y: '50%', 
                          opacity: 0 
                        }}
                        animate={{ 
                          x: `${Math.random() * 100}%`, 
                          y: `${Math.random() * 100}%`, 
                          opacity: [0, 1, 0] 
                        }}
                        transition={{ 
                          duration: 1 + Math.random(), 
                          repeat: Infinity, 
                          repeatType: 'loop',
                          delay: i * 0.1
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                    className="mr-2"
                  >
                    <Plus size={18} />
                  </motion.div>
                  Neue Station hinzufügen
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Flow View - Ultra Modern Version */}
        {viewMode === 'flow' && (
          <motion.div 
            className="w-full relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            key="flow-view"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Active stations column */}
              <motion.div 
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-emerald-500/10 backdrop-blur-lg border border-emerald-500/30 rounded-xl p-4 mb-2 flex items-center justify-between">
                  <h3 className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                    <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                    Aktive Stationen
                  </h3>
                  <motion.div 
                    className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {stations.filter(s => s.status === 'active').length}
                  </motion.div>
                </div>
                
                {filteredStations
                  .filter(station => station.status === 'active')
                  .map((station, i) => (
                  <motion.div
                    key={station.id}
                    custom={i}
                    variants={flowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-xl border border-emerald-200/40 dark:border-emerald-900/40 shadow-lg overflow-hidden cursor-pointer relative"
                  >
                    {/* Glow effect */}
                    <motion.div 
                      className="absolute -inset-0.5 bg-emerald-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"
                    />
                    
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={station.image} 
                        alt={station.name} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-3">
                        <h3 className="text-white font-medium">{station.name}</h3>
                        <div className="flex items-center text-white/80 text-xs">
                          <MapPin size={10} className="mr-1" /> {station.location}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <motion.span 
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50"
                          whileHover={{ scale: 1.1 }}
                        >
                          Aktiv
                        </motion.span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Users size={12} className="mr-1" /> {station.participants} Teilnehmer
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Clock size={12} className="mr-1" /> {station.nextEvent} Uhr
                        </div>
                      </div>
                      
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Fortschritt</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{station.progress}%</span>
                      </div>
                      <motion.div 
                        className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${station.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                        />
                      </motion.div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg p-1 rounded-l-lg shadow-lg border border-emerald-200/40 dark:border-emerald-900/40">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.2 }}
                          className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors cursor-pointer"
                        >
                          <Link to={`/stations/${station.id}/score`}>
                            <Check size={14} />
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.2 }}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-md transition-colors cursor-pointer mt-1"
                        >
                          <Link to={`/stations/${station.id}`}>
                            <Settings size={14} />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-2 flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-emerald-300/30 dark:border-emerald-700/30 hover:border-emerald-500 dark:hover:border-emerald-500/70 text-emerald-600 dark:text-emerald-400 cursor-pointer bg-white/30 dark:bg-slate-800/30 backdrop-blur-md transition-colors group"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    className="mr-2"
                  >
                    <Plus size={16} />
                  </motion.div>
                  <span>Aktive Station hinzufügen</span>
                  
                  <motion.div 
                    className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-xl blur-md"
                  />
                </motion.div>
              </motion.div>
              
              {/* Scheduled stations column */}
              <motion.div 
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-amber-500/10 backdrop-blur-lg border border-amber-500/30 rounded-xl p-4 mb-2 flex items-center justify-between">
                  <h3 className="text-amber-600 dark:text-amber-400 font-medium flex items-center">
                    <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                    Geplante Stationen
                  </h3>
                  <motion.div 
                    className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {stations.filter(s => s.status === 'scheduled').length}
                  </motion.div>
                </div>
                
                {filteredStations
                  .filter(station => station.status === 'scheduled')
                  .map((station, i) => (
                  <motion.div
                    key={station.id}
                    custom={i}
                    variants={flowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-xl border border-amber-200/40 dark:border-amber-900/40 shadow-lg overflow-hidden cursor-pointer relative"
                  >
                    {/* Glow effect */}
                    <motion.div 
                      className="absolute -inset-0.5 bg-amber-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"
                    />
                    
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={station.image} 
                        alt={station.name} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-3">
                        <h3 className="text-white font-medium">{station.name}</h3>
                        <div className="flex items-center text-white/80 text-xs">
                          <MapPin size={10} className="mr-1" /> {station.location}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <motion.span 
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50"
                          whileHover={{ scale: 1.1 }}
                        >
                          Geplant
                        </motion.span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Users size={12} className="mr-1" /> {station.participants} Teilnehmer
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Clock size={12} className="mr-1" /> {station.nextEvent} Uhr
                        </div>
                      </div>
                      
                      <motion.div 
                        className="h-8 flex items-center justify-center border border-amber-200 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg text-xs text-amber-700 dark:text-amber-400"
                        whileHover={{ scale: 1.03 }}
                      >
                        <motion.div 
                          className="mr-1.5"
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          <Clock size={12} />
                        </motion.div>
                        Station startet bald
                      </motion.div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg p-1 rounded-l-lg shadow-lg border border-amber-200/40 dark:border-amber-900/40">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.2 }}
                          className="p-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors cursor-pointer"
                        >
                          <Link to={`/stations/${station.id}/score`}>
                            <Check size={14} />
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.2 }}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-md transition-colors cursor-pointer mt-1"
                        >
                          <Link to={`/stations/${station.id}`}>
                            <Settings size={14} />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-2 flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-amber-300/30 dark:border-amber-700/30 hover:border-amber-500 dark:hover:border-amber-500/70 text-amber-600 dark:text-amber-400 cursor-pointer bg-white/30 dark:bg-slate-800/30 backdrop-blur-md transition-colors group"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    className="mr-2"
                  >
                    <Plus size={16} />
                  </motion.div>
                  <span>Geplante Station hinzufügen</span>
                  
                  <motion.div 
                    className="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-xl blur-md"
                  />
                </motion.div>
              </motion.div>
              
              {/* Inactive stations column */}
              <motion.div 
                className="flex flex-col gap-4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-xl p-4 mb-2 flex items-center justify-between">
                  <h3 className="text-red-600 dark:text-red-400 font-medium flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    Inaktive Stationen
                  </h3>
                  <motion.div 
                    className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {stations.filter(s => s.status === 'inactive').length}
                  </motion.div>
                </div>
                
                {filteredStations
                  .filter(station => station.status === 'inactive')
                  .map((station, i) => (
                  <motion.div
                    key={station.id}
                    custom={i}
                    variants={flowVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.15)" }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-xl border border-red-200/40 dark:border-red-900/40 shadow-lg overflow-hidden cursor-pointer relative"
                  >
                    {/* Glow effect */}
                    <motion.div 
                      className="absolute -inset-0.5 bg-red-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"
                    />
                    
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={station.image} 
                        alt={station.name} 
                        className="h-full w-full object-cover grayscale"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-3">
                        <h3 className="text-white font-medium">{station.name}</h3>
                        <div className="flex items-center text-white/80 text-xs">
                          <MapPin size={10} className="mr-1" /> {station.location}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <motion.span 
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 ring-1 ring-red-500/50"
                          whileHover={{ scale: 1.1 }}
                        >
                          Inaktiv
                        </motion.span>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Users size={12} className="mr-1" /> {station.participants} Teilnehmer
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <Clock size={12} className="mr-1" /> {station.nextEvent} Uhr
                        </div>
                      </div>
                      
                      <motion.div 
                        className="h-8 flex items-center justify-center border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-lg text-xs text-red-700 dark:text-red-400"
                        whileHover={{ scale: 1.03 }}
                      >
                        Station deaktiviert
                      </motion.div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg p-1 rounded-l-lg shadow-lg border border-red-200/40 dark:border-red-900/40">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.2 }}
                          className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors cursor-pointer"
                        >
                          <Link to={`/stations/${station.id}/score`}>
                            <Check size={14} />
                          </Link>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ duration: 0.2 }}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/70 rounded-md transition-colors cursor-pointer mt-1"
                        >
                          <Link to={`/stations/${station.id}`}>
                            <Settings size={14} />
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-2 flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-red-300/30 dark:border-red-700/30 hover:border-red-500 dark:hover:border-red-500/70 text-red-600 dark:text-red-400 cursor-pointer bg-white/30 dark:bg-slate-800/30 backdrop-blur-md transition-colors group"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    className="mr-2"
                  >
                    <Plus size={16} />
                  </motion.div>
                  <span>Inaktive Station hinzufügen</span>
                  
                  <motion.div 
                    className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-xl blur-md"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Map View - Ultra Modern 3D Version */}
        {viewMode === 'map' && (
          <motion.div 
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl overflow-hidden h-[650px] relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            key="map-view"
            style={get3DTransform(0.2)}
          >
            {/* 3D Field with Stations */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-100/40 to-green-200/30 dark:from-green-900/30 dark:to-green-800/20"></div>
            
            {/* Field lines with animation */}
            <motion.div 
              className="absolute top-1/4 left-0 right-0 h-px bg-white/30 dark:bg-white/15"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            />
            <motion.div 
              className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50 dark:bg-white/25"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <motion.div 
              className="absolute top-3/4 left-0 right-0 h-px bg-white/30 dark:bg-white/15"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            />
            <motion.div 
              className="absolute left-1/4 top-0 bottom-0 w-px bg-white/30 dark:bg-white/15"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div 
              className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 dark:bg-white/25"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            />
            <motion.div 
              className="absolute left-3/4 top-0 bottom-0 w-px bg-white/30 dark:bg-white/15"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            />
            
            {/* Animated Gradient */}
            <motion.div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              animate={{ 
                background: [
                  'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.5), transparent 60%)',
                  'radial-gradient(circle at 70% 60%, rgba(99, 102, 241, 0.5), transparent 60%)',
                  'radial-gradient(circle at 30% 80%, rgba(99, 102, 241, 0.5), transparent 60%)',
                  'radial-gradient(circle at 70% 20%, rgba(99, 102, 241, 0.5), transparent 60%)',
                  'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.5), transparent 60%)',
                ]
              }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
            />
            
            {/* Station Markers */}
            {stations.map((station, i) => {
              const positions = [
                { top: '30%', left: '20%' },
                { top: '40%', left: '70%' },
                { top: '70%', left: '80%' },
                { top: '60%', left: '30%' },
                { top: '20%', left: '50%' }
              ];
              const statusColors = getStatusColor(station.status);
              
              return (
                <div 
                  key={station.id} 
                  className="absolute" 
                  style={positions[i]}
                >
                  <motion.div 
                    className="w-14 h-14 -mt-7 -ml-7 relative cursor-pointer interactive"
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: 0.8 + i * 0.1 
                    }}
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div 
                      className={`absolute inset-0 ${statusColors.bg}/30 rounded-full`}
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 0.2, 0.7]
                      }}
                      transition={{ 
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    <motion.div 
                      className={`absolute inset-0 ${statusColors.bg} rounded-full scale-[0.4] flex items-center justify-center text-white font-bold shadow-lg`}
                      whileHover={{ scale: 0.5 }}
                    >
                      {station.id}
                    </motion.div>
                    
                    <motion.div 
                      className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg px-3 py-1.5 rounded-xl text-xs font-medium shadow-xl border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap z-10 min-w-[100px] text-center"
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 30,
                        delay: 1 + i * 0.1 
                      }}
                    >
                      <div className="font-bold text-slate-900 dark:text-white">{station.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-center">
                        <MapPin size={8} className="mr-0.5" /> {station.location}
                      </div>
                    </motion.div>
                    
                    {/* Connection Line */}
                    <motion.div 
                      className="absolute bottom-0 left-1/2 w-px h-5 bg-slate-300 dark:bg-slate-600"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, delay: 1.2 + i * 0.1 }}
                    />
                    
                    {/* Popup Information on Hover */}
                    <AnimatePresence>
                      {hoveredStation === station.id && (
                        <motion.div 
                          className="absolute -right-4 top-0 w-[200px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 p-3 z-20 text-xs"
                          initial={{ opacity: 0, scale: 0.8, x: -20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.8, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-1.5 py-0.5 rounded-full ${statusColors.light} ${statusColors.text} text-[10px] font-medium`}>
                              {station.status === 'active' ? 'Aktiv' : station.status === 'inactive' ? 'Inaktiv' : 'Geplant'}
                            </span>
                            <span className="font-medium text-slate-500">{station.nextEvent} Uhr</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Teilnehmer:</span>
                              <span className="font-medium text-slate-900 dark:text-white">{station.participants}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Max Punkte:</span>
                              <span className="font-medium text-slate-900 dark:text-white">{station.maxPoints}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Fortschritt:</span>
                              <span className="font-medium text-slate-900 dark:text-white">{station.progress}%</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-1">
                            <Link 
                              to={`/stations/${station.id}`}
                              className="flex-1 text-center py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                            >
                              Details
                            </Link>
                            <Link 
                              to={`/stations/${station.id}/score`}
                              className="flex-1 text-center py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                            >
                              Punkte
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
            
            {/* Map Legend with Interactive Animations */}
            <motion.div 
              className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-xl p-3.5 shadow-xl border border-slate-200/60 dark:border-slate-700/60"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
            >
              <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2 flex items-center">
                <Map size={14} className="mr-1.5 text-indigo-500" /> Legende
              </h3>
              
              <div className="space-y-2.5">
                <motion.div 
                  className="flex items-center gap-2 group"
                  whileHover={{ x: 3 }}
                >
                  <motion.div 
                    className="w-3 h-3 bg-emerald-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">Aktive Station</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 group"
                  whileHover={{ x: 3 }}
                >
                  <motion.div 
                    className="w-3 h-3 bg-amber-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">Geplante Station</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 group"
                  whileHover={{ x: 3 }}
                >
                  <motion.div 
                    className="w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">Inaktive Station</span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Map Navigation */}
            <motion.div 
              className="absolute bottom-6 right-6 flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <motion.button 
                className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200 interactive"
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ y: 0, scale: 0.95 }}
              >
                <Plus size={18} />
              </motion.button>
              <motion.button 
                className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200 interactive"
                whileHover={{ y: -2, scale: 1.1 }}
                whileTap={{ y: 0, scale: 0.95 }}
              >
                <div className="w-4 h-0.5 bg-current"></div>
              </motion.button>
              <motion.button 
                className="w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-200 interactive"
                whileHover={{ y: -2, scale: 1.1, rotate: 45 }}
                whileTap={{ y: 0, scale: 0.95, rotate: 0 }}
              >
                <div className="relative">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-0.5 h-4 bg-current absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                </div>
              </motion.button>
            </motion.div>
            
            {/* Compass */}
            <motion.div 
              className="absolute top-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-full p-2 shadow-xl border border-slate-200/60 dark:border-slate-700/60 w-14 h-14 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 1.5
              }}
            >
              <motion.div 
                className="w-full h-full rounded-full relative"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute h-1 w-1/2 top-1/2 left-1/2 -translate-y-1/2">
                  <div className="h-1 w-1/2 bg-indigo-600 rounded-full"></div>
                </div>
                <div className="absolute h-5 w-5 rounded-full bg-white dark:bg-slate-800 border-2 border-indigo-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] font-bold text-indigo-600">N</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-500">S</div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-500">W</div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] font-bold text-slate-500">O</div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add CSS for the glow effect and animated gradients */}
      <style jsx>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 8s ease infinite;
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(99, 102, 241, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(99, 102, 241, 0.5);
          }
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .interactive {
          will-change: transform;
        }
      `}</style>
    </motion.div>
  );
};

export default StationsPage;