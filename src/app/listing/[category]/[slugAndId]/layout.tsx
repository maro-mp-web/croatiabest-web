import type { Metadata } from 'next';
import PocketBase from 'pocketbase';
import { DEFAULT_LISTING_IMAGE } from '@/app/lib/constants';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ category: string, slugAndId: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slugAndId = resolvedParams.slugAndId || '';
  const idParts = slugAndId.split('-');
  const id = idParts[idParts.length - 1];

  if (!id) {
    return { title: 'CroatiaBest' };
  }

  try {
    const listing = await pb.collection('listings').getOne(id, { requestKey: null });
    
    // Parse photos
    let photos = listing.photoUrls || [];
    if (typeof photos === 'string') {
      try { photos = JSON.parse(photos); } catch (e) { photos = [photos]; }
    }
    const imageUrl = Array.isArray(photos) && photos.length > 0 
      ? photos[0] 
      : DEFAULT_LISTING_IMAGE;

    // Description may contain HTML from rich editor, strip it for SEO
    const rawDescription = (listing.description || '').replace(/<[^>]*>/g, '');
    const hrDescription = rawDescription.split('\n\n')[0] || '';
    // Trim to ~155 characters for SEO
    const seoDescription = hrDescription.length > 155 
      ? hrDescription.substring(0, 155) + '...'
      : hrDescription;

    const title = `${listing.name} - CroatiaBest`;

    return {
      title,
      description: seoDescription,
      alternates: {
        canonical: `https://croatiabest.com.hr/listing/${resolvedParams.category}/${resolvedParams.slugAndId}`,
      },
      openGraph: {
        title,
        description: seoDescription,
        url: `https://croatiabest.com.hr/listing/${resolvedParams.category}/${resolvedParams.slugAndId}`,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: listing.name,
          }
        ],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: seoDescription,
        images: [imageUrl],
      }
    };
  } catch (error) {
    console.error("Error generating metadata for listing:", id, error);
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
