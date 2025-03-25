


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




// import React, { useState, useRef, useEffect } from 'react';
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
//   Zap,
//   Bell,
//   Globe,
//   Sparkles,
//   Cpu
// } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';

// import userIMG from '../assets/user.png';

// const UltraModernSidebar = ({ darkMode, toggleDarkMode }) => {
//   const location = useLocation();
//   const [expanded, setExpanded] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [hoveredItem, setHoveredItem] = useState(null);
//   const [activePath, setActivePath] = useState('/');
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const containerRef = useRef(null);

//   // Update active path based on location
//   useEffect(() => {
//     setActivePath(location.pathname);
//   }, [location]);

//   useEffect(() => {
//     const handleMouseMove = (event) => {
//       if (!containerRef.current) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       const x = (event.clientX - rect.left) / rect.width;
//       const y = (event.clientY - rect.top) / rect.height;
//       setMousePosition({ x, y });
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   const toggleSidebar = () => setExpanded(!expanded);
//   const toggleMobile = () => setMobileOpen(!mobileOpen);

//   const menuItems = [
//     { icon: <LayoutDashboard size={20} />, title: 'Dashboard', link: '/' },
//     { icon: <Flag size={20} />, title: 'Stationen', link: '/stations' },
//     { icon: <Users size={20} />, title: 'Teilnehmer', link: '/participants' },
//     { icon: <Award size={20} />, title: 'Rangliste', link: '/leaderboard' },
//     { icon: <BarChart size={20} />, title: 'Statistiken', link: '/stats' },
//     { icon: <Settings size={20} />, title: 'Einstellungen', link: '/settings' },
//   ];

//   // Get 3D transform based on mouse position
//   const get3DTransform = (factor = 1) => {
//     const rotateX = (mousePosition.y - 0.5) * 5 * factor;
//     const rotateY = (mousePosition.x - 0.5) * -5 * factor;
    
//     return {
//       transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
//       transition: 'transform 0.1s',
//     };
//   };

//   return (
//     <>
//       {/* Mobile Menu Toggle - Ultra Modern 3D Button */}
//       <button 
//         onClick={toggleMobile}
//         className="fixed p-3 md:hidden z-50 top-4 right-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50"
//       >
//         <div className="relative">
//           {mobileOpen ? <X size={20} /> : <Menu size={20} />}
//           {/* Glow effect */}
//           <span className="absolute inset-0 rounded-full bg-current opacity-20 blur-sm"></span>
//         </div>
//       </button>

//       {/* Backdrop for mobile menu */}
//       {mobileOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
//           onClick={toggleMobile}
//         />
//       )}

//       {/* Sidebar - Ultra Modern Design */}
//       <aside 
//         ref={containerRef}
//         className={`
//           fixed top-0 left-0 h-full z-50
//           transform-gpu transition-all duration-500 ease-out
//           backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50
//           ${expanded ? 'w-[280px]' : 'w-[84px]'} 
//           ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
//           md:translate-x-0
//         `}
//         style={{ 
//           borderRadius: "0 24px 24px 0",
//         }}
//       >
//         {/* Gradient Background */}
//         <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white/80 dark:from-slate-900/90 dark:to-slate-900/80 -z-10"></div>
        
//         {/* Interactive 3D Background Grid */}
//         <div className="absolute inset-0 bg-grid-pattern opacity-10 dark:opacity-20 -z-10"></div>
        
//         {/* Animated Holographic Scanner Line */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
//           <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent holographic-scanner"></div>
//         </div>

//         {/* Content Container with 3D Effect */}
//         <div 
//           className="flex flex-col h-full p-4"
//           style={get3DTransform(0.3)}
//         >
//           {/* Logo Section - Futuristic 3D Logo */}
//           <div className={`mb-8 flex items-center ${!expanded && 'justify-center'}`}>
//             <div className="relative h-10 w-10 flex-shrink-0">
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl shadow-lg"></div>
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Zap className="h-5 w-5 text-white" />
//               </div>
              
