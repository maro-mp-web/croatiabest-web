"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Language, translations } from '@/lib/translations';
import { getLocalizedUrl } from '@/lib/i18n-routes';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.hr;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hr');
  const router = useRouter();
  const pathname = usePathname();

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

  const handleLanguageSwitch = useCallback((newLang: Language) => {
    if (newLang === language) return;
    setLanguage(newLang);
    
    // Redirect to the localized URL if necessary
    if (typeof window !== 'undefined' && pathname) {
      const newUrl = getLocalizedUrl(pathname, newLang);
      if (newUrl !== pathname) {
        // preserve query string if any
        const search = window.location.search;
        router.push(`${newUrl}${search}`);
      }
    }
  }, [language, pathname, router]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageSwitch, t }}>
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