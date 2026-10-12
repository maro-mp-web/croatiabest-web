import React from 'react';
import { getPocketBase } from '@/pocketbase/index';
import VijestiClient from './Client';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const mapping: Record<string, string> = {
    'vijesti-iz-hrvatske': 'Vijesti iz Hrvatske',
    'vijesti-iz-svijeta': 'Vijesti iz Svijeta',
    'poznati-hrvati': 'Poznati Hrvati',
    'slavni-u-hrvatskoj': 'Slavni u Hrvatskoj',
    'zanimljivosti': 'Zanimljivosti',
    'iz-povijesti': 'Iz Povijesti',
    'iz-geografije': 'Iz geografije',
    'domovinski-rat': 'Domovinski rat'
  };
  const title = mapping[resolvedParams.category] || 'Vijesti';
  return {
    title: `${title} | CroatiaBest`,
  };
}

export const revalidate = 60;

export default async function VijestiCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const mapping: Record<string, string> = {
    'vijesti-iz-hrvatske': 'Vijesti iz Hrvatske',
    'vijesti-iz-svijeta': 'Vijesti iz Svijeta',
    'poznati-hrvati': 'Poznati Hrvati',
    'slavni-u-hrvatskoj': 'Slavni u Hrvatskoj',
    'zanimljivosti': 'Zanimljivosti',
    'iz-povijesti': 'Iz Povijesti',
    'iz-geografije': 'Iz geografije',
    'domovinski-rat': 'Domovinski rat'
  };
  
  const actualCategory = mapping[resolvedParams.category];
  if (!actualCategory) return notFound();

  const pb = await getPocketBase();
  let articles: any[] = [];
  try {
    articles = await pb.collection('blogs').getFullList({
      filter: `category = "${actualCategory}"`,
      sort: '-publishDate'
    });
  } catch (e) {
    console.error(e);
  }

  const publishedArticles = articles.filter(
    a => !Array.isArray(a.tags) || !a.tags.includes('pending_approval')
  );

  return <VijestiClient articles={publishedArticles} category={actualCategory} />;
}
