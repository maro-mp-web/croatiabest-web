import PocketBase from 'pocketbase';
const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);
async function run() {
  try {
    const col = await pb.collections.getOne('media');
    console.log("=== MEDIA SCHEMA ===");
    console.log(JSON.stringify(col.schema || col.fields, null, 2));
    const listings = await pb.collections.getOne('listings');
    console.log("=== LISTINGS SCHEMA ===");
    console.log(JSON.stringify(listings.schema || listings.fields, null, 2));
  } catch (e) {
    console.log("Error:", e.message);
  }
}
run();
