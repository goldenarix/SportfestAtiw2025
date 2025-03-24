import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSportfest } from '../../hooks/useSportfest'
import StationCard from '../../components/stations/StationCard'
import StationModal from '../../components/stations/StationModal'
import './StationsOverview.css'

function StationsOverview() {
  const { stations, loading, addStation, deleteStation } = useSportfest()
  const [searchQuery, setSearchQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  // Filter stations based on search query
  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.location.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleAddStation = (stationData) => {
    addStation(stationData)
    setModalOpen(false)
  }
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Lade Stationen...</p>
      </div>
    )
  }
  
  return (
    <div className="stations-page">
      <div className="page-header">
        <h1>Stationen</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setModalOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Neue Station
        </button>
      </div>
      
      <div className="stations-toolbar">
        <div className="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Stationen durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="view-options">
          <button 
            className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Gitteransicht"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          
          <button 
            className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Listenansicht"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
      
      {filteredStations.length > 0 ? (
        <div className={`stations-container ${viewMode}`}>
          {filteredStations.map(station => (
            <StationCard
              key={station.id}
              station={station}
              viewMode={viewMode}
              onDelete={() => deleteStation(station.id)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 21v-3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
              <path d="M11 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
              <path d="m21 7-.71.71A4 4 0 0 1 16 10a4 4 0 0 1-4-4 4 4 0 0 1 .71-2.29L13 3"></path>
              <path d="m21 3-6 6"></path>
            </svg>
          </div>
          <h2>Keine Stationen gefunden</h2>
          {searchQuery ? (
            <p>Keine Stationen entsprechen der Suche "{searchQuery}"</p>
          ) : (
            <p>Es wurden noch keine Stationen erstellt</p>
          )}
          <button 
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            Station erstellen
          </button>
        </div>
      )}
      
      <StationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddStation}
      />
    </div>
  )
}

export default StationsOverview