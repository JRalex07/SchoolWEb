/**
 * helperRegistry.js
 * Centralized registry for section contexts, interactive element explanations,
 * and field-validation rules. Adheres strictly to verified data and clean user-facing copy.
 */

export const SECTION_CONTEXTS = {
  'hero': {
    title: 'Welcome & Exploration Portal',
    description: 'Welcome to the school portal entrance. You can explore the four core dimensions of student life or navigate to About Us and Admissions.',
    actionHint: 'Click "About Us" or "Apply" to begin your journey.'
  },
  'welcome': {
    title: 'School Introduction & Highlights',
    description: 'Learn about our institutional philosophy and core thematic pillars: Excellence, Leadership, and Global Citizenship.',
    actionHint: 'Explore our academic ethos and core educational pillars.'
  },
  'mission': {
    title: 'Six Mission Themes',
    description: 'Review our six core commitments: Academic Excellence, Compassionate Leadership, Critical Thinking, Global Citizenship, Holistic Development, and Supportive Community.',
    actionHint: 'Hover or tap any mission card to discover its focal point.'
  },
  'perspectives': {
    title: 'Community Perspectives & Inquiries',
    description: 'Explore student reflections, parent volunteering feedback, and leadership inquiry channels.',
    actionHint: 'Explore the principal and leadership informational contacts.'
  },
  'calendar-preview': {
    title: 'Academic Calendar Preview',
    description: 'Browse scheduled sessions, term dates, and active school events.',
    actionHint: 'Click "View Full Calendar" to see the full event schedule.'
  },
  'support': {
    title: 'Community Participation',
    description: 'Find opportunities for volunteering, attending open houses, and institutional support.',
    actionHint: 'Learn about parent volunteering and community partnerships.'
  },
  'about-overview': {
    title: 'About Our Mission & Heritage',
    description: 'A comprehensive view of our institutional vision, leadership hierarchy, and school history.',
    actionHint: 'Review our school leadership, vision, and heritage.'
  },
  'admissions-portal': {
    title: 'Admissions Guidelines & Inquiries',
    description: 'Information regarding enrolment, documentation requirements, and joining our academic community.',
    actionHint: 'Contact the admissions desk directly via verified phone or email.'
  },
  'academics-curriculum': {
    title: 'Academic & Campus Pillars',
    description: 'Detailed insights into Core Academics, Athletics, Extracurricular Arts, and Campus Infrastructure.',
    actionHint: 'Review our curriculum frameworks and sports programs.'
  },
  'faith-values': {
    title: 'Faith & Spiritual Development',
    description: 'Spiritual formation, compassionate fellowship, and ethical decision-making principles.',
    actionHint: 'Discover our character education and values-based curriculum.'
  },
  'calendar-schedule': {
    title: 'Full School Calendar',
    description: 'Filter events by category (Academics, Athletics, Extracurricular) or view upcoming sessions.',
    actionHint: 'Use the category filter buttons to narrow down events.'
  },
  'contact-form-section': {
    title: 'Contact & Administrative Office',
    description: 'Reach our administrative staff for questions regarding enrollment or campus operations.',
    actionHint: 'Fill out the inquiry form; I will guide you with format tips as you type!'
  }
};

/**
 * Field Validation Registry
 * Comprehensive client-side validation rules, expected formats, examples,
 * and safe contextual correction generators.
 */
export const FIELD_VALIDATION_REGISTRY = {
  fullName: {
    type: 'name',
    required: true,
    label: 'Full Name',
    format: 'Alphabetic characters and spaces (at least 2 characters)',
    example: 'Aarav Sharma',
    instructions: 'Enter the full name you want to provide for your inquiry.',
    validate: (value) => {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        return { isValid: false, message: 'Please provide your full name before continuing.', state: 'warning' };
      }
      if (trimmed.length < 2) {
        return { isValid: false, message: 'Names typically contain at least 2 characters.', state: 'warning' };
      }
      // Support Unicode letters and marks across international & Indian scripts (e.g. Devanagari)
      if (!/^[\p{L}\p{M}\s.'-]+$/u.test(trimmed)) {
        return { isValid: false, message: 'Please use letters, spaces, or hyphens for your name.', state: 'warning' };
      }
      return { isValid: true, message: 'Looks good! A clear name helps us address your inquiry personally.', state: 'success' };
    }
  },

  email: {
    type: 'email',
    required: true,
    label: 'Email Address',
    format: 'username@domain.extension (e.g. username@example.com)',
    example: 'parent@example.com',
    instructions: 'Enter an address in the format name@example.com with a username, an @ symbol, and a domain.',
    suggestCorrection: (value) => {
      if (!value) return null;
      const trimmed = value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      // Detect genuine typos in common email provider domains with clear justification
      const typoDomains = {
        'gmai.com': 'gmail.com',
        'gmial.com': 'gmail.com',
        'gmaill.com': 'gmail.com',
        'yaho.com': 'yahoo.com',
        'yahooo.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com',
        'outlok.com': 'outlook.com'
      };

      if (trimmed.includes('@')) {
        const [user, domain] = trimmed.split('@');
        if (user && domain && typoDomains[domain.toLowerCase()]) {
          const corrected = `${user}@${typoDomains[domain.toLowerCase()]}`;
          if (emailRegex.test(corrected)) {
            return corrected;
          }
        }
      }
      return null;
    },
    validate: (value) => {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        return { isValid: false, message: 'Email address is required for us to respond.', state: 'warning' };
      }
      // Check syntax: must have user, @, domain, and dot extension
      if (!trimmed.includes('@')) {
        return {
          isValid: false,
          message: "This doesn't look like a complete email address yet. Enter an address in the format name@example.com, with a username, an @ symbol, and a domain.",
          state: 'warning',
          format: 'name@example.com'
        };
      }
      const parts = trimmed.split('@');
      if (parts.length > 2 || !parts[0] || !parts[1]) {
        return {
          isValid: false,
          message: 'Please make sure there is a username before the @ and a domain name after it.',
          state: 'warning'
        };
      }
      const domain = parts[1];
      if (!domain.includes('.') || domain.endsWith('.')) {
        return {
          isValid: false,
          message: 'The domain part needs a top-level extension like .com, .edu, or .in (e.g. example.com).',
          state: 'warning'
        };
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(trimmed)) {
        return {
          isValid: false,
          message: 'Please check for invalid characters or spaces in your email address.',
          state: 'warning'
        };
      }
      return {
        isValid: true,
        message: 'Valid email format! Official responses will be routed to this address.',
        state: 'success'
      };
    }
  },

  phone: {
    type: 'phone',
    required: false,
    label: 'Phone Number',
    format: '10 to 15 digits (e.g. +91 XXXXX XXXXX)',
    example: '+91 XXXXX XXXXX',
    instructions: 'Enter a valid contact number with 10 to 15 digits, including country code if needed.',
    validate: (value) => {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        return {
          isValid: true,
          isOptionalEmpty: true,
          message: 'Phone is optional. If provided, we can follow up by telephone.',
          state: 'idle'
        };
      }
      // Reject alphabetic content instead of silently stripping letters
      if (/[a-zA-Z]/.test(trimmed)) {
        return {
          isValid: false,
          message: 'Phone numbers cannot contain letters or alphabetical characters.',
          state: 'warning'
        };
      }
      const digitsOnly = trimmed.replace(/[^0-9]/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return {
          isValid: false,
          message: 'Contact numbers usually contain 10 to 15 digits. Please include your area or country code.',
          state: 'warning'
        };
      }
      return {
        isValid: true,
        message: 'Telephone number format looks valid for voice contact.',
        state: 'success'
      };
    }
  },

  subject: {
    type: 'text',
    required: false,
    label: 'Inquiry Subject',
    format: 'Brief topic headline',
    example: 'Admission Inquiry for Grade 6',
    instructions: 'A concise subject line helps route your message to the right coordinator.',
    validate: (value) => {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        return {
          isValid: true,
          isOptionalEmpty: true,
          message: 'Optional subject line. Feel free to specify the topic.',
          state: 'idle'
        };
      }
      return { isValid: true, message: 'Clear subject topic noted.', state: 'success' };
    }
  },

  message: {
    type: 'required_text',
    required: true,
    label: 'Message',
    format: 'At least 10 characters describing your inquiry',
    example: 'I would like to inquire about admission availability and campus tour schedules.',
    instructions: 'Please describe your inquiry with sufficient detail so we can assist you.',
    validate: (value) => {
      const trimmed = (value || '').trim();
      if (!trimmed) {
        return { isValid: false, message: 'Please write your message before submitting.', state: 'warning' };
      }
      if (trimmed.length < 10) {
        return { isValid: false, message: 'Please provide a bit more detail (at least 10 characters).', state: 'warning' };
      }
      return { isValid: true, message: 'Thank you for the detailed description!', state: 'success' };
    }
  },

  eventTitle: {
    type: 'required_text',
    required: true,
    label: 'Event Title',
    format: 'Descriptive title of school event',
    example: 'Annual Science & Innovation Exhibition',
    instructions: 'Enter the official name of the school event.',
    validate: (value) => {
      const trimmed = (value || '').trim();
      if (!trimmed) return { isValid: false, message: 'Event title cannot be left blank.', state: 'warning' };
      return { isValid: true, message: 'Event title recorded.', state: 'success' };
    }
  },

  eventDate: {
    type: 'date',
    required: true,
    label: 'Event Date',
    format: 'YYYY-MM-DD',
    example: '15 November 2026',
    instructions: 'Select the scheduled date for this event.',
    validate: (value) => {
      if (!value) return { isValid: false, message: 'Please select a valid date.', state: 'warning' };
      return { isValid: true, message: 'Scheduled date confirmed.', state: 'success' };
    }
  }
};
