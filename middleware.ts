import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/(auth)') || 
                     request.nextUrl.pathname === '/login' || 
                     request.nextUrl.pathname === '/register';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isPublicRoute = request.nextUrl.pathname === '/' || 
                       request.nextUrl.pathname.startsWith('/_next') ||
                       request.nextUrl.pathname.startsWith('/static');

  // Allow public routes and API routes
  if (isPublicRoute || isApiRoute) {
    return NextResponse.next();
  }

  // Redirect to login if accessing protected routes without token
  if (!token && !isAuthPage) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth pages with token
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 