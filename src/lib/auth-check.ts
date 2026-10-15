import { NextRequest } from 'next/server';
import PocketBase from 'pocketbase';

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || 'maro.webdeveloper@gmail.com';

export async function verifyAdminRequest(req: NextRequest): Promise<{ authorized: boolean; email?: string; token?: string }> {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    const pb = new PocketBase(POCKETBASE_URL);

    // 1. Ako je poslan Bearer token
    if (bearerToken) {
      pb.authStore.save(bearerToken, null);

      // Probaj _superusers
      try {
        const authData = await pb.collection('_superusers').authRefresh();
        const email = authData?.record?.email;
        if (email === ADMIN_EMAIL || pb.authStore.isSuperuser) {
          return { authorized: true, email: email || ADMIN_EMAIL, token: bearerToken };
        }
      } catch {}

      // Probaj users
      try {
        const authData = await pb.collection('users').authRefresh();
        const email = authData?.record?.email;
        if (email === ADMIN_EMAIL) {
          return { authorized: true, email, token: bearerToken };
        }
      } catch {}
    }

    // 2. Ako postoji pb_auth cookie
    const pbAuthCookie = req.cookies.get('pb_auth')?.value;
    if (pbAuthCookie) {
      pb.authStore.loadFromCookie(`pb_auth=${pbAuthCookie}`);
      if (pb.authStore.isValid) {
        // Probaj _superusers
        try {
          const authData = await pb.collection('_superusers').authRefresh();
          const email = authData?.record?.email;
          if (email === ADMIN_EMAIL || pb.authStore.isSuperuser) {
            return { authorized: true, email: email || ADMIN_EMAIL, token: pb.authStore.token };
          }
        } catch {}

        // Probaj users
        try {
          const authData = await pb.collection('users').authRefresh();
          const email = authData?.record?.email;
          if (email === ADMIN_EMAIL) {
            return { authorized: true, email, token: pb.authStore.token };
          }
        } catch {}
      }
    }

    // 3. Fallback za lokalni razvoj ako PocketBase nema vanjski auth
    if (process.env.NODE_ENV === 'development' && bearerToken) {
      return { authorized: true, email: ADMIN_EMAIL, token: bearerToken };
    }

    return { authorized: false };
  } catch (err) {
    return { authorized: false };
  }
}
