import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== RUNNING PERFORMANCE & RESPONSIVE SIZING AUDIT ===\n');

let totalTests = 0;
let passedTests = 0;

function it(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

// 1. Modal Transition & Style Conflict Elimination
console.log('[Test Suite 1: Modal Performance & Style Collision Elimination]');

const cssContent = fs.readFileSync(path.resolve('src/index.css'), 'utf-8');
const configDrawerContent = fs.readFileSync(path.resolve('src/components/ConfigDrawer.jsx'), 'utf-8');

it('Modal Overlay: Duplicate CSS animation removed from .modal-overlay to prevent collision with Framer Motion', () => {
  const modalOverlayCss = cssContent.match(/\.modal-overlay\s*\{[^}]*\}/)?.[0] || '';
  assert(!modalOverlayCss.includes('animation: fadeIn'), '.modal-overlay must not declare animation: fadeIn');
  assert(modalOverlayCss.includes('contain: paint') || modalOverlayCss.includes('position: fixed'), '.modal-overlay must optimize paint containment');
});

it('Modal Card: Duplicate CSS animation removed from .modal-card to prevent spring collision', () => {
  const modalCardCss = cssContent.match(/\.modal-card\s*\{[^}]*\}/)?.[0] || '';
  assert(!modalCardCss.includes('animation: slideUp'), '.modal-card must not declare animation: slideUp');
  assert(modalCardCss.includes('transform: translateZ(0)'), '.modal-card must be promoted to GPU compositing layer');
});

it('ConfigDrawer: Implements body scroll locking and Escape key dismiss', () => {
  assert(configDrawerContent.includes("document.body.style.overflow = 'hidden'"), 'ConfigDrawer must lock body scroll on open');
  assert(configDrawerContent.includes("e.key === 'Escape'"), 'ConfigDrawer must dismiss on Escape key');
});

it('ConfigDrawer: Sizing uses fluid min() and clamp() without rigid clipping', () => {
  assert(configDrawerContent.includes("min(100%, 680px)"), 'ConfigDrawer card maxWidth must use fluid min(100%, 680px)');
  assert(configDrawerContent.includes("clamp(20px, 3.5vw, 28px)"), 'ConfigDrawer borderRadius must use fluid clamp()');
  assert(configDrawerContent.includes("willChange"), 'ConfigDrawer must declare willChange for smooth GPU compositing');
});

// 2. Mobile Navigation & Toggle Audit
console.log('\n[Test Suite 2: Mobile Hamburger Navigation Optimization]');

const navbarContent = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf-8');

it('Navbar: Inline <style> tag completely eliminated to prevent CSSOM re-parsing', () => {
  assert(!navbarContent.includes('<style>'), 'Navbar must not inject inline <style> tags into JSX');
  assert(cssContent.includes('.desktop-nav') && cssContent.includes('.mobile-toggle'), 'Navigation media rules must live in index.css');
});

it('Mobile Toggle: Has touchAction manipulation to eliminate 300ms mobile tap delay', () => {
  assert(navbarContent.includes("touchAction: 'manipulation'"), 'mobile-toggle must declare touchAction: manipulation');
});

it('Mobile Drawer: Uses hardware-accelerated transform with willChange and clean cubic-bezier easing', () => {
  assert(navbarContent.includes("willChange: 'transform'"), 'Mobile drawer must declare willChange: transform');
  assert(navbarContent.includes("transform: 'translateZ(0)'"), 'Mobile drawer must promote to GPU compositing layer');
  assert(navbarContent.includes("ease: [0.16, 1, 0.3, 1]"), 'Mobile drawer must use calibrated cubic-bezier transition');
});

// 3. Fluid Responsive Sizing Audit
console.log('\n[Test Suite 3: Fluid Component Sizing & Zero 320px Overflow]');

const homePageContent = fs.readFileSync(path.resolve('src/pages/HomePage.jsx'), 'utf-8');
const aboutPageContent = fs.readFileSync(path.resolve('src/pages/AboutPage.jsx'), 'utf-8');
const portraitContent = fs.readFileSync(path.resolve('src/components/LeadershipPortrait.jsx'), 'utf-8');

it('HomePage Hero: Buttons use fluid min(100%, 150px) preventing narrow mobile overflow', () => {
  assert(homePageContent.includes("minWidth: 'min(100%, 150px)'"), 'Hero buttons must use fluid minWidth');
});

it('HomePage Leadership: Grid uses fluid minmax(min(100%, 280px), 1fr) with responsive gap', () => {
  assert(homePageContent.includes("minmax(min(100%, 280px), 1fr)"), 'Leadership grid must fit within 280px available width on 320px screen');
  assert(homePageContent.includes("gap: 'clamp(1.25rem, 3vw, 2rem)'"), 'Leadership grid must use responsive clamp gap');
});

it('AboutPage Leadership: Grid uses fluid minmax(min(100%, 220px), 1fr)', () => {
  assert(aboutPageContent.includes("minmax(min(100%, 220px), 1fr)"), 'About leadership grid must use fluid minmax');
});

it('LeadershipPortrait: Containers declare maxWidth 100% and aspectRatio 1/1', () => {
  assert(portraitContent.includes("maxWidth: '100%'"), 'LeadershipPortrait must enforce maxWidth: 100%');
  assert(portraitContent.includes("aspectRatio: '1 / 1'"), 'LeadershipPortrait must preserve 1/1 aspect ratio');
});

// 4. Mascot Scroll & Layout Performance
console.log('\n[Test Suite 4: Mascot Scroll Performance & Reflow Elimination]');

const mascotAssistantContent = fs.readFileSync(path.resolve('src/components/Mascot/MascotAssistant.jsx'), 'utf-8');

it('MascotAssistant: Passive scroll listener removed from windowDimensions to eliminate forced reflow loops', () => {
  assert(!mascotAssistantContent.includes("window.addEventListener('scroll', updateDimensions"), 'Mascot must not attach scroll listener to windowDimensions');
  assert(!mascotAssistantContent.includes("window.visualViewport.addEventListener('scroll', updateDimensions"), 'Mascot must not attach scroll listener to visualViewport');
  assert(mascotAssistantContent.includes("window.addEventListener('resize', updateDimensions"), 'Mascot must retain resize listener');
  assert(mascotAssistantContent.includes("window.addEventListener('orientationchange', updateDimensions"), 'Mascot must retain orientationchange listener');
});

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%) ===\n`);
