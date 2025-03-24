import { NavLink } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import './Sidebar.css'
function Sidebar({ isOpen }) {
  const { user } = useAuth()
  
  return (
    <aside className={`fixed top-16 left-0 bottom-0 z-40 w-64 transition-transform duration-300 ease-in-out transform ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } glass-card border-r border-gray-100 dark:border-gray-800 overflow-y-auto pb-4 pt-2`}>
      <nav className="px-4 space-y-6">
        <div className="space-y-1">
          <p className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider ml-4 mb-2">
            Hauptmenü
          </p>
          
          <NavLink 
            to="/" 
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors
              ${isActive 
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `} 
            end
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/stations" 
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors
              ${isActive 
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `} 
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Stationen</span>
          </NavLink>
          
          <NavLink 
            to="/participants" 
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors
              ${isActive 
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `} 
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-medium">Teilnehmer</span>
          </NavLink>
          
          <NavLink 
            to="/scoreboard" 
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors
              ${isActive 
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `} 
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="font-medium">Punktestand</span>
          </NavLink>
        </div>
        
        {user && (
          <div className="space-y-1">
            <p className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 tracking-wider ml-4 mb-2">
              Verwaltung
            </p>
            
            <NavLink 
              to="/teams" 
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors
                ${isActive 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `} 
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium">Teams</span>
            </NavLink>
            
            <NavLink 
              to="/reports" 
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-colors
                ${isActive 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `} 
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">Berichte</span>
            </NavLink>
          </div>
        )}
        
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Sportfest App v1.0.0
            </div>
            
            {user && (
              <div className="flex items-center mt-3 text-xs text-gray-600 dark:text-gray-300">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <span>Online</span>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar