import PocketBase from 'pocketbase';
import CityClient from './CityClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const pb = new PocketBase(PB_URL);

  try {
    const city = await pb.collection('cities').getFirstListItem(`slug="${resolvedParams.slug}"`, { requestKey: null });

    const title = city.seoTitle || `${city.name} - Turistički vodič | CroatiaBest`;
    const description = city.seoDescription || (city.description ? city.description.replace(/<[^>]*>/g, '').substring(0, 160) : `Istražite ${city.name} — sve informacije, restorani, plaže, smještaj i znamenitosti.`);
    let keywords = city.seoKeywords ? city.seoKeywords.split(',').map((k: string) => k.trim()) : [city.name, 'Hrvatska', 'turizam', 'vodič'];

    if (city.wikiSections && Array.isArray(city.wikiSections)) {
      const wikiKeywords = city.wikiSections
        .filter((section: any) => section.title)
        .map((section: any) => `${city.name.toLowerCase()} ${section.title.toLowerCase()}`);
      
      // Merge and remove duplicates
      keywords = Array.from(new Set([...keywords, ...wikiKeywords]));
    }
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `https://croatiabest.com.hr/cities/${city.slug}`,
        siteName: 'CroatiaBest',
        images: city.image ? [{ url: city.image, width: 1200, height: 630, alt: city.name }] : [],
        locale: 'hr_HR',
        type: 'website',
      },
      alternates: {
        canonical: `https://croatiabest.com.hr/cities/${city.slug}`,
      },
    };
  } catch (e) {
    return { title: 'Grad | CroatiaBest' };
  }
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const pb = new PocketBase(PB_URL);
  
  let city;
  try {
    city = await pb.collection('cities').getFirstListItem(`slug="${resolvedParams.slug}"`, { requestKey: null });
  } catch (e) {
    return notFound();
  }

  let cityListings: any[] = [];
  try {
    cityListings = await pb.collection('listings').getFullList({
      filter: `city="${city.name}" && status="active"`,
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  let globalSpecialListings: any[] = [];
  try {
    globalSpecialListings = await pb.collection('listings').getFullList({
      filter: `(locationCategoryId="homeland_war" || locationCategoryId="national_parks") && status="active"`,
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  let allBlogs: any[] = [];
  try {
    allBlogs = await pb.collection('blogs').getFullList({
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  return (
    <CityClient 
      city={city} 
      cityListings={cityListings} 
      globalSpecialListings={globalSpecialListings}
      allBlogs={allBlogs}
    />
  );
}

