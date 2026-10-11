import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export const NotificationModal = () => {
  const { activeModal, closeModal } = useSchoolConfig();

  const renderIcon = (statusType) => {
    switch (statusType) {
      case 'warning':
        return <AlertCircle size={28} color="var(--color-warning)" />;
      case 'success':
        return <CheckCircle2 size={28} color="var(--color-success)" />;
      default:
        return <Info size={28} color="var(--color-info)" />;
    }
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <motion.div 
          className="modal-overlay" 
          onClick={closeModal} 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <motion.div 
            className="modal-card" 
            style={{
              maxWidth: 'min(100%, 560px)',
              borderRadius: 'clamp(20px, 3.5vw, 28px)',
              willChange: 'transform, opacity'
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {renderIcon(activeModal.statusType)}
                <h3 id="modal-title" style={{ fontSize: '1.35rem', margin: 0, color: 'var(--color-primary)' }}>
                  {activeModal.title}
                </h3>
              </div>
              <button 
                onClick={closeModal} 
                className="btn btn-outline" 
                style={{ padding: '0.4rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ color: '#475569', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {activeModal.message}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button 
                type="button"
                className="btn btn-primary btn-sm" 
                onClick={closeModal}
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
