import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle2,
  ListOrdered,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

/**
 * StructuredMessageRenderer:
 * Renders rich, structured UI components (document checklists, steps, contact cards, event lists)
 * matching the site's Bento Grid and restrained glassmorphism aesthetic.
 */
export const StructuredMessageRenderer = ({ structuredData, shouldReduceMotion }) => {
  if (!structuredData || !structuredData.type) return null;

  const { type, title, intro, items, note } = structuredData;

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        staggerChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 4 },
    visible: { opacity: 1, y: 0 }
  };

  // 1. DOCUMENT CHECKLIST (e.g. Enrollment Requirements)
  if (type === 'document_checklist') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            <FileText size={16} color="var(--color-accent)" />
            <span>{title}</span>
          </div>
        )}

        {intro && (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
            {intro}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.2rem' }}>
          {items && items.map((doc, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              style={{
                display: 'flex',
                gap: '0.55rem',
                alignItems: 'flex-start',
                padding: '0.55rem 0.75rem',
                background: 'rgba(248, 250, 252, 0.95)',
                border: '1px solid rgba(33, 27, 82, 0.08)',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'var(--color-accent-soft)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '0.1rem'
                }}
              >
                {idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                  {doc.name}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.1rem', lineHeight: 1.35 }}>
                  {doc.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {note && (
          <div
            style={{
              marginTop: '0.35rem',
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              background: 'rgba(244, 160, 36, 0.1)',
              border: '1px solid rgba(244, 160, 36, 0.25)',
              fontSize: '0.72rem',
              color: '#92400e',
              lineHeight: 1.35,
              display: 'flex',
              gap: '0.4rem',
              alignItems: 'flex-start'
            }}
          >
            <AlertCircle size={13} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <span>{note}</span>
          </div>
        )}
      </motion.div>
    );
  }

  // 2. STEP-BY-STEP INSTRUCTIONS (e.g. 4-step Admissions procedure)
  if (type === 'steps') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            <ListOrdered size={16} color="var(--color-accent)" />
            <span>{title}</span>
          </div>
        )}

        {intro && (
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
            {intro}
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.2rem' }}>
          {items && items.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              style={{
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'flex-start',
                padding: '0.55rem 0.75rem',
                background: 'rgba(248, 250, 252, 0.95)',
                border: '1px solid rgba(33, 27, 82, 0.08)',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
              }}
            >
              <span
                style={{
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                  marginTop: '0.1rem'
                }}
              >
                Step {step.stepNumber || idx + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
                  {step.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.1rem', lineHeight: 1.35 }}>
                  {step.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {note && (
          <div style={{ marginTop: '0.2rem', fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
            Note: {note}
          </div>
        )}
      </motion.div>
    );
  }

  // 3. CONTACT INFORMATION CARD
  if (type === 'contact_card') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            <Phone size={16} color="var(--color-accent)" />
            <span>{title}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {items && items.map((c, idx) => {
            const IconComponent = c.icon === 'Phone' ? Phone : c.icon === 'Mail' ? Mail : c.icon === 'Clock' ? Clock : MapPin;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                style={{
                  display: 'flex',
                  gap: '0.55rem',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  background: 'rgba(248, 250, 252, 0.95)',
                  border: '1px solid rgba(33, 27, 82, 0.08)',
                  borderRadius: '10px'
                }}
              >
                <div style={{ color: 'var(--color-accent)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <IconComponent size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0, fontSize: '0.78rem' }}>
                  <span style={{ fontWeight: 600, color: '#64748b', marginRight: '0.35rem' }}>{c.label}:</span>
                  {c.link ? (
                    <a
                      href={c.link}
                      style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'underline', wordBreak: 'break-word' }}
                    >
                      {c.value}
                    </a>
                  ) : (
                    <span style={{ color: '#1e293b', fontWeight: 500, wordBreak: 'break-word' }}>{c.value}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {note && (
          <div style={{ marginTop: '0.2rem', fontSize: '0.72rem', color: '#64748b' }}>
            {note}
          </div>
        )}
      </motion.div>
    );
  }

  // 4. ACADEMIC CALENDAR & FESTIVAL EVENTS
  if (type === 'events') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ marginTop: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
            <Calendar size={16} color="var(--color-accent)" />
            <span>{title}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {items && items.map((evt, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              style={{
                display: 'flex',
                gap: '0.55rem',
                alignItems: 'flex-start',
                padding: '0.5rem 0.75rem',
                background: 'rgba(248, 250, 252, 0.95)',
                border: '1px solid rgba(33, 27, 82, 0.08)',
                borderRadius: '10px'
              }}
            >
              <div
                style={{
                  background: 'var(--color-accent-soft)',
                  border: '1px solid rgba(244, 160, 36, 0.3)',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#92400e',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {evt.date}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>
                  {evt.title}
                </div>
                {evt.detail && (
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem' }}>
                    {evt.detail}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {note && (
          <div style={{ marginTop: '0.2rem', fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
            {note}
          </div>
        )}
      </motion.div>
    );
  }

  return null;
};

