import { useState } from 'react'
import { Link } from 'react-router-dom'
import './StationCard.css'

function StationCard({ station, viewMode, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  
  const handleDeleteClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (confirmDelete) {
      onDelete()
      setConfirmDelete(false)
    } else {
      setConfirmDelete(true)
    }
  }
  
  const cancelDelete = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setConfirmDelete(false)
  }
  
  // Get icon based on station type
  const getStationIcon = (scoreType) => {
    switch (scoreType) {
      case 'distance':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12h20"></path>
            <path d="M20 16V8"></path>
            <path d="M16 12V9"></path>
            <path d="M12 12v-1"></path>
            <path d="M8 12v-1"></path>
            <path d="M4 12V8"></path>
          </svg>
        )
      case 'time':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        )
      case 'count':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="9" x2="20" y2="9"></line>
            <line x1="4" y1="15" x2="20" y2="15"></line>
            <line x1="10" y1="3" x2="8" y2="21"></line>
            <line x1="16" y1="3" x2="14" y2="21"></line>
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 21v-3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
            <path d="M11 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
            <path d="m21 7-.71.71A4 4 0 0 1 16 10a4 4 0 0 1-4-4 4 4 0 0 1 .71-2.29L13 3"></path>
            <path d="m21 3-6 6"></path>
          </svg>
        )
    }
  }
  
  if (viewMode === 'grid') {
    return (
      <Link to={`/stations/${station.id}`} className="station-card">
        <div className="station-icon">
          {getStationIcon(station.scoreType)}
        </div>
        <h3 className="station-name">{station.name}</h3>
        <p className="station-description">{station.description}</p>
        <div className="station-details">
          <div className="station-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{station.location}</span>
          </div>
          <div className="station-score-type">
            <span className="label">Bewertung:</span> 
            <span className="value">{station.scoreUnit}</span>
          </div>
        </div>
        <div className="station-actions">
          <Link to={`/stations/${station.id}`} className="btn btn-sm btn-outline">
            Details
          </Link>
          {confirmDelete ? (
            <div className="confirm-actions">
              <button
                className="btn btn-sm btn-error"
                onClick={handleDeleteClick}
              >
                Bestätigen
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={cancelDelete}
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-outline delete-btn"
              onClick={handleDeleteClick}
            >
              Löschen
            </button>
          )}
        </div>
      </Link>
    )
  } else {
    // List view
    return (
      <Link to={`/stations/${station.id}`} className="station-list-item">
        <div className="station-list-icon">
          {getStationIcon(station.scoreType)}
        </div>
        <div className="station-list-content">
          <h3 className="station-name">{station.name}</h3>
          <p className="station-description">{station.description}</p>
        </div>
        <div className="station-list-details">
          <div className="station-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{station.location}</span>
          </div>
          <div className="station-score-type">
            <span className="label">Bewertung:</span> 
            <span className="value">{station.scoreUnit}</span>
          </div>
        </div>
        <div className="station-list-actions">
          {confirmDelete ? (
            <div className="confirm-actions">
              <button
                className="btn btn-sm btn-error"
                onClick={handleDeleteClick}
              >
                Bestätigen
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={cancelDelete}
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-outline delete-btn"
              onClick={handleDeleteClick}
            >
              Löschen
            </button>
          )}
        </div>
      </Link>
    )
  }
}

export default StationCard