
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
    description: 'Glavni grad Hrvatske, kulturno, znanstveno, gospodarsko i upravno središte države.' 
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
    description: 'Drugi po veličini grad u Hrvatskoj i najveći grad u Dalmaciji, dom Dioklecijanove palače.' 
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
    description: 'Biser Jadrana, povijesni grad pod zaštitom UNESCO-a s impresivnim zidinama.' 
  },
  { 
    slug: 'zadar', 
    name: 'Zadar', 
    region: 'Sjeverna Dalmacija',
    population: '70,829',
    image: 'https://picsum.photos/seed/zadar1/1200/800',
    lat: 44.1194,
    lng: 15.2314,
    mayor: 'Branko Dukić',
    areaCode: '023',
    zipCode: '23000',
    officialWeb: 'https://www.grad-zadar.hr',
    description: 'Grad s najljepšim zalaskom sunca i Morskim orguljama.' 
  },
  { 
    slug: 'rijeka', 
    name: 'Rijeka', 
    region: 'Kvarner',
    population: '108,622',
    image: 'https://picsum.photos/seed/rijeka1/1200/800',
    lat: 45.3271,
    lng: 14.4422,
    mayor: 'Marko Filipović',
    areaCode: '051',
    zipCode: '51000',
    officialWeb: 'https://www.rijeka.hr',
    description: 'Najveća hrvatska luka i grad bogate industrijske povijesti.' 
  },
  { 
    slug: 'osijek', 
    name: 'Osijek', 
    region: 'Slavonija',
    population: '96,848',
    image: 'https://picsum.photos/seed/osijek1/1200/800',
    lat: 45.5550,
    lng: 18.6955,
    mayor: 'Ivan Radić',
    areaCode: '031',
    zipCode: '31000',
    officialWeb: 'https://www.osijek.hr',
    description: 'Najveći grad u Slavoniji, smješten na rijeci Dravi.' 
  },
  { 
    slug: 'pula', 
    name: 'Pula', 
    region: 'Istra',
    population: '52,220',
    image: 'https://picsum.photos/seed/pula1/1200/800',
    lat: 44.8666,
    lng: 13.8496,
    mayor: 'Filip Zoričić',
    areaCode: '052',
    zipCode: '52100',
    officialWeb: 'https://www.pula.hr',
    description: 'Najveći grad u Istri, poznat po antičkoj Areni.' 
  },
  { 
    slug: 'sibenik', 
    name: 'Šibenik', 
    region: 'Dalmacija',
    population: '42,599',
    image: 'https://picsum.photos/seed/sibenik1/1200/800',
    lat: 43.7350,
    lng: 15.8950,
    mayor: 'Željko Burić',
    areaCode: '022',
    zipCode: '22000',
    officialWeb: 'https://www.sibenik.hr',
    description: 'Grad s dvije UNESCO-ve znamenitosti.' 
  },
  { 
    slug: 'varazdin', 
    name: 'Varaždin', 
    region: 'Sjeverna Hrvatska',
    population: '43,999',
    image: 'https://picsum.photos/seed/varazdin1/1200/800',
    lat: 46.3057,
    lng: 16.3366,
    mayor: 'Neven Bosilj',
    areaCode: '042',
    zipCode: '42000',
    officialWeb: 'https://www.varazdin.hr',
    description: 'Bivši glavni grad Hrvatske, poznat po baroku.' 
  },
  { 
    slug: 'karlovac', 
    name: 'Karlovac', 
    region: 'Središnja Hrvatska',
    population: '49,377',
    image: 'https://picsum.photos/seed/karlovac1/1200/800',
    lat: 45.4929,
    lng: 15.5553,
    mayor: 'Damir Mandić',
    areaCode: '047',
    zipCode: '47000',
    officialWeb: 'https://www.karlovac.hr',
    description: 'Grad na četiri rijeke.' 
  },
  { 
    slug: 'sisak', 
    name: 'Sisak', 
    region: 'Središnja Hrvatska',
    population: '40,185',
    image: 'https://picsum.photos/seed/sisak1/1200/800',
    lat: 45.4851,
    lng: 16.3735,
    mayor: 'Kristina Ikić Baniček',
    areaCode: '044',
    zipCode: '44000',
    officialWeb: 'https://www.sisak.hr',
    description: 'Povijesni grad na ušću Kupe u Savu.' 
  },
  { 
    slug: 'slavonski-brod', 
    name: 'Slavonski Brod', 
    region: 'Slavonija',
    population: '53,273',
    image: 'https://picsum.photos/seed/brod1/1200/800',
    lat: 45.1631,
    lng: 18.0116,
    mayor: 'Mirko Duspara',
    areaCode: '035',
    zipCode: '35000',
    officialWeb: 'https://www.slavonski-brod.hr',
    description: 'Grad velike tvrđave na rijeci Savi.' 
  },
  { 
    slug: 'vukovar', 
    name: 'Vukovar', 
    region: 'Slavonija',
    population: '23,175',
    image: 'https://picsum.photos/seed/vukovar1/1200/800',
    lat: 45.3431,
    lng: 18.9997,
    mayor: 'Ivan Penava',
    areaCode: '032',
    zipCode: '32000',
    officialWeb: 'https://www.vukovar.hr',
    description: 'Grad heroj na Dunavu.' 
  },
  { 
    slug: 'rovinj', 
    name: 'Rovinj', 
    region: 'Istra',
    population: '12,968',
    image: 'https://picsum.photos/seed/rovinj1/1200/800',
    lat: 45.0811,
    lng: 13.6387,
    mayor: 'Marko Paliaga',
    areaCode: '052',
    zipCode: '52210',
    officialWeb: 'https://www.rovinj-rovigno.hr',
    description: 'Najromantičniji grad u Istri.' 
  },
  { 
    slug: 'porec', 
    name: 'Poreč', 
    region: 'Istra',
    population: '16,607',
    image: 'https://picsum.photos/seed/porec1/1200/800',
    lat: 45.2272,
    lng: 13.5947,
    mayor: 'Loris Peršurić',
    areaCode: '052',
    zipCode: '52440',
    officialWeb: 'https://www.porec.hr',
    description: 'Grad mozaika i Eufrazijeve bazilike.' 
  }
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
    description: 'Najsunčaniji hrvatski otok s najstarijim kazalištem u Europi.' 
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
    description: 'Najviši jadranski otok s legendarnom plažom Zlatni rat.' 
  },
  { 
    slug: 'korcula', 
    name: 'Korčula', 
    region: 'Dalmacija',
    population: '15,522',
    image: 'https://picsum.photos/seed/korcula1/1200/800',
    lat: 42.9611,
    lng: 16.8988,
    mayor: 'Nika Silić Maroević',
    areaCode: '020',
    zipCode: '20260',
    description: 'Otok Marka Pola i viteške igre Moreška.' 
  },
  { 
    slug: 'vis', 
    name: 'Vis', 
    region: 'Dalmacija',
    population: '3,445',
    image: 'https://picsum.photos/seed/vis1/1200/800',
    lat: 43.0611,
    lng: 16.1833,
    mayor: 'Tonka Ivčević',
    areaCode: '021',
    zipCode: '21480',
    description: 'Otok bogate vojne povijesti i netaknute prirode.' 
  },
  { 
    slug: 'krk', 
    name: 'Krk', 
    region: 'Kvarner',
    population: '19,383',
    image: 'https://picsum.photos/seed/krk1/1200/800',
    lat: 45.0250,
    lng: 14.5750,
    mayor: 'Darijo Vasilić',
    areaCode: '051',
    zipCode: '51500',
    description: 'Zlatni otok povezan mostom s kopnom.' 
  },
  { 
    slug: 'pag', 
    name: 'Pag', 
    region: 'Kvarner/Dalmacija',
    population: '8,398',
    image: 'https://picsum.photos/seed/pag1/1200/800',
    lat: 44.4450,
    lng: 15.0560,
    mayor: 'Ante Fabijanić',
    areaCode: '023',
    zipCode: '23250',
    description: 'Otok sira, čipke i mjesečevog pejsaža.' 
  },
  { 
    slug: 'losinj', 
    name: 'Lošinj', 
    region: 'Kvarner',
    population: '7,537',
    image: 'https://picsum.photos/seed/losinj1/1200/800',
    lat: 44.5333,
    lng: 14.4667,
    mayor: 'Ana Kučić',
    areaCode: '051',
    zipCode: '51550',
    description: 'Otok vitalnosti i miomirisa.' 
  },
  { 
    slug: 'rab', 
    name: 'Rab', 
    region: 'Kvarner',
    population: '9,328',
    image: 'https://picsum.photos/seed/rab1/1200/800',
    lat: 44.7567,
    lng: 14.7600,
    mayor: 'Nikola Grgurić',
    areaCode: '051',
    zipCode: '51280',
    description: 'Sretni otok s četiri zvonika.' 
  },
  { 
    slug: 'mljet', 
    name: 'Mljet', 
    region: 'Južna Dalmacija',
    population: '1,088',
    image: 'https://picsum.photos/seed/mljet1/1200/800',
    lat: 42.7444,
    lng: 17.5367,
    description: 'Zeleni otok s nacionalnim parkom i slanim jezerima.' 
  },
  { 
    slug: 'cres', 
    name: 'Cres', 
    region: 'Kvarner',
    population: '2,879',
    image: 'https://picsum.photos/seed/cres1/1200/800',
    lat: 44.9600,
    lng: 14.4100,
    mayor: 'Marin Gregorović',
    areaCode: '051',
    zipCode: '51557',
    description: 'Otok bjeloglavih supova i Vranskog jezera.' 
  },
  { 
    slug: 'murter', 
    name: 'Murter', 
    region: 'Dalmacija',
    population: '5,060',
    image: 'https://picsum.photos/seed/murter1/1200/800',
    lat: 43.8167,
    lng: 15.6000,
    description: 'Vrata Kornata povezana pokretnim mostom.' 
  },
  { 
    slug: 'dugi-otok', 
    name: 'Dugi otok', 
    region: 'Dalmacija',
    population: '2,873',
    image: 'https://picsum.photos/seed/dugi1/1200/800',
    lat: 43.9833,
    lng: 15.0000,
    description: 'Otok s prekrasnim svjetionikom Veli Rat i parkom Telašćica.' 
  },
  { 
    slug: 'solta', 
    name: 'Šolta', 
    region: 'Dalmacija',
    population: '1,700',
    image: 'https://picsum.photos/seed/solta1/1200/800',
    lat: 43.3833,
    lng: 16.3000,
    description: 'Otok meda, maslina i mirnog odmora.' 
  },
  { 
    slug: 'pasman', 
    name: 'Pašman', 
    region: 'Dalmacija',
    population: '2,850',
    image: 'https://picsum.photos/seed/pasman1/1200/800',
    lat: 43.9500,
    lng: 15.3667,
    description: 'Otok s najčišćim morem zbog čestih izmjena struja.' 
  },
  { 
    slug: 'ugljan', 
    name: 'Ugljan', 
    region: 'Dalmacija',
    population: '6,100',
    image: 'https://picsum.photos/seed/ugljan1/1200/800',
    lat: 44.0833,
    lng: 15.1667,
    description: 'Vrt Zadra, prekriven maslinicima.' 
  }
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
