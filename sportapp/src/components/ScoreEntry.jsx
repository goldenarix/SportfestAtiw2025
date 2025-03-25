import React, { useState } from 'react';
import { Search, Save, X, CheckCircle } from 'lucide-react';

const ScoreEntry = ({ stationId = 1, stationName = "Staffellauf" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState(null);

  // Mock participant data
  const participants = [
    { id: 101, name: 'Max Schmidt', team: 'Team Blau', age: 15 },
    { id: 102, name: 'Jana Weber', team: 'Team Rot', age: 16 },
    { id: 103, name: 'Tim Müller', team: 'Team Gelb', age: 15 },
    { id: 104, name: 'Sophia Klein', team: 'Team Grün', age: 14 },
    { id: 105, name: 'Niklas Berg', team: 'Team Blau', age: 16 },
  ];

  // Filter participants based on search term
  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.id.toString().includes(searchTerm)
  );

  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
    setSearchTerm('');
  };

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    
    // Here you would handle the actual score submission to the backend
    console.log('Submitting score:', {
      stationId,
      participantId: selectedParticipant.id,
      score: parseFloat(score),
      notes
    });
    
    // Show success notification
    setNotification({
      type: 'success',
      message: `Punkte für ${selectedParticipant.name} erfolgreich gespeichert.`
    });
    
    // Reset form after submission
    setTimeout(() => {
      setSelectedParticipant(null);
      setScore('');
      setNotes('');
      setNotification(null);
    }, 3000);
  };

  const handleCancel = () => {
    setSelectedParticipant(null);
    setScore('');
    setNotes('');
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Punkteeingabe: {stationName}</h2>
        
        {notification && (
          <div className={`mb-4 p-3 rounded-md flex items-center ${
            notification.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {notification.type === 'success' ? 
              <CheckCircle className="h-5 w-5 mr-2" /> : 
              <X className="h-5 w-5 mr-2" />
            }
            {notification.message}
          </div>
        )}
        
        {!selectedParticipant ? (
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Teilnehmer suchen (Name, ID oder Team)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <div className="max-h-80 overflow-y-auto rounded-md border border-slate-200">
              {searchTerm.length > 0 && filteredParticipants.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  Keine Teilnehmer gefunden
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {filteredParticipants.map(participant => (
                    <li 
                      key={participant.id}
                      onClick={() => handleParticipantSelect(participant)}
                      className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold mr-4">
                          {participant.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-slate-500 mr-3">ID: {participant.id}</span>
                            <span className="text-xs bg-slate-100 rounded-full px-2 py-0.5">{participant.team}</span>
                            <span className="text-xs ml-2">{participant.age} Jahre</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleScoreSubmit}>
            <div className="mb-6 p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold mr-4">
                  {selectedParticipant.name.substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{selectedParticipant.name}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-slate-500 mr-3">ID: {selectedParticipant.id}</span>
                    <span className="text-xs bg-slate-100 rounded-full px-2 py-0.5">{selectedParticipant.team}</span>
                    <span className="text-xs ml-2">{selectedParticipant.age} Jahre</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Punkte</label>
              <input 
                type="number" 
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                min="0"
                max="100"
                step="0.1"
                placeholder="0-100"
                className="h-10 w-full rounded-md border border-slate-200 px-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="mt-1 text-xs text-slate-500">Punktzahl zwischen 0 und 100</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Notizen (optional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                placeholder="Zusätzliche Infos zur Leistung..."
                className="w-full rounded-md border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              ></textarea>
            </div>
            
            <div className="flex items-center justify-end space-x-4">
              <button 
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 hover:bg-slate-100 h-10 px-4 py-2"
              >
                <X className="mr-2 h-4 w-4" />
                Abbrechen
              </button>
              
              <button 
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2"
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

export default ScoreEntry;