/**
 * schoolContent.js
 * Centralized content repository for the school website prototype.
 * All school identity, navigation, and page content are centrally managed here.
 */

export const DEFAULT_CONFIG = {
  schoolName: "School Website",
  logoUrl: null, // Optional school logo (data URL or image URL)
  faviconUrl: null, // Optional school favicon (data URL or icon URL)
  principalName: "Dr. Alistair Vance",
  principalPhotoUrl: null, // Optional real photo URL; defaults to sculpted 3D clay bust
  vicePrincipalName: "Prof. Kenneth Morales",
  vicePrincipalPhotoUrl: null, // Optional real photo URL; defaults to sculpted 3D clay bust
  address: "SInuara, Darbhanaga,BIhar 846003",
  phone: "+91 XXXXXXXXXX",
  email: "developer@cloudpower.store",
  academicYear: "2026–2027",
  faithSectionPublished: false, // Leave unpublished by default in prototype
  identityMode: "demo", // 'demo' | 'custom'
  schoolSubtitle: "Demonstration Campus",
  copyrightText: "© 2026 School Website. All Rights Reserved."
};

export const NAVIGATION_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Admissions", path: "/admissions" },
  { label: "Academics", path: "/academics" },
  { label: "Faith", path: "/faith", conditional: true }, // Controlled by faithSectionPublished
  { label: "Calendar", path: "/calendar" },
  { label: "Contact", path: "/contact" },
];

export const HERO_DATA = {
  heading: "Discover Excellence at",
  tagline: "Where every student's journey begins with purpose",
  prompt: "Where will you venture?",
  categories: [
    {
      id: "academics",
      title: "Academics",
      description: "Rigorous curriculum and dedicated educators fostering intellectual vitality and curiosity.",
      icon: "GraduationCap",
      link: "/academics"
    },
    {
      id: "athletics",
      title: "Athletics",
      description: "Sportsmanship, resilience, and physical fitness through organized team sports and training.",
      icon: "Trophy",
      link: "/academics#athletics"
    },
    {
      id: "extracurricular",
      title: "Extracurricular",
      description: "Creative clubs, leadership societies, and cultural initiatives encouraging all-round growth.",
      icon: "Sparkles",
      link: "/academics#extracurricular"
    },
    {
      id: "campus",
      title: "Campus",
      description: "A safe, nurturing environment designed to support modern learning and collaborative discovery.",
      icon: "Building2",
      link: "/academics#campus"
    }
  ],
  callsToAction: [
    { label: "About Us", path: "/about", variant: "primary" },
    { label: "Apply", path: "/admissions", variant: "secondary" }
  ]
};

export const WELCOME_SECTION = {
  descriptionStatus: "demonstration",
  officialDescriptionAvailable: true,
  notice: "Interactive school portal demonstration model. Institutional details, leadership profiles, and academic dates are configurable via the Identity Settings panel.",
  summaryCopy: "Welcome to our academic community. Rooted in values of integrity, scholarship, and service, our institution is dedicated to fostering an environment where every young learner explores their full potential, develops critical thinking, and prepares to make a meaningful difference.",
  callsToAction: [
    { label: "About Us", path: "/about", variant: "primary" },
    { label: "Apply", path: "/admissions", variant: "outline" }
  ]
};

export const LEADERSHIP_PROMPTS = [
  {
    role: "Principal",
    promptLabel: "Inquire with Principal",
    destinationOrForm: "info_dialogue",
    imageAsset: "leadership_demo",
    statusNote: "Demonstration inquiry channel. Opens informational leadership orientation dialogue."
  },
  {
    role: "Vice Principal",
    promptLabel: "Inquire with Vice Principal",
    destinationOrForm: "info_dialogue",
    imageAsset: "leadership_demo",
    statusNote: "Demonstration inquiry channel. Opens academic curriculum advisory dialogue."
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    displayedName: "James Lee",
    cohort: "Class of '22",
    topicSummary: "Academic and spiritual growth",
    exactQuote: "not_recovered",
    authenticityVerified: false,
    disclaimer: "Historical indexed summary. Original verbatim quotation was not recovered."
  },
  {
    id: 2,
    displayedName: "Sophia Martinez",
    cohort: "Class of '24",
    topicSummary: "Leadership and teamwork through extracurricular activities",
    exactQuote: "not_recovered",
    authenticityVerified: false,
    disclaimer: "Historical indexed summary. Original verbatim quotation was not recovered."
  },
  {
    id: 3,
    displayedName: "Gabriella Irwin",
    cohort: "Class of '23",
    topicSummary: "Support from teachers, counselors, and administration",
    exactQuote: "not_recovered",
    authenticityVerified: false,
    disclaimer: "Historical indexed summary. Original verbatim quotation was not recovered."
  },
  {
    id: 4,
    displayedName: "John Doe",
    roleLabel: "Parent Volunteer",
    topicSummary: "Positive volunteering experience and community involvement",
    exactQuote: "not_recovered",
    authenticityVerified: false,
    disclaimer: "Parent perspective reported in indexed content. Unverified testimonial."
  }
];

