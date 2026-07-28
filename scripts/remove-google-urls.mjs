import PocketBase from 'pocketbase';

const PB_URL = 'https://app.croatiabest.com.hr';
const pb = new PocketBase(PB_URL);

pb.autoCancellation(false);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';

async function main() {
  console.log(`\n==============================================`);
  console.log(`🗑️ POCKETBASE - BRISANJE GOOGLE LINKOVA`);
  console.log(`==============================================\n`);
  
  try {
    pb.authStore.save(token, null);
    await pb.collection('listings').getList(1, 1);
  } catch (error) {
    console.error(`❌ Greška pri prijavi:`, error.message);
    process.exit(1);
  }

  let successCount = 0;

  try {
    const records = await pb.collection('listings').getFullList({ sort: '-created' });
    
    const targetRecords = records.filter(record => {
      const urls = Array.isArray(record.photoUrls) ? record.photoUrls : (typeof record.photoUrls === 'string' ? JSON.parse(record.photoUrls) : []);
      return urls.some(url => typeof url === 'string' && url.includes('maps.googleapis.com'));
    });

    console.log(`Pronađeno ${targetRecords.length} objekata s Google linkovima. Brišem ih...`);

    for (let i = 0; i < targetRecords.length; i++) {
      const record = targetRecords[i];
      const photoUrls = Array.isArray(record.photoUrls) ? record.photoUrls : (typeof record.photoUrls === 'string' ? JSON.parse(record.photoUrls) : []);
      
      // Zadrži samo one linkove koji NISU Google Maps
      const newPhotoUrls = photoUrls.filter(url => !(typeof url === 'string' && url.includes('maps.googleapis.com')));

      try {
        await pb.collection('listings').update(record.id, { photoUrls: newPhotoUrls });
        successCount++;
        console.log(`   ✅ Listing '${record.name}' očišćen!`);
      } catch (e) {
        console.error(`   ❌ Greška za '${record.name}':`, e.message);
      }
    }
  } catch (error) {
    console.error(`❌ Greška:`, error);
  }

  console.log(`\n==============================================`);
  console.log(`GOTOVO! Uspješno izbrisano ${successCount} Google linkova.`);
  console.log(`==============================================\n`);
}

main();
