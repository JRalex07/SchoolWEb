import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { Menu, X, Sliders, GraduationCap, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { ConfigDrawer } from './ConfigDrawer';

export const Navbar = () => {
  const { config } = useSchoolConfig();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
      <div style={{ background: '#070e1b', color: '#94a3b8', fontSize: '0.775rem', padding: '0.4rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {config.identityMode === 'placeholder' ? (
              <span className="badge badge-warning" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                <ShieldAlert size={12} /> Prototype Mode (Configurable)
              </span>
            ) : (
              <span className="badge badge-info" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                <Sparkles size={12} /> Historical Data Mode
              </span>
            )}
            <span style={{ display: 'inline-block' }}>
              Academic Year: <strong style={{ color: '#e2e8f0' }}>{config.academicYear}</strong>
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
              fontSize: '0.775rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
            }}
            aria-label="Open Identity Settings"
          >
            <Sliders size={13} />
            Configure School Identity
          </button>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(252, 253, 254, 0.94)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 8px 24px rgba(160, 174, 196, 0.22)'
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
          {/* Logo Brand */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            data-helper-title={`${config.schoolName} Brand`}
            data-helper-description="Navigate back to the main portal homepage."
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}
            aria-label={`${config.schoolName} Homepage`}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                boxShadow: 'var(--clay-btn-secondary)'
              }}
            >
              <GraduationCap size={24} color="var(--color-accent-light)" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-primary)', lineHeight: 1.1 }}>
                {config.schoolName}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {config.identityMode === 'placeholder' ? 'Independent School Prototype' : 'Convent School Portal'}
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
                .desktop-nav { display: flex !important; align-items: center; gap: 1.5rem; }
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
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.925rem',
                  padding: '0.5rem 0.25rem',
                  borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                })}
              >
                {item.label}
                {item.isUnpublished && (
                  <span style={{ fontSize: '0.65rem', marginLeft: '4px', verticalAlign: 'super', color: '#94a3b8' }}>
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
              style={{ marginLeft: '0.5rem' }}
            >
              Admissions
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-toggle btn btn-outline"
            style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'fixed',
                top: 'calc(var(--header-height) + 33px)',
                left: 0,
                right: 0,
                bottom: 0,
                background: '#ffffff',
                borderTop: '1px solid var(--color-border)',
                padding: '1.5rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                zIndex: 99
              }}
            >
              {navLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--color-bg-alt)' : 'transparent',
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '1.05rem',
                    borderLeft: isActive ? '4px solid var(--color-accent)' : '4px solid transparent'
                  })}
                >
                  <span>
                    {item.label}
                    {item.isUnpublished && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '6px' }}>(Unpublished)</span>
                    )}
                  </span>
                  <ChevronRight size={18} color="#94a3b8" />
                </NavLink>
              ))}

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link
                  to="/admissions"
                  onClick={closeMobileMenu}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Inquire / Admissions
                </Link>

                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                  onClick={() => {
                    closeMobileMenu();
                    setIsConfigOpen(true);
                  }}
                >
                  <Sliders size={18} />
                  Identity Configuration
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Identity Configuration Modal */}
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </>
  );
};
