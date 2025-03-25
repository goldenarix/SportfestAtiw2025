import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, X, Check, Users, Flag, Clock, Save, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';


const ScoreEntryPage = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [score, setScore] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Mock station data
  const station = {
    id: parseInt(id),
    name: 'Staffellauf',
    location: 'Nordfeld',
    maxPoints: 100,
  };
  
  // Mock participants data
  const participants = [
    { id: 1, name: 'Max Mustermann', team: 'Team Rot', group: 'Klasse 10a', avatar: '/api/placeholder/40/40' },
    { id: 2, name: 'Laura Schmidt', team: 'Team Blau', group: 'Klasse 10a', avatar: '/api/placeholder/40/40' },
    { id: 3, name: 'Tim Meyer', team: 'Team Grün', group: 'Klasse 10b', avatar: '/api/placeholder/40/40' },
    { id: 4, name: 'Sophie Weber', team: 'Team Gelb', group: 'Klasse 10b', avatar: '/api/placeholder/40/40' },
    { id: 5, name: 'Jan Schulz', team: 'Team Rot', group: 'Klasse 10c', avatar: '/api/placeholder/40/40' },
  ];
  
  // Filter participants based on search term
  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
    participant.id.toString().includes(searchTerm)
  );
  
  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
    setSearchTerm('');
  };
  
  const handleReset = () => {
    setSelectedParticipant(null);
    setScore('');
    setNotes('');
    setSubmitted(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };
  
  return (
    <motion.div 
      className="p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to={`/stations/${id}`} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Zurück
        </Link>
        <div className="mx-auto text-center">
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Punkteeingabe: {station.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center mt-1">
            <Flag className="h-4 w-4 mr-1" /> {station.location}
          </p>
        </div>
        <div className="w-20"></div> {/* Spacer to center title */}
      </div>
      
      {/* Success Message */}
      {submitted && (
        <motion.div 
          className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start">
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center mr-3 flex-shrink-0">
              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            </div>
            <div>
              <h3 className="font-medium text-emerald-800 dark:text-emerald-200">Erfolgreich gespeichert!</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                Die Punkte für {selectedParticipant.name} wurden erfolgreich eingetragen.
              </p>
              <button 
                onClick={handleReset}
                className="mt-3 px-4 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-sm font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/50 transition-colors"
              >
                Neue Punkteeingabe
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Main Content */}
      {!submitted && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Participant Selection */}
          <div className="md:col-span-1">
            <motion.div 
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <Users className="h-5 w-5 text-indigo-500 mr-2" />
                  Teilnehmer auswählen
                </h2>
                
                {!selectedParticipant ? (
                  <>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        placeholder="Name, Team oder Klasse..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                      />
                    </div>
                    
                    <div className={`
                      max-h-80 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700
                      ${searchTerm ? '' : 'hidden'}
                    `}>
                      {filteredParticipants.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                          Keine Teilnehmer gefunden
                        </div>
                      ) : (
                        <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                          {filteredParticipants.map(participant => (
                            <li 
                              key={participant.id}
                              onClick={() => handleParticipantSelect(participant)}
                              className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                                  <img 
                                    src={participant.avatar} 
                                    alt={participant.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium text-slate-900 dark:text-white">{participant.name}</h4>
                                  <div className="flex items-center mt-1">
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full mr-2">
                                      {participant.team}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {participant.group}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    {!searchTerm && (
                      <div className="text-center py-8 px-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                          <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Teilnehmer suchen</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Suche nach einem Teilnehmer, um Punkte einzutragen
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={selectedParticipant.avatar} 
                          alt={selectedParticipant.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 dark:text-white">{selectedParticipant.name}</h4>
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full mr-2">
                            {selectedParticipant.team}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {selectedParticipant.group}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={handleReset}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600/50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
          {/* Score Entry Form */}
          <div className="md:col-span-2">
            {selectedParticipant ? (
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="p-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                    <Award className="h-5 w-5 text-indigo-500 mr-2" />
                    Punkte eintragen
                  </h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Station</label>
                        <div className="flex items-center h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 text-slate-800 dark:text-slate-200">
                          <Flag className="h-4 w-4 text-slate-400 mr-2" />
                          {station.name}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Datum & Uhrzeit</label>
                        <div className="flex items-center h-10 px-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 text-slate-800 dark:text-slate-200">
                          <Clock className="h-4 w-4 text-slate-400 mr-2" />
                          {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Punkte (max. {station.maxPoints})
                      </label>
                      <input 
                        type="number" 
                        min="0" 
                        max={station.maxPoints}
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="h-12 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 text-lg font-medium focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        required
                      />
                      
                      {/* Score Slider */}
                      <div className="mt-4">
                        <input 
                          type="range" 
                          min="0" 
                          max={station.maxPoints} 
                          value={score || 0}
                          onChange={(e) => setScore(e.target.value)}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span>0</span>
                          <span>{Math.floor(station.maxPoints / 2)}</span>
                          <span>{station.maxPoints}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Notizen (optional)
                      </label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        placeholder="Zusätzliche Informationen zur Leistung..."
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        type="button"
                        onClick={handleReset}
                        className="py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Abbrechen
                      </button>
                      
                      <button 
                        type="submit"
                        disabled={isSubmitting || !score}
                        className={`
                          py-2 px-6 bg-indigo-600 text-white rounded-lg font-medium flex items-center
                          ${isSubmitting || !score 
                            ? 'opacity-70 cursor-not-allowed' 
                            : 'hover:bg-indigo-700 hover:shadow-md'}
                          transition-all
                        `}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Speichern...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Punkte speichern
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center justify-center h-full min-h-[300px] p-6">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                      <Award className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Bereit für die Punkteeingabe</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md">
                      Bitte wähle zunächst einen Teilnehmer aus der Liste links aus, um Punkte einzutragen.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ScoreEntryPage;