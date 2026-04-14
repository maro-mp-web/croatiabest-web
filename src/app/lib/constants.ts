
export type CategoryType = 'free' | 'paid';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  price?: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  // BESPLATNE KATEGORIJE
  { id: 'institutions', name: 'Državne i gradske institucije', type: 'free', color: '#4B5563', icon: 'Building2' },
  { id: 'bus_station', name: 'Autobusni kolodvori', type: 'free', color: '#D97706', icon: 'Bus' },
  { id: 'train_station', name: 'Željeznički kolodvori', type: 'free', color: '#4F46E5', icon: 'Train' },
  { id: 'airport', name: 'Zračne luke', type: 'free', color: '#2563EB', icon: 'Plane' },
  { id: 'port', name: 'Luka / Riva', type: 'free', color: '#0EA5E9', icon: 'Ship' },
  { id: 'beaches', name: 'Plaže', type: 'free', color: '#FCD34D', icon: 'Umbrella' },
  { id: 'viewpoints', name: 'Vidikovci', type: 'free', color: '#10B981', icon: 'Binoculars' },
  { id: 'public_toilet', name: 'Javni WC', type: 'free', color: '#94A3B8', icon: 'Toilet' },
  { id: 'emergency', name: 'Hitna / Bolnica', type: 'free', color: '#DC2626', icon: 'Hospital' },
  { id: 'police', name: 'Policija', type: 'free', color: '#1E40AF', icon: 'ShieldAlert' },
  { id: 'firefighters', name: 'Vatrogasci', type: 'free', color: '#EA580C', icon: 'Flame' },
  { id: 'parks', name: 'Javni parkovi', type: 'free', color: '#15803D', icon: 'Trees' },

  // PLAĆENE KATEGORIJE
  { id: 'restaurants', name: 'Restorani', type: 'paid', color: '#E11D48', price: '89€', icon: 'Utensils' },
  { id: 'cafes', name: 'Kafići', type: 'paid', color: '#BE123C', price: '69€', icon: 'Coffee' },
  { id: 'hotels', name: 'Hoteli', type: 'paid', color: '#4338CA', price: '390€', icon: 'Hotel' },
  { id: 'apartments', name: 'Apartmani', type: 'paid', color: '#10B981', price: '29€', icon: 'Home' },
  { id: 'night_clubs', name: 'Noćni klubovi', type: 'paid', color: '#111827', price: '190€', icon: 'Music' },
  { id: 'agencies', name: 'Turističke agencije', type: 'paid', color: '#7C3AED', price: '290€', icon: 'Briefcase' },
  { id: 'stores', name: 'Trgovine', type: 'paid', color: '#D946EF', price: '49€', icon: 'ShoppingBag' },
];
