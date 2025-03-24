import { useContext } from 'react'
import { SportfestContext } from '../context/SportfestContext'

// Custom hook to access the sportfest context
export const useSportfest = () => {
  const context = useContext(SportfestContext)
  
  if (!context) {
    throw new Error('useSportfest must be used within a SportfestProvider')
  }
  
  return context
}