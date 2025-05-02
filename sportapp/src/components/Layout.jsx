import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bell, Search, Users, Sun, Moon, X, Plus, Zap, 
  Download, Menu, ArrowRight, MessageSquare,
  Mic, Command, Sparkles, Info, PanelRight, 
  AlertCircle, Database, Clock, Settings,
  Star, CircleDashed, HeartPulse
} from 'lucide-react';
import UltraModernSidebar from './Sidebar';
import userIMG from '../assets/user.png';

const ArtisticLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
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
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const savedState = sessionStorage.getItem('sidebar-expanded');
    return savedState === null ? true : savedState === 'true';
  });
  const headerRef = useRef(null);
  
  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      const currentState = sessionStorage.getItem('sidebar-expanded');
      if (currentState !== null) {
        setSidebarExpanded(currentState === 'true');
      }
    };
    
    window.addEventListener('sidebar-toggle', handleSidebarToggle);
    
    // Also check periodically
    const interval = setInterval(() => {
      const currentState = sessionStorage.getItem('sidebar-expanded');
      if (currentState !== null && (currentState === 'true') !== sidebarExpanded) {
        setSidebarExpanded(currentState === 'true');
      }
    }, 300);
    
    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
      clearInterval(interval);
    };
  }, [sidebarExpanded]);
  
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
      
      <UltraModernSidebar 
        darkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
      
      <div 
        className={`
          ${sidebarExpanded 
            ? 'sm:ml-20 md:ml-[280px] lg:ml-[280px]' 
            : 'sm:ml-20 md:ml-[80px] lg:ml-[80px]'
          } 
          min-h-screen transition-all duration-500 relative z-10
        `}
      >
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
                    color: t.textSecondary
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
                onClick={() => logout() && navigate('/login')}
                title="Abmelden"
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