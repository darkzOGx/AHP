import { getAuth } from 'firebase/auth';

/**
 * Makes an authenticated API request with the current user's Firebase ID token.
 * This should be used for all protected API routes.
 *
 * @param url - The API endpoint URL
 * @param options - Fetch options (method, body, etc.)
 * @returns The fetch Response
 * @throws Error if user is not authenticated
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not authenticated');
  }

  // Get the ID token
  const idToken = await user.getIdToken();

  // Merge headers with auth token
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${idToken}`);
  headers.set('Content-Type', 'application/json');

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Helper for authenticated POST requests
 */
export async function authenticatedPost<T = unknown>(
  url: string,
  body: T
): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Helper for authenticated GET requests
 */
export async function authenticatedGet(url: string): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'GET',
  });
}
