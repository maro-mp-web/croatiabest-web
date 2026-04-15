
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
    title: 'Skriveni dragulji Dalmacije: Otoci koje morate posjetiti',
    excerpt: 'Istražite otoke za koje niste znali da postoje i doživite pravi mir Jadrana.',
    content: `Hrvatska obala krije nevjerojatne tajne koje čekaju da budu otkrivene. Dok su Hvar, Brač i Korčula na vrhu popisa svakog turista, postoje manji otoci koji nude autentično iskustvo bez gužve.

U ovom članku vodimo vas kroz arhipelag Visa i Lastova, mjesta gdje vrijeme kao da je stalo. Naučit ćete kako doći do skrivenih uvala, gdje pojesti najbolju svježu ribu direktno s broda i zašto je noćno nebo iznad Lastova jedno od najčišćih u Europi.

Bilo da ste zaljubljenik u jedrenje ili tražite savršeno mjesto za digitalni detoks, ovi skriveni dragulji Dalmacije će vas ostaviti bez daha.`,
    category: 'Putovanja',
    image: 'https://picsum.photos/seed/island-article/1200/800',
    author: 'Marko Jadranski',
    date: 'Feb 24, 2024',
    readTime: '5 min'
  },
  {
    id: 'a2',
    title: 'Vrhunski Gastro Vodič: Najbolji tartufi u Istri',
    excerpt: 'Otkrijte tajne istarskih šuma i najbolje restorane koji služe ovaj dragocjeni gomolj.',
    content: `Istra je poznata kao zemlja tartufa, a miris ovog dragocjenog gomolja prožima svaku vrhunsku konobu u unutrašnjosti poluotoka. No, kako prepoznati pravi kvalitetan tartuf?

U suradnji s lokalnim lovcima na tartufe iz okolice Motovuna, donosimo vam priču o bijelom i crnom tartufu. Saznajte kada je sezona lova, kako psi dresirani za ovaj posao pronalaze blago skriveno pod zemljom i koje su najbolje kombinacije s domaćom tjesteninom - fužima i pljukancima.`,
    category: 'Gastronomija',
    image: 'https://picsum.photos/seed/truffles/1200/800',
    author: 'Ana Istarska',
    date: 'Feb 20, 2024',
    readTime: '7 min'
  },
  {
    id: 'a3',
    title: 'Povijest u kamenu: Tajne Dioklecijanove palače',
    excerpt: 'Sve što niste znali o srcu Splita i kako je rimski car živio u svojoj mirovini.',
    content: `Dioklecijanova palača nije samo spomenik, to je živi grad u kojem se tisućljećima odvija svakodnevni život. Od podruma koji su inspirirali filmske setove do Peristila koji je srce društvenog života Splita.

U ovom članku istražujemo arhitektonska čuda koja su preživjela stoljeća i otkrivamo manje poznate priče o rimskim vojnicima, egipatskim sfingama koje i danas čuvaju ulaze te o tome kako se život unutar zidina mijenjao kroz povijest.`,
    category: 'Kultura',
    image: 'https://picsum.photos/seed/split-palace/1200/800',
    author: 'Luka Splitski',
    date: 'Feb 15, 2024',
    readTime: '6 min'
  }
];
