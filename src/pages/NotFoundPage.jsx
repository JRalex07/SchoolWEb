import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMascot } from '../context/MascotContext';
import { MascotCharacter } from '../components/Mascot/MascotCharacter';
import {
  Home,
  ArrowLeft,
  BookOpen,
  Calendar,
  Compass,
  GraduationCap,
  Mail,
  Search,
  Sparkles
} from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMascotState, setActiveMessage } = useMascot();

  useEffect(() => {
    // Scroll top when 404 loads
    window.scrollTo(0, 0);

    // Set mascot to confused / curious recovery assistant state
    if (setMascotState) setMascotState('confused');
    if (setActiveMessage) {
      setActiveMessage({
        title: 'Hoot! Page Wandered Off',
        text: `Looks like "${location.pathname}" took a detour into the forest! Let me help guide you back to campus classes and events.`,
        suggestion: 'Return to Homepage',
        onApplySuggestion: () => navigate('/')
      });
    }

    const timer = setTimeout(() => {
      if (setMascotState) setMascotState('curious');
    }, 2800);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, navigate, setMascotState, setActiveMessage]);

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const quickLinks = [
    { title: 'Academic Programs', desc: 'Pre-K through Grade 12 curriculum', to: '/academics', icon: BookOpen },
    { title: 'School Calendar', desc: 'Upcoming terms, breaks, and sports', to: '/calendar', icon: Calendar },
    { title: 'Admissions & Tours', desc: 'Campus visits, criteria, and forms', to: '/admissions', icon: GraduationCap },
    { title: 'Contact Office', desc: 'Get in touch with school administration', to: '/contact', icon: Mail }
  ];

  return (
    <motion.main
      id="main-content"
      className="section"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        padding: '3rem 1rem',
        background: 'linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 100%)'
      }}
    >
      <div className="container" style={{ maxWidth: '820px' }}>
        <div
          className="card"
          style={{
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '2.5px solid rgba(255, 255, 255, 0.95)',
            boxShadow: 'var(--clay-card)',
            borderRadius: '30px'
          }}
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          {/* Centered Mascot Badge */}
          <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: [0, -3, 3, 0] }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
                borderRadius: '50%',
                padding: '10px',
                boxShadow: 'var(--clay-btn-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MascotCharacter state="confused" />
            </motion.div>
          </div>

          {/* Error Tag & Primary Heading */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
            <Compass size={16} /> 404 Route Not Found
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--color-primary)', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            Lost on the Campus Map?
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
            The requested page <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--color-primary)', fontSize: '0.9em' }}>{location.pathname}</code> does not exist or may have been relocated during curriculum updates.
          </p>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <Link
              to="/"
              className="btn btn-primary"
              data-helper-title="Return to Home"
              data-helper-description="Navigate back to school website homepage."
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
            >
              <Home size={18} /> Return to Homepage
            </Link>

            <button
              type="button"
              onClick={handleGoBack}
              className="btn btn-outline"
              data-helper-title="Previous Page"
              data-helper-description="Step back to the page you just visited or return to homepage."
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
            >
              <ArrowLeft size={18} /> Go Back
            </button>
          </div>

          {/* Quick Helpful Destinations Grid */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '2rem', textAlign: 'left' }}>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--color-accent)" /> Recommended Campus Destinations
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem'
            }}>
              {quickLinks.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.to}
                    data-helper-title={item.title}
                    data-helper-description={item.desc}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-lg)',
                      background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
                      border: '2px solid rgba(255, 255, 255, 0.95)',
                      textDecoration: 'none',
                      transition: 'all 0.25s ease',
                      boxShadow: 'var(--clay-badge)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-accent-light)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = 'var(--clay-card)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.95)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--clay-badge)';
                    }}
                  >
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.12)',
                      color: 'var(--color-accent)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComponent size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
};

export default NotFoundPage;
