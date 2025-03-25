




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
  Sun,
  Moon, 
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
  Clock,
  Settings,
  Star,
  CircleDashed,
  HeartPulse
} from 'lucide-react';
import UltraModernSidebar from './Sidebar';
import userIMG from '../assets/user.png';

const ArtisticLayout = () => {
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);
  
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
    
    // Gradients
    gradients: {
      gold: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      azure: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      sunset: 'linear-gradient(135deg, #f83600 0%, #f9d423 100%)',
      morning: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      leaf: 'linear-gradient(135deg, #9be15d 0%, #00e3ae 100%)',
      lavender: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
      primary: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
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
    
    // Category colors
    categories: {
      participants: '#5b9bd5',
      stations: '#71b16a',
      points: '#ec9e52',
      medals: '#e191bf'
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Current theme colors
  const t = isDarkMode ? colors.dark : colors.light;

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

  // Track mouse position for artistic effects
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
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

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: 'Neue Teilnehmer',
      description: '12 neue Teilnehmer haben sich angemeldet',
      time: 'Vor 5 Minuten',
      unread: true,
      icon: <Users size={16} />,
      color: colors.categories.participants
    },
    {
      id: 2,
      title: 'Station 3 inaktiv',
      description: 'Staffellauf Station benötigt Aufmerksamkeit',
      time: 'Vor 27 Minuten',
      unread: true,
      icon: <AlertCircle size={16} />,
      color: colors.categories.stations
    },
    {
      id: 3,
      title: 'Ergebnisse aktualisiert',
      description: 'Die Rangliste wurde mit neuen Punkten aktualisiert',
      time: 'Vor 2 Stunden',
      unread: false,
      icon: <Database size={16} />,
      color: colors.categories.medals
    },
  ];

  // AI Assistant sample messages
  const aiMessages = [
    { id: 1, text: "Hallo! Ich bin dein SportApp-Assistent. Wie kann ich dir helfen?", sender: "ai" },
    { id: 2, text: "Ich brauche eine Übersicht der aktiven Stationen", sender: "user" },
    { id: 3, text: "Ich zeige dir die aktuell aktiven Stationen und deren Status:", sender: "ai" },
    { id: 4, text: "• Station 1: Staffellauf (aktiv, 12 Teilnehmer)\n• Station 2: Weitsprung (aktiv, 8 Teilnehmer)\n• Station 3: Kugelstoßen (inaktiv)\n• Station 4: Sprint (aktiv, 5 Teilnehmer)", sender: "ai" },
  ];

  // Artistic transform effect
  const getArtisticTransform = (factor = 1, elementIndex = 0) => {
    // Calculate rotation based on mouse position
    const rotateX = (mousePosition.y - 0.5) * 2 * factor;
    const rotateY = (mousePosition.x - 0.5) * -2 * factor;
    
    // Add subtle float effect unique to each element
    const floatOffset = Math.sin(Date.now() / 2000 + elementIndex) * 1;
    
    return {
      transform: `perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${floatOffset}px)`,
      transition: 'transform 0.3s ease-out',
    };
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ 
        background: t.bg,
        color: t.text,
        opacity: mounted ? 1 : 0
      }}
    >
      {/* Artistic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Radial gradient backgrounds */}
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
          {[...Array(15)].map((_, i) => (
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
          className="absolute inset-0 h-full w-full opacity-[0.04] pointer-events-none"
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
      
      <UltraModernSidebar darkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="sm:ml-20 md:ml-[84px] lg:ml-[280px] min-h-screen transition-all duration-300 relative z-10">
        {/* Artistic Header */}
        <header 
          ref={headerRef}
          className="sticky top-0 z-30 backdrop-blur-md transition-all duration-500"
          style={{
            height: scrolled ? '60px' : '70px',
            background: scrolled ? `${t.surface}90` : 'transparent',
            borderBottom: scrolled ? `1px solid ${t.border}` : 'none',
            boxShadow: scrolled ? t.shadow : 'none'
          }}
        >
          {/* Subtle top accent line */}
          <div 
            className="absolute top-0 left-0 right-0 h-px opacity-30"
            style={{ 
              background: `linear-gradient(to right, ${colors.primary}00, ${colors.primary}40, ${colors.primary}00)` 
            }}
          ></div>
          
          <div className="h-full px-5 md:px-8 flex items-center justify-between relative">
            {/* Artistic Search Bar */}
            <div 
              className="relative w-full max-w-2xl transition-all duration-300"
              style={{ transform: searchActive ? 'scale(1.03)' : 'scale(1)' }}
            >
              <div 
                className="flex items-center h-10 rounded-full overflow-hidden transition-all duration-300"
                style={{
                  background: t.surface,
                  border: `1px solid ${searchActive ? colors.primary : t.border}`,
                  boxShadow: searchActive ? `0 0 0 1px ${colors.primary}30` : 'none'
                }}
              >
                {/* Search Icon */}
                <div className="pl-4 pr-2">
                  <Search 
                    size={16} 
                    style={{ 
                      color: searchActive ? colors.primary : t.textSecondary,
                      transition: 'color 0.3s ease'
                    }} 
                  />
                </div>
                
                {/* Search Input */}
                <input 
                  type="text" 
                  placeholder={searchActive ? "Suchen..." : "Tippe '/' um zu suchen..."}
                  className="h-full flex-1 bg-transparent border-none focus:outline-none text-sm placeholder-opacity-70"
                  style={{ 
                    color: t.text,
                    caretColor: colors.primary
                  }}
                  onFocus={() => setSearchActive(true)}
                  onBlur={() => setSearchActive(false)}
                />
                
                {/* Shortcut Key */}
                {!searchActive && (
                  <div 
                    className="hidden sm:flex items-center mr-2 text-xs"
                    style={{ color: t.textSecondary }}
                  >
                    <div 
                      className="h-5 w-5 rounded flex items-center justify-center mr-1"
                      style={{ 
                        border: `1px solid ${t.borderAccent}`,
                        background: t.bg
                      }}
                    >
                      <span>/</span>
                    </div>
                  </div>
                )}
                
                {/* Voice Search */}
                <button 
                  className="h-8 w-8 flex items-center justify-center rounded-full mr-1 transition-all duration-200"
                  style={{ 
                    color: t.textSecondary,
                    ':hover': { color: colors.primary }
                  }}
                >
                  <Mic size={15} />
                </button>
                
                {/* AI Search */}
                <button 
                  onClick={() => setAiAssistantOpen(true)}
                  className="h-8 flex items-center justify-center px-3 rounded-full mr-1 transition-all duration-200"
                  style={{ 
                    background: aiAssistantOpen ? `${colors.primary}15` : 'transparent',
                    color: aiAssistantOpen ? colors.primary : t.textSecondary
                  }}
                >
                  <Sparkles size={15} className="mr-1" />
                  <span className="text-xs font-light">AI</span>
                </button>
              </div>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center ml-4 space-x-3">
              {/* Help Button */}
              <button 
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105"
                style={{ 
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  color: t.textSecondary,
                  boxShadow: 'none'
                }}
              >
                <Info size={16} />
              </button>
              
              {/* Quick Add Button */}
              <button 
                className="hidden sm:flex h-9 items-center justify-center px-4 rounded-full transition-all hover:scale-105"
                style={{ 
                  background: colors.gradients.primary,
                  color: '#ffffff',
                  boxShadow: t.shadow
                }}
              >
                <Plus size={16} className="mr-1" /> 
                <span className="text-sm font-light">Neu</span>
              </button>
              
              {/* Notifications Button */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="h-9 w-9 flex items-center justify-center rounded-full transition-all hover:scale-105"
                  style={{ 
                    background: t.surface,
                    border: `1px solid ${t.border}`,
                    color: t.textSecondary
                  }}
                >
                  <Bell size={16} />
                  
                  {/* Artistic Notification Badge */}
                  <span 
                    className="absolute top-1 right-1 h-2 w-2 rounded-full"
                    style={{ 
                      background: '#ef4444',
                      boxShadow: `0 0 0 2px ${t.surface}`
                    }}
                  >
                    <span 
                      className="absolute inset-0 rounded-full animate-ping opacity-75"
                      style={{ background: '#ef4444' }}
                    ></span>
                  </span>
                </button>
                
                {/* Notifications Dropdown - Artistic Design */}
                {notificationsOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 overflow-hidden z-50 animate-fade-in"
                    style={{
                      ...getArtisticTransform(0.3, 1),
                      background: t.surface,
                      borderRadius: '16px',
                      boxShadow: t.shadowHover,
                      border: `1px solid ${t.border}`
                    }}
                  >
                    {/* Header */}
                    <div 
                      className="px-4 py-3 relative border-b"
                      style={{ borderColor: t.border }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 
                          className="font-light text-base tracking-wide flex items-center"
                          style={{ color: t.text }}
                        >
                          <Bell size={16} style={{ color: colors.primary, marginRight: '8px' }} />
                          Benachrichtigungen
                        </h3>
                        <button 
                          className="text-xs"
                          style={{ color: colors.primary }}
                        >
                          Alle markieren
                        </button>
                      </div>
                      
                      {/* Artistic accent */}
                      <div 
                        className="absolute bottom-0 left-4 h-px w-16"
                        style={{ 
                          background: `linear-gradient(to right, ${colors.accent}, transparent)`,
                          opacity: 0.3
                        }}
                      ></div>
                    </div>
                    
                    {/* Notifications List */}
                    <div className="max-h-[320px] overflow-y-auto">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className="relative hover:scale-[1.01] transition-transform duration-200"
                          style={{
                            padding: '12px 16px',
                            borderBottom: `1px solid ${t.border}`,
                            background: notification.unread ? `${colors.primary}08` : 'transparent'
                          }}
                        >
                          {/* Left border accent */}
                          {notification.unread && (
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-1"
                              style={{ 
                                background: notification.color,
                                opacity: 0.7,
                                borderRadius: '2px'
                              }}
                            ></div>
                          )}
                          
                          <div className="flex">
                            <div 
                              className="h-10 w-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                              style={{ 
                                background: `${notification.color}15`,
                                color: notification.color
                              }}
                            >
                              {notification.icon}
                            </div>
                            
                            <div>
                              <h4 
                                className="font-medium text-sm flex items-center"
                                style={{ color: t.text }}
                              >
                                {notification.title}
                                {notification.unread && (
                                  <span 
                                    className="ml-2 inline-block h-1.5 w-1.5 rounded-full"
                                    style={{ background: notification.color }}
                                  ></span>
                                )}
                              </h4>
                              <p 
                                className="text-xs mt-1"
                                style={{ color: t.textSecondary }}
                              >
                                {notification.description}
                              </p>
                              <div className="flex items-center mt-2">
                                <Clock size={12} style={{ color: t.textSecondary, marginRight: 4, opacity: 0.7 }} />
                                <p 
                                  className="text-xs"
                                  style={{ color: t.textSecondary, opacity: 0.7 }}
                                >
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div 
                      className="p-3 flex justify-center"
                      style={{ background: `${t.bg}80` }}
                    >
                      <button 
                        className="text-sm tracking-wide flex items-center"
                        style={{ color: colors.primary }}
                      >
                        Alle anzeigen <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Dark Mode Toggle (Mobile Only) */}
              <button 
                onClick={toggleDarkMode}
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-full transition-all hover:scale-105"
                style={{ 
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  color: t.textSecondary
                }}
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              
              {/* User Avatar - Artistic Style */}
              <div 
                className="relative h-9 w-9 rounded-full overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-110"
                style={{ 
                  border: `1px solid ${t.border}`,
                  boxShadow: t.shadow
                }}
              >
                <img 
                  src={userIMG} 
                  alt="User" 
                  className="h-full w-full object-cover"
                  style={{ filter: 'contrast(1.05)' }}
                />
                
                {/* Status indicator */}
                <div 
                  className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full"
                  style={{ 
                    background: colors.soft.green,
                    boxShadow: `0 0 0 1.5px ${t.surface}`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </header>
        
        {/* AI Assistant Panel - Artistic Design */}
        <div 
          style={{
            ...getArtisticTransform(0.2, 2),
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '360px',
            maxWidth: 'calc(100vw - 48px)',
            height: '550px',
            maxHeight: 'calc(100vh - 120px)',
            background: t.surface,
            borderRadius: '20px',
            boxShadow: t.shadowHover,
            border: `1px solid ${t.border}`,
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            opacity: aiAssistantOpen ? 1 : 0,
            transform: aiAssistantOpen ? 
              getArtisticTransform(0.2, 2).transform : 
              getArtisticTransform(0.2, 2).transform + 'translateY(40px)',
            pointerEvents: aiAssistantOpen ? 'all' : 'none',
            zIndex: 40
          }}
        >
          {/* Artistic Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[20px]">
            {/* Background accent */}
            <div 
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-[0.03]"
              style={{ background: colors.soft.purple }}
            ></div>
            
            <div 
              className="absolute bottom-0 left-0 w-full h-48 -mb-6 opacity-[0.02]"
              style={{ 
                background: 'radial-gradient(ellipse at center, rgba(91, 155, 213, 0.5) 0%, rgba(91, 155, 213, 0.01) 70%)'
              }}
            ></div>
            
            {/* Glowing corner accent */}
            <div 
              className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-[0.04]"
              style={{ 
                background: colors.soft.blue,
                filter: 'blur(30px)'
              }}
            ></div>
          </div>
          
          {/* Header */}
          <div 
            className="p-4 relative border-b flex items-center justify-between"
            style={{ borderColor: t.border }}
          >
            <div className="flex items-center">
              <div 
                className="h-9 w-9 flex items-center justify-center rounded-xl mr-3"
                style={{ 
                  background: `${colors.primary}10`,
                  color: colors.primary
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h3 
                  className="font-light text-lg tracking-wide"
                  style={{ color: t.text }}
                >
                  AI Assistent
                </h3>
                <p 
                  className="text-xs tracking-wide"
                  style={{ color: t.textSecondary }}
                >
                  Powered by Claude
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setAiAssistantOpen(false)}
              className="h-8 w-8 flex items-center justify-center rounded-full"
              style={{ 
                background: t.bg,
                color: t.textSecondary
              }}
            >
              <X size={16} />
            </button>
            
            {/* Accent line */}
            <div 
              className="absolute bottom-0 left-4 h-px w-16"
              style={{ 
                background: `linear-gradient(to right, ${colors.accent}, transparent)`,
                opacity: 0.2
              }}
            ></div>
          </div>
          
          {/* Chat Messages - Artistic Design */}
          <div 
            className="p-4 overflow-y-auto"
            style={{ 
              height: 'calc(100% - 132px)',
              scrollBehavior: 'smooth'
            }}
          >
            <div className="space-y-4">
              {aiMessages.map(message => (
                <div 
                  key={message.id} 
                  className="flex"
                  style={{ 
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '100%'
                  }}
                >
                  <div 
                    style={{ 
                      background: message.sender === 'user' ? 
                        colors.gradients.primary : 
                        `${t.bg}90`,
                      color: message.sender === 'user' ? '#ffffff' : t.text,
                      padding: '10px 16px',
                      borderRadius: message.sender === 'user' ? 
                        '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      maxWidth: '85%',
                      boxShadow: message.sender === 'user' ? 
                        'none' : `0 1px 2px ${t.border}`,
                      border: message.sender === 'user' ? 
                        'none' : `1px solid ${t.border}`
                    }}
                  >
                    <div 
                      className="text-sm whitespace-pre-line"
                      style={{ 
                        fontWeight: 300,
                        lineHeight: 1.5
                      }}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Input Area - Artistic Design */}
          <div 
            className="p-4 absolute bottom-0 left-0 right-0 border-t"
            style={{ borderColor: t.border }}
          >
            <div 
              className="flex items-center rounded-xl p-1 pl-4"
              style={{ 
                background: t.bg,
                border: `1px solid ${t.border}`
              }}
            >
              <input 
                type="text" 
                placeholder="Nachricht an AI Assistent..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                style={{ 
                  color: t.text,
                  caretColor: colors.primary
                }}
              />
              
              <button 
                className="h-9 w-9 flex items-center justify-center rounded-lg transition-colors"
                style={{ 
                  background: colors.primary,
                  color: '#ffffff'
                }}
              >
                <ArrowRight size={16} />
              </button>
            </div>
            
            <div 
              className="mt-2 flex items-center justify-between text-xs"
              style={{ color: t.textSecondary }}
            >
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
        <main className="min-h-[calc(100vh-70px)] p-5 md:p-8">
          <Outlet />
        </main>
        
        {/* Floating Action Button - Artistic Design */}
        <button 
          onClick={() => setAiAssistantOpen(true)}
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '24px',
            height: '50px',
            width: '50px',
            borderRadius: '16px',
            background: colors.gradients.primary,
            color: '#ffffff',
            boxShadow: t.shadowHover,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            transform: aiAssistantOpen ? 'scale(0)' : 'scale(1)',
            opacity: aiAssistantOpen ? 0 : 1,
            pointerEvents: aiAssistantOpen ? 'none' : 'auto',
            zIndex: 30
          }}
          className="md:hidden hover:scale-110"
        >
          <Sparkles size={20} />
          
          {/* Corner accent */}
          <div 
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              height: 4,
              width: 4,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.7)'
            }}
          ></div>
        </button>
      </div>
      
      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s forwards;
        }
        
        .animate-gradient-border {
          background-size: 400% 400%;
          animation: gradient-position 3s ease infinite;
        }
        
        @keyframes gradient-position {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default ArtisticLayout;