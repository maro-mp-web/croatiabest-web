import PocketBase from 'pocketbase';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const PB_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

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

  let rawTitle = article.seoTitle || article.title || 'Članak';
  if (!rawTitle.toLowerCase().includes('croatiabest')) {
    rawTitle = `${rawTitle} | CroatiaBest`;
  }

  const rawDescription = article.seoDescription || article.excerpt || (article.content ? article.content.replace(/<[^>]*>/g, '').slice(0, 155) : 'Pročitajte najnoviji članak na CroatiaBest portalu.');
  const keywords = article.seoKeywords 
    ? article.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
    : [article.category, 'Hrvatska', 'turizam', 'vijesti', 'CroatiaBest'];

  const articleUrl = `https://croatiabest.com.hr/blog/${article.slug || article.id}`;
  const imageUrl = article.image || 'https://croatiabest.com.hr/hero-dubrovnik.jpg';
  const publishDate = article.publishDate || article.created;
  const modifiedDate = article.updated || article.created;
  const authorName = article.author || 'CroatiaBest Redakcija';

  const isIndexable = article.seoIndex !== false;
  const isFollowable = article.seoFollow !== false;

  return {
    title: rawTitle,
    description: rawDescription,
    keywords,
    authors: [{ name: authorName, url: 'https://croatiabest.com.hr' }],
    creator: 'CroatiaBest',
    publisher: 'CroatiaBest',
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      title: rawTitle,
      description: rawDescription,
      url: articleUrl,
      siteName: 'CroatiaBest',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title || rawTitle,
        },
      ],
      locale: 'hr_HR',
      type: 'article',
      publishedTime: publishDate ? new Date(publishDate).toISOString() : undefined,
      modifiedTime: modifiedDate ? new Date(modifiedDate).toISOString() : undefined,
      authors: [authorName],
      section: article.category || 'Turizam',
      tags: Array.isArray(article.tags) ? article.tags : (article.tags ? article.tags.split(',') : []),
    },
    twitter: {
      card: 'summary_large_image',
      title: rawTitle,
      description: rawDescription,
      images: [imageUrl],
      creator: '@croatiabest',
    },
    robots: {
      index: isIndexable,
      follow: isFollowable,
      googleBot: {
        index: isIndexable,
        follow: isFollowable,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
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

  // Ensure plain objects are passed to Client Components
  const safeArticle = JSON.parse(JSON.stringify(article));
  const safeRelated = JSON.parse(JSON.stringify(relatedArticles));

  if (article.created && !safeArticle.created) {
    safeArticle.created = article.created;
  }
  
  safeRelated.forEach((ra: any, idx: number) => {
    if (relatedArticles[idx].created && !ra.created) {
      ra.created = relatedArticles[idx].created;
    }
  });

  const isNews = NEWS_CATEGORIES.includes(article.category) || 
    (Array.isArray(article.tags) && (article.tags.includes('news_bot') || article.tags.includes('vijesti')));

  const articleUrl = `https://croatiabest.com.hr/blog/${article.slug || article.id}`;
  const imageUrl = article.image || 'https://croatiabest.com.hr/hero-dubrovnik.jpg';
  const publishDate = article.publishDate || article.created || new Date().toISOString();
  const modifiedDate = article.updated || article.created || new Date().toISOString();
  const authorName = article.author || 'CroatiaBest Redakcija';

  // Schema.org Structured Data: NewsArticle / BlogPosting
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': isNews ? 'NewsArticle' : 'BlogPosting',
    headline: article.title,
    alternativeHeadline: article.titleEn || undefined,
    description: article.seoDescription || article.excerpt || article.title,
    image: [imageUrl],
    datePublished: new Date(publishDate).toISOString(),
    dateModified: new Date(modifiedDate).toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://croatiabest.com.hr',
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'CroatiaBest',
      url: 'https://croatiabest.com.hr',
      logo: {
        '@type': 'ImageObject',
        url: 'https://croatiabest.com.hr/icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    articleSection: article.category || 'Vijesti',
    keywords: article.seoKeywords,
    inLanguage: ['hr', 'en'],
  };

  // Schema.org Structured Data: BreadcrumbList
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Naslovnica',
        item: 'https://croatiabest.com.hr',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isNews ? 'Vijesti' : 'Magazin',
        item: isNews ? 'https://croatiabest.com.hr/vijesti' : 'https://croatiabest.com.hr/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.category || 'Članak',
        item: isNews 
          ? `https://croatiabest.com.hr/vijesti/${(article.category || '').toLowerCase().replace(/ /g, '-')}` 
          : 'https://croatiabest.com.hr/blog',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleClient article={safeArticle} relatedArticles={safeRelated} />
    </>
  );
}
