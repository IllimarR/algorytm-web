import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isLocale, type Locale } from '@/lib/i18n/messages';

const LOCALE_COOKIE = 'locale';

function pickLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const accept = request.headers.get('accept-language') ?? '';
  const first = accept.split(',')[0]?.split('-')[0]?.toLowerCase();
  if (first && isLocale(first)) return first;

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|media|font|favicon.ico|.*\\..*).*)'],
};
