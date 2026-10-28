import fs from 'node:fs';
import path from 'node:path';

const DOMAIN = 'https://school.alex.runs-on.dev';
const DIST_DIR = path.resolve('dist');

const ROUTE_DATA = [
  {
    path: '/about',
    title: 'About Our Institution | Mission, Vision & Leadership | School Website',
    description: 'Learn about our educational philosophy, core mission themes, institutional heritage, and administrative leadership hierarchy.',
    heading: 'Mission, Vision & Leadership'
  },
  {
    path: '/admissions',
    title: 'Admissions & Enrollment Guidelines | Academic Term 2026–2027 | School Website',
    description: 'Review admissions guidelines, eligibility criteria, required documentation checklists, and direct contact inquiry channels.',
    heading: 'Admissions Information'
  },
  {
    path: '/academics',
    title: 'Academic Programs & Campus Life | Four Pillars | School Website',
    description: 'Discover our four foundational student dimensions: core intellectual academics, athletics, creative arts societies, and modern campus infrastructure.',
    heading: 'Academic Programs & Campus Life'
  },
  {
    path: '/calendar',
    title: 'School Calendar & Holidays | Current Year 2026 Milestones | School Website',
    description: 'Verified academic term dates, national holidays, cultural festivals including Republic Day, Independence Day, Gandhi Jayanti, and Diwali 2026.',
    heading: 'School Calendar & Holidays'
  },
  {
    path: '/contact',
    title: 'Contact Administrative Office & Campus Location | School Website',
    description: 'Reach our administrative staff via verified telephone, email, or visit our campus. Submit direct inquiries through our contact form.',
    heading: 'Contact & Location Details'
  },
  {
    path: '/faith',
    title: 'Faith & Values | Ethical Character Formation | School Website',
    description: 'Ethical foundations, spiritual formation, character building, and compassionate community service initiatives.',
    heading: 'Faith & Values'
  }
];

function run() {
  console.log('=== PRERENDERING STATIC ROUTE METADATA FOR GITHUB PAGES ===\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error('Error: dist directory not found. Please run vite build first.');
    process.exit(1);
  }

  const baseHtmlPath = path.join(DIST_DIR, 'index.html');
  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

  // Ensure CNAME exists in dist
  const cnameSrc = path.resolve('public/CNAME');
  if (fs.existsSync(cnameSrc)) {
    fs.copyFileSync(cnameSrc, path.join(DIST_DIR, 'CNAME'));
    console.log('  ✓ Preserved CNAME in dist (school.alex.runs-on.dev)');
  }

  // Ensure 404.html exists in dist
  const notFoundSrc = path.resolve('public/404.html');
  if (fs.existsSync(notFoundSrc)) {
    fs.copyFileSync(notFoundSrc, path.join(DIST_DIR, '404.html'));
    console.log('  ✓ Copied 404.html SPA fallback to dist');
  }

  // Ensure sitemap.xml exists in dist
  const sitemapSrc = path.resolve('public/sitemap.xml');
  const sitemapDest = path.join(DIST_DIR, 'sitemap.xml');
  if (fs.existsSync(sitemapSrc)) {
    fs.copyFileSync(sitemapSrc, sitemapDest);
    console.log('  ✓ Verified sitemap.xml in dist');
  } else {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${DOMAIN}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${DOMAIN}/about</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${DOMAIN}/admissions</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${DOMAIN}/academics</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${DOMAIN}/calendar</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${DOMAIN}/contact</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${DOMAIN}/faith</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
</urlset>`;
    fs.writeFileSync(sitemapDest, sitemapContent, 'utf-8');
    console.log('  ✓ Generated fallback sitemap.xml in dist');
  }

  // Ensure robots.txt exists in dist
  const robotsSrc = path.resolve('public/robots.txt');
  const robotsDest = path.join(DIST_DIR, 'robots.txt');
  if (fs.existsSync(robotsSrc)) {
    fs.copyFileSync(robotsSrc, robotsDest);
    console.log('  ✓ Verified robots.txt in dist');
  } else {
    const robotsContent = `# robots.txt for ${DOMAIN}\nUser-agent: *\nAllow: /\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
    fs.writeFileSync(robotsDest, robotsContent, 'utf-8');
    console.log('  ✓ Generated fallback robots.txt in dist');
  }

  // Generate static HTML for each public route
  for (const route of ROUTE_DATA) {
    const canonicalUrl = `${DOMAIN}${route.path}`;
    let routeHtml = baseHtml;

    // Replace Title
    routeHtml = routeHtml.replace(
      /<title>.*?<\/title>/i,
      `<title>${route.title}</title>`
    );

    // Replace Meta Description
    routeHtml = routeHtml.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${route.description}" />`
    );

    // Replace Canonical Link
    routeHtml = routeHtml.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );

    // Replace Open Graph Tags
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${route.title}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${route.description}" />`
    );
    routeHtml = routeHtml.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );

    // Inject Schema.org JSON-LD
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": "School Website",
      "url": DOMAIN,
      "logo": `${DOMAIN}/default-school-logo.svg`,
      "description": route.description
    });
    const schemaScript = `\n  <script type="application/ld+json">${jsonLd}</script>`;
    routeHtml = routeHtml.replace('</head>', `${schemaScript}\n</head>`);

    // Write route folder and index.html
    const targetDir = path.join(DIST_DIR, route.path.slice(1));
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.writeFileSync(path.join(targetDir, 'index.html'), routeHtml, 'utf-8');
    console.log(`  ✓ Generated static prerendered HTML: ${route.path}/index.html`);
  }

  console.log('\n=== ALL PUBLIC ROUTES SUCCESSFULLY PRERENDERED ===\n');
}

run();

