import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { Sliders, X, ShieldAlert, Sparkles } from 'lucide-react';

export const ConfigDrawer = ({ isOpen, onClose }) => {
  const { config, setMode, updateConfigField } = useSchoolConfig();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="School Identity Configuration Panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-card"
            style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sliders size={22} color="var(--color-accent)" />
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-primary)' }}>School Identity & Data Settings</h3>
              </div>
              <button
                onClick={onClose}
                className="btn btn-outline"
                style={{ padding: '0.4rem', border: 'none', background: 'transparent', cursor: 'pointer' }}
                aria-label="Close settings drawer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="notice-box info" style={{ marginTop: 0, fontSize: '0.875rem' }}>
              <strong>Centralized Identity Architecture:</strong> Customize school name, leadership, contact info, and publish settings in real-time. All components react instantly to these centralized values.
            </div>

            {/* Identity Presets */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem' }}>Quick Identity Profiles:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${config.identityMode === 'placeholder' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setMode('placeholder')}
                  style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
                >
                  <ShieldAlert size={16} />
                  Default Placeholder Mode
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${config.identityMode === 'archive' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setMode('archive')}
                  style={{ justifyContent: 'flex-start', padding: '0.75rem' }}
                >
                  <Sparkles size={16} />
                  Recovered Archive Mode
                </button>
              </div>
            </div>

            {/* Config Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">School Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={config.schoolName}
                  onChange={(e) => updateConfigField('schoolName', e.target.value)}
                  placeholder="[Your School Name]"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Principal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.principalName}
                    onChange={(e) => updateConfigField('principalName', e.target.value)}
                    placeholder="[Principal Name]"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Academic Year</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.academicYear}
                    onChange={(e) => updateConfigField('academicYear', e.target.value)}
                    placeholder="[Current Academic Year]"
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">School Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={config.address}
                  onChange={(e) => updateConfigField('address', e.target.value)}
                  placeholder="[Verified School Address]"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={config.phone}
                    onChange={(e) => updateConfigField('phone', e.target.value)}
                    placeholder="[Verified Contact Number]"
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={config.email}
                    onChange={(e) => updateConfigField('email', e.target.value)}
                    placeholder="[Verified Contact Email]"
                  />
                </div>
              </div>

              {/* Faith Section Visibility Toggle */}
              <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                    Publish "Faith" Navigation & Page
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                    Unpublished by default in placeholder prototype mode.
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="faith-toggle"
                  checked={!!config.faithSectionPublished}
                  onChange={(e) => updateConfigField('faithSectionPublished', e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onClose}
              >
                Apply & Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
