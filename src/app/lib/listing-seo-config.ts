/**
 * High-Impact SEO Optimization Registry for Quick-Win Rankings
 * Targets Google Search Console opportunities for top keywords:
 * 1. "plaže jadranovo"
 * 2. "plaža vela luka"
 * 3. "beach žal"
 * 4. "plaža obojena"
 * 5. "gradska ljekarna zagreb dežurna ljekarna novi zagreb av v holjevca"
 */

export interface ListingSeoOverride {
  targetKeywords: string[];
  seoTitle: string;
  seoDescription: string;
  h1Title: string;
  seoKeywords: string[];
  enrichedDescription: string;
  faqs: Array<{ question: string; answer: string }>;
}

export const LISTING_SEO_OVERRIDES: Record<string, ListingSeoOverride> = {
  // 1. plaže jadranovo
  'plaz-a-jadranovo': {
    targetKeywords: ['plaže jadranovo', 'plaza jadranovo', 'jadranovo plaze', 'uvala grabrova jadranovo', 'havisce jadranovo'],
    seoTitle: 'Plaže Jadranovo — Vodič kroz najljepše plaže i uvale | CroatiaBest',
    seoDescription: 'Istražite najljepše plaže u Jadranovu: uvala Grabrova s ljuljačkom u moru, šljunčana uvala Havišće, Tunera i mirne prirodne uvale. Vodič, more i parking.',
    h1Title: 'Plaže Jadranovo — Vodič kroz najljepše uvale i plaže',
    seoKeywords: ['plaže jadranovo', 'plaža jadranovo', 'jadranovo uvale', 'uvala grabrova', 'uvala havišće', 'jadranovo kupanje', 'crikvenička rivijera plaže'],
    enrichedDescription: `Jadranovo je slikovito primorsko mjesto na Crikveničkoj rivijeri, poznato po iznimno čistom moru, borovim šumama i nizu romantičnih prirodnih uvala. Među najpopularnijim lokacijama ističe se uvala Grabrova, moderna šljunčana plaža s prepoznatljivom drvenom ljuljačkom u plićaku, uređenim sunčalištem i ugostiteljskim objektima. Za ljubitelje netaknute prirode i tirkiznog mora, uvala Havišće nudi miran šljunčani ambijent okružen mediteranskim raslinjem. Tu je i povijesna ribarska drvena Tunera te uvala Lokvišće, poznata po prirodnom ljekovitom blatu i arheološkim nalazištima. Plaže u Jadranovu idealne su za obitelji s djecom, parove i sve koji traže opuštanje bez masovnih gužvi.`,
    faqs: [
      {
        question: 'Koje su najpoznatije plaže u Jadranovu?',
        answer: 'Najpoznatije plaže u Jadranovu su uvala Grabrova (glavna šljunčana plaža s ljuljačkom u moru i kafićima), uvala Havišće (prekrasan šljunak i tirkizno more), uvala Trstena te plaža ispod povijesne Tunere i uvala Lokvišće s ljekovitim blatom.'
      },
      {
        question: 'Jesu li plaže u Jadranovu pogodne za obitelji s malom djecom?',
        answer: 'Da, posebno uvala Grabrova i uvala Havišće. Imaju blag i postepen ulaz u more sa sitnim šljunkom, čisto i mirno more te dijelove s prirodnim borovim hladom.'
      },
      {
        question: 'Ima li osiguran parking u blizini plaža u Jadranovu?',
        answer: 'U blizini uvale Grabrova i u samom centru mjesta postoji nekoliko javnih parkirališta. Tijekom srpnja i kolovoza preporučuje se dolazak u prijepodnevnim satima radi lakšeg pronalaženja mjesta.'
      },
      {
        question: 'Kakvo je more i sadržaji na plažama u Jadranovu?',
        answer: 'More u Jadranovu je kristalno čisto zbog blagih morskih strujanja u kanalu. Na glavnim plažama dostupni su kafići, beach barovi, tuševi, klupe i mogućnost najma ležaljki i pedalina.'
      }
    ]
  },

  // 2. plaža vela luka
  'plaz-a-vela-lka': {
    targetKeywords: ['plaža vela luka', 'plaza vela luka', 'gradska plaza vela luka', 'vela luka plaze', 'kupanje vela luka korcula'],
    seoTitle: 'Plaža Vela Luka (Gradska plaža) — Otok Korčula Vodič | CroatiaBest',
    seoDescription: 'Plaža Vela Luka — potpuni vodič za gradsku plažu i uvale u Veloj Luci na otoku Korčuli. Saznajte sve o moru, šljunku, hladovini, parkingu i taxi boatu za Proizd.',
    h1Title: 'Plaža Vela Luka (Gradska plaža — Otok Korčula)',
    seoKeywords: ['plaža vela luka', 'gradska plaža vela luka', 'vela luka korčula', 'plaže vela luka', 'otok korčula plaže', 'uvala lučica vela luka'],
    enrichedDescription: `Vela Luka, smještena u dubokom i zaklonjenom zaljevu na zapadnom dijelu otoka Korčule, nudi raznolika mjesta za kupanje od gradske plaže do spektakularnih okolnih otočića. Gradska plaža u Veloj Luci uređeno je kupalište s kombinacijom šljunka i betoniranih platoa, savršeno za brzo osvježenje, obiteljsko kupanje i šetnju uz obalu. More je mirno i zaklonjeno od jakih valova. Za cjelodnevni izlet, iz luke svakodnevno voze brzi taxi brodovi do čarobnog otočića Proizda, koji slovi za jednu od najljepših morskih oaza na Jadranu s bijelim kamenim pločama i kristalnim tirkiznim morem. U samoj Veloj Luci uz obalu nalaze se kafići, restorani i šetnica u sjeni borova.`,
    faqs: [
      {
        question: 'Kakva je gradska plaža u Veloj Luci?',
        answer: 'Gradska plaža u Veloj Luci nudi uređeni šljunčani dio s blagim ulazom u more i ravne kamene/betonske platoe za sunčanje. More je ugodno, zaklonjeno u zaljevu i sigurno za kupače.'
      },
      {
        question: 'Kako doći do najljepših plaža u okolici Vele Luke (otočić Proizd)?',
        answer: 'Iz centra Vele Luke svakodnevno tijekom ljeta voze redoviti taxi brodovi (vožnja traje oko 30 minuta) do obližnjeg otočića Proizd s 4 veličanstvene tirkizne uvale, uključujući Bili Bok.'
      },
      {
        question: 'Ima li na plaži u Veloj Luci prirodnog hlada i ugostiteljskih sadržaja?',
        answer: 'Da, duž obale nalaze se borova stabla koja pružaju ugodan prirodni hlad, a u neposrednoj blizini nalaze se brojni restorani, kafići i slastičarnice.'
      }
    ]
  },

  // 3. beach žal
  'plaz-a-z-al': {
    targetKeywords: ['beach žal', 'plaza zal', 'beach zal cavtat', 'plaža žal', 'žal beach croatia'],
    seoTitle: 'Beach Žal (Plaža Žal) — Vodič, fotografije i sadržaji | CroatiaBest',
    seoDescription: 'Beach Žal (Plaža Žal) — popularna šljunčana plaža s kristalnim morem, prirodnom hladovinom, vodenim sportovima i beach barovima. Detalji, parking i savjeti.',
    h1Title: 'Beach Žal (Plaža Žal) — Vodič kroz plažu i sadržaje',
    seoKeywords: ['beach žal', 'plaža žal', 'beach zal', 'plaža žal cavtat', 'šljunčana plaža žal', 'najbolje plaže dubrovnik cavtat'],
    enrichedDescription: `Beach Žal (Plaža Žal) jedna je od najpoznatijih i najomiljenijih šljunčanih plaža na južnom Jadranu. Odlikuje je besprijekorno čisto more azurne boje, fini oblutci ugodni za hodanje i ležanje te bogat izbor rekreativnih sadržaja. Plaža je opremljena ležaljkama, suncobranima, tuševima i kabinama za presvlačenje. Ljubitelji aktivnog odmora ovdje mogu uživati u vodenim sportovima poput najma jet-skija, vožnje na tubama, pedalina i ronjenja na dah. U zaleđu plaže proteže se pojas borove šume koji osigurava spas od ljetnih vrućina, a uz samu obalu rade moderni beach barovi i restorani s ponudom osvježavajućih pića, koktela i dalmatinskih specijaliteta.`,
    faqs: [
      {
        question: 'Kakav je sastav plaže Beach Žal (kamen, šljunak ili pijesak)?',
        answer: 'Beach Žal je prirodna šljunčana plaža sa sitnim, zaobljenim oblutcima i blagim ulazom u more, što je čini izuzetno ugodnom za kupače svih uzrasta.'
      },
      {
        question: 'Koje vodene sportove i sadržaje nudi Beach Žal?',
        answer: 'Na plaži su dostupni najam ležaljki i suncobrana, jet-ski, vožnja na banani i tubama, kajaci, pedaline, tereni za odbojku na pijesku te masaže uz more.'
      },
      {
        question: 'Nudi li Beach Žal hladovinu i restorane?',
        answer: 'Da, iza plaže pruža se gusta borova šuma koja osigurava prirodan cjelodnevni hlad, a u sklopu plaže nalaze se popularni beach barovi i restorani.'
      }
    ]
  },

  // 4. plaža obojena
  'plaza-obojena': {
    targetKeywords: ['plaža obojena', 'plaza obojena', 'obojena split', 'obojena svjetlost', 'plaza kastelet split'],
    seoTitle: 'Plaža Obojena (Obojena Svjetlost) Split — Vodič | CroatiaBest',
    seoDescription: 'Plaža Obojena (Obojena Svjetlost / Kaštelet) u Splitu podno Marjana. Saznajte sve o moru, šljunku, parkingu, beach baru i kupanju u Splitu.',
    h1Title: 'Plaža Obojena (Obojena Svjetlost) — Split',
    seoKeywords: ['plaža obojena', 'obojena split', 'plaža obojena svjetlost', 'uvala kaštelet', 'plaže split', 'marjan plaže split'],
    enrichedDescription: `Plaža Obojena, među Splićanima generacijama poznata i kao "Obojena svjetlost" ili uvala Kaštelet, jedna je od najatraktivnijih i najprepoznatljivijih gradskih plaža u Splitu. Smještena je na južnim padinama park-šume Marjan, u neposrednoj blizini Meštrovićevog kašteleta i galerije. Ovu šljunčanu uvalu krasi bistro i otvoreno more s prekrasnim pogledom prema otocima Braču i Šolti. Plaža je idealna za opušteno kupanje, ima postepen ulaz u more te nudi kombinaciju prirodnog šljunka i stijena na rubnim dijelovima uvale. Na samoj plaži nalazi se prostrani plato s kultnim kafićem i terasom gdje se možete osvježiti uz kavu, piće ili sladoled tik uz more.`,
    faqs: [
      {
        question: 'Gdje se nalazi plaža Obojena u Splitu i kako doći do nje?',
        answer: 'Plaža Obojena (uvala Kaštelet) nalazi se na južnoj strani Marjana u četvrti Meje, svega 20-ak minuta ugodne šetnje od splitske Rive ili nekoliko minuta autom/autobusom linije broj 12.'
      },
      {
        question: 'Ima li plaža Obojena osiguran parking za automobile?',
        answer: 'Da, iznad same plaže nalazi se veliko javno parkiralište, što je čini jednom od rijetkih plaža na Marjanu s izravnim pristupom za automobile.'
      },
      {
        question: 'Kakvo je more i dno na plaži Obojena?',
        answer: 'Plaža je šljunčana s čistim morem i blagim ulazom. Zbog položaja prema otvorenom kanalu, more se brzo izmjenjuje i izrazito je prozirno.'
      }
    ]
  },

  // 5. gradska ljekarna zagreb dežurna ljekarna novi zagreb av v holjevca
  'gradska-ljekarna-zagreb': {
    targetKeywords: [
      'gradska ljekarna zagreb dežurna ljekarna novi zagreb av v holjevca',
      'dežurna ljekarna novi zagreb',
      'ljekarna avenija veceslava holjevca',
      'gradska ljekarna zagreb siget',
      'dezurna ljekarna zagreb 0 24'
    ],
    seoTitle: 'Gradska Ljekarna Zagreb (Dežurna ljekarna 0-24 Novi Zagreb) | CroatiaBest',
    seoDescription: 'Gradska ljekarna Zagreb — popis dežurnih ljekarni 0-24: Novi Zagreb (Siget, Av. V. Holjevca 22), Ozaljska 1, Trg bana Jelačića 3. Radno vrijeme, telefon i adrese.',
    h1Title: 'Gradska ljekarna Zagreb — Dežurna ljekarna 0-24 (Novi Zagreb & Centar)',
    seoKeywords: [
      'gradska ljekarna zagreb dežurna ljekarna novi zagreb av v holjevca',
      'dežurna ljekarna novi zagreb',
      'ljekarna siget avenija v holjevca',
      'gradska ljekarna zagreb',
      'dežurna ljekarna zagreb 0-24',
      'gradska ljekarna ozaljska'
    ],
    enrichedDescription: `Gradska ljekarna Zagreb osigurava neprekidnu opskrbu lijekovima i medicinskim proizvodima kroz mrežu dežurnih ljekarni koje rade 00-24 sata svakog dana, uključujući nedjelje, blagdane i noćne sate. Za područje Novog Zagreba glavna dežurna ljekarna je Ljekarna Siget na adresi Avenija Većeslava Holjevca 22 (Novi Zagreb), s osiguranim noćnim prozorom i dostupnim dežurnim magistrima farmacije. Na području Trešnjevke 0-24 dežurstvo pruža Gradska ljekarna Ozaljska 1, u centru grada na Trgu bana Josipa Jelačića 3, te u Dubravi na adresi Grižanska 4 i u Črnomercu na adresi Ilica 301. Ovdje možete preuzeti propisane recepte, hitne lijekove i savjete o terapiji u bilo koje doba dana i noći.`,
    faqs: [
      {
        question: 'Koja je stalna dežurna ljekarna 0-24 u Novom Zagrebu (Avenija Većeslava Holjevca)?',
        answer: 'U Novom Zagrebu stalno dežurstvo od 00 do 24 sata ima Gradska ljekarna Siget, smještena na adresi Avenija Većeslava Holjevca 22 (kod Doma zdravlja Siget). Telefon: 01 6525 425.'
      },
      {
        question: 'Koje su ostale dežurne ljekarne Gradske ljekarne Zagreb koje rade 0-24h?',
        answer: 'U Zagrebu 24 sata dnevno (00-24h) dežuraju: 1. Trg bana J. Jelačića 3 (Centar), 2. Ilica 301 (Črnomerec), 3. Ozaljska 1 (Trešnjevka), 4. Grižanska 4 (Dubrava) i 5. Avenija Većeslava Holjevca 22 (Novi Zagreb - Siget).'
      },
      {
        question: 'Kako funkcionira preuzimanje lijekova tijekom noćnog dežurstva (20:00 - 07:00)?',
        answer: 'Tijekom noćnih sati i blagdana ljekarna radi kroz noćni šalter (prozor). Zvonom pozovete dežurnog ljekarnika koji preuzima zdravstvenu iskaznicu/recept i izdaje lijekove.'
      }
    ]
  }
};

