import PocketBase from 'pocketbase';

const DUBROVNIK_ARTICLE_HTML = `
<h1>The Ultimate Guide to Dubrovnik: The Pearl of the Adriatic in Croatia</h1>

<p>Welcome to <strong>Dubrovnik</strong>, the undisputed crown jewel of <strong>Croatia</strong> (locally known as <em>Hrvatska</em>). Situated at the southernmost tip of the Dalmatian coast, Dubrovnik is a city that captures the hearts of millions of travelers each year. With its formidable stone walls, shimmering azure waters of the Adriatic Sea, and a history that reads like an epic novel, this city is a must-visit destination for anyone exploring Europe. Whether you are a history buff, a Game of Thrones fan, or a beach lover, Dubrovnik offers an unparalleled Mediterranean experience.</p>

<h2>Why Dubrovnik Should Be Your Next Destination in Croatia</h2>
<p>Often referred to as the "Pearl of the Adriatic," Dubrovnik is a UNESCO World Heritage site that has miraculously preserved its Gothic, Renaissance, and Baroque churches, monasteries, palaces, and fountains. The city's stunning architecture is framed by the dramatic backdrop of Mount Srđ and the endless expanse of the crystal-clear Adriatic Sea. But what truly makes Dubrovnik special is its resilience. Despite the devastating earthquake of 1667 and the armed conflict in the 1990s, the city has risen from the ashes, retaining its historical charm while embracing modern tourism.</p>
<p>When you visit <strong>Hrvatska</strong>, missing Dubrovnik would be like visiting Paris and skipping the Eiffel Tower. The city offers a unique blend of cultural heritage and vibrant modern life, making it a perfect destination for both relaxation and exploration.</p>

<h2>Walking the Ancient City Walls: A Journey Through Time</h2>
<p>No trip to Dubrovnik is complete without walking its magnificent City Walls. Stretching for nearly 2 kilometers (about 1.2 miles) around the Old Town, these walls are among the finest and most complete in Europe. Built between the 12th and 17th centuries, they served as a formidable defense system against foreign invaders.</p>
<ul>
  <li><strong>Minceta Tower:</strong> The highest point of the walls, offering breathtaking panoramic views of the Old Town and the sea.</li>
  <li><strong>Bokar Fortress:</strong> Designed to defend the city's western gate, it is a masterpiece of medieval military architecture.</li>
  <li><strong>Lovrijenac Fortress:</strong> Often called "Dubrovnik's Gibraltar," this fortress stands on a sheer rock just outside the western walls and is famous for its role as the Red Keep in Game of Thrones.</li>
</ul>
<p>As you walk along the walls, the terracotta roofs of the Old Town contrast beautifully with the deep blue of the Adriatic. It is highly recommended to start your walk early in the morning or late in the afternoon to avoid the midday sun and the large crowds.</p>

<h2>The Heart of the City: Stradun and the Old Town</h2>
<p>The main artery of Dubrovnik's Old Town is <strong>Stradun</strong> (officially known as Placa). This limestone-paved pedestrian street is polished to a shine by centuries of footsteps. Stradun divides the Old Town into northern and southern halves and is the perfect place to start your exploration.</p>
<p>At the eastern end of Stradun, you will find the <strong>Orlando Column</strong>, a symbol of the city's freedom, and the majestic <strong>Sponza Palace</strong>, which seamlessly blends Gothic and Renaissance architectural styles. Nearby stands the <strong>Rector's Palace</strong>, once the seat of the government of the independent Republic of Ragusa. Today, it houses the Cultural History Museum, offering a fascinating glimpse into the city's aristocratic past.</p>
<p>Don't miss the <strong>Church of St. Blaise (Sveti Vlaho)</strong>, dedicated to the city's patron saint. The Baroque church is a stunning piece of architecture, and the statue of St. Blaise holding a model of the city before the 1667 earthquake is a significant historical artifact.</p>

<h2>Game of Thrones: Exploring King's Landing</h2>
<p>For fans of the hit HBO series <em>Game of Thrones</em>, Dubrovnik is synonymous with King's Landing, the capital of the Seven Kingdoms. The city's narrow cobblestone streets, towering walls, and historic fortresses provided the perfect setting for some of the show's most iconic scenes.</p>
<p>You can walk the "Walk of Shame" on the Jesuit Stairs leading up to the Church of St. Ignatius, or visit Fort Lovrijenac, the setting for the Red Keep. The island of Lokrum, just a short boat ride away, served as the city of Qarth and even houses an iron throne where you can take pictures. Many local agencies offer specialized Game of Thrones tours that will take you to all the filming locations while sharing behind-the-scenes stories.</p>

<h2>Beaches and Island Hopping in the Dubrovnik Riviera</h2>
<p>While the history of Dubrovnik is captivating, its natural beauty is equally stunning. The Dubrovnik Riviera boasts some of the most beautiful beaches in <strong>Croatia</strong>.</p>
<ul>
  <li><strong>Banje Beach:</strong> Located just outside the Ploče Gate, this is the most popular beach in Dubrovnik. It offers spectacular views of the Old Town and the island of Lokrum. While it can get crowded, the vibrant atmosphere and the nearby beach club make it a must-visit.</li>
  <li><strong>Sveti Jakov Beach:</strong> A bit further away from the city center, this pebble beach is a favorite among locals. It is less crowded than Banje and offers a more relaxed vibe, with stunning sunset views over the Old Town.</li>
  <li><strong>Lokrum Island:</strong> Just a 15-minute ferry ride from the Old Town port, Lokrum is a protected nature reserve. Here you can swim in the "Dead Sea" (a small, high-salinity salt lake), walk among peacocks, and explore the ruins of a Benedictine monastery.</li>
  <li><strong>The Elaphiti Islands:</strong> A small archipelago consisting of several islands, with Koločep, Lopud, and Šipan being the most popular. These islands are perfect for a day trip, offering sandy beaches (especially Sunj beach on Lopud), hidden coves, and a tranquil escape from the bustling city.</li>
</ul>

<h2>Gastronomy: Tasting the Flavors of Dalmatia</h2>
<p>Croatian cuisine, particularly in the Dalmatian region, is a delightful fusion of Mediterranean flavors. In Dubrovnik, seafood is the undisputed star of the menu. Freshly caught fish, octopus, squids, and shellfish are prepared simply, usually grilled with olive oil, garlic, and parsley.</p>
<p>Be sure to try <strong>Crni Rižot</strong> (black risotto), a savory dish made with squid or cuttlefish ink, which gives it its distinctive color and rich flavor. Another local specialty is <strong>Zelena Menestra</strong> (green stew), a traditional dish dating back to the 15th century, made with smoked meat, potatoes, and cabbage.</p>
<p>Pair your meal with a glass of high-quality local wine. The Pelješac peninsula, located just an hour's drive from Dubrovnik, is renowned for its robust red wines, particularly Dingač and Postup. For dessert, treat yourself to <strong>Rožata</strong>, a traditional Dalmatian custard pudding similar to crème caramel, flavored with a local rose liqueur.</p>

<h2>When to Visit and Practical Tips</h2>
<p>The best time to visit Dubrovnik is during the shoulder seasons—May to June and September to October. During these months, the weather is warm and pleasant, the sea is perfect for swimming, and the crowds are significantly smaller than in the peak summer months of July and August.</p>
<p>If you plan to visit many museums and walk the City Walls, consider purchasing the <strong>Dubrovnik Pass</strong>. It offers free entry to the walls, numerous museums, galleries, and free public transport, providing excellent value for money.</p>
<p>It's important to remember that the Old Town is completely pedestrianized. Wear comfortable walking shoes, as the cobblestone streets can be slippery and there are many stairs to climb, especially if you venture off Stradun.</p>

<h2>Conclusion: The Magic of Hrvatska Awaits</h2>
<p>Dubrovnik is more than just a beautiful coastal city; it is a living museum, a testament to the resilience of the human spirit, and a showcase of the unparalleled beauty of <strong>Croatia</strong>. Whether you are wandering through its ancient streets, sailing across the azure waters to nearby islands, or savoring a delicious seafood dinner as the sun sets over the Adriatic, Dubrovnik promises an unforgettable experience.</p>
<p>As you plan your journey through <em>Hrvatska</em>, make sure Dubrovnik is at the top of your itinerary. Its magic will stay with you long after you have left its ancient walls behind.</p>
`;

async function insertDubrovnikArticle() {
  const pb = new PocketBase('http://127.0.0.1:8090');
  
  try {
    await pb.admins.authWithPassword('tmpadmin@croatiabest.hr', 'password123');
    
    const record = await pb.collection('blogs').create({
      title: 'The Ultimate Guide to Dubrovnik: The Pearl of the Adriatic',
      slug: 'ultimate-guide-dubrovnik-croatia',
      excerpt: 'Discover the magic of Dubrovnik, Croatia. Explore the ancient city walls, Game of Thrones filming locations, stunning beaches, and Mediterranean cuisine in this ultimate travel guide.',
      content: DUBROVNIK_ARTICLE_HTML,
      category: 'Putovanja', // Categories in Croatian
      seoKeywords: 'Dubrovnik, Croatia, Hrvatska, travel guide, Old Town, Game of Thrones, Adriatic Sea',
      image: 'https://images.unsplash.com/photo-1555920365-154df656ff25?q=80&w=2940&auto=format&fit=crop',
      author: 'CroatiaBest Uredništvo',
      readTime: '10 min'
    });
    
    console.log('Successfully inserted Dubrovnik article with ID:', record.id);
  } catch (err) {
    console.error('Failed to insert article:', err.message);
  }
}

insertDubrovnikArticle();
