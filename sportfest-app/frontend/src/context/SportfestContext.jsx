import { createContext, useState, useEffect } from 'react';

// Create Sportfest Context
export const SportfestContext = createContext();

export const SportfestProvider = ({ children }) => {
  // Sample data for the application
  const [stations, setStations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Load sample data on mount
  useEffect(() => {
    // Check if we're in browser environment
    const isClient = typeof window !== 'undefined';
    
    if (isClient) {
      try {
        // Load sample data from localStorage if available
        const savedStations = localStorage.getItem('sportfestStations');
        const savedParticipants = localStorage.getItem('sportfestParticipants');
        const savedScores = localStorage.getItem('sportfestScores');
        
        if (savedStations) {
          setStations(JSON.parse(savedStations));
        } else {
          // Demo stations data
          const demoStations = [
            { 
              id: '1', 
              name: 'Weitsprung', 
              description: 'Sprungweite in Metern messen',
              location: 'Sportplatz - Weitsprunggrube',
              scoreType: 'distance', // Measures in meters
              scoreUnit: 'm',
              minScore: 0,
              maxScore: 10
            },
            { 
              id: '2', 
              name: 'Sprint 100m', 
              description: 'Zeit für 100m Sprint in Sekunden',
              location: 'Sportplatz - Laufbahn',
              scoreType: 'time', // Lower is better
              scoreUnit: 's',
              minScore: 0,
              maxScore: 30
            },
            { 
              id: '3', 
              name: 'Kugelstoßen', 
              description: 'Weite in Metern messen',
              location: 'Sportplatz - Kugelstoßanlage',
              scoreType: 'distance', // Measures in meters
              scoreUnit: 'm',
              minScore: 0,
              maxScore: 25
            },
            { 
              id: '4', 
              name: 'Basketball-Freiwürfe', 
              description: 'Anzahl erfolgreicher Würfe aus 10 Versuchen',
              location: 'Sporthalle - Basketballfeld',
              scoreType: 'count', // Higher is better
              scoreUnit: 'Treffer',
              minScore: 0,
              maxScore: 10
            },
            { 
              id: '5', 
              name: 'Hindernislauf', 
              description: 'Zeit für Hindernislauf in Sekunden',
              location: 'Sportplatz - Hindernisparcours',
              scoreType: 'time', // Lower is better
              scoreUnit: 's',
              minScore: 0,
              maxScore: 120
            }
          ];
          
          setStations(demoStations);
          try {
            localStorage.setItem('sportfestStations', JSON.stringify(demoStations));
          } catch (error) {
            console.error('Error saving to localStorage:', error);
          }
        }
        
        if (savedParticipants) {
          setParticipants(JSON.parse(savedParticipants));
        } else {
          // Demo participants data
          const demoParticipants = [
            { 
              id: '1', 
              firstName: 'Max', 
              lastName: 'Mustermann',
              teamId: '1',
              teamName: 'Klasse 10a',
              age: 16,
              gender: 'männlich'
            },
            { 
              id: '2', 
              firstName: 'Anna', 
              lastName: 'Schmidt',
              teamId: '1',
              teamName: 'Klasse 10a',
              age: 16,
              gender: 'weiblich'
            },
            { 
              id: '3', 
              firstName: 'Leon', 
              lastName: 'Müller',
              teamId: '2',
              teamName: 'Klasse 10b',
              age: 16,
              gender: 'männlich'
            },
            { 
              id: '4', 
              firstName: 'Julia', 
              lastName: 'Weber',
              teamId: '2',
              teamName: 'Klasse 10b',
              age: 16,
              gender: 'weiblich'
            },
            { 
              id: '5', 
              firstName: 'Finn', 
              lastName: 'Fischer',
              teamId: '3',
              teamName: 'Klasse 10c',
              age: 16,
              gender: 'männlich'
            }
          ];
          
          setParticipants(demoParticipants);
          try {
            localStorage.setItem('sportfestParticipants', JSON.stringify(demoParticipants));
          } catch (error) {
            console.error('Error saving to localStorage:', error);
          }
        }
        
        if (savedScores) {
          setScores(JSON.parse(savedScores));
        } else {
          // Generate some random scores for demo purposes
          const demoScores = [
            { id: '1', participantId: '1', stationId: '1', score: 4.25, timestamp: new Date().toISOString() },
            { id: '2', participantId: '1', stationId: '2', score: 12.7, timestamp: new Date().toISOString() },
            { id: '3', participantId: '2', stationId: '1', score: 3.8, timestamp: new Date().toISOString() },
            { id: '4', participantId: '2', stationId: '3', score: 8.3, timestamp: new Date().toISOString() },
            { id: '5', participantId: '3', stationId: '4', score: 7, timestamp: new Date().toISOString() },
            { id: '6', participantId: '4', stationId: '5', score: 45.2, timestamp: new Date().toISOString() },
            { id: '7', participantId: '5', stationId: '2', score: 13.1, timestamp: new Date().toISOString() },
          ];
          
          setScores(demoScores);
          try {
            localStorage.setItem('sportfestScores', JSON.stringify(demoScores));
          } catch (error) {
            console.error('Error saving to localStorage:', error);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // In case of error, set some default empty arrays
        setStations([]);
        setParticipants([]);
        setScores([]);
      }
    }
    
    // Simulate loading delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);
  
  // Add a new station
  const addStation = (station) => {
    const newStation = {
      ...station,
      id: Date.now().toString(),
    };
    
    const updatedStations = [...stations, newStation];
    setStations(updatedStations);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestStations', JSON.stringify(updatedStations));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    return newStation;
  };
  
  // Update a station
  const updateStation = (stationId, updatedData) => {
    const updatedStations = stations.map(station => 
      station.id === stationId ? { ...station, ...updatedData } : station
    );
    
    setStations(updatedStations);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestStations', JSON.stringify(updatedStations));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    return updatedStations.find(station => station.id === stationId);
  };
  
  // Delete a station
  const deleteStation = (stationId) => {
    const updatedStations = stations.filter(station => station.id !== stationId);
    setStations(updatedStations);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestStations', JSON.stringify(updatedStations));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    // Also remove any scores associated with this station
    const updatedScores = scores.filter(score => score.stationId !== stationId);
    setScores(updatedScores);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestScores', JSON.stringify(updatedScores));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  };
  
  // Add a new participant
  const addParticipant = (participant) => {
    const newParticipant = {
      ...participant,
      id: Date.now().toString(),
    };
    
    const updatedParticipants = [...participants, newParticipant];
    setParticipants(updatedParticipants);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestParticipants', JSON.stringify(updatedParticipants));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    return newParticipant;
  };
  
  // Update a participant
  const updateParticipant = (participantId, updatedData) => {
    const updatedParticipants = participants.map(participant => 
      participant.id === participantId ? { ...participant, ...updatedData } : participant
    );
    
    setParticipants(updatedParticipants);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestParticipants', JSON.stringify(updatedParticipants));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    return updatedParticipants.find(participant => participant.id === participantId);
  };
  
  // Delete a participant
  const deleteParticipant = (participantId) => {
    const updatedParticipants = participants.filter(participant => participant.id !== participantId);
    setParticipants(updatedParticipants);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestParticipants', JSON.stringify(updatedParticipants));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    // Also remove any scores associated with this participant
    const updatedScores = scores.filter(score => score.participantId !== participantId);
    setScores(updatedScores);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestScores', JSON.stringify(updatedScores));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  };
  
  // Add or update a score
  const recordScore = (scoreData) => {
    // Check if this participant already has a score for this station
    const existingScoreIndex = scores.findIndex(
      score => score.participantId === scoreData.participantId && score.stationId === scoreData.stationId
    );
    
    let updatedScores;
    
    if (existingScoreIndex >= 0) {
      // Update existing score
      updatedScores = [...scores];
      updatedScores[existingScoreIndex] = {
        ...updatedScores[existingScoreIndex],
        score: scoreData.score,
        timestamp: new Date().toISOString()
      };
    } else {
      // Add new score
      const newScore = {
        id: Date.now().toString(),
        participantId: scoreData.participantId,
        stationId: scoreData.stationId,
        score: scoreData.score,
        timestamp: new Date().toISOString()
      };
      
      updatedScores = [...scores, newScore];
    }
    
    setScores(updatedScores);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sportfestScores', JSON.stringify(updatedScores));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
    
    return updatedScores;
  };
  
  // Calculate participant overall ranking
  const getParticipantRankings = () => {
    const stationMap = stations.reduce((map, station) => {
      map[station.id] = station;
      return map;
    }, {});
    
    // Calculate points for each participant based on their scores
    const participantPoints = participants.map(participant => {
      let totalPoints = 0;
      let stationsCompleted = 0;
      
      // Get all scores for this participant
      const participantScores = scores.filter(score => score.participantId === participant.id);
      
      // Calculate points for each station score
      participantScores.forEach(score => {
        const station = stationMap[score.stationId];
        
        if (station) {
          stationsCompleted++;
          
          // Different calculation based on score type
          if (station.scoreType === 'time') {
            // For time, lower is better
            // Formula: (maxScore - score) / (maxScore - minScore) * 10
            // Clamped between 0 and 10
            const scoreRange = station.maxScore - station.minScore;
            const points = Math.max(0, Math.min(10, ((station.maxScore - score.score) / scoreRange) * 10));
            totalPoints += points;
          } else {
            // For distance and count, higher is better
            // Formula: (score - minScore) / (maxScore - minScore) * 10
            // Clamped between 0 and 10
            const scoreRange = station.maxScore - station.minScore;
            const points = Math.max(0, Math.min(10, ((score.score - station.minScore) / scoreRange) * 10));
            totalPoints += points;
          }
        }
      });
      
      return {
        ...participant,
        totalPoints,
        stationsCompleted,
        averagePoints: stationsCompleted > 0 ? totalPoints / stationsCompleted : 0
      };
    });
    
    // Sort by totalPoints (descending)
    return participantPoints.sort((a, b) => b.totalPoints - a.totalPoints);
  };
  
  // Get team rankings
  const getTeamRankings = () => {
    const participantRankings = getParticipantRankings();
    
    // Group by team
    const teamMap = {};
    
    participantRankings.forEach(participant => {
      if (!teamMap[participant.teamId]) {
        teamMap[participant.teamId] = {
          teamId: participant.teamId,
          teamName: participant.teamName,
          totalPoints: 0,
          participantCount: 0,
          stationsCompleted: 0
        };
      }
      
      teamMap[participant.teamId].totalPoints += participant.totalPoints;
      teamMap[participant.teamId].participantCount += 1;
      teamMap[participant.teamId].stationsCompleted += participant.stationsCompleted;
    });
    
    // Convert to array and calculate averages
    const teamRankings = Object.values(teamMap).map(team => ({
      ...team,
      averagePoints: team.participantCount > 0 ? team.totalPoints / team.participantCount : 0,
      averageStationsCompleted: team.participantCount > 0 ? team.stationsCompleted / team.participantCount : 0
    }));
    
    // Sort by totalPoints (descending)
    return teamRankings.sort((a, b) => b.totalPoints - a.totalPoints);
  };
  
  // Context value
  const value = {
    stations,
    participants,
    scores,
    loading,
    addStation,
    updateStation,
    deleteStation,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    recordScore,
    getParticipantRankings,
    getTeamRankings
  };
  
  return (
    <SportfestContext.Provider value={value}>
      {children}
    </SportfestContext.Provider>
  );
};