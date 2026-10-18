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
  const router = useRouter();
  const pathname = usePathname();

  // Detect whether current URL path is an English route
  const isEnRoute = pathname === '/en' || pathname?.startsWith('/en/') || pathname === '/cities' || pathname?.startsWith('/cities/') || pathname === '/islands' || pathname?.startsWith('/islands/') || pathname === '/blog' || pathname?.startsWith('/blog/') || pathname === '/news' || pathname?.startsWith('/news/') || pathname === '/about' || pathname === '/explore';

  const [language, setLanguage] = useState<Language>(isEnRoute ? 'en' : 'hr');

  // Synchronize language when route changes
  useEffect(() => {
    if (!pathname) return;
    if (pathname === '/en' || pathname.startsWith('/en/')) {
      setLanguage('en');
    } else if (pathname === '/' && typeof localStorage !== 'undefined' && localStorage.getItem('cb_lang') === 'hr') {
      setLanguage('hr');
    } else {
      const saved = (typeof localStorage !== 'undefined' && localStorage.getItem('cb_lang')) as Language | null;
      if (saved === 'en' || saved === 'hr') {
        setLanguage(saved);
      }
    }
  }, [pathname]);

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