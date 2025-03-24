import { Link } from 'react-router-dom'
import './StatsCard.css'

function StatsCard({ title, value, icon, iconColor, linkTo, progress = null }) {
  const cardContent = (
    <>
      <div className="stats-card-header">
        <h3 className="stats-title">{title}</h3>
        {icon && (
          <div className="stats-icon" style={{ color: iconColor || 'var(--primary)' }}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="stats-value">{value}</div>
      
      {progress !== null && (
        <div className="stats-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            ></div>
          </div>
          <div className="progress-label">{Math.round(progress)}% abgeschlossen</div>
        </div>
      )}
    </>
  )
  
  if (linkTo) {
    return (
      <Link to={linkTo} className="stats-card">
        {cardContent}
      </Link>
    )
  }
  
  return (
    <div className="stats-card">
      {cardContent}
    </div>
  )
}

export default StatsCard