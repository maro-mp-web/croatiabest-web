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
  node["amenity"="ferry_terminal"](area.searchArea);
  way["amenity"="ferry_terminal"](area.searchArea);
  node["leisure"="marina"](area.searchArea);
  way["leisure"="marina"](area.searchArea);
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

async function fetchPorts() {
  console.log('Fetching ports and marinas from Overpass API...');
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
  
  console.log(`Found ${elements.length} ports/marinas in Croatia!`);
  
  let existingNames = new Set();
  try {
    const output = execSync(`sqlite3 "${DB_PATH}" "SELECT name FROM listings WHERE locationCategoryId IN ('ferry_ports', 'marinas');"`, { encoding: 'utf8' });
    output.split('\\n').forEach(line => {
      if (line.trim()) existingNames.add(line.trim().toLowerCase());
    });
  } catch (err) {
    console.warn('Could not read existing ports from DB.');
  }

  const now = new Date().toISOString().replace('T', ' ').replace('Z', 'Z');
  let insertedCount = 0;

  for (const el of elements) {
    if (!el.tags || !el.tags.name) continue;
    
    let rawName = el.tags.name;
    let name = rawName;
    const isFerry = el.tags.amenity === 'ferry_terminal';
    const category = isFerry ? 'ferry_ports' : 'marinas';
    const lowerName = rawName.toLowerCase();
    
    // Add prefixes if missing
    if (isFerry && !lowerName.includes('luka') && !lowerName.includes('pristanište') && !lowerName.includes('trajekt') && !lowerName.includes('port')) {
        name = `Trajektna luka ${rawName}`;
    } else if (!isFerry && !lowerName.includes('marina') && !lowerName.includes('lučica') && !lowerName.includes('vez')) {
        name = `Marina ${rawName}`;
    }

    if (existingNames.has(name.toLowerCase()) || existingNames.has(rawName.toLowerCase())) {
        continue;
    }

    const lat = el.lat || (el.center && el.center.lat);
    const lng = el.lon || (el.center && el.center.lon);
    if (!lat || !lng) continue;

    const city = el.tags['addr:city'] || el.tags['addr:town'] || el.tags['addr:village'] || rawName;
    
    let hrDesc, enDesc;
    if (isFerry) {
        hrDesc = `Luka / pristanište ${rawName} iznimno je važna točka putničkog brodskog i trajektnog prometa. Povezuje obalu s predivnim otocima (ili riječne obale) te omogućuje brz i siguran transport putnika, automobila i robe tijekom cijele godine.`;
        enDesc = `The ${rawName} port / ferry terminal is an extremely important hub for passenger ship and ferry traffic. It connects the mainland with beautiful islands (or river banks) and allows for quick and safe transport of passengers, cars, and goods throughout the year.`;
    } else {
        hrDesc = `Marina ${rawName} nudi siguran vez i bogatu nautičku ponudu za sve ljubitelje mora i jedrenja. Opremljena je modernim sadržajima, vrhunskom uslugom te predstavlja savršeno polazište za istraživanje skrivenih uvala i otoka.`;
        enDesc = `The ${rawName} marina offers a safe berth and a rich nautical offer for all sea and sailing enthusiasts. It is equipped with modern facilities, top-notch service, and represents a perfect starting point for exploring hidden coves and islands.`;
    }
    const description = hrDesc + '\\n\\n' + enDesc;

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

  console.log(`Successfully inserted ${insertedCount} NEW ports and marinas into the database!`);
}

fetchPorts().catch(err => {
  console.error(err);
  process.exit(1);
});
