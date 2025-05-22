import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  ChevronDown, 
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  AlertTriangle,
  CheckCircle,
  User,
  UserPlus,
  Shield,
  RefreshCw,
  UserCog,
  Filter,
  ArrowUpDown,
  Eye,
  EyeOff,
  Lock, 
  Grid,
  List,
  MapPin,
  Map,
  ToggleLeft,
  ToggleRight,
  Zap,
  Goal,
  Layers,
  Clipboard,
  GraduationCap,
  Settings,
  CloudUpload,
  FileCheck,
  Loader2
} from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';
import { useMediaQuery } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { useTheme } from '../contexts/ThemeProvider'; // Import useTheme
import { useDropzone } from 'react-dropzone';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

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

const modalVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  initial: { opacity: 0 },
  animate: (index) => ({
    opacity: 1,
    transition: { duration: 0.3, delay: index * 0.05 }
  }),
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const TeilnehmerPage = () => {
  // Responsive states
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const { isDarkMode } = useTheme(); // Get isDarkMode state
  
  // Auth context
  const { currentUser, isAdmin, loading: authLoading, updateBetreuer: contextUpdateBetreuer, registerBetreuer: contextRegisterBetreuer } = useAuth(); // Added contextUpdateBetreuer and contextRegisterBetreuer
  const [currentBetreuerDataForPage, setCurrentBetreuerDataForPage] = useState(null);
  
  // State management
  const [teams, setTeams] = useState([]);
  const [betreuerList, setBetreuerList] = useState([]); // Umbenannt von betreuer zu betreuerList
  const [disziplinen, setDisziplinen] = useState([]);
  const [students, setStudents] = useState([]); // State for students
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name'); // 'name', 'betreuer', 'rolle'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [viewMode, setViewMode] = useState('card'); // 'card', 'table'
  const [showPasswords, setShowPasswords] = useState({}); 
  const [activeTab, setActiveTab] = useState('teams'); // 'teams', 'betreuer', 'students'
  
  // Modal states
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
  const [showAddBetreuerModal, setShowAddBetreuerModal] = useState(false);
  const [showEditBetreuerModal, setShowEditBetreuerModal] = useState(false);
  const [showDeleteBetreuerModal, setShowDeleteBetreuerModal] = useState(false);
  const [showAssignDisziplinenModal, setShowAssignDisziplinenModal] = useState(false);
  const [showAssignTeamsModal, setShowAssignTeamsModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showDeleteStudentModal, setShowDeleteStudentModal] = useState(false);
  const [showAssignStudentsModal, setShowAssignStudentsModal] = useState(false);
  const [showExcelImportModal, setShowExcelImportModal] = useState(false);
  
  // Current items for editing/deleting/assigning
  const [currentTeam, setCurrentTeam] = useState(null);
  const [currentBetreuer, setCurrentBetreuer] = useState(null);
  const [currentStudent, setCurrentStudent] = useState(null);
  
  // Form data
  const [teamFormData, setTeamFormData] = useState({
    NAME: ''
  });
  
  const [betreuerFormData, setBetreuerFormData] = useState({
    NAME: '',
    PASSWORT: '',
    ROLLE: 'stationaer',
    disziplinen: [],
    teams: []
  });

  const [studentFormData, setStudentFormData] = useState({
    VORNAME: '',
    NACHNAME: '',
    GEBURTSDATUM: '',
    GESCHLECHT: 'männlich',
    KLASSE: '',
    TEAMID: null
  });
  
  // Multi-select data for assigning disziplinen or teams
  const [selectedDisziplinen, setSelectedDisziplinen] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // States for AssignStudentsModal filters
  const [studentSearchQueryInModal, setStudentSearchQueryInModal] = useState('');
  const [selectedClassFilterInModal, setSelectedClassFilterInModal] = useState('');
  
  // Notification state
  const [notification, setNotification] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [importError, setImportError] = useState(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoadingImport, setIsLoadingImport] = useState(false);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Fetch currentBetreuerData if a betreuer is logged in
  useEffect(() => {
    const fetchBetreuerDetailsForPage = async () => {
      if (currentUser && currentUser.id && !isAdmin() && !authLoading) { // MODIFIED: isAdmin -> isAdmin()
        setLoading(true);
        try {
          const baseUrl = import.meta.env.VITE_API_URL || '';
          const response = await fetch(`${baseUrl}/betreuer/${currentUser.id}?withAssignments=true`);
          if (!response.ok) throw new Error(`Failed to fetch betreuer details: ${response.status}`);
          const result = await response.json();
          if (result.success && result.data) {
            setCurrentBetreuerDataForPage(result.data);
          } else {
            throw new Error(result.error || 'Betreuer details not found');
          }
        } catch (err) {
          console.error('Error fetching betreuer details for page:', err);
        } finally {
          setLoading(false);
        }
      } else if (!currentUser && !authLoading) {
        setCurrentBetreuerDataForPage(null);
      }
    };
    if (!authLoading) fetchBetreuerDetailsForPage();
  }, [currentUser, isAdmin, authLoading]); // Dependency isAdmin bleibt hier als Referenz auf die Funktion
  
  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
  
      const baseUrl = import.meta.env.VITE_API_URL || '';
  
      // Fetch all entities including the enhanced betreuer that includes role and assignments
      const [teamsResponse, betreuerResponse, disziplinenResponse, studentsResponse] = await Promise.all([
        fetch(`${baseUrl}/teams`),
        fetch(`${baseUrl}/betreuer?withAssignments=true`),
        fetch(`${baseUrl}/disziplins`),
        fetch(`${baseUrl}/schueler`)
      ]);
  
      if (!teamsResponse.ok || !betreuerResponse.ok || !disziplinenResponse.ok || !studentsResponse.ok) {
        throw new Error(`Fehler beim Laden: Teams: ${teamsResponse.status}, Betreuer: ${betreuerResponse.status}, Disziplinen: ${disziplinenResponse.status}, Schüler: ${studentsResponse.status}`);
      }
  
      const teamsData = await teamsResponse.json();
      const betreuerData = await betreuerResponse.json();
      const disziplinenData = await disziplinenResponse.json();
      const studentsData = await studentsResponse.json();
  
      if (teamsData.success && betreuerData.success && disziplinenData.success && studentsData.success) {
        setTeams(teamsData.data || []);
        setBetreuerList(betreuerData.data || []); // Verwendet betreuerList
        setDisziplinen(disziplinenData.data || []);
        setStudents(studentsData.data || []);
        setError(null);

        console.log("Loaded betreuer with roles:", betreuerData.data);
        console.log("Loaded students:", studentsData.data);
      } else {
        throw new Error('Eine oder mehrere API-Antworten fehlerhaft');
      }
    } catch (err) {
      console.error('Fehler beim Laden der Daten:', err);
      setError(err.message || 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle team form input change
  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData({ ...teamFormData, [name]: value });
  };
  
  // Handle betreuer form input change
  const handleBetreuerFormChange = (e) => {
    const { name, value } = e.target;
    setBetreuerFormData({ ...betreuerFormData, [name]: value });
  };

  // Handle student form input change
  const handleStudentFormChange = (e) => {
    const { name, value } = e.target;
    setStudentFormData({ ...studentFormData, [name]: value });
  };
  
  // Handle disziplin selection change
  const handleDisziplinChange = (disziplinId, checked) => {
    if (checked) {
      setSelectedDisziplinen(prev => [...prev, parseInt(disziplinId)]);
    } else {
      setSelectedDisziplinen(prev => prev.filter(id => id !== parseInt(disziplinId)));
    }
  };
  
  // Handle team selection change
  const handleTeamChange = (teamId, checked) => {
    if (checked) {
      setSelectedTeams(prev => [...prev, parseInt(teamId)]);
    } else {
      setSelectedTeams(prev => prev.filter(id => id !== parseInt(teamId)));
    }
  };

  // Handle student selection change
  const handleStudentChange = (studentId, checked) => {
    console.log('Studentenauswahl geändert. studentId:', studentId, 'checked:', checked, 'Current selectedStudents State (vor Update):', selectedStudents); // DEBUG
    setSelectedStudents(prev => 
      checked ? [...prev, parseInt(studentId)] : prev.filter(id => id !== parseInt(studentId))
    );
  };
  
  // Add team
  const handleAddTeam = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
  
      const response = await fetch(`${baseUrl}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamFormData),
      });
  
      const result = await response.json();
  
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Team erfolgreich hinzugefügt!'
        });
        fetchData();
        setShowAddTeamModal(false);
        resetTeamForm();
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Team konnte nicht hinzugefügt werden');
      }
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Teams:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Edit team
  const handleEditTeam = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
  
      const response = await fetch(`${baseUrl}/teams/${currentTeam.TEAMID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamFormData),
      });
  
      const result = await response.json();
  
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Team erfolgreich aktualisiert!'
        });
        fetchData();
        setShowEditTeamModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Team konnte nicht aktualisiert werden');
      }
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Teams:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Delete team
  const handleDeleteTeam = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${baseUrl}/teams/${currentTeam.TEAMID}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Team erfolgreich gelöscht!'
        });
        fetchData();
        setShowDeleteTeamModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Team konnte nicht gelöscht werden');
      }
    } catch (err) {
      console.error('Fehler beim Löschen des Teams:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Add betreuer with role and assignments
  const handleAddBetreuer = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      // Define payload based on role
      const payload = {
        NAME: betreuerFormData.NAME,
        PASSWORT: betreuerFormData.PASSWORT, // Passwort wird vom AuthController gehasht
        ROLLE: betreuerFormData.ROLLE
      };
      
      // Add role-specific assignments
      if (betreuerFormData.ROLLE === 'stationaer') {
        payload.disziplinen = selectedDisziplinen;
      } else if (betreuerFormData.ROLLE === 'laufend') {
        payload.teams = selectedTeams;
      }
      
      const response = await fetch(`${baseUrl}/betreuer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Betreuer erfolgreich hinzugefügt!'
        });
        fetchData();
        setShowAddBetreuerModal(false);
        resetBetreuerForm();
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Betreuer konnte nicht hinzugefügt werden');
      }
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Betreuers:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Edit betreuer with role and assignments
  const handleEditBetreuer = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      // Define payload based on role
      const payload = {
        NAME: betreuerFormData.NAME,
        ROLLE: betreuerFormData.ROLLE
      };
      
      // Only include password if it's changed
      if (betreuerFormData.PASSWORT) {
        payload.PASSWORT = betreuerFormData.PASSWORT;
      }
      
      // Add role-specific assignments
      if (betreuerFormData.ROLLE === 'stationaer') {
        payload.disziplinen = selectedDisziplinen;
      } else if (betreuerFormData.ROLLE === 'laufend') {
        payload.teams = selectedTeams;
      }
      
      const response = await fetch(`${baseUrl}/betreuer/${currentBetreuer.BETREUERID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Betreuer erfolgreich aktualisiert!'
        });
        fetchData();
        setShowEditBetreuerModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Betreuer konnte nicht aktualisiert werden');
      }
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Betreuers:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Delete betreuer
  const handleDeleteBetreuer = async () => {
    if (!currentBetreuer) return; // Verwende currentBetreuer
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/betreuer/${currentBetreuer.BETREUERID}`, { method: 'DELETE' }); // Verwende currentBetreuer
      const result = await response.json();
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({ type: 'success', message: 'Betreuer erfolgreich gelöscht!' });
        fetchData(); // Daten neu laden
        setShowDeleteBetreuerModal(false);
        setCurrentBetreuer(null); // Zurücksetzen
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Betreuer konnte nicht gelöscht werden');
      }
    } catch (err) {
      console.error('Fehler beim Löschen des Betreuers:', err);
      setNotification({ type: 'error', message: `Fehler: ${err.message}` });
    }
  };
  
  // Add student
  const handleAddStudent = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${baseUrl}/schueler`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Schüler erfolgreich hinzugefügt!'
        });
        fetchData();
        setShowAddStudentModal(false);
        resetStudentForm();
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Schüler konnte nicht hinzugefügt werden');
      }
    } catch (err) {
      console.error('Fehler beim Hinzufügen des Schülers:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Edit student
  const handleEditStudent = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${baseUrl}/schueler/${currentStudent.SCHUELERID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentFormData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Schüler erfolgreich aktualisiert!'
        });
        fetchData();
        setShowEditStudentModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Schüler konnte nicht aktualisiert werden');
      }
    } catch (err) {
      console.error('Fehler beim Aktualisieren des Schülers:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Delete student
  const handleDeleteStudent = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${baseUrl}/schueler/${currentStudent.SCHUELERID}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Schüler erfolgreich gelöscht!'
        });
        fetchData();
        setShowDeleteStudentModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Schüler konnte nicht gelöscht werden');
      }
    } catch (err) {
      console.error('Fehler beim Löschen des Schülers:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };
  
  // Handle assignment of disziplinen to betreuer
  const handleAssignDisziplinen = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${baseUrl}/betreuer/${currentBetreuer.BETREUERID}/disziplinen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disziplinen: selectedDisziplinen
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Disziplinen erfolgreich zugewiesen!'
        });
        fetchData();
        setShowAssignDisziplinenModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Disziplinen konnten nicht zugewiesen werden');
      }
    } catch (err) {
      console.error('Fehler bei der Zuweisung von Disziplinen:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Handle assignment of teams to betreuer
  const handleAssignTeams = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${baseUrl}/betreuer/${currentBetreuer.BETREUERID}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teams: selectedTeams
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Teams erfolgreich zugewiesen!'
        });
        fetchData();
        setShowAssignTeamsModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Teams konnten nicht zugewiesen werden');
      }
    } catch (err) {
      console.error('Fehler bei der Zuweisung von Teams:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Handle assignment of students to team
  const handleAssignStudents = async () => {
    console.log('Sende Zuweisung. currentTeam.TEAMID:', currentTeam?.TEAMID, 'studentIds:', selectedStudents); // DEBUG
    if (!currentTeam || !currentTeam.TEAMID) {
      console.error("currentTeam oder TEAMID ist null in handleAssignStudents");
      setNotification({ type: 'error', message: 'Fehler: Team nicht spezifiziert.' });
      return;
    }
    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${baseUrl}/teams/${currentTeam.TEAMID}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentIds: selectedStudents
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        triggerHapticFeedback('success');
        setNotification({
          type: 'success',
          message: 'Schüler erfolgreich zum Team hinzugefügt!'
        });
        fetchData();
        setShowAssignStudentsModal(false);
      } else {
        triggerHapticFeedback('error');
        throw new Error(result.error || 'Schüler konnten nicht zugewiesen werden');
      }
    } catch (err) {
      console.error('Fehler bei der Zuweisung von Schülern:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  // Reset team form
  const resetTeamForm = () => {
    setTeamFormData({
      NAME: ''
    });
  };
  
  // Reset betreuer form
  const resetBetreuerForm = () => {
    setBetreuerFormData({
      NAME: '',
      PASSWORT: '',
      ROLLE: 'stationaer',
      disziplinen: [],
      teams: []
    });
    setSelectedDisziplinen([]);
    setSelectedTeams([]);
  };

  // Reset student form
  const resetStudentForm = () => {
    setStudentFormData({
      VORNAME: '',
      NACHNAME: '',
      GEBURTSDATUM: '',
      GESCHLECHT: 'männlich',
      KLASSE: '',
      TEAMID: null
    });
  };
  
  // Open edit team modal
  const openEditTeamModal = (team) => {
    setCurrentTeam(team);
    setTeamFormData({
      NAME: team.NAME || ''
    });
    setShowEditTeamModal(true);
  };
  
  // Open delete team modal
  const openDeleteTeamModal = (team) => {
    setCurrentTeam(team);
    setShowDeleteTeamModal(true);
  };
  
  // Open edit betreuer modal (Wird ersetzt durch openBetreuerFormModal)
  const openEditBetreuerModal = (betreuerToEdit) => {
    triggerHapticFeedback('light');
    setSelectedBetreuer(betreuerToEdit); // Veraltet
    setBetreuerFormData({
      BETREUERID: betreuerToEdit.BETREUERID,
      NAME: betreuerToEdit.NAME,
      PASSWORT: '', // Passwort leer lassen, nur bei Änderung setzen
      ROLLE: betreuerToEdit.ROLLE || 'stationaer',
    });
    // Pre-fill selected disziplinen/teams based on the betreuer's current assignments
    setSelectedDisziplinenForForm(betreuerToEdit.disziplinen?.map(d => d.DISZIPLINID) || []); // Veraltet
    setSelectedTeamsForForm(betreuerToEdit.teams?.map(t => t.TEAMID) || []); // Veraltet
    setShowEditBetreuerModal(true);
  };

  // Open delete betreuer modal
  const openDeleteBetreuerModal = (betreuerToDelete) => {
    triggerHapticFeedback('light');
    setCurrentBetreuer(betreuerToDelete); // Verwende currentBetreuer
    setShowDeleteBetreuerModal(true);
  };

  // Open edit student modal
  const openEditStudentModal = (student) => {
    setCurrentStudent(student);
    setStudentFormData({
      VORNAME: student.VORNAME || '',
      NACHNAME: student.NACHNAME || '',
      GEBURTSDATUM: student.GEBURTSDATUM || '',
      GESCHLECHT: student.GESCHLECHT || 'männlich',
      KLASSE: student.KLASSE || '',
      TEAMID: student.TEAMID || null
    });
    setShowEditStudentModal(true);
  };

  // Open delete student modal
  const openDeleteStudentModal = (student) => {
    setCurrentStudent(student);
    setShowDeleteStudentModal(true);
  };

  // Open assign disziplinen modal
  const openAssignDisziplinenModal = (betreuer) => {
    setCurrentBetreuer(betreuer);
    
    // Set selected disziplinen from betreuer
    if (betreuer.disziplinen) {
      const disziplinIds = betreuer.disziplinen.map(d => d.DISZIPLINID);
      setSelectedDisziplinen(disziplinIds);
    } else {
      setSelectedDisziplinen([]);
    }
    
    setShowAssignDisziplinenModal(true);
  };

  // Open assign teams modal
  const openAssignTeamsModal = (betreuer) => {
    setCurrentBetreuer(betreuer);
    
    // Set selected teams from betreuer
    if (betreuer.teams) {
      const teamIds = betreuer.teams.map(t => t.TEAMID);
      setSelectedTeams(teamIds);
    } else {
      setSelectedTeams([]);
    }
    
    setShowAssignTeamsModal(true);
  };

  // New function to handle opening the unified Betreuer Form/Assign Modal
  const openBetreuerFormModal = (isEditing, betreuerToEdit = null) => {
    triggerHapticFeedback('light');
    setCurrentBetreuer(betreuerToEdit); // Set currentBetreuer regardless of editing or adding
    
    if (isEditing && betreuerToEdit) {
      setBetreuerFormData({
        BETREUERID: betreuerToEdit.BETREUERID,
        NAME: betreuerToEdit.NAME,
        PASSWORT: '', // Keep password empty for editing unless changed
        ROLLE: betreuerToEdit.ROLLE || 'stationaer',
      });
      setSelectedDisziplinen(betreuerToEdit.disziplinen?.map(d => d.DISZIPLINID) || []);
      setSelectedTeams(betreuerToEdit.teams?.map(t => t.TEAMID) || []);
    } else {
      // Reset for adding new Betreuer
      resetBetreuerForm(); 
    }
    
    setShowAddBetreuerModal(true); // Use the same modal state for add and edit
  };

  // Open assign students modal
  const openAssignStudentsModal = (team) => {
    console.log('Admin öffnet AssignStudentsModal für Team:', team); // DEBUG
    setCurrentTeam(team);
    setStudentSearchQueryInModal(''); // Reset search query
    setSelectedClassFilterInModal(''); // Reset class filter
    
    // Set selected students from team
    const teamStudents = students.filter(s => s.TEAMID === team.TEAMID).map(s => s.SCHUELERID);
    console.log('Initial selectedStudents:', teamStudents); // DEBUG
    setSelectedStudents(teamStudents);
    
    setShowAssignStudentsModal(true);
  };

  // Toggle sorting
  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    triggerHapticFeedback('light');
  };

  // Filter teams, betreuer, or students based on search query
  const filteredTeams = useMemo(() => {
    return teams.filter(team => 
      team.NAME.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [teams, searchQuery]);

  const filteredBetreuer = useMemo(() => {
    return betreuerList.filter(b => 
      b.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.ROLLE && b.ROLLE.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [betreuerList, searchQuery]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.VORNAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.NACHNAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.KLASSE && student.KLASSE.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [students, searchQuery]);

  // Sort teams, betreuer, or students
  const sortedTeams = useMemo(() => {
    return [...filteredTeams].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.NAME.localeCompare(b.NAME)
          : b.NAME.localeCompare(a.NAME);
      }
      return 0;
    });
  }, [filteredTeams, sortBy, sortOrder]);

  const sortedBetreuer = useMemo(() => {
    return [...filteredBetreuer].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.NAME.localeCompare(b.NAME)
          : b.NAME.localeCompare(a.NAME);
      } else if (sortBy === 'rolle') {
        return sortOrder === 'asc' 
          ? (a.ROLLE || '').localeCompare(b.ROLLE || '')
          : (b.ROLLE || '').localeCompare(a.ROLLE || '');
      }
      return 0;
    });
  }, [filteredBetreuer, sortBy, sortOrder]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      if (sortBy === 'name') {
        const aName = `${a.NACHNAME}, ${a.VORNAME}`;
        const bName = `${b.NACHNAME}, ${b.VORNAME}`;
        return sortOrder === 'asc' 
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      } else if (sortBy === 'klasse') {
        return sortOrder === 'asc' 
          ? (a.KLASSE || '').localeCompare(b.KLASSE || '')
          : (b.KLASSE || '').localeCompare(a.KLASSE || '');
      } else if (sortBy === 'team') {
        const aTeam = teams.find(t => t.TEAMID === a.TEAMID)?.NAME || '';
        const bTeam = teams.find(t => t.TEAMID === b.TEAMID)?.NAME || '';
        return sortOrder === 'asc' 
          ? aTeam.localeCompare(bTeam)
          : bTeam.localeCompare(aTeam);
      }
      return 0;
    });
  }, [filteredStudents, teams, sortBy, sortOrder]);

  // Get team and betreuer info
  const getTeamName = (teamId) => {
    const team = teams.find(t => t.TEAMID === teamId);
    return team ? team.NAME : 'Kein Team';
  };

  const getDisziplinName = (disziplinId) => {
    const disziplin = disziplinen.find(d => d.DISZIPLINID === disziplinId);
    return disziplin ? disziplin.NAME : 'Keine Disziplin';
  };

  const getBetreuerRolleLabel = (rolle) => {
    switch(rolle) {
      case 'stationaer': return 'Stationär';
      case 'laufend': return 'Laufend';
      default: return rolle || 'Unbekannt';
    }
  };

  // Determine which items to display based on role and search
  const itemsToDisplay = useMemo(() => {
    if (authLoading || loading) { // Added authLoading here
      return { teams: [], betreuer: [], students: [] };
    }

    let finalTeams = teams;
    let finalBetreuer = betreuerList;
    let finalStudents = students;

    if (!isAdmin() && currentBetreuerDataForPage) { // MODIFIED: isAdmin -> isAdmin()
      if (currentBetreuerDataForPage.ROLLE === 'laufend') {
        const zugewieseneTeamIDs = currentBetreuerDataForPage.teams?.map(t => t.TEAMID) || [];
        finalTeams = teams.filter(t => zugewieseneTeamIDs.includes(t.TEAMID));
        finalStudents = students.filter(s => s.TEAMID && zugewieseneTeamIDs.includes(s.TEAMID));
        finalBetreuer = betreuerList.filter(b => b.BETREUERID === currentBetreuerDataForPage.BETREUERID); // Nur sich selbst
      } else if (currentBetreuerDataForPage.ROLLE === 'stationaer') {
        // Stationäre Betreuer sehen alle Teams und alle Schüler (laut unserer Diskussion)
        // Ihre Filterung ist eher für die Ergebnisseite relevant
        finalBetreuer = betreuerList.filter(b => b.BETREUERID === currentBetreuerDataForPage.BETREUERID); // Nur sich selbst
        // finalTeams und finalStudents bleiben alle
      } else { // Fallback oder unbekannte Rolle
        finalTeams = [];
        finalBetreuer = [];
        finalStudents = [];
      }
    }

    return {
      teams: finalTeams.filter(team =>
        team.NAME.toLowerCase().includes(searchQuery.toLowerCase())
      ).sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.NAME.localeCompare(b.NAME) : b.NAME.localeCompare(a.NAME);
        }
        return 0;
      }),
      betreuer: finalBetreuer.filter(b =>
        b.NAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.ROLLE && getBetreuerRolleLabel(b.ROLLE).toLowerCase().includes(searchQuery.toLowerCase()))
      ).sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.NAME.localeCompare(b.NAME) : b.NAME.localeCompare(a.NAME);
        } else if (sortBy === 'rolle') {
          return sortOrder === 'asc' ? (getBetreuerRolleLabel(a.ROLLE) || '').localeCompare(getBetreuerRolleLabel(b.ROLLE) || '') : (getBetreuerRolleLabel(b.ROLLE) || '').localeCompare(getBetreuerRolleLabel(a.ROLLE) || '');
        }
        return 0;
      }),
      students: finalStudents.filter(student =>
        student.VORNAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.NACHNAME.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.KLASSE && student.KLASSE.toLowerCase().includes(searchQuery.toLowerCase()))
      ).sort((a, b) => {
        if (sortBy === 'name') {
          const aName = `${a.NACHNAME}, ${a.VORNAME}`;
          const bName = `${b.NACHNAME}, ${b.VORNAME}`;
          return sortOrder === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
        } else if (sortBy === 'klasse') {
          return sortOrder === 'asc' ? (a.KLASSE || '').localeCompare(b.KLASSE || '') : (b.KLASSE || '').localeCompare(a.KLASSE || '');
        } else if (sortBy === 'team') {
          const aTeam = teams.find(t => t.TEAMID === a.TEAMID)?.NAME || '';
          const bTeam = teams.find(t => t.TEAMID === b.TEAMID)?.NAME || '';
          return sortOrder === 'asc' ? aTeam.localeCompare(bTeam) : bTeam.localeCompare(aTeam);
        }
        return 0;
      }),
    };
  }, [teams, betreuerList, students, searchQuery, sortBy, sortOrder, isAdmin, currentBetreuerDataForPage, authLoading, loading]); // Dependency isAdmin bleibt hier als Referenz auf die Funktion

  const filteredStudentsForModal = useMemo(() => {
    let modalStudents = students.filter(student => !student.TEAMID || student.TEAMID === currentTeam?.TEAMID); // Schüler ohne Team oder bereits in diesem Team

    if (selectedClassFilterInModal) {
      modalStudents = modalStudents.filter(student => student.KLASSE === selectedClassFilterInModal);
    }
    if (studentSearchQueryInModal) {
      modalStudents = modalStudents.filter(student =>
        `${student.VORNAME} ${student.NACHNAME}`.toLowerCase().includes(studentSearchQueryInModal.toLowerCase())
      );
    }
    return modalStudents;
  }, [students, currentTeam, selectedClassFilterInModal, studentSearchQueryInModal]);

  // Get unique classes for the filter dropdown
  const uniqueClasses = useMemo(() => {
    const allClasses = students.map(s => s.KLASSE).filter(Boolean); // Filtert null oder leere Strings
    return [...new Set(allClasses)].sort();
  }, [students]);

  // Main render
  return (
    <motion.div
      className={`p-4 md:p-6 lg:p-8 min-h-screen ${
        isDarkMode 
          ? 'bg-slate-900 text-slate-100'
          : 'bg-slate-100 text-slate-800'
      } transition-colors duration-300`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        {/* <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Teilnehmerverwaltung</h1>
          <p className="text-gray-400 text-sm md:text-base">
            Verwalten Sie Teams, Betreuer und Schüler.
          </p>
        </header> */}

        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
                notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertTriangle className="w-5 h-5 mr-2" />
                )}
                <p>{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className={`flex mb-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
          <button
            className={`px-4 py-3 font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${
              activeTab === 'teams'
                ? (isDarkMode ? 'text-sky-400 border-sky-400 ring-sky-500/50' : 'text-sky-600 border-sky-600 ring-sky-600/50') + ' border-b-2'
                : (isDarkMode ? 'text-slate-400 hover:text-sky-400 border-transparent hover:border-sky-500/30' : 'text-slate-500 hover:text-sky-600 border-transparent hover:border-sky-600/30')
            } rounded-t-md`}
            onClick={() => {
              setActiveTab('teams');
              triggerHapticFeedback('selection');
            }}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Teams
          </button>
          <button
            className={`px-4 py-3 font-semibold text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 ${activeTab === 'betreuer'
              ? (isDarkMode ? 'text-sky-400 border-sky-400 ring-sky-500/50' : 'text-sky-600 border-sky-600 ring-sky-600/50') + ' border-b-2'
              : (isDarkMode ? 'text-slate-400 hover:text-sky-400 border-transparent hover:border-sky-500/30' : 'text-slate-500 hover:text-sky-600 border-transparent hover:border-sky-600/30')
            } rounded-t-md`}
            onClick={() => {
              setActiveTab('betreuer');
              triggerHapticFeedback('selection');
            }}
          >
            <UserCog className="w-4 h-4 inline mr-2" />
            Betreuer
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'students'
              ? (isDarkMode ? 'text-sky-400 border-sky-400' : 'text-sky-600 border-sky-600') + ' border-b-2'
              : (isDarkMode ? 'text-slate-400 hover:text-sky-400' : 'text-slate-500 hover:text-sky-600')
            }`}
            onClick={() => {
              setActiveTab('students');
              triggerHapticFeedback('selection');
            }}
          >
            <GraduationCap className="w-4 h-4 inline mr-2" />
            Schüler
          </button>
        </div>
        
        {/* Search and controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <div className="relative w-full md:w-64">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} w-4 h-4`} />
            <input
              type="text"
              placeholder={`Suche nach ${activeTab === 'teams' ? 'Teams…' : activeTab === 'betreuer' ? 'Betreuern…' : 'Schülern…'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full border rounded-lg transition-colors
                ${isDarkMode
                  ? 'bg-slate-800 border-slate-600 placeholder-slate-500 text-slate-200 focus:ring-sky-500 focus:border-sky-500'
                  : 'bg-white border-slate-300 placeholder-slate-400 text-slate-700 focus:ring-sky-500 focus:border-sky-500'
                }`}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center border ${isDarkMode ? 'border-slate-600' : 'border-slate-300'} rounded-lg overflow-hidden`}>
              <button
                className={`p-2 transition-colors ${viewMode === 'card'
                    ? (isDarkMode ? 'bg-sky-700 text-sky-100' : 'bg-sky-100 text-sky-700')
                    : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-500 hover:bg-slate-50')
                  }`}
                onClick={() => setViewMode('card')}
                aria-label="Card-Ansicht"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                className={`p-2 transition-colors ${viewMode === 'table'
                    ? (isDarkMode ? 'bg-sky-700 text-sky-100' : 'bg-sky-100 text-sky-700')
                    : (isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-white text-slate-500 hover:bg-slate-50')
                  }`}
                onClick={() => setViewMode('table')}
                aria-label="Tabellen-Ansicht"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin()
              <button
                className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 dark:bg-sky-500 dark:hover:bg-sky-400"
                onClick={() => {
                  if (activeTab === 'teams') {
                    resetTeamForm();
                    setShowAddTeamModal(true);
                  } else if (activeTab === 'betreuer') {
                    openBetreuerFormModal(false, null); 
                  } else if (activeTab === 'students') {
                    resetStudentForm();
                    setShowAddStudentModal(true);
                  }
                  triggerHapticFeedback('light'); // Changed from 'success' to 'light'
                }}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {activeTab === 'teams' ? 'Team' : activeTab === 'betreuer' ? 'Betreuer' : 'Schüler'} hinzufügen
              </button>
            )}
          </div>
        </div>
        
        {/* Loading state */}
        {(loading || authLoading) && ( // Check both loading states
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Content based on active tab */}
        {!loading && !error && (
          <AnimatePresence mode="wait">
            {activeTab === 'teams' && (
              <motion.div 
                key="teams"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {itemsToDisplay.teams.length > 0 ? (
                      itemsToDisplay.teams.map((team, index) => (
                        <motion.div
                          key={team.TEAMID}
                          variants={cardVariants}
                          custom={index}
                          whileHover="hover"
                          className={`rounded-lg shadow-md overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
                        >
                          <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold truncate ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{team.NAME}</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>ID: {team.TEAMID}</p>
                          </div>
                          <div className="p-4">
                            <div className="mb-2">
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Schüler</p>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                {students.filter(s => s.TEAMID === team.TEAMID).length || 0} Mitglieder
                              </p>
                            </div>
                          </div>
                          {isAdmin() && ( 
                            <div className={`px-4 py-3 flex justify-end gap-2 ${isDarkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-gray-50'}`}>
                              <button
                                onClick={() => {
                                  openAssignStudentsModal(team);
                                  triggerHapticFeedback('light');
                                }}
                                className={`p-2 rounded-md transition-colors ${isDarkMode ? 'text-sky-400 hover:bg-sky-700/50' : 'text-blue-600 hover:bg-blue-100'}`}
                                aria-label="Schüler zuweisen"
                                title="Schüler zuweisen"
                              >
                                <UserPlus className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  openEditTeamModal(team);
                                  triggerHapticFeedback('light');
                                }}
                                className={`p-2 rounded-md transition-colors ${isDarkMode ? 'text-amber-400 hover:bg-amber-700/50' : 'text-amber-600 hover:bg-amber-100'}`}
                                aria-label="Team bearbeiten"
                                title="Team bearbeiten"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  openDeleteTeamModal(team);
                                  triggerHapticFeedback('light');
                                }}
                                className={`p-2 rounded-md transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-700/50' : 'text-red-600 hover:bg-red-100'}`}
                                aria-label="Team löschen"
                                title="Team löschen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className={`col-span-full text-center py-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        Keine Teams gefunden oder zugewiesen.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-lg shadow overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
                    <table className={`min-w-full divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                      <thead className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                        <tr>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}
                            onClick={() => toggleSort('name')}
                          >
                            <div className="flex items-center">
                              Team Name
                              {sortBy === 'name' && (
                                <ArrowUpDown className="ml-1 w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                            Anzahl Schüler
                          </th>
                          <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                            Aktionen
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-gray-200'}`}>
                        {itemsToDisplay.teams.length > 0 ? (
                          itemsToDisplay.teams.map((team, index) => (
                            <motion.tr 
                              key={team.TEAMID}
                              variants={itemVariants}
                              custom={index}
                              className={`${isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-gray-50/50'} transition-colors`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{team.NAME}</div>
                                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>ID: {team.TEAMID}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                                  {students.filter(s => s.TEAMID === team.TEAMID).length || 0} Mitglieder
                                </div>
                              </td>
                              {isAdmin() && ( 
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => {
                                      openAssignStudentsModal(team);
                                      triggerHapticFeedback('light');
                                    }}
                                    className={`mr-3 ${isDarkMode ? 'text-sky-400 hover:text-sky-300' : 'text-blue-600 hover:text-blue-900'}`}
                                  >
                                    <UserPlus className="w-4 h-4 inline" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      openEditTeamModal(team);
                                      triggerHapticFeedback('light');
                                    }}
                                    className={`mr-3 ${isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-900'}`}
                                  >
                                    <Edit className="w-4 h-4 inline" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      openDeleteTeamModal(team);
                                      triggerHapticFeedback('light');
                                    }}
                                    className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                                  >
                                    <Trash2 className="w-4 h-4 inline" />
                                  </button>
                                </td>
                              )}
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                              Keine Teams gefunden oder zugewiesen.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
            
            {activeTab === 'betreuer' && (
              <motion.div 
                key="betreuer"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {itemsToDisplay.betreuer.length > 0 ? (
                      itemsToDisplay.betreuer.map((b, index) => ( 
                        <motion.div
                          key={b.BETREUERID}
                          variants={cardVariants}
                          custom={index}
                          whileHover="hover"
                          className={`rounded-lg shadow-md overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
                        >
                          <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold truncate ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{b.NAME}</h3>
                            <div className="flex items-center mt-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode 
                                ? (b.ROLLE === 'stationaer' ? 'bg-purple-700/30 text-purple-300' : 'bg-green-700/30 text-green-300')
                                : (b.ROLLE === 'stationaer' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800')
                              }`}>
                                {b.ROLLE === 'stationaer' ? (
                                  <MapPin className="w-3 h-3 mr-1" />
                                ) : (
                                  <Map className="w-3 h-3 mr-1" />
                                )}
                                {getBetreuerRolleLabel(b.ROLLE)}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            {b.ROLLE === 'stationaer' ? (
                              <div className="mb-2">
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Zugewiesene Disziplinen</p>
                                <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                  {b.disziplinen?.length > 0 
                                    ? b.disziplinen.map(d => getDisziplinName(d.DISZIPLINID) || `ID ${d.DISZIPLINID}`).join(', ')
                                    : 'Keine Disziplinen zugewiesen'}
                                </p>
                              </div>
                            ) : (
                              <div className="mb-2">
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Zugewiesene Teams</p>
                                <p className={`text-sm truncate ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                  {b.teams?.length > 0 
                                    ? b.teams.map(t => getTeamName(t.TEAMID) || `ID ${t.TEAMID}`).join(', ')
                                    : 'Keine Teams zugewiesen'}
                                </p>
                              </div>
                            )}
                            
                            {isAdmin() && ( 
                              <div className="mt-3 flex items-center">
                                <button
                                  onClick={() => setShowPasswords(prev => ({...prev, [b.BETREUERID]: !prev[b.BETREUERID]}))}
                                  className={`mr-2 ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                  {showPasswords[b.BETREUERID] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                  {showPasswords[b.BETREUERID] ? (b.PASSWORT || '*****') : '*****'}
                                </p>
                              </div>
                            )}
                          </div>
                          {isAdmin() && ( 
                            <div className={`px-4 py-3 flex justify-end gap-2 ${isDarkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-gray-50'}`}>
                              {b.ROLLE === 'stationaer' ? (
                                <button
                                  onClick={() => {
                                    openAssignDisziplinenModal(b);
                                    triggerHapticFeedback('light');
                                  }}
                                  className={`p-2 rounded ${isDarkMode ? 'text-purple-400 hover:bg-purple-700/50' : 'text-purple-600 hover:bg-purple-100'}`}
                                  aria-label="Disziplinen zuweisen"
                                >
                                  <Layers className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    openAssignTeamsModal(b);
                                    triggerHapticFeedback('light');
                                  }}
                                  className={`p-2 rounded ${isDarkMode ? 'text-green-400 hover:bg-green-700/50' : 'text-green-600 hover:bg-green-100'}`}
                                  aria-label="Teams zuweisen"
                                >
                                  <Users className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  openBetreuerFormModal(true, b);
                                  triggerHapticFeedback('light');
                                }}
                                className={`p-2 rounded ${isDarkMode ? 'text-amber-400 hover:bg-amber-700/50' : 'text-amber-600 hover:bg-amber-100'}`}
                                aria-label="Betreuer bearbeiten"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  openDeleteBetreuerModal(b);
                                  triggerHapticFeedback('light');
                                }}
                                className={`p-2 rounded ${isDarkMode ? 'text-red-400 hover:bg-red-700/50' : 'text-red-600 hover:bg-red-100'}`}
                                aria-label="Betreuer löschen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className={`col-span-full text-center py-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        Keine Betreuer gefunden oder zugewiesen.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-lg shadow overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
                    <table className={`min-w-full divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                      <thead className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                        <tr>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}
                            onClick={() => toggleSort('name')}
                          >
                            <div className="flex items-center">
                              Name
                              {sortBy === 'name' && (
                                <ArrowUpDown className="ml-1 w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}
                            onClick={() => toggleSort('rolle')}
                          >
                            <div className="flex items-center">
                              Rolle
                              {sortBy === 'rolle' && (
                                <ArrowUpDown className="ml-1 w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                            Zuweisungen
                          </th>
                          <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                            Aktionen
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-gray-200'}`}>
                        {itemsToDisplay.betreuer.length > 0 ? (
                          itemsToDisplay.betreuer.map((b, index) => ( 
                            <motion.tr 
                              key={b.BETREUERID}
                              variants={itemVariants}
                              custom={index}
                              className={`${isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-gray-50/50'} transition-colors`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{b.NAME}</div>
                                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>ID: {b.BETREUERID}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDarkMode 
                                  ? (b.ROLLE === 'stationaer' ? 'bg-purple-700/30 text-purple-300' : 'bg-green-700/30 text-green-300')
                                  : (b.ROLLE === 'stationaer' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800')
                                }`}>
                                  {b.ROLLE === 'stationaer' ? <MapPin size={14} className="mr-1"/> : <Map size={14} className="mr-1"/>}
                                  {getBetreuerRolleLabel(b.ROLLE)}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                                  {b.ROLLE === 'stationaer' 
                                    ? `${b.disziplinen?.length || 0} Disziplin(en)`
                                    : `${b.teams?.length || 0} Team(s)`}
                                </div>
                                <div className={`text-xs truncate max-w-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                                  {b.ROLLE === 'stationaer' 
                                    ? (b.disziplinen?.map(d => d.NAME).join(', ') || 'Keine')
                                    : (b.teams?.map(t => t.NAME).join(', ') || 'Keine')}
                                </div>
                              </td>
                              {isAdmin() && ( 
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                  <button 
                                    onClick={() => {
                                      openBetreuerFormModal(true, b);
                                      triggerHapticFeedback('light'); // Added haptic feedback
                                    }}
                                    className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-sky-400 hover:bg-sky-700/50' : 'text-sky-600 hover:bg-sky-100'}`} 
                                    title="Bearbeiten & Zuweisen"
                                  >
                                    <Settings size={16} />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      openDeleteBetreuerModal(b);
                                      triggerHapticFeedback('light'); // Added haptic feedback
                                    }}
                                    className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-700/50' : 'text-red-600 hover:bg-red-100'}`} 
                                    title="Löschen"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              )}
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isAdmin() ? 4 : 3} className={`px-6 py-10 text-center text-sm italic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Keine Betreuer gefunden.</td> 
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'students' && (
              <motion.div 
                key="students"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
              >
                {viewMode === 'card' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {itemsToDisplay.students.length > 0 ? (
                      itemsToDisplay.students.map((student, index) => (
                        <motion.div
                          key={student.SCHUELERID}
                          variants={cardVariants}
                          custom={index}
                          whileHover="hover"
                          className={`rounded-lg shadow-md overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
                        >
                          <div className={`p-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                            <h3 className={`text-lg font-semibold truncate ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{student.VORNAME} {student.NACHNAME}</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Klasse: {student.KLASSE || 'Nicht zugewiesen'}</p>
                          </div>
                          <div className="p-4">
                            <div className="mb-2">
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Team</p>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{getTeamName(student.TEAMID)}</p>
                            </div>
                            <div className="mb-2">
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Geburtsdatum</p>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{student.GEBURTSDATUM || 'Nicht angegeben'}</p>
                            </div>
                            <div className="mb-2">
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Geschlecht</p>
                              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{student.GESCHLECHT || 'Nicht angegeben'}</p>
                            </div>
                          </div>
                          {isAdmin() && ( 
                            <div className={`px-4 py-3 flex justify-end gap-2 ${isDarkMode ? 'bg-slate-800 border-t border-slate-700' : 'bg-gray-50'}`}>
                              <button
                                onClick={() => {
                                  openEditStudentModal(student);
                                  triggerHapticFeedback('light');
                                }}
                                className={`p-2 rounded ${isDarkMode ? 'text-amber-400 hover:bg-amber-700/50' : 'text-amber-600 hover:bg-amber-100'}`}
                                aria-label="Schüler bearbeiten"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  openDeleteStudentModal(student);
                                  triggerHapticFeedback('light');
                                }}
                                className={`p-2 rounded ${isDarkMode ? 'text-red-400 hover:bg-red-700/50' : 'text-red-600 hover:bg-red-100'}`}
                                aria-label="Schüler löschen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <div className={`col-span-full text-center py-12 ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        Keine Schüler gefunden oder zugewiesen.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`rounded-lg shadow overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
                    <table className={`min-w-full divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                      <thead className={`${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                        <tr>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}
                            onClick={() => toggleSort('name')}
                          >
                            <div className="flex items-center">
                              Name
                              {sortBy === 'name' && (
                                <ArrowUpDown className="ml-1 w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}
                            onClick={() => toggleSort('klasse')}
                          >
                            <div className="flex items-center">
                              Klasse
                              {sortBy === 'klasse' && (
                                <ArrowUpDown className="ml-1 w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}
                            onClick={() => toggleSort('team')}
                          >
                            <div className="flex items-center">
                              Team
                              {sortBy === 'team' && (
                                <ArrowUpDown className="ml-1 w-4 h-4" />
                              )}
                            </div>
                          </th>
                          <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-500'}`}>
                            Aktionen
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-gray-200'}`}>
                        {itemsToDisplay.students.length > 0 ? (
                          itemsToDisplay.students.map((student, index) => (
                            <motion.tr 
                              key={student.SCHUELERID}
                              variants={itemVariants}
                              custom={index}
                              className={`${isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-gray-50/50'} transition-colors`}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{student.VORNAME} {student.NACHNAME}</div>
                                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>ID: {student.SCHUELERID}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>{student.KLASSE || 'Nicht zugewiesen'}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>{getTeamName(student.TEAMID)}</div>
                              </td>
                              {isAdmin() && ( 
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => {
                                      openEditStudentModal(student);
                                      triggerHapticFeedback('light');
                                    }}
                                    className={`mr-3 ${isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-900'}`}
                                  >
                                    <Edit className="w-4 h-4 inline" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      openDeleteStudentModal(student);
                                      triggerHapticFeedback('light');
                                    }}
                                    className={`${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}
                                  >
                                    <Trash2 className="w-4 h-4 inline" />
                                  </button>
                                </td>
                              )}
                            </motion.tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className={`px-6 py-4 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                              Keine Schüler gefunden oder zugewiesen.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Add Team Modal */}
        {showAddTeamModal && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowAddTeamModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-md ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Add Team */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>Team hinzufügen</h3>
                <button
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  onClick={() => setShowAddTeamModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Add Team Form */}
              <div className="mt-4">
                <label htmlFor="teamName" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Team Name</label>
                <input
                  id="teamName"
                  name="NAME"
                  type="text"
                  placeholder="Name des Teams"
                  value={teamFormData.NAME}
                  onChange={handleTeamFormChange}
                  className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  onClick={() => setShowAddTeamModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50
                    ${isDarkMode ? 'bg-sky-500 hover:bg-sky-400' : 'bg-sky-600 hover:bg-sky-700'}`}
                  onClick={handleAddTeam}
                >
                  Team hinzufügen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Edit Team Modal */}
        {showEditTeamModal && currentTeam && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowEditTeamModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-md ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Edit Team */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>Team bearbeiten</h3>
                <button
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  onClick={() => setShowEditTeamModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Edit Team Form */}
              <div className="mt-4">
                <label htmlFor="editTeamName" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Team Name</label>
                <input
                  id="editTeamName"
                  name="NAME" // Ensure name attribute is present for form handling if used
                  type="text"
                  placeholder="Name des Teams"
                  value={teamFormData.NAME}
                  onChange={handleTeamFormChange}
                  className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                />
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  onClick={() => setShowEditTeamModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-sky-500 hover:bg-sky-400 focus:ring-sky-500' 
                      : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-600'
                    }`}
                  onClick={handleEditTeam}
                >
                  Team aktualisieren
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Delete Team Modal */}
        {showDeleteTeamModal && currentTeam && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowDeleteTeamModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-md ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Delete Team */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>Team löschen</h3>
                <button
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  onClick={() => setShowDeleteTeamModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} text-sm mb-1`}>
                Sind Sie sicher, dass Sie das Team "<strong>{currentTeam.NAME}</strong>" löschen möchten?
              </p>
              <p className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} text-xs font-semibold`}>
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                 <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  onClick={() => setShowDeleteTeamModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-red-600 hover:bg-red-500 focus:ring-red-600' 
                      : 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                    }`}
                  onClick={handleDeleteTeam}
                >
                  Team löschen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Add/Edit Betreuer Modal (Unified) */}
        {showAddBetreuerModal && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowAddBetreuerModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Add/Edit Betreuer */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                  {currentBetreuer ? 'Betreuer bearbeiten' : 'Betreuer hinzufügen'}
                </h3>
                <button
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  onClick={() => setShowAddBetreuerModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Betreuer Form */}
              <div className="space-y-4 flex-grow overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                <div>
                  <label htmlFor="betreuerName" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Name</label>
                  <input
                    id="betreuerName"
                    name="NAME"
                    type="text"
                    placeholder="Name des Betreuers"
                    value={betreuerFormData.NAME}
                    onChange={handleBetreuerFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="betreuerPasswort" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Passwort {currentBetreuer && "(Leer lassen für keine Änderung)"}</label>
                  <input
                    id="betreuerPasswort"
                    name="PASSWORT"
                    type="password"
                    placeholder="••••••••"
                    value={betreuerFormData.PASSWORT}
                    onChange={handleBetreuerFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="betreuerRolle" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Rolle</label>
                  <select
                    id="betreuerRolle"
                    name="ROLLE"
                    value={betreuerFormData.ROLLE}
                    onChange={handleBetreuerFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50 appearance-none
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  >
                    <option value="stationaer">Stationär</option>
                    <option value="laufend">Laufend</option>
                  </select>
                </div>

                {betreuerFormData.ROLLE === 'stationaer' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Disziplinen zuweisen</label>
                    <div className={`max-h-40 overflow-y-auto space-y-1 p-2 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-slate-50/50'}`}>
                      {disziplinen.map(disziplin => (
                        <label key={disziplin.DISZIPLINID} className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${selectedDisziplinen.includes(disziplin.DISZIPLINID) ? (isDarkMode ? 'bg-sky-600 hover:bg-sky-500' : 'bg-sky-100 hover:bg-sky-200') : (isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100') }`}>
                          <input
                            type="checkbox"
                            checked={selectedDisziplinen.includes(disziplin.DISZIPLINID)}
                            onChange={(e) => handleDisziplinChange(disziplin.DISZIPLINID, e.target.checked)}
                            className="form-checkbox h-4 w-4 text-sky-600 dark:text-sky-500 bg-slate-300 dark:bg-slate-600 border-slate-400 dark:border-slate-500 rounded focus:ring-sky-500 dark:focus:ring-sky-600 focus:ring-offset-0 dark:focus:ring-offset-slate-800 transition duration-150 ease-in-out mr-2"
                          />
                          <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} text-sm`}>{disziplin.NAME}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {betreuerFormData.ROLLE === 'laufend' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Teams zuweisen</label>
                    <div className={`max-h-40 overflow-y-auto space-y-1 p-2 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700/30' : 'border-slate-200 bg-slate-50/50'}`}>
                      {teams.map(team => (
                        <label key={team.TEAMID} className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${selectedTeams.includes(team.TEAMID) ? (isDarkMode ? 'bg-sky-600 hover:bg-sky-500' : 'bg-sky-100 hover:bg-sky-200') : (isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-100') }`}>
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(team.TEAMID)}
                            onChange={(e) => handleTeamChange(team.TEAMID, e.target.checked)}
                            className="form-checkbox h-4 w-4 text-sky-600 dark:text-sky-500 bg-slate-300 dark:bg-slate-600 border-slate-400 dark:border-slate-500 rounded focus:ring-sky-500 dark:focus:ring-sky-600 focus:ring-offset-0 dark:focus:ring-offset-slate-800 transition duration-150 ease-in-out mr-2"
                          />
                          <span className={`${isDarkMode ? 'text-slate-200' : 'text-slate-700'} text-sm`}>{team.NAME}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-end space-x-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  onClick={() => setShowAddBetreuerModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-sky-500 hover:bg-sky-400 focus:ring-sky-500' 
                      : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-600'
                    }`}
                  onClick={currentBetreuer ? handleEditBetreuer : handleAddBetreuer} // Updated logic for unified modal
                >
                  {currentBetreuer ? 'Betreuer aktualisieren' : 'Betreuer hinzufügen'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Delete Betreuer Modal */}
        {showDeleteBetreuerModal && currentBetreuer && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowDeleteBetreuerModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-md ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Delete Betreuer */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>Betreuer löschen</h3>
                <button
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  onClick={() => setShowDeleteBetreuerModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} text-sm mb-1`}>
                Sind Sie sicher, dass Sie den Betreuer "<strong>{currentBetreuer.NAME}</strong>" löschen möchten?
              </p>
              <p className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} text-xs font-semibold`}>
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  onClick={() => setShowDeleteBetreuerModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-red-600 hover:bg-red-500 focus:ring-red-600' 
                      : 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                    }`}
                  onClick={handleDeleteBetreuer}
                >
                  Betreuer löschen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Add Student Modal */}
        {showAddStudentModal && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowAddStudentModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Add Student */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>Schüler hinzufügen</h3>
                <button
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  onClick={() => setShowAddStudentModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Student Form */}
              <div className="space-y-3 flex-grow overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                <div>
                  <label htmlFor="studentVorname" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Vorname</label>
                  <input
                    id="studentVorname"
                    name="VORNAME"
                    type="text"
                    placeholder="Vorname des Schülers"
                    value={studentFormData.VORNAME}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="studentNachname" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Nachname</label>
                  <input
                    id="studentNachname"
                    name="NACHNAME"
                    type="text"
                    placeholder="Nachname des Schülers"
                    value={studentFormData.NACHNAME}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="studentGeburtsdatum" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Geburtsdatum</label>
                  <input
                    id="studentGeburtsdatum"
                    name="GEBURTSDATUM"
                    type="date" // Changed to type date for better UX
                    placeholder="TT.MM.JJJJ"
                    value={studentFormData.GEBURTSDATUM}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50 appearance-none
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="studentGeschlecht" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Geschlecht</label>
                  <select
                    id="studentGeschlecht"
                    name="GESCHLECHT"
                    value={studentFormData.GESCHLECHT}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50 appearance-none
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  >
                    <option value="männlich">Männlich</option>
                    <option value="weiblich">Weiblich</option>
                    <option value="divers">Divers</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="studentKlasse" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Klasse</label>
                  <input
                    id="studentKlasse"
                    name="KLASSE"
                    type="text"
                    placeholder="Klasse des Schülers"
                    value={studentFormData.KLASSE}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-end space-x-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  onClick={() => setShowAddStudentModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-sky-500 hover:bg-sky-400 focus:ring-sky-500' 
                      : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-600'
                    }`}
                  onClick={handleAddStudent}
                >
                  Schüler hinzufügen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Edit Student Modal */}
        {showEditStudentModal && currentStudent && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowEditStudentModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Edit Student */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>Schüler bearbeiten</h3>
                <button
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  onClick={() => setShowEditStudentModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Student Form */}
              <div className="space-y-3 flex-grow overflow-y-auto pr-2 -mr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                <div>
                  <label htmlFor="editStudentVorname" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Vorname</label>
                  <input
                    id="editStudentVorname"
                    name="VORNAME"
                    type="text"
                    placeholder="Vorname des Schülers"
                    value={studentFormData.VORNAME}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="editStudentNachname" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Nachname</label>
                  <input
                    id="editStudentNachname"
                    name="NACHNAME"
                    type="text"
                    placeholder="Nachname des Schülers"
                    value={studentFormData.NACHNAME}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="editStudentGeburtsdatum" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Geburtsdatum</label>
                  <input
                    id="editStudentGeburtsdatum"
                    name="GEBURTSDATUM"
                    type="date" // Changed to type date
                    placeholder="TT.MM.JJJJ"
                    value={studentFormData.GEBURTSDATUM}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50 appearance-none
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="editStudentGeschlecht" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Geschlecht</label>
                  <select
                    id="editStudentGeschlecht"
                    name="GESCHLECHT"
                    value={studentFormData.GESCHLECHT}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50 appearance-none
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  >
                    <option value="männlich">Männlich</option>
                    <option value="weiblich">Weiblich</option>
                    <option value="divers">Divers</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="editStudentKlasse" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Klasse</label>
                  <input
                    id="editStudentKlasse"
                    name="KLASSE"
                    type="text"
                    placeholder="Klasse des Schülers"
                    value={studentFormData.KLASSE}
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  />
                </div>
                 <div>
                  <label htmlFor="editStudentTeam" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Team</label>
                  <select
                    id="editStudentTeam"
                    name="TEAMID"
                    value={studentFormData.TEAMID || ''} // Handle null or undefined TEAMID
                    onChange={handleStudentFormChange}
                    className={`w-full p-2.5 border rounded-lg transition-colors duration-150 focus:ring-2 focus:ring-opacity-50 appearance-none
                    ${isDarkMode 
                      ? 'bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-sky-500 focus:border-sky-500' 
                      : 'bg-slate-50 border-slate-300 placeholder-slate-400 text-slate-900 focus:ring-sky-500 focus:border-sky-500'
                    }`}
                  >
                    <option value="">Kein Team</option>
                    {teams.map(team => (
                      <option key={team.TEAMID} value={team.TEAMID}>{team.NAME}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t flex justify-end space-x-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  onClick={() => setShowEditStudentModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-sky-500 hover:bg-sky-400 focus:ring-sky-500' 
                      : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-600'
                    }`}
                  onClick={handleEditStudent}
                >
                  Schüler aktualisieren
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Delete Student Modal */}
        {showDeleteStudentModal && currentStudent && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowDeleteStudentModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-md ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Delete Student */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-red-500' : 'text-red-600'}`}>Schüler löschen</h3>
                <button
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                  onClick={() => setShowDeleteStudentModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} text-sm mb-1`}>
                Sind Sie sicher, dass Sie "<strong>{currentStudent.VORNAME} {currentStudent.NACHNAME}</strong>" löschen möchten?
              </p>
              <p className={`${isDarkMode ? 'text-red-400' : 'text-red-500'} text-xs font-semibold`}>
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  onClick={() => setShowDeleteStudentModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50
                    ${isDarkMode 
                      ? 'bg-red-600 hover:bg-red-500 focus:ring-red-600' 
                      : 'bg-red-500 hover:bg-red-600 focus:ring-red-500' 
                    }`}
                  onClick={handleDeleteStudent}
                >
                  Schüler löschen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Assign Students to Team Modal */}
        {showAssignStudentsModal && currentTeam && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/70' : 'bg-black/50'}`}
            onClick={() => setShowAssignStudentsModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal content for Assign Students */}
              <div className={`flex justify-between items-center pb-3 mb-4 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className="text-xl font-semibold">Schüler zuweisen zu Team: {currentTeam.NAME}</h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setShowAssignStudentsModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Student Search and Filter */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Suche nach Schüler..."
                  value={studentSearchQueryInModal}
                  onChange={(e) => setStudentSearchQueryInModal(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-white text-slate-900'}`}
                />
              </div>
              <div className="mt-4">
                <select
                  value={selectedClassFilterInModal}
                  onChange={(e) => setSelectedClassFilterInModal(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-100' : 'bg-white text-slate-900'}`}
                >
                  <option value="">Alle Klassen</option>
                  {uniqueClasses.map(klass => (
                    <option key={klass} value={klass}>{klass}</option>
                  ))}
                </select>
              </div>
              {/* Student List */}
              <div className="mt-4">
                {filteredStudentsForModal.length > 0 ? (
                  filteredStudentsForModal.map(student => (
                    <div key={student.SCHUELERID} className="flex items-center justify-between py-2">
                      <span>{student.VORNAME} {student.NACHNAME}</span>
                      <button
                        onClick={() => {
                          setCurrentStudent(student);
                          setShowEditStudentModal(true);
                        }}
                        className={`px-2 py-1 rounded ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                      >
                        Bearbeiten
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Keine Schüler gefunden.</p>
                )}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => {
                    setSelectedStudents(filteredStudentsForModal.map(student => student.SCHUELERID));
                    handleAssignStudents();
                    setShowAssignStudentsModal(false);
                  }}
                >
                  Schüler zuweisen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* Excel Import Modal */}
        {showExcelImportModal && (
          <motion.div
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/50'}`}
            onClick={() => setShowExcelImportModal(false)}
          >
            <motion.div
              variants={modalVariants}
              className={`p-6 rounded-xl shadow-2xl w-full max-w-lg ${isDarkMode ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-900'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex justify-between items-center pb-3 mb-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                <h3 className={`text-2xl font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>Teilnehmer importieren</h3>
                <button 
                  onClick={() => setShowExcelImportModal(false)} 
                  className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} transition-colors`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center w-full">
                  <label 
                    htmlFor="dropzone-file" 
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 rounded-lg cursor-pointer transition-all
                      ${isDarkMode 
                        ? 'border-slate-600 bg-slate-700 hover:bg-slate-600/70' 
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                      } ${isDragActive ? (isDarkMode ? 'border-sky-500' : 'border-sky-400') : (isDarkMode ? 'border-dashed' : 'border-dashed')}`}
                  >
                    <div {...getRootProps({className: 'dropzone w-full h-full flex flex-col items-center justify-center p-5 text-center'})}>
                      <input {...getInputProps()} />
                      <CloudUpload className={`w-12 h-12 mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                      {isDragActive ?
                        <p className={`text-lg font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`}>Datei hier ablegen...</p> :
                        <>
                          <p className={`mb-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}><span className={`font-semibold ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`}>Klicken zum Hochladen</span> oder Datei hierher ziehen</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>XLSX oder CSV (MAX. 5MB)</p>
                        </>
                      }
                    </div>
                  </label>
                  {importFile && (
                    <div className={`mt-4 text-sm p-3 rounded-lg w-full flex items-center justify-between
                                    ${importError ? (isDarkMode ? 'bg-red-900/30 text-red-300 border border-red-700' : 'bg-red-100 text-red-700 border border-red-300') 
                                                  : (isDarkMode ? 'bg-green-900/30 text-green-300 border border-green-700' : 'bg-green-100 text-green-700 border border-green-300')}`}>
                      <div className="flex items-center">
                        {importError ? <AlertTriangle className="w-5 h-5 mr-2" /> : <FileCheck className="w-5 h-5 mr-2" />}
                        <span>{importFile.name}</span>
                      </div>
                      <button onClick={() => setImportFile(null)} className={`${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} ml-2`}>
                        <X className="w-4 h-4"/>
                      </button>
                    </div>
                  )}
                </div>

                {importError && (
                  <div className={`text-sm p-3 rounded-lg ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                    <p className="font-semibold mb-1">Fehler beim Import:</p>
                    <p>{importError}</p>
                  </div>
                )}
                
                {importSuccessMessage && (
                   <div className={`text-sm p-3 rounded-lg ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'}`}>
                     {importSuccessMessage}
                   </div>
                )}

                <div className="mt-8 pt-6 border-t flex justify-end space-x-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}">
                  <button
                    type="button"
                    onClick={() => setShowExcelImportModal(false)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isDarkMode 
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700 border border-slate-300'
                      }`}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    onClick={handleExcelImport}
                    disabled={!importFile || isLoadingImport}
                    className={`px-6 py-2.5 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center
                      ${isDarkMode 
                        ? 'bg-sky-500 hover:bg-sky-400 focus:ring-sky-500 disabled:bg-sky-700/50 disabled:text-sky-400/70' 
                        : 'bg-sky-600 hover:bg-sky-700 focus:ring-sky-600 disabled:bg-sky-400/50 disabled:text-sky-200/70'
                      } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                  >
                    {isLoadingImport ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        Importiere...
                      </>
                    ) : (
                      'Importieren'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeilnehmerPage;