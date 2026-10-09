/**
 * schoolContent.js
 * Centralized content repository adhering strictly to mount_summer_website_content_data.md.
 * 
 * Rules:
 * - Default identity uses explicit configurable placeholders.
 * - Recovered historical archival data is preserved but partitioned.
 * - Missing facts are marked as requiring verification, never fabricated.
 */

export const DEFAULT_CONFIG = {
  schoolName: "[Your School Name]",
  principalName: "[Principal Name]",
  vicePrincipalName: "[Vice Principal Name]",
  address: "[Verified School Address]",
  phone: "[Verified Contact Number]",
  email: "[Verified Contact Email]",
  academicYear: "[Current Academic Year]",
  faithSectionPublished: false, // Per prompt: "leave it unpublished by default"
  identityMode: "placeholder", // 'placeholder' | 'archive' | 'custom'
};

export const RECOVERED_ARCHIVE_DATA = {
  sourceDomain: "https://mountsummerconventschool.in/",
  schoolName: "Mount Summer Convent School",
  websiteTitle: "Mount Summer Convent School",
  status: "partial_publicly_indexed_content",
  fullSiteVerified: false,
  principalName: "Not recovered in indexed data",
  vicePrincipalName: "Not recovered in indexed data",
  address: "Polo Field Road, K.M. Tank, Laheria Sarai, Darbhanga – 846001, India",
  phone: "+91 9334391034",
  email: "mountsummerconvent2012@gmail.com",
  currentValidityVerified: false,
  copyrightText: "© 2025 Mount Summer Convent School. All Rights Reserved.",
  historicalYear: 2025,
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
  descriptionStatus: "partial",
  officialDescriptionAvailable: false,
  notice: "The complete introductory overview was not recovered in the indexed source. The structure below provides a transparent placeholder representation pending official copy verification.",
  summaryCopy: "Welcome to our academic community. Rooted in values of integrity, scholarship, and service, our institution is dedicated to fostering an environment where every young learner explores their full potential, develops critical thinking, and prepares to make a meaningful difference.",
  callsToAction: [
    { label: "About Us", path: "/about", variant: "primary" },
    { label: "Apply", path: "/admissions", variant: "outline" }
  ]
};

export const LEADERSHIP_PROMPTS = [
  {
    role: "Principal",
    promptLabel: "ASK Principal",
    destinationOrForm: "not_recovered",
    imageAsset: "not_recovered",
    statusNote: "Submission endpoint not recovered in indexed data. Action opens informational dialogue."
  },
  {
    role: "Vice Principal",
    promptLabel: "ASK Vice Principal",
    destinationOrForm: "not_recovered",
    imageAsset: "not_recovered",
    statusNote: "Submission endpoint not recovered in indexed data. Action opens informational dialogue."
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

export const HISTORICAL_CALENDAR_ENTRIES = [
  {
    id: "hist-1",
    event: "Ambedkar Jayanti",
    date: "2025-04-14",
    category: "Academics",
    status: "Historical Record (2025)",
    notes: "Reported under Academics in indexed source data"
  },
  {
    id: "hist-2",
    event: "Mount Summer Foundation Day",
    date: "2025-06-17",
    category: "Academics",
    status: "Historical Record (2025)",
    notes: "Reported under Academics in indexed source data"
  },
  {
    id: "hist-3",
    event: "Teacher's Day",
    date: "2025-09-05",
    category: "Academics",
    status: "Historical Record (2025)",
    notes: "Reported under Academics in indexed source data"
  },
  {
    id: "hist-4",
    event: "Gandhi Jayanti",
    date: "2025-10-02",
    category: "Athletics",
    status: "Historical Record (2025)",
    notes: "Reported under Athletics in indexed source data"
  },
  {
    id: "hist-5",
    event: "Children's Day",
    date: "2025-11-14",
    category: "Athletics",
    status: "Historical Record (2025)",
    notes: "Reported under Athletics in indexed source data"
  },
  {
    id: "hist-6",
    event: "Dr. Rajendra Prasad Jayanti",
    date: "2025-12-03",
    category: "Athletics",
    status: "Historical Record (2025)",
    notes: "Reported under Athletics in indexed source data"
  }
];

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
