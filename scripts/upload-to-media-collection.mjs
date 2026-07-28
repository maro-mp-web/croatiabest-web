import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';

const PROJECT_DIR = process.cwd();
const PB_URL = 'https://app.croatiabest.com.hr';
const pb = new PocketBase(PB_URL);

pb.autoCancellation(false);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';

async function main() {
  console.log(`\n==============================================`);
  console.log(`📸 POCKETBASE UPLOAD (U MEDIA KOLEKCIJU)`);
  console.log(`==============================================\n`);
  
  try {
    pb.authStore.save(token, null);
    await pb.collection('listings').getList(1, 1);
    console.log(`✅ Prijavljen u bazu!`);
  } catch (error) {
    console.error(`❌ Greška pri prijavi:`, error.message);
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;

  try {
    const records = await pb.collection('listings').getFullList({ sort: '-created' });
    console.log(`Pronađeno ${records.length} objekata. Počinjem upload u MEDIA kolekciju...`);

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const photoUrls = record.photoUrls || [];
      const photosToProcess = Array.isArray(photoUrls) ? photoUrls : (typeof photoUrls === 'string' ? JSON.parse(photoUrls) : []);
      
      let newPhotoUrls = [];
      let updated = false;

      for (const photoUrl of photosToProcess) {
        if (typeof photoUrl === 'string' && photoUrl.startsWith('/places/')) {
          const localPath = path.join(PROJECT_DIR, 'public', photoUrl);
          
          if (fs.existsSync(localPath)) {
            console.log(`[${i+1}/${records.length}] ${record.name} -> Uploadam u MEDIA kolekciju...`);
            const buffer = fs.readFileSync(localPath);
            const filename = path.basename(localPath);
            const file = new File([buffer], filename, { type: 'image/webp' });
            
            const formData = new FormData();
            formData.append('file', file);
            
            try {
              // Upload u odvojenu kolekciju "media" (kako je korisnik napravio)
              const mediaRecord = await pb.collection('media').create(formData);
              
              // Složi direktan URL do te slike
              const pbImageUrl = `/api/files/media/${mediaRecord.id}/${mediaRecord.file}`;
              newPhotoUrls.push(pbImageUrl);
              updated = true;
              successCount++;
              console.log(`   ✅ Slika spremljena u media kolekciju! (ID: ${mediaRecord.id})`);
            } catch (e) {
              console.error(`   ❌ Greška pri uploadu slike u media:`, e.message);
              newPhotoUrls.push(photoUrl); // Zadrži staru putanju ako faila
            }
          } else {
             newPhotoUrls.push(photoUrl);
          }
        } else {
            newPhotoUrls.push(photoUrl);
        }
      }

      if (updated) {
        try {
          // Ažuriraj listing da pokazuje na novi URL iz media kolekcije
          await pb.collection('listings').update(record.id, { photoUrls: newPhotoUrls });
          console.log(`   ✅ Listing '${record.name}' uspješno povezan sa slikom iz media foldera.`);
        } catch (e) {
          console.error(`   ❌ Greška pri spajanju listinga:`, e.message);
          errorCount++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Greška:`, error);
  }

  console.log(`\n==============================================`);
  console.log(`GOTOVO! Uspješno uploadano ${successCount} slika u MEDIA kolekciju.`);
  console.log(`==============================================\n`);
}

main();
