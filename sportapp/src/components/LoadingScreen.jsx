import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const FuturisticLoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initialisiere Systeme');
  const [loadingPhase, setLoadingPhase] = useState(0);
  const canvasRef = useRef(null);

  // Simulate loading progress
  useEffect(() => {
    const loadingTexts = [
      'Initialisiere Systeme',
      'Lade Neuronales Netzwerk',
      'Kalibriere Holografische Schnittstelle',
      'Synchronisiere Quantendaten',
      'Verbinde mit Sportnetz',
      'Starte Benutzeroberfläche'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (1 + Math.random() * 2);
        
        // Update loading text based on progress
        const phase = Math.floor((newProgress / 100) * loadingTexts.length);
        if (phase !== loadingPhase && phase < loadingTexts.length) {
          setLoadingPhase(phase);
          setLoadingText(loadingTexts[phase]);
        }
        
        // Complete loading
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete();
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [loadingPhase, onLoadingComplete]);

  // Holographic particles effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsla(${210 + Math.random() * 30}, 100%, 70%, ${Math.random() * 0.5 + 0.2})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.05;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = [];
    const createParticles = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 100;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      createParticles();
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].size <= 0.2) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      requestAnimationFrame(animate);
    };

    animate();

    const resizeHandler = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  // Generate random glitching binary data
  const generateBinaryData = () => {
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += Math.random() > 0.5 ? '1' : '0';
      if (i % 8 === 7) result += ' ';
    }
    return result;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden">
      {/* Canvas for particles effect */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      
      {/* Holographic grid */}
      <div className="absolute inset-0 holographic-grid opacity-20"></div>
      
      {/* Animated scanner line */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-[2px] bg-neon-blue blur-[2px] holographic-scanner"></div>
      </div>
      
      <div className="relative z-10 max-w-2xl w-full px-6 py-8">
        {/* Logo */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-display text-6xl">S</span>
            </div>
            
            {/* Pulsing effect */}
            <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-xl opacity-50 animate-pulse"></div>
            
            {/* Rotating outer ring */}
            <div className="absolute -inset-4 border border-indigo-500/20 rounded-full"></div>
            <div className="absolute -inset-4 border-2 border-t-indigo-500 border-l-transparent border-b-transparent border-r-transparent rounded-full animate-spin-slow"></div>
            <div className="absolute -inset-8 border border-indigo-500/10 rounded-full"></div>
            <div className="absolute -inset-8 border-2 border-b-indigo-400 border-l-transparent border-t-transparent border-r-transparent rounded-full animate-spin-reverse-slow"></div>
          </div>
        </motion.div>
      
        {/* Main loading indicator */}
        <motion.div
          className="relative backdrop-blur-sm bg-slate-900/30 p-8 rounded-2xl border border-slate-700/50 shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-10 h-1 bg-neon-blue"></div>
          <div className="absolute top-0 left-0 w-1 h-10 bg-neon-blue"></div>
          <div className="absolute bottom-0 right-0 w-10 h-1 bg-neon-blue"></div>
          <div className="absolute bottom-0 right-0 w-1 h-10 bg-neon-blue"></div>
          
          {/* Text and status */}
          <div className="text-center mb-8">
            <motion.h2 
              className="text-2xl sm:text-3xl font-display text-white mb-2 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              SPORTAPP <span className="text-neon-blue">NextGen</span>
            </motion.h2>
            <motion.p 
              className="text-sm text-slate-400 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Nächste Generation der Sportfest-Verwaltung mit Quantenprozessor-Technologie
            </motion.p>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-1 bg-slate-700/50 rounded-full mb-3 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-neon-blue rounded-full relative overflow-hidden"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            >
              {/* Light effect on the progress bar */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
            </motion.div>
          </div>
          
          {/* Progress info */}
          <div className="flex justify-between items-center mb-6">
            <div className="cyberpunk-text text-xs text-neon-blue animate-pulse">{loadingText}</div>
            <div className="text-xs font-mono text-white">{Math.round(progress)}%</div>
          </div>
          
          {/* Animated binary data */}
          <div className="text-[8px] font-mono text-slate-500 overflow-hidden h-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="mb-1 animate-text-slide">
                {generateBinaryData()}
              </div>
            ))}
          </div>
          
          {/* System status */}
          <div className="mt-6 flex justify-between text-xs">
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-neon-green animate-pulse mr-2"></span>
              <span className="text-slate-400">Quantum Engine</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-neon-blue animate-pulse mr-2"></span>
              <span className="text-slate-400">Neural Network</span>
            </div>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse mr-2"></span>
              <span className="text-slate-400">HoloSystems</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FuturisticLoadingScreen;