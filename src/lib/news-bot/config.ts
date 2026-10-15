import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';
import { BotConfig } from './types';

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const CONFIG_PATH = path.join(process.cwd(), 'src', 'lib', 'news-bot', 'bot-settings.json');
const TMP_CONFIG_PATH = path.join('/tmp', 'cb_bot_settings.json');

// In-memory cache
let inMemoryCache: BotConfig | null = null;

export const DEFAULT_BOT_CONFIG: BotConfig = {
  enabled: true,
  autoPublish: true, // Automatska objava ili zahtijeva odobrenje
  maxPerCategoryPerDay: 10, // Maksimalno 10 vijesti po kategoriji na dan
  sources: [
    {
      id: 'hrturizam',
      name: 'HRTurizam.hr',
      url: 'https://hrturizam.hr/feed/',
      type: 'rss',
      category: 'Vijesti iz Hrvatske',
      enabled: true,
    },
    {
      id: 'croatiaweek',
      name: 'Croatia Week',
      url: 'https://www.croatiaweek.com/feed/',
      type: 'rss',
      category: 'Zanimljivosti',
      enabled: true,
    },
    {
      id: 'totalcroatianews',
      name: 'Total Croatia News',
      url: 'https://www.total-croatia-news.com/feed/',
      type: 'rss',
      category: 'Vijesti iz Svijeta',
      enabled: true,
    },
  ],
};

function mergeWithDefault(parsed: any): BotConfig {
  return {
    ...DEFAULT_BOT_CONFIG,
    ...parsed,
    sources: Array.isArray(parsed?.sources) && parsed.sources.length > 0 ? parsed.sources : DEFAULT_BOT_CONFIG.sources,
  };
}

export function getBotConfig(): BotConfig {
  if (inMemoryCache) {
    return inMemoryCache;
  }

  // 1. Probaj pročitati iz /tmp ako smo u serverless okruženju
  try {
    if (fs.existsSync(TMP_CONFIG_PATH)) {
      const data = fs.readFileSync(TMP_CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      inMemoryCache = mergeWithDefault(parsed);
      return inMemoryCache;
    }
  } catch {}

  // 2. Probaj pročitati iz izvornog json-a
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      inMemoryCache = mergeWithDefault(parsed);
      return inMemoryCache;
    }
  } catch {}

  inMemoryCache = DEFAULT_BOT_CONFIG;
  return DEFAULT_BOT_CONFIG;
}

export async function getBotConfigAsync(): Promise<BotConfig> {
  // 1. Probaj iz PocketBase baze podataka
  try {
    const pb = new PocketBase(POCKETBASE_URL);
    const list = await pb.collection('bot_settings').getList(1, 1, {
      filter: 'key = "default"',
      requestKey: null,
    });
    if (list.items.length > 0 && list.items[0].value) {
      const dbConfig = mergeWithDefault(list.items[0].value);
      inMemoryCache = dbConfig;
      return dbConfig;
    }
  } catch {}

  return getBotConfig();
}

export function saveBotConfig(config: BotConfig): void {
  inMemoryCache = config;

  // 1. Uvijek spremi u /tmp (dostupno za pisanje na Vercel serverlessu)
  try {
    fs.writeFileSync(TMP_CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[NewsBot Config] Neuspjelo pisanje u /tmp:', err);
  }

  // 2. Probaj spremiti u CONFIG_PATH (lokalno u razvoju), ignoriraj EROFS ako smo na Vercelu
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err: any) {
    // EROFS je normalan na Vercel poslužiteljima jer je filesystem read-only
    if (err?.code !== 'EROFS') {
      console.warn('[NewsBot Config] Upozorenje pri spremanju u mapu:', err.message);
    }
  }

  // 3. Pokreni pozadinsko spremanje u PocketBase (asinkrono, ne blokira)
  saveToPocketBase(config).catch(err => {
    console.warn('[NewsBot Config] Pozadinsko spremanje u PocketBase:', err.message);
  });
}

export async function saveBotConfigAsync(config: BotConfig): Promise<void> {
  saveBotConfig(config);
  await saveToPocketBase(config);
}

async function saveToPocketBase(config: BotConfig): Promise<void> {
  try {
    const pb = new PocketBase(POCKETBASE_URL);
    const adminEmail = process.env.PB_ADMIN_EMAIL || 'maro.webdeveloper@gmail.com';
    const adminPassword = process.env.PB_ADMIN_PASSWORD || 'Admin12345!';

    try {
      await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
    } catch {}

    const list = await pb.collection('bot_settings').getList(1, 1, {
      filter: 'key = "default"',
      requestKey: null,
    });

    if (list.items.length > 0) {
      await pb.collection('bot_settings').update(list.items[0].id, {
        value: config,
      });
    } else {
      await pb.collection('bot_settings').create({
        key: 'default',
        value: config,
      });
    }
  } catch (err: any) {
    console.warn('[NewsBot Config] PocketBase bot_settings sync info:', err.message);
  }
}
