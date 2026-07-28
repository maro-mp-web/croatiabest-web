import PocketBase from 'pocketbase';
const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);
async function run() {
  try {
    const records = await pb.collection('listings').getList(1, 1, { filter: 'name="Vodomar pristanište"' });
    const record = records.items[0];
    const newPhotoUrls = ["/api/files/media/test/test.webp"];
    await pb.collection('listings').update(record.id, { photoUrls: newPhotoUrls });
    console.log("Success!");
  } catch (e) {
    console.log("Error details:", JSON.stringify(e.response, null, 2));
  }
}
run();
