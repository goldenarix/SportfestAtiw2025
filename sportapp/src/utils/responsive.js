import { useState, useEffect } from 'react';

/**
 * Custom hook to track window size and return dimensions
 * @returns {{width: number, height: number}} Window dimensions
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount
  
  return windowSize;
};

/**
 * Custom hook to check if device is mobile based on screen width
 * @param {number} breakpoint - The width breakpoint for mobile devices (default: 768px)
 * @returns {boolean} True if device is considered mobile
 */
export const useIsMobile = (breakpoint = 768) => {
  const { width } = useWindowSize();
  return width < breakpoint;
};

/**
 * Custom hook to get the current orientation
 * @returns {string} 'portrait' or 'landscape'
 */
export const useOrientation = () => {
  const { width, height } = useWindowSize();
  return width > height ? 'landscape' : 'portrait';
};

/**
 * Check if the app is running as a standalone installed app
 * @returns {boolean} True if the app is a standalone PWA or native app
 */
export const isStandaloneApp = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone
  );
};

/**
 * Generate CSS variables for safe area insets
 * @param {string} side - 'top', 'right', 'bottom', or 'left'
 * @returns {object} CSS style object with safe area inset variables
 */
export const safeAreaInset = (side) => {
  const property = `padding${side.charAt(0).toUpperCase()}${side.slice(1)}`;
  return {
    [property]: `env(safe-area-inset-${side}, 0px)`
  };
};

/**
 * Get device type based on user agent
 * @returns {string} 'desktop', 'tablet', 'mobile'
 */
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated/.test(ua)
  ) {
    return 'mobile';
  }
  return 'desktop';
};

/**
 * Add viewport meta tags for proper mobile display
 * @param {boolean} allowZoom - Whether to allow zooming on mobile
 */
export const setupMobileViewport = (allowZoom = false) => {
  let viewportContent = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
  if (!allowZoom) {
    viewportContent += ', maximum-scale=1.0, user-scalable=no';
  }
  
  // Get or create viewport meta tag
  let viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }
  
  viewportMeta.setAttribute('content', viewportContent);
  
  // Add apple mobile web app capable meta tag
  let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
  if (!appleMeta) {
    appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    document.head.appendChild(appleMeta);
  }
  appleMeta.setAttribute('content', 'yes');
  
  // Add mobile web app capable meta tag
  let mobileMeta = document.querySelector('meta[name="mobile-web-app-capable"]');
  if (!mobileMeta) {
    mobileMeta = document.createElement('meta');
    mobileMeta.name = 'mobile-web-app-capable';
    document.head.appendChild(mobileMeta);
  }
  mobileMeta.setAttribute('content', 'yes');
};

/**
 * Prevent body scrolling (useful for modals)
 * @param {boolean} prevent - Whether to prevent scrolling
 */
export const preventBodyScroll = (prevent) => {
  document.body.style.overflow = prevent ? 'hidden' : '';
  document.body.style.position = prevent ? 'fixed' : '';
  document.body.style.width = prevent ? '100%' : '';
};
