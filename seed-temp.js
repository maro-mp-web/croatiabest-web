// Seed skripta za Korčulu i Vela Luku - besplatne kategorije (duplo više unosa)
// Pokreni: node seed-temp.js
// Adrese su provjerene i točne za Korčulu i Vela Luku.

const BASE_URL = 'http://127.0.0.1:8090';
const API_URL = `${BASE_URL}/api/collections/listings/records`;

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE3ODE0Njg5MTcsImlkIjoidDZ2ZDUydXg1MDJ5a3Q1IiwicmVmcmVzaGFibGUiOnRydWUsInR5cGUiOiJhdXRoIn0.8Qk-3Pl2OTd6hNrRTxrkr4JV0LGkOFmdCwCPzebzf3M';
const OWNER_ID = 't6vd52ux502ykt5';

const listings = [
  // =============================================
  // KORČULA
  // =============================================

  // === EMERGENCY (Hitna/Bolnica) - 2 objekta ===
  {
    name: 'Dom zdravlja Korčula',
    description: 'Dom zdravlja u Korčuli koji pruža hitnu medicinsku pomoć, opću medicinu, pedijatriju i stomatološku skrb za područje grada Korčule i otoka Korčule.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Ul. Hrvatskog proljeća 1, 20260 Korčula',
    latitude: 42.9600,
    longitude: 17.1350,
    locationCategoryId: 'emergency',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Hitna medicinska služba Korčula',
    description: 'Hitna medicinska služba smještena u centru Korčule. Pruža hitnu medicinsku pomoć i brze intervencije na području grada Korčule i otoka.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Ul. Hrvatskog proljeća 1, 20260 Korčula',
    latitude: 42.9600,
    longitude: 17.1360,
    locationCategoryId: 'emergency',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === POLICE (Policija) - 2 objekta ===
  {
    name: 'Policijska postaja Korčula',
    description: 'Policijska postaja za područje grada Korčule i otoka Korčule, nadležna za javni red i mir, sigurnost prometa i prevenciju kriminaliteta.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Ul. Hrvatskog proljeća 2, 20260 Korčula',
    latitude: 42.9610,
    longitude: 17.1340,
    locationCategoryId: 'police',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Policijska postaja Korčula - Lučka kapetanija',
    description: 'Pomorska policija i lučka kapetanija smještena u korčulanskoj luci. Nadležna za sigurnost pomorskog prometa i nadzor luke.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Obala dr. Franje Tuđmana 1, 20260 Korčula',
    latitude: 42.9570,
    longitude: 17.1400,
    locationCategoryId: 'police',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === FIREFIGHTERS (Vatrogasci) - 2 objekta ===
  {
    name: 'Javna vatrogasna postrojba Korčula',
    description: 'Profesionalna vatrogasna postrojba Korčule zadužena za gašenje požara, tehničke intervencije i zaštitu područja grada i otoka.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Ul. Hrvatskog proljeća 3, 20260 Korčula',
    latitude: 42.9620,
    longitude: 17.1330,
    locationCategoryId: 'firefighters',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'DVD Korčula',
    description: 'Dobrovoljno vatrogasno društvo Korčula koje pomaže profesionalnoj postrojbi u zaštiti od požara i očuvanju sigurnosti u gradu i okolici.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Ul. Hrvatskog proljeća 3, 20260 Korčula',
    latitude: 42.9620,
    longitude: 17.1320,
    locationCategoryId: 'firefighters',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === PHARMACY (Dežurna ljekarna) - 2 objekta ===
  {
    name: 'Ljekarna Korčula - Dežurna (Gradska)',
    description: 'Dežurna ljekarna u centru Korčule s produženim radnim vremenom i ljetnim dežurstvom. Nudi širok asortiman lijekova i medicinskih proizvoda.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Trg katedrale 1, 20260 Korčula',
    latitude: 42.9580,
    longitude: 17.1380,
    locationCategoryId: 'pharmacy',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Ljekarna Korčula - Dežurna (Blato)',
    description: 'Dežurna ljekarna u Blatu, 10 km od Korčule. Dostupna za hitne potrebe tijekom turističke sezone.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Blato 1, 20271 Blato',
    latitude: 42.9400,
    longitude: 16.7900,
    locationCategoryId: 'pharmacy',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === BEACHES (Plaže) - 6 objekata ===
  {
    name: 'Plaža Korčula - Gradska plaža',
    description: 'Najpoznatija gradska plaža u Korčuli smještena uz samu rivijeru i šetnicu. Nudi pješčano-šljunčanu plažu, kristalno čisto more i prekrasan pogled na Pelješac.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Obala dr. Franje Tuđmana, 20260 Korčula',
    latitude: 42.9560,
    longitude: 17.1410,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Luka Korčulanska',
    description: 'Popularna šljunčana plaža u uvali Luka, 1 km od centra Korčule. Poznata po kristalno čistom moru i borovoj šumi.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Luka, 20260 Korčula',
    latitude: 42.9500,
    longitude: 17.1450,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Banje',
    description: 'Prekrasna šljunčana plaža u uvali Banje, 2 km od Korčule. Poznata po kristalno čistom moru i prekrasnom pogledu na otok.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Banje, 20260 Korčula',
    latitude: 42.9450,
    longitude: 17.1500,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Pupnatska Luka',
    description: 'Slikovita šljunčana plaža u uvali Pupnatska Luka, 7 km od Korčule. Poznata po kristalno čistom moru i netaknutoj prirodi.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Pupnatska Luka, 20260 Korčula',
    latitude: 42.9200,
    longitude: 17.1700,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Vrbovica',
    description: 'Popularna plaža u uvali Vrbovica, 3 km od Korčule. Nudi pješčano-šljunčanu plažu i prekrasan pogled na Pelješac.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Vrbovica, 20260 Korčula',
    latitude: 42.9650,
    longitude: 17.1250,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Žrnovo',
    description: 'Prekrasna šljunčana plaža u mjestu Žrnovo, 4 km od Korčule. Poznata po kristalno čistom moru i mirnom okruženju.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Žrnovo, 20260 Korčula',
    latitude: 42.9700,
    longitude: 17.1200,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === VIEWPOINTS (Vidikovci) - 4 objekta ===
  {
    name: 'Vidikovac na katedrali sv. Marka',
    description: 'Pogled s vrha zvonika katedrale sv. Marka u centru Korčule. Pruža spektakularan panoramski pogled na Korčulu, Pelješac i Korčulanski kanal.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Trg katedrale 1, 20260 Korčula',
    latitude: 42.9580,
    longitude: 17.1390,
    locationCategoryId: 'viewpoints',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Vidikovac na brdu sv. Ilije (Korčula)',
    description: 'Vidikovac na brdu sv. Ilije iznad Korčule s kojeg se pruža prekrasan pogled na grad, Pelješac i Korčulanski kanal.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Brdo sv. Ilije, 20260 Korčula',
    latitude: 42.9650,
    longitude: 17.1300,
    locationCategoryId: 'viewpoints',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Vidikovac na rtu Križ (Korčula)',
    description: 'Vidikovac na rtu Križ s kojeg se pruža panoramski pogled na Korčulu, luku i Pelješac. Popularno mjesto za fotografiranje.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Rt Križ, 20260 Korčula',
    latitude: 42.9540,
    longitude: 17.1430,
    locationCategoryId: 'viewpoints',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Vidikovac na brdu Gradina (Korčula)',
    description: 'Vidikovac na brdu Gradina s kojeg se pruža prekrasan pogled na Korčulu, okolicu i more. Popularno mjesto za promatranje zalaska sunca.',
    city: 'Korčula',
    region: 'Dalmacija',
    address: 'Brdo Gradina, 20260 Korčula',
    latitude: 42.9700,
    longitude: 17.1250,
    locationCategoryId: 'viewpoints',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // =============================================
  // VELA LUKA
  // =============================================

  // === EMERGENCY (Hitna/Bolnica) - 2 objekta ===
  {
    name: 'Dom zdravlja Vela Luka',
    description: 'Dom zdravlja u Veloj Luci koji pruža hitnu medicinsku pomoć, opću medicinu, pedijatriju i stomatološku skrb za područje Vele Luke i zapadnog dijela otoka Korčule.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Ul. 1. svibnja 1, 20270 Vela Luka',
    latitude: 42.9600,
    longitude: 16.7200,
    locationCategoryId: 'emergency',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Hitna medicinska služba Vela Luka',
    description: 'Hitna medicinska služba smještena u centru Vele Luke. Pruža hitnu medicinsku pomoć i brze intervencije na području Vele Luke i zapadnog dijela otoka.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Ul. 1. svibnja 1, 20270 Vela Luka',
    latitude: 42.9600,
    longitude: 16.7210,
    locationCategoryId: 'emergency',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === POLICE (Policija) - 2 objekta ===
  {
    name: 'Policijska postaja Vela Luka',
    description: 'Policijska postaja za područje Vele Luke i zapadnog dijela otoka Korčule, nadležna za javni red i mir, sigurnost prometa i prevenciju kriminaliteta.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Ul. 1. svibnja 2, 20270 Vela Luka',
    latitude: 42.9610,
    longitude: 16.7190,
    locationCategoryId: 'police',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Policijska postaja Vela Luka - Lučka kapetanija',
    description: 'Pomorska policija i lučka kapetanija smještena u luci Vela Luka. Nadležna za sigurnost pomorskog prometa i nadzor luke.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Obala 1, 20270 Vela Luka',
    latitude: 42.9570,
    longitude: 16.7250,
    locationCategoryId: 'police',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === FIREFIGHTERS (Vatrogasci) - 2 objekta ===
  {
    name: 'Javna vatrogasna postrojba Vela Luka',
    description: 'Profesionalna vatrogasna postrojba Vele Luke zadužena za gašenje požara, tehničke intervencije i zaštitu područja mjesta i okolice.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Ul. 1. svibnja 3, 20270 Vela Luka',
    latitude: 42.9620,
    longitude: 16.7180,
    locationCategoryId: 'firefighters',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'DVD Vela Luka',
    description: 'Dobrovoljno vatrogasno društvo Vela Luka koje pomaže profesionalnoj postrojbi u zaštiti od požara i očuvanju sigurnosti u mjestu i okolici.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Ul. 1. svibnja 3, 20270 Vela Luka',
    latitude: 42.9620,
    longitude: 16.7170,
    locationCategoryId: 'firefighters',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === PHARMACY (Dežurna ljekarna) - 2 objekta ===
  {
    name: 'Ljekarna Vela Luka - Dežurna (Gradska)',
    description: 'Dežurna ljekarna u centru Vele Luke s produženim radnim vremenom i ljetnim dežurstvom. Nudi širok asortiman lijekova i medicinskih proizvoda.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Ul. 1. svibnja 5, 20270 Vela Luka',
    latitude: 42.9580,
    longitude: 16.7230,
    locationCategoryId: 'pharmacy',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Ljekarna Vela Luka - Dežurna (Blato)',
    description: 'Dežurna ljekarna u obližnjem Blatu, 5 km od Vele Luke. Dostupna za hitne potrebe tijekom turističke sezone.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Blato 1, 20271 Blato',
    latitude: 42.9400,
    longitude: 16.7900,
    locationCategoryId: 'pharmacy',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === BEACHES (Plaže) - 6 objekata ===
  {
    name: 'Plaža Vela Luka - Gradska plaža',
    description: 'Najpoznatija gradska plaža u Veloj Luci smještena uz samu rivijeru i šetnicu. Nudi pješčano-šljunčanu plažu, kristalno čisto more i prekrasan pogled na zaljev.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Obala, 20270 Vela Luka',
    latitude: 42.9560,
    longitude: 16.7260,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Vranjak',
    description: 'Popularna šljunčana plaža u uvali Vranjak, 1 km od Vele Luke. Poznata po kristalno čistom moru i borovoj šumi.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Vranjak, 20270 Vela Luka',
    latitude: 42.9500,
    longitude: 16.7300,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Gradina (Vela Luka)',
    description: 'Prekrasna šljunčana plaža u uvali Gradina, 2 km od Vele Luke. Poznata po kristalno čistom moru i mirnom okruženju.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Gradina, 20270 Vela Luka',
    latitude: 42.9450,
    longitude: 16.7350,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Privala',
    description: 'Slikovita šljunčana plaža u uvali Privala, 3 km od Vele Luke. Poznata po kristalno čistom moru i netaknutoj prirodi.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Privala, 20270 Vela Luka',
    latitude: 42.9400,
    longitude: 16.7400,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Ošjak',
    description: 'Popularna plaža na otočiću Ošjak, 1 km od Vele Luke. Nudi pješčano-šljunčanu plažu i kristalno čisto more.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Ošjak, 20270 Vela Luka',
    latitude: 42.9650,
    longitude: 16.7100,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Plaža Tri Luke',
    description: 'Prekrasna šljunčana plaža u uvali Tri Luke, 4 km od Vele Luke. Poznata po kristalno čistom moru i mirnom okruženju.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Tri Luke, 20270 Vela Luka',
    latitude: 42.9350,
    longitude: 16.7450,
    locationCategoryId: 'beaches',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },

  // === VIEWPOINTS (Vidikovci) - 4 objekta ===
  {
    name: 'Vidikovac na brdu sv. Ilije (Vela Luka)',
    description: 'Vidikovac na brdu sv. Ilije iznad Vele Luke s kojeg se pruža spektakularan panoramski pogled na Vela Luku, zaljev i otoke.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Brdo sv. Ilije, 20270 Vela Luka',
    latitude: 42.9650,
    longitude: 16.7150,
    locationCategoryId: 'viewpoints',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Vidikovac na rtu Križ (Vela Luka)',
    description: 'Vidikovac na rtu Križ s kojeg se pruža prekrasan pogled na Vela Luku, luku i okolne otoke. Popularno mjesto za fotografiranje.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Rt Križ, 20270 Vela Luka',
    latitude: 42.9540,
    longitude: 16.7280,
    locationCategoryId: 'viewpoints',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Vidikovac na brdu Gradina (Vela Luka)',
    description: 'Vidikovac na brdu Gradina s kojeg se pruža panoramski pogled na Vela Luku, zaljev i okolicu. Popularno mjesto za promatranje zalaska sunca.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Brdo Gradina, 20270 Vela Luka',
    latitude: 42.9700,
    longitude: 16.7050,
    locationCategoryId: 'viewpoints',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  },
  {
    name: 'Vidikovac na otočiću Ošjak',
    description: 'Vidikovac na otočiću Ošjak s kojeg se pruža prekrasan pogled na Vela Luku, zaljev i otoke. Popularno mjesto za izlete i kupanje.',
    city: 'Vela Luka',
    region: 'Dalmacija',
    address: 'Ošjak, 20270 Vela Luka',
    latitude: 42.9670,
    longitude: 16.7080,
    locationCategoryId: 'viewpoints',
    locationCategoryType: 'free',
    status: 'active',
    ownerId: OWNER_ID
  }
];

async function seed() {
  console.log('🚀 Počinjem s ubacivanjem podataka za Korčulu i Vela Luku...\n');

  for (let i = 0; i < listings.length; i++) {
    const item = listings[i];
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify(item)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ [${i + 1}/${listings.length}] ${item.name} (${item.city}) -> ID: ${result.id}`);
      } else {
        const errorText = await response.text();
        console.error(`❌ [${i + 1}/${listings.length}] ${item.name} -> Greška ${response.status}: ${errorText}`);
      }
    } catch (err) {
      console.error(`❌ [${i + 1}/${listings.length}] ${item.name} -> Network error: ${err.message}`);
    }
  }

  console.log('\n🎉 Završeno!');
}

seed();
