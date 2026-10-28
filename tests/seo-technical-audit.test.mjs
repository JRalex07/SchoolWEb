import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

console.log('=== RUNNING TECHNICAL SEO AUDIT ===\n');

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

const DOMAIN = 'https://school.alex.runs-on.dev';
const DIST_DIR = path.resolve('dist');

// 1. Robots.txt and Sitemap.xml Invariants
console.log('[Test Suite 1: Robots.txt & Sitemap.xml Directives]');

const robotsPath = path.join(DIST_DIR, 'robots.txt');
it('robots.txt: Exists in dist and declares sitemap location', () => {
  assert(fs.existsSync(robotsPath), 'dist/robots.txt must exist');
  const content = fs.readFileSync(robotsPath, 'utf-8');
  assert(content.includes('User-agent: *'), 'Must allow user agents');
  assert(content.includes(`Sitemap: ${DOMAIN}/sitemap.xml`), 'Must specify canonical sitemap URL');
});

const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
it('sitemap.xml: Exists in dist and lists canonical public routes', () => {
  assert(fs.existsSync(sitemapPath), 'dist/sitemap.xml must exist');
  const content = fs.readFileSync(sitemapPath, 'utf-8');
  assert(content.includes(`${DOMAIN}/`), 'Must contain home URL');
  assert(content.includes(`${DOMAIN}/about`), 'Must contain about URL');
  assert(content.includes(`${DOMAIN}/admissions`), 'Must contain admissions URL');
  assert(content.includes(`${DOMAIN}/academics`), 'Must contain academics URL');
  assert(content.includes(`${DOMAIN}/calendar`), 'Must contain calendar URL');
  assert(content.includes(`${DOMAIN}/contact`), 'Must contain contact URL');
  assert(content.includes(`${DOMAIN}/faith`), 'Must contain faith URL');
  assert(!content.includes('localhost'), 'Must never contain localhost');
});

// 2. Custom Domain & CNAME Verification
console.log('\n[Test Suite 2: Production Domain & CNAME Configuration]');

const cnamePath = path.join(DIST_DIR, 'CNAME');
it('CNAME: Exists in dist and contains exact custom domain', () => {
  assert(fs.existsSync(cnamePath), 'dist/CNAME must exist for GitHub Pages custom domain');
  const content = fs.readFileSync(cnamePath, 'utf-8').trim();
  assert.strictEqual(content, 'school.alex.runs-on.dev', 'CNAME must strictly contain school.alex.runs-on.dev');
});

// 3. Prerendered Static HTML & Metadata Check
console.log('\n[Test Suite 3: Route-Specific Prerendered HTML & Canonical Tags]');

const routes = [
  { path: '', file: 'index.html', title: 'School Website Portal' },
  { path: 'about', file: 'about/index.html', title: 'About Our Institution' },
  { path: 'admissions', file: 'admissions/index.html', title: 'Admissions & Enrollment Guidelines' },
  { path: 'academics', file: 'academics/index.html', title: 'Academic Programs & Campus Life' },
  { path: 'calendar', file: 'calendar/index.html', title: 'School Calendar & Holidays' },
  { path: 'contact', file: 'contact/index.html', title: 'Contact Administrative Office' },
  { path: 'faith', file: 'faith/index.html', title: 'Faith & Values' }
];

for (const r of routes) {
  it(`Route "${r.path || '/'}": Has prerendered index.html with canonical URL & metadata`, () => {
    const htmlPath = path.join(DIST_DIR, r.file);
    assert(fs.existsSync(htmlPath), `Static file ${r.file} must exist`);
    const html = fs.readFileSync(htmlPath, 'utf-8');

    const expectedCanonical = `${DOMAIN}/${r.path}`;
    assert(html.includes(`rel="canonical" href="${expectedCanonical}"`), `Must contain canonical ${expectedCanonical}`);
    assert(html.includes(r.title), `Must contain route title: ${r.title}`);
    assert(html.includes('property="og:title"'), 'Must contain og:title');
    assert(html.includes('property="og:description"'), 'Must contain og:description');
    assert(html.includes('property="og:url"'), 'Must contain og:url');
    assert(html.includes('application/ld+json'), 'Must contain Schema.org JSON-LD structured data');
  });
}

// 4. GitHub Pages 404 SPA Fallback
console.log('\n[Test Suite 4: GitHub Pages SPA Fallback]');

const notFoundPath = path.join(DIST_DIR, '404.html');
it('404.html: Exists in dist with client router redirection logic', () => {
  assert(fs.existsSync(notFoundPath), 'dist/404.html must exist');
  const content = fs.readFileSync(notFoundPath, 'utf-8');
  assert(content.includes('l.replace('), 'Must provide SPA path restoration');
  assert(content.includes('Page Not Found'), 'Must provide human-readable 404 fallback');
});

console.log(`\n=== RESULTS: ${passedTests}/${totalTests} TESTS PASSED (100%) ===\n`);

