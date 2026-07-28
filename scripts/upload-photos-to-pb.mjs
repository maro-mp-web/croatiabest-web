import fs from 'fs';
import path from 'path';
import readline from 'readline';
import PocketBase from 'pocketbase';

const PROJECT_DIR = process.cwd();
const PB_URL = 'https://app.croatiabest.com.hr';
const pb = new PocketBase(PB_URL);

// Prevent auto cancellation
pb.autoCancellation(false);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
  console.log(`\n==============================================`);
  console.log(`📸 CROATIA BEST - IMAGE UPLOAD SCRIPT (POCKETBASE)`);
  console.log(`==============================================\n`);
  
  console.log(`Povezujem se na produkcijsku bazu: ${PB_URL}`);
  console.log(`\nBudući da si zaboravio lozinku, ali si ulogiran u Chrome-u, možemo iskoristiti tvoj Token iz preglednika!`);
  
  const token = await question('\nZalijepi ovdje svoj Auth Token (ili ostavi prazno za prekid): ');
  
  rl.close();

  if (!token || token.trim() === '') {
      console.log('Prekidam rad.');
      process.exit(1);
  }

  try {
    console.log(`\nAutentifikacija putem tokena...`);
    // Očisti token ako je slučajno korisnik zalijepio cijeli JSON
    let cleanToken = token.trim();
    if (cleanToken.startsWith('{')) {
        try {
            const parsed = JSON.parse(cleanToken);
            cleanToken = parsed.token || cleanToken;
        } catch(e) {}
    }
    
    pb.authStore.save(cleanToken, null);
    
    // Testiraj token
    await pb.collection('listings').getList(1, 1);
    console.log(`✅ Uspješno prijavljen pomoću tokena!`);
  } catch (error) {
    console.error(`❌ Greška pri prijavi: Token je vjerojatno neispravan ili je istekao.`, error.message);
    process.exit(1);
  }

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    console.log(`\nDohvaćam sve objekte iz baze...`);
    const records = await pb.collection('listings').getFullList({
      sort: '-created',
    });
    
    console.log(`Pronađeno ${records.length} objekata u bazi. Počinjem provjeru slika...`);

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      let hasLocalPhotos = false;
      const formData = new FormData();
      
      // Provjeri photoUrls
      const photoUrls = record.photoUrls || [];
      const photosToProcess = Array.isArray(photoUrls) ? photoUrls : (typeof photoUrls === 'string' ? JSON.parse(photoUrls) : []);
      
      for (const photoUrl of photosToProcess) {
        if (typeof photoUrl === 'string' && photoUrl.startsWith('/places/')) {
          // Napravi apsolutni put do lokalne slike
          const localPath = path.join(PROJECT_DIR, 'public', photoUrl);
          
          if (fs.existsSync(localPath)) {
            // Pronađena lokalna slika!
            console.log(`[${i+1}/${records.length}] ${record.name} -> Pronađena slika: ${photoUrl}`);
            const buffer = fs.readFileSync(localPath);
            const filename = path.basename(localPath);
            // Koristimo native File API (Node >= 20)
            const file = new File([buffer], filename, { type: 'image/webp' });
            formData.append('media', file);
            hasLocalPhotos = true;
          } else {
             console.log(`[${i+1}/${records.length}] ${record.name} -> ⚠️ Slika fali lokalno: ${photoUrl}`);
          }
        }
      }

      if (hasLocalPhotos) {
        try {
          await pb.collection('listings').update(record.id, formData);
          successCount++;
          console.log(`   ✅ Upload uspješan u polje 'media'.`);
        } catch (e) {
          console.error(`   ❌ Greška pri uploadu za ${record.name}:`, e.message);
          errorCount++;
        }
      } else {
        skippedCount++;
      }
    }

  } catch (error) {
    console.error(`❌ Dogodila se greška tijekom dohvaćanja:`, error);
  }

  console.log(`\n==============================================`);
  console.log(`GOTOVO!`);
  console.log(`✅ Uspješno uploadano: ${successCount} objekata`);
  console.log(`⏭️ Preskočeno (nema lokalnih slika): ${skippedCount} objekata`);
  console.log(`❌ Grešaka: ${errorCount}`);
  console.log(`==============================================\n`);
}

main();
