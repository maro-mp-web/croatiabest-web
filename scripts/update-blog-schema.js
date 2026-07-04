const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function updateSchema() {
  try {
    await pb.admins.authWithPassword('maro.webdeveloper@gmail.com', 'Admin12345!');
  } catch(e) {
    try {
      await pb.collection('_superusers').authWithPassword('maro.webdeveloper@gmail.com', 'Admin12345!');
    } catch(err) {
      console.log('Auth failed', err);
      return;
    }
  }

  try {
    const collection = await pb.collections.getOne('blogs');
    
    // Add boolean fields
    collection.schema.push({
      name: 'seoIndex',
      type: 'bool',
      required: false,
    });
    collection.schema.push({
      name: 'seoFollow',
      type: 'bool',
      required: false,
    });

    await pb.collections.update('blogs', collection);
    console.log('Blogs schema updated with seoIndex and seoFollow');
  } catch (err) {
    console.error(err);
  }
}

updateSchema();
