import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../frontend/src/hooks/useAuth'
import Header from '../frontend/src/components/layout/Header/Header'
import Sidebar from '../frontend/src/components/layout/Sidebar/Sidebar'
import Footer from '../frontend/src/components/layout/Footer/Footer'
import Dashboard from '../frontend/src/pages/Dashboard/Dashboard/Dashboard'
import StationsOverview from '../frontend/src/pages/Stations/StationsOverview'
import StationDetail from '../frontend/src/pages/Stations/StationDetail'
import ParticipantsOverview from '../frontend/src/pages/Participants/ParticipantsOverview'
import Scoreboard from '../frontend/src/pages/ScoreBoard/ScoreBoard'
import Login from '../frontend/src/pages/Auth/Login'
import NotFound from '../frontend/src/pages/NotFound/NotFound'
import '../frontend/src/styles/App.css'

function App() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Show loading screen while authentication is being determined
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Lade Sportfest App...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Header toggleSidebar={toggleSidebar} />
      <div className="content-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/scoreboard" element={<Scoreboard />} />
            
            {/* Protected routes */}
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/stations" element={user ? <StationsOverview /> : <Navigate to="/login" />} />
            <Route path="/stations/:id" element={user ? <StationDetail /> : <Navigate to="/login" />} />
            <Route path="/participants" element={user ? <ParticipantsOverview /> : <Navigate to="/login" />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App
