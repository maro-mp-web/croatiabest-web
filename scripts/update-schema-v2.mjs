import PocketBase from 'pocketbase';
const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);

async function run() {
  // 1. Update homepage_sections: add titleEn, contentEn, items
  try {
    const col = await pb.collections.getOne('homepage_sections');
    const existingFieldNames = col.fields.map(f => f.name);
    const newFields = [...col.fields];
    if (!existingFieldNames.includes('titleEn')) {
      newFields.push({ name: 'titleEn', type: 'text', required: false, max: 255 });
    }
    if (!existingFieldNames.includes('contentEn')) {
      newFields.push({ name: 'contentEn', type: 'editor', required: false });
    }
    if (!existingFieldNames.includes('items')) {
      newFields.push({ name: 'items', type: 'json', required: false, maxSize: 50000 });
    }
    await pb.collections.update(col.id, { fields: newFields });
    console.log('homepage_sections schema updated');
  } catch(e) {
    console.error('Error updating homepage_sections:', e.response || e.message);
  }

  // 2. Create homepage_seo collection
  let seoExists = false;
  try {
    await pb.collections.getOne('homepage_seo');
    seoExists = true;
    console.log('homepage_seo already exists');
  } catch(e) {}
  if (!seoExists) {
    try {
      await pb.collections.create({
        name: 'homepage_seo',
        type: 'base',
        listRule: "",
        viewRule: "",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'id', type: 'text', primaryKey: true, required: true, system: true, autogeneratePattern: '[a-z0-9]{15}' },
          { name: 'seoTitle', type: 'text', required: false, max: 255 },
          { name: 'seoTitleEn', type: 'text', required: false, max: 255 },
          { name: 'seoDescription', type: 'text', required: false, max: 500 },
          { name: 'seoDescriptionEn', type: 'text', required: false, max: 500 },
          { name: 'seoKeywords', type: 'text', required: false, max: 500 },
          { name: 'seoKeywordsEn', type: 'text', required: false, max: 500 },
        ]
      });
      await pb.collection('homepage_seo').create({
        seoTitle: 'CroatiaBest - Najbolji vodič kroz Hrvatsku',
        seoTitleEn: 'CroatiaBest - Best Guide to Croatia',
        seoDescription: 'Otkrijte najljepše gradove, otoke, plaže, restorane i kulturne znamenitosti Hrvatske.',
        seoDescriptionEn: 'Discover the most beautiful cities, islands, beaches, restaurants and cultural landmarks of Croatia.',
        seoKeywords: 'Hrvatska, turizam, gradovi, otoci, plaže, restorani',
        seoKeywordsEn: 'Croatia, tourism, cities, islands, beaches, restaurants',
      });
      console.log('homepage_seo collection created and seeded');
    } catch(err) {
      console.error('Error creating homepage_seo:', err.response || err.message);
    }
  }

  // 3. Update existing sections with default items and EN translations
  try {
    const sections = await pb.collection('homepage_sections').getFullList();
    for (const sec of sections) {
      const updates = {};
      if (sec.type === 'cities' && (!sec.items || (Array.isArray(sec.items) && sec.items.length === 0) || sec.items === '[]')) {
        updates.titleEn = 'Explore Cities';
        updates.contentEn = '<p>Croatian cities captivate with rich history, charming streets and Mediterranean atmosphere.</p>';
        updates.items = JSON.stringify([
          { slug: 'zagreb', image: '', description: '', descriptionEn: '' },
          { slug: 'dubrovnik', image: '', description: '', descriptionEn: '' },
          { slug: 'split', image: '', description: '', descriptionEn: '' },
          { slug: 'rovinj', image: '', description: '', descriptionEn: '' },
          { slug: 'varazdin', image: '', description: '', descriptionEn: '' },
        ]);
      }
      if (sec.type === 'islands' && (!sec.items || (Array.isArray(sec.items) && sec.items.length === 0) || sec.items === '[]')) {
        updates.titleEn = 'Explore Islands';
        updates.contentEn = '<p>Discover hidden coves, untouched nature and authentic lifestyle on Croatian islands.</p>';
        updates.items = JSON.stringify([
          { slug: 'korcula', image: '', description: '', descriptionEn: '' },
          { slug: 'hvar', image: '', description: '', descriptionEn: '' },
          { slug: 'krk', image: '', description: '', descriptionEn: '' },
          { slug: 'cres', image: '', description: '', descriptionEn: '' },
          { slug: 'mljet', image: '', description: '', descriptionEn: '' },
        ]);
      }
      if (sec.type === 'popular_listings' && !sec.titleEn) {
        updates.titleEn = 'Most Popular Locations';
        updates.contentEn = '<p>Restaurants, hotels, beaches and wineries you must visit.</p>';
      }
      if (sec.type === 'public_listings' && !sec.titleEn) {
        updates.titleEn = 'Culture & Landmarks';
        updates.contentEn = '<p>Museums, viewpoints and cultural heritage.</p>';
      }
      if (sec.type === 'premium' && !sec.titleEn) {
        updates.titleEn = 'Premium Locations';
        updates.contentEn = '<p>Exclusive offers and top accommodation.</p>';
      }
      if (Object.keys(updates).length > 0) {
        await pb.collection('homepage_sections').update(sec.id, updates);
        console.log('Updated section:', sec.title);
      }
    }
    console.log('All sections updated');
  } catch(e) {
    console.error('Error updating sections:', e.response || e.message);
  }
  console.log('DONE');
}
run();
