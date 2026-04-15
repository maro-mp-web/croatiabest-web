
export type CategoryType = 'free' | 'paid';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string;
  price?: string;
  icon: string;
}

export interface City {
  slug: string;
  name: string;
  description: string;
  image: string;
  region: string;
  population: string;
}

export const CITIES: City[] = [
  { 
    slug: 'zagreb', 
    name: 'Zagreb', 
    region: 'Središnja Hrvatska',
    population: '767,131',
    image: 'https://picsum.photos/seed/zagreb1/1200/800',
    description: 'Glavni grad Hrvatske, poznat po svojoj bogatoj povijesti, muzejima i živoj atmosferi na ulicama.' 
  },
  { 
    slug: 'split', 
    name: 'Split', 
    region: 'Dalmacija',
    population: '161,312',
    image: 'https://picsum.photos/seed/split1/1200/800',
    description: 'Srce Dalmacije, dom Dioklecijanove palače i jedna od najživljih mediteranskih luka.' 
  },
  { 
    slug: 'dubrovnik', 
    name: 'Dubrovnik', 
    region: 'Južna Dalmacija',
    population: '41,562',
    image: 'https://picsum.photos/seed/dubrovnik1/1200/800',
    description: 'Biser Jadrana, poznat po svojim zidinama i povijesnoj jezgri pod zaštitom UNESCO-a.' 
  },
  { 
    slug: 'zadar', 
    name: 'Zadar', 
    region: 'Dalmacija',
    population: '70,829',
    image: 'https://picsum.photos/seed/zadar1/1200/800',
    description: 'Grad s najljepšim zalaskom sunca, Pozdravom Suncu i Morski orguljama.' 
  },
  { 
    slug: 'rijeka', 
    name: 'Rijeka', 
    region: 'Kvarner',
    population: '108,622',
    image: 'https://picsum.photos/seed/rijeka1/1200/800',
    description: 'Najveća hrvatska luka i grad bogate industrijske i kulturne baštine.' 
  },
  { 
    slug: 'pula', 
    name: 'Pula', 
    region: 'Istra',
    population: '52,220',
    image: 'https://picsum.photos/seed/pula1/1200/800',
    description: 'Istarski grad poznat po rimskom amfiteatru Areni i prekrasnoj obali.' 
  },
  { 
    slug: 'sibenik', 
    name: 'Šibenik', 
    region: 'Dalmacija',
    population: '42,589',
    image: 'https://picsum.photos/seed/sibenik1/1200/800',
    description: 'Grad s dvije UNESCO-ve katedrale i prekrasnim arhipelagom.' 
  },
  { 
    slug: 'osijek', 
    name: 'Osijek', 
    region: 'Slavonija',
    population: '96,568',
    image: 'https://picsum.photos/seed/osijek1/1200/800',
    description: 'Metropola Slavonije, poznata po secesijskoj arhitekturi i vrhunskoj gastronomiji.' 
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
  { id: 'restaurants', name: 'Restorani', type: 'paid', color: '#E11D48', price: '89€', icon: 'Utensils' },
  { id: 'cafes', name: 'Kafići', type: 'paid', color: '#BE123C', price: '69€', icon: 'Coffee' },
  { id: 'hotels', name: 'Hoteli', type: 'paid', color: '#4338CA', price: '390€', icon: 'Hotel' },
];
