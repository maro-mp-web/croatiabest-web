const pbUrl = 'http://127.0.0.1:8090/api/collections/listings/records?perPage=1';

async function check() {
  try {
    const res = await fetch(pbUrl);
    const data = await res.json();
    console.log(`Total listings in DB: ${data.totalItems}`);
  } catch(e) {
    console.error(e);
  }
}
check();
