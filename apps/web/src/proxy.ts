import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

// ─── Prank mode cache ─────────────────────────────────────────────────────────
// Module-level cache so we don't hit the API on every single request.
// In Node.js serverless warm instances this persists across requests.
// In Edge cold starts it resets — but the API itself has a 10s CDN cache anyway.

let prankCache: { enabled: boolean; fetchedAt: number } = {
  enabled: false,
  fetchedAt: 0,
};
const PRANK_TTL_MS = 1_000; // re-check at most every 15 seconds

async function isPrankModeEnabled(origin: string): Promise<boolean> {
  const now = Date.now();
  if (now - prankCache.fetchedAt < PRANK_TTL_MS) {
    return prankCache.enabled;
  }

  try {
    const res = await fetch(`${origin}/api/prank-check`, {
      // tell Next.js fetch cache to keep this for 10 s
      next: { revalidate: 2 },
    });
    if (res.ok) {
      const data = (await res.json()) as { enabled: boolean };
      prankCache = { enabled: data.enabled === true, fetchedAt: now };
      return prankCache.enabled;
    }
  } catch {
    // silently fail — never break the site because of a prank check
  }

  return false;
}

// ─── Routes that must NEVER be rewritten ─────────────────────────────────────
function shouldSkipPrankCheck(pathname: string): boolean {
  return (
    pathname === '/prank' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    /\.(mp3|mp4|wav|ogg|webm|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|otf|ttf)$/.test(pathname)
  );
}
// ─── Main proxy ───────────────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.nextUrl.origin;

  // ── 1. Prank mode — checked first for ALL routes ──────────────────────────
  if (!shouldSkipPrankCheck(pathname)) {
    const pranked = await isPrankModeEnabled(origin);
    if (pranked) {
      // Rewrite the URL — the user still sees the original URL in their browser
      // but Next.js serves /prank content instead
      const prankUrl = request.nextUrl.clone();
      prankUrl.pathname = '/prank';
      return NextResponse.rewrite(prankUrl);
    }
  }

  // ── 2. Admin route guard ───────────────────────────────────────────────────
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Admin login is always accessible
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Must have a session cookie to reach any other /admin/* route
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Role check happens inside each admin page via <AdminGuard>
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
