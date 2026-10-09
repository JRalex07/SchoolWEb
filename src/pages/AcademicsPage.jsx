import React from 'react';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import { HERO_DATA } from '../data/schoolContent';
import { 
  GraduationCap, 
  Trophy, 
  Sparkles, 
  Building2, 
  BookOpen, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Compass
} from 'lucide-react';

export const AcademicsPage = () => {
  const { config } = useSchoolConfig();

  const categories = [
    {
      id: "academics",
      title: "Core Academics",
      description: "Our academic vision emphasizes conceptual mastery, active inquiry, and structured analytical thinking across foundational disciplines.",
      details: "Curriculum pacing and instructional methods are designed to build academic rigor while supporting diverse learning paces.",
      icon: GraduationCap,
      tag: "Intellectual Rigor",
      missingNotice: "Detailed grade-by-grade syllabi, textbook lists, and examination criteria pending verified curriculum publication."
    },
    {
      id: "athletics",
      title: "Athletics & Physical Education",
      description: "Physical fitness, tactical teamwork, and personal endurance are nurtured through structured sports training and inter-house events.",
      details: "Encouraging sportsmanship, fair play, and healthy lifestyle choices through both competitive and recreational sports programs.",
      icon: Trophy,
      tag: "Sportsmanship",
      missingNotice: "Facility dimensions, dedicated sports coaching staff, and seasonal tournament rosters pending verified administrative release."
    },
    {
      id: "extracurricular",
      title: "Extracurricular & Creative Arts",
      description: "Beyond the classroom, students explore artistic expression, vocal performance, robotics, debates, and community civic initiatives.",
      details: "Clubs and societies foster leadership, spontaneous problem solving, and collaborative empathy among student peers.",
      icon: Sparkles,
      tag: "Holistic Discovery",
      missingNotice: "Specific club catalogs, meeting schedules, and faculty advisor directories pending verified institutional data."
    },
    {
      id: "campus",
      title: "Campus Environment & Infrastructure",
      description: "A secure, purpose-built campus environment that facilitates focused concentration, interactive discovery, and student safety.",
      details: "Designed to provide modern classrooms, dedicated activity spaces, and supportive learning zones.",
      icon: Building2,
      tag: "Safe & Supportive",
      missingNotice: "Laboratory inventories, library catalog statistics, and transport route maps pending verified physical campus audit."
    }
  ];

  return (
    <main id="main-content">
      {/* Header */}
      <section style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '4rem 0 3.5rem 0' }}>
        <div className="container">
          <span className="badge" style={{ background: 'rgba(201, 138, 44, 0.25)', color: 'var(--color-accent-light)', border: '1px solid rgba(201,138,44,0.4)', marginBottom: '1rem' }}>
            Curriculum & Programs
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.75rem', marginBottom: '1rem' }}>
            Academic Programs & Campus Life
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Nurturing academic prowess, athletic discipline, creative expression, and ethical character at {config.schoolName}.
          </p>
        </div>
      </section>

      {/* Overview & Program Pillars */}
      <section className="section" data-section-id="academics-curriculum">
        <div className="container">
          <div className="section-header">
            <span className="section-tagline">Foundational Pillars</span>
            <h2 className="section-title">Four Dimensions of Student Life</h2>
            <p className="section-description">
              Our comprehensive approach balances intellectual rigor with physical agility and creative exploration.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div 
                  key={cat.id} 
                  id={cat.id}
                  className="card" 
                  style={{ 
                    padding: '2.25rem',
                    borderLeft: '4px solid var(--color-accent)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '12px', 
                          background: 'var(--color-accent-soft)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <Icon size={26} color="var(--color-accent)" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{cat.title}</h3>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600 }}>{cat.tag}</span>
                      </div>
                    </div>

                    <span className="badge badge-info">Verified Category</span>
                  </div>

                  <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
                    {cat.description}
                  </p>

                  <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                    {cat.details}
                  </p>

                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '0.85rem 1.25rem', fontSize: '0.825rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0 }} />
                    <span><strong>Data Status:</strong> {cat.missingNotice}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};
