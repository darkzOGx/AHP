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

// VPS configuration - which states each VPS handles
const VPS_STATES: Record<string, string[]> = {
  'vps-1': ['california', 'nevada', 'oregon'],
  'vps-2': ['arizona', 'washington', 'colorado', 'utah'],
  'vps-3': ['texas', 'new-mexico', 'oklahoma'],
  'vps-4': ['illinois', 'ohio', 'michigan', 'indiana', 'wisconsin'],
  'vps-5': ['florida', 'georgia', 'north-carolina', 'south-carolina', 'tennessee'],
};

// Cities by state (matching cities.json structure)
const CITIES_BY_STATE: Record<string, string[]> = {
  'california': [
    'los-angeles', 'san-diego', 'san-jose', 'san-francisco', 'fresno',
    'sacramento', 'oakland', 'bakersfield', 'stockton', 'riverside',
    'santa-ana', 'anaheim', 'irvine', 'long-beach', 'modesto',
    'glendale', 'huntington-beach', 'santa-clarita', 'garden-grove',
    'oceanside', 'rancho-cucamonga', 'ontario-ca', 'santa-rosa', 'elk-grove',
    'corona', 'lancaster', 'palmdale', 'salinas', 'pomona', 'hayward',
    'escondido', 'sunnyvale', 'torrance', 'pasadena', 'orange-ca',
    'fullerton', 'thousand-oaks', 'roseville', 'concord', 'simi-valley',
    'santa-clara', 'victorville', 'vallejo', 'berkeley', 'el-monte',
    'downey', 'costa-mesa', 'inglewood', 'san-buenaventura', 'murrieta'
  ],
  'arizona': [
    'phoenix', 'tucson', 'mesa', 'chandler', 'scottsdale',
    'glendale-az', 'gilbert', 'tempe', 'peoria-az', 'surprise',
    'yuma', 'avondale', 'goodyear', 'flagstaff', 'buckeye'
  ],
  'nevada': [
    'las-vegas', 'henderson', 'reno', 'north-las-vegas', 'sparks',
    'carson-city', 'elko', 'boulder-city'
  ],
  'oregon': [
    'portland', 'salem', 'eugene', 'gresham', 'hillsboro',
    'beaverton', 'bend', 'medford', 'springfield-or', 'corvallis'
  ],
  'washington': [
    'seattle', 'spokane', 'tacoma', 'vancouver-wa', 'bellevue',
    'kent', 'everett', 'renton', 'spokane-valley', 'federal-way',
    'yakima', 'bellingham', 'kirkland', 'auburn-wa', 'redmond'
  ],
  'colorado': [
    'denver', 'colorado-springs', 'aurora-co', 'fort-collins', 'lakewood',
    'thornton', 'arvada', 'westminster-co', 'pueblo', 'centennial',
    'boulder', 'greeley', 'longmont', 'loveland'
  ],
  'utah': [
    'salt-lake-city', 'west-valley-city', 'provo', 'west-jordan', 'orem',
    'sandy', 'ogden', 'st-george', 'layton', 'south-jordan'
  ],
  'texas': [
    'houston', 'san-antonio', 'dallas', 'austin', 'fort-worth',
    'el-paso', 'arlington-tx', 'corpus-christi', 'plano', 'laredo',
    'lubbock', 'garland', 'irving', 'amarillo', 'grand-prairie',
    'brownsville', 'mckinney', 'frisco', 'pasadena-tx', 'killeen',
    'mcallen', 'mesquite', 'midland', 'denton', 'waco',
    'carrollton', 'round-rock', 'abilene', 'pearland', 'richardson',
    'college-station', 'league-city', 'sugar-land', 'longview', 'beaumont',
    'odessa', 'tyler', 'conroe', 'new-braunfels', 'edinburg'
  ],
  'new-mexico': [
    'albuquerque', 'las-cruces', 'rio-rancho', 'santa-fe', 'roswell',
    'farmington', 'clovis-nm'
  ],
  'oklahoma': [
    'oklahoma-city', 'tulsa', 'norman', 'broken-arrow', 'lawton',
    'edmond', 'moore', 'midwest-city'
  ],
  'illinois': [
    'chicago', 'aurora-il', 'rockford', 'joliet', 'naperville',
    'springfield-il', 'peoria-il', 'elgin', 'waukegan', 'champaign'
  ],
  'ohio': [
    'columbus', 'cleveland', 'cincinnati', 'toledo', 'akron',
    'dayton', 'parma', 'canton', 'youngstown', 'lorain'
  ],
  'michigan': [
    'detroit', 'grand-rapids', 'warren', 'sterling-heights', 'ann-arbor',
    'lansing', 'flint', 'dearborn', 'livonia', 'troy-mi'
  ],
  'indiana': [
    'indianapolis', 'fort-wayne', 'evansville', 'south-bend', 'carmel',
    'fishers', 'bloomington-in', 'hammond', 'gary', 'muncie'
  ],
  'wisconsin': [
    'milwaukee', 'madison', 'green-bay', 'kenosha', 'racine',
    'appleton', 'waukesha', 'eau-claire', 'oshkosh', 'janesville'
  ],
  'florida': [
    'jacksonville', 'miami', 'tampa', 'orlando', 'st-petersburg',
    'hialeah', 'tallahassee', 'fort-lauderdale', 'port-st-lucie', 'cape-coral',
    'pembroke-pines', 'hollywood-fl', 'miramar', 'gainesville-fl', 'coral-springs',
    'miami-gardens', 'clearwater', 'palm-bay', 'pompano-beach', 'west-palm-beach',
    'lakeland', 'davie', 'boca-raton', 'sunrise', 'plantation',
    'deltona', 'fort-myers', 'palm-coast', 'deerfield-beach', 'melbourne-fl'
  ],
  'georgia': [
    'atlanta', 'augusta', 'columbus-ga', 'macon', 'savannah',
    'athens', 'sandy-springs', 'roswell-ga', 'johns-creek', 'albany-ga',
    'warner-robins', 'alpharetta', 'marietta', 'valdosta', 'smyrna-ga'
  ],
  'north-carolina': [
    'charlotte', 'raleigh', 'greensboro', 'durham', 'winston-salem',
    'fayetteville', 'cary', 'wilmington-nc', 'high-point', 'greenville-nc',
    'asheville', 'concord-nc', 'gastonia', 'jacksonville-nc', 'chapel-hill'
  ],
  'south-carolina': [
    'charleston', 'columbia-sc', 'north-charleston', 'mount-pleasant', 'rock-hill',
    'greenville-sc', 'summerville', 'goose-creek', 'hilton-head', 'spartanburg'
  ],
  'tennessee': [
    'nashville', 'memphis', 'knoxville', 'chattanooga', 'clarksville',
    'murfreesboro', 'franklin-tn', 'jackson-tn', 'johnson-city', 'bartlett'
  ],
};

