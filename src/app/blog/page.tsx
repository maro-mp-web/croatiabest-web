import PocketBase from 'pocketbase';
import BlogClient from './BlogClient';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090');
  
  let articles: any[] = [];
  try {
    articles = await pb.collection('blogs').getFullList({
      sort: '-created',
      requestKey: null
    });
  } catch (e) {
    console.error('Failed to fetch blogs', e);
  }

  return <BlogClient articles={articles} />;
}
