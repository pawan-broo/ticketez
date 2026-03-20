import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const registerRoutes = ['/login', '/signup'];
// const protectedRoutes = ['/dashboard'];

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Not logged in at all → send to admin login
  if (!sessionCookie) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // const role = (session.user as { role?: string }).role;
  // if (role !== 'ADMIN') {
  //   const homeUrl = new URL('/', req.url);
  //   return NextResponse.redirect(homeUrl);
  // }

  // if (sessionCookie && registerRoutes.includes(pathname)) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}


export const config = {
  matcher: ['/admin/:path*'],
};
