/**
 * Registar pozicija i formata za Google AdSense
 * 
 * Važno: Za potrebe prijave i odobrenja na Google AdSense, demo/placeholder
 * oglasi su privremeno isključeni kako Google ne bi odbio stranicu
 * zbog "nepotpunog sadržaja" ili "lažnih/placeholder oglasa".
 * 
 * Čim Google odobri račun:
 * 1. U .env.local postavite:
 *    NEXT_PUBLIC_ENABLE_ADSENSE=true
 *    NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
 * 2. Oglasi će se automatski aktivirati na točno ovim definiranim pozicijama.
 */

export interface AdPositionInfo {
  id: string;
  name: string;
  page: string;
  location: string;
  format: 'horizontal' | 'rectangle' | 'vertical';
  recommendedSize: string;
  googleAdSenseType: string;
}

export const REGISTERED_AD_POSITIONS: AdPositionInfo[] = [
  {
    id: 'HOMEPAGE_HORIZONTAL_MID',
    name: 'Naslovnica - Središnji Banner',
    page: '/',
    location: 'Između istaknutih gradova i sekcije Kulturna baština',
    format: 'horizontal',
    recommendedSize: '728x90 ili Responsive Horizontal',
    googleAdSenseType: 'Display Banner (Responsive)',
  },
  {
    id: 'LISTING_SIDEBAR_RECTANGLE',
    name: 'Pojedinačni Objekt - Desni stupac',
    page: '/listing/[category]/[slugAndId]',
    location: 'Desni stupac ispod radnog vremena i kontakt kartice',
    format: 'rectangle',
    recommendedSize: '300x250 (Medium Rectangle)',
    googleAdSenseType: 'Display Banner (Rectangle)',
  },
  {
    id: 'LISTING_BOTTOM_HORIZONTAL',
    name: 'Pojedinačni Objekt - Dno stranice',
    page: '/listing/[category]/[slugAndId]',
    location: 'Ispod opisa objekta, iznad sekcije "Istaknuto u blizini"',
    format: 'horizontal',
    recommendedSize: '728x90 ili Responsive Leaderboard',
    googleAdSenseType: 'Display Banner (Responsive)',
  },
  {
    id: 'CITY_IN_CONTENT_RECTANGLE',
    name: 'Grad - Unutar sadržaja',
    page: '/cities/[slug]',
    location: 'Glavni lijevi stupac, između vijesti i spomenika Domovinskog rata',
    format: 'rectangle',
    recommendedSize: '300x250 ili In-Article Responsive',
    googleAdSenseType: 'In-article Ad / Rectangle',
  },
  {
    id: 'CITY_SIDEBAR_VERTICAL',
    name: 'Grad - Desni stupac',
    page: '/cities/[slug]',
    location: 'Desni stupac ispod interaktivne karte grada',
    format: 'vertical',
    recommendedSize: '300x600 (Half Page / Skyscraper)',
    googleAdSenseType: 'Vertical Skyscraper',
  },
  {
    id: 'ISLAND_IN_CONTENT_RECTANGLE',
    name: 'Otok - Unutar sadržaja',
    page: '/islands/[slug]',
    location: 'Glavni lijevi stupac ispod popisa atrakcija',
    format: 'rectangle',
    recommendedSize: '300x250',
    googleAdSenseType: 'In-article Ad / Rectangle',
  },
  {
    id: 'ISLAND_SIDEBAR_VERTICAL',
    name: 'Otok - Desni stupac',
    page: '/islands/[slug]',
    location: 'Desni stupac ispod karte otoka',
    format: 'vertical',
    recommendedSize: '300x600 (Half Page / Skyscraper)',
    googleAdSenseType: 'Vertical Skyscraper',
  },
  {
    id: 'BLOG_ARTICLE_SIDEBAR_VERTICAL',
    name: 'Magazin Članak - Desni stupac',
    page: '/blog/[id]',
    location: 'Desni stupac ispod newsletter forme',
    format: 'vertical',
    recommendedSize: '300x600 (Half Page / Skyscraper)',
    googleAdSenseType: 'Vertical Skyscraper',
  },
];
