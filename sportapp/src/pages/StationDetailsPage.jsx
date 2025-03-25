import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Activity, Flag, Play, Calendar, Clock, Award, Edit, Trash, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

import staffellaufImg from '../assets/staffellauf.jpg';
import weitsprungImg from '../assets/weitsprung.jpg';
import kugelstoessenImg from '../assets/kugelstoßen.jpg';
import hochsprungImg from '../assets/hochsprung.jpg';
import sprintImg from '../assets/sprint.jpg';


const StationDetailsPage = () => {
  const { id } = useParams();
  
  // Mock station data
  const station = {
    id: parseInt(id),
    name: 'Staffellauf',
    location: 'Nordfeld',
    status: 'active',
    description: 'Eine klassische Staffellauf-Station, bei der Teams nacheinander einen Parcours absolvieren müssen. Die Zeit wird gestoppt und in Punkte umgerechnet.',
    image: staffellaufImg,
    organizer: 'Max Mustermann',
    contactEmail: 'max@sportfest.de',
    eventTimes: ['10:00', '12:30', '14:45'],
    totalParticipants: 64,
    maxPoints: 100,
    pointsCalculation: 'Basierend auf Zeit: < 1:00 min = 100 Punkte, < 1:30 min = 90 Punkte, < 2:00 min = 80 Punkte, usw.',
    equipment: ['Staffelstäbe', 'Stoppuhren', 'Markierungshütchen', 'Startpistole'],
    nextEvent: '14:30',
    createdAt: '2025-03-01',
  };
  
  return (
    <motion.div 
      className="p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with Image */}
      <div className="flex items-center mb-4">
        <Link to="/stations" className="flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Zurück
        </Link>
      </div>
      
      <div className="relative rounded-2xl overflow-hidden mb-8 h-64 md:h-80 bg-gradient-to-r from-indigo-500 to-purple-600">
        <img 
          src={station.image} 
          alt={station.name} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3
                ${station.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-400' 
                  : station.status === 'inactive'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-400'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-400'}
              `}>
                {station.status === 'active' ? 'Aktiv' : station.status === 'inactive' ? 'Inaktiv' : 'Geplant'}
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white">{station.name}</h1>
              <p className="text-white/80 mt-1 flex items-center">
                <Flag className="w-4 h-4 mr-1" /> {station.location}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to={`/stations/${id}/score`}
                className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors flex items-center shadow-lg"
              >
                <Check className="w-4 h-4 mr-2" /> Punkte eintragen
              </Link>
              <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center shadow-lg">
                <Play className="w-4 h-4 mr-2" /> Station starten
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Beschreibung</h2>
              <p className="text-slate-600 dark:text-slate-300">{station.description}</p>
            </div>
          </motion.div>
          
          {/* Equipment */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Benötigte Ausrüstung</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {station.equipment.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div>
                    <span className="text-slate-600 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* Points Calculation */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Punkteberechnung</h2>
              <div className="bg-slate-50 dark:bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Award className="h-5 w-5 text-indigo-500 mr-2" />
                  <span className="text-lg font-medium text-slate-900 dark:text-white">Maximale Punkte: {station.maxPoints}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{station.pointsCalculation}</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Station Stats */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Station Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Teilnehmer</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{station.totalParticipants} registriert</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Erstellt am</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{station.createdAt}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white">Status</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{station.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Event Times */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Veranstaltungszeiten</h2>
              
              <div className="space-y-3">
                {station.eventTimes.map((time, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0">
                      <Clock className="h-3 w-3" />
                    </div>
                    <span className="text-slate-800 dark:text-slate-200">{time} Uhr</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Organizer */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Organisator</h2>
              
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 flex-shrink-0 overflow-hidden">
                  <img src="/api/placeholder/40/40" alt="Organizer" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-900 dark:text-white">{station.organizer}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{station.contactEmail}</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Actions */}
          <motion.div 
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Aktionen</h2>
              
              <div className="space-y-3">
                <button className="w-full py-2 px-4 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <Edit className="h-4 w-4 mr-2" /> Station bearbeiten
                </button>
                
                <button className="w-full py-2 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <Trash className="h-4 w-4 mr-2" /> Station löschen
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default StationDetailsPage;