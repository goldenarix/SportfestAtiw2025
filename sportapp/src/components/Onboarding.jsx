import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Zap, Shield, RadioTower, Users, Award, Fingerprint, Dna, XCircle } from 'lucide-react';

const FuturisticOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [initials, setInitials] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [preferences, setPreferences] = useState({
    dataSync: true,
    notifications: true,
    biometrics: false,
    analytics: true
  });
  const [interactionPoints, setInteractionPoints] = useState([]);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  
  // Create radial interactive points for the DNA visualization
  useEffect(() => {
    if (step === 2) {
      const points = [];
      const numPoints = 20;
      
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const radius = 120;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const delay = i * 0.05;
        
        points.push({ x, y, delay, active: Math.random() > 0.5 });
      }
      
      setInteractionPoints(points);
    }
  }, [step]);
  
  // Handle biometric scan simulation
  useEffect(() => {
    if (step === 1 && scanning) {
      const timer = setTimeout(() => {
        setScanComplete(true);
        setScanning(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [step, scanning]);
  
  // Camera access for "biometric" scanning
  const startScan = async () => {
    try {
      setScanning(true);
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        // Fallback if camera is not available
        setTimeout(() => {
          setScanComplete(true);
          setScanning(false);
        }, 3000);
      }
    } catch (error) {
      console.log('Camera access error or not available, using fallback:', error);
      // Simulate scan without camera
      setTimeout(() => {
        setScanComplete(true);
        setScanning(false);
      }, 3000);
    }
  };
  
  // Stop camera when scan is complete or component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);
  
  // Toggle preference settings
  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Next step handler
  const handleNext = () => {
    if (step === 3) {
      // Complete onboarding
      // Stop any active video streams
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      onComplete({
        initials,
        preferences
      });
    } else {
      setStep(prev => prev + 1);
    }
  };
  
  // Previous step handler
  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };
  
  // Handle biometric scan completion
  useEffect(() => {
    if (scanComplete && step === 1) {
      // Auto-advance after successful scan
      const timer = setTimeout(() => {
        handleNext();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [scanComplete, step]);

  // Onboarding steps data
  const steps = [
    {
      title: "Willkommen zur SportApp",
      description: "Deine SportApp ist bereit. Personalisiere deine Holographische Schnittstelle für ein optimales Erlebnis."
    },
    {
      title: "Biometrische Identifikation",
      description: "Eine sichere biologische Verbindung herstellen für nahtlose Authentifizierung und personalisierte Erfahrung."
    },
    {
      title: "Neuro-Kalibrierung",
      description: "Passe den kognitiven Algorithmus an deine Bedürfnisse an und optimiere die prädiktive Datenanalyse."
    },
    {
      title: "Systemkonfiguration",
      description: "Passe die Quantenverbindungen und Systemeinstellungen an deine Anforderungen an."
    }
  ];
  
  // Get current step data
  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center overflow-hidden" ref={containerRef}>
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
      
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-radial from-indigo-900/20 via-transparent to-transparent opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-radial from-violet-900/20 via-transparent to-transparent opacity-70"></div>
      
      {/* Holographic scanner line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent holographic-scanner"></div>
      </div>
      
      {/* Progress indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-1 w-10 rounded-full transition-all duration-500 ${
                index === step 
                  ? 'bg-neon-blue shadow-glow-blue' 
                  : index < step 
                    ? 'bg-indigo-500' 
                    : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Close button - only shown in development */}
      <button 
        className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
        onClick={onComplete}
      >
        <XCircle size={24} />
      </button>
      
      {/* Main content */}
      <div className="relative max-w-5xl w-full px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {/* Step header */}
            <div className="text-center mb-10">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl font-display text-white mb-3"
              >
                {currentStep.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-slate-400 max-w-lg mx-auto"
              >
                {currentStep.description}
              </motion.p>
            </div>
            
            {/* Step content */}
            <div className="mb-12">
              {/* Step 1: User Initialization */}
              {step === 0 && (
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative w-40 h-40 mb-10"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600/20 to-violet-600/20 backdrop-blur-sm border border-indigo-500/30 flex items-center justify-center overflow-hidden">
                      {initials ? (
                        <span className="text-white text-5xl font-display">{initials}</span>
                      ) : (
                        <Fingerprint className="text-white/50 w-16 h-16" />
                      )}
                    </div>
                    
                    {/* Animated rings */}
                    <div className="absolute -inset-3 border border-indigo-500/20 rounded-full"></div>
                    <div className="absolute -inset-3 border-2 border-t-indigo-500/40 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                    <div className="absolute -inset-6 border border-indigo-500/10 rounded-full"></div>
                    <div className="absolute -inset-6 border-2 border-b-indigo-400/30 border-r-transparent border-t-transparent border-l-transparent rounded-full animate-spin-reverse-slow"></div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="backdrop-blur-sm bg-slate-900/30 p-8 rounded-2xl border border-slate-700/50 shadow-xl w-full max-w-md"
                  >
                    <div className="mb-6">
                      <label className="block text-slate-300 text-sm font-medium mb-2">Deine Initialen</label>
                      <input
                        type="text"
                        maxLength="3"
                        value={initials}
                        onChange={(e) => setInitials(e.target.value.toUpperCase())}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 px-4 text-white text-center text-xl font-display focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
                        placeholder="XYZ"
                      />
                      <p className="mt-2 text-xs text-slate-500">Initialen werden in deinem holographischen Profil angezeigt</p>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-400">
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-neon-green mr-2"></span>
                        <span>Bio-System bereit</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-neon-blue mr-2"></span>
                        <span>Quantenlink aktiv</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
              
              {/* Step 2: Biometric Scan */}
              {step === 1 && (
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-64 h-64 mb-10 rounded-full overflow-hidden"
                  >
                    {/* Video element for camera */}
                    <video 
                      ref={videoRef} 
                      className={`absolute inset-0 w-full h-full object-cover ${scanning || scanComplete ? 'block' : 'hidden'}`}
                      muted
                    />
                    
                    {/* Placeholder when not scanning */}
                    {!scanning && !scanComplete && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <Shield className="text-slate-400 w-20 h-20" />
                      </div>
                    )}
                    
                    {/* Scan animation overlay */}
                    {scanning && (
                      <div className="absolute inset-0 z-10">
                        {/* Horizontal scan line */}
                        <div className="absolute inset-x-0 h-1 bg-neon-blue blur-sm top-0 animate-scan-vertical"></div>
                        
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-neon-blue"></div>
                        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-neon-blue"></div>
                        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-neon-blue"></div>
                        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-neon-blue"></div>
                        
                        {/* Scan text */}
                        <div className="absolute bottom-6 left-0 right-0 text-center text-neon-blue text-xs font-mono">
                          BIOMETRISCHE IDENTIFIKATION
                        </div>
                      </div>
                    )}
                    
                    {/* Success overlay */}
                    {scanComplete && (
                      <div className="absolute inset-0 z-10 bg-green-500/20 flex items-center justify-center">
                        <div className="bg-green-500 rounded-full p-3">
                          <Check className="text-white w-8 h-8" />
                        </div>
                      </div>
                    )}
                    
                    {/* Animated rings */}
                    <div className="absolute -inset-3 border border-slate-700 rounded-full"></div>
                    <div className="absolute -inset-3 border-2 border-t-neon-blue border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                    <div className="absolute -inset-6 border border-slate-800 rounded-full"></div>
                    <div className="absolute -inset-6 border-2 border-b-neon-blue border-r-transparent border-t-transparent border-l-transparent rounded-full animate-spin-reverse-slow"></div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="backdrop-blur-sm bg-slate-900/30 p-8 rounded-2xl border border-slate-700/50 shadow-xl w-full max-w-md"
                  >
                    {!scanning && !scanComplete ? (
                      <div className="text-center">
                        <p className="text-slate-400 mb-6">Die biometrische Identifikation erhöht deine Sicherheit und ermöglicht personalisierte Erfahrungen.</p>
                        
                        <button
                          onClick={startScan}
                          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:scale-105"
                        >
                          Biometrischen Scan starten
                        </button>
                      </div>
                    ) : scanning ? (
                      <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
                        <p className="text-slate-300">Biometrischer Scan läuft...</p>
                        <p className="text-slate-500 text-sm mt-2">Bitte halte deine Position für eine optimale Identifikation</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mb-4 text-green-500 flex items-center justify-center">
                          <Shield className="w-6 h-6 mr-2" />
                          <span className="font-medium">Identifikation erfolgreich</span>
                        </div>
                        <p className="text-slate-300">Biometrisches Profil erstellt und verschlüsselt</p>
                        <p className="text-slate-500 text-sm mt-2">Daten werden nur lokal auf deinem Gerät gespeichert</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
              
              {/* Step 3: Neuro-Calibration */}
              {step === 2 && (
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-64 h-64 mb-10 flex items-center justify-center"
                  >
                    {/* DNA Visualization */}
                    <div className="relative w-40 h-40">
                      <Dna className="text-indigo-500 w-full h-full" />
                      
                      {/* Interactive Points */}
                      {interactionPoints.map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: point.active ? 0.8 : 0.3, scale: 1 }}
                          transition={{ duration: 0.4, delay: point.delay }}
                          className={`absolute w-3 h-3 rounded-full ${point.active ? 'bg-neon-blue' : 'bg-slate-500'}`}
                          style={{ 
                            left: `calc(50% + ${point.x}px)`, 
                            top: `calc(50% + ${point.y}px)`,
                            transform: 'translate(-50%, -50%)'
                          }}
                          onClick={() => {
                            // Create a new array with the clicked point toggled
                            const newPoints = [...interactionPoints];
                            newPoints[index] = {
                              ...newPoints[index],
                              active: !newPoints[index].active
                            };
                            setInteractionPoints(newPoints);
                          }}
                        >
                          {/* Glow effect */}
                          {point.active && (
                            <div className="absolute inset-0 rounded-full bg-neon-blue blur-md -z-10"></div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Animated orbital rings */}
                    <div className="absolute inset-0 border-2 border-slate-700/30 rounded-full"></div>
                    <div className="absolute inset-0 border-2 border-t-neon-blue/40 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                    <div className="absolute -inset-10 border border-slate-700/20 rounded-full"></div>
                    <div className="absolute -inset-10 border-2 border-b-neon-blue/30 border-r-transparent border-t-transparent border-l-transparent rounded-full animate-spin-reverse-slow"></div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="backdrop-blur-sm bg-slate-900/30 p-8 rounded-2xl border border-slate-700/50 shadow-xl w-full max-w-md"
                  >
                    <div className="text-center mb-6">
                      <p className="text-slate-300">Kalibriere die neuralen Interaktionspunkte für optimale Vorhersagegenauigkeit</p>
                      <p className="text-sm text-slate-500 mt-2">Berühre die leuchtenden Punkte im DNA-Modell, um deine Präferenzen zu definieren</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center py-3 px-4 rounded-lg border border-slate-700 bg-slate-800/50">
                        <div className="text-xl font-display text-neon-blue mb-1">
                          {interactionPoints.filter(p => p.active).length}
                        </div>
                        <div className="text-xs text-slate-400">Aktive Knotenpunkte</div>
                      </div>
                      <div className="text-center py-3 px-4 rounded-lg border border-slate-700 bg-slate-800/50">
                        <div className="text-xl font-display text-indigo-400 mb-1">
                          {Math.round((interactionPoints.filter(p => p.active).length / interactionPoints.length) * 100)}%
                        </div>
                        <div className="text-xs text-slate-400">Neuro-Effizienz</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-400">
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-neon-green mr-2 animate-pulse"></span>
                        <span>Kalibrierung aktiv</span>
                      </div>
                      <div className="flex items-center">
                        <span className="h-2 w-2 rounded-full bg-neon-blue mr-2 animate-pulse"></span>
                        <span>Neurales Netzwerk synchronisiert</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
              
              {/* Step 4: System Configuration */}
              {step === 3 && (
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-64 h-64 mb-10 flex items-center justify-center"
                  >
                    {/* Rotating 3D cube */}
                    <div className="cube-container">
                      <div className="cube">
                        <div className="cube-face front">
                          <div className="flex items-center justify-center h-full w-full bg-slate-800/80 border border-indigo-500/30">
                            <Users className="text-indigo-400 w-12 h-12" />
                          </div>
                        </div>
                        <div className="cube-face back">
                          <div className="flex items-center justify-center h-full w-full bg-slate-800/80 border border-indigo-500/30">
                            <Shield className="text-indigo-400 w-12 h-12" />
                          </div>
                        </div>
                        <div className="cube-face right">
                          <div className="flex items-center justify-center h-full w-full bg-slate-800/80 border border-indigo-500/30">
                            <RadioTower className="text-indigo-400 w-12 h-12" />
                          </div>
                        </div>
                        <div className="cube-face left">
                          <div className="flex items-center justify-center h-full w-full bg-slate-800/80 border border-indigo-500/30">
                            <Zap className="text-indigo-400 w-12 h-12" />
                          </div>
                        </div>
                        <div className="cube-face top">
                          <div className="flex items-center justify-center h-full w-full bg-slate-800/80 border border-indigo-500/30">
                            <Award className="text-indigo-400 w-12 h-12" />
                          </div>
                        </div>
                        <div className="cube-face bottom">
                          <div className="flex items-center justify-center h-full w-full bg-slate-800/80 border border-indigo-500/30">
                            <Fingerprint className="text-indigo-400 w-12 h-12" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated energy field */}
                    <div className="absolute inset-0 border border-indigo-500/20 rounded-full"></div>
                    <div className="absolute -inset-4 border-2 border-t-indigo-500/30 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                    <div className="absolute -inset-8 border border-indigo-500/10 rounded-full"></div>
                    <div className="absolute -inset-12 border-2 border-b-indigo-400/20 border-r-transparent border-t-transparent border-l-transparent rounded-full animate-spin-reverse-slow"></div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="backdrop-blur-sm bg-slate-900/30 p-8 rounded-2xl border border-slate-700/50 shadow-xl w-full max-w-md"
                  >
                    <div className="space-y-4 mb-6">
                      <h3 className="text-slate-300 font-medium">Systemeinstellungen konfigurieren</h3>
                      
                      <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center mr-3">
                            <RadioTower className="text-indigo-400 w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-300">Quantum-Datensynchronisation</div>
                            <div className="text-xs text-slate-500">Echtzeit-Daten mit Lichtgeschwindigkeit</div>
                          </div>
                        </div>
                        <div 
                          className={`w-12 h-6 rounded-full flex items-center transition duration-300 cursor-pointer ${
                            preferences.dataSync ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
                          }`}
                          onClick={() => togglePreference('dataSync')}
                        >
                          <div className={`w-5 h-5 rounded-full mx-0.5 ${preferences.dataSync ? 'bg-white' : 'bg-slate-400'}`}></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center mr-3">
                            <Zap className="text-indigo-400 w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-300">Holografische Benachrichtigungen</div>
                            <div className="text-xs text-slate-500">3D-Projektionen wichtiger Meldungen</div>
                          </div>
                        </div>
                        <div 
                          className={`w-12 h-6 rounded-full flex items-center transition duration-300 cursor-pointer ${
                            preferences.notifications ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
                          }`}
                          onClick={() => togglePreference('notifications')}
                        >
                          <div className={`w-5 h-5 rounded-full mx-0.5 ${preferences.notifications ? 'bg-white' : 'bg-slate-400'}`}></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center mr-3">
                            <Fingerprint className="text-indigo-400 w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-300">Biometrischer Zugang</div>
                            <div className="text-xs text-slate-500">Gesichts- und Gestenerkennung</div>
                          </div>
                        </div>
                        <div 
                          className={`w-12 h-6 rounded-full flex items-center transition duration-300 cursor-pointer ${
                            preferences.biometrics ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
                          }`}
                          onClick={() => togglePreference('biometrics')}
                        >
                          <div className={`w-5 h-5 rounded-full mx-0.5 ${preferences.biometrics ? 'bg-white' : 'bg-slate-400'}`}></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 flex items-center justify-center mr-3">
                            <Award className="text-indigo-400 w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm text-slate-300">KI-Leistungsoptimierung</div>
                            <div className="text-xs text-slate-500">Erweiterte prädiktive Analysen</div>
                          </div>
                        </div>
                        <div 
                          className={`w-12 h-6 rounded-full flex items-center transition duration-300 cursor-pointer ${
                            preferences.analytics ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'
                          }`}
                          onClick={() => togglePreference('analytics')}
                        >
                          <div className={`w-5 h-5 rounded-full mx-0.5 ${preferences.analytics ? 'bg-white' : 'bg-slate-400'}`}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              {step > 0 ? (
                <button
                  onClick={handlePrevious}
                  className="flex items-center text-slate-400 hover:text-white transition-colors"
                  disabled={scanning}
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Zurück
                </button>
              ) : (
                <div></div> // Empty div for spacing
              )}
              
              <button
                onClick={handleNext}
                disabled={step === 1 && scanning}
                className={`
                  flex items-center px-6 py-2 rounded-lg text-white font-medium transition-all
                  ${step === 3 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-500/20' 
                    : 'bg-indigo-600 hover:bg-indigo-700'}
                  ${(step === 1 && scanning) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                `}
              >
                {step === 3 ? 'SportApp starten' : 'Weiter'}
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FuturisticOnboarding;