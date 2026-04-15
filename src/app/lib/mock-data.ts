
import { CATEGORIES, CITIES } from './constants';

const EMERGENCY_SERVICES = [
  { city: 'Zagreb', pharmacy: 'Ljekarna Trg bana Jelačića 3', pPhone: '01 4816 198', emergency: 'KBC Rebro', ePhone: '01 2388 888', police: 'Petrinjska 30', fire: 'Savska cesta 1' },
  { city: 'Split', pharmacy: 'Ljekarna Lučac (Pupačićeva 4)', pPhone: '021 533 188', emergency: 'KBC Firule', ePhone: '021 556 111', police: 'Trg Hrvatske bratske zajednice 9', fire: 'Hercegovačka 18' },
  { city: 'Dubrovnik', pharmacy: 'Ljekarna Kod zvonika (Placa)', pPhone: '020 321 133', emergency: 'Opća bolnica Dubrovnik', ePhone: '020 431 777', police: 'Dr. Ante Starčevića 13', fire: 'Put Republike 11' },
  { city: 'Zadar', pharmacy: 'Ljekarna Centar (Poljana Pape Aleksandra III)', pPhone: '023 302 920', emergency: 'Opća bolnica Zadar', ePhone: '023 505 505', police: 'Ulica bana Josipa Jelačića 30', fire: 'Put Murvice 24' },
  { city: 'Rijeka', pharmacy: 'Ljekarna Centar (Korzo 11)', pPhone: '051 333 543', emergency: 'KBC Rijeka', ePhone: '051 658 111', police: 'Ulica žrtava fašizma 3', fire: 'Krešimirova ulica 38' },
  { city: 'Pula', pharmacy: 'Ljekarna Centar (Giardini 14)', pPhone: '052 222 544', emergency: 'Opća bolnica Pula', ePhone: '052 376 000', police: 'Trg Republike 1', fire: 'Dobrilina ulica 16' },
  { city: 'Šibenik', pharmacy: 'Ljekarna Varoš (Kralja Zvonimira 32)', pPhone: '022 332 684', emergency: 'Opća bolnica Šibenik', ePhone: '022 641 641', police: 'Velimira Škorpika 5', fire: 'Ulica bana Josipa Jelačića 2' },
  { city: 'Osijek', pharmacy: 'Ljekarna Centar (Trg Ante Starčevića 7)', pPhone: '031 205 722', emergency: 'KBC Osijek', ePhone: '031 512 512', police: 'Trg Lavoslava Ružičke 1', fire: 'Ulica Ivana Gundulića 160' },
];

const generateFreeListings = () => {
  const listings: any[] = [];
  
  CITIES.forEach((city) => {
    const services = EMERGENCY_SERVICES.find(s => s.city === city.name);
    if (services) {
      // Dežurna ljekarna
      listings.push({
        id: `pharmacy-${city.slug}`,
        name: `DEŽURNA LJEKARNA: ${services.pharmacy}`,
        address: services.pharmacy,
        city: city.name,
        categoryId: 'pharmacy',
        phone: services.pPhone,
        description: 'Dežurna ljekarna dostupna 0-24 za hitne slučajeve.',
        images: ['https://picsum.photos/seed/pharmacy/1200/800']
      });
      // Hitna
      listings.push({
        id: `emergency-${city.slug}`,
        name: `HITNA POMOĆ: ${services.emergency}`,
        address: services.emergency,
        city: city.name,
        categoryId: 'emergency',
        phone: services.ePhone,
        description: 'Centralni hitni prijem dostupna 0-24.',
        images: ['https://picsum.photos/seed/hospital/1200/800']
      });
      // Policija
      listings.push({
        id: `police-${city.slug}`,
        name: `POLICIJSKA POSTAJA: ${city.name}`,
        address: services.police,
        city: city.name,
        categoryId: 'police',
        phone: '192',
        description: 'Služba za održavanje javnog reda i mira.',
        images: ['https://picsum.photos/seed/police/1200/800']
      });
    }

    // Dodajemo ostalih 27 random objekata da bude ukupno 30
    for (let i = 1; i <= 27; i++) {
      const category = CATEGORIES.find(c => c.id === 'beaches' || c.id === 'parks' || c.id === 'institutions')!;
      listings.push({
        id: `free-${city.slug}-${i}`,
        name: `${category.name} ${city.name} ${i}`,
        address: `Ulica ${city.name} br. ${i}`,
        city: city.name,
        categoryId: category.id,
        description: `Javni objekt u gradu ${city.name}.`,
        images: [`https://picsum.photos/seed/${city.slug}${i}/1200/800`]
      });
    }
  });

  return listings;
};

export const MOCK_LISTINGS = [...generateFreeListings()];

export const MOCK_ARTICLES = [
  {
    id: 'a1',
    title: 'Skriveni dragulji Dalmacije',
    excerpt: 'Istražite otoke za koje niste znali da postoje.',
    content: `Hrvatska obala krije nevjerojatne tajne...`,
    category: 'Putovanja',
    image: 'https://picsum.photos/seed/island-article/1200/800',
    author: 'Marko Jadranski',
    date: 'Feb 24, 2024',
    readTime: '5 min'
  }
];
