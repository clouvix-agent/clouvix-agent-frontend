import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login' || 
                      path === '/register' || 
                      path === '/verify-email' || 
                      path === '/verify-login-otp';

  // Get the token from cookies
  const token = request.cookies.get('token')?.value;

  // If the path is public and user is logged in, redirect to chat
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  // If the path is protected and user is not logged in, redirect to login
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/chat/:path*',
    '/login',
    '/register',
    '/verify-email',
    '/verify-login-otp'
  ],
}; 