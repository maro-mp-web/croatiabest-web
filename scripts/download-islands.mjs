import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const islandImages = {
  korcula: 'https://images.unsplash.com/photo-1605538032432-a9f0c8d9baac?auto=format&fit=crop&w=1200&q=80',
  hvar: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
  krk: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  cres: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  mljet: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
};

async function downloadAndProcess() {
  const dir = path.join(process.cwd(), 'public', 'islands');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [slug, url] of Object.entries(islandImages)) {
    console.log(`Downloading island ${slug}...`);
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
    console.log('Updating SQLite database directly for islands...');
    
    for (const slug of Object.keys(islandImages)) {
      const sql = `UPDATE islands SET image = '/islands/${slug}.webp' WHERE slug = '${slug}';`;
      execSync(`sqlite3 ${dbPath} "${sql}"`);
      console.log(`Database updated for island: ${slug}`);
    }
    
    console.log('Database updates complete for islands!');
  } catch (err) {
    console.error('Database update error:', err);
  }
}

downloadAndProcess();
