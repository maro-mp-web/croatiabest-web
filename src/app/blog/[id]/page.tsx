import PocketBase from 'pocketbase';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
  
  let article;
  try {
    // Try to fetch by id first
    article = await pb.collection('blogs').getOne(resolvedParams.id, { requestKey: null });
  } catch (e) {
    try {
      // Fallback to fetch by slug
      article = await pb.collection('blogs').getFirstListItem(`slug="${resolvedParams.id}"`, { requestKey: null });
    } catch (e2) {
      return notFound();
    }
  }

  let relatedArticles = [];
  try {
    const allBlogs = await pb.collection('blogs').getFullList({ requestKey: null });
    relatedArticles = allBlogs.filter((a: any) => a.id !== article.id);
  } catch (e) {
    // silently fail - related articles are optional
  }

  return <ArticleClient article={article} relatedArticles={relatedArticles} />;
}