//               {/* Glow effect */}
//               <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-md opacity-50 pulse"></div>
              
//               {/* Holographic elements */}
//               <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
//               <div className="absolute inset-y-0 left-0 w-2 bg-white/30 skew-x-12"></div>
//             </div>
            
//             {expanded && (
//               <div className="ml-3 overflow-hidden">
//                 <h1 className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 whitespace-nowrap">
//                   SportApp
//                 </h1>
//                 <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
//                   <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 pulse"></span>
//                   Sportfest 2025
//                 </div>
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

//           {/* Nav Items - Ultra Modern Design */}
//           <nav className="flex-1 mt-4 pr-1 custom-scrollbar overflow-y-auto overflow-x-hidden">
//             <ul className="space-y-2">
//               {menuItems.map((item, index) => {
//                 const isActive = activePath === item.link;
//                 return (
//                   <li 
//                     key={index}
//                     onMouseEnter={() => setHoveredItem(index)}
//                     onMouseLeave={() => setHoveredItem(null)}
//                     className={`transition-all duration-300 ease-out ${
//                       index > 0 ? 'opacity-0 animate-slide-in' : ''
//                     }`}
//                     style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
//                   >
//                     <Link 
//                       to={item.link}
//                       className={`
//                         relative flex items-center py-3 px-4 rounded-xl transition-all duration-300
//                         ${isActive 
//                           ? 'text-indigo-600 dark:text-indigo-400 font-medium' 
//                           : 'text-slate-600 dark:text-slate-400'}
//                       `}
//                     >
//                       {/* Background Effects */}
//                       {isActive && (
//                         <>
//                           {/* Main gradient background */}
//                           <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-xl"></div>
                          
//                           {/* Animated border */}
//                           <div className="absolute inset-0 rounded-xl border border-indigo-200 dark:border-indigo-800"></div>
                          
//                           {/* Left accent */}
//                           <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-violet-500 rounded-r"></div>
//                         </>
//                       )}
                      
//                       {/* Hover indicator */}
//                       {hoveredItem === index && !isActive && (
//                         <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 rounded-xl transition-opacity duration-300"></div>
//                       )}
                      
//                       {/* Icon Container with 3D effect on hover */}
//                       <div 
//                         className={`
//                           z-10 flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-300
//                           ${isActive 
//                             ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 text-indigo-600 dark:text-indigo-400' 
//                             : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
//                           ${hoveredItem === index ? 'scale-110 rotate-3' : ''}
//                         `}
//                         style={hoveredItem === index ? get3DTransform(2) : {}}
//                       >
//                         {item.icon}
                        
//                         {/* Glow effect only for active item */}
//                         {isActive && (
//                           <div className="absolute inset-0 bg-indigo-500 rounded-lg blur-xl opacity-30 -z-10"></div>
//                         )}
//                       </div>
                      
//                       {/* Title with animation on expand/collapse */}
//                       {expanded && (
//                         <span className="ml-3 text-sm z-10 whitespace-nowrap transition-all duration-300 ease-out">
//                           {item.title}
//                         </span>
//                       )}
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           {/* Feature Section - Only shown when expanded */}
//           {expanded && (
//             <div className="mb-6 px-4 py-5 rounded-xl bg-gradient-to-br from-indigo-600/10 to-violet-600/5 border border-indigo-200/20 dark:border-indigo-800/20 transform-gpu animate-float">
//               <div className="flex items-center mb-2">
//                 <div className="w-8 h-8 rounded-full bg-indigo-600/20 dark:bg-indigo-400/20 flex items-center justify-center">
//                   <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
//                 </div>
//                 <h4 className="ml-2 font-medium text-slate-900 dark:text-white text-sm">AI Assistant</h4>
//               </div>
//               <p className="text-xs text-slate-600 dark:text-slate-400">Tippe auf "AI" um deinen persönlichen Sportfest-Assistenten zu aktivieren</p>
//               <button className="mt-3 w-full py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-medium rounded-lg shadow flex items-center justify-center hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
//                 <Cpu className="w-3 h-3 mr-1" /> Aktivieren
//               </button>
//             </div>
//           )}

