import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Flag, 
  Award, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  Trophy,
  Target,
  UserCog
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

import userIMG from '../assets/user.png';

const UltraModernSidebar = ({ darkMode, toggleDarkMode, isMobile, mobileOpen, setMobileOpen }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activePath, setActivePath] = useState('/');
  const containerRef = useRef(null);

  // In der UltraModernSidebar-Komponente
  useEffect(() => {
    // Speichern wir die aktuelle Fenstergröße, um Änderungen zu erkennen
    let prevWidth = window.innerWidth;
    
    // Handler für Fenstergrößenänderungen
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const wasMobile = prevWidth < 768; // vorher kleines Fenster?
      const isMobileNow = currentWidth < 768; // jetzt kleines Fenster?
      
      // Fall 1: Wechsel von Desktop zu Mobil
      if (!wasMobile && isMobileNow && !expanded) {
        // Sidebar wieder auf normal setzen, damit sie im mobilen Modus richtig angezeigt wird
        setExpanded(true);
        // Aber sicherstellen, dass sie im mobilen Modus geschlossen ist
        if (setMobileOpen) setMobileOpen(false);
        
        // Zustand im Storage speichern
        sessionStorage.setItem('sidebar-expanded', 'true');
        // Event auslösen
        window.dispatchEvent(new Event('sidebar-toggle'));
      }
      
      // Fall 2: Wechsel von Mobil zu Desktop
      else if (wasMobile && !isMobileNow && mobileOpen) {
        // Mobile Menü schließen, wenn es offen war
        if (setMobileOpen) setMobileOpen(false);
        // Stellen wir die Sidebar auf expanded (true) zurück
        setExpanded(true);
        
        // Zustand im Storage speichern
        sessionStorage.setItem('sidebar-expanded', 'true');
        // Event auslösen
        window.dispatchEvent(new Event('sidebar-toggle'));
      }
      
      // Aktualisieren wir die vorherige Breite für den nächsten Aufruf
      prevWidth = currentWidth;
    };
    
    // Event-Handler hinzufügen
    window.addEventListener('resize', handleResize);
    
    // Cleanup beim Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [expanded, mobileOpen, setMobileOpen]);

  // Update active path based on location
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);
  
  // Load sidebar state from sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem('sidebar-expanded');
    if (savedState !== null) {
      setExpanded(savedState === 'true');
    }
  }, []);

  const toggleSidebar = async () => {
    const newState = !expanded;
    setExpanded(newState);
    // Save state to sessionStorage for Layout component
    sessionStorage.setItem('sidebar-expanded', String(newState));
    // Dispatch a custom event so other components know about the change
    window.dispatchEvent(new Event('sidebar-toggle'));
    
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Ignore errors when not on mobile
    }
  };
  
  const handleMobileToggle = async () => {
    if (isMobile && setMobileOpen) {
      setMobileOpen(!mobileOpen);
      try {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } catch (error) {
        // Ignore errors when not on mobile
      }
    }
  };

  // Standard Menu items
  const standardMenuItems = [
    { icon: <LayoutDashboard size={20} />, title: 'Dashboard', link: '/' },
    { icon: <Flag size={20} />, title: 'Stationen', link: '/stations' },
    { icon: <Users size={20} />, title: 'Teilnehmer', link: '/participants' },
    { icon: <Target size={20} />, title: 'Disziplinen', link: '/disziplinen' },
    { icon: <Trophy size={20} />, title: 'Ergebnisse', link: '/ergebnisse' },
    { icon: <Settings size={20} />, title: 'Einstellungen', link: '/settings' },
  ];
  
  // Admin Menu items
  const adminMenuItems = [
    { icon: <UserCog size={20} />, title: 'Nutzerverwaltung', link: '/users' },
  ];
  
  // Combine menu items based on user role
  const menuItems = currentUser?.role === 'admin' 
    ? [...standardMenuItems, ...adminMenuItems] 
    : standardMenuItems;
  
  // Handle logout
  const handleLogout = async () => {
    logout();
    if (setMobileOpen) setMobileOpen(false);
    navigate('/login');
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      // Ignore errors when not on mobile
    }
  };

  // Colors based on theme
  const colors = {
    primary: '#3f51b5',
    accent: '#f1c40f',
    light: {
      bg: '#f9fafc',
      surface: '#ffffff',
      border: '#eeeeee',
      text: '#2e3440',
      textSecondary: '#5e6472',
      shadow: '0 4px 20px rgba(0,0,0,0.05)'
    },
    dark: {
      bg: '#222831',
      surface: '#2d333f',
      border: '#373e4c',
      text: '#eceff4',
      textSecondary: '#c8cdd9',
      shadow: '0 4px 20px rgba(0,0,0,0.2)'
    }
  };

  // Choose colors based on current mode
  const c = darkMode ? colors.dark : colors.light;

  return (
    <>
      {/* Mobile Menu Toggle - Only show if on mobile */}
      {isMobile && (
        <button 
          onClick={handleMobileToggle}
          className="fixed z-50 top-5 left-5 transition-all duration-300 hover:scale-105"
          style={{
            width: '46px',
            height: '46px',
            background: c.surface,
            border: `1px solid ${c.border}`,
            borderRadius: '14px',
            boxShadow: c.shadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {mobileOpen ? 
            <X size={20} style={{ color: c.text }} /> : 
            <Menu size={20} style={{ color: c.text }} />
          }
        </button>
      )}
      
      {/* Sidebar */}
      <aside 
        ref={containerRef}
        className={`
          fixed top-0 left-0 h-full z-50
          transform-gpu transition-all duration-500 ease-out
          ${expanded ? 'w-[280px]' : 'w-[80px]'} 
          ${isMobile ? (mobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
        style={{ 
          background: c.surface,
          borderRight: `1px solid ${c.border}`,
          borderRadius: '0 20px 20px 0',
          boxShadow: c.shadow
        }}
      >
        {/* Content Container */}
        <div className="flex flex-col h-full pt-8 px-6 pb-5 relative">
          {/* Logo Section */}
          <div className={`mb-12 flex items-center ${!expanded && 'justify-center'}`}>
            <div className="relative h-10 w-10 flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
                  boxShadow: c.shadow
                }}
              >
                {/* Logo icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            
            {expanded && (
              <div className="ml-3 overflow-hidden">
                <h1 
                  className="text-xl font-light tracking-wide"
                  style={{ color: c.text }}
                >
                  sport<span className="font-bold">app</span>
                </h1>
                <div className="flex items-center mt-1">
                  <span 
                    className="text-xs tracking-wider"
                    style={{ color: c.textSecondary }}
                  >
                    Sportfest 2025
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3.5 top-14 hidden md:flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ 
              height: '26px',
              width: '26px',
              background: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: '50%',
              boxShadow: c.shadow
            }}
          >
            <ChevronRight 
              size={14} 
              className={`transition-transform duration-500 ${expanded ? 'rotate-180' : 'rotate-0'}`}
              style={{ color: colors.primary }}
            />
          </button>

          {/* Nav Items */}
          <nav className="flex-1 pr-1 overflow-y-auto overflow-x-hidden">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = activePath === item.link;
                
                // Assign colors
                const itemColor = isActive ? colors.primary : c.textSecondary;
                
                return (
                  <li 
                    key={index}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link 
                      to={item.link}
                      className={`
                        relative flex items-center py-2.5 px-2 rounded-xl
                        ${!expanded ? 'justify-center' : ''}
                        transition-all duration-300
                      `}
                      style={{ 
                        background: (hoveredItem === index || isActive) ? 
                          `${c.bg}70` : 'transparent',
                      }}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                          style={{ background: colors.accent }}
                        ></div>
                      )}
                      
                      {/* Icon Container */}
                      <div 
                        className="flex items-center justify-center h-9 w-9 rounded-xl"
                        style={{ 
                          background: isActive ? `${colors.primary}15` : 'transparent',
                          color: itemColor
                        }}
                      >
                        {item.icon}
                      </div>
                      
                      {/* Title */}
                      {expanded && (
                        <span 
                          className="ml-3 text-sm tracking-wide"
                          style={{ 
                            color: isActive ? c.text : c.textSecondary,
                            fontWeight: isActive ? 500 : 400
                          }}
                        >
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`
              mb-6 flex items-center py-2.5 px-2 rounded-xl
              ${!expanded ? 'justify-center' : ''}
              transition-all duration-200 hover:bg-opacity-10
            `}
            style={{ background: `${c.text}05` }}
          >
            <div 
              className="flex items-center justify-center h-9 w-9 rounded-xl"
              style={{ color: c.textSecondary }}
            >
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            
            {expanded && (
              <div className="ml-3">
                <p 
                  className="text-sm tracking-wide"
                  style={{ color: c.text }}
                >
                  {darkMode ? 'Nachtmodus' : 'Tagmodus'}
                </p>
                <p 
                  className="text-xs"
                  style={{ color: c.textSecondary }}
                >
                  {darkMode ? 'Wechseln zu hell' : 'Wechseln zu dunkel'}
                </p>
              </div>
            )}
          </button>

          {/* User Section */}
          <div 
            className="pt-4 mt-2"
            style={{ borderTop: `1px solid ${c.border}` }}
          >
            <div className={`flex items-center ${!expanded && 'justify-center'}`}>
              {/* User avatar */}
              <div className="relative h-10 w-10">
                <div 
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{ border: `1px solid ${c.border}` }}
                >
                  <img 
                    src={userIMG} 
                    alt="User" 
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              
              {expanded && (
                <div className="ml-3 overflow-hidden">
                  <p 
                    className="text-sm font-medium tracking-wide"
                    style={{ color: c.text }}
                  >
                    {currentUser?.name || 'User'}
                  </p>
                  <span 
                    className="text-xs"
                    style={{ color: c.textSecondary }}
                  >
                    {currentUser?.role === 'admin' ? 'Organisator' : 'Betreuer'}
                  </span>
                </div>
              )}
              
              {expanded && (
                <button 
                  onClick={handleLogout}
                  className="ml-auto p-1.5 rounded-full transition-all duration-200 hover:bg-opacity-10 hover:scale-110"
                  style={{ 
                    color: c.textSecondary,
                    background: `${c.text}05`
                  }}
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UltraModernSidebar;