import React from 'react';
import { Construction, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const StationPage = () => {
  const { isAdmin } = useAuth();
  
  return (
    <motion.div
      className="p-6 md:p-8 flex flex-col items-center justify-center min-h-[60vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-6">
          <Construction size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Not Implemented
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Diese Seite ist derzeit noch in der Entwicklung und wurde noch nicht implementiert. 
          Die Funktionalität der Disziplinen ist hiervon nicht betroffen.
        </p>
        
        {isAdmin && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <div className="flex items-start">
              <Info className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Als Administrator können Sie weiterhin Disziplinen erstellen, Teams verwalten und 
                  alle anderen Funktionen nutzen. Diese Seite wird in einem zukünftigen Update verfügbar sein.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400">
          <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-2"></span>
          Disziplin-Funktionalität ist nicht beeinträchtigt
        </div>
      </div>
      
      {/* Gradient background effect */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl bg-gradient-to-br from-amber-400 to-amber-700 pointer-events-none"></div>
    </motion.div>
  );
};

export default StationPage;
