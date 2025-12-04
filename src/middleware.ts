import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * API Route Protection Middleware
 *
 * This middleware protects API routes by:
 * 1. Requiring authentication for protected routes
 * 2. Blocking deprecated/dangerous routes
 * 3. Passing auth context to route handlers
 */

// Routes that require authentication (user must be logged in)
const PROTECTED_API_ROUTES = [
  '/api/create-checkout-session',
  '/api/create-portal-session',
  '/api/create-upgrade-session',
  '/api/manage-enterprise-users',
  '/api/send-invitation',
  '/api/sync-subscription',
];

// Routes that should be completely blocked/removed
const BLOCKED_ROUTES = [
  '/api/debug-subscription',
  '/api/test-upgrade-email',
];

// Routes that don't require auth (webhooks, public endpoints)
const PUBLIC_API_ROUTES = [
  '/api/webhooks/stripe',
  '/api/proxy-image',
  '/api/vehicle-report',
];

// Internal API routes (require x-api-secret header, not user auth)
// These are for server-to-server communication like scrapers
const INTERNAL_API_ROUTES = [
  '/api/scraper/get-job',
  '/api/scraper/report-status',
  '/api/scraper/health',
  '/api/send-welcome-email',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Block deprecated/dangerous routes
  if (BLOCKED_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.json(
      { error: 'This endpoint has been disabled' },
      { status: 404 }
    );
  }

  // Skip auth for public routes
  if (PUBLIC_API_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Internal routes require x-api-secret (handled in route handler)
  // Let them through without user auth check
  if (INTERNAL_API_ROUTES.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if this is a protected API route
  if (PROTECTED_API_ROUTES.some(route => path.startsWith(route))) {
    // Get the Authorization header
    const authHeader = request.headers.get('authorization');

    // Also check for Firebase ID token in cookies (for browser requests)
    const sessionCookie = request.cookies.get('__session')?.value;

    // For API routes called from the client, we expect the Firebase ID token
    // to be sent in the Authorization header as "Bearer <token>"
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : sessionCookie;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Note: Full token verification happens in the route handler using Firebase Admin
    // The middleware passes the token along for verification
    // This is because Edge Runtime (middleware) has limited crypto support

    // Clone the request and add the token to headers for route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-auth-token', token);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // For non-API routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};
