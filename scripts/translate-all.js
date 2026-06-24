const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import translation API
let translate;
try {
  translate = require('bing-translate-api').translate;
} catch (e) {
  console.error("Please run: npm install bing-translate-api");
  process.exit(1);
}

const DB_PATH = path.join(__dirname, '..', 'pb_data', 'data.db');

function escapeSql(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "''");
}

async function run() {
  console.log('Fetching untranslated listings...');
  
  let rows = [];
  try {
    const output = execSync(`sqlite3 "${DB_PATH}" "SELECT json_object('id', id, 'name', name, 'description', description) FROM listings WHERE description NOT LIKE '%\\\\n\\\\n%' AND description != '';"`, { encoding: 'utf8' });
    const lines = output.split('\n').filter(l => l.trim().length > 0);
    
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        rows.push(obj);
      } catch(e) {
        // skip invalid json
      }
    }
  } catch (err) {
    console.error('Error reading from DB:', err.message);
    return;
  }
  
  console.log(`Found ${rows.length} listings to translate.`);
  let successCount = 0;
  
  for (const row of rows) {
    try {
      // Small pause to avoid getting blocked by Google Translate API
      await new Promise(res => setTimeout(res, 1000));
      
      console.log(`Translating: ${row.name}...`);
      
      const res = await translate(row.description, null, 'en');
      const englishDesc = res.translation;
      
      if (!englishDesc || englishDesc === row.description) {
        console.warn(`  Warning: Translation might have failed for ${row.name}`);
        continue;
      }
      
      const newDescription = row.description + '\\n\\n' + englishDesc;
      
      const query = `UPDATE listings SET description = '${escapeSql(newDescription)}' WHERE id = '${row.id}';`;
      execSync(`sqlite3 "${DB_PATH}" "${query}"`);
      
      successCount++;
    } catch (err) {
      console.error(`  Failed to translate ${row.name}:`, err.message);
    }
  }
  
  console.log(`\\nDONE! Successfully translated ${successCount} listings.`);
}

run().catch(console.error);
