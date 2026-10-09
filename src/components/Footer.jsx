import React from 'react';
import { Link } from 'react-router-dom';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { FOOTER_DATA } from '../data/schoolContent';
import { GraduationCap, MapPin, Phone, Mail, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const { config } = useSchoolConfig();

  return (
    <footer data-section-id="footer" id="footer" style={{ background: '#091322', color: '#cbd5e1', paddingTop: '4.5rem', paddingBottom: '2.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', marginBottom: '3.5rem' }}>

          {/* Column 1: School Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-hover))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <GraduationCap size={22} color="#fff" />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.35rem', margin: 0 }}>
                {config.schoolName}
              </h3>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {FOOTER_DATA.descriptionSummary}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 0.85rem', borderRadius: '6px', fontSize: '0.775rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ShieldCheck size={16} color="var(--color-accent-light)" />
              <span>Identity Profile: <strong>{config.identityMode.toUpperCase()}</strong></span>
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
                <span style={{ color: '#94a3b8' }}>{config.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} style={{ color: '#cbd5e1' }}>
                  {config.phone}
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${config.email}`} style={{ color: '#cbd5e1' }}>
                  {config.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Audit & Compliance Disclaimer */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '2rem', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.6 }}>
          <strong style={{ color: '#e2e8f0' }}>Integrity & Prototype Standards:</strong> All public information strictly reflects the indexed dataset provided in <code>mount_summer_website_content_data.md</code>. Missing administrative details (curriculum syllabi, payment gateways, exact testimonials) remain explicitly marked as requiring verification. Configurable identity prevents unverified attribution.
        </div>

        {/* Bottom copyright line */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
          <div>
            {config.identityMode === 'archive'
              ? '© 2025 Mount Summer Convent School. All Rights Reserved.'
              : `© ${new Date().getFullYear()} ${config.schoolName}. All Rights Reserved.`}
          </div>
          <div>
            Built with React, Vite & Vanilla CSS Design System
          </div>
        </div>
      </div>
    </footer>
  );
};
