import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'hr';
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', lang);

  // Basic admin route protection — check for PB auth cookie
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard')) {
    const pbAuth = request.cookies.get('pb_auth');
    if (!pbAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/listing/:path*', '/objekt/:path*', '/blog/:path*', '/admin/:path*', '/dashboard/:path*'],
};
