import React from 'react';
import { getPocketBase } from '@/pocketbase/index';
import VijestiClient from './Client';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { category: string } }) {
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
  const title = mapping[params.category] || 'Vijesti';
  return {
    title: `${title} | CroatiaBest`,
  };
}

export const revalidate = 60;

export default async function VijestiCategoryPage({ params }: { params: { category: string } }) {
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
  
  const actualCategory = mapping[params.category];
  if (!actualCategory) return notFound();

  const pb = await getPocketBase();
  let articles = [];
  try {
    articles = await pb.collection('blogs').getFullList({
      filter: `category = "${actualCategory}"`,
      sort: '-created'
    });
  } catch (e) {
    console.error(e);
  }

  return <VijestiClient articles={articles} category={actualCategory} />;
}
