import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useMascot } from '../../context/MascotContext';
import { MascotCharacter } from './MascotCharacter';
import {
  MessageCircle,
  X,
  Send,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Compass
} from 'lucide-react';
import { StructuredMessageRenderer } from './StructuredMessageRenderer';

/**
 * TypewriterBubble: Provides natural, relaxed character streaming animation for Barnaby's responses.
 * Respects prefers-reduced-motion, adds human-like pauses at sentence & clause boundaries,
 * and allows one-click fast completion.
 */
const TypewriterBubble = ({
  msg,
  isCompleted,
  onComplete,
  handleActionClick,
  shouldReduceMotion,
  onScrollBottom
}) => {
  const fullText = msg.text || '';
  const [displayedCount, setDisplayedCount] = useState(() => (isCompleted || shouldReduceMotion ? fullText.length : 0));
  const isTypingActive = displayedCount < fullText.length;

  useEffect(() => {
    if (isCompleted || shouldReduceMotion) {
      setDisplayedCount(fullText.length);
      return;
    }

    if (displayedCount < fullText.length) {
      const currentChar = fullText[displayedCount] || '';
      const nextChar = fullText[displayedCount + 1] || '';

      // Base delay targeting ~25-35 chars/second
      let delay = fullText.length > 220 ? 22 : 28;

      // Natural conversational pauses at sentence, clause and paragraph boundaries
      if (
        (currentChar === '.' || currentChar === '?' || currentChar === '!') &&
        (nextChar === ' ' || nextChar === '\n' || nextChar === '')
      ) {
        delay += 140; // Sentence boundary pause
      } else if (
        (currentChar === ',' || currentChar === ';' || currentChar === ':') &&
        nextChar === ' '
      ) {
        delay += 70; // Clause pause
      } else if (currentChar === '\n') {
        delay += 150; // Paragraph break pause
      }

      const timer = setTimeout(() => {
        setDisplayedCount((prev) => prev + 1);
        if (onScrollBottom) onScrollBottom();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [displayedCount, fullText, isCompleted, shouldReduceMotion, onScrollBottom]);

  // Clean completion notification: only triggered once typing has 100% finished
  useEffect(() => {
    if (displayedCount >= fullText.length && fullText.length > 0 && !isCompleted) {
      if (onComplete) onComplete();
    }
  }, [displayedCount, fullText.length, isCompleted, onComplete]);

  const handleSkipTyping = () => {
    if (isTypingActive) {
      setDisplayedCount(fullText.length);
      if (onComplete) onComplete();
      if (onScrollBottom) onScrollBottom();
    }
  };

  const visibleText = fullText.slice(0, displayedCount);
  const paragraphs = visibleText.split('\n\n');

  return (
    <div
      onClick={handleSkipTyping}
      title={isTypingActive ? "Click to view full answer immediately" : undefined}
      aria-live={isTypingActive ? "off" : "polite"}
      style={{
        maxWidth: '85%',
        padding: '0.75rem 0.95rem',
        borderRadius: '18px 18px 18px 4px',
        background: '#ffffff',
        color: '#1e293b',
        fontSize: '0.875rem',
        lineHeight: 1.55,
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(33, 27, 82, 0.08)',
        wordBreak: 'break-word',
        cursor: isTypingActive ? 'pointer' : 'default',
        transition: 'border-color 0.2s ease'
      }}
    >
      {paragraphs.map((p, pIdx) => (
        <p key={pIdx} style={{ margin: pIdx === paragraphs.length - 1 ? 0 : '0 0 0.55rem 0' }}>
          {p}
          {isTypingActive && pIdx === paragraphs.length - 1 && (
            <span className="chat-typing-cursor" aria-hidden="true" />
          )}
        </p>
      ))}

      {isTypingActive && (
        <div style={{ marginTop: '0.25rem', display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.64rem', color: '#94a3b8', fontStyle: 'italic', opacity: 0.85 }}>
            click to finish
          </span>
        </div>
      )}

      {/* Structured Rich Response Rendering (Document Checklists, Steps, Cards, Events) */}
      {msg.structuredData && !isTypingActive && (
        <StructuredMessageRenderer
          structuredData={msg.structuredData}
          shouldReduceMotion={shouldReduceMotion}
        />
      )}

      {/* Explicit Navigation Consent Button */}
      {msg.action && !isTypingActive && (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{ marginTop: '0.65rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <button
            type="button"
            onClick={() => handleActionClick(msg.action)}
            className="btn btn-sm btn-primary"
            style={{
              padding: '0.35rem 0.85rem',
              fontSize: '0.78rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              cursor: 'pointer',
              fontWeight: 600,
              background: 'var(--color-accent)',
              color: '#16113A',
              border: 'none',
              boxShadow: '0 2px 6px rgba(244, 160, 36, 0.35)'
            }}
          >
            <span>{msg.action.label}</span>
            {msg.action.isExternal ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export const MascotAssistant = () => {
  const navigate = useNavigate();
  const {
    isChatOpen,
    isTyping,
    chatMessages,
    openChat,
    closeChat,
    toggleChat,
    clearChat,
    sendMessage,
    suggestedQuestions,
    mascotState,
    setMascotState,
    isDismissed,
    dismissMascot
  } = useMascot();

  const [inputMessage, setInputMessage] = useState('');
  const [completedMessageIds, setCompletedMessageIds] = useState(() => new Set(['welcome-1']));
  const [windowDimensions, setWindowDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const markMessageCompleted = useCallback((id) => {
    setCompletedMessageIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const scrollToBottom = useCallback((force = false) => {
    if (chatContainerRef.current) {
      const el = chatContainerRef.current;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 85;
      if (force || isNearBottom) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, []);

  // Passive window resize & orientation listener (required by performance & responsive test invariants)
  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', updateDimensions, { passive: true });
    window.addEventListener('orientationchange', updateDimensions, { passive: true });

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  // Auto-scroll chat log to bottom only if user is already reading near bottom (avoids stealing scroll)
  useEffect(() => {
    scrollToBottom(false);
  }, [chatMessages, isTyping, isChatOpen, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isChatOpen]);

  // Close chat on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isChatOpen) {
        closeChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatOpen, closeChat]);

  // Check if the latest message from Barnaby has completely finished its typewriter animation
  const lastBarnabyMsg = [...chatMessages].reverse().find(m => m.sender === 'barnaby');
  const isBarnabyFinishedTyping = !isTyping && (!lastBarnabyMsg || completedMessageIds.has(lastBarnabyMsg.id));

  const handleSend = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmed = inputMessage.trim();
    if (!trimmed || isTyping || !isBarnabyFinishedTyping) return;

    // Finalize any active animations before submitting new message
    chatMessages.forEach(m => {
      if (!completedMessageIds.has(m.id)) {
        markMessageCompleted(m.id);
      }
    });

    setInputMessage('');
    sendMessage(trimmed);
    setTimeout(() => scrollToBottom(true), 30);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleChipClick = (questionText) => {
    if (isTyping || !isBarnabyFinishedTyping) return;
    sendMessage(questionText);
  };

  const handleActionClick = (action) => {
    if (!action) return;
    if (action.isExternal && action.url) {
      window.open(action.url, '_blank', 'noopener,noreferrer');
    } else if (action.path) {
      navigate(action.path);
    }
  };

  if (isDismissed) return null;

  return (
    <>
      {/* 1. Conversational Chat Panel (Glassmorphic Drawer) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="barnaby-chat-panel"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Barnaby Campus Assistant Chat"
            style={{
              position: 'fixed',
              bottom: 'clamp(72px, 12vh, 88px)',
              right: 'clamp(14px, 3vw, 24px)',
              width: 'min(calc(100vw - 28px), 400px)',
              height: 'min(580px, calc(100vh - 120px))',
              maxHeight: 'min(580px, calc(100vh - 120px))',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1.5px solid rgba(255, 255, 255, 0.75)',
              borderRadius: 'clamp(20px, 3vw, 26px)',
              boxShadow: '0 24px 50px -12px rgba(33, 27, 82, 0.22), 0 0 0 1px rgba(33, 27, 82, 0.06)',
              zIndex: 995,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '0.85rem 1.1rem',
                background: 'linear-gradient(135deg, rgba(22, 17, 58, 0.95), rgba(33, 27, 82, 0.95))',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <MascotCharacter state={mascotState} size={36} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <h3 style={{ margin: 0, fontSize: '0.975rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                      Barnaby
                    </h3>
                    <span
                      style={{
                        background: 'rgba(244, 160, 36, 0.25)',
                        color: 'var(--color-accent)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '0.1rem 0.45rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(244, 160, 36, 0.4)'
                      }}
                    >
                      Campus Guide
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
                    Interactive Demo Assistant
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    clearChat();
                    setCompletedMessageIds(new Set(['welcome-1']));
                  }}
                  title="Clear conversation"
                  aria-label="Clear conversation history"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#e2e8f0',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  onClick={closeChat}
                  title="Close assistant"
                  aria-label="Close Barnaby assistant"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#e2e8f0',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Message Thread Container */}
            <div
              ref={chatContainerRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}
            >
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '100%'
                    }}
                  >
                    {isUser ? (
                      <div
                        style={{
                          maxWidth: '85%',
                          padding: '0.7rem 0.95rem',
                          borderRadius: '18px 18px 4px 18px',
                          background: 'linear-gradient(135deg, var(--color-primary), #2d246b)',
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          lineHeight: 1.5,
                          boxShadow: '0 4px 12px rgba(33, 27, 82, 0.18)',
                          wordBreak: 'break-word'
                        }}
                      >
                        {msg.text}
                      </div>
                    ) : (
                      <TypewriterBubble
                        msg={msg}
                        isCompleted={completedMessageIds.has(msg.id)}
                        onComplete={() => markMessageCompleted(msg.id)}
                        handleActionClick={handleActionClick}
                        shouldReduceMotion={shouldReduceMotion}
                        onScrollBottom={scrollToBottom}
                      />
                    )}
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.2rem', padding: '0 0.4rem' }}>
                      {isUser ? 'You' : 'Barnaby'}
                    </span>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.6rem 0.9rem', background: '#f8fafc', borderRadius: '18px 18px 18px 4px', width: 'fit-content', border: '1px solid #e2e8f0' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', animation: 'bounce 0.8s infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', animation: 'bounce 0.8s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)', animation: 'bounce 0.8s infinite 0.4s' }} />
                  <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.35rem' }}>Barnaby is thinking...</span>
                </div>
              )}

              {/* Suggested Questions Quick Chips - Only shown after Barnaby has fully finished typing */}
              <AnimatePresence>
                {suggestedQuestions && suggestedQuestions.length > 0 && isBarnabyFinishedTyping && (
                  <motion.div
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(33, 27, 82, 0.12)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.45rem', fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                      <Sparkles size={12} color="var(--color-accent)" />
                      <span>Suggested Questions:</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {suggestedQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleChipClick(q)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.85)',
                            border: '1px solid rgba(33, 27, 82, 0.15)',
                            borderRadius: '9999px',
                            padding: '0.3rem 0.65rem',
                            fontSize: '0.75rem',
                            color: 'var(--color-primary)',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                            textAlign: 'left',
                            lineHeight: 1.3
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--color-accent-soft)';
                            e.currentTarget.style.borderColor = 'var(--color-accent)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                            e.currentTarget.style.borderColor = 'rgba(33, 27, 82, 0.15)';
                          }}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSend}
              style={{
                padding: '0.75rem 0.9rem',
                background: 'rgba(248, 250, 252, 0.85)',
                borderTop: '1px solid rgba(33, 27, 82, 0.08)',
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onFocus={() => setMascotState('listening')}
                onBlur={() => {
                  if (!isTyping) setMascotState('idle');
                }}
                placeholder="Ask Barnaby a question..."
                aria-label="Message Barnaby"
                style={{
                  flex: 1,
                  padding: '0.55rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid rgba(33, 27, 82, 0.15)',
                  fontSize: '0.85rem',
                  background: '#ffffff',
                  outline: 'none',
                  color: 'var(--color-primary)'
                }}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping || !isBarnabyFinishedTyping}
                aria-label="Send message"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: inputMessage.trim() && !isTyping && isBarnabyFinishedTyping ? 'var(--color-primary)' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputMessage.trim() && !isTyping && isBarnabyFinishedTyping ? 'pointer' : 'default',
                  flexShrink: 0,
                  transition: 'background 0.2s ease',
                  boxShadow: inputMessage.trim() && !isTyping && isBarnabyFinishedTyping ? '0 3px 8px rgba(33, 27, 82, 0.25)' : 'none'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Compact Floating Assistant Launcher Button (Bottom Right) */}
      <aside
        className="mascot-launcher-container"
        style={{
          position: 'fixed',
          bottom: 'clamp(14px, 3vh, 24px)',
          right: 'clamp(14px, 3vw, 24px)',
          zIndex: 994,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem'
        }}
        aria-label="Campus Assistant Launcher"
      >
        <motion.button
          type="button"
          onClick={toggleChat}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          style={{
            background: 'linear-gradient(145deg, #ffffff 0%, #FAF6EE 100%)',
            border: '2px solid rgba(255, 255, 255, 0.95)',
            borderRadius: 'var(--radius-full)',
            height: '48px',
            padding: '0 1rem 0 0.45rem',
            boxShadow: '0 8px 24px -4px rgba(33, 27, 82, 0.2), 0 2px 6px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            cursor: 'pointer',
            color: 'var(--color-primary)'
          }}
          aria-expanded={isChatOpen}
          aria-label={isChatOpen ? "Close Barnaby Assistant" : "Open Barnaby Assistant"}
          title="Ask Barnaby - Campus Guide"
        >
          <div style={{ width: '36px', height: '36px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MascotCharacter state={mascotState} size={36} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '-0.01em' }}>
            {isChatOpen ? 'Close Chat' : 'Ask Barnaby'}
          </span>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isChatOpen ? '#10b981' : 'var(--color-accent)',
              boxShadow: `0 0 6px ${isChatOpen ? '#10b981' : 'var(--color-accent)'}`
            }}
            aria-hidden="true"
          />
        </motion.button>

        {/* Quick Dismiss Button */}
        {!isChatOpen && (
          <button
            type="button"
            onClick={dismissMascot}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(33, 27, 82, 0.12)',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            title="Hide assistant button"
            aria-label="Hide assistant button"
          >
            <X size={12} />
          </button>
        )}
      </aside>
    </>
  );
};

export default MascotAssistant;
