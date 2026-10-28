import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSchoolConfig } from '../context/SchoolConfigContext';

export const DOMAIN = 'https://school.alex.runs-on.dev';

export const ROUTE_METADATA = {
  '/': {
    title: 'Excellence in Education & Holistic Development',
    description: 'Explore our school website portal featuring academic excellence, leadership development, campus activities, current year calendar, and admissions guidelines.',
    heading: 'Discover Excellence'
  },
  '/about': {
    title: 'About Our Institution | Mission, Vision & Leadership',
    description: 'Learn about our educational philosophy, core mission themes, institutional heritage, and administrative leadership hierarchy.',
    heading: 'Mission, Vision & Leadership'
  },
  '/admissions': {
    title: 'Admissions & Enrollment Guidelines | Academic Term 2026–2027',
    description: 'Review admissions guidelines, eligibility criteria, required documentation checklists, and direct contact inquiry channels.',
    heading: 'Admissions Information'
  },
  '/academics': {
    title: 'Academic Programs & Campus Life | Four Pillars',
    description: 'Discover our four foundational student dimensions: core intellectual academics, athletics, creative arts societies, and modern campus infrastructure.',
    heading: 'Academic Programs & Campus Life'
  },
  '/calendar': {
    title: 'School Calendar & Holidays | Current Year 2026 Milestones',
    description: 'Verified academic term dates, national holidays, cultural festivals including Republic Day, Independence Day, Gandhi Jayanti, and Diwali 2026.',
    heading: 'School Calendar & Holidays'
  },
  '/contact': {
    title: 'Contact Administrative Office & Campus Location',
    description: 'Reach our administrative staff via verified telephone, email, or visit our campus. Submit direct inquiries through our contact form.',
    heading: 'Contact & Location Details'
  },
  '/faith': {
    title: 'Faith & Values | Ethical Character Formation',
    description: 'Ethical foundations, spiritual formation, character building, and compassionate community service initiatives.',
    heading: 'Faith & Values'
  }
};

export const SEO = () => {
  const location = useLocation();
  const { config } = useSchoolConfig();
  const pathname = location.pathname;

  useEffect(() => {
    const schoolName = config?.schoolName || 'School Website';
    const routeInfo = ROUTE_METADATA[pathname] || {
      title: 'Page Not Found',
      description: 'The requested page could not be located on the campus directory. Explore our navigation menu to return safely.',
      heading: '404 - Campus Page Not Found'
    };

    // 1. Dynamic Page Title
    const fullTitle = `${routeInfo.title} | ${schoolName}`;
    document.title = fullTitle;

    // 2. Meta Helper
    const setMetaTag = (attrName, attrValue, content) => {
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 3. Primary Meta Tags
    setMetaTag('name', 'description', routeInfo.description);
    setMetaTag('name', 'author', 'ALEX');
    setMetaTag('name', 'robots', 'index, follow');

    // 4. Canonical URL (Strictly using production domain https://school.alex.runs-on.dev)
    const canonicalUrl = `${DOMAIN}${pathname === '/' ? '' : pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 5. Open Graph Metadata
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', routeInfo.description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:site_name', schoolName);
    setMetaTag('property', 'og:image', `${DOMAIN}/default-school-logo.svg`);

    // 6. Twitter Card Metadata
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', routeInfo.description);
    setMetaTag('name', 'twitter:image', `${DOMAIN}/default-school-logo.svg`);

    // 7. Schema.org JSON-LD Structured Data
    let schemaScript = document.getElementById('schema-jsonld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'schema-jsonld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": schoolName,
      "url": DOMAIN,
      "logo": `${DOMAIN}/default-school-logo.svg`,
      "description": routeInfo.description,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": config?.address || "Campus Address"
      },
      "telephone": config?.phone || "",
      "email": config?.email || "",
      "employee": [
        {
          "@type": "Person",
          "name": config?.principalName || "Dr. Alistair Vance",
          "jobTitle": "Principal"
        },
        {
          "@type": "Person",
          "name": config?.vicePrincipalName || "Prof. Kenneth Morales",
          "jobTitle": "Vice Principal"
        }
      ]
    };

    schemaScript.textContent = JSON.stringify(structuredData);
  }, [pathname, config]);

  return null;
};

export default SEO;

