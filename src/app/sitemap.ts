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
      url: `${BASE_URL}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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

    // Blog posts
    const blogs = await pb.collection('blogs').getFullList({
      requestKey: null,
      fields: 'id,slug,updated',
    });
    blogs.forEach((blog) => {
      const path = blog.slug || blog.id;
      routes.push({
        url: `${BASE_URL}/blog/${path}`,
        lastModified: new Date(blog.updated || new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
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
