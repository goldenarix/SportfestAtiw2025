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
  Settings // Added for edit/assign button
} from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';
import { useMediaQuery } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

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

  return (
    <motion.div 
      className="p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 dark:from-slate-900 dark:to-sky-950"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Teilnehmer</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {isAdmin() ? "Verwalten Sie Teams, Betreuer und Schüler." : "Übersicht der Teilnehmer."} {/* MODIFIED: isAdmin -> isAdmin() */}
        </p>
        {!isAdmin() && currentBetreuerDataForPage && ( // MODIFIED: isAdmin -> isAdmin()
          <div className="mt-2 text-sm text-sky-700 dark:text-sky-300">
            <UserCog size={16} className="inline mr-1.5 align-text-bottom"/>
             Angemeldet als {currentBetreuerDataForPage.NAME} ({getBetreuerRolleLabel(currentBetreuerDataForPage.ROLLE)})
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'teams' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => {
            setActiveTab('teams');
            triggerHapticFeedback('selection');
          }}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Teams
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'betreuer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => {
            setActiveTab('betreuer');
            triggerHapticFeedback('selection');
          }}
        >
          <UserCog className="w-4 h-4 inline mr-2" />
          Betreuer
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Suche nach ${activeTab === 'teams' ? 'Teams' : activeTab === 'betreuer' ? 'Betreuern' : 'Schülern'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'card' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('card')}
              aria-label="Card-Ansicht"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              className={`p-2 ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('table')}
              aria-label="Tabellen-Ansicht"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          
          {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin()
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              onClick={() => {
                if (activeTab === 'teams') {
                  resetTeamForm();
                  setShowAddTeamModal(true);
                } else if (activeTab === 'betreuer') {
                  // resetBetreuerForm(); // Wird jetzt im BetreuerFormModal gehandhabt
                  openBetreuerFormModal(b); // Öffnet das neue Modal im "Hinzufügen"-Modus
                  // setShowAddBetreuerModal(true); // Veraltet
                } else if (activeTab === 'students') {
                  resetStudentForm();
                  setShowAddStudentModal(true);
                }
                triggerHapticFeedback('success');
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              {activeTab === 'teams' ? 'Team hinzufügen' : activeTab === 'betreuer' ? 'Betreuer hinzufügen' : 'Schüler hinzufügen'}
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
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="p-4 border-b">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{team.NAME}</h3>
                          <p className="text-sm text-gray-600">ID: {team.TEAMID}</p>
                        </div>
                        <div className="p-4">
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700">Schüler</p>
                            <p className="text-sm text-gray-600">
                              {students.filter(s => s.TEAMID === team.TEAMID).length || 0} Mitglieder
                            </p>
                          </div>
                        </div>
                        {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin()
                          <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700/50 flex justify-end gap-2">
                            <button
                              onClick={() => {
                                openAssignStudentsModal(team);
                                triggerHapticFeedback('light');
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-700/50 rounded-md transition-colors"
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
                              className="p-2 text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-700/50 rounded-md transition-colors"
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
                              className="p-2 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-md transition-colors"
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
                    <div className="col-span-full text-center py-12 text-gray-500">
                      Keine Teams gefunden oder zugewiesen.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('name')}
                        >
                          <div className="flex items-center">
                            Team Name
                            {sortBy === 'name' && (
                              <ArrowUpDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anzahl Schüler
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aktionen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {itemsToDisplay.teams.length > 0 ? (
                        itemsToDisplay.teams.map((team, index) => (
                          <motion.tr 
                            key={team.TEAMID}
                            variants={itemVariants}
                            custom={index}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{team.NAME}</div>
                              <div className="text-sm text-gray-500">ID: {team.TEAMID}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {students.filter(s => s.TEAMID === team.TEAMID).length || 0} Mitglieder
                              </div>
                            </td>
                            {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin() Aktionen nur für Admins
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => {
                                    openAssignStudentsModal(team);
                                    triggerHapticFeedback('light');
                                  }}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  <UserPlus className="w-4 h-4 inline" />
                                </button>
                                <button
                                  onClick={() => {
                                    openEditTeamModal(team);
                                    triggerHapticFeedback('light');
                                  }}
                                  className="text-amber-600 hover:text-amber-900 mr-3"
                                >
                                  <Edit className="w-4 h-4 inline" />
                                </button>
                                <button
                                  onClick={() => {
                                    openDeleteTeamModal(team);
                                    triggerHapticFeedback('light');
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4 inline" />
                                </button>
                              </td>
                            )}
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
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
                    itemsToDisplay.betreuer.map((b, index) => ( // Renamed for clarity
                      <motion.div
                        key={b.BETREUERID}
                        variants={cardVariants}
                        custom={index}
                        whileHover="hover"
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="p-4 border-b">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{b.NAME}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              b.ROLLE === 'stationaer' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
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
                              <p className="text-sm font-medium text-gray-700">Zugewiesene Disziplinen</p>
                              <p className="text-sm text-gray-600 truncate">
                                {b.disziplinen?.length > 0 
                                  ? b.disziplinen.map(d => getDisziplinName(d.DISZIPLINID) || `ID ${d.DISZIPLINID}`).join(', ')
                                  : 'Keine Disziplinen zugewiesen'}
                              </p>
                            </div>
                          ) : (
                            <div className="mb-2">
                              <p className="text-sm font-medium text-gray-700">Zugewiesene Teams</p>
                              <p className="text-sm text-gray-600 truncate">
                                {b.teams?.length > 0 
                                  ? b.teams.map(t => getTeamName(t.TEAMID) || `ID ${t.TEAMID}`).join(', ')
                                  : 'Keine Teams zugewiesen'}
                              </p>
                            </div>
                          )}
                          
                          {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin() Passwort nur für Admin sichtbar
                            <div className="mt-3 flex items-center">
                              <button
                                onClick={() => setShowPasswords(prev => ({...prev, [b.BETREUERID]: !prev[b.BETREUERID]}))}
                                className="text-gray-600 hover:text-gray-900 mr-2"
                              >
                                {showPasswords[b.BETREUERID] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <p className="text-sm text-gray-700">
                                {showPasswords[b.BETREUERID] ? (b.PASSWORT || '*****') : '*****'}
                              </p>
                            </div>
                          )}
                        </div>
                        {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin() Aktionen nur für Admins
                          <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
                            {b.ROLLE === 'stationaer' ? (
                              <button
                                onClick={() => {
                                  openAssignDisziplinenModal(b);
                                  triggerHapticFeedback('light');
                                }}
                                className="p-2 text-purple-600 hover:bg-purple-100 rounded"
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
                                className="p-2 text-green-600 hover:bg-green-100 rounded"
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
                              className="p-2 text-amber-600 hover:bg-amber-100 rounded"
                              aria-label="Betreuer bearbeiten"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                openDeleteBetreuerModal(b);
                                triggerHapticFeedback('light');
                              }}
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
                              aria-label="Betreuer löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      Keine Betreuer gefunden oder zugewiesen.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('rolle')}
                        >
                          <div className="flex items-center">
                            Rolle
                            {sortBy === 'rolle' && (
                              <ArrowUpDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Zuweisungen
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aktionen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {itemsToDisplay.betreuer.length > 0 ? (
                        itemsToDisplay.betreuer.map((b, index) => ( // Renamed for clarity
                          <motion.tr 
                            key={b.BETREUERID}
                            variants={itemVariants}
                            custom={index}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{b.NAME}</div>
                              <div className="text-sm text-gray-500">ID: {b.BETREUERID}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                b.ROLLE === 'stationaer' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                {b.ROLLE === 'stationaer' ? <MapPin size={14} className="mr-1"/> : <Map size={14} className="mr-1"/>}
                                {getBetreuerRolleLabel(b.ROLLE)}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {b.ROLLE === 'stationaer' 
                                  ? `${b.disziplinen?.length || 0} Disziplin(en)`
                                  : `${b.teams?.length || 0} Team(s)`}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-slate-400 truncate max-w-xs">
                                {b.ROLLE === 'stationaer' 
                                  ? (b.disziplinen?.map(d => d.NAME).join(', ') || 'Keine')
                                  : (b.teams?.map(t => t.NAME).join(', ') || 'Keine')}
                              </div>
                            </td>
                            {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin()
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button onClick={() => openBetreuerFormModal(true, b)} className="p-1.5 text-sky-600 hover:bg-sky-100 dark:text-sky-400 dark:hover:bg-sky-700/50 rounded-md transition-colors" title="Bearbeiten & Zuweisen">
                                  <Settings size={16} />
                                </button>
                                <button onClick={() => openDeleteBetreuerModal(b)} className="p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700/50 rounded-md transition-colors" title="Löschen">
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            )}
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={isAdmin() ? 4 : 3} className="px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400 italic">Keine Betreuer gefunden.</td> {/* MODIFIED: isAdmin -> isAdmin() */}
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
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <div className="p-4 border-b">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{student.VORNAME} {student.NACHNAME}</h3>
                          <p className="text-sm text-gray-600">Klasse: {student.KLASSE || 'Nicht zugewiesen'}</p>
                        </div>
                        <div className="p-4">
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700">Team</p>
                            <p className="text-sm text-gray-600">{getTeamName(student.TEAMID)}</p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700">Geburtsdatum</p>
                            <p className="text-sm text-gray-600">{student.GEBURTSDATUM || 'Nicht angegeben'}</p>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-700">Geschlecht</p>
                            <p className="text-sm text-gray-600">{student.GESCHLECHT || 'Nicht angegeben'}</p>
                          </div>
                        </div>
                        {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin()
                          <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
                            <button
                              onClick={() => {
                                openEditStudentModal(student);
                                triggerHapticFeedback('light');
                              }}
                              className="p-2 text-amber-600 hover:bg-amber-100 rounded"
                              aria-label="Schüler bearbeiten"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                openDeleteStudentModal(student);
                                triggerHapticFeedback('light');
                              }}
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
                              aria-label="Schüler löschen"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                      Keine Schüler gefunden oder zugewiesen.
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
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
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => toggleSort('team')}
                        >
                          <div className="flex items-center">
                            Team
                            {sortBy === 'team' && (
                              <ArrowUpDown className="ml-1 w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aktionen
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {itemsToDisplay.students.length > 0 ? (
                        itemsToDisplay.students.map((student, index) => (
                          <motion.tr 
                            key={student.SCHUELERID}
                            variants={itemVariants}
                            custom={index}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{student.VORNAME} {student.NACHNAME}</div>
                              <div className="text-sm text-gray-500">ID: {student.SCHUELERID}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{student.KLASSE || 'Nicht zugewiesen'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{getTeamName(student.TEAMID)}</div>
                            </td>
                            {isAdmin() && ( // MODIFIED: isAdmin -> isAdmin() Aktionen nur für Admins
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => {
                                    openEditStudentModal(student);
                                    triggerHapticFeedback('light');
                                  }}
                                  className="text-amber-600 hover:text-amber-900 mr-3"
                                >
                                  <Edit className="w-4 h-4 inline" />
                                </button>
                                <button
                                  onClick={() => {
                                    openDeleteStudentModal(student);
                                    triggerHapticFeedback('light');
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4 inline" />
                                </button>
                              </td>
                            )}
                          </motion.tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
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
      
      {/* Notification */}
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
      
      {/* Modals */}
      {/* Add Team Modal */}
      <AnimatePresence>
        {showAddTeamModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowAddTeamModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Team hinzufügen</h3>
                  <button
                    onClick={() => setShowAddTeamModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input
                      type="text"
                      name="NAME"
                      value={teamFormData.NAME}
                      onChange={handleTeamFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                    onClick={() => setShowAddTeamModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-md"
                    onClick={() => {
                      handleAddTeam();
                      triggerHapticFeedback('success');
                    }}
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Speichern
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Edit Team Modal */}
      <AnimatePresence>
        {showEditTeamModal && currentTeam && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowEditTeamModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Team bearbeiten</h3>
                  <button
                    onClick={() => setShowEditTeamModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input
                      type="text"
                      name="NAME"
                      value={teamFormData.NAME}
                      onChange={handleTeamFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                    onClick={() => setShowEditTeamModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
                    onClick={() => {
                      handleEditTeam();
                      triggerHapticFeedback('success');
                    }}
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Speichern
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Delete Team Modal */}
      <AnimatePresence>
        {showDeleteTeamModal && currentTeam && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowDeleteTeamModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Team löschen</h3>
                  <button
                    onClick={() => setShowDeleteTeamModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 mb-4">
                    Sind Sie sicher, dass Sie das Team "{currentTeam.NAME}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-500 mr-2" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Durch das Löschen werden auch alle Zuordnungen von Schülern und Betreuern zu diesem Team aufgehoben.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                    onClick={() => setShowDeleteTeamModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    onClick={() => {
                      handleDeleteTeam();
                      triggerHapticFeedback('error');
                    }}
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Löschen
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Add Betreuer Modal */}
      <AnimatePresence>
        {showAddBetreuerModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowAddBetreuerModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Betreuer hinzufügen</h3>
                  <button
                    onClick={() => setShowAddBetreuerModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="NAME"
                      value={betreuerFormData.NAME}
                      onChange={handleBetreuerFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
                    <input
                      type="password"
                      name="PASSWORT"
                      value={betreuerFormData.PASSWORT}
                      onChange={handleBetreuerFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rolle</label>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="radio"
                          name="ROLLE"
                          value="stationaer"
                          checked={betreuerFormData.ROLLE === 'stationaer'}
                          onChange={handleBetreuerFormChange}
                          className="form-radio h-4 w-4 text-sky-600"
                        />
                        <span className="ml-2 text-gray-700 dark:text-slate-300">Stationär</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="ROLLE"
                          value="laufend"
                          checked={betreuerFormData.ROLLE === 'laufend'}
                          onChange={handleBetreuerFormChange}
                          className="form-radio h-4 w-4 text-sky-600"
                        />
                        <span className="ml-2 text-gray-700 dark:text-slate-300">Laufend</span>
                      </label>
                    </div>
                  </div>
                  
                  {betreuerFormData.ROLLE === 'stationaer' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Disziplinen zuweisen</label>
                      <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700">
                        {disziplinen.map(disziplin => (
                          <label key={disziplin.DISZIPLINID} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-600/50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedDisziplinen.includes(disziplin.DISZIPLINID)}
                              onChange={(e) => handleDisziplinChange(disziplin.DISZIPLINID, e.target.checked)}
                              className="form-checkbox h-4 w-4 text-sky-600"
                            />
                            <span className="ml-2 text-gray-700 dark:text-slate-300">{disziplin.NAME}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {betreuerFormData.ROLLE === 'laufend' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teams zuweisen</label>
                      <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700">
                        {teams.map(team => (
                          <label key={team.TEAMID} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-600/50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedTeams.includes(team.TEAMID)}
                              onChange={(e) => handleTeamChange(team.TEAMID, e.target.checked)}
                              className="form-checkbox h-4 w-4 text-sky-600"
                            />
                            <span className="ml-2 text-gray-700 dark:text-slate-300">{team.NAME}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                    onClick={() => setShowAddBetreuerModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-md"
                    onClick={() => {
                      // Check if we are editing or adding
                      if (currentBetreuer && currentBetreuer.BETREUERID) { // Check if currentBetreuer and its ID exist
                        handleEditBetreuer(); // Call the edit handler
                      } else {
                        handleAddBetreuer(); // Call the add handler
                      }
                      triggerHapticFeedback('success');
                    }}
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Speichern
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Remaining modals for edit/delete betreuer, assign disziplinen/teams, and student modals would follow the same pattern */}
          {/* Assign Disziplinen Modal - ADDED */}
    <AnimatePresence>
      {showAssignDisziplinenModal && currentBetreuer && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={backdropVariants}
            onClick={() => setShowAssignDisziplinenModal(false)}
          ></motion.div>
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Disziplinen zuweisen</h3>
                <button
                  onClick={() => setShowAssignDisziplinenModal(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-4">
                  Wählen Sie die Disziplinen für den Betreuer "{currentBetreuer.NAME}" aus.
                </p>
                <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700">
                  {disziplinen.map(disziplin => (
                    <label key={disziplin.DISZIPLINID} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-600/50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedDisziplinen.includes(disziplin.DISZIPLINID)}
                        onChange={(e) => handleDisziplinChange(disziplin.DISZIPLINID, e.target.checked)}
                        className="form-checkbox h-4 w-4 text-purple-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-slate-300">{disziplin.NAME}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                  onClick={() => setShowAssignDisziplinenModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                  onClick={() => {
                    handleAssignDisziplinen();
                    triggerHapticFeedback('success');
                  }}
                >
                  <Save className="w-4 h-4 inline mr-1" />
                  Speichern
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Assign Teams Modal - ADDED */}
    <AnimatePresence>
      {showAssignTeamsModal && currentBetreuer && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={backdropVariants}
            onClick={() => setShowAssignTeamsModal(false)}
          ></motion.div>
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalVariants}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Teams zuweisen</h3>
                <button
                  onClick={() => setShowAssignTeamsModal(false)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-4">
                  Wählen Sie die Teams für den Betreuer "{currentBetreuer.NAME}" aus.
                </p>
                <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-700">
                  {teams.map(team => (
                    <label key={team.TEAMID} className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-slate-600/50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team.TEAMID)}
                        onChange={(e) => handleTeamChange(team.TEAMID, e.target.checked)}
                        className="form-checkbox h-4 w-4 text-green-600"
                      />
                      <span className="ml-2 text-gray-700 dark:text-slate-300">{team.NAME}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                  onClick={() => setShowAssignTeamsModal(false)}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  onClick={() => {
                    handleAssignTeams();
                    triggerHapticFeedback('success');
                  }}
                >
                  <Save className="w-4 h-4 inline mr-1" />
                  Speichern
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
      {/* Assign Students Modal */}
      <AnimatePresence>
        {showAssignStudentsModal && currentTeam && (
          <>
            {console.log('AssignStudentsModal gerendert. currentTeam:', currentTeam, 'Alle Schüler (students state):', students, 'SelectedStudents State:', selectedStudents)}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowAssignStudentsModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full flex flex-col" style={{maxHeight: '90vh'}}>
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4 sticky top-0 bg-white dark:bg-slate-800 z-10">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Schüler zuweisen</h3>
                  <button
                    onClick={() => setShowAssignStudentsModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 md:p-5 flex-grow overflow-y-auto">
                  <div className="mb-4 p-3 bg-sky-50 dark:bg-sky-900/30 rounded-lg border border-sky-200 dark:border-sky-700">
                    <label className="block text-xs font-medium text-sky-600 dark:text-sky-400 mb-0.5">Team</label>
                    <p className="text-lg font-semibold text-sky-800 dark:text-sky-200">{currentTeam.NAME}</p>
                  </div>

                  {/* Filters for students */}
                  <div className="mb-4 p-3 border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="studentSearchInModal" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Schüler suchen</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="text"
                            id="studentSearchInModal"
                            placeholder="Name suchen..."
                            value={studentSearchQueryInModal}
                            onChange={(e) => setStudentSearchQueryInModal(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="classFilterInModal" className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Klasse filtern</label>
                        <select
                          id="classFilterInModal"
                          value={selectedClassFilterInModal}
                          onChange={(e) => setSelectedClassFilterInModal(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        >
                          <option value="">Alle Klassen</option>
                          {uniqueClasses.map(klasse => (
                            <option key={klasse} value={klasse}>{klasse}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Schüler auswählen</label>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Es werden Schüler ohne Team oder Schüler, die bereits diesem Team zugewiesen sind, angezeigt.
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 divide-y divide-gray-200 dark:divide-slate-600">
                    {filteredStudentsForModal.length > 0 ? (
                      filteredStudentsForModal.map(student => (
                        <label 
                          key={student.SCHUELERID} 
                          className="flex items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-600/50 rounded-sm transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.SCHUELERID)}
                            onChange={(e) => handleStudentChange(student.SCHUELERID, e.target.checked)}
                            className="form-checkbox h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-slate-500 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700 dark:text-slate-300">
                            {student.VORNAME} {student.NACHNAME} ({student.KLASSE || 'N/A'})
                            {student.TEAMID && student.TEAMID !== currentTeam?.TEAMID && (
                              <span className="ml-2 text-xs text-orange-500">(Team: {getTeamName(student.TEAMID)})</span>
                            )}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-center text-gray-500 dark:text-slate-400 py-4">
                        Keine Schüler entsprechen den Filtern oder keine Schüler vorhanden.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-4 border-t dark:border-slate-700 sticky bottom-0 z-10 rounded-b-lg">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">{selectedStudents.length}</strong> Schüler ausgewählt
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 dark:bg-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                      onClick={() => setShowAssignStudentsModal(false)}
                    >
                      Abbrechen
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-sm flex items-center gap-1.5"
                      onClick={() => {
                        handleAssignStudents();
                        triggerHapticFeedback('success');
                      }}
                    >
                      <Save className="w-4 h-4" />
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Delete Betreuer Modal - ADDED */}
      <AnimatePresence>
        {showDeleteBetreuerModal && currentBetreuer && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowDeleteBetreuerModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Betreuer löschen</h3>
                  <button
                    onClick={() => setShowDeleteBetreuerModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 mb-4">
                    Sind Sie sicher, dass Sie den Betreuer "{currentBetreuer.NAME}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-500 mr-2" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Durch das Löschen werden auch alle Zuordnungen dieses Betreuers aufgehoben.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                    onClick={() => setShowDeleteBetreuerModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    onClick={() => {
                      handleDeleteBetreuer();
                      triggerHapticFeedback('error');
                    }}
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Löschen
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Student Modal - ADDED */}
      <AnimatePresence>
        {showAddStudentModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowAddStudentModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Schüler hinzufügen</h3>
                  <button
                    onClick={() => setShowAddStudentModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  {/* Add Student Form fields */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Vorname</label>
                    <input
                      type="text"
                      name="VORNAME"
                      value={studentFormData.VORNAME}
                      onChange={handleStudentFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nachname</label>
                    <input
                      type="text"
                      name="NACHNAME"
                      value={studentFormData.NACHNAME}
                      onChange={handleStudentFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Geburtsdatum</label>
                    <input
                      type="date"
                      name="GEBURTSDATUM"
                      value={studentFormData.GEBURTSDATUM}
                      onChange={handleStudentFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Geschlecht</label>
                    <select
                      name="GESCHLECHT"
                      value={studentFormData.GESCHLECHT}
                      onChange={handleStudentFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="männlich">Männlich</option>
                      <option value="weiblich">Weiblich</option>
                      <option value="divers">Divers</option>
                    </select>
                  </div>
                  {/* TEAMID is assigned via Assign Students Modal, not Add/Edit */}
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                    onClick={() => setShowAddStudentModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-md"
                    onClick={() => {
                      handleAddStudent();
                      triggerHapticFeedback('success');
                    }}
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Speichern
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Student Modal - ADDED */}
      <AnimatePresence>
        {showEditStudentModal && currentStudent && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowEditStudentModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Schüler bearbeiten</h3>
                  <button
                    onClick={() => setShowEditStudentModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                   {/* Edit Student Form fields */}
                   <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Vorname</label>
                    <input
                      type="text"
                      name="VORNAME"
                      value={studentFormData.VORNAME}
                      onChange={handleStudentFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Nachname</label>
                    <input
                      type="text"
                      name="NACHNAME"
                      value={studentFormData.NACHNAME}
                      onChange={handleStudentFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Geburtsdatum</label>
                    <input
                      type="date"
                      name="GEBURTSDATUM"
                      value={studentFormData.GEBURTSDATUM}
                      onChange={handleStudentFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Geschlecht</label>
                    <select
                      name="GESCHLECHT"
                      value={studentFormData.GESCHLECHT}
                      onChange={handleStudentFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="männlich">Männlich</option>
                      <option value="weiblich">Weiblich</option>
                      <option value="divers">Divers</option>
                    </select>
                  </div>
                   {/* TEAMID is assigned via Assign Students Modal, not Add/Edit */}
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                    onClick={() => setShowEditStudentModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
                    onClick={() => {
                      handleEditStudent();
                      triggerHapticFeedback('success');
                    }}
                  >
                    <Save className="w-4 h-4 inline mr-1" />
                    Speichern
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Student Modal - ADDED */}
      <AnimatePresence>
        {showDeleteStudentModal && currentStudent && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={backdropVariants}
              onClick={() => setShowDeleteStudentModal(false)}
            ></motion.div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={modalVariants}
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center border-b dark:border-slate-700 p-4">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Schüler löschen</h3>
                  <button
                    onClick={() => setShowDeleteStudentModal(false)}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 mb-4">
                    Sind Sie sicher, dass Sie den Schüler "{currentStudent.VORNAME} {currentStudent.NACHNAME}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-500 mr-2" />
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Durch das Löschen wird auch die Zuordnung zu einem Team aufgehoben.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end bg-gray-50 dark:bg-slate-700/50 p-4 rounded-b-lg">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg mr-2 hover:bg-gray-300 transition-colors dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500"
                    onClick={() => setShowDeleteStudentModal(false)}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                    onClick={() => {
                      handleDeleteStudent();
                      triggerHapticFeedback('error');
                    }}
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" />
                    Löschen
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TeilnehmerPage;