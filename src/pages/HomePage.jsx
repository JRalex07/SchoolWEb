import React from 'react';
import { Link } from 'react-router-dom';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import {
  HERO_DATA,
  WELCOME_SECTION,
  LEADERSHIP_PROMPTS,
  TESTIMONIALS_DATA,
  MISSION_THEMES,
  HIGHLIGHT_THEMES,
  SUPPORT_SECTION
} from '../data/schoolContent';
import {
  GraduationCap,
  Trophy,
  Sparkles,
  Building2,
  Star,
  Shield,
  Globe,
  BookOpen,
  HeartHandshake,
  Brain,
  Palette,
  Users,
  Calendar as CalendarIcon,
  ArrowRight,
  MessageSquare,
  Info,
  CheckCircle,
  Clock,
  Heart,
  HandHelping
} from 'lucide-react';

export const HomePage = () => {
  const { config, openActionModal, historicalEvents, currentEvents } = useSchoolConfig();

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap size={28} color="var(--color-accent)" />;
      case 'Trophy': return <Trophy size={28} color="var(--color-accent)" />;
      case 'Sparkles': return <Sparkles size={28} color="var(--color-accent)" />;
      case 'Building2': return <Building2 size={28} color="var(--color-accent)" />;
      default: return <GraduationCap size={28} color="var(--color-accent)" />;
    }
  };

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

  const handleSupportAction = (item) => {
    if (item.id === 'volunteer') {
      openActionModal(
        "Volunteer Opportunities",
        "Volunteer registration and coordination endpoints were not recovered in the indexed source data. In an active deployment, this action connects to parent-teacher volunteer committees. Please contact the administrative office directly.",
        "info"
      );
    } else if (item.id === 'donate') {
      openActionModal(
        "Donation Information",
        "No verified donation processing, payment gateway, or financial transaction workflow was recovered in the indexed content. This prototype does not collect monetary contributions. Contact the institution for authorized development funds.",
        "warning"
      );
    }
  };

  const handleLeadershipPrompt = (role) => {
    openActionModal(
      `Inquire with ${role}`,
      `The "${role === 'Principal' ? 'ASK Principal' : 'ASK Vice Principal'}" interactive inquiry feature was reported in indexed content, but the destination form and recipient mailbox were not recovered. In a production environment, this directs inquiries directly to administrative leadership.`,
      "info"
    );
  };

  return (
    <main id="main-content">
      {/* 1. HERO SECTION */}
      <section
        data-section-id="hero"
        style={{
          background: 'linear-gradient(180deg, #0f1e36 0%, #152542 100%)',
          color: '#ffffff',
          paddingTop: '5.5rem',
          paddingBottom: '5.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle background ambient graphic */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201, 138, 44, 0.15) 0%, rgba(15, 30, 54, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(201, 138, 44, 0.2)',
                color: 'var(--color-accent-light)',
                border: '1px solid rgba(201, 138, 44, 0.4)',
                marginBottom: '1.25rem'
              }}
            >
              Academic Excellence & Holistic Development
            </span>

            <h1
              style={{
                color: '#ffffff',
                fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                marginBottom: '1.25rem'
              }}
            >
              Discover Excellence at <span style={{ color: 'var(--color-accent-light)' }}>{config.schoolName}</span>
            </h1>

            <p
              style={{
                color: '#cbd5e1',
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                fontWeight: 400,
                marginBottom: '2rem',
                lineHeight: 1.6
              }}
            >
              {HERO_DATA.tagline}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.12)' }}>
              <span style={{ color: 'var(--color-accent-light)', fontWeight: 600 }}>{HERO_DATA.prompt}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/about"
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
                data-helper-title="About Our Institution"
                data-helper-description="Learn about our institutional vision, foundational pillars, and executive leadership."
                data-helper-example="Click to visit the About page"
              >
                About Us
              </Link>
              <Link
                to="/admissions"
                className="btn btn-outline-white"
                style={{ minWidth: '150px' }}
                data-helper-title="Admissions Overview"
                data-helper-description="Review enrollment guidelines, grade criteria, and direct inquiry channels."
                data-helper-example="Click to view admissions guidelines"
              >
                Apply
              </Link>
            </div>
          </div>

          {/* 4 Hero Categories Cards */}
          <div style={{ marginTop: '4.5rem' }}>
            <div className="grid-4">
              {HERO_DATA.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="card"
                  data-helper-title={`${cat.title} Category`}
                  data-helper-description={cat.description}
                  data-helper-example={`Click to explore ${cat.title}`}
                  style={{
                    background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                    border: '2px solid rgba(255, 255, 255, 0.14)',
                    boxShadow: 'var(--clay-dark-card)',
                    borderRadius: '24px',
                    color: '#ffffff',
                    padding: '1.85rem'
                  }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    {cat.title}
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem', flexGrow: 1 }}>
                    {cat.description}
                  </p>
                  <Link
                    to={cat.link}
                    style={{
                      color: 'var(--color-accent-light)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    Explore {cat.title} <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. WELCOME & REPEATED HIGHLIGHT THEMES */}
      <section className="section" data-section-id="welcome">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <span className="section-tagline">Welcome To Our Institution</span>
              <h2 className="section-title">
                Building Purpose, Character & Scholarly Achievement
              </h2>

              <div className="notice-box info" style={{ fontSize: '0.85rem', marginTop: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Data Source Transparency:</strong> {WELCOME_SECTION.notice}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
                {WELCOME_SECTION.summaryCopy}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/about" className="btn btn-secondary">
                  Learn More About Us
                </Link>
                <Link to="/admissions" className="btn btn-outline">
                  Admissions Overview
                </Link>
              </div>
            </div>

            {/* 3 Highlight Themes Cards */}
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {HIGHLIGHT_THEMES.map((hl, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: '1.25rem'
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'var(--color-accent-soft)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {hl.iconType === 'star' && <Star size={24} color="var(--color-accent)" />}
                      {hl.iconType === 'shield' && <Shield size={24} color="var(--color-accent)" />}
                      {hl.iconType === 'globe' && <Globe size={24} color="var(--color-accent)" />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '1.15rem', margin: 0 }}>{hl.title}</h4>
                        <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{hl.badgeLabel}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                        {hl.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIX MISSION THEMES */}
      <section className="section section-alt" data-section-id="mission">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Core Institutional Pillars</span>
            <h2 className="section-title">Our Six Mission Themes</h2>
            <p className="section-description">
              Our educational framework is anchored in these six foundational pillars designed to prepare young minds for leadership, empathy, and intellectual rigor.
            </p>
          </div>

          <div className="grid-3">
            {MISSION_THEMES.map((mission, idx) => (
              <div
                key={idx}
                className="card"
                data-helper-title={mission.title}
                data-helper-description={mission.summary}
                data-helper-example="Core institutional pillar"
              >
                <div style={{ marginBottom: '1rem' }}>
                  {getMissionIcon(mission.icon)}
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                  {mission.title}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                  {mission.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LEADERSHIP PROMPTS & PERSPECTIVES / TESTIMONIALS */}
      <section className="section" data-section-id="perspectives">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Perspectives & Leadership</span>
            <h2 className="section-title">Voices of Our Community</h2>
            <p className="section-description">
              Student reflections, parent perspectives, and leadership inquiries reported in indexed school materials.
            </p>
          </div>

          {/* Leadership Direct Action Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            {LEADERSHIP_PROMPTS.map((lead, idx) => (
              <div
                key={idx}
                className="card"
                data-helper-title={`${lead.role} Inquiry Office`}
                data-helper-description={`Submit questions regarding curricula or institutional policies to the ${lead.role}.`}
                data-helper-example="Opens informational inquiry dialogue"
                style={{
                  background: 'linear-gradient(135deg, #f8fafc, #ffffff)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <MessageSquare size={22} color="var(--color-accent)" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{lead.role} Office</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Have questions about academic curricula or institutional guidance? Submit an inquiry to the {lead.role}.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleLeadershipPrompt(lead.role)}
                  style={{ width: '100%' }}
                  data-helper-title={lead.promptLabel}
                  data-helper-description={`Click to initiate inquiry dialogue with the ${lead.role}.`}
                >
                  {lead.promptLabel}
                </button>
              </div>
            ))}
          </div>

          {/* Testimonials Grid with Verification Badges */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.35rem' }}>School Perspectives (Indexed Records)</h3>
              <span className="badge badge-warning">Unverified Source Quotations</span>
            </div>

            <div className="grid-2">
              {TESTIMONIALS_DATA.map((t) => (
                <div key={t.id} className="card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', margin: 0 }}>{t.displayedName}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                        {t.cohort || t.roleLabel}
                      </span>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                      Indexed Summary
                    </span>
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', fontStyle: 'italic', marginBottom: '1rem' }}>
                    "{t.topicSummary}"
                  </p>

                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem' }}>
                    ⚠️ {t.disclaimer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALENDAR PREVIEW */}
      <section className="section section-alt" data-section-id="calendar-preview">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tagline">Academic Schedule & Events</span>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Calendar Highlights</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                Includes historical indexed dates and active school sessions.
              </p>
            </div>
            <Link
              to="/calendar"
              className="btn btn-secondary"
              data-helper-title="Full Calendar Schedule"
              data-helper-description="Navigate to the full school calendar to browse all upcoming and historical milestones."
              data-helper-example="Click to view full calendar"
            >
              View Full Calendar <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {currentEvents.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="card"
                data-helper-title={item.event}
                data-helper-description={`Scheduled on ${item.date} under ${item.category}. ${item.notes}`}
                data-helper-example="Verified School Session"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-success">{item.category}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={12} /> {item.date}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{item.event}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                  {item.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SUPPORT & COMMUNITY PARTICIPATION */}
      <section className="section" data-section-id="support">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Community Engagement</span>
            <h2 className="section-title">Support & Participate</h2>
            <p className="section-description">
              Opportunities to engage with our school community through volunteering, event participation, and institutional support.
            </p>
          </div>

          <div className="grid-3">
            {SUPPORT_SECTION.map((item) => (
              <div key={item.id} className="card" style={{ textAlign: 'center', alignItems: 'center' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'var(--color-accent-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem'
                  }}
                >
                  {item.id === 'volunteer' && <HandHelping size={26} color="var(--color-accent)" />}
                  {item.id === 'events' && <CalendarIcon size={26} color="var(--color-accent)" />}
                  {item.id === 'donate' && <Heart size={26} color="var(--color-accent)" />}
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {item.summary}
                </p>

                {item.actionType === 'link' ? (
                  <Link to={item.path} className="btn btn-primary btn-sm">
                    {item.callToAction}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleSupportAction(item)}
                  >
                    {item.callToAction}
                  </button>
                )}

                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  ℹ️ {item.statusNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
