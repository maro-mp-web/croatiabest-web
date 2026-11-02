/**
 * High-Impact SEO Optimization Registry for Quick-Win Rankings
 * Targets Google Search Console opportunities for top queried objects:
 * - Ljekarna Korčula & Hitna Vela Luka / Korčula
 * - Ljekarna Lumbarda, Vodice, Rovinj, Makarska, Crikvenica, Selce, Umag
 * - Cavtat (Plaža, Hitna, Ljekarna), Poreč, Nin, Tribunj, Tučepi, Split Križine, Klaićeva Zagreb
 * Includes enriched descriptions, authoritative editorial guidance, verified internal cross-links, and FAQ schemas.
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
    enrichedDescription: `<p>Jadranovo je slikovito primorsko mjesto na Crikveničkoj rivijeri, poznato po iznimno čistom moru, borovim šumama i nizu romantičnih prirodnih uvala. Među najpopularnijim lokacijama ističe se <strong>uvala Grabrova</strong>, moderna šljunčana plaža s prepoznatljivom drvenom ljuljačkom u plićaku, uređenim sunčalištem i ugostiteljskim objektima.</p>
<p>Za ljubitelje netaknute prirode i tirkiznog mora, <strong>uvala Havišće</strong> nudi miran šljunčani ambijent okružen mediteranskim raslinjem. Tu je i povijesna ribarska drvena Tunera te uvala Lokvišće, poznata po prirodnom ljekovitom blatu i arheološkim nalazištima.</p>
<p>Ako boravite u Jadranovu ili obližnjim mjestima, u hitnim slučajevima dostupna vam je <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-crikvenica" class="text-primary font-bold hover:underline">Hitna medicinska služba Crikvenica</a>, a za lijekove i savjete posjetite <a href="/objekt/ljekarna/ljekarna-selce" class="text-primary font-bold hover:underline">Ljekarnu Selce</a> ili istražite kompletan <a href="/gradovi/crikvenica" class="text-primary font-bold hover:underline">vodič kroz Crikveničku rivijeru</a>.</p>`,
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
    enrichedDescription: `<p>Vela Luka, smještena u dubokom i zaklonjenom zaljevu na zapadnom dijelu otoka Korčule, nudi raznolika mjesta za kupanje od gradske plaže do spektakularnih okolnih otočića. Gradska plaža u Veloj Luci uređeno je kupalište s kombinacijom šljunka i betoniranih platoa za sunčanje, savršeno za brzo osvježenje i obiteljsko kupanje.</p>
<p>Za cjelodnevni morski izlet, iz luke svakodnevno voze brzi taxi brodovi do čarobnog otočića <strong>Proizda</strong>, koji slovi za jednu od najljepših morskih oaza na Jadranu s bijelim kamenim pločama i kristalnim tirkiznim morem.</p>
<p>U slučaju zdravstvenih potreba, u neposrednoj blizini centra nalaze se <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka" class="text-primary font-bold hover:underline">Hitna medicinska služba Vela Luka</a>, dežurna <a href="/objekt/ljekarna/ljekarna-vela-luka-dezurna-blato" class="text-primary font-bold hover:underline">Ljekarna Blato / Vela Luka</a> te <a href="/objekt/policija/policijska-postaja-vela-luka" class="text-primary font-bold hover:underline">Policijska postaja Vela Luka</a>. Sve detalje o otoku saznajte u našem <a href="/otoci/korcula" class="text-primary font-bold hover:underline">vodiču kroz otok Korčulu</a>.</p>`,
    faqs: [
      {
        question: 'Kakva je gradska plaža u Veloj Luci?',
        answer: 'Gradska plaža u Veloj Luci nudi uređeni šljunčani dio s blagim ulazom u more i ravne kamene/betonske platoe za sunčanje. More je ugodno, zaklonjeno u zaljevu i sigurno za kupače.'
      },
      {
        question: 'Kako doći do otočića Proizda iz Vele Luke?',
        answer: 'Iz centra Vele Luke svakodnevno tijekom ljeta voze redoviti taxi brodovi (vožnja traje oko 30 minuta) do obližnjeg otočića Proizd s 4 veličanstvene tirkizne uvale, uključujući Bili Bok.'
      }
    ]
  },

  // 3. beach žal
  'plaz-a-z-al': {
    targetKeywords: ['beach žal', 'plaza zal', 'beach zal cavtat', 'plaža žal', 'žal beach croatia'],
    seoTitle: 'Beach Žal (Plaža Žal Cavtat) — Vodič, fotografije i sadržaji | CroatiaBest',
    seoDescription: 'Beach Žal (Plaža Žal) u Cavtatu — popularna šljunčana plaža s kristalnim morem, prirodnom hladovinom, vodenim sportovima i beach barovima. Detalji, parking i savjeti.',
    h1Title: 'Beach Žal (Plaža Žal — Cavtat)',
    seoKeywords: ['beach žal', 'plaža žal', 'beach zal', 'plaža žal cavtat', 'šljunčana plaža žal', 'najbolje plaže cavtat'],
    enrichedDescription: `<p>Beach Žal (Plaža Žal) u Cavtatu jedna je od najpoznatijih i najomiljenijih šljunčanih plaža na južnom Jadranu. Odlikuje je besprijekorno čisto more azurne boje, fini oblutci ugodni za hodanje i ležanje te bogat izbor rekreativnih sadržaja.</p>
<p>Plaža je opremljena ležaljkama, suncobranima, tuševima i kabinama za presvlačenje, uz obilje borove hladovine. U blizini možete posjetiti i uređenu <a href="/objekt/plaza/plaza-cavtat-gradska-plaza" class="text-primary font-bold hover:underline">Gradsku plažu Cavtat</a>.</p>
<p>U mjestu su vam nadohvat ruke i <a href="/objekt/ljekarna/ljekarna-cavtat" class="text-primary font-bold hover:underline">Ljekarna Cavtat</a> te <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-cavtat" class="text-primary font-bold hover:underline">Hitna medicinska služba Cavtat</a>. Istražite i <a href="/objekt/znamenitost/stara-gradska-luka" class="text-primary font-bold hover:underline">Staru gradsku luku Dubrovnik</a> te naš <a href="/gradovi/cavtat" class="text-primary font-bold hover:underline">turistički vodič kroz Cavtat</a>.</p>`,
    faqs: [
      {
        question: 'Kakav je sastav plaže Beach Žal u Cavtatu?',
        answer: 'Beach Žal je prirodna šljunčana plaža sa sitnim, zaobljenim oblutcima i blagim ulazom u more, što je čini izuzetno ugodnom za kupače svih uzrasta.'
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
    enrichedDescription: `<p>Plaža Obojena, među Splićanima generacijama poznata i kao "Obojena svjetlost" ili uvala Kaštelet, jedna je od najatraktivnijih i najprepoznatljivijih gradskih plaža u Splitu. Smještena je na južnim padinama park-šume Marjan, u neposrednoj blizini Meštrovićevog kašteleta i galerije.</p>
<p>Ovu šljunčanu uvalu krasi bistro i otvoreno more s prekrasnim pogledom prema otocima Braču i Šolti. U slučaju potrebe za medicinskom skrbi u Splitu, na raspolaganju je dežurna bolnica <a href="/objekt/hitna-pomoc/kbc-split-krizine" class="text-primary font-bold hover:underline">KBC Split - Križine</a>. Pročitajte i naš cjeloviti <a href="/gradovi/split" class="text-primary font-bold hover:underline">vodič kroz Split</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi plaža Obojena u Splitu i kako doći do nje?',
        answer: 'Plaža Obojena (uvala Kaštelet) nalazi se na južnoj strani Marjana u četvrti Meje, svega 20-ak minuta ugodne šetnje od splitske Rive ili nekoliko minuta autom/autobusom linije broj 12.'
      },
      {
        question: 'Ima li plaža Obojena osiguran parking za automobile?',
        answer: 'Da, iznad same plaže nalazi se veliko javno parkiralište, što je čini jednom od rijetkih plaža na Marjanu s izravnim pristupom za automobile.'
      }
    ]
  },

  // 5. gradska ljekarna zagreb dežurna 0-24
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
    enrichedDescription: `<p>Gradska ljekarna Zagreb osigurava neprekidnu opskrbu lijekovima i medicinskim proizvodima kroz mrežu dežurnih ljekarni koje rade 00-24 sata svakog dana, uključujući nedjelje, blagdane i noćne sate.</p>
<p>Za područje Novog Zagreba glavna dežurna ljekarna je <strong>Ljekarna Siget</strong> na adresi <em>Avenija Većeslava Holjevca 22</em> (Novi Zagreb), s noćnim šalterom i dostupnim dežurnim magistrima farmacije. U istočnom dijelu grada na usluzi je i <a href="/objekt/ljekarna/gradska-ljekarna-zagreb-maksimirska" class="text-primary font-bold hover:underline">Gradska ljekarna Maksimirska</a>, a za najmlađe pacijente stalno dežura <a href="/objekt/hitna-pomoc/klinika-za-djecje-bolesti-zagreb-klaiceva" class="text-primary font-bold hover:underline">Klinika za dječje bolesti Klaićeva</a>. Saznajte više u <a href="/gradovi/zagreb" class="text-primary font-bold hover:underline">vodiču kroz Zagreb</a>.</p>`,
    faqs: [
      {
        question: 'Koja je stalna dežurna ljekarna 0-24 u Novom Zagrebu (Avenija Većeslava Holjevca)?',
        answer: 'U Novom Zagrebu stalno dežurstvo od 00 do 24 sata ima Gradska ljekarna Siget, smještena na adresi Avenija Većeslava Holjevca 22 (kod Doma zdravlja Siget). Telefon: 01 6525 425.'
      },
      {
        question: 'Koje su ostale dežurne ljekarne Gradske ljekarne Zagreb koje rade 0-24h?',
        answer: 'U Zagrebu 24 sata dnevno (00-24h) dežuraju: 1. Trg bana J. Jelačića 3 (Centar), 2. Ilica 301 (Črnomerec), 3. Ozaljska 1 (Trešnjevka), 4. Grižanska 4 (Dubrava) i 5. Avenija Većeslava Holjevca 22 (Novi Zagreb - Siget).'
      }
    ]
  },

  // 6. Ljekarna Korčula - Dežurna (Gradska)
  'ljekarna-korcula-dezurna-gradska': {
    targetKeywords: [
      'ljekarna korcula',
      'dežurna ljekarna korčula',
      'ljekarna korčula radno vrijeme',
      'gradska ljekarna korčula',
      'pharmacy korcula',
      'ljekarna korcula centar'
    ],
    seoTitle: 'Ljekarna Korčula (Dežurna Gradska) — Radno Vrijeme i Adresa | CroatiaBest',
    seoDescription: 'Ljekarna Korčula (Gradska dežurna ljekarna) u starom gradu Korčuli. Radno vrijeme, ljetna dežurstva, adresa Trg sv. Marka, hitni lijekovi i kontakt.',
    h1Title: 'Ljekarna Korčula — Dežurna gradska ljekarna (Centar)',
    seoKeywords: [
      'ljekarna korčula',
      'dežurna ljekarna korčula',
      'gradska ljekarna korčula',
      'ljekarna korcula radno vrijeme',
      'pharmacy korcula old town',
      'korcula ljekarne'
    ],
    enrichedDescription: `<p><strong>Ljekarna Korčula (Gradska ljekarna)</strong> središnja je zdravstvena ljekarnička ustanova u gradu Korčuli, smještena u samoj povijesnoj jezgri na adresi <em>Trg sv. Marka 1</em>. Pruža kompletnu opskrbu propisanim lijekovima na recept, bezreceptnim pripravcima, dermokozmetikom, medicinskim pomagalima te proizvodima za zaštitu od sunca i ljetne tegobe.</p>
<p>Tijekom ljetnih mjeseci ljekarna organizira produženo radno vrijeme i dežurstva kako bi zadovoljila potrebe brojnih domaćih i stranih posjetitelja. Ako vam zatreba hitna medicinska intervencija ili liječnički pregled na otoku, na raspolaganju su vam <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula" class="text-primary font-bold hover:underline">Hitna medicinska služba Korčula</a> te na drugom kraju otoka <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka" class="text-primary font-bold hover:underline">Hitna medicinska služba Vela Luka</a>.</p>
<p>Za područje istočnog dijela otoka provjerite i rad <a href="/objekt/ljekarna/ljekarna-korcula-dezurna-lumbarda" class="text-primary font-bold hover:underline">Ljekarne Lumbarda</a>, a na zapadnom dijelu <a href="/objekt/ljekarna/ljekarna-vela-luka-dezurna-blato" class="text-primary font-bold hover:underline">Ljekarnu Blato / Vela Luka</a>. Sve znamenitosti istražite u našem <a href="/gradovi/korcula" class="text-primary font-bold hover:underline">vodiču kroz grad Korčulu</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se točno nalazi dežurna Gradska ljekarna u Korčuli?',
        answer: 'Ljekarna se nalazi u samom centru starog grada Korčule, na adresi Trg sv. Marka 1, u neposrednoj blizini korčulanske katedrale.'
      },
      {
        question: 'Kakav je raspored dežurstava ljekarne u Korčuli tijekom ljeta?',
        answer: 'Tijekom turističke sezone ljekarna radi s produženim radnim vremenom dvokratno ili cjelodnevno, uz organiziranu pripravnost i dežurstva vikendom i blagdanima.'
      },
      {
        question: 'Mogu li strani turisti preuzeti lijekove na recept u ljekarni u Korčuli?',
        answer: 'Da, uz važeću EU zdravstvenu iskaznicu (EHIC) ili privatni liječnički recept, magistri farmacije mogu izdati potrebnu terapiju sukladno važećim propisima.'
      }
    ]
  },

  // 7. Hitna medicinska služba Vela Luka
  'hitna-medicinska-sluzba-vela-luka': {
    targetKeywords: [
      'hitna medicinska služba vela luka',
      'hitna pomoć vela luka',
      'dom zdravlja vela luka',
      'emergency vela luka',
      'hitna vela luka telefon'
    ],
    seoTitle: 'Hitna Medicinska Služba Vela Luka (Hitna Pomoć 0-24) | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Vela Luka — dežurni tim hitne pomoći 0-24 na zapadnom dijelu otoka Korčule. Adresa, hitni brojevi 194 i 112, sanitetski prijevoz i upute.',
    h1Title: 'Hitna medicinska služba Vela Luka — Hitna pomoć 0-24',
    seoKeywords: [
      'hitna medicinska služba vela luka',
      'hitna pomoć vela luka',
      'hitna vela luka',
      'dom zdravlja vela luka',
      'emergency vela luka korcula',
      'hitna 194 vela luka'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Vela Luka</strong> (Zavod za hitnu medicinu Dubrovačko-neretvanske županije — Ispostava Vela Luka) osigurava neprekidnu hitnu medicinsku skrb <strong>00-24 sata dnevno</strong> za stanovnike i turiste na zapadnom dijelu otoka Korčule.</p>
<p>Timovi hitne pomoći pokrivaju područje općina Vela Luka, Blato, Smokvica, brojne okolne uvale i otočić Proizd. Za hitne intervencije na raspolaganju su opremljena sanitetska vozila, a za životno ugrožene pacijente organizira se hitni helikopterski transport (HHMS) ili brza brodica pomorske medicinske službe prema KBC-u Split ili Općoj bolnici Dubrovnik.</p>
<p>U slučaju manje hitnih tegoba i potrebe za lijekovima, u blizini vam je dostupna <a href="/objekt/ljekarna/ljekarna-vela-luka-dezurna-blato" class="text-primary font-bold hover:underline">Ljekarna Blato / Vela Luka</a>. Za sigurnost brine obližnja <a href="/objekt/policija/policijska-postaja-vela-luka" class="text-primary font-bold hover:underline">Policijska postaja Vela Luka</a>, a na drugom kraju otoka djeluje <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula" class="text-primary font-bold hover:underline">Hitna medicinska služba Korčula</a>. Pogledajte i vodič za <a href="/objekt/plaza/plaz-a-vela-lka" class="text-primary font-bold hover:underline">plaže u Veloj Luci</a>.</p>`,
    faqs: [
      {
        question: 'Koji broj nazvati za hitnu pomoć u Veloj Luci?',
        answer: 'Za hitne medicinske intervencije u Veloj Luci nazovite besplatni hitni broj 194 ili jedinstveni europski broj za hitne službe 112.'
      },
      {
        question: 'Radi li hitna medicinska služba u Veloj Luci noću i vikendom?',
        answer: 'Da, Ispostava hitne medicine u Veloj Luci dežurna je 24 sata dnevno, 7 dana u tjednu, uključujući sve blagdane i noćne sate.'
      },
      {
        question: 'Kako se obavlja hitan prijevoz pacijenata s otoka Korčule u bolnicu?',
        answer: 'U hitnim stanjima pacijenti se zbrinjavaju na licu mjesta i transportiraju brzim sanitetskim gliserom ili hitnim helikopterom izravno u KBC Split.'
      }
    ]
  },

  // 8. Ljekarna Korčula - Dežurna (Lumbarda)
  'ljekarna-korcula-dezurna-lumbarda': {
    targetKeywords: [
      'ljekarna lumbarda',
      'ljekarna korčula dežurna lumbarda',
      'ljekarna lumbarda radno vrijeme',
      'pharmacy lumbarda'
    ],
    seoTitle: 'Ljekarna Lumbarda (Otok Korčula) — Radno Vrijeme i Dežurstvo | CroatiaBest',
    seoDescription: 'Ljekarna Lumbarda na otoku Korčuli. Radno vrijeme, savjetovanje magistara, opskrba lijekovima za kupače i turiste u blizini pješčanih plaža Pržina i Bilin Žal.',
    h1Title: 'Ljekarna Korčula — Ispostava Lumbarda',
    seoKeywords: [
      'ljekarna lumbarda',
      'ljekarna lumbarda korčula',
      'dežurna ljekarna lumbarda',
      'pharmacy lumbarda korcula'
    ],
    enrichedDescription: `<p><strong>Ljekarna Lumbarda</strong> smještena je u slikovitom vinogradarskom i turističkom naselju Lumbarda na istočnom rtu otoka Korčule, poznatom po autohtonom vinu Grk i pješčanim uvalama <em>Vela Pržina</em> i <em>Bilin Žal</em>.</p>
<p>Ljekarna pruža brzu opskrbu lijekovima, sredstvima za rehidraciju, zaštitu od sunca, tretiranje uboda insekata i prvu pomoć. Za dežurstva izvan radnog vremena stanovnici i gosti oslanjaju se na središnju <a href="/objekt/ljekarna/ljekarna-korcula-dezurna-gradska" class="text-primary font-bold hover:underline">Gradsku ljekarnu u Korčuli</a> udaljenu svega 5 km.</p>
<p>Za hitna zdravstvena stanja pozovite <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula" class="text-primary font-bold hover:underline">Hitnu medicinsku službu Korčula</a>. Otkrijte više u našem <a href="/gradovi/korcula" class="text-primary font-bold hover:underline">vodiču kroz grad Korčulu i Lumbardu</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi ljekarna u Lumbardi?',
        answer: 'Ljekarna se nalazi u središtu Lumbarde, uz glavnu prometnicu koja povezuje luku i pješčane plaže Pržina i Bilin Žal.'
      },
      {
        question: 'Koja je najbliža dežurna ljekarna kada ljekarna u Lumbardi ne radi?',
        answer: 'Najbliža dežurna ljekarna je Gradska ljekarna Korčula, udaljena 10-ak minuta vožnje (oko 5 km) u starom gradu Korčuli.'
      }
    ]
  },

  // 9. Hitna medicinska služba Korčula
  'hitna-medicinska-sluzba-korcula': {
    targetKeywords: [
      'hitna medicinska služba korčula',
      'hitna pomoć korčula',
      'dom zdravlja korčula',
      'hitna korcula telefon',
      'emergency korcula'
    ],
    seoTitle: 'Hitna Medicinska Služba Korčula (Hitna Pomoć 0-24) | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Korčula — Zavod za hitnu medicinu i Dom zdravlja Korčula. Stalno dežurstvo 00-24h, adresa, telefoni 194 i 112 te sanitetske usluge.',
    h1Title: 'Hitna medicinska služba Korčula (Dom zdravlja & Zavod 0-24)',
    seoKeywords: [
      'hitna medicinska služba korčula',
      'hitna pomoć korčula',
      'dom zdravlja korčula',
      'hitna korčula telefon 194',
      'emergency medical korcula'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Korčula</strong> (u sklopu Doma zdravlja Korčula i Zavoda za hitnu medicinu Dubrovačko-neretvanske županije) pruža hitnu medicinsku pomoć <strong>24 sata dnevno, 365 dana u godini</strong>.</p>
<p>Timovi hitne pomoći opremljeni su modernim reanimacijskim vozilima i pokrivaju grad Korčulu, Lumbardu, Žrnovo, Račišće te pelješki kanal. Za hitne intervencije nazovite <strong>194</strong> ili <strong>112</strong>.</p>
<p>U neposrednoj blizini za opskrbu lijekovima dostupna je <a href="/objekt/ljekarna/ljekarna-korcula-dezurna-gradska" class="text-primary font-bold hover:underline">Ljekarna Korčula - Dežurna (Gradska)</a>, kao i <a href="/objekt/ljekarna/ljekarna-korcula-dezurna-lumbarda" class="text-primary font-bold hover:underline">Ljekarna Lumbarda</a>. Na zapadu otoka djeluje <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka" class="text-primary font-bold hover:underline">Hitna medicinska služba Vela Luka</a>. Saznajte sve o prometnoj povezanosti u <a href="/otoci/korcula" class="text-primary font-bold hover:underline">vodiču kroz otok Korčulu</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Hitna pomoć u gradu Korčuli?',
        answer: 'Hitna služba smještena je u sklopu Doma zdravlja Korčula, na adresi Ulica 57 br. 5, s osiguranim prilazom za sanitetska i osobna vozila.'
      },
      {
        question: 'Mogu li se strani državljani obratiti Hitnoj službi u Korčuli?',
        answer: 'Da, Hitna medicinska služba pruža neodgodivu medicinsku pomoć svim osobama bez obzira na državljanstvo uz predočenje europske kartice (EHIC) ili putnog osiguranja.'
      }
    ]
  },

  // 10. Hitna medicinska služba Vodice
  'hitna-medicinska-sluzba-vodice': {
    targetKeywords: [
      'hitna medicinska služba vodice',
      'hitna pomoć vodice',
      'turistička ambulanta vodice',
      'hitna vodice telefon',
      'dom zdravlja vodice'
    ],
    seoTitle: 'Hitna Medicinska Služba Vodice (Hitna Pomoć 24/7) | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Vodice — dežurna ambulanta i hitna pomoć u Vodicama. Radno vrijeme 0-24h, adresa uz Jadransku magistralu, telefon 194 i savjeti.',
    h1Title: 'Hitna medicinska služba Vodice — Hitna pomoć i turistička ambulanta',
    seoKeywords: [
      'hitna medicinska služba vodice',
      'hitna pomoć vodice',
      'turistička ambulanta vodice',
      'hitna vodice',
      'emergency vodice'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Vodice</strong> (Zavod za hitnu medicinu Šibensko-kninske županije) osigurava dežurnu medicinsku skrb 00-24h za područje Vodica, Tribunja, Srime i zaleđa.</p>
<p>Zbog velikog broja turista tijekom ljetnih mjeseci, u Vodicama djeluje i organizirana <strong>turistička ambulanta</strong> za lakša stanja, dok timovi hitne pomoći rješavaju hitne i po život opasne slučajeve uz brzu vezu prema Općoj bolnici Šibenik (udaljenoj oko 12 km).</p>
<p>Za nabavu propisanih lijekova posjetite obližnju <a href="/objekt/ljekarna/ljekarna-tribunj-farmacia" class="text-primary font-bold hover:underline">Ljekarnu Tribunj (Farmacia)</a> ili ljekarne u centru Vodica. Pročitajte i naš <a href="/gradovi/vodice" class="text-primary font-bold hover:underline">turistički vodič kroz Vodice</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Hitna pomoć u Vodicama?',
        answer: 'Hitna medicinska služba Vodice nalazi se na adresi Magistrala 27, na lako dostupnoj lokaciji uz glavnu prometnicu s prostranim parkingom.'
      },
      {
        question: 'Koji broj nazvati za hitne intervencije u Vodicama?',
        answer: 'Nazovite broj 194 (hitna medicinska pomoć) ili 112 (centar za hitne situacije).'
      }
    ]
  },

  // 11. Hitna medicinska služba Rovinj
  'hitna-medicinska-sluzba-rovinj': {
    targetKeywords: [
      'hitna medicinska služba rovinj',
      'hitna pomoć rovinj',
      'dom zdravlja rovinj',
      'emergency rovinj',
      'turistička ambulanta rovinj'
    ],
    seoTitle: 'Hitna Medicinska Služba Rovinj (Hitna Pomoć 0-24) | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Rovinj — dežurna hitna pomoć 00-24h i turistička ambulanta Istarskih domova zdravlja. Telefon 194/112, adresa u Istarskoj ulici i upute.',
    h1Title: 'Hitna medicinska služba Rovinj — Hitna pomoć i Dom zdravlja',
    seoKeywords: [
      'hitna medicinska služba rovinj',
      'hitna pomoć rovinj',
      'dom zdravlja rovinj',
      'turistička ambulanta rovinj',
      'emergency rovinj istria'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Rovinj</strong> (Ispostava Rovinj — Nastavni zavod za hitnu medicinu Istarske županije) smještena je u zgradi Istarskih domova zdravlja na adresi <em>Istarska ulica bb</em>.</p>
<p>Služba osigurava dežurstvo liječničkih timova <strong>24 sata dnevno</strong> za Rovinj, Bale, Kanfanar i Rovinjsko Selo. U ljetnoj sezoni unutar Doma zdravlja radi i turistička ambulanta za lakše preglede, previjanja i recepte.</p>
<p>U okolici potražite <a href="/objekt/ljekarna/ljekarna-bale" class="text-primary font-bold hover:underline">Ljekarnu Bale</a>, na sjeveru <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec" class="text-primary font-bold hover:underline">Hitnu medicinsku službu Poreč</a> i <a href="/objekt/ljekarna/ljekarna-porec-dezurna-gradska" class="text-primary font-bold hover:underline">Gradsku ljekarnu Poreč</a>. Više o gradu saznajte u našem <a href="/gradovi/rovinj" class="text-primary font-bold hover:underline">vodiču kroz Rovinj</a>.</p>`,
    faqs: [
      {
        question: 'Kome se obratiti u slučaju hitnoće u Rovinju?',
        answer: 'Nazovite hitnu medicinsku službu na 194 ili dođite izravno na hitni prijem u Istarskoj ulici bb u Rovinju.'
      },
      {
        question: 'Gdje se upućuju teži hitni slučajevi iz Rovinja?',
        answer: 'Teža hitna stanja nakon stabilizacije prevoze se sanitetskim vozilom u Opću bolnicu Pula, udaljenu oko 35 minuta vožnje.'
      }
    ]
  },

  // 12. Dom zdravlja Makarska & Hitna Makarska
  'dom-zdravlja-makarska': {
    targetKeywords: [
      'dom zdravlja makarska',
      'hitna pomoć makarska',
      'hitna makarska telefon',
      'zavod za hitnu medicinu makarska',
      'hitna medicinska sluzba makarska'
    ],
    seoTitle: 'Dom Zdravlja Makarska & Hitna Medicinska Služba (0-24) | CroatiaBest',
    seoDescription: 'Dom zdravlja Makarska i Hitna medicinska služba — dežurna hitna pomoć 00-24h na Makarskoj rivijeri. Adresa Stjepana Ivičevića 2, telefon 194 i turistička ambulanta.',
    h1Title: 'Dom zdravlja Makarska & Hitna medicinska služba (Makarska Rivijera)',
    seoKeywords: [
      'dom zdravlja makarska',
      'hitna pomoć makarska',
      'hitna makarska',
      'zavod za hitnu medicinu makarska',
      'emergency makarska'
    ],
    enrichedDescription: `<p><strong>Dom zdravlja Makarska i Hitna medicinska služba</strong> (Zavod za hitnu medicinu Splitsko-dalmatinske županije) centralna je medicinska ustanova za cijelu Makarsku rivijeru, smještena u Makarskoj na adresi <em>Stjepana Ivičevića 2</em>.</p>
<p>Hitna medicinska pomoć dostupna je <strong>0-24h</strong> za stanovnike i brojne goste općina Brela, Baška Voda, Makarska, Tučepi, Podgora i Gradac. U sklopu Doma zdravlja dostupne su specijalističke ordinacije, dijagnostički laboratorij, RTG i ljetna turistička ambulanta.</p>
<p>U blizini se nalazi <a href="/objekt/ljekarna/ljekarna-tucepi" class="text-primary font-bold hover:underline">Ljekarna Tučepi</a>, a za javni red brine <a href="/objekt/policija/policijska-postaja-makarska" class="text-primary font-bold hover:underline">Policijska postaja Makarska</a>. Za kompleksnije bolničke zahvate referentni centar je <a href="/objekt/hitna-pomoc/kbc-split-krizine" class="text-primary font-bold hover:underline">KBC Split - Križine</a>. Pogledajte i kompletan <a href="/gradovi/makarska" class="text-primary font-bold hover:underline">vodič kroz Makarsku</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se točno nalazi Hitna pomoć u Makarskoj?',
        answer: 'Hitna pomoć i Dom zdravlja nalaze se na adresi Stjepana Ivičevića 2, nedaleko od gradske luke i centra Makarske.'
      },
      {
        question: 'Koji broj nazvati za hitnu pomoć na Makarskoj rivijeri?',
        answer: 'Nazovite 194 ili jedinstveni europski broj za hitne situacije 112.'
      }
    ]
  },

  // 13. Hitna medicinska služba Crikvenica
  'hitna-medicinska-sluzba-crikvenica': {
    targetKeywords: [
      'hitna medicinska služba crikvenica',
      'hitna pomoć crikvenica',
      'dom zdravlja crikvenica',
      'turistička ambulanta crikvenica',
      'hitna crikvenica telefon'
    ],
    seoTitle: 'Hitna Medicinska Služba Crikvenica (Hitna Pomoć 0-24) | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Crikvenica — dežurna hitna pomoć 00-24h i turistička ambulanta. Adresa Kotorska 13a, telefoni 194 i 112, pokrivenost Crikvenice, Dramlja i Selca.',
    h1Title: 'Hitna medicinska služba Crikvenica — Crikvenička rivijera',
    seoKeywords: [
      'hitna medicinska služba crikvenica',
      'hitna pomoć crikvenica',
      'dom zdravlja crikvenica',
      'hitna crikvenica 194',
      'emergency crikvenica'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Crikvenica</strong> (Zavod za hitnu medicinu Primorsko-goranske županije — Ispostava Crikvenica) osigurava hitnu medicinsku skrb 0-24 sata na adresi <em>Kotorska 13a</em>.</p>
<p>Pokriva cijelu Crikveničku rivijeru uključujući Crikvenicu, Dramalj, Jadranovo i Selce. Za lakša stanja tijekom ljeta u sklopu Doma zdravlja organizirana je turistička ambulanta.</p>
<p>Za podizanje lijekova u susjedstvu na raspolaganju je <a href="/objekt/ljekarna/ljekarna-selce" class="text-primary font-bold hover:underline">Ljekarna Selce</a>, a za odmor posjetite čuvene <a href="/objekt/plaza/plaz-a-jadranovo" class="text-primary font-bold hover:underline">Plaže Jadranovo</a>. Istražite sve o Crikvenici u našem <a href="/gradovi/crikvenica" class="text-primary font-bold hover:underline">vodiču kroz grad Crikvenicu</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Hitna služba u Crikvenici?',
        answer: 'Nalazi se na adresi Kotorska ulica 13a u Crikvenici, u sklopu objekta Doma zdravlja s osiguranim prilazom za pacijente.'
      },
      {
        question: 'Koji je hitni telefon za Crikvenicu?',
        answer: 'Nazovite 194 za hitnu pomoć ili 112 za županijski centar 112.'
      }
    ]
  },

  // 14. Ljekarna Selce
  'ljekarna-selce': {
    targetKeywords: [
      'ljekarna selce',
      'ljekarna crikvenica selce',
      'ljekarna selce radno vrijeme',
      'dežurna ljekarna selce',
      'pharmacy selce'
    ],
    seoTitle: 'Ljekarna Selce (Crikvenica) — Radno Vrijeme i Dežurstvo | CroatiaBest',
    seoDescription: 'Ljekarna Selce pokraj Crikvenice. Radno vrijeme, adresa uz more, ljetna opskrba lijekovima, bezreceptnim preparatima i savjetovanje magistara farmacije.',
    h1Title: 'Ljekarna Selce — Crikvenička rivijera',
    seoKeywords: [
      'ljekarna selce',
      'ljekarna selce crikvenica',
      'ljekarna selce radno vrijeme',
      'pharmacy selce croatia'
    ],
    enrichedDescription: `<p><strong>Ljekarna Selce</strong> smještena je u samom srcu turističkog mjesta Selce, u neposrednoj blizini obalne šetnice i crikveničkih plaža.</p>
<p>Ljekarna nudi sveobuhvatnu ponudu lijekova na recept, bezreceptnih preparata, dječje hrane, kozmetike za sunčanje i rehidracijskih otopina. Za hitnu pomoć na rivijeri obratite se obližnjoj <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-crikvenica" class="text-primary font-bold hover:underline">Hitnoj medicinskoj službi Crikvenica</a>.</p>
<p>U blizini možete uživati na <a href="/objekt/plaza/plaz-a-jadranovo" class="text-primary font-bold hover:underline">plažama u Jadranovu</a>, a više informacija pronađite u našem <a href="/gradovi/crikvenica" class="text-primary font-bold hover:underline">vodiču kroz Crikvenicu i Selce</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Ljekarna Selce?',
        answer: 'Nalazi se u centru Selca, na pješačkoj udaljenosti od rive i glavnih kupališta.'
      },
      {
        question: 'Koja je najbliža dežurna ljekarna izvan radnog vremena?',
        answer: 'Za noćna dežurstva i blagdane dežura Gradska ljekarna u Crikvenici ili Rijeci (0-24).'
      }
    ]
  },

  // 15. Hitna medicinska služba Umag & Dom zdravlja Umag
  'hitna-medicinska-sluzba-umag': {
    targetKeywords: [
      'hitna medicinska služba umag',
      'dom zdravlja umag',
      'hitna pomoć umag',
      'emergency umag',
      'turistička ambulanta umag'
    ],
    seoTitle: 'Hitna Medicinska Služba & Dom Zdravlja Umag (0-24) | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Umag i Dom zdravlja. Stalno dežurstvo 00-24h, adresa Edoarda Pascalija 3, telefon 194/112, turistička ambulanta sjeverozapadne Istre.',
    h1Title: 'Hitna medicinska služba & Dom zdravlja Umag',
    seoKeywords: [
      'hitna medicinska služba umag',
      'dom zdravlja umag',
      'hitna pomoć umag',
      'emergency umag istria',
      'turistička ambulanta umag'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Umag</strong> i Dom zdravlja Umag (Nastavni zavod za hitnu medicinu Istarske županije) djeluju na adresi <em>Edoarda Pascalija 3</em> u Umagu.</p>
<p>Služba osigurava 24-satnu hitnu medicinsku skrb za gradove Umag, Buje, Novigrad i općine Brtoniglu i Oprtalj. Tijekom turističke sezone u sklopu Doma zdravlja organizirana je i <strong>turistička ambulanta</strong>.</p>
<p>Za sigurnost u blizini na raspolaganju je <a href="/objekt/policija/policijski-ured-novigrad" class="text-primary font-bold hover:underline">Policijski ured Novigrad</a>, u okolici možete posjetiti <a href="/objekt/ljekarna/ljekarna-vrsar" class="text-primary font-bold hover:underline">Ljekarnu Vrsar</a> te <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec" class="text-primary font-bold hover:underline">Hitnu službu Poreč</a>. Saznajte sve u našem <a href="/gradovi/umag" class="text-primary font-bold hover:underline">vodiču kroz grad Umag</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Hitna pomoć u Umagu?',
        answer: 'Hitna služba nalazi se u sklopu Doma zdravlja Umag, u ulici Edoarda Pascalija 3.'
      },
      {
        question: 'Koji broj nazvati za hitne slučajeve u Umagu?',
        answer: 'Nazovite 194 za hitnu medicinsku pomoć ili 112 za jedinstveni centar za hitne pozive.'
      }
    ]
  },

  // 16. Plaža Cavtat - Gradska plaža
  'plaza-cavtat-gradska-plaza': {
    targetKeywords: [
      'plaža cavtat',
      'gradska plaza cavtat',
      'cavtat plaze',
      'kupanje cavtat',
      'cavtat beach'
    ],
    seoTitle: 'Plaža Cavtat (Gradska plaža) — Vodič, More i Sadržaji | CroatiaBest',
    seoDescription: 'Gradska plaža u Cavtatu — šljunčano kupalište s prirodnom hladovinom borova, kristalno čistim morem, šetnicom i beach barovima. Detalji, parking i sadržaji.',
    h1Title: 'Plaža Cavtat (Gradska plaža — Cavtat)',
    seoKeywords: [
      'plaža cavtat',
      'gradska plaža cavtat',
      'cavtat plaže',
      'cavtat kupanje',
      'plaza rat cavtat'
    ],
    enrichedDescription: `<p><strong>Gradska plaža u Cavtatu</strong> popularno je kupalište smješteno uz šetnicu poluotoka Rat, okruženo gustom stoljetnom borovom šumom koja pruža obilan prirodni hlad tijekom vrućih ljetnih dana.</p>
<p>Kombinacija uređenih šljunčanih dijelova, ravnih kamenih stijena i kristalno čistog mora čini je savršenim izborom za obitelji i parove. U blizini se nalazi i omiljena plaža <a href="/objekt/plaza/plaz-a-z-al" class="text-primary font-bold hover:underline">Beach Žal Cavtat</a>.</p>
<p>U slučaju potrebe, u Cavtatu su vam dostupne <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-cavtat" class="text-primary font-bold hover:underline">Hitna medicinska služba Cavtat</a> i <a href="/objekt/ljekarna/ljekarna-cavtat" class="text-primary font-bold hover:underline">Ljekarna Cavtat</a>. Istražite i <a href="/objekt/znamenitost/stara-gradska-luka" class="text-primary font-bold hover:underline">Staru gradsku luku Dubrovnik</a> te naš <a href="/gradovi/cavtat" class="text-primary font-bold hover:underline">vodič kroz Cavtat</a>.</p>`,
    faqs: [
      {
        question: 'Kakav je sastav Gradske plaže u Cavtatu?',
        answer: 'Gradska plaža u Cavtatu kombinacija je sitnog šljunka, prirodnih ravnih stijena i betoniranih platoa s ljestvama za ulaz u more.'
      },
      {
        question: 'Ima li na plaži prirodnog hlada?',
        answer: 'Da, cijela šetnica i zaleđe plaže okruženi su gustom borovom šumom s cjelodnevnom ugodnom hladovinom.'
      }
    ]
  },

  // 17. Hitna medicinska služba Cavtat & Ljekarna Cavtat
  'hitna-medicinska-sluzba-cavtat': {
    targetKeywords: [
      'hitna medicinska služba cavtat',
      'hitna pomoć cavtat',
      'dom zdravlja cavtat',
      'emergency cavtat',
      'hitna cavtat telefon'
    ],
    seoTitle: 'Hitna Medicinska Služba Cavtat (Konavle) — 0-24 | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Cavtat — dežurni tim hitne medicine za područje Cavtata, Konavala i Zračne luke Dubrovnik. Hitni telefoni 194/112 i adresa.',
    h1Title: 'Hitna medicinska služba Cavtat (Općina Konavle)',
    seoKeywords: [
      'hitna medicinska služba cavtat',
      'hitna pomoć cavtat',
      'dom zdravlja cavtat',
      'hitna konavle',
      'emergency cavtat'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Cavtat</strong> (Zavod za hitnu medicinu Dubrovačko-neretvanske županije) osigurava 24-satnu hitnu medicinsku pomoć za područje Cavtata, Konavala i putnike Zračne luke Dubrovnik (Čilipi).</p>
<p>Nalazi se na strateškoj lokaciji koja omogućuje brze intervencije na terenu i izravnu vezu prema Općoj bolnici Dubrovnik. U Cavtatu za lijekove i savjete posjetite <a href="/objekt/ljekarna/ljekarna-cavtat" class="text-primary font-bold hover:underline">Ljekarnu Cavtat</a>.</p>
<p>Za opuštanje obiđite <a href="/objekt/plaza/plaza-cavtat-gradska-plaza" class="text-primary font-bold hover:underline">Gradsku plažu Cavtat</a> ili <a href="/objekt/plaza/plaz-a-z-al" class="text-primary font-bold hover:underline">Beach Žal</a>, a povijest upoznajte u <a href="/objekt/znamenitost/stara-gradska-luka" class="text-primary font-bold hover:underline">Staroj gradskoj luci Dubrovnik</a>. Sve pročitajte u našem <a href="/gradovi/cavtat" class="text-primary font-bold hover:underline">vodiču kroz Cavtat</a>.</p>`,
    faqs: [
      {
        question: 'Koji broj nazvati za hitnu pomoć u Cavtatu i Konavlima?',
        answer: 'Za hitne slučajeve nazovite besplatni broj 194 ili 112.'
      },
      {
        question: 'Koliko je udaljena Opća bolnica Dubrovnik od Cavtata?',
        answer: 'Opća bolnica Dubrovnik udaljena je oko 18 km (cca 20-25 minuta vožnje vozilom hitne pomoći).'
      }
    ]
  },

  // 18. Ljekarna Cavtat
  'ljekarna-cavtat': {
    targetKeywords: [
      'ljekarna cavtat',
      'ljekarna cavtat radno vrijeme',
      'pharmacy cavtat',
      'dežurna ljekarna cavtat'
    ],
    seoTitle: 'Ljekarna Cavtat (Konavle) — Radno Vrijeme i Adresa | CroatiaBest',
    seoDescription: 'Ljekarna Cavtat — opskrba lijekovima, bezreceptnim preparatima, dermokozmetikom i savjeti farmaceuta u Cavtatu. Radno vrijeme i dežurstva.',
    h1Title: 'Ljekarna Cavtat — Konavle & Dubrovnik Rivijera',
    seoKeywords: [
      'ljekarna cavtat',
      'ljekarna cavtat radno vrijeme',
      'pharmacy cavtat croatia',
      'ljekarna konavle'
    ],
    enrichedDescription: `<p><strong>Ljekarna Cavtat</strong> pruža kompletnu ljekarničku skrb za lokalno stanovništvo i brojne turiste koji borave u Cavtatu i okolnim konavoskim mjestima.</p>
<p>Dostupan je širok izbor lijekova na recept, preparata za prvu pomoć, krema za zaštitu od sunca, elektrolita i vitamina. U hitnim slučajevima na raspolaganju vam je obližnja <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-cavtat" class="text-primary font-bold hover:underline">Hitna medicinska služba Cavtat</a>.</p>
<p>Uživajte na kupalištima <a href="/objekt/plaza/plaza-cavtat-gradska-plaza" class="text-primary font-bold hover:underline">Gradska plaža Cavtat</a> i <a href="/objekt/plaza/plaz-a-z-al" class="text-primary font-bold hover:underline">Beach Žal</a>, te istražite naš <a href="/gradovi/cavtat" class="text-primary font-bold hover:underline">vodič kroz Cavtat</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi ljekarna u Cavtatu?',
        answer: 'Ljekarna se nalazi u središtu Cavtata, uz glavnu prometnicu s jednostavnim pješačkim i kolnim pristupom.'
      },
      {
        question: 'Koja je dežurna ljekarna noću u blizini Cavtata?',
        answer: 'Tijekom noći dežura Ljekarna Kod Zvonika u Dubrovniku (Stradun 4) ili dežurna ljekarna u sklopu Opće bolnice Dubrovnik.'
      }
    ]
  },

  // 19. Hitna medicinska služba Opatija
  'hitna-medicinska-sluzba-opatija': {
    targetKeywords: [
      'hitna medicinska služba opatija',
      'hitna pomoć opatija',
      'dom zdravlja opatija',
      'turistička ambulanta opatija',
      'hitna opatija telefon'
    ],
    seoTitle: 'Hitna Medicinska Služba Opatija (0-24) — Hitna Pomoć | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Opatija — 24/7 hitna pomoć na Opatijskoj rivijeri. Adresa Stubište dr. Vande Ekl 1, telefon 194, dežurni tim i turistička ambulanta.',
    h1Title: 'Hitna medicinska služba Opatija — Opatijska rivijera',
    seoKeywords: [
      'hitna medicinska služba opatija',
      'hitna pomoć opatija',
      'dom zdravlja opatija',
      'hitna opatija 194',
      'emergency opatija'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Opatija</strong> (Zavod za hitnu medicinu Primorsko-goranske županije — Ispostava Opatija) osigurava neprekidno 0-24h dežurstvo za Opatiju, Matulje, Lovran i Mošćeničku Dragu.</p>
<p>Za hitne intervencije nazovite <strong>194</strong> ili <strong>112</strong>. Za predivan pogled na cijeli Kvarnerski zaljev posjetite <a href="/objekt/vidikovac/vidikovac-veprinac" class="text-primary font-bold hover:underline">Vidikovac Veprinac</a> ili povijesni <a href="/objekt/vidikovac/vidikovac-kastav-crekvina" class="text-primary font-bold hover:underline">Vidikovac Kastav (Crekvina)</a>.</p>
<p>Saznajte sve o znamenitostima i hotelima u našem <a href="/gradovi/opatija" class="text-primary font-bold hover:underline">turističkom vodiču kroz Opatiju</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Hitna pomoć u Opatiji?',
        answer: 'Smještena je na adresi Stubište dr. Vande Ekl 1 u Opatiji, u neposrednoj blizini Doma zdravlja.'
      },
      {
        question: 'Koliko je KBC Rijeka udaljen od Opatije?',
        answer: 'KBC Rijeka (lokaliteti Sušak i Rijeka) udaljen je oko 14 km (cca 15-20 minuta vožnje sanitetskim vozilom).'
      }
    ]
  },

  // 20. Ljekarna Poreč - Dežurna (Gradska) & Hitna Poreč
  'ljekarna-porec-dezurna-gradska': {
    targetKeywords: [
      'ljekarna poreč dežurna',
      'ljekarna porec radno vrijeme',
      'gradska ljekarna poreč',
      'dežurna ljekarna poreč',
      'pharmacy porec'
    ],
    seoTitle: 'Ljekarna Poreč (Dežurna Gradska) — Radno Vrijeme i Adresa | CroatiaBest',
    seoDescription: 'Ljekarna Poreč (Gradska ljekarna) — radno vrijeme, noćna dežurstva, adresa na Trgu slobode, hitna opskrba lijekovima i savjetovanje magistara u Poreču.',
    h1Title: 'Ljekarna Poreč — Dežurna gradska ljekarna (Trg slobode)',
    seoKeywords: [
      'ljekarna poreč dežurna',
      'gradska ljekarna poreč',
      'ljekarna porec radno vrijeme',
      'pharmacy porec croatia',
      'dežurna ljekarna poreč 0-24'
    ],
    enrichedDescription: `<p><strong>Ljekarna Poreč (Gradska ljekarna)</strong> na <em>Trgu slobode 14</em> u Poreču središnja je gradska ljekarna s tradicijom i organiziranim dežurstvima vikendom, noću i blagdanima.</p>
<p>U Poreču djeluje i <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec" class="text-primary font-bold hover:underline">Hitna medicinska služba Poreč</a> na adresi Mauro Gioseffi 2. Ako putujete, u blizini je <a href="/objekt/autobusni-kolodvor/autobusna-stanica-porec" class="text-primary font-bold hover:underline">Autobusna stanica Poreč</a>, a južnije možete posjetiti <a href="/objekt/ljekarna/ljekarna-vrsar" class="text-primary font-bold hover:underline">Ljekarnu Vrsar</a> i <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-rovinj" class="text-primary font-bold hover:underline">Hitnu medicinsku službu Rovinj</a>.</p>
<p>Kompletan pregled znamenitosti pogledajte u našem <a href="/gradovi/porec" class="text-primary font-bold hover:underline">vodiču kroz Poreč</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Gradska ljekarna u Poreču?',
        answer: 'Nalazi se u samom centru grada, na Trgu slobode 14, na početku pješačke zone prema Eufrazijevoj bazilici.'
      },
      {
        question: 'Kako radi dežurstvo noću u ljekarni u Poreču?',
        answer: 'Tijekom noćnih sati lijekovi se izdaju kroz noćno zvono na ulazu ljekarne uz predočenje recepta ili za hitne slučajeve.'
      }
    ]
  },

  // 21. Hitna medicinska služba Poreč
  'hitna-medicinska-sluzba-porec': {
    targetKeywords: [
      'hitna medicinska služba poreč',
      'hitna pomoć poreč',
      'dom zdravlja poreč',
      'emergency porec',
      'hitna porec telefon'
    ],
    seoTitle: 'Hitna Medicinska Služba Poreč (Hitna Pomoć 0-24) | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Poreč — dežurna hitna pomoć 00-24h i turistička ambulanta. Adresa Mauro Gioseffi 2, telefoni 194 i 112, hitni timovi u Poreču.',
    h1Title: 'Hitna medicinska služba Poreč (Dom zdravlja 0-24)',
    seoKeywords: [
      'hitna medicinska služba poreč',
      'hitna pomoć poreč',
      'dom zdravlja poreč',
      'hitna poreč telefon 194',
      'emergency porec'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Poreč</strong> (Zavod za hitnu medicinu Istarske županije — Ispostava Poreč) nalazi se u sklopu Doma zdravlja na adresi <em>Dr. Mauro Gioseffi 2</em>.</p>
<p>Osigurava stalno 0-24h dežurstvo hitnih timova za grad Poreč, Tar-Vabrigu, Funtanu, Vrsar i Višnjan. U krugu objekta ljeti radi i turistička ambulanta.</p>
<p>Za podizanje lijekova posjetite <a href="/objekt/ljekarna/ljekarna-porec-dezurna-gradska" class="text-primary font-bold hover:underline">Gradsku ljekarnu Poreč</a> ili <a href="/objekt/ljekarna/ljekarna-vrsar" class="text-primary font-bold hover:underline">Ljekarnu Vrsar</a>. Za autobusne veze pogledajte <a href="/objekt/autobusni-kolodvor/autobusna-stanica-porec" class="text-primary font-bold hover:underline">Autobusnu stanicu Poreč</a>, te pročitajte naš <a href="/gradovi/porec" class="text-primary font-bold hover:underline">vodič kroz grad Poreč</a>.</p>`,
    faqs: [
      {
        question: 'Koji broj nazvati za hitnu pomoć u Poreču?',
        answer: 'Za hitne slučajeve nazovite 194 ili europski hitni broj 112.'
      },
      {
        question: 'Gdje se nalazi Hitna služba u Poreču?',
        answer: 'Nalazi se u ulici Dr. Mauro Gioseffi 2, u kompleksu Doma zdravlja Poreč.'
      }
    ]
  },

  // 22. Ljekarna Nin (Ljekarna Kremić) & Hitna Nin
  'ljekarna-nin-ljekarna-kremic': {
    targetKeywords: [
      'ljekarna nin',
      'ljekarna kremić nin',
      'ljekarna nin radno vrijeme',
      'pharmacy nin',
      'dežurna ljekarna nin'
    ],
    seoTitle: 'Ljekarna Nin (Ljekarna Kremić) — Radno Vrijeme i Adresa | CroatiaBest',
    seoDescription: 'Ljekarna Nin (Ljekarna Kremić) — radno vrijeme, ljetna opskrba lijekovima, adresa u povijesnom Ninu, savjeti magistra za kupače Kraljičine plaže i Zatona.',
    h1Title: 'Ljekarna Nin (Ljekarna Kremić — Kraljevski grad Nin)',
    seoKeywords: [
      'ljekarna nin',
      'ljekarna kremić nin',
      'ljekarna nin radno vrijeme',
      'pharmacy nin croatia'
    ],
    enrichedDescription: `<p><strong>Ljekarna Nin (Ljekarna Kremić)</strong> centralna je ljekarna u kraljevskom gradu Ninu, smještena nedaleko povijesnog otočića i poznatih ninskih pješčanih laguna (Kraljičina plaža i Ždrijac).</p>
<p>Ljekarna nudi lijekove, dječju kozmetiku, zaštitu od sunca i ljekovite pripravke. Za hitne slučajeve u mjestu djeluje <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-nin" class="text-primary font-bold hover:underline">Hitna medicinska služba Nin</a>.</p>
<p>Na susjednom poluotoku na usluzi je i <a href="/objekt/ljekarna/ljekarna-privlaka" class="text-primary font-bold hover:underline">Ljekarna Privlaka</a>, a za polaske autobusa provjerite <a href="/objekt/autobusni-kolodvor/autobusni-kolodvor-vir" class="text-primary font-bold hover:underline">Autobusni kolodvor Vir</a>. Saznajte sve o baštini u našem <a href="/gradovi/nin" class="text-primary font-bold hover:underline">vodiču kroz grad Nin</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Ljekarna Kremić u Ninu?',
        answer: 'Nalazi se u Ninu, u neposrednoj blizini centra mjesta i trgovačkih sadržaja s osiguranim parkingom.'
      },
      {
        question: 'Koja je najbliža dežurna ljekarna 0-24 u blizini Nina?',
        answer: 'Dežurna ljekarna 0-24 sata nalazi se u Zadru (Ljekarna Centar na Narodnom trgu ili kod Opće bolnice Zadar), udaljena cca 15 km.'
      }
    ]
  },

  // 23. Hitna medicinska služba Nin
  'hitna-medicinska-sluzba-nin': {
    targetKeywords: [
      'hitna medicinska služba nin',
      'hitna pomoć nin',
      'dom zdravlja nin',
      'hitna nin telefon',
      'emergency nin'
    ],
    seoTitle: 'Hitna Medicinska Služba Nin (Hitna Pomoć 0-24) | CroatiaBest',
    seoDescription: 'Hitna medicinska služba Nin — dežurna hitna pomoć 00-24h za područje Nina, Privlake, Vira i Zatona. Adresa, kontakt telefoni 194 i 112 te sanitetske usluge.',
    h1Title: 'Hitna medicinska služba Nin — Ninska rivijera',
    seoKeywords: [
      'hitna medicinska služba nin',
      'hitna pomoć nin',
      'hitna nin telefon 194',
      'emergency nin zadar'
    ],
    enrichedDescription: `<p><strong>Hitna medicinska služba Nin</strong> (Zavod za hitnu medicinu Zadarske županije — Ispostava Nin) pruža hitnu pomoć za grad Nin, općine Privlaka, Vir, Vrsi i turističko naselje Zaton.</p>
<p>Za hitne intervencije nazovite <strong>194</strong> ili <strong>112</strong>. U mjestu za nabavu lijekova radi <a href="/objekt/ljekarna/ljekarna-nin-ljekarna-kremic" class="text-primary font-bold hover:underline">Ljekarna Nin (Ljekarna Kremić)</a>, a u Privlaci <a href="/objekt/ljekarna/ljekarna-privlaka" class="text-primary font-bold hover:underline">Ljekarna Privlaka</a>.</p>
<p>Za autobusne veze pogledajte <a href="/objekt/autobusni-kolodvor/autobusni-kolodvor-vir" class="text-primary font-bold hover:underline">Autobusni kolodvor Vir</a>, a sve znamenitosti pročitajte u <a href="/gradovi/nin" class="text-primary font-bold hover:underline">vodiču kroz grad Nin</a>.</p>`,
    faqs: [
      {
        question: 'Koji broj nazvati za Hitnu pomoć u Ninu?',
        answer: 'Nazovite broj 194 ili jedinstveni hitni broj 112.'
      },
      {
        question: 'Koliko je Opća bolnica Zadar udaljena od Nina?',
        answer: 'Opća bolnica Zadar udaljena je oko 16 km (cca 15-20 minuta vožnje sanitetskim vozilom).'
      }
    ]
  },

  // 24. Ljekarna Tribunj (Farmacia)
  'ljekarna-tribunj-farmacia': {
    targetKeywords: [
      'ljekarna tribunj',
      'ljekarna tribunj farmacia',
      'tribunj ljekarna radno vrijeme',
      'ljekarna vodice tribunj'
    ],
    seoTitle: 'Ljekarna Tribunj (Farmacia) — Radno Vrijeme i Adresa | CroatiaBest',
    seoDescription: 'Ljekarna Tribunj (specijalizirana prodavaonica Farmacia) — radno vrijeme, adresa uz obalu, lijekovi, dermokozmetika i savjetovanje magistara u Tribunju.',
    h1Title: 'Ljekarna Tribunj (Farmacia) — Tribunj & Vodice',
    seoKeywords: [
      'ljekarna tribunj',
      'ljekarna tribunj farmacia',
      'tribunj ljekarna radno vrijeme',
      'farmacia tribunj'
    ],
    enrichedDescription: `<p><strong>Ljekarna Tribunj (Farmacia)</strong> smještena je u slikovitom dalmatinskom mjestu Tribunj, svega 2 km od Vodica, u neposrednoj blizini tribunjske marine i stare otočne jezgre.</p>
<p>Nudi bogat asortiman bezreceptnih lijekova, dermokozmetike, dječjih proizvoda i krema za sunčanje. U slučaju potrebe za hitnom medicinskom intervencijom, odmah je dostupna <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-vodice" class="text-primary font-bold hover:underline">Hitna medicinska služba Vodice</a>.</p>
<p>Istražite i obližnji <a href="/gradovi/vodice" class="text-primary font-bold hover:underline">turistički vodič kroz Vodice i Tribunj</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi ljekarna u Tribunju?',
        answer: 'Nalazi se na pristupačnoj lokaciji uz glavnu obalnu cestu u Tribunju, u blizini marine.'
      },
      {
        question: 'Koja je najbliža dežurna ljekarna vikendom i noću?',
        answer: 'Dežurna ljekarna noću nalazi se u Šibeniku (Gradska ljekarna Šibenik kod Poljane).'
      }
    ]
  },

  // 25. Ljekarna Tučepi
  'ljekarna-tucepi': {
    targetKeywords: [
      'ljekarna tučepi',
      'ljekarna tucepi radno vrijeme',
      'tučepi ljekarna',
      'makarska rivijera ljekarna'
    ],
    seoTitle: 'Ljekarna Tučepi (Makarska Rivijera) — Radno Vrijeme i Info | CroatiaBest',
    seoDescription: 'Ljekarna Tučepi — radno vrijeme, adresa uz Jadransku magistralu i plažu, ponuda lijekova, prve pomoći i savjeti magistara na Makarskoj rivijeri.',
    h1Title: 'Ljekarna Tučepi — Makarska Rivijera',
    seoKeywords: [
      'ljekarna tučepi',
      'ljekarna tucepi radno vrijeme',
      'pharmacy tucepi makarska'
    ],
    enrichedDescription: `<p><strong>Ljekarna Tučepi</strong> opskrbljuje lokalno stanovništvo i posjetitelje jednog od najomiljenijih ljetovališta Makarske rivijere s najduljom šljunčanom plažom podno Biokova.</p>
<p>Pruža širok izbor medicinskih potrepština, krema za sunčanje i lijekova. U hitnim situacijama obratite se centralnom <a href="/objekt/hitna-pomoc/dom-zdravlja-makarska" class="text-primary font-bold hover:underline">Domu zdravlja Makarska i Hitnoj pomoći</a> udaljenom tek 4 km.</p>
<p>Za javnu sigurnost tu je <a href="/objekt/policija/policijska-postaja-makarska" class="text-primary font-bold hover:underline">Policijska postaja Makarska</a>. Više o plažama saznajte u našem <a href="/gradovi/makarska" class="text-primary font-bold hover:underline">vodiču kroz Makarsku rivijeru</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi ljekarna u Tučepima?',
        answer: 'Smještena je u središtu Tučepa, uz glavnu prometnicu nedaleko od plaže i hotelskih kompleksa.'
      },
      {
        question: 'Koja je najbliža noćna dežurna ljekarna za Tučepe?',
        answer: 'Dežurna ljekarna noću nalazi se u Makarskoj (Gradska ljekarna Makarska).'
      }
    ]
  },

  // 26. KBC Split - Križine
  'kbc-split-krizine': {
    targetKeywords: [
      'kbc split križine',
      'hitna pomoć split križine',
      'bolnica križine split',
      'kbc split hitni prijem',
      'hitna split'
    ],
    seoTitle: 'KBC Split - Križine (Hitni Prijem i Bolnica 0-24) | CroatiaBest',
    seoDescription: 'KBC Split - lokalitet Križine (Šoltanska 1). Hitni medicinski prijem 00-24h, interne klinike, ortopedija, dermatologija, telefoni i upute za hitne slučajeve.',
    h1Title: 'KBC Split — Lokalitet Križine (Hitni bolnički prijem 0-24)',
    seoKeywords: [
      'kbc split križine',
      'kbc split krizine',
      'hitna pomoć split križine',
      'bolnica križine split telefon',
      'emergency split kbc'
    ],
    enrichedDescription: `<p><strong>Klinički bolnički centar Split (KBC Split) — lokalitet Križine</strong> na adresi <em>Šoltanska 1</em> jedna je od dvije ključne bolničke lokacije u Splitu, koja osigurava vrhunsku specijalističku i hitnu bolničku skrb 00-24h za područje cijele Dalmacije i otoka.</p>
<p>Na Križinama djeluju Hitni internistički prijem, Klinika za unutarnje bolesti, Klinika za ortopediju i traumatologiju, Klinika za kožne i spolne bolesti, Fizikalna medicina te Odjel za anesteziologiju i intenzivno liječenje.</p>
<p>Ako boravite u Splitu, posjetite popularnu plažu <a href="/objekt/plaza/plaza-obojena" class="text-primary font-bold hover:underline">Plaža Obojena (Kaštelet)</a> podno Marjana, a sve znamenitosti istražite u našem <a href="/gradovi/split" class="text-primary font-bold hover:underline">vodiču kroz grad Split</a>.</p>`,
    faqs: [
      {
        question: 'Koja je razlika između KBC-a Firule i KBC-a Križine u Splitu?',
        answer: 'KBC Split ima dva lokaliteta: Firule (Spinčićeva 1 - kirurgija, pedijatrija, ginekologija) i Križine (Šoltanska 1 - interna medicina, ortopedija, dermatologija). Oba imaju stalno dežurstvo.'
      },
      {
        question: 'Ima li osiguran parking za pacijente u bolnici Križine?',
        answer: 'Da, oko bolničkog kruga na Križinama nalazi se naplatno i javno parkiralište s označenim mjestima za hitne slučajeve i osobe s invaliditetom.'
      }
    ]
  },

  // 27. Klinika za dječje bolesti Zagreb (Klaićeva)
  'klinika-za-djecje-bolesti-zagreb-klaiceva': {
    targetKeywords: [
      'klaićeva bolnica',
      'klinika za dječje bolesti zagreb',
      'hitna dječja klaićeva',
      'klaićeva hitni prijem telefon',
      'djecja bolnica klaiceva'
    ],
    seoTitle: 'Klinika za dječje bolesti Zagreb (Klaićeva) — Hitni Prijem 0-24 | CroatiaBest',
    seoDescription: 'Klinika za dječje bolesti Zagreb (Klaićeva 16). Središnji dežurni hitni dječji prijem 00-24h za pedijatriju, dječju kirurgiju i traumatologiju. Upute i telefon.',
    h1Title: 'Klinika za dječje bolesti Zagreb (Klaićeva — Dječja hitna 0-24)',
    seoKeywords: [
      'klaićeva bolnica',
      'klinika za dječje bolesti zagreb',
      'klaićeva hitna',
      'dječja hitna zagreb 0-24',
      'klaićeva telefon hitni prijem'
    ],
    enrichedDescription: `<p><strong>Klinika za dječje bolesti Zagreb (poznata kao "Klaićeva bolnica")</strong> na adresi <em>Ulica Vjekoslava Klaića 16</em> središnja je i vodeća pedijatrijska bolnička ustanova u Republici Hrvatskoj.</p>
<p>Objedinjuje hitni prijem za dojenčad, djecu i adolescente <strong>00-24 sata svakog dana</strong>. Pruža hitnu pedijatrijsku, dječju kiruršku, ortopedsku i traumatološku skrb. U hitnim situacijama djeca se primaju bez prethodne najave.</p>
<p>Za hitne lijekove u gradu dežura <a href="/objekt/ljekarna/gradska-ljekarna-zagreb" class="text-primary font-bold hover:underline">Gradska ljekarna Zagreb (Dežurna 0-24 Siget / Centar)</a> te <a href="/objekt/ljekarna/gradska-ljekarna-zagreb-maksimirska" class="text-primary font-bold hover:underline">Gradska ljekarna Maksimirska</a>. Sve važne kontakte pronađite u našem <a href="/gradovi/zagreb" class="text-primary font-bold hover:underline">vodiču kroz grad Zagreb</a>.</p>`,
    faqs: [
      {
        question: 'Kada potražiti pomoć na Hitnom prijemu u Klaićevoj?',
        answer: 'Hitni prijem namijenjen je djeci s akutnim po život opasnim stanjima, teškim ozljedama, prijelomima, visokom temperaturom koja ne reagira na terapiju ili teškim gušenjem.'
      },
      {
        question: 'Gdje parkirati kod bolnice u Klaićevoj?',
        answer: 'Dostupan je kratkotrajni iskrcaj ispred hitnog ulaza, a parkiranje je moguće u javnim garažama u blizini (Garaža Tuškanac ili Klaićeva ulična parkirna zona).'
      }
    ]
  },

  // 28. Ljekarna Bale
  'ljekarna-bale': {
    targetKeywords: [
      'ljekarna bale',
      'ljekarna bale istra',
      'bale ljekarna radno vrijeme',
      'pharmacy bale'
    ],
    seoTitle: 'Ljekarna Bale (Istra) — Radno Vrijeme, Adresa i Savjeti | CroatiaBest',
    seoDescription: 'Ljekarna Bale u Istri. Saznajte radno vrijeme, ponudu lijekova, dermokozmetike i medicinskih proizvoda, te raspored dežurstava za područje Bala i Rovinja.',
    h1Title: 'Ljekarna Bale — Istarska županija',
    seoKeywords: [
      'ljekarna bale',
      'ljekarna bale istra',
      'bale ljekarna radno vrijeme',
      'pharmacy bale istria'
    ],
    enrichedDescription: `<p><strong>Ljekarna Bale</strong> nalazi se u čarobnom kamenom gradiću Bale u Istri, smještenom između Rovinja i Vodnjana.</p>
<p>Ljekarna pruža opskrbu lijekovima na recept, preparatima za kućnu ljekarnu, zaštitom od sunca i medicinskim proizvodima za mještane i goste kampova Mon Perin. Za hitnu pomoć obratite se obližnjoj ustanovi <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-rovinj" class="text-primary font-bold hover:underline">Hitna medicinska služba Rovinj</a>.</p>
<p>Na sjeveru posjetite <a href="/objekt/ljekarna/ljekarna-porec-dezurna-gradska" class="text-primary font-bold hover:underline">Gradsku ljekarnu Poreč</a>, a sve o regiji saznajte u <a href="/gradovi/rovinj" class="text-primary font-bold hover:underline">vodiču kroz Rovinj i Bale</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi ljekarna u Balama?',
        answer: 'Ljekarna se nalazi u centru Bala, na pješačkoj udaljenosti od kaštela Soardo-Bembo.'
      },
      {
        question: 'Koja je najbliža dežurna ljekarna noću za stanovnike Bala?',
        answer: 'Najbliža noćna dežurstva osiguravaju Gradska ljekarna u Rovinju ili Ljekarna Centar u Puli (0-24).'
      }
    ]
  },

  // 29. Ljekarna Seget Donji (Kaštel Farm)
  'ljekarna-seget-donji-ljekarna-kastel-farm': {
    targetKeywords: [
      'ljekarna seget donji',
      'ljekarna kaštel farm seget',
      'ljekarna trogir seget',
      'ljekarna seget donji radno vrijeme'
    ],
    seoTitle: 'Ljekarna Seget Donji (Kaštel Farm) — Trogir & Seget | CroatiaBest',
    seoDescription: 'Ljekarna Seget Donji (Ljekarna Kaštel Farm) pokraj Trogira. Radno vrijeme, adresa uz magistralu, ponuda lijekova, dječje hrane i medicinskih pomagala.',
    h1Title: 'Ljekarna Seget Donji (Ljekarna Kaštel Farm — Trogir)',
    seoKeywords: [
      'ljekarna seget donji',
      'ljekarna kastel farm seget donji',
      'ljekarna seget radno vrijeme',
      'pharmacy seget donji trogir'
    ],
    enrichedDescription: `<p><strong>Ljekarna Seget Donji (Kaštel Farm)</strong> nalazi se na izvrsnoj prometnoj lokaciji u Segetu Donjem, u neposrednoj blizini UNESCO-vog grada Trogira i velikih hotelsko-turističkih naselja (hotel Medena, Seget Vranjica).</p>
<p>Ljekarna nudi bogat izbor lijekova, ortopedskih pomagala i kozmetike. U Trogiru su vam na raspolaganju i <a href="/objekt/policija/policijska-postaja-trogir-lucka-kapetanija" class="text-primary font-bold hover:underline">Policijska postaja Trogir - Lučka kapetanija</a> te predivan <a href="/objekt/vidikovac/vidikovac-na-brdu-sv-ivan-trogir" class="text-primary font-bold hover:underline">Vidikovac na brdu sv. Ivan Trogir</a>.</p>
<p>Kompletan povijesni pregled pogledajte u našem <a href="/gradovi/trogir" class="text-primary font-bold hover:underline">vodiču kroz grad Trogir</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se točno nalazi ljekarna u Segetu Donjem?',
        answer: 'Ljekarna se nalazi uz glavnu cestu u Segetu Donjem, nekoliko minuta vožnje od starog mosta u Trogiru.'
      },
      {
        question: 'Mogu li turisti podići recepte u Ljekarni Seget Donji?',
        answer: 'Da, uz važeće recepte i europsku zdravstvenu iskaznicu magistri izdaju redovnu i hitnu terapiju.'
      }
    ]
  },

  // 30. Ljekarna Privlaka
  'ljekarna-privlaka': {
    targetKeywords: [
      'ljekarna privlaka',
      'privlaka ljekarna radno vrijeme',
      'ljekarna privlaka zadar',
      'pharmacy privlaka'
    ],
    seoTitle: 'Ljekarna Privlaka (Zadarska Županija) — Radno Vrijeme i Adresa | CroatiaBest',
    seoDescription: 'Ljekarna Privlaka — ljekarničke usluge i opskrba lijekovima u Privlaci kod Zadra i Nina. Radno vrijeme, savjetovanje i ljetni raspored za turiste i mještane.',
    h1Title: 'Ljekarna Privlaka — Zadarska rivijera',
    seoKeywords: [
      'ljekarna privlaka',
      'privlaka ljekarna radno vrijeme',
      'pharmacy privlaka nin'
    ],
    enrichedDescription: `<p><strong>Ljekarna Privlaka</strong> smještena je na poluotoku Privlaka, točno na prometnom pravcu između kraljevskog grada Nina i mosta za otok Vir.</p>
<p>Pruža pouzdanu opskrbu lijekovima, sredstvima protiv alergija, zaštitom od insekata i sunca. U blizini posjetite i <a href="/objekt/ljekarna/ljekarna-nin-ljekarna-kremic" class="text-primary font-bold hover:underline">Ljekarnu Nin (Ljekarna Kremić)</a>, a za hitne slučajeve dežura <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-nin" class="text-primary font-bold hover:underline">Hitna medicinska služba Nin</a>.</p>
<p>Za autobusne polaske informirajte se na <a href="/objekt/autobusni-kolodvor/autobusni-kolodvor-vir" class="text-primary font-bold hover:underline">Autobusnom kolodvoru Vir</a> te pročitajte <a href="/gradovi/nin" class="text-primary font-bold hover:underline">vodič kroz Nin i Privlaku</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi ljekarna u Privlaci?',
        answer: 'Nalazi se uz glavnu prometnicu kroz Privlaku, u blizini pošte i općinskih ureda.'
      },
      {
        question: 'Koja je najbliža dežurna ljekarna vikendom?',
        answer: 'Za noćna dežurstva dostupna je Ljekarna Centar u Zadru (Narodni trg), otvorena 0-24h.'
      }
    ]
  },

  // 31. Ljekarna Vela Luka - Dežurna (Blato)
  'ljekarna-vela-luka-dezurna-blato': {
    targetKeywords: [
      'ljekarna blato korčula',
      'ljekarna vela luka dežurna blato',
      'ljekarna blato radno vrijeme',
      'dežurna ljekarna blato'
    ],
    seoTitle: 'Ljekarna Blato (Vela Luka Dežurstvo) — Otok Korčula | CroatiaBest',
    seoDescription: 'Ljekarna Blato na otoku Korčuli. Radno vrijeme, adresa, dežurstva i opskrba lijekovima za stanovnike i posjetitelje Blata, Prigradice i Vele Luke.',
    h1Title: 'Ljekarna Blato (Vela Luka Dežurna) — Otok Korčula',
    seoKeywords: [
      'ljekarna blato korcula',
      'ljekarna vela luka dežurna blato',
      'dežurna ljekarna blato',
      'pharmacy blato korcula'
    ],
    enrichedDescription: `<p><strong>Ljekarna Blato</strong> u povijesnom otočnom središtu Blato na Korčuli ključna je ljekarna za zapadni dio otoka Korčule, smještena samo nekoliko kilometara od Vele Luke.</p>
<p>Usklađena je s radom lokalnih ambulanti i osigurava redovnu opskrbu lijekovima, pomagalima i dječjom hranom. Za hitne intervencije na raspolaganju je <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka" class="text-primary font-bold hover:underline">Hitna medicinska služba Vela Luka</a> te na drugom kraju otoka <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-korcula" class="text-primary font-bold hover:underline">Hitna medicinska služba Korčula</a>.</p>
<p>Uživajte na kupalištu <a href="/objekt/plaza/plaz-a-vela-lka" class="text-primary font-bold hover:underline">Plaža Vela Luka</a> i pročitajte naš <a href="/otoci/korcula" class="text-primary font-bold hover:underline">vodič kroz otok Korčulu</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi ljekarna u Blatu?',
        answer: 'Ljekarna se nalazi u centru Blata, uz glasoviti drvored lipa Zlinje.'
      },
      {
        question: 'Pokriva li ljekarna u Blatu i potrebe Vele Luke?',
        answer: 'Da, ljekarne u Blatu i Veloj Luci međusobno usklađuju raspored dežurstava za zapadni dio otoka.'
      }
    ]
  },

  // 32. Gradska ljekarna Zagreb - Maksimirska
  'gradska-ljekarna-zagreb-maksimirska': {
    targetKeywords: [
      'gradska ljekarna zagreb maksimirska',
      'ljekarna maksimirska radno vrijeme',
      'gradska ljekarna maksimirska 81',
      'ljekarna kvatric maksimir'
    ],
    seoTitle: 'Gradska Ljekarna Zagreb - Maksimirska — Radno Vrijeme | CroatiaBest',
    seoDescription: 'Gradska ljekarna Zagreb u Maksimirskoj ulici. Radno vrijeme, savjetovanje magistara, izdavanje recepata i ortopedskih pomagala u blizini Kvaternikovog trga.',
    h1Title: 'Gradska ljekarna Zagreb — Poslovnica Maksimirska',
    seoKeywords: [
      'gradska ljekarna zagreb maksimirska',
      'ljekarna maksimirska',
      'gradska ljekarna zagreb',
      'ljekarna kvaternikov trg maksimir'
    ],
    enrichedDescription: `<p><strong>Gradska ljekarna Zagreb — poslovnica Maksimirska</strong> smještena je na jednoj od najprometnijih zagrebačkih avenija, u neposrednoj blizini Kvaternikovog trga i parka Maksimir.</p>
<p>Nudi visoku razinu ljekarničke usluge, pripremu magistralnih pripravaka i stručno savjetovanje o terapiji. Za cjelonoćno dežurstvo pogledajte <a href="/objekt/ljekarna/gradska-ljekarna-zagreb" class="text-primary font-bold hover:underline">Gradska ljekarna Zagreb (Dežurna 0-24 Siget / Centar)</a>.</p>
<p>Za hitnu dječju skrb u gradu obratite se ustanovi <a href="/objekt/hitna-pomoc/klinika-za-djecje-bolesti-zagreb-klaiceva" class="text-primary font-bold hover:underline">Klinika za dječje bolesti Klaićeva</a>. Istražite sve pogodnosti metropole u našem <a href="/gradovi/zagreb" class="text-primary font-bold hover:underline">vodiču kroz grad Zagreb</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Gradska ljekarna u Maksimirskoj ulici?',
        answer: 'Nalazi se u Maksimirskoj ulici u Zagrebu, u tramvajskoj zoni svega nekoliko koraka od tramvajske stanice.'
      },
      {
        question: 'Koja je najbliža stalno otvorena dežurna ljekarna 0-24 u istočnom dijelu Zagreba?',
        answer: 'Najbliža dežurna ljekarna 00-24h je Gradska ljekarna Grižanska 4 u Dubravi ili Trg bana Jelačića 3 u centru.'
      }
    ]
  },

  // 33. Ljekarna Vrsar
  'ljekarna-vrsar': {
    targetKeywords: [
      'ljekarna vrsar',
      'vrsar ljekarna radno vrijeme',
      'pharmacy vrsar istria',
      'dežurna ljekarna vrsar'
    ],
    seoTitle: 'Ljekarna Vrsar (Istra) — Radno Vrijeme, Dežurstvo i Adresa | CroatiaBest',
    seoDescription: 'Ljekarna Vrsar — opskrba lijekovima, ljetni raspored, radno vrijeme, savjetovanje magistara i dežurstva u Vrsaru pokraj Poreča i Limskog kanala.',
    h1Title: 'Ljekarna Vrsar — Zapadna obala Istre',
    seoKeywords: [
      'ljekarna vrsar',
      'vrsar ljekarna radno vrijeme',
      'pharmacy vrsar',
      'ljekarne vrsar istra'
    ],
    enrichedDescription: `<p><strong>Ljekarna Vrsar</strong> pruža potpunu farmaceutsku skrb za stanovnike ribarskog i turističkog Vrsara te goste obližnjih kampova (Koversada, Porto Sole, Valkanela) i marine Vrsar.</p>
<p>Nudi bogat izbor dermokozmetike, bezreceptnih lijekova i krema za sunčanje. U blizini posjetite i <a href="/objekt/ljekarna/ljekarna-porec-dezurna-gradska" class="text-primary font-bold hover:underline">Gradsku ljekarnu Poreč</a> te <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec" class="text-primary font-bold hover:underline">Hitnu medicinsku službu Poreč</a>.</p>
<p>Južnije možete posjetiti <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-rovinj" class="text-primary font-bold hover:underline">Hitnu medicinsku službu Rovinj</a>. Više o znamenitostima saznajte u našem <a href="/gradovi/porec" class="text-primary font-bold hover:underline">vodiču kroz Poreč i Vrsar</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi ljekarna u Vrsaru?',
        answer: 'Ljekarna se nalazi u Vrsaru na pristupačnoj lokaciji u blizini marine i turističkog središta.'
      },
      {
        question: 'Koja je dežurna ljekarna noću za Vrsar?',
        answer: 'Za noćna dežurstva nadležna je Gradska ljekarna Poreč (Trg slobode) ili Dom zdravlja Poreč.'
      }
    ]
  },

  // 34. Autobusna stanica Poreč
  'autobusna-stanica-porec': {
    targetKeywords: [
      'autobusna stanica poreč',
      'autobusni kolodvor poreč',
      'vozni red poreč',
      'bus station porec',
      'poreč autobusni kolodvor peroni'
    ],
    seoTitle: 'Autobusna Stanica Poreč (Vozni Red, Peroni i Polasci) | CroatiaBest',
    seoDescription: 'Autobusna stanica Poreč — informacije o polascima i dolascima autobusa, vozni red, peroni, radno vrijeme garderobe i linije za Zagreb, Pulu, Trst i Rijeku.',
    h1Title: 'Autobusna stanica Poreč (Vozni red & Polasci)',
    seoKeywords: [
      'autobusna stanica poreč',
      'autobusni kolodvor poreč',
      'vozni red poreč',
      'bus station porec timetables'
    ],
    enrichedDescription: `<p><strong>Autobusna stanica Poreč (Autobusni kolodvor Poreč)</strong> nalazi se na adresi <em>Ulica Karla Huguesa 2</em>, u neposrednoj blizini centra grada i gradske marine.</p>
<p>Povezuje Poreč s vodećim destinacijama u Hrvatskoj (Zagreb, Rijeka, Pula, Rovinj) te međunarodnim linijama prema Trstu, Veneciji i Ljubljani. U blizini su vam na usluzi <a href="/objekt/ljekarna/ljekarna-porec-dezurna-gradska" class="text-primary font-bold hover:underline">Gradska ljekarna Poreč</a> i <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec" class="text-primary font-bold hover:underline">Hitna medicinska služba Poreč</a>.</p>
<p>Otkrijte sve o atrakcijama u našem <a href="/gradovi/porec" class="text-primary font-bold hover:underline">vodiču kroz grad Poreč</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Autobusni kolodvor u Poreču?',
        answer: 'Nalazi se na adresi Ulica Karla Huguesa 2, na oko 500 metara od porečke rive i stare gradske jezgre.'
      },
      {
        question: 'Ima li autobusni kolodvor u Poreču garderobu za prtljagu?',
        answer: 'Da, unutar kolodvorske zgrade dostupna je usluga čuvanja prtljage i blagajne za prodaju karata.'
      }
    ]
  },

  // 35. Autobusni kolodvor Vir
  'autobusni-kolodvor-vir': {
    targetKeywords: [
      'autobusni kolodvor vir',
      'autobusna stanica vir',
      'vozni red vir zadar',
      'bus station vir',
      'vir zadar autobus'
    ],
    seoTitle: 'Autobusni Kolodvor Vir (Vozni Red Vir - Zadar i Linije) | CroatiaBest',
    seoDescription: 'Autobusni kolodvor Vir — polasci i dolasci autobusa za Zadar i Zagreb. Radno vrijeme blagajne, peroni, vozni red Vir-Zadar i kontakt informacije na otoku Viru.',
    h1Title: 'Autobusni kolodvor Vir (Otok Vir — Polasci za Zadar)',
    seoKeywords: [
      'autobusni kolodvor vir',
      'autobusna stanica vir',
      'vozni red vir zadar',
      'vir zadar bus'
    ],
    enrichedDescription: `<p><strong>Autobusni kolodvor Vir</strong> glavno je prometno čvorište javnog prijevoza na otoku Viru, smješteno u samom centru otoka.</p>
<p>Svakodnevne redovite linije povezuju Vir s gradom Zadrom (prijevoznik Liburnija Zadar) te sezonskim međužupanijskim linijama s Zagrebom i Slavonijom. U blizini posjetite <a href="/objekt/ljekarna/ljekarna-privlaka" class="text-primary font-bold hover:underline">Ljekarnu Privlaka</a> te <a href="/objekt/ljekarna/ljekarna-nin-ljekarna-kremic" class="text-primary font-bold hover:underline">Ljekarnu Nin</a>.</p>
<p>Za hitne slučajeve dežura <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-nin" class="text-primary font-bold hover:underline">Hitna medicinska služba Nin</a>. Istražite otok u našem <a href="/otoci/vir" class="text-primary font-bold hover:underline">vodiču kroz otok Vir</a>.</p>`,
    faqs: [
      {
        question: 'Koliko često voze autobusi s Vira za Zadar?',
        answer: 'Tijekom radnog tjedna i sezone autobusi prometuju više puta dnevno s vožnjom koja traje oko 45 minuta do Zadra.'
      },
      {
        question: 'Mogu li se karte kupiti u autobusu na Viru?',
        answer: 'Da, karte se mogu kupiti na kolodvorskoj blagajni ili izravno kod vozača autobusa prije polaska.'
      }
    ]
  },

  // 36. Željeznički kolodvor Osijek
  'zeljeznicki-kolodvor-osijek': {
    targetKeywords: [
      'željeznički kolodvor osijek',
      'kolodvor osijek vlakovi',
      'vozni red vlakova osijek zagreb',
      'osijek train station'
    ],
    seoTitle: 'Željeznički Kolodvor Osijek (Vozni Red, Peroni i Polasci) | CroatiaBest',
    seoDescription: 'Željeznički kolodvor Osijek — novouređeni povijesni kolodvor na Trgu Lavoslava Ružičke. Informacije o polascima HŽ vlakova za Zagreb, Rijeku i Vinkovce.',
    h1Title: 'Željeznički kolodvor Osijek — Glavni željeznički kolodvor Slavonije',
    seoKeywords: [
      'željeznički kolodvor osijek',
      'osijek zeljeznicki kolodvor',
      'vlak osijek zagreb vozni red',
      'osijek train station croatia'
    ],
    enrichedDescription: `<p><strong>Željeznički kolodvor Osijek</strong> na <em>Trgu Lavoslava Ružičke 2</em> reprezentativna je i temeljito obnovljena zgrada koja predstavlja glavno željezničko čvorište istočne Hrvatske.</p>
<p>Povezuje Osijek sa Zagrebom (brzi i nagibni vlakovi Podravka i Slavonija), Koprivnicom, Rijekom, Vinkovcima i Belim Manastirom. Kolodvor je opremljen suvremenim peronima, dizalima, blagajnama i čekaonicom.</p>
<p>Ispred kolodvora nalazi se tramvajska i autobusna stanica GPP-a Osijek. Sve o slavonskoj metropoli otkrijte u našem <a href="/gradovi/osijek" class="text-primary font-bold hover:underline">vodiču kroz grad Osijek</a>.</p>`,
    faqs: [
      {
        question: 'Gdje se nalazi Željeznički kolodvor u Osijeku?',
        answer: 'Nalazi se na Trgu Lavoslava Ružičke 2, u neposrednoj blizini Autobusnog kolodvora Osijek.'
      },
      {
        question: 'Koliko traje vožnja brzim vlakom od Osijeka do Zagreba?',
        answer: 'Vožnja brzim vlakovima traje između 4 i 5 sati, ovisno o željezničkom pravcu (preko Koprivnice ili Vinkovaca).'
      }
    ]
  },

  // 37. Policijska postaja Makarska
  'policijska-postaja-makarska': {
    targetKeywords: [
      'policijska postaja makarska',
      'policija makarska',
      'policijska uprava makarska',
      'police makarska'
    ],
    seoTitle: 'Policijska Postaja Makarska — Kontakt, Radno Vrijeme i Adresa | CroatiaBest',
    seoDescription: 'Policijska postaja Makarska — radno vrijeme upravnih poslova (osobne, putovnice, prometne), dežurstvo 0-24, adresa i hitni telefonski brojevi 192.',
    h1Title: 'Policijska postaja Makarska (PP Makarska — 0-24)',
    seoKeywords: [
      'policijska postaja makarska',
      'policija makarska telefon',
      'pp makarska',
      'police station makarska'
    ],
    enrichedDescription: `<p><strong>Policijska postaja Makarska</strong> (Policijska uprava splitsko-dalmatinska) osigurava javni red i mir, sigurnost u cestovnom i pomorskom prometu te rješava upravne poslove građana na adresi <em>Ulica kralja Zvonimira 3</em>.</p>
<p>Dežurna služba radi neprekidno <strong>0-24h</strong> (hitni pozivi na broj <strong>192</strong>). U blizini se nalaze <a href="/objekt/hitna-pomoc/dom-zdravlja-makarska" class="text-primary font-bold hover:underline">Dom zdravlja Makarska i Hitna pomoć</a> te <a href="/objekt/ljekarna/ljekarna-tucepi" class="text-primary font-bold hover:underline">Ljekarna Tučepi</a>.</p>
<p>Sve detalje o Makarskoj pogledajte u našem <a href="/gradovi/makarska" class="text-primary font-bold hover:underline">vodiču kroz Makarsku</a>.</p>`,
    faqs: [
      {
        question: 'Koji je hitni broj policije u Makarskoj?',
        answer: 'Za hitne slučajeve i prijave nazovite besplatni policijski broj 192 ili centar 112.'
      },
      {
        question: 'Gdje se nalazi Policijska postaja u Makarskoj?',
        answer: 'Nalazi se na adresi Ulica kralja Zvonimira 3 u Makarskoj.'
      }
    ]
  },

  // 38. Policijska postaja Vela Luka
  'policijska-postaja-vela-luka': {
    targetKeywords: [
      'policijska postaja vela luka',
      'policija vela luka',
      'policija korčula vela luka',
      'police vela luka'
    ],
    seoTitle: 'Policijska Postaja Vela Luka (Otok Korčula) | CroatiaBest',
    seoDescription: 'Policijska postaja Vela Luka — javni red, granični i pomorski poslovi na zapadnom dijelu otoka Korčule. Radno vrijeme, hitni broj 192 i kontakt podaci.',
    h1Title: 'Policijska postaja Vela Luka — Otok Korčula',
    seoKeywords: [
      'policijska postaja vela luka',
      'policija vela luka korcula',
      'police station vela luka'
    ],
    enrichedDescription: `<p><strong>Policijska postaja Vela Luka</strong> (Policijska uprava dubrovačko-neretvanska) brine o sigurnosti zapadnog dijela otoka Korčule, uključujući lučko područje i trajektni terminal.</p>
<p>U slučaju hitnosti nazovite <strong>192</strong>. U mjestu su vam nadohvat ruke i <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-vela-luka" class="text-primary font-bold hover:underline">Hitna medicinska služba Vela Luka</a>, dežurna <a href="/objekt/ljekarna/ljekarna-vela-luka-dezurna-blato" class="text-primary font-bold hover:underline">Ljekarna Blato / Vela Luka</a> te kupalište <a href="/objekt/plaza/plaz-a-vela-lka" class="text-primary font-bold hover:underline">Plaža Vela Luka</a>.</p>
<p>Detalje o otoku pronađite u našem <a href="/otoci/korcula" class="text-primary font-bold hover:underline">vodiču kroz otok Korčulu</a>.</p>`,
    faqs: [
      {
        question: 'Koji broj nazvati za policiju u Veloj Luci?',
        answer: 'Nazovite 192 za policijske intervencije ili 112.'
      },
      {
        question: 'Gdje se nalazi policijska postaja u Veloj Luci?',
        answer: 'Nalazi se u Veloj Luci, u blizini trajektnog pristaništa i općinskih ureda.'
      }
    ]
  },

  // 39. Policijski ured Novigrad
  'policijski-ured-novigrad': {
    targetKeywords: [
      'policijski ured novigrad',
      'policija novigrad istra',
      'police novigrad istria'
    ],
    seoTitle: 'Policijski Ured Novigrad (Istra) — Kontakt i Radno Vrijeme | CroatiaBest',
    seoDescription: 'Policijski ured Novigrad (Istarska županija) — kontakt informacije, adresa, radno vrijeme i nadležnost za područje Novigrada i sjeverozapadne Istre.',
    h1Title: 'Policijski ured Novigrad — Istarska županija',
    seoKeywords: [
      'policijski ured novigrad',
      'policija novigrad',
      'police station novigrad istria'
    ],
    enrichedDescription: `<p><strong>Policijski ured Novigrad</strong> (u sastavu Policijske uprave istarske — PP Umag) pruža podršku građanima i turistima na području grada Novigrada.</p>
<p>Za hitne slučajeve nazovite <strong>192</strong>. U blizini su vam na raspolaganju <a href="/objekt/hitna-pomoc/dom-zdravlja-umag" class="text-primary font-bold hover:underline">Dom zdravlja i Hitna pomoć Umag</a>, <a href="/objekt/ljekarna/ljekarna-vrsar" class="text-primary font-bold hover:underline">Ljekarna Vrsar</a> te <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-porec" class="text-primary font-bold hover:underline">Hitna Poreč</a>.</p>
<p>Saznajte više u našem <a href="/gradovi/umag" class="text-primary font-bold hover:underline">vodiču kroz sjeverozapadnu Istru</a>.</p>`,
    faqs: [
      {
        question: 'Koji je hitni kontakt policije u Novigradu?',
        answer: 'Za hitne intervencije nazovite 192 ili 112.'
      }
    ]
  },

  // 40. Vidikovac Veprinac
  'vidikovac-veprinac': {
    targetKeywords: ['vidikovac veprinac', 'veprinac opatija vidikovac', 'veprinac pogled kvarner'],
    seoTitle: 'Vidikovac Veprinac (Opatija) — Panoramski Pogled na Kvarner | CroatiaBest',
    seoDescription: 'Vidikovac Veprinac ponad Opatije — čaroban vidikovac sa starog grada Veprinca s pogledom na Rijeku, Krk, Cres i cijeli Kvarnerski zaljev. Vodič i pristup.',
    h1Title: 'Vidikovac Veprinac (Panoramski vidikovac iznad Opatije)',
    seoKeywords: ['vidikovac veprinac', 'veprinac vidikovac', 'veprinac opatija', 'pogled kvarner veprinac'],
    enrichedDescription: `<p><strong>Vidikovac Veprinac</strong> smješten je u srednjovjekovnom gradiću Veprincu na padinama Učke, visoko iznad Opatije. S platoa ispred župne crkve sv. Marka pruža se jedan od najspektakularnijih pogleda na cijeli Kvarnerski zaljev, Rijeku, otoke Krk i Cres te Opatijsku rivijeru.</p>
<p>U podnožju planine posjetite <a href="/objekt/hitna-pomoc/hitna-medicinska-sluzba-opatija" class="text-primary font-bold hover:underline">Hitnu medicinsku službu Opatija</a> ili susjedni <a href="/objekt/vidikovac/vidikovac-kastav-crekvina" class="text-primary font-bold hover:underline">Vidikovac Kastav (Crekvina)</a>. Otkrijte sve u našem <a href="/gradovi/opatija" class="text-primary font-bold hover:underline">vodiču kroz Opatiju</a>.</p>`,
    faqs: [
      {
        question: 'Kako doći do vidikovca u Veprincu?',
        answer: 'Automobilom se stiže zavojitom cestom iz Opatije za cca 15 minuta ili planinarskom povijesnom stazom iz Opatije.'
      }
    ]
  }
};

/**
 * Helper to find matching SEO override by slug or ID
 */
