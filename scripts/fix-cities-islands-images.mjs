import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);
pb.autoCancellation(false);

const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function fixCollection(collectionName) {
  console.log(`\n=== Fixing ${collectionName} ===`);
  const records = await pb.collection(collectionName).getFullList({ requestKey: null });
  let fixed = 0, skipped = 0, errors = 0;

  for (const record of records) {
    const img = record.image;
    if (!img) { skipped++; continue; }
    
    // Already on PocketBase server
    if (img.includes('/api/files/') || img.startsWith('https://app.croatiabest')) {
      console.log(`  ✅ ${record.name || record.slug}: Already on server`);
      skipped++;
      continue;
    }

    // Local path like /cities/zagreb.webp or /islands/hvar.webp
    if (img.startsWith('/')) {
      const localPath = path.join(PUBLIC_DIR, img);
      if (!fs.existsSync(localPath)) {
        console.log(`  ⚠️ ${record.name || record.slug}: Local file not found: ${localPath}`);
        errors++;
        continue;
      }

      try {
        // Upload to media collection
        const formData = new FormData();
        const buffer = fs.readFileSync(localPath);
        const blob = new Blob([buffer], { type: 'image/webp' });
        formData.append('file', blob, path.basename(localPath));
        
        const mediaRecord = await pb.collection('media').create(formData, { requestKey: null });
        const newUrl = `https://app.croatiabest.com.hr/api/files/media/${mediaRecord.id}/${mediaRecord.file}`;
        
        // Update the record's image field with the new PocketBase URL
        await pb.collection(collectionName).update(record.id, { image: newUrl }, { requestKey: null });
        console.log(`  ✅ ${record.name || record.slug}: ${img} → ${newUrl}`);
        fixed++;
      } catch (e) {
        console.error(`  ❌ ${record.name || record.slug}: ${e.message}`);
        errors++;
      }
    } else {
      skipped++;
    }
  }

  console.log(`\n${collectionName} result: Fixed=${fixed}, Skipped=${skipped}, Errors=${errors}`);
}

async function run() {
  await fixCollection('cities');
  await fixCollection('islands');
  console.log("\nDONE!");
}
run();
