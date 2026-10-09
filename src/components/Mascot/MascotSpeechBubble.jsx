import React from 'react';
import { motion } from 'framer-motion';
import { X, Minus, Sparkles, Check, Info, AlertCircle } from 'lucide-react';

export const MascotSpeechBubble = ({
  message,
  state,
  onClose,
  onMinimize,
  onApplySuggestion,
  style = {}
}) => {
  if (!message || !message.text) return null;

  const getHeaderIcon = () => {
    switch (state) {
      case 'warning':
        return <AlertCircle size={16} color="var(--color-warning)" />;
      case 'success':
        return <Check size={16} color="var(--color-success)" />;
      case 'thinking':
        return <Sparkles size={16} color="var(--color-accent)" />;
      default:
        return <Info size={16} color="var(--color-info)" />;
    }
  };

  return (
    <div
      className="mascot-speech-bubble"
      role="status"
      aria-live="polite"
      style={{
        background: 'linear-gradient(145deg, #ffffff, #f4f7fc)',
        borderRadius: '24px',
        padding: '1.25rem 1.4rem',
        width: '100%',
        maxWidth: '100%',
        boxShadow: 'var(--clay-card)',
        border: '2.5px solid rgba(255, 255, 255, 0.95)',
        position: 'relative',
        fontSize: '0.9rem',
        color: 'var(--color-text-main)',
        boxSizing: 'border-box',
        zIndex: 10,
        ...style
      }}
    >
      {/* Header with Title and Window Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {getHeaderIcon()}
          <strong style={{ fontSize: '0.95rem', color: 'var(--color-primary)', fontWeight: 700 }}>
            {message.title || 'Campus Helper'}
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          <motion.button
            type="button"
            onClick={onMinimize}
            whileHover={{ scale: 1.15, color: 'var(--color-primary)' }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.25rem',
              cursor: 'pointer',
              color: '#94a3b8',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Minimize Assistant"
            aria-label="Minimize Assistant"
          >
            <Minus size={15} />
          </motion.button>
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.15, color: '#ef4444' }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.25rem',
              cursor: 'pointer',
              color: '#94a3b8',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Dismiss speech bubble"
            aria-label="Dismiss speech bubble"
          >
            <X size={15} />
          </motion.button>
        </div>
      </div>

      {/* Main explanation body */}
      <div style={{ lineHeight: 1.55, color: '#334155', fontSize: '0.875rem', marginBottom: message.example || message.suggestion ? '0.65rem' : 0 }}>
        {message.text}
      </div>

      {/* Example badge if available */}
      {message.example && (
        <div style={{ background: '#f1f5f9', padding: '0.4rem 0.65rem', borderRadius: '8px', fontSize: '0.785rem', color: '#475569', marginBottom: message.suggestion ? '0.5rem' : 0 }}>
          💡 <strong>Tip:</strong> {message.example}
        </div>
      )}

      {/* Suggested correction button if applicable */}
      {message.suggestion && message.onApplySuggestion && (
        <div style={{ marginTop: '0.5rem' }}>
          <motion.button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={message.onApplySuggestion}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            style={{ fontSize: '0.775rem', padding: '0.4rem 0.75rem', width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={13} /> Apply Suggested Format: <em>{message.suggestion}</em>
          </motion.button>
        </div>
      )}
    </div>
  );
};
