import PocketBase from 'pocketbase';
import IslandClient from './IslandClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getWeatherAndMarineData } from '@/app/lib/weather';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const pb = new PocketBase(PB_URL);

  try {
    const island = await pb.collection('islands').getFirstListItem(`slug="${resolvedParams.slug}"`, { requestKey: null });

    const title = island.seoTitle || `Otok ${island.name} - Turistički vodič | CroatiaBest`;
    const description = island.seoDescription || (island.description ? island.description.replace(/<[^>]*>/g, '').substring(0, 160) : `Istražite otok ${island.name} — plaže, restorani, znamenitosti i sve informacije.`);
    let keywords = island.seoKeywords ? island.seoKeywords.split(',').map((k: string) => k.trim()) : [island.name, 'otok', 'Hrvatska', 'turizam'];

    let wikiKeywords: string[] = [];
    if (island.wikiSections && Array.isArray(island.wikiSections)) {
      wikiKeywords = island.wikiSections
        .filter((section: any) => section.title)
        .map((section: any) => `${island.name.toLowerCase()} ${section.title.toLowerCase()}`);
    }

    // Enhance keywords with high-volume island weather and sea temperature queries
    keywords = Array.from(new Set([
      ...keywords,
      ...wikiKeywords,
      `vrijeme otok ${island.name.toLowerCase()}`,
      `temperatura mora ${island.name.toLowerCase()}`,
      `vremenska prognoza ${island.name.toLowerCase()}`,
      `otok ${island.name.toLowerCase()} weather`,
      `temperatura mora otok ${island.name.toLowerCase()}`,
    ]));
    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `https://croatiabest.com.hr/islands/${island.slug}`,
        siteName: 'CroatiaBest',
        images: island.image ? [{ url: island.image, width: 1200, height: 630, alt: `Otok ${island.name}` }] : [],
        locale: 'hr_HR',
        type: 'website',
      },
      alternates: {
        canonical: `https://croatiabest.com.hr/islands/${island.slug}`,
        languages: {
          'hr': `https://croatiabest.com.hr/otoci/${island.slug}`,
          'en': `https://croatiabest.com.hr/islands/${island.slug}`,
          'x-default': `https://croatiabest.com.hr/islands/${island.slug}`,
        },
      },
    };
  } catch (e) {
    return { title: 'Otok | CroatiaBest' };
  }
}

export default async function IslandPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const pb = new PocketBase(PB_URL);
  
  let island;
  try {
    island = await pb.collection('islands').getFirstListItem(`slug="${resolvedParams.slug}"`, { requestKey: null });
  } catch (e) {
    return notFound();
  }

  let islandCities: any[] = [];
  try {
    // Fetch cities that belong to this island
    islandCities = await pb.collection('cities').getFullList({
      filter: `island="${island.id}"`,
      sort: 'name',
      requestKey: null
    });
  } catch (e) {
    try {
      islandCities = await pb.collection('cities').getFullList({
        filter: `island="${island.name}"`,
        sort: 'name',
        requestKey: null
      });
    } catch(err) {
      console.log('Nije uspjelo dohvaćanje gradova otoka', err);
    }
  }

  let listings: any[] = [];
  try {
    // Fetch listings for island directly or for any town on this island
    const cityNames = [island.name, ...islandCities.map((c: any) => c.name).filter(Boolean)];
    const cityFilterParts = cityNames.map(n => `city="${n}"`).join(' || ');
    const combinedFilter = `(${cityFilterParts} || region="${island.name}") && status="active"`;

    listings = await pb.collection('listings').getFullList({
      filter: combinedFilter,
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    try {
      listings = await pb.collection('listings').getFullList({
        filter: `city="${island.name}" && status="active"`,
        sort: '-created',
        requestKey: null
      });
    } catch (err) {
      // ignore
    }
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

  let globalSpecialListings: any[] = [];
  try {
    globalSpecialListings = await pb.collection('listings').getFullList({
      filter: `(locationCategoryId="homeland_war" || locationCategoryId="national_parks") && status="active"`,
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  // Fetch real-time weather & marine data with 30m server ISR cache
  const weather = await getWeatherAndMarineData(island.lat, island.lng, `Otok ${island.name}`);

  const safeIsland = JSON.parse(JSON.stringify(island));
  const safeListings = JSON.parse(JSON.stringify(listings));
  const safeBlogs = JSON.parse(JSON.stringify(allBlogs));
  const safeCities = JSON.parse(JSON.stringify(islandCities));
  const safeSpecial = JSON.parse(JSON.stringify(globalSpecialListings));

  return (
    <IslandClient 
      island={safeIsland} 
      listings={safeListings} 
      articles={safeBlogs} 
      islandCities={safeCities} 
      globalSpecialListings={safeSpecial}
      weather={weather} 
    />
  );
}
