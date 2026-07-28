import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const ADMIN_ID = "kobf4jbivuv31l2"; // Superuser ID to satisfy validation rules

async function processCollection(collectionName, imageFieldIsArray) {
  console.log(`\n=== Procesiram kolekciju: ${collectionName} ===`);
  const records = await pb.collection(collectionName).getFullList({ requestKey: null });
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    let needsUpdate = false;
    let newImages = [];
    
    // Dohvati stara polja ovisno jel niz (listings.photoUrls) ili string (cities.image)
    const currentImages = imageFieldIsArray ? (record.photoUrls || []) : (record.image ? [record.image] : []);
    
    for (const imgUrl of currentImages) {
      if (!imgUrl || typeof imgUrl !== 'string') continue;

      // Preskoči Google slike (one su mrtve i rješavaju se na frontendu, ne bacamo vrijeme)
      if (imgUrl.includes('maps.googleapis.com')) {
        newImages.push(imgUrl); 
        continue;
      }
      
      // Već je na serveru u media kolekciji
      if (imgUrl.includes('/api/files/media/')) {
        newImages.push(imgUrl);
        continue;
      }

      // Ako je lokalna putanja (npr. /places/nesto.webp, /cities/zagreb.webp)
      if (imgUrl.startsWith('/')) {
        const localPath = path.join(PUBLIC_DIR, imgUrl);
        if (fs.existsSync(localPath)) {
          console.log(`[${collectionName}] [${i+1}/${records.length}] ${record.name || record.slug}: Pronađena lokalna slika ${imgUrl}, prebacujem...`);
          try {
            const formData = new FormData();
            const buffer = fs.readFileSync(localPath);
            const blob = new Blob([buffer], { type: 'image/webp' });
            formData.append('file', blob, path.basename(localPath));
            
            const mediaRecord = await pb.collection('media').create(formData, { requestKey: null });
            const newUrl = `/api/files/media/${mediaRecord.id}/${mediaRecord.file}`;
            newImages.push(newUrl);
            needsUpdate = true;
          } catch (e) {
            console.error(`Greška kod uploada slike ${imgUrl}:`, e.message);
            newImages.push(imgUrl); // Ostavi staru da ne izgubimo referencu
          }
        } else {
          // Lokalna slika ne postoji, ostavi staru
          newImages.push(imgUrl);
        }
      } else {
        // Neki vanjski URL (npr. Unsplash), ostavi kako je
        newImages.push(imgUrl);
      }
    }

    if (needsUpdate) {
      try {
        const updatePayload = imageFieldIsArray ? { photoUrls: newImages } : { image: newImages[0] || '' };
        
        // KRITIČNO ZAKRPA: Dodaj ownerId kako bi prošli kroz validaciju!
        if (collectionName === 'listings' && !record.ownerId) {
          updatePayload.ownerId = ADMIN_ID;
        }

        await pb.collection(collectionName).update(record.id, updatePayload, { requestKey: null });
        console.log(` ✅ Ažuriran zapis u bazi: ${record.name || record.slug}`);
        successCount++;
      } catch (e) {
        console.error(` ❌ Greška kod ažuriranja zapisa ${record.name || record.slug}:`, e.message);
        errorCount++;
      }
    } else {
      skipCount++;
    }
  }

  console.log(`\nRezultat za ${collectionName}: ✅ Ažurirano: ${successCount} | ⏭️ Preskočeno: ${skipCount} | ❌ Greške: ${errorCount}`);
}

async function run() {
  try {
    await processCollection('listings', true); // listings.photoUrls je array
    await processCollection('cities', false);  // cities.image je string
    await processCollection('islands', false); // islands.image je string
    console.log("\nSVE GOTOVO!");
  } catch (e) {
    console.error("Glavna greška:", e);
  }
}

run();
