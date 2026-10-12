import { ScrapedArticle, ProcessedArticle } from './types';
import { generateSlug } from '@/app/lib/utils/slug';

interface GeminiAiOutput {
  titleHr: string;
  titleEn: string;
  excerptHr: string;
  excerptEn: string;
  contentHr: string;
  contentEn: string;
  seoTitleHr: string;
  seoTitleEn: string;
  seoDescriptionHr: string;
  seoDescriptionEn: string;
  seoKeywordsHr: string;
  seoKeywordsEn: string;
}

async function callGeminiApi(apiKey: string, promptText: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const json = await response.json();
  const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    throw new Error('Nema odgovora od Gemini API-ja');
  }
  return candidateText;
}

export async function processArticleWithAi(
  article: ScrapedArticle,
  geminiApiKey?: string
): Promise<ProcessedArticle> {
  const activeKey = geminiApiKey || process.env.GEMINI_API_KEY;

  let aiData: GeminiAiOutput | null = null;

  if (activeKey) {
    try {
      const prompt = `
Ti si profesionalni novinar i SEO stručnjak za turistički portal "CroatiaBest" (vodeći portal za turizam i priče o Hrvatskoj).
Tvoj zadatak je uzeti sljedeću vijest, PREPISATI je vlastitim riječima (kako Google ne bi kaznio portal zbog duplog sadržaja), prevesti na engleski i generirati sve SEO podatke.

IZVORNA VIJEST:
Naslov: ${article.title}
Tekst: ${article.originalText}
Rubrika: ${article.category}

PRAVILA:
1. "titleHr": Napiši nov, atraktivan, profesionalan naslov na hrvatskom jeziku (do 80 znakova).
2. "titleEn": Točan i privlačan prijevod naslova na engleski jezik.
3. "excerptHr": Sažetak vijesti na hrvatskom jeziku (1 do 2 rečenice).
4. "excerptEn": Sažetak vijesti na engleskom jeziku (1 do 2 rečenice).
5. "contentHr": Napiši cjelovit, novinarski članak na hrvatskom (3 do 5 odlomaka). Koristi HTML tagove (<p>, <h3>). Zadrži sve bitne činjenice, brojke i izjave, ali tekst mora biti originalan!
6. "contentEn": Cjelovit članak na engleskom jeziku s HTML tagovima (<p>, <h3>).
7. "seoTitleHr": SEO naslov za Google (max 60 znakova).
8. "seoTitleEn": SEO title za Google na engleskom (max 60 znakova).
9. "seoDescriptionHr": SEO meta opis (130-155 znakova).
10. "seoDescriptionEn": SEO meta description na engleskom (130-155 znakova).
11. "seoKeywordsHr": 5 do 8 ključnih riječi odvojenih zarezom (npr. turizam, hrvatska, jadran, sezone).
12. "seoKeywordsEn": 5 do 8 ključnih riječi na engleskom odvojenih zarezom.

Vrati ISKLJUČIVO valjani JSON objekt sa sljedećim ključevima:
{
  "titleHr": "...",
  "titleEn": "...",
  "excerptHr": "...",
  "excerptEn": "...",
  "contentHr": "...",
  "contentEn": "...",
  "seoTitleHr": "...",
  "seoTitleEn": "...",
  "seoDescriptionHr": "...",
  "seoDescriptionEn": "...",
  "seoKeywordsHr": "...",
  "seoKeywordsEn": "..."
}
`;

      const rawJson = await callGeminiApi(activeKey, prompt);
      aiData = JSON.parse(rawJson);
    } catch (err) {
      console.warn('[NewsBot] Gemini API poziv nije uspio, koristim automatsku prilagodbu:', err);
    }
  }

  // Ako Gemini nije dostupan ili je vratio grešku, koristimo automatsku stilizaciju
  const hrTitle = aiData?.titleHr || article.title;
  const enTitle = aiData?.titleEn || `${article.title} - Tourism News`;
  const hrExcerpt = aiData?.excerptHr || (article.originalText.slice(0, 160) + '...');
  const enExcerpt = aiData?.excerptEn || (article.originalText.slice(0, 160) + '...');

  let hrContent = aiData?.contentHr || `<p>${article.originalText}</p>`;
  let enContent = aiData?.contentEn || `<p>${article.originalText}</p>`;

  // Obvezna atribucija izvora i fotografije prema uputama korisnika
  const sourceAttributionHr = `
<div class="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
  <p>Izvor: <a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer" class="underline font-bold text-primary hover:text-primary/80">${article.sourceName}</a> | Foto: ${article.photoSource || article.sourceName}</p>
</div>`;

  const sourceAttributionEn = `
<div class="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
  <p>Source: <a href="${article.sourceUrl}" target="_blank" rel="noopener noreferrer" class="underline font-bold text-primary hover:text-primary/80">${article.sourceName}</a> | Photo: ${article.photoSource || article.sourceName}</p>
</div>`;

  hrContent += sourceAttributionHr;
  enContent += sourceAttributionEn;

  const baseSlug = generateSlug(hrTitle);
  const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  return {
    title: hrTitle,
    titleEn: enTitle,
    slug: uniqueSlug,
    category: article.category,
    image: article.imageUrl!,
    excerpt: hrExcerpt,
    excerptEn: enExcerpt,
    content: hrContent,
    contentEn: enContent,
    seoTitle: aiData?.seoTitleHr || `${hrTitle.slice(0, 50)} | CroatiaBest`,
    seoTitleEn: aiData?.seoTitleEn || `${enTitle.slice(0, 50)} | CroatiaBest`,
    seoDescription: aiData?.seoDescriptionHr || hrExcerpt.slice(0, 155),
    seoDescriptionEn: aiData?.seoDescriptionEn || enExcerpt.slice(0, 155),
    seoKeywords: aiData?.seoKeywordsHr || 'turizam, vijesti, hrvatska, putovanja, croatia',
    seoKeywordsEn: aiData?.seoKeywordsEn || 'croatia, tourism, travel, adriatic, news',
    seoIndex: true,
    seoFollow: true,
    author: 'CroatiaBest Redakcija',
    readTime: '3 min',
    tags: [article.category, article.sourceName, 'vijesti', 'bot'],
    sourceUrl: article.sourceUrl,
    sourceName: article.sourceName,
  };
}
