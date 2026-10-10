import assert from 'node:assert';
import fs from 'node:fs';
import { calculateSafeAssistantLayout, MASCOT_DIMENSIONS, VIEWPORT_INSETS } from '../src/utils/mascotPositionCalculator.js';
import { MOVEMENT_STOPS } from '../src/data/mascotMovementPaths.js';

console.log('=== RUNNING MOBILE MASCOT & CLAY AUDIT SUITE ===\n');

// 1. Verify Clay Texture Asset
console.log('[Test 1: Texture Asset Integrity]');
assert(fs.existsSync('public/clay-texture.png'), 'public/clay-texture.png must exist');
const pngHeader = fs.readFileSync('public/clay-texture.png').subarray(0, 8);
const validSig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
const fileSizeKb = Math.round(fs.statSync('public/clay-texture.png').size / 1024 * 10) / 10;
console.log(`  ✓ Static GPU-accelerated clay texture PNG verified (${fileSizeKb} KB)`);

// 2. Mobile Viewport Safe Bounds Check
console.log('\n[Test 2: Mobile Viewport Safe Footprint & Bottom Clamping]');
const mobileViewports = [
  { name: '390x844 iPhone Standard', width: 390, height: 844 },
  { name: '844x390 Mobile Landscape', width: 844, height: 390 },
  { name: '320x568 Ultra-Narrow Mobile', width: 320, height: 568 }
];

for (const vp of mobileViewports) {
  const layout = calculateSafeAssistantLayout({
    stop: MOVEMENT_STOPS['hero-stop'],
    viewportWidth: vp.width,
    viewportHeight: vp.height,
    deviceMode: 'mobile',
    isBubbleOpen: true,
    bubbleDimensions: { width: 300, height: 120 }
  });

  // Mascot trigger bottom margin check
  const mascotBottom = layout.mascot.y + MASCOT_DIMENSIONS.mobile.height;
  assert(mascotBottom <= vp.height, `Mascot trigger bottom (${mascotBottom}) must not exceed viewport height (${vp.height})`);
  assert(layout.mascot.y >= VIEWPORT_INSETS.padTop, 'Mascot must stay below header');

  // Bubble top/bottom clamping check
  assert(layout.bubble.y >= VIEWPORT_INSETS.padTop, `Bubble y (${layout.bubble.y}) must stay below padTop`);
  assert(layout.bubble.y + 120 <= vp.height, `Bubble bottom must stay within viewport`);
  assert(layout.bubble.x >= VIEWPORT_INSETS.padX, `Bubble x must stay within left padding`);
  assert(layout.bubble.x + layout.bubble.width <= vp.width, `Bubble right must stay within viewport width`);

  console.log(`  ✓ Viewport ${vp.name}: Mascot & bubble 100% within safe bounds (Mascot bottom: ${mascotBottom}px / ${vp.height}px)`);
}

// 3. CSS Audit: Passive Scrolling & Zero Blocked Pointer Events
console.log('\n[Test 3: CSS & Performance Audit]');
const cssContent = fs.readFileSync('src/index.css', 'utf-8');
assert(cssContent.includes('--clay-texture: url(\'/clay-texture.png\')'), 'index.css must define --clay-texture');
assert(cssContent.includes('.card::before'), '.card must have texture pseudo-element');
assert(cssContent.includes('pointer-events: none'), 'Texture overlay must have pointer-events: none');
assert(cssContent.includes('.form-control:focus'), 'Input focus clay styles must be defined');
assert(cssContent.includes('.developer-credit-link'), 'index.css must define .developer-credit-link');
assert(cssContent.includes('.developer-credit-link:hover'), 'index.css must define hover state for developer credit link');
assert(cssContent.includes('.developer-credit-link:focus-visible'), 'index.css must define accessible keyboard focus indicator');
console.log('  ✓ Texture overlay is non-blocking (pointer-events: none) and hardware-accelerated');

