import { createContext, useState, useEffect } from 'react'

// Create Auth Context
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // Mock user for demo - in production this would connect to your backend authentication
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Check if there's a saved session in localStorage
    const savedUser = localStorage.getItem('sportfestUser')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    
    // Simulate a loading delay like a real auth check
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])
  
  // Login function
  const login = async (email, password) => {
    try {
      // For demo purposes, we'll accept any username/password
      // and create a mock user
      const mockUser = {
        id: '1',
        email: email,
        displayName: email.split('@')[0], // Use part before @ as display name
        role: 'admin',
      }
      
      // In production, this would be a real API call to your authentication server
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })
      // const data = await response.json()
      
      // Save to state
      setUser(mockUser)
      
      // Save to localStorage for persistence
      localStorage.setItem('sportfestUser', JSON.stringify(mockUser))
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Anmeldung fehlgeschlagen. Bitte versuche es erneut.'
      }
    }
  }
  
  // Logout function
  const logout = () => {
    // Remove user from state
    setUser(null)
    
    // Remove from localStorage
    localStorage.removeItem('sportfestUser')
  }
  
  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false
    
    return user.role === role
  }
  
  // Context value object
  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}