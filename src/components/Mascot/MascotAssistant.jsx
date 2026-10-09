import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useMascot } from '../../context/MascotContext';
import { MascotCharacter } from './MascotCharacter';
import { MascotSpeechBubble } from './MascotSpeechBubble';
import { getStopForSection } from '../../data/mascotMovementPaths';
import { calculateSafeAssistantLayout, MASCOT_DIMENSIONS } from '../../utils/mascotPositionCalculator';
import { ChevronUp, X, Sparkles } from 'lucide-react';

export const MascotAssistant = () => {
  const {
    mascotState,
    setMascotState,
    isMinimized,
    isDismissed,
    activeMessage,
    activeSection,
    notifySectionChange,
    minimizeMascot,
    maximizeMascot,
    dismissMascot,
    restoreMascot
  } = useMascot();

  const [speechBubbleOpen, setSpeechBubbleOpen] = useState(true);
  const [bubbleDimensions, setBubbleDimensions] = useState({ width: 320, height: 160 });
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const bubbleRef = useRef(null);
  const sectionDwellTimer = useRef(null);
  const pendingSectionRef = useRef(null);
  const isInteractingRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // Track active stop based on currently confirmed active section
  const [currentStopId, setCurrentStopId] = useState('hero-stop');

  // Lock movement while user is actively filling forms or reading warning/thinking states
  useEffect(() => {
    isInteractingRef.current = mascotState === 'warning' || mascotState === 'thinking';
  }, [mascotState]);

  // Re-open speech bubble whenever a new message arrives
  useEffect(() => {
    if (activeMessage && activeMessage.text) {
      setSpeechBubbleOpen(true);
    }
  }, [activeMessage]);

  // 1. Efficient Section-awareness with Hysteresis & Dwell Stability
  // The mascot ONLY moves when a new section has consistently settled into view
  useEffect(() => {
    const handleIntersection = (entries) => {
      // Find the most prominent intersecting section
      let bestEntry = null;
      let maxRatio = 0;

      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          bestEntry = entry;
        }
      }

      if (bestEntry && maxRatio >= 0.3) {
        const sectionId = bestEntry.target.getAttribute('data-section-id') || bestEntry.target.id;
        if (!sectionId || sectionId === pendingSectionRef.current) return;

        pendingSectionRef.current = sectionId;

        // Apply hysteresis: wait 220ms before committing to prevent jitter while scrolling rapidly
        if (sectionDwellTimer.current) clearTimeout(sectionDwellTimer.current);
        sectionDwellTimer.current = setTimeout(() => {
          if (!isInteractingRef.current) {
            notifySectionChange(sectionId);
            const resolvedStop = getStopForSection(sectionId);
            setCurrentStopId(resolvedStop.id);
          }
        }, 220);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: [0.3, 0.5, 0.7]
    });

    const targetSections = document.querySelectorAll('[data-section-id], section[id], footer[id="footer"]');
    targetSections.forEach(sec => observer.observe(sec));

    return () => {
      targetSections.forEach(sec => observer.unobserve(sec));
      observer.disconnect();
      if (sectionDwellTimer.current) clearTimeout(sectionDwellTimer.current);
    };
  }, [notifySectionChange]);

  // Synchronize stop when activeSection changes externally (e.g. route changes)
  useEffect(() => {
    if (activeSection) {
      const resolved = getStopForSection(activeSection);
      setCurrentStopId(resolved.id);
    }
  }, [activeSection]);

  // 2. Measure bubble DOM dimensions to ensure millimeter-accurate footprint calculation
  useEffect(() => {
    if (!bubbleRef.current) return;

    const measureBubble = () => {
      if (bubbleRef.current) {
        const rect = bubbleRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setBubbleDimensions(prev => {
            if (Math.abs(prev.width - rect.width) > 4 || Math.abs(prev.height - rect.height) > 4) {
              return { width: Math.round(rect.width), height: Math.round(rect.height) };
            }
            return prev;
          });
        }
      }
    };

    measureBubble();

    // ResizeObserver for dynamic message content expansions
    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        measureBubble();
      });
      ro.observe(bubbleRef.current);
    }

    return () => {
      if (ro) ro.disconnect();
    };
  }, [activeMessage, speechBubbleOpen]);

  // 3. Viewport Resize & Orientation Change Listener
  useEffect(() => {
    let resizeTimer = null;
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 70);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  // 4. Calculate Master Viewport Layout Footprint
  // Resolves non-overflowing fixed coordinates for both mascot and speech bubble
  const layout = useMemo(() => {
    const stop = getStopForSection(activeSection) || getStopForSection(currentStopId);
    return calculateSafeAssistantLayout({
      stop,
      viewportWidth: windowDimensions.width,
      viewportHeight: windowDimensions.height,
      isBubbleOpen: speechBubbleOpen && !!(activeMessage && activeMessage.text),
      bubbleDimensions
    });
  }, [activeSection, currentStopId, windowDimensions, speechBubbleOpen, activeMessage, bubbleDimensions]);

  // Spring physics transition configuration for smooth path traversal
  // Smooth, relaxed spring physics transition for gentle, elegant gliding (not rushed)
  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
      type: 'spring',
      stiffness: 28, // Low stiffness prevents rushing or snapping
      damping: 15,   // Smooth deceleration without bouncing or jitter
      mass: 1.3      // Weighted, leisurely floating glide (~1.3s - 1.5s travel)
    };

  // If dismissed, render a small unobtrusive restore trigger
  if (isDismissed) {
    return (
      <AnimatePresence>
        <motion.button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={restoreMascot}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999,
            borderRadius: 'var(--radius-full)',
            padding: '0.6rem 1.25rem',
            fontSize: '0.85rem',
            boxShadow: 'var(--clay-badge)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            fontWeight: 700,
            color: 'var(--color-primary)'
          }}
          title="Reopen Campus Companion Barnaby"
        >
          <Sparkles size={16} color="var(--color-accent)" />
          <span>Ask Barnaby</span>
        </motion.button>
      </AnimatePresence>
    );
  }

  // If minimized, render a compact pill gliding with smooth spring physics to the current safe coordinates
  if (isMinimized) {
    return (
      <motion.div
        className="mascot-minimized-pill"
        onClick={maximizeMascot}
        initial={false}
        animate={{ x: layout.mascot.x, y: layout.mascot.y }}
        transition={springTransition}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
          borderRadius: 'var(--radius-full)',
          padding: '0.55rem 1.15rem',
          boxShadow: 'var(--clay-card)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          border: '2px solid rgba(255, 255, 255, 0.95)'
        }}
        role="button"
        tabIndex={0}
        aria-label="Expand Campus Assistant Barnaby"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') maximizeMascot(); }}
      >
        <div style={{ width: '28px', height: '28px' }}>
          <MascotCharacter state="idle" />
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
          Barnaby
        </span>
        <ChevronUp size={16} color="var(--color-accent)" />
      </motion.div>
    );
  }

  return (
    <>
      {/* 1. Speech Bubble Layer - Strictly Clamped, Dynamically Placed */}
      <AnimatePresence>
        {speechBubbleOpen && activeMessage && activeMessage.text && layout.bubble && (
          <motion.div
            key="mascot-speech-bubble-portal"
            ref={bubbleRef}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{
              x: layout.bubble.x,
              y: layout.bubble.y,
              width: layout.bubble.width,
              opacity: 1,
              scale: 1
            }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={shouldReduceMotion ? { duration: 0 } : {
              x: springTransition,
              y: springTransition,
              width: { duration: 0.25 },
              opacity: { duration: 0.25 },
              scale: { duration: 0.25 }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 992,
              pointerEvents: 'auto',
              maxWidth: `${layout.maxBubbleWidth}px`
            }}
          >
            <MascotSpeechBubble
              message={activeMessage}
              state={mascotState}
              onClose={() => setSpeechBubbleOpen(false)}
              onMinimize={minimizeMascot}
              onApplySuggestion={activeMessage.onApplySuggestion}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Mascot Character Layer - Predefined Section Path Glider */}
      <motion.aside
        className="mascot-intelligent-companion"
        aria-label="Campus Companion Barnaby"
        initial={false}
        animate={{ x: layout.mascot.x, y: layout.mascot.y }}
        transition={springTransition}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 991,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          pointerEvents: 'none',
          width: `${MASCOT_DIMENSIONS.width + 32}px`
        }}
      >
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <MascotCharacter
              state={mascotState}
              onClick={() => {
                setSpeechBubbleOpen(prev => !prev);
                if (!speechBubbleOpen) setMascotState('greeting');
              }}
            />
          </motion.div>

          {/* Quick Dismiss Button */}
          <motion.button
            type="button"
            onClick={dismissMascot}
            whileHover={{ scale: 1.15, background: '#fee2e2' }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(15, 30, 54, 0.16)',
              color: '#64748b',
              transition: 'background 0.2s ease, color 0.2s ease'
            }}
            title="Temporarily Dismiss Barnaby"
            aria-label="Temporarily Dismiss Barnaby"
          >
            <X size={13} />
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default MascotAssistant;
