import React from 'react';
import PocketBase from 'pocketbase';
import CitiesHubClient from './CitiesHubClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const metadata: Metadata = {
  title: 'Gradovi u Hrvatskoj | Turistički vodiči i znamenitosti | CroatiaBest',
  description: 'Istražite najljepše gradove u Hrvatskoj — Zagreb, Dubrovnik, Split, Zadar, Rovinj, Šibenik, Pula i mnogi drugi. Otkrijte restorane, plaže, znamenitosti i smještaj.',
  keywords: ['gradovi hrvatska', 'turistički vodič gradovi', 'dubrovnik', 'split', 'zagreb', 'rovinj', 'zadar', 'croatiabest'],
  alternates: {
    canonical: 'https://croatiabest.com.hr/cities',
    languages: {
      'hr': 'https://croatiabest.com.hr/gradovi',
      'en': 'https://croatiabest.com.hr/cities',
      'x-default': 'https://croatiabest.com.hr/cities',
    },
  },
  openGraph: {
    title: 'Gradovi u Hrvatskoj | CroatiaBest',
    description: 'Vodič kroz najljepše hrvatske gradove. Restorani, plaže, znamenitosti i atrakcije.',
    url: 'https://croatiabest.com.hr/cities',
    siteName: 'CroatiaBest',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default async function CitiesPage() {
  const pb = new PocketBase(PB_URL);
  let cities: any[] = [];

  try {
    cities = await pb.collection('cities').getFullList({
      sort: 'name',
      requestKey: null,
    });
  } catch (e) {
    console.error('[CitiesPage] Error fetching cities:', e);
  }

  const safeCities = cities.map(c => JSON.parse(JSON.stringify(c)));

  return <CitiesHubClient cities={safeCities} />;
}
