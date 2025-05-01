import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Lock, 
  LogIn, 
  Shield, 
  UserCog, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('betreuer'); // Default role is 'betreuer'
  const [loginError, setLoginError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state if available
  const from = location.state?.from?.pathname || '/';

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous error messages
    setLoginError('');
    setSuccessMessage('');
    
    // Simple validation
    if (!username || !password) {
      setLoginError('Bitte geben Sie einen Benutzernamen und ein Passwort ein.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Role value is either 'betreuer' or 'admin'
      const success = await login(username, password, role);
      
      if (success) {
        setSuccessMessage('Anmeldung erfolgreich. Sie werden weitergeleitet...');
        // Redirect will happen automatically from the useEffect above
      } else {
        setLoginError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.');
      }
    } catch (error) {
      setLoginError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col justify-center items-center p-4">
      {/* Logo and app name */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-lg mb-4">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          SportApp
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Sportfest 2025</p>
      </div>
      
      {/* Login card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Card header */}
        <div className="relative p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-medium text-slate-800 dark:text-white">
            Anmelden
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bitte melden Sie sich an, um fortzufahren
          </p>
          
          {/* Role selector */}
          <div className="flex items-center mt-4">
            <div 
              className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-4"
            >
              Als:
            </div>
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-700 p-1">
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  role === 'betreuer'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                onClick={() => setRole('betreuer')}
              >
                <UserCog size={16} className="mr-1.5" />
                Betreuer
              </button>
              
              <button
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  role === 'admin'
                    ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                onClick={() => setRole('admin')}
              >
                <Shield size={16} className="mr-1.5" />
                Admin
              </button>
            </div>
          </div>
        </div>
        
        {/* Login form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Username field */}
          <div className="mb-4">
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Benutzername
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:cursor-not-allowed transition-colors"
                placeholder={role === 'admin' ? "Admin-Benutzername" : "Betreuer-Name"}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          
          {/* Password field */}
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Passwort
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:cursor-not-allowed transition-colors"
                placeholder="Passwort eingeben"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>
          
          {/* Error message */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
              <AlertCircle size={18} className="text-red-500 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{loginError}</p>
            </div>
          )}
          
          {/* Success message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
              <CheckCircle size={18} className="text-green-500 dark:text-green-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
            </div>
          )}
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Anmeldung...
              </>
            ) : (
              <>
                <LogIn size={18} className="mr-2" />
                Anmelden
              </>
            )}
          </button>
          
          {/* Info text */}
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Wenden Sie sich an einen Administrator, wenn Sie Hilfe bei der Anmeldung benötigen.
          </p>
        </form>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2025 SportApp. Alle Rechte vorbehalten.</p>
      </div>
    </div>
  );
};

export default LoginPage;
