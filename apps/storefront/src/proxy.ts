import { NextResponse, type NextRequest } from 'next/server';
import {
  isLocale,
  localeCookie,
  localizedPath,
  resolveLocale,
} from '@store-builder/i18n';
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (isLocale(pathname.split('/')[1])) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = localizedPath(
    pathname,
    resolveLocale(request.cookies.get(localeCookie)?.value),
  );
  return NextResponse.redirect(url);
}
export const config = {
  matcher: ['/((?!api|_next|favicon.ico|robots.txt|sitemap.xml).*)'],
};
