import PocketBase from 'pocketbase';
const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);
async function run() {
  try {
    const col = await pb.collections.getOne('homepage_sections');
    console.log("Current rules:", { list: col.listRule, view: col.viewRule, create: col.createRule, update: col.updateRule, delete: col.deleteRule });
    
    // Update rules so anyone can read, but only auth users can edit
    await pb.collections.update('homepage_sections', {
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''"
    });
    console.log("Rules updated successfully!");

    const items = await pb.collection('homepage_sections').getList(1, 50);
    console.log("Total items in DB:", items.totalItems);
  } catch(e) {
    console.error(e.message);
  }
}
run();
