import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const islandsData = [
  {
    name: "Hvar",
    lat: 43.1610,
    lng: 16.4527,
    image: "https://images.unsplash.com/photo-1600573673752-16e7890cc328?q=80&w=1600&auto=format&fit=crop",
    descHR: "Hvar je najsunčaniji hrvatski otok i jedna od najpopularnijih turističkih destinacija na Mediteranu. Poznat je po bogatoj povijesti, poljima lavande i kristalno čistom moru koje privlači posjetitelje iz cijelog svijeta. Grad Hvar nudi nevjerojatan spoj povijesne arhitekture, poput Španjole koja bdije nad gradom, i modernog, luksuznog noćnog života. Osim glavnog grada, otok skriva brojne uvale i slikovita mjesta poput Starog Grada i Jelse. Ovdje možete uživati u vrhunskoj gastronomiji, lokalnim vinima i istraživati Paklene otoke koji se nalaze tik ispred Hvara. Ovaj otok pruža savršenu ravnotežu između glamura, netaknute prirode i autentičnog dalmatinskog šarma.",
    descEN: "Hvar is the sunniest Croatian island and one of the most popular tourist destinations in the Mediterranean. It is famous for its rich history, lavender fields, and crystal-clear sea that attracts visitors from all over the world. The town of Hvar offers an incredible blend of historical architecture, such as the Fortica fortress watching over the town, and a modern, luxurious nightlife. Beyond the main town, the island hides numerous coves and picturesque spots like Stari Grad and Jelsa. Here, you can enjoy top-tier gastronomy, local wines, and explore the Pakleni Islands located just off the coast. This island provides a perfect balance of glamour, untouched nature, and authentic Dalmatian charm."
  },
  {
    name: "Brač",
    lat: 43.3082,
    lng: 16.6341,
    image: "https://images.unsplash.com/photo-1629806446736-2182046bcbe4?q=80&w=1600&auto=format&fit=crop",
    descHR: "Brač je treći po veličini otok na Jadranu, globalno prepoznatljiv po svojoj spektakularnoj plaži Zlatni rat u Bolu. Ova plaža redovito se svrstava među najljepše na svijetu zahvaljujući svom neobičnom obliku koji se mijenja pod utjecajem vjetra i morskih struja. Brač je također poznat po svom bijelom kamenu od kojeg su izgrađena brojna znamenita zdanja diljem svijeta, uključujući Dioklecijanovu palaču u Splitu. Za ljubitelje aktivnog odmora, Vidova gora nudi najviši vrh među jadranskim otocima s nezaboravnim pogledom na okolicu. Tradicionalna otočna sela, vrhunsko maslinovo ulje i autentična janjetina čine Brač pravim rajem za gurmane. Otok odiše mirom, ali nudi i brojne mogućnosti za vodene sportove i istraživanje prirode.",
    descEN: "Brač is the third largest island in the Adriatic, globally recognized for its spectacular Zlatni Rat (Golden Horn) beach in Bol. This beach is regularly ranked among the most beautiful in the world due to its unusual shape that shifts with the wind and sea currents. Brač is also famous for its white stone, which was used to build numerous iconic structures worldwide, including Diocletian's Palace in Split. For active holiday lovers, Vidova Gora offers the highest peak among the Adriatic islands with an unforgettable view of the surroundings. Traditional island villages, premium olive oil, and authentic lamb dishes make Brač a true paradise for gourmets. The island exudes peace but also offers numerous opportunities for water sports and nature exploration."
  },
  {
    name: "Korčula",
    lat: 42.9431,
    lng: 16.9015,
    image: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=1600&auto=format&fit=crop",
    descHR: "Korčula je otok bogate tradicije, bujne vegetacije i zadivljujuće srednjovjekovne arhitekture. Često se naziva 'Malim Dubrovnikom' zbog impresivnih gradskih zidina koje okružuju stari grad Korčulu. Prema legendi, ovo je rodno mjesto slavnog istraživača Marka Pola, a njegova obiteljska kuća i dalje je jedna od glavnih turističkih atrakcija. Otok je slavan po svojim autohtonim sortama vina, poput Pošipa i Grka, koje savršeno prate lokalne morske specijalitete. Ljeti posjetitelji mogu uživati u tradicionalnoj viteškoj igri Moreški, koja se izvodi uz autentičnu glazbu i ples. Skrivene uvale, guste borove šume i opuštena atmosfera čine Korčulu idealnom destinacijom za romantičan i ispunjen odmor.",
    descEN: "Korčula is an island of rich tradition, lush vegetation, and stunning medieval architecture. It is often called 'Little Dubrovnik' due to the impressive city walls surrounding the old town of Korčula. According to legend, this is the birthplace of the famous explorer Marco Polo, and his family home remains a major tourist attraction. The island is famous for its indigenous wine varieties, such as Pošip and Grk, which perfectly accompany local seafood specialties. In summer, visitors can enjoy the traditional Moreška sword dance, performed with authentic music and choreography. Hidden coves, dense pine forests, and a relaxed atmosphere make Korčula an ideal destination for a romantic and fulfilling holiday."
  },
  {
    name: "Vis",
    lat: 43.0450,
    lng: 16.1481,
    image: "https://images.unsplash.com/photo-1574880595202-05f3b79ce3eb?q=80&w=1600&auto=format&fit=crop",
    descHR: "Vis je najistureniji naseljeni hrvatski otok, poznat po svojoj netaknutoj prirodi i kristalno čistom moru. Desetljećima je bio izoliran kao vojna baza, što ga je sačuvalo od masovnog turizma i omogućilo mu da zadrži svoj autentični šarm. Otok krije nevjerojatne prirodne fenomene, među kojima su najpoznatiji Modra špilja na obližnjem otočiću Biševu te skrivena uvala Stiniva. Gradovi Vis i Komiža oduševljavaju svojom jednostavnom arhitekturom, uskim kamenim ulicama i bogatom ribarskom tradicijom. Viška pogača i lokalno vino Vugava samo su dio bogate gastronomske ponude ovog kraja. Vis je savršen za nautičare, ronioce i sve one koji traže bijeg od gužve u okrilju čiste prirode.",
    descEN: "Vis is the most remote inhabited Croatian island, known for its pristine nature and crystal-clear sea. For decades, it was isolated as a military base, which protected it from mass tourism and allowed it to retain its authentic charm. The island hides incredible natural phenomena, most notably the Blue Cave on the nearby islet of Biševo and the hidden Stiniva cove. The towns of Vis and Komiža delight visitors with their simple architecture, narrow stone streets, and rich fishing tradition. The traditional 'Viška pogača' pie and local Vugava wine are just part of the area's rich gastronomic offer. Vis is perfect for sailors, divers, and anyone seeking an escape from the crowds in the embrace of pure nature."
  },
  {
    name: "Krk",
    lat: 45.0740,
    lng: 14.5772,
    image: "https://images.unsplash.com/photo-1610486047466-2675da730eb6?q=80&w=1600&auto=format&fit=crop",
    descHR: "Otok Krk, poznat i kao Zlatni otok, jedan je od najvećih i najdostupnijih hrvatskih otoka zahvaljujući mostu koji ga spaja s kopnom. Bogat je povijesnim znamenitostima, od starog grada Krka sa svojim zidinama do Baške, gdje je pronađena slavna Bašćanska ploča. Krk nudi nevjerojatnu raznolikost reljefa, od krševitih predjela do plodnih dolina prepunih maslinika i vinograda. Otok je poznat po vrhunskom vinu Žlahtini, koje se proizvodi u slikovitom mjestu Vrbnik, smještenom na strmoj litici iznad mora. Pješčane i šljunčane plaže, uređene biciklističke staze i brojne manifestacije čine Krk idealnim za obiteljski odmor. Ovaj otok predstavlja savršen spoj bogate kulturne baštine i modernih turističkih sadržaja.",
    descEN: "The island of Krk, also known as the Golden Island, is one of the largest and most accessible Croatian islands thanks to the bridge connecting it to the mainland. It is rich in historical sites, from the walled old town of Krk to Baška, where the famous Baška tablet was discovered. Krk offers an incredible variety of terrain, from rocky landscapes to fertile valleys full of olive groves and vineyards. The island is renowned for its premium Žlahtina wine, produced in the picturesque town of Vrbnik, perched on a steep cliff above the sea. Sandy and pebbly beaches, well-maintained cycling trails, and numerous events make Krk ideal for a family vacation. This island represents a perfect blend of rich cultural heritage and modern tourist amenities."
  },
  {
    name: "Pag",
    lat: 44.4842,
    lng: 14.9754,
    image: "https://images.unsplash.com/photo-1598270505141-8f533a0fc3d7?q=80&w=1600&auto=format&fit=crop",
    descHR: "Pag je otok nevjerojatnog mjesečevog pejzaža koji ostavlja bez daha svakog posjetitelja. Zbog jakih udara bure koja raznosi morsku sol po cijelom otoku, vegetacija je oskudna, no upravo to daje posebnu aromu slavnom Paškom siru. Otok je globalno poznat po svojoj vrhunskoj gastronomiji koja uključuje i tradicionalnu pašku janjetinu. Grad Pag, kojeg je dizajnirao slavni Juraj Dalmatinac, središte je izrade predivne paške čipke koja je pod zaštitom UNESCO-a. S druge strane, plaža Zrće u Novalji pretvorila je otok u jednu od najpoznatijih party destinacija u Europi. Pag nudi zaista jedinstveno iskustvo, balansirajući između stoljetnih tradicija i modernog ljetnog hedonizma.",
    descEN: "Pag is an island with an incredible lunar landscape that leaves every visitor breathless. Due to strong Bura winds that scatter sea salt across the island, vegetation is sparse, but this is exactly what gives the famous Pag cheese its distinctive flavor. The island is globally renowned for its premium gastronomy, which also includes traditional Pag lamb. The town of Pag, designed by the famous architect Juraj Dalmatinac, is the center of exquisite Pag lace making, which is protected by UNESCO. On the other hand, Zrće beach in Novalja has turned the island into one of the most famous party destinations in Europe. Pag offers a truly unique experience, balancing between centuries-old traditions and modern summer hedonism."
  },
  {
    name: "Lošinj",
    lat: 44.5714,
    lng: 14.4172,
    image: "https://images.unsplash.com/photo-1627993077309-8472506e88fb?q=80&w=1600&auto=format&fit=crop",
    descHR: "Lošinj je nadaleko poznat kao otok vitalnosti, oaza zdravlja smještena u sjevernom Jadranu. Njegova blaga klima, aerosoli obogaćeni morskom soli i guste borove šume čine ga savršenom destinacijom za oporavak i relaksaciju. Gradovi Mali i Veli Lošinj oduševljavaju svojim šarenim kućama, luksuznim vilama kapetana i predivnim šetnicama uz sea. Otok je ponosni dom Apoksiomena, antičkog brončanog kipa atleta koji je izvučen iz mora i sada ima svoj spektakularni muzej u Malom Lošinju. Akvatorij oko otoka stanište je dobrih dupina, koje posjetitelji često mogu vidjeti tijekom vožnje brodom. Lošinj je pravi raj za ljubitelje prirode, wellnessa i luksuznog odmora na Mediteranu.",
    descEN: "Lošinj is widely known as the island of vitality, an oasis of health located in the northern Adriatic. Its mild climate, aerosols enriched with sea salt, and dense pine forests make it a perfect destination for recovery and relaxation. The towns of Mali and Veli Lošinj delight with their colorful houses, luxurious captain's villas, and beautiful seaside promenades. The island is the proud home of the Apoxyomenos, an ancient bronze statue of an athlete rescued from the sea, which now has its own spectacular museum in Mali Lošinj. The waters around the island are a habitat for bottlenose dolphins, which visitors can often spot during boat rides. Lošinj is a true paradise for lovers of nature, wellness, and luxury Mediterranean holidays."
  },
  {
    name: "Rab",
    lat: 44.7709,
    lng: 14.7570,
    image: "https://images.unsplash.com/photo-1598270505141-8f533a0fc3d7?q=80&w=1600&auto=format&fit=crop",
    descHR: "Rab je otok sunca, pijeska i bogate povijesti, prepoznatljiv po svoja četiri prepoznatljiva zvonika. Grad Rab jedan je od najljepših srednjovjekovnih gradova na obali, opasan drevnim zidinama i ispunjen kamenim uličicama. Otok je jedinstven u Hrvatskoj po svojim brojnim pješčanim plažama, od kojih je najpoznatija Rajska plaža u Loparu. Svake godine otok oživi tijekom Rabske fjere, srednjovjekovnog festivala koji posjetitelje vraća u prošlost uz vitezove, obrtnike i samostreličare. Pored povijesti i plaža, Rab nudi bujnu vegetaciju u parku Komrčar i predivne pješačke staze. Ne zaboravite probati čuvenu Rabsku tortu, tradicionalnu slasticu čiji se recept čuva stoljećima.",
    descEN: "Rab is an island of sun, sand, and rich history, recognizable by its four distinctive bell towers. The town of Rab is one of the most beautiful medieval towns on the coast, surrounded by ancient walls and filled with stone alleys. The island is unique in Croatia for its numerous sandy beaches, the most famous being Paradise Beach in Lopar. Every year, the island comes alive during the Rapska Fjera, a medieval festival that takes visitors back in time with knights, craftsmen, and crossbowmen. Besides history and beaches, Rab offers lush vegetation in Komrčar park and beautiful walking trails. Don't forget to try the famous Rab cake, a traditional dessert whose recipe has been kept secret for centuries."
  },
  {
    name: "Mljet",
    lat: 42.7483,
    lng: 17.5458,
    image: "https://images.unsplash.com/photo-1629806446736-2182046bcbe4?q=80&w=1600&auto=format&fit=crop",
    descHR: "Mljet je najšumovitiji hrvatski otok i prava oaza mira koja pruža utočište u netaknutoj prirodi. Više od trećine otoka proglašeno je Nacionalnim parkom koji skriva dva nevjerojatna slana jezera – Veliko i Malo jezero. U središtu Velikog jezera smjestio se otočić Sveta Marija s predivnim benediktinskim samostanom iz 12. stoljeća. Legenda kaže da je grčki junak Odisej bio zarobljen upravo na Mljetu kod nimfe Kalipso, a Odisejeva špilja danas je popularna atrakcija. Otok nudi beskrajne mogućnosti za vožnju biciklom, kajakom i planinarenje kroz guste borove šume. Mljet je savršen odabir za one koji traže apsolutnu tišinu, mistiku i bijeg od moderne civilizacije.",
    descEN: "Mljet is the most forested Croatian island and a true oasis of peace providing refuge in untouched nature. Over a third of the island is designated as a National Park, hiding two incredible saltwater lakes – the Great and Small Lakes. In the middle of the Great Lake sits the islet of St. Mary with a beautiful 12th-century Benedictine monastery. Legend has it that the Greek hero Odysseus was held captive right here on Mljet by the nymph Calypso, and Odysseus' Cave is a popular attraction today. The island offers endless opportunities for cycling, kayaking, and hiking through dense pine forests. Mljet is the perfect choice for those seeking absolute silence, mystique, and an escape from modern civilization."
  }
];

const fallbackDescHR = "Ovaj prekrasni jadranski otok nudi nevjerojatno iskustvo netaknute prirode i čistog plavog mora. Posjetitelji mogu uživati u skrivenim uvalama, povijesnim znamenitostima i autentičnoj otočnoj atmosferi. Bogata gastronomska ponuda uključuje svježe morske plodove, domaće maslinovo ulje i vrhunska vina. Otok pruža savršen bijeg od svakodnevnog stresa, s brojnim stazama za šetnju i vožnju biciklom. Lokalno stanovništvo poznato je po svom gostoprimstvu i njegovanju dugogodišnjih tradicija. Idealna je destinacija za romantični odmor, obiteljska putovanja ili nautičke avanture.";
const fallbackDescEN = "This beautiful Adriatic island offers an incredible experience of untouched nature and clear blue sea. Visitors can enjoy hidden coves, historical landmarks, and an authentic island atmosphere. The rich gastronomic offer includes fresh seafood, local olive oil, and premium wines. The island provides a perfect escape from everyday stress, with numerous walking and cycling trails. The local population is known for its hospitality and nurturing of long-standing traditions. It is an ideal destination for a romantic getaway, family trips, or sailing adventures.";

const fallbackImage = "https://images.unsplash.com/photo-1549487920-d3dc25586940?q=80&w=1600&auto=format&fit=crop";

