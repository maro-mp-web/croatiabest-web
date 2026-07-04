import PocketBase from 'pocketbase';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';

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
      // Fallback to mock data for demo purposes if not found in DB
      const { MOCK_ARTICLES } = await import('@/app/lib/mock-data');
      article = MOCK_ARTICLES.find(a => a.id === resolvedParams.id);
      if (!article) return notFound();
    }
  }

  let relatedArticles = [];
  try {
    const allBlogs = await pb.collection('blogs').getFullList({ requestKey: null });
    relatedArticles = allBlogs.filter(a => a.id !== article.id);
  } catch (e) {
    const { MOCK_ARTICLES } = await import('@/app/lib/mock-data');
    relatedArticles = MOCK_ARTICLES.filter(a => a.id !== article.id);
  }

  return <ArticleClient article={article} relatedArticles={relatedArticles} />;
}
