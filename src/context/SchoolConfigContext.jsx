import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_CONFIG, RECOVERED_ARCHIVE_DATA, HISTORICAL_CALENDAR_ENTRIES } from '../data/schoolContent';

const SchoolConfigContext = createContext();

export const SchoolConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('mountweb_school_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored config", e);
      }
    }
    return DEFAULT_CONFIG;
  });

  const [activeModal, setActiveModal] = useState(null); // { title, message, statusType }
  const [currentEvents, setCurrentEvents] = useState(() => {
    const saved = localStorage.getItem('mountweb_custom_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse custom events", e);
      }
    }
    return [
      {
        id: "curr-1",
        event: "Parent-Teacher Orientation Session",
        date: "2026-10-25",
        category: "Academics",
        status: "Verified Current Event",
        notes: "Campus Auditorium & Virtual Webcast"
      },
      {
        id: "curr-2",
        event: "Annual Science & Innovation Exhibition",
        date: "2026-11-15",
        category: "Extracurricular",
        status: "Verified Current Event",
        notes: "Junior & Senior Wing Labs"
      },
      {
        id: "curr-3",
        event: "Inter-House Sports Meet",
        date: "2026-12-05",
        category: "Athletics",
        status: "Verified Current Event",
        notes: "Main Sports Grounds"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mountweb_school_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('mountweb_custom_events', JSON.stringify(currentEvents));
  }, [currentEvents]);

  const setMode = (mode) => {
    if (mode === 'placeholder') {
      setConfig({
        ...DEFAULT_CONFIG,
        identityMode: 'placeholder'
      });
    } else if (mode === 'archive') {
      setConfig({
        schoolName: RECOVERED_ARCHIVE_DATA.schoolName,
        principalName: RECOVERED_ARCHIVE_DATA.principalName,
        vicePrincipalName: RECOVERED_ARCHIVE_DATA.vicePrincipalName,
        address: RECOVERED_ARCHIVE_DATA.address,
        phone: RECOVERED_ARCHIVE_DATA.phone,
        email: RECOVERED_ARCHIVE_DATA.email,
        academicYear: "2025–2026 (Archival)",
        faithSectionPublished: true,
        identityMode: 'archive'
      });
    }
  };

  const updateConfigField = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
      identityMode: 'custom'
    }));
  };

  const addCurrentEvent = (newEvent) => {
    setCurrentEvents(prev => [
      {
        id: `curr-${Date.now()}`,
        ...newEvent,
        status: "Verified Current Event"
      },
      ...prev
    ]);
  };

  const openActionModal = (title, message, statusType = "info") => {
    setActiveModal({ title, message, statusType });
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <SchoolConfigContext.Provider value={{
      config,
      setConfig,
      setMode,
      updateConfigField,
      activeModal,
      openActionModal,
      closeModal,
      historicalEvents: HISTORICAL_CALENDAR_ENTRIES,
      currentEvents,
      addCurrentEvent
    }}>
      {children}
    </SchoolConfigContext.Provider>
  );
};

export const useSchoolConfig = () => {
  const context = useContext(SchoolConfigContext);
  if (!context) {
    throw new Error("useSchoolConfig must be used within a SchoolConfigProvider");
  }
  return context;
};
