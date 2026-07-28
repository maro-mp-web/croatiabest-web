import PocketBase from 'pocketbase';
const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);
async function run() {
  console.log("=== FEATURED CITIES ===");
  for (const slug of ['zagreb','dubrovnik','split','rovinj','varazdin']) {
    try {
      const r = await pb.collection('cities').getFirstListItem(`slug="${slug}"`, {requestKey:null});
      console.log(`${slug}: image="${r.image}" | collectionId=${r.collectionId} | id=${r.id}`);
    } catch(e) { console.log(`${slug}: NOT FOUND`); }
  }
  console.log("\n=== FEATURED ISLANDS ===");
  for (const slug of ['korcula','hvar','krk','cres','mljet']) {
    try {
      const r = await pb.collection('islands').getFirstListItem(`slug="${slug}"`, {requestKey:null});
      console.log(`${slug}: image="${r.image}" | collectionId=${r.collectionId} | id=${r.id}`);
    } catch(e) { console.log(`${slug}: NOT FOUND`); }
  }
  console.log("\n=== POPULAR LISTINGS (first 3) ===");
  const listings = await pb.collection('listings').getList(1, 5, {
    filter: 'status = "active" && (locationCategoryId = "restaurants" || locationCategoryId = "hotels" || locationCategoryId = "beaches" || locationCategoryId = "wineries")',
    sort: '-created', requestKey: null
  });
  listings.items.forEach(l => console.log(`${l.name}: photoUrls=${JSON.stringify(l.photoUrls?.slice(0,1))}`));
}
run();
