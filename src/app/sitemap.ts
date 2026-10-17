import { MetadataRoute } from 'next';
import PocketBase from 'pocketbase';

import { generateListingUrl } from '@/app/lib/utils/slug';

// CRITICAL: This must be dynamic so it generates at request time, not at build time.
// Without this, Next.js tries to generate the sitemap during `next build` when PocketBase
// is not running, resulting in an empty sitemap with only static routes.
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Re-generate every hour (cache for performance)

const BASE_URL = 'https://croatiabest.com.hr';
const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pb = new PocketBase(PB_URL);
  
  // Base static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/vijesti`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/magazin`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/cities`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gradovi`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/islands`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/otoci`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...[
      'vijesti-iz-hrvatske', 'vijesti-iz-svijeta', 'poznati-hrvati',
      'slavni-u-hrvatskoj', 'zanimljivosti', 'iz-povijesti',
      'iz-geografije', 'domovinski-rat'
    ].map((cat) => ({
      url: `${BASE_URL}/vijesti/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.85,
    })),
  ];

  try {
    // Fetch cities
    const cities = await pb.collection('cities').getFullList({ requestKey: null });
    cities.forEach((city) => {
      routes.push({
        url: `${BASE_URL}/cities/${city.slug}`,
        lastModified: new Date(city.updated || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // Fetch islands
    const islands = await pb.collection('islands').getFullList({ requestKey: null });
    islands.forEach((island) => {
      routes.push({
        url: `${BASE_URL}/islands/${island.slug}`,
        lastModified: new Date(island.updated || new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    // Blog and News posts
    const blogs = await pb.collection('blogs').getFullList({
      requestKey: null,
      fields: 'id,slug,updated,publishDate,created,category,tags',
    });
    blogs.forEach((blog) => {
      const path = blog.slug || blog.id;
      const isNews = [
        'Vijesti iz Hrvatske', 'Vijesti iz Svijeta', 'Poznati Hrvati',
        'Slavni u Hrvatskoj', 'Zanimljivosti', 'Iz Povijesti',
        'Iz geografije', 'Domovinski rat'
      ].includes(blog.category) || (Array.isArray(blog.tags) && (blog.tags.includes('news_bot') || blog.tags.includes('vijesti')));

      routes.push({
        url: `${BASE_URL}/blog/${path}`,
        lastModified: new Date(blog.updated || blog.publishDate || blog.created || new Date()),
        changeFrequency: isNews ? 'daily' : 'weekly',
        priority: isNews ? 0.85 : 0.75,
      });
    });

    // Listings (2000+ items) - fetch all with pagination handled by getFullList
    const listings = await pb.collection('listings').getFullList({
      requestKey: null,
      fields: 'id,locationCategoryId,categoryId,name,updated',
      filter: 'status != "deleted"',
    });

    listings.forEach((listing) => {
      const path = generateListingUrl(
        listing.locationCategoryId || listing.categoryId, 
        listing.name
      );
      
      routes.push({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(listing.updated || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Sitemap generation error: could not fetch data from PocketBase", error);
    // Return at least static routes if PocketBase is unreachable
  }

  return routes;
}
