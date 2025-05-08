import React, { useState, useEffect } from 'react';
import { User, Search, X, CheckCircle, Filter, ChevronDown, UserPlus } from 'lucide-react';
import { useDataContext } from '../../backend/DataLoader';

const StudentListSelector = ({ 
  onStudentSelect, 
  selectedStudentIds = [], 
  placeholder = "Schüler auswählen",
  teamId = null 
}) => {
  const { students, loading, error } = useDataContext(); // Annahme: students ist im DataContext verfügbar
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // Initialisierung und Filter bei Änderungen
  useEffect(() => {
    if (!loading && students?.length > 0) {
      const studentList = [...students];

      // Setzt Default-Auswahl falls vorhanden
      if (selectedStudentIds.length > 0 && selectedStudents.length === 0) {
        const found = studentList.filter(s => selectedStudentIds.includes(s.SCHUELERID));
        if (found.length > 0) setSelectedStudents(found);
      }

      // Initiales Filterset
      setFilteredStudents(studentList);
    }
  }, [students, selectedStudentIds, loading]);

  // Dynamisches Filtern (Search + Kategorie)
  useEffect(() => {
    if (!students) return;
    
    let result = [...students];

    if (searchTerm) {
      result = result.filter(student =>
        student.VORNAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.NACHNAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.SCHUELERID.toString().includes(searchTerm)
      );
    }

    if (filter !== 'all') {
      result = result.filter(student => student.KLASSE === filter);
    }

    // Filter nach Team, falls ein Team ausgewählt wurde
    if (teamId) {
      result = result.filter(student => student.TEAMID === teamId || !student.TEAMID);
    }

    setFilteredStudents(result);
  }, [searchTerm, filter, students, teamId]);

  const handleStudentSelect = (student) => {
    // Prüfen, ob der Schüler bereits ausgewählt ist
    const isAlreadySelected = selectedStudents.some(s => s.SCHUELERID === student.SCHUELERID);
    
    let newSelection;
    if (isAlreadySelected) {
      // Schüler entfernen, wenn bereits ausgewählt
      newSelection = selectedStudents.filter(s => s.SCHUELERID !== student.SCHUELERID);
    } else {
      // Schüler hinzufügen
      newSelection = [...selectedStudents, student];
    }
    
    setSelectedStudents(newSelection);
    onStudentSelect?.(newSelection);
  };

  const handleRemoveStudent = (studentId) => {
    const newSelection = selectedStudents.filter(s => s.SCHUELERID !== studentId);
    setSelectedStudents(newSelection);
    onStudentSelect?.(newSelection);
  };

  const getUniqueClasses = () => {
    if (!students) return [];
    
    const unique = new Set();
    students.forEach(s => {
      if (s.KLASSE) unique.add(s.KLASSE);
    });
    return Array.from(unique);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  return (
    <div className="relative">
      {/* Selected Students Display */}
      <div className="mb-2">
        {selectedStudents.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
            <div className="w-full text-xs text-slate-500 dark:text-slate-400 mb-1">
              Ausgewählte Schüler ({selectedStudents.length}):
            </div>
            {selectedStudents.map(student => (
              <div 
                key={student.SCHUELERID}
                className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600"
              >
                <User size={14} className="text-indigo-500 dark:text-indigo-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{student.VORNAME} {student.NACHNAME}</span>
                <button 
                  className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveStudent(student.SCHUELERID);
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dropdown Trigger */}
      <div
        className="relative flex items-center w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 cursor-pointer"
        onClick={toggleDropdown}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center flex-1">
            <UserPlus className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" />
            <span className="text-slate-500 dark:text-slate-400">
              {selectedStudents.length > 0 
                ? `${selectedStudents.length} Schüler ausgewählt` 
                : placeholder}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg overflow-hidden">
          {/* Suchleiste und Filter */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 w-full rounded pl-8 pr-3 text-sm border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Suchen nach Name..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-8 w-full rounded pl-2 pr-8 text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="all">Alle Klassen</option>
                  {getUniqueClasses().map((cls, i) => (
                    <option key={i} value={cls}>{cls}</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              </div>
            </div>
          </div>

          {/* Schülerliste */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="inline-block h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Schüler werden geladen...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500 dark:text-red-400 text-sm">
                Fehler: {error}
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                Keine Schüler gefunden
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredStudents.map(student => {
                  const isSelected = selectedStudents.some(s => s.SCHUELERID === student.SCHUELERID);
                  
                  return (
                    <li
                      key={student.SCHUELERID}
                      className={`p-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${
                        isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStudentSelect(student);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mr-2">
                          <User size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 dark:text-white text-sm">
                            {student.VORNAME} {student.NACHNAME}
                          </p>
                          <div className="flex items-center">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              ID: {student.SCHUELERID}
                              {student.KLASSE && <span className="ml-2">Klasse: {student.KLASSE}</span>}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-indigo-500 ml-auto" />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListSelector;
