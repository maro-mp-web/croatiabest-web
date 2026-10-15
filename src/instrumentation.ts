export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const globalWithTimer = globalThis as typeof globalThis & {
      __newsBotSchedulerInitialized?: boolean;
    };

    if (globalWithTimer.__newsBotSchedulerInitialized) {
      return;
    }
    globalWithTimer.__newsBotSchedulerInitialized = true;

    console.log('[NewsBot Scheduler] Inicijaliziran pozadinski scheduler (pokreće se svakih 60 minuta).');

    const ONE_HOUR_MS = 60 * 60 * 1000;

    // Početna sinkronizacija 10 sekundi nakon pokretanja servera
    setTimeout(async () => {
      try {
        const { getBotConfig } = await import('@/lib/news-bot/config');
        const config = getBotConfig();
        if (!config.enabled) return;
        console.log('[NewsBot Scheduler] Pokrećem inicijalnu provjeru novih vijesti...');
        const { runNewsBotSync } = await import('@/lib/news-bot/sync');
        await runNewsBotSync();
      } catch (err) {
        console.error('[NewsBot Scheduler] Greška u inicijalnoj sinkronizaciji:', err);
      }
    }, 10000);

    // Zakazujemo periodički poziv svakih 60 minuta
    setInterval(async () => {
      try {
        const { getBotConfig } = await import('@/lib/news-bot/config');
        const config = getBotConfig();
        if (!config.enabled) {
          return;
        }

        console.log('[NewsBot Scheduler] Pokrećem automatsku sinkronizaciju vijesti...');
        const { runNewsBotSync } = await import('@/lib/news-bot/sync');
        await runNewsBotSync();
      } catch (err) {
        console.error('[NewsBot Scheduler] Greška u pozadinskom scheduleru:', err);
      }
    }, ONE_HOUR_MS);
  }
}
