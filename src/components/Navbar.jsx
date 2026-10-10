import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { Menu, X, Sliders, GraduationCap, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { ConfigDrawer } from './ConfigDrawer';
import { SchoolDefaultLogo } from './SchoolDefaultLogo';

export const Navbar = () => {
  const { config } = useSchoolConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while mobile drawer is open & restore on close/unmount
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Auto-close drawer if resized to desktop breakpoint (>= 992px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: "Home", path: "/", helperTitle: "Campus Portal Home", helperDesc: "Return to the main overview, highlights, and mission pillars." },
    { label: "About", path: "/about", helperTitle: "About Institution", helperDesc: "Learn about school philosophy, mission themes, and leadership." },
    { label: "Admissions", path: "/admissions", helperTitle: "Admissions Desk", helperDesc: "Review entry procedures, grade levels, and inquiry channels." },
    { label: "Academics", path: "/academics", helperTitle: "Academic Programs", helperDesc: "Explore our core curricula, athletics, and campus facilities." },
    ...(config.faithSectionPublished
      ? [{ label: "Faith", path: "/faith", helperTitle: "Faith & Values", helperDesc: "Spiritual development and ethical community formation." }]
      : [{ label: "Faith", path: "/faith", isUnpublished: true, helperTitle: "Faith Section", helperDesc: "Configurable faith-based overview; unpublished by default in prototype mode." }]),
    { label: "Calendar", path: "/calendar", helperTitle: "School Calendar", helperDesc: "Browse scheduled academic events and historical records." },
    { label: "Contact", path: "/contact", helperTitle: "Contact & Location", helperDesc: "Campus postal address, office hours, and telephone directory." },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Top Identity Status Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #16113A 0%, #211B52 100%)',
        color: '#C4C1DC',
        fontSize: '0.74rem',
        padding: '0.35rem 1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {config.identityMode === 'placeholder' ? (
              <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                <ShieldAlert size={11} /> Prototype Mode
              </span>
            ) : (
              <span className="badge badge-info" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                <Sparkles size={11} /> Historical Mode
              </span>
            )}
            <span style={{ fontSize: '0.74rem' }}>
              Academic Year: <strong style={{ color: '#ffffff' }}>{config.academicYear}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsConfigOpen(true)}
            data-helper-title="School Identity Settings"
            data-helper-description="Customize school name, leadership, contact info, and publish settings in real-time."
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-accent)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
            }}
            aria-label="Open Identity Settings"
          >
            <Sliders size={12} />
            Configure Identity
          </button>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 990,
          background: 'rgba(255, 254, 252, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1.5px solid rgba(48, 39, 100, 0.08)',
          boxShadow: '0 4px 16px -2px rgba(33, 27, 82, 0.08)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
          {/* Logo Brand */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            data-helper-title={`${config.schoolName} Brand`}
            data-helper-description="Navigate back to the main portal homepage."
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}
            aria-label={`${config.schoolName} Homepage`}
          >
            {config.logoUrl ? (
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3px',
                  border: '1.5px solid rgba(255, 255, 255, 0.45)',
                  boxShadow: 'var(--clay-btn-secondary)',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}
              >
                <img
                  src={config.logoUrl}
                  alt={`${config.schoolName || 'School'} Logo`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <SchoolDefaultLogo size={38} idPrefix="header" />
            )}
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-primary)', lineHeight: 1.15 }}>
                {config.schoolName}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {config.identityMode === 'placeholder' ? 'Independent School Prototype' : (config.schoolSubtitle || 'School Portal')}
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{ display: 'none' }}
            className="desktop-nav"
            aria-label="Main Navigation"
          >
            <style>{`
              @media (min-width: 992px) {
                .desktop-nav { display: flex !important; align-items: center; gap: 1.35rem; }
                .mobile-toggle { display: none !important; }
              }
            `}</style>
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                data-helper-title={item.helperTitle}
                data-helper-description={item.helperDesc}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  color: isActive ? 'var(--color-accent-hover)' : 'var(--color-text-main)',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.9rem',
                  padding: '0.4rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'linear-gradient(145deg, #FAF4E8, #F3EAE0)' : 'transparent',
                  border: isActive ? '1px solid rgba(244, 160, 36, 0.32)' : '1px solid transparent',
                  boxShadow: isActive ? 'var(--clay-badge)' : 'none',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  textDecoration: 'none',
                  position: 'relative'
                })}
              >
                {item.label}
                {item.isUnpublished && (
                  <span style={{ fontSize: '0.65rem', marginLeft: '3px', verticalAlign: 'super', color: '#8F8E9F' }}>
                    *
                  </span>
                )}
              </NavLink>
            ))}

            <Link
              to="/admissions"
              className="btn btn-primary btn-sm"
              data-helper-title="Apply / Inquire"
              data-helper-description="Visit admissions to learn about application requirements and prospectus inquiries."
              style={{ marginLeft: '0.35rem' }}
            >
              Admissions
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-toggle"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              border: '1.5px solid rgba(255, 255, 255, 0.95)',
              background: 'linear-gradient(145deg, #FFFEFC, #F3EFE6)',
              boxShadow: 'var(--clay-badge)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-primary)',
              padding: 0
            }}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer - RENDERED OUTSIDE HEADER AS CLEAN FULL-SCREEN MODAL */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Soft Clay Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileMenu}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(22, 17, 58, 0.42)',
                backdropFilter: 'blur(4px)'
              }}
            />

            {/* Slide-Down Clay Navigation Panel */}
            <motion.div
              initial={{ y: '-100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-100%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              style={{
                position: 'relative',
                background: 'linear-gradient(175deg, #FFFEFC 0%, #F8F4EA 100%)',
                borderBottom: '2px solid rgba(255, 255, 255, 0.95)',
                boxShadow: '0 16px 36px -4px rgba(33, 27, 82, 0.25), inset 0 -3px 4px 0 rgba(48, 39, 100, 0.08)',
                borderBottomLeftRadius: '24px',
                borderBottomRightRadius: '24px',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              {/* Drawer Top Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                borderBottom: '1px solid rgba(48, 39, 100, 0.08)',
                background: 'linear-gradient(180deg, #FFFEFC 0%, #FAF6EE 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {config.logoUrl ? (
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2px',
                        boxShadow: 'var(--clay-btn-secondary)',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={config.logoUrl}
                        alt={`${config.schoolName || 'School'} Logo`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <SchoolDefaultLogo size={34} idPrefix="drawer" />
                  )}
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.025rem', color: 'var(--color-primary)', lineHeight: 1.15 }}>
                      {config.schoolName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      Navigation Menu
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close navigation menu"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    border: '1.5px solid rgba(255, 255, 255, 0.95)',
                    background: 'linear-gradient(145deg, #FFFEFC, #F3EFE6)',
                    boxShadow: 'var(--clay-badge)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                    padding: 0
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Navigation List */}
              <div style={{
                padding: '0.85rem 1.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.45rem'
              }}>
                {navLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: '14px',
                      background: isActive
                        ? 'linear-gradient(145deg, #FAF4E8, #F5EBDA)'
                        : 'transparent',
                      boxShadow: isActive ? 'var(--clay-badge)' : 'none',
                      border: isActive ? '1px solid rgba(244, 160, 36, 0.35)' : '1px solid transparent',
                      color: isActive ? 'var(--color-accent-hover)' : 'var(--color-text-main)',
                      fontWeight: isActive ? 700 : 600,
                      fontSize: '0.95rem',
                      textDecoration: 'none'
                    })}
                  >
                    <span>
                      {item.label}
                      {item.isUnpublished && (
                        <span style={{ fontSize: '0.72rem', color: '#8F8E9F', marginLeft: '6px' }}>(Unpublished)</span>
                      )}
                    </span>
                    <ChevronRight size={17} color={item.path === location.pathname ? 'var(--color-accent)' : '#8F8E9F'} />
                  </NavLink>
                ))}

                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingBottom: '0.5rem' }}>
                  <Link
                    to="/admissions"
                    onClick={closeMobileMenu}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Inquire / Admissions
                  </Link>

                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      closeMobileMenu();
                      setIsConfigOpen(true);
                    }}
                  >
                    <Sliders size={16} />
                    Identity Configuration
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Identity Configuration Modal */}
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </>
  );
};

export default Navbar;
