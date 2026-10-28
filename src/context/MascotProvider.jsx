import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SECTION_CONTEXTS, FIELD_VALIDATION_REGISTRY } from '../data/helperRegistry';
import { MascotContext } from './MascotContext';
import { useSchoolConfig } from './SchoolConfigContext';
import { processUserMessage, getContextualSuggestedQuestions } from '../utils/barnabyChatEngine';

// Page-specific informational summaries (used on-demand, not auto-popped)
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
        tip: 'Click Ask Barnaby anytime to chat!'
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
  const { config } = useSchoolConfig();

  // Assistant & Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState(() => [
    {
      id: 'welcome-1',
      sender: 'barnaby',
      text: "Hello! I am Barnaby, your campus guide. What would you like to know about the school? Feel free to ask about admissions, curriculum, events, or school contacts!",
      topic: 'greeting',
      timestamp: Date.now()
    }
  ]);
  const [dynamicSuggestedQuestions, setDynamicSuggestedQuestions] = useState(() => getContextualSuggestedQuestions(currentPath));

  useEffect(() => {
    setDynamicSuggestedQuestions(getContextualSuggestedQuestions(currentPath));
  }, [currentPath]);

  const [mascotState, setMascotState] = useState('idle'); // 'idle' | 'greeting' | 'curious' | 'attentive' | 'explaining' | 'thinking' | 'warning' | 'reassuring' | 'success' | 'confused' | 'listening' | 'resting'
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

  // Keep speech bubble visibility default FALSE so no unsolicited bubbles pop open
  const [hasUserClosedBubble, setHasUserClosedBubble] = useState(true);
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);

  // Detect real input capabilities & device modes
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
  const hasUserClosedBubbleRef = useRef(true);
  const isRespondingRef = useRef(false);
  const responseTimerRef = useRef(null);
  const chatMessagesRef = useRef(chatMessages);

  // Keep ref synchronized with latest messages
  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

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
    priority: 1,
    source: 'greeting'
  });

  const currentInteractionRef = useRef({ priority: 1, source: 'greeting' });

  // Clear active auto-dismiss timer
  const clearAutoDismissTimer = useCallback(() => {
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
  }, []);

  // Set message with priority check (kept for backward-compatibility with tests & field coaches)
  const setMessageWithPriority = useCallback((msgObj, state = 'explaining', autoDismissMs = 0) => {
    clearAutoDismissTimer();

    const newPriority = msgObj.priority || 1;
    if (newPriority >= currentInteractionRef.current.priority || currentInteractionRef.current.priority <= 2) {
      currentInteractionRef.current.priority = newPriority;
      currentInteractionRef.current.source = msgObj.source || 'custom';
      setActiveMessage(msgObj);
      setMascotState(state);

      if (autoDismissMs > 0) {
        autoDismissTimerRef.current = setTimeout(() => {
          if (currentInteractionRef.current.source === msgObj.source) {
            currentInteractionRef.current.priority = 1;
            setMascotState('idle');
            setIsBubbleVisible(false);
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

  // Silent route sync: Never pops open unprompted greetings on page change!
  useEffect(() => {
    if (previousPathRef.current === currentPath) return;
    previousPathRef.current = currentPath;

    visitedSectionsRef.current.clear();
    clearAutoDismissTimer();

    let initialSection = 'hero';
    if (currentPath === '/about') initialSection = 'about-overview';
    else if (currentPath === '/admissions') initialSection = 'admissions-portal';
    else if (currentPath === '/academics') initialSection = 'academics-curriculum';
    else if (currentPath === '/faith') initialSection = 'faith-values';
    else if (currentPath === '/calendar') initialSection = 'calendar-preview';
    else if (currentPath === '/contact') initialSection = 'contact-form-section';

    setActiveSection(initialSection);

    // Barnaby quietly remains idle until user opens the chatbot
    if (!isChatOpen) {
      setMascotState('idle');
    }
  }, [currentPath, clearAutoDismissTimer, isChatOpen]);

  // Section change handler: keeps Barnaby quiet in idle state
  const notifySectionChange = useCallback((sectionId) => {
    if (activeFocusedFieldRef.current) {
      pendingSectionRef.current = sectionId;
      return;
    }
    setActiveSection(sectionId);
    if (!isChatOpen) {
      setMascotState('idle');
    }
  }, [isChatOpen]);

  // Hover helper (only triggers if user requested help)
  const setHoverHelper = useCallback((meta) => {
    if (!meta || !meta.title) return;
    if (hasUserClosedBubbleRef.current && !isChatOpen) return;
    if (currentInteractionRef.current.priority > 3) return;

    if (hoverBridgeTimerRef.current) {
      clearTimeout(hoverBridgeTimerRef.current);
      hoverBridgeTimerRef.current = null;
    }

    setMessageWithPriority({
      title: meta.title,
      text: meta.description,
      example: meta.example || null,
      priority: 3,
      source: 'hover'
    }, 'explaining');
  }, [isChatOpen, setMessageWithPriority]);

  const clearHoverHelper = useCallback(() => {
    if (currentInteractionRef.current.source !== 'hover') return;
    if (hoverBridgeTimerRef.current) clearTimeout(hoverBridgeTimerRef.current);

    hoverBridgeTimerRef.current = setTimeout(() => {
      if (isHoveringBubbleRef.current) return;
      currentInteractionRef.current.priority = 1;
      setMascotState('idle');
      setIsBubbleVisible(false);
    }, 180);
  }, []);

  // Form Field Validation Coaching (only on focused form inputs)
  const setFieldFocus = useCallback((fieldName) => {
    activeFocusedFieldRef.current = fieldName;
    const rule = FIELD_VALIDATION_REGISTRY[fieldName];
    if (rule && rule.hint) {
      setMessageWithPriority({
        title: `Field: ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`,
        text: rule.hint,
        priority: 4,
        source: 'form-coach'
      }, 'listening');
    }
  }, [setMessageWithPriority]);

  const clearFieldFocus = useCallback((fieldName) => {
    if (activeFocusedFieldRef.current === fieldName) {
      activeFocusedFieldRef.current = null;
    }
    if (currentInteractionRef.current.source === 'form-coach') {
      currentInteractionRef.current.priority = 1;
      setMascotState('idle');
      setIsBubbleVisible(false);
    }
    if (pendingSectionRef.current) {
      setActiveSection(pendingSectionRef.current);
      pendingSectionRef.current = null;
    }
  }, []);

  const handleFieldChange = useCallback((fieldName, value, onApplyCorrection = null) => {
    const rule = FIELD_VALIDATION_REGISTRY[fieldName];
    if (!rule) return;

    const validation = rule.validate(value);
    if (!validation.isValid && validation.message) {
      const suggestion = rule.suggestCorrection ? rule.suggestCorrection(value) : null;
      setMessageWithPriority({
        title: `Check ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}`,
        text: validation.message,
        suggestion: suggestion,
        onApplySuggestion: suggestion && onApplyCorrection ? () => onApplyCorrection(suggestion) : null,
        priority: 4,
        source: 'form-coach'
      }, 'warning');
    } else {
      currentInteractionRef.current.priority = 1;
      setMascotState('idle');
      setIsBubbleVisible(false);
    }
  }, [setMessageWithPriority]);

  // Request help manually (opens chatbot)
  const requestHelp = useCallback(() => {
    setIsChatOpen(true);
    setIsMinimized(false);
    setIsDismissed(false);
    setMascotState('greeting');
  }, []);

  // Chat controls
  const openChat = useCallback(() => {
    setIsChatOpen(true);
    setIsMinimized(false);
    setIsDismissed(false);
    setMascotState('greeting');
  }, []);

  const closeChat = useCallback(() => {
    setIsChatOpen(false);
    setMascotState('idle');
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => {
      const next = !prev;
      setMascotState(next ? 'greeting' : 'idle');
      return next;
    });
  }, []);

  const clearChat = useCallback(() => {
    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }
    isRespondingRef.current = false;
    setIsTyping(false);
    setChatMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'barnaby',
        text: "Hello! I am Barnaby, your campus guide. What would you like to know about the school? Feel free to ask about admissions, curriculum, events, or school contacts!",
        topic: 'greeting',
        timestamp: Date.now()
      }
    ]);
    setDynamicSuggestedQuestions(getContextualSuggestedQuestions(currentPath));
    setMascotState('idle');
  }, [currentPath]);

  // Send message through context-aware conversational engine with multi-turn memory
  const sendMessage = useCallback((text) => {
    if (!text || !text.trim()) return;
    if (isRespondingRef.current) return; // Prevent duplicate concurrent executions
    isRespondingRef.current = true;

    const cleanText = text.trim();
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: cleanText,
      timestamp: Date.now()
    };

    // 1. Pure state update for user message
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setMascotState('thinking');

    // 2. Clear any lingering response timer
    if (responseTimerRef.current) {
      clearTimeout(responseTimerRef.current);
      responseTimerRef.current = null;
    }

    // 3. Single external timer scheduled safely outside state updater
    responseTimerRef.current = setTimeout(() => {
      const currentMessages = chatMessagesRef.current;
      const result = processUserMessage(cleanText, currentPath, config, currentMessages);
      const uniqueMsgId = 'barnaby-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const barnabyMsg = {
        id: uniqueMsgId,
        sender: 'barnaby',
        text: result.text,
        structuredData: result.structuredData || null,
        action: result.action || null,
        topic: result.topic || null,
        timestamp: Date.now()
      };

      setChatMessages(prev => {
        // Bulletproof Deduplication: if the last message was from barnaby and has identical text within 2.5 seconds, ignore
        const lastMsg = prev[prev.length - 1];
        if (
          lastMsg &&
          lastMsg.sender === 'barnaby' &&
          lastMsg.text === barnabyMsg.text &&
          (Date.now() - (lastMsg.timestamp || 0) < 2500)
        ) {
          return prev;
        }
        return [...prev, barnabyMsg];
      });

      if (result.suggestedFollowUps && result.suggestedFollowUps.length > 0) {
        setDynamicSuggestedQuestions(result.suggestedFollowUps);
      }
      setIsTyping(false);
      setMascotState(result.expression || 'explaining');
      isRespondingRef.current = false;
      responseTimerRef.current = null;
    }, 280);
  }, [currentPath, config]);

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
    setIsChatOpen(false);
    setIsBubbleVisible(false);
    setIsMinimized(true);
  }, [clearAutoDismissTimer]);

  const maximizeMascot = useCallback(() => {
    setIsMinimized(false);
    setIsDismissed(false);
    setIsChatOpen(true);
    setMascotState('greeting');
  }, []);

  const dismissMascot = useCallback(() => {
    clearAutoDismissTimer();
    setIsChatOpen(false);
    setIsBubbleVisible(false);
    setIsDismissed(true);
  }, [clearAutoDismissTimer]);

  const restoreMascot = useCallback(() => {
    setIsDismissed(false);
    setIsMinimized(false);
    setIsChatOpen(true);
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
      // Chatbot Engine API
      isChatOpen,
      isTyping,
      chatMessages,
      openChat,
      closeChat,
      toggleChat,
      clearChat,
      sendMessage,
      suggestedQuestions: dynamicSuggestedQuestions || getContextualSuggestedQuestions(currentPath),

      // Core Mascot State & Backward Compatibility
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