//           {/* Theme Toggle - Ultra Modern Toggle */}
//           <button
//             onClick={toggleDarkMode}
//             className={`
//               relative mb-6 flex items-center ${!expanded ? 'justify-center' : ''} py-3 px-4 rounded-xl
//               overflow-hidden transition-all duration-300
//               hover:bg-slate-100 dark:hover:bg-slate-800/50
//             `}
//           >
//             {/* Interactive background effect */}
//             <div className={`
//               absolute inset-0 bg-gradient-to-r
//               ${darkMode 
//                 ? 'from-indigo-900/10 to-purple-900/5 dark:from-indigo-400/10 dark:to-purple-400/5' 
//                 : 'from-amber-400/10 to-yellow-400/5'}
//               rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300
//             `}></div>
            
//             <div className={`
//               flex items-center justify-center h-9 w-9 rounded-lg
//               ${darkMode 
//                 ? 'bg-slate-800 text-indigo-400' 
//                 : 'bg-amber-100 text-amber-600'}
//               transition-all duration-500
//             `}>
//               {darkMode ? (
//                 <Moon size={20} className="animate-fade-in" />
//               ) : (
//                 <Sun size={20} className="animate-fade-in" />
//               )}
//             </div>
            
//             {expanded && (
//               <div className="ml-3 transition-all duration-300">
//                 <p className="text-sm font-medium text-slate-900 dark:text-white">
//                   {darkMode ? 'Dunkles Design' : 'Helles Design'}
//                 </p>
//                 <p className="text-xs text-slate-500 dark:text-slate-400">
//                   {darkMode ? 'Wechseln zu hell' : 'Wechseln zu dunkel'}
//                 </p>
//               </div>
//             )}
//           </button>

//           {/* User Section - Ultra Modern User Card */}
//           <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
//             <div className={`flex items-center ${!expanded && 'justify-center'}`}>
//               <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex-shrink-0 overflow-hidden transform hover:scale-110 transition-transform duration-300">
//                 <img 
//                   src= {userIMG} 
//                   alt="User" 
//                   className="h-full w-full object-cover"
//                 />
                
//                 {/* Status indicator with glow effect */}
//                 <div className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800">
//                   <div className="absolute inset-0 bg-emerald-500 rounded-full blur-sm opacity-70 pulse"></div>
//                 </div>
                
//                 {/* Holographic element */}
//                 <div className="absolute inset-y-0 left-0 w-2 bg-white/20 skew-x-12"></div>
//               </div>
              
//               {expanded && (
//                 <div className="ml-3 overflow-hidden">
//                   <p className="text-sm font-medium text-slate-900 dark:text-white whitespace-nowrap">Admin User</p>
//                   <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
//                     <Globe className="w-3 h-3 mr-1" /> 
//                     Organisator
//                   </div>
//                 </div>
//               )}
              
//               {expanded && (
//                 <button className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:rotate-12 transition-all duration-300">
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

// export default UltraModernSidebar;



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
  Globe,
  Timer,
  HeartPulse,
  Trophy,
  Target
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import userIMG from '../assets/user.png';

