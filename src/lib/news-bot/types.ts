export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'html';
  category: string;
  enabled: boolean;
}

export interface BotConfig {
  enabled: boolean;
  autoPublish: boolean; // true = objavi automatski, false = traži odobrenje u adminu
  maxPerCategoryPerDay: number; // npr. 10
  geminiApiKey?: string;
  sources: NewsSource[];
}

export interface ScrapedArticle {
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  originalText: string;
  imageUrl?: string;
  photoSource?: string;
  pubDate?: string;
  category: string;
}

export interface ProcessedArticle {
  title: string;
  titleEn: string;
  slug: string;
  category: string;
  image: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
  seoTitle: string;
  seoTitleEn: string;
  seoDescription: string;
  seoDescriptionEn: string;
  seoKeywords: string;
  seoKeywordsEn: string;
  seoIndex: boolean;
  seoFollow: boolean;
  author: string;
  readTime: string;
  tags: string[];
  sourceUrl: string;
  sourceName: string;
}

export interface SyncLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface SyncResult {
  success: boolean;
  totalFound: number;
  imported: number;
  skippedDuplicate: number;
  skippedNoImage: number;
  skippedLimitReached: number;
  errors: number;
  logs: SyncLogEntry[];
}
