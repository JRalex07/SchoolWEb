/**
 * mascotMovementPaths.js
 * Centralized configuration of predefined, section-aware movement stops.
 * These are logical position identifiers, not hardcoded screen coordinates.
 */

export const MOVEMENT_STOPS = {
  'hero-stop': {
    id: 'hero-stop',
    label: 'Hero Entrance Portal',
    sectionId: 'hero',
    side: 'right', // Stands clear of main heading and call-to-action buttons
    verticalRatio: 0.22,
    minTop: 110,
    description: 'Beside portal introduction, clear of primary admissions CTAs'
  },
  'introduction-stop': {
    id: 'introduction-stop',
    label: 'Introduction & Philosophy',
    sectionId: 'welcome',
    side: 'left', // Beside institutional philosophy and highlight cards
    verticalRatio: 0.32,
    minTop: 120,
    description: 'Left margin beside welcome philosophy and core pillars'
  },
  'academics-stop': {
    id: 'academics-stop',
    label: 'Academic Curriculum Hub',
    sectionId: 'academics-curriculum',
    side: 'right', // Flank beside curriculum pillars
    verticalRatio: 0.30,
    minTop: 120,
    description: 'Right flank beside curriculum pillars and department features'
  },
  'mission-stop': {
    id: 'mission-stop',
    label: 'Six Mission Pillars',
    sectionId: 'mission',
    side: 'right', // Beside the mission cards grid
    verticalRatio: 0.35,
    minTop: 120,
    description: 'Right margin beside the six institutional mission commitments'
  },
  'perspectives-stop': {
    id: 'perspectives-stop',
    label: 'Community Perspectives',
    sectionId: 'perspectives',
    side: 'left', // Beside leadership inquiry prompts
    verticalRatio: 0.36,
    minTop: 120,
    description: 'Left margin beside student and leadership inquiry prompt cards'
  },
  'calendar-stop': {
    id: 'calendar-stop',
    label: 'School Calendar Schedule',
    sectionId: 'calendar-preview',
    side: 'right', // Beside calendar schedule cards
    verticalRatio: 0.32,
    minTop: 120,
    description: 'Right margin beside scheduled academic dates'
  },
  'contact-stop': {
    id: 'contact-stop',
    label: 'Campus Inquiry & Form',
    sectionId: 'contact-form-section',
    side: 'right', // Beside the contact form container, clear of inputs and submit button
    verticalRatio: 0.30,
    minTop: 110,
    description: 'Right flank beside inquiry form without obstructing any inputs'
  },
  'footer-stop': {
    id: 'footer-stop',
    label: 'Footer Information Safe Zone',
    sectionId: 'footer',
    side: 'right', // Parked gracefully above footer links and copyright
    verticalRatio: 0.72,
    minTop: 130,
    description: 'Safe lower-right margin above footer links and legal text'
  },
  'safe-fallback-stop': {
    id: 'safe-fallback-stop',
    label: 'Safe Fallback Station',
    sectionId: null,
    side: 'right',
    verticalRatio: 0.65,
    minTop: 120,
    description: 'Default non-intrusive rest position when no section matches'
  }
};

/**
 * Mapping from section ID or route to the appropriate predefined movement stop ID
 */
export const SECTION_TO_STOP_MAP = {
  'hero': 'hero-stop',
  'welcome': 'introduction-stop',
  'mission': 'mission-stop',
  'perspectives': 'perspectives-stop',
  'calendar-preview': 'calendar-stop',
  'calendar-schedule': 'calendar-stop',
  'support': 'introduction-stop',
  'academics-curriculum': 'academics-stop',
  'about-overview': 'introduction-stop',
  'admissions-portal': 'hero-stop',
  'faith-values': 'mission-stop',
  'contact-form-section': 'contact-stop',
  'footer': 'footer-stop'
};

/**
 * Get the stop configuration for a given section ID
 */
export const getStopForSection = (sectionId) => {
  if (!sectionId) return MOVEMENT_STOPS['hero-stop'];
  const stopId = SECTION_TO_STOP_MAP[sectionId] || 'safe-fallback-stop';
  return MOVEMENT_STOPS[stopId] || MOVEMENT_STOPS['safe-fallback-stop'];
};
