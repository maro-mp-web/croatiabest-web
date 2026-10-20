import React from 'react';
import PocketBase from 'pocketbase';
import ListingDetailClient from './ListingDetailClient';
import { notFound, permanentRedirect } from 'next/navigation';
import { generateSlug, CATEGORY_SLUG_MAP } from '@/app/lib/utils/slug';
import { getSeoOverride } from '@/app/lib/listing-seo-config';

export const dynamic = 'force-dynamic';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

async function getListingRecord(slugAndId: string) {
  if (!slugAndId) return null;
  const pb = new PocketBase(PB_URL);

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
      filter: 'status != "deleted"',
      requestKey: null,
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

export default async function ListingDetailPage({
  params
}: {
  params: Promise<{ category: string; slugAndId: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slugAndId || '';
  let listing: any = await getListingRecord(slug);
  const seoOverride = getSeoOverride(slug) || (listing ? getSeoOverride(listing.slug || listing.id) : null);

  if (!listing && seoOverride) {
    listing = {
      id: slug,
      name: seoOverride.h1Title.split('—')[0].trim(),
      slug: slug,
      locationCategoryId: resolvedParams.category === 'beaches' || resolvedParams.category === 'plaza' ? 'beaches' : 'pharmacy',
      description: seoOverride.enrichedDescription,
      city: slug.includes('jadranovo') ? 'Jadranovo' : (slug.includes('vela') ? 'Vela Luka' : (slug.includes('split') || slug.includes('obojena') ? 'Split' : (slug.includes('zagreb') ? 'Zagreb' : 'Cavtat'))),
      address: slug.includes('jadranovo') ? 'Jadranovo' : (slug.includes('vela') ? 'Vela Luka, Otok Korčula' : (slug.includes('obojena') ? 'Šetalište Ivana Meštrovića, Split' : (slug.includes('siget') || slug.includes('holjevc') ? 'Avenija Većeslava Holjevca 22, Zagreb' : 'Zagreb'))),
      metadata: {
        seoTitle: seoOverride.seoTitle,
        seoDescription: seoOverride.seoDescription,
        seoKeywords: seoOverride.seoKeywords.join(', '),
      },
      faq: seoOverride.faqs,
    };
  }

  if (!listing) {
    return notFound();
  }

  const rawCat = (listing.locationCategoryId || listing.categoryId || resolvedParams.category || 'ostalo').toLowerCase();
  const canonicalCategory = CATEGORY_SLUG_MAP[rawCat] || rawCat;
  const canonicalSlug = listing.metadata?.slug || (listing.slug && !listing.slug.endsWith(listing.id) ? listing.slug : null) || generateSlug(listing.name);

  // 301 Permanent Redirect if accessed via unnormalized category, legacy /listing/ or slug with old ID hash
  if (resolvedParams.category.toLowerCase() !== canonicalCategory || slug !== canonicalSlug) {
    permanentRedirect(`/objekt/${canonicalCategory}/${canonicalSlug}`);
  }

  const pb = new PocketBase(PB_URL);
  let allActiveListings: any[] = [];
  try {
    allActiveListings = await pb.collection('listings').getFullList({
      filter: 'status = "active"',
      sort: '-created',
      requestKey: null,
    });
  } catch (e) {
    console.error('[ListingDetailPage] error fetching all listings:', e);
  }

  const safeListing = JSON.parse(JSON.stringify(listing));
  const safeAllActive = JSON.parse(JSON.stringify(allActiveListings));

  const normalizedCategory = canonicalCategory;

  const primarySchemaType = normalizedCategory === 'hitna-pomoc' || normalizedCategory === 'emergency' 
    ? 'EmergencyService' 
    : (normalizedCategory === 'ljekarna' || normalizedCategory === 'pharmacy' 
        ? 'Pharmacy' 
        : (normalizedCategory === 'plaza' || normalizedCategory === 'beaches' 
            ? 'TouristAttraction' 
            : 'LocalBusiness'));

  const jsonLdList: any[] = [
    {
      '@context': 'https://schema.org',
      '@type': primarySchemaType,
      name: seoOverride?.h1Title || listing.name,
      description: seoOverride?.seoDescription || listing.metadata?.seoDescription || (listing.description ? listing.description.replace(/<[^>]*>/g, '').slice(0, 160) : undefined),
      url: `https://croatiabest.com.hr/objekt/${canonicalCategory}/${canonicalSlug}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: listing.address || '',
        addressLocality: listing.city || '',
        addressCountry: 'HR',
      },
      ...(listing.contactPhone ? { telephone: listing.contactPhone } : {}),
    }
  ];

  if (seoOverride?.faqs && seoOverride.faqs.length > 0) {
    jsonLdList.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seoOverride.faqs.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList.length === 1 ? jsonLdList[0] : jsonLdList) }}
      />
      <ListingDetailClient 
        listing={safeListing} 
        allActiveListings={safeAllActive}
        categorySlug={normalizedCategory}
      />
    </>
  );
}
