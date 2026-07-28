import PocketBase from 'pocketbase';
const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);
async function run() {
  try {
    const listings = await pb.collection('listings').getList(1, 3);
    console.log("=== LISTINGS ===");
    listings.items.forEach(i => console.log(i.name, i.photoUrls));

    const cities = await pb.collection('cities').getList(1, 3);
    console.log("=== CITIES ===");
    cities.items.forEach(i => console.log(i.name, i.image));

    const islands = await pb.collection('islands').getList(1, 3);
    console.log("=== ISLANDS ===");
    islands.items.forEach(i => console.log(i.name, i.image));
  } catch (e) {
    console.log("Error:", e.message);
  }
}
run();
