import React, { useState } from 'react';
import { useSchoolConfig } from '../context/SchoolConfigContext';
import {
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  Filter,
  History,
  CheckCircle,
  Tag,
  AlertCircle
} from 'lucide-react';

import { useMascot } from '../context/MascotContext';

export const CalendarPage = () => {
  const { config, historicalEvents, currentEvents, addCurrentEvent } = useSchoolConfig();
  const { setFieldFocus, handleFieldChange, clearFieldFocus } = useMascot();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for adding verified current events
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('Academics');
  const [newEventNotes, setNewEventNotes] = useState('');

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDate) return;

    addCurrentEvent({
      event: newEventTitle,
      date: newEventDate,
      category: newEventCategory,
      notes: newEventNotes || 'Verified school event'
    });

    setNewEventTitle('');
    setNewEventDate('');
    setNewEventNotes('');
    setShowAddForm(false);
  };

  const filterItems = (items) => {
    if (selectedCategory === 'All') return items;
    return items.filter(i => i.category.toLowerCase() === selectedCategory.toLowerCase());
  };

  const filteredCurrent = filterItems(currentEvents);
  const filteredHistorical = filterItems(historicalEvents);

  return (
    <main id="main-content">
      {/* Page Header */}
      <section style={{ background: 'var(--color-primary)', color: '#ffffff', padding: '4rem 0 3.5rem 0' }}>
        <div className="container">
          <span className="badge" style={{ background: 'rgba(201, 138, 44, 0.25)', color: 'var(--color-accent-light)', border: '1px solid rgba(201,138,44,0.4)', marginBottom: '1rem' }}>
            Academic Schedules & Milestones
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2.75rem', marginBottom: '1rem' }}>
            School Calendar ({config.academicYear})
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Official dates, academic observances, and segregated historical archive records.
          </p>
        </div>
      </section>

      {/* Main Calendar View */}
      <section className="section" data-section-id="calendar-schedule">
        <div className="container">
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['All', 'Academics', 'Athletics', 'Extracurricular'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedCategory(cat)}
                  data-helper-title={`Filter: ${cat}`}
                  data-helper-description={`Display calendar entries belonging to the ${cat} category.`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add Verified Event Action */}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowAddForm(prev => !prev)}
              data-helper-title="Add Calendar Entry"
              data-helper-description="Open interactive form to record verified current-year school milestones."
            >
              <PlusCircle size={16} />
              {showAddForm ? 'Close Add Form' : 'Add Verified Current Event'}
            </button>
          </div>

          {/* Add Event Form Modal/Drawer */}
          {showAddForm && (
            <div className="card" style={{ marginBottom: '3rem', borderTop: '4px solid var(--color-success)', padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                Add Verified School Event to Active Schedule
              </h3>
              <form onSubmit={handleAddEventSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Event Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Annual Sports Championship"
                      value={newEventTitle}
                      onChange={(e) => {
                        setNewEventTitle(e.target.value);
                        handleFieldChange('eventTitle', e.target.value, null, e.target.getBoundingClientRect());
                      }}
                      onFocus={(e) => setFieldFocus('eventTitle', e.target.getBoundingClientRect())}
                      onBlur={() => clearFieldFocus('eventTitle')}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Date (YYYY-MM-DD) *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newEventDate}
                      onChange={(e) => {
                        setNewEventDate(e.target.value);
                        handleFieldChange('eventDate', e.target.value, null, e.target.getBoundingClientRect());
                      }}
                      onFocus={(e) => setFieldFocus('eventDate', e.target.getBoundingClientRect())}
                      onBlur={() => clearFieldFocus('eventDate')}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-control"
                      value={newEventCategory}
                      onChange={(e) => setNewEventCategory(e.target.value)}
                    >
                      <option value="Academics">Academics</option>
                      <option value="Athletics">Athletics</option>
                      <option value="Extracurricular">Extracurricular</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Event Details / Venue</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Main Auditorium / Assembly Hall"
                    value={newEventNotes}
                    onChange={(e) => setNewEventNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Verified Event
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Section 1: CURRENT / UPCOMING EVENTS */}
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <CheckCircle size={22} color="var(--color-success)" />
              <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Current School Year Schedule</h2>
              <span className="badge badge-success">Verified Active Events</span>
            </div>

            {filteredCurrent.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No current events found for category: <strong>{selectedCategory}</strong>.
              </div>
            ) : (
              <div className="grid-3">
                {filteredCurrent.map((evt) => (
                  <div key={evt.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge badge-success">{evt.category}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} /> {evt.date}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{evt.event}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                      {evt.notes}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: HISTORICAL 2025 RECOVERED ARCHIVE ENTRIES */}
          <div>
            <div className="notice-box warning" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.25rem', color: '#92400e' }}>
                    Historical Archive Notice (Source Year: 2025)
                  </strong>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#78350f', lineHeight: 1.6 }}>
                    All entries below were recovered from indexed 2025 content. As required by verification rules, they are historical records and are NOT presented as upcoming events. Category labels preserve the indexed homepage reporting.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <History size={22} color="var(--color-warning)" />
              <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Recovered Historical Calendar Records</h2>
              <span className="badge badge-warning">2025 Historical Dataset</span>
            </div>

            {filteredHistorical.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No historical records found for category: <strong>{selectedCategory}</strong>.
              </div>
            ) : (
              <div className="grid-3">
                {filteredHistorical.map((evt) => (
                  <div key={evt.id} className="card" style={{ opacity: 0.95 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <span className="badge badge-neutral">{evt.category}</span>
                      <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 600 }}>
                        {evt.date}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{evt.event}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                      {evt.notes}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px dashed #e2e8f0', paddingTop: '0.5rem' }}>
                      Status: {evt.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
