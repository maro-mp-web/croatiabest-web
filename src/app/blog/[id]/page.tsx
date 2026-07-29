import PocketBase from 'pocketbase';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

async function getArticle(id: string) {
  const pb = new PocketBase(PB_URL);
  try {
    return await pb.collection('blogs').getOne(id, { requestKey: null });
  } catch (e) {
    try {
      return await pb.collection('blogs').getFirstListItem(`slug="${id}"`, { requestKey: null });
    } catch (e2) {
      return null;
    }
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.id);

  if (!article) return { title: 'Članak | CroatiaBest' };

  const title = article.seoTitle || article.title || 'CroatiaBest Blog';
  const description = article.seoDescription || article.excerpt || '';
  const keywords = article.seoKeywords ? article.seoKeywords.split(',').map((k: string) => k.trim()) : [];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `https://croatiabest.com.hr/blog/${article.slug || article.id}`,
      siteName: 'CroatiaBest',
      images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: title }] : [],
      locale: 'hr_HR',
      type: 'article',
    },
    alternates: {
      canonical: `https://croatiabest.com.hr/blog/${article.slug || article.id}`,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.id);

  if (!article) return notFound();

  const pb = new PocketBase(PB_URL);
  let relatedArticles: any[] = [];
  try {
    const allBlogs = await pb.collection('blogs').getFullList({ requestKey: null });
    relatedArticles = allBlogs.filter((a: any) => a.id !== article.id).map(a => structuredClone(a));
  } catch (e) {
    // silently fail - related articles are optional
  }

  // Ensure plain objects are passed to Client Components to prevent Next.js from dropping properties
  const safeArticle = JSON.parse(JSON.stringify(article));
  const safeRelated = JSON.parse(JSON.stringify(relatedArticles));

  // If PocketBase Record dropped `created` during stringify, we manually assign it
  if (article.created && !safeArticle.created) {
    safeArticle.created = article.created;
  }
  
  // Also fix related articles
  safeRelated.forEach((ra: any, idx: number) => {
    if (relatedArticles[idx].created && !ra.created) {
      ra.created = relatedArticles[idx].created;
    }
  });

  return <ArticleClient article={safeArticle} relatedArticles={safeRelated} />;
}
