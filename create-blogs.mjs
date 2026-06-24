import PocketBase from 'pocketbase';

async function createBlogsCollection() {
  const pb = new PocketBase('http://127.0.0.1:8090');
  
  try {
    // Authenticate as admin
    await pb.admins.authWithPassword('tmpadmin@croatiabest.hr', 'password123');
    console.log('Admin authenticated.');
  } catch (err) {
    console.error('Failed to auth as admin:', err.message);
    process.exit(1);
  }

  try {
    // Check if it exists
    await pb.collections.getOne('blogs');
    console.log('Collection "blogs" already exists.');
  } catch (err) {
    // Doesn't exist, create it
    console.log('Collection "blogs" not found, creating...');
    const collection = {
      name: 'blogs',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'excerpt', type: 'text', required: false },
        { name: 'content', type: 'editor', required: true },
        { name: 'category', type: 'text', required: false },
        { name: 'seoKeywords', type: 'text', required: false },
        { name: 'image', type: 'url', required: false },
        { name: 'author', type: 'text', required: false },
        { name: 'readTime', type: 'text', required: false }
      ]
    };
    
    await pb.collections.create(collection);
    console.log('Collection "blogs" created successfully.');
  }
}

createBlogsCollection();
