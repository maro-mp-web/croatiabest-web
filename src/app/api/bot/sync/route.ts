import { NextRequest, NextResponse } from 'next/server';
import { runNewsBotSync } from '@/lib/news-bot/sync';
import { verifyAdminRequest } from '@/lib/auth-check';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Neautoriziran pristup. Samo administrator može pokrenuti sinkronizaciju.' }, { status: 401 });
    }

    const result = await runNewsBotSync(auth.token || undefined);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
