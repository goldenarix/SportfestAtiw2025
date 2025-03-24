import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSportfest } from '../../../hooks/useSportfest'
import { useAuth } from '../../../hooks/useAuth'
import StatsCard from '../../../components/common/StatsCard/StatsCard'
import ScoreChart from '../../../components/Dashboard/ScoreChart'
import TopTeamsTable from '../../Dashboard/TopTeamsTable/TopTeamsTable'
import RecentActivity from '../../Dashboard/RecentActivity/RecentActivity'
import './Dashboard.css'

function Dashboard() {
  const { 
    stations, 
    participants, 
    scores, 
    loading,
    getParticipantRankings,
    getTeamRankings
  } = useSportfest()
  
  const { user } = useAuth()
  const [teamRankings, setTeamRankings] = useState([])
  const [participantRankings, setParticipantRankings] = useState([])
  const [completionRate, setCompletionRate] = useState(0)
  
  useEffect(() => {
    if (!loading) {
      // Calculate rankings
      setTeamRankings(getTeamRankings())
      setParticipantRankings(getParticipantRankings())
      
      // Calculate completion rate
      const totalPossibleScores = stations.length * participants.length
      const completionRate = totalPossibleScores > 0 
        ? (scores.length / totalPossibleScores) * 100 
        : 0
      
      setCompletionRate(completionRate)
    }
  }, [loading, stations, participants, scores, getTeamRankings, getParticipantRankings])
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Lade Dashboard...</p>
      </div>
    )
  }
  
  const highestScoringTeam = teamRankings.length > 0 ? teamRankings[0] : null
  const highestScoringParticipant = participantRankings.length > 0 ? participantRankings[0] : null
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <div className="welcome-message">
          <h2>Willkommen, {user?.displayName || 'Benutzer'}! 👋</h2>
          <p>Hier ist eine Übersicht des aktuellen Sportfestes:</p>
        </div>
        
        <div className="quick-actions">
          <Link to="/stations" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 21v-3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
              <path d="M11 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
              <path d="m21 7-.71.71A4 4 0 0 1 16 10a4 4 0 0 1-4-4 4 4 0 0 1 .71-2.29L13 3"></path>
              <path d="m21 3-6 6"></path>
            </svg>
            Stationen verwalten
          </Link>
          
          <Link to="/participants" className="btn btn-outline">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Teilnehmer verwalten
          </Link>
        </div>
      </div>
      
      <div className="stats-row">
        <StatsCard 
          title="Stationen"
          value={stations.length.toString()}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 21v-3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
              <path d="M11 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
              <path d="m21 7-.71.71A4 4 0 0 1 16 10a4 4 0 0 1-4-4 4 4 0 0 1 .71-2.29L13 3"></path>
              <path d="m21 3-6 6"></path>
            </svg>
          }
          iconColor="var(--primary)"
          linkTo="/stations"
        />
        
        <StatsCard 
          title="Teilnehmer"
          value={participants.length.toString()}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
          iconColor="var(--secondary)"
          linkTo="/participants"
        />
        
        <StatsCard 
          title="Ergebnisse"
          value={scores.length.toString()}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12c0-6-4-9-9-9s-9 3-9 9 4 9 9 9c2.38 0 4.44-.77 6-2.1"></path>
              <circle cx="12" cy="12" r="1"></circle>
              <path d="M9 15l3-3"></path>
              <path d="M13 15h3v3"></path>
            </svg>
          }
          iconColor="var(--accent)"
          linkTo="/scoreboard"
        />
        
        <StatsCard 
          title="Fortschritt"
          value={`${Math.round(completionRate)}%`}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22v-20"></path>
              <path d="M19 15l-7 7-7-7"></path>
            </svg>
          }
          iconColor="var(--success)"
          progress={completionRate}
        />
      </div>
      
      <div className="dashboard-main">
        <div className="card dashboard-chart">
          <div className="card-header">
            <h3>Punkteverteilung</h3>
            <div className="card-actions">
              <button className="btn btn-sm btn-outline">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="3" x2="16" y2="21"></line>
                  <line x1="3" y1="12" x2="16" y2="12"></line>
                  <line x1="3" y1="16" x2="8" y2="16"></line>
                  <line x1="3" y1="8" x2="12" y2="8"></line>
                </svg>
                Exportieren
              </button>
            </div>
          </div>
          
          <div className="chart-container">
            <ScoreChart participantRankings={participantRankings} teamRankings={teamRankings} />
          </div>
        </div>
        
        <div className="dashboard-side">
          <div className="card">
            <h3>Top Teams</h3>
            <TopTeamsTable teams={teamRankings.slice(0, 5)} />
            <div className="card-footer">
              <Link to="/scoreboard" className="btn btn-sm btn-outline">Alle Teams ansehen</Link>
            </div>
          </div>
          
          <div className="card">
            <h3>Letzte Aktivitäten</h3>
            <RecentActivity scores={scores} stations={stations} participants={participants} />
            <div className="card-footer">
              <Link to="/scoreboard" className="btn btn-sm btn-outline">Alle Ergebnisse ansehen</Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-highlights">
        <div className="highlight-card">
          <div className="highlight-header">
            <div className="highlight-icon team-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"></path>
                <path d="m18 2 4 4-4 4"></path>
              </svg>
            </div>
            <div className="highlight-info">
              <h4>Führendes Team</h4>
              <p className="highlight-title">{highestScoringTeam?.teamName || 'Noch keine Teams'}</p>
            </div>
          </div>
          <div className="highlight-value">
            {highestScoringTeam ? `${Math.round(highestScoringTeam.totalPoints)} Punkte` : '-'}
          </div>
        </div>
        
        <div className="highlight-card">
          <div className="highlight-header">
            <div className="highlight-icon participant-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="highlight-info">
              <h4>Bester Teilnehmer</h4>
              <p className="highlight-title">
                {highestScoringParticipant ? 
                  `${highestScoringParticipant.firstName} ${highestScoringParticipant.lastName}` : 
                  'Noch keine Teilnehmer'
                }
              </p>
            </div>
          </div>
          <div className="highlight-value">
            {highestScoringParticipant ? `${Math.round(highestScoringParticipant.totalPoints)} Punkte` : '-'}
          </div>
        </div>
        
        <div className="highlight-card">
          <div className="highlight-header">
            <div className="highlight-icon station-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 21v-3a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
                <path d="M11 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
                <path d="m21 7-.71.71A4 4 0 0 1 16 10a4 4 0 0 1-4-4 4 4 0 0 1 .71-2.29L13 3"></path>
                <path d="m21 3-6 6"></path>
              </svg>
            </div>
            <div className="highlight-info">
              <h4>Stationen erledigt</h4>
              <p className="highlight-title">Fortschritt</p>
            </div>
          </div>
          <div className="highlight-value">
            {Math.round(completionRate)}%
            <div className="mini-progress-bar">
              <div className="mini-progress-fill" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard