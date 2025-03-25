
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import UltraModernLayout from './components/Layout';

// Lazy-loaded components for better performance
const UltraModernDashboard = lazy(() => import('./components/Dashboard'));
const StationsPage = lazy(() => import('./pages/StationPage'));
const StationDetailsPage = lazy(() => import('./pages/StationDetailsPage'));
const ParticipantsPage = lazy(() => import('./pages/ParticipantsPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const StatisticsPage = lazy(() => import('./pages/StatisticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ScoreEntryPage = lazy(() => import('./pages/ScoreEntryPage'));

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
        <Route path="/" element={<UltraModernLayout />}>
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
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;