import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SchoolConfigProvider } from './context/SchoolConfigProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { NotificationModal } from './components/NotificationModal';
import { MascotProvider } from './context/MascotProvider';
import { MascotAssistant } from './components/Mascot/MascotAssistant';

// Code-split pages for performance optimization & instantaneous initial load
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const AdmissionsPage = lazy(() => import('./pages/AdmissionsPage').then(m => ({ default: m.AdmissionsPage })));
const AcademicsPage = lazy(() => import('./pages/AcademicsPage').then(m => ({ default: m.AcademicsPage })));
const FaithPage = lazy(() => import('./pages/FaithPage').then(m => ({ default: m.FaithPage })));
const CalendarPage = lazy(() => import('./pages/CalendarPage').then(m => ({ default: m.CalendarPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Scroll to top on route change while preserving in-page anchor behavior
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      // If component content was rendered async or slightly delayed
      const frame = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
      return () => cancelAnimationFrame(frame);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// Lightweight, accessible loading skeleton for fast transitions without layout shift
const PageSkeleton = () => (
  <main id="main-content" className="section" style={{ minHeight: '70vh', padding: '3rem 1rem' }} aria-busy="true" aria-label="Loading page content">
    <div className="container" style={{ maxWidth: '960px' }}>
      <div style={{ height: '38px', width: '45%', background: '#e2e8f0', borderRadius: '8px', marginBottom: '1.5rem', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '20px', width: '75%', background: '#f1f5f9', borderRadius: '6px', marginBottom: '1rem', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: '20px', width: '60%', background: '#f1f5f9', borderRadius: '6px', marginBottom: '2.5rem', animation: 'pulse 1.5s infinite' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <div style={{ height: '180px', background: '#ffffff', borderRadius: '16px', boxShadow: 'var(--clay-card)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '180px', background: '#ffffff', borderRadius: '16px', boxShadow: 'var(--clay-card)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ height: '180px', background: '#ffffff', borderRadius: '16px', boxShadow: 'var(--clay-card)', animation: 'pulse 1.5s infinite' }} />
      </div>
    </div>
  </main>
);

export function App() {
  return (
    <SchoolConfigProvider>
      <BrowserRouter>
        <MascotProvider>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: '1 0 auto' }}>
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/admissions" element={<AdmissionsPage />} />
                  <Route path="/academics" element={<AcademicsPage />} />
                  <Route path="/faith" element={<FaithPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
            <NotificationModal />
            <MascotAssistant />
          </div>
        </MascotProvider>
      </BrowserRouter>
    </SchoolConfigProvider>
  );
}

export default App;
