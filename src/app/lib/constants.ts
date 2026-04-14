
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
  // Free Categories
  { id: 'institutions', name: 'Državne i gradske institucije', type: 'free', color: '#4B5563', icon: 'Building2' },
  { id: 'bus_station_main', name: 'Autobusni kolodvori', type: 'free', color: '#D97706', icon: 'Bus' },
  { id: 'bus_stop', name: 'Autobusne stanice', type: 'free', color: '#F59E0B', icon: 'MapPin' },
  { id: 'train_station', name: 'Željeznički kolodvor', type: 'free', color: '#4F46E5', icon: 'Train' },
  { id: 'airport', name: 'Zračna luka', type: 'free', color: '#2563EB', icon: 'Plane' },
  { id: 'port', name: 'Luka', type: 'free', color: '#0EA5E9', icon: 'Ship' },
  { id: 'small_port', name: 'Lučice', type: 'free', color: '#38BDF8', icon: 'Anchor' },
  { id: 'beaches', name: 'Plaže', type: 'free', color: '#FCD34D', icon: 'Umbrella' },
  { id: 'viewpoints', name: 'Vidikovci', type: 'free', color: '#10B981', icon: 'Binoculars' },
  { id: 'public_toilet', name: 'Javni WC', type: 'free', color: '#94A3B8', icon: 'Toilet' },
  { id: 'free_parking', name: 'Besplatni Parking', type: 'free', color: '#64748B', icon: 'ParkingCircle' },
  { id: 'libraries', name: 'Knjižnice', type: 'free', color: '#8B5CF6', icon: 'Library' },
  { id: 'free_internet', name: 'Besplatni internet', type: 'free', color: '#6366F1', icon: 'Wifi' },
  { id: 'museums', name: 'Muzeji', type: 'free', color: '#EC4899', icon: 'Museum' },
  { id: 'galleries', name: 'Galerije', type: 'free', color: '#F43F5E', icon: 'Palette' },
  { id: 'theaters', name: 'Kazališta', type: 'free', color: '#EF4444', icon: 'Theater' },
  { id: 'public_pool', name: 'Gradski bazen', type: 'free', color: '#3B82F6', icon: 'Waves' },
  { id: 'police', name: 'Policija', type: 'free', color: '#1E40AF', icon: 'ShieldAlert' },
  { id: 'emergency', name: 'Hitna', type: 'free', color: '#DC2626', icon: 'Ambulance' },
  { id: 'hospital', name: 'Bolnica', type: 'free', color: '#B91C1C', icon: 'Hospital' },
  { id: 'pharmacy_on_duty', name: 'Dežurna ljekarna', type: 'free', color: '#059669', icon: 'Pill' },
  { id: 'firefighters', name: 'Vatrogasci', type: 'free', color: '#EA580C', icon: 'Flame' },
  { id: 'hgss', name: 'HGSS', type: 'free', color: '#991B1B', icon: 'Mountain' },
  { id: 'maritime_police', name: 'Pomorska policija', type: 'free', color: '#1E3A8A', icon: 'Shield' },
  { id: 'hunting_clubs', name: 'Lovačka društva', type: 'free', color: '#166534', icon: 'Target' },
  { id: 'public_parks', name: 'Javni parkovi', type: 'free', color: '#15803D', icon: 'Trees' },

  // Paid Categories
  { id: 'restaurants', name: 'Restorani', type: 'paid', color: '#E11D48', price: '89€', icon: 'Utensils' },
  { id: 'cafes', name: 'Kafići', type: 'paid', color: '#BE123C', price: '69€', icon: 'Coffee' },
  { id: 'fast_food', name: 'Fast food', type: 'paid', color: '#F43F5E', price: '29€', icon: 'Pizza' },
  { id: 'hotels', name: 'Hoteli', type: 'paid', color: '#4338CA', price: '390€', icon: 'Hotel' },
  { id: 'motels', name: 'Moteli', type: 'paid', color: '#6366F1', price: '89€', icon: 'Bed' },
  { id: 'camps', name: 'Kampovi', type: 'paid', color: '#059669', price: '29€', icon: 'Tent' },
  { id: 'apartments', name: 'Apartmani', type: 'paid', color: '#10B981', price: '29€', icon: 'Home' },
  { id: 'travel_agencies', name: 'Turističke agencije', type: 'paid', color: '#7C3AED', price: '290€', icon: 'Briefcase' },
  { id: 'stores', name: 'Trgovine', type: 'paid', color: '#D946EF', price: '49€', icon: 'ShoppingBag' },
  { id: 'shopping_malls', name: 'Trgovački centri', type: 'paid', color: '#A21CAF', price: '190€', icon: 'Store' },
  { id: 'night_clubs', name: 'Noćni klubovi', type: 'paid', color: '#111827', price: '190€', icon: 'Music' },
];