// How long before a city can be re-scraped (in milliseconds)
const SCRAPE_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

interface JobAssignment {
  vpsId: string;
  city: string;
  state: string;
  assignedAt: FirebaseFirestore.Timestamp;
  status: 'assigned' | 'in_progress' | 'completed' | 'failed';
  lastScrapedAt?: FirebaseFirestore.Timestamp;
  listingsFound?: number;
  errorCount?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Verify internal API secret
    const authHeader = request.headers.get('x-api-secret')?.trim();
    const envSecret = process.env.INTERNAL_API_SECRET?.trim();

    console.log('Auth check:', {
      hasAuthHeader: !!authHeader,
      hasEnvSecret: !!envSecret,
      authHeaderLength: authHeader?.length,
      envSecretLength: envSecret?.length,
      match: authHeader === envSecret
    });

    if (!authHeader || !envSecret || authHeader !== envSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { vpsId } = body;

    if (!vpsId || !VPS_STATES[vpsId]) {
      return NextResponse.json(
        { error: 'Invalid VPS ID', validIds: Object.keys(VPS_STATES) },
        { status: 400 }
      );
    }

    const assignedStates = VPS_STATES[vpsId];
    const now = new Date();
    const cooldownThreshold = new Date(now.getTime() - SCRAPE_COOLDOWN_MS);

    // Get all cities for this VPS's assigned states
    const allCities: { city: string; state: string }[] = [];
    for (const state of assignedStates) {
      const cities = CITIES_BY_STATE[state] || [];
      for (const city of cities) {
        allCities.push({ city, state });
      }
    }

    if (allCities.length === 0) {
      return NextResponse.json({ error: 'No cities configured for this VPS' }, { status: 400 });
    }

    // Check job assignments collection for this VPS
    const jobsRef = db.collection('scraper_jobs');

    // Find cities that haven't been scraped recently or are not currently assigned
    for (const { city, state } of allCities) {
      const docId = `${vpsId}_${city}`;
      const jobDoc = await jobsRef.doc(docId).get();

      if (!jobDoc.exists) {
        // City has never been scraped - assign it
        await jobsRef.doc(docId).set({
          vpsId,
          city,
          state,
          assignedAt: FieldValue.serverTimestamp(),
          status: 'assigned',
          errorCount: 0,
        });

        return NextResponse.json({
          success: true,
          job: {
            city,
            state,
            jobId: docId,
            isNewJob: true,
          },
        });
      }

      const jobData = jobDoc.data() as JobAssignment;

      // Skip if currently in progress
      if (jobData.status === 'in_progress') {
        continue;
      }

      // Check if cooldown has passed
      const lastScraped = jobData.lastScrapedAt?.toDate();
      if (!lastScraped || lastScraped < cooldownThreshold) {
        // City is ready to be scraped again
        await jobsRef.doc(docId).update({
          assignedAt: FieldValue.serverTimestamp(),
          status: 'assigned',
        });

        return NextResponse.json({
          success: true,
          job: {
            city,
            state,
            jobId: docId,
            isNewJob: false,
            lastScrapedAt: lastScraped?.toISOString(),
          },
        });
      }
    }

    // All cities are on cooldown or in progress
    return NextResponse.json({
      success: true,
      job: null,
      message: 'All cities are on cooldown or being scraped',
      nextAvailableIn: '4 hours or less',
    });
  } catch (error) {
    console.error('Error getting job:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Simple health check
  return NextResponse.json({ status: 'ok', service: 'scraper-coordinator' });
}