const SportArtisticSidebar = ({ darkMode, toggleDarkMode }) => {
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
    { icon: <Target size={20} />, title: 'Disziplinen', link: '/disziplinen' },
    { icon: <Trophy size={20} />, title: 'Ergebnisse', link: '/ergebnisse' },

   
    
    { icon: <Settings size={20} />, title: 'Einstellungen', link: '/settings' },
  ];

  // Matching artistic dashboard color palette
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

  // Choose colors based on current mode
  const c = darkMode ? colors.dark : colors.light;

  // Subtle transform for hover effects
  const getArtisticTransform = (factor = 1, elementIndex = 0) => {
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
    <>
      {/* Mobile Menu Toggle - Sport Artistic */}
      <button 
        onClick={toggleMobile}
        className="fixed md:hidden z-50 top-5 right-5 transition-all duration-300 hover:scale-105"
        style={{
          width: '46px',
          height: '46px',
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: '14px',
          boxShadow: c.shadow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background sports accent */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%233f51b5' stroke-width='0.5' fill='none' /%3E%3C/svg%3E\")",
            backgroundSize: '100px 100px',
            backgroundPosition: 'center'
          }}
        ></div>
        
        {mobileOpen ? 
          <X size={20} style={{ color: c.text, position: 'relative', zIndex: 1 }} /> : 
          <Menu size={20} style={{ color: c.text, position: 'relative', zIndex: 1 }} />
        }
          
        {/* Sports-themed corner accent */}
        <div 
          className="absolute -bottom-2.5 -right-2.5 w-8 h-8 opacity-20" 
          style={{ 
            background: colors.accent,
            borderRadius: '50% 0 50% 50%',
            transform: 'rotate(45deg)'
          }}
        ></div>
      </button>

      {/* Backdrop for mobile menu */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          style={{ background: `${c.text}10` }}
          onClick={toggleMobile}
        />
      )}
      
      {/* Sidebar - Sport Artistic Design */}
      <aside 
        ref={containerRef}
        className={`
          fixed top-0 left-0 h-full z-50
          transform-gpu transition-all duration-500 ease-out
          ${expanded ? 'w-[280px]' : 'w-[80px]'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
        style={{ 
          background: c.surface,
          borderRight: `1px solid ${c.border}`,
          borderRadius: '0 20px 20px 0',
          boxShadow: c.shadow
        }}
      >
        {/* Sports-themed Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dynamic running track lines - top */}
          <div 
            className="absolute top-0 left-0 right-0 h-40 opacity-[0.03]"
            style={{ 
              backgroundImage: `repeating-linear-gradient(to bottom, ${colors.primary}, ${colors.primary} 1px, transparent 1px, transparent 12px)`,
              backgroundSize: '100% 12px'
            }}
          ></div>
          
          {/* Field lines - center diagonal */}
          <div 
            className="absolute top-1/3 -right-10 w-40 h-40 opacity-[0.02]"
            style={{ 
              background: `linear-gradient(45deg, transparent 49.5%, ${colors.accent} 49.5%, ${colors.accent} 50.5%, transparent 50.5%)`,
              backgroundSize: '10px 10px'
            }}
          ></div>
          
          {/* Ball shape */}
          <div 
            className="absolute top-2/3 left-0 w-60 h-60 opacity-[0.02]"
            style={{ 
              background: colors.primary,
              borderRadius: '50%',
              transform: 'translate(-50%, -30%)'
            }}
          ></div>
          
          {/* Target circles - bottom */}
          <svg className="absolute bottom-0 right-0 w-48 h-48 opacity-[0.025]" viewBox="0 0 100 100">
            <circle cx="70" cy="70" r="40" fill="none" stroke={colors.primary} strokeWidth="0.5" />
            <circle cx="70" cy="70" r="30" fill="none" stroke={colors.primary} strokeWidth="0.5" />
            <circle cx="70" cy="70" r="20" fill="none" stroke={colors.primary} strokeWidth="0.5" />
            <circle cx="70" cy="70" r="10" fill="none" stroke={colors.primary} strokeWidth="0.5" />
            <circle cx="70" cy="70" r="5" fill={colors.primary} />
          </svg>
          
          {/* Pulse animation circle - heartbeat effect */}
          <div className="absolute top-[45%] left-6 w-2 h-2 rounded-full opacity-30 pulse-animation"
            style={{ background: colors.soft.pink }}
          ></div>
          
          {/* Sport measurement scale */}
          <div 
            className="absolute bottom-40 left-0 w-12 h-32 opacity-[0.03]"
            style={{ 
              backgroundImage: `repeating-linear-gradient(to bottom, ${colors.primary}, ${colors.primary} 1px, transparent 1px, transparent 8px)`,
            }}
          ></div>
        </div>
        
        {/* Content Container */}
        <div 
          className="flex flex-col h-full pt-8 px-6 pb-5 relative z-10"
          style={getArtisticTransform(0.1, 0)}
        >
          {/* Logo Section - Sport Themed Artistic */}
          <div className={`mb-12 flex items-center ${!expanded && 'justify-center'}`}>
            <div className="relative h-10 w-10 flex-shrink-0">
              {/* Sports-themed logo background */}
              <div 
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{ 
                  background: colors.gradients.primary,
                  borderRadius: '38% 62% 63% 37% / 41% 44% 56% 59%', // Organic shape
                  boxShadow: c.shadow
                }}
              >
                {/* Decorative sport elements */}
                <div 
                  className="absolute top-0 right-0 w-4 h-4 opacity-30"
                  style={{ 
                    background: 'white',
                    borderRadius: '50%',
                    transform: 'translate(25%, -25%)'
                  }}
                ></div>
                
                <div 
                  className="absolute bottom-0 left-0 w-3 h-3 opacity-30"
                  style={{ 
                    background: 'white',
                    borderRadius: '50%',
                    transform: 'translate(-25%, 25%)'
                  }}
                ></div>
                
                {/* Logo icon with sporty lightning bolt */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            
            {expanded && (
              <div className="ml-3 overflow-hidden">
                <h1 
                  className="text-xl font-light tracking-wide relative"
                  style={{ color: c.text }}
                >
                  sport<span className="font-bold">app</span>
                  {/* Trophy medal accent */}
                  <div 
                    className="absolute -top-1 -right-5 w-4 h-4 opacity-80"
                    style={{ 
                      background: colors.accent,
                      borderRadius: '50% 50% 50% 0',
                      transform: 'rotate(-15deg) scale(0.7)'
                    }}
                  ></div>
                </h1>
                <div className="flex items-center mt-1">
                  {/* Track lines */}
                  <div 
                    className="h-1 w-10 relative overflow-hidden"
                    style={{ 
                      backgroundImage: `repeating-linear-gradient(to right, ${colors.accent}60, ${colors.accent}60 1px, transparent 1px, transparent 3px)`,
                    }}
                  >
                    {/* Running dot animation */}
                    <div 
                      className="absolute top-0 h-full w-1.5 rounded-full run-animation"
                      style={{ background: colors.accent }}
                    ></div>
                  </div>
                  
                  <span 
                    className="ml-2 text-xs tracking-wider"
                    style={{ color: c.textSecondary }}
                  >
                    2025
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button - Sport Artistic Design */}
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
            
            {/* Ball accent */}
            <div 
              className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 rounded-full opacity-80"
              style={{ background: colors.accent }}
            ></div>
          </button>

          {/* Nav Items - Sport Themed Design */}
          <nav className="flex-1 pr-2 overflow-y-auto overflow-x-hidden">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = activePath === item.link;
                
                // Assign sports-themed colors
                const itemColor = isActive ? colors.primary : c.textSecondary;
                
                return (
                  <li 
                    key={index}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="transition-all duration-300 ease-out"
                    style={getArtisticTransform(0.2, index + 1)}
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
                        boxShadow: (hoveredItem === index || isActive) ?
                          'inset 0 1px 3px rgba(0,0,0,0.05)' : 'none'
                      }}
                    >
                      {/* Active indicator - sporty accent */}
                      {isActive && (
                        <>
                          {/* Winner ribbon */}
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                            style={{ 
                              background: colors.accent,
                              opacity: 0.8
                            }}
                          ></div>
                          
                          {/* Activity pulse dots */}
                          <div 
                            className="absolute -right-0.5 top-1/2 -translate-y-1/2 flex"
                            style={{ opacity: expanded ? 1 : 0 }}
                          >
                            <div 
                              className="w-1 h-1 rounded-full mr-0.5 pulse-staggered-1"
                              style={{ background: colors.primary }}
                            ></div>
                            <div 
                              className="w-1 h-1 rounded-full mr-0.5 pulse-staggered-2"
                              style={{ background: colors.primary }}
                            ></div>
                            <div 
                              className="w-1 h-1 rounded-full pulse-staggered-3"
                              style={{ background: colors.primary }}
                            ></div>
                          </div>
                        </>
                      )}
                      
                      {/* Icon Container with sports-themed design */}
                      <div 
                        className={`
                          z-10 flex items-center justify-center h-9 w-9 rounded-xl
                          transition-all duration-300
                          ${hoveredItem === index ? 'scale-110' : ''}
                        `}
                        style={{ 
                          background: isActive ? 
                            `${colors.primary}15` : 
                            hoveredItem === index ? `${c.text}08` : 'transparent',
                          color: itemColor
                        }}
                      >
                        {item.icon}
                        
                        {/* Highlight spot */}
                        {(isActive || hoveredItem === index) && (
                          <div 
                            className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full opacity-70"
                            style={{ background: 'white', mixBlendMode: 'overlay' }}
                          ></div>
                        )}
                      </div>
                      
                      {/* Title with sport typography */}
                      {expanded && (
                        <span 
                          className="ml-3 text-sm tracking-wide transition-all duration-200"
                          style={{ 
                            color: isActive ? c.text : c.textSecondary,
                            fontWeight: isActive ? 400 : 300
                          }}
                        >
                          {item.title}
                          
                          {/* Show special sports icon for relevant sections */}
                          {(item.title === 'Rangliste' && isActive) && (
                            <Trophy 
                              className="inline-block ml-1.5" 
                              size={13}
                              style={{ color: colors.accent }}
                            />
                          )}
                          
                          {(item.title === 'Stationen' && isActive) && (
                            <Target
                              className="inline-block ml-1.5" 
                              size={13}
                              style={{ color: colors.accent }}
                            />
                          )}
                        </span>
                      )}
                    </Link>


                                        
                    {/* <Link 
                      to="/test-db"
                      className="flex items-center p-3 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="mr-3 p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm2 1h12v1H4V6zm0 3h12v1H4V9zm0 3h12v1H4v-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Database Test</span>
                    </Link> */}








                  </li>
                );
              })}
            </ul>
            
            {/* Athletic divider with timer-inspired design */}
            {expanded && (
              <div className="my-8 flex items-center">
                <div 
                  className="relative h-px w-full opacity-20 overflow-hidden"
                  style={{ 
                    background: c.text,
                    height: '2px'
                  }}
                >
                  {/* Running progress bar */}
                  <div 
                    className="absolute left-0 top-0 h-full progress-animation"
                    style={{ 
                      background: `linear-gradient(to right, ${colors.soft.blue}, ${colors.soft.green})`,
                      width: '30%'
                    }}
                  ></div>
                  
                  {/* Timer markers */}
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute top-0 h-2 w-px"
                      style={{ 
                        background: c.text,
                        left: `${i * 25}%`,
                        transform: 'translateY(-30%)'
                      }}
                    ></div>
                  ))}
                  
                  {/* Timer icon */}
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mt-[-10px]"
                    style={{ color: colors.accent }}
                  >
                    <Timer size={14} />
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Theme Toggle - Sport Themed Design */}
          <button
            onClick={toggleDarkMode}
            className={`
              relative mb-6 flex items-center py-2.5 px-2 rounded-xl
              ${!expanded ? 'justify-center' : ''}
              transition-all duration-200 hover:bg-opacity-10
            `}
            style={{ 
              background: `${c.text}05`,
              overflow: 'hidden'
            }}
          >
            {/* Sport-themed background pattern */}
            <div 
              className="absolute right-0 bottom-0 w-20 h-20 opacity-[0.03]"
              style={{ 
                backgroundImage: `radial-gradient(circle, ${colors.primary} 1px, transparent 1px)`,
                backgroundSize: '8px 8px'
              }}
            ></div>
            
            <div 
              className="z-10 flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200"
              style={{ color: c.textSecondary }}
            >
              {darkMode ? (
                <Moon size={18} />
              ) : (
                <Sun size={18} />
              )}
            </div>
            
            {expanded && (
              <div className="ml-3">
                <p 
                  className="text-sm tracking-wide"
                  style={{ color: c.text }}
                >
                  {darkMode ? 'Nachtmodus' : 'Tagmodus'}
                </p>
                <div className="flex items-center mt-0.5">
                  <div 
                    className="w-3 h-0.5 rounded-full mr-1.5"
                    style={{ background: darkMode ? colors.soft.purple : colors.soft.orange, opacity: 0.6 }}
                  ></div>
                  <p 
                    className="text-xs"
                    style={{ color: c.textSecondary }}
                  >
                    {darkMode ? 'Wechseln zu hell' : 'Wechseln zu dunkel'}
                  </p>
                </div>
              </div>
            )}
            
            {/* Health indicator */}
            <div 
              className="absolute bottom-1 right-2"
              style={{ 
                color: darkMode ? colors.soft.blue : colors.soft.orange,
                opacity: 0.7,
                display: expanded ? 'block' : 'none'
              }}
            >
              <HeartPulse size={14} />
            </div>
          </button>

          {/* User Section - Sport Profile Design */}
          <div 
            className="relative pt-4 mt-2"
            style={{ 
              borderTop: `1px solid ${c.border}`,
              borderImage: `linear-gradient(to right, ${colors.primary}10, ${colors.primary}40, ${colors.primary}10) 1`
            }}
          >
            {/* Sport medals accent */}
            <div 
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full"
              style={{ 
                background: c.surface,
                color: colors.accent
              }}
            >
              <Award size={12} />
            </div>
            
            <div className={`flex items-center ${!expanded && 'justify-center'}`}>
              {/* User avatar with sports badge frame */}
              <div className="relative h-10 w-10">
                <div 
                  className="absolute inset-0 rounded-xl overflow-hidden"
                  style={{ 
                    border: `1px solid ${c.border}`,
                    boxShadow: c.shadow
                  }}
                >
                  <img 
                    src={userIMG} 
                    alt="User" 
                    className="h-full w-full object-cover"
                  />
                </div>
                
                {/* Sports badge */}
                <div 
                  className="absolute -bottom-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full"
                  style={{ 
                    background: colors.soft.green,
                    border: `2px solid ${c.surface}`,
                    boxShadow: c.shadow
                  }}
                >
                  <Trophy size={10} className="text-white" />
                </div>
              </div>
              
              {expanded && (
                <div className="ml-3 overflow-hidden">
                  <p 
                    className="text-sm font-medium tracking-wide"
                    style={{ color: c.text }}
                  >
                    Admin User
                  </p>
                  <div className="flex items-center mt-0.5">
                    {/* Activity indicator */}
                    <div 
                      className="h-1.5 w-1.5 rounded-full mr-1.5 pulse-animation"
                      style={{ background: colors.soft.green }}
                    ></div>
                    <span 
                      className="text-xs"
                      style={{ color: c.textSecondary }}
                    >
                      Organisator
                    </span>
                  </div>
                </div>
              )}
              
              {expanded && (
                <button 
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

      {/* CSS for sport-themed animations */}
      <style jsx>{`
        /* Pulse animation for heart rate/activity */
        .pulse-animation {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.3; transform: scale(0.8); }
        }
        
        /* Running dot animation */
        .run-animation {
          animation: run 3s linear infinite;
        }
        
        @keyframes run {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        
        /* Progress bar animation */
        .progress-animation {
          animation: progress 8s ease-in-out infinite;
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        
        /* Staggered pulse animation for active menu items */
        .pulse-staggered-1 {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .pulse-staggered-2 {
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.3s;
        }
        
        .pulse-staggered-3 {
          animation: pulse 1.5s ease-in-out infinite;
          animation-delay: 0.6s;
        }
      `}</style>
    </>
  );
};

export default SportArtisticSidebar;