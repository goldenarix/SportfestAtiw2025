// import React from 'react';
// import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// const StatCard = ({ title, value, change, icon, trend }) => {
//   return (
//     <div className="rounded-lg border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
//       <div className="flex items-center justify-between">
//         <div className="rounded-md p-2 bg-slate-50">{icon}</div>
//         <span className={`inline-flex items-center text-xs font-medium ${
//           trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-slate-600'
//         }`}>
//           {trend === 'up' && <ArrowUpRight className="mr-1 h-3 w-3" />}
//           {trend === 'down' && <ArrowDownRight className="mr-1 h-3 w-3" />}
//           {change}
//         </span>
//       </div>
//       <div className="mt-4">
//         <h3 className="text-sm font-medium text-slate-500">{title}</h3>
//         <p className="mt-2 text-3xl font-bold">{value}</p>
//       </div>
//     </div>
//   );
// };

// export default StatCard;









import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon, trend, color, isHovering, cursorPosition }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getGradientBackground = () => {
    if (!color) return 'from-indigo-600 to-blue-600';
    return color;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative w-full h-full perspective rounded-2xl group cursor-pointer"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {/* Glow Effect */}
      <motion.div
        animate={{
          boxShadow: isHovered 
            ? `0 0 25px rgba(${color?.includes('indigo') ? '99, 102, 241' : color?.includes('emerald') ? '16, 185, 129' : '59, 130, 246'}, 0.3)` 
            : `0 0 0px rgba(0, 0, 0, 0)`
        }}
        className="absolute inset-0 rounded-2xl"
      />
      
      {/* Main Card */}
      <motion.div
        className="relative h-full rounded-2xl overflow-hidden backdrop-blur-xl bg-slate-900/50 border border-white/10 p-6 flex flex-col"
        animate={{
          rotateX: isHovering ? (cursorPosition.y / window.innerHeight - 0.5) * -10 : 0,
          rotateY: isHovering ? (cursorPosition.x / window.innerWidth - 0.5) * 10 : 0,
          translateZ: isHovered ? 20 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Background Gradient */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-br ${getGradientBackground()} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Interactive Particles */}
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white"
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  opacity: 0 
                }}
                animate={{ 
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatDelay: Math.random() 
                }}
              />
            ))}
          </>
        )}

        {/* Content */}
        <div className="flex items-center justify-between mb-4 z-10">
          {/* Icon Container */}
          <motion.div 
            className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${getGradientBackground()} shadow-lg z-10`}
            animate={{
              translateZ: isHovered ? 30 : 0,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {icon}
            
            {/* Reflection/Highlight */}
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-1/2 z-20"></div>
          </motion.div>
          
          {/* Change Indicator */}
          <motion.span 
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium z-10
              ${trend === 'up' 
                ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' 
                : 'bg-red-900/30 text-red-400 border border-red-500/20'}
            `}
            animate={{
              translateZ: isHovered ? 25 : 0,
            }}
            transition={{ duration: 0.3 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {trend === 'up' && <ArrowUpRight className="mr-1 h-3 w-3" />}
            {trend === 'down' && <ArrowDownRight className="mr-1 h-3 w-3" />}
            {change}
          </motion.span>
        </div>
        
        {/* Text Content */}
        <motion.h3 
          className="text-sm font-medium text-indigo-200/70 z-10"
          animate={{
            translateZ: isHovered ? 15 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="mt-2 text-3xl font-bold text-white z-10"
          animate={{
            translateZ: isHovered ? 20 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {value}
        </motion.p>
        
        {/* Interactive highlight effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ rotate: -30, scale: 2, x: '-100%' }}
          animate={{ 
            rotate: isHovered ? -30 : -30,
            x: isHovered ? '100%' : '-100%'
          }}
          transition={{ duration: isHovered ? 0.7 : 0 }}
        />
        
        {/* Animated border effect on hover */}
        {isHovered && (
          <motion.div 
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 rounded-2xl border border-white/20 overflow-hidden">
              <motion.div 
                className="absolute h-10 w-10 blur-sm"
                style={{ 
                  background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)`,
                  transform: "skewX(-20deg)" 
                }}
                animate={{
                  left: ['-40px', 'calc(100% + 40px)'],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StatCard;