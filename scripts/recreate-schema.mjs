import PocketBase from 'pocketbase';
const pb = new PocketBase('https://app.croatiabest.com.hr');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc4NjM4NTkzMSwiaWQiOiJrb2JmNGpiaXZ1djMxbDIiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.wMf7msZqb0ChlzWNduMwSHQ1wtq2Px79zy0188kFYxk';
pb.authStore.save(token, null);
async function run() {
  try {
    const col = await pb.collections.getOne('homepage_sections');
    await pb.collections.delete(col.id);
    console.log("Deleted old collection.");
  } catch(e) {}

  try {
    await pb.collections.create({
      name: 'homepage_sections',
      type: 'base',
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'id', type: 'text', primaryKey: true, required: true, system: true, autogeneratePattern: '[a-z0-9]{15}' },
        { name: 'title', type: 'text', required: true, max: 255 },
        { name: 'type', type: 'select', required: true, maxSelect: 1, values: ['custom', 'cities', 'islands', 'premium', 'popular_listings', 'public_listings', 'monuments', 'history_articles', 'war_articles'] },
        { name: 'content', type: 'editor', required: false },
        { name: 'image', type: 'text', required: false },
        { name: 'order', type: 'number', required: true },
        { name: 'isActive', type: 'bool', required: false }
      ]
    });
    console.log("Collection recreated with correct fields.");

    const defaultSections = [
        {
          title: "Istražite gradove",
          type: "cities",
          content: "<p>Hrvatski gradovi oduševljavaju bogatom poviješću, šarmantnim ulicama i mediteranskim ugođajem.</p>",
          order: 1,
          isActive: true
        },
        {
          title: "Istražite otoke",
          type: "islands",
          content: "<p>Otkrijte skrivene uvale, netaknutu prirodu i autentičan način života na hrvatskim otocima.</p>",
          order: 2,
          isActive: true
        },
        {
          title: "Najpopularnije lokacije",
          type: "popular_listings",
          content: "<p>Restorani, hoteli, plaže i vinarije koje morate posjetiti.</p>",
          order: 3,
          isActive: true
        },
        {
          title: "Kultura i Znamenitosti",
          type: "public_listings",
          content: "<p>Muzeji, vidikovci i kulturna baština.</p>",
          order: 4,
          isActive: true
        },
        {
          title: "Premium Lokacije",
          type: "premium",
          content: "<p>Ekskluzivna ponuda i vrhunski smještaj.</p>",
          order: 5,
          isActive: true
        }
      ];

      for (const section of defaultSections) {
        await pb.collection('homepage_sections').create(section);
      }
      console.log("Seeded initial sections correctly.");

  } catch(e) {
    console.error("Error creating collection:", e.response || e.message);
  }
}
run();