export const MISSION_THEMES = [
  {
    title: "Academic Excellence",
    summary: "A rigorous curriculum and innovative teaching to support academic achievement.",
    icon: "BookOpen"
  },
  {
    title: "Compassionate Leadership",
    summary: "Developing leaders who serve with integrity and empathy.",
    icon: "HeartHandshake"
  },
  {
    title: "Critical Thinking",
    summary: "Building critical thinking, ethical decision-making, and problem-solving.",
    icon: "Brain"
  },
  {
    title: "Global Citizenship",
    summary: "Preparing students to contribute positively to society.",
    icon: "Globe"
  },
  {
    title: "Holistic Development",
    summary: "Nurturing students' talents through extracurricular activities.",
    icon: "Palette"
  },
  {
    title: "Supportive Community",
    summary: "Supporting students in preparing for a purposeful life.",
    icon: "Users"
  }
];

export const HIGHLIGHT_THEMES = [
  {
    title: "Excellence",
    summary: "Curriculum and innovative teaching",
    iconType: "star",
    badgeLabel: "Reported with Star Icon"
  },
  {
    title: "Leadership",
    summary: "Compassionate leadership",
    iconType: "shield",
    badgeLabel: "Leadership Pillar"
  },
  {
    title: "Global Citizens",
    summary: "Positive contribution to society",
    iconType: "globe",
    badgeLabel: "Reported with Globe Icon"
  }
];

export const CURRENT_YEAR_FESTIVALS_HOLIDAYS = [
  {
    id: "fest-1",
    event: "Republic Day",
    date: "2026-01-26",
    category: "Festivals & Holidays",
    status: "National Holiday (2026)",
    notes: "Campus Flag Hoisting Ceremony & Cultural Assembly"
  },
  {
    id: "fest-2",
    event: "Maha Shivratri",
    date: "2026-02-15",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Festive Holiday"
  },
  {
    id: "fest-3",
    event: "Holi (Festival of Colors)",
    date: "2026-03-03",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Spring Festival Recess"
  },
  {
    id: "fest-4",
    event: "Ambedkar Jayanti",
    date: "2026-04-14",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "Special Morning Assembly & Scholastic Commemoration"
  },
  {
    id: "fest-5",
    event: "Mahavir Jayanti",
    date: "2026-04-20",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Observance Holiday"
  },
  {
    id: "fest-6",
    event: "Annual Foundation Day",
    date: "2026-06-17",
    category: "Academics",
    status: "Institutional Milestone (2026)",
    notes: "Annual Foundation Day Ceremonies & Alumni Convocation"
  },
  {
    id: "fest-7",
    event: "Independence Day",
    date: "2026-08-15",
    category: "Festivals & Holidays",
    status: "National Holiday (2026)",
    notes: "National Flag Hoisting, Patriotic Parade & Community Assembly"
  },
  {
    id: "fest-8",
    event: "Raksha Bandhan",
    date: "2026-08-28",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Cultural Festival"
  },
  {
    id: "fest-9",
    event: "Janmashtami",
    date: "2026-09-04",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "Cultural Tableau & Traditional Musical Presentations"
  },
  {
    id: "fest-10",
    event: "Teacher's Day",
    date: "2026-09-05",
    category: "Academics",
    status: "Academic Observance (2026)",
    notes: "Student Council Felicitations & Educator Appreciation Gala"
  },
  {
    id: "fest-11",
    event: "Gandhi Jayanti",
    date: "2026-10-02",
    category: "Festivals & Holidays",
    status: "National Holiday (2026)",
    notes: "National Day of Service, Campus Cleanliness Drive & Peace Forum"
  },
  {
    id: "fest-12",
    event: "Dussehra (Vijayadashami)",
    date: "2026-10-20",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Autumn Festive Recess"
  },
  {
    id: "fest-13",
    event: "Diwali (Festival of Lights)",
    date: "2026-11-08",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Deepavali Festive Holidays"
  },
  {
    id: "fest-14",
    event: "Children's Day",
    date: "2026-11-14",
    category: "Athletics",
    status: "School Celebration (2026)",
    notes: "Special Sports Carnival, Fun Fair & Talent Showcase"
  },
  {
    id: "fest-chhath",
    event: "Chhath Puja (Chhath Mahaparv)",
    date: "2026-11-15",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Traditional Chhath Mahaparv (Sandhya Arghya & Usha Arghya Observance)"
  },
  {
    id: "fest-15",
    event: "Guru Nanak Jayanti",
    date: "2026-11-24",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Observance Holiday"
  },
  {
    id: "fest-16",
    event: "Dr. Rajendra Prasad Jayanti",
    date: "2026-12-03",
    category: "Academics",
    status: "Academic Observance (2026)",
    notes: "Memorial Lecture & Inter-School Debate Series"
  },
  {
    id: "fest-17",
    event: "Christmas Day",
    date: "2026-12-25",
    category: "Festivals & Holidays",
    status: "Gazetted Holiday (2026)",
    notes: "School Closed - Winter Recess & Christmas Celebration"
  }
];

