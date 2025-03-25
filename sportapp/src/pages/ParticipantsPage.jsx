import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const ParticipantsPage = () => {
  return (
    <motion.div 
      className="p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Teilnehmer</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-1">Verwalte alle Sportfest-Teilnehmer</p>
      
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
            Diese Seite ist in der Demo noch nicht implementiert
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Hier würde eine komplette Teilnehmerverwaltung mit Filterung, Suche und Detailansichten erscheinen.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ParticipantsPage;