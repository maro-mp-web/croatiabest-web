import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Generate 20 landmarks per major city
const MONUMENTS = [
  // ZAGREB
  { name: 'Katedrala Uznesenja Blažene Djevice Marije', city: 'Zagreb', lat: 45.8144, lng: 15.9796, description: 'Najveća hrvatska sakralna građevina i jedan od najvrednijih spomenika hrvatske kulturne baštine.' },
  { name: 'Crkva sv. Marka', city: 'Zagreb', lat: 45.8166, lng: 15.9736, description: 'Prepoznatljiva po svom šarenom krovu s grbovima Trojedne kraljevine Hrvatske, Slavonije i Dalmacije te grada Zagreba.' },
  { name: 'Kula Lotrščak', city: 'Zagreb', lat: 45.8146, lng: 15.9733, description: 'Srednjovjekovna kula iz koje svakog dana u podne puca Grički top.' },
  { name: 'Spomenik banu Josipu Jelačiću', city: 'Zagreb', lat: 45.8131, lng: 15.9774, description: 'Brončani kip na glavnom gradskom trgu, djelo austrijskog kipara Antona Dominika Fernkorna.' },
  { name: 'Kamenita vrata', city: 'Zagreb', lat: 45.8163, lng: 15.9743, description: 'Najznačajnije svetište u Zagrebu i jedina sačuvana gradska vrata iz srednjeg vijeka.' },
  { name: 'Umjetnički paviljon', city: 'Zagreb', lat: 45.8066, lng: 15.9784, description: 'Najstariji izložbeni prostor u ovom dijelu Europe, izgrađen u secesijskom stilu.' },
  { name: 'Zgrada Hrvatskog narodnog kazališta', city: 'Zagreb', lat: 45.8094, lng: 15.9698, description: 'Neobarokno remek-djelo otvoreno 1895. godine.' },
  { name: 'Spomenik kralju Tomislavu', city: 'Zagreb', lat: 45.8055, lng: 15.9786, description: 'Impozantan spomenik prvom hrvatskom kralju smješten ispred Glavnog kolodvora.' },
  { name: 'Zdenac života', city: 'Zagreb', lat: 45.8098, lng: 15.9696, description: 'Slavno djelo Ivana Meštrovića smješteno ispred HNK.' },
  { name: 'Crkva sv. Katarine', city: 'Zagreb', lat: 45.8153, lng: 15.9743, description: 'Najljepša barokna crkva u Zagrebu.' },
  { name: 'Spomenik Stjepanu Radiću', city: 'Zagreb', lat: 45.8000, lng: 15.9776, description: 'Spomenik posvećen velikom hrvatskom političaru.' },
  { name: 'Palača Dverce', city: 'Zagreb', lat: 45.8147, lng: 15.9737, description: 'Reprezentativna gradska palača na Gornjem gradu.' },
  { name: 'Crkva sv. Blaža', city: 'Zagreb', lat: 45.8131, lng: 15.9644, description: 'Znamenita crkva po arhitektonskom rješenju s kupolom od armiranog betona.' },
  { name: 'Stari grad Medvedgrad', city: 'Zagreb', lat: 45.8617, lng: 15.9403, description: 'Srednjovjekovni burg na južnim padinama Medvednice, gdje se nalazi i Oltar domovine.' },
  { name: 'Banski dvori', city: 'Zagreb', lat: 45.8163, lng: 15.9731, description: 'Sjedište Vlade Republike Hrvatske.' },
  { name: 'Zgrada Hrvatskog sabora', city: 'Zagreb', lat: 45.8164, lng: 15.9735, description: 'Zgrada u kojoj zasjeda zakonodavno tijelo Hrvatske.' },
  { name: 'Mirogoj', city: 'Zagreb', lat: 45.8351, lng: 15.9845, description: 'Središnje zagrebačko groblje i prekrasan park s arkadama koje je projektirao Herman Bollé.' },
  { name: 'Oktogon', city: 'Zagreb', lat: 45.8123, lng: 15.9754, description: 'Poznati prolaz u središtu grada s prekrasnom staklenom kupolom.' },
  { name: 'Spomenik Nikoli Tesli', city: 'Zagreb', lat: 45.8105, lng: 15.9760, description: 'Spomenik velikom znanstveniku i inovatoru, djelo Ivana Meštrovića.' },
  { name: 'Palača HAZU', city: 'Zagreb', lat: 45.8086, lng: 15.9772, description: 'Sjedište Hrvatske akademije znanosti i umjetnosti.' },

  // SPLIT
  { name: 'Dioklecijanova palača', city: 'Split', lat: 43.5081, lng: 16.4402, description: 'Antička palača rimskog cara Dioklecijana, srce grada Splita i spomenik pod zaštitom UNESCO-a.' },
  { name: 'Katedrala sv. Duje', city: 'Split', lat: 43.5081, lng: 16.4402, description: 'Nekadašnji Dioklecijanov mauzolej, danas najstarija katedrala na svijetu u originalnom zdanju.' },
  { name: 'Peristil', city: 'Split', lat: 43.5082, lng: 16.4399, description: 'Glavni trg Dioklecijanove palače s impresivnom rimskom arhitekturom.' },
  { name: 'Vestibul', city: 'Split', lat: 43.5080, lng: 16.4400, description: 'Nekadašnje predvorje carevih odaja, poznato po nevjerojatnoj akustici.' },
  { name: 'Zlatna vrata', city: 'Split', lat: 43.5089, lng: 16.4397, description: 'Glavni ulaz u Dioklecijanovu palaču sa sjeverne strane.' },
  { name: 'Spomenik Grguru Ninskom', city: 'Split', lat: 43.5090, lng: 16.4398, description: 'Impresivan Meštrovićev spomenik. Smatra se da dodirivanje njegovog palca donosi sreću.' },
  { name: 'Prokurative (Trg Republike)', city: 'Split', lat: 43.5085, lng: 16.4361, description: 'Prekrasan trg u obliku slova U okružen neorenesansnim zgradama.' },
  { name: 'Mletačka kula', city: 'Split', lat: 43.5079, lng: 16.4385, description: 'Jedini preostali dio nekadašnjeg mletačkog kaštela u Splitu.' },
  { name: 'Hram Jupitera (Krstionica sv. Ivana)', city: 'Split', lat: 43.5083, lng: 16.4396, description: 'Nekadašnji rimski hram pretvoren u krstionicu.' },
  { name: 'Palača Papalić', city: 'Split', lat: 43.5082, lng: 16.4407, description: 'Gotičko-renesansna palača u kojoj se nalazi Muzej grada Splita.' },
  { name: 'Crkva sv. Frane', city: 'Split', lat: 43.5076, lng: 16.4367, description: 'Stara crkva na obali s grobnicama znamenitih Splićana.' },
  { name: 'Spomenik Marku Maruliću', city: 'Split', lat: 43.5085, lng: 16.4388, description: 'Spomenik ocu hrvatske književnosti na Voćnom trgu, djelo Ivana Meštrovića.' },
  { name: 'Tvrđava Gripe', city: 'Split', lat: 43.5088, lng: 16.4485, description: 'Mletačka tvrđava iz 17. stoljeća za obranu od Turaka.' },
  { name: 'Crkvica sv. Nikole na Marjanu', city: 'Split', lat: 43.5090, lng: 16.4250, description: 'Stara srednjovjekovna crkvica s prekrasnim pogledom na grad.' },
  { name: 'Palača Cindro', city: 'Split', lat: 43.5082, lng: 16.4390, description: 'Najljepša barokna palača u Splitu.' },
  { name: 'Pjaca (Narodni trg)', city: 'Split', lat: 43.5084, lng: 16.4389, description: 'Središnji gradski trg sa starom Gradskom vijećnicom.' },
  { name: 'Srebrna vrata', city: 'Split', lat: 43.5082, lng: 16.4406, description: 'Istočni ulaz u Dioklecijanovu palaču uz gradsku tržnicu (Pazar).' },
  { name: 'Mjedena vrata', city: 'Split', lat: 43.5076, lng: 16.4398, description: 'Južni ulaz u palaču kroz Podrume koji vodi izravno na Rivu.' },
  { name: 'Podrumi Dioklecijanove palače', city: 'Split', lat: 43.5079, lng: 16.4399, description: 'Jedni od najbolje sačuvanih antičkih kompleksa te vrste na svijetu.' },
  { name: 'Željezna vrata', city: 'Split', lat: 43.5083, lng: 16.4391, description: 'Zapadni ulaz u palaču s kulom na kojoj se nalazi renesansni sat.' }
];

async function run() {
  console.log("Authenticating as admin...");
  await pb.admins.authWithPassword('admin@croatiabest.hr', 'admin123456');

  console.log("Fetching a user for ownerId...");
  const users = await pb.collection('users').getFullList({ requestKey: null, limit: 1 });
  const ownerId = users.length > 0 ? users[0].id : '';

  console.log("Seeding monuments...");
  for (const monument of MONUMENTS) {
    try {
      const data = {
        name: monument.name,
        locationCategoryId: 'landmarks',
        categoryId: 'landmarks', // in case both are used
        city: monument.city,
        latitude: monument.lat,
        longitude: monument.lng,
        description: monument.description,
        status: 'active',
        ownerId: ownerId,
        // placeholder for photo
        photoUrls: ['https://picsum.photos/seed/' + monument.name.replace(/\s+/g, '') + '/800/600'],
      };
      
      await pb.collection('listings').create(data);
      console.log(`Created monument: ${monument.name} in ${monument.city}`);
    } catch (e) {
      console.log(`Error creating monument ${monument.name}:`, e.response?.data || e.message);
    }
  }

  console.log("Done!");
}

run().catch(console.error);
