const fs = require('fs');
const path = require('path');

const PROJECT_DIR = '/Users/maropincevic/Desktop/react/croatiabest';
const envContent = fs.readFileSync(path.join(PROJECT_DIR, '.env'), 'utf8');
const apiKeyMatch = envContent.match(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(.*)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : '';

async function test() {
  const query = encodeURIComponent('Javna vatrogasna postrojba Dubrovnik');
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${API_KEY}`;
  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
