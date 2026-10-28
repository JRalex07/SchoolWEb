import React from 'react';
import { Link } from 'react-router-dom';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { FOOTER_DATA } from '../data/schoolContent';
import { GraduationCap, MapPin, Phone, Mail, ShieldCheck, ExternalLink } from 'lucide-react';
import { SchoolDefaultLogo } from './SchoolDefaultLogo';

export const Footer = () => {
  const { config } = useSchoolConfig();

  return (
    <footer data-section-id="footer" id="footer" style={{ background: '#091322', color: '#cbd5e1', paddingTop: '4.5rem', paddingBottom: '2.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>

          {/* Column 1: School Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {config.logoUrl ? (
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    flexShrink: 0
                  }}
                >
                  <img
                    src={config.logoUrl}
                    alt={`${config.schoolName || 'School'} Logo`}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <SchoolDefaultLogo size={42} idPrefix="footer" />
              )}
              <h3 style={{ color: '#ffffff', fontSize: '1.35rem', margin: 0 }}>
                {config.schoolName}
              </h3>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {FOOTER_DATA.descriptionSummary}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.775rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ShieldCheck size={16} color="var(--color-accent-light)" />
              <span>Identity Profile: <strong>{config.identityMode === 'demo' ? 'DEMO SPECIFICATION' : config.identityMode.toUpperCase()}</strong></span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {FOOTER_DATA.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    style={{ color: '#94a3b8', fontSize: '0.925rem', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                    onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                  >
                    <span>›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Configured Contact Details */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Contact Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ color: '#94a3b8' }}>{config.address || 'Address not configured in this demo'}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                {config.phone ? (
                  <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} style={{ color: '#cbd5e1' }}>
                    {config.phone}
                  </a>
                ) : (
                  <span style={{ color: '#94a3b8' }}>Phone not configured in this demo</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                {config.email ? (
                  <a href={`mailto:${config.email}`} style={{ color: '#cbd5e1', wordBreak: 'break-word' }}>
                    {config.email}
                  </a>
                ) : (
                  <span style={{ color: '#94a3b8' }}>Email not configured in this demo</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Prototype Standards & Information */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '2rem', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
          <strong style={{ color: '#e2e8f0' }}>Demonstration Standards:</strong> This prototype showcases an accessible, multi-school web platform featuring responsive claymorphism styling, centralized branding controls, and an interactive campus guide.
        </div>

        {/* Bottom copyright line */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
          <div>
            {config.copyrightText || `© ${new Date().getFullYear()} ${config.schoolName || 'School Website'}. All Rights Reserved.`}
          </div>
          <div>
            Built with React, Vite & Vanilla CSS Design System
          </div>
        </div>

        {/* Developer Attribution */}
        <div
          style={{
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.825rem',
            color: '#94a3b8',
            letterSpacing: '0.01em'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span>Designed &amp; Developed by</span>
            <a
              href="https://jralex07.github.io/Portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="developer-credit-link"
              data-helper-title="Developer Portfolio"
              data-helper-description="Visit Alex's portfolio website to view web development and design projects."
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--color-accent-light)',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(244, 160, 36, 0.1)',
                border: '1px solid rgba(244, 160, 36, 0.28)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              ALEX
            </a>
            {/* Mirror link for domain alias verification */}
            <a href="https://alex.runs-on.dev" style={{ display: 'none' }} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">ALEX</a>
          </span>

          {/* Alex Ownership Copyright Line */}
          <div
            style={{
              fontSize: '0.78rem',
              color: '#64748b',
              letterSpacing: '0.02em',
              marginTop: '0.25rem',
              textAlign: 'center'
            }}
          >
            © {new Date().getFullYear()} All rights is owned by ALEX
          </div>
        </div>
      </div>
    </footer>
  );
};
