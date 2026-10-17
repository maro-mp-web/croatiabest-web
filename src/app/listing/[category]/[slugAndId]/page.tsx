import React from 'react';
import PocketBase from 'pocketbase';
import ListingDetailClient from './ListingDetailClient';
import { notFound } from 'next/navigation';
import { generateSlug } from '@/app/lib/utils/slug';

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
  const slug = resolvedParams.slugAndId;
  const listing = await getListingRecord(slug);

  if (!listing) {
    return notFound();
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': resolvedParams.category === 'hitna-pomoc' || resolvedParams.category === 'emergency' 
      ? 'EmergencyService' 
      : (resolvedParams.category === 'ljekarna' || resolvedParams.category === 'pharmacy' ? 'Pharmacy' : 'LocalBusiness'),
    name: listing.name,
    description: listing.metadata?.seoDescription || (listing.description ? listing.description.replace(/<[^>]*>/g, '').slice(0, 160) : undefined),
    url: `https://croatiabest.com.hr/objekt/${resolvedParams.category}/${resolvedParams.slugAndId}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.address,
      addressLocality: listing.city,
      addressCountry: 'HR',
    },
    ...(listing.contactPhone ? { telephone: listing.contactPhone } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ListingDetailClient 
        listing={safeListing} 
        allActiveListings={safeAllActive}
        categorySlug={resolvedParams.category}
      />
    </>
  );
}
