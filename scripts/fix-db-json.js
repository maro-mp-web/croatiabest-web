const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DB_PATH = path.join(__dirname, '..', 'pb_data', 'data.db');
const PUBLIC_DIR = path.join(__dirname, '..', 'public', 'places');

const files = fs.readdirSync(PUBLIC_DIR);
let count = 0;

for (const file of files) {
  if (file.endsWith('.webp') || file.endsWith('.png') || file.endsWith('.jpg')) {
    const id = path.basename(file, path.extname(file));
    // Correctly escape double quotes so bash doesn't strip them
    const updateQuery = `UPDATE listings SET photoUrls = '[\\"/places/${file}\\"]' WHERE id = '${id}';`;
    try {
      execSync(`sqlite3 "${DB_PATH}" "${updateQuery}"`);
      count++;
    } catch (err) {
      console.error(`Failed to update ${id}:`, err.message);
    }
  }
}
console.log(`Successfully fixed ${count} photos in the database!`);
