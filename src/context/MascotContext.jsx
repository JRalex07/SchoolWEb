import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SECTION_CONTEXTS, FIELD_VALIDATION_REGISTRY } from '../data/helperRegistry';

const MascotContext = createContext();

export const MascotProvider = ({ children }) => {
  const [mascotState, setMascotState] = useState('greeting'); // 'idle' | 'greeting' | 'hover' | 'explaining' | 'thinking' | 'warning' | 'reassuring' | 'success'
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Time-aware welcome on initial load
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return {
        title: 'Good morning! ☀️ I am Barnaby',
        text: 'Welcome to our school portal. Ready for a day of learning? I will accompany you as you explore each section!',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        title: 'Good afternoon! 🏫 I am Barnaby',
        text: 'Welcome to our campus community. Looking for academics, admissions, or calendar events? I am here to guide you!',
      };
    } else {
      return {
        title: 'Good evening! ✨ I am Barnaby',
        text: 'Welcome to our school website. Exploring our institutional programs or admissions info? I will assist your tour!',
      };
    }
  };

  const initialGreeting = getTimeBasedGreeting();

  // Active message details
  const [activeMessage, setActiveMessage] = useState({
    title: initialGreeting.title,
    text: initialGreeting.text,
    example: 'Tip: Notice how I move with you as you scroll to each section!',
    suggestion: null,
    onApplySuggestion: null,
    priority: 1, // 1: idle/greeting, 2: section, 3: hover/focus, 4: field validation
    source: 'greeting'
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [activeTargetRect, setActiveTargetRect] = useState(null);

  // Track active focus / validation state to prevent section scroll from wiping active form guidance
  const currentInteractionRef = useRef({ priority: 1, source: 'greeting', timer: null });

  // Transition from greeting to idle after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentInteractionRef.current.source === 'greeting') {
        setMascotState('idle');
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  // Set message with priority check
  const setMessageWithPriority = useCallback((msgObj, state = 'explaining', autoDismissMs = 0) => {
    if (currentInteractionRef.current.timer) {
      clearTimeout(currentInteractionRef.current.timer);
      currentInteractionRef.current.timer = null;
    }

    const newPriority = msgObj.priority || 1;
    // Only overwrite if equal or higher priority, or if previous source cleared
    if (newPriority >= currentInteractionRef.current.priority || currentInteractionRef.current.priority <= 2) {
      currentInteractionRef.current.priority = newPriority;
      currentInteractionRef.current.source = msgObj.source || 'custom';
      setActiveMessage(msgObj);
      setMascotState(state);

      if (autoDismissMs > 0) {
        currentInteractionRef.current.timer = setTimeout(() => {
          if (currentInteractionRef.current.source === msgObj.source) {
            currentInteractionRef.current.priority = 1;
            setMascotState('idle');
          }
        }, autoDismissMs);
      }
    }
  }, []);

  // Section visibility change handler
  const notifySectionChange = useCallback((sectionId, sectionRect = null) => {
    setActiveSection(sectionId);
    if (sectionRect) {
      setActiveTargetRect(sectionRect);
    }

    const sectionInfo = SECTION_CONTEXTS[sectionId];
    if (sectionInfo) {
      // If user is currently in a field or hover interaction, do not interrupt speech!
      if (currentInteractionRef.current.priority > 2) {
        return;
      }

      setMessageWithPriority({
        title: sectionInfo.title,
        text: sectionInfo.description,
        example: sectionInfo.actionHint,
        priority: 2,
        source: `section-${sectionId}`
      }, 'explaining', 9000);
    }
  }, [setMessageWithPriority]);

  // Hover helper handler
  const setHoverHelper = useCallback((meta, targetRect = null) => {
    if (!meta || !meta.title) return;
    if (currentInteractionRef.current.priority > 3) return; // Don't interrupt active form field error

    if (targetRect) {
      setActiveTargetRect(targetRect);
    }

    setMessageWithPriority({
      title: meta.title,
      text: meta.description || '',
      example: meta.example || null,
      priority: 3,
      source: 'hover'
    }, 'hover', 7000);
  }, [setMessageWithPriority]);

  const clearHoverHelper = useCallback(() => {
    if (currentInteractionRef.current.source === 'hover') {
      currentInteractionRef.current.priority = 1;
      setMascotState('idle');
      setActiveTargetRect(null);
    }
  }, []);

  // Form Field Validation Coach
  const setFieldFocus = useCallback((fieldName, targetRect = null) => {
    const config = FIELD_VALIDATION_REGISTRY[fieldName];
    if (!config) return;

    if (targetRect) {
      setActiveTargetRect(targetRect);
    }

    setMessageWithPriority({
      title: `${config.label} Guide`,
      text: config.instructions,
      example: config.example ? `Example: ${config.example}` : null,
      format: config.format,
      priority: 4,
      source: `field-${fieldName}`
    }, 'thinking');
  }, [setMessageWithPriority]);

  const handleFieldChange = useCallback((fieldName, value, onApplySuggestion, targetRect = null) => {
    const config = FIELD_VALIDATION_REGISTRY[fieldName];
    if (!config) return { isValid: true };

    if (targetRect) {
      setActiveTargetRect(targetRect);
    }

    const validationResult = config.validate(value);
    let suggestion = null;

    if (config.suggestCorrection) {
      suggestion = config.suggestCorrection(value);
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
    if (currentInteractionRef.current.source === `field-${fieldName}`) {
      currentInteractionRef.current.priority = 1;
      setMascotState('idle');
      setActiveTargetRect(null);
    }
  }, []);

  // Window Controls
  const minimizeMascot = () => setIsMinimized(true);
  const maximizeMascot = () => {
    setIsMinimized(false);
    setIsDismissed(false);
    setMascotState('explaining');
  };
  const dismissMascot = () => setIsDismissed(true);
  const restoreMascot = () => {
    setIsDismissed(false);
    setIsMinimized(false);
    setMascotState('greeting');
  };

  return (
    <MascotContext.Provider value={{
      mascotState,
      setMascotState,
      isMinimized,
      isDismissed,
      activeMessage,
      setActiveMessage,
      setMessageWithPriority,
      activeSection,
      activeTargetRect,
      notifySectionChange,
      setHoverHelper,
      clearHoverHelper,
      setFieldFocus,
      handleFieldChange,
      clearFieldFocus,
      minimizeMascot,
      maximizeMascot,
      dismissMascot,
      restoreMascot
    }}>
      {children}
    </MascotContext.Provider>
  );
};

export const useMascot = () => {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error('useMascot must be used within a MascotProvider');
  }
  return context;
};
