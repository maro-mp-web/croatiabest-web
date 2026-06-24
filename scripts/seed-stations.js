const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'pb_data', 'data.db');

const stations = [
  {
    name: "Autobusni kolodvor Zagreb",
    category: "bus_stations",
    address: "Avenija Marina Držića 4",
    city: "Zagreb",
    region: "Središnja Hrvatska",
    lat: 45.8038,
    lng: 15.9922,
    description: "Glavni i najveći autobusni kolodvor u Hrvatskoj. Služi kao glavno čvorište za međugradski i međunarodni autobusni prijevoz, povezujući Zagreb s gotovo svim dijelovima Hrvatske i mnogim europskim gradovima. U sklopu kolodvora nalaze se kafići, trgovine i čekaonice.\n\nThe main and largest bus station in Croatia. It serves as the primary hub for intercity and international bus transport, connecting Zagreb with almost all parts of Croatia and many European cities. The station includes cafes, shops, and waiting areas."
  },
  {
    name: "Autobusni kolodvor Split",
    category: "bus_stations",
    address: "Obala kneza Domagoja 12",
    city: "Split",
    region: "Dalmacija",
    lat: 43.5041,
    lng: 16.4428,
    description: "Autobusni kolodvor Split smješten je u samom centru grada, neposredno uz trajektnu luku i željeznički kolodvor. Njegova savršena lokacija omogućuje brzi prelazak putnika s autobusa na trajekte za dalmatinske otoke. Vrlo je prometan, osobito tijekom ljetnih mjeseci.\n\nThe Split bus station is located in the very center of the city, right next to the ferry port and the railway station. Its perfect location allows passengers to quickly transfer from buses to ferries heading to the Dalmatian islands. It is very busy, especially during the summer months."
  },
  {
    name: "Autobusni kolodvor Zadar",
    category: "bus_stations",
    address: "Ante Starčevića 1",
    city: "Zadar",
    region: "Sjeverna Dalmacija",
    lat: 44.1065,
    lng: 15.2384,
    description: "Moderan i prostran autobusni kolodvor u Zadru udaljen je oko 15 minuta hoda od povijesne gradske jezgre. Odlično je povezan sa svim većim gradovima u Hrvatskoj te obližnjim zračnim lukama. Nudi udobne čekaonice, kioske i ugostiteljske objekte.\n\nThe modern and spacious bus station in Zadar is about a 15-minute walk from the historic city center. It is excellently connected with all major cities in Croatia and nearby airports. It offers comfortable waiting rooms, kiosks, and catering facilities."
  },
  {
    name: "Autobusni kolodvor Rijeka",
    category: "bus_stations",
    address: "Žabica 1",
    city: "Rijeka",
    region: "Kvarner",
    lat: 45.3283,
    lng: 14.4373,
    description: "Riječki autobusni kolodvor nalazi se na trgu Žabica u samom centru grada. Ovo je ključna prometna točka za putovanje prema Istri, Kvarneru, otocima, ali i prema kontinentalnoj Hrvatskoj. Zbog skučenog prostora u centru, planirana je skorašnja velika obnova.\n\nThe Rijeka bus station is located on Žabica square in the very center of the city. This is a key transport hub for traveling to Istria, Kvarner, the islands, and continental Croatia. Due to cramped space in the center, a major renovation is planned soon."
  },
  {
    name: "Autobusni kolodvor Dubrovnik",
    category: "bus_stations",
    address: "Obala Ivana Pavla II 44",
    city: "Dubrovnik",
    region: "Južna Dalmacija",
    lat: 42.6631,
    lng: 18.0841,
    description: "Kolodvor se nalazi u Gružu, odmah pokraj glavne trajektne luke, oko 3 kilometra od slavnog Starog grada. Služi kao glavno odredište za sve međugradske linije, kao i za česte autobuse koji povezuju zračnu luku. Vrlo je dobro organiziran s prostorom za čuvanje prtljage.\n\nThe station is located in Gruž, right next to the main ferry port, about 3 kilometers from the famous Old Town. It serves as the main destination for all intercity lines, as well as frequent buses connecting the airport. It is very well organized with luggage storage facilities."
  },
  {
    name: "Autobusni kolodvor Osijek",
    category: "bus_stations",
    address: "Bartola Kašića 70",
    city: "Osijek",
    region: "Slavonija",
    lat: 45.5539,
    lng: 18.6792,
    description: "Smatra se jednim od najmodernijih i najuređenijih autobusnih kolodvora u Hrvatskoj. Njegov jedinstven valoviti krov postao je jedan od prepoznatljivih modernih simbola Osijeka. Nalazi se u blizini glavnog željezničkog kolodvora i dobro je povezan javnim prijevozom.\n\nIt is considered one of the most modern and well-kept bus stations in Croatia. Its unique wavy roof has become one of the recognizable modern symbols of Osijek. It is located near the main railway station and is well connected by public transport."
  },
  {
    name: "Zagreb Glavni kolodvor",
    category: "train_stations",
    address: "Trg kralja Tomislava 12",
    city: "Zagreb",
    region: "Središnja Hrvatska",
    lat: 45.8052,
    lng: 15.9790,
    description: "Glavni željeznički kolodvor u Zagrebu impresivna je neoklasična zgrada iz 19. stoljeća. Nalazi se na predivnom Trgu kralja Tomislava, pružajući putnicima spektakularan prvi dojam grada. Najveće je čvorište Hrvatskih željeznica (HŽ) za domaći i međunarodni promet.\n\nThe Zagreb Main Railway Station is an impressive neoclassical building from the 19th century. It is located on the beautiful King Tomislav Square, providing travelers with a spectacular first impression of the city. It is the largest hub of Croatian Railways (HŽ) for domestic and international traffic."
  },
  {
    name: "Željeznički kolodvor Split",
    category: "train_stations",
    address: "Obala kneza Domagoja 10",
    city: "Split",
    region: "Dalmacija",
    lat: 43.5046,
    lng: 16.4431,
    description: "Splitski željeznički kolodvor smješten je u idealnoj transportnoj osi, tik uz autobusni kolodvor i luku. Iako manjeg opsega nego zagrebački, ljeti bilježi veliki promet zbog noćnih vlakova iz unutrašnjosti. Zgrada kolodvora nudi osnovne sadržaje za putnike.\n\nThe Split railway station is located in an ideal transport axis, right next to the bus station and the port. Although smaller in scale than Zagreb's, it sees heavy traffic in the summer due to night trains from the interior. The station building offers basic amenities for travelers."
  },
  {
    name: "Željeznički kolodvor Rijeka",
    category: "train_stations",
    address: "Trg kralja Tomislava 1",
    city: "Rijeka",
    region: "Kvarner",
    lat: 45.3288,
    lng: 14.4361,
    description: "Povijesna zgrada kolodvora u Rijeci svjedoči o nekadašnjoj ogromnoj važnosti ovog lučkog grada u Austro-Ugarskoj monarhiji. Kolodvor povezuje Kvarner s unutrašnjošću Hrvatske te glavnim europskim središtima. Arhitektura zgrade i danas plijeni pozornost.\n\nThe historic station building in Rijeka bears witness to the former immense importance of this port city in the Austro-Hungarian monarchy. The station connects Kvarner with the interior of Croatia and major European centers. The architecture of the building still attracts attention today."
  },
  {
    name: "Željeznički kolodvor Osijek",
    category: "train_stations",
    address: "Trg Lavoslava Ružičke 2",
    city: "Osijek",
    region: "Slavonija",
    lat: 45.5540,
    lng: 18.6811,
    description: "Glavni željeznički kolodvor Osijek predstavlja najvažnije željezničko čvorište u istočnoj Hrvatskoj. Zgrada je nedavno temeljito obnovljena, čime joj je vraćen stari sjaj. Nalazi se relativno blizu centra grada i odmah prekoputa modernog autobusnog kolodvora.\n\nThe Osijek Main Railway Station is the most important railway hub in eastern Croatia. The building was recently thoroughly renovated, restoring its old glory. It is located relatively close to the city center and directly across from the modern bus station."
  },
  {
    name: "Željeznički kolodvor Vinkovci",
    category: "train_stations",
    address: "Trg kralja Tomislava 1",
    city: "Vinkovci",
    region: "Slavonija",
    lat: 45.2952,
    lng: 18.8035,
    description: "Povijesno gledano, vinkovački željeznički kolodvor bio je jedno od najvažnijih raskrižja u cijeloj bivšoj državi, a njime je prolazio i slavni Orient Express. I danas je to vitalna točka željezničkog prometa u Slavoniji, a zgrada kolodvora nosi poseban povijesni značaj.\n\nHistorically, the Vinkovci railway station was one of the most important junctions in the entire former state, and the famous Orient Express passed through it. Even today, it is a vital point of railway traffic in Slavonia, and the station building holds special historical significance."
  }
];

function generateId() {
  return crypto.randomBytes(7).toString('hex') + 'a';
}

const now = new Date().toISOString().replace('T', ' ').replace('Z', 'Z');

stations.forEach(s => {
  const id = generateId();
  // We insert '[]' for photoUrls. The photo fetcher script will pick it up.
  const query = `
    INSERT INTO listings (
      id, name, locationCategoryId, locationCategoryType, address, city, region, 
      latitude, longitude, description, status, photoUrls, paymentStatus, created, updated
    ) VALUES (
      '${id}', 
      '${s.name.replace(/'/g, "''")}', 
      '${s.category}', 
      'free', 
      '${s.address.replace(/'/g, "''")}', 
      '${s.city}', 
      '${s.region}', 
      ${s.lat}, 
      ${s.lng}, 
      '${s.description.replace(/'/g, "''")}', 
      'active', 
      '[]', 
      'not_applicable', 
      '${now}', 
      '${now}'
    );
  `;
  
  try {
    execSync(`sqlite3 "${DB_PATH}" "${query}"`);
    console.log(`Inserted: ${s.name}`);
  } catch (err) {
    console.error(`Failed to insert ${s.name}: ${err.message}`);
  }
});

console.log('All stations successfully added to the database!');
