const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'pb_data', 'data.db');
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const CITIES = [
  { name: 'Zagreb', lat: 45.8150, lng: 15.9819 },
  { name: 'Split', lat: 43.5081, lng: 16.4402 },
  { name: 'Dubrovnik', lat: 42.6507, lng: 18.0944 },
  { name: 'Zadar', lat: 44.1194, lng: 15.2314 },
  { name: 'Rijeka', lat: 45.3271, lng: 14.4422 },
  { name: 'Osijek', lat: 45.5550, lng: 18.6955 },
  { name: 'Pula', lat: 44.8666, lng: 13.8496 },
  { name: 'Šibenik', lat: 43.7350, lng: 15.8950 },
  { name: 'Varaždin', lat: 46.3057, lng: 16.3366 },
  { name: 'Karlovac', lat: 45.4929, lng: 15.5553 },
  { name: 'Vinkovci', lat: 45.2869, lng: 18.8058 },
  { name: 'Samobor', lat: 45.8016, lng: 15.7111 },
  { name: 'Velika Gorica', lat: 45.7131, lng: 16.0728 },
  { name: 'Knin', lat: 44.0344, lng: 16.1961 },
  { name: 'Makarska', lat: 43.2936, lng: 17.0197 },
  { name: 'Opatija', lat: 45.3331, lng: 14.3039 },
  { name: 'Umag', lat: 45.4371, lng: 13.5244 },
  { name: 'Sinj', lat: 43.7031, lng: 16.6339 },
  { name: 'Hvar', lat: 43.1729, lng: 16.4425 },
  { name: 'Brač (Supetar)', lat: 43.3289, lng: 16.6346 },
  { name: 'Korčula', lat: 42.9611, lng: 16.8988 },
  { name: 'Vukovar', lat: 45.3433, lng: 18.9997 },
  { name: 'Slavonski Brod', lat: 45.1631, lng: 18.0116 },
  { name: 'Sisak', lat: 45.4854, lng: 16.3725 },
  { name: 'Bjelovar', lat: 45.8986, lng: 16.8489 },
  { name: 'Koprivnica', lat: 46.1628, lng: 16.8275 },
  { name: 'Čakovec', lat: 46.3844, lng: 16.4339 },
  { name: 'Požega', lat: 45.3403, lng: 17.6853 },
  { name: 'Gospić', lat: 44.5461, lng: 15.3747 },
  { name: 'Krapina', lat: 46.1611, lng: 15.8772 },
  { name: 'Pazin', lat: 45.2389, lng: 13.9356 }
];

function generateId() {
  return crypto.randomBytes(7).toString('hex') + 'a';
}

function escapeSql(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "''");
}

function getDescriptions(name, isWar) {
  if (isWar) {
    const hr = `Ovaj impresivni spomenik podignut je u spomen na stradanja i herojsku borbu u Domovinskom ratu. Predstavlja trajnu uspomenu na žrtvu koju su branitelji podnijeli za slobodu domovine. Njegova arhitektura i simbolika duboko su ukorijenjeni u noviju hrvatsku povijest. Svaki posjetitelj koji stane ispred ovog monumenta može osjetiti težinu i ponos koji on nosi. Spomenik služi kao važno mjesto okupljanja, prisjećanja i odavanja počasti onima koji su najviše dali za stvaranje nezavisne države. Točna lokacija omogućuje posjetiteljima da u miru odaju počast i istraže ovaj povijesni biljeg.`;
    
    const en = `This impressive monument was erected in memory of the suffering and heroic struggle during the Croatian Homeland War. It serves as a lasting tribute to the sacrifice made by the defenders for the country's freedom. Its architecture and symbolism are deeply rooted in modern Croatian history. Every visitor who stands before this monument can feel the weight and pride it carries. The monument acts as an important place of gathering, remembrance, and honoring those who gave the most for the creation of an independent state. The exact location allows visitors to pay their respects peacefully and explore this historical landmark.`;
    
    return hr + '\\n\\n' + en;
  } else {
    const hr = `Ovaj veličanstveni spomenik (${name}) predstavlja važno kulturno i povijesno svjedočanstvo našeg kraja. Svojim jedinstvenim dizajnom i povijesnom pričom privlači brojne putnike, istraživače i ljubitelje umjetnosti. Izgrađen u čast značajnih događaja ili ličnosti iz prošlosti, spomenik je neizostavna točka pri razgledavanju grada. Njegovi detalji govore tisuću riječi o vremenu u kojem je nastao i društvu koje ga je podiglo. Stajanjem uz ovaj lokalitet, posjetitelji dobivaju izravan uvid u bogatu baštinu i naslijeđe koje se brižno čuva za buduće generacije. Svakako je preporučljivo posjetiti ga i doživjeti njegovu priču iz prve ruke.`;
    
    const en = `This magnificent monument (${name}) represents an important cultural and historical testimony of our region. With its unique design and historical background, it attracts numerous travelers, explorers, and art enthusiasts. Built to honor significant events or figures from the past, the monument is an indispensable spot when touring the city. Its details speak a thousand words about the era in which it was created and the society that erected it. By standing beside this site, visitors gain direct insight into the rich heritage that is carefully preserved for future generations. It is highly recommended to visit and experience its story firsthand.`;
    
    return hr + '\\n\\n' + en;
  }
}

async function fetchMonumentsForCity(city) {
  // Radius 10000 meters for big cities, finding named monuments
  const query = `
    [out:json][timeout:25];
    (
      node["historic"="monument"]["name"](around:10000,${city.lat},${city.lng});
      node["historic"="memorial"]["name"](around:10000,${city.lat},${city.lng});
    );
    out body 50;
  `;

  console.log(`Fetching monuments for ${city.name}...`);
  try {
    const response = await fetch(OVERPASS_URL + '?data=' + encodeURIComponent(query), {
      method: 'GET',
      headers: { 'User-Agent': 'CroatiaBest-Monuments/1.0' }
    });

    if (!response.ok) {
      console.error(`Error for ${city.name}: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.elements || [];
  } catch (err) {
    console.error(`Exception for ${city.name}: ${err.message}`);
    return [];
  }
}

async function run() {
  console.log('Starting monument extraction...');
  const now = new Date().toISOString().replace('T', ' ').replace('Z', 'Z');
  
  let existingNames = new Set();
  try {
    const output = execSync(`sqlite3 "${DB_PATH}" "SELECT name FROM listings WHERE locationCategoryId IN ('landmarks', 'homeland_war');"`, { encoding: 'utf8' });
    output.split('\\n').forEach(line => {
      if (line.trim()) existingNames.add(line.trim().toLowerCase());
    });
  } catch (err) {
    console.warn('Could not read existing monuments from DB.');
  }

  let totalInserted = 0;

  for (const city of CITIES) {
    const elements = await fetchMonumentsForCity(city);
    
    // Sort to prioritize "Domovinski rat", "Oluja", etc. and filter uniques
    let uniqueMonuments = [];
    let seenNames = new Set();
    
    for (const el of elements) {
      if (!el.tags || !el.tags.name) continue;
      const name = el.tags.name;
      const lowerName = name.toLowerCase();
      
      if (existingNames.has(lowerName) || seenNames.has(lowerName)) continue;
      
      // Basic quality filter: exclude generic "Spomenik" without details if possible, but keep if few
      seenNames.add(lowerName);
      uniqueMonuments.push(el);
    }
    
    // Limit to 20 per city
    const selected = uniqueMonuments.slice(0, 20);
    console.log(`  -> Found ${selected.length} unique new monuments for ${city.name}`);
    
    for (const el of selected) {
      const name = el.tags.name;
      const lowerName = name.toLowerCase();
      const lat = el.lat;
      const lng = el.lon;
      
      const isWar = lowerName.includes('domovin') || lowerName.includes('branitelj') || 
                    lowerName.includes('oluja') || lowerName.includes('bljesak') || 
                    lowerName.includes('žrtv') || lowerName.includes('poginu') || 
                    lowerName.includes('vukovar');
                    
      const category = isWar ? 'homeland_war' : 'landmarks';
      const description = getDescriptions(name, isWar);
      const id = generateId();
      
      const query = `
        INSERT INTO listings (
          id, name, locationCategoryId, locationCategoryType, address, city, region, 
          latitude, longitude, description, status, photoUrls, paymentStatus, created, updated
        ) VALUES (
          '${id}', 
          '${escapeSql(name)}', 
          '${category}', 
          'free', 
          '', 
          '${escapeSql(city.name)}', 
          '', 
          ${lat}, 
          ${lng}, 
          '${escapeSql(description)}', 
          'active', 
          '[]', 
          'not_applicable', 
          '${now}', 
          '${now}'
        );
      `;
      
      try {
        execSync(`sqlite3 "${DB_PATH}" "${query}"`);
        existingNames.add(lowerName);
        totalInserted++;
      } catch (err) {
        console.error(`  Failed to insert ${name}: ${err.message}`);
      }
    }
    
    // Sleep a bit to avoid Overpass rate limits
    await new Promise(res => setTimeout(res, 2000));
  }
  
  console.log(`\\nDONE! Successfully inserted ${totalInserted} NEW monuments into the database!`);
}

run().catch(console.error);
