import React, { useState, useEffect } from 'react';
import { Check, User, Save, RefreshCw, CircleSlash } from 'lucide-react';

const StudentScoreEntry = ({ students, disciplineId, teamId, onSaveScores, isLoading }) => {
  const [studentScores, setStudentScores] = useState({});
  const [savedState, setSavedState] = useState({});

  // Reset student scores when discipline or team changes
  useEffect(() => {
    if (students && disciplineId) {
      const initialScores = {};
      const initialSavedState = {};
      
      students.forEach(student => {
        initialScores[student.SCHUELERID] = '';
        initialSavedState[student.SCHUELERID] = false;
      });
      
      setStudentScores(initialScores);
      setSavedState(initialSavedState);
    }
  }, [students, disciplineId, teamId]);

  // Handle individual score change
  const handleScoreChange = (studentId, value) => {
    // Parse input to allow only numbers and validate
    const numValue = value.replace(/[^0-9.]/g, '');
    
    setStudentScores(prev => ({
      ...prev,
      [studentId]: numValue
    }));
    
    // Mark this score as unsaved
    setSavedState(prev => ({
      ...prev,
      [studentId]: false
    }));
  };

  // Save all scores
  const handleSaveAllScores = () => {
    const scores = [];
    
    // Prepare scores data for submission
    Object.entries(studentScores).forEach(([studentId, points]) => {
      if (points !== '') {
        scores.push({
          SCHUELERID: Number(studentId),
          DISZIPLINID: disciplineId,
          PUNKTE: Number(points),
          TEAMID: teamId
        });
      }
    });
    
    // Call the parent handler
    onSaveScores(scores);
    
    // Mark all as saved
    const newSavedState = {};
    Object.keys(studentScores).forEach(studentId => {
      if (studentScores[studentId] !== '') {
        newSavedState[studentId] = true;
      } else {
        newSavedState[studentId] = savedState[studentId];
      }
    });
    
    setSavedState(newSavedState);
  };

  // Check if there are any scores to save
  const hasUnsavedScores = Object.entries(studentScores).some(
    ([studentId, points]) => points !== '' && !savedState[studentId]
  );
  
  // Check if there are any scores entered
  const hasAnyScores = Object.values(studentScores).some(points => points !== '');

  return (
    <div className="p-4">
      {students.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
            <CircleSlash size={24} className="text-slate-500 dark:text-slate-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            Keine Schüler für dieses Team gefunden.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Schüler
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Punkte
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                  {students.map((student, index) => (
                    <tr key={student.SCHUELERID} className={index % 2 === 0 ? '' : 'bg-slate-50 dark:bg-slate-700/20'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                            <User size={16} className="text-slate-500 dark:text-slate-300" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-slate-800 dark:text-white">
                              {student.VORNAME} {student.NAME}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              ID: {student.SCHUELERID}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={studentScores[student.SCHUELERID] || ''}
                          onChange={(e) => handleScoreChange(student.SCHUELERID, e.target.value)}
                          className="w-24 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent sm:text-sm"
                          placeholder="Punkte"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {savedState[student.SCHUELERID] ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            <Check size={12} className="mr-1" /> Gespeichert
                          </span>
                        ) : studentScores[student.SCHUELERID] ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            Nicht gespeichert
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                            Keine Punktzahl
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleSaveAllScores}
              disabled={!hasUnsavedScores || isLoading}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                hasUnsavedScores && !isLoading 
                  ? 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {hasUnsavedScores ? 'Punkte speichern' : (hasAnyScores ? 'Alle Punkte gespeichert' : 'Keine Punkte eingegeben')}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentScoreEntry;
