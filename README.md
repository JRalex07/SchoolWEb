# 🏫 Mount Summer School Portal

[![Build & Deploy](https://github.com/JRalex07/SchoolWEb/actions/workflows/deploy.yml/badge.svg)](https://github.com/JRalex07/SchoolWEb/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-14.0-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)

> **Live Production Domain:** [https://school.alex.runs-on.dev](https://school.alex.runs-on.dev)  
> **Prototype Preview:** [https://alex-prototype.netlify.app/](https://alex-prototype.netlify.app/)  
> **Developer:** Designed & Developed by [ALEX](https://jralex07.github.io/Portfolio/)

---

## 📖 Overview

**Mount Summer School Portal** is a modern, responsive, animation-rich school web application prototype engineered with **tactile claymorphism** and **restrained glassmorphism**. The project includes a fully configurable school identity management engine, a comprehensive academic calendar with 2026 gazetted holidays (including **Chhath Puja**, **Diwali**, and national celebrations), and an opt-in campus assistant named **Barnaby**.

---

## ✨ Key Features

### 1. 🦉 Intelligent Campus Assistant — Barnaby
- **Opt-In Conversational Experience:** Quiet by default; no unsolicited greeting popups or unexpected sound alerts.
- **Natural Typing Animation:** Relaxed character streaming (~25–35 characters/sec) with contextual pauses at punctuation and clauses, plus one-click fast completion.
- **Structured Response Payloads:**
  - **Enrollment Requirements Checklist:** Interactive stacked document cards (Birth Certificate, Academic Records, Transfer Certificate, Student Photographs, Parent/Guardian ID).
  - **Step-by-Step Admissions Procedure:** 4-step progressive cards (Inquiry, Campus Tour, Documentation, Confirmation).
  - **Campus Contact Card:** Verified telephone, email, physical address, and front office hours with clickable `tel:` and `mailto:` action buttons.
  - **2026 Milestones & Festivals:** Formatted cards displaying exact holiday dates and celebration details.
- **Global Navigation Intelligence:** Accurately distinguishes pure navigation commands (*"Take me to the Contact page"*), information requests (*"What is the contact email?"*), and combined queries. Includes strict exclusion of 404/not-found traps.
- **Concurrency & Deduplication Guard:** Utilizes an execution lock (`isRespondingRef`) and strict deduplication guard to eliminate duplicate responses during rapid inputs or React StrictMode re-renders.
- **Timed Suggestions:** Suggestion question chips only reveal after Barnaby finishes typing.

### 2. 📅 Comprehensive 2026 School Calendar & Gazetted Holidays
- Full 2026 academic calendar with gazetted and regional holidays:
  - **Chhath Puja (Chhath Mahaparv):** Nov 14–15, 2026 (Nahay Khay, Kharna, Sandhya Arghya, and Usha Arghya).
  - **Diwali (Festival of Lights):** Nov 08, 2026.
  - **Gandhi Jayanti:** Oct 02, 2026.
  - **Independence Day:** Aug 15, 2026.
  - **Republic Day:** Jan 26, 2026.
  - **Children's Day:** Nov 14, 2026.
  - **Christmas Day:** Dec 25, 2026.
- Interactive category filtering: *All*, *Festivals & Holidays*, *Academics*, *Athletics*, and *Extracurricular*.
- Ability to record and persist verified current-year milestones.

### 3. 🎨 Tactile Claymorphism & Bento Grid UI
- Multi-layered soft inner shadows, organic curves, and responsive Bento Grid layouts.
- Optimized rendering architecture targeting **120 FPS** on high-refresh displays.
- Responsive component sizing using `min()`, `max()`, and `clamp()` to guarantee zero clipping or horizontal overflow on screens down to 320px.

### 4. ⚙️ Live School Identity Configuration
- In-browser configuration drawer allowing administrators to update:
  - School Name, Motto, and Academic Year.
  - Campus Address, Phone Number, and Inquiries Email.
  - Principal & Vice-Principal Names and Portrait Photographs (supports custom image uploads or default 3D clay busts).
  - Custom School Crest / SVG Logo with instant live preview and reset to default.
- Zero raw template placeholders (`[Principal Name]`, `[EMAIL_ADDRESS]`, etc.) rendered across any page.

### 5. 🚀 Technical SEO & GitHub Pages CI/CD
- **Automated GitHub Actions Deployment:** Pushes to `main` trigger a pipeline running all 10 audit test suites before deploying to GitHub Pages.
- **Static Route Prerendering:** Custom build script (`scripts/prerender-routes.mjs`) generates static HTML for all 6 public routes (`/about`, `/admissions`, `/academics`, `/calendar`, `/contact`, `/faith`) with custom OpenGraph tags, JSON-LD schema, and canonical URLs.
- **Custom Domain Persistence:** Automatic `CNAME` management for `school.alex.runs-on.dev`.
- **SPA Fallback:** Clean `404.html` client-side redirect handling direct refreshes on deep URLs.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI components with Hooks and Context API |
| **Vite 8** | High-performance build tool and local development environment |
| **React Router 7** | Client-side routing with code-split lazy loading |
| **Framer Motion 14** | Physics-based animations, layout transitions, and drawer modals |
| **Lucide React** | Consistent, lightweight SVG iconography |
| **GSAP 3** | High-precision timeline animation utilities |

---

## 📁 Repository Structure

```text
MountWEB/
├── .github/workflows/
│   └── deploy.yml                  # Automated GitHub Actions deployment pipeline
├── public/
│   ├── 404.html                    # SPA fallback redirect for GitHub Pages
│   ├── CNAME                       # Production custom domain (school.alex.runs-on.dev)
│   ├── robots.txt                  # Search crawler directives
│   ├── sitemap.xml                 # Canonical XML sitemap for public routes
│   └── default-school-logo.svg     # Default vector emblem
├── scripts/
│   └── prerender-routes.mjs        # Static HTML prerender script for GitHub Pages
├── src/
│   ├── components/
│   │   ├── Mascot/
│   │   │   ├── MascotAssistant.jsx           # Chat drawer, floating launcher, typewriter
│   │   │   ├── MascotCharacter.jsx           # Vector SVG clay mascot with dynamic expressions
│   │   │   └── StructuredMessageRenderer.jsx # Document checklists, contact cards, event lists
│   │   ├── ConfigDrawer.jsx        # School identity configuration modal
│   │   ├── LeadershipPortrait.jsx  # 3D clay human portrait busts with photo override
│   │   ├── Navbar.jsx              # Responsive navigation with mobile drawer
│   │   ├── Footer.jsx              # Shared site footer with developer attribution
│   │   └── SEO.jsx                 # Dynamic page title and meta tags
│   ├── context/
│   │   ├── MascotProvider.jsx      # Barnaby assistant state, timers, and locks
│   │   └── SchoolConfigProvider.jsx# Configurable school data and localStorage sync
│   ├── data/
│   │   ├── helperRegistry.js       # Field validation rules and contextual tips
│   │   └── schoolContent.js        # Default config and 2026 gazetted holidays dataset
│   ├── pages/
│   │   ├── HomePage.jsx            # Bento grid highlights, leadership, and stats
│   │   ├── AboutPage.jsx           # Heritage, leadership hierarchy, and philosophy
│   │   ├── AdmissionsPage.jsx      # Entry guidelines, age criteria, and document steps
│   │   ├── AcademicsPage.jsx       # Academic pillars, sports programs, and creative arts
│   │   ├── CalendarPage.jsx        # Verified schedule, holiday filters, and events
│   │   ├── ContactPage.jsx         # Campus map, office details, and inquiry form
│   │   ├── FaithPage.jsx           # Character formation and ethical values
│   │   └── NotFoundPage.jsx        # Friendly 404 fallback with safe home return
│   └── utils/
│       ├── barnabyChatEngine.js    # Conversational intent matching and structured payloads
│       └── navigationRegistry.js   # Authoritative route validation (strictly excludes 404)
├── tests/                          # 10 automated test suites (100% pass rate)
└── vite.config.js                  # Production build and chunking configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JRalex07/SchoolWEb.git
   cd SchoolWEb
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

The repository includes a comprehensive 10-suite audit test suite verifying performance, responsive layout, SEO, route navigation, and Barnaby conversational accuracy:

```bash
# Run all audit test suites
npm test
```

### Individual Test Suites:
- `node tests/barnaby-chat-assistant.test.mjs` — Conversational intelligence, Chhath Puja, typing animations, structured responses, and navigation.
- `node tests/full-qa-audit.test.mjs` — 13 end-to-end QA flows across all pages and modals.
- `node tests/seo-technical-audit.test.mjs` — Sitemap, robots.txt, canonical metadata, and prerendered HTML validation.
- `node tests/github-workflow-audit.test.mjs` — GitHub Actions deployment pipeline verification.
- `node tests/performance-responsive-audit.test.mjs` — 120 FPS transitions, scroll performance, and fluid sizing.

---

## 📦 Building for Production

To build the client bundle and prerender static route metadata for GitHub Pages:

```bash
npm run build
```

This compiles optimized chunks into `/dist` and runs `scripts/prerender-routes.mjs` to generate route-specific `index.html` files for SEO and refresh survival.

---

## 👨‍💻 Author & Attribution

- **Designed & Developed by:** [ALEX](https://jralex07.github.io/Portfolio/)
- **Repository:** [https://github.com/JRalex07/SchoolWEb](https://github.com/JRalex07/SchoolWEb)

All rights reserved © 2026.
