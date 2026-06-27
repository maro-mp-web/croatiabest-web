import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const parkImages = {
  plitvice: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
  krka: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  mljet: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80'
};

async function downloadAndProcess() {
  const dir = path.join(process.cwd(), 'public', 'parks');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [name, url] of Object.entries(parkImages)) {
    console.log(`Downloading park image ${name}...`);
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const outPath = path.join(dir, `${name}.webp`);
      console.log(`Processing & resizing ${name} to webp...`);
      await sharp(buffer)
        .resize(1000, 700)
        .toFormat('webp', { quality: 85 })
        .toFile(outPath);
      
      console.log(`Saved to ${outPath}`);
    } catch (err) {
      console.error(`Error processing ${name}:`, err);
    }
  }

  // Insert/Update SQLite Database
  try {
    const dbPath = path.join(process.cwd(), 'pb_data', 'data.db');
    console.log('Inserting national parks into SQLite listings...');

    const parks = [
      {
        id: 'parkplitvice123',
        name: 'Nacionalni park Plitvička jezera',
        nameEn: 'Plitvice Lakes National Park',
        description: 'Plitvička jezera najstariji su i najveći nacionalni park Republike Hrvatske. Park je poznat po veličanstvenim sedrenim slapovima i šesnaest međusobno povezanih jezera pod zaštitom UNESCO-a.',
        descriptionEn: 'Plitvice Lakes is the oldest and largest national park in Croatia. Famous for its magnificent tufa waterfalls and sixteen interconnected lakes under UNESCO protection.',
        address: 'Josipa Jovića 19, Plitvička Jezera',
        city: 'Plitvička Jezera',
        latitude: 44.8653,
        longitude: 15.5820,
        region: 'Središnja Hrvatska',
        photo: '/parks/plitvice.webp'
      },
      {
        id: 'parkkrkajes234',
        name: 'Nacionalni park Krka',
        nameEn: 'Krka National Park',
        description: 'Nacionalni park Krka obuhvaća područje uz rijeku Krku koja protječe kroz dubok i slikovit kanjon, oblikujući veličanstvene slapove poput Skradinskog buka i Roškog slapa.',
        descriptionEn: 'Krka National Park covers the area along the Krka River, flowing through a deep and picturesque canyon, forming magnificent waterfalls such as Skradinski buk and Roski slap.',
        address: 'Trg Ivana Pavla II br. 5, Šibenik',
        city: 'Šibenik',
        latitude: 43.8049,
        longitude: 15.9644,
        region: 'Dalmacija',
        photo: '/parks/krka.webp'
      },
      {
        id: 'parkmljetnat345',
        name: 'Nacionalni park Mljet',
        nameEn: 'Mljet National Park',
        description: 'Nacionalni park Mljet obuhvaća sjeverozapadni dio otoka Mljeta, poznat po dva duboka zaljeva ispunjena morem (Veliko i Malo jezero) te slikovitom otočiću Svete Marije.',
        descriptionEn: 'Mljet National Park covers the northwestern part of Mljet island, famous for its two deep seawater bays (Great and Small Lake) and the picturesque islet of Saint Mary.',
        address: 'Pristanište 2, Goveđari',
        city: 'Mljet',
        latitude: 42.7686,
        longitude: 17.3621,
        region: 'Dalmacija',
        photo: '/parks/mljet.webp'
      }
    ];

    const tempSqlFile = path.join(process.cwd(), 'temp_query.sql');

    for (const p of parks) {
      // Check if already exists using temp query file
      fs.writeFileSync(tempSqlFile, `SELECT count(*) FROM listings WHERE id = '${p.id}';`);
      const count = parseInt(execSync(`sqlite3 ${dbPath} < ${tempSqlFile}`).toString().trim());

      const photoUrlsJson = JSON.stringify([p.photo]);
      const metadataJson = JSON.stringify({ nameEn: p.nameEn, descriptionEn: p.descriptionEn });
      const nowStr = new Date().toISOString();

      if (count > 0) {
        console.log(`Updating ${p.name}...`);
        const updateSql = `
          UPDATE listings 
          SET name = '${p.name.replace(/'/g, "''")}', 
              description = '${p.description.replace(/'/g, "''")}', 
              address = '${p.address.replace(/'/g, "''")}', 
              city = '${p.city.replace(/'/g, "''")}', 
              latitude = ${p.latitude}, 
              longitude = ${p.longitude}, 
              region = '${p.region.replace(/'/g, "''")}', 
              photoUrls = '${photoUrlsJson.replace(/'/g, "''")}', 
              metadata = '${metadataJson.replace(/'/g, "''")}', 
              updated = '${nowStr}'
          WHERE id = '${p.id}';
        `;
        fs.writeFileSync(tempSqlFile, updateSql);
        execSync(`sqlite3 ${dbPath} < ${tempSqlFile}`);
      } else {
        console.log(`Inserting ${p.name}...`);
        const insertSql = `
          INSERT INTO listings (
            id, name, description, address, city, latitude, longitude, 
            locationCategoryId, locationCategoryType, region, status, 
            photoUrls, paymentStatus, metadata, created, updated, contactEmail, contactPhone, webAddress, ownerId
          ) VALUES (
            '${p.id}', 
            '${p.name.replace(/'/g, "''")}', 
            '${p.description.replace(/'/g, "''")}', 
            '${p.address.replace(/'/g, "''")}', 
            '${p.city.replace(/'/g, "''")}', 
            ${p.latitude}, 
            ${p.longitude}, 
            'national_parks', 
            'free', 
            '${p.region.replace(/'/g, "''")}', 
            'active', 
            '${photoUrlsJson.replace(/'/g, "''")}', 
            'paid', 
            '${metadataJson.replace(/'/g, "''")}', 
            '${nowStr}', 
            '${nowStr}',
            'info@croatiabest.hr',
            '+385 1 2345 678',
            'https://www.croatiabest.hr',
            'admin'
          );
        `;
        fs.writeFileSync(tempSqlFile, insertSql);
        execSync(`sqlite3 ${dbPath} < ${tempSqlFile}`);
      }
    }
    
    if (fs.existsSync(tempSqlFile)) {
      fs.unlinkSync(tempSqlFile);
    }
    console.log('National parks successfully integrated into SQLite!');
  } catch (err) {
    console.error('SQLite integration error:', err);
  }
}

downloadAndProcess();
