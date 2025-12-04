import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
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

interface VPSStats {
  vpsId: string;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  inProgressJobs: number;
  totalListingsFound: number;
  lastActivity?: string;
  averageScrapeDuration: number;
}

export async function GET(request: NextRequest) {
  try {
    // Verify internal API secret for detailed stats
    const authHeader = request.headers.get('x-api-secret');
    const isAuthorized = authHeader === process.env.INTERNAL_API_SECRET;

    // Basic health check for anyone
    if (!isAuthorized) {
      return NextResponse.json({ status: 'ok', service: 'scraper-coordinator' });
    }

    // Detailed stats for authorized requests
    const jobsRef = db.collection('scraper_jobs');
    const jobsSnapshot = await jobsRef.get();

    const vpsStats: Record<string, VPSStats> = {};
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let totalListings24h = 0;
    let totalNewListings24h = 0;

    jobsSnapshot.forEach((doc) => {
      const data = doc.data();
      const vpsId = data.vpsId as string;

      if (!vpsStats[vpsId]) {
        vpsStats[vpsId] = {
          vpsId,
          totalJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
          inProgressJobs: 0,
          totalListingsFound: 0,
          averageScrapeDuration: 0,
        };
      }

      vpsStats[vpsId].totalJobs++;

      if (data.status === 'completed') {
        vpsStats[vpsId].completedJobs++;
        vpsStats[vpsId].totalListingsFound += data.listingsFound || 0;
      } else if (data.status === 'failed') {
        vpsStats[vpsId].failedJobs++;
      } else if (data.status === 'in_progress' || data.status === 'assigned') {
        vpsStats[vpsId].inProgressJobs++;
      }

      // Track last activity
      const lastScraped = data.lastScrapedAt?.toDate();
      if (lastScraped) {
        const currentLast = vpsStats[vpsId].lastActivity
          ? new Date(vpsStats[vpsId].lastActivity!)
          : new Date(0);
        if (lastScraped > currentLast) {
          vpsStats[vpsId].lastActivity = lastScraped.toISOString();
        }

        // 24h stats
        if (lastScraped > last24Hours) {
          totalListings24h += data.listingsFound || 0;
          totalNewListings24h += data.newListingsAdded || 0;
        }
      }
    });

    // Get recent logs for more detailed metrics
    const logsRef = db.collection('scraper_logs');
    const recentLogs = await logsRef
      .where('timestamp', '>', last24Hours)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const logEntries: Array<{
      vpsId: string;
      jobId: string;
      status: string;
      listingsFound: number;
      timestamp: string;
    }> = [];

    recentLogs.forEach((doc) => {
      const data = doc.data();
      logEntries.push({
        vpsId: data.vpsId,
        jobId: data.jobId,
        status: data.status,
        listingsFound: data.listingsFound || 0,
        timestamp: data.timestamp?.toDate()?.toISOString() || 'unknown',
      });
    });

    return NextResponse.json({
      status: 'ok',
      service: 'scraper-coordinator',
      summary: {
        totalVPSInstances: Object.keys(vpsStats).length,
        totalJobsConfigured: jobsSnapshot.size,
        last24Hours: {
          totalListingsFound: totalListings24h,
          newListingsAdded: totalNewListings24h,
          jobsCompleted: recentLogs.docs.filter(d => d.data().status === 'completed').length,
        },
      },
      vpsStats: Object.values(vpsStats),
      recentActivity: logEntries.slice(0, 20),
    });
  } catch (error) {
    console.error('Error getting health stats:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
