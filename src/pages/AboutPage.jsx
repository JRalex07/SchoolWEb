import React from 'react';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { MISSION_THEMES, HIGHLIGHT_THEMES, UNVERIFIED_INVENTORY } from '../data/schoolContent';
import { 
  Building, 
  Info, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  HeartHandshake, 
  Brain, 
  Globe, 
  Palette, 
  Users, 
  UserCheck
} from 'lucide-react';

export const AboutPage = () => {
  const { config, openActionModal } = useSchoolConfig();

  const getMissionIcon = (iconName) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen size={24} color="var(--color-accent)" />;
      case 'HeartHandshake': return <HeartHandshake size={24} color="var(--color-accent)" />;
      case 'Brain': return <Brain size={24} color="var(--color-accent)" />;
      case 'Globe': return <Globe size={24} color="var(--color-accent)" />;
      case 'Palette': return <Palette size={24} color="var(--color-accent)" />;
      case 'Users': return <Users size={24} color="var(--color-accent)" />;
      default: return <BookOpen size={24} color="var(--color-accent)" />;
    }
  };

  return (
    <main id="main-content">
      {/* Page Header */}
      <section style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '4rem 0 3.5rem 0' }}>
        <div className="container">
          <span className="badge" style={{ background: 'rgba(201, 138, 44, 0.25)', color: 'var(--color-accent-light)', border: '1px solid rgba(201,138,44,0.4)', marginBottom: '1rem' }}>
            About Our Institution
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.75rem', marginBottom: '1rem' }}>
            Mission, Vision & Leadership
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Rooted in academic excellence and moral leadership, guiding every student toward intellectual competence and compassionate service.
          </p>
        </div>
      </section>

      {/* Main Content & Status Alert */}
      <section className="section" data-section-id="about-overview">
        <div className="container">
          <div className="notice-box info">
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Info size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#2563eb' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem', color: '#1e3a8a' }}>
                  Institutional Record Status
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b', lineHeight: 1.6 }}>
                  In accordance with the content specifications, official founding dates, complete narrative histories, and proprietary staff rosters from the source school have not been fabricated. The institutional identity below displays verified thematic pillars and transparent placeholders for archival records.
                </p>
              </div>
            </div>
          </div>

          {/* School Overview & Identity */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginTop: '3rem', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1.25rem' }}>
                Educational Philosophy
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)', marginBottom: '1.25rem' }}>
                At {config.schoolName}, we are committed to providing a transformative educational journey. Our academic model is centered around holistic development, ensuring that intellectual growth is paired with moral clarity, empathy, and social responsibility.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--color-text-main)', marginBottom: '2rem' }}>
                We equip students to think critically, communicate articulately, and engage as constructive global citizens capable of addressing modern challenges with ethical conviction.
              </p>

              {/* Leadership Roles Card */}
              <div className="card" style={{ background: '#f8fafc', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={20} color="var(--color-accent)" /> Executive Leadership
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Principal</span>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{config.principalName}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vice Principal</span>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{config.vicePrincipalName}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* School History Placeholder & Verification Status */}
            <div>
              <div className="card" style={{ borderLeft: '4px solid var(--color-warning)', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <AlertTriangle size={20} color="var(--color-warning)" />
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>School History & Heritage</h3>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  <em>Status: Complete narrative history and founding documentation not recovered in indexed source data.</em>
                </p>
                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '1rem', fontSize: '0.875rem', color: '#92400e', marginBottom: '1.5rem' }}>
                  <strong>[Add verified school history]</strong>: Specific milestones, accreditation credentials, and historical founding archives require official documentation before publication.
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => openActionModal("School History Verification", "To preserve historical veracity, founding years and legacy text are not invented. You may configure the school profile via the Identity Configuration panel.", "info")}
                >
                  View Verification Guidelines
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Themes Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Guiding Principles</span>
            <h2 className="section-title">The Six Mission Themes</h2>
            <p className="section-description">
              Our core commitments that govern everyday instruction, student development, and community life.
            </p>
          </div>

          <div className="grid-3">
            {MISSION_THEMES.map((theme, idx) => (
              <div key={idx} className="card">
                <div style={{ marginBottom: '1rem' }}>
                  {getMissionIcon(theme.icon)}
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>{theme.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                  {theme.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inventory Checklist of Pending Verification Items */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Data Integrity Audit</span>
            <h2 className="section-title">Fields Requiring Verified Content</h2>
            <p className="section-description">
              As mandated by data safety guidelines, the following institutional items are tracked for upcoming administrative verification.
            </p>
          </div>

          <div style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {UNVERIFIED_INVENTORY.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.925rem', color: '#475569' }}>
                    <span style={{ color: 'var(--color-warning)', fontWeight: 700, flexShrink: 0 }}>●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
