import { useState } from 'react'
import { useSportfest } from '../../hooks/useSportfest'
import './ParticipantsOverview.css'

function ParticipantsOverview() {
  const { participants, loading, addParticipant, updateParticipant, deleteParticipant } = useSportfest()
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    teamId: '',
    teamName: '',
    age: '',
    gender: 'männlich'
  })
  
  // Filter participants based on search query
  const filteredParticipants = participants.filter(participant => 
    participant.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Group participants by team
  const groupedParticipants = filteredParticipants.reduce((groups, participant) => {
    const teamId = participant.teamId
    if (!groups[teamId]) {
      groups[teamId] = {
        teamId,
        teamName: participant.teamName,
        participants: []
      }
    }
    groups[teamId].participants.push(participant)
    return groups
  }, {})
  
  const handleOpenModal = (participant = null) => {
    if (participant) {
      setEditingParticipant(participant)
      setFormData({
        firstName: participant.firstName,
        lastName: participant.lastName,
        teamId: participant.teamId,
        teamName: participant.teamName,
        age: participant.age,
        gender: participant.gender
      })
    } else {
      setEditingParticipant(null)
      setFormData({
        firstName: '',
        lastName: '',
        teamId: '',
        teamName: '',
        age: '',
        gender: 'männlich'
      })
    }
    setShowModal(true)
  }
  
  const handleCloseModal = () => {
    setShowModal(false)
    setEditingParticipant(null)
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.teamName) {
      alert('Bitte fülle alle Pflichtfelder aus')
      return
    }
    
    const participantData = {
      ...formData,
      age: parseInt(formData.age) || 0
    }
    
    if (editingParticipant) {
      updateParticipant(editingParticipant.id, participantData)
    } else {
      addParticipant(participantData)
    }
    
    handleCloseModal()
  }
  
  const handleDeleteParticipant = (id) => {
    if (window.confirm('Möchtest du diesen Teilnehmer wirklich löschen?')) {
      deleteParticipant(id)
    }
  }
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Lade Teilnehmer...</p>
      </div>
    )
  }
  
  return (
    <div className="participants-page">
      <div className="page-header">
        <h1>Teilnehmer</h1>
        <button 
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Neuer Teilnehmer
        </button>
      </div>
      
      <div className="participants-toolbar">
        <div className="search-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Teilnehmer durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {Object.values(groupedParticipants).length > 0 ? (
        <div className="teams-container">
          {Object.values(groupedParticipants).map(group => (
            <div className="team-card" key={group.teamId}>
              <div className="team-header">
                <h2 className="team-name">{group.teamName}</h2>
                <span className="participant-count">
                  {group.participants.length} {group.participants.length === 1 ? 'Teilnehmer' : 'Teilnehmer'}
                </span>
              </div>
              
              <table className="participants-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Alter</th>
                    <th>Geschlecht</th>
                    <th>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {group.participants.map(participant => (
                    <tr key={participant.id}>
                      <td>{participant.firstName} {participant.lastName}</td>
                      <td>{participant.age}</td>
                      <td>{participant.gender}</td>
                      <td className="actions-cell">
                        <button 
                          className="btn btn-sm btn-outline action-btn"
                          onClick={() => handleOpenModal(participant)}
                          title="Bearbeiten"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9"></path>
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline action-btn delete-btn"
                          onClick={() => handleDeleteParticipant(participant.id)}
                          title="Löschen"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h2>Keine Teilnehmer gefunden</h2>
          {searchQuery ? (
            <p>Keine Teilnehmer entsprechen der Suche "{searchQuery}"</p>
          ) : (
            <p>Es wurden noch keine Teilnehmer erstellt</p>
          )}
          <button 
            className="btn btn-primary"
            onClick={() => handleOpenModal()}
          >
            Teilnehmer erstellen
          </button>
        </div>
      )}
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingParticipant ? 'Teilnehmer bearbeiten' : 'Neuen Teilnehmer erstellen'}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="participant-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">Vorname</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-input"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Vorname"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Nachname</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-input"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Nachname"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="teamName" className="form-label">Team</label>
                  <input
                    type="text"
                    id="teamName"
                    name="teamName"
                    className="form-input"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    placeholder="z.B. Klasse 10a"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="teamId" className="form-label">Team-ID (optional)</label>
                  <input
                    type="text"
                    id="teamId"
                    name="teamId"
                    className="form-input"
                    value={formData.teamId}
                    onChange={handleInputChange}
                    placeholder="Team-ID"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="age" className="form-label">Alter</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="form-input"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Alter"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="gender" className="form-label">Geschlecht</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="männlich">männlich</option>
                    <option value="weiblich">weiblich</option>
                    <option value="divers">divers</option>
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={handleCloseModal}
                >
                  Abbrechen
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  {editingParticipant ? 'Aktualisieren' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParticipantsOverview