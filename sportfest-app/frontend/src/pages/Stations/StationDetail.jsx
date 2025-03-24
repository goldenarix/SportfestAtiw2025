import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSportfest } from '../../hooks/useSportfest'
import StationModal from '../../components/stations/StationModal'
import ScoreEntryForm from '../../components/stations/ScoreEntryForm'
import './StationDetail.css'

function StationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { 
    stations, 
    participants, 
    scores, 
    loading, 
    updateStation, 
    deleteStation,
    recordScore 
  } = useSportfest()
  
  const [station, setStation] = useState(null)
  const [stationScores, setStationScores] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  
  useEffect(() => {
    if (!loading) {
      const foundStation = stations.find(s => s.id === id)
      
      if (foundStation) {
        setStation(foundStation)
        
        // Get scores for this station
        const filteredScores = scores.filter(score => score.stationId === id)
        .map(score => {
          const participant = participants.find(p => p.id === score.participantId)
          return {
            ...score,
            participantName: participant ? `${participant.firstName} ${participant.lastName}` : 'Unbekannt',
            teamName: participant ? participant.teamName : 'Unbekannt',
          }
        })
        
        setStationScores(filteredScores)
      } else {
        // Station not found, redirect to stations list
        navigate('/stations')
      }
    }
  }, [id, loading, stations, scores, participants, navigate])
  
  const handleUpdateStation = (updatedData) => {
    const updated = updateStation(id, updatedData)
    setStation(updated)
    setModalOpen(false)
  }
  
  const handleDeleteStation = () => {
    deleteStation(id)
    navigate('/stations')
  }
  
  const handleAddScore = (scoreData) => {
    recordScore({
      participantId: scoreData.participantId,
      stationId: id,
      score: scoreData.score
    })
  }
  
  if (loading || !station) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Lade Station...</p>
      </div>
    )
  }
  
  return (
    <div className="station-detail-page">
      <div className="page-header">
        <div className="header-back">
          <Link to="/stations" className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
            Zurück zu Stationen
          </Link>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Bearbeiten
          </button>
          
          {confirmDelete ? (
            <div className="confirm-delete">
              <span>Sicher?</span>
              <button 
                className="btn btn-error"
                onClick={handleDeleteStation}
              >
                Ja, löschen
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => setConfirmDelete(false)}
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-outline"
              onClick={() => setConfirmDelete(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              Löschen
            </button>
          )}
        </div>
      </div>
      
      <div className="station-detail-header">
        <div className="station-info">
          <h1>{station.name}</h1>
          <p className="station-description">{station.description}</p>
        </div>
        
        <div className="station-meta">
          <div className="meta-item">
            <div className="meta-label">Standort</div>
            <div className="meta-value">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {station.location}
            </div>
          </div>
          
          <div className="meta-item">
            <div className="meta-label">Wertungstyp</div>
            <div className="meta-value">
              {station.scoreType === 'distance' && 'Distanz (höher ist besser)'}
              {station.scoreType === 'time' && 'Zeit (niedriger ist besser)'}
              {station.scoreType === 'count' && 'Anzahl (höher ist besser)'}
            </div>
          </div>
          
          <div className="meta-item">
            <div className="meta-label">Einheit</div>
            <div className="meta-value">{station.scoreUnit}</div>
          </div>
          
          <div className="meta-item">
            <div className="meta-label">Wertebereich</div>
            <div className="meta-value">
              {station.minScore} - {station.maxScore} {station.scoreUnit}
            </div>
          </div>
        </div>
      </div>
      
      <div className="station-detail-content">
        <div className="scores-section">
          <div className="section-header">
            <h2>Ergebnisse</h2>
            <div className="section-actions">
              <button className="btn btn-sm btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Exportieren
              </button>
            </div>
          </div>
          
          {stationScores.length > 0 ? (
            <div className="scores-table-container">
              <table className="scores-table">
                <thead>
                  <tr>
                    <th>Teilnehmer</th>
                    <th>Team</th>
                    <th>Ergebnis</th>
                    <th>Datum/Zeit</th>
                  </tr>
                </thead>
                <tbody>
                  {stationScores.map((score) => (
                    <tr key={score.id}>
                      <td>{score.participantName}</td>
                      <td>{score.teamName}</td>
                      <td className="score-value">
                        {score.score} {station.scoreUnit}
                      </td>
                      <td className="score-date">
                        {new Date(score.timestamp).toLocaleString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-scores">
              <p>Noch keine Ergebnisse für diese Station</p>
            </div>
          )}
        </div>
        
        <div className="entry-section">
          <div className="section-header">
            <h2>Ergebnis eintragen</h2>
          </div>
          
          <ScoreEntryForm 
            participants={participants} 
            station={station}
            onSubmit={handleAddScore}
          />
        </div>
      </div>
      
      <StationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleUpdateStation}
        station={station}
      />
    </div>
  )
}

export default StationDetail