import React from 'react';
import PocketBase from 'pocketbase';
import VijestiHubClient from './VijestiHubClient';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const metadata = {
  title: 'Vijesti & Aktualnosti iz Hrvatske | CroatiaBest',
  description: 'Najnovije turističke vijesti, aktualnosti, gastro novosti i priče iz Hrvatske i svijeta.',
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
    const isTaggedNews = Array.isArray(a.tags) && (a.tags.includes('vijesti') || a.tags.includes('bot'));
    const isCategoryNews = NEWS_CATEGORIES.includes(a.category);
    return isTaggedNews || isCategoryNews;
  });

  const safeArticles = (newsArticles.length > 0 ? newsArticles : articles)
    .filter(a => !Array.isArray(a.tags) || !a.tags.includes('pending_approval'))
    .map(a => JSON.parse(JSON.stringify(a)));

  return <VijestiHubClient articles={safeArticles} />;
}
