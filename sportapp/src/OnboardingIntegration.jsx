import React, { useState, useEffect } from 'react';
import FuturisticLoadingScreen from './components/LoadingScreen';
import FuturisticOnboarding from './components/Onboarding';
import App from './App';

const OnboardingIntegration = () => {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  
  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('sportapp-onboarding-completed');
    if (hasCompletedOnboarding === 'true') {
      setOnboardingCompleted(true);
    }
  }, []);
  
  // Handle loading completion
  const handleLoadingComplete = () => {
    setLoading(false);
    
    // Only show onboarding if not completed before
    if (!onboardingCompleted) {
      setShowOnboarding(true);
    }
  };
  
  // Handle onboarding completion
  const handleOnboardingComplete = (userData) => {
    // Save user preferences
    if (userData) {
      localStorage.setItem('sportapp-user-initials', userData.initials || '');
      localStorage.setItem('sportapp-user-preferences', JSON.stringify(userData.preferences || {}));
    }
    
    // Mark onboarding as completed
    localStorage.setItem('sportapp-onboarding-completed', 'true');
    setShowOnboarding(false);
    setOnboardingCompleted(true);
  };
  
  // Reset onboarding (for development)
  const resetOnboarding = () => {
    localStorage.removeItem('sportapp-onboarding-completed');
    localStorage.removeItem('sportapp-user-initials');
    localStorage.removeItem('sportapp-user-preferences');
    window.location.reload();
  };
  
  return (
    <>
      {loading && (
        <FuturisticLoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      
      {showOnboarding && !onboardingCompleted && (
        <FuturisticOnboarding onComplete={handleOnboardingComplete} />
      )}
      
      {(!loading && !showOnboarding) && (
        <>
          <App />
          
          {/* Debug button for development - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <button 
              onClick={resetOnboarding}
              className="fixed bottom-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100 z-50"
            >
              Reset Onboarding (Dev Only)
            </button>
          )}
        </>
      )}
    </>
  );
};

export default OnboardingIntegration;