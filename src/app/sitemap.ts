import { MetadataRoute } from 'next';
import PocketBase from 'pocketbase';

import { generateListingUrl } from '@/app/lib/utils/slug';

const BASE_URL = 'https://croatiabest.com.hr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
  
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
  ];

  try {
    const cities = await pb.collection('cities').getFullList({ requestKey: null });
    cities.forEach((city) => {
      routes.push({
        url: `${BASE_URL}/cities/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });

    const islands = await pb.collection('islands').getFullList({ requestKey: null });
    islands.forEach((island) => {
      routes.push({
        url: `${BASE_URL}/islands/${island.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
    // Using getFullList to get all items (over 2000+)
    const listings = await pb.collection('listings').getFullList({
      requestKey: null,
      fields: 'id,locationCategoryId,categoryId,name,updated', // only fetch needed fields for optimization
      filter: 'status != "deleted"',
    });

    listings.forEach((listing) => {
      // Use the utility to generate SEO friendly URLs
      const path = generateListingUrl(
        listing.locationCategoryId || listing.categoryId, 
        listing.name, 
        listing.id
      );
      
      routes.push({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(listing.updated || new Date()),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Sitemap generation error: could not fetch listings from PocketBase", error);
  }

  return routes;
}
