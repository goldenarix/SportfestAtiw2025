import { useState } from 'react'
import './ScoreEntryForm.css'

function ScoreEntryForm({ participants, station, onSubmit }) {
  const [participantId, setParticipantId] = useState('')
  const [score, setScore] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    if (!participantId) {
      setError('Bitte wähle einen Teilnehmer aus')
      return
    }
    
    if (score === '' || isNaN(parseFloat(score))) {
      setError('Bitte gib ein gültiges Ergebnis ein')
      return
    }
    
    const numericScore = parseFloat(score)
    
    // Check if score is within min/max range
    if (numericScore < station.minScore || numericScore > station.maxScore) {
      setError(`Ergebnis muss zwischen ${station.minScore} und ${station.maxScore} liegen`)
      return
    }
    
    // Clear any existing errors
    setError('')
    
    // Submit the score
    onSubmit({
      participantId,
      score: numericScore
    })
    
    // Show success message
    setSuccess(true)
    
    // Reset form after successful submission
    setParticipantId('')
    setScore('')
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }
  
  return (
    <div className="score-entry-form">
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          Ergebnis erfolgreich eingetragen!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="participantId" className="form-label">Teilnehmer</label>
          <select
            id="participantId"
            className="form-select"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
          >
            <option value="">-- Teilnehmer auswählen --</option>
            {participants.map(participant => (
              <option key={participant.id} value={participant.id}>
                {participant.firstName} {participant.lastName} ({participant.teamName})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="score" className="form-label">
            Ergebnis ({station.scoreUnit})
            {station.scoreType === 'time' && <span className="score-hint"> - niedrigere Zeit ist besser</span>}
            {station.scoreType === 'distance' && <span className="score-hint"> - höhere Distanz ist besser</span>}
            {station.scoreType === 'count' && <span className="score-hint"> - höhere Anzahl ist besser</span>}
          </label>
          <input
            type="number"
            id="score"
            className="form-input"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder={`Ergebnis in ${station.scoreUnit}`}
            step="any"
            min={station.minScore}
            max={station.maxScore}
          />
          <div className="form-help">
            Erlaubter Bereich: {station.minScore} - {station.maxScore} {station.scoreUnit}
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">
          Ergebnis eintragen
        </button>
      </form>
    </div>
  )
}

export default ScoreEntryForm