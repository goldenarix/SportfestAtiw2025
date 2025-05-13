import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, 
  Flag, 
  Save, 
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2,
  Loader2
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const DisziplinEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    NAME: '',
    KATEGORIE: 'Allgemein',
    MAX_PUNKTE: 100,
    EINHEIT: 'Punkte',
    TYP: 'Standard',
    AKTIV: 'Y',
    BESCHREIBUNG: ''
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch disziplin data if in edit mode
  useEffect(() => {
    const fetchDisziplin = async () => {
      if (!isEditMode) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/disziplins/${id}`);

      
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const disziplins = result.data[0];
          setFormData({
            NAME: disziplins.NAME || '',
            KATEGORIE: disziplins.KATEGORIE || 'Allgemein',
            MAX_PUNKTE: disziplins.MAX_PUNKTE || 100,
            EINHEIT: disziplins.EINHEIT || 'Punkte',
            TYP: disziplins.TYP || 'Standard',
            AKTIV: disziplins.AKTIV || 'Y',
            BESCHREIBUNG: disziplins.BESCHREIBUNG || ''
          });
          setError(null);
        } else {
          throw new Error(result.error || 'Disziplin nicht gefunden');
        }
      } catch (err) {
        console.error('Error fetching disziplin:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDisziplin();
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Verwende die korrekte API-URL aus envlocal.txt
      const apiBaseUrl = "https://padersport-api.onrender.com";
      console.log("API Basis-URL:", apiBaseUrl);
      
      // Versuche verschiedene API-Pfade
      let url;
      let response = null;
      let success = false;
      
      const possiblePaths = [
        `${apiBaseUrl}/api/disziplins`,
        `${apiBaseUrl}/disziplins`,
        `${apiBaseUrl}/api/v1/disziplins`
      ];
      
      // Versuche alle möglichen Pfade, bis einer funktioniert
      for (const path of possiblePaths) {
        const currentUrl = isEditMode ? `${path}/${id}` : path;
        console.log("Versuche API-Endpunkt:", currentUrl);
        
        try {
          response = await fetch(currentUrl, {
            method: isEditMode ? 'PUT' : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
          
          if (response.ok) {
            url = currentUrl;
            success = true;
            console.log("Erfolgreicher API-Endpunkt gefunden:", url);
            break;
          }
        } catch (pathErr) {
          console.log("API-Pfad fehlgeschlagen:", pathErr.message);
        }
      }
      
      if (!success) {
        throw new Error(`Kein funktionierender API-Endpunkt gefunden. Bitte überprüfen Sie die API-Konfiguration.`);
      }
      
      // Überprüfe Content-Type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Server hat ein ungültiges Format zurückgegeben (JSON erwartet): ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setNotification({
          type: 'success',
          message: isEditMode 
            ? 'Disziplin erfolgreich aktualisiert!' 
            : 'Disziplin erfolgreich erstellt!'
        });
        
        // If creating a new disziplin, reset the form
        if (!isEditMode) {
          setFormData({
            NAME: '',
            KATEGORIE: 'Allgemein',
            MAX_PUNKTE: 100,
            EINHEIT: 'Punkte',
            TYP: 'Standard',
            AKTIV: 'Y',
            BESCHREIBUNG: ''
          });
        }
        
        // Auto navigate back after success
        setTimeout(() => {
          navigate('/disziplinen');
        }, 2000);
      } else {
        throw new Error(result.error || 'Fehler beim Speichern der Disziplin');
      }
    } catch (err) {
      console.error('Error saving disziplin:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <motion.div 
        className="p-6 max-w-3xl mx-auto"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-slate-500">Disziplin wird geladen...</span>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="p-6 max-w-3xl mx-auto"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link to="/disziplinen" className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" /> Zurück
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white ml-6">
          {isEditMode ? 'Disziplin bearbeiten' : 'Neue Disziplin erstellen'}
        </h1>
      </div>
      
      {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {notification.type === 'success' ? 
            <CheckCircle className="h-5 w-5 mr-3" /> : 
            <AlertTriangle className="h-5 w-5 mr-3" />
          }
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 dark:text-red-300 font-medium">Fehler</h3>
              <p className="text-red-700 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Admin Check Warning */}
      {!isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg mb-6">
          <div className="flex">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-amber-800 dark:text-amber-300 font-medium">Eingeschränkter Zugriff</h3>
              <p className="text-amber-700 dark:text-amber-400 mt-1">
                Nur Administratoren können Disziplinen erstellen, bearbeiten oder löschen.
                Sie können die Details einsehen, aber keine Änderungen vornehmen.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <form onSubmit={isAdmin ? handleSubmit : (e) => e.preventDefault()}>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name*
              </label>
              <input
                type="text"
                name="NAME"
                value={formData.NAME}
                onChange={handleChange}
                className={`w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                placeholder="z.B. 100m Sprint oder Weitsprung"
                required
                disabled={!isAdmin}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Beschreibung
              </label>
              <textarea
                name="BESCHREIBUNG"
                value={formData.BESCHREIBUNG}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                placeholder="Beschreibung und Regeln der Disziplin..."
                disabled={!isAdmin}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kategorie
                </label>
                <select
                  name="KATEGORIE"
                  value={formData.KATEGORIE}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                  disabled={!isAdmin}
                >
                  <option value="Allgemein">Allgemein</option>
                  <option value="Laufen">Laufen</option>
                  <option value="Springen">Springen</option>
                  <option value="Werfen">Werfen</option>
                  <option value="Kraft">Kraft</option>
                  <option value="Ausdauer">Ausdauer</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Typ
                </label>
                <select
                  name="TYP"
                  value={formData.TYP}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                  disabled={!isAdmin}
                >
                  <option value="Standard">Standard</option>
                  <option value="Zeit">Zeit</option>
                  <option value="Distanz">Distanz</option>
                  <option value="Punkte">Punkte</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Maximale Punkte
                </label>
                <input
                  type="number"
                  name="MAX_PUNKTE"
                  value={formData.MAX_PUNKTE}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                  min="1"
                  max="1000"
                  disabled={!isAdmin}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Einheit
                </label>
                <input
                  type="text"
                  name="EINHEIT"
                  value={formData.EINHEIT}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:border-transparent dark:bg-slate-700 dark:text-white ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                  placeholder="z.B. Sekunden, Meter, Punkte"
                  disabled={!isAdmin}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="AKTIV"
                    value="Y"
                    checked={formData.AKTIV === 'Y'}
                    onChange={handleChange}
                    className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                    disabled={!isAdmin}
                  />
                  <span className="ml-2 text-slate-700 dark:text-slate-300">Aktiv</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="AKTIV"
                    value="N"
                    checked={formData.AKTIV === 'N'}
                    onChange={handleChange}
                    className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 ${!isAdmin ? 'opacity-80 cursor-not-allowed' : ''}`}
                    disabled={!isAdmin}
                  />
                  <span className="ml-2 text-slate-700 dark:text-slate-300">Inaktiv</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Info box */}
          <div className="px-6 pt-2 pb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex">
              <Info className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Hinweis zur Konfiguration</h3>
                <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  Die Einstellungen bestimmen, wie die Disziplin im System dargestellt und bewertet wird. Der Typ legt fest, ob niedrigere Werte besser sind (z.B. Zeit) oder höhere Werte (z.B. Distanz, Punkte).
                </p>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 flex justify-between">
            <Link
              to="/disziplinen"
              className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              Abbrechen
            </Link>
            
            <div className="flex space-x-3">
              {isEditMode && isAdmin && (
                <button
                  type="button"
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg transition-colors flex items-center"
                  onClick={() => {
                    // This would typically open a confirmation dialog before deleting
                    // For simplicity, we're just showing how the button would appear
                    alert('Diese Funktion würde eine Bestätigungsdialog öffnen und dann die Disziplin löschen.');
                  }}
                >
                  <Trash2 size={18} className="mr-2" />
                  Löschen
                </button>
              )}
              <button
                type="submit"
                className={`px-6 py-2 ${isAdmin ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400 cursor-not-allowed'} text-white rounded-lg transition-colors flex items-center`}
                disabled={saving || !isAdmin}
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    {isEditMode ? 'Aktualisieren' : 'Erstellen'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default DisziplinEditorPage;