import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const cityImages = {
  zagreb: 'https://images.unsplash.com/photo-1615818499660-30bb587f0195?auto=format&fit=crop&w=1200&q=80', // Zagreb cathedral
  dubrovnik: 'https://images.unsplash.com/photo-1555992336-03a23c7b20eb?auto=format&fit=crop&w=1200&q=80', // Dubrovnik old town
  split: 'https://images.unsplash.com/photo-1586083702768-190ae093d34d?auto=format&fit=crop&w=1200&q=80', // Split riva
  rovinj: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1200&q=80', // Rovinj harbor
  varazdin: 'https://images.unsplash.com/photo-1647414967399-5282054fb1d2?auto=format&fit=crop&w=1200&q=80' // Varazdin castle area
};

async function downloadAndProcess() {
  const dir = path.join(process.cwd(), 'public', 'cities');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [slug, url] of Object.entries(cityImages)) {
    console.log(`Downloading ${slug}...`);
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const outPath = path.join(dir, `${slug}.webp`);
      console.log(`Processing & resizing ${slug} to webp...`);
      await sharp(buffer)
        .resize(1000, 700)
        .toFormat('webp', { quality: 85 })
        .toFile(outPath);
      
      console.log(`Saved to ${outPath}`);
    } catch (err) {
      console.error(`Error processing ${slug}:`, err);
    }
  }

  // Update SQLite Database directly
  try {
    const dbPath = path.join(process.cwd(), 'pb_data', 'data.db');
    console.log('Updating SQLite database directly...');
    
    for (const slug of Object.keys(cityImages)) {
      const sql = `UPDATE cities SET image = '/cities/${slug}.webp' WHERE slug = '${slug}';`;
      execSync(`sqlite3 ${dbPath} "${sql}"`);
      console.log(`Database updated for: ${slug}`);
    }
    
    console.log('Database updates complete!');
  } catch (err) {
    console.error('Database update error:', err);
  }
}

downloadAndProcess();
