
import { CATEGORIES } from './constants';

export const MOCK_LISTINGS = [
  // --- BESPLATNE KATEGORIJE (FREE) ---
  {
    id: 'f1',
    name: 'Zračna luka Franjo Tuđman',
    address: 'Ulica Rudolfa Fizira 21, Zagreb',
    categoryId: 'airport',
    lat: 45.7429,
    lng: 16.0688,
    logo: 'https://picsum.photos/seed/zgrlogo/100/100',
    images: ['https://picsum.photos/seed/zgr-airport/1200/800'],
    phone: '+385 1 4562 170',
    email: 'info@zagreb-airport.hr',
    web: 'https://www.zagreb-airport.hr',
    description: 'Glavna zračna luka u Hrvatskoj, moderni terminal s vrhunskom uslugom za putnike.'
  },
  {
    id: 'f2',
    name: 'Plaža Bačvice',
    address: 'Preradovićevo šetalište, Split',
    categoryId: 'beaches',
    lat: 43.5011,
    lng: 16.4485,
    logo: 'https://picsum.photos/seed/baclogo/100/100',
    images: ['https://picsum.photos/seed/bacvice/1200/800'],
    description: 'Legendarna splitska pješčana plaža, domovina picigina i centar ljetne zabave.',
    phone: '+385 21 123 456'
  },
  {
    id: 'f3',
    name: 'Park Maksimir',
    address: 'Maksimirski perivoj 1, Zagreb',
    categoryId: 'parks',
    lat: 45.8231,
    lng: 16.0194,
    logo: 'https://picsum.photos/seed/maxlogo/100/100',
    images: ['https://picsum.photos/seed/maksimir/1200/800'],
    description: 'Najstariji i najljepši javni park u jugoistočnoj Europi, idealan za šetnju i rekreaciju.'
  },
  {
    id: 'f4',
    name: 'Luka Split - Riva',
    address: 'Obala narodnog preporoda, Split',
    categoryId: 'port',
    lat: 43.5075,
    lng: 16.4391,
    logo: 'https://picsum.photos/seed/rivlogo/100/100',
    images: ['https://picsum.photos/seed/split-port/1200/800'],
    description: 'Srce grada Splita, kultno okupljalište i glavna luka za sve dalmatinske otoke.'
  },
  {
    id: 'f5',
    name: 'Vidikovac Marjan',
    address: 'Telegrin, Split',
    categoryId: 'viewpoints',
    lat: 43.5085,
    lng: 16.4252,
    logo: 'https://picsum.photos/seed/marlogo/100/100',
    images: ['https://picsum.photos/seed/marjan/1200/800'],
    description: 'Najljepši pogled na Split, otoke i Kaštelanski zaljev s vrha brda Marjan.'
  },
  {
    id: 'f6',
    name: 'Plaža Banje',
    address: 'Frana Supila 10, Dubrovnik',
    categoryId: 'beaches',
    lat: 42.6412,
    lng: 18.1147,
    logo: 'https://picsum.photos/seed/banlogo/100/100',
    images: ['https://picsum.photos/seed/banje/1200/800'],
    description: 'Prekrasna plaža s pogledom na zidine Starog grada i otok Lokrum.'
  },
  {
    id: 'f7',
    name: 'Glavni Kolodvor Zagreb',
    address: 'Trg kralja Tomislava 12, Zagreb',
    categoryId: 'train_station',
    lat: 45.8052,
    lng: 15.9791,
    logo: 'https://picsum.photos/seed/trainlogo/100/100',
    images: ['https://picsum.photos/seed/train/1200/800'],
    description: 'Povijesna zgrada kolodvora i glavno željezničko čvorište Hrvatske.'
  },

  // --- PLAĆENE KATEGORIJE (PAID) ---
  {
    id: 'p1',
    name: 'Restoran Nautika',
    address: 'Brsalje 3, Dubrovnik',
    categoryId: 'restaurants',
    lat: 42.6418,
    lng: 18.1051,
    logo: 'https://picsum.photos/seed/nautlogo/100/100',
    images: Array(5).fill(0).map((_, i) => `https://picsum.photos/seed/nautika${i}/1200/800`),
    videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
    phone: '+385 20 442 526',
    email: 'nautika@restoran.hr',
    web: 'https://nautikarestaurant.com',
    description: 'Jedan od najprestižnijih restorana na svijetu, smješten na samim zidinama Dubrovnika.',
    menu: [
      { name: 'Jastog na dalmatinski', price: '85 EUR' },
      { name: 'Kvarnerski škampi', price: '60 EUR' }
    ]
  },
  {
    id: 'p2',
    name: 'Hotel Excelsior',
    address: 'Frana Supila 12, Dubrovnik',
    categoryId: 'hotels',
    lat: 42.6405,
    lng: 18.1180,
    logo: 'https://picsum.photos/seed/exclogo/100/100',
    images: Array(5).fill(0).map((_, i) => `https://picsum.photos/seed/excelsior${i}/1200/800`),
    phone: '+385 20 353 353',
    rooms: 158,
    beds: 320,
    web: 'https://adriaticluxuryhotels.com',
    description: 'Ikonski hotel s pet zvjezdica koji nudi neusporediv luksuz i pogled na Stari grad.'
  }
];

export const MOCK_ARTICLES = [
  {
    id: 'a1',
    title: 'Skriveni dragulji Dalmacije',
    excerpt: 'Istražite otoke za koje niste znali da postoje.',
    category: 'Putovanja',
    image: 'https://picsum.photos/seed/island/800/600',
    author: 'Admin',
    date: 'Feb 24, 2024'
  },
  {
    id: 'a2',
    title: 'Top 5 restorana u Zagrebu',
    excerpt: 'Gdje jesti prilikom posjeta glavnom gradu.',
    category: 'Blog',
    image: 'https://picsum.photos/seed/zagreb/800/600',
    author: 'Admin',
    date: 'Feb 22, 2024'
  }
];
