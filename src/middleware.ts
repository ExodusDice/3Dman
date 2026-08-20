import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const isRealClerkKey =
  clerkKey.startsWith('pk_test_') &&
  !clerkKey.includes('mock') &&
  !clerkKey.includes('Y2xlcmsuM2RtYW4udGhhaWxhbmQuZGV2JA');

const isPublicRoute = createRouteMatcher([
  '/',
  '/request-print(.*)',
  '/free-stl(.*)',
  '/gallery(.*)',
  '/sla-guarantee(.*)',
  '/orders(.*)',
  '/admin(.*)',
  '/api/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default function middleware(request: NextRequest, event: any) {
  if (!isRealClerkKey) {
    // In local development without real Clerk keys, pass requests through directly
    return NextResponse.next();
  }

  return clerkMiddleware((auth, req) => {
    if (!isPublicRoute(req)) {
      auth().protect();
    }
  })(request, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
