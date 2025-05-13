import React, { useState, useEffect } from 'react';
import { Search, User, CheckCircle, X, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentListSelector = ({ onStudentsSelected, preSelectedStudentIds = [] }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Load students from the API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/students`);
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setStudents(result.data || []);
          
          // Initialize selected students from preSelectedStudentIds
          if (preSelectedStudentIds.length > 0) {
            const preselectedStudentData = result.data
              .filter(student => preSelectedStudentIds.includes(student.SCHUELERID))
              .map(student => ({
                id: student.SCHUELERID,
                name: `${student.VORNAME} ${student.NAME}`
              }));
            
            setSelectedStudents(preselectedStudentData);
          }
        } else {
          throw new Error(result.error || 'Failed to load students');
        }
      } catch (err) {
        console.error('Error loading students:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, [preSelectedStudentIds]);
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    const fullName = `${student.VORNAME} ${student.NAME}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  
  // Check if a student is already selected
  const isSelected = (studentId) => {
    return selectedStudents.some(s => s.id === studentId);
  };
  
  // Toggle student selection
  const toggleStudentSelection = (student) => {
    if (isSelected(student.SCHUELERID)) {
      setSelectedStudents(selectedStudents.filter(s => s.id !== student.SCHUELERID));
    } else {
      setSelectedStudents([
        ...selectedStudents, 
        { 
          id: student.SCHUELERID, 
          name: `${student.VORNAME} ${student.NAME}` 
        }
      ]);
    }
  };
  
  // Remove a selected student
  const removeStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter(s => s.id !== studentId));
  };
  
  // Notify parent component of selected students
  useEffect(() => {
    onStudentsSelected(selectedStudents);
  }, [selectedStudents, onStudentsSelected]);
  
  // Animation variants
  const studentItemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.1 } }
  };
  
  return (
    <div className="mt-4">
      {/* Selected students preview */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Ausgewählte Schüler ({selectedStudents.length})
        </label>
        <div className="flex flex-wrap gap-2">
          {selectedStudents.length === 0 ? (
            <div className="text-sm text-slate-500 dark:text-slate-400 italic py-1">
              Keine Schüler ausgewählt
            </div>
          ) : (
            <AnimatePresence>
              {selectedStudents.map(student => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                >
                  <User size={14} className="mr-1" />
                  <span>{student.name}</span>
                  <button 
                    onClick={() => removeStudent(student.id)}
                    className="ml-1 p-0.5 rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
      
      {/* Search box */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Schüler suchen und hinzufügen
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
            placeholder="Nach Name suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Student list */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-6">
            <RefreshCw size={20} className="animate-spin mr-2 text-indigo-500" />
            <span className="text-slate-600 dark:text-slate-300">Lade Schüler...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-6 text-red-500">
            <AlertTriangle size={20} className="mr-2" />
            <span>{error}</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-slate-500 dark:text-slate-400">Keine passenden Schüler gefunden</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            <AnimatePresence>
              {filteredStudents.map(student => (
                <motion.li
                  key={student.SCHUELERID}
                  className={`p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors ${
                    isSelected(student.SCHUELERID) ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                  }`}
                  onClick={() => toggleStudentSelection(student)}
                  variants={studentItemVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      <User size={16} className="text-slate-500 dark:text-slate-300" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {student.VORNAME} {student.NAME}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Klasse: {student.KLASSE || 'Unbekannt'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    {isSelected(student.SCHUELERID) ? (
                      <CheckCircle size={20} className="text-indigo-500 dark:text-indigo-400" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentListSelector;
