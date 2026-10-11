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
  Globe,
  Link as LinkIcon
} from 'lucide-react';
import { SchoolDefaultLogo } from './SchoolDefaultLogo';
import { LeadershipPortrait } from './LeadershipPortrait';

export const ConfigDrawer = ({ isOpen, onClose }) => {
  const { config, updateConfigField, resetToDefault } = useSchoolConfig();
  const [logoError, setLogoError] = useState('');
  const [urlInputOpen, setUrlInputOpen] = useState(false);
  const fileInputRef = useRef(null);

  // Lock body scroll & handle Escape key while drawer is open
  React.useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const [faviconError, setFaviconError] = useState('');
  const [faviconUrlInputOpen, setFaviconUrlInputOpen] = useState(false);
  const faviconFileInputRef = useRef(null);

  const [princPhotoError, setPrincPhotoError] = useState('');
  const [princUrlOpen, setPrincUrlOpen] = useState(false);
  const princFileInputRef = useRef(null);

  const [vpPhotoError, setVpPhotoError] = useState('');
  const [vpUrlOpen, setVpUrlOpen] = useState(false);
  const vpFileInputRef = useRef(null);

  const handlePrincipalPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPrincPhotoError('Supported formats: PNG, JPG, WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPrincPhotoError('Image size exceeds 2 MB.');
      return;
    }
    setPrincPhotoError('');
    const reader = new FileReader();
    reader.onload = (event) => updateConfigField('principalPhotoUrl', event.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemovePrincipalPhoto = () => {
    setPrincPhotoError('');
    updateConfigField('principalPhotoUrl', null);
    if (princFileInputRef.current) princFileInputRef.current.value = '';
  };

  const handleVicePrincipalPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setVpPhotoError('Supported formats: PNG, JPG, WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setVpPhotoError('Image size exceeds 2 MB.');
      return;
    }
    setVpPhotoError('');
    const reader = new FileReader();
    reader.onload = (event) => updateConfigField('vicePrincipalPhotoUrl', event.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveVicePrincipalPhoto = () => {
    setVpPhotoError('');
    updateConfigField('vicePrincipalPhotoUrl', null);
    if (vpFileInputRef.current) vpFileInputRef.current.value = '';
  };

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
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <motion.div
            className="modal-card"
            style={{
              maxWidth: 'min(100%, 680px)',
              maxHeight: 'min(90vh, 850px)',
              overflowY: 'auto',
              borderRadius: 'clamp(20px, 3.5vw, 28px)',
              position: 'relative',
              willChange: 'transform, opacity'
            }}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.96, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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

                {/* 3. Leadership Names & Portraits (Optional) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Principal Section */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Principal Details</label>
                      <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                      <LeadershipPortrait
                        role="principal"
                        photoUrl={config.principalPhotoUrl}
                        name={config.principalName}
                        size={52}
                      />
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          className="form-control"
                          value={config.principalName}
                          onChange={(e) => updateConfigField('principalName', e.target.value)}
                          placeholder="e.g. Dr. Alistair Vance"
                          style={{ marginBottom: '0.35rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <input
                            type="file"
                            ref={princFileInputRef}
                            onChange={handlePrincipalPhotoUpload}
                            accept="image/png,image/jpeg,image/webp"
                            style={{ display: 'none' }}
                          />
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => princFileInputRef.current?.click()}
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                          >
                            <Upload size={12} /> {config.principalPhotoUrl ? 'Replace Photo' : 'Upload Photo'}
                          </button>
                          {config.principalPhotoUrl && (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={handleRemovePrincipalPhoto}
                              style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', color: '#dc2626' }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setPrincUrlOpen(!princUrlOpen)}
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                          >
                            <LinkIcon size={12} /> URL
                          </button>
                        </div>
                      </div>
                    </div>

                    {princUrlOpen && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <input
                          type="url"
                          className="form-control"
                          value={config.principalPhotoUrl || ''}
                          onChange={(e) => updateConfigField('principalPhotoUrl', e.target.value || null)}
                          placeholder="https://example.com/principal-photo.jpg"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                    )}
                    {princPhotoError && (
                      <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        {princPhotoError}
                      </span>
                    )}
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                      Defaults to refined 3D clay human avatar when no photograph is uploaded.
                    </span>
                  </div>

                  {/* Vice Principal Section */}
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Vice Principal Details</label>
                      <span style={{ background: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontSize: '0.65rem', padding: '0.12rem 0.45rem', borderRadius: '9999px', fontWeight: 600 }}>Optional</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
                      <LeadershipPortrait
                        role="vicePrincipal"
                        photoUrl={config.vicePrincipalPhotoUrl}
                        name={config.vicePrincipalName}
                        size={52}
                      />
                      <div style={{ flex: 1 }}>
                        <input
                          type="text"
                          className="form-control"
                          value={config.vicePrincipalName}
                          onChange={(e) => updateConfigField('vicePrincipalName', e.target.value)}
                          placeholder="e.g. Prof. Kenneth Morales"
                          style={{ marginBottom: '0.35rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          <input
                            type="file"
                            ref={vpFileInputRef}
                            onChange={handleVicePrincipalPhotoUpload}
                            accept="image/png,image/jpeg,image/webp"
                            style={{ display: 'none' }}
                          />
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => vpFileInputRef.current?.click()}
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                          >
                            <Upload size={12} /> {config.vicePrincipalPhotoUrl ? 'Replace Photo' : 'Upload Photo'}
                          </button>
                          {config.vicePrincipalPhotoUrl && (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={handleRemoveVicePrincipalPhoto}
                              style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem', color: '#dc2626' }}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => setVpUrlOpen(!vpUrlOpen)}
                            style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                          >
                            <LinkIcon size={12} /> URL
                          </button>
                        </div>
                      </div>
                    </div>

                    {vpUrlOpen && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <input
                          type="url"
                          className="form-control"
                          value={config.vicePrincipalPhotoUrl || ''}
                          onChange={(e) => updateConfigField('vicePrincipalPhotoUrl', e.target.value || null)}
                          placeholder="https://example.com/vice-principal-photo.jpg"
                          style={{ fontSize: '0.8rem' }}
                        />
                      </div>
                    )}
                    {vpPhotoError && (
                      <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                        {vpPhotoError}
                      </span>
                    )}
                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', marginTop: '0.25rem' }}>
                      Defaults to refined 3D clay human avatar when no photograph is uploaded.
                    </span>
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
                    placeholder="e.g. 42 Academic Parkway, Education City"
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
                      placeholder="e.g. +91 98765 43210"
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
                      placeholder="e.g. admissions@school-prototype.edu"
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
