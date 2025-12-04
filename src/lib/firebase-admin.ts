import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;

function formatPrivateKey(privateKey: string): string {
  // Remove quotes if they exist
  let formattedKey = privateKey.replace(/^"(.*)"$/, '$1');

  // Replace escaped newlines with actual newlines
  formattedKey = formattedKey.replace(/\\n/g, '\n');

  // Ensure key has proper header and footer
  if (!formattedKey.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Private key must start with "-----BEGIN PRIVATE KEY-----"');
  }

  if (!formattedKey.includes('-----END PRIVATE KEY-----')) {
    throw new Error('Private key must end with "-----END PRIVATE KEY-----"');
  }

  return formattedKey;
}

export function getFirebaseAdmin() {
  // Skip initialization during build time or when credentials are missing
  if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Firebase Admin credentials not configured. Please check FIREBASE_ADMIN_SETUP.md');
    }
    // During build time, just log a warning and continue
    console.warn('Firebase Admin credentials not available during build');
    throw new Error('Firebase Admin not available');
  }

  if (adminApp) {
    return adminApp;
  }

  // Check if we already have an initialized app
  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  // Get credentials from environment variables
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId) {
    throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required');
  }

  if (!clientEmail) {
    throw new Error('FIREBASE_CLIENT_EMAIL is required');
  }

  if (!privateKey) {
    throw new Error('FIREBASE_PRIVATE_KEY is required');
  }

  try {
    const formattedPrivateKey = formatPrivateKey(privateKey);

    // Initialize Firebase Admin
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });

    console.log('Firebase Admin initialized successfully');
    return adminApp;
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    console.error('Project ID:', projectId);
    console.error('Client Email:', clientEmail);
    console.error('Private Key length:', privateKey?.length || 0);
    console.error('Private Key starts with:', privateKey?.substring(0, 50) || 'undefined');

    throw new Error(`Failed to initialize Firebase Admin: ${(error as Error).message}`);
  }
}

export function getAdminFirestore() {
  const app = getFirebaseAdmin();
  return getFirestore(app);
}