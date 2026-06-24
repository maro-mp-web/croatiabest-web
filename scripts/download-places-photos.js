const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const sharp = require('sharp');

const PROJECT_DIR = '/Users/maropincevic/Desktop/react/croatiabest';
const DB_PATH = path.join(PROJECT_DIR, 'pb_data/data.db');
const PUBLIC_DIR = path.join(PROJECT_DIR, 'public/places');

// Ensure the target directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Read API Key from .env
const envContent = fs.readFileSync(path.join(PROJECT_DIR, '.env'), 'utf8');
const apiKeyMatch = envContent.match(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(.*)/);
if (!apiKeyMatch) {
  console.error('API key not found in .env');
  process.exit(1);
}
const API_KEY = apiKeyMatch[1].trim();

// Get listings from database without photos
const query = `SELECT id, name, latitude, longitude FROM listings WHERE photoUrls IS NULL OR photoUrls = '' OR photoUrls = '[]' OR json_array_length(photoUrls) = 0;`;
const result = execSync(`sqlite3 "${DB_PATH}" "${query}"`, { encoding: 'utf8' });

const lines = result.trim().split('\n').filter(Boolean);
console.log(`Found ${lines.length} listings to process.`);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  let downloadedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const [id, name, lat, lng] = lines[i].split('|');
    if (!id || !name) continue;

    console.log(`\n[${i + 1}/${lines.length}] Searching for authentic photo: ${name}...`);

    try {
      // 1. Search for the place using Places API (New)
      const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
      const searchBody = {
        textQuery: name,
        locationBias: {
          circle: {
            center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
            radius: 5000.0 // Bias within 5km of the exact coordinates
          }
        }
      };

      const searchRes = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.photos'
        },
        body: JSON.stringify(searchBody)
      });

      if (!searchRes.ok) {
        console.error(`  -> API Error: ${searchRes.status} ${searchRes.statusText}`);
        const errorData = await searchRes.text();
        console.error(`  -> Details:`, errorData);
        skippedCount++;
        await delay(500);
        continue;
      }

      const searchData = await searchRes.json();
      const place = searchData.places && searchData.places[0];

      if (place && place.photos && place.photos.length > 0) {
        console.log(`  -> Found authentic photo! Downloading high-res version...`);
        
        // 2. Get the highest quality photo reference
        // We take the first photo which is usually the most popular/representative
        const photoName = place.photos[0].name; 
        
        // Request a large enough size so we can crop to exactly 1200x800
        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=1600&maxWidthPx=1600&key=${API_KEY}`;
        const imgRes = await fetch(photoUrl);
        
        if (!imgRes.ok) {
          throw new Error(`Failed to download photo: HTTP ${imgRes.status}`);
        }
        
        const arrayBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // 3. Process with Sharp: Convert to WebP, resize/crop to 1200x800
        const imgPath = path.join(PUBLIC_DIR, `${id}.webp`);
        await sharp(buffer)
          .resize(1200, 800, {
            fit: 'cover', // Ensures the image completely covers 1200x800 (crops edges if necessary)
            position: 'entropy' // Tries to focus the crop on the most interesting part of the image
          })
          .webp({ quality: 85 }) // High quality WebP
          .toFile(imgPath);

        // 4. Update database
        const updateQuery = `UPDATE listings SET photoUrls = '[\\"/places/${id}.webp\\"]' WHERE id = '${id}';`;
        execSync(`sqlite3 "${DB_PATH}" "${updateQuery}"`);
        
        downloadedCount++;
        console.log(`  -> ✅ Saved WebP (1200x800) to public/places/${id}.webp and updated database.`);
      } else {
        console.log(`  -> ⚠️ No authentic high-quality photos found for this location. Skipping.`);
        skippedCount++;
      }
    } catch (err) {
      console.error(`  -> ❌ Error processing ${name}:`, err.message);
      skippedCount++;
    }

    // Delay to respect API rate limits
    await delay(300);
  }

  console.log(`\n🎉 Finished! Downloaded WebP Photos: ${downloadedCount}, Skipped: ${skippedCount}`);
}

main();
