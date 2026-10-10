import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import {
  Sliders,
  X,
  RotateCcw,
  Upload,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  GraduationCap,
  Globe
} from 'lucide-react';
import { SchoolDefaultLogo } from './SchoolDefaultLogo';

export const ConfigDrawer = ({ isOpen, onClose }) => {
  const { config, updateConfigField, resetToDefault } = useSchoolConfig();
  const [logoError, setLogoError] = useState('');
  const [urlInputOpen, setUrlInputOpen] = useState(false);
  const fileInputRef = useRef(null);

  const [faviconError, setFaviconError] = useState('');
  const [faviconUrlInputOpen, setFaviconUrlInputOpen] = useState(false);
  const faviconFileInputRef = useRef(null);

  const handleFaviconUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.ico')) {
      setFaviconError('Invalid favicon format. Supported formats are PNG, SVG, ICO, and WebP.');
      return;
    }

    if (file.size > 1024 * 1024) {
      setFaviconError('Favicon file size exceeds 1 MB. Please select a small square icon.');
      return;
    }

    setFaviconError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      updateConfigField('faviconUrl', event.target.result);
    };
    reader.onerror = () => {
      setFaviconError('Failed to read icon file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFavicon = () => {
    setFaviconError('');
    updateConfigField('faviconUrl', null);
    if (faviconFileInputRef.current) {
      faviconFileInputRef.current.value = '';
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Invalid image format. Supported formats are PNG, JPG, SVG, WebP, and GIF.');
      return;
    }

    // 2MB size limit
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Image file size exceeds 2 MB. Please select a smaller image for fast loading.');
      return;
    }

    setLogoError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      updateConfigField('logoUrl', event.target.result);
    };
    reader.onerror = () => {
      setLogoError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoError('');
    updateConfigField('logoUrl', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
            style={{
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '28px',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Modal Content Wrapper sitting above organic clay texture */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                  borderBottom: '1.5px solid rgba(33, 27, 82, 0.08)',
                  paddingBottom: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--clay-badge)'
                    }}
                  >
                    <Sliders size={20} color="#ffffff" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-primary)', lineHeight: 1.2 }}>
                      Configure School Identity
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Multi-school reusable website customization panel
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="btn btn-outline"
                  style={{
                    width: '36px',
                    height: '36px',
                    padding: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close settings drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Informative Clay Notice */}
              <div
                className="notice-box info"
                style={{
                  marginTop: 0,
                  marginBottom: '1.25rem',
                  fontSize: '0.84rem',
                  borderRadius: '16px'
                }}
              >
                <strong>Reusable Prototype Architecture:</strong> The school logo and contact details are completely optional. The website renders a complete, polished preview using neutral tactile badges.
              </div>

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* 1. School Logo Section (Optional) */}
                <div
                  style={{
                    padding: '1.25rem',
                    background: 'linear-gradient(175deg, #FFFFFF 0%, #F9F7F1 100%)',
                    borderRadius: '20px',
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: 'var(--clay-badge)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <ImageIcon size={18} color="var(--color-accent)" />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                        School Logo
                      </span>
                      <span
                        style={{
                          background: 'rgba(100, 116, 139, 0.12)',
                          color: '#64748b',
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontWeight: 600,
                          border: '1px solid rgba(100, 116, 139, 0.2)'
                        }}
                      >
                        Optional
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      PNG, JPG, SVG, WebP (Max 2MB)
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                    A logo is not compulsory. When no logo is uploaded, a clean, neutral school badge renders automatically across the header, navigation drawer, and footer.
                  </p>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                    style={{ display: 'none' }}
                    aria-label="Upload custom school logo"
                  />

                  {/* Visual Preview & Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#ffffff',
                      padding: '0.9rem 1.15rem',
                      borderRadius: '16px',
                      border: '1.5px solid rgba(33, 27, 82, 0.08)',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Current Badge or Logo Preview */}
                    {config.logoUrl ? (
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '14px',
                          background: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                          border: '1.5px solid rgba(0, 0, 0, 0.08)',
                          boxShadow: 'var(--clay-badge)',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={config.logoUrl}
                          alt="Custom school logo preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    ) : (
                      <SchoolDefaultLogo size={56} idPrefix="config" />
                    )}

                    {/* Status Description & Buttons */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        {config.logoUrl ? (
                          <>
                            <CheckCircle size={15} color="#16a34a" />
                            <strong style={{ fontSize: '0.85rem', color: '#16a34a' }}>Custom Logo Active</strong>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={15} color="var(--color-accent)" />
                            <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Neutral Icon Active (Default)</strong>
                          </>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => {
                            setLogoError('');
                            fileInputRef.current?.click();
                          }}
                          style={{ padding: '0.4rem 0.95rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
                        >
                          <Upload size={14} />
                          {config.logoUrl ? 'Replace Logo' : 'Upload Logo (Optional)'}
                        </button>

                        {config.logoUrl && (
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={handleRemoveLogo}
                            style={{
                              padding: '0.4rem 0.95rem',
                              fontSize: '0.8rem',
                              background: '#fee2e2',
                              color: '#b91c1c',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: 'var(--radius-full)'
                            }}
                          >
                            <Trash2 size={14} />
                            Remove Logo
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setUrlInputOpen(prev => !prev)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: '0.2rem 0.4rem'
                          }}
                        >
                          {urlInputOpen ? 'Hide URL input' : 'Or enter image URL'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Optional Direct URL Input */}
                  {urlInputOpen && (
                    <div style={{ marginTop: '0.25rem' }}>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com/school-logo.png"
                        value={config.logoUrl || ''}
                        onChange={(e) => {
                          setLogoError('');
                          updateConfigField('logoUrl', e.target.value.trim() || null);
                        }}
                        style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
                      />
                    </div>
                  )}

                  {/* Validation Error Message */}
                  {logoError && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 0.85rem',
                        background: '#fee2e2',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(239, 68, 68, 0.35)',
                        color: '#b91c1c',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                      role="alert"
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{logoError}</span>
                    </div>
                  )}
                </div>

                {/* 1b. Website Favicon (Optional) */}
                <div
                  style={{
                    padding: '1.25rem',
                    background: 'linear-gradient(175deg, #FFFFFF 0%, #F9F7F1 100%)',
                    borderRadius: '20px',
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: 'var(--clay-badge)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Globe size={18} color="var(--color-accent)" />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
                        Website Favicon (Browser Icon)
                      </span>
                      <span
                        style={{
                          background: 'rgba(100, 116, 139, 0.12)',
                          color: '#64748b',
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '9999px',
                          fontWeight: 600,
                          border: '1px solid rgba(100, 116, 139, 0.2)'
                        }}
                      >
                        Optional
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      PNG, ICO, SVG, WebP (Max 1MB)
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.825rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                    The favicon represents your school in browser tabs, bookmarks, and shortcuts. When none is uploaded, the neutral crest displays automatically.
                  </p>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={faviconFileInputRef}
                    onChange={handleFaviconUpload}
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/x-icon,image/vnd.microsoft.icon,.ico"
                    style={{ display: 'none' }}
                    aria-label="Upload custom website favicon"
                  />

                  {/* Visual Preview & Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      background: '#ffffff',
                      padding: '0.9rem 1.15rem',
                      borderRadius: '16px',
                      border: '1.5px solid rgba(33, 27, 82, 0.08)',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Current Favicon Preview */}
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        border: '1.5px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: 'var(--clay-badge)',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}
                    >
                      {config.faviconUrl ? (
                        <img
                          src={config.faviconUrl}
                          alt="Custom favicon preview"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <SchoolDefaultLogo size={36} idPrefix="favicon-preview" />
                      )}
                    </div>

                    {/* Status Description & Buttons */}
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                        {config.faviconUrl ? (
                          <>
                            <CheckCircle size={15} color="#16a34a" />
                            <strong style={{ fontSize: '0.85rem', color: '#16a34a' }}>Custom Favicon Active</strong>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={15} color="var(--color-accent)" />
                            <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>Default Crest Active (Tab Icon)</strong>
                          </>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline"
                          onClick={() => {
                            setFaviconError('');
                            faviconFileInputRef.current?.click();
                          }}
                          style={{ padding: '0.4rem 0.95rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
                        >
                          <Upload size={14} />
                          {config.faviconUrl ? 'Replace Favicon' : 'Upload Favicon (Optional)'}
                        </button>

                        {config.faviconUrl && (
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={handleRemoveFavicon}
                            style={{
                              padding: '0.4rem 0.95rem',
                              fontSize: '0.8rem',
                              background: '#fee2e2',
                              color: '#b91c1c',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: 'var(--radius-full)'
                            }}
                          >
                            <Trash2 size={14} />
                            Remove Favicon
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setFaviconUrlInputOpen(prev => !prev)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            padding: '0.2rem 0.4rem'
                          }}
                        >
                          {faviconUrlInputOpen ? 'Hide URL input' : 'Or enter icon URL'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Optional Direct URL Input */}
                  {faviconUrlInputOpen && (
                    <div style={{ marginTop: '0.25rem' }}>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com/favicon.png"
                        value={config.faviconUrl || ''}
                        onChange={(e) => {
                          setFaviconError('');
                          updateConfigField('faviconUrl', e.target.value.trim() || null);
                        }}
                        style={{ fontSize: '0.825rem', padding: '0.5rem 1rem' }}
                      />
                    </div>
                  )}

                  {/* Validation Error Message */}
                  {faviconError && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 0.85rem',
                        background: '#fee2e2',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(239, 68, 68, 0.35)',
                        color: '#b91c1c',
                        fontSize: '0.8rem',
                        lineHeight: 1.4
                      }}
                      role="alert"
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{faviconError}</span>
                    </div>
                  )}
                </div>

                {/* 2. School Name (Required) */}
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                      School Display Name
                    </label>
                    <span
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        fontSize: '0.68rem',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        border: '1px solid rgba(239, 68, 68, 0.25)'
                      }}
                    >
                      Required
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={config.schoolName}
                    onChange={(e) => updateConfigField('schoolName', e.target.value)}
                    placeholder="School Website"
                    required
                  />
                </div>

                {/* 3. Leadership Names (Optional) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Principal Name</label>
                      <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={config.principalName}
                      onChange={(e) => updateConfigField('principalName', e.target.value)}
                      placeholder="[Principal Name]"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Vice Principal</label>
                      <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={config.vicePrincipalName}
                      onChange={(e) => updateConfigField('vicePrincipalName', e.target.value)}
                      placeholder="[Vice Principal Name]"
                    />
                  </div>
                </div>

                {/* 4. Academic Year & Subtitle (Optional) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Academic Year</label>
                      <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={config.academicYear}
                      onChange={(e) => updateConfigField('academicYear', e.target.value)}
                      placeholder="2026–2027"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>School Subtitle</label>
                      <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={config.schoolSubtitle || ''}
                      onChange={(e) => updateConfigField('schoolSubtitle', e.target.value)}
                      placeholder="School Portal"
                    />
                  </div>
                </div>

                {/* 5. Campus Location (Optional) */}
                <div className="form-group" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>School Address</label>
                    <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={config.address}
                    onChange={(e) => updateConfigField('address', e.target.value)}
                    placeholder="[Verified School Address]"
                  />
                </div>

                {/* 6. Contact Phone & Email (Optional) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Contact Phone</label>
                      <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      value={config.phone}
                      onChange={(e) => updateConfigField('phone', e.target.value)}
                      placeholder="[Verified Contact Number]"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ margin: 0 }}>Contact Email</label>
                      <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                    </div>
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
                <div
                  style={{
                    padding: '0.95rem 1.15rem',
                    background: 'linear-gradient(175deg, #FFFFFF 0%, #F9F7F1 100%)',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    boxShadow: 'var(--clay-badge)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                      Publish "Faith" Navigation &amp; Page
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                      Unpublished by default in prototype mode.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="faith-toggle"
                    checked={!!config.faithSectionPublished}
                    onChange={(e) => updateConfigField('faithSectionPublished', e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-accent)' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setLogoError('');
                    resetToDefault();
                  }}
                  style={{ borderRadius: 'var(--radius-full)', padding: '0.5rem 1.15rem' }}
                >
                  <RotateCcw size={14} />
                  Reset to Defaults
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={onClose}
                  style={{ minWidth: '140px', borderRadius: 'var(--radius-full)', padding: '0.55rem 1.35rem' }}
                >
                  Apply &amp; Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
