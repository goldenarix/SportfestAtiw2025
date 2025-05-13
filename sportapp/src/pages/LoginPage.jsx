import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeProvider'; // Import theme hook
import { 
  User, 
  Lock, 
  LogIn, 
  Shield, 
  UserCog, 
  AlertCircle, 
  CheckCircle,
  Moon,
  Sun
} from 'lucide-react';

// Vibration utility for Capacitor/PWA
const hapticFeedback = {
  light: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
    // Capacitor Haptics (for mobile apps)
    if (window.Capacitor && window.Capacitor.isNative) {
      window.Capacitor.Plugins.Haptics?.impact({ style: 'LIGHT' });
    }
  },
  medium: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
    if (window.Capacitor && window.Capacitor.isNative) {
      window.Capacitor.Plugins.Haptics?.impact({ style: 'MEDIUM' });
    }
  },
  heavy: () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    if (window.Capacitor && window.Capacitor.isNative) {
      window.Capacitor.Plugins.Haptics?.impact({ style: 'HEAVY' });
    }
  }
};

// Enhanced Muscle Cat Component with role-based glasses
const UltimateMuscleCat = ({ isError, isSuccess, isLoading, onAnimationComplete, onCatClick, isDarkMode, role }) => {
  const catRef = useRef(null);
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [catState, setCatState] = useState('idle');
  const [armRotation, setArmRotation] = useState(0);
  const [flexPower, setFlexPower] = useState(0);
  const [blinkTimer, setBlinkTimer] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState(0);
  const [speechBubble, setSpeechBubble] = useState('');
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [earWiggle, setEarWiggle] = useState(0);
  const [tailSwing, setTailSwing] = useState(0);
  const [whiskerTwitch, setWhiskerTwitch] = useState(0);
  const [isPetting, setIsPetting] = useState(false);
  const [pettingIntensity, setPettingIntensity] = useState(0);
  const [purring, setPurring] = useState(false);
  const [lastPetTime, setLastPetTime] = useState(0);
  const [petCount, setPetCount] = useState(0);

  // Random cat quotes
  const randomQuotes = {
    idle: [
      "Miau! Bereit für's Training? 💪",
      "Psst... klick mich an! 😸",
      "Sport macht stark! 🏋️‍♀️",
      "Heute wird trainiert! 🔥",
      "Fehlt nur noch der Login! ⚡",
      "Ich bin startklar! 🚀",
      "Sportfest? Let's gooo! 🎯",
      "Fitness-Time! 💪😼",
      "Miau-Power aktiviert! ⚡"
    ],
    flexing: [
      "Guck mal, wie stark ich bin! 💪",
      "Grrrrrr! 😤",
      "Katzen-Power! 🔥",
      "Wer braucht Protein-Shakes? 😎",
      "Muskeln like a BOSS! 💥",
      "Flex-Appeal! 💪😸"
    ],
    benchpress: [
      "Heute: Bankdrücken! 🏋️‍♀️",
      "Easy peasy! 😸",
      "Können wir mal anfangen? 💪",
      "Warte auf den Login... ⏰",
      "Trainingszeit! 🏋️‍♀️"
    ],
    clicked: [
      "Miauuu! Das kitzelt! 😹",
      "Nochmal! Nochmal! 🎯",
      "Du bist ja spielerisch! 😸",
      "Hehe, das macht Spaß! 🥰",
      "Kitzel-Alarm! 😂",
      "Miau-Miau! 😻",
      "Hehe! *schnurr* 😸"
     
    ],
    loading: [
      "Lass mich mal schauen... 🔍",
      "Einen Moment bitte! ⏳",
      "Prüfe die Daten... 💻",
      "Fast geschafft! ⚡"
    ],
    purring: [
      "*schnurr schnurr* 😻",
      "Das fühlt sich gut an! 😌",
      "Mmmh... *schnurr* 🥰",
      "Mehr! Bitte mehr! 😸",
      "*ronron* Das ist so schön! 💖",
      "Oh ja! *schnurrr* 😻",
      "Das mag ich! *schnurr schnurr* 🐱",
      "Weiter so! *mrrr* 💕"
    ]
  };

  // Handle cat interactions
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsPetting(true);
    setPettingIntensity(1);
    const now = Date.now();
    setLastPetTime(now);
    hapticFeedback.light();
  };

  const handleMouseMove = (e) => {
    if (isPetting) {
      e.preventDefault();
      setPettingIntensity(prev => Math.min(prev + 0.5, 10));
      const now = Date.now();
      if (now - lastPetTime > 50) {
        hapticFeedback.light();
        setLastPetTime(now);
      }
    }
  };

  const handleMouseUp = (e) => {
    if (isPetting) {
      e.preventDefault();
      setIsPetting(false);
      const newPetCount = petCount + 1;
      setPetCount(newPetCount);
      
      // Start purring if petted enough
      if (pettingIntensity > 5) {
        setPurring(true);
        setCatState('purring');
        const purringQuote = randomQuotes.purring[Math.floor(Math.random() * randomQuotes.purring.length)];
        setSpeechBubble(purringQuote);
        setShowSpeechBubble(true);
        
        // Continue purring for a while
        setTimeout(() => {
          setPurring(false);
          setCatState('idle');
          setShowSpeechBubble(false);
        }, 4000);
      }
      
      setPettingIntensity(0);
      hapticFeedback.medium();
    }
  };

  // Handle touch events separately for better mobile support
  const handleTouchStart = (e) => {
    e.preventDefault();
    setIsPetting(true);
    setPettingIntensity(1);
    const now = Date.now();
    setLastPetTime(now);
    hapticFeedback.light();
  };

  const handleTouchMove = (e) => {
    if (isPetting) {
      e.preventDefault();
      setPettingIntensity(prev => Math.min(prev + 0.5, 10));
      const now = Date.now();
      if (now - lastPetTime > 50) {
        hapticFeedback.light();
        setLastPetTime(now);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (isPetting) {
      e.preventDefault();
      setIsPetting(false);
      const newPetCount = petCount + 1;
      setPetCount(newPetCount);
      
      // Start purring if petted enough
      if (pettingIntensity > 5) {
        setPurring(true);
        setCatState('purring');
        const purringQuote = randomQuotes.purring[Math.floor(Math.random() * randomQuotes.purring.length)];
        setSpeechBubble(purringQuote);
        setShowSpeechBubble(true);
        
        // Continue purring for a while
        setTimeout(() => {
          setPurring(false);
          setCatState('idle');
          setShowSpeechBubble(false);
        }, 4000);
      }
      
      setPettingIntensity(0);
      hapticFeedback.medium();
    }
  };

  // Handle cat click - separated from petting
  const handleCatClick = (e) => {
    // Only trigger click if not petting
    if (!isPetting) {
      const now = Date.now();
      const timeDiff = now - lastClickTime;
      setLastClickTime(now);
      
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      // Double click detection for special reactions
      if (timeDiff < 300) {
        setCatState('flexing');
        setSpeechBubble("Doppelklick! Zeig ich dir meine Muskeln! 💪");
        setTimeout(() => setCatState('idle'), 1500);
      }
      
      // Haptic feedback
      hapticFeedback.light();
      
      // Show random clicked quote
      const quote = randomQuotes.clicked[Math.floor(Math.random() * randomQuotes.clicked.length)];
      setSpeechBubble(quote);
      setShowSpeechBubble(true);
      
      // Special reactions based on click count
      if (newCount === 5) {
        setCatState('flexing');
        setSpeechBubble("Wow! Du bist persistent! 💪");
        setTimeout(() => setCatState('idle'), 2000);
      } else if (newCount === 10) {
        setCatState('benchpress');
        setSpeechBubble("OK, du hast es verdient! Schau zu! 🏋️‍♀️");
        setTimeout(() => setCatState('idle'), 3000);
      }
      
      // Hide speech bubble after 3 seconds
      setTimeout(() => {
        setShowSpeechBubble(false);
      }, 3000);
      
      // Call parent handler
      onCatClick?.();
    }
  };

  // Random idle animations
  useEffect(() => {
    if (catState !== 'idle') return;
    
    // Happy tail wagging when purring
    if (catState === 'purring') {
      const fastTailTimer = setInterval(() => {
        setTailSwing(prev => (prev + 5) % 180);
      }, 50);
      
      // Happy ears
      const happyEarTimer = setInterval(() => {
        setEarWiggle(prev => (prev + 8) % 360);
      }, 40);
      
      return () => {
        clearInterval(fastTailTimer);
        clearInterval(happyEarTimer);
      };
    }

    // Ear wiggle animation
    const earTimer = setInterval(() => {
      setEarWiggle(prev => (prev + 1) % 360);
    }, 50);
    
    // Tail swing animation
    const tailTimer = setInterval(() => {
      setTailSwing(prev => (prev + 7) % 360);
    }, 100);
    
    // Whisker twitch
    const whiskerTimer = setInterval(() => {
      if (Math.random() < 0.3) {
        setWhiskerTwitch(Math.random() * 10 - 5);
        setTimeout(() => setWhiskerTwitch(0), 200);
      }
    }, 2000);
    
    // Random speech bubbles
    const randomInterval = setInterval(() => {
      if (Math.random() < 0.3 && !showSpeechBubble) {
        const quote = randomQuotes.idle[Math.floor(Math.random() * randomQuotes.idle.length)];
        setSpeechBubble(quote);
        setShowSpeechBubble(true);
        setTimeout(() => setShowSpeechBubble(false), 4000);
      }
    }, 5000);
    
    // Random actions
    const actionInterval = setInterval(() => {
      const random = Math.random();
      if (random < 0.12) {
        setCatState('flexing');
        const flexQuote = randomQuotes.flexing[Math.floor(Math.random() * randomQuotes.flexing.length)];
        setSpeechBubble(flexQuote);
        setShowSpeechBubble(true);
        setTimeout(() => {
          setCatState('idle');
          setShowSpeechBubble(false);
        }, 2000);
      } else if (random < 0.15) {
        setCatState('benchpress');
        const benchQuote = randomQuotes.benchpress[Math.floor(Math.random() * randomQuotes.benchpress.length)];
        setSpeechBubble(benchQuote);
        setShowSpeechBubble(true);
        setTimeout(() => {
          setCatState('idle');
          setShowSpeechBubble(false);
        }, 3000);
      }
    }, 10000);

    return () => {
      clearInterval(earTimer);
      clearInterval(tailTimer);
      clearInterval(whiskerTimer);
      clearInterval(randomInterval);
      clearInterval(actionInterval);
    };
  }, [catState, showSpeechBubble]);

  // State management
  useEffect(() => {
    if (isError) {
      setCatState('error');
      hapticFeedback.heavy();
      setSpeechBubble("Nanuuu! Das ist nicht gut! 😿");
      setShowSpeechBubble(true);
      
      const timer = setTimeout(() => {
        setCatState('idle');
        setShowSpeechBubble(false);
        onAnimationComplete();
      }, 1800);
      return () => clearTimeout(timer);
    } else if (isSuccess) {
      setCatState('success');
      hapticFeedback.heavy();
      setSpeechBubble("YEEEEES! Wir haben es geschafft! 🎉");
      setShowSpeechBubble(true);
      
      const timer = setTimeout(() => {
        setCatState('idle');
        setShowSpeechBubble(false);
        onAnimationComplete();
      }, 3000);
      return () => clearTimeout(timer);
    } else if (isLoading) {
      setCatState('loading');
      const randomLoadingQuote = randomQuotes.loading[Math.floor(Math.random() * randomQuotes.loading.length)];
      setSpeechBubble(randomLoadingQuote);
      setShowSpeechBubble(true);
    } else {
      setCatState('idle');
    }
  }, [isError, isSuccess, isLoading, onAnimationComplete]);

  // Breathing animation for realism
  useEffect(() => {
    const breathingTimer = setInterval(() => {
      setBreathingPhase(prev => (prev + 1) % 120);
    }, 50);
    return () => clearInterval(breathingTimer);
  }, []);

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkTimer(prev => (prev + 1) % 180);
    }, 50);
    return () => clearInterval(blinkInterval);
  }, []);

  // Flexing animation
  useEffect(() => {
    if (catState === 'flexing') {
      const flexInterval = setInterval(() => {
        setFlexPower(prev => {
          if (prev >= 100) return 0;
          return prev + 5;
        });
      }, 30);
      return () => clearInterval(flexInterval);
    } else {
      setFlexPower(0);
    }
  }, [catState]);

  // Bench press animation
  useEffect(() => {
    if (catState === 'benchpress') {
      const benchInterval = setInterval(() => {
        setArmRotation(prev => {
          if (prev >= 90) return -90;
          return prev + 10;
        });
      }, 100);
      return () => clearInterval(benchInterval);
    } else {
      setArmRotation(0);
    }
  }, [catState]);

  // Eye tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!catRef.current || catState === 'error') return;
      
      const rect = catRef.current.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2 - 20;
      
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const deltaX = mouseX - catCenterX;
      const deltaY = mouseY - catCenterY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      // Reduce max movement to 5 to keep pupils inside eyes (eye radius: 14, pupil radius: 8)
      const maxMove = 5;
      
      setEyePosition({
        x: Math.max(-maxMove, Math.min(maxMove, deltaX / distance * maxMove)) || 0,
        y: Math.max(-maxMove, Math.min(maxMove, deltaY / distance * maxMove)) || 0
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [catState]);

  // Calculate breathing offset
  const breathingOffset = Math.sin(breathingPhase * Math.PI / 60) * 2;
  
  // Calculate eye blink
  const eyeHeight = blinkTimer > 170 && blinkTimer < 175 ? 0.1 : 1;
  
  // Animation styles - NO ROTATION for loading state
  const containerStyle = {
    transform: catState === 'error' ? `translateX(${Math.sin(Date.now() / 50) * 8}px)` :
               catState === 'success' ? `translateY(${Math.sin(Date.now() / 200) * 10 - 5}px) rotate(${Math.sin(Date.now() / 300) * 5}deg)` :
               catState === 'loading' ? `translateY(${breathingOffset}px) scale(${1 + Math.sin(Date.now() / 100) * 0.02})` : // Scale instead of rotate
               `translateY(${breathingOffset}px)`,
    transition: catState === 'error' || catState === 'success' || catState === 'loading' ? 'none' : 'transform 0.3s ease'
  };

  const flexScale = catState === 'flexing' ? 1 + flexPower / 500 : 1;
  
  return (
    <div 
      ref={catRef}
      className="relative flex justify-center items-center cursor-pointer select-none"
      style={{ 
        width: '100%',
        height: '100%',
        maxWidth: '200px',
        maxHeight: '200px',
        margin: '0 auto',
        ...containerStyle 
      }}
      onClick={handleCatClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ touchAction: 'none' }} // Prevent scrolling while petting
    >
      {/* Special effects */}
      {catState === 'error' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-spin"
              style={{
                left: `${50 + 30 * Math.cos(i * 60 * Math.PI / 180)}%`,
                top: `${30 + 30 * Math.sin(i * 60 * Math.PI / 180)}%`,
                color: '#fbbf24',
                fontSize: '20px',
                animation: `spin 1s linear infinite ${i * 0.1}s`
              }}
            >
              ⭐
            </div>
          ))}
        </div>
      )}

      {catState === 'success' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 10}%`,
                top: '50%',
                color: '#ef4444',
                fontSize: '18px',
                animation: `float-up 2s ease-out ${i * 0.2}s forwards`
              }}
            >
              ❤️
            </div>
          ))}
        </div>
      )}



      {/* Main SVG with perfect proportions */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 180 200" 
        className="drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Definitions for gradients and effects */}
        <defs>
          <linearGradient id="catGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="muscleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <radialGradient id="eyeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f3f4f6" />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse 
          cx="90" 
          cy="185" 
          rx="50" 
          ry="8" 
          fill="#00000015"
          className="transition-all duration-500"
        />

        {/* Background circle for body */}
        <circle 
          cx="90" 
          cy="100" 
          r="65" 
          fill="url(#catGradient)" 
          stroke="#92400e" 
          strokeWidth="2.5"
        />

        {/* Cat tail - enhanced animation */}
        <path 
          d="M35 115 Q15 135 20 160 Q25 180 35 170 Q40 160 35 140"
          fill="url(#catGradient)"
          stroke="#92400e"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            transform: `rotate(${Math.sin(tailSwing * Math.PI / 180) * (purring ? 25 : 15)}deg)`,
            transformOrigin: '35px 115px',
            transition: purring ? 'none' : 'transform 0.3s ease'
          }}
        />

        {/* Body details - chest muscles */}
        <ellipse 
          cx="90" 
          cy="115" 
          rx="32" 
          ry="16" 
          fill="url(#muscleGradient)" 
          opacity="0.3"
        />
        
        {/* Six-pack abs - perfectly proportioned */}
        <g opacity="0.4" fill="url(#muscleGradient)">
          <ellipse cx="80" cy="130" rx="6" ry="9" />
          <ellipse cx="90" cy="130" rx="6" ry="9" />
          <ellipse cx="100" cy="130" rx="6" ry="9" />
          <ellipse cx="85" cy="145" rx="6" ry="9" />
          <ellipse cx="95" cy="145" rx="6" ry="9" />
        </g>

        {/* Arms - left */}
        <g transform={`translate(35, 85) rotate(${catState === 'benchpress' ? armRotation : 0}) translate(-35, -85)`}>
          <ellipse 
            cx="35" 
            cy="100" 
            rx="18" 
            ry="38"
            fill="url(#catGradient)" 
            stroke="#92400e" 
            strokeWidth="2.5"
          />
          {/* Bicep */}
          <circle 
            cx="35" 
            cy="75" 
            r={catState === 'flexing' ? 13 + flexPower / 10 : 13} 
            fill="url(#muscleGradient)" 
            opacity="0.8"
          />
          {/* Fist */}
          <circle 
            cx="35" 
            cy="130" 
            r="12" 
            fill="url(#catGradient)" 
            stroke="#92400e" 
            strokeWidth="2"
          />
        </g>

        {/* Arms - right */}
        <g transform={`translate(145, 85) rotate(${catState === 'benchpress' ? -armRotation : 0}) translate(-145, -85)`}>
          <ellipse 
            cx="145" 
            cy="100" 
            rx="18" 
            ry="38"
            fill="url(#catGradient)" 
            stroke="#92400e" 
            strokeWidth="2.5"
          />
          {/* Bicep */}
          <circle 
            cx="145" 
            cy="75" 
            r={catState === 'flexing' ? 13 + flexPower / 10 : 13} 
            fill="url(#muscleGradient)" 
            opacity="0.8"
          />
          {/* Fist */}
          <circle 
            cx="145" 
            cy="130" 
            r="12" 
            fill="url(#catGradient)" 
            stroke="#92400e" 
            strokeWidth="2"
          />
        </g>

        {/* Cat head */}
        <circle 
          cx="90" 
          cy="65" 
          r="42" 
          fill="url(#catGradient)" 
          stroke="#92400e" 
          strokeWidth="2.5"
        />

        {/* Ears - with wiggle animation */}
        <g style={{ transform: `rotate(${Math.sin(earWiggle * Math.PI / 180) * 2}deg)`, transformOrigin: '90px 65px' }}>
          <path 
            d="M60 38 L68 8 L85 32 Z" 
            fill="url(#catGradient)" 
            stroke="#92400e" 
            strokeWidth="2.5"
          />
          <path 
            d="M95 32 L112 8 L120 38 Z" 
            fill="url(#catGradient)" 
            stroke="#92400e" 
            strokeWidth="2.5"
          />
          {/* Inner ears */}
          <path 
            d="M63 35 L70 15 L82 30 Z" 
            fill="#fb923c"
          />
          <path 
            d="M98 30 L110 15 L117 35 Z" 
            fill="#fb923c"
          />
        </g>

        {/* Sports headband */}
        <rect 
          x="55" 
          y="37" 
          width="70" 
          height="8" 
          rx="4"
          fill="#3b82f6" 
          stroke="#1e40af"
          strokeWidth="1.5"
        />
        <text x="90" y="44" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">💪 POWER 💪</text>

        {/* Cheeks */}
        <circle 
          cx="62" 
          cy="75" 
          r="12" 
          fill="#feb86d" 
          opacity="0.7"
        />
        <circle 
          cx="118" 
          cy="75" 
          r="12" 
          fill="#feb86d" 
          opacity="0.7"
        />

        {/* Eyes - perfectly proportioned */}
        <g>
          <ellipse 
            cx="75" 
            cy="58" 
            rx="14" 
            ry={14 * eyeHeight} 
            fill="url(#eyeGradient)" 
            stroke="#1f2937" 
            strokeWidth="2.5"
          />
          <ellipse 
            cx="105" 
            cy="58" 
            rx="14" 
            ry={14 * eyeHeight} 
            fill="url(#eyeGradient)" 
            stroke="#1f2937" 
            strokeWidth="2.5"
          />
          
          {/* Pupils */}
          <circle 
            cx={75 + eyePosition.x} 
            cy={58 + eyePosition.y} 
            r={catState === 'error' ? 9 : 8} 
            fill="#1f2937"
            style={{ transition: 'r 0.3s' }}
          />
          <circle 
            cx={105 + eyePosition.x} 
            cy={58 + eyePosition.y} 
            r={catState === 'error' ? 9 : 8} 
            fill="#1f2937"
            style={{ transition: 'r 0.3s' }}
          />
          
          {/* Eye shine */}
          <circle 
            cx={71 + eyePosition.x} 
            cy={54 + eyePosition.y} 
            r="4" 
            fill="white"
            opacity="0.9"
          />
          <circle 
            cx={101 + eyePosition.x} 
            cy={54 + eyePosition.y} 
            r="4" 
            fill="white"
            opacity="0.9"
          />
          
          {/* Extra sparkles */}
          <circle 
            cx={77 + eyePosition.x} 
            cy={60 + eyePosition.y} 
            r="1.5" 
            fill="white"
            opacity="0.6"
          />
          <circle 
            cx={107 + eyePosition.x} 
            cy={60 + eyePosition.y} 
            r="1.5" 
            fill="white"
            opacity="0.6"
          />
        </g>

        {/* Admin Glasses - only shown when role is 'admin' */}
        {role === 'admin' && (
          <g>
            {/* Glass frames - properly sized */}
            <ellipse 
              cx="75" 
              cy="58" 
              rx="16" 
              ry="15"
              fill="none" 
              stroke="#374151" 
              strokeWidth="2.5"
            />
            <ellipse 
              cx="105" 
              cy="58" 
              rx="16" 
              ry="15"
              fill="none" 
              stroke="#374151" 
              strokeWidth="2.5"
            />
            
            {/* Bridge */}
            <path 
              d="M 91 58 L 89 58" 
              stroke="#374151" 
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            
            {/* Temples/Arms - positioned behind ears */}
            <path 
              d="M 59 58 L 55 55 L 50 50" 
              stroke="#374151" 
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path 
              d="M 121 58 L 125 55 L 130 50" 
              stroke="#374151" 
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Lens reflection */}
            <ellipse 
              cx="70" 
              cy="53" 
              rx="4" 
              ry="3" 
              fill="#ffffff" 
              opacity="0.4"
            />
            <ellipse 
              cx="100" 
              cy="53" 
              rx="4" 
              ry="3" 
              fill="#ffffff" 
              opacity="0.4"
            />
            
            {/* Optional lens tint */}
            <ellipse 
              cx="75" 
              cy="58" 
              rx="15" 
              ry="14"
              fill="#60a5fa" 
              opacity="0.1"
            />
            <ellipse 
              cx="105" 
              cy="58" 
              rx="15" 
              ry="14"
              fill="#60a5fa" 
              opacity="0.1"
            />
          </g>
        )}

        {/* Nose */}
        <path 
          d="M87 70 Q90 66 93 70 Q90 74 87 70" 
          fill="#fb923c"
          stroke="#d97706"
          strokeWidth="1.5"
        />

        {/* Mouth */}
        <path 
          d={catState === 'success' ? "M90 72 Q86 78 82 76 M90 72 Q94 78 98 76" :
             catState === 'error' ? "M90 82 Q86 87 82 85 M90 82 Q94 87 98 85" :
             "M90 72 Q86 77 82 75 M90 72 Q94 77 98 75"}
          stroke="#92400e" 
          strokeWidth="2" 
          fill="none"
          strokeLinecap="round"
          style={{ transition: 'd 0.5s' }}
        />

        {/* Whiskers - with subtle twitch */}
        <g stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" transform={`translate(${whiskerTwitch}, 0)`}>
          <path d="M45 70 L70 72" />
          <path d="M45 73 L70 73" />
          <path d="M45 76 L70 74" />
          <path d="M135 70 L110 72" />
          <path d="M135 73 L110 73" />
          <path d="M135 76 L110 74" />
        </g>

        {/* Admin Glasses - moved here to be drawn on top */}
        {role === 'admin' && (
          <g>
            {/* Glass frames - properly sized */}
            <ellipse 
              cx="75" 
              cy="58" 
              rx="16" 
              ry="15"
              fill="none" 
              stroke="#374151" 
              strokeWidth="2.5"
            />
            <ellipse 
              cx="105" 
              cy="58" 
              rx="16" 
              ry="15"
              fill="none" 
              stroke="#374151" 
              strokeWidth="2.5"
            />
            
            {/* Bridge */}
            <path 
              d="M 91 58 L 89 58" 
              stroke="#374151" 
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            
            {/* Temples/Arms - positioned behind ears */}
            <path 
              d="M 59 58 L 55 55 L 50 50" 
              stroke="#374151" 
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path 
              d="M 121 58 L 125 55 L 130 50" 
              stroke="#374151" 
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Lens reflection */}
            <ellipse 
              cx="70" 
              cy="53" 
              rx="4" 
              ry="3" 
              fill="#ffffff" 
              opacity="0.4"
            />
            <ellipse 
              cx="100" 
              cy="53" 
              rx="4" 
              ry="3" 
              fill="#ffffff" 
              opacity="0.4"
            />
            
            {/* Optional lens tint */}
            <ellipse 
              cx="75" 
              cy="58" 
              rx="15" 
              ry="14"
              fill="#60a5fa" 
              opacity="0.1"
            />
            <ellipse 
              cx="105" 
              cy="58" 
              rx="15" 
              ry="14"
              fill="#60a5fa" 
              opacity="0.1"
            />
          </g>
        )}

        {/* Bench press bar (when doing bench press) */}
        {catState === 'benchpress' && (
          <g transform={`translate(90, 82) rotate(${armRotation}) translate(-90, -82)`}>
            <rect 
              x="25" 
              y="77" 
              width="130" 
              height="10" 
              rx="5"
              fill="#64748b" 
              stroke="#334155"
              strokeWidth="2"
            />
            <circle cx="30" cy="82" r="7" fill="#1e293b" />
            <circle cx="150" cy="82" r="7" fill="#1e293b" />
          </g>
        )}
      </svg>

      {purring && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${30 + i * 10}%`,
                top: `${20 + Math.sin(i + Date.now() / 300) * 10}%`,
                color: '#ec4899',
                fontSize: '16px',
                animation: `float-love 3s ease-in-out infinite ${i * 0.5}s`
              }}
            >
              💕
            </div>
          ))}
          
          {/* Purring visual effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></div>
          </div>
        </div>
      )}

      {/* Speech bubble - mobile optimized */}
      {showSpeechBubble && (
        <div 
          className={`absolute ${catState === 'error' ? 'bottom-12' : 'bottom-8'} left-1/2 transform -translate-x-1/2 transition-all duration-300`}
        >
          <div className={`${
            catState === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20' :
            catState === 'error' ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/20' :
            catState === 'loading' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20' :
            catState === 'flexing' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/20' :
            catState === 'benchpress' ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/20' :
            catState === 'purring' ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/20' :
            'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-blue-500/20'
          } rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap animate-bounce-in max-w-xs`}
          style={{ wordBreak: 'normal' }}
          >
            {speechBubble}
            <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-6 ${
              catState === 'success' ? 'border-b-green-500' :
              catState === 'error' ? 'border-b-red-500' :
              catState === 'loading' ? 'border-b-blue-500' :
              catState === 'flexing' ? 'border-b-yellow-500' :
              catState === 'benchpress' ? 'border-b-purple-500' :
              catState === 'purring' ? 'border-b-pink-500' :
              'border-b-indigo-500'
            }`}></div>
          </div>
        </div>
      )}

      {/* Click counter for easter egg */}
      {clickCount > 3 && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce-in">
          {clickCount}
        </div>
      )}

      {/* Global styles */}
      <style jsx>{`
        @keyframes bounce-in {
          0% { opacity: 0; transform: translateY(10px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes float-up {
          0% { opacity: 0; transform: translateY(0) scale(0); }
          20% { opacity: 1; transform: translateY(-20px) scale(1); }
          100% { opacity: 0; transform: translateY(-60px) scale(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg) scale(0); opacity: 0; }
          50% { transform: rotate(180deg) scale(1); opacity: 1; }
          100% { transform: rotate(360deg) scale(0); opacity: 0; }
        }
        
        @keyframes float-love {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 1; transform: translateY(-30px) scale(1); }
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out backwards;
        }
        
        @media (max-width: 768px) {
          .fixed.bottom-4.right-4 {
            bottom: 16px;
            right: 16px;
          }
          .fixed.bottom-4.left-4 {
            bottom: 16px;
            left: 16px;
          }
        }
        
        @media (max-width: 480px) {
          .fixed.bottom-4.right-4 {
            bottom: 12px;
            right: 12px;
          }
          .fixed.bottom-4.left-4 {
            bottom: 12px;
            left: 12px;
          }
        }
      `}</style>
    </div>
  );
};

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('betreuer');
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCatError, setShowCatError] = useState(false);
  const [showCatSuccess, setShowCatSuccess] = useState(false);
  
  // Use existing theme context
  const { isDarkMode, toggleTheme } = useTheme();

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Haptic feedback on submit
    hapticFeedback.medium();
    
    setLoginError('');
    setSuccessMessage('');
    
    if (!username || !password) {
      setLoginError('Bitte geben Sie einen Benutzernamen und ein Passwort ein.');
      setShowCatError(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password, role);
      
      if (success) {
        setSuccessMessage('Anmeldung erfolgreich. Sie werden weitergeleitet...');
        setShowCatSuccess(true);
      } else {
        setLoginError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
        setShowCatError(true);
      }
    } catch (error) {
      setLoginError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      setShowCatError(true);
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCatAnimationComplete = () => {
    setShowCatError(false);
    setShowCatSuccess(false);
  };

  const handleCatClick = () => {
    // Fun cat interaction
    if (!isSubmitting) {
      hapticFeedback.light();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-10 animate-float"
            style={{
              left: `${20 + i * 20}%`,
              top: `${10 + (i % 3) * 30}%`,
              animation: `float ${4 + i}s ease-in-out infinite ${i * 0.5}s`,
              fontSize: '2rem'
            }}
          >
            💪
          </div>
        ))}
      </div>

      {/* Main container - optimized for mobile */}
      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center p-2 sm:p-4 lg:p-8 relative z-10 max-h-screen overflow-hidden gap-4 lg:gap-12">
        {/* Left side - Cat and branding */}
        <div className="flex flex-col items-center space-y-2 lg:space-y-8 mb-4 lg:mb-0 lg:mr-8 min-h-0">
          {/* Logo and app name */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg lg:shadow-xl mb-2 lg:mb-3 relative overflow-hidden">
              <LogIn className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent animate-shimmer"></div>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 leading-tight">
              SportApp
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm lg:text-lg font-medium">Sportfest 2025</p>
          </div>
          
          {/* Ultimate Muscle Cat */}
          <div className="relative w-full max-w-[160px] sm:max-w-[200px] lg:max-w-none flex justify-center items-center">
            <UltimateMuscleCat 
              isError={showCatError} 
              isSuccess={showCatSuccess}
              isLoading={isSubmitting}
              onAnimationComplete={handleCatAnimationComplete}
              onCatClick={handleCatClick}
              isDarkMode={isDarkMode}
              role={role}
            />
          </div>
        </div>
        
        {/* Right side - Login card */}
        <div className="w-full max-w-sm lg:max-w-md flex-shrink-0">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-lg sm:rounded-xl lg:rounded-3xl shadow-lg lg:shadow-xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
            {/* Card header */}
            <div className="relative p-3 sm:p-4 lg:p-8 border-b border-slate-200/50 dark:border-slate-700/50">
              <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-slate-800 dark:text-white">
                Anmelden
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Bitte melden Sie sich an, um fortzufahren
              </p>
              
              {/* Role selector */}
              <div className="flex items-center mt-3 lg:mt-6">
                <div className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mr-2 lg:mr-4">
                  Als:
                </div>
                <div className="flex rounded-md lg:rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 p-0.5 lg:p-1 shadow-inner">
                  <button
                    className={`flex items-center px-2 lg:px-4 py-1 lg:py-2 rounded-md lg:rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                      role === 'betreuer'
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                    }`}
                    onClick={() => {
                      setRole('betreuer');
                      hapticFeedback.light();
                    }}
                  >
                    <UserCog size={14} className="lg:hidden mr-1" />
                    <UserCog size={16} className="hidden lg:block mr-1.5 lg:mr-2" />
                    <span>Betreuer</span>
                  </button>
                  
                  <button
                    className={`flex items-center px-2 lg:px-4 py-1 lg:py-2 rounded-md lg:rounded-lg text-xs lg:text-sm font-medium transition-all duration-300 ${
                      role === 'admin'
                        ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg transform scale-105'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-600/50'
                    }`}
                    onClick={() => {
                      setRole('admin');
                      hapticFeedback.light();
                    }}
                  >
                    <Shield size={14} className="lg:hidden mr-1" />
                    <Shield size={16} className="hidden lg:block mr-1.5 lg:mr-2" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Login form */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 lg:p-8">
              {/* Username field */}
              <div className="mb-3 lg:mb-6">
                <label 
                  htmlFor="username" 
                  className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 lg:mb-2"
                >
                  Benutzername
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 lg:pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={16} className="sm:hidden" />
                    <User size={18} className="hidden sm:block" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => hapticFeedback.light()}
                    className="block w-full pl-8 lg:pl-12 pr-2 lg:pr-4 py-2 lg:py-3 border border-slate-300 dark:border-slate-600 rounded-md lg:rounded-xl bg-white dark:bg-slate-700 text-sm lg:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent disabled:bg-slate-50 disabled:dark:bg-slate-800 disabled:cursor-not-allowed transition-all duration-300"
                    placeholder={role === 'admin' ? "Admin-Benutzername" : "Betreuer-Name"}
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              
              {/* Password field */}
              <div className="mb-4 lg:mb-8">
                <label 
                  htmlFor="password" 
                  className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 lg:mb-2"
                >
                  Passwort
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2 lg:pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} className="sm:hidden" />
                    <Lock size={18} className="hidden sm:block" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => hapticFeedback.light()}
                    className="block w-full pl-8 lg:pl-12 pr-2 lg:pr-4 py-2 lg:py-3 border border-slate-300 dark:border-slate-600 rounded-md lg:rounded-xl bg-white dark:bg-slate-700 text-sm lg:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent disabled:bg-slate-50 disabled:dark:bg-slate-800 disabled:cursor-not-allowed transition-all duration-300"
                    placeholder="Passwort eingeben"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>
              
              {/* Error message */}
              {loginError && (
                <div className="mb-3 lg:mb-6 p-2 lg:p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-md lg:rounded-xl flex items-start animate-slide-in">
                  <AlertCircle size={16} className="sm:hidden text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <AlertCircle size={18} className="hidden sm:block text-red-500 dark:text-red-400 mt-0.5 mr-2 lg:mr-3 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">{loginError}</p>
                </div>
              )}
              
              {/* Success message */}
              {successMessage && (
                <div className="mb-3 lg:mb-6 p-2 lg:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-md lg:rounded-xl flex items-start animate-slide-in">
                  <CheckCircle size={16} className="sm:hidden text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <CheckCircle size={18} className="hidden sm:block text-green-500 dark:text-green-400 mt-0.5 mr-2 lg:mr-3 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">{successMessage}</p>
                </div>
              )}
              
              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => hapticFeedback.medium()}
                className="w-full flex items-center justify-center px-3 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-medium text-sm lg:text-base rounded-md lg:rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-102 active:scale-98 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs sm:text-sm lg:text-base">Wird angemeldet...</span>
                  </>
                ) : (
                  <>
                    <LogIn size={16} className="sm:hidden mr-2" />
                    <LogIn size={18} className="hidden sm:block mr-2 lg:mr-3" />
                    <span className="text-xs sm:text-sm lg:text-base">Anmelden</span>
                  </>
                )}
              </button>
              
              {/* Info text */}
              <p className="mt-3 lg:mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
                Wenden Sie sich an einen Administrator, wenn Sie Hilfe bei der Anmeldung benötigen.
              </p>
            </form>
          </div>
        </div>
      </div>
      
      {/* Dark mode toggle button */}
      <button
        onClick={() => {
          toggleTheme();
          hapticFeedback.light();
        }}
        className="fixed bottom-2 right-2 sm:bottom-4 sm:right-4 lg:bottom-6 lg:right-6 p-2 sm:p-3 lg:p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full shadow-md lg:shadow-lg border border-slate-200/50 dark:border-slate-700/50 transition-all duration-300 hover:scale-110 active:scale-95 z-20"
      >
        {isDarkMode ? (
          <Sun size={16} className="sm:hidden text-yellow-500" />
        ) : (
          <Moon size={16} className="sm:hidden text-slate-700" />
        )}
        {isDarkMode ? (
          <Sun size={20} className="hidden sm:block text-yellow-500" />
        ) : (
          <Moon size={20} className="hidden sm:block text-slate-700" />
        )}
      </button>
      
      {/* Footer */}
      <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 lg:left-6 text-xs text-slate-500 dark:text-slate-400 z-20">
        <p className="hidden sm:block">© 2025 SportApp. Alle Rechte vorbehalten.</p>
      </div>
      
      {/* Global animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slide-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;