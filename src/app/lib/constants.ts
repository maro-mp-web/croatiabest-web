
export type CategoryType = 'free' | 'paid';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  price?: string;
  icon: string;
}

export interface Location {
  slug: string;
  name: string;
  description: string;
  descriptionEn?: string;
  image: string;
  region: string;
  population: string;
  lat: number;
  lng: number;
  mayor?: string;
  areaCode?: string;
  zipCode?: string;
  officialWeb?: string;
}

export const DEFAULT_LISTING_IMAGE = '/placeholder.svg';

export const CATEGORIES: Category[] = [
  { id: 'pharmacy', name: 'Dežurna ljekarna (24/7)', type: 'free', color: '#10B981', icon: 'PlusSquare' },
  { id: 'emergency', name: 'Hitna / Bolnica', type: 'free', color: '#DC2626', icon: 'Hospital' },
  { id: 'police', name: 'Policija', type: 'free', color: '#1E40AF', icon: 'ShieldAlert' },
  { id: 'firefighters', name: 'Vatrogasci', type: 'free', color: '#EA580C', icon: 'Flame' },
  { id: 'beaches', name: 'Plaže', type: 'free', color: '#FCD34D', icon: 'Umbrella' },
  { id: 'wineries', name: 'Vinarije (Domaće)', type: 'free', color: '#7C3AED', icon: 'GlassWater' },
  { id: 'opgs', name: 'OPG - Lokalni proizvodi', type: 'free', color: '#059669', icon: 'Leaf' },
  { id: 'viewpoints', name: 'Vidikovci', type: 'free', color: '#8B5CF6', icon: 'Binoculars' },
  { id: 'landmarks', name: 'Povijesne znamenitosti', type: 'free', color: '#B45309', icon: 'Landmark' },
  { id: 'homeland_war', name: 'Domovinski rat (Spomenici)', type: 'free', color: '#4338CA', icon: 'Shield' },
  { id: 'bus_stations', name: 'Međugradski autobusi', type: 'free', color: '#F59E0B', icon: 'BusFront' },
  { id: 'train_stations', name: 'Željeznički kolodvori', type: 'free', color: '#64748B', icon: 'Train' },
  { id: 'ferry_ports', name: 'Trajektne luke', type: 'free', color: '#0284C7', icon: 'Ship' },
  { id: 'marinas', name: 'Marine i lučice', type: 'free', color: '#0D9488', icon: 'Anchor' },
  
  // Plaćene (Poslovne) Kategorije
  { id: 'restaurants', name: 'Restorani', type: 'paid', color: '#E11D48', icon: 'Utensils', price: '99€' },
  { id: 'hotels', name: 'Hoteli i Smještaj', type: 'paid', color: '#4338CA', icon: 'Hotel', price: '149€' },
  { id: 'bars', name: 'Kafići i Barovi', type: 'paid', color: '#D97706', icon: 'Coffee', price: '99€' },
  { id: 'nightclubs', name: 'Noćni Klubovi', type: 'paid', color: '#9333EA', icon: 'Music', price: '149€' },
  { id: 'boat_rentals', name: 'Nautika i Najam Brodova', type: 'paid', color: '#0284C7', icon: 'Anchor', price: '149€' },
  { id: 'rent_a_car', name: 'Rent-a-Car / Skuteri', type: 'paid', color: '#64748B', icon: 'Car', price: '99€' },
  { id: 'tours', name: 'Izleti i Ture', type: 'paid', color: '#16A34A', icon: 'Map', price: '99€' },
  { id: 'wellness', name: 'Wellness i Spa', type: 'paid', color: '#F472B6', icon: 'Sparkles', price: '149€' },
  { id: 'culture', name: 'Muzeji i Kultura', type: 'paid', color: '#CA8A04', icon: 'Museum', price: '99€' },
  { id: 'shops', name: 'Trgovine i Suvenirnice', type: 'paid', color: '#EC4899', icon: 'ShoppingBag', price: '99€' },
  { id: 'mechanics', name: 'Auto Servis / Mehaničari', type: 'paid', color: '#64748B', icon: 'Wrench', price: '99€' },
  { id: 'it', name: 'IT Usluge', type: 'paid', color: '#3B82F6', icon: 'Laptop', price: '99€' },
  { id: 'marketing', name: 'Marketing', type: 'paid', color: '#F59E0B', icon: 'Megaphone', price: '99€' },
  { id: 'digital', name: 'Digitalne Usluge', type: 'paid', color: '#8B5CF6', icon: 'Code', price: '99€' },
  { id: 'accounting', name: 'Knjigovodstvo', type: 'paid', color: '#10B981', icon: 'Calculator', price: '99€' },
  { id: 'hairdressers', name: 'Frizerski Saloni', type: 'paid', color: '#F43F5E', icon: 'Scissors', price: '99€' },
  { id: 'beauty', name: 'Saloni Ljepote', type: 'paid', color: '#EC4899', icon: 'Sparkles', price: '99€' },
];
