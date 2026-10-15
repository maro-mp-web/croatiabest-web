import React from 'react';
import PocketBase from 'pocketbase';
import VijestiHubClient from './VijestiHubClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const metadata: Metadata = {
  title: 'Vijesti & Aktualnosti iz Hrvatske i Svijeta | CroatiaBest',
  description: 'Najnovije turističke vijesti, aktualnosti, gastro novosti i priče iz Hrvatske i svijeta u stvarnom vremenu na CroatiaBest portalu.',
  keywords: ['vijesti', 'hrvatska vijesti', 'turizam vijesti', 'aktualno', 'jadran', 'croatiabest vijesti', 'gastro vijesti'],
  alternates: {
    canonical: 'https://croatiabest.com.hr/vijesti',
  },
  openGraph: {
    title: 'Vijesti & Aktualnosti iz Hrvatske | CroatiaBest',
    description: 'Najnovije turističke vijesti, aktualnosti, gastro novosti i ekskluzivne priče iz Hrvatske.',
    url: 'https://croatiabest.com.hr/vijesti',
    siteName: 'CroatiaBest',
    images: [
      {
        url: '/hero-dubrovnik.jpg',
        width: 1200,
        height: 630,
        alt: 'CroatiaBest Vijesti',
      },
    ],
    locale: 'hr_HR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vijesti & Aktualnosti | CroatiaBest',
    description: 'Najnovije turističke vijesti i aktualnosti iz Hrvatske i svijeta.',
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

export default async function VijestiMainPage() {
  const pb = new PocketBase(PB_URL);
  let articles: any[] = [];

  try {
    try {
      articles = await pb.collection('blogs').getFullList({
        sort: '-id',
        requestKey: null,
      });
    } catch {
      articles = await pb.collection('blogs').getFullList({
        requestKey: null,
      });
    }
  } catch (e) {
    console.error('[VijestiMainPage] Greška pri dohvaćanju vijesti:', e);
  }

  // Odvajamo vijesti (članci s tagom 'vijesti', 'bot' ili news kategorije)
  const NEWS_CATEGORIES = [
    'Vijesti iz Hrvatske',
    'Vijesti iz Svijeta',
    'Poznati Hrvati',
    'Slavni u Hrvatskoj',
    'Zanimljivosti',
    'Iz Povijesti',
    'Iz geografije',
    'Domovinski rat',
  ];

  const newsArticles = articles.filter(a => {
    if (Array.isArray(a.tags) && a.tags.includes('pending_approval')) return false;
    const isTaggedNews = Array.isArray(a.tags) && (a.tags.includes('vijesti') || a.tags.includes('bot') || a.tags.includes('news_bot'));
    const isCategoryNews = NEWS_CATEGORIES.includes(a.category);
    return isTaggedNews || isCategoryNews;
  });

  const safeArticles = (newsArticles.length > 0 ? newsArticles : articles)
    .filter(a => !Array.isArray(a.tags) || !a.tags.includes('pending_approval'))
    .map(a => JSON.parse(JSON.stringify(a)));

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Vijesti & Aktualnosti iz Hrvatske | CroatiaBest',
    description: 'Najnovije turističke vijesti, aktualnosti, gastro novosti i priče iz Hrvatske i svijeta.',
    url: 'https://croatiabest.com.hr/vijesti',
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'CroatiaBest',
      url: 'https://croatiabest.com.hr',
      logo: {
        '@type': 'ImageObject',
        url: 'https://croatiabest.com.hr/icon.png',
      },
    },
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
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <VijestiHubClient articles={safeArticles} />
    </>
  );
}
