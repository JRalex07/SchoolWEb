import React, { useState, useEffect } from 'react';
import { SchoolConfigContext } from './SchoolConfigContext';
import { DEFAULT_CONFIG, HISTORICAL_CALENDAR_ENTRIES } from '../data/schoolContent';

export const SchoolConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('mountweb_school_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.identityMode === 'placeholder' || parsed.identityMode === 'demo') {
          parsed.identityMode = 'demo';
          if (!parsed.schoolName || parsed.schoolName === '[Your School Name]') parsed.schoolName = DEFAULT_CONFIG.schoolName;
          if (!parsed.principalName || parsed.principalName.includes('[')) parsed.principalName = DEFAULT_CONFIG.principalName;
          if (!parsed.vicePrincipalName || parsed.vicePrincipalName.includes('[')) parsed.vicePrincipalName = DEFAULT_CONFIG.vicePrincipalName;
          if (!parsed.address || parsed.address.includes('[') || parsed.address.includes('Education City')) parsed.address = DEFAULT_CONFIG.address;
          if (!parsed.phone || parsed.phone.includes('[') || parsed.phone.includes('xxxxxxxxx')) parsed.phone = DEFAULT_CONFIG.phone;
          if (!parsed.email || parsed.email.includes('[') || parsed.email.includes('school-prototype.edu')) parsed.email = DEFAULT_CONFIG.email;
          if (!parsed.academicYear || parsed.academicYear.includes('[')) parsed.academicYear = DEFAULT_CONFIG.academicYear;
        }
        if (parsed.principalPhotoUrl === undefined) parsed.principalPhotoUrl = null;
        if (parsed.vicePrincipalPhotoUrl === undefined) parsed.vicePrincipalPhotoUrl = null;
        if (!parsed.email || parsed.email.includes('[') || parsed.email === '[EMAIL_ADDRESS]') {
          parsed.email = DEFAULT_CONFIG.email;
        }
        return parsed;
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
    if (mode === 'demo' || mode === 'placeholder' || mode === 'default') {
      setConfig({
        ...DEFAULT_CONFIG,
        identityMode: 'demo'
      });
    }
  };

  const resetToDefault = () => {
    setConfig({ ...DEFAULT_CONFIG });
  };

  const updateConfigField = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
      identityMode: 'custom'
    }));
  };

  const setLogoUrl = (logoUrl) => {
    updateConfigField('logoUrl', logoUrl);
  };

  const removeLogo = () => {
    updateConfigField('logoUrl', null);
  };

  const setFaviconUrl = (faviconUrl) => {
    updateConfigField('faviconUrl', faviconUrl);
  };

  const removeFavicon = () => {
    updateConfigField('faviconUrl', null);
  };

  // Dynamically synchronize favicon with document head
  useEffect(() => {
    const targetFavicon = config.faviconUrl || config.logoUrl || '/default-school-logo.svg';
    let faviconLink = document.getElementById('app-favicon') || document.querySelector("link[rel*='icon']");
    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.id = 'app-favicon';
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }
    faviconLink.href = targetFavicon;
  }, [config.faviconUrl, config.logoUrl]);

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
      resetToDefault,
      updateConfigField,
      setLogoUrl,
      removeLogo,
      setFaviconUrl,
      removeFavicon,
      activeModal,
      openActionModal,
      closeModal,
      historicalEvents: HISTORICAL_CALENDAR_ENTRIES,
      currentYearFestivals: HISTORICAL_CALENDAR_ENTRIES,
      currentEvents,
      addCurrentEvent
    }}>
      {children}
    </SchoolConfigContext.Provider>
  );
};
