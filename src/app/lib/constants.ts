
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
    slug: 'zagreb', name: 'Zagreb', region: 'Središnja Hrvatska', population: '767,131',
    image: 'https://picsum.photos/seed/zagreb1/1200/800', lat: 45.8150, lng: 15.9819,
    mayor: 'Tomislav Tomašević', areaCode: '01', zipCode: '10000', officialWeb: 'https://www.zagreb.hr',
    description: 'Glavni grad Hrvatske, kulturno, znanstveno, gospodarsko i upravno središte države.' 
  },
  { 
    slug: 'split', name: 'Split', region: 'Dalmacija', population: '161,312',
    image: 'https://picsum.photos/seed/split1/1200/800', lat: 43.5081, lng: 16.4402,
    mayor: 'Ivica Puljak', areaCode: '021', zipCode: '21000', officialWeb: 'https://www.split.hr',
    description: 'Drugi po veličini grad u Hrvatskoj i najveći grad u Dalmaciji, dom Dioklecijanove palače.' 
  },
  { 
    slug: 'dubrovnik', name: 'Dubrovnik', region: 'Južna Dalmacija', population: '41,562',
    image: 'https://picsum.photos/seed/dubrovnik1/1200/800', lat: 42.6507, lng: 18.0944,
    mayor: 'Mato Franković', areaCode: '020', zipCode: '20000', officialWeb: 'https://www.dubrovnik.hr',
    description: 'Biser Jadrana, povijesni grad pod zaštitom UNESCO-a s impresivnim zidinama.' 
  },
  { 
    slug: 'zadar', name: 'Zadar', region: 'Sjeverna Dalmacija', population: '70,829',
    image: 'https://picsum.photos/seed/zadar1/1200/800', lat: 44.1194, lng: 15.2314,
    mayor: 'Branko Dukić', areaCode: '023', zipCode: '23000', officialWeb: 'https://www.grad-zadar.hr',
    description: 'Grad s najljepšim zalaskom sunca i Morskim orguljama.' 
  },
  { 
    slug: 'rijeka', name: 'Rijeka', region: 'Kvarner', population: '108,622',
    image: 'https://picsum.photos/seed/rijeka1/1200/800', lat: 45.3271, lng: 14.4422,
    mayor: 'Marko Filipović', areaCode: '051', zipCode: '51000', officialWeb: 'https://www.rijeka.hr',
    description: 'Najveća hrvatska luka i grad bogate industrijske povijesti.' 
  },
  { 
    slug: 'osijek', name: 'Osijek', region: 'Slavonija', population: '96,848',
    image: 'https://picsum.photos/seed/osijek1/1200/800', lat: 45.5550, lng: 18.6955,
    mayor: 'Ivan Radić', areaCode: '031', zipCode: '31000', officialWeb: 'https://www.osijek.hr',
    description: 'Najveći grad u Slavoniji, smješten na rijeci Dravi.' 
  },
  { 
    slug: 'pula', name: 'Pula', region: 'Istra', population: '52,220',
    image: 'https://picsum.photos/seed/pula1/1200/800', lat: 44.8666, lng: 13.8496,
    mayor: 'Filip Zoričić', areaCode: '052', zipCode: '52100', officialWeb: 'https://www.pula.hr',
    description: 'Najveći grad u Istri, poznat po antičkoj Areni.' 
  },
  { 
    slug: 'sibenik', name: 'Šibenik', region: 'Dalmacija', population: '42,599',
    image: 'https://picsum.photos/seed/sibenik1/1200/800', lat: 43.7350, lng: 15.8950,
    mayor: 'Željko Burić', areaCode: '022', zipCode: '22000', officialWeb: 'https://www.sibenik.hr',
    description: 'Grad s dvije UNESCO-ve znamenitosti.' 
  },
  { 
    slug: 'varazdin', name: 'Varaždin', region: 'Sjeverna Hrvatska', population: '43,999',
    image: 'https://picsum.photos/seed/varazdin1/1200/800', lat: 46.3057, lng: 16.3366,
    mayor: 'Neven Bosilj', areaCode: '042', zipCode: '42000', officialWeb: 'https://www.varazdin.hr',
    description: 'Bivši glavni grad Hrvatske, poznat po baroku.' 
  },
  { 
    slug: 'karlovac', name: 'Karlovac', region: 'Središnja Hrvatska', population: '49,377',
    image: 'https://picsum.photos/seed/karlovac1/1200/800', lat: 45.4929, lng: 15.5553,
    mayor: 'Damir Mandić', areaCode: '047', zipCode: '47000', officialWeb: 'https://www.karlovac.hr',
    description: 'Grad na četiri rijeke.' 
  },
  { 
    slug: 'sisak', name: 'Sisak', region: 'Središnja Hrvatska', population: '40,185',
    image: 'https://picsum.photos/seed/sisak1/1200/800', lat: 45.4851, lng: 16.3735,
    mayor: 'Kristina Ikić Baniček', areaCode: '044', zipCode: '44000', officialWeb: 'https://www.sisak.hr',
    description: 'Povijesni grad na ušću Kupe u Savu.' 
  },
  { 
    slug: 'slavonski-brod', name: 'Slavonski Brod', region: 'Slavonija', population: '53,273',
    image: 'https://picsum.photos/seed/brod1/1200/800', lat: 45.1631, lng: 18.0116,
    mayor: 'Mirko Duspara', areaCode: '035', zipCode: '35000', officialWeb: 'https://www.slavonski-brod.hr',
    description: 'Grad velike tvrđave na rijeci Savi.' 
  },
  { 
    slug: 'vukovar', name: 'Vukovar', region: 'Slavonija', population: '23,175',
    image: 'https://picsum.photos/seed/vukovar1/1200/800', lat: 45.3431, lng: 18.9997,
    mayor: 'Ivan Penava', areaCode: '032', zipCode: '32000', officialWeb: 'https://www.vukovar.hr',
    description: 'Grad heroj na Dunavu.' 
  },
  { 
    slug: 'rovinj', name: 'Rovinj', region: 'Istra', population: '12,968',
    image: 'https://picsum.photos/seed/rovinj1/1200/800', lat: 45.0811, lng: 13.6387,
    mayor: 'Marko Paliaga', areaCode: '052', zipCode: '52210', officialWeb: 'https://www.rovinj-rovigno.hr',
    description: 'Najromantičniji grad u Istri.' 
  },
  { 
    slug: 'porec', name: 'Poreč', region: 'Istra', population: '16,607',
    image: 'https://picsum.photos/seed/porec1/1200/800', lat: 45.2272, lng: 13.5947,
    mayor: 'Loris Peršurić', areaCode: '052', zipCode: '52440', officialWeb: 'https://www.porec.hr',
    description: 'Grad mozaika i Eufrazijeve bazilike.' 
  },
  { 
    slug: 'koprivnica', name: 'Koprivnica', region: 'Podravina', population: '30,826',
    image: 'https://picsum.photos/seed/kc1/1200/800', lat: 46.1627, lng: 16.8339,
    mayor: 'Mišel Jakšić', areaCode: '048', zipCode: '48000', officialWeb: 'https://www.koprivnica.hr',
    description: 'Srce Podravine i grad poznate prehrambene industrije.' 
  },
  { 
    slug: 'bjelovar', name: 'Bjelovar', region: 'Središnja Hrvatska', population: '40,276',
    image: 'https://picsum.photos/seed/bj1/1200/800', lat: 45.8988, lng: 16.8423,
    mayor: 'Dario Hrebak', areaCode: '043', zipCode: '43000', officialWeb: 'https://www.bjelovar.hr',
    description: 'Grad sira i bogate konjičke tradicije.' 
  },
  { 
    slug: 'vinkovci', name: 'Vinkovci', region: 'Slavonija', population: '31,057',
    image: 'https://picsum.photos/seed/vk1/1200/800', lat: 45.2869, lng: 18.8058,
    mayor: 'Ivan Bosančić', areaCode: '032', zipCode: '32100', officialWeb: 'https://www.vinkovci.hr',
    description: 'Najstariji kontinuirano naseljeni grad u Europi.' 
  },
  { 
    slug: 'samobor', name: 'Samobor', region: 'Središnja Hrvatska', population: '37,435',
    image: 'https://picsum.photos/seed/samobor1/1200/800', lat: 45.8016, lng: 15.7111,
    mayor: 'Petra Škrobot', areaCode: '01', zipCode: '10430', officialWeb: 'https://www.samobor.hr',
    description: 'Omiljeno izletište s najboljim kremšnitama u Hrvatskoj.' 
  },
  { 
    slug: 'velika-gorica', name: 'Velika Gorica', region: 'Središnja Hrvatska', population: '61,198',
    image: 'https://picsum.photos/seed/vg1/1200/800', lat: 45.7131, lng: 16.0728,
    mayor: 'Krešimir Ačkar', areaCode: '01', zipCode: '10410', officialWeb: 'https://www.gorica.hr',
    description: 'Grad zrakoplovstva smješten u srcu Turopolja.' 
  },
  { 
    slug: 'knin', name: 'Knin', region: 'Dalmatinska Zagora', population: '11,633',
    image: 'https://picsum.photos/seed/knin1/1200/800', lat: 44.0344, lng: 16.1961,
    mayor: 'Marijo Ćaćić', areaCode: '022', zipCode: '22300', officialWeb: 'https://www.knin.hr',
    description: 'Kraljevski grad i ključna strateška točka Dalmacije.' 
  },
  { 
    slug: 'makarska', name: 'Makarska', region: 'Dalmacija', population: '13,834',
    image: 'https://picsum.photos/seed/makarska1/1200/800', lat: 43.2936, lng: 17.0197,
    mayor: 'Zoran Paunović', areaCode: '021', zipCode: '21300', officialWeb: 'https://www.makarska.hr',
    description: 'Srce Makarske rivijere smješteno podno planine Biokovo.' 
  },
  { 
    slug: 'opatija', name: 'Opatija', region: 'Kvarner', population: '10,619',
    image: 'https://picsum.photos/seed/opatija1/1200/800', lat: 45.3331, lng: 14.3039,
    mayor: 'Fernando Kirigin', areaCode: '051', zipCode: '51410', officialWeb: 'https://www.opatija.hr',
    description: 'Dama hrvatskog turizma s bogatom poviješću i lungomare šetnicom.' 
  },
  { 
    slug: 'umag', name: 'Umag', region: 'Istra', population: '12,699',
    image: 'https://picsum.photos/seed/umag1/1200/800', lat: 45.4371, lng: 13.5244,
    mayor: 'Vili Bassanese', areaCode: '052', zipCode: '52470', officialWeb: 'https://www.umag.hr',
    description: 'Hrvatska vrata u Europu i poznati teniski centar.' 
  },
  { 
    slug: 'sinj', name: 'Sinj', region: 'Dalmatinska Zagora', population: '23,452',
    image: 'https://picsum.photos/seed/sinj1/1200/800', lat: 43.7031, lng: 16.6339,
    mayor: 'Miro Bulj', areaCode: '021', zipCode: '21230', officialWeb: 'https://www.sinj.hr',
    description: 'Viteški grad poznat po Sinjskoj alci i Gospi Sinjskoj.' 
  }
];

export const ISLANDS: Location[] = [
  { 
    slug: 'hvar', name: 'Hvar', region: 'Dalmacija', population: '11,077',
    image: 'https://picsum.photos/seed/hvar1/1200/800', lat: 43.1729, lng: 16.4425,
    mayor: 'Ricardo Novak', areaCode: '021', zipCode: '21450', officialWeb: 'https://www.hvar.hr',
    description: 'Najsunčaniji hrvatski otok s najstarijim kazalištem u Europi.' 
  },
  { 
    slug: 'brac', name: 'Brač', region: 'Dalmacija', population: '14,434',
    image: 'https://picsum.photos/seed/brac1/1200/800', lat: 43.3289, lng: 16.6346,
    mayor: 'Ivana Marković (Supetar)', areaCode: '021', zipCode: '21400',
    description: 'Najviši jadranski otok s legendarnom plažom Zlatni rat.' 
  },
  { 
    slug: 'korcula', name: 'Korčula', region: 'Dalmacija', population: '15,522',
    image: 'https://picsum.photos/seed/korcula1/1200/800', lat: 42.9611, lng: 16.8988,
    mayor: 'Nika Silić Maroević', areaCode: '020', zipCode: '20260',
    description: 'Otok Marka Pola i viteške igre Moreška.' 
  },
  { 
    slug: 'vis', name: 'Vis', region: 'Dalmacija', population: '3,445',
    image: 'https://picsum.photos/seed/vis1/1200/800', lat: 43.0611, lng: 16.1833,
    mayor: 'Tonka Ivčević', areaCode: '021', zipCode: '21480',
    description: 'Otok bogate vojne povijesti i netaknute prirode.' 
  },
  { 
    slug: 'krk', name: 'Krk', region: 'Kvarner', population: '19,383',
    image: 'https://picsum.photos/seed/krk1/1200/800', lat: 45.0250, lng: 14.5750,
    mayor: 'Darijo Vasilić', areaCode: '051', zipCode: '51500',
    description: 'Zlatni otok povezan mostom s kopnom.' 
  },
  { 
    slug: 'pag', name: 'Pag', region: 'Kvarner/Dalmacija', population: '8,398',
    image: 'https://picsum.photos/seed/pag1/1200/800', lat: 44.4450, lng: 15.0560,
    mayor: 'Ante Fabijanić', areaCode: '023', zipCode: '23250',
    description: 'Otok sira, čipke i mjesečevog pejsaža.' 
  },
  { 
    slug: 'losinj', name: 'Lošinj', region: 'Kvarner', population: '7,537',
    image: 'https://picsum.photos/seed/losinj1/1200/800', lat: 44.5333, lng: 14.4667,
    mayor: 'Ana Kučić', areaCode: '051', zipCode: '51550',
    description: 'Otok vitalnosti i miomirisa.' 
  },
  { 
    slug: 'rab', name: 'Rab', region: 'Kvarner', population: '9,328',
    image: 'https://picsum.photos/seed/rab1/1200/800', lat: 44.7567, lng: 14.7600,
    mayor: 'Nikola Grgurić', areaCode: '051', zipCode: '51280',
    description: 'Sretni otok s četiri zvonika.' 
  },
  { 
    slug: 'mljet', name: 'Mljet', region: 'Južna Dalmacija', population: '1,088',
    image: 'https://picsum.photos/seed/mljet1/1200/800', lat: 42.7444, lng: 17.5367,
    description: 'Zeleni otok s nacionalnim parkom i slanim jezerima.' 
  },
  { 
    slug: 'cres', name: 'Cres', region: 'Kvarner', population: '2,879',
    image: 'https://picsum.photos/seed/cres1/1200/800', lat: 44.9600, lng: 14.4100,
    mayor: 'Marin Gregorović', areaCode: '051', zipCode: '51557',
    description: 'Otok bjeloglavih supova i Vranskog jezera.' 
  },
  { 
    slug: 'murter', name: 'Murter', region: 'Dalmacija', population: '5,060',
    image: 'https://picsum.photos/seed/murter1/1200/800', lat: 43.8167, lng: 15.6000,
    description: 'Vrata Kornata povezana pokretnim mostom.' 
  },
  { 
    slug: 'dugi-otok', name: 'Dugi otok', region: 'Dalmacija', population: '2,873',
    image: 'https://picsum.photos/seed/dugi1/1200/800', lat: 43.9833, lng: 15.0000,
    description: 'Otok s prekrasnim svjetionikom Veli Rat i parkom Telašćica.' 
  },
  { 
    slug: 'solta', name: 'Šolta', region: 'Dalmacija', population: '1,700',
    image: 'https://picsum.photos/seed/solta1/1200/800', lat: 43.3833, lng: 16.3000,
    description: 'Otok meda, maslina i mirnog odmora.' 
  },
  { 
    slug: 'pasman', name: 'Pašman', region: 'Dalmacija', population: '2,850',
    image: 'https://picsum.photos/seed/pasman1/1200/800', lat: 43.9500, lng: 15.3667,
    description: 'Otok s najčišćim morem zbog čestih izmjena struja.' 
  },
  { 
    slug: 'ugljan', name: 'Ugljan', region: 'Dalmacija', population: '6,100',
    image: 'https://picsum.photos/seed/ugljan1/1200/800', lat: 44.0833, lng: 15.1667,
    description: 'Vrt Zadra, prekriven maslinicima.' 
  },
  { 
    slug: 'lastovo', name: 'Lastovo', region: 'Južna Dalmacija', population: '792',
    image: 'https://picsum.photos/seed/lastovo1/1200/800', lat: 42.7667, lng: 16.9000,
    description: 'Otok kristalnih zvijezda i netaknute prirode.' 
  },
  { 
    slug: 'silba', name: 'Silba', region: 'Zadarski arhipelag', population: '292',
    image: 'https://picsum.photos/seed/silba1/1200/800', lat: 44.3833, lng: 14.7000,
    description: 'Otok bez automobila, idealan za potpuni mir.' 
  },
  { 
    slug: 'olib', name: 'Olib', region: 'Zadarski arhipelag', population: '140',
    image: 'https://picsum.photos/seed/olib1/1200/800', lat: 44.3833, lng: 14.7833,
    description: 'Skroviti otok pješčanih uvala i mira.' 
  },
  { 
    slug: 'molat', name: 'Molat', region: 'Zadarski arhipelag', population: '197',
    image: 'https://picsum.photos/seed/molat1/1200/800', lat: 44.2333, lng: 14.8333,
    description: 'Otok tišine i prekrasnih uvala za nautičare.' 
  },
  { 
    slug: 'iz', name: 'Iž', region: 'Zadarski arhipelag', population: '615',
    image: 'https://picsum.photos/seed/iz1/1200/800', lat: 44.0500, lng: 15.1167,
    description: 'Otok lončarstva i tradicionalne dalmatinske pjesme.' 
  },
  { 
    slug: 'prvic', name: 'Prvić', region: 'Šibenski arhipelag', population: '403',
    image: 'https://picsum.photos/seed/prvic1/1200/800', lat: 43.7333, lng: 15.8000,
    description: 'Otok Fausta Vrančića, izumitelja padobrana.' 
  },
  { 
    slug: 'zlarin', name: 'Zlarin', region: 'Šibenski arhipelag', population: '284',
    image: 'https://picsum.photos/seed/zlarin1/1200/800', lat: 43.6833, lng: 15.8500,
    description: 'Otok koralja i čuvar tradicije ronjenja.' 
  },
  { 
    slug: 'lopud', name: 'Lopud', region: 'Elafitski otoci', population: '249',
    image: 'https://picsum.photos/seed/lopud1/1200/800', lat: 42.6833, lng: 17.9500,
    description: 'Otok prekrasne pješčane plaže Šunj.' 
  },
  { 
    slug: 'kolocep', name: 'Koločep', region: 'Elafitski otoci', population: '163',
    image: 'https://picsum.photos/seed/kolocep1/1200/800', lat: 42.6667, lng: 18.0000,
    description: 'Najjužniji naseljeni otok u Hrvatskoj.' 
  },
  { 
    slug: 'susak', name: 'Susak', region: 'Kvarner', population: '151',
    image: 'https://picsum.photos/seed/susak1/1200/800', lat: 44.5167, lng: 14.3000,
    description: 'Jedinstveni pješčani otok s posebnim dijalektom.' 
  }
];

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
