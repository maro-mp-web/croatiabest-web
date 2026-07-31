"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.hr;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hr');

  // On mount: restore persisted language preference
  useEffect(() => {
    const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('cb_lang')) as Language | null;
    if (saved === 'en' || saved === 'hr') {
      setLanguage(saved);
    }
  }, []);

  // Whenever language changes: update <html lang> and persist
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.setAttribute('xml:lang', language);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cb_lang', language);
    }
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}