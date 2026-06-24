const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'pb_data', 'data.db');

const stops = [
  {
    name: "Autobusna stanica Omiš",
    category: "bus_stations",
    address: "Priko ul. 1",
    city: "Omiš",
    region: "Dalmacija",
    lat: 43.4445,
    lng: 16.6905,
    description: "Autobusna stanica u Omišu smještena je na vrlo prometnoj Jadranskoj magistrali, tik uz rijeku Cetinu. Zbog svog položaja, ključna je točka za putnike koji idu prema jugu ili se vraćaju prema Splitu. Nema veliki terminal, ali je izrazito frekventna ljeti.\n\nThe bus stop in Omiš is located on the very busy Adriatic Highway, right next to the Cetina River. Due to its position, it is a key point for travelers heading south or returning to Split. It doesn't have a large terminal but is extremely busy in the summer."
  },
  {
    name: "Autobusna stanica Trogir",
    category: "bus_stations",
    address: "Kneza Trpimira 2",
    city: "Trogir",
    region: "Dalmacija",
    lat: 43.5152,
    lng: 16.2524,
    description: "Smještena tik pred ulazom u staru jezgru Trogira na otoku, ova je stanica nezaobilazna za sve turiste u regiji. Povezuje Trogir sa Splitom (poznata linija 37) i mnogim obližnjim obalnim mjestima. Uvijek je prepuna turista i lokalnog stanovništva.\n\nLocated right before the entrance to the old core of Trogir on the island, this stop is unavoidable for all tourists in the region. It connects Trogir with Split (the famous line 37) and many nearby coastal towns. It is always crowded with tourists and locals."
  },
  {
    name: "Autobusna stanica Makarska",
    category: "bus_stations",
    address: "Ante Starčevića 30",
    city: "Makarska",
    region: "Dalmacija",
    lat: 43.2965,
    lng: 17.0223,
    description: "Glavna stanica za cijelu Makarsku rivijeru. Iako ima elemente kolodvora, često djeluje kao tranzitna stanica za autobuse koji putuju između Splita i Dubrovnika. Nalazi se u blizini centra grada i plaže.\n\nThe main station for the entire Makarska Riviera. Although it has elements of a terminal, it often acts as a transit stop for buses traveling between Split and Dubrovnik. It is located near the city center and the beach."
  },
  {
    name: "Autobusna stanica Rovinj",
    category: "bus_stations",
    address: "Trg na lokvi 6",
    city: "Rovinj",
    region: "Istra",
    lat: 45.0818,
    lng: 13.6394,
    description: "Stanica se nalazi na odličnoj lokaciji, samo nekoliko minuta hoda od starog grada i obale. Vrlo je važna za povezivanje Rovinja s Pulom, Porečom i inozemstvom. Ima i šalter za prodaju karata te nekoliko kafića u blizini.\n\nThe station is situated in an excellent location, just a few minutes' walk from the old town and the waterfront. It is very important for connecting Rovinj with Pula, Poreč, and abroad. It has a ticket counter and several cafes nearby."
  },
  {
    name: "Autobusna stanica Poreč",
    category: "bus_stations",
    address: "Karla Huguesa 2",
    city: "Poreč",
    region: "Istra",
    lat: 45.2267,
    lng: 13.5996,
    description: "Porečka stanica nalazi se neposredno uz veliku marinu i stari grad. Tijekom turističke sezone ovo je iznimno prometno čvorište preko kojeg tisuće gostiju dolaze u porečke resorte. Moderno je opremljena i lako dostupna.\n\nThe Poreč station is located right next to the large marina and the old town. During the tourist season, this is an extremely busy hub through which thousands of guests arrive at Poreč resorts. It is modernly equipped and easily accessible."
  },
  {
    name: "Zagreb Zapadni kolodvor",
    category: "train_stations",
    address: "Trg Francuske republike 1",
    city: "Zagreb",
    region: "Središnja Hrvatska",
    lat: 45.8115,
    lng: 15.9554,
    description: "Druga po važnosti željeznička postaja u Zagrebu, Zapadni kolodvor predivan je primjer starinske željezničke arhitekture. Kroz njega prolaze gotovo svi gradski i prigradski vlakovi prema zapadu. Omiljen je među lokalnim stanovništvom za brzi dolazak u centar.\n\nThe second most important railway station in Zagreb, the West Station, is a beautiful example of antique railway architecture. Almost all urban and suburban trains heading west pass through it. It is popular among locals for quickly reaching the center."
  },
  {
    name: "Željeznička stanica Maksimir",
    category: "train_stations",
    address: "Svetice",
    city: "Zagreb",
    region: "Središnja Hrvatska",
    lat: 45.8152,
    lng: 16.0125,
    description: "Željezničko stajalište Maksimir izuzetno je praktično za sve koji posjećuju stadion Maksimir, park-šumu Maksimir ili zoološki vrt. Ovo je prometno stajalište za gradsko-prigradske vlakove prema istoku.\n\nThe Maksimir railway stop is extremely convenient for anyone visiting the Maksimir stadium, Maksimir park-forest, or the zoo. This is a busy stop for urban-suburban trains heading east."
  },
  {
    name: "Željezničko stajalište Split Predgrađe (Kopilica)",
    category: "train_stations",
    address: "Kopilica",
    city: "Split",
    region: "Dalmacija",
    lat: 43.5233,
    lng: 16.4589,
    description: "Stanica Split Predgrađe, smještena u naselju Kopilica, postala je važna lokalna prometna točka. Često se koristi za lokalni metro vlak koji ju povezuje s glavnim kolodvorom u centru u samo nekoliko minuta, čime se izbjegavaju gradske gužve.\n\nThe Split Predgrađe station, located in the Kopilica neighborhood, has become an important local transport point. It is often used for the local metro train that connects it with the main station in the center in just a few minutes, avoiding city traffic jams."
  }
];

function generateId() {
  return crypto.randomBytes(7).toString('hex') + 'a';
}

const now = new Date().toISOString().replace('T', ' ').replace('Z', 'Z');

stops.forEach(s => {
  const id = generateId();
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

console.log('All smaller stops successfully added to the database!');