async function run() {
  try {
    await pb.admins.authWithPassword('maro.webdeveloper@gmail.com', 'pass123456');
    console.log('Successfully authenticated as admin.');

    const islandsList = await pb.collection('islands').getFullList();
    console.log(`Found ${islandsList.length} islands in the database.`);

    for (const record of islandsList) {
      let data = islandsData.find(d => d.name === record.name);
      
      const coords = {
        "Cres": {lat: 44.8767, lng: 14.3970},
        "Murter": {lat: 43.8052, lng: 15.6022},
        "Dugi otok": {lat: 43.9961, lng: 15.0039},
        "Šolta": {lat: 43.3853, lng: 16.2917},
        "Pašman": {lat: 43.9536, lng: 15.3524},
        "Ugljan": {lat: 44.0833, lng: 15.1667},
        "Lastovo": {lat: 42.7538, lng: 16.8979},
        "Silba": {lat: 44.3814, lng: 14.6983},
        "Olib": {lat: 44.3756, lng: 14.7831},
        "Molat": {lat: 44.2269, lng: 14.8569},
        "Iž": {lat: 44.0322, lng: 15.1106},
        "Prvić": {lat: 43.7303, lng: 15.7958},
        "Zlarin": {lat: 43.6892, lng: 15.8364},
        "Lopud": {lat: 42.6869, lng: 17.9408},
        "Koločep": {lat: 42.6775, lng: 18.0050},
        "Susak": {lat: 44.5100, lng: 14.3050}
      };

      const updatePayload = {
        lat: data ? data.lat : (coords[record.name]?.lat || 44.0),
        lng: data ? data.lng : (coords[record.name]?.lng || 15.0),
        image: data ? data.image : fallbackImage,
        description: data ? data.descHR : fallbackDescHR.replace('Ovaj prekrasni jadranski otok', `${record.name} je prekrasan jadranski otok koji`),
        description_en: data ? data.descEN : fallbackDescEN.replace('This beautiful Adriatic island', `${record.name} is a beautiful Adriatic island that`)
      };

      await pb.collection('islands').update(record.id, updatePayload);
      console.log(`Updated island: ${record.name}`);
    }

    console.log('All islands updated successfully!');
  } catch (error) {
    console.error('Error updating islands:', error);
  }
}

run();
