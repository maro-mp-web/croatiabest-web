import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'hr';
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', lang);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/listing/:path*', '/blog/:path*'],
};
