import React, { useState, useEffect } from 'react';
import { Save, X, Check, AlertTriangle } from 'lucide-react';
import { useDataContext } from '../../backend/DataLoader';
import StudentListSelector from './StudentListSelector';

const TeamCreationForm = ({ initialData = null, onSubmit, onCancel }) => {
  // Form fields
  const [formData, setFormData] = useState({
    NAME: '',
    KLASSE: '',
    BESCHREIBUNG: '',
  });
  
  // Selected students that will be part of the team
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // If editing existing team, load its data
  useEffect(() => {
    if (initialData) {
      setFormData({
        NAME: initialData.NAME || '',
        KLASSE: initialData.KLASSE || '',
        BESCHREIBUNG: initialData.BESCHREIBUNG || '',
      });
      
      // If we have initial students data for the team, set them
      if (initialData.students && initialData.students.length > 0) {
        setSelectedStudents(initialData.students);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentsChange = (students) => {
    setSelectedStudents(students);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // First create/update the team
      const teamResponse = await fetch(`${import.meta.env.VITE_API_URL}/teams${initialData?.TEAMID ? `/${initialData.TEAMID}` : ''}`, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const teamResult = await teamResponse.json();
      
      if (!teamResult.success) {
        throw new Error(teamResult.error || 'Fehler beim Speichern des Teams');
      }
      
      const teamId = teamResult.data?.TEAMID || initialData?.TEAMID;

      // Then associate students with the team
      if (selectedStudents.length > 0 && teamId) {
        const studentIds = selectedStudents.map(student => student.SCHUELERID);
        
        const studentsResponse = await fetch(`${import.meta.env.VITE_API_URL}/teams/${teamId}/students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ studentIds }),
        });

        const studentsResult = await studentsResponse.json();
        
        if (!studentsResult.success) {
          throw new Error(studentsResult.error || 'Fehler beim Zuweisen der Schüler');
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onSubmit && onSubmit({
          ...teamResult.data,
          students: selectedStudents
        });
      }, 1000);
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notifications */}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300 flex items-start rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300 flex items-start rounded-md">
          <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>Team erfolgreich {initialData ? 'aktualisiert' : 'erstellt'}!</p>
        </div>
      )}

      {/* Team details */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Teamname*
        </label>
        <input
          type="text"
          name="NAME"
          value={formData.NAME}
          onChange={handleChange}
          required
          className="h-10 w-full rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="z.B. Team Adler"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Klasse
        </label>
        <input
          type="text"
          name="KLASSE"
          value={formData.KLASSE}
          onChange={handleChange}
          className="h-10 w-full rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="z.B. 10a"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Beschreibung
        </label>
        <textarea
          name="BESCHREIBUNG"
          value={formData.BESCHREIBUNG}
          onChange={handleChange}
          rows="3"
          className="w-full rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Optionale Beschreibung des Teams"
        ></textarea>
      </div>

      {/* Student selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Schüler auswählen
        </label>
        <StudentListSelector
          onStudentSelect={handleStudentsChange}
          selectedStudentIds={selectedStudents.map(student => student.SCHUELERID)}
          placeholder="Klicken, um Schüler hinzuzufügen"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="flex items-center">
            <X className="h-4 w-4 mr-1" />
            Abbrechen
          </div>
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center">
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {initialData ? 'Aktualisieren' : 'Team erstellen'}
          </div>
        </button>
      </div>
    </form>
  );
};

export default TeamCreationForm;
