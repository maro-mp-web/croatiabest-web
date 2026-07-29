import PocketBase from 'pocketbase';
const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);
async function run() {
  try {
    const c = await pb.collections.create({
      name: 'test_creation',
      type: 'base',
      schema: [{ name: 'title', type: 'text' }]
    });
    console.log("Success creating collection:", c.id);
    await pb.collections.delete(c.id);
  } catch(e) {
    console.log("Error:", e.message);
  }
}
run();
