import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ResponsiveLayout from './components/ResponsiveLayout';
import TestPage from './pages/TestPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeProvider';
import { DataProvider } from '../backend/DataLoader';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded components for better performance
const UltraModernDashboard = lazy(() => import('./components/Dashboard'));
const StationsPage = lazy(() => import('./pages/StationPage'));
const StationDetailsPage = lazy(() => import('./pages/StationDetailsPage'));
const ParticipantsPage = lazy(() => import('./pages/ParticipantsPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ScoreEntryPage = lazy(() => import('./pages/ScoreEntryPage'));
//const TestPage = lazy(() => import('./pages/TestPage'));
const DisziplinenPage = lazy(() => import('./pages/DisziplinenPage'));
const DisziplinEditorPage = lazy(() => import('./pages/DisziplinEditorPage'));
const DisziplinDetailPage = lazy(() => import('./pages/DisziplinDetailPage'));
const ErgebnissePage = lazy(() => import('./pages/ErgebnissePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'));
const SelectTeamForDisciplinePage = lazy(() => import('./pages/SelectTeamForDisciplinePage'));
const SelectDisciplineForTeamPage = lazy(() => import('./pages/SelectDisciplineForTeamPage'));
const ScoreEntryForSelectionPage = lazy(() => import('./pages/ScoreEntryForSelectionPage'));
const ZeitplanPage = lazy(() => import('./pages/ZeitplanPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
    <div className="text-center">
      <div className="inline-block h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400">Lade Seite...</p>
    </div>
  </div>
);

// AnimatePresence wrapper for route transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Login route - Public */}
        <Route path="/login" element={
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        } />
        
        {/* Protected routes - require authentication */}
        <Route path="/" element={
          <ProtectedRoute>
            <ResponsiveLayout />
          </ProtectedRoute>
        }>
          <Route index element={
            <Suspense fallback={<PageLoader />}>
              <UltraModernDashboard />
            </Suspense>
          } />
          <Route path="stations" element={
            <Suspense fallback={<PageLoader />}>
              <StationsPage />
            </Suspense>
          } />
          <Route path="stations/:id" element={
            <Suspense fallback={<PageLoader />}>
              <StationDetailsPage />
            </Suspense>
          } />
          <Route path="stations/:id/score" element={
            <Suspense fallback={<PageLoader />}>
              <ScoreEntryPage />
            </Suspense>
          } />
          <Route path="participants" element={
            <Suspense fallback={<PageLoader />}>
              <ParticipantsPage />
            </Suspense>
          } />
          <Route path="leaderboard" element={
            <Suspense fallback={<PageLoader />}>
              <LeaderboardPage />
            </Suspense>
          } />
          <Route path="stats" element={
            <Suspense fallback={<PageLoader />}>
              <StatisticsPage />
            </Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          } />
          {/* Add the TestPage route here */}
          <Route path="test-db" element={
            <Suspense fallback={<PageLoader />}>
              <TestPage />
            </Suspense>
          } />
          <Route path="disziplinen" element={
            <Suspense fallback={<PageLoader />}>
              <DisziplinenPage />
            </Suspense>
          } />
          <Route path="disziplinen/new" element={
            <Suspense fallback={<PageLoader />}>
              <DisziplinEditorPage />
            </Suspense>
          } />
          <Route path="disziplinen/:id/edit" element={
            <Suspense fallback={<PageLoader />}>
              <DisziplinEditorPage />
            </Suspense>
          } />
          <Route path="disziplinen/:id" element={
            <Suspense fallback={<PageLoader />}>
              <DisziplinDetailPage />
            </Suspense>
          } />
          <Route path="ergebnisse" element={
            <Suspense fallback={<PageLoader />}>
              <ErgebnissePage />
            </Suspense>
          } />
          <Route path="ergebnisse/disziplin/:disziplinId/team-auswahl" element={
            <Suspense fallback={<PageLoader />}>
              <SelectTeamForDisciplinePage />
            </Suspense>
          } />
          <Route path="ergebnisse/team/:teamId/disziplin-auswahl" element={
            <Suspense fallback={<PageLoader />}>
              <SelectDisciplineForTeamPage />
            </Suspense>
          } />
          <Route path="ergebnisse/team/:teamId/disziplin/:disziplinId/punkte" element={
            <Suspense fallback={<PageLoader />}>
              <ScoreEntryForSelectionPage />
            </Suspense>
          } />
          
          {/* Zeitplan Route */}
          <Route path="zeitplan" element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute>
                <ZeitplanPage />
              </ProtectedRoute>
            </Suspense>
          } />
          
          {/* Admin-only route */}
          <Route path="users" element={
            <Suspense fallback={<PageLoader />}>
              <ProtectedRoute requireAdmin={true}>
                <UserManagementPage />
              </ProtectedRoute>
            </Suspense>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;