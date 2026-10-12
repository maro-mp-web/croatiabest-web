import { NextRequest, NextResponse } from 'next/server';
import PocketBase from 'pocketbase';
import { verifyAdminRequest } from '@/lib/auth-check';

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: 'Neautoriziran pristup. Samo administrator može odobravati ili brisati članke.' }, { status: 401 });
    }

    const body = await req.json();
    const { action, articleId } = body; // action: 'approve' | 'delete'

    if (!articleId) {
      return NextResponse.json({ success: false, error: 'Nedostaje articleId' }, { status: 400 });
    }

    const pb = new PocketBase(POCKETBASE_URL);
    if (auth.token) {
      pb.authStore.save(auth.token, null);
    }

    if (action === 'approve') {
      const article = await pb.collection('blogs').getOne(articleId);
      const currentTags: string[] = Array.isArray(article.tags) ? article.tags : [];
      // Makni pending_approval i dodaj published
      const updatedTags = currentTags
        .filter(t => t !== 'pending_approval')
        .concat('published');

      await pb.collection('blogs').update(articleId, {
        tags: Array.from(new Set(updatedTags)),
      });

      return NextResponse.json({ success: true, message: 'Članak je uspješno odobren i objavljen!' });
    }

    if (action === 'delete') {
      await pb.collection('blogs').delete(articleId);
      return NextResponse.json({ success: true, message: 'Članak je uspješno obrisan.' });
    }

    return NextResponse.json({ success: false, error: 'Nepoznata akcija' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
