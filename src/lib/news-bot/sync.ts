import PocketBase from 'pocketbase';
import { getBotConfig } from './config';
import { scrapeFeed } from './scraper';
import { processArticleWithAi } from './ai-processor';
import { SyncResult, SyncLogEntry } from './types';

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function runNewsBotSync(adminToken?: string): Promise<SyncResult> {
  const logs: SyncLogEntry[] = [];
  const log = (level: SyncLogEntry['level'], message: string) => {
    logs.push({
      timestamp: new Date().toLocaleTimeString('hr-HR'),
      level,
      message,
    });
    console.log(`[NewsBot ${level.toUpperCase()}] ${message}`);
  };

  const result: SyncResult = {
    success: true,
    totalFound: 0,
    imported: 0,
    skippedDuplicate: 0,
    skippedNoImage: 0,
    skippedLimitReached: 0,
    errors: 0,
    logs,
  };

  try {
    const config = getBotConfig();
    log('info', `Pokrećem sinkronizaciju... Automatska objava: ${config.autoPublish ? 'DA' : 'NE (Zahtijeva odobrenje)'}, Dnevni limit: ${config.maxPerCategoryPerDay}/rubrika`);

    const pb = new PocketBase(POCKETBASE_URL);
    if (adminToken) {
      pb.authStore.save(adminToken, null);
    }

    // 1. Dohvaćamo postojeće članke iz PB radi sprečavanja duplikata i brojanja dnevnog limita
    let existingArticles: any[] = [];
    try {
      existingArticles = await pb.collection('blogs').getFullList({
        fields: 'id,title,slug,category,tags,created',
        requestKey: null,
      });
    } catch (e: any) {
      log('warn', `Nije uspjelo dohvaćanje postojećih članaka iz PocketBase: ${e.message}`);
    }

    // Skup postojećih URL-ova iz izvora i naslova
    const existingUrls = new Set<string>();
    const existingTitles = new Set<string>();
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const todayCountsByCategory: Record<string, number> = {};

    for (const a of existingArticles) {
      if (a.title) existingTitles.add(a.title.toLowerCase().trim());
      if (Array.isArray(a.tags)) {
        for (const t of a.tags) {
          if (typeof t === 'string' && t.startsWith('url:')) {
            existingUrls.add(t.replace('url:', '').trim());
          }
        }
      }
      // Brojimo današnje unose po kategoriji
      const itemDate = (a.created || '').slice(0, 10);
      if (itemDate === today && a.category) {
        todayCountsByCategory[a.category] = (todayCountsByCategory[a.category] || 0) + 1;
      }
    }

    const activeSources = config.sources.filter(s => s.enabled);
    log('info', `Pronađeno ${activeSources.length} aktivnih izvora vijesti.`);

    for (const source of activeSources) {
      log('info', `Dohvaćam izvor: "${source.name}" (${source.category})...`);
      const scraped = await scrapeFeed(source);
      log('info', `Dohvaćeno ${scraped.length} članaka iz izvora "${source.name}".`);

      for (const item of scraped) {
        result.totalFound++;

        // 1. Provjera fotografije (STROGI UVJET)
        if (!item.imageUrl) {
          result.skippedNoImage++;
          log('warn', `Preskačem "${item.title.slice(0, 40)}..." - Nema fotografije.`);
          continue;
        }

        // 2. Provjera duplikata po URL-u ili naslovu
        if (existingUrls.has(item.sourceUrl) || existingTitles.has(item.title.toLowerCase().trim())) {
          result.skippedDuplicate++;
          continue;
        }

        // 3. Provjera dnevnog limita po kategoriji (korisnički zadano: npr. 10 po kategoriji)
        const currentCategoryCount = todayCountsByCategory[item.category] || 0;
        if (currentCategoryCount >= config.maxPerCategoryPerDay) {
          result.skippedLimitReached++;
          log('warn', `Dosegnut dnevni limit (${config.maxPerCategoryPerDay}) za rubriku "${item.category}". Preskačem preostale vijesti.`);
          break; // prelazi na sljedeći izvor
        }

        // 4. Obrada članka s AI (prepisivanje, prijevod, SEO)
        log('info', `Obrađujem vijest: "${item.title.slice(0, 45)}..." pomoću AI...`);
        try {
          const processed = await processArticleWithAi(item, config.geminiApiKey);

          // Oznake
          const statusTag = config.autoPublish ? 'published' : 'pending_approval';
          const finalTags = [
            ...processed.tags,
            statusTag,
            `izvor:${item.sourceName}`,
            `url:${item.sourceUrl}`,
          ];

          const blogData = {
            title: processed.title,
            titleEn: processed.titleEn,
            slug: processed.slug,
            category: processed.category,
            image: processed.image,
            excerpt: processed.excerpt,
            excerptEn: processed.excerptEn,
            content: processed.content,
            contentEn: processed.contentEn,
            seoTitle: processed.seoTitle,
            seoTitleEn: processed.seoTitleEn,
            seoDescription: processed.seoDescription,
            seoDescriptionEn: processed.seoDescriptionEn,
            seoKeywords: processed.seoKeywords,
            seoKeywordsEn: processed.seoKeywordsEn,
            seoIndex: processed.seoIndex,
            seoFollow: processed.seoFollow,
            author: processed.author,
            readTime: processed.readTime,
            tags: finalTags,
          };

          await pb.collection('blogs').create(blogData);

          // Evidentiramo spremanje
          existingUrls.add(item.sourceUrl);
          existingTitles.add(processed.title.toLowerCase().trim());
          todayCountsByCategory[item.category] = (todayCountsByCategory[item.category] || 0) + 1;
          result.imported++;

          if (config.autoPublish) {
            log('success', `Uspješno objavljeno: "${processed.title.slice(0, 45)}..." (${processed.category})`);
          } else {
            log('info', `Spremljeno za odobrenje: "${processed.title.slice(0, 45)}..." (${processed.category})`);
          }
        } catch (itemErr: any) {
          result.errors++;
          log('error', `Greška pri spremanju članka "${item.title.slice(0, 30)}": ${itemErr?.message || itemErr}`);
        }
      }
    }

    log('success', `Sinkronizacija završena! Uvezeno: ${result.imported}, Duplikata: ${result.skippedDuplicate}, Bez slike: ${result.skippedNoImage}, Prekoračen limit: ${result.skippedLimitReached}`);
  } catch (error: any) {
    result.success = false;
    result.errors++;
    log('error', `Fatalna greška bota: ${error.message || error}`);
  }

  return result;
}
