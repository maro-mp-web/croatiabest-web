import { NextRequest, NextResponse } from 'next/server';
import { getBotConfigAsync, saveBotConfigAsync } from '@/lib/news-bot/config';
import { BotConfig } from '@/lib/news-bot/types';
import { verifyAdminRequest } from '@/lib/auth-check';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Neautoriziran pristup. Samo administrator može pristupiti postavkama bota.' }, { status: 401 });
    }

    const config = await getBotConfigAsync();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Neautoriziran pristup. Samo administrator može mijenjati postavke bota.' }, { status: 401 });
    }

    const body = (await req.json()) as Partial<BotConfig>;
    const currentConfig = await getBotConfigAsync();
    const updatedConfig: BotConfig = {
      ...currentConfig,
      ...body,
      sources: body.sources || currentConfig.sources,
    };
    await saveBotConfigAsync(updatedConfig);
    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
