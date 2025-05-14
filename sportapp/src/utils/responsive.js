import { useState, useEffect } from 'react';

/**
 * Custom React hook for responsive media queries
 * 
 * @param {string} query - Media query string (e.g. '(max-width: 768px)')
 * @param {boolean} defaultState - Default state before first check
 * @returns {boolean} Whether the media query matches
 * 
 * Example usage:
 * const isMobile = useMediaQuery('(max-width: 640px)');
 * const isTablet = useMediaQuery('(max-width: 1024px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export const useMediaQuery = (query, defaultState = false) => {
  const [matches, setMatches] = useState(defaultState);
  
  useEffect(() => {
    // Check if window is available (for SSR)
    if (typeof window === 'undefined') return;
    
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial state
    setMatches(mediaQuery.matches);
    
    // Create handler function
    const handler = (event) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    if (mediaQuery.addEventListener) {
      // Modern browsers
      mediaQuery.addEventListener('change', handler);
    } else {
      // Older browsers
      mediaQuery.addListener(handler);
    }
    
    // Cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        // Modern browsers
        mediaQuery.removeEventListener('change', handler);
      } else {
        // Older browsers
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);
  
  return matches;
};

/**
 * Custom hook to track window size and return dimensions
 * @returns {{width: number, height: number}} Window dimensions
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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
  if (typeof window === 'undefined') return false;
  
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
  if (typeof window === 'undefined' || !window.navigator) return 'desktop';
  
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
  if (typeof document === 'undefined') return;
  
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
  if (typeof document === 'undefined') return;
  
  document.body.style.overflow = prevent ? 'hidden' : '';
  document.body.style.position = prevent ? 'fixed' : '';
  document.body.style.width = prevent ? '100%' : '';
};

/**
 * Predefined breakpoints for common screen sizes
 */
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  
  smDown: '(max-width: 639px)',
  mdDown: '(max-width: 767px)',
  lgDown: '(max-width: 1023px)',
  xlDown: '(max-width: 1279px)',
  '2xlDown': '(max-width: 1535px)',
  
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  reducedMotion: '(prefers-reduced-motion: reduce)'
};

/**
 * Hook that returns all predefined breakpoints status
 * @returns {Object} Object with boolean values for each breakpoint
 */
export const useBreakpoints = () => {
  const sm = useMediaQuery(breakpoints.sm);
  const md = useMediaQuery(breakpoints.md);
  const lg = useMediaQuery(breakpoints.lg);
  const xl = useMediaQuery(breakpoints.xl);
  const xxl = useMediaQuery(breakpoints['2xl']);
  
  const portrait = useMediaQuery(breakpoints.portrait);
  const landscape = useMediaQuery(breakpoints.landscape);
  const darkMode = useMediaQuery(breakpoints.darkMode);
  const lightMode = useMediaQuery(breakpoints.lightMode);
  const reducedMotion = useMediaQuery(breakpoints.reducedMotion);
  
  return {
    sm,
    md,
    lg,
    xl,
    xxl,
    portrait,
    landscape,
    darkMode,
    lightMode,
    reducedMotion,
    // Convenience values
    isMobile: !sm,
    isTablet: sm && !lg,
    isDesktop: lg,
    // Current active size (smallest true breakpoint)
    current: xxl ? '2xl' : xl ? 'xl' : lg ? 'lg' : md ? 'md' : sm ? 'sm' : 'xs'
  };
};

/**
 * Hook to detect when an element intersects with the viewport
 * Based on the Intersection Observer API
 * 
 * @param {Object} options - IntersectionObserver options
 * @returns {[React.RefObject, boolean]} Tuple with ref and intersection state
 */
export const useIntersectionObserver = (options = {}) => {
  const [ref, setRef] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    observer.observe(ref);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);
  
  return [setRef, isIntersecting];
};

// Default export for direct import as "import useMediaQuery from '...'"
export default useMediaQuery;