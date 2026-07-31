export const ROUTE_TRANSLATIONS = {
  hr: {
    '/explore': '/istrazi',
    '/cities': '/gradovi',
    '/islands': '/otoci',
    '/blog': '/magazin',
    '/news': '/vijesti',
    '/about': '/o-nama',
  },
  en: {
    '/istrazi': '/explore',
    '/gradovi': '/cities',
    '/otoci': '/islands',
    '/magazin': '/blog',
    '/vijesti': '/news',
    '/o-nama': '/about',
  }
} as const;

/**
 * Returns a localized URL for the given path based on the selected language.
 * Assumes the path is absolute (starts with /).
 */
export function getLocalizedUrl(path: string, lang: 'hr' | 'en'): string {
  if (!path || path === '/') return '/';

  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return '/';

  const baseSegment = '/' + parts[0];
  
  // If we are currently translating to HR, we look for EN->HR mapping.
  // If the baseSegment is already in HR (e.g. '/gradovi'), it'll be missed by the dictionary if we strictly map EN keys.
  // So we explicitly map known keys.
  const toHr: Record<string, string> = ROUTE_TRANSLATIONS.hr;
  const toEn: Record<string, string> = ROUTE_TRANSLATIONS.en;
  
  let translatedBase = baseSegment;
  if (lang === 'hr') {
    translatedBase = toHr[baseSegment as keyof typeof toHr] || baseSegment;
  } else {
    translatedBase = toEn[baseSegment as keyof typeof toEn] || baseSegment;
  }
    
  if (parts.length > 1) {
    return translatedBase + '/' + parts.slice(1).join('/');
  }
  
  return translatedBase;
}

/**
 * Utility to get the alternate language URL for SEO hreflang tags
 * and for switching languages safely.
 */
export function getAlternateUrl(currentPath: string, currentLang: 'hr' | 'en'): string {
  const targetLang = currentLang === 'hr' ? 'en' : 'hr';
  return getLocalizedUrl(currentPath, targetLang);
}
