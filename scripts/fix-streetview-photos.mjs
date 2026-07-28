import PocketBase from 'pocketbase';

const PB_URL = 'https://app.croatiabest.com.hr';
const pb = new PocketBase(PB_URL);

pb.autoCancellation(false);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log(`\n==============================================`);
  console.log(`🌍 POCKETBASE - FIX GOOGLE STREETVIEW PHOTOS`);
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
    
    // Filtriraj samo one koji imaju google maps URL
    const targetRecords = records.filter(record => {
      const urls = Array.isArray(record.photoUrls) ? record.photoUrls : (typeof record.photoUrls === 'string' ? JSON.parse(record.photoUrls) : []);
      return urls.some(url => typeof url === 'string' && url.includes('maps.googleapis.com'));
    });

    console.log(`Pronađeno ${targetRecords.length} objekata sa problematičnim Google URL-ovima. Počinjem obradu...`);

    for (let i = 0; i < targetRecords.length; i++) {
      const record = targetRecords[i];
      const photoUrls = Array.isArray(record.photoUrls) ? record.photoUrls : (typeof record.photoUrls === 'string' ? JSON.parse(record.photoUrls) : []);
      
      let newPhotoUrls = [];
      let updated = false;

      console.log(`\n[${i+1}/${targetRecords.length}] Obrađujem: ${record.name}...`);

      for (const photoUrl of photoUrls) {
        if (typeof photoUrl === 'string' && photoUrl.includes('maps.googleapis.com')) {
          console.log(`   -> Pronađen Google URL, preuzimam sliku...`);
          
          try {
            // Skini sliku s Google-a u memoriju (ArrayBuffer)
            const imgRes = await fetch(photoUrl);
            if (!imgRes.ok) throw new Error(`Google API vratio grešku: ${imgRes.status}`);
            
            const arrayBuffer = await imgRes.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // PocketBase očekuje File objekt
            const filename = `${record.id}_streetview.jpg`;
            const file = new File([buffer], filename, { type: 'image/jpeg' });
            
            const formData = new FormData();
            formData.append('file', file);
            
            // Uploadaj direktno u MEDIA kolekciju
            const mediaRecord = await pb.collection('media').create(formData);
            const pbImageUrl = `/api/files/media/${mediaRecord.id}/${mediaRecord.file}`;
            
            newPhotoUrls.push(pbImageUrl);
            updated = true;
            successCount++;
            console.log(`   ✅ Slika preuzeta s Googlea i trajno spremljena u media kolekciju! (Novi URL: ${pbImageUrl})`);
            
            // Pauza od 1 sekunde da ne preopteretimo API
            await delay(1000);
          } catch (e) {
            console.error(`   ❌ Greška pri preuzimanju ili uploadu:`, e.message);
            newPhotoUrls.push(photoUrl); // Zadrži stari ako pukne
            errorCount++;
          }
        } else {
            // Ako je obični URL, samo ga sačuvaj
            newPhotoUrls.push(photoUrl);
        }
      }

      if (updated) {
        try {
          // Ažuriraj listing da koristi isključivo novu sliku iz PocketBasea
          await pb.collection('listings').update(record.id, { photoUrls: newPhotoUrls });
          console.log(`   ✅ Listing '${record.name}' uspješno očišćen od Google linkova.`);
        } catch (e) {
          console.error(`   ❌ Greška pri ažuriranju baze za listing:`, e.message);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Greška:`, error);
  }

  console.log(`\n==============================================`);
  console.log(`GOTOVO! Uspješno skinuto i osigurano ${successCount} slika s Googlea.`);
  console.log(`Greške: ${errorCount}`);
  console.log(`==============================================\n`);
}

main();
