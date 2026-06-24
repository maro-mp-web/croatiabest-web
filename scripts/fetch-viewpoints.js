const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'pb_data', 'data.db');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
// We only want named viewpoints to get the popular/notable ones
const OVERPASS_QUERY = `
[out:json][timeout:90];
area["ISO3166-1"="HR"][admin_level=2]->.searchArea;
(
  node["tourism"="viewpoint"]["name"](area.searchArea);
  way["tourism"="viewpoint"]["name"](area.searchArea);
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

async function fetchViewpoints() {
  console.log('Fetching named viewpoints from Overpass API...');
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
  
  console.log(`Found ${elements.length} named viewpoints in Croatia!`);
  
  let existingNames = new Set();
  try {
    const output = execSync(`sqlite3 "${DB_PATH}" "SELECT name FROM listings WHERE locationCategoryId = 'viewpoints';"`, { encoding: 'utf8' });
    output.split('\\n').forEach(line => {
      if (line.trim()) existingNames.add(line.trim().toLowerCase());
    });
  } catch (err) {
    console.warn('Could not read existing viewpoints from DB.');
  }

  const now = new Date().toISOString().replace('T', ' ').replace('Z', 'Z');
  let insertedCount = 0;

  for (const el of elements) {
    if (!el.tags || !el.tags.name) continue;
    
    let rawName = el.tags.name;
    let name = rawName;
    const lowerName = rawName.toLowerCase();
    
    // Add prefix if missing
    if (!lowerName.includes('vidikovac') && !lowerName.includes('belvedere') && !lowerName.includes('viewpoint') && !lowerName.includes('pogled')) {
        name = `Vidikovac ${rawName}`;
    }

    if (existingNames.has(name.toLowerCase()) || existingNames.has(rawName.toLowerCase())) {
        continue;
    }

    const lat = el.lat || (el.center && el.center.lat);
    const lng = el.lon || (el.center && el.center.lon);
    if (!lat || !lng) continue;

    const city = el.tags['addr:city'] || el.tags['addr:town'] || el.tags['addr:village'] || '';
    
    const hrDesc = `Predivni ${name} jedna je od najatraktivnijih točaka za fotografiranje i uživanje u panoramskom pogledu. Savršeno mjesto za odmor, promatranje zalaska sunca i stvaranje nezaboravnih uspomena na putovanju.`;
    const enDesc = `The beautiful ${name} is one of the most attractive spots for photography and enjoying panoramic views. A perfect place to relax, watch the sunset, and create unforgettable travel memories.`;
    const description = hrDesc + '\\n\\n' + enDesc;

    const id = generateId();
    const query = `
      INSERT INTO listings (
        id, name, locationCategoryId, locationCategoryType, address, city, region, 
        latitude, longitude, description, status, photoUrls, paymentStatus, created, updated
      ) VALUES (
        '${id}', 
        '${escapeSql(name)}', 
        'viewpoints', 
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

  console.log(`Successfully inserted ${insertedCount} NEW viewpoints into the database!`);
}

fetchViewpoints().catch(err => {
  console.error(err);
  process.exit(1);
});
