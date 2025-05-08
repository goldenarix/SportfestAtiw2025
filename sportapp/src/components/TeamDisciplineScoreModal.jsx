import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, List, Users, Trophy } from 'lucide-react';
import { useDataContext } from '../../backend/DataLoader';
import StudentScoreEntry from './StudentScoreEntry';

// Animation variants for modal
const modalVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

// Animation variants for backdrop
const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const TeamDisciplineScoreModal = ({ isOpen, onClose, teamId, teamName }) => {
  const { disziplins, loading, error } = useDataContext();
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [step, setStep] = useState('select-discipline'); // 'select-discipline' or 'enter-scores'

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDiscipline(null);
      setStep('select-discipline');
    }
  }, [isOpen]);

  const handleDisciplineSelect = (discipline) => {
    setSelectedDiscipline(discipline);
    setStep('enter-scores');
  };

  const handleBackToSelection = () => {
    setStep('select-discipline');
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#5865F2] to-[#EB459E] p-4 text-white flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <Users className="mr-2" size={18} />
              {step === 'select-discipline' 
                ? `Disziplin für ${teamName || `Team ${teamId}`} auswählen` 
                : `Punkteeingabe: ${selectedDiscipline?.NAME || 'Disziplin'}`}
            </h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {loading ? (
              <div className="py-16 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">
                <p>Fehler beim Laden der Daten: {error}</p>
              </div>
            ) : step === 'select-discipline' ? (
              <div>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Wählen Sie die Disziplin aus, für die Sie Punkte erfassen möchten:
                </p>

                {disziplins && disziplins.length > 0 ? (
                  <ul className="divide-y divide-slate-100 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg">
                    {disziplins.map(discipline => (
                      <li 
                        key={discipline.DISZIPLINID}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                        onClick={() => handleDisciplineSelect(discipline)}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold mr-4">
                            <Trophy size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-white">{discipline.NAME}</p>
                            <div className="flex items-center mt-1">
                              <span className="text-xs text-slate-500 dark:text-slate-400">ID: {discipline.DISZIPLINID}</span>
                              {discipline.BESCHREIBUNG && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 ml-3 line-clamp-1">
                                  {discipline.BESCHREIBUNG}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center p-8 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                    <p className="text-slate-600 dark:text-slate-300">Keine Disziplinen verfügbar.</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Back button */}
                <button 
                  onClick={handleBackToSelection}
                  className="mb-4 inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  <ChevronDown className="h-4 w-4 mr-1 rotate-90" />
                  Zurück zur Disziplinauswahl
                </button>

                {/* Student score entry component */}
                <StudentScoreEntry 
                  disziplinId={selectedDiscipline?.DISZIPLINID} 
                  disziplinName={selectedDiscipline?.NAME}
                  teamId={teamId}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TeamDisciplineScoreModal;
