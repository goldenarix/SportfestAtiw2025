import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2, 
  Key, 
  User,
  EyeOff,
  Eye,
  Search,
  AlertCircle,
  CheckCircle,
  X,
  Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataContext } from '../../backend/DataLoader';

/**
 * User Management Page - Allows admins to manage both Betreuer and Admin accounts
 * This page is only accessible to users with admin role
 */
const UserManagementPage = () => {
  // States for user lists
  const [betreuerUsers, setBetreuerUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('betreuer'); // 'betreuer' or 'admin'
  
  // States for user form modal (add/edit)
  const [showUserFormModal, setShowUserFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  
  // States for creating new users
  const [newUserType, setNewUserType] = useState('betreuer');
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('stationaer');
  const [selectedDisziplinen, setSelectedDisziplinen] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addUserError, setAddUserError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // States for managing existing users
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  
  // Get auth context
  const { 
    isAdmin, 
    getAllBetreuer, 
    getAllAdmins, 
    registerBetreuer,
    registerAdmin,
    changePassword,
    deleteUser,
    updateBetreuer
  } = useAuth();
  
  // NEU: Get data from DataContext for Disziplinen and Teams
  const { 
    disziplins, 
    teams, 
    loading: dataLoading, 
    error: dataError,
    refetchData 
  } = useDataContext();
  
  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Only fetch if user is an admin
        if (isAdmin()) {
          const [betreuerResult, adminResult] = await Promise.all([
            getAllBetreuer(),
            getAllAdmins()
          ]);
          
          if (betreuerResult.success) {
            setBetreuerUsers(betreuerResult.data);
          } else {
            console.error('Error fetching betreuer users:', betreuerResult.error);
            setError('Fehler beim Abrufen der Betreuer-Benutzer');
          }
          
          if (adminResult.success) {
            setAdminUsers(adminResult.data);
          } else {
            console.error('Error fetching admin users:', adminResult.error);
            setError('Fehler beim Abrufen der Admin-Benutzer');
          }
        } else {
          setError('Sie haben keine Berechtigung, um auf diese Seite zuzugreifen');
        }
      } catch (err) {
        console.error('Error in fetchUsers:', err);
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [isAdmin, getAllBetreuer, getAllAdmins]);
  
  // Filter users based on search term
  const filteredBetreuerUsers = betreuerUsers.filter(user => 
    (user.NAME && user.NAME.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.ROLLE && user.ROLLE.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredAdminUsers = adminUsers.filter(user => 
    user.NAME.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.USERNAME && user.USERNAME.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle opening the modal for adding a new user
  const openAddUserModal = () => {
    setEditMode(false);
    setCurrentUserData(null);
    setNewUserType('betreuer'); // Default to Betreuer
    setNewUserName('');
    setNewUserUsername(''); // Wird nur für Admins verwendet
    setNewUserPassword('');
    setNewUserRole('stationaer'); // Default Rolle für neuen Betreuer
    setSelectedDisziplinen([]);
    setSelectedTeams([]);
    setAddUserError(null);
    setSuccessMessage(null);
    setShowUserFormModal(true);
  };

  // Handle opening the modal for editing an existing user (Betreuer for now)
  const openEditUserModal = (user) => {
    setEditMode(true);
    setCurrentUserData(user);
    setNewUserType(user.USERNAME ? 'admin' : 'betreuer'); // Bestimme Typ basierend auf Username Existenz
    setNewUserName(user.NAME);
    setNewUserUsername(user.USERNAME || '');
    setNewUserPassword(''); // Passwort nicht vorbefüllen
    
    if (user.USERNAME) { // Admin
      setNewUserRole(''); // Rolle nicht relevant für Admin in diesem Kontext
      setSelectedDisziplinen([]);
      setSelectedTeams([]);
    } else { // Betreuer
      setNewUserRole(user.ROLLE || 'stationaer');
      // Annahme: user.zugewiesene_disziplinen/teams sind Arrays von IDs oder Objekten mit ID
      setSelectedDisziplinen(user.zugewiesene_disziplinen?.map(d => typeof d === 'object' ? d.DISZIPLINID : d) || []);
      setSelectedTeams(user.zugewiesene_teams?.map(t => typeof t === 'object' ? t.TEAMID : t) || []);
    }
    
    setAddUserError(null);
    setSuccessMessage(null);
    setShowUserFormModal(true);
  };
  
  // Handle submitting the user form (add or edit)
  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setAddUserError(null);
    setIsSubmitting(true);
    
    // Validate inputs
    if (!newUserName.trim()) {
      setAddUserError('Name ist erforderlich');
      setIsSubmitting(false);
      return;
    }
    
    if (newUserType === 'admin' && !newUserUsername.trim()) {
      setAddUserError('Benutzername ist erforderlich für Admins');
      setIsSubmitting(false);
      return;
    }
    
    // Passwort Validierung: Nur für neue User oder wenn Passwort geändert wird (im Edit Mode nicht zwingend)
    if ((!editMode || (editMode && newUserPassword.trim())) && (!newUserPassword.trim() || newUserPassword.length < 6)) {
      setAddUserError('Passwort muss mindestens 6 Zeichen lang sein');
      setIsSubmitting(false);
      return;
    }
    
    try {
      let result;
      
      if (newUserType === 'betreuer') {
        const betreuerData = {
          NAME: newUserName,
          ROLLE: newUserRole,
          // Passwort nur senden, wenn es im Add-Modus ist oder im Edit-Modus geändert wurde
          ...( (!editMode || (editMode && newUserPassword.trim())) && { PASSWORT: newUserPassword } ),
          ...(newUserRole === 'stationaer' && { disziplinen: selectedDisziplinen }),
          ...(newUserRole === 'laufend' && { teams: selectedTeams }),
        };

        if (editMode && currentUserData) {
          console.log("Updating Betreuer with data:", betreuerData);
          result = await updateBetreuer(currentUserData.BETREUERID, betreuerData);
        } else {
          // Add mode - password is required here and part of betreuerData
          if (!newUserPassword.trim()) {
             setAddUserError('Passwort ist erforderlich für neue Betreuer');
             setIsSubmitting(false);
             return;
          }
          console.log("Registering Betreuer with data:", betreuerData);
          // Die registerBetreuer Funktion erwartet name, password, rolle, disziplinen, teams als separate Argumente
          result = await registerBetreuer(
            betreuerData.NAME, 
            betreuerData.PASSWORT, // Sicherstellen, dass Passwort hier übergeben wird
            betreuerData.ROLLE, 
            betreuerData.disziplinen, 
            betreuerData.teams
          );
        }
      } else { // Admin User
        if (editMode && currentUserData) {
          // TODO: Implement admin update logic if needed beyond password change
          // For now, admin edit might only involve password change via ChangePasswordModal
          // Or, if general admin details update is needed, call an updateAdmin function.
          // This part is a placeholder if general admin editing is needed here.
          setSuccessMessage('Admin-Bearbeitung (außer Passwort) hier noch nicht implementiert.');
          setIsSubmitting(false);
          setTimeout(() => setShowUserFormModal(false), 1500);
          return; 
        } else { // Add Admin
          result = await registerAdmin(newUserName, newUserUsername, newUserPassword);
        }
      }
      
      if (result && result.success) {
        const entityType = newUserType === 'betreuer' ? 'Betreuer' : 'Administrator';
        setSuccessMessage(`${entityType} wurde erfolgreich ${editMode ? 'aktualisiert' : 'erstellt'}`);
        
        // Reset form state
        if (!editMode) { // Nur im Add-Modus komplett zurücksetzen
          setNewUserName('');
          setNewUserUsername('');
          setNewUserPassword('');
          setNewUserRole('stationaer');
          setSelectedDisziplinen([]);
          setSelectedTeams([]);
        }
        
        // Refresh the lists
        if (newUserType === 'betreuer') {
          const betreuerResult = await getAllBetreuer();
          if (betreuerResult.success) {
            setBetreuerUsers(betreuerResult.data);
          }
        } else {
          const adminResult = await getAllAdmins();
          if (adminResult.success) {
            setAdminUsers(adminResult.data);
          }
        }
        
        setTimeout(() => {
          setShowUserFormModal(false);
          setSuccessMessage(null);
          if (editMode) {
            setCurrentUserData(null); // Reset currentUserData after edit
            setEditMode(false);
          }
        }, 1500);
      } else {
        setAddUserError(result?.error || `Ein Fehler ist beim ${editMode ? 'Aktualisieren' : 'Erstellen'} des Benutzers aufgetreten`);
      }
    } catch (err) {
      console.error(`Error ${editMode ? 'updating' : 'adding'} user:`, err);
      setAddUserError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to handle disziplin selection
  const handleDisziplinSelect = (disziplinId) => {
    setSelectedDisziplinen(prev => 
      prev.includes(disziplinId) 
        ? prev.filter(id => id !== disziplinId) 
        : [...prev, disziplinId]
    );
  };

  // Helper function to handle team selection
  const handleTeamSelect = (teamId) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  useEffect(() => {
    // Wenn sich die Rolle im Edit-Modus ändert, Zuweisungen der "anderen" Art löschen
    if (editMode && currentUserData && newUserType === 'betreuer') {
      if (newUserRole === 'stationaer') {
        setSelectedTeams([]);
      } else if (newUserRole === 'laufend') {
        setSelectedDisziplinen([]);
      }
    }
  }, [newUserRole, editMode, currentUserData, newUserType]);

  // Change Password Modal
  const ChangePasswordModal = () => (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-medium text-slate-900 dark:text-white">
            Passwort ändern
          </h3>
          <button 
            onClick={() => {
              setShowPasswordChangeModal(false);
              setSelectedUser(null);
              setNewPassword('');
              setConfirmPassword('');
              setPasswordError(null);
            }}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleUserFormSubmit} className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
              <Key size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-4">
              Ändere das Passwort für <span className="font-medium text-slate-900 dark:text-white">{selectedUser?.NAME}</span>
            </p>
          </div>
          
          {/* New Password field */}
          <div className="mb-4">
            <label 
              htmlFor="newPassword" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Neues Passwort
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                placeholder="Mindestens 6 Zeichen"
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {/* Confirm Password field */}
          <div className="mb-6">
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Passwort bestätigen
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              placeholder="Passwort wiederholen"
              disabled={isSubmitting}
              required
            />
          </div>
          
          {/* Error message */}
          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <AlertCircle size={18} className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
            </div>
          )}
          
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
              <CheckCircle size={18} className="text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
            </div>
          )}
          
          {/* Submit and cancel buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowPasswordChangeModal(false);
                setSelectedUser(null);
                setNewPassword('');
                setConfirmPassword('');
                setPasswordError(null);
              }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              disabled={isSubmitting}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Speichern...
                </>
              ) : (
                'Passwort ändern'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  // Confirm Delete User Modal
  const ConfirmDeleteModal = () => (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-medium text-slate-900 dark:text-white">
            Benutzer löschen
          </h3>
          <button 
            onClick={() => setConfirmDeleteUser(null)}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <Trash2 size={28} className="text-red-500 dark:text-red-400" />
          </div>
          
          <p className="text-center text-slate-800 dark:text-slate-200 mb-1 font-medium">
            Sind Sie sicher?
          </p>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
            Möchten Sie den Benutzer <span className="font-medium text-slate-900 dark:text-white">{confirmDeleteUser?.NAME}</span> wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <AlertCircle size={18} className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setConfirmDeleteUser(null)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              disabled={isSubmitting}
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleUserFormSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Löschen...
                </>
              ) : (
                'Benutzer löschen'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // User Form Modal (for Add/Edit) - Umbenannt und erweitert
  const UserFormModal = () => {
    // Helper function to handle disziplin selection
    const handleDisziplinSelect = (disziplinId) => {
      setSelectedDisziplinen(prev => 
        prev.includes(disziplinId) 
          ? prev.filter(id => id !== disziplinId) 
          : [...prev, disziplinId]
      );
    };

    // Helper function to handle team selection
    const handleTeamSelect = (teamId) => {
      setSelectedTeams(prev =>
        prev.includes(teamId)
          ? prev.filter(id => id !== teamId)
          : [...prev, teamId]
      );
    };

    useEffect(() => {
      // Wenn sich die Rolle im Edit-Modus ändert, Zuweisungen der "anderen" Art löschen
      if (editMode && currentUserData && newUserType === 'betreuer') {
        if (newUserRole === 'stationaer') {
          setSelectedTeams([]);
        } else if (newUserRole === 'laufend') {
          setSelectedDisziplinen([]);
        }
      }
    }, [newUserRole, editMode, currentUserData, newUserType]);


    return (
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xl font-medium text-slate-900 dark:text-white">
              {editMode ? 'Benutzer bearbeiten' : 'Neuen Benutzer anlegen'}
            </h3>
            <button 
              onClick={() => {
                setShowUserFormModal(false);
                setEditMode(false);
                setCurrentUserData(null);
              }}
              className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleUserFormSubmit} className="p-6">
            {/* User type selection - nur im Add-Modus änderbar */}
            {!editMode && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Benutzertyp
                </label>
                <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
                  <button
                    type="button"
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 ${
                      newUserType === 'betreuer'
                        ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => setNewUserType('betreuer')}
                    disabled={editMode}
                  >
                    <User size={16} className="mr-2" />
                    Betreuer
                  </button>
                  
                  <button
                    type="button"
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all flex-1 ${
                      newUserType === 'admin'
                        ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    onClick={() => setNewUserType('admin')}
                    disabled={editMode}
                  >
                    <Shield size={16} className="mr-2" />
                    Administrator
                  </button>
                </div>
              </div>
            )}

            {editMode && currentUserData && (
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                    Bearbeite: <span className="font-semibold">{currentUserData.NAME}</span> ({currentUserData.USERNAME ? 'Admin' : `Betreuer, ID: ${currentUserData.BETREUERID}`})
                </p>
            )}
            
            {/* Name field */}
            <div className="mb-4">
              <label 
                htmlFor="newUserName" 
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Name
              </label>
              <input
                id="newUserName"
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                placeholder="Vollständiger Name"
                disabled={isSubmitting}
                required
              />
            </div>
            
            {/* Username field - only for admin */}
            {newUserType === 'admin' && (
              <div className="mb-4">
                <label 
                  htmlFor="newUserUsername" 
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Benutzername
                </label>
                <input
                  id="newUserUsername"
                  type="text"
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="Eindeutiger Benutzername"
                  disabled={isSubmitting || (editMode && newUserType === 'admin')} // Benutzername nicht änderbar für existierende Admins
                  required
                />
              </div>
            )}

            {/* Rolle field - only for betreuer */}
            {newUserType === 'betreuer' && (
              <div className="mb-4">
                <label 
                  htmlFor="newUserRole"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Rolle (Betreuer)
                </label>
                <select
                  id="newUserRole"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                >
                  <option value="stationaer">Stationär (Disziplinen zuweisen)</option>
                  <option value="laufend">Laufend (Teams zuweisen)</option>
                </select>
              </div>
            )}

            {/* Disziplinen Multi-Select - only for stationaer betreuer */}
            {newUserType === 'betreuer' && newUserRole === 'stationaer' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Disziplinen zuweisen (für stationäre Betreuer)
                </label>
                {dataLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Lade Disziplinen...</p>}
                {dataError && <p className="text-sm text-red-500 dark:text-red-400">Fehler beim Laden der Disziplinen.</p>}
                {!dataLoading && !dataError && disziplins && disziplins.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg p-2 bg-slate-50 dark:bg-slate-700/30">
                    {disziplins.map(d => (
                      <label key={d.DISZIPLINID} className="flex items-center space-x-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600/50 rounded-md cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedDisziplinen.includes(d.DISZIPLINID)}
                          onChange={() => handleDisziplinSelect(d.DISZIPLINID)}
                          disabled={isSubmitting}
                          className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400 border-slate-300 dark:border-slate-500 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{d.NAME}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  !dataLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Keine Disziplinen verfügbar.</p>
                )}
              </div>
            )}

            {/* Teams Multi-Select - only for laufend betreuer */}
            {newUserType === 'betreuer' && newUserRole === 'laufend' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Teams zuweisen (für laufende Betreuer)
                </label>
                {dataLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Lade Teams...</p>}
                {dataError && <p className="text-sm text-red-500 dark:text-red-400">Fehler beim Laden der Teams.</p>}
                {!dataLoading && !dataError && teams && teams.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto border border-slate-300 dark:border-slate-600 rounded-lg p-2 bg-slate-50 dark:bg-slate-700/30">
                    {teams.map(t => (
                      <label key={t.TEAMID} className="flex items-center space-x-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-600/50 rounded-md cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={selectedTeams.includes(t.TEAMID)}
                          onChange={() => handleTeamSelect(t.TEAMID)}
                          disabled={isSubmitting}
                          className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400 border-slate-300 dark:border-slate-500 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{t.NAME}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  !dataLoading && <p className="text-sm text-slate-500 dark:text-slate-400">Keine Teams verfügbar.</p>
                )}
              </div>
            )}
            
            {/* Password field */}
            <div className="mb-6">
              <label 
                htmlFor="newUserPassword" 
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Passwort {editMode && '(leer lassen, um nicht zu ändern)'}
              </label>
              <div className="relative">
                <input
                  id="newUserPassword"
                  type={showPassword ? "text" : "password"}
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="block w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="Mindestens 6 Zeichen"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Error message */}
            {addUserError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
                <AlertCircle size={18} className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{addUserError}</p>
              </div>
            )}
            
            {/* Success message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
                <CheckCircle size={18} className="text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
              </div>
            )}
            
            {/* Submit and cancel buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowUserFormModal(false);
                  setEditMode(false);
                  setCurrentUserData(null);
                }}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                disabled={isSubmitting}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Speichern...
                  </>
                ) : (
                  editMode ? 'Änderungen speichern' : 'Benutzer anlegen'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // Main render
  return (
    <div className="container px-4 mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Benutzerverwaltung
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Verwalten Sie Betreuer und Administratoren
          </p>
        </div>
        
        <button
          onClick={() => {
            openAddUserModal();
          }}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <UserPlus size={18} className="mr-2" />
          Benutzer anlegen
        </button>
      </div>
      
      {/* Global success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
          <CheckCircle size={18} className="text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
        </div>
      )}
      
      {/* Global error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
          <AlertCircle size={18} className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* Search and tabs */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
              placeholder="Benutzer suchen..."
            />
          </div>
          
          {/* Tab buttons */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <button
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'betreuer'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('betreuer')}
            >
              <User size={16} className="mr-2" />
              Betreuer
              <span className="ml-2 bg-slate-100 dark:bg-slate-600 px-1.5 py-0.5 rounded-full text-xs">
                {betreuerUsers.length}
              </span>
            </button>
            
            <button
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              onClick={() => setActiveTab('admin')}
            >
              <Shield size={16} className="mr-2" />
              Administratoren
              <span className="ml-2 bg-slate-100 dark:bg-slate-600 px-1.5 py-0.5 rounded-full text-xs">
                {adminUsers.length}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Users list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="col-span-6 md:col-span-5 text-sm font-medium text-slate-600 dark:text-slate-400">
            Name
          </div>
          {activeTab === 'admin' && (
            <div className="col-span-3 hidden md:block text-sm font-medium text-slate-600 dark:text-slate-400">
              Benutzername
            </div>
          )}
          <div className={`${activeTab === 'admin' ? 'col-span-6 md:col-span-4' : 'col-span-6 md:col-span-7'} text-right text-sm font-medium text-slate-600 dark:text-slate-400`}>
            Aktionen
          </div>
        </div>
        
        {/* Loading state */}
        {loading && (
          <div className="py-12 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full"></div>
            <p className="ml-3 text-slate-600 dark:text-slate-400">Benutzer werden geladen...</p>
          </div>
        )}
        
        {/* Empty state */}
        {!loading && activeTab === 'betreuer' && filteredBetreuerUsers.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700">
              <Users size={28} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {searchTerm ? 'Keine Betreuer gefunden.' : 'Keine Betreuer vorhanden.'}
            </p>
            <button
              onClick={() => {
                openAddUserModal();
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Betreuer anlegen
            </button>
          </div>
        )}
        
        {!loading && activeTab === 'admin' && filteredAdminUsers.length === 0 && (
          <div className="py-12 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-700">
              <Shield size={28} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              {searchTerm ? 'Keine Administratoren gefunden.' : 'Keine Administratoren vorhanden.'}
            </p>
            <button
              onClick={() => {
                openAddUserModal();
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Administrator anlegen
            </button>
          </div>
        )}
        
        {/* Betreuer list */}
        {!loading && activeTab === 'betreuer' && filteredBetreuerUsers.length > 0 && (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredBetreuerUsers.map(user => (
              <div key={user.BETREUERID} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="col-span-6 md:col-span-5 flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.NAME}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ID: {user.BETREUERID} 
                      {user.ROLLE && <span className="ml-2 px-1.5 py-0.5 bg-sky-100 dark:bg-sky-700 text-sky-700 dark:text-sky-300 rounded-full text-xs font-medium">{user.ROLLE}</span>}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-6 md:col-span-7 flex items-center justify-end gap-2 md:gap-3">
                  <button
                    onClick={() => openEditUserModal(user)}
                    className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Edit3 size={14} className="mr-1.5" />
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => setConfirmDeleteUser(user)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-800 rounded-md text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Admin list */}
        {!loading && activeTab === 'admin' && filteredAdminUsers.length > 0 && (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredAdminUsers.map(user => (
              <div key={user.ID} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="col-span-6 md:col-span-5 flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.NAME}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">ID: {user.ID}</p>
                  </div>
                </div>
                
                <div className="hidden md:block col-span-3">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{user.USERNAME}</p>
                </div>
                
                <div className="col-span-6 md:col-span-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowPasswordChangeModal(true);
                      setPasswordError(null);
                    }}
                    className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Key size={14} className="mr-1.5" />
                    Passwort ändern
                  </button>
                  
                  <button
                    onClick={() => setConfirmDeleteUser(user)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-800 rounded-md text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showUserFormModal && <UserFormModal />}
      {showPasswordChangeModal && selectedUser && <ChangePasswordModal />}
      {confirmDeleteUser && <ConfirmDeleteModal />}
    </div>
  );
};

export default UserManagementPage;
