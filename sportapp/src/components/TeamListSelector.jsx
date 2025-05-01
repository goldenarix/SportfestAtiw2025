import React, { useState, useEffect } from 'react';
import { Users, Search, X, CheckCircle, Filter, ChevronDown } from 'lucide-react';
import { useDataContext } from '../..backend/DataContext';

import React, { useState, useEffect } from 'react';
import { Users, Search, X, CheckCircle, Filter, ChevronDown } from 'lucide-react';
import { useDataContext } from '../../backend/DataContext'; // Pfad ggf. anpassen!

const TeamListSelector = ({ onTeamSelect, selectedTeamId = null, placeholder = "Team auswählen" }) => {
  const { teams, loading, error } = useDataContext(); // 🔥 Kontextbasiert
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  // Filter bei Änderungen
  useEffect(() => {
    if (!loading && teams.length > 0) {
      const teamList = [...teams]; // Deep copy for safety

      // Setzt Default-Auswahl falls vorhanden
      if (selectedTeamId && !selectedTeam) {
        const found = teamList.find(t => t.TEAMID === selectedTeamId);
        if (found) setSelectedTeam(found);
      }

      // Initiales Filterset
      setFilteredTeams(teamList);
    }
  }, [teams, selectedTeamId, loading]);

  // Dynamisches Filtern (Search + Kategorie)
  useEffect(() => {
    let result = [...teams];

    if (searchTerm) {
      result = result.filter(team =>
        team.NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.TEAMID.toString().includes(searchTerm)
      );
    }

    if (filter !== 'all') {
      // Beispiel (du kannst hier echte Kategorien verwenden!)
      result = result.filter(team => team.KLASSE === filter); // Optional
    }

    setFilteredTeams(result);
  }, [searchTerm, filter, teams]);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setIsOpen(false);
    setSearchTerm('');
    onTeamSelect?.(team);
  };

  const handleClearSelection = () => {
    setSelectedTeam(null);
    onTeamSelect?.(null);
  };

  const getUniqueCategories = () => {
    const unique = new Set();
    teams.forEach(t => {
      if (t.KLASSE) unique.add(t.KLASSE);
    });
    return Array.from(unique);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <div
        className="relative flex items-center w-full p-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedTeam ? (
          <div className="flex items-center justify-between w-full pr-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mr-2">
                <Users size={16} />
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">{selectedTeam.NAME || `Team ${selectedTeam.TEAMID}`}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">ID: {selectedTeam.TEAMID}</p>
              </div>
            </div>
            <button
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-600"
              onClick={(e) => {
                e.stopPropagation();
                handleClearSelection();
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center flex-1">
              <Search className="h-4 w-4 text-slate-400 mr-2" />
              <span className="text-slate-500 dark:text-slate-400">{placeholder}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg overflow-hidden">
          {/* Suchleiste und Filter */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 w-full rounded pl-8 pr-3 text-sm border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Suchen..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-8 w-full rounded pl-2 pr-8 text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="all">Alle Teams</option>
                  {getUniqueCategories().map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              </div>
            </div>
          </div>

          {/* Teamliste */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="inline-block h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">Teams werden geladen...</span>
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500 dark:text-red-400 text-sm">
                Fehler: {error}
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                Keine Teams gefunden
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredTeams.map(team => (
                  <li
                    key={team.TEAMID}
                    className={`p-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${
                      selectedTeam?.TEAMID === team.TEAMID ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                    }`}
                    onClick={() => handleTeamSelect(team)}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mr-2">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">{team.NAME || `Team ${team.TEAMID}`}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">ID: {team.TEAMID}</p>
                      </div>
                      {selectedTeam?.TEAMID === team.TEAMID && (
                        <CheckCircle className="h-4 w-4 text-indigo-500 ml-auto" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamListSelector;
