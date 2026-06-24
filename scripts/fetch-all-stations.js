const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'pb_data', 'data.db');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OVERPASS_QUERY = `
[out:json][timeout:90];
area["ISO3166-1"="HR"][admin_level=2]->.searchArea;
(
  node["railway"="station"](area.searchArea);
  node["railway"="halt"](area.searchArea);
);
out center;
`;

function generateId() {
  return crypto.randomBytes(7).toString('hex') + 'a';
}

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

async function fetchStations() {
  console.log('Fetching stations from Overpass API (this might take a few seconds)...');
  const response = await fetch(OVERPASS_URL + '?data=' + encodeURIComponent(OVERPASS_QUERY), {
    method: 'GET',
    headers: {
      'User-Agent': 'CroatiaBest-Seed-Script/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.statusText}`);
  }

  const data = await response.json();
  const elements = data.elements || [];
  
  console.log(`Found ${elements.length} stations/halts in Croatia!`);
  
  // Get existing train stations to avoid duplicates
  let existingNames = new Set();
  try {
    const output = execSync(`sqlite3 "${DB_PATH}" "SELECT name FROM listings WHERE locationCategoryId = 'train_stations';"`, { encoding: 'utf8' });
    output.split('\\n').forEach(line => {
      if (line.trim()) existingNames.add(line.trim().toLowerCase());
    });
  } catch (err) {
    console.warn('Could not read existing stations from DB, assuming empty or proceeding anyway.');
  }

  const now = new Date().toISOString().replace('T', ' ').replace('Z', 'Z');
  let insertedCount = 0;

  for (const el of elements) {
    // Only process nodes with a name
    if (!el.tags || !el.tags.name) continue;
    
    let rawName = el.tags.name;
    // Some are named "Knin", let's ensure it says "Željeznička stanica Knin" if it doesn't already contain "kolodvor", "stanica", "stajalište"
    let name = rawName;
    const lowerName = rawName.toLowerCase();
    if (!lowerName.includes('kolodvor') && !lowerName.includes('stanica') && !lowerName.includes('stajalište')) {
        name = `Željeznička stanica ${rawName}`;
    }

    if (existingNames.has(name.toLowerCase()) || existingNames.has(rawName.toLowerCase())) {
        continue; // Skip duplicate
    }

    const lat = el.lat;
    const lng = el.lon;
    const city = el.tags['addr:city'] || el.tags['addr:town'] || el.tags['addr:village'] || rawName;
    
    const hrDesc = `Željeznička stanica ${rawName} važna je postaja u sklopu mreže Hrvatskih željeznica. Smještena je na točnim GPS koordinatama te svakodnevno služi lokalnim putnicima i turistima za putovanja diljem Hrvatske.`;
    const enDesc = `The ${rawName} railway station is an important stop within the Croatian Railways network. Located at exact GPS coordinates, it daily serves local commuters and tourists traveling across Croatia.`;
    const description = hrDesc + '\\n\\n' + enDesc;

    const id = generateId();
    const query = `
      INSERT INTO listings (
        id, name, locationCategoryId, locationCategoryType, address, city, region, 
        latitude, longitude, description, status, photoUrls, paymentStatus, created, updated
      ) VALUES (
        '${id}', 
        '${escapeSql(name)}', 
        'train_stations', 
        'free', 
        '', 
        '${escapeSql(city)}', 
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
      insertedCount++;
    } catch (err) {
      console.error(`Failed to insert ${name}: ${err.message}`);
    }
  }

  console.log(`Successfully inserted ${insertedCount} NEW railway stations into the database!`);
}

fetchStations().catch(err => {
  console.error(err);
  process.exit(1);
});
