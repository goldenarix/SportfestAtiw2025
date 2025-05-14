import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * Check if the app is running in a Capacitor environment
 * @returns {boolean} True if the app is running in Capacitor
 */
export const isCapacitorEnvironment = () => {
  return (
    typeof window !== 'undefined' && 
    window.Capacitor && 
    window.Capacitor.isNative
  );
};

/**
 * Trigger a light impact haptic feedback
 * Useful for common tap interactions
 * @returns {Promise<void>}
 */
export const lightImpact = async () => {
  if (!isCapacitorEnvironment()) return;
  
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (error) {
    console.error('Haptic error (light impact):', error);
  }
};

/**
 * Trigger a medium impact haptic feedback
 * Useful for more significant UI changes or completions
 * @returns {Promise<void>}
 */
export const mediumImpact = async () => {
  if (!isCapacitorEnvironment()) return;
  
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (error) {
    console.error('Haptic error (medium impact):', error);
  }
};

/**
 * Trigger a heavy impact haptic feedback
 * Use sparingly for major UI changes or important events
 * @returns {Promise<void>}
 */
export const heavyImpact = async () => {
  if (!isCapacitorEnvironment()) return;
  
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch (error) {
    console.error('Haptic error (heavy impact):', error);
  }
};

/**
 * Trigger a selection change haptic feedback
 * Useful for navigation or selection changes
 * @returns {Promise<void>}
 */
export const selectionFeedback = async () => {
  if (!isCapacitorEnvironment()) return;
  
  try {
    await Haptics.selectionChanged();
  } catch (error) {
    console.error('Haptic error (selection feedback):', error);
  }
};

/**
 * Trigger a vibration haptic feedback
 * Useful for notifications or alerts
 * @returns {Promise<void>}
 */
export const vibrationFeedback = async () => {
  if (!isCapacitorEnvironment()) return;
  
  try {
    await Haptics.vibrate();
  } catch (error) {
    console.error('Haptic error (vibration):', error);
  }
};

/**
 * Trigger a success haptic feedback pattern
 * Custom pattern for success notifications
 * @returns {Promise<void>}
 */
export const successFeedback = async () => {
  if (!isCapacitorEnvironment()) return;
  
  try {
    // Success pattern: light, pause, medium
    await Haptics.impact({ style: ImpactStyle.Light });
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (error) {
    console.error('Haptic error (success feedback):', error);
  }
};

/**
 * Trigger an error haptic feedback pattern
 * Custom pattern for error notifications
 * @returns {Promise<void>}
 */
export const errorFeedback = async () => {
  if (!isCapacitorEnvironment()) return;
  
  try {
    // Error pattern: medium, pause, medium
    await Haptics.impact({ style: ImpactStyle.Medium });
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (error) {
    console.error('Haptic error (error feedback):', error);
  }
};

/**
 * Unified haptic feedback function that can be called with different feedback types
 * @param {string} type - Feedback type: 'light', 'medium', 'heavy', 'selection', 'success', 'error', 'vibration'
 * @returns {Promise<void>}
 */
export const triggerHapticFeedback = async (type = 'light') => {
  switch (type) {
    case 'light':
      return lightImpact();
    case 'medium':
      return mediumImpact();
    case 'heavy':
      return heavyImpact();
    case 'selection':
      return selectionFeedback();
    case 'success':
      return successFeedback();
    case 'error':
      return errorFeedback();
    case 'vibration':
      return vibrationFeedback();
    default:
      return lightImpact();
  }
};

/**
 * Add haptic feedback to a DOM element
 * @param {Element} element - DOM element to add feedback to
 * @param {string} eventType - Event type to listen for (e.g. 'click', 'touchstart')
 * @param {Function} feedbackType - Feedback function to call
 */
export const addHapticFeedback = (element, eventType = 'click', feedbackType = lightImpact) => {
  if (!element) return;
  
  element.addEventListener(eventType, async () => {
    await feedbackType();
  });
};

// Animation variants for use with framer-motion
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: (index) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: index * 0.05 }
  }),
  hover: { scale: 1.02, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export const modalVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
};

export const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

export const itemVariants = {
  initial: { opacity: 0 },
  animate: (index) => ({
    opacity: 1,
    transition: { duration: 0.3, delay: index * 0.05 }
  }),
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

// Export Haptics and ImpactStyle for direct use if needed
export { Haptics, ImpactStyle };


