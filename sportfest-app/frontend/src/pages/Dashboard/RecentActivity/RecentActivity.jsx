import './RecentActivity.css'

function RecentActivity({ scores, stations, participants }) {
  // Create a lookup map for quicker access
  const stationMap = stations.reduce((map, station) => {
    map[station.id] = station
    return map
  }, {})
  
  const participantMap = participants.reduce((map, participant) => {
    map[participant.id] = participant
    return map
  }, {})
  
  // Get recent activities (latest 5)
  const recentActivities = [...scores]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5)
  
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  return (
    <div className="recent-activity">
      {recentActivities.length > 0 ? (
        <ul className="activity-list">
          {recentActivities.map((activity) => {
            const participant = participantMap[activity.participantId]
            const station = stationMap[activity.stationId]
            
            // Skip if participant or station isn't found
            if (!participant || !station) return null
            
            return (
              <li className="activity-item" key={activity.id}>
                <div className="activity-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12c0-6-4-9-9-9s-9 3-9 9 4 9 9 9c2.38 0 4.44-.77 6-2.1"></path>
                    <circle cx="12" cy="12" r="1"></circle>
                    <path d="M9 15l3-3"></path>
                    <path d="M13 15h3v3"></path>
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-name">
                      {participant.firstName} {participant.lastName}
                    </span>
                    <span className="activity-time">
                      {formatDateTime(activity.timestamp)}
                    </span>
                  </div>
                  <div className="activity-detail">
                    <span className="activity-station">{station.name}</span>
                    <span className="activity-score">
                      {activity.score} {station.scoreUnit}
                    </span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="empty-activity">
          Noch keine Aktivitäten vorhanden
        </div>
      )}
    </div>
  )
}

export default RecentActivity