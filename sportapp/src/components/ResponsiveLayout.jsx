import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeProvider';
import { Bell, Search, User, Moon, Sun, Menu, X, ChevronLeft, Gift, Smile, PartyPopper, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import responsive utilities
import { 
  useWindowSize, 
  useIsMobile, 
  useOrientation, 
  safeAreaInset,
  isStandaloneApp
} from '../utils/responsive';

// Import haptic feedback utilities
import {
  lightImpact,
  selectionFeedback,
  isCapacitorEnvironment
} from '../utils/haptics';

import UltraModernSidebar from './Sidebar';
import userIMG from '../assets/user.png';
import ConfettiEffect from './ConfettiEffect';

const ResponsiveLayout = () => {
  const { currentUser, logout } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Responsive state detection
  const isMobile = useIsMobile();
  const { width, height } = useWindowSize();
  const orientation = useOrientation();
  const isAppInstalled = isStandaloneApp();
  
  // UI state
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Add sidebar expanded state
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const savedState = sessionStorage.getItem('sidebar-expanded');
    return savedState === null ? true : savedState === 'true';
  });
  const [pageTitle, setPageTitle] = useState('');
  const headerRef = useRef(null);
  const [userPopoverOpen, setUserPopoverOpen] = useState(false);
  const userAvatarRef = useRef(null);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [easterEggStage, setEasterEggStage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  // Toggle dark mode with haptic feedback
  const handleToggleTheme = () => {
    toggleTheme();
    if (isCapacitorEnvironment()) {
      lightImpact();
    }
  };

  // Track scroll position for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Generate page title based on current path
  useEffect(() => {
    const path = location.pathname;
    let title = 'Dashboard'; // Default title
    if (path === '/') {
      title = 'Dashboard';
    } else if (path.startsWith('/participants')) {
      title = 'Teilnehmer';
    } else if (path.startsWith('/disziplinen')) {
      title = 'Disziplinen';
    } else if (path.startsWith('/ergebnisse')) {
      title = 'Ergebnisse';
    } else if (path.startsWith('/zeitplan')) {
      title = 'Zeitplan';
    } else if (path.startsWith('/settings')) {
      title = 'Einstellungen';
    } else if (path.startsWith('/users')) {
      title = 'Nutzerverwaltung';
    }
    // Add more specific titles if needed, e.g., for individual participant pages
    // else if (path.match(/^\/participants\/\d+$/)) {
    //   title = 'Teilnehmer Details'; 
    // }
    setPageTitle(title);
  }, [location.pathname]);

  // Apply safe area insets for notched devices
  useEffect(() => {
    // Add class to root element for safe area handling
    document.documentElement.classList.toggle('has-safe-area', isAppInstalled);
    
    // Add class based on orientation
    document.documentElement.classList.toggle('portrait', orientation === 'portrait');
    document.documentElement.classList.toggle('landscape', orientation === 'landscape');
    
    // Add viewport meta tag for mobile devices
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no');
    }
  }, [isAppInstalled, orientation]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Toggle mobile menu with haptic feedback
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (isCapacitorEnvironment()) {
      selectionFeedback();
    }
  };

  // Click outside handler for popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userAvatarRef.current && !userAvatarRef.current.contains(event.target)) {
        setUserPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userAvatarRef]);

  const handleToggleUserPopover = () => {
    setUserPopoverOpen(!userPopoverOpen);
    if (isCapacitorEnvironment()) {
      selectionFeedback();
    }
  };

  const activateEasterEgg = () => {
    setEasterEggActive(true);
    setShowConfetti(true);
    setEasterEggStage(prevStage => (prevStage + 1) % 3);
    if (isCapacitorEnvironment()) {
      lightImpact();
    }
    
    setTimeout(() => {
      setEasterEggActive(false);
    }, 5000);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
  };

  // Logout with haptics
  const handleLogout = () => {
    if (isCapacitorEnvironment()) {
      lightImpact();
    }
    setUserPopoverOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Conditionally render ConfettiEffect */}
      <AnimatePresence>
        {showConfetti && <ConfettiEffect isActive={showConfetti} />}
      </AnimatePresence>

      {/* Mobile menu backdrop only - the toggle button is in the Sidebar component */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Sidebar with Mobile Control */}
      <UltraModernSidebar 
        darkMode={isDarkMode} 
        toggleDarkMode={handleToggleTheme} 
        isMobile={isMobile}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />
      
      {/* Main Content Container - responsive margins - Updated to use sidebarExpanded */}
      <div 
        className={`
          ${isMobile ? 'ml-0' : mobileMenuOpen ? 'ml-0' : 
            sidebarExpanded ? 'sm:ml-20 md:ml-[280px] lg:ml-[280px]' : 'sm:ml-20 md:ml-[80px] lg:ml-[80px]'
          }
          min-h-screen transition-all duration-500 relative z-10
          ${isAppInstalled ? 'safe-area-enabled' : ''}
          overflow-x-hidden max-w-full
        `}
        style={{
          ...safeAreaInset('top'),
          ...safeAreaInset('bottom'),
          ...(orientation === 'landscape' ? safeAreaInset('left') : {}),
          ...(orientation === 'landscape' ? safeAreaInset('right') : {})
        }}
      >
        {/* Responsive Header */}
        <header 
          ref={headerRef}
          className={`sticky top-0 z-30 ${scrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'} 
            backdrop-blur-md bg-white/70 dark:bg-slate-900/70 
            border-b border-slate-200/50 dark:border-slate-700/50
            transition-all duration-300 safe-area-top
            flex items-center justify-between
            px-4 sm:px-6 lg:px-8 
          `}
          style={{
            ...safeAreaInset('top', true) // Ensure header respects top safe area
          }}
        >
          <div className="flex items-center">
            {/* Mobile Menu Toggle - Now in Header for Mobile */}
            {isMobile && (
              <button 
                onClick={toggleMobileMenu} 
                className="mr-2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" // Style similar to back/theme buttons
                aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}

            {/* Back button - conditional */}
            {location.pathname !== '/' && !isMobile && ( // Hide back button on mobile if menu toggle is shown to save space, or adjust logic as needed
              <button 
                onClick={() => navigate(-1)} 
                className="mr-2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                aria-label="Zurück"
              >
                <ChevronLeft size={isMobile ? 22 : 24} />
              </button>
            )}
            {location.pathname !== '/' && isMobile && (
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                aria-label="Zurück"
              >
                <ChevronLeft size={isMobile ? 22 : 24} />
              </button>
            )}
            <h1 className={`text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800 dark:text-slate-100 truncate ${isMobile ? 'max-w-[calc(100vw-150px)]' : 'max-w-xs'}`}> {/* Adjusted max-width for mobile title with menu toggle */}
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle Button */}
            <button 
              onClick={handleToggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              aria-label={isDarkMode ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
            >
              {isDarkMode ? <Sun size={isMobile ? 20 : 22} /> : <Moon size={isMobile ? 20 : 22} />}
            </button>

            {/* User Profile Dropdown / Link */}
            {currentUser && (
              <div className="relative" ref={userAvatarRef}>
                <button 
                  onClick={handleToggleUserPopover}
                  className="flex items-center p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                  aria-expanded={userPopoverOpen}
                  aria-controls="user-popover"
                >
                  <img 
                    src={currentUser.photoURL || userIMG} 
                    alt="User Avatar" 
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-transparent group-hover:border-sky-500"
                  />
                </button>
                <AnimatePresence>
                  {userPopoverOpen && (
                    <motion.div
                      id="user-popover"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "circOut" }}
                      className={`absolute right-0 mt-2 w-64 origin-top-right rounded-xl shadow-2xl 
                                 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'} 
                                 p-4 text-sm z-50`}
                    >
                      <div className="flex items-center mb-3 pb-3 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}">
                        <img 
                          src={currentUser.photoURL || userIMG} 
                          alt="User Avatar" 
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{currentUser.name || 'Nutzer'}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{currentUser.role ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) : 'Rolle unbekannt'}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          <strong>Email:</strong> {currentUser.email || 'Nicht verfügbar'}
                        </p>
                        <button 
                          onClick={activateEasterEgg}
                          className={`w-full mt-2 px-3 py-2 rounded-lg text-sm flex items-center justify-center font-medium
                                     ${isDarkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'} 
                                     transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-md hover:shadow-lg`}
                        >
                          <PartyPopper size={18} className="mr-2" /> Entfessle die Magie!
                        </button>
                        {easterEggActive && (
                          <motion.div
                            key={easterEggStage}
                            initial={{ opacity: 0, y: 20, scale: 0.5 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0, 
                              scale: 1,
                              rotate: easterEggStage === 1 ? [0, 360] : 0,
                              backgroundColor: easterEggStage === 2 
                                ? (isDarkMode ? ['#334155', '#7c3aed', '#db2777', '#334155'] : ['#f1f5f9', '#a855f7', '#ec4899', '#f1f5f9'])
                                : (isDarkMode ? '#334155' : '#f1f5f9'),
                            }}
                            exit={{ opacity: 0, y: -20, scale: 0.5 }}
                            transition={{
                              type: "spring",
                              stiffness: easterEggStage === 2 ? 100 : 260,
                              damping: easterEggStage === 2 ? 15 : 20,
                              ...(easterEggStage === 2 && { duration: 2, repeat: Infinity, repeatType: "mirror" })
                            }}
                            className={`mt-3 p-3 rounded-xl text-center text-sm shadow-xl ${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-700'}`}
                          >
                            {easterEggStage === 0 && (
                              <div className='flex items-center justify-center'>
                                <Zap size={20} className={`inline mr-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`} /> 
                                Wow! Ein geheimes Feature!
                                <Zap size={20} className={`inline ml-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'}`} /> 
                              </div>
                            )}
                            {easterEggStage === 1 && (
                              <div className='flex items-center justify-center'>
                                <Gift size={20} className={`inline mr-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} /> 
                                Du hast es dir verdient!
                                <Smile size={20} className={`inline ml-2 ${isDarkMode ? 'text-teal-300' : 'text-teal-500'}`} />
                              </div>
                            )}
                            {easterEggStage === 2 && (
                              <div className='flex items-center justify-center'>
                                <PartyPopper size={20} className={`inline mr-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} /> 
                                Party Time! Mega Fancy!
                                <PartyPopper size={20} className={`inline ml-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} /> 
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                      <button
                        onClick={handleLogout}
                        className={`w-full mt-4 px-3 py-2 rounded-md text-xs font-medium
                                   ${isDarkMode ? 'bg-red-700/50 hover:bg-red-700/70 text-red-300' 
                                                : 'bg-red-100 hover:bg-red-200 text-red-700'} 
                                   transition-colors`}
                      >
                        Ausloggen
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
             {!currentUser && (
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}
                  aria-label={currentUser ? "Ausloggen" : "Anmelden"}
                >
                  <User size={isMobile ? 20 : 22} />
                </button>
             )}
          </div>
        </header>

        {/* Main Content - Added padding for mobile and when sidebar is closed */}
        <main className={`
          p-4 sm:p-6 lg:p-8 
          ${isAppInstalled ? 'safe-area-enabled-main' : ''}
          `
        }>
          <Outlet />
        </main>
      </div>
      
      {/* Add custom CSS for animations and responsive features */}
      <style jsx>{`
        .safe-area-top {
          padding-top: env(safe-area-inset-top, 0px);
        }
        
        @media (max-width: 640px) {
          .responsive-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
        
        @media (display-mode: standalone) {
          body {
            /* Add PWA specific styles */
            overscroll-behavior: none;
          }
        }
        
        @media (orientation: portrait) {
          /* Portrait specific styles */
        }
        
        @media (orientation: landscape) {
          /* Landscape specific styles */
        }
      `}</style>
    </div>
  );
};

export default ResponsiveLayout;