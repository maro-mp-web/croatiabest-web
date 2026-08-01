import React from 'react';
import { getPocketBase } from '@/pocketbase/index';
import TagClient from './TagClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tag = decodeURIComponent(resolvedParams.slug);
  return {
    title: `Vijesti za oznaku: ${tag} | CroatiaBest`,
  };
}

export const revalidate = 60;

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const tag = decodeURIComponent(resolvedParams.slug).toLowerCase();
  
  if (!tag) return notFound();

  const pb = await getPocketBase();
  let articles = [];
  try {
    // Filter blogs where the tags array contains the tag
    // Since PocketBase JSON fields can be tricky to query with `~`, 
    // we fetch all active blogs (or blogs) and filter in JS if needed.
    // Or we use PocketBase JSON contains filter if available. 
    // PocketBase allows `tags ~ "tag"` if it's text, or JSON array.
    articles = await pb.collection('blogs').getFullList({
      filter: `tags ~ "${tag}"`,
      sort: '-publishDate'
    });
  } catch (e) {
    console.error(e);
  }

  // To be safe against substring matches (e.g. "hrana" matching "hrana123"), 
  // we filter accurately in JS just in case.
  const filteredArticles = articles.filter(a => {
    if (!a.tags) return false;
    const tagArray = Array.isArray(a.tags) ? a.tags : typeof a.tags === 'string' ? a.tags.split(',').map((t: string) => t.trim()) : [];
    return tagArray.map((t: string) => t.toLowerCase()).includes(tag);
  });

  return <TagClient articles={filteredArticles} tag={tag} />;
}
