import { NextRequest, NextResponse } from 'next/server';
import { runNewsBotSync } from '@/lib/news-bot/sync';
import { getBotConfig } from '@/lib/news-bot/config';
import { verifyAdminRequest } from '@/lib/auth-check';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Dozvoljava do 60 sekundi za AI obradu na Vercel Pro/serveru

async function handleCron(req: NextRequest) {
  try {
    // 1. Sigurnosna provjera (Vercel Cron zaglavlje, CRON_SECRET ili administratorska prijava)
    const isVercelCron = !!req.headers.get('x-vercel-cron');
    const authHeader = req.headers.get('authorization') || '';
    const cronSecret = process.env.CRON_SECRET;
    const isSecretAuthorized = cronSecret && authHeader === `Bearer ${cronSecret}`;
    const isDev = process.env.NODE_ENV === 'development';

    let isAuthorized = isVercelCron || isSecretAuthorized || isDev;

    // Ako ništa od gore navedenog nije zadovoljeno, provjeravamo administratorski session
    if (!isAuthorized) {
      const adminAuth = await verifyAdminRequest(req);
      if (adminAuth.authorized) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Neautoriziran pristup cron ruti.' },
        { status: 401 }
      );
    }

    // 2. Provjera je li bot uključen u postavkama
    const config = getBotConfig();
    if (!config.enabled) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: 'Bot je isključen u administratorskim postavkama. Sinkronizacija preskočena.',
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Pokretanje automatske sinkronizacije (koristi pozadinski PB login)
    console.log('[NewsBot Cron] Započinjem automatsku sinkronizaciju vijesti...');
    const result = await runNewsBotSync();

    return NextResponse.json({
      success: result.success,
      timestamp: new Date().toISOString(),
      totalFound: result.totalFound,
      imported: result.imported,
      skippedDuplicate: result.skippedDuplicate,
      skippedNoImage: result.skippedNoImage,
      skippedLimitReached: result.skippedLimitReached,
      errors: result.errors,
      logs: result.logs.slice(-10), // Vrati zadnjih 10 logova radi preglednosti
    });
  } catch (error: any) {
    console.error('[NewsBot Cron] Fatalna greška:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Greška pri automatskom uvozu vijesti.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}
