import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

interface StatusReport {
  vpsId: string;
  jobId: string;
  status: 'in_progress' | 'completed' | 'failed';
  listingsFound?: number;
  newListingsAdded?: number;
  duplicatesSkipped?: number;
  errorMessage?: string;
  scrapeDuration?: number; // in seconds
}

export async function POST(request: NextRequest) {
  try {
    // Verify internal API secret
    const authHeader = request.headers.get('x-api-secret');
    if (authHeader !== process.env.INTERNAL_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as StatusReport;
    const { vpsId, jobId, status, listingsFound, newListingsAdded, duplicatesSkipped, errorMessage, scrapeDuration } = body;

    if (!vpsId || !jobId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: vpsId, jobId, status' },
        { status: 400 }
      );
    }

    const jobRef = db.collection('scraper_jobs').doc(jobId);
    const jobDoc = await jobRef.get();

    if (!jobDoc.exists) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (status === 'completed') {
      updateData.lastScrapedAt = FieldValue.serverTimestamp();
      updateData.listingsFound = listingsFound || 0;
      updateData.newListingsAdded = newListingsAdded || 0;
      updateData.duplicatesSkipped = duplicatesSkipped || 0;
      updateData.scrapeDuration = scrapeDuration || 0;
      updateData.lastError = null;
    } else if (status === 'failed') {
      updateData.lastError = errorMessage || 'Unknown error';
      updateData.errorCount = FieldValue.increment(1);
    }

    await jobRef.update(updateData);

    // Also log to scraper_logs collection for analytics
    await db.collection('scraper_logs').add({
      vpsId,
      jobId,
      status,
      listingsFound: listingsFound || 0,
      newListingsAdded: newListingsAdded || 0,
      duplicatesSkipped: duplicatesSkipped || 0,
      errorMessage: errorMessage || null,
      scrapeDuration: scrapeDuration || 0,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: `Job ${jobId} status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error reporting status:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
