"use client"

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * HreflangManager — injected as a client component inside root layout.
 * Updates <link rel="alternate" hreflang> tags dynamically whenever
 * the user switches language. This is the correct multilingual SEO signal.
 */
export function HreflangManager() {
  const { language } = useLanguage();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const BASE = 'https://croatiabest.com.hr';
    const path = window.location.pathname;

    // Remove old hreflang tags to avoid duplicates
    document.querySelectorAll('link[hreflang]').forEach(el => el.remove());
    document.querySelectorAll('link[rel="alternate"]').forEach(el => el.remove());

    const createLink = (hreflang: string, href: string) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.setAttribute('hreflang', hreflang);
      link.href = href;
      document.head.appendChild(link);
    };

    // Both HR and EN live on the same URL — signal via hreflang
    createLink('hr', `${BASE}${path}`);
    createLink('en', `${BASE}${path}`);
    createLink('x-default', `${BASE}${path}`);

    // Canonical — always reflect the current active language
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${BASE}${path}`;

    // Update OG locale meta tag
    let ogLocale = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    ogLocale.content = language === 'en' ? 'en_US' : 'hr_HR';

    // Update <html lang> (belt-and-suspenders — LanguageContext already does it)
    document.documentElement.lang = language;

  }, [language]);

  return null;
}
