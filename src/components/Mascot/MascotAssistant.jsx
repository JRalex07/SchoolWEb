import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useMascot } from '../../context/MascotContext';
import { MascotCharacter } from './MascotCharacter';
import { MascotSpeechBubble } from './MascotSpeechBubble';
import { getStopForSection } from '../../data/mascotMovementPaths';
import { calculateSafeAssistantLayout, MASCOT_DIMENSIONS } from '../../utils/mascotPositionCalculator';
import { ChevronUp, X, Sparkles, MessageCircle } from 'lucide-react';

export const MascotAssistant = () => {
  const location = useLocation();
  const {
    mascotState,
    setMascotState,
    isMinimized,
    isDismissed,
    deviceMode,
    activeMessage,
    activeSection,
    hasUserClosedBubble,
    isBubbleVisible,
    notifySectionChange,
    setHoverHelper,
    clearHoverHelper,
    setHoveringBubble,
    requestHelp,
    dismissBubble,
    minimizeMascot,
    maximizeMascot,
    dismissMascot,
    restoreMascot
  } = useMascot();

  const [speechBubbleOpen, setSpeechBubbleOpen] = useState(isBubbleVisible);
  const [bubbleDimensions, setBubbleDimensions] = useState({ width: 300, height: 120 });
  const [isVirtualKeyboardOpen, setIsVirtualKeyboardOpen] = useState(false);
  const [mobileUserRequested, setMobileUserRequested] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof document !== 'undefined' ? document.documentElement.clientWidth : (typeof window !== 'undefined' ? window.innerWidth : 1200),
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    offsetTop: 0,
    offsetLeft: 0
  });

  const bubbleRef = useRef(null);
  const sectionDwellTimer = useRef(null);
  const pendingSectionRef = useRef(null);
  const isInteractingRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // Lock movement while user is actively filling forms or reading warning/thinking states
  useEffect(() => {
    isInteractingRef.current = mascotState === 'warning' || mascotState === 'thinking';
  }, [mascotState]);

  // Synchronize speech bubble open state with central context isBubbleVisible
  useEffect(() => {
    setSpeechBubbleOpen(isBubbleVisible);
  }, [isBubbleVisible]);

  // 1. Keyboard Accessibility: Close speech bubble on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && speechBubbleOpen) {
        dismissBubble();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speechBubbleOpen, dismissBubble]);

  // 2. Efficient Section-awareness with Hysteresis & Dwell Stability (supports tall sections)
  // Re-observe dynamically whenever the route changes
  useEffect(() => {
    const handleIntersection = (entries) => {
      let bestEntry = null;
      let maxRatio = 0;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

      for (const entry of entries) {
        const rect = entry.boundingClientRect;
        // Reliably catch tall sections spanning across the vertical center of the screen
        const spansCenter = rect.top <= (vh * 0.45) && rect.bottom >= (vh * 0.45);
        if (entry.isIntersecting && (entry.intersectionRatio > maxRatio || spansCenter)) {
          maxRatio = spansCenter ? 1.0 : entry.intersectionRatio;
          bestEntry = entry;
        }
      }

      if (bestEntry && maxRatio >= 0.15) {
        const sectionId = bestEntry.target.getAttribute('data-section-id') || bestEntry.target.id;
        if (!sectionId || sectionId === pendingSectionRef.current) return;

        pendingSectionRef.current = sectionId;

        // Apply hysteresis: wait 220ms before committing to prevent jitter while scrolling rapidly
        if (sectionDwellTimer.current) clearTimeout(sectionDwellTimer.current);
        sectionDwellTimer.current = setTimeout(() => {
          if (!isInteractingRef.current) {
            notifySectionChange(sectionId);
          }
        }, 220);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: [0.15, 0.35, 0.6]
    });

    const targetSections = document.querySelectorAll('[data-section-id], section[id], footer[id="footer"]');
    targetSections.forEach(sec => observer.observe(sec));

    return () => {
      targetSections.forEach(sec => observer.unobserve(sec));
      observer.disconnect();
      if (sectionDwellTimer.current) clearTimeout(sectionDwellTimer.current);
    };
  }, [notifySectionChange, location.pathname]);

  // 3. Desktop Hover & Keyboard Focus Helpers (Intentional 200ms delay, no cursor tracking)
  useEffect(() => {
    if (deviceMode !== 'desktop') return;

    let hoverDelayTimer = null;

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-helper-title], [data-helper-description]');
      if (!target) return;
      if (e.relatedTarget && target.contains(e.relatedTarget)) return;

      if (hoverDelayTimer) clearTimeout(hoverDelayTimer);
      hoverDelayTimer = setTimeout(() => {
        const title = target.getAttribute('data-helper-title') || target.innerText?.slice(0, 25);
        const description = target.getAttribute('data-helper-description') || 'Click to interact with this school resource.';
        const example = target.getAttribute('data-helper-example') || null;

        setHoverHelper({ title, description, example });
      }, 200);
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('[data-helper-title], [data-helper-description]');
      if (!target) return;
      if (e.relatedTarget && target.contains(e.relatedTarget)) return;

      if (hoverDelayTimer) clearTimeout(hoverDelayTimer);
      clearHoverHelper();
    };

    const handleFocusIn = (e) => {
      const target = e.target.closest('[data-helper-title], [data-helper-description]');
      if (!target) return;
      const title = target.getAttribute('data-helper-title') || target.innerText?.slice(0, 25);
      const description = target.getAttribute('data-helper-description') || 'Select to interact with this school resource.';
      const example = target.getAttribute('data-helper-example') || null;

      setHoverHelper({ title, description, example });
    };

    const handleFocusOut = (e) => {
      const target = e.target.closest('[data-helper-title], [data-helper-description]');
      if (!target) return;
      clearHoverHelper();
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      if (hoverDelayTimer) clearTimeout(hoverDelayTimer);
    };
  }, [deviceMode, setHoverHelper, clearHoverHelper]);

  // Touch tap helper listener for touch-first environments (tablets & mobile)
  useEffect(() => {
    if (deviceMode === 'desktop') return;

    const handleTouchTap = (e) => {
      const target = e.target.closest('[data-helper-title], [data-helper-description]');
      if (!target) return;
      const title = target.getAttribute('data-helper-title') || target.innerText?.slice(0, 25);
      const description = target.getAttribute('data-helper-description') || 'Select to interact with this school resource.';
      const example = target.getAttribute('data-helper-example') || null;

      setHoverHelper({ title, description, example });
    };

    document.addEventListener('click', handleTouchTap, { passive: true });
    return () => {
      document.removeEventListener('click', handleTouchTap);
    };
  }, [deviceMode, setHoverHelper]);

  // 4. Measure bubble DOM dimensions unscaled to prevent scale-transition oscillation
  useEffect(() => {
    if (!bubbleRef.current) return;

    const measureBubble = () => {
      if (bubbleRef.current) {
        // Use offsetWidth and offsetHeight to measure true layout dimensions unscaled by transform
        const w = bubbleRef.current.offsetWidth || Math.round(bubbleRef.current.getBoundingClientRect().width);
        const h = bubbleRef.current.offsetHeight || Math.round(bubbleRef.current.getBoundingClientRect().height);
        if (w > 0 && h > 0) {
          const clampedW = Math.min(310, w);
          setBubbleDimensions(prev => {
            if (Math.abs(prev.width - clampedW) > 4 || Math.abs(prev.height - h) > 4) {
              return { width: clampedW, height: h };
            }
            return prev;
          });
        }
      }
    };

    measureBubble();

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

  // 5. Visual Viewport & Client Width Listener (excludes scrollbar to eliminate clipping)
  useEffect(() => {
    let resizeTimer = null;
    const updateDimensions = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const vv = window.visualViewport;
        const docClientW = document.documentElement ? document.documentElement.clientWidth : window.innerWidth;
        const width = vv ? Math.round(vv.width) : docClientW;
        const height = vv ? Math.round(vv.height) : window.innerHeight;
        const offsetTop = vv ? Math.round(vv.offsetTop) : 0;
        const offsetLeft = vv ? Math.round(vv.offsetLeft) : 0;
        const isKeyboard = vv && typeof window !== 'undefined' && window.innerHeight > 0
          ? (vv.height < window.innerHeight * 0.72)
          : false;

        setIsVirtualKeyboardOpen(isKeyboard);
        setWindowDimensions({ width, height, offsetTop, offsetLeft });
      }, 60);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateDimensions, { passive: true });
    }
    window.addEventListener('resize', updateDimensions, { passive: true });
    window.addEventListener('orientationchange', updateDimensions, { passive: true });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateDimensions);
      }
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

  // Collect interactive obstacle rectangles for collision avoidance (Primary CTAs, form controls, footer contacts)
  const obstacles = useMemo(() => {
    if (typeof document === 'undefined') return [];
    const elements = document.querySelectorAll(
      '.btn-primary, .btn-outline-white, a[data-helper-title*="Apply"], .hero-cta, #footer a[href^="tel:"], #footer a[href^="mailto:"], [data-footer-contact]'
    );
    const list = [];
    const vh = windowDimensions.height;
    const vw = windowDimensions.width;
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (
        rect.bottom > 70 &&
        rect.top < vh - 20 &&
        rect.right > 0 &&
        rect.left < vw &&
        rect.width > 0 &&
        rect.height > 0
      ) {
        list.push({
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height
        });
      }
    }
    return list;
  }, [activeSection, windowDimensions, location.pathname]);

  // 6. Calculate Master Viewport Layout Footprint (accounting for isMinimized & dynamic obstacles)
  const layout = useMemo(() => {
    const stop = getStopForSection(activeSection);
    return calculateSafeAssistantLayout({
      stop,
      viewportWidth: windowDimensions.width,
      viewportHeight: windowDimensions.height,
      deviceMode,
      isBubbleOpen: isBubbleVisible && !!(activeMessage && activeMessage.text),
      isMinimized,
      bubbleDimensions,
      obstacles
    });
  }, [activeSection, windowDimensions, deviceMode, isBubbleVisible, activeMessage, isMinimized, bubbleDimensions, obstacles]);

  // Gentle, relaxed spring physics transition for floating glide (not too fast)
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
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
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

  // If minimized, render a compact pill gliding with smooth spring physics
  if (isMinimized) {
    return (
      <motion.div
        className="mascot-minimized-pill"
        onClick={maximizeMascot}
        initial={false}
        animate={{ x: layout.mascot.x, y: layout.mascot.y }}
        transition={springTransition}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
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
          <MascotCharacter state="idle" size={28} />
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
          Barnaby
        </span>
        <ChevronUp size={16} color="var(--color-accent)" />
      </motion.div>
    );
  }

  // Mobile Presentation Mode: Sleek, non-obstructive action button with visualViewport accommodation
  if (layout.isMobile) {
    // If mobile virtual keyboard is active, hide floating mascot to guarantee zero input obstruction
    if (isVirtualKeyboardOpen) {
      return null;
    }

    // On mobile hero section, auto-suppress initial automatic popover speech bubble so it never obstructs the hero CTA buttons
    const isMobileHeroSuppressed = activeSection === 'hero' && !mobileUserRequested;
    const shouldShowMobileBubble = speechBubbleOpen && !isMobileHeroSuppressed && activeMessage && activeMessage.text && layout.bubble;

    return (
      <>
        {/* Mobile Backdrop for Speech Bubble Dismissal */}
        {shouldShowMobileBubble && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 993,
              background: 'rgba(15, 12, 40, 0.2)',
              backdropFilter: 'blur(2px)',
              pointerEvents: 'auto'
            }}
            onClick={dismissBubble}
            aria-hidden="true"
          />
        )}

        {/* Mobile Speech Bubble Overlay (Anchored cleanly above trigger) */}
        <AnimatePresence>
          {shouldShowMobileBubble && (
            <motion.div
              key="mobile-mascot-speech-bubble"
              ref={bubbleRef}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{
                x: layout.bubble.x,
                y: layout.bubble.y,
                width: layout.bubble.width,
                opacity: 1,
                scale: 1
              }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 995,
                pointerEvents: 'auto',
                maxWidth: `${layout.maxBubbleWidth}px`
              }}
            >
              <MascotSpeechBubble
                message={activeMessage}
                state={mascotState}
                placement={layout.placement}
                onClose={dismissBubble}
                onMinimize={minimizeMascot}
                onApplySuggestion={activeMessage.onApplySuggestion}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Compact Help Trigger (Stationed at bottom-right, out of the way of page content) */}
        <div
          style={{
            position: 'fixed',
            right: 'max(14px, env(safe-area-inset-right, 14px))',
            bottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
            zIndex: 994,
            pointerEvents: 'auto'
          }}
        >
          <motion.button
            type="button"
            onClick={() => {
              if (speechBubbleOpen) {
                dismissBubble();
              } else {
                setMobileUserRequested(true);
                requestHelp();
              }
            }}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            style={{
              background: 'linear-gradient(168deg, #FFFEFC 0%, #FAF6EE 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              borderRadius: 'var(--radius-full)',
              height: '40px',
              padding: '0 0.85rem 0 0.45rem',
              boxShadow: 'var(--clay-card)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              color: 'var(--color-primary)'
            }}
            aria-label="Toggle Assistant Barnaby Help"
            title="Ask Barnaby for guidance"
          >
            <div style={{ width: '28px', height: '28px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MascotCharacter state={mascotState} size={28} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.01em' }}>
              Ask Barnaby
            </span>
            {isMobileHeroSuppressed && (
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: 'var(--color-accent)',
                  boxShadow: '0 0 6px var(--color-accent)'
                }}
                aria-hidden="true"
              />
            )}
          </motion.button>
        </div>
      </>
    );
  }

  // Desktop & Tablet Presentation Mode: Viewport-aware Predefined Movement Glider
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
            onMouseEnter={() => setHoveringBubble(true)}
            onMouseLeave={() => setHoveringBubble(false)}
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
              placement={layout.placement}
              onClose={dismissBubble}
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
          width: `${MASCOT_DIMENSIONS.desktop.width}px`,
          willChange: 'transform'
        }}
      >
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <motion.div
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <MascotCharacter
              state={mascotState}
              onClick={() => {
                if (speechBubbleOpen) {
                  dismissBubble();
                } else {
                  requestHelp();
                }
              }}
            />
          </motion.div>

          {/* Quick Dismiss Button */}
          <motion.button
            type="button"
            onClick={dismissMascot}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.15, background: '#fee2e2' }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
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
