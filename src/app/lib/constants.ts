
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

export const CITIES: Location[] = [
  { 
    slug: 'zagreb', 
    name: 'Zagreb', 
    region: 'Središnja Hrvatska',
    population: '767,131',
    image: 'https://picsum.photos/seed/zagreb1/1200/800',
    lat: 45.8150,
    lng: 15.9819,
    mayor: 'Tomislav Tomašević',
    areaCode: '01',
    zipCode: '10000',
    officialWeb: 'https://www.zagreb.hr',
    description: 'Glavni grad Hrvatske, poznat po svojoj bogatoj povijesti, muzejima i živoj atmosferi na ulicama.' 
  },
  { 
    slug: 'split', 
    name: 'Split', 
    region: 'Dalmacija',
    population: '161,312',
    image: 'https://picsum.photos/seed/split1/1200/800',
    lat: 43.5081,
    lng: 16.4402,
    mayor: 'Ivica Puljak',
    areaCode: '021',
    zipCode: '21000',
    officialWeb: 'https://www.split.hr',
    description: 'Srce Dalmacije, dom Dioklecijanove palače i jedna od najživljih mediteranskih luka.' 
  },
  { 
    slug: 'dubrovnik', 
    name: 'Dubrovnik', 
    region: 'Južna Dalmacija',
    population: '41,562',
    image: 'https://picsum.photos/seed/dubrovnik1/1200/800',
    lat: 42.6507,
    lng: 18.0944,
    mayor: 'Mato Franković',
    areaCode: '020',
    zipCode: '20000',
    officialWeb: 'https://www.dubrovnik.hr',
    description: 'Biser Jadrana, poznat po svojim zidinama i povijesnoj jezgri pod zaštitom UNESCO-a.' 
  },
];

export const ISLANDS: Location[] = [
  { 
    slug: 'hvar', 
    name: 'Hvar', 
    region: 'Dalmacija',
    population: '11,077',
    image: 'https://picsum.photos/seed/hvar1/1200/800',
    lat: 43.1729,
    lng: 16.4425,
    mayor: 'Ricardo Novak',
    areaCode: '021',
    zipCode: '21450',
    officialWeb: 'https://www.hvar.hr',
    description: 'Najsunčaniji hrvatski otok, poznat po poljima lavande, vrhunskim vinima i noćnom životu.' 
  },
  { 
    slug: 'brac', 
    name: 'Brač', 
    region: 'Dalmacija',
    population: '14,434',
    image: 'https://picsum.photos/seed/brac1/1200/800',
    lat: 43.3289,
    lng: 16.6346,
    mayor: 'Ivana Marković (Supetar)',
    areaCode: '021',
    zipCode: '21400',
    description: 'Dom čuvene plaže Zlatni rat i bijelog kamena od kojeg je građena Bijela kuća.' 
  },
];

export const CATEGORIES: Category[] = [
  // BESPLATNE KATEGORIJE (FREE)
  { id: 'pharmacy', name: 'Dežurna ljekarna (24/7)', type: 'free', color: '#10B981', icon: 'PlusSquare' },
  { id: 'emergency', name: 'Hitna / Bolnica', type: 'free', color: '#DC2626', icon: 'Hospital' },
  { id: 'police', name: 'Policija', type: 'free', color: '#1E40AF', icon: 'ShieldAlert' },
  { id: 'firefighters', name: 'Vatrogasci', type: 'free', color: '#EA580C', icon: 'Flame' },
  { id: 'beaches', name: 'Plaže', type: 'free', color: '#FCD34D', icon: 'Umbrella' },
  { id: 'wineries', name: 'Vinarije (Domaće)', type: 'free', color: '#7C3AED', icon: 'GlassWater' },
  { id: 'opgs', name: 'OPG - Lokalni proizvodi', type: 'free', color: '#059669', icon: 'Leaf' },

  // PLAĆENE KATEGORIJE (PAY)
  { id: 'restaurants', name: 'Restorani', type: 'paid', color: '#E11D48', icon: 'Utensils', price: '99€' },
  { id: 'hotels', name: 'Hoteli i Smještaj', type: 'paid', color: '#4338CA', icon: 'Hotel', price: '149€' },
];
