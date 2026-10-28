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
import { LeadershipPortrait } from '../components/LeadershipPortrait';
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
  HandHelping,
  Compass
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
      {/* 1. HERO SECTION - BENTO ARCHITECTURE */}
      <section
        data-section-id="hero"
        style={{
          background: 'linear-gradient(180deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          color: '#ffffff',
          paddingTop: 'clamp(3.5rem, 6vw, 5rem)',
          paddingBottom: 'clamp(3.5rem, 6vw, 5rem)',
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
            background: 'radial-gradient(circle, rgba(244, 160, 36, 0.16) 0%, rgba(22, 17, 58, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Main Hero Header */}
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(244, 160, 36, 0.18)',
                color: 'var(--color-accent-light)',
                border: '1px solid rgba(244, 160, 36, 0.4)',
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
                fontSize: 'clamp(1.05rem, 2vw, 1.3rem)',
                fontWeight: 400,
                marginBottom: 'clamp(1.25rem, 2.5vw, 1.85rem)',
                lineHeight: 1.6
              }}
            >
              {HERO_DATA.tagline}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius-full)', marginBottom: 'clamp(1.5rem, 3vw, 2.25rem)', border: '1px solid rgba(255,255,255,0.14)' }}>
              <Compass size={16} color="var(--color-accent)" />
              <span style={{ color: 'var(--color-accent-light)', fontWeight: 600 }}>{HERO_DATA.prompt}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                to="/about"
                className="btn btn-primary"
                style={{ minWidth: 'min(100%, 150px)' }}
                data-helper-title="About Our Institution"
                data-helper-description="Learn about our institutional vision, foundational pillars, and executive leadership."
                data-helper-example="Click to visit the About page"
              >
                About Us
              </Link>
              <Link
                to="/admissions"
                className="btn btn-outline-white"
                style={{ minWidth: 'min(100%, 150px)' }}
                data-helper-title="Admissions Overview"
                data-helper-description="Review enrollment guidelines, grade criteria, and direct inquiry channels."
                data-helper-example="Click to view admissions guidelines"
              >
                Apply
              </Link>
            </div>
          </div>

          {/* Hero Bento Grid: Asymmetric Portal Pathways */}
          <div className="bento-grid">
            {HERO_DATA.categories.map((cat, idx) => {
              // Vary span intentionally: First two are 6-span, next two are 6-span for balanced bento layout
              const spanClass = idx === 0 || idx === 1 ? 'bento-col-6' : 'bento-col-6';
              return (
                <div
                  key={cat.id}
                  className={`${spanClass} glass-card-dark`}
                  data-helper-title={`${cat.title} Category`}
                  data-helper-description={cat.description}
                  data-helper-example={`Click to explore ${cat.title}`}
                  style={{
                    padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '220px',
                    transition: 'transform var(--motion-hover), box-shadow var(--motion-hover)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '14px',
                          background: 'rgba(244, 160, 36, 0.16)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid rgba(244, 160, 36, 0.3)'
                        }}
                      >
                        {getCategoryIcon(cat.icon)}
                      </div>
                      <span
                        className="badge"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#e2e8f0',
                          fontSize: '0.68rem',
                          border: '1px solid rgba(255, 255, 255, 0.15)'
                        }}
                      >
                        {idx === 0 ? 'Pillar 01' : idx === 1 ? 'Pillar 02' : idx === 2 ? 'Pillar 03' : 'Pillar 04'}
                      </span>
                    </div>

                    <h3 style={{ color: '#ffffff', fontSize: '1.35rem', marginBottom: '0.65rem', letterSpacing: '-0.01em' }}>
                      {cat.title}
                    </h3>
                    <p style={{ color: '#cbd5e1', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {cat.description}
                    </p>
                  </div>

                  <Link
                    to={cat.link}
                    style={{
                      color: 'var(--color-accent-light)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      width: 'fit-content',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(244, 160, 36, 0.12)',
                      border: '1px solid rgba(244, 160, 36, 0.25)'
                    }}
                  >
                    Explore {cat.title} <ArrowRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. WELCOME & BENTO HIGHLIGHTS */}
      <section className="section" data-section-id="welcome" style={{ paddingTop: 'clamp(3rem, 5vw, 4.5rem)', paddingBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
        <div className="container">
          <div className="bento-grid" style={{ alignItems: 'stretch' }}>
            {/* Left Bento: Main Welcome Overview (7 cols) */}
            <div
              className="bento-col-7 bento-card glass-card"
              style={{
                background: 'linear-gradient(168deg, #ffffff 0%, #faf8f5 100%)',
                padding: 'clamp(1.75rem, 3vw, 2.5rem)',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span className="section-tagline" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                  Welcome To Our Institution
                </span>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)', marginBottom: '1rem' }}>
                  Building Purpose, Character & Scholarly Achievement
                </h2>

                <div className="notice-box info" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', borderRadius: '14px' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>Interactive Prototype Model:</strong> {WELCOME_SECTION.notice}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '1.025rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: '1.75rem' }}>
                  {WELCOME_SECTION.summaryCopy}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid rgba(33, 27, 82, 0.08)' }}>
                <Link to="/about" className="btn btn-secondary">
                  Learn More About Us
                </Link>
                <Link to="/admissions" className="btn btn-outline">
                  Admissions Overview
                </Link>
              </div>
            </div>

            {/* Right Bento: 3 Highlight Cards (5 cols) */}
            <div className="bento-col-5" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {HIGHLIGHT_THEMES.map((hl, idx) => (
                <div
                  key={idx}
                  className="bento-card"
                  style={{
                    padding: '1.25rem 1.5rem',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: '1.15rem',
                    borderRadius: '20px'
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: 'var(--color-accent-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: 'var(--clay-badge)'
                    }}
                  >
                    {hl.iconType === 'star' && <Star size={22} color="var(--color-accent)" />}
                    {hl.iconType === 'shield' && <Shield size={22} color="var(--color-accent)" />}
                    {hl.iconType === 'globe' && <Globe size={22} color="var(--color-accent)" />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--color-primary)' }}>{hl.title}</h4>
                      <span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{hl.badgeLabel}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {hl.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIX MISSION THEMES - ASYMMETRIC BENTO GRID */}
      <section className="section section-alt" data-section-id="mission" style={{ paddingTop: 'clamp(3rem, 5vw, 4.5rem)', paddingBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <span className="section-tagline">Core Institutional Pillars</span>
            <h2 className="section-title">Our Foundational Mission Themes</h2>
            <p className="section-description">
              Our educational framework is anchored in these foundational pillars designed to prepare young minds for leadership, empathy, and intellectual rigor.
            </p>
          </div>

          <div className="bento-grid">
            {MISSION_THEMES.map((mission, idx) => {
              // Asymmetric weights: First card is 7-span, second is 5-span, remaining are 4-span
              let colSpan = 'bento-col-4';
              if (idx === 0) colSpan = 'bento-col-7';
              else if (idx === 1) colSpan = 'bento-col-5';

              return (
                <div
                  key={idx}
                  className={`${colSpan} bento-card`}
                  data-helper-title={mission.title}
                  data-helper-description={mission.summary}
                  data-helper-example="Core institutional pillar"
                  style={{
                    padding: 'clamp(1.4rem, 2vw, 1.85rem)',
                    minHeight: '200px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: 'var(--color-accent-soft)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--clay-badge)'
                        }}
                      >
                        {getMissionIcon(mission.icon)}
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                        Pillar #{idx + 1}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem', color: 'var(--color-primary)' }}>
                      {mission.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                      {mission.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. LEADERSHIP PROMPTS & PERSPECTIVES / TESTIMONIALS */}
      <section className="section" data-section-id="perspectives" style={{ paddingTop: 'clamp(3rem, 5vw, 4.5rem)', paddingBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <span className="section-tagline">Perspectives & Leadership</span>
            <h2 className="section-title">Institutional Leadership & Voices</h2>
            <p className="section-description">
              Instructional leadership profiles, student reflections, and parent perspectives across our academic community.
            </p>
          </div>

          {/* Executive Leadership Profile Cards with 3D Clay Portraits (Preserves responsive audit invariant minmax(min(100%, 280px), 1fr)) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '3.5rem' }}>
            {/* Principal Profile Card */}
            <div
              className="card leadership-card glass-card"
              data-helper-title="Principal Leadership Profile"
              data-helper-description={`Meet ${config.principalName}, Principal and instructional leader.`}
              style={{
                background: 'linear-gradient(168deg, #FFFEFC 0%, #FAF5EE 100%)',
                border: '2px solid rgba(255, 255, 255, 0.95)',
                borderRadius: '30px',
                padding: '2.25rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.25rem',
                boxShadow: 'var(--clay-card)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
            >
              <LeadershipPortrait
                role="principal"
                photoUrl={config.principalPhotoUrl}
                name={config.principalName}
                size={144}
              />
              <div style={{ width: '100%' }}>
                <span className="badge badge-info" style={{ fontSize: '0.72rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                  Principal & Head of School
                </span>
                <h3 style={{ margin: '0.25rem 0', fontSize: '1.35rem', color: 'var(--color-primary)' }}>
                  {config.principalName}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0.5rem 0 1.25rem 0' }}>
                  Leading our campus community with a commitment to academic rigor, character formation, and student-centered mentorship.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleLeadershipPrompt('Principal')}
                  style={{ width: '100%' }}
                  data-helper-title="Inquire with Principal"
                  data-helper-description="Opens informational leadership dialogue with the Principal."
                >
                  <MessageSquare size={16} /> Inquire with Principal
                </button>
              </div>
            </div>

            {/* Vice Principal Profile Card */}
            <div
              className="card leadership-card glass-card"
              data-helper-title="Vice Principal Leadership Profile"
              data-helper-description={`Meet ${config.vicePrincipalName}, Vice Principal and Dean of Studies.`}
              style={{
                background: 'linear-gradient(168deg, #FFFEFC 0%, #FAF5EE 100%)',
                border: '2px solid rgba(255, 255, 255, 0.95)',
                borderRadius: '30px',
                padding: '2.25rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1.25rem',
                boxShadow: 'var(--clay-card)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }}
            >
              <LeadershipPortrait
                role="vicePrincipal"
                photoUrl={config.vicePrincipalPhotoUrl}
                name={config.vicePrincipalName}
                size={144}
              />
              <div style={{ width: '100%' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.72rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                  Vice Principal & Dean of Studies
                </span>
                <h3 style={{ margin: '0.25rem 0', fontSize: '1.35rem', color: 'var(--color-primary)' }}>
                  {config.vicePrincipalName}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, margin: '0.5rem 0 1.25rem 0' }}>
                  Championing pedagogical excellence, curricular development, and active student mentorship across all departments.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleLeadershipPrompt('Vice Principal')}
                  style={{ width: '100%' }}
                  data-helper-title="Inquire with Vice Principal"
                  data-helper-description="Opens informational curriculum advisory dialogue with the Vice Principal."
                >
                  <MessageSquare size={16} /> Inquire with Vice Principal
                </button>
              </div>
            </div>
          </div>

          {/* Testimonials Bento Cards */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.35rem' }}>School Perspectives & Testimonials</h3>
              <span className="badge badge-neutral">Demonstration Records</span>
            </div>

            <div className="bento-grid">
              {TESTIMONIALS_DATA.map((t) => (
                <div key={t.id} className="bento-col-6 bento-card glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-primary)' }}>{t.displayedName}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                        {t.cohort || t.roleLabel}
                      </span>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                      Verified Entry
                    </span>
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.6 }}>
                    "{t.topicSummary}"
                  </p>

                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px dashed #e2e8f0', paddingTop: '0.75rem' }}>
                    Information preserved for institutional demonstration purposes.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALENDAR PREVIEW */}
      <section className="section section-alt" data-section-id="calendar-preview" style={{ paddingTop: 'clamp(3rem, 5vw, 4.5rem)', paddingBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tagline">Academic Schedule & Events</span>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Upcoming Calendar Milestones</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
                Current year (2026) academic sessions, athletic meets, and national observances.
              </p>
            </div>
            <Link to="/calendar" className="btn btn-primary btn-sm">
              View Complete Calendar <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bento-grid">
            {currentEvents.slice(0, 3).map((ev, idx) => (
              <div key={ev.id || idx} className="bento-col-4 bento-card glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                    {ev.category}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                    <CalendarIcon size={14} /> {ev.date}
                  </div>
                </div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                  {ev.event}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {ev.notes || 'Campus Auditorium & Virtual Webcast'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SUPPORT & ENGAGEMENT */}
      <section className="section" data-section-id="support" style={{ paddingTop: 'clamp(3rem, 5vw, 4.5rem)', paddingBottom: 'clamp(3rem, 5vw, 4.5rem)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <span className="section-tagline">Community Engagement</span>
            <h2 className="section-title">Support Our Academic Community</h2>
            <p className="section-description">
              Participate in campus life, support student initiatives, or engage with our faculty and parent associations.
            </p>
          </div>

          <div className="bento-grid">
            {SUPPORT_SECTION.map((item) => (
              <div
                key={item.id}
                className="bento-col-6 bento-card glass-card"
                style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: 'var(--color-accent-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: 'var(--clay-badge)'
                    }}
                  >
                    {item.id === 'volunteer' ? <HandHelping size={26} color="var(--color-accent)" /> : <Heart size={26} color="var(--color-accent)" />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.45rem', color: 'var(--color-primary)' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6, margin: 0 }}>
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleSupportAction(item)}
                  style={{ alignSelf: 'flex-start', borderRadius: 'var(--radius-full)' }}
                >
                  {item.actionLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
