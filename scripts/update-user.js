const PocketBase = require('pocketbase/cjs');
const pb = new PocketBase('http://127.0.0.1:8090');

async function updateUser() {
  try {
    await pb.admins.authWithPassword('maro.webdeveloper@gmail.com', 'Admin12345!');
    // If it's v0.23 it might be pb.collection('_superusers').authWithPassword()
  } catch(e) {
    try {
      await pb.collection('_superusers').authWithPassword('maro.webdeveloper@gmail.com', 'Admin12345!');
    } catch(err) {
      console.log('Auth failed', err);
      return;
    }
  }

  try {
    const users = await pb.collection('users').getFullList({ filter: 'email="maro.webdeveloper@gmail.com"' });
    if(users.length > 0) {
      await pb.collection('users').update(users[0].id, {
        password: 'Admin12345!',
        passwordConfirm: 'Admin12345!'
      });
      console.log('User password updated!');
    } else {
      console.log('User not found in users collection');
    }
  } catch(e) { console.error(e); }
}
updateUser();
