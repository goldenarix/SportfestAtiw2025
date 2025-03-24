import { useState, useEffect } from 'react'
import './StationModal.css'

function StationModal({ isOpen, onClose, onSave, station = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    scoreType: 'distance',
    scoreUnit: 'm',
    minScore: 0,
    maxScore: 10
  })
  
  // Initialize form data if editing an existing station
  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name || '',
        description: station.description || '',
        location: station.location || '',
        scoreType: station.scoreType || 'distance',
        scoreUnit: station.scoreUnit || 'm',
        minScore: station.minScore || 0,
        maxScore: station.maxScore || 10
      })
    } else {
      // Reset form when creating a new station
      setFormData({
        name: '',
        description: '',
        location: '',
        scoreType: 'distance',
        scoreUnit: 'm',
        minScore: 0,
        maxScore: 10
      })
    }
  }, [station, isOpen])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    
    let parsedValue = value
    
    // Handle numeric inputs
    if (name === 'minScore' || name === 'maxScore') {
      parsedValue = parseFloat(value)
      if (isNaN(parsedValue)) parsedValue = 0
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }))
    
    // Special handling for scoreType to update unit
    if (name === 'scoreType') {
      switch (value) {
        case 'distance':
          setFormData(prev => ({ ...prev, scoreUnit: 'm' }))
          break
        case 'time':
          setFormData(prev => ({ ...prev, scoreUnit: 's' }))
          break
        case 'count':
          setFormData(prev => ({ ...prev, scoreUnit: 'Treffer' }))
          break
        default:
          break
      }
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim()) {
      alert('Bitte gib einen Namen für die Station ein')
      return
    }
    
    onSave(formData)
  }
  
  if (!isOpen) return null
  
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{station ? 'Station bearbeiten' : 'Neue Station erstellen'}</h2>
          <button className="close-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="station-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Stationsname</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              placeholder="z.B. Weitsprung"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">Beschreibung</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Kurze Beschreibung der Station"
              rows={3}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="location" className="form-label">Standort</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              placeholder="z.B. Sportplatz - Weitsprunggrube"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="scoreType" className="form-label">Wertungstyp</label>
              <select
                id="scoreType"
                name="scoreType"
                className="form-select"
                value={formData.scoreType}
                onChange={handleChange}
              >
                <option value="distance">Distanz (höher ist besser)</option>
                <option value="time">Zeit (niedriger ist besser)</option>
                <option value="count">Anzahl (höher ist besser)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="scoreUnit" className="form-label">Einheit</label>
              <input
                type="text"
                id="scoreUnit"
                name="scoreUnit"
                className="form-input"
                value={formData.scoreUnit}
                onChange={handleChange}
                placeholder="z.B. m, s, Punkte"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minScore" className="form-label">Minimaler Wert</label>
              <input
                type="number"
                id="minScore"
                name="minScore"
                className="form-input"
                value={formData.minScore}
                onChange={handleChange}
                step="any"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="maxScore" className="form-label">Maximaler Wert</label>
              <input
                type="number"
                id="maxScore"
                name="maxScore"
                className="form-input"
                value={formData.maxScore}
                onChange={handleChange}
                step="any"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={onClose}
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              {station ? 'Aktualisieren' : 'Erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StationModal