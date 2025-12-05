import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const registerRoutes = ['/login', '/signup'];
// const protectedRoutes = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  console.log('sessionCookie');

  if (sessionCookie && registerRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup'],
};
