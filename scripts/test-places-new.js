const fs = require('fs');
const path = require('path');

const PROJECT_DIR = '/Users/maropincevic/Desktop/react/croatiabest';
const envContent = fs.readFileSync(path.join(PROJECT_DIR, '.env'), 'utf8');
const apiKeyMatch = envContent.match(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : '';

async function testPlacesNew() {
  const url = `https://places.googleapis.com/v1/places:searchText`;
  const body = {
    textQuery: "Javna vatrogasna postrojba Dubrovnik"
  };
  console.log('Fetching:', url);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.photos'
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}
testPlacesNew();
