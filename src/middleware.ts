import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { CATEGORY_SLUG_MAP } from '@/app/lib/utils/slug';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Permanent 301 Redirect: /listing/* -> /objekt/* with normalized Croatian category slug
  if (pathname === '/listing' || pathname === '/listing/') {
    return NextResponse.redirect(new URL('/explore' + url.search, request.url), 301);
  }

  if (pathname.startsWith('/listing/')) {
    const segments = pathname.split('/').filter(Boolean); // ['listing', category?, ...rest]
    if (segments.length >= 2) {
      const rawCategory = segments[1].toLowerCase();
      const normalizedCategory = CATEGORY_SLUG_MAP[rawCategory] || rawCategory;
      const rest = segments.slice(2).join('/');
      const targetPath = rest ? `/objekt/${normalizedCategory}/${rest}` : `/explore?category=${normalizedCategory}`;
      return NextResponse.redirect(new URL(targetPath + url.search, request.url), 301);
    } else {
      return NextResponse.redirect(new URL('/explore' + url.search, request.url), 301);
    }
  }

  // 2. Permanent 301 Redirect: /objekt/* with English/unnormalized category -> normalized category
  if (pathname === '/objekt' || pathname === '/objekt/') {
    return NextResponse.redirect(new URL('/explore' + url.search, request.url), 301);
  }

  if (pathname.startsWith('/objekt/')) {
    const segments = pathname.split('/').filter(Boolean); // ['objekt', category?, ...rest]
    if (segments.length >= 2) {
      const rawCategory = segments[1].toLowerCase();
      const normalizedCategory = CATEGORY_SLUG_MAP[rawCategory];
      const rest = segments.slice(2).join('/');

      // If category alone with no listing slug, redirect to explore with category filter
      if (!rest) {
        const cat = normalizedCategory || rawCategory;
        return NextResponse.redirect(new URL(`/explore?category=${cat}` + url.search, request.url), 301);
      }

      // If category was an unnormalized English DB key, redirect to normalized Croatian slug
      if (normalizedCategory && normalizedCategory !== rawCategory) {
        const targetPath = `/objekt/${normalizedCategory}/${rest}`;
        return NextResponse.redirect(new URL(targetPath + url.search, request.url), 301);
      }
    }
  }

  const lang = url.searchParams.get('lang') || 'hr';
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', lang);

  // Basic admin route protection — check for PB auth cookie
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
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
  matcher: ['/listing/:path*', '/listing', '/objekt/:path*', '/objekt', '/blog/:path*', '/admin/:path*', '/dashboard/:path*'],
};
