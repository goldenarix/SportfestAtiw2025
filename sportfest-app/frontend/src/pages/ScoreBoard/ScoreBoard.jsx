import { useState, useEffect } from 'react'
import { useSportfest } from '../../hooks/useSportfest'
import './Scoreboard.css'

function Scoreboard() {
  const { loading, getParticipantRankings, getTeamRankings } = useSportfest()
  const [viewMode, setViewMode] = useState('teams') // 'teams' or 'participants'
  const [rankings, setRankings] = useState([])
  
  useEffect(() => {
    if (!loading) {
      updateRankings()
    }
  }, [loading, viewMode])
  
  const updateRankings = () => {
    if (viewMode === 'teams') {
      setRankings(getTeamRankings())
    } else {
      setRankings(getParticipantRankings())
    }
  }
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Lade Punktestand...</p>
      </div>
    )
  }
  
  return (
    <div className="scoreboard-page">
      <div className="page-header">
        <h1>Punktestand</h1>
        <div className="view-tabs">
          <button 
            className={`tab-button ${viewMode === 'teams' ? 'active' : ''}`}
            onClick={() => setViewMode('teams')}
          >
            Teams
          </button>
          <button 
            className={`tab-button ${viewMode === 'participants' ? 'active' : ''}`}
            onClick={() => setViewMode('participants')}
          >
            Teilnehmer
          </button>
        </div>
      </div>
      
      <div className="scoreboard-container">
        {rankings.length > 0 ? (
          <div className="rankings-table-container">
            <table className="rankings-table">
              <thead>
                <tr>
                  <th className="rank-column">Rang</th>
                  {viewMode === 'teams' ? (
                    <>
                      <th>Team</th>
                      <th className="numeric-column">Teilnehmer</th>
                      <th className="numeric-column">Ø Stationen</th>
                    </>
                  ) : (
                    <>
                      <th>Name</th>
                      <th>Team</th>
                      <th className="numeric-column">Stationen</th>
                    </>
                  )}
                  <th className="numeric-column">Gesamtpunkte</th>
                  <th className="numeric-column">Ø Punkte</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((item, index) => (
                  <tr key={viewMode === 'teams' ? item.teamId : item.id}>
                    <td className="rank-column">
                      <div className={`rank-badge rank-${index + 1}`}>{index + 1}</div>
                    </td>
                    
                    {viewMode === 'teams' ? (
                      <>
                        <td>{item.teamName}</td>
                        <td className="numeric-column">{item.participantCount}</td>
                        <td className="numeric-column">{item.averageStationsCompleted.toFixed(1)}</td>
                      </>
                    ) : (
                      <>
                        <td>{item.firstName} {item.lastName}</td>
                        <td>{item.teamName}</td>
                        <td className="numeric-column">{item.stationsCompleted}</td>
                      </>
                    )}
                    
                    <td className="numeric-column points-column">{Math.round(item.totalPoints)}</td>
                    <td className="numeric-column">{item.averagePoints.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-scoreboard">
            <div className="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12c0-6-4-9-9-9s-9 3-9 9 4 9 9 9c2.38 0 4.44-.77 6-2.1"></path>
                <circle cx="12" cy="12" r="1"></circle>
                <path d="M9 15l3-3"></path>
                <path d="M13 15h3v3"></path>
              </svg>
            </div>
            <h2>Keine Ergebnisse verfügbar</h2>
            <p>
              {viewMode === 'teams' 
                ? 'Es wurden noch keine Teamergebnisse eingetragen' 
                : 'Es wurden noch keine Teilnehmerergebnisse eingetragen'}
            </p>
          </div>
        )}
      </div>
      
      <div className="scoreboard-footer">
        <div className="point-calculation-info">
          <h3>Punkteberechnung</h3>
          <p>Die Punkte werden basierend auf den Leistungen an den verschiedenen Stationen berechnet:</p>
          <ul>
            <li><strong>Zeit-Stationen:</strong> Niedrigere Zeiten ergeben mehr Punkte (0-10)</li>
            <li><strong>Distanz-Stationen:</strong> Größere Distanzen ergeben mehr Punkte (0-10)</li>
            <li><strong>Zähl-Stationen:</strong> Höhere Werte ergeben mehr Punkte (0-10)</li>
          </ul>
          <p>Das Gesamtergebnis ist die Summe aller Stationspunkte. Die durchschnittliche Punktzahl wird pro absolvierte Station berechnet.</p>
        </div>
      </div>
    </div>
  )
}

export default Scoreboard