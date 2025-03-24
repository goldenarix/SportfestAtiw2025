import './TopTeamsTable.css'

function TopTeamsTable({ teams }) {
  return (
    <div className="teams-table-container">
      {teams && teams.length > 0 ? (
        <table className="teams-table">
          <thead>
            <tr>
              <th className="rank-col">Rang</th>
              <th className="name-col">Team</th>
              <th className="points-col">Punkte</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.teamId}>
                <td className="rank-col">
                  <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
                </td>
                <td className="name-col">{team.teamName}</td>
                <td className="points-col">{Math.round(team.totalPoints)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-table-message">
          Noch keine Teams verfügbar
        </div>
      )}
    </div>
  )
}

export default TopTeamsTable