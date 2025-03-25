




// import React, { useState, useEffect } from 'react';
// import { Outlet } from 'react-router-dom';
// import { Bell, Search, User, MoonStar, X, Plus, Zap } from 'lucide-react';
// import FuturisticSidebar from './Sidebar';

// const FuturisticLayout = () => {
//   const [isDarkMode, setIsDarkMode] = useState(
//     localStorage.getItem('sportapp-theme') === 'dark' || 
//     (!localStorage.getItem('sportapp-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
//   );
//   const [searchActive, setSearchActive] = useState(false);
//   const [notificationsOpen, setNotificationsOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//   };

//   // Apply dark mode class to HTML element
//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
    
//     // Save preference to localStorage
//     localStorage.setItem('sportapp-theme', isDarkMode ? 'dark' : 'light');
//   }, [isDarkMode]);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const notifications = [
//     {
//       id: 1,
//       title: 'Neue Teilnehmer',
//       description: '12 neue Teilnehmer haben sich angemeldet',
//       time: 'Vor 5 Minuten',
//       unread: true
//     },
//     {
//       id: 2,
//       title: 'Station 3 inaktiv',
//       description: 'Staffellauf Station benötigt Aufmerksamkeit',
//       time: 'Vor 27 Minuten',
//       unread: true
//     },
//     {
//       id: 3,
//       title: 'Ergebnisse aktualisiert',
//       description: 'Die Rangliste wurde mit neuen Punkten aktualisiert',
//       time: 'Vor 2 Stunden',
//       unread: false
//     },
//   ];

//   const transitionClasses = "transition-all duration-300 ease-in-out";

//   return (
//     <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
//       <FuturisticSidebar darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
//       <div className="sm:ml-20 md:ml-[84px] lg:ml-[280px] min-h-screen transition-all duration-300">
//         {/* Header - Futuristic Style */}
//         <header className="sticky top-0 z-30 h-16 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
//           {/* Futuristic Scanner Line Animation */}
//           <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
//             <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent scanner-line"></div>
//           </div>
          
//           <div className="h-full px-4 md:px-6 flex items-center justify-between">
//             {/* Search Bar with Cyberpunk Style */}
//             {searchActive ? (
//               <div 
//                 className="relative w-full max-w-xl animate-fade-in"
//               >
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//                 <input 
//                   type="text" 
//                   placeholder="Suchen..." 
//                   autoFocus
//                   className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-10 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
//                 />
//                 <button 
//                   onClick={() => setSearchActive(false)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 onClick={() => setSearchActive(true)}
//                 className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105"
//               >
//                 <Search size={18} />
//               </button>
//             )}
            
//             {/* Actions - Cyberpunk Style */}
//             <div className="flex items-center space-x-3">
//               {/* Quick Add Button */}
//               <button 
//                 className="hidden md:flex items-center px-3 h-10 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-md shadow-indigo-500/20 transition-all duration-200 hover:bg-indigo-700 hover:scale-105 glow-sm"
//               >
//                 <Plus size={16} className="mr-1" /> Neu
//               </button>
              
//               {/* Notifications - Cyberpunk Style */}
//               <div className="relative">
//                 <button 
//                   onClick={() => setNotificationsOpen(!notificationsOpen)}
//                   className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105"
//                 >
//                   <Bell size={18} />
//                   {/* Glowing notification indicator */}
//                   <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800 glow-sm"></span>
//                 </button>
                
//                 {/* Notifications Dropdown - Futuristic Style */}
//                 {notificationsOpen && (
//                   <div 
//                     className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-fade-in"
//                   >
//                     {/* Futuristic Scanner Line Animation */}
//                     <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
//                       <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent scanner-line"></div>
//                     </div>
                    
//                     {/* Cyberpunk Corner Accents */}
//                     <div className="absolute top-0 left-0 w-8 h-1 bg-indigo-500"></div>
//                     <div className="absolute top-0 left-0 w-1 h-8 bg-indigo-500"></div>
                    
//                     <div className="p-4 border-b border-slate-100 dark:border-slate-700">
//                       <div className="flex items-center justify-between">
//                         <h3 className="font-medium text-slate-900 dark:text-white">Benachrichtigungen</h3>
//                         <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
//                           Alle markieren
//                         </button>
//                       </div>
//                     </div>
//                     <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
//                       {notifications.map(notification => (
//                         <div 
//                           key={notification.id} 
//                           className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200 ${
//                             notification.unread ? 'bg-indigo-50/50 dark:bg-slate-700/10' : ''
//                           }`}
//                         >
//                           <div className="flex">
//                             <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0">
//                               <Zap size={16} />
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-slate-900 dark:text-white text-sm flex items-center">
//                                 {notification.title}
//                                 {notification.unread && (
//                                   <span className="ml-2 inline-block h-2 w-2 rounded-full bg-indigo-500 glow-sm"></span>
//                                 )}
//                               </h4>
//                               <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
//                                 {notification.description}
//                               </p>
//                               <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
//                                 {notification.time}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="p-3 bg-slate-50 dark:bg-slate-700/30 flex justify-center">
//                       <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
//                         Alle Benachrichtigungen anzeigen
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {/* Theme Toggle (on smaller screens) */}
//               <button 
//                 onClick={toggleDarkMode}
//                 className="md:hidden w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105"
//               >
//                 <MoonStar size={18} />
//               </button>
              
//               {/* User Avatar - Cyberpunk Style */}
//               <div 
//                 className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex-shrink-0 overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
//               >
//                 <img 
//                   src="/api/placeholder/40/40" 
//                   alt="User" 
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//             </div>
//           </div>
//         </header>
        
//         {/* Main Content */}
//         <main className="min-h-[calc(100vh-4rem)]">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default FuturisticLayout;
















import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Users, 
  MoonStar, 
  X, 
  Plus, 
  Zap, 
  Download, 
  Menu, 
  ArrowRight, 
  MessageSquare,
  Mic,
  Command,
  Sparkles,
  Info,
  PanelRight,
  AlertCircle,
  Database,
} from 'lucide-react';
import UltraModernSidebar from './Sidebar';
import userIMG from '../assets/user.png';

const UltraModernLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('sportapp-theme') === 'dark' || 
    (!localStorage.getItem('sportapp-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const [searchActive, setSearchActive] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('sportapp-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Track scroll position for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track mouse position for 3D effects
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'Neue Teilnehmer',
      description: '12 neue Teilnehmer haben sich angemeldet',
      time: 'Vor 5 Minuten',
      unread: true,
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 2,
      title: 'Station 3 inaktiv',
      description: 'Staffellauf Station benötigt Aufmerksamkeit',
      time: 'Vor 27 Minuten',
      unread: true,
      icon: <AlertCircle className="h-4 w-4" />
    },
    {
      id: 3,
      title: 'Ergebnisse aktualisiert',
      description: 'Die Rangliste wurde mit neuen Punkten aktualisiert',
      time: 'Vor 2 Stunden',
      unread: false,
      icon: <Database className="h-4 w-4" />
    },
  ];

  // AI Assistant sample messages
  const aiMessages = [
    { id: 1, text: "Hallo! Ich bin dein SportApp-Assistent. Wie kann ich dir helfen?", sender: "ai" },
    { id: 2, text: "Ich brauche eine Übersicht der aktiven Stationen", sender: "user" },
    { id: 3, text: "Ich zeige dir die aktuell aktiven Stationen und deren Status:", sender: "ai" },
    { id: 4, text: "• Station 1: Staffellauf (aktiv, 12 Teilnehmer)\n• Station 2: Weitsprung (aktiv, 8 Teilnehmer)\n• Station 3: Kugelstoßen (inaktiv)\n• Station 4: Sprint (aktiv, 5 Teilnehmer)", sender: "ai" },
  ];

  // Get 3D transform based on mouse position
  const get3DTransform = (factor = 1) => {
    const rotateX = (mousePosition.y - 0.5) * 5 * factor;
    const rotateY = (mousePosition.x - 0.5) * -5 * factor;
    
    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s',
    };
  };

  return (
    <div className={`
      min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 
      ${mounted ? 'opacity-100' : 'opacity-0'}
    `}>
      <UltraModernSidebar darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="sm:ml-20 md:ml-[84px] lg:ml-[280px] min-h-screen transition-all duration-300">
        {/* Ultra Modern Futuristic Header */}
        <header 
          ref={headerRef}
          className={`
            sticky top-0 z-30 backdrop-blur-md 
            transition-all duration-300
            ${scrolled 
              ? 'h-14 shadow-md shadow-slate-200/30 dark:shadow-slate-900/30' 
              : 'h-16'}
            ${scrolled
              ? 'bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50' 
              : 'bg-transparent'}
          `}
        >
          {/* Interactive Holographic Scanner Line */}
          <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent holographic-scanner"></div>
          </div>
          
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            {/* Command Bar - Futuristic Search with Voice & AI */}
            <div className={`
              relative w-full max-w-2xl transition-all duration-300 
              ${searchActive ? 'scale-105' : ''}
            `}>
              <div className={`
                flex items-center bg-white dark:bg-slate-800 
                rounded-xl border border-slate-200/50 dark:border-slate-700/50
                shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600
                transition-all duration-300
                ${searchActive ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''}
              `}>
                {/* Search Icon */}
                <div className="pl-3 pr-2">
                  <Search className={`w-4 h-4 text-slate-400 transition-all duration-300 ${searchActive ? 'text-indigo-500 dark:text-indigo-400' : ''}`} />
                </div>
                
                {/* Search Input */}
                <input 
                  type="text" 
                  placeholder={searchActive ? "Suchen..." : "Tippe '/' um zu suchen..."}
                  className="h-10 flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder-slate-400"
                  onFocus={() => setSearchActive(true)}
                  onBlur={() => setSearchActive(false)}
                />
                
                {/* Command Helper */}
                {!searchActive && (
                  <div className="hidden sm:flex items-center mr-2 text-xs text-slate-400">
                    <div className="h-5 w-5 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center mr-1">
                      <span>/</span>
                    </div>
                  </div>
                )}
                
                {/* Voice Search */}
                <button className={`
                  h-8 w-8 flex items-center justify-center rounded-lg
                  text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400
                  transition-all duration-300 mr-1
                `}>
                  <Mic className="w-4 h-4" />
                </button>
                
                {/* AI Search */}
                <button 
                  onClick={() => setAiAssistantOpen(true)}
                  className={`
                    h-8 w-8 flex items-center justify-center rounded-lg
                    text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400
                    transition-all duration-300 mr-1
                    ${aiAssistantOpen ? 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' : ''}
                  `}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center ml-4 space-x-2 sm:space-x-3">
              {/* Help Button */}
              <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105">
                <Info className="h-4 w-4" />
              </button>
              
              {/* Quick Add Button */}
              <button className="hidden sm:flex h-9 items-center px-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium shadow-sm hover:shadow-md hover:shadow-indigo-500/20 transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-1" /> Neu
              </button>
              
              {/* Notifications Button */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105"
                >
                  <Bell className="h-4 w-4" />
                  
                  {/* Notification Badge */}
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800">
                    <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                  </span>
                </button>
                
                {/* Notifications Dropdown - Ultra Modern Design */}
                {notificationsOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-fade-in"
                    style={get3DTransform(0.3)}
                  >
                    {/* Gradient Border */}
                    <div className="absolute inset-0 rounded-2xl p-[1px] -z-10">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-border"></div>
                    </div>
                    
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-slate-900 dark:text-white flex items-center">
                          <Bell className="w-4 h-4 mr-2 text-indigo-500" />
                          Benachrichtigungen
                        </h3>
                        <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                          Alle markieren
                        </button>
                      </div>
                    </div>
                    
                    {/* Notifications List */}
                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`
                            p-4 border-b border-slate-100 dark:border-slate-700 
                            hover:bg-slate-50 dark:hover:bg-slate-700/30 
                            transition-colors duration-200
                            ${notification.unread ? 'bg-indigo-50/50 dark:bg-slate-700/10' : ''}
                          `}
                        >
                          <div className="flex">
                            <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0">
                              {notification.icon || <Zap className="h-4 w-4" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 dark:text-white text-sm flex items-center">
                                {notification.title}
                                {notification.unread && (
                                  <span className="ml-2 inline-block h-2 w-2 rounded-full bg-indigo-500">
                                    <span className="absolute h-2 w-2 rounded-full bg-indigo-500 animate-ping opacity-75"></span>
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {notification.description}
                              </p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/30 flex justify-center">
                      <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center">
                        Alle anzeigen <ArrowRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Dark Mode Toggle (Mobile Only) */}
              <button 
                onClick={toggleDarkMode}
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105"
              >
                <MoonStar className="h-4 w-4" />
              </button>
              
              {/* User Avatar */}
              <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex-shrink-0 overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-200">
                <img 
                  src= {userIMG} 
                  alt="User" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>
        
        {/* AI Assistant Panel */}
        <div 
          className={`
            fixed bottom-4 right-4 lg:right-8 w-80 sm:w-96 h-[600px] max-h-[calc(100vh-120px)]
            rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700
            transition-all duration-500 transform-gpu z-40
            ${aiAssistantOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}
          `}
          style={get3DTransform(0.2)}
        >
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-2xl p-[1px] -z-10">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 animate-gradient-border"></div>
          </div>
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-3">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">AI Assistent</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Claude</p>
              </div>
            </div>
            <button 
              onClick={() => setAiAssistantOpen(false)}
              className="h-7 w-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="h-[calc(100%-128px)] overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-4">
              {aiMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`
                    flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
                  `}
                >
                  <div 
                    className={`
                      max-w-[85%] rounded-xl p-3
                      ${message.sender === 'user' 
                        ? 'bg-indigo-500 text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'}
                    `}
                  >
                    <div className="text-sm whitespace-pre-line">{message.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-2">
              <input 
                type="text" 
                placeholder="Nachricht an AI Assistent..." 
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-900 dark:text-white placeholder-slate-400" 
              />
              <button className="h-8 w-8 flex items-center justify-center rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center">
                <Command className="h-3 w-3 mr-1" />
                <span>+K für Befehle</span>
              </div>
              <button className="flex items-center">
                <Mic className="h-3 w-3 mr-1" />
                <span>Sprachmodus</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
        
        {/* Floating Action Button for Mobile */}
        <button 
          onClick={() => setAiAssistantOpen(true)}
          className={`
            fixed right-4 bottom-4 md:hidden
            h-12 w-12 rounded-full 
            flex items-center justify-center
            bg-gradient-to-r from-indigo-600 to-violet-600
            text-white shadow-lg hover:shadow-xl
            hover:scale-110 transition-all duration-300 z-30
            ${aiAssistantOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
        >
          <div className="absolute inset-0 rounded-full bg-indigo-500 blur-md opacity-30"></div>
          <Sparkles className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default UltraModernLayout;