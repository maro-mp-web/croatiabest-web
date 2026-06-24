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
  node["amenity"="bus_station"](area.searchArea);
  way["amenity"="bus_station"](area.searchArea);
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
  console.log('Fetching bus stations from Overpass API (this might take a few seconds)...');
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
  
  console.log(`Found ${elements.length} bus stations in Croatia!`);
  
  // Get existing bus stations to avoid duplicates
  let existingNames = new Set();
  try {
    const output = execSync(`sqlite3 "${DB_PATH}" "SELECT name FROM listings WHERE locationCategoryId = 'bus_stations';"`, { encoding: 'utf8' });
    output.split('\\n').forEach(line => {
      if (line.trim()) existingNames.add(line.trim().toLowerCase());
    });
  } catch (err) {
    console.warn('Could not read existing stations from DB, assuming empty or proceeding anyway.');
  }

  const now = new Date().toISOString().replace('T', ' ').replace('Z', 'Z');
  let insertedCount = 0;

  for (const el of elements) {
    // Only process elements with a name
    if (!el.tags || !el.tags.name) continue;
    
    let rawName = el.tags.name;
    let name = rawName;
    const lowerName = rawName.toLowerCase();
    
    // Ensure it sounds like a station if it's just named after a city
    if (!lowerName.includes('kolodvor') && !lowerName.includes('stanica') && !lowerName.includes('autobusni')) {
        name = `Autobusni kolodvor ${rawName}`;
    }

    if (existingNames.has(name.toLowerCase()) || existingNames.has(rawName.toLowerCase())) {
        continue; // Skip duplicate
    }

    // Since we used `out center`, ways have `lat` and `lon` added to the center object if not node.
    const lat = el.lat || (el.center && el.center.lat);
    const lng = el.lon || (el.center && el.center.lon);
    
    if (!lat || !lng) continue;

    const city = el.tags['addr:city'] || el.tags['addr:town'] || el.tags['addr:village'] || rawName;
    
    const hrDesc = `Autobusni kolodvor u mjestu ${city} važna je točka međugradskog prometa. Ovdje staju brojni autobusi koji povezuju ovo mjesto s ostatkom Hrvatske i Europe, pružajući pouzdan i siguran prijevoz putnicima i turistima.`;
    const enDesc = `The bus station in ${city} is an important hub for intercity transport. Numerous buses stop here, connecting this location with the rest of Croatia and Europe, providing reliable and safe transportation for commuters and tourists.`;
    const description = hrDesc + '\\n\\n' + enDesc;

    const id = generateId();
    const query = `
      INSERT INTO listings (
        id, name, locationCategoryId, locationCategoryType, address, city, region, 
        latitude, longitude, description, status, photoUrls, paymentStatus, created, updated
      ) VALUES (
        '${id}', 
        '${escapeSql(name)}', 
        'bus_stations', 
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

  console.log(`Successfully inserted ${insertedCount} NEW intercity bus stations into the database!`);
}

fetchStations().catch(err => {
  console.error(err);
  process.exit(1);
});