export function getSeoOverride(slugOrId: string): ListingSeoOverride | null {
  if (!slugOrId) return null;
  const s = slugOrId.toLowerCase().trim();

  // 1. Direct exact key match
  if (LISTING_SEO_OVERRIDES[s]) {
    return LISTING_SEO_OVERRIDES[s];
  }

  // 2. Exact match against known PocketBase Record IDs or Legacy Corrupted Slugs
  // Ljekarna Korčula Gradska
  if (s === 'qhds0s1ek277n1c' || s === 'xps03f3n42gv62l' || s.includes('ljekarna-korc-la') || s.includes('ljekarna-korcula-dezurna-gradska')) {
    return LISTING_SEO_OVERRIDES['ljekarna-korcula-dezurna-gradska'];
  }

  // Hitna Vela Luka
  if (s === '264bjcc018uhv5v' || s === '7o4n7ql6cjh443c' || s.includes('slz-ba-vela-lka') || s.includes('sluzba-vela-luka')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-vela-luka'];
  }

  // Ljekarna Lumbarda
  if (s === 'brak59z1k7fwnt4' || s.includes('lumbarda')) {
    return LISTING_SEO_OVERRIDES['ljekarna-korcula-dezurna-lumbarda'];
  }

  // Hitna Korčula
  if (s === '9uu21k15piy8rit' || s === '96p9x92r8dr3sij' || s.includes('slz-ba-korc-la') || s.includes('sluzba-korcula')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-korcula'];
  }

  // Hitna Vodice
  if (s === 'wa2vvn3x8xv453t' || s.includes('sluzba-vodice')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-vodice'];
  }

  // Hitna Rovinj
  if (s === '8pem0g47en96f8z' || s.includes('slz-ba-rovinj') || s.includes('sluzba-rovinj')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-rovinj'];
  }

  // Dom zdravlja Makarska
  if (s === 'la0odw334edr4yr' || s.includes('makarska') && (s.includes('zdravlja') || s.includes('hitn'))) {
    return LISTING_SEO_OVERRIDES['dom-zdravlja-makarska'];
  }

  // Hitna Crikvenica
  if (s === 'u8a6egc501z03cs' || s.includes('sluzba-crikvenica')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-crikvenica'];
  }

  // Ljekarna Selce
  if (s === 'm7o3xx7qj86p253' || s.includes('ljekarna-selce')) {
    return LISTING_SEO_OVERRIDES['ljekarna-selce'];
  }

  // Hitna / Dom zdravlja Umag
  if (s === '300ye3sj9xwuf8x' || s === 'pr8x66fn069idh6' || s.includes('dom-zdravlja-mag') || s.includes('umag') && (s.includes('hitn') || s.includes('zdravlja'))) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-umag'];
  }

  // Plaža Cavtat
  if (s === 'hbi4496o2k4530k' || s.includes('plaza-cavtat')) {
    return LISTING_SEO_OVERRIDES['plaza-cavtat-gradska-plaza'];
  }

  // Hitna Cavtat
  if (s === 'zi3624840utzy62' || s.includes('hitna-medicinska-sluzba-cavtat')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-cavtat'];
  }

  // Ljekarna Cavtat
  if (s === 'djh7f80dhz55bf1' || s.includes('ljekarna-cavtat')) {
    return LISTING_SEO_OVERRIDES['ljekarna-cavtat'];
  }

  // Hitna Opatija
  if (s === '4415949d637638u' || s.includes('sluzba-opatija')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-opatija'];
  }

  // Ljekarna Poreč
  if (s === '7jubq01h86c3x78' || s.includes('ljekarna-porec')) {
    return LISTING_SEO_OVERRIDES['ljekarna-porec-dezurna-gradska'];
  }

  // Hitna Poreč
  if (s === '0cg28g4ca6967a0' || s.includes('slz-ba-porec') || s.includes('sluzba-porec')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-porec'];
  }

  // Ljekarna Nin
  if (s === 'w49c05lia1ew6p7' || s.includes('ljekarna-nin')) {
    return LISTING_SEO_OVERRIDES['ljekarna-nin-ljekarna-kremic'];
  }

  // Hitna Nin
  if (s === '2373y35bpb73ztw' || s.includes('sluzba-nin')) {
    return LISTING_SEO_OVERRIDES['hitna-medicinska-sluzba-nin'];
  }

  // Ljekarna Tribunj
  if (s === 'hr3hk5j93b8h3k5' || s.includes('tribunj')) {
    return LISTING_SEO_OVERRIDES['ljekarna-tribunj-farmacia'];
  }

  // Ljekarna Tučepi
  if (s === '3u052595574g158' || s.includes('tucepi')) {
    return LISTING_SEO_OVERRIDES['ljekarna-tucepi'];
  }

  // KBC Split Križine
  if (s === '9sh605qyvpsaamo' || s.includes('kbc-split') || s.includes('kriz-ine') || s.includes('krizine')) {
    return LISTING_SEO_OVERRIDES['kbc-split-krizine'];
  }

  // Klaićeva bolnica Zagreb
  if (s === 'b64b605cd7zpd3g' || s.includes('klaiceva')) {
    return LISTING_SEO_OVERRIDES['klinika-za-djecje-bolesti-zagreb-klaiceva'];
  }

  // Ljekarna Bale
  if (s === 'oxss1q6rlj1e8xv' || s.includes('ljekarna-bale')) {
    return LISTING_SEO_OVERRIDES['ljekarna-bale'];
  }

  // Ljekarna Seget Donji
  if (s === '15hyqpv55s7bcmi' || s.includes('seget')) {
    return LISTING_SEO_OVERRIDES['ljekarna-seget-donji-ljekarna-kastel-farm'];
  }

  // Ljekarna Privlaka
  if (s === '24ydsdcd1ecs171' || s.includes('privlaka')) {
    return LISTING_SEO_OVERRIDES['ljekarna-privlaka'];
  }

  // Ljekarna Vela Luka Blato
  if (s === 'lj8rgp0l75ag27y' || s === 'lks2m6115o38734' || s.includes('blato')) {
    return LISTING_SEO_OVERRIDES['ljekarna-vela-luka-dezurna-blato'];
  }

  // Gradska ljekarna Maksimirska
  if (s === '7j457vp1s53mg17' || s.includes('maksimirska')) {
    return LISTING_SEO_OVERRIDES['gradska-ljekarna-zagreb-maksimirska'];
  }

  // Ljekarna Vrsar
  if (s === '0033546m0vfw79r' || s.includes('vrsar')) {
    return LISTING_SEO_OVERRIDES['ljekarna-vrsar'];
  }

  // Autobusna stanica Poreč
  if (s === 'e10c028462409aa' || (s.includes('stanica-porec') || s.includes('kolodvor-porec'))) {
    return LISTING_SEO_OVERRIDES['autobusna-stanica-porec'];
  }

  // Autobusni kolodvor Vir
  if (s === 'e06723ebe14298a' || s.includes('kolodvor-vir')) {
    return LISTING_SEO_OVERRIDES['autobusni-kolodvor-vir'];
  }

  // Željeznički kolodvor Osijek
  if (s === 'fd209ebad2c9cda' || s.includes('kolodvor-osijek')) {
    return LISTING_SEO_OVERRIDES['zeljeznicki-kolodvor-osijek'];
  }

  // Policija Makarska
  if (s === '30hkd41y6uk8gs0' || s.includes('policijska-postaja-makarska')) {
    return LISTING_SEO_OVERRIDES['policijska-postaja-makarska'];
  }

  // Policija Vela Luka
  if (s === '3f34r4u6l574q57' || s === '89rps6ei33i6b41' || s.includes('policijska-postaja-vela-lka') || s.includes('policijska-postaja-vela-luka')) {
    return LISTING_SEO_OVERRIDES['policijska-postaja-vela-luka'];
  }

  // Policijski ured Novigrad
  if (s === 'g17q5u477ppvfny' || s.includes('policijski-ured-novigrad')) {
    return LISTING_SEO_OVERRIDES['policijski-ured-novigrad'];
  }

  // Vidikovac Veprinac
  if (s === '7koef4el5n380nj' || s.includes('veprinac')) {
    return LISTING_SEO_OVERRIDES['vidikovac-veprinac'];
  }

  // Plaže Jadranovo
  if (s.includes('amkb1u7980e82b2') || s.includes('jadranovo')) {
    return LISTING_SEO_OVERRIDES['plaz-a-jadranovo'];
  }

  // Plaža Vela Luka
  if (s.includes('cif7tslob4694n3') || s.includes('vela-lka') || s.includes('vela-luka')) {
    return LISTING_SEO_OVERRIDES['plaz-a-vela-lka'];
  }

  // Plaža Žal
  if (s.includes('7lf9fzt022dx991') || s.includes('z-al') || s.includes('beach-zal') || s.includes('plaza-zal')) {
    return LISTING_SEO_OVERRIDES['plaz-a-z-al'];
  }

  // Plaža Obojena
  if (s.includes('obojena')) {
    return LISTING_SEO_OVERRIDES['plaza-obojena'];
  }

  // Gradska ljekarna Zagreb Siget 0-24
  if (s.includes('ozaljska') || s.includes('siget') || s.includes('holjevc') || s.includes('ljekarna-zagreb')) {
    return LISTING_SEO_OVERRIDES['gradska-ljekarna-zagreb'];
  }

  return null;
}
