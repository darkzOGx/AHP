import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate required Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.warn('Firebase configuration is incomplete. Some features may not work.');
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

// Tracked Vehicles Functions
export interface TrackedVehicleData {
  id?: string;
  vehicleId: string;
  userId: string;
  status: 'tracked' | 'messaged_owner' | 'purchase_in_progress';
  note?: string;
  vehicleData?: {
    title: string;
    price?: number;
    imageUrl?: string;
    url?: string;
    location?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export async function addTrackedVehicle(
  userId: string,
  vehicleId: string,
  vehicleData: any,
  status: string = 'tracked',
  note: string = ''
): Promise<TrackedVehicleData> {
  const now = Timestamp.now();
  const docData = {
    vehicleId,
    userId,
    status: status as 'tracked' | 'messaged_owner' | 'purchase_in_progress',
    note,
    vehicleData,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(collection(db, 'trackedVehicles'), docData);
  return { id: docRef.id, ...docData };
}

export async function updateTrackedVehicle(
  trackedVehicleId: string,
  updates: Partial<TrackedVehicleData>
): Promise<void> {
  const docRef = doc(db, 'trackedVehicles', trackedVehicleId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function getTrackedVehicle(
  userId: string,
  vehicleId: string
): Promise<TrackedVehicleData | null> {
  const q = query(
    collection(db, 'trackedVehicles'),
    where('userId', '==', userId),
    where('vehicleId', '==', vehicleId)
  );
  
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as TrackedVehicleData;
}

export async function getUserTrackedVehicles(userId: string): Promise<TrackedVehicleData[]> {
  const q = query(
    collection(db, 'trackedVehicles'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as TrackedVehicleData[];
}

export async function removeTrackedVehicle(trackedVehicleId: string): Promise<void> {
  const docRef = doc(db, 'trackedVehicles', trackedVehicleId);
  await deleteDoc(docRef);
}