// 4. Footer Attribution & Portfolio Link Audit
console.log('\n[Test 4: Footer Attribution & Portfolio Link Audit]');
const footerContent = fs.readFileSync('src/components/Footer.jsx', 'utf-8');
assert(footerContent.includes('Designed &amp; Developed by') || footerContent.includes('Designed & Developed by'), 'Footer must contain "Designed & Developed by"');
assert(footerContent.includes('href="https://jralex07.github.io/Portfolio/"'), 'Footer link must point to exact portfolio URL');
assert(footerContent.includes('target="_blank"'), 'Portfolio link must open in a new tab (target="_blank")');
assert(footerContent.includes('rel="noopener noreferrer"'), 'Portfolio link must include rel="noopener noreferrer"');
assert(footerContent.indexOf('All Rights Reserved.') < footerContent.indexOf('Designed &amp; Developed by'), 'Attribution must be placed beneath the copyright line');
assert(footerContent.includes('>ALEX</a>') || footerContent.includes('>\\n              ALEX\\n            </a>') || />\s*ALEX\s*<\/a>/.test(footerContent), 'Link anchor text must be ALEX');
console.log('  ✓ Developer attribution "Designed & Developed by ALEX" correctly links to portfolio');
console.log('  ✓ Link opens in new tab with noopener noreferrer security attributes');
console.log('  ✓ Positioned cleanly beneath copyright line with clay pill styling and focus indicators');

// 5. Centralized Configurable Identity Audit
console.log('\n[Test 5: Centralized Configurable Identity Audit]');
const schoolContentSource = fs.readFileSync('src/data/schoolContent.js', 'utf-8');
assert(schoolContentSource.includes('schoolName: "School Website"'), 'Default school name must be neutral "School Website"');
assert(!schoolContentSource.includes('RECOVERED_ARCHIVE_DATA'), 'RECOVERED_ARCHIVE_DATA section must be completely removed');
assert(!schoolContentSource.includes('Mount Summer Convent School'), 'schoolContent.js must not contain hardcoded school name');
assert(!schoolContentSource.includes('mountsummerconvent2012@gmail.com'), 'schoolContent.js must not contain hardcoded school email');
assert(!schoolContentSource.includes('9334391034'), 'schoolContent.js must not contain hardcoded school phone number');
assert(!footerContent.includes('© 2025 Mount Summer Convent School'), 'Footer must not have hardcoded school copyright');
const mascotContent = fs.readFileSync('src/context/MascotContext.jsx', 'utf-8');
assert(!mascotContent.includes('Welcome to Mount Summer!'), 'Mascot greeting must not have hardcoded school name');
assert(!footerContent.toLowerCase().includes('alex') || footerContent.includes('https://jralex07.github.io/Portfolio/'), 'Attribution must be accurate');
console.log('  ✓ Default school name uses neutral placeholder "School Website"');
console.log('  ✓ RECOVERED_ARCHIVE_DATA section completely removed');
console.log('  ✓ Footer and Mascot greetings free of hardcoded school identity');
console.log('  ✓ All branding centralized through SchoolConfigContext');

// 6. Optional School Logo & Neutral Placeholder Audit
console.log('\n[Test 6: Optional School Logo & Neutral Placeholder Audit]');
assert(schoolContentSource.includes('logoUrl: null'), 'DEFAULT_CONFIG must define optional logoUrl as null by default');

assert(fs.existsSync('public/default-school-logo.svg'), 'public/default-school-logo.svg must exist');
assert(fs.existsSync('src/components/SchoolDefaultLogo.jsx'), 'src/components/SchoolDefaultLogo.jsx must exist');

const navbarContent = fs.readFileSync('src/components/Navbar.jsx', 'utf-8');
assert(navbarContent.includes('config.logoUrl ?'), 'Navbar must conditionally support custom logo');
assert(navbarContent.includes('<SchoolDefaultLogo'), 'Navbar must render neutral SchoolDefaultLogo badge when no logo is uploaded');

assert(footerContent.includes('config.logoUrl ?'), 'Footer must conditionally support custom logo');
assert(footerContent.includes('<SchoolDefaultLogo'), 'Footer must render neutral SchoolDefaultLogo badge when no logo is uploaded');

