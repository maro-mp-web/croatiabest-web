// Script za kreiranje PocketBase kolekcija koristeći REST API
// Pokreni: node scripts/create-collections.mjs

const PB_URL = 'http://127.0.0.1:8090';

async function main() {
  // Prvo se autenticiraj kao superuser
  // Pošto ne znamo lozinku, koristimo token iz baze
  // Alternativno: kreiramo kolekcije direktno kroz API bez autha ako su rules open
  
  console.log('Provjera postojećih kolekcija...');
  
  const collectionsResp = await fetch(`${PB_URL}/api/collections`);
  const collections = await collectionsResp.json();
  
  if (collections.items) {
    const existingNames = collections.items.map(c => c.name);
    console.log('Postojeće kolekcije:', existingNames.join(', '));
    
    if (existingNames.includes('listings') && existingNames.includes('uploads')) {
      console.log('Kolekcije već postoje!');
      return;
    }
  }
  
  // Pokušaj kreirati kolekcije bez autha (ako su public rules)
  // Ako ne uspije, trebat će admin token
  
  console.log('\nPokušavam kreirati kolekcije...');
  
  // Kreiraj uploads kolekciju
  const uploadsBody = {
    name: 'uploads',
    type: 'base',
    schema: [
      {
        name: 'file',
        type: 'file',
        required: true,
        maxSize: 2097152,
        maxSelect: 1,
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      },
      {
        name: 'owner',
        type: 'relation',
        required: false,
        maxSelect: 1,
        collectionId: '_pb_users_auth_'
      }
    ],
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: '',
    deleteRule: '',
    sortRule: '-created'
  };
  
  const uploadsResp = await fetch(`${PB_URL}/api/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(uploadsBody)
  });
  
  const uploadsResult = await uploadsResp.json();
  console.log('Uploads kolekcija:', uploadsResult.name || uploadsResult.message || JSON.stringify(uploadsResult));
  
  // Kreiraj listings kolekciju
  const listingsBody = {
    name: 'listings',
    type: 'base',
    schema: [
      {name:'name', type:'text', required:true, max:200},
      {name:'locationCategoryId', type:'text', required:true},
      {name:'locationCategoryType', type:'text'},
      {name:'paymentStatus', type:'text'},
      {name:'address', type:'text'},
      {name:'city', type:'text', required:true},
      {name:'region', type:'text'},
      {name:'latitude', type:'number'},
      {name:'longitude', type:'number'},
      {name:'description', type:'text'},
      {name:'contactPhone', type:'text'},
      {name:'contactEmail', type:'email'},
      {name:'webAddress', type:'url'},
      {name:'photoUrls', type:'json'},
      {name:'products', type:'json'},
      {name:'status', type:'text'},
      {name:'ownerId', type:'text', required:true}
    ],
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: '',
    deleteRule: '',
    sortRule: '-created'
  };
  
  const listingsResp = await fetch(`${PB_URL}/api/collections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingsBody)
  });
  
  const listingsResult = await listingsResp.json();
  console.log('Listings kolekcija:', listingsResult.name || listingsResult.message || JSON.stringify(listingsResult));
  
  if (uploadsResp.status === 401 || listingsResp.status === 401) {
    console.log('\n⚠️  Potrebna je admin autentikacija!');
    console.log('Kreiraj kolekcije manualno kroz PocketBase Admin UI:');
    console.log('  1. Otvori http://127.0.0.1:8090/_/ u browseru');
    console.log('  2. Logiraj se sa svojim admin emailom i lozinkom');
    console.log('  3. Idi na "Collections" i kreiraj:');
    console.log('     - "uploads" (base) s file poljem');
    console.log('     - "listings" (base) sa svim poljima');
  }
}

main().catch(console.error);
