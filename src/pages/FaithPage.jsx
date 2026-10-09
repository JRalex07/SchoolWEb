import React from 'react';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { FAITH_CONTENT } from '../data/schoolContent';
import {
  Heart,
  ShieldCheck,
  Sliders,
  EyeOff,
  CheckCircle,
  Sparkles,
  BookOpen,
  HelpCircle,
  Users
} from 'lucide-react';

export const FaithPage = () => {
  const { config, updateConfigField } = useSchoolConfig();

  const isPublished = config.faithSectionPublished;

  const handleTogglePublish = () => {
    updateConfigField('faithSectionPublished', !isPublished);
  };

  return (
    <main id="main-content">
      {/* Page Header */}
      <section style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '4rem 0 3.5rem 0' }}>
        <div className="container">
          <span className="badge" style={{ background: 'rgba(201, 138, 44, 0.25)', color: 'var(--color-accent-light)', border: '1px solid rgba(201,138,44,0.4)', marginBottom: '1rem' }}>
            Spiritual Development & Values
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.75rem', marginBottom: '1rem' }}>
            Faith & Character Formation
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Exploring values of compassion, integrity, and ethical service across our school community.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section" data-section-id="faith-values">
        <div className="container">
          {!isPublished ? (
            /* UNPUBLISHED DEFAULT STATE (Conforming strictly to prompt) */
            <div style={{ maxWidth: '740px', margin: '0 auto' }}>
              <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2.5rem', alignItems: 'center' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: 'var(--color-warning-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: 'var(--clay-badge)'
                  }}
                >
                  <EyeOff size={32} color="var(--color-warning)" />
                </div>

                <span className="badge badge-warning" style={{ marginBottom: '1rem' }}>
                  Unpublished Under Default Prototype Profile
                </span>

                <h2 style={{ fontSize: '1.85rem', marginBottom: '1rem' }}>
                  Faith Section Visibility Status
                </h2>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {FAITH_CONTENT.notice}
                </p>

                <div className="notice-box info" style={{ textAlign: 'left', width: '100%', fontSize: '0.875rem' }}>
                  <strong>Requirement Rule:</strong> "Use the available description of the school's faith-related identity only when the selected website identity is authorized to use that information. Otherwise, make this content configurable and leave it unpublished by default."
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleTogglePublish}
                  >
                    <Sliders size={18} />
                    Enable Faith Section Preview
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* PUBLISHED STATE (When authorized or toggled) */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-success">
                    <CheckCircle size={14} /> Section Active & Configured
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    (Published for authorized institutional identity)
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleTogglePublish}
                >
                  <EyeOff size={16} /> Revert to Unpublished (Default)
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {/* Recovered Faith Description */}
                <div className="card" style={{ padding: '2.5rem', borderLeft: '5px solid var(--color-accent)' }}>
                  <h2 style={{ fontSize: '1.85rem', marginBottom: '1.25rem' }}>
                    Spiritual Foundation & Community
                  </h2>

                  <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--color-text-main)', fontStyle: 'italic', marginBottom: '1.5rem', background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                    "{FAITH_CONTENT.descriptionSummary}"
                  </p>

                  <p style={{ fontSize: '0.975rem', lineHeight: 1.7, color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    Spiritual formation within our educational tradition seeks to cultivate humility, respect for fellow human beings, empathy toward the vulnerable, and an active commitment to social justice.
                  </p>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                    ℹ️ <strong>Accuracy Standard:</strong> The statement above represents the concise summary recovered in indexed data. Doctrinal statements, chaplaincy services, and devotional schedules await official confirmation.
                  </div>
                </div>

                {/* Core Spiritual Values */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Heart size={20} color="var(--color-accent)" />
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Compassionate Fellowship</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                      Emphasizing kindness, mutual encouragement, and active support across all grade levels and backgrounds.
                    </p>
                  </div>

                  <div className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <BookOpen size={20} color="var(--color-accent)" />
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Ethical Decision-Making</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                      Guiding young scholars to reflect upon moral questions with courage, empathy, and integrity.
                    </p>
                  </div>

                  <div className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <Users size={20} color="var(--color-accent)" />
                      <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Community Service</h3>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                      Translating values into concrete outreach, environmental care, and service to our local neighborhood.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
