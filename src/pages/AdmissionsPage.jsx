import React from 'react';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import {
  FileText,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Send
} from 'lucide-react';

export const AdmissionsPage = () => {
  const { config, openActionModal } = useSchoolConfig();

  const handleApplyClick = (e) => {
    e.preventDefault();
    openActionModal(
      "Admissions Application Notice",
      "Online application processing, admission fee collection, and digital document uploads are not configured in this prototype. To apply or obtain prospectus packets, please contact the admissions desk directly at " + config.email + " or call " + config.phone + ".",
      "info"
    );
  };

  return (
    <main id="main-content">
      {/* Header */}
      <section style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '4rem 0 3.5rem 0' }}>
        <div className="container">
          <span className="badge" style={{ background: 'rgba(201, 138, 44, 0.25)', color: 'var(--color-accent-light)', border: '1px solid rgba(201,138,44,0.4)', marginBottom: '1rem' }}>
            Enrollment & Joining
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.75rem', marginBottom: '1rem' }}>
            Admissions Information ({config.academicYear})
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Guiding families through transparent admissions procedures, academic readiness, and entry inquiries.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" data-section-id="admissions-portal">
        <div className="container">
          {/* Demonstration Notice Box */}
          <div className="notice-box info" style={{ background: 'linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <ShieldCheck size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#2563eb' }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem', color: '#1e40af' }}>
                  Demonstration Admissions Desk ({config.academicYear})
                </strong>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e3a8a', lineHeight: 1.6 }}>
                  Welcome to the demo admissions portal. The enrollment guidelines, grade criteria, and documentation checklists below illustrate standard campus application workflows. In custom school deployments, all criteria and fee structures can be configured via the administrative panel.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginTop: '2.5rem' }}>
            {/* Admissions Criteria & Guidelines */}
            <div>
              <h2 style={{ fontSize: '1.85rem', marginBottom: '1.25rem' }}>
                Application Process & Guidelines
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
                Admission to {config.schoolName} is conducted based on merit, availability of seats, and student alignment with our core values of discipline, scholarly inquiry, and mutual respect.
              </p>

              {/* Requirement Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                    1. Eligibility & Age Criteria
                  </h4>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                    Grade placement follows standard age-readiness guidelines. Pre-K entrants must reach 3+ years by the start of the academic term; Grade 1 entrants must be 5+ years. Senior grade placements include diagnostic evaluations for curricular alignment.
                  </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                    2. Tuition & Fee Framework
                  </h4>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                    Demonstration Fee Schedule: Annual tuition covers core academic instruction, library and digital laboratory privileges, and extracurricular athletics. Detailed term schedules and transport options are provided upon direct inquiry.
                  </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>
                    3. Required Documentation
                  </h4>
                  <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
                    Required documentation includes: Official birth certificate, previous school transfer certificate (TC), verified academic report cards from recent terms, recent passport photographs, and proof of residential address.
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiries & Direct Action */}
            <div>
              <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-accent)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
                  Admissions Inquiry Desk
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Interested in enrolling your child? Get in touch with our admissions coordinators to schedule a campus walk-through or request an application package.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone size={18} color="var(--color-accent)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Phone Inquiries</div>
                      <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {config.phone}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={18} color="var(--color-accent)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Email Inquiries</div>
                      <a href={`mailto:${config.email}`} style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {config.email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={18} color="var(--color-accent)" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Academic Term</div>
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                        {config.academicYear}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={handleApplyClick}
                  data-helper-title="Digital Application (Demo Simulation)"
                  data-helper-description="Displays demo admissions application guidance dialogue."
                >
                  <Send size={16} /> Submit Application Request (Demo Simulation)
                </button>

                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  ℹ️ Demo Prototype Notice: Admissions inquiries are simulated client-side. Contact {config.email} for official application packages.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
