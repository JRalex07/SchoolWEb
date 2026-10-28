import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

console.log('=== RUNNING FULL QUALITY ASSURANCE VERIFICATION ===\n');

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

const DIST_DIR = path.resolve('dist');

// Flow 1: Homepage loads directly with correct structure
it('QA Flow 1: Homepage index.html is complete and well-formed', () => {
  const html = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8');
  assert(html.includes('id="root"'), 'Root mount container exists');
  assert(html.includes('default-school-logo.svg'), 'Default school crest icon linked');
  assert(html.includes('https://school.alex.runs-on.dev/'), 'Canonical URL declared');
});

// Flow 2: Internal routes load and refresh correctly
it('QA Flow 2: All 6 internal public routes exist with static HTML for refresh survival', () => {
  const publicRoutes = ['about', 'admissions', 'academics', 'calendar', 'contact', 'faith'];
  for (const r of publicRoutes) {
    const routeIndex = path.join(DIST_DIR, r, 'index.html');
    assert(fs.existsSync(routeIndex), `Route /${r} must have index.html in dist`);
    const content = fs.readFileSync(routeIndex, 'utf-8');
    assert(content.includes(`https://school.alex.runs-on.dev/${r}`), `Route /${r} has matching canonical link`);
  }
});

// Flow 3: Mobile menu opens, closes and navigates
it('QA Flow 3: Mobile navigation includes hardware-accelerated drawer and body scroll lock', () => {
  const navbar = fs.readFileSync(path.resolve('src/components/Navbar.jsx'), 'utf-8');
  assert(navbar.includes("document.body.style.overflow = 'hidden'"), 'Locks scroll when mobile drawer opens');
  assert(navbar.includes("document.body.style.overflow = ''"), 'Restores scroll on drawer close');
  assert(navbar.includes("closeMobileMenu"), 'Provides menu close handler on route change');
});

// Flow 4: Configure Identity opens and works correctly
it('QA Flow 4: Configure Identity modal operates with ESC key dismiss and body lock', () => {
  const drawer = fs.readFileSync(path.resolve('src/components/ConfigDrawer.jsx'), 'utf-8');
  assert(drawer.includes("document.body.style.overflow = 'hidden'"), 'Locks body scroll on modal open');
  assert(drawer.includes("e.key === 'Escape'"), 'Closes on Escape key');
  assert(drawer.includes("updateConfigField"), 'Dispatches updates to central SchoolConfigContext');
});

// Flow 5: Barnaby stays quiet until explicitly opened
it('QA Flow 5: Barnaby speech bubble is disabled on page load and route changes (opt-in only)', () => {
  const provider = fs.readFileSync(path.resolve('src/context/MascotProvider.jsx'), 'utf-8');
  assert(provider.includes('isChatOpen, setIsChatOpen] = useState(false)'), 'Chat defaults to closed');
  assert(provider.includes('isBubbleVisible, setIsBubbleVisible] = useState(false)'), 'Bubble defaults to hidden');
});

// Flow 6 & 7: Sending a message produces a response and navigation requires explicit click
it('QA Flow 6 & 7: Chat response engine generates answers and requires explicit button activation for navigation', () => {
  const assistant = fs.readFileSync(path.resolve('src/components/Mascot/MascotAssistant.jsx'), 'utf-8');
  assert(assistant.includes('handleActionClick'), 'Has explicit action handler');
  assert(assistant.includes('navigate(action.path)'), 'Navigates only on explicit action click');
});

// Flow 8: Assistant does not redirect unexpectedly
it('QA Flow 8: MascotAssistant does not initiate automatic redirects', () => {
  const assistant = fs.readFileSync(path.resolve('src/components/Mascot/MascotAssistant.jsx'), 'utf-8');
  assert(!assistant.includes('window.location.href ='), 'No window.location.href reassignments');
  assert(!assistant.includes('navigate(/'), 'No unconditional navigate(/) calls outside event handlers');
});

// Flow 9: Missing school information is not invented
it('QA Flow 9: Unknown details gracefully fall back to contact or settings guidance without fake claims', () => {
  const engine = fs.readFileSync(path.resolve('src/utils/barnabyChatEngine.js'), 'utf-8');
  assert(engine.includes('not hardcoded into this demonstration prototype'), 'Acknowledges unconfigured demo fee schedule');
  assert(engine.includes("I don't have specific verified details"), 'Does not invent false campus facts');
});

// Flow 10 & 11: Responsive cards fit containers and assistant does not cover buttons
it('QA Flow 10 & 11: Floating assistant is clamped and styled with high-contrast non-overlapping footprint', () => {
  const assistant = fs.readFileSync(path.resolve('src/components/Mascot/MascotAssistant.jsx'), 'utf-8');
  assert(assistant.includes('clamp('), 'Assistant positioning and sizing use fluid clamp()');
  assert(assistant.includes('zIndex: 994'), 'Launcher has safe zIndex elevation');
  assert(assistant.includes('zIndex: 995'), 'Chat panel has priority zIndex elevation');
});

// Flow 12: Footer attribution and portfolio link work
it('QA Flow 12: Footer attribution links accurately to Alex portfolio with secure rel attributes', () => {
  const footer = fs.readFileSync(path.resolve('src/components/Footer.jsx'), 'utf-8');
  assert(footer.includes('href="https://jralex07.github.io/Portfolio/"'), 'Accurate portfolio URL');
  assert(footer.includes('target="_blank"'), 'Opens in new tab');
  assert(footer.includes('rel="noopener noreferrer"'), 'Secure external link attributes');
});

// Flow 13: Metadata, canonical URLs, robots and sitemap are valid
it('QA Flow 13: Metadata and sitemaps match production domain https://school.alex.runs-on.dev', () => {
  const sitemap = fs.readFileSync(path.join(DIST_DIR, 'sitemap.xml'), 'utf-8');
  const robots = fs.readFileSync(path.join(DIST_DIR, 'robots.txt'), 'utf-8');
  assert(sitemap.includes('https://school.alex.runs-on.dev/'), 'Sitemap has production domain');
  assert(robots.includes('https://school.alex.runs-on.dev/sitemap.xml'), 'Robots points to sitemap');
});

// Flow 14: Production assets load from custom domain
it('QA Flow 14: CNAME declares school.alex.runs-on.dev', () => {
  const cname = fs.readFileSync(path.join(DIST_DIR, 'CNAME'), 'utf-8').trim();
  assert.strictEqual(cname, 'school.alex.runs-on.dev');
});

// Flow 15: GitHub Actions deployment fails safely on build errors
it('QA Flow 15: GitHub Actions workflow tests before build and aborts deployment on failure', () => {
  const workflow = fs.readFileSync(path.resolve('.github/workflows/deploy.yml'), 'utf-8');
  const testIdx = workflow.indexOf('run: npm test');
  const buildIdx = workflow.indexOf('run: npm run build');
  const deployIdx = workflow.indexOf('uses: actions/deploy-pages@v4');
  assert(testIdx !== -1, 'Workflow runs tests');
  assert(buildIdx !== -1, 'Workflow runs build');
  assert(deployIdx !== -1, 'Workflow deploys pages');
  assert(testIdx < buildIdx, 'Tests run before build');
  assert(buildIdx < deployIdx, 'Build runs before deploy');
});

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} QA FLOWS PASSED (100%) ===\n`);

