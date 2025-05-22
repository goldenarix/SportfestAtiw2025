import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeProvider'; // Import useTheme
import { useDataContext } from '../../backend/DataLoader';
import { Clock, ListFilter, Upload, AlertTriangle, CheckCircle, Users, Activity, MapPin, CalendarDays, Info, X, Search, FileDown, ChevronDown, ChevronUp, Edit3, Trash2, Eye, Sun, Moon } from 'lucide-react'; // Added Sun and Moon
import { triggerHapticFeedback, ImpactStyle } from '../utils/haptics';
import * as XLSX from 'xlsx';
import './zeitplan-animations.css';

// Enhanced Animation variants
const pageVariants = {
  initial: { opacity: 0, scale: 0.98, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] } },
  exit: { opacity: 0, scale: 0.98, y: -20, transition: { duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] } }
};

const modalVariants = {
  backdropHidden: { opacity: 0 },
  backdropVisible: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  contentHidden: { opacity: 0, scale: 0.92, y: 10, transition: { duration: 0.2, ease: "easeIn" } },
  contentVisible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05 } 
  }
};

const eventBlockVariants = {
  initial: { opacity: 0, y: 25, scale: 0.9, rotateX: -20 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    rotateX: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], type: "spring", stiffness: 150, damping: 20 }
  },
  exit: { 
    opacity: 0, 
    y: -15, 
    scale: 0.92, 
    rotateX: 10,
    transition: { duration: 0.3, ease: [0.55, 0.055, 0.675, 0.19] } 
  }
};

// Constants
const TIMELINE_START_HOUR = 8; // 8 AM
const TIMELINE_END_HOUR = 16; // 4 PM - Adjusted
const HOUR_HEIGHT_PX = 80; // REVERTED for more space
const MINUTES_IN_HOUR = 60;

// Helper to generate a color based on a string (e.g., discipline name)
const stringToColor = (str) => {
  if (!str) return '#6366f1'; // Default clean indigo color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate HSL color with fixed saturation and lightness for consistency
  const hue = hash % 360;
  return `hsl(${hue}, 85%, 65%)`;
};

// Function to darken a HSL color
const darkenColor = (hslColor, amount) => {
  if (!hslColor || !hslColor.startsWith('hsl')) return hslColor;
  try {
    const [h, s, l] = hslColor.match(/\d+/g).map(Number);
    const newL = Math.max(0, l - amount);
    return `hsl(${h}, ${s}%, ${newL}%)`;
  } catch (e) {
    console.error("Error darkening color:", e);
    return hslColor; // Return original if parsing fails
  }
};

