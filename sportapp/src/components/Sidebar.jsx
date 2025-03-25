


// import React, { useState } from 'react';
// import { 
//   LayoutDashboard, 
//   Users, 
//   Flag, 
//   Award, 
//   Settings, 
//   BarChart,
//   LogOut,
//   Menu,
//   X,
//   ChevronRight,
//   Sun,
//   Moon,
//   Zap
// } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const FuturisticSidebar = ({ darkMode, toggleDarkMode }) => {
//   const [expanded, setExpanded] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [hoveredItem, setHoveredItem] = useState(null);

//   const toggleSidebar = () => setExpanded(!expanded);
//   const toggleMobile = () => setMobileOpen(!mobileOpen);

//   const menuItems = [
//     { icon: <LayoutDashboard size={20} />, title: 'Dashboard', link: '/', active: true },
//     { icon: <Flag size={20} />, title: 'Stationen', link: '/stations', active: false },
//     { icon: <Users size={20} />, title: 'Teilnehmer', link: '/participants', active: false },
//     { icon: <Award size={20} />, title: 'Rangliste', link: '/leaderboard', active: false },
//     { icon: <BarChart size={20} />, title: 'Statistiken', link: '/stats', active: false },
//     { icon: <Settings size={20} />, title: 'Einstellungen', link: '/settings', active: false },
//   ];

//   return (
//     <>
//       {/* Mobile Menu Toggle - Futuristic Style */}
//       <button 
//         onClick={toggleMobile}
//         className="fixed p-3 bg-white dark:bg-slate-800 rounded-full shadow-lg z-50 top-4 right-4 md:hidden hover:scale-105 transition-transform duration-300 ease-in-out border border-slate-200/50 dark:border-slate-700/50 glow-sm"
//       >
//         {mobileOpen ? <X size={20} /> : <Menu size={20} />}
//       </button>

//       {/* Backdrop for mobile menu */}
//       {mobileOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
//           onClick={toggleMobile}
//         />
//       )}

//       {/* Sidebar - Futuristic Style */}
//       <aside 
//         className={`
//           fixed top-0 left-0 h-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 
//           border-r border-slate-200/50 dark:border-slate-700/50 
//           shadow-xl shadow-slate-200/30 dark:shadow-slate-900/30 
//           transition-all duration-300 z-50
//           ${expanded ? 'w-[280px]' : 'w-[84px]'} 
//           ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
//           md:translate-x-0
//         `}
//         style={{ 
//           borderRadius: "0 24px 24px 0",
//         }}
//       >
//         {/* Futuristic Scanner Animation */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="h-1 w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent scanner-line-vertical"></div>
//         </div>
        
//         {/* Cyberpunk Corner Accents */}
//         <div className="absolute top-0 right-0 w-8 h-1 bg-indigo-500"></div>
//         <div className="absolute top-0 right-0 w-1 h-8 bg-indigo-500"></div>
//         <div className="absolute bottom-0 left-0 w-8 h-1 bg-indigo-500"></div>
//         <div className="absolute bottom-0 left-0 w-1 h-8 bg-indigo-500"></div>
      
//         <div className="flex flex-col h-full p-4">
//           {/* Logo Section - Cyberpunk Style */}
//           <div className={`mb-8 flex items-center ${!expanded && 'justify-center'}`}>
//             <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mr-3 glow-md">
//               <Zap className="h-5 w-5 text-white" />
//             </div>
//             {expanded && (
//               <div className="transition-opacity duration-300">
//                 <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
//                   SportApp
//                 </h1>
//                 <div className="text-xs text-slate-500 dark:text-slate-400">Sportfest 2025</div>
//               </div>
//             )}
//           </div>

//           {/* Toggle Button - Futuristic Style */}
//           <button 
//             onClick={toggleSidebar}
//             className="absolute -right-3 top-12 hidden md:flex items-center justify-center h-6 w-6 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform duration-300"
//           >
//             <ChevronRight size={12} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'}`} />
//           </button>

//           {/* Nav Items - Cyberpunk Style */}
//           <nav className="flex-1 mt-4">
//             <ul className="space-y-3">
//               {menuItems.map((item, index) => (
//                 <li 
//                   key={index}
//                   onMouseEnter={() => setHoveredItem(index)}
//                   onMouseLeave={() => setHoveredItem(null)}
//                   className="opacity-0 animate-fade-in"
//                   style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
//                 >
//                   <Link 
//                     to={item.link}
//                     className={`
//                       relative flex items-center py-3 px-4 rounded-xl
//                       ${item.active 
//                         ? 'text-indigo-600 dark:text-indigo-400 font-medium' 
//                         : 'text-slate-600 dark:text-slate-400'}
//                       transition-all duration-200
//                     `}
//                   >
//                     {/* Active indicator - Glowing Border */}
//                     {item.active && (
//                       <div 
//                         className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
//                       />
//                     )}
                    
//                     {/* Hover indicator */}
//                     {hoveredItem === index && !item.active && (
//                       <div 
//                         className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 rounded-xl"
//                       />
//                     )}
                    
//                     <div className={`
//                       z-10 flex items-center justify-center h-9 w-9 rounded-lg 
//                       ${item.active 
//                         ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 glow-sm' 
//                         : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
//                     `}>
//                       {item.icon}
//                     </div>
                    
//                     {expanded && (
//                       <span className="ml-3 text-sm z-10 transition-opacity duration-300">
//                         {item.title}
//                       </span>
//                     )}

//                     {/* Futuristic Active Indicator - Right Side Line */}
//                     {item.active && (
//                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full glow-md"></div>
//                     )}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           {/* Theme Toggle - Cyberpunk Style */}
//           <button
//             onClick={toggleDarkMode}
//             className={`
//               mb-6 flex items-center ${!expanded ? 'justify-center' : ''} py-3 px-4 rounded-xl
//               hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors
//             `}
//           >
//             <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-amber-100 dark:bg-slate-800 text-amber-600 dark:text-slate-400">
//               {darkMode ? <Moon size={20} /> : <Sun size={20} />}
//             </div>
            
//             {expanded && (
//               <span className="ml-3 text-sm text-slate-600 dark:text-slate-400 transition-opacity duration-300">
//                 {darkMode ? 'Dunkles Design' : 'Helles Design'}
//               </span>
//             )}
//           </button>

//           {/* User Section - Cyberpunk Style */}
//           <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
//             <div className={`flex items-center ${!expanded && 'justify-center'}`}>
//               <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex-shrink-0 overflow-hidden">
//                 <img 
//                   src="/api/placeholder/40/40" 
//                   alt="User" 
//                   className="h-full w-full object-cover"
//                 />
//                 {/* Glowing Status Indicator */}
//                 <div className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 glow-sm"></div>
//               </div>
              
//               {expanded && (
//                 <div className="ml-3 transition-opacity duration-300">
//                   <p className="text-sm font-medium text-slate-900 dark:text-white">Admin User</p>
//                   <div className="text-xs text-slate-500 dark:text-slate-400">
//                     Sportfest-Organisator
//                   </div>
//                 </div>
//               )}
              
//               {expanded && (
//                 <button 
//                   className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:rotate-12 transition-transform duration-300"
//                 >
//                   <LogOut size={18} />
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// };

// export default FuturisticSidebar;




import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Flag, 
  Award, 
  Settings, 
  BarChart,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  Bell,
  Globe,
  Sparkles,
  Cpu
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import userIMG from '../assets/user.png';

const UltraModernSidebar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activePath, setActivePath] = useState('/');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Update active path based on location
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

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

  const toggleSidebar = () => setExpanded(!expanded);
  const toggleMobile = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, title: 'Dashboard', link: '/' },
    { icon: <Flag size={20} />, title: 'Stationen', link: '/stations' },
    { icon: <Users size={20} />, title: 'Teilnehmer', link: '/participants' },
    { icon: <Award size={20} />, title: 'Rangliste', link: '/leaderboard' },
    { icon: <BarChart size={20} />, title: 'Statistiken', link: '/stats' },
    { icon: <Settings size={20} />, title: 'Einstellungen', link: '/settings' },
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
    <>
      {/* Mobile Menu Toggle - Ultra Modern 3D Button */}
      <button 
        onClick={toggleMobile}
        className="fixed p-3 md:hidden z-50 top-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="relative">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          {/* Glow effect */}
          <span className="absolute inset-0 rounded-full bg-current opacity-20 blur-sm"></span>
        </div>
      </button>

      {/* Backdrop for mobile menu */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar - Ultra Modern Design */}
      <aside 
        ref={containerRef}
        className={`
          fixed top-0 left-0 h-full z-50
          transform-gpu transition-all duration-500 ease-out
          backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50
          ${expanded ? 'w-[280px]' : 'w-[84px]'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
        style={{ 
          borderRadius: "0 24px 24px 0",
        }}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white/80 dark:from-slate-900/90 dark:to-slate-900/80 -z-10"></div>
        
        {/* Interactive 3D Background Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20 -z-10"></div>
        
        {/* Animated Holographic Scanner Line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent holographic-scanner"></div>
        </div>

        {/* Content Container with 3D Effect */}
        <div 
          className="flex flex-col h-full p-4"
          style={get3DTransform(0.3)}
        >
          {/* Logo Section - Futuristic 3D Logo */}
          <div className={`mb-8 flex items-center ${!expanded && 'justify-center'}`}>
            <div className="relative h-10 w-10 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-50 pulse"></div>
              
              {/* Holographic elements */}
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
              <div className="absolute inset-y-0 left-0 w-2 bg-white/30 skew-x-12"></div>
            </div>
            
            {expanded && (
              <div className="ml-3 overflow-hidden">
                <h1 className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 whitespace-nowrap">
                  SportApp
                </h1>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 pulse"></span>
                  Sportfest 2025
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button - Futuristic Style */}
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-12 hidden md:flex items-center justify-center h-6 w-6 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform duration-300"
          >
            <ChevronRight size={12} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : 'rotate-0'}`} />
          </button>

          {/* Nav Items - Ultra Modern Design */}
          <nav className="flex-1 mt-4 pr-1 custom-scrollbar overflow-y-auto overflow-x-hidden">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = activePath === item.link;
                return (
                  <li 
                    key={index}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`transition-all duration-300 ease-out ${
                      index > 0 ? 'opacity-0 animate-slide-in' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <Link 
                      to={item.link}
                      className={`
                        relative flex items-center py-3 px-4 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'text-indigo-600 dark:text-indigo-400 font-medium' 
                          : 'text-slate-600 dark:text-slate-400'}
                      `}
                    >
                      {/* Background Effects */}
                      {isActive && (
                        <>
                          {/* Main gradient background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-xl"></div>
                          
                          {/* Animated border */}
                          <div className="absolute inset-0 rounded-xl border border-indigo-200 dark:border-indigo-800"></div>
                          
                          {/* Left accent */}
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-r"></div>
                        </>
                      )}
                      
                      {/* Hover indicator */}
                      {hoveredItem === index && !isActive && (
                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 rounded-xl transition-opacity duration-300"></div>
                      )}
                      
                      {/* Icon Container with 3D effect on hover */}
                      <div 
                        className={`
                          z-10 flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 text-indigo-600 dark:text-indigo-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                          ${hoveredItem === index ? 'scale-110 rotate-3' : ''}
                        `}
                        style={hoveredItem === index ? get3DTransform(2) : {}}
                      >
                        {item.icon}
                        
                        {/* Glow effect only for active item */}
                        {isActive && (
                          <div className="absolute inset-0 bg-indigo-500 rounded-lg blur-xl opacity-30 -z-10"></div>
                        )}
                      </div>
                      
                      {/* Title with animation on expand/collapse */}
                      {expanded && (
                        <span className="ml-3 text-sm z-10 whitespace-nowrap transition-all duration-300 ease-out">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Feature Section - Only shown when expanded */}
          {expanded && (
            <div className="mb-6 px-4 py-5 rounded-xl bg-gradient-to-br from-indigo-600/10 to-violet-600/5 border border-indigo-200/20 dark:border-indigo-800/20 transform-gpu animate-float">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 dark:bg-indigo-400/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="ml-2 font-medium text-slate-900 dark:text-white text-sm">AI Assistant</h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Tippe auf "AI" um deinen persönlichen Sportfest-Assistenten zu aktivieren</p>
              <button className="mt-3 w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-medium rounded-lg shadow flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                <Cpu className="w-3 h-3 mr-1" /> Aktivieren
              </button>
            </div>
          )}

          {/* Theme Toggle - Ultra Modern Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`
              relative mb-6 flex items-center ${!expanded ? 'justify-center' : ''} py-3 px-4 rounded-xl
              overflow-hidden transition-all duration-300
              hover:bg-slate-100 dark:hover:bg-slate-800/50
            `}
          >
            {/* Interactive background effect */}
            <div className={`
              absolute inset-0 bg-gradient-to-r
              ${darkMode 
                ? 'from-indigo-900/10 to-purple-900/5 dark:from-indigo-400/10 dark:to-purple-400/5' 
                : 'from-amber-400/10 to-yellow-400/5'}
              rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300
            `}></div>
            
            <div className={`
              flex items-center justify-center h-9 w-9 rounded-lg
              ${darkMode 
                ? 'bg-slate-800 text-indigo-400' 
                : 'bg-amber-100 text-amber-600'}
              transition-all duration-500
            `}>
              {darkMode ? (
                <Moon size={20} className="animate-fade-in" />
              ) : (
                <Sun size={20} className="animate-fade-in" />
              )}
            </div>
            
            {expanded && (
              <div className="ml-3 transition-all duration-300">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {darkMode ? 'Dunkles Design' : 'Helles Design'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {darkMode ? 'Wechseln zu hell' : 'Wechseln zu dunkel'}
                </p>
              </div>
            )}
          </button>

          {/* User Section - Ultra Modern User Card */}
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
            <div className={`flex items-center ${!expanded && 'justify-center'}`}>
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex-shrink-0 overflow-hidden transform hover:scale-110 transition-transform duration-300">
                <img 
                  src= {userIMG} 
                  alt="User" 
                  className="h-full w-full object-cover"
                />
                
                {/* Status indicator with glow effect */}
                <div className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full blur-sm opacity-70 pulse"></div>
                </div>
                
                {/* Holographic element */}
                <div className="absolute inset-y-0 left-0 w-2 bg-white/20 skew-x-12"></div>
              </div>
              
              {expanded && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">Admin User</p>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <Globe className="w-3 h-3 mr-1" /> 
                    Organisator
                  </div>
                </div>
              )}
              
              {expanded && (
                <button className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:rotate-12 transition-all duration-300">
                  <LogOut size={18} />
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