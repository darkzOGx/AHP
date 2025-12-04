import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdmin } from './firebase-admin';

export interface AuthenticatedUser {
  uid: string;
  email: string | undefined;
}

export interface AuthResult {
  success: true;
  user: AuthenticatedUser;
}

export interface AuthError {
  success: false;
  error: string;
  status: number;
}

/**
 * Verifies the Firebase ID token from the request and returns the authenticated user.
 *
 * Usage in API routes:
 * ```
 * const auth = await verifyAuth(request);
 * if (!auth.success) {
 *   return NextResponse.json({ error: auth.error }, { status: auth.status });
 * }
 * const { uid, email } = auth.user;
 * ```
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult | AuthError> {
  try {
    // Get token from middleware-set header or Authorization header
    const token = request.headers.get('x-auth-token') ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return {
        success: false,
        error: 'Authentication required',
        status: 401,
      };
    }

    // Initialize Firebase Admin
    const app = getFirebaseAdmin();
    const auth = getAuth(app);

    // Verify the ID token
    const decodedToken = await auth.verifyIdToken(token);

    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
      },
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {
      success: false,
      error: 'Invalid or expired token',
      status: 401,
    };
  }
}

/**
 * Verifies that the authenticated user matches the requested userId.
 * This prevents IDOR attacks where User A tries to access User B's resources.
 */
export function verifyOwnership(
  authenticatedUid: string,
  requestedUserId: string
): boolean {
  return authenticatedUid === requestedUserId;
}

/**
 * Combined helper that verifies auth AND ownership in one call.
 * Returns the authenticated user or an error response.
 */
export async function verifyAuthAndOwnership(
  request: NextRequest,
  requestedUserId: string
): Promise<AuthResult | AuthError> {
  const auth = await verifyAuth(request);

  if (!auth.success) {
    return auth;
  }

  if (!verifyOwnership(auth.user.uid, requestedUserId)) {
    return {
      success: false,
      error: 'Access denied: You can only access your own resources',
      status: 403,
    };
  }

  return auth;
}
