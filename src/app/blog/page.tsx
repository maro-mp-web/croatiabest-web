import PocketBase from 'pocketbase';
import BlogClient from './BlogClient';

export default async function BlogPage() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
  
  let articles = [];
  try {
    articles = await pb.collection('blogs').getFullList({
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    console.error('Failed to fetch blogs', e);
  }

  // Fallback to MOCK_ARTICLES if DB is empty for demo purposes during transition
  if (articles.length === 0) {
    const { MOCK_ARTICLES } = await import('@/app/lib/mock-data');
    articles = MOCK_ARTICLES;
  }

  return <BlogClient articles={articles} />;
}
