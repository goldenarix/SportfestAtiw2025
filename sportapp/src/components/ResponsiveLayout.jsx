import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeProvider';
import { Bell, Search, User, Moon, Sun, Menu, X } from 'lucide-react';

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

const ResponsiveLayout = () => {
  const { currentUser, logout } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
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
  const headerRef = useRef(null);

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

  // Logout with haptics
  const handleLogout = () => {
    if (isCapacitorEnvironment()) {
      lightImpact();
    }
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
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
            transition-all duration-300 safe-area-top`}
          style={{
            paddingTop: isAppInstalled && orientation === 'portrait' ? 'env(safe-area-inset-top, 0px)' : '0'
          }}
        >
          <div className="h-full px-4 md:px-6 flex items-center justify-between">
            {/* Search Bar - Simple Version */}
            <div className={`relative ${isMobile ? 'w-3/4' : 'w-full max-w-xl'}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Suchen..." 
                className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 
                  bg-white dark:bg-slate-800 pl-10 pr-4 text-sm focus:border-indigo-500 
                  dark:focus:border-indigo-400 focus:outline-none focus:ring-1 
                  focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>
            
            {/* Right Actions - Simple Version */}
            <div className="flex items-center space-x-3">
              {/* Dark Mode Toggle Button */}
              <button 
                onClick={handleToggleTheme}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center 
                  justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 
                  dark:hover:bg-slate-700 transition-all duration-200"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              {/* User Avatar with responsive size */}
              <div 
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 
                  dark:from-slate-700 dark:to-slate-800 flex-shrink-0 overflow-hidden cursor-pointer"
                onClick={handleLogout}
              >
                <img 
                  src={userIMG} 
                  alt="User" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-4 sm:p-6 min-h-[calc(100vh-64px)]">
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