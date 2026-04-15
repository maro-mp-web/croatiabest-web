
import { CATEGORIES, CITIES } from './constants';

// Pomoćna funkcija za generiranje velikog broja besplatnih objekata po gradu
const generateFreeListings = () => {
  const listings: any[] = [];
  const freeCategories = CATEGORIES.filter(c => c.type === 'free');

  CITIES.forEach((city) => {
    // Svaki grad dobiva barem 30 besplatnih objekata
    for (let i = 1; i <= 30; i++) {
      const category = freeCategories[i % freeCategories.length];
      const id = `free-${city.slug}-${i}`;
      
      let name = "";
      let description = "";
      
      // Različiti nazivi ovisno o kategoriji za autentičnost
      switch(category.id) {
        case 'beaches': name = `Plaža ${city.name} ${i}`; description = "Prekrasna javna plaža s kristalno čistim morem."; break;
        case 'parks': name = `Park ${city.name} - Zona ${i}`; description = "Zelena oaza idealna za odmor i rekreaciju."; break;
        case 'institutions': name = `Gradska uprava ${city.name} - Ured ${i}`; description = "Službene prostorije gradske uprave."; break;
        case 'viewpoints': name = `Vidikovac ${city.name} Panoramski ${i}`; description = "Mjesto s kojeg se pruža najljepši pogled na grad."; break;
        case 'emergency': name = `Hitna pomoć ${city.name} - Punkt ${i}`; description = "Dežurna medicinska služba dostupna 0-24."; break;
        case 'police': name = `Policijska postaja ${city.name} ${i}`; description = "Služba za održavanje javnog reda i mira."; break;
        default: name = `${category.name} ${city.name} ${i}`; description = `Službeni objekt kategorije ${category.name}.`;
      }

      listings.push({
        id: id,
        name: name,
        address: `Ulica ${city.name} br. ${i}, ${city.name}`,
        city: city.name,
        categoryId: category.id,
        lat: 45.0 + Math.random() * 2,
        lng: 15.0 + Math.random() * 3,
        logo: `https://picsum.photos/seed/${id}-logo/100/100`,
        images: [
          `https://picsum.photos/seed/${id}-img1/1200/800`,
          `https://picsum.photos/seed/${id}-img2/1200/800`
        ],
        description: description,
        phone: `+385 ${i}${i} ${i}i${i} ${i}i${i}`,
        email: `info-${city.slug}@${category.id}.hr`,
        web: `https://www.${city.slug}.hr`
      });
    }
  });

  return listings;
};

// Ručno dodani "premium" primjeri koji su već bili u sustavu
const PREMIUM_EXAMPLES = [
  {
    id: 'f-airport-zg',
    name: 'Zračna luka Franjo Tuđman',
    address: 'Ulica Rudolfa Fizira 21, Zagreb',
    categoryId: 'airport',
    images: ['https://picsum.photos/seed/zgr-airport/1200/800'],
    description: 'Glavna zračna luka u Hrvatskoj, moderni terminal s vrhunskom uslugom za putnike.'
  },
  {
    id: 'p1',
    name: 'Restoran Nautika',
    address: 'Brsalje 3, Dubrovnik',
    categoryId: 'restaurants',
    images: Array(5).fill(0).map((_, i) => `https://picsum.photos/seed/nautika${i}/1200/800`),
    phone: '+385 20 442 526',
    description: 'Jedan od najprestižnijih restorana na svijetu, smješten na samim zidinama Dubrovnika.',
    type: 'paid'
  }
];

export const MOCK_LISTINGS = [...generateFreeListings(), ...PREMIUM_EXAMPLES];

export const MOCK_ARTICLES = [
  {
    id: 'a1',
    title: 'Skriveni dragulji Dalmacije',
    excerpt: 'Istražite otoke za koje niste znali da postoje.',
    category: 'Putovanja',
    image: 'https://picsum.photos/seed/island/800/600',
    author: 'Admin',
    date: 'Feb 24, 2024'
  }
];
