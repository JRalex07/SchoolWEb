import React, { useState, useRef } from 'react';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { useMascot } from '../context/MascotContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  Info, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export const ContactPage = () => {
  const { config, openActionModal } = useSchoolConfig();
  const { setFieldFocus, handleFieldChange, clearFieldFocus } = useMascot();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const debounceTimers = useRef({});

  // Field change with debounced mascot validation coach
  const onInputChange = (fieldName, value, e = null) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));

    const rect = e?.target ? e.target.getBoundingClientRect() : null;

    // Clear inline error if field was marked invalid
    if (errors[fieldName]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }

    if (debounceTimers.current[fieldName]) {
      clearTimeout(debounceTimers.current[fieldName]);
    }

    debounceTimers.current[fieldName] = setTimeout(() => {
      // Validate with Mascot Form Coach
      handleFieldChange(fieldName, value, (suggestedVal) => {
        setFormData(prev => ({ ...prev, [fieldName]: suggestedVal }));
      }, rect);
    }, 240);
  };

  const validate = () => {
    const newErrors = {};

    // 1. Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please provide your full name before continuing.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Names typically contain at least 2 characters.';
    }

    // 2. Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required for official communication.';
    } else if (!formData.email.includes('@')) {
      newErrors.email = "This doesn't look like a complete email address yet. Enter an address in the format name@example.com, with a username, an @ symbol, and a domain.";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = 'Enter an address in the format name@example.com, with a username, an @ symbol, and a valid domain.';
    }

    // 3. Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Please write your message before submitting.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide a bit more detail (at least 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // Focus first invalid input
      const firstErrorField = Object.keys(errors)[0] || 'fullName';
      const el = document.getElementById(firstErrorField);
      if (el) el.focus();
      return;
    }

    openActionModal(
      "Inquiry Form Transmission Notice",
      `Thank you for testing the contact inquiry interface, ${formData.fullName}. In this prototype implementation, live SMTP mail delivery and backend database persistence are intentionally unconnected. In a production deployment, this transmits directly to ${config.email}.`,
      "info"
    );

    // Reset form after notification
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setErrors({});
  };

  return (
    <main id="main-content">
      {/* Header */}
      <section style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '4rem 0 3.5rem 0' }}>
        <div className="container">
          <span className="badge" style={{ background: 'rgba(201, 138, 44, 0.25)', color: 'var(--color-accent-light)', border: '1px solid rgba(201,138,44,0.4)', marginBottom: '1rem' }}>
            Get in Touch
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.75rem', marginBottom: '1rem' }}>
            Contact & Location Details
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Reach out to our administrative offices, schedule campus visits, or submit general academic inquiries.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section" data-section-id="contact-form-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            {/* Configured Contact Info Cards */}
            <div>
              <h2 style={{ fontSize: '1.85rem', marginBottom: '1.25rem' }}>
                Campus Office
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: '2rem' }}>
                Our administrative staff is on hand to address admissions inquiries, academic records, and general questions regarding {config.schoolName}.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div 
                  className="card" 
                  data-helper-title="Postal Location"
                  data-helper-description="Verified postal address for administrative correspondence and campus visits."
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '1.25rem' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={22} color="var(--color-accent)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: 0, marginBottom: '0.25rem' }}>Postal Address</h4>
                    <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                      {config.address}
                    </p>
                  </div>
                </div>

                <div 
                  className="card"
                  data-helper-title="Direct Phone Line"
                  data-helper-description="Call our administrative office during standard operational hours."
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '1.25rem' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={22} color="var(--color-accent)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: 0, marginBottom: '0.25rem' }}>Telephone</h4>
                    <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {config.phone}
                    </a>
                  </div>
                </div>

                <div 
                  className="card" 
                  data-helper-title="Official Email"
                  data-helper-description="Send electronic communications and document verification requests."
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '1.25rem' }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--color-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={22} color="var(--color-accent)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', margin: 0, marginBottom: '0.25rem' }}>Email Inquiries</h4>
                    <a href={`mailto:${config.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                      {config.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Office Hours Info Box */}
              <div className="card" style={{ background: '#f8fafc', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Clock size={18} color="var(--color-accent)" />
                  <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Standard Administrative Hours</h4>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Monday – Friday: 8:00 AM – 3:30 PM<br />
                  Saturday: 8:00 AM – 1:00 PM (Administrative office only)<br />
                  Sunday & Gazetted Holidays: Closed
                </p>
              </div>
            </div>

            {/* Interactive Contact Form with Mascot Validation Coach */}
            <div>
              <div className="card" style={{ padding: '2.5rem', borderTop: '5px solid var(--color-accent)' }}>
                <h3 style={{ fontSize: '1.45rem', marginBottom: '0.75rem' }}>
                  Send an Inquiry
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Complete the fields below to simulate or send a general administrative inquiry.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label className="form-label" htmlFor="fullName">Full Name *</label>
                    <input
                      id="fullName"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Eleanor Vance"
                      value={formData.fullName}
                      onChange={(e) => onInputChange('fullName', e.target.value, e)}
                      onFocus={(e) => setFieldFocus('fullName', e.target.getBoundingClientRect())}
                      onBlur={() => clearFieldFocus('fullName')}
                      aria-invalid={errors.fullName ? "true" : "false"}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      required
                    />
                    {errors.fullName && (
                      <span id="fullName-error" role="alert" style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder="e.g. eleanor@example.com"
                      value={formData.email}
                      onChange={(e) => onInputChange('email', e.target.value, e)}
                      onFocus={(e) => setFieldFocus('email', e.target.getBoundingClientRect())}
                      onBlur={() => clearFieldFocus('email')}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      required
                    />
                    {errors.email && (
                      <span id="email-error" role="alert" style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number (Optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      className="form-control"
                      placeholder="+91 ..."
                      value={formData.phone}
                      onChange={(e) => onInputChange('phone', e.target.value, e)}
                      onFocus={(e) => setFieldFocus('phone', e.target.getBoundingClientRect())}
                      onBlur={() => clearFieldFocus('phone')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Admission Availability for Grade 6"
                      value={formData.subject}
                      onChange={(e) => onInputChange('subject', e.target.value, e)}
                      onFocus={(e) => setFieldFocus('subject', e.target.getBoundingClientRect())}
                      onBlur={() => clearFieldFocus('subject')}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      className="form-control"
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => onInputChange('message', e.target.value, e)}
                      onFocus={(e) => setFieldFocus('message', e.target.getBoundingClientRect())}
                      onBlur={() => clearFieldFocus('message')}
                      aria-invalid={errors.message ? "true" : "false"}
                      aria-describedby={errors.message ? "message-error" : undefined}
                      required
                    />
                    {errors.message && (
                      <span id="message-error" role="alert" style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    data-helper-title="Submit Contact Inquiry"
                    data-helper-description="Validates form entries and simulates message routing to the administrative desk."
                  >
                    <Send size={16} /> Submit Message
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                    ℹ️ Form submission triggers verified validation and prototype feedback.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
