import { useState, useEffect } from 'react'
import './ScoreChart.css'

function ScoreChart({ participantRankings, teamRankings }) {
  const [chartType, setChartType] = useState('teams')
  const [chartData, setChartData] = useState([])
  
  useEffect(() => {
    prepareChartData()
  }, [participantRankings, teamRankings, chartType])
  
  const prepareChartData = () => {
    if (chartType === 'teams') {
      // Get top 5 teams for chart
      const data = teamRankings.slice(0, 5).map(team => ({
        name: team.teamName,
        value: Math.round(team.totalPoints),
      }))
      setChartData(data)
    } else {
      // Get top 5 participants for chart
      const data = participantRankings.slice(0, 5).map(participant => ({
        name: `${participant.firstName} ${participant.lastName.charAt(0)}.`,
        value: Math.round(participant.totalPoints),
      }))
      setChartData(data)
    }
  }
  
  // Find maximum value for scaling
  const maxValue = chartData.length > 0 
    ? Math.max(...chartData.map(item => item.value)) 
    : 0
  
  // Adjust the scale
  const scale = maxValue > 0 ? 100 / maxValue : 1
  
  return (
    <div className="score-chart">
      <div className="chart-controls">
        <button 
          className={`chart-tab ${chartType === 'teams' ? 'active' : ''}`} 
          onClick={() => setChartType('teams')}
        >
          Teams
        </button>
        <button 
          className={`chart-tab ${chartType === 'participants' ? 'active' : ''}`}
          onClick={() => setChartType('participants')}
        >
          Teilnehmer
        </button>
      </div>
      
      <div className="chart-body">
        {chartData.length > 0 ? (
          <div className="chart-bars">
            {chartData.map((item, index) => (
              <div className="chart-bar-container" key={index}>
                <div className="chart-bar-label">{item.name}</div>
                <div className="chart-bar-wrap">
                  <div 
                    className="chart-bar" 
                    style={{ 
                      width: `${item.value * scale}%`,
                      backgroundColor: getBarColor(index)
                    }}
                  ></div>
                </div>
                <div className="chart-bar-value">{item.value} Pkt</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="chart-empty">
            <p>Keine Daten verfügbar für {chartType === 'teams' ? 'Teams' : 'Teilnehmer'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get color for chart bars
function getBarColor(index) {
  const colors = [
    'var(--primary)',
    'var(--secondary)',
    'var(--accent)',
    'var(--info)',
    'var(--warning)'
  ]
  
  return colors[index % colors.length]
}

export default ScoreChart