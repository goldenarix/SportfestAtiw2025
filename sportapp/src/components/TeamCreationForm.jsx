import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, AlertTriangle, CheckCircle, RefreshCw, Users, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StudentListSelector from './StudentListSelector';

const TeamCreationForm = ({ onSuccess, onCancel, initialData = null }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [formData, setFormData] = useState({
    NAME: initialData?.NAME || ''
    // BETREUERID removed as per requirements
  });
  
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Load existing team data if initialData is provided (for editing)
  useEffect(() => {
    if (initialData && initialData.TEAMID) {
      // Fetch students for this team
      const fetchTeamStudents = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/teams/${initialData.TEAMID}/students`);
          
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          
          const result = await response.json();
          
          if (result.success) {
            // Transform to the format expected by the StudentListSelector
            const studentIds = result.data.map(student => student.SCHUELERID);
            setSelectedStudents(studentIds);
          } else {
            throw new Error(result.error || 'Failed to load team students');
          }
        } catch (err) {
          console.error('Error loading team students:', err);
          setNotification({
            type: 'error',
            message: `Fehler beim Laden der Schüler: ${err.message}`
          });
        }
      };
      
      fetchTeamStudents();
    }
  }, [initialData]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle student selection
  const handleStudentsSelected = (students) => {
    setSelectedStudents(students);
  };
  
  // Form validation
  const validateForm = () => {
    if (!formData.NAME || formData.NAME.trim() === '') {
      setNotification({
        type: 'error',
        message: 'Bitte geben Sie einen Team-Namen ein.'
      });
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Step 1: Create or update the team
      const method = initialData?.TEAMID ? 'PUT' : 'POST';
      const url = initialData?.TEAMID 
        ? `${import.meta.env.VITE_API_URL || ''}/teams/${initialData.TEAMID}`
        : `${import.meta.env.VITE_API_URL || ''}/teams`;
      
      const teamResponse = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!teamResponse.ok) {
        throw new Error(`HTTP error: ${teamResponse.status}`);
      }
      
      const teamResult = await teamResponse.json();
      
      if (!teamResult.success) {
        throw new Error(teamResult.error || 'Failed to save team');
      }
      
      // Get the team ID (either from the response for new teams or from initialData for updates)
      const teamId = teamResult.id || initialData.TEAMID;
      
      // Step 2: Update team students if needed
      if (selectedStudents.length > 0) {
        const studentIds = selectedStudents.map(student => student.id);
        
        const studentsResponse = await fetch(`${import.meta.env.VITE_API_URL || ''}/teams/${teamId}/students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentIds }),
        });
        
        if (!studentsResponse.ok) {
          throw new Error(`HTTP error: ${studentsResponse.status}`);
        }
        
        const studentsResult = await studentsResponse.json();
        
        if (!studentsResult.success) {
          throw new Error(studentsResult.error || 'Failed to save team students');
        }
      }
      
      // Success!
      setNotification({
        type: 'success',
        message: initialData?.TEAMID 
          ? 'Team erfolgreich aktualisiert!'
          : 'Team erfolgreich erstellt!'
      });
      
      // Notify parent component
      if (onSuccess) {
        onSuccess(teamId);
      }
    } catch (err) {
      console.error('Error saving team:', err);
      setNotification({
        type: 'error',
        message: `Fehler beim Speichern: ${err.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAdmin) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 dark:text-red-300 font-medium">Zugriff verweigert</h3>
            <p className="text-red-700 dark:text-red-400 mt-1">
              Nur Administratoren können Teams erstellen oder bearbeiten.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-lg flex items-center ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {notification.type === 'success' 
              ? <CheckCircle className="h-5 w-5 mr-3" /> 
              : <AlertTriangle className="h-5 w-5 mr-3" />}
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
      
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          {/* Team info section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <Users className="mr-2" size={20} />
              Team Informationen
            </h2>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Team Name*
                </label>
                <input
                  type="text"
                  name="NAME"
                  value={formData.NAME}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  placeholder="z.B. Team Adler"
                  required
                />
              </div>
              
              {/* Betreuer selection removed as per requirements */}
            </div>
          </div>
          
          {/* Team members section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <UserPlus className="mr-2" size={20} />
              Team Mitglieder
            </h2>
            
            <StudentListSelector 
              onStudentsSelected={handleStudentsSelected} 
              preSelectedStudentIds={selectedStudents.map(s => s.id || s)}
            />
          </div>
          
          {/* Form actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                loading 
                  ? 'bg-indigo-400 dark:bg-indigo-700 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700'
              } text-white`}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Speichern...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {initialData?.TEAMID ? 'Änderungen speichern' : 'Team erstellen'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TeamCreationForm;
