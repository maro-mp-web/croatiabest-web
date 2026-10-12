import { NewsSource, ScrapedArticle } from './types';

// Helper za čišćenje HTML-a i CDATA blokova
function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Dohvaća OpenGraph sliku s web stranice ako u RSS-u nema slike
async function fetchOgImage(url: string): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return undefined;
    const html = await res.text();
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
                    html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (ogMatch && ogMatch[1] && ogMatch[1].startsWith('http')) {
      return ogMatch[1];
    }
  } catch {
    // ignoriramo grešku timeouta
  }
  return undefined;
}

export async function scrapeFeed(source: NewsSource): Promise<ScrapedArticle[]> {
  const articles: ScrapedArticle[] = [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CroatiaBest-NewsBot/1.0 (+https://croatiabest.hr)',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[NewsBot] Izvor ${source.name} vratio status ${res.status}`);
      return articles;
    }

    const xml = await res.text();
    // Parsiramo <item> blokove iz RSS / Atom feeda
    const rawItems = xml.split(/<item[\s>]/i).slice(1);

    for (const rawItem of rawItems.slice(0, 15)) {
      const titleMatch = rawItem.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = rawItem.match(/<link>([\s\S]*?)<\/link>/i) || rawItem.match(/<link[^>]+href=["']([^"']+)["']/i);
      const descMatch = rawItem.match(/<description>([\s\S]*?)<\/description>/i) || rawItem.match(/<content:encoded>([\s\S]*?)<\/content:encoded>/i);
      const pubDateMatch = rawItem.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);

      let title = cleanText(titleMatch?.[1] || '');
      let link = (linkMatch?.[1] || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
      let originalText = cleanText(descMatch?.[1] || '');
      const pubDate = pubDateMatch?.[1]?.trim();

      if (!title || !link) continue;

      // Tražimo sliku u enclosure ili media:content
      let imageUrl: string | undefined;
      const encMatch = rawItem.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
      const mediaMatch = rawItem.match(/<media:content[^>]+url=["']([^"']+)["']/i) || rawItem.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
      const imgInDesc = rawItem.match(/<img[^>]+src=["']([^"']+)["']/i);

      if (encMatch?.[1] && encMatch[1].startsWith('http')) {
        imageUrl = encMatch[1];
      } else if (mediaMatch?.[1] && mediaMatch[1].startsWith('http')) {
        imageUrl = mediaMatch[1];
      } else if (imgInDesc?.[1] && imgInDesc[1].startsWith('http')) {
        imageUrl = imgInDesc[1];
      }

      // Ako u samom RSS feedu nema slike, probaj dohvatit OpenGraph s originalnog URL-a
      if (!imageUrl && link.startsWith('http')) {
        imageUrl = await fetchOgImage(link);
      }

      // STROGI UVJET KORISNIKA: Bez slike se vijest NIKADA ne objavljuje!
      if (!imageUrl) {
        continue;
      }

      // Izvor fotografije
      let photoSource = source.name;
      if (rawItem.includes('media:credit')) {
        const creditMatch = rawItem.match(/<media:credit[^>]*>([\s\S]*?)<\/media:credit>/i);
        if (creditMatch?.[1]) {
          photoSource = cleanText(creditMatch[1]);
        }
      }

      articles.push({
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: link,
        title,
        originalText: originalText || title,
        imageUrl,
        photoSource,
        pubDate,
        category: source.category,
      });
    }
  } catch (error) {
    console.error(`[NewsBot] Greška pri dohvaćanju izvora ${source.name}:`, error);
  }

  return articles;
}
