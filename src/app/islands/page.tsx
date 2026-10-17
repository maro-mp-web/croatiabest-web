import React from 'react';
import PocketBase from 'pocketbase';
import IslandsHubClient from './IslandsHubClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const metadata: Metadata = {
  title: 'Hrvatski Otoci | Turistički vodiči i skrivene uvale | CroatiaBest',
  description: 'Otkrijte najljepše otoke na Jadranu — Hvar, Brač, Korčula, Krk, Vis, Cres, Pag, Rab i mnogi drugi. Skrivene uvale, plaže, restorani i lokalni doživljaji.',
  keywords: ['otoci hrvatska', 'otoci jadran', 'hvar', 'brač', 'korčula', 'vis', 'krk', 'croatiabest'],
  alternates: {
    canonical: 'https://croatiabest.com.hr/islands',
  },
  openGraph: {
    title: 'Hrvatski Otoci | CroatiaBest',
    description: 'Vodič kroz najljepše jadranske otoke. Skrivene plaže, uvale, gastronomija i znamenitosti.',
    url: 'https://croatiabest.com.hr/islands',
    siteName: 'CroatiaBest',
    locale: 'hr_HR',
    type: 'website',
  },
};

export default async function IslandsPage() {
  const pb = new PocketBase(PB_URL);
  let islands: any[] = [];

  try {
    islands = await pb.collection('islands').getFullList({
      sort: 'name',
      requestKey: null,
    });
  } catch (e) {
    console.error('[IslandsPage] Error fetching islands:', e);
  }

  const safeIslands = islands.map(i => JSON.parse(JSON.stringify(i)));

  return <IslandsHubClient islands={safeIslands} />;
}
