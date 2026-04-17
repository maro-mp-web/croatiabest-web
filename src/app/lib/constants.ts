
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
    description: 'Biser Jadrana, poznat po svojim zidinama i povijesnoj jezgri pod zaštitom UNESCO-a.' 
  },
  { 
    slug: 'zadar', 
    name: 'Zadar', 
    region: 'Dalmacija',
    population: '70,829',
    image: 'https://picsum.photos/seed/zadar1/1200/800',
    lat: 44.1194,
    lng: 15.2314,
    description: 'Grad s najljepšim zalaskom sunca, Pozdravom Suncu i Morski orguljama.' 
  },
  { 
    slug: 'rijeka', 
    name: 'Rijeka', 
    region: 'Kvarner',
    population: '108,622',
    image: 'https://picsum.photos/seed/rijeka1/1200/800',
    lat: 45.3271,
    lng: 14.4422,
    description: 'Najveća hrvatska luka i grad bogate industrijske i kulturne baštine.' 
  },
  { 
    slug: 'pula', 
    name: 'Pula', 
    region: 'Istra',
    population: '52,220',
    image: 'https://picsum.photos/seed/pula1/1200/800',
    lat: 44.8666,
    lng: 13.8496,
    description: 'Istarski grad poznat po rimskom amfiteatru Areni i prekrasnoj obali.' 
  },
  { 
    slug: 'sibenik', 
    name: 'Šibenik', 
    region: 'Dalmacija',
    population: '42,589',
    image: 'https://picsum.photos/seed/sibenik1/1200/800',
    lat: 43.7350,
    lng: 15.8942,
    description: 'Grad s dvije UNESCO-ve katedrale i prekrasnim arhipelagom.' 
  },
  { 
    slug: 'osijek', 
    name: 'Osijek', 
    region: 'Slavonija',
    population: '96,568',
    image: 'https://picsum.photos/seed/osijek1/1200/800',
    lat: 45.5550,
    lng: 18.6955,
    description: 'Metropola Slavonije, poznata po secesijskoj arhitekturi i vrhunskoj gastronomiji.' 
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
    description: 'Dom čuvene plaže Zlatni rat i bijelog kamena od kojeg je građena Bijela kuća.' 
  },
  { 
    slug: 'korcula', 
    name: 'Korčula', 
    region: 'Južna Dalmacija',
    population: '15,522',
    image: 'https://picsum.photos/seed/korcula1/1200/800',
    lat: 42.9612,
    lng: 16.8922,
    description: 'Srednjovjekovni utvrđeni grad, navodno rodno mjesto Marka Pola.' 
  },
  { 
    slug: 'vis', 
    name: 'Vis', 
    region: 'Dalmacija',
    population: '3,445',
    image: 'https://picsum.photos/seed/vis1/1200/800',
    lat: 43.0610,
    lng: 16.1833,
    description: 'Najudaljeniji naseljeni otok, poznat po netaknutoj prirodi i Modroj špilji.' 
  },
  { 
    slug: 'krk', 
    name: 'Krk', 
    region: 'Kvarner',
    population: '19,383',
    image: 'https://picsum.photos/seed/krk1/1200/800',
    lat: 45.0261,
    lng: 14.5732,
    description: 'Zlatni otok povezan mostom s kopnom, bogat poviješću i Bašćanskom pločom.' 
  },
  { 
    slug: 'pag', 
    name: 'Pag', 
    region: 'Dalmacija/Lika',
    population: '9,520',
    image: 'https://picsum.photos/seed/pag1/1200/800',
    lat: 44.4450,
    lng: 15.0560,
    description: 'Mjesec na Zemlji, poznat po čuvenom paškom siru, čipki i zabavi na Zrću.' 
  },
  { 
    slug: 'losinj', 
    name: 'Lošinj', 
    region: 'Kvarner',
    population: '8,116',
    image: 'https://picsum.photos/seed/losinj1/1200/800',
    lat: 44.5322,
    lng: 14.4664,
    description: 'Otok vitalnosti s dugom tradicijom lječilišnog turizma i mirisima ljekovitog bilja.' 
  },
];

export const CATEGORIES: Category[] = [
  // BESPLATNE KATEGORIJE (FREE)
  { id: 'pharmacy', name: 'Dežurna ljekarna (24/7)', type: 'free', color: '#10B981', icon: 'PlusSquare' },
  { id: 'emergency', name: 'Hitna / Bolnica', type: 'free', color: '#DC2626', icon: 'Hospital' },
  { id: 'police', name: 'Policija', type: 'free', color: '#1E40AF', icon: 'ShieldAlert' },
  { id: 'firefighters', name: 'Vatrogasci', type: 'free', color: '#EA580C', icon: 'Flame' },
  { id: 'institutions', name: 'Državne institucije', type: 'free', color: '#4B5563', icon: 'Building2' },
  { id: 'beaches', name: 'Plaže', type: 'free', color: '#FCD34D', icon: 'Umbrella' },
  { id: 'parks', name: 'Javni parkovi', type: 'free', color: '#15803D', icon: 'Trees' },

  // PLAĆENE KATEGORIJE (PAY)
  { id: 'restaurants', name: 'Restorani', type: 'paid', color: '#E11D48', icon: 'Utensils' },
  { id: 'cafes', name: 'Kafići', type: 'paid', color: '#BE123C', icon: 'Coffee' },
  { id: 'hotels', name: 'Hoteli', type: 'paid', color: '#4338CA', icon: 'Hotel' },
];
