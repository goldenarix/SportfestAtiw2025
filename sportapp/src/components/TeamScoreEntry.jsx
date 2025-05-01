import React, { useState, useEffect } from 'react';
import { Search, Save, X, CheckCircle, Users } from 'lucide-react';
import { useDataContext } from '../..backend/DataContext';



const TeamScoreEntry = ({ disziplinId, disziplinName = "Unbekannte Disziplin" }) => {
  const { teams, loading, error } = useDataContext(); // Teams aus dem Context 🔥
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState(null);

  const filteredTeams = teams.filter(team =>
    team.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.TEAMID.toString().includes(searchTerm)
  );

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setSearchTerm('');
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();

    try {
      const ergebnisData = {
        TEAMID: selectedTeam.TEAMID,
        DISZIPLINID: disziplinId,
        PUNKTE: parseFloat(score),
        DATUM: new Date().toISOString().split('T')[0],
        KOMMENTAR: notes
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/ergebnisse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ergebnisData),
      });

      const result = await response.json();

      if (result.success) {
        setNotification({
          type: 'success',
          message: `Punkte für Team ${selectedTeam.NAME} erfolgreich gespeichert.`
        });

        setTimeout(() => {
          setSelectedTeam(null);
          setScore('');
          setNotes('');
          setNotification(null);
        }, 3000);
      } else {
        throw new Error(result.error || 'Fehler beim Speichern');
      }
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      setNotification({
        type: 'error',
        message: `Fehler: ${err.message}`
      });
    }
  };

  const handleCancel = () => {
    setSelectedTeam(null);
    setScore('');
    setNotes('');
  };


  if (loading) {
    return (
      <div className="rounded-lg border bg-white shadow-sm p-6">
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
          <span className="ml-3 text-slate-500">Teams werden geladen...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-white shadow-sm p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Fehler beim Laden der Teams: {error}
              </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white dark:bg-slate-800 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">Punkteeingabe: {disziplinName}</h2>
        
        {notification && (
          <div className={`mb-4 p-3 rounded-md flex items-center ${
            notification.type === 'success' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 
            'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {notification.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-2" /> : 
              <X className="h-5 w-5 mr-2" />
            }
            {notification.message}
          </div>
        )}
        
        {!selectedTeam ? (
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Team suchen (Name oder ID)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 pl-10 pr-4 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div className={`max-h-80 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-600 ${teams.length === 0 ? 'hidden' : ''}`}>
              {searchTerm.length > 0 && filteredTeams.length === 0 ? (
                <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                  Keine Teams gefunden
                </div>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredTeams.map(team => (
                    <li 
                      key={team.TEAMID}
                      onClick={() => handleTeamSelect(team)}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold mr-4">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">{team.NAME || `Team ${team.TEAMID}`}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400">ID: {team.TEAMID}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {teams.length === 0 && (
              <div className="text-center p-6 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                <Users size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-slate-600 dark:text-slate-300">Keine Teams verfügbar. Bitte Teams zuerst anlegen.</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleScoreSubmit}>
            <div className="mb-6 p-4 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold mr-4">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">{selectedTeam.NAME || `Team ${selectedTeam.TEAMID}`}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">ID: {selectedTeam.TEAMID}</span>
                    </div>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={handleCancel}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Punkte</label>
              <input 
                type="number" 
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                min="0"
                max="100"
                step="0.1"
                placeholder="0-100"
                className="h-10 w-full rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Punktzahl zwischen 0 und 100</p>
              
              {/* Score Slider */}
              <div className="mt-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={score || 0}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notizen (optional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                placeholder="Zusätzliche Infos zur Leistung..."
                className="w-full rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              ></textarea>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button 
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 h-10 px-4 py-2"
              >
                <X className="mr-2 h-4 w-4" />
                Abbrechen
              </button>
              
              <button 
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
                disabled={!score}
              >
                <Save className="mr-2 h-4 w-4" />
                Punkte speichern
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeamScoreEntry;
