import React from 'react';
import PocketBase from 'pocketbase';
import VijestiClient from './Client';
import { notFound } from 'next/navigation';

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

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const title = CATEGORY_MAP[resolvedParams.category] || 'Vijesti';
  return {
    title: `${title} | CroatiaBest`,
    description: `Najnovije vijesti i aktualnosti - ${title} na CroatiaBest portalu.`,
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

  return <VijestiClient articles={safeArticles} category={actualCategory} />;
}