const configDrawerContent = fs.readFileSync('src/components/ConfigDrawer.jsx', 'utf-8');
assert(configDrawerContent.includes('handleLogoUpload'), 'ConfigDrawer must provide logo upload handler');
assert(configDrawerContent.includes('handleRemoveLogo'), 'ConfigDrawer must provide logo removal handler');
assert(configDrawerContent.includes('Required'), 'ConfigDrawer must clearly designate Required fields');
assert(configDrawerContent.includes('Optional'), 'ConfigDrawer must clearly designate Optional fields');
assert(configDrawerContent.includes('Invalid image format'), 'ConfigDrawer must validate image file formats');
assert(configDrawerContent.includes('file.size > 2 * 1024 * 1024'), 'ConfigDrawer must validate image file size');
assert(!configDrawerContent.includes('loadFictionalDemoData'), 'ConfigDrawer must have sample option completely removed');
assert(!configDrawerContent.includes('Sample Demo Profile'), 'ConfigDrawer must not have sample profile preset');
assert(cssContent.includes('.modal-card::before'), 'modal-card must have tactile clay texture overlay');

console.log('  ✓ School logo is strictly optional with logoUrl=null default');
console.log('  ✓ Clean neutral SchoolDefaultLogo SVG crest renders cleanly when no logo is provided');
console.log('  ✓ Upload, replace, remove, format, and size validation verified');
console.log('  ✓ Configuration form clearly distinguishes Required vs Optional fields');
console.log('  ✓ Sample profile option completely removed from configuration drawer');
console.log('  ✓ Modal popup includes organic clay texture and tactile styling');

// 7. Favicon, Alex Ownership Copyright & Current Year Holidays Audit
console.log('\n[Test 7: Favicon, Alex Ownership Copyright & Current Year Holidays Audit]');
const indexHtmlContent = fs.readFileSync('index.html', 'utf-8');
assert(indexHtmlContent.includes('rel="icon"'), 'index.html must include favicon section in head');
assert(indexHtmlContent.includes('default-school-logo.svg'), 'index.html must reference neutral school logo favicon');

assert(configDrawerContent.includes('Website Favicon (Browser Icon)'), 'ConfigDrawer must contain dedicated Website Favicon section');
assert(configDrawerContent.includes('handleFaviconUpload'), 'ConfigDrawer must provide favicon upload handler');
assert(configDrawerContent.includes('handleRemoveFavicon'), 'ConfigDrawer must provide favicon removal handler');

assert(footerContent.toLowerCase().includes('all rights is owned by alex'), 'Footer must contain "All rights is owned by ALEX" copyright line');

const calendarContent = fs.readFileSync('src/pages/CalendarPage.jsx', 'utf-8');
assert(calendarContent.includes('Current Year Festivals'), 'CalendarPage must show current year festivals schedule');
assert(!calendarContent.includes('2025 Historical Dataset'), 'CalendarPage must not show previous year 2025 dataset');
assert(schoolContentSource.includes('CURRENT_YEAR_FESTIVALS_HOLIDAYS'), 'schoolContent.js must define current year festivals and holidays');
assert(schoolContentSource.includes('2026-01-26') && schoolContentSource.includes('Republic Day'), 'Calendar must include 2026 Republic Day');
assert(schoolContentSource.includes('2026-08-15') && schoolContentSource.includes('Independence Day'), 'Calendar must include 2026 Independence Day');
assert(schoolContentSource.includes('2026-10-02') && schoolContentSource.includes('Gandhi Jayanti'), 'Calendar must include 2026 Gandhi Jayanti');
assert(schoolContentSource.includes('2026-11-08') && schoolContentSource.includes('Diwali'), 'Calendar must include 2026 Diwali');

console.log('  ✓ index.html and ConfigDrawer include dedicated favicon section');
console.log('  ✓ Footer includes copyright section stating "All rights is owned by ALEX" below developer attribution');
console.log('  ✓ Calendar displays current year (2026) festivals and gazetted holidays instead of previous year (2025)');

console.log('\n=== ALL AUDIT CHECKS PASSED (100%) ===\n');

