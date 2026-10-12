import fs from 'fs';
import path from 'path';
import { BotConfig } from './types';

const CONFIG_PATH = path.join(process.cwd(), 'src', 'lib', 'news-bot', 'bot-settings.json');

export const DEFAULT_BOT_CONFIG: BotConfig = {
  enabled: true,
  autoPublish: true, // Po želji korisnika: automatski objavljuje, ali može se isključiti za ručno odobrenje
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

export function getBotConfig(): BotConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_BOT_CONFIG,
        ...parsed,
        sources: Array.isArray(parsed.sources) && parsed.sources.length > 0 ? parsed.sources : DEFAULT_BOT_CONFIG.sources,
      };
    }
  } catch (error) {
    console.error('Greška pri čitanju bot konfiguracije, koristim zadane postavke:', error);
  }
  return DEFAULT_BOT_CONFIG;
}

export function saveBotConfig(config: BotConfig): void {
  try {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Greška pri spremanju bot konfiguracije:', error);
    throw error;
  }
}