// Theme colors to ensure consistency
const themeColors = {
  primary: {
    50: '#ecf0ff',
    100: '#dce4ff',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca'
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

// Event card styles based on type/category
const eventTypeStyles = {
  default: {
    bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    border: 'border-indigo-400',
    text: 'text-white',
    icon: 'text-indigo-200'
  },
  active: {
    bg: 'bg-gradient-to-r from-teal-500 to-emerald-500',
    border: 'border-emerald-400',
    text: 'text-white',
    icon: 'text-emerald-100'
  },
  upcoming: {
    bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    border: 'border-amber-400',
    text: 'text-white',
    icon: 'text-amber-100'
  }
};

// Function to calculate if an event is current, upcoming or past
const getEventStatus = (startTime, endTime) => {
  const now = new Date();
  if (now >= startTime && now <= endTime) return 'active';
  if (now < startTime && startTime.getTime() - now.getTime() < 2 * 60 * 60 * 1000) return 'upcoming';
  if (now > endTime) return 'past';
  return 'default';
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
};

const ZeitplanPage = () => {
  const { currentUser, isAdmin, token } = useAuth();
  const { theme, isDarkMode, toggleTheme } = useTheme(); // Get theme context
  const {
    teams: allTeamsFromContext,
    disziplins: allDisziplinsFromContext,
    zeitplan: rawZeitplanEntries,
    fetchZeitplan,
    zeitplanLoading,
    zeitplanError,
  } = useDataContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredEventId, setHoveredEventId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [betreuerDetails, setBetreuerDetails] = useState(null);
  const [betreuerDetailsLoading, setBetreuerDetailsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const timelineContainerRef = useRef(null);
  const currentTimeIndicatorRef = useRef(null);
  const scrollToCurrentTimeOnMount = useRef(true);
  const headerRef = useRef(null); // Added headerRef
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // DEBUG: Log currentUser and isAdmin status on mount and when they change
  useEffect(() => {
    console.log("ZeitplanPage mounted. currentUser:", currentUser);
    console.log("ZeitplanPage mounted. isAdmin:", isAdmin);
    console.log("ZeitplanPage mounted. token:", token ? token.substring(0,15) + '...' : 'NO TOKEN');
    if (!isAdmin && token) {
        // If not admin but token exists, maybe try to decode token to see role for debugging
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded token payload (ZeitplanPage):", decoded);
        } catch (e) {
            console.error("Error decoding token (ZeitplanPage):", e);
        }
    }
  }, [currentUser, isAdmin, token]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    setMousePosition({
      x: (clientX / windowWidth - 0.5) * 2, 
      y: (clientY / windowHeight - 0.5) * 2 
    });
  };

  useEffect(() => {
    if (fetchZeitplan) fetchZeitplan();

    if (currentUser && currentUser.id && currentUser.role === 'betreuer' && !betreuerDetails) {
      const fetchBetreuerData = async () => {
        setBetreuerDetailsLoading(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/betreuer/${currentUser.id}?withAssignments=true`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setBetreuerDetails(data.data);
              // Set default filter if assigned teams exist
              if (data.data.teams && data.data.teams.length > 0) {
                setSelectedTeamFilter(String(data.data.teams[0].TEAMID));
                triggerHapticFeedback(ImpactStyle.Selection); // Haptic for auto-selection
              }
            } else {
              console.error("Failed to fetch betreuer details:", data.error);
            }
          } else {
            console.error("Error fetching betreuer details, status:", response.status);
          }
        } catch (err) {
          console.error("Network error fetching betreuer details:", err);
        } finally {
          setBetreuerDetailsLoading(false);
        }
      };
      fetchBetreuerData();
    }
  }, [fetchZeitplan, currentUser, token, betreuerDetails]); // Added currentUser, token, betreuerDetails to dependency array

  const processedZeitplanEntries = useMemo(() => {
    if (!Array.isArray(rawZeitplanEntries) || rawZeitplanEntries.length === 0) return [];

    const allTeamIds = [...new Set(rawZeitplanEntries.map(e => e.TEAMID).filter(id => id != null))];
    const teamColorMap = new Map();
    const vibrantHues = [
        220, // Indigo
        170, // Teal
        340, // Pink/Rose
        35,  // Orange
        270, // Purple
        60,  // Yellow
        190, // Cyan
        300, // Magenta
        120, // Green
        0    // Red
    ];

    allTeamIds.forEach((teamId, index) => {
        const hue = vibrantHues[index % vibrantHues.length];
        teamColorMap.set(teamId, isDarkMode ? `hsl(${hue}, 70%, 60%)` : `hsl(${hue}, 80%, 65%)`);
    });

    const sortedEntries = rawZeitplanEntries
      .map(entry => ({
        ...entry,
        id: entry.ZEITPLANID || `temp-${Math.random()}`, // Ensure a unique ID
        STARTZEIT_DATE: new Date(entry.STARTZEIT),
        ENDEZEIT_DATE: new Date(entry.ENDEZEIT),
        TEAM_NAME: entry.TEAM_NAME || 'Unbekanntes Team',
        DISZIPLIN_NAME: entry.DISZIPLIN_NAME || 'Unbekannte Disziplin'
      }))
      .filter(entry => !isNaN(entry.STARTZEIT_DATE) && !isNaN(entry.ENDEZEIT_DATE)) // Filter out invalid dates early
      .sort((a, b) => a.STARTZEIT_DATE - b.STARTZEIT_DATE || a.ENDEZEIT_DATE - b.ENDEZEIT_DATE);

    // Advanced layout algorithm to handle overlaps and assign columns
    const positionedEvents = [];
    let activeLanes = []; // To keep track of events currently occupying lanes

    for (const currentEvent of sortedEntries) {
        // Remove events from activeLanes that have finished before currentEvent starts
        activeLanes = activeLanes.filter(laneEvent => laneEvent.ENDEZEIT_DATE > currentEvent.STARTZEIT_DATE);

        let assignedLane = -1;
        // Find the first available lane (0-indexed)
        for (let i = 0; ; i++) {
            if (!activeLanes.some(eventInLane => eventInLane.layout.lane === i)) {
                assignedLane = i;
                break;
            }
        }
        
        // Determine the number of columns needed for this specific overlap group
        // This is the maximum number of concurrent events at any point within currentEvent's duration
        const concurrentEvents = activeLanes.filter(
            laneEvent =>
                currentEvent.STARTZEIT_DATE < laneEvent.ENDEZEIT_DATE &&
                currentEvent.ENDEZEIT_DATE > laneEvent.STARTZEIT_DATE
        );
        // Add current event to the list for numLanes calculation
        const allPotentiallyOverlapping = [...concurrentEvents, {...currentEvent, layout: { lane: assignedLane }}];
        
        let maxConcurrent = 0;
        if (allPotentiallyOverlapping.length > 0) {
            // Find the maximum number of events that overlap at any single point in time
            // by checking overlaps for each event in the current group
            allPotentiallyOverlapping.forEach(eventA => {
                let currentOverlapCount = 0;
                allPotentiallyOverlapping.forEach(eventB => {
                    if (eventA.STARTZEIT_DATE < eventB.ENDEZEIT_DATE && eventA.ENDEZEIT_DATE > eventB.STARTZEIT_DATE) {
                        currentOverlapCount++;
                    }
                });
                if (currentOverlapCount > maxConcurrent) {
                    maxConcurrent = currentOverlapCount;
                }
            });
        }
         const numLanesForGroup = Math.max(1, maxConcurrent, activeLanes.length > 0 ? Math.max(...activeLanes.map(e => e.layout.lane)) + 1 : 1, assignedLane + 1);


        currentEvent.layout = {
            lane: assignedLane,
            numLanes: numLanesForGroup
        };
        
        // Add current event to activeLanes
        activeLanes.push(currentEvent);
        // Re-sort activeLanes by end time to correctly identify finished events
        activeLanes.sort((a, b) => a.ENDEZEIT_DATE - b.ENDEZEIT_DATE);

        positionedEvents.push(currentEvent);
    }
    
    // Second pass to adjust numLanes for all events based on their true overlapping group
    const finalEvents = positionedEvents.map(event => {
        const overlappingInGroup = positionedEvents.filter(
            otherEvent =>
                event.STARTZEIT_DATE < otherEvent.ENDEZEIT_DATE &&
                event.ENDEZEIT_DATE > otherEvent.STARTZEIT_DATE
        );
        const maxLanesInItsGroup = Math.max(...overlappingInGroup.map(oe => oe.layout.lane)) +1;
        
        return {
            ...event,
            layout: {
                ...event.layout,
                numLanes: Math.max(maxLanesInItsGroup, event.layout.numLanes, 1) // ensure at least 1
            }
        };
    });


    return finalEvents.map(event => ({
      ...event,
      layoutWidth: 100 / Math.max(event.layout.numLanes, 1), // Ensure numLanes is at least 1
      layoutLeft: event.layout.lane * (100 / Math.max(event.layout.numLanes, 1)),
      // Use team-specific color, fallback to discipline color or default
      EVENT_COLOR: teamColorMap.get(event.TEAMID) || (() => {
          const disciplineIndex = (allDisziplinsFromContext.findIndex(d => d.DISZIPLINID === event.DISZIPLINID) % 5 + 5) % 5;
          const baseColorsPalette = [
              isDarkMode ? 'hsl(220, 75%, 70%)' : 'hsl(220, 90%, 75%)',
              isDarkMode ? 'hsl(170, 70%, 60%)' : 'hsl(170, 80%, 65%)',
              isDarkMode ? 'hsl(340, 75%, 70%)' : 'hsl(340, 85%, 75%)',
              isDarkMode ? 'hsl(35, 75%, 65%)' : 'hsl(35, 85%, 70%)',  
              isDarkMode ? 'hsl(270, 65%, 75%)' : 'hsl(270, 75%, 80%)'  
            ];
            return baseColorsPalette[disciplineIndex] || baseColorsPalette[0];
        })()
      }));
  }, [rawZeitplanEntries, allDisziplinsFromContext, isDarkMode]);

  const filteredAndSearchedEntries = useMemo(() => {
    let filtered = processedZeitplanEntries;
    if (selectedTeamFilter !== 'all') {
      filtered = filtered.filter(entry => entry.TEAMID === parseInt(selectedTeamFilter));
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.TEAM_NAME?.toLowerCase().includes(lowerSearchTerm) ||
        entry.DISZIPLIN_NAME?.toLowerCase().includes(lowerSearchTerm) ||
        entry.ORT?.toLowerCase().includes(lowerSearchTerm) ||
        entry.NOTIZ?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return filtered;
  }, [processedZeitplanEntries, selectedTeamFilter, searchTerm]);

  const timelineHours = useMemo(() => {
    const hours = [];
    for (let i = TIMELINE_START_HOUR; i <= TIMELINE_END_HOUR; i++) {
      hours.push({ hour: i, label: `${String(i).padStart(2, '0')}:00` });
    }
    return hours;
  }, []);

  const calculatePositionAndHeight = (startDate, endDate, entryId = 'N/A') => {
    if (!(startDate instanceof Date) || isNaN(startDate.getTime()) || 
        !(endDate instanceof Date) || isNaN(endDate.getTime())) {
      console.error(`Invalid time data for entry ID ${entryId}: STARTZEIT='${startDate}', ENDEZEIT='${endDate}'. Skipping entry.`);
      return { top: 0, height: 0, error: true };
    }
    const startHour = startDate.getHours() + startDate.getMinutes() / MINUTES_IN_HOUR;
    const endHour = endDate.getHours() + endDate.getMinutes() / MINUTES_IN_HOUR;
    const topPosition = (startHour - TIMELINE_START_HOUR) * HOUR_HEIGHT_PX;
    // Ensure topPosition is not negative if an event starts before TIMELINE_START_HOUR
    const correctedTopPosition = Math.max(0, topPosition); 
    
    let calculatedHeight = (endHour - startHour) * HOUR_HEIGHT_PX;
    // If event starts before timeline, adjust height to only show visible part
    if (startHour < TIMELINE_START_HOUR) {
        calculatedHeight = (endHour - TIMELINE_START_HOUR) * HOUR_HEIGHT_PX;
    }
    // Ensure event ends within timeline or cap height
    if (endHour > TIMELINE_END_HOUR + 1) { // +1 to allow events ending exactly on the hour mark to show fully
        calculatedHeight = (Math.min(endHour, TIMELINE_END_HOUR +1) - Math.max(startHour, TIMELINE_START_HOUR)) * HOUR_HEIGHT_PX;
    }
    
    const height = Math.max(30, calculatedHeight); // Min height 30px, adjusted height
    return { top: correctedTopPosition, height: height };
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    if (scrollToCurrentTimeOnMount.current && timelineContainerRef.current && timelineHours.length > 0) {
      const now = new Date();
      const currentHour = now.getHours() + now.getMinutes() / MINUTES_IN_HOUR;
      if (currentHour >= TIMELINE_START_HOUR && currentHour <= TIMELINE_END_HOUR) {
        setTimeout(() => {
          if (timelineContainerRef.current) {
            const topPosition = (currentHour - TIMELINE_START_HOUR - 0.5) * HOUR_HEIGHT_PX;
            timelineContainerRef.current.scrollTo({ top: Math.max(0, topPosition), behavior: 'smooth' });
          }
        }, 800); 
      }
      scrollToCurrentTimeOnMount.current = false;
    }
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      // Removed haptic feedback from interval to avoid annoyance
    }, 60000);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(intervalId);
    };
  }, [timelineHours, timelineContainerRef]);

  useEffect(() => {
    const updatePosition = () => {
      if (currentTimeIndicatorRef.current && timelineContainerRef.current) {
        const now = currentTime;
        const currentHour = now.getHours() + now.getMinutes() / MINUTES_IN_HOUR;
        if (currentHour >= TIMELINE_START_HOUR && currentHour <= TIMELINE_END_HOUR + 1) { 
          const topPosition = (currentHour - TIMELINE_START_HOUR) * HOUR_HEIGHT_PX;
          currentTimeIndicatorRef.current.style.top = `${topPosition}px`;
          currentTimeIndicatorRef.current.style.opacity = '1';
        } else {
          currentTimeIndicatorRef.current.style.opacity = '0'; 
        }
      }
    };
    updatePosition();
  }, [currentTime, timelineHours, HOUR_HEIGHT_PX]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImportFile(file);
      setImportError(null); // Clear previous errors
      triggerHapticFeedback(ImpactStyle.Light);
    }
  };

  const handleOpenEventDetails = (eventEntry) => {
    setSelectedEvent(eventEntry);
    setShowEventDetailModal(true);
    triggerHapticFeedback(ImpactStyle.Medium);
  };

  const handleTeamFilterChange = (e) => {
    setSelectedTeamFilter(e.target.value);
    triggerHapticFeedback(ImpactStyle.Selection);
  };

  const handleImport = async () => {
    if (!importFile) {
      setImportError("Bitte wählen Sie zuerst eine Datei aus.");
      return;
    }
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(null);
    triggerHapticFeedback(ImpactStyle.Heavy);

    const formData = new FormData();
    formData.append("excelFile", importFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/zeitplan/import`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setImportSuccess(data.message || "Daten erfolgreich importiert!");
        if (fetchZeitplan) fetchZeitplan(); // Refresh data
        setShowImportModal(false);
        setImportFile(null);
         triggerHapticFeedback(ImpactStyle.Success);
      } else {
        setImportError(data.error || "Fehler beim Import.");
         triggerHapticFeedback(ImpactStyle.Error);
      }
    } catch (error) {
      console.error("Import Error:", error);
      setImportError("Netzwerkfehler oder Server nicht erreichbar.");
       triggerHapticFeedback(ImpactStyle.Error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleExportToExcel = () => {
    triggerHapticFeedback(ImpactStyle.Medium);
    if (!processedZeitplanEntries || processedZeitplanEntries.length === 0) {
      alert("Keine Daten zum Exportieren vorhanden.");
      return;
    }

    const dataToExport = processedZeitplanEntries.map(entry => ({
      'Team Name': entry.TEAM_NAME,
      'Disziplin Name': entry.DISZIPLIN_NAME,
      'Startzeit': formatTime(entry.STARTZEIT_DATE),
      'Endzeit': formatTime(entry.ENDEZEIT_DATE),
      'Dauer (Minuten)': (entry.ENDEZEIT_DATE.getTime() - entry.STARTZEIT_DATE.getTime()) / 60000,
      'Ort': entry.ORT,
      'Notizen': entry.NOTIZ
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Zeitplan");
    XLSX.writeFile(workbook, "ZeitplanExport.xlsx");
  };

  const renderFilters = (
    selectedTeamFilter,
    handleTeamFilterChange,
    searchTerm,
    setSearchTerm,
    allTeamsFromContext
  ) => {
    const teamsForFilter = [
      { TEAMID: 'all', TEAMNAME: 'Alle Teams anzeigen' },
      ...(allTeamsFromContext || []).map(team => ({ TEAMID: team.TEAMID, TEAMNAME: team.NAME || team.TEAMNAME })) // Use NAME if available
    ];
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } }}
        className={`p-4 rounded-lg shadow-md mb-6
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}
          border`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5
                ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                transition-colors duration-200`}
            />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-md border text-sm 
                ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-indigo-500'
                              : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-500'}
                focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200`}
            />
            {searchTerm && (
                <button
                    onClick={() => {setSearchTerm(''); triggerHapticFeedback(ImpactStyle.Light);}}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full
                        ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}
                        transition-colors`}
                    aria-label="Clear search"
                >
                    <X size={16} />
                </button>
            )}
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                triggerHapticFeedback(ImpactStyle.Light);
              }}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-md border text-sm
                ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-100 hover:border-indigo-500'
                              : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-500'}
                focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200`}
            >
              <span className="flex items-center">
                <ListFilter
                  className={`w-5 h-5 mr-2
                    ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}
                    transition-colors duration-200`}
                />
                {teamsForFilter.find(t => String(t.TEAMID) === String(selectedTeamFilter))?.TEAMNAME || 'Team auswählen'}
              </span>
              {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className={`absolute z-30 w-full mt-1 rounded-md shadow-lg overflow-hidden border max-h-60 overflow-y-auto
                    ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-slate-200'}`}
                >
                  {teamsForFilter.map((team) => (
                    <li key={team.TEAMID}>
                      <button
                        onClick={() => {
                          handleTeamFilterChange({ target: { value: String(team.TEAMID) } });
                          setIsDropdownOpen(false); // Close dropdown on selection
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
                          ${isDarkMode
                            ? String(selectedTeamFilter) === String(team.TEAMID)
                              ? 'bg-indigo-500 text-white'
                              : 'text-slate-100 hover:bg-slate-600'
                            : String(selectedTeamFilter) === String(team.TEAMID)
                              ? 'bg-indigo-500 text-white'
                              : 'text-slate-700 hover:bg-indigo-100'}`}
                      >
                        {team.TEAMNAME}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };
  
  const renderEventDetailModal = (showEventDetailModal, selectedEvent, setShowEventDetailModal) => {
    if (!showEventDetailModal || !selectedEvent) return null;

    const formattedDuration = () => {
      if (!selectedEvent.STARTZEIT_DATE || !selectedEvent.ENDEZEIT_DATE) return 'N/A';
      const diffMs = selectedEvent.ENDEZEIT_DATE.getTime() - selectedEvent.STARTZEIT_DATE.getTime();
      const diffMins = Math.round(diffMs / 60000);
      if (diffMins < 60) return `${diffMins} Minuten`;
      const hours = Math.floor(diffMins / 60);
      const minutes = diffMins % 60;
      return `${hours} Std. ${minutes > 0 ? `${minutes} Min.` : ''}`;
    };
    
    const bgColor = selectedEvent.EVENT_COLOR || themeColors.primary[500];
    const darkBgColor = selectedEvent.EVENT_COLOR ? darkenColor(selectedEvent.EVENT_COLOR, 20) : themeColors.primary[700];

    return (
      <AnimatePresence>
        {showEventDetailModal && selectedEvent && (
          <motion.div
            variants={modalVariants}
            initial="backdropHidden"
            animate="backdropVisible"
            exit="backdropHidden"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8" // Responsive padding
            onClick={() => setShowEventDetailModal(false)}
          >
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-lg"></div> 
            
            <motion.div
              initial="contentHidden"
              animate="contentVisible"
              exit="contentHidden"
              className={`relative w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col
                ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
                style={{ maxHeight: 'calc(100vh - 32px)' }} // Ensure modal fits viewport, with padding
              onClick={(e) => e.stopPropagation()} 
            >
              <div 
                className="p-4 md:p-5 text-white flex justify-between items-start relative overflow-hidden min-h-[100px] sm:min-h-[120px] items-center"
              >
                <div className="absolute inset-0 opacity-90" style={{ background: `linear-gradient(135deg, ${bgColor}, ${darkBgColor})` }}></div>
                {/* Subtle pattern for header */}
                <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414zM41.95 17.536l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414zM0 21.213l8.486-8.486 1.414 1.414L1.414 22.627 0 21.213zM26 26c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zM52 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6z\'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', mixBlendMode: 'overlay'}}></div>

                <div className="relative z-10">
                  <h2 className="text-xl sm:text-2xl font-bold leading-tight flex items-center">
                    <Activity size={22} className="mr-2 sm:mr-2.5 opacity-90 flex-shrink-0" />
                    <span className="truncate">{selectedEvent.DISZIPLIN_NAME}</span>
                  </h2>
                  <p className="text-sm sm:text-base opacity-90 mt-0.5 sm:mt-1">
                    {selectedEvent.TEAM_NAME}
                  </p>
                </div>
                <button 
                    onClick={() => {
                        setShowEventDetailModal(false);
                        triggerHapticFeedback(ImpactStyle.Light);
                    }}
                    className="relative z-10 p-1.5 rounded-full text-white/75 hover:text-white hover:bg-white/20 transition-all duration-150 -mr-1.5 -mt-1.5 sm:-mr-2 sm:-mt-2 active:scale-90 self-start"
                    aria-label="Schließen"
                >
                    <X size={22} />
                </button>
              </div>

              <div className={`p-4 md:p-5 space-y-3 sm:space-y-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} overflow-y-auto styled-scrollbar flex-grow`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {[ 
                        { icon: CalendarDays, label: "Datum", value: selectedEvent.STARTZEIT_DATE.toLocaleDateString('de-DE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) },
                        { icon: Clock, label: "Uhrzeit", value: `${formatTime(selectedEvent.STARTZEIT_DATE)} - ${formatTime(selectedEvent.ENDEZEIT_DATE)}` },
                        { icon: Users, label: "Dauer", value: formattedDuration() },
                        { icon: MapPin, label: "Ort", value: selectedEvent.ORT || 'N/A' },
                    ].map(item => (
                        <div key={item.label} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/70 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200/80'} transition-colors`}>
                            <div className="flex items-center mb-1">
                                <item.icon size={16} className={`mr-2 flex-shrink-0 ${selectedEvent.EVENT_COLOR ? '' : (isDarkMode ? 'text-indigo-400' : 'text-indigo-600')}`} style={{color: selectedEvent.EVENT_COLOR ? darkenColor(selectedEvent.EVENT_COLOR, isDarkMode ? 0: 15) : undefined }} />
                                <span className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{item.label}</span>
                            </div>
                            <p className={`ml-0.5 text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{item.value}</p>
                        </div>
                    ))}
                </div>
                
                {selectedEvent.NOTIZ && (
                   <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700/70' : 'bg-slate-100'}`}>
                        <div className="flex items-center mb-1">
                            <Info size={16} className={`mr-2 flex-shrink-0 ${selectedEvent.EVENT_COLOR ? '' : (isDarkMode ? 'text-indigo-400' : 'text-indigo-600')}`} style={{color: selectedEvent.EVENT_COLOR ? darkenColor(selectedEvent.EVENT_COLOR, isDarkMode ? 0: 15) : undefined }} />
                            <span className={`font-semibold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                                Notizen
                            </span>
                        </div>
                        <p className={`whitespace-pre-wrap text-xs ml-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{selectedEvent.NOTIZ}</p>
                    </div>
                )}
              </div>
              
              { /* Removed Admin buttons from event detail modal */ }
               <div className={`px-4 py-3 md:px-5 md:py-4 border-t ${isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50/70 border-slate-200'} flex justify-end space-x-3`}>
                    <button 
                        onClick={() => {
                            setShowEventDetailModal(false);
                            triggerHapticFeedback(ImpactStyle.Light);
                        }}
                        className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95
                            ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white focus-visible:ring-indigo-400 focus-visible:ring-offset-slate-800' : 'bg-indigo-500 hover:bg-indigo-600 text-white focus-visible:ring-indigo-500 focus-visible:ring-offset-white'}
                            shadow-md hover:shadow-lg`}
                    >
                        Schließen
                    </button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const renderImportModal = (showImportModal, setShowImportModal, isImporting, importFile, setImportFile, importError, handleImport, fileInputRef) => {
    if (!showImportModal) return null;

    const instructions = [
      { id: 'team', icon: Users, title: "Team Name", text: "Vollständiger Teamname (z.B. \"Die flotten Käfer\")", example: "Die flotten Käfer" },
      { id: 'discipline', icon: Activity, title: "Disziplin Name", text: "Genauer Name der Disziplin (z.B. \"100m Sprint\")", example: "100m Sprint" },
      { id: 'start', icon: Clock, title: "Startzeit", text: "Format HH:mm (z.B. \"10:30\") oder Excel-Zeitwert", example: "10:30" },
      { id: 'duration', icon: CalendarDays, title: "Dauer", text: "In Minuten (z.B. \"45\")", example: "45" },
      { id: 'location', icon: MapPin, title: "Ort (Optional)", text: "Wo das Event stattfindet", example: "Sporthalle West" },
      { id: 'notes', icon: Info, title: "Notizen (Optional)", text: "Zusätzliche Informationen", example: "Treffpunkt Eingang" },
    ];

    return (
      <AnimatePresence>
        {showImportModal && (
            <motion.div
                variants={modalVariants}
                initial="backdropHidden"
                animate="backdropVisible"
                exit="backdropHidden"
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8"
                onClick={() => setShowImportModal(false)}
            >
                <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-md"></div>
                <motion.div
                    initial="contentHidden"
                    animate="contentVisible"
                    exit="contentHidden"
                    className={`relative w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col
                        ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}
                    style={{ maxHeight: 'calc(100vh - 32px)' }} // Ensure modal fits viewport, with padding
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={`flex justify-between items-center p-4 md:p-5 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <h3 className="text-lg sm:text-xl font-semibold flex items-center">
                            <Upload size={20} className={`mr-2.5 flex-shrink-0 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                            Zeitplan Importieren
                        </h3>
                        <button 
                            onClick={() => {setShowImportModal(false); triggerHapticFeedback(ImpactStyle.Light);}} 
                            className={`p-1.5 rounded-full ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'} transition-colors active:scale-90`}
                            aria-label="Schließen"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <div className="p-4 md:p-5 space-y-4 overflow-y-auto styled-scrollbar flex-grow">
                        <div className="group">
                            <label 
                                htmlFor="excel-upload"
                                className={`block w-full cursor-pointer p-5 sm:p-6 border-2 border-dashed rounded-lg text-center transition-all duration-200 
                                    ${isDarkMode ? 'border-slate-600 hover:border-sky-500 bg-slate-700/50 hover:bg-slate-700/70' 
                                                : 'border-slate-300 hover:border-sky-400 bg-slate-50 hover:bg-sky-50'}
                                    ${importFile ? (isDarkMode ? 'border-sky-500 bg-slate-700/60' : 'border-sky-400 bg-sky-50/90') : ''}
                                `}
                            >
                                <input 
                                    id="excel-upload" 
                                    type="file" 
                                    className="hidden" 
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleFileSelect}
                                    ref={fileInputRef}
                                />
                                <Upload size={36} className={`mx-auto mb-2 transition-transform duration-200 group-hover:scale-105 ${isDarkMode ? 'text-slate-400 group-hover:text-sky-400' : 'text-slate-500 group-hover:text-sky-500'} ${importFile ? (isDarkMode ? 'text-sky-400' : 'text-sky-500') : ''}`}/>
                                {importFile ? (
                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-sky-300' : 'text-sky-600'}`}>{importFile.name}</p>
                                ) : (
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Datei auswählen oder hierher ziehen</p>
                                )}
                                <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>XLSX, XLS, CSV (Max. 5MB)</p>
                            </label>
                            {importError && <p className="mt-2.5 text-xs text-red-500 dark:text-red-400 flex items-center"><AlertTriangle size={14} className="mr-1.5 flex-shrink-0"/>{importError}</p>}
                        </div>
                        
                        <div>
                          <h4 className={`text-sm font-medium mb-2.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Benötigte Spalten in der Excel/CSV Datei:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                            {instructions.map((item, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 8}}
                                animate={{ opacity: 1, y: 0, transition: {delay: index * 0.04, duration: 0.25}}}
                                className={`p-2.5 rounded-md ${isDarkMode ? 'bg-slate-700/80' : 'bg-slate-100'}`}>
                                <div className="flex items-center mb-0.5">
                                  <item.icon size={14} className={`mr-1.5 flex-shrink-0 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
                                  <span className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>{item.title}</span>
                                </div>
                                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} text-[0.7rem] leading-snug`}>{item.text}. Beispiel: <i>{item.example}</i></p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                    </div>

                    <div className={`px-4 py-3 md:px-5 md:py-4 border-t ${isDarkMode ? 'border-slate-700 bg-slate-800/60' : 'border-slate-200 bg-slate-50/70'} flex justify-end items-center space-x-2.5 sm:space-x-3`}>
                        <button 
                            onClick={() => {setShowImportModal(false); triggerHapticFeedback(ImpactStyle.Light);}} 
                            className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95
                                ${isDarkMode ? 'text-slate-300 hover:bg-slate-600/70 focus-visible:ring-slate-500 focus-visible:ring-offset-slate-800' : 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-500 focus-visible:ring-offset-white'}
                            `}
                        >
                            Abbrechen
                        </button>
                        <button 
                            onClick={handleImport}
                            disabled={!importFile || isImporting}
                            className={`modern-button shimmer-button flex items-center px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 transition-opacity
                                ${isImporting ? 'opacity-60 cursor-not-allowed' : 'opacity-100'}
                                ${isDarkMode ? 'bg-sky-600 hover:bg-sky-500 text-white focus-visible:ring-sky-400 focus-visible:ring-offset-slate-800' : 'bg-sky-500 hover:bg-sky-600 text-white focus-visible:ring-sky-500 focus-visible:ring-offset-white'}
                            `}
                        >
                            {isImporting ? (
                                <><div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-1.5 sm:mr-2"></div> Importiere...</>
                            ) : (
                                <><Upload size={15} className="mr-1 sm:mr-1.5"/> Importieren</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // ENHANCED LOADING STATE
  const renderLoadingState = () => {
    // Enhanced Loading Animation
    const cubeVariants = {
      initial: { rotateY: 0, rotateX: 0 },
      animate: {
        rotateY: [0, 180, 180, 0, 0],
        rotateX: [0, 0, 180, 180, 0],
        transition: {
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 0.5
        }
      }
    };

    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-4 text-center ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-sky-100'} transition-colors duration-300`}>
        <motion.div 
          className="w-16 h-16 md:w-20 md:h-20 mb-6 md:mb-8 relative"
          style={{ perspective: "200px" }}
        >
          <motion.div 
            className="absolute w-full h-full rounded-lg shadow-xl"
            style={{ background: `linear-gradient(135deg, ${themeColors.primary[500]}, ${themeColors.primary[700]})`}}
            variants={cubeVariants}
            initial="initial"
            animate="animate"
          />
        </motion.div>
        <h2 className={`text-xl md:text-2xl font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>Lade Zeitplan Daten</h2>
        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-sm md:text-base max-w-md`}>
          Einen Moment Geduld, die aktuellen Termine und Details werden abgerufen.
        </p>
        <div className={`mt-8 w-48 h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded-full overflow-hidden`}>
            <motion.div 
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${themeColors.primary[600]}, ${themeColors.primary[400]})`}}
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
        </div>
      </div>
    );
  };

  // ENHANCED ERROR STATE
  const renderErrorState = (zeitplanError, fetchZeitplan) => {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen p-6 text-center ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-red-100'} transition-colors duration-300`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] } }}
          className={`p-8 md:p-10 rounded-2xl shadow-xl max-w-lg w-full ${isDarkMode ? 'bg-slate-800/70 border border-slate-700' : 'bg-white/70 border border-red-200'} backdrop-blur-md`}
        >
          <AlertTriangle size={48} className={`mb-5 mx-auto ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
          <h2 className={`text-xl md:text-2xl font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>Fehler beim Laden des Zeitplans</h2>
          <p className={`mb-6 text-sm md:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {zeitplanError?.message || "Ein unbekannter Fehler ist aufgetreten."}
          </p>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              fetchZeitplan();
              triggerHapticFeedback(ImpactStyle.Medium);
            }}
            className={`modern-button shimmer-button flex items-center justify-center px-5 py-2.5 rounded-lg shadow-md focus-ring text-base font-medium
              ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-400' : 'bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-500'}
            `}
          >
            <CheckCircle size={18} className="mr-2" />
            Erneut versuchen
          </motion.button>
        </motion.div>
      </div>
    );
  };

  // Create a separate file for animations
  const createAnimationStylesheet = () => {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      @keyframes blob {
        0% {
          transform: scale(1) translate(0px, 0px);
        }
        33% {
          transform: scale(1.1) translate(20px, -20px);
        }
        66% {
          transform: scale(0.9) translate(-20px, 20px);
        }
        100% {
          transform: scale(1) translate(0px, 0px);
        }
      }
      
      .animate-blob {
        animation: blob 7s infinite alternate;
      }
      
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      
      .styled-scrollbar::-webkit-scrollbar {
        width: 10px;
      }
      
      .styled-scrollbar::-webkit-scrollbar-track {
        background: rgba(226, 232, 240, 0.3);
        border-radius: 5px;
      }
      
      .styled-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(99, 102, 241, 0.5);
        border-radius: 5px;
        transition: all 0.3s ease;
      }
      
      .styled-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(99, 102, 241, 0.8);
      }
      
      /* Glass morphism classes */
      .glassmorphism {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      }
      
      .dark .glassmorphism {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Floating animation */
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      /* Shine effect animation */
      @keyframes shine {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }
      
      .shine-effect {
        position: relative;
        overflow: hidden;
      }
      
      .shine-effect::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        background-size: 200% 100%;
        animation: shine 3s infinite;
      }
    `;
    
    // Check if already exists
    const existingStyle = document.getElementById('zeitplan-animations');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    style.id = 'zeitplan-animations';
    document.head.appendChild(style);
  };

  // Apply animation styles when component renders
  useEffect(() => {
    createAnimationStylesheet();
    // Ensure to clean up on unmount if the style element is appended to head
    return () => {
      const styleElement = document.getElementById('zeitplan-animations');
      if (styleElement && styleElement.parentElement === document.head) { // Check parent before removing
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isEventNow = (event) => {
    const now = new Date();
    return now >= event.STARTZEIT_DATE && now <= event.ENDEZEIT_DATE;
  };

  // ULTRA-MODERN TIMELINE VISUALIZATION
  const renderTimeline = (timelineHours, filteredEvents, calculatePositionAndHeight, handleOpenEventDetails, timelineContainerRef, currentTimeIndicatorRef, isLoadingMore, headerRef) => {
    const labelColumnWidth = "w-12 sm:w-16"; 
    const eventColumnPadding = "pl-1.5 pr-1.5 sm:pl-2 sm:pr-2"; 
    const [timelineHeight, setTimelineHeight] = useState('auto');

    useEffect(() => {
      const calculateHeight = () => {
        if (timelineContainerRef.current && timelineContainerRef.current.parentElement && headerRef.current) {
          // Calculate available height within the main content area, below the header
          const mainContentArea = timelineContainerRef.current.closest('main'); // Find the main element
          if (mainContentArea) {
            const mainRect = mainContentArea.getBoundingClientRect();
            const headerRect = headerRef.current.getBoundingClientRect();
            // The timeline's direct parent's padding needs to be accounted for if it has any.
            // Assuming the parent <div className="flex-grow overflow-hidden relative"> has no explicit top/bottom padding.
            const availableHeight = window.innerHeight - headerRect.bottom - parseFloat(getComputedStyle(mainContentArea).paddingBottom);
            setTimelineHeight(`${Math.max(300, availableHeight)}px`); // Min height 300px
          } else {
            // Fallback if main area isn't found, less accurate
            const headerHeight = headerRef.current.offsetHeight;
            const mainPadding = 32; 
            const fallbackHeight = window.innerHeight - headerHeight - mainPadding - 20; 
            setTimelineHeight(`${Math.max(300, fallbackHeight)}px`);
          }
        } else {
           const fallbackHeight = window.innerHeight * 0.6; // Fallback to 60% of viewport height
           setTimelineHeight(`${Math.max(300, fallbackHeight)}px`);
        }
      };
      calculateHeight();
      
      const resizeObserver = new ResizeObserver(calculateHeight);
      const mainContentAreaForObserver = timelineContainerRef.current?.closest('main');
      if (mainContentAreaForObserver) {
        resizeObserver.observe(mainContentAreaForObserver);
      }
      
      window.addEventListener('resize', calculateHeight);
      
      return () => {
        window.removeEventListener('resize', calculateHeight);
        if (mainContentAreaForObserver) {
            resizeObserver.unobserve(mainContentAreaForObserver);
        }
        resizeObserver.disconnect();
      };
    }, [headerRef]); // headerRef dependency

    return (
      // This div is now the direct child that receives the dynamic height for scrolling
      <div 
        ref={timelineContainerRef}
        className={`relative overflow-y-auto modern-scrollbar shadow-xl rounded-xl flex h-full
          ${isDarkMode ? 'border-slate-700/50 bg-slate-800/60' : 'border-slate-200/50 bg-white/60'} border`} // Added explicit border class
        style={{ height: timelineHeight }} 
      >
        {isLoadingMore && (
          <div className={`absolute top-2 left-1/2 -translate-x-1/2 z-20 p-1.5 px-3 rounded-full ${isDarkMode ? 'bg-slate-700/90' : 'bg-white/90'} shadow-lg flex items-center`}>
            <div className="w-3.5 h-3.5 border-2 border-dashed rounded-full animate-spin border-indigo-500 mr-2"></div>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Lade...</span>
          </div>
        )}
        {/* Hour Labels Column */}
        <div className={`relative z-10 ${labelColumnWidth} flex-shrink-0 border-r ${isDarkMode ? 'border-slate-700/40' : 'border-slate-200/50'} py-1`}> {/* Refined border */}
          {timelineHours.map(({ hour, label }) => (
            <div
              key={`label-${hour}`}
              className={`flex items-center justify-end pr-2 sm:pr-2.5 select-none text-xs
                ${isDarkMode ? 'text-slate-400' : 'text-slate-500 '}` // Refined font size and color
              }
              style={{ height: `${HOUR_HEIGHT_PX}px` }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Events and Grid Area (takes remaining space) */}
        <div className={`relative flex-grow ${eventColumnPadding}`}>
          {/* Background Grid Lines aligned with labels */}
          <div className="absolute inset-0 top-0 left-0 right-0 -z-10">
            {timelineHours.map(({ hour }) => (
              <div
                key={`grid-${hour}`}
                className={`border-b ${isDarkMode ? 'border-slate-700/25' : 'border-slate-200/50'}` // Fainter grid lines
                }
                style={{ height: `${HOUR_HEIGHT_PX}px` }}
              ></div>
            ))}
          </div>
          
          {/* Current Time Indicator - positioned relative to this events area */}
          <div
            ref={currentTimeIndicatorRef}
            className="current-time-indicator absolute left-0 right-0 h-0.5 z-20 pointer-events-none transition-opacity duration-300"
            style={{
              background: isDarkMode ? themeColors.primary[400] : themeColors.primary[500],
              boxShadow: `0 0 10px ${isDarkMode ? themeColors.primary[400] : themeColors.primary[500]}, 0 0 15px rgba(${hexToRgb(isDarkMode ? themeColors.primary[400] : themeColors.primary[500])?.join(',')}, 0.3)`,
              opacity: 0
            }}
          >
            <div
              className="absolute -left-1.5 -top-1.5 w-3.5 h-3.5 rounded-full border-2 shadow-md" // Slightly larger dot
              style={{
                backgroundColor: isDarkMode ? themeColors.primary[300] : themeColors.primary[600],
                borderColor: isDarkMode ? themeColors.neutral[900] : themeColors.neutral[50]
              }}
            />
          </div>

          {/* Events Area - positioned relative to this events area */}
          <div className="absolute top-0 left-0 right-0 bottom-0 z-10">
            <AnimatePresence>
              {filteredEvents.map((entry) => {
                const { top, height, error } = calculatePositionAndHeight(entry.STARTZEIT_DATE, entry.ENDEZEIT_DATE, entry.ZEITPLANID);
                if (error) return null;

                const isHovered = hoveredEventId === entry.ZEITPLANID;
                const eventStatus = getEventStatus(entry.STARTZEIT_DATE, entry.ENDEZEIT_DATE);

                const disciplineIndex = (allDisziplinsFromContext.findIndex(d => d.DISZIPLINID === entry.DISZIPLINID) % 5 + 5) % 5; // Ensure positive index
                const baseColorsPalette = [
                    isDarkMode ? 'hsl(220, 75%, 70%)' : 'hsl(220, 90%, 75%)', 
                    isDarkMode ? 'hsl(170, 70%, 60%)' : 'hsl(170, 80%, 65%)', 
                    isDarkMode ? 'hsl(340, 75%, 70%)' : 'hsl(340, 85%, 75%)', 
                    isDarkMode ? 'hsl(35, 75%, 65%)' : 'hsl(35, 85%, 70%)',  
                    isDarkMode ? 'hsl(270, 65%, 75%)' : 'hsl(270, 75%, 80%)'  
                ];
                const baseColor = entry.EVENT_COLOR || baseColorsPalette[disciplineIndex % baseColorsPalette.length]; // Use pre-calculated color or fallback to discipline index based color
                
                let cardStyle = {
                  borderWidth: '1px',
                  borderRadius: '0.65rem', // Slightly more rounded
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother, custom transition
                  position: 'relative', // For pseudo-elements if needed
                  overflow: 'hidden', // Ensure gradients/effects are contained
                };
                
                const textColor = isDarkMode ? 'text-slate-50' : 'text-white';

                // Base styling - subtle gradient and fine border
                cardStyle.background = isDarkMode 
                    ? `linear-gradient(145deg, ${darkenColor(baseColor, 5)} 20%, ${darkenColor(baseColor, 18)} 100%)` 
                    : `linear-gradient(145deg, ${baseColor} 20%, ${darkenColor(baseColor, 12)} 100%)`;
                cardStyle.borderColor = darkenColor(baseColor, isDarkMode ? 10 : 15);
                cardStyle.boxShadow = isDarkMode
                    ? `0 3px 8px rgba(0,0,0,0.3), 0 0 0 1px ${darkenColor(baseColor, 25)}`
                    : `0 3px 8px rgba(0,0,0,0.1), 0 0 0 1px ${darkenColor(baseColor, 25)}`;

                // Always apply a base scale for better visibility with smaller HOUR_HEIGHT_PX
                cardStyle.transform = 'scale(1)';

                if (eventStatus === 'active') {
                    // Active: Brighter, more prominent, maybe a subtle inner glow or border highlight
                    const activePrimary = isDarkMode ? themeColors.primary[400] : themeColors.primary[500];
                    const activeSecondary = isDarkMode ? themeColors.primary[500] : themeColors.primary[600];
                    cardStyle.background = `linear-gradient(145deg, ${activePrimary} 0%, ${activeSecondary} 100%)`;
                    cardStyle.borderColor = isDarkMode ? themeColors.primary[300] : themeColors.primary[400];
                    cardStyle.boxShadow = isDarkMode
                        ? `0 6px 18px rgba(0,0,0,0.4), 0 0 0 1.5px ${activePrimary}, 0 0 25px -5px rgba(${hexToRgb(activePrimary)?.join(',')}, 0.6)`
                        : `0 6px 18px rgba(0,0,0,0.22), 0 0 0 1.5px ${activePrimary}, 0 0 25px -5px rgba(${hexToRgb(activePrimary)?.join(',')}, 0.5)`;
                    cardStyle.transform = 'scale(1.02)'; // Slightly larger when active
                    cardStyle.zIndex = 20; // Ensure active events are prominent
                } else if (eventStatus === 'past') {
                    // Past: Desaturated, less prominent
                    const pastBase = isDarkMode ? themeColors.neutral[700] : themeColors.neutral[300];
                    const pastSecondary = isDarkMode ? themeColors.neutral[800] : themeColors.neutral[400];
                    cardStyle.background = `linear-gradient(145deg, ${pastBase} 0%, ${pastSecondary} 100%)`;
                    cardStyle.borderColor = isDarkMode ? themeColors.neutral[600] : themeColors.neutral[400];
                    cardStyle.opacity = isDarkMode ? 0.55 : 0.65; // Made slightly more opaque
                    cardStyle.boxShadow = isDarkMode ? `0 1px 2px rgba(0,0,0,0.5)` : `0 1px 2px rgba(0,0,0,0.2)`;
                    // Do not apply hover transforms to past events
                } else if (eventStatus === 'upcoming') {
                    // Upcoming: Distinct, but not as vibrant as active. Use the baseColor logic.
                    // Background and border already set by baseColor logic. Add a distinct shadow or effect.
                    cardStyle.boxShadow = isDarkMode
                        ? `0 4px 10px rgba(0,0,0,0.25), 0 0 0 1px ${darkenColor(baseColor, 20)}, 0 0 8px rgba(${hexToRgb(baseColor)?.join(',')}, 0.2)`
                        : `0 4px 10px rgba(0,0,0,0.12), 0 0 0 1px ${darkenColor(baseColor, 20)}, 0 0 8px rgba(${hexToRgb(baseColor)?.join(',')}, 0.15)`;
                }

                if (isHovered && eventStatus !== 'past') {
                    cardStyle.transform = 'scale(1.05) translateY(-2px)'; // Keep Y translate modest for smaller cards
                    cardStyle.zIndex = 40; // Bring to front
                    cardStyle.boxShadow = isDarkMode 
                        ? `0 8px 25px rgba(0,0,0,0.5), 0 0 0 1.5px ${cardStyle.borderColor}, 0 0 30px -8px rgba(${hexToRgb(cardStyle.borderColor || baseColor)?.join(',')}, 0.7)`
                        : `0 8px 25px rgba(0,0,0,0.25), 0 0 0 1.5px ${cardStyle.borderColor || baseColor}, 0 0 30px -8px rgba(${hexToRgb(cardStyle.borderColor || baseColor)?.join(',')}, 0.6)`;
                }

                const durationInMinutes = (entry.ENDEZEIT_DATE.getTime() - entry.STARTZEIT_DATE.getTime()) / (1000 * 60);
                const showFullDetails = height >= 60; // Show more details if card is tall enough
                const showMediumDetails = height >= 45;

                return (
                  <motion.div
                    key={entry.ZEITPLANID}
                    layoutId={`event-${entry.ZEITPLANID}`} // For smoother animations if items reorder
                    variants={eventBlockVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    title={`${entry.TEAM_NAME} - ${entry.DISZIPLIN_NAME} (${formatTime(entry.STARTZEIT_DATE)} - ${formatTime(entry.ENDEZEIT_DATE)})`}
                    className={`event-card absolute rounded-lg cursor-pointer border overflow-hidden flex flex-col group
                      transition-all duration-200 ease-out 
                      ${isHovered && eventStatus !== 'past' ? 'scale-[1.04] shadow-2xl z-30 brightness-110' : 'z-10'} 
                      ${textColor}
                    `}
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(30, height - 2)}px`, // -2 for slightly smaller gap, min height 30
                      left: `calc(${entry.layoutLeft}% + 2px)`, // Smaller gap from left
                      width: `calc(${entry.layoutWidth}% - 4px)`, // Reduce width for gaps on sides (2px each side)
                      ...cardStyle
                    }}
                    onClick={() => {
                      handleOpenEventDetails(entry);
                      triggerHapticFeedback(ImpactStyle.Light);
                    }}
                    onMouseEnter={() => setHoveredEventId(entry.ZEITPLANID)}
                    onMouseLeave={() => setHoveredEventId(null)}
                    onFocus={() => setHoveredEventId(entry.ZEITPLANID)}
                    onBlur={() => setHoveredEventId(null)}
                    tabIndex={0}
                  >
                    {/* Shine effect for non-past events */}
                    {eventStatus !== 'past' && (
                        <div 
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                                background: `radial-gradient(circle at 50% 0%, rgba(255,255,255,${isDarkMode ? '0.1' : '0.25'}) 0%, rgba(255,255,255,0) 60%)`,
                                pointerEvents: 'none',
                            }}
                        />
                    )}

                    <div className={`p-2 sm:p-2.5 flex-grow overflow-hidden flex flex-col justify-between ${height < 45 ? 'items-center text-center': ''} relative z-10`}>
                        <div> {/* Top content wrapper */}
                            <h3 className={`font-bold truncate leading-tight group-hover:text-clip ${showFullDetails ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} ${textColor}`}>
                                {entry.TEAM_NAME}
                            </h3>
                            {showMediumDetails && (
                              <p className={`truncate group-hover:text-clip flex items-center ${showFullDetails ? 'text-xs sm:text-sm' : 'text-[0.7rem] sm:text-xs'} ${eventStatus === 'past' ? (isDarkMode? 'opacity-50' : 'opacity-60') : 'opacity-80'} ${textColor} ${height < 45 ? 'justify-center': ''}`}>
                                  <Activity size={showFullDetails ? 12 : 10} className="inline mr-1.5 flex-shrink-0" />
                                  {entry.DISZIPLIN_NAME}
                              </p>
                            )}
                        </div>
                        
                        {(showFullDetails || (showMediumDetails && !entry.ORT)) && (
                            <div className={`mt-1 text-[0.65rem] sm:text-xs ${eventStatus === 'past' ? (isDarkMode? 'opacity-50' : 'opacity-60') : 'opacity-80'} ${textColor} flex-shrink-0`}>
                                <p className="flex items-center truncate">
                                    <Clock size={showFullDetails ? 11 : 10} className="inline mr-1 flex-shrink-0" /> 
                                    {formatTime(entry.STARTZEIT_DATE)} - {formatTime(entry.ENDEZEIT_DATE)}
                                    {showFullDetails && durationInMinutes > 0 && <span className="ml-1 opacity-80">({durationInMinutes} Min)</span>}
                                </p>
                                {entry.ORT && showFullDetails && (
                                    <p className="flex items-center truncate mt-0.5">
                                        <MapPin size={showFullDetails ? 11 : 10} className="inline mr-1 flex-shrink-0" /> {entry.ORT}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Status indicators & Effects */}
                    {isHovered && eventStatus !== 'past' && (
                        <div 
                            className="absolute -inset-px rounded-[0.7rem] opacity-80 animate-pulse-border-ultra-modern"
                            style={{"--pulse-color": hexToRgb(darkenColor(baseColor, isDarkMode ? 0 : 5))?.join(','), 
                                     borderRadius: 'inherit' // Ensure child pseudo-elements inherit border-radius
                             }}
                        ></div>
                    )}
                     {eventStatus === 'active' && (
                       <div className="absolute top-2 right-2 flex items-center">
                         <div 
                            className="w-2 h-2 rounded-full animate-pulse-strong opacity-100 mr-1.5"
                            style={{ backgroundColor: isDarkMode? '#fffc': '#fff'}}
                         ></div>
                         <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${isDarkMode ? 'bg-white/20 text-white' : 'bg-white/30 text-white'} backdrop-blur-sm`}>Live</span>
                       </div>
                     )}
                     {eventStatus === 'upcoming' && !isHovered && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-300 opacity-70 animate-ping-slow"></div>
                     )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  // Loading State
  if (zeitplanLoading && !processedZeitplanEntries.length) { // Show full page loader only if no data yet
    return renderLoadingState();
  }

  // Error State
  if (zeitplanError) {
    return renderErrorState(zeitplanError, fetchZeitplan);
  }
  
  // Main Content
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`h-screen flex flex-col overflow-hidden ${isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-gradient-to-br from-slate-50 to-sky-100 text-slate-800'} transition-colors duration-300`} // Use h-screen and overflow-hidden on the outermost container
    >
      {/* Dynamic Stylesheet for Animations */}
      <style>{createAnimationStylesheet()}</style>

      {renderPageHeader(
        isAdmin(), 
        setShowImportModal, 
        handleExportToExcel, 
        importSuccess, 
        importError, 
        isDarkMode,
        selectedTeamFilter,
        handleTeamFilterChange,
        allTeamsFromContext,
        headerRef
      )}

      {/* Main content area that holds the timeline */}
      <main className="flex-grow flex flex-col p-2 sm:p-3 md:p-4 overflow-y-hidden"> {/* Ensure main does not scroll, timeline will */}
        
        {(zeitplanLoading || betreuerDetailsLoading) && processedZeitplanEntries.length > 0 && ( 
            <div className={`flex items-center justify-center p-2 rounded-lg mb-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} shadow-sm`}> {/* Adjusted padding & margin */}
                <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-indigo-500 mr-2"></div>
                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}> {betreuerDetailsLoading ? 'Lade Betreuer Details...' : 'Lade aktuelle Daten...'}</span>
            </div>
        )}

        {/* Timeline rendering now takes up the remaining space and scrolls internally */}
        {/* The parent of renderTimeline's output needs to correctly fill space and enable renderTimeline to scroll */}
        <div className="flex-grow overflow-hidden relative"> {/* This container will manage the timeline's height and allow internal scroll */}
          {renderTimeline(
            timelineHours, 
            filteredAndSearchedEntries, 
            calculatePositionAndHeight, 
            handleOpenEventDetails, 
            timelineContainerRef, 
            currentTimeIndicatorRef, 
            zeitplanLoading && processedZeitplanEntries.length > 0,
            headerRef
          )}
        </div>
      </main>

      {renderEventDetailModal(showEventDetailModal, selectedEvent, setShowEventDetailModal)}
      {renderImportModal(showImportModal, setShowImportModal, isImporting, importFile, setImportFile, importError, handleImport, fileInputRef)}

      {/* Subtle animated background element */}
      <div 
        className={`fixed inset-0 -z-10 timeline-background ${isDarkMode ? 'opacity-50' : 'opacity-100'}`} 
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div 
            className="absolute inset-0"
            style={{
                background: `radial-gradient(circle at ${mousePosition.x * 50 + 50}% ${mousePosition.y * 50 + 50}%, ${isDarkMode ? 'rgba(71, 85, 105, 0.15)' : 'rgba(199, 210, 254, 0.2)'} 0%, transparent 60%)`,
                transition: 'background 0.2s ease-out'
            }}
        />
      </div>
    </motion.div>
  );
};

// Add the missing renderPageHeader function here
const renderPageHeader = (
    isAdmin, 
    setShowImportModal, 
    handleExportToExcel, 
    importSuccess, 
    importError, 
    isDarkMode,
    selectedTeamFilter,
    handleTeamFilterChange,
    allTeamsFromContext,
    headerRef // Add headerRef to parameters
 ) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  const teamsForFilter = useMemo(() => {
    let dynamicTeams = (allTeamsFromContext || []).map(team => ({ TEAMID: team.TEAMID, TEAMNAME: team.NAME || team.TEAMNAME })).sort((a,b) => a.TEAMNAME.localeCompare(b.TEAMNAME));
    

    return [
      { TEAMID: 'all', TEAMNAME: 'Alle Teams anzeigen' },
      ...dynamicTeams
    ];
  }, [allTeamsFromContext]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterDropdownRef]);


  return (
    <header 
      ref={headerRef}
      className={`p-3 sm:p-4 md:p-5 sticky top-0 z-40 backdrop-blur-lg border-b 
      ${isDarkMode ? 'bg-slate-900/80 border-slate-700/60' : 'bg-white/80 border-slate-200/60'} 
      transition-colors duration-300 flex-shrink-0`}> {/* Increased z-index, refined bg opacity and border */}
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-3 md:gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.1, duration: 0.4 } }}
          className="flex items-center self-start sm:self-center" // Align left on mobile, center on sm+
        >
          <Clock size={24} sm:size={28} className={`mr-2 sm:mr-2.5 ${isDarkMode ? 'text-sky-400' : 'text-sky-500'}`} />
          {/* <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
            Zeitplan
          </h1> */}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.15, duration: 0.4 } }}
          className="flex items-center space-x-2 sm:space-x-2.5 flex-wrap justify-start sm:justify-end w-full sm:w-auto" // Full width on mobile for wrapping
        >
          {/* Team Filter Dropdown */}
          <div className="relative order-first sm:order-none mb-2 sm:mb-0 w-full xs:w-auto" ref={filterDropdownRef}> {/* Full width on extra small, auto on others */}
            <button
              onClick={() => {
                setIsFilterDropdownOpen(!isFilterDropdownOpen);
                triggerHapticFeedback(ImpactStyle.Light);
              }}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95
                ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600/80 border-slate-600 text-slate-100 focus-visible:ring-indigo-500 focus-visible:ring-offset-slate-900'
                              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 focus-visible:ring-indigo-500 focus-visible:ring-offset-white' // Matched light mode with others
                }
              `}
              title="Team filtern"
            >
              <ListFilter size={15} className="mr-1.5 opacity-80 flex-shrink-0" />
              <span className="truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]">
                {teamsForFilter.find(t => String(t.TEAMID) === String(selectedTeamFilter))?.TEAMNAME || 'Team auswählen'}
              </span>
              {isFilterDropdownOpen ? <ChevronUp size={16} className="ml-1.5 flex-shrink-0 opacity-70" /> : <ChevronDown size={16} className="ml-1.5 flex-shrink-0 opacity-70" />}
            </button>
            <AnimatePresence>
              {isFilterDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto', transition: { duration: 0.15, ease: "easeOut" } }}
                  exit={{ opacity: 0, y: -5, height: 0, transition: { duration: 0.1 } }}
                  className={`absolute z-50 w-full sm:w-60 mt-1.5 rounded-xl shadow-2xl overflow-hidden border max-h-60 overflow-y-auto styled-scrollbar-thin 
                    ${isDarkMode ? 'bg-slate-800/90 backdrop-blur-sm border-slate-700' : 'bg-white/90 backdrop-blur-sm border-slate-200'}` // Enhanced dropdown panel
                  }
                >
                  {teamsForFilter.map((team) => (
                    <li key={team.TEAMID}>
                      <button
                        onClick={() => {
                          handleTeamFilterChange({ target: { value: String(team.TEAMID) } });
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm transition-colors duration-150
                          ${isDarkMode
                            ? String(selectedTeamFilter) === String(team.TEAMID)
                              ? 'bg-indigo-600 text-white' // Brighter active selection
                              : 'text-slate-200 hover:bg-slate-700'
                            : String(selectedTeamFilter) === String(team.TEAMID)
                              ? 'bg-indigo-500 text-white'
                              : 'text-slate-700 hover:bg-indigo-100'}`
                          }
                      >
                        {team.TEAMNAME}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setShowImportModal(true);
                triggerHapticFeedback(ImpactStyle.Light);
              }}
              className={`flex items-center px-3.5 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 flex-grow xs:flex-grow-0
                ${isDarkMode ? 'bg-sky-500 hover:bg-sky-400 text-white focus-visible:ring-sky-500 focus-visible:ring-offset-slate-900' 
                              : 'bg-sky-600 hover:bg-sky-700 text-white focus-visible:ring-sky-600 focus-visible:ring-offset-white' // Consistent primary action
                }
              `}
              title="Zeitplan importieren"
            >
              <Upload size={14} sm:size={16} className="mr-1.5 sm:mr-2" /> {/* Adjusted icon margin */}
              Importieren
            </button>
          )}
          <button
            onClick={() => {
              handleExportToExcel();
              triggerHapticFeedback(ImpactStyle.Light);
            }}
            className={`flex items-center px-3.5 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95 flex-grow xs:flex-grow-0
              ${isDarkMode ? 'bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:ring-emerald-500 focus-visible:ring-offset-slate-900' 
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white focus-visible:ring-emerald-500 focus-visible:ring-offset-white' // Consistent secondary action
              }
            `}
            title="Zeitplan exportieren"
          >
            <FileDown size={14} sm:size={16} className="mr-1.5 sm:mr-2" /> {/* Adjusted icon margin */}
            Exportieren
          </button>
        </motion.div>
      </div>
      {/* Import Status Messages */}
      <AnimatePresence>
        {importSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: {delay: 0.2} }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-3 p-2.5 rounded-md text-xs flex items-center shadow
              ${isDarkMode ? 'bg-green-500/25 text-green-300 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-200'}`}
          >
            <CheckCircle size={16} className="mr-2 flex-shrink-0" />
            {importSuccess}
          </motion.div>
        )}
        {importError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0, transition: {delay: 0.2} }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-3 p-2.5 rounded-md text-xs flex items-center shadow
              ${isDarkMode ? 'bg-red-500/25 text-red-300 border border-red-500/30' : 'bg-red-100 text-red-700 border border-red-200'}`}
          >
            <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
            {importError}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default ZeitplanPage; 