/**
 * barnabyChatEngine.js
 * Advanced context-aware conversational engine for Barnaby the Campus Assistant.
 * Features:
 * - Structured Response Payloads (document_checklist, steps, contact_card, events, faq)
 * - Global Navigation Intelligence (distinguishes pure navigation, information, combined, contextual)
 * - Natural phrasing recognition & typo tolerance (Levenshtein distance)
 * - Safe internal route validation (strictly excludes 404/not-found)
 * - Truthful grounded information without hallucinating unverified fees or policies
 */

import { VALID_ROUTES, isValidRoute, isExplicitNavigationCommand, matchTargetRoute } from './navigationRegistry.js';

// Normalized distance calculation (Levenshtein)
export const levenshteinDistance = (a = '', b = '') => {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix = Array.from({ length: al + 1 }, () => new Array(bl + 1).fill(0));

  for (let i = 0; i <= al; i++) matrix[i][0] = i;
  for (let j = 0; j <= bl; j++) matrix[0][j] = j;

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[al][bl];
};

// Common spelling corrections dictionary
const COMMON_TYPOS = {
  'admisison': 'admission',
  'admision': 'admission',
  'admisson': 'admission',
  'tuiton': 'tuition',
  'tution': 'tuition',
  'feee': 'fee',
  'feees': 'fees',
  'schedul': 'schedule',
  'principall': 'principal',
  'principle': 'principal',
  'curriculam': 'curriculum',
  'curriclum': 'curriculum',
  'academcs': 'academics',
  'extracuricular': 'extracurricular',
  'athleitcs': 'athletics',
  'calender': 'calendar',
  'hoilday': 'holiday',
  'hoildays': 'holidays',
  'festval': 'festival',
  'adress': 'address',
  'conatct': 'contact',
  'telehpone': 'telephone',
  'facilty': 'facility',
  'facilties': 'facilities',
  'libary': 'library',
  'transprot': 'transport',
  'unform': 'uniform',
  'unifrom': 'uniform',
  'diwli': 'diwali',
  'dewali': 'diwali',
  'chhat': 'chhath',
  'chath': 'chhath',
  'pooja': 'puja'
};

// Tokenize and clean text
export const tokenizeText = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map(w => COMMON_TYPOS[w] || w)
    .filter(Boolean);
};

// Check if a word closely matches a keyword (exact or within distance threshold)
export const wordMatchesKeyword = (word, keyword) => {
  if (word === keyword) return true;
  if (keyword.length >= 5) {
    if (word.startsWith(keyword) && Math.abs(word.length - keyword.length) <= 3) return true;
    const dist = levenshteinDistance(word, keyword);
    if (dist <= 1 && word.length >= 4) return true;
    if (dist <= 2 && word.length >= 7) return true;
  }
  return false;
};

// Suggested question generator based on current route and conversation context
export const getContextualSuggestedQuestions = (pathname, lastTopic = null) => {
  if (lastTopic === 'admissions') {
    return [
      "What documents are required?",
      "Are tuition fee details available?",
      "Can I see the Admissions page?",
      "What are the school hours?"
    ];
  }
  if (lastTopic === 'academics') {
    return [
      "What sports and athletics are offered?",
      "Tell me about STEM & arts programs",
      "Who are the school leaders?",
      "Open the Academics page"
    ];
  }
  if (lastTopic === 'calendar') {
    return [
      "When is Chhath Puja in 2026?",
      "When is Diwali in 2026?",
      "What are the national holidays?",
      "Show me the Calendar page"
    ];
  }
  if (lastTopic === 'contact') {
    return [
      "Where is the campus located?",
      "What is the official phone number?",
      "Take me to the Contact form",
      "Who is the Principal?"
    ];
  }

  switch (pathname) {
    case '/admissions':
      return [
        "How do I apply for admission?",
        "What documents are required?",
        "Are fee details available?",
        "Where is the campus located?"
      ];
    case '/academics':
      return [
        "What academic programs are offered?",
        "Tell me about athletic activities",
        "What extracurricular clubs exist?",
        "What are the school timings?"
      ];
    case '/calendar':
      return [
        "When is Chhath Puja in 2026?",
        "When is Diwali and Independence Day?",
        "What holidays are scheduled this year?",
        "When is the next school event?"
      ];
    case '/about':
      return [
        "Who is the Principal?",
        "Tell me about the school's mission",
        "Who designed this website?",
        "How do I customize school details?"
      ];
    case '/contact':
      return [
        "What is the school email and phone?",
        "What is the postal address?",
        "How does the inquiry form work?",
        "What are the office hours?"
      ];
    case '/faith':
      return [
        "What values are taught here?",
        "Tell me about community outreach",
        "Is the faith section published?",
        "How do I get back home?"
      ];
    default:
      return [
        "How do I apply for admissions?",
        "What are the academic pillars?",
        "Show me upcoming calendar events",
        "Who is the Principal?",
        "How do I configure this school's branding?"
      ];
  }
};

/**
 * Main conversational intent processor
 * Accepts:
 * - query: user's input string
 * - currentPath: active window/router location
 * - config: active school configuration object
 * - history: recent messages array [{ sender: 'user'|'barnaby', text, action, topic, structuredData }]
 */
export const processUserMessage = (query = '', currentPath = '/', config = {}, history = []) => {
  const rawQuery = (query || '').trim();
  const q = rawQuery.toLowerCase();
  const words = tokenizeText(rawQuery);
  const wordSet = new Set(words);

  const schoolName = config.schoolName || 'our school';
  const principalName = config.principalName || 'Dr. Alistair Vance';
  const vicePrincipalName = config.vicePrincipalName || 'Prof. Kenneth Morales';
  const address = config.address || 'Address available upon request';
  const phone = config.phone || 'Phone number available upon request';
  const email = config.email || 'Email available upon request';
  const academicYear = config.academicYear || '2026–2027';

  // Helper matchers
  const hasWord = (...keywords) => {
    return keywords.some(keyword => {
      if (wordSet.has(keyword)) return true;
      return words.some(w => wordMatchesKeyword(w, keyword));
    });
  };

  const hasPhrase = (...phrases) => {
    return phrases.some(p => q.includes(p));
  };

  // Inspect recent conversation history for context & anaphora resolution
  const recentBarnabyMessages = history.filter(m => m.sender === 'barnaby');
  const lastBarnabyMsg = recentBarnabyMessages.length > 0 ? recentBarnabyMessages[recentBarnabyMessages.length - 1] : null;
  const lastAction = lastBarnabyMsg?.action || null;
  const lastTopic = lastBarnabyMsg?.topic || null;

  // =========================================================================
  // 1. GLOBAL NAVIGATION INTELLIGENCE FIX
  // =========================================================================

  // A. Check for 404 / Invalid Route Traps (Example E - Never recommend 404)
  if (q.includes('404') || q.includes('not found') || q.includes('not-found')) {
    return {
      text: "The 404 page is an error page for missing URLs, so I don't recommend navigating there! I can help you open any valid school page instead. Which page would you like to visit: Admissions, Academics, Calendar, About, or Contact?",
      action: null, // Strictly no action button pointing to 404
      topic: 'clarification',
      expression: 'confused',
      suggestedFollowUps: [
        "Open Admissions",
        "Open Academics",
        "Open Calendar",
        "Open Contact"
      ]
    };
  }

  // B. Contextual Follow-up Navigation ("open it", "show me that", "take me there", "can I see that page?")
  const isContextualNavRequest = hasPhrase(
    'open it', 'show it', 'show me that', 'take me there', 'go there',
    'view that', 'open that', 'see that page', 'show that page',
    'take me to the page', 'can you take me there', 'open the page'
  ) || ((q === 'open' || q === 'go' || q === 'visit' || q === 'take me' || q === 'show me') && lastAction);

  if (isContextualNavRequest) {
    if (lastAction && isValidRoute(lastAction.path)) {
      return {
        text: `Here is the link to open the ${lastAction.label.replace('→', '').replace('Open', '').replace('Page', '').trim()} Page we were discussing. Click below whenever you're ready:`,
        action: lastAction,
        topic: lastTopic || 'navigation',
        expression: 'success',
        suggestedFollowUps: ["What else can I explore?", "Tell me about admissions", "Where is the campus?"]
      };
    }
    // Ambiguous follow-up without unambiguous context -> request clarification
    return {
      text: "Which page would you like to visit? You can choose from Admissions, Academics, Calendar, About, or Contact:",
      action: {
        label: "Open Admissions Page →",
        path: "/admissions"
      },
      topic: 'clarification',
      expression: 'curious',
      suggestedFollowUps: [
        "Open Admissions",
        "Open Academics",
        "Open Calendar",
        "Open Contact"
      ]
    };
  }

  // C. Explicit Direct Page Navigation Requests (e.g. "Take me to the Contact page", "Let's go to Admissions")
  // Must distinguish pure navigation from pure informational requests!
  const isExplicitNav = isExplicitNavigationCommand(q);
  const targetRouteMatch = matchTargetRoute(q);

  // If user says "take me to [page]" or "open [page]" without asking for information:
  if (isExplicitNav && targetRouteMatch && !targetRouteMatch.isInvalid404) {
    // Check if it's a combined request (e.g., "Tell me about admissions and then take me to that page")
    const isCombined = hasPhrase('tell me about', 'what is', 'information on', 'explain', 'and take me', 'and open', 'and show me');

    if (!isCombined) {
      // PURE NAVIGATION: Short confirmation + explicit button (DO NOT dump long info text)
      return {
        text: `Sure! You can open the ${targetRouteMatch.name} page here:`,
        action: {
          label: targetRouteMatch.actionLabel,
          path: targetRouteMatch.path
        },
        topic: targetRouteMatch.id,
        expression: 'success',
        suggestedFollowUps: [
          `What is on ${targetRouteMatch.name}?`,
          "School hours and timings",
          "Contact the school office"
        ]
      };
    }
  }

  // =========================================================================
  // 2. CONTEXTUAL FOLLOW-UPS ("Tell me more", "Explain more")
  // =========================================================================
  if (hasPhrase('tell me more', 'more info', 'more details', 'explain more', 'elaborate') || q === 'more') {
    if (lastTopic === 'admissions' || currentPath === '/admissions') {
      return {
        text: `Admissions requires submitting a birth certificate, previous school records, and completed application form. Evaluation takes 3 to 5 business days. Would you like to review the step-by-step procedure?`,
        action: { label: "Open Admissions Page →", path: "/admissions" },
        topic: 'admissions',
        expression: 'explaining'
      };
    }
    if (lastTopic === 'academics' || currentPath === '/academics') {
      return {
        text: `Our academic framework integrates STEM, humanities, athletics, and fine arts, with continuous assessments and supportive faculty mentorship.`,
        action: { label: "Explore Academics Page →", path: "/academics" },
        topic: 'academics',
        expression: 'explaining'
      };
    }
    if (lastTopic === 'calendar' || currentPath === '/calendar') {
      return {
        text: `The academic calendar includes term examinations, national holidays (Republic Day, Independence Day, Gandhi Jayanti, Diwali), and sports events.`,
        action: { label: "View School Calendar →", path: "/calendar" },
        topic: 'calendar',
        expression: 'explaining'
      };
    }
    if (lastTopic === 'leadership' || currentPath === '/about') {
      return {
        text: `Principal ${principalName} and Vice Principal ${vicePrincipalName} lead an experienced team of educators committed to student character and academic excellence.`,
        action: { label: "View Leadership Profiles →", path: "/about" },
        topic: 'leadership',
        expression: 'explaining'
      };
    }
    return {
      text: `I can share more details on our admissions criteria, academic curriculum, upcoming 2026 events, or contact channels. What would you like to dive deeper into?`,
      topic: 'general',
      expression: 'curious',
      suggestedFollowUps: ["Admissions guidance", "Academic curriculum", "Calendar holidays", "Contact details"]
    };
  }

  // =========================================================================
  // 3. STRUCTURED RESPONSES & CONTENT GROUNDING
  // =========================================================================

  // Question Category Matchers
  const isAskingTiming = hasWord('timing', 'timings', 'hour', 'hours', 'time', 'assembly', 'bell', 'schedule', 'routine', 'dismissal') ||
    hasPhrase('school hours', 'opening time', 'closing time', 'what time', 'when does school start', 'when does school end');
  const isAskingAdmissions = hasWord('admission', 'admissions', 'admit', 'admits', 'enroll', 'enrol', 'enrollment', 'apply', 'applying', 'application', 'register', 'registration', 'entry', 'eligibility', 'nursery', 'kindergarten', 'lkg', 'ukg') ||
    hasPhrase('how to apply', 'join school', 'get admission', 'admit my child', 'enroll now', 'admission process', 'join my child');
  const isAskingFees = hasWord('fee', 'fees', 'tuition', 'cost', 'costs', 'price', 'pricing', 'charge', 'charges', 'payment', 'installment', 'scholarship', 'afford') ||
    hasPhrase('how much', 'fee structure', 'tuition fee', 'cost of admission');
  const isAskingContact = hasWord('contact', 'phone', 'telephone', 'mobile', 'call', 'email', 'mail', 'address', 'location', 'locate', 'map', 'directions', 'reach', 'visit', 'office', 'pincode', 'pin') ||
    hasPhrase('where is', 'how to reach', 'where are you', 'campus address', 'contact number', 'phone number', 'email address');
  const isAskingDocuments = hasWord('document', 'documents', 'doc', 'docs', 'certificate', 'certificates', 'marksheet', 'paperwork', 'passport') ||
    hasPhrase('birth certificate', 'transfer certificate', 'tc', 'id proof', 'what to submit', 'documents needed', 'papers needed', 'enrollment requirements');
  const isAskingSteps = hasPhrase('steps', 'procedure', 'how does admission work', 'admission process', 'how to apply step by step', 'application steps');

  // Multi-Question Decomposition (e.g. "What are the school hours and how do I apply?")
  if (isAskingTiming && isAskingAdmissions) {
    return {
      text: `School hours for ${schoolName} are Monday through Friday, 8:00 AM to 3:00 PM (administrative office open 7:30 AM – 4:30 PM).\n\nAdmissions for the ${academicYear} academic year are currently open for kindergarten through secondary grades. You can explore entry requirements and application steps on the Admissions portal.`,
      action: {
        label: "Open Admissions Page →",
        path: "/admissions"
      },
      topic: 'admissions',
      expression: 'explaining',
      suggestedFollowUps: ["What documents are required?", "Are fee details available?", "Where is the campus?"]
    };
  }

  // Developer Attribution
  if (
    hasWord('alex', 'developer', 'creator', 'author', 'programmer', 'designer', 'engineer', 'portfolio') ||
    hasPhrase('who made', 'who built', 'who created', 'who designed', 'who coded', 'built by', 'designed by', 'made by', 'who is alex')
  ) {
    return {
      text: "This school website prototype was Designed & Developed by ALEX. You can explore Alex's portfolio to see other modern web engineering and design projects.",
      action: {
        label: "Visit Alex's Portfolio ↗",
        url: "https://jralex07.github.io/Portfolio/",
        isExternal: true
      },
      topic: 'developer',
      expression: 'explaining',
      suggestedFollowUps: ["Explore school features", "Configure school identity", "Back to admissions"]
    };
  }

  // STRUCTURED RESPONSE 1: Document Requirements (Enrollment Checklist)
  if (isAskingDocuments) {
    return {
      text: "Please prepare the following documents for enrollment: Verified Birth Certificate, Previous Academic Records, Transfer Certificate (TC), Student Photographs, and Parent/Guardian ID Proof.",
      structuredData: {
        type: 'document_checklist',
        title: "Enrollment Requirements",
        intro: "Please prepare the following documents:",
        items: [
          {
            name: "Birth Certificate",
            description: "Verified birth certificate."
          },
          {
            name: "Previous Academic Records",
            description: "Previous academic marksheets or school records."
          },
          {
            name: "Transfer Certificate (TC)",
            description: "Required if the student is transferring from another school."
          },
          {
            name: "Student Photographs",
            description: "Recent passport-size photographs of the student."
          },
          {
            name: "Parent/Guardian ID Proof",
            description: "Identification document for the parent or guardian."
          }
        ],
        note: "Please confirm the final document requirements with the school, as they may vary."
      },
      action: {
        label: "Open Admissions Page →",
        path: "/admissions"
      },
      topic: 'admissions',
      expression: 'explaining',
      suggestedFollowUps: ["How do I apply?", "Are fee details available?", "School office hours"]
    };
  }

  // STRUCTURED RESPONSE 2: Step-by-Step Admissions Procedure
  if (isAskingSteps) {
    return {
      text: "Here is the 4-step admissions procedure:",
      structuredData: {
        type: 'steps',
        title: "Admissions Procedure",
        intro: "Our streamlined 4-step enrollment process:",
        items: [
          {
            stepNumber: 1,
            title: "Online Application Form",
            description: "Submit the initial student inquiry and basic details via the Admissions portal."
          },
          {
            stepNumber: 2,
            title: "Document Verification",
            description: "Provide verified birth certificate, transfer certificate, and past academic records."
          },
          {
            stepNumber: 3,
            title: "Family Interaction & Orientation",
            description: "Meet with academic counselors to discuss curriculum pathways and student interests."
          },
          {
            stepNumber: 4,
            title: "Enrollment Confirmation",
            description: "Complete formal registration and receive orientation materials."
          }
        ],
        note: "Timelines may vary based on grade-level vacancy and evaluation schedules."
      },
      action: {
        label: "Open Admissions Page →",
        path: "/admissions"
      },
      topic: 'admissions',
      expression: 'explaining',
      suggestedFollowUps: ["What documents are needed?", "Tuition fees info", "Campus location"]
    };
  }

  // Fees, Tuition & Financial Policies (Truthful Grounding: No fake fees invented)
  if (isAskingFees) {
    return {
      text: `Official fee schedules for ${schoolName} are not hardcoded into this demonstration prototype. Official tuition details are provided upon administrative review. Would you like to review general admissions guidelines?`,
      action: {
        label: "Open Admissions Page →",
        path: "/admissions"
      },
      topic: 'admissions',
      expression: 'reassuring',
      suggestedFollowUps: ["What documents are needed?", "How to apply?", "Contact the school office"]
    };
  }

  // General Admissions & Enrollment
  if (
    isAskingAdmissions ||
    hasPhrase(
      'where can i find admissions',
      'how do i apply',
      'i want to know about admission',
      'can you show me the application page',
      'where do parents register',
      'register their children',
      'register my child',
      'join my child',
      'enroll my child',
      'admit my child',
      'how to join',
      'how to enroll',
      'application form'
    )
  ) {
    return {
      text: `Admissions for the ${academicYear} academic year are open for kindergarten through secondary grade levels. You can review entry criteria, required certificates, and the 4-step application procedure.`,
      action: {
        label: "Open Admissions Page →",
        path: "/admissions"
      },
      topic: 'admissions',
      expression: 'explaining',
      suggestedFollowUps: ["What documents are required?", "Are fee details available?", "What are the school timings?"]
    };
  }

  // STRUCTURED RESPONSE 3: Contact Information Card
  if (isAskingContact) {
    return {
      text: `You can reach ${schoolName} at ${phone} or via email at ${email}, or visit our campus office:`,
      structuredData: {
        type: 'contact_card',
        title: "Campus Contact & Office Details",
        items: [
          { label: "Campus Address", value: address, icon: "MapPin" },
          { label: "Telephone", value: phone, link: `tel:${phone.replace(/[^0-9+]/g, '')}`, icon: "Phone" },
          { label: "Email Address", value: email, link: `mailto:${email}`, icon: "Mail" },
          { label: "Front Office Hours", value: "Mon – Fri, 7:30 AM – 4:30 PM", icon: "Clock" }
        ],
        note: "For formal admissions inquiries, you can also submit a direct form on our Contact page."
      },
      action: {
        label: "Go to Contact Page →",
        path: "/contact"
      },
      topic: 'contact',
      expression: 'explaining',
      suggestedFollowUps: ["What are school timings?", "How to apply for admissions?", "Where is the school located?"]
    };
  }

  // Timings, Hours & Daily Schedule
  if (isAskingTiming) {
    return {
      text: `Standard campus hours for ${schoolName} are Monday through Friday, 8:00 AM to 3:00 PM. Administrative and front office hours run from 7:30 AM to 4:30 PM. Saturday extracurricular clubs meet from 8:30 AM to 12:30 PM.`,
      action: {
        label: "View Contact Details →",
        path: "/contact"
      },
      topic: 'timing',
      expression: 'explaining',
      suggestedFollowUps: ["Where is the school located?", "Tell me about admissions", "School calendar holidays"]
    };
  }

  // Academics, Curriculum, Subjects & STEM
  if (
    hasWord('academic', 'academics', 'curriculum', 'syllabus', 'subject', 'subjects', 'course', 'courses', 'stem', 'steam', 'science', 'math', 'maths', 'mathematics', 'physics', 'chemistry', 'biology', 'english', 'history', 'study', 'studies', 'education', 'learning', 'cbse', 'icse') ||
    hasPhrase('what do you teach', 'study program', 'academic pillars') ||
    (hasWord('athletic', 'sport') && hasWord('curriculum', 'academic', 'academics'))
  ) {
    return {
      text: `${schoolName} offers a well-rounded academic curriculum emphasizing STEM foundations, humanities, athletics, and cultural arts. Would you like to explore our academic pillars?`,
      action: {
        label: "Explore Academics Page →",
        path: "/academics"
      },
      topic: 'academics',
      expression: 'explaining',
      suggestedFollowUps: ["What sports clubs exist?", "Who are the leaders?", "Admissions guidelines"]
    };
  }

  // Extracurriculars, Sports, Athletics & Arts
  if (
    hasWord('sport', 'sports', 'athletic', 'athletics', 'football', 'soccer', 'cricket', 'basketball', 'volleyball', 'tennis', 'badminton', 'swimming', 'gym', 'art', 'arts', 'music', 'dance', 'drama', 'theatre', 'club', 'clubs', 'robotics', 'debate', 'painting') ||
    hasPhrase('extra curricular', 'extracurricular', 'after school', 'sports day', 'cultural activities')
  ) {
    return {
      text: `${schoolName} offers robust athletic and co-curricular programs including competitive team sports (football, cricket, basketball), visual & performing arts, robotics guild, and debate society.`,
      action: {
        label: "Explore Academics & Clubs →",
        path: "/academics"
      },
      topic: 'academics',
      expression: 'explaining',
      suggestedFollowUps: ["Explore academic curriculum", "Check upcoming sports events", "Campus facilities"]
    };
  }

  // Specific Chhath Puja Query (Major cultural festival across Bihar)
  if (
    hasWord('chhath', 'chhat', 'chath') ||
    hasPhrase('chat puja', 'chhat puja', 'chhath puja', 'chath puja', 'chhath parv', 'chhat parv', 'surya shashthi', 'chhath holiday')
  ) {
    return {
      text: `Chhath Puja (Chhath Mahaparv) in 2026 is observed with official gazetted school holidays on November 14–15, 2026 (Sandhya Arghya on Saturday, Nov 14 and Usha Arghya on Sunday, Nov 15). The campus remains closed for traditional festivities.`,
      structuredData: {
        type: 'events',
        title: "Chhath Mahaparv 2026 Observance",
        items: [
          { date: "Nov 12, 2026", title: "Nahay Khay", category: "Festive Ritual", detail: "Traditional Sanctification & Preparations" },
          { date: "Nov 13, 2026", title: "Kharna", category: "Festive Ritual", detail: "Evening Prasad Offering & Fasting" },
          { date: "Nov 14, 2026", title: "Sandhya Arghya", category: "Gazetted Holiday", detail: "School Closed - Evening Ghat Offerings" },
          { date: "Nov 15, 2026", title: "Usha Arghya (Paran)", category: "Gazetted Holiday", detail: "School Closed - Morning Sun Prayers & Conclusion" }
        ],
        note: "Official gazetted school holiday for students and faculty across Bihar."
      },
      action: {
        label: "View School Calendar →",
        path: "/calendar"
      },
      topic: 'calendar',
      expression: 'explaining',
      suggestedFollowUps: ["When is Diwali in 2026?", "What are school hours?", "What is the academic schedule?"]
    };
  }

  // STRUCTURED RESPONSE 4: Calendar, Holidays & Events (2026 Milestones)
  if (
    hasWord('calendar', 'holiday', 'holidays', 'festival', 'festivals', 'date', 'dates', 'event', 'events', 'vacation', 'break', 'diwali', 'deepavali', 'chhath', 'chhat', 'chath', 'puja', 'pooja', 'parv', 'republic', 'independence', 'gandhi', 'jayanti', 'christmas', 'holi', 'eid') ||
    hasPhrase('republic day', 'independence day', 'gandhi jayanti', 'summer vacation', 'winter break', 'when is holiday', 'upcoming events', 'chat puja', 'chhat puja', 'chhath puja')
  ) {
    return {
      text: `Our calendar features verified current year (2026) academic milestones and national festivals including Republic Day (Jan 26), Independence Day (Aug 15), Gandhi Jayanti (Oct 2), Diwali (Nov 8), and Chhath Puja (Nov 15).`,
      structuredData: {
        type: 'events',
        title: "2026 Academic Milestones & Festivals",
        items: [
          { date: "Jan 26, 2026", title: "Republic Day", category: "National Festival", detail: "Campus Flag Ceremony & Cultural Program" },
          { date: "Aug 15, 2026", title: "Independence Day", category: "National Festival", detail: "Annual Assembly & Student Performances" },
          { date: "Oct 02, 2026", title: "Gandhi Jayanti", category: "National Observance", detail: "Community Cleanliness Drive & Reflections" },
          { date: "Nov 08, 2026", title: "Diwali (Deepavali)", category: "Festival Holiday", detail: "Autumn Festival Break" },
          { date: "Nov 15, 2026", title: "Chhath Puja (Chhath Mahaparv)", category: "Gazetted Holiday", detail: "Traditional Surya Shashthi, Sandhya & Usha Arghya Observance" }
        ],
        note: "Dates are synchronized with the 2026 academic calendar."
      },
      action: {
        label: "View School Calendar →",
        path: "/calendar"
      },
      topic: 'calendar',
      expression: 'explaining',
      suggestedFollowUps: ["When is Chhath Puja in 2026?", "When is the next school event?", "What are school hours?"]
    };
  }

  // Leadership, Principal, Vice-Principal & Staff
  if (
    hasWord('principal', 'headmaster', 'headmistress', 'director', 'morales', 'vance', 'alistair', 'kenneth', 'leadership', 'leader', 'leaders', 'staff', 'teacher', 'teachers', 'faculty', 'mentor', 'mentors') ||
    hasPhrase('who is in charge', 'school head', 'administration team')
  ) {
    return {
      text: `Our leadership team is led by Principal ${principalName} and Vice Principal ${vicePrincipalName}. Both profiles support custom uploaded portraits or default to sculpted 3D clay human avatars.`,
      action: {
        label: "View Leadership Profiles →",
        path: "/about"
      },
      topic: 'leadership',
      expression: 'explaining',
      suggestedFollowUps: ["Read the school mission", "Contact administration", "Admissions information"]
    };
  }

  // Transportation & Bus Facilities
  if (
    hasWord('bus', 'buses', 'transport', 'transportation', 'van', 'route', 'routes', 'pickup', 'commute', 'driver') ||
    hasPhrase('bus facility', 'pick and drop', 'transport available')
  ) {
    return {
      text: `${schoolName} provides secure school bus transportation across major regional routes with GPS tracking and trained attendants. Please reach our administrative office for specific route stops.`,
      action: {
        label: "Inquire via Contact Page →",
        path: "/contact"
      },
      topic: 'contact',
      expression: 'reassuring',
      suggestedFollowUps: ["Contact office", "What are school timings?", "Admissions info"]
    };
  }

  // Campus Facilities, Library, Labs & Canteen
  if (
    hasWord('facility', 'facilities', 'campus', 'building', 'lab', 'labs', 'laboratory', 'library', 'books', 'canteen', 'cafeteria', 'food', 'lunch', 'playground', 'auditorium', 'clinic', 'infirmary', 'smartboard') ||
    hasPhrase('computer lab', 'science lab', 'reading room', 'sports complex')
  ) {
    return {
      text: `Our campus includes modern facilities: smart digital classrooms, advanced STEM & computer laboratories, a comprehensive library, a sports complex, an arts theater, and an on-campus health clinic.`,
      action: {
        label: "Learn More on About Page →",
        path: "/about"
      },
      topic: 'about',
      expression: 'explaining',
      suggestedFollowUps: ["Explore athletic sports", "Admissions process", "Where is the school?"]
    };
  }

  // Uniform & Dress Code
  if (
    hasWord('uniform', 'dress', 'clothes', 'clothing', 'blazer', 'tie', 'shoes') ||
    hasPhrase('dress code', 'what to wear', 'school dress')
  ) {
    return {
      text: `Students wear the official ${schoolName} academic uniform Monday through Thursday, and designated sports / activity apparel on Fridays and physical education periods.`,
      action: {
        label: "Contact Office for Uniform Kit →",
        path: "/contact"
      },
      topic: 'contact',
      expression: 'explaining',
      suggestedFollowUps: ["What are school timings?", "Admissions guidance", "Contact details"]
    };
  }

  // Identity Configuration & Customization
  if (
    hasWord('config', 'configure', 'configuration', 'identity', 'custom', 'customize', 'logo', 'favicon', 'setting', 'settings', 'brand', 'branding', 'upload', 'edit', 'prototype', 'demo') ||
    hasPhrase('change logo', 'change name', 'upload favicon', 'identity modal')
  ) {
    return {
      text: `You can customize this school prototype anytime by clicking "Configure Identity" in the top navigation bar. You can upload a custom logo, browser favicon, leadership photos, update contact information, or adjust the school name.`,
      topic: 'settings',
      expression: 'success',
      suggestedFollowUps: ["Where is the button?", "Reset to demo defaults", "Contact information"]
    };
  }

  // Faith, Values, Character & Ethics
  if (
    hasWord('faith', 'moral', 'morals', 'value', 'values', 'spiritual', 'spirituality', 'ethic', 'ethics', 'character', 'chapel', 'prayer', 'prayers', 'integrity') ||
    hasPhrase('moral values', 'faith based', 'character education')
  ) {
    return {
      text: `Our Faith & Values curriculum nurtures character formation, community service, and compassionate leadership.`,
      action: {
        label: "View Faith & Values →",
        path: "/faith"
      },
      topic: 'faith',
      expression: 'explaining',
      suggestedFollowUps: ["Read school mission", "Admissions guidelines", "Go back home"]
    };
  }

  // About School, Mission, Vision & Heritage
  if (
    hasWord('about', 'mission', 'vision', 'history', 'heritage', 'motto', 'philosophy', 'founder', 'background', 'story', 'founded') ||
    hasPhrase('tell me about', 'about us', 'who are we', 'school background')
  ) {
    return {
      text: `${schoolName} is dedicated to intellectual vigor, integrity, and lifelong learning. Learn more about our academic philosophy and leadership.`,
      action: {
        label: "Read About Our School →",
        path: "/about"
      },
      topic: 'about',
      expression: 'explaining',
      suggestedFollowUps: ["Who is the Principal?", "Academic curriculum", "Admissions procedure"]
    };
  }

  // Greetings & Friendly Small Talk
  if (
    hasWord('hi', 'hello', 'hey', 'greetings', 'howdy', 'hola', 'yo', 'sup') ||
    hasPhrase('good morning', 'good afternoon', 'good evening', 'how are you', 'how do you do', 'nice to meet you')
  ) {
    return {
      text: `Hello! I'm Barnaby, your campus guide for ${schoolName}. What would you like to know about the school? Feel free to ask about admissions, curriculum, events, or school contacts!`,
      topic: 'greeting',
      expression: 'greeting',
      suggestedFollowUps: [
        "How do I apply for admissions?",
        "What are the school hours?",
        "Tell me about sports & clubs",
        "Where is the campus located?"
      ]
    };
  }

  // Gratitude & Compliments
  if (
    hasWord('thanks', 'thank', 'thx', 'appreciated', 'awesome', 'great', 'cool', 'wonderful', 'nice', 'helpful') ||
    hasPhrase('thank you', 'thanks a lot', 'good job', 'well done')
  ) {
    return {
      text: `You are very welcome! I'm glad I could help. Let me know if you need anything else as you explore our campus.`,
      topic: 'gratitude',
      expression: 'success',
      suggestedFollowUps: ["Check upcoming events", "Admissions portal", "Contact office"]
    };
  }

  // Farewells
  if (
    hasWord('bye', 'goodbye', 'cya', 'farewell') ||
    hasPhrase('see you', 'have a good day', 'good night', 'catch you later')
  ) {
    return {
      text: `Goodbye! Have a wonderful day. Click my launcher anytime if you have more questions about ${schoolName}!`,
      topic: 'farewell',
      expression: 'greeting'
    };
  }

  // Help, Capabilities & Navigation requests
  if (
    hasWord('help', 'guide', 'navigate', 'capabilities', 'options', 'menu', 'commands') ||
    hasPhrase('what can you do', 'how does this work', 'how can you help', 'show me what you can do')
  ) {
    return {
      text: `I can help you navigate admissions guidelines, explore academic pillars, check calendar dates and holidays, look up leadership profiles, or locate contact details. Where would you like to start?`,
      topic: 'help',
      expression: 'curious',
      suggestedFollowUps: [
        "How to apply for admissions?",
        "What are the academic pillars?",
        "School calendar & holidays",
        "School contact details"
      ]
    };
  }

  // Fallback / Unrecognized query with constructive clarification & guidance
  return {
    text: `I don't have specific verified details about "${query}" in this prototype demo. You can check our published pages or reach our administrative office directly.`,
    action: {
      label: "Open Contact Page →",
      path: "/contact"
    },
    topic: 'unknown',
    expression: 'thinking',
    suggestedFollowUps: [
      "How do I apply for admissions?",
      "What are the school hours?",
      "Who is the Principal?",
      "Where is the school located?"
    ]
  };
};
