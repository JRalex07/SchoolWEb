import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Minus, Sparkles, Check, Info, AlertCircle } from 'lucide-react';

export const MascotSpeechBubble = ({
  message,
  state,
  placement = 'left',
  onClose,
  onMinimize,
  onApplySuggestion,
  onMouseEnter,
  onMouseLeave,
  style = {}
}) => {
  const shouldReduceMotion = useReducedMotion();
  if (!message || !message.text) return null;

  const getHeaderIcon = () => {
    switch (state) {
      case 'warning':
        return <AlertCircle size={14} color="#d97706" />;
      case 'success':
        return <Check size={14} color="#16a34a" />;
      case 'thinking':
        return <Sparkles size={14} color="var(--color-accent)" />;
      default:
        return <Info size={14} color="var(--color-primary)" />;
    }
  };

  const getIconBg = () => {
    switch (state) {
      case 'warning':
        return 'rgba(217, 119, 6, 0.12)';
      case 'success':
        return 'rgba(22, 163, 74, 0.12)';
      case 'thinking':
        return 'rgba(201, 138, 44, 0.14)';
      default:
        return 'rgba(15, 30, 54, 0.08)';
    }
  };

  return (
    <div
      className="mascot-speech-bubble"
      role="status"
      aria-live="polite"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: 'linear-gradient(168deg, #FFFEFC 0%, #FAF5ED 55%, #F4ECE0 100%)',
        borderRadius: '22px',
        padding: '0.85rem 1.15rem',
        width: '100%',
        maxWidth: '310px',
        boxSizing: 'border-box',
        boxShadow: '0 12px 28px -4px rgba(33, 27, 82, 0.13), 0 4px 10px -2px rgba(33, 27, 82, 0.05), inset 0 2.5px 3px 0 rgba(255, 255, 255, 0.95), inset 0 -3px 4px 0 rgba(48, 39, 100, 0.07), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
        border: '1.5px solid rgba(255, 255, 255, 0.95)',
        position: 'relative',
        fontSize: '0.825rem',
        color: 'var(--color-text-main)',
        zIndex: 10,
        ...style
      }}
    >
      {/* Speech bubble indicator tail oriented towards Barnaby */}
      {placement === 'left' && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-6px',
            top: '22px',
            width: '12px',
            height: '12px',
            background: '#FAF6EE',
            transform: 'rotate(45deg)',
            borderTop: '1.5px solid rgba(255, 255, 255, 0.95)',
            borderRight: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '2px -2px 3px rgba(33, 27, 82, 0.05)',
            pointerEvents: 'none'
          }}
        />
      )}
      {placement === 'right' && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-6px',
            top: '22px',
            width: '12px',
            height: '12px',
            background: '#FFFEFC',
            transform: 'rotate(45deg)',
            borderBottom: '1.5px solid rgba(255, 255, 255, 0.95)',
            borderLeft: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '-2px 2px 3px rgba(33, 27, 82, 0.05)',
            pointerEvents: 'none'
          }}
        />
      )}
      {placement === 'above' && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-6px',
            right: '28px',
            width: '12px',
            height: '12px',
            background: '#FAF6EE',
            transform: 'rotate(45deg)',
            borderBottom: '1.5px solid rgba(255, 255, 255, 0.95)',
            borderRight: '1.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '2px 2px 3px rgba(33, 27, 82, 0.05)',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Header with Title and Micro Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '7px',
              background: getIconBg(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {getHeaderIcon()}
          </div>
          <strong
            style={{
              fontSize: '0.84rem',
              color: 'var(--color-primary)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {message.title || 'Barnaby Guide'}
          </strong>
        </div>

        {/* Micro tactile controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
          <motion.button
            type="button"
            onClick={onMinimize}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.1, backgroundColor: '#f1f5f9', color: 'var(--color-primary)' }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            style={{
              background: 'transparent',
              border: 'none',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              color: '#94a3b8',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            title="Minimize Assistant"
            aria-label="Minimize Assistant"
          >
            <Minus size={13} />
          </motion.button>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.1, backgroundColor: '#fee2e2', color: '#ef4444' }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
            style={{
              background: 'transparent',
              border: 'none',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              color: '#94a3b8',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            title="Dismiss speech bubble (Esc)"
            aria-label="Dismiss speech bubble"
          >
            <X size={13} />
          </motion.button>
        </div>
      </div>

      {/* Main concise explanation body */}
      <div
        style={{
          lineHeight: 1.46,
          color: '#334155',
          fontSize: '0.815rem',
          marginBottom: message.example || message.suggestion ? '0.5rem' : '0.2rem'
        }}
      >
        {message.text}
      </div>

      {/* Compact Tip / Action hint badge */}
      {message.example && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(244, 160, 36, 0.14) 0%, rgba(245, 130, 32, 0.06) 100%)',
            border: '1px solid rgba(244, 160, 36, 0.28)',
            borderRadius: '10px',
            padding: '0.35rem 0.55rem',
            fontSize: '0.745rem',
            color: '#8A4B06',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.35rem',
            lineHeight: 1.35,
            marginBottom: message.suggestion ? '0.45rem' : 0
          }}
        >
          <Sparkles size={12} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>
            <strong style={{ color: '#B45309' }}>Tip:</strong> {message.example}
          </span>
        </div>
      )}

      {/* Suggested correction button if applicable */}
      {message.suggestion && message.onApplySuggestion && (
        <div style={{ marginTop: '0.45rem' }}>
          <motion.button
            type="button"
            className="btn btn-primary"
            onClick={message.onApplySuggestion}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            style={{
              fontSize: '0.745rem',
              padding: '0.35rem 0.65rem',
              width: '100%',
              justifyContent: 'center',
              borderRadius: '9px',
              gap: '0.35rem'
            }}
          >
            <Sparkles size={12} /> Apply Suggested Format: <em>{message.suggestion}</em>
          </motion.button>
        </div>
      )}

      {/* Subtle accessibility dismiss indicator */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '0.35rem',
          fontSize: '0.66rem',
          color: '#94a3b8',
          userSelect: 'none'
        }}
      >
        <span>Press <kbd style={{ background: '#f1f5f9', padding: '1px 3px', borderRadius: '3px', border: '1px solid #cbd5e1', fontSize: '0.62rem' }}>Esc</kbd> to close</span>
      </div>
    </div>
  );
};
