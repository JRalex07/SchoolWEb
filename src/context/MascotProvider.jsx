import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SECTION_CONTEXTS, FIELD_VALIDATION_REGISTRY } from '../data/helperRegistry';
import { MascotContext } from './MascotContext';

// Page-specific welcoming greetings for every distinct page visit
const getPageGreeting = (pathname) => {
  switch (pathname) {
    case '/about':
      return {
        title: 'Welcome to About Us! 🏛️',
        text: 'I am Barnaby. Explore our institutional heritage, academic vision, and leadership hierarchy.',
        tip: 'Click any leadership inquiry button to learn more.'
      };
    case '/admissions':
      return {
        title: 'Admissions & Enrollment 📝',
        text: 'I am Barnaby. Review our entry guidelines, age requirements, and enrollment documentation.',
        tip: 'Contact our admissions desk directly via verified phone or email.'
      };
    case '/academics':
      return {
        title: 'Academics & Campus Pillars 📚',
        text: 'I am Barnaby. Discover our core curriculum, athletic programs, and creative arts facilities.',
        tip: 'Hover or tap any pillar card to explore syllabus details.'
      };
    case '/faith':
      return {
        title: 'Faith & Values 🕊️',
        text: 'I am Barnaby. Learn about our ethical foundations, spiritual formation, and community outreach.',
        tip: 'Explore our character development programs.'
      };
    case '/calendar':
      return {
        title: 'School Event Calendar 📅',
        text: 'I am Barnaby. View scheduled academic sessions, holidays, and sports fixtures.',
        tip: 'Use category filters to narrow down events.'
      };
    case '/contact':
      return {
        title: 'Contact Administrative Office 📬',
        text: 'I am Barnaby. Need assistance reaching our campus or submitting an inquiry? I will coach you as you fill the form!',
        tip: 'Fill in your details below; format hints will guide you.'
      };
    case '/':
      return {
        title: 'Welcome to School Website! 🦉',
        text: 'I am Barnaby, your campus guide. Explore student life dimensions or visit our admissions and academic portals.',
        tip: 'Notice how I settle into safe section stops as you scroll!'
      };
    default:
      return {
        title: 'Looking for Campus Info? 🧭',
        text: "I am Barnaby. It looks like this page isn't on our campus map. Let me guide you back to our main portal.",
        tip: 'Click Home in the top navigation bar to return safely.'
      };
  }
};

