import React from 'react';
import PocketBase from 'pocketbase';
import BlogClient from './BlogClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Magazin & Putopisni Vodiči kroz Hrvatsku | CroatiaBest',
  description: 'Otkrijte najbolje skrivene plaže, gastronomske delicije, kulturne znamenitosti i stručne savjete za putovanja po Hrvatskoj u našem Magazinu.',
  keywords: ['magazin hrvatska', 'turistički vodič', 'putovanja hrvatska', 'plaže', 'restorani', 'hoteli', 'croatiabest blog'],
  alternates: {
    canonical: 'https://croatiabest.com.hr/blog',
  },
  openGraph: {
    title: 'Magazin & Vodiči kroz Hrvatsku | CroatiaBest',
    description: 'Stručni vodiči, reportaže i savjeti za nezaboravno ljetovanje u Hrvatskoj.',
    url: 'https://croatiabest.com.hr/blog',
    siteName: 'CroatiaBest',
    images: [
      {
        url: '/hero-dubrovnik.jpg',
        width: 1200,
        height: 630,
        alt: 'CroatiaBest Magazin',
      },
    ],
    locale: 'hr_HR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magazin & Vodiči kroz Hrvatsku | CroatiaBest',
    description: 'Stručni vodiči i reportaže za putovanja po Hrvatskoj.',
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

export default async function BlogPage() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
  
  let articles: any[] = [];
  try {
    try {
      articles = await pb.collection('blogs').getFullList({
        sort: '-id',
        requestKey: null
      });
    } catch {
      articles = await pb.collection('blogs').getFullList({
        requestKey: null
      });
    }
  } catch (e) {
    console.error('Failed to fetch blogs', e);
  }

  const safeArticles = articles
    .filter(article => !Array.isArray(article.tags) || !article.tags.includes('pending_approval'))
    .map(article => {
      const safe = JSON.parse(JSON.stringify(article));
      if (article.created && !safe.created) {
        safe.created = article.created;
      }
      return safe;
    });

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Magazin & Putopisni Vodiči kroz Hrvatsku | CroatiaBest',
    description: 'Otkrijte najbolje skrivene plaže, gastronomske delicije i savjete za putovanja po Hrvatskoj.',
    url: 'https://croatiabest.com.hr/blog',
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
          name: 'Magazin',
          item: 'https://croatiabest.com.hr/blog',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <BlogClient articles={safeArticles} />
    </>
  );
}