export const HISTORICAL_CALENDAR_ENTRIES = CURRENT_YEAR_FESTIVALS_HOLIDAYS;

export const SUPPORT_SECTION = [
  {
    id: "volunteer",
    title: "Volunteer",
    summary: "Invitation to help with school events, mentoring, or classroom assistance.",
    callToAction: "Learn More",
    actionType: "info_modal",
    statusNote: "Volunteer registration workflow not recovered. Inquire with administration."
  },
  {
    id: "events",
    title: "Attend Events",
    summary: "Invitation to attend open houses, fundraisers, and community gatherings.",
    callToAction: "See Calendar",
    actionType: "link",
    path: "/calendar",
    statusNote: "Directs to calendar schedule with historical and verified events."
  },
  {
    id: "donate",
    title: "Donate",
    summary: "Request for financial support for education and student opportunities.",
    callToAction: "Donate Now",
    actionType: "info_modal",
    statusNote: "No active payment provider or donation processing configured on prototype."
  }
];

export const FAITH_CONTENT = {
  descriptionSummary: "The school is described as a Christ-centered community focused on academic achievement and spiritual development.",
  status: "configurable_unpublished_by_default",
  notice: "This section is configurable and unpublished by default to respect authorization requirements. It is available for review when faith-identity mode is activated."
};

export const FOOTER_DATA = {
  descriptionSummary: "Dedicated to academic excellence, ethical leadership, and preparing students for a purposeful, globally conscious life.",
  quickLinks: [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Admissions", path: "/admissions" },
    { label: "Academics", path: "/academics" },
    { label: "Faith", path: "/faith" },
    { label: "Calendar", path: "/calendar" },
    { label: "Contact", path: "/contact" }
  ],
  copyrightTemplate: "All Rights Reserved. School Website Prototype."
};

export const UNVERIFIED_INVENTORY = [
  "Complete About page text and school history",
  "Admission procedure, eligibility, deadlines, forms, and fees",
  "Class levels, subjects, curriculum details, and academic schedules",
  "Staff directory and verified principal/vice-principal names",
  "Facilities, transport, uniform, meals, hostel, library, labs, and sports details",
  "School policies, child safeguarding, privacy policy, and terms",
  "Current calendar and current school-year dates",
  "Original image files, image URLs, gallery captions, and photo permissions",
  "Exact testimonial quotations and verified identities",
  "Social media accounts and verified external links",
  "Working forms, form recipients, donation/payment setup, and backend workflows"
];
