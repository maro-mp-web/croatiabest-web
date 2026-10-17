import { getLocalizedUrl } from '@/lib/i18n-routes';

export function generateSlug(name: string): string {
  return (name || '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/č/g, 'c')
    .replace(/ć/g, 'c')
    .replace(/š/g, 's')
    .replace(/ž/g, 'z')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export const CATEGORY_SLUG_MAP: Record<string, string> = {
  // Public / Free categories
  pharmacy: 'ljekarna',
  emergency: 'hitna-pomoc',
  police: 'policija',
  firefighters: 'vatrogasci',
  beaches: 'plaza',
  wineries: 'vinarija',
  opgs: 'opg',
  viewpoints: 'vidikovac',
  landmarks: 'znamenitost',
  homeland_war: 'spomenik',
  bus_stations: 'autobusni-kolodvor',
  train_stations: 'zeljeznicki-kolodvor',
  ferry_ports: 'trajektna-luka',
  marinas: 'marina',
  national_parks: 'nacionalni-park',

  // Business / Paid categories
  restaurants: 'restoran',
  hotels: 'hotel',
  apartments: 'apartmani',
  camps: 'kampovi',
  bars: 'kafic',
  nightclubs: 'nocni-klub',
  boat_rentals: 'nautika',
  rent_a_car: 'rent-a-car',
  tours: 'izlet',
  wellness: 'wellness',
  culture: 'kultura',
  shops: 'trgovina',
  mechanics: 'auto-servis',
  it: 'it-usluge',
  marketing: 'marketing',
  digital: 'digitalne-usluge',
  accounting: 'knjigovodstvo',
  hairdressers: 'frizerski-salon',
  beauty: 'salon-ljepote',

  // Plural & legacy aliases
  spomenici: 'spomenik',
  vidikovci: 'vidikovac',
  plaze: 'plaza',
  ljekarne: 'ljekarna',
  marine: 'marina',
  kolodvori: 'autobusni-kolodvor',
  znamenitosti: 'znamenitost',
  restorani: 'restoran',
  hoteli: 'hotel',
  vinarije: 'vinarija',
  trgovine: 'trgovina',
  kafici: 'kafic',
  parks: 'nacionalni-park',
  parkovi: 'nacionalni-park',
};

export function generateListingUrl(category: string, nameOrSlug: string, langOrId?: 'hr' | 'en' | string, id?: string): string {
  const rawCat = (category || 'ostalo').toLowerCase();
  const niceCat = CATEGORY_SLUG_MAP[rawCat] || rawCat;
  const slug = generateSlug(nameOrSlug || '');
  return `/objekt/${niceCat}/${slug}`;
}