export const MascotProvider = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [mascotState, setMascotState] = useState('greeting'); // 'idle' | 'greeting' | 'curious' | 'attentive' | 'explaining' | 'thinking' | 'warning' | 'reassuring' | 'success' | 'confused'
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    if (currentPath === '/contact') return 'contact-form-section';
    if (currentPath === '/about') return 'about-overview';
    if (currentPath === '/admissions') return 'admissions-portal';
    if (currentPath === '/academics') return 'academics-curriculum';
    if (currentPath === '/faith') return 'faith-values';
    if (currentPath === '/calendar') return 'calendar-preview';
    return 'hero';
  });
  const [hasUserClosedBubble, setHasUserClosedBubble] = useState(false);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);

  // Detect real input capabilities & device modes (not just viewport width)
  const [deviceMode, setDeviceMode] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const hasFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isSmallScreen = window.innerWidth <= 640;
    if (isSmallScreen) return 'mobile';
    if (!hasFinePointer) return 'tablet-touch';
    return 'desktop';
  });

  const previousPathRef = useRef(null);
  const visitedSectionsRef = useRef(new Set());
  const isHoveringBubbleRef = useRef(false);
  const hoverBridgeTimerRef = useRef(null);
  const autoDismissTimerRef = useRef(null);
  const activeFocusedFieldRef = useRef(null);
  const pendingSectionRef = useRef(null);
  const hasUserClosedBubbleRef = useRef(false);

  // Sync ref with state
  useEffect(() => {
    hasUserClosedBubbleRef.current = hasUserClosedBubble;
  }, [hasUserClosedBubble]);

  // Initial greeting object
  const initialGreeting = getPageGreeting(currentPath);
  const [activeMessage, setActiveMessage] = useState({
    title: initialGreeting.title,
    text: initialGreeting.text,
    example: initialGreeting.tip,
    suggestion: null,
    onApplySuggestion: null,
    priority: 1, // 1: idle/greeting, 2: section intro, 3: hover/focus helper, 4: form field coach
    source: 'greeting'
  });

  const currentInteractionRef = useRef({ priority: 1, source: 'greeting' });

  // Clear any active auto-dismiss timer safely
  const clearAutoDismissTimer = useCallback(() => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
  }, []);

  // Set message with priority check & auto-dismissal
  const setMessageWithPriority = useCallback((msgObj, state = 'explaining', autoDismissMs = 0) => {
    clearAutoDismissTimer();

    const newPriority = msgObj.priority || 1;
    // Only overwrite if equal or higher priority, or if previous interaction concluded
    if (newPriority >= currentInteractionRef.current.priority || currentInteractionRef.current.priority <= 2) {
      currentInteractionRef.current.priority = newPriority;
      currentInteractionRef.current.source = msgObj.source || 'custom';
      setActiveMessage(msgObj);
      setMascotState(state);
      setIsBubbleVisible(true);

      if (autoDismissMs > 0) {
        autoDismissTimerRef.current = setTimeout(() => {
          if (currentInteractionRef.current.source === msgObj.source) {
            currentInteractionRef.current.priority = 1;
            setMascotState('idle');
            setIsBubbleVisible(false); // Cleanly closes bubble after duration
          }
        }, autoDismissMs);
      }
    }
  }, [clearAutoDismissTimer]);

  // Evaluate device mode on resize and orientation change
  useEffect(() => {
    const evaluateDeviceMode = () => {
      const hasFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      const isSmallScreen = window.innerWidth <= 640;
      let mode = 'desktop';
      if (isSmallScreen) {
        mode = 'mobile';
      } else if (!hasFinePointer) {
        mode = 'tablet-touch';
      }
      setDeviceMode(mode);
    };

    window.addEventListener('resize', evaluateDeviceMode, { passive: true });
    window.addEventListener('orientationchange', evaluateDeviceMode, { passive: true });

    return () => {
      window.removeEventListener('resize', evaluateDeviceMode);
      window.removeEventListener('orientationchange', evaluateDeviceMode);
    };
  }, []);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      clearAutoDismissTimer();
      if (hoverBridgeTimerRef.current) clearTimeout(hoverBridgeTimerRef.current);
    };
  }, [clearAutoDismissTimer]);

  // =========================================================================
  // GREETING LIFECYCLE: One greeting on EVERY distinct page visit
  // =========================================================================
  useEffect(() => {
    if (previousPathRef.current === currentPath) return;
    previousPathRef.current = currentPath;

    // Reset visit-scoped dismissal flag & clear session section cache for new page
    setHasUserClosedBubble(false);
    hasUserClosedBubbleRef.current = false;
    visitedSectionsRef.current.clear();
    clearAutoDismissTimer();

    // Map route to initial page section
    let initialSection = 'hero';
    if (currentPath === '/about') initialSection = 'about-overview';
    else if (currentPath === '/admissions') initialSection = 'admissions-portal';
    else if (currentPath === '/academics') initialSection = 'academics-curriculum';
    else if (currentPath === '/faith') initialSection = 'faith-values';
    else if (currentPath === '/calendar') initialSection = 'calendar-preview';
    else if (currentPath === '/contact') initialSection = 'contact-form-section';

    setActiveSection(initialSection);

    // If visitor is currently typing or focused in a form field, do NOT interrupt!
    if (activeFocusedFieldRef.current) {
      return;
    }

    // Trigger greeting once for this page visit (auto-dismisses after 7 seconds)
    const pageGreeting = getPageGreeting(currentPath);
    setMessageWithPriority({
      title: pageGreeting.title,
      text: pageGreeting.text,
      example: pageGreeting.tip || null,
      priority: 1,
      source: 'greeting'
    }, 'greeting', 7000);
  }, [currentPath, clearAutoDismissTimer, setMessageWithPriority]);

  // Section visibility change handler with hysteresis & queueing
  const notifySectionChange = useCallback((sectionId) => {
    // If user is actively typing or focused in a form field, queue destination and do not interrupt
    if (activeFocusedFieldRef.current) {
      pendingSectionRef.current = sectionId;
      return;
    }

    setActiveSection(sectionId);

    // Section transitions do NOT automatically pop open speech bubbles!
    // Barnaby settles into the stop quietly in an idle, attentive posture.
    if (currentInteractionRef.current.source === 'section') {
      setMascotState('idle');
    }
  }, []);

  // Hover helper handler with bridge protection and dismissal respect
  const setHoverHelper = useCallback((meta) => {
    if (!meta || !meta.title) return;
    // CRITICAL: Respect explicit dismissal; hovering must NOT reopen a dismissed bubble
    if (hasUserClosedBubbleRef.current) return;
    if (currentInteractionRef.current.priority > 3) return; // Don't interrupt active form field coaching

    if (hoverBridgeTimerRef.current) {
      clearTimeout(hoverBridgeTimerRef.current);
      hoverBridgeTimerRef.current = null;
    }

    setMessageWithPriority({
      title: meta.title,
      text: meta.description || '',
      example: meta.example || null,
      priority: 3,
      source: 'hover'
    }, 'attentive', 7000);
  }, [setMessageWithPriority]);

  const clearHoverHelper = useCallback(() => {
    if (isHoveringBubbleRef.current) {
      // User moved pointer onto speech bubble; keep it open!
      return;
    }

    if (hoverBridgeTimerRef.current) {
      clearTimeout(hoverBridgeTimerRef.current);
    }

    hoverBridgeTimerRef.current = setTimeout(() => {
      if (!isHoveringBubbleRef.current && currentInteractionRef.current.source === 'hover') {
        currentInteractionRef.current.priority = 1;
        setMascotState('idle');
        setIsBubbleVisible(false); // Cleanly close bubble when hover concludes
      }
    }, 280);
  }, []);

  // Form Field Validation Coach (strictly local privacy; never logged or transmitted)
  const setFieldFocus = useCallback((fieldName) => {
    activeFocusedFieldRef.current = fieldName;
    const config = FIELD_VALIDATION_REGISTRY[fieldName];
    if (!config) return;

    setMessageWithPriority({
      title: `${config.label} Guide`,
      text: config.instructions,
      example: config.example ? `Example: ${config.example}` : null,
      format: config.format,
      priority: 4,
      source: `field-${fieldName}`
    }, 'thinking');
  }, [setMessageWithPriority]);

  const handleFieldChange = useCallback((fieldName, value, onApplySuggestion) => {
    const config = FIELD_VALIDATION_REGISTRY[fieldName];
    if (!config) return { isValid: true };

    const validationResult = config.validate(value);
    let suggestion = null;

    if (config.suggestCorrection) {
      suggestion = config.suggestCorrection(value);
    }

    // Handle empty optional fields cleanly without false "Verified" celebrations
    if (validationResult.isOptionalEmpty) {
      setMessageWithPriority({
        title: `${config.label} (Optional)`,
        text: validationResult.message,
        example: config.example ? `Example: ${config.example}` : null,
        priority: 3,
        source: `field-${fieldName}`
      }, 'idle');
      return validationResult;
    }

    setMessageWithPriority({
      title: validationResult.isValid ? `${config.label} Verified` : `${config.label} Notice`,
      text: validationResult.message,
      example: config.example ? `Expected Format: ${config.example}` : null,
      suggestion: suggestion,
      onApplySuggestion: suggestion ? () => onApplySuggestion(suggestion) : null,
      priority: 4,
      source: `field-${fieldName}`
    }, validationResult.isValid ? 'success' : 'warning');

    return validationResult;
  }, [setMessageWithPriority]);

  const clearFieldFocus = useCallback((fieldName) => {
    if (activeFocusedFieldRef.current === fieldName) {
      activeFocusedFieldRef.current = null;
    }

    // Apply any pending section change that arrived while the form field was focused
    if (pendingSectionRef.current) {
      const nextSec = pendingSectionRef.current;
      pendingSectionRef.current = null;
      setActiveSection(nextSec);
    }

    if (currentInteractionRef.current.source === `field-${fieldName}`) {
      currentInteractionRef.current.priority = 1;
      setMascotState('idle');
      setIsBubbleVisible(false);
    }
  }, []);

  // Explicit Help Request (e.g. clicking Barnaby or Help button)
  const requestHelp = useCallback((topicOrSection = null) => {
    setHasUserClosedBubble(false);
    hasUserClosedBubbleRef.current = false;
    setIsMinimized(false);
    setIsDismissed(false);

    const sectionToExplain = topicOrSection || activeSection;
    const sectionInfo = SECTION_CONTEXTS[sectionToExplain];

    if (sectionInfo) {
      setMessageWithPriority({
        title: sectionInfo.title,
        text: sectionInfo.description,
        example: sectionInfo.actionHint,
        priority: 3,
        source: `explicit-${sectionToExplain}`
      }, 'explaining', 9000);
    } else {
      setMessageWithPriority({
        title: 'Campus Companion Barnaby',
        text: 'I am here to help you navigate academic programs, admissions criteria, and school events. Tap any section or card for details!',
        priority: 3,
        source: 'general-help'
      }, 'greeting', 8000);
    }
  }, [activeSection, setMessageWithPriority]);

  // Window & Bubble Dismissal Controls (scoped to current page visit)
  const dismissBubble = useCallback(() => {
    clearAutoDismissTimer();
    setHasUserClosedBubble(true);
    hasUserClosedBubbleRef.current = true;
    setIsBubbleVisible(false);
    setMascotState('idle');
    currentInteractionRef.current.priority = 1;
  }, [clearAutoDismissTimer]);

  const minimizeMascot = useCallback(() => {
    clearAutoDismissTimer();
    setIsBubbleVisible(false);
    setIsMinimized(true);
  }, [clearAutoDismissTimer]);

  const maximizeMascot = useCallback(() => {
    setIsMinimized(false);
    setIsDismissed(false);
    setHasUserClosedBubble(false);
    hasUserClosedBubbleRef.current = false;
    setIsBubbleVisible(true);
    setMascotState('explaining');
  }, []);

  const dismissMascot = useCallback(() => {
    clearAutoDismissTimer();
    setIsBubbleVisible(false);
    setIsDismissed(true);
  }, [clearAutoDismissTimer]);

  const restoreMascot = useCallback(() => {
    setIsDismissed(false);
    setIsMinimized(false);
    setHasUserClosedBubble(false);
    hasUserClosedBubbleRef.current = false;
    setIsBubbleVisible(true);
    setMascotState('greeting');
  }, []);

  const setHoveringBubble = useCallback((isHovering) => {
    isHoveringBubbleRef.current = isHovering;
    if (isHovering && hoverBridgeTimerRef.current) {
      clearTimeout(hoverBridgeTimerRef.current);
      hoverBridgeTimerRef.current = null;
    }
  }, []);

  return (
    <MascotContext.Provider value={{
      mascotState,
      setMascotState,
      isMinimized,
      isDismissed,
      deviceMode,
      activeMessage,
      setActiveMessage,
      setMessageWithPriority,
      activeSection,
      hasUserClosedBubble,
      isBubbleVisible,
      notifySectionChange,
      setHoverHelper,
      clearHoverHelper,
      setHoveringBubble,
      setFieldFocus,
      handleFieldChange,
      clearFieldFocus,
      requestHelp,
      dismissBubble,
      minimizeMascot,
      maximizeMascot,
      dismissMascot,
      restoreMascot
    }}>
      {children}
    </MascotContext.Provider>
  );
};
