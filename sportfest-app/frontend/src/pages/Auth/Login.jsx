import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Simple validation
    if (!email || !password) {
      setError('Bitte gib deine E-Mail-Adresse und dein Passwort ein')
      return
    }
    
    try {
      setError('')
      setLoading(true)
      
      const result = await login(email, password)
      
      if (result.success) {
        navigate('/')
      } else {
        setError(result.message || 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.')
      }
    } catch (error) {
      setError('Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="app-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2"></path>
              <path d="M10 14v-4a2 2 0 1 1 4 0v4"></path>
              <circle cx="10" cy="16" r="2"></circle>
              <path d="M22 14v3a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-3"></path>
              <path d="M18 10V5a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v5"></path>
            </svg>
          </div>
          <h1>Anmelden bei Sportfest</h1>
          <p>Bitte gib deine Zugangsdaten ein, um fortzufahren</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">E-Mail-Adresse</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
            />
          </div>
          
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password" className="form-label">Passwort</label>
              <a href="#" className="forgot-password">Passwort vergessen?</a>
            </div>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          <div className="form-group remember-me">
            <label className="checkbox-label">
              <input type="checkbox" /> Angemeldet bleiben
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={loading}
          >
            {loading ? 'Anmeldung...' : 'Anmelden'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>
            Demo-Zugangsdaten: Gib einfach eine beliebige E-Mail und ein Passwort ein.
          </p>
        </div>
      </div>
      
      <div className="login-image">
        <div className="image-overlay">
          <h2>Willkommen zum Sportfest 2025!</h2>
          <p>Verwalte Stationen, Teilnehmer und Ergebnisse einfach und effizient.</p>
        </div>
      </div>
    </div>
  )
}

export default Login