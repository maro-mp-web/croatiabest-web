import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const collectionSchemaBlogs = {
  name: 'blogs',
  type: 'base',
  system: false,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'titleEn', type: 'text' },
    { name: 'slug', type: 'text', required: true },
    { name: 'category', type: 'text' },
    { name: 'image', type: 'text' },
    { name: 'excerpt', type: 'text' },
    { name: 'excerptEn', type: 'text' },
    { name: 'content', type: 'text' },
    { name: 'contentEn', type: 'text' },
    { name: 'seoKeywords', type: 'text' },
    { name: 'seoKeywordsEn', type: 'text' },
    { name: 'seoTitle', type: 'text' },
    { name: 'seoTitleEn', type: 'text' },
    { name: 'seoDescription', type: 'text' },
    { name: 'seoDescriptionEn', type: 'text' },
    { name: 'seoIndex', type: 'bool' },
    { name: 'seoFollow', type: 'bool' },
    { name: 'author', type: 'text' },
    { name: 'readTime', type: 'text' }
  ],
  listRule: '',
  viewRule: '',
  createRule: '@request.auth.id != ""',
  updateRule: '@request.auth.id != ""',
  deleteRule: '@request.auth.id != ""',
};

async function run() {
  try {
    // Try to authenticate with the known admin password from fix-collections.mjs
    await pb.admins.authWithPassword('admin@croatiabest.hr', 'admin123456');
    console.log('Admin authenticated.');
  } catch (err) {
    try {
      await pb.admins.authWithPassword('maro.webdeveloper@gmail.com', 'Admin12345!');
      console.log('Admin authenticated with second credentials.');
    } catch (e) {
      console.error('Authentication failed. Check admin credentials.', e.message);
      return;
    }
  }

  // Delete existing if it exists
  try {
    const existing = await pb.collections.getFirstListItem('name="blogs"');
    if (existing) {
      await pb.collections.delete(existing.id);
      console.log('Deleted existing blogs collection.');
    }
  } catch (e) {
    console.log('No existing blogs collection to delete or error deleting.', e.message);
  }

  // Create new blogs collection
  try {
    await pb.collections.create(collectionSchemaBlogs);
    console.log('Recreated blogs collection with full schema (including English translation fields).');
  } catch (e) {
    console.error('Error creating blogs collection:', e.message);
  }
}

run();
