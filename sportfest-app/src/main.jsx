import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from '../frontend/src/context/AuthContext'
import { SportfestProvider } from '../frontend/src/context/SportfestContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SportfestProvider>
          <App />
        </SportfestProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)