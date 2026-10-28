/**
 * navigationRegistry.js
 * Single authoritative route registry and navigation intent resolution engine.
 * Validates all destinations against real public application routes.
 * Strictly excludes 404/not-found and arbitrary unknown paths.
 */

export const VALID_ROUTES = [
  {
    id: 'home',
    name: 'Home',
    path: '/',
    aliases: ['home', 'homepage', 'main', 'landing', 'start', 'index', 'frontpage'],
    actionLabel: 'Open Homepage →',
    description: 'Main school overview and announcements'
  },
  {
    id: 'about',
    name: 'About',
    path: '/about',
    aliases: ['about', 'about us', 'mission', 'vision', 'heritage', 'leadership', 'principal', 'overview', 'history', 'story'],
    actionLabel: 'Open About Page →',
    description: 'School mission, leadership profiles, and heritage'
  },
  {
    id: 'admissions',
    name: 'Admissions',
    path: '/admissions',
    aliases: ['admissions', 'admission', 'apply', 'enroll', 'enrollment', 'register', 'application', 'join', 'registration', 'requirements', 'process'],
    actionLabel: 'Open Admissions Page →',
    description: 'Admissions criteria, document requirements, and application steps'
  },
  {
    id: 'academics',
    name: 'Academics',
    path: '/academics',
    aliases: ['academics', 'academic', 'curriculum', 'syllabus', 'subjects', 'courses', 'programs', 'sports', 'athletics', 'clubs', 'extracurricular'],
    actionLabel: 'Open Academics Page →',
    description: 'Academic curriculum, STEM foundations, athletics, and clubs'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    path: '/calendar',
    aliases: ['calendar', 'events', 'event', 'holidays', 'holiday', 'festivals', 'dates', 'schedule', 'milestones', 'diwali', 'vacation'],
    actionLabel: 'Open Calendar Page →',
    description: 'Current 2026 academic events and national festival dates'
  },
  {
    id: 'contact',
    name: 'Contact',
    path: '/contact',
    aliases: ['contact', 'contact us', 'phone', 'telephone', 'email', 'office', 'inquiry', 'reach', 'address', 'location', 'map', 'directions'],
    actionLabel: 'Open Contact Page →',
    description: 'Campus address, verified telephone, email, and inquiry form'
  },
  {
    id: 'faith',
    name: 'Faith & Values',
    path: '/faith',
    aliases: ['faith', 'values', 'moral', 'character', 'spiritual', 'ethics', 'chapel'],
    actionLabel: 'Open Faith & Values Page →',
    description: 'Character formation, community service, and compassionate leadership'
  }
];

/**
 * Check if a path is a valid registered destination.
 * Strictly excludes 404/not-found or unknown paths.
 */
export const isValidRoute = (path) => {
  if (!path || path === '*' || path.includes('404') || path.includes('not-found')) return false;
  return VALID_ROUTES.some(r => r.path === path);
};

/**
 * Resolve a route object by path or id.
 */
export const getRouteByPath = (path) => {
  if (!isValidRoute(path)) return null;
  return VALID_ROUTES.find(r => r.path === path) || null;
};

/**
 * Identify if a query is an explicit navigation request (e.g. "take me to...", "open page...", "let's go to...")
 */
export const isExplicitNavigationCommand = (query = '') => {
  const q = query.toLowerCase().trim();
  const navTriggers = [
    'take me to',
    'open',
    'go to',
    'navigate to',
    'move to',
    'let\'s go to',
    'lets go to',
    'bring me to',
    'switch to',
    'head to',
    'visit',
    'show me the page',
    'open page',
    'view page',
    'can you take me to',
    'can you open',
    'i want to go to',
    'i want to visit',
    'take me there',
    'can you take me there',
    'go there'
  ];
  return navTriggers.some(trigger => q.startsWith(trigger) || q.includes(trigger));
};

/**
 * Matches a query against registered routes.
 * Returns the matching route object, or null.
 */
export const matchTargetRoute = (query = '') => {
  const q = query.toLowerCase().trim();

  // Check 404 explicit trap
  if (q.includes('404') || q.includes('not found') || q.includes('not-found')) {
    return { isInvalid404: true };
  }

  // Exact phrase check on route names
  if (q.includes('contact') || q.includes('inquiry form') || q.includes('reach office')) {
    return VALID_ROUTES.find(r => r.id === 'contact');
  }
  if (q.includes('admission') || q.includes('enroll') || q.includes('application form')) {
    return VALID_ROUTES.find(r => r.id === 'admissions');
  }
  if (q.includes('academic') || q.includes('curriculum') || q.includes('syllabus')) {
    return VALID_ROUTES.find(r => r.id === 'academics');
  }
  if (q.includes('calendar') || q.includes('event') || q.includes('holiday') || q.includes('milestone')) {
    return VALID_ROUTES.find(r => r.id === 'calendar');
  }
  if (q.includes('about') || q.includes('leadership') || q.includes('principal profile') || q.includes('mission')) {
    return VALID_ROUTES.find(r => r.id === 'about');
  }
  if (q.includes('faith') || q.includes('values') || q.includes('spiritual')) {
    return VALID_ROUTES.find(r => r.id === 'faith');
  }
  if (q.includes('home') || q.includes('homepage') || q.includes('landing')) {
    return VALID_ROUTES.find(r => r.id === 'home');
  }

  return null;
};