/**
 * Helper to find matching SEO override by slug or ID
 */
export function getSeoOverride(slugOrId: string): ListingSeoOverride | null {
  if (!slugOrId) return null;
  const s = slugOrId.toLowerCase();

  // 1. Exact or partial key match
  for (const [key, override] of Object.entries(LISTING_SEO_OVERRIDES)) {
    if (s.includes(key) || key.includes(s)) {
      return override;
    }
  }

  // 2. Specific known IDs or phrases
  if (s.includes('amkb1u7980e82b2') || s.includes('jadranovo')) {
    return LISTING_SEO_OVERRIDES['plaz-a-jadranovo'];
  }
  if (s.includes('cif7tslob4694n3') || s.includes('vela-lka') || s.includes('vela-luka')) {
    return LISTING_SEO_OVERRIDES['plaz-a-vela-lka'];
  }
  if (s.includes('7lf9fzt022dx991') || s.includes('z-al') || s.includes('beach-zal') || s.includes('plaza-zal')) {
    return LISTING_SEO_OVERRIDES['plaz-a-z-al'];
  }
  if (s.includes('obojena')) {
    return LISTING_SEO_OVERRIDES['plaza-obojena'];
  }
  if (s.includes('ozaljska') || s.includes('siget') || s.includes('holjevc') || s.includes('ljekarna-zagreb')) {
    return LISTING_SEO_OVERRIDES['gradska-ljekarna-zagreb'];
  }

  return null;
}
