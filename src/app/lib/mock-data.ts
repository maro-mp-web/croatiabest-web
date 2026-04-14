import { CATEGORIES } from './constants';

export const MOCK_LISTINGS = [
  {
    id: '1',
    name: 'Dubrovnik Old Town Beach',
    address: 'Banje Beach, Dubrovnik',
    categoryId: 'beaches',
    lat: 42.6412,
    lng: 18.1147,
    logo: 'https://picsum.photos/seed/beach1/100/100',
    images: Array(5).fill(0).map((_, i) => `https://picsum.photos/seed/beach${i}/600/400`),
    phone: '+385 20 123 456',
    email: 'info@banje.com',
    web: 'https://croatiabest.com/banje', // non-indexed
  },
  {
    id: '2',
    name: 'Restaurant Nautika',
    address: 'Brsalje 3, Dubrovnik',
    categoryId: 'restaurants',
    lat: 42.6418,
    lng: 18.1051,
    logo: 'https://picsum.photos/seed/rest1/100/100',
    images: Array(10).fill(0).map((_, i) => `https://picsum.photos/seed/rest${i}/600/400`),
    videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
    phone: '+385 20 442 526',
    email: 'nautika@restoran.hr',
    web: 'https://nautikarestaurant.com', // indexed
    facebook: 'fb.com/nautika',
    twitter: '@nautika',
    youtube: 'youtube.com/nautika',
    menu: [
      { name: 'Dalmatian Peka', price: '45 EUR' },
      { name: 'Fresh Lobster', price: '80 EUR' }
    ]
  },
  {
    id: '3',
    name: 'Hotel Excelsior',
    address: 'Frana Supila 12, Dubrovnik',
    categoryId: 'hotels',
    lat: 42.6405,
    lng: 18.1180,
    logo: 'https://picsum.photos/seed/hotel1/100/100',
    images: Array(10).fill(0).map((_, i) => `https://picsum.photos/seed/hotel${i}/600/400`),
    phone: '+385 20 353 353',
    rooms: 158,
    beds: 320,
    web: 'https://adriaticluxuryhotels.com/hotel-excelsior-dubrovnik',
  }
];

export const MOCK_ARTICLES = [
  {
    id: 'a1',
    title: 'Hidden Gems of Dalmatia',
    excerpt: 'Explore the islands you never knew existed.',
    category: 'Putovanja',
    image: 'https://picsum.photos/seed/island/800/600',
    author: 'Admin',
    date: 'Feb 24, 2024'
  },
  {
    id: 'a2',
    title: 'Top 5 Restaurants in Zagreb',
    excerpt: 'Where to eat when visiting the capital.',
    category: 'Blog',
    image: 'https://picsum.photos/seed/zagreb/800/600',
    author: 'Admin',
    date: 'Feb 22, 2024'
  }
];