import type { Metadata } from 'next';
import PocketBase from 'pocketbase';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

import { generateSlug } from '@/app/lib/utils/slug';

export const dynamic = 'force-dynamic';

async function getListingRecord(slugAndId: string) {
  if (!slugAndId) return null;

  // 1. If it's a 15-char PB record ID
  if (slugAndId.length === 15) {
    try {
      return await pb.collection('listings').getOne(slugAndId, { requestKey: null });
    } catch (e) {}
  }

  // 2. If it has a 15-char trailing ID like slug-8604f11e8bd85ca
  const parts = slugAndId.split('-');
  const potentialId = parts[parts.length - 1];
  if (potentialId && potentialId.length === 15) {
    try {
      return await pb.collection('listings').getOne(potentialId, { requestKey: null });
    } catch (e) {}
  }

  // 3. Search active listings for matching slug or name
  try {
    const list = await pb.collection('listings').getFullList({
      sort: '-created',
      requestKey: null
    });
    const found = list.find(l => 
      (l.metadata && l.metadata.slug === slugAndId) ||
      generateSlug(l.name) === slugAndId ||
      l.slug === slugAndId ||
      l.id === slugAndId
    );
    if (found) return found;
  } catch (e) {
    console.error("Error searching listing by slug:", slugAndId, e);
  }

  return null;
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string, slugAndId: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slugAndId = resolvedParams.slugAndId || '';

  try {
    const listing = await getListingRecord(slugAndId);
    
    if (!listing) {
      return { 
        title: 'Objekt | CroatiaBest',
        description: 'Vrhunski turistički i poslovni vodič kroz Hrvatsku - CroatiaBest.'
      };
    }

    // Parse photos
    let photos = listing.photoUrls || [];
    if (typeof photos === 'string') {
      try { photos = JSON.parse(photos); } catch (e) { photos = [photos]; }
    }
    const imageUrl = Array.isArray(photos) && photos.length > 0 
      ? photos[0] 
      : DEFAULT_LISTING_IMAGE;

    // SEO Title
    const title = listing.metadata?.seoTitle || `${listing.name} - CroatiaBest`;

    // SEO Description
    let description = listing.metadata?.seoDescription;
    if (!description) {
      const rawDescription = (listing.description || '').replace(/<[^>]*>/g, '').trim();
      description = rawDescription.length > 160 
        ? rawDescription.substring(0, 157) + '...'
        : (rawDescription || `${listing.name} u gradu ${listing.city} — informacije, ponuda, radno vrijeme i kontakt na CroatiaBest.`);
    }

    // SEO Keywords
    let keywords: string[] = [];
    if (listing.metadata?.seoKeywords) {
      keywords = listing.metadata.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean);
    } else {
      keywords = [listing.name, listing.city, 'CroatiaBest', 'Hrvatska', 'vodič'];
    }

    const canonicalUrl = `https://croatiabest.com.hr/objekt/${resolvedParams.category}/${resolvedParams.slugAndId}`;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'CroatiaBest',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: listing.name,
          }
        ],
        locale: 'hr_HR',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      }
    };
  } catch (error) {
    console.error("Error generating metadata for listing:", slugAndId, error);
    return {
      title: 'CroatiaBest - Premium vodič',
    };
  }
}

export default function ListingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
