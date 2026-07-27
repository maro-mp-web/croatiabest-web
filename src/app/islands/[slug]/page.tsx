import PocketBase from 'pocketbase';
import IslandClient from './IslandClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const pb = new PocketBase(PB_URL);

  try {
    const island = await pb.collection('islands').getFirstListItem(`slug="${resolvedParams.slug}"`, { requestKey: null });

    const title = island.seoTitle || `Otok ${island.name} - Turistički vodič | CroatiaBest`;
    const description = island.seoDescription || (island.description ? island.description.replace(/<[^>]*>/g, '').substring(0, 160) : `Istražite otok ${island.name} — plaže, restorani, znamenitosti i sve informacije.`);
    const keywords = island.seoKeywords ? island.seoKeywords.split(',').map((k: string) => k.trim()) : [island.name, 'otok', 'Hrvatska', 'turizam'];

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

  let listings: any[] = [];
  try {
    listings = await pb.collection('listings').getFullList({
      filter: `city="${island.name}" && status="active"`,
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    // ignore
  }

  return <IslandClient island={island} listings={listings} />;
}
