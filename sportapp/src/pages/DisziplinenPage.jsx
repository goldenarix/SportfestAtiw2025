import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Award, 
  Target, 
  Timer, 
  AlertTriangle, 
  PlusCircle, 
  Info, 
  X, 
  Save, 
  Trash2, 
  Edit, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

// Animation variants for page transition
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Animation variants for cards
const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: (index) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: index * 0.05 }
  }),
  hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

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

const DisziplinenPage = () => {
  const [disziplinen, setDisziplinen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentDisziplin, setCurrentDisziplin] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    NAME: '',
    KATEGORIE: 'Allgemein',
    MAX_PUNKTE: 100,
    EINHEIT: 'Punkte',
    TYP: 'Standard',
    AKTIV: 'Y'
  });
  
  // Notification state
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchDisziplinen();
  }, []);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchDisziplinen = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/disziplins');
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setDisziplinen(result.data || []);
        setError(null);
      } else {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error fetching disziplinen:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDisziplin = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/disziplins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Disziplin erfolgreich hinzugefügt!'
        });
        fetchDisziplinen();
        setShowAddModal(false);
        resetForm();
      } else {
        throw new Error(result.error || 'Failed to add discipline');
      }
    } catch (err) {
      console.error('Error adding discipline:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  const handleEditDisziplin = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/disziplins/${currentDisziplin.DISZIPLINID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Disziplin erfolgreich aktualisiert!'
        });
        fetchDisziplinen();
        setShowEditModal(false);
      } else {
        throw new Error(result.error || 'Failed to update discipline');
      }
    } catch (err) {
      console.error('Error updating discipline:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  const handleDeleteDisziplin = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/disziplins/${currentDisziplin.DISZIPLINID}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: 'Disziplin erfolgreich gelöscht!'
        });
        fetchDisziplinen();
        setShowDeleteModal(false);
      } else {
        throw new Error(result.error || 'Failed to delete discipline');
      }
    } catch (err) {
      console.error('Error deleting discipline:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (disziplin) => {
    setCurrentDisziplin(disziplin);
    setFormData({
      NAME: disziplin.NAME || '',
      KATEGORIE: disziplin.KATEGORIE || 'Allgemein',
      MAX_PUNKTE: disziplin.MAX_PUNKTE || 100,
      EINHEIT: disziplin.EINHEIT || 'Punkte',
      TYP: disziplin.TYP || 'Standard',
      AKTIV: disziplin.AKTIV || 'Y'
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (disziplin) => {
    setCurrentDisziplin(disziplin);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      NAME: '',
      KATEGORIE: 'Allgemein',
      MAX_PUNKTE: 100,
      EINHEIT: 'Punkte',
      TYP: 'Standard',
      AKTIV: 'Y'
    });
  };

  // Function to get sport-related icon based on name or type
  const getDisziplinIcon = (disziplin) => {
    const name = disziplin.NAME?.toLowerCase() || '';
    
    if (name.includes('lauf') || name.includes('sprint') || name.includes('meter')) {
      return <Timer className="text-blue-500" size={24} />;
    } else if (name.includes('wurf') || name.includes('ball') || name.includes('schleuder')) {
      return <Target className="text-purple-500" size={24} />;
    } else if (name.includes('sprung') || name.includes('weit')) {
      return <Award className="text-yellow-500" size={24} />;
    } else {
      return <Award className="text-indigo-500" size={24} />;
    }
  };

  // Function to get a pastel color based on disziplin name
  const getDisziplinColor = (disziplin) => {
    const name = disziplin.NAME?.toLowerCase() || '';
    
    if (name.includes('lauf') || name.includes('sprint') || name.includes('meter')) {
      return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' };
    } else if (name.includes('wurf') || name.includes('ball') || name.includes('schleuder')) {
      return { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800' };
    } else if (name.includes('sprung') || name.includes('weit')) {
      return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' };
    } else {
      return { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800' };
    }
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Discord-inspired header section */}
      <div className="mb-6 bg-gradient-to-r from-[#5865F2] to-[#EB459E] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Discord-style background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      
        <div className="flex flex-wrap items-center justify-between relative z-10">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center">
              <Target className="inline-block mr-2" size={28} />
              Disziplinen
            </h1>
            <p className="text-white/80">
              Übersicht aller Sportdisziplinen im Wettbewerb
            </p>
          </div>
          
          <button 
            onClick={openAddModal}
            className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <PlusCircle size={18} className="mr-2" />
            Neue Disziplin
          </button>
        </div>
        
        {/* Discord-style decorative elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16"></div>
        <div className="absolute top-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mt-8"></div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-lg flex items-center ${
              notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {notification.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-3" /> : 
              <AlertTriangle className="h-5 w-5 mr-3" />
            }
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-auto p-1 rounded-full hover:bg-white/20"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">Disziplinen werden geladen...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 dark:text-red-300 font-medium">Fehler beim Laden der Disziplinen</h3>
              <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
              <p className="text-red-700 dark:text-red-400 mt-2">
                Bitte stellen Sie sicher, dass der Server läuft und die Datenbankverbindung funktioniert.
              </p>
              <button 
                onClick={fetchDisziplinen}
                className="mt-2 flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/80 text-red-800 dark:text-red-300 rounded-lg transition-colors"
              >
                <RefreshCw size={14} className="mr-2" />
                Erneut versuchen
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && disziplinen.length === 0 && (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMiAxNkMxNC4yMDkxIDE2IDE2IDE0LjIwOTEgMTYgMTJDMTYgOS43OTA4NiAxNC4yMDkxIDggMTIgOEM5Ljc5MDg2IDggOCA5Ljc5MDg2IDggMTJDOCAxNC4yMDkxIDkuNzkwODYgMTYgMTIgMTZaIiBzdHJva2U9IiM1ODY1RjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTMgMTZWOEMzIDUuMjM4NTggNSAzIDggM0gxNkMxOC43NjE0IDMgMjEgNS4yMzg1OCAyMSA4VjE2QzIxIDE4Ljc2MTQgMTguNzYxNCAyMSAxNiAyMUg4QzUgMjEgMyAxOC43NjE0IDMgMTZaIiBzdHJva2U9IiM1ODY1RjIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTE3LjUgNi41VjYuNTEiIHN0cm9rZT0iIzU4NjVGMiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=" 
            alt="No disciplines"
            className="mx-auto h-24 w-24 mb-4 opacity-30"
          />
          <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">Keine Disziplinen gefunden</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Es wurden keine Disziplinen in der Datenbank gefunden. Fügen Sie neue Disziplinen hinzu, um sie hier anzuzeigen.
          </p>
          <button 
            onClick={openAddModal}
            className="mt-6 inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <PlusCircle size={18} className="mr-2" />
            Erste Disziplin erstellen
          </button>
        </div>
      )}

      {!loading && !error && disziplinen.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {disziplinen.map((disziplin, index) => {
              const colors = getDisziplinColor(disziplin);
              
              return (
                <motion.div
                  key={disziplin.DISZIPLINID}
                  className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300`}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  custom={index}
                  whileHover="hover"
                  onMouseEnter={() => setHoveredCard(disziplin.DISZIPLINID)}
                  onMouseLeave={() => setHoveredCard(null)}
                  layout
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                          {getDisziplinIcon(disziplin)}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-semibold text-slate-800 dark:text-white text-lg">
                            {disziplin.NAME || 'Unbenannte Disziplin'}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-300 text-sm">
                            ID: {disziplin.DISZIPLINID}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {disziplin.AKTIV === 'Y' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">KATEGORIE</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {disziplin.KATEGORIE || 'Allgemein'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">PUNKTE MAX</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {disziplin.MAX_PUNKTE || '100'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">EINHEIT</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {disziplin.EINHEIT || 'Punkte'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">TYP</p>
                          <p className="text-sm font-medium text-slate-800 dark:text-white">
                            {disziplin.TYP || 'Standard'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <motion.button 
                        className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Info size={18} />
                      </motion.button>
                      <motion.button 
                        className="p-2 rounded-lg text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openEditModal(disziplin)}
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button 
                        className="p-2 rounded-lg text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => openDeleteModal(disziplin)}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </div>
                  
                  {/* Discord-style gradient bottom border */}
                  <div className="h-1" style={{ 
                    background: 'linear-gradient(90deg, #5865F2 0%, #EB459E 100%)'
                  }}></div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#5865F2] to-[#EB459E] p-4 text-white flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center">
                    <PlusCircle className="mr-2" size={18} />
                    Neue Disziplin hinzufügen
                  </h3>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Name*
                      </label>
                      <input
                        type="text"
                        name="NAME"
                        value={formData.NAME}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="z.B. 100m Sprint"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Kategorie
                      </label>
                      <select
                        name="KATEGORIE"
                        value={formData.KATEGORIE}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      >
                        <option value="Allgemein">Allgemein</option>
                        <option value="Laufen">Laufen</option>
                        <option value="Springen">Springen</option>
                        <option value="Werfen">Werfen</option>
                        <option value="Kraft">Kraft</option>
                        <option value="Ausdauer">Ausdauer</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Max. Punkte
                        </label>
                        <input
                          type="number"
                          name="MAX_PUNKTE"
                          value={formData.MAX_PUNKTE}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Einheit
                        </label>
                        <input
                          type="text"
                          name="EINHEIT"
                          value={formData.EINHEIT}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="z.B. Sekunden, Meter"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Typ
                        </label>
                        <select
                          name="TYP"
                          value={formData.TYP}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Zeit">Zeit</option>
                          <option value="Distanz">Distanz</option>
                          <option value="Punkte">Punkte</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Status
                        </label>
                        <select
                          name="AKTIV"
                          value={formData.AKTIV}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        >
                          <option value="Y">Aktiv</option>
                          <option value="N">Inaktiv</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowAddModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleAddDisziplin}
                    >
                      <Save size={18} className="mr-2" />
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && currentDisziplin && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={backdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#5865F2] to-[#EB459E] p-4 text-white flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Edit className="mr-2" size={18} />
                    Disziplin bearbeiten
                  </h3>
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Name*
                      </label>
                      <input
                        type="text"
                        name="NAME"
                        value={formData.NAME}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder="z.B. 100m Sprint"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Kategorie
                      </label>
                      <select
                        name="KATEGORIE"
                        value={formData.KATEGORIE}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      >
                        <option value="Allgemein">Allgemein</option>
                        <option value="Laufen">Laufen</option>
                        <option value="Springen">Springen</option>
                        <option value="Werfen">Werfen</option>
                        <option value="Kraft">Kraft</option>
                        <option value="Ausdauer">Ausdauer</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Max. Punkte
                        </label>
                        <input
                          type="number"
                          name="MAX_PUNKTE"
                          value={formData.MAX_PUNKTE}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Einheit
                        </label>
                        <input
                          type="text"
                          name="EINHEIT"
                          value={formData.EINHEIT}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                          placeholder="z.B. Sekunden, Meter"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Typ
                        </label>
                        <select
                          name="TYP"
                          value={formData.TYP}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Zeit">Zeit</option>
                          <option value="Distanz">Distanz</option>
                          <option value="Punkte">Punkte</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Status
                        </label>
                        <select
                          name="AKTIV"
                          value={formData.AKTIV}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        >
                          <option value="Y">Aktiv</option>
                          <option value="N">Inaktiv</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setShowEditModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center"
                      onClick={handleEditDisziplin}
                    >
                      <Save size={18} className="mr-2" />
                      Änderungen speichern
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

     

{/* Delete Confirmation Modal */}
<AnimatePresence>
  {showDeleteModal && currentDisziplin && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        variants={backdropVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={() => setShowDeleteModal(false)}
      />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={modalVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full overflow-hidden">
          <div className="bg-red-500 p-4 text-white flex justify-between items-center">
            <h3 className="text-lg font-semibold flex items-center">
              <AlertTriangle className="mr-2" size={18} />
              Disziplin löschen
            </h3>
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-6">
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Sind Sie sicher, dass Sie die Disziplin <span className="font-semibold">{currentDisziplin.NAME}</span> löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-6">
              <p className="text-yellow-700 dark:text-yellow-300 font-medium">Achtung: Abhängige Daten</p>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
                Beim Löschen dieser Disziplin werden auch alle zugehörigen Ergebnisse gelöscht. Dies kann Auswirkungen auf die Statistiken und Ranglisten haben.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                Abbrechen
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
                onClick={handleDeleteDisziplin}
              >
                <Trash2 size={18} className="mr-2" />
                Disziplin und zugehörige Daten löschen
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </motion.div>
  );
};

export default DisziplinenPage;