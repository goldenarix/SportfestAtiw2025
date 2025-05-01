import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute - A component to protect routes that require authentication
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to render if authenticated
 * @param {boolean} [props.requireAdmin=false] - Whether this route requires admin role
 * @returns {React.ReactNode} The protected route
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires admin role but user is not an admin, redirect to dashboard
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;
