const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function check() {
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
    const collections = await pb.collections.getFullList();
    console.log(collections.map(c => c.name));
  } catch (err) {
    console.error(err);
  }
}

check();
