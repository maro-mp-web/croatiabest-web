import React from 'react';
import PocketBase from 'pocketbase';
import VijestiClient from './Client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

const CATEGORY_MAP: Record<string, string> = {
  'vijesti-iz-hrvatske': 'Vijesti iz Hrvatske',
  'vijesti-iz-svijeta': 'Vijesti iz Svijeta',
  'poznati-hrvati': 'Poznati Hrvati',
  'slavni-u-hrvatskoj': 'Slavni u Hrvatskoj',
  'zanimljivosti': 'Zanimljivosti',
  'iz-povijesti': 'Iz Povijesti',
  'iz-geografije': 'Iz geografije',
  'domovinski-rat': 'Domovinski rat',
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const actualCategory = CATEGORY_MAP[resolvedParams.category] || 'Vijesti';
  const title = `${actualCategory} - Najnovije Vijesti | CroatiaBest`;
  const description = `Sve najnovije vijesti, analize i priče iz rubrike ${actualCategory}. Pratite zbivanja u Hrvatskoj i svijetu na CroatiaBest portalu.`;
  const canonicalUrl = `https://croatiabest.com.hr/vijesti/${resolvedParams.category}`;

  return {
    title,
    description,
    keywords: [actualCategory.toLowerCase(), 'vijesti', 'hrvatska', 'turizam', 'croatiabest', 'aktualnosti'],
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
          url: '/hero-dubrovnik.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'hr_HR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/hero-dubrovnik.jpg'],
      creator: '@croatiabest',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function VijestiCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const actualCategory = CATEGORY_MAP[resolvedParams.category];
  if (!actualCategory) return notFound();

  const pb = new PocketBase(PB_URL);
  let articles: any[] = [];

  try {
    try {
      articles = await pb.collection('blogs').getFullList({
        filter: `category = "${actualCategory}"`,
        sort: '-id',
        requestKey: null,
      });
    } catch {
      articles = await pb.collection('blogs').getFullList({
        filter: `category = "${actualCategory}"`,
        requestKey: null,
      });
    }
  } catch (e) {
    console.error('[VijestiCategoryPage] Greška pri dohvaćanju članaka:', e);
  }

  const safeArticles = articles
    .filter(a => !Array.isArray(a.tags) || !a.tags.includes('pending_approval'))
    .map(a => JSON.parse(JSON.stringify(a)));

  const categoryUrl = `https://croatiabest.com.hr/vijesti/${resolvedParams.category}`;

  const categoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${actualCategory} | CroatiaBest`,
    description: `Najnovije vijesti iz rubrike ${actualCategory}`,
    url: categoryUrl,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Naslovnica',
          item: 'https://croatiabest.com.hr',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Vijesti',
          item: 'https://croatiabest.com.hr/vijesti',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: actualCategory,
          item: categoryUrl,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <VijestiClient articles={safeArticles} category={actualCategory} />
    </>
  );
}
