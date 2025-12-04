'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  getFirestore,
  serverTimestamp
} from 'firebase/firestore';
import { UserVehicleInteraction, VehicleStatus } from '@/lib/types';
import { TrackedVehicleData } from '@/lib/firebase';

export function useVehicleInteraction(vehicleId?: string) {
  const { user } = useAuth();
  const [interaction, setInteraction] = useState<UserVehicleInteraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || !vehicleId) {
      setInteraction(null);
      setLoading(false);
      return;
    }

    // Skip if Firebase is not configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn('Firebase not configured, skipping vehicle interaction');
      setLoading(false);
      return;
    }

    const db = getFirestore();
    const interactionRef = doc(db, 'userVehicleInteractions', `${user.uid}_${vehicleId}`);

    const unsubscribe = onSnapshot(interactionRef, (doc) => {
      if (doc.exists()) {
        setInteraction({ id: doc.id, ...doc.data() } as UserVehicleInteraction);
      } else {
        setInteraction(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching vehicle interaction:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, vehicleId]);

  const saveInteraction = async (
    status?: VehicleStatus,
    note?: string,
    vehicleData?: UserVehicleInteraction['vehicleData']
  ) => {
    if (!user || !vehicleId) return;

    setSaving(true);
    const db = getFirestore();
    const interactionRef = doc(db, 'userVehicleInteractions', `${user.uid}_${vehicleId}`);

    try {
      const now = serverTimestamp();

      if (interaction) {
        // Update existing interaction
        await updateDoc(interactionRef, {
          ...(status !== undefined && { status }),
          ...(note !== undefined && { note }),
          updatedAt: now,
        });
      } else {
        // Create new interaction
        await setDoc(interactionRef, {
          userId: user.uid,
          vehicleId,
          ...(status && { status }),
          ...(note && { note }),
          ...(vehicleData && { vehicleData }),
          createdAt: now,
          updatedAt: now,
        });
      }
    } catch (error) {
      console.error('Error saving vehicle interaction:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (status: VehicleStatus) => {
    await saveInteraction(status, undefined);
  };

  const updateNote = async (note: string) => {
    await saveInteraction(undefined, note);
  };

  const clearStatus = async () => {
    if (!user || !vehicleId || !interaction) return;

    setSaving(true);
    const db = getFirestore();
    const interactionRef = doc(db, 'userVehicleInteractions', `${user.uid}_${vehicleId}`);

    try {
      if (interaction.note) {
        // Keep the interaction but remove status
        await updateDoc(interactionRef, {
          status: null,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Remove entire interaction if no note
        await updateDoc(interactionRef, {
          status: null,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error clearing vehicle status:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    interaction,
    loading,
    saving,
    saveInteraction,
    updateStatus,
    updateNote,
    clearStatus,
  };
}

export function useTrackedVehicles(statusFilter?: VehicleStatus) {
  const { user } = useAuth();
  const [trackedVehicles, setTrackedVehicles] = useState<UserVehicleInteraction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTrackedVehicles([]);
      setLoading(false);
      return;
    }

    // Skip if Firebase is not configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn('Firebase not configured, skipping tracked vehicles');
      setLoading(false);
      return;
    }

    const db = getFirestore();
    const q = query(
      collection(db, 'userVehicleInteractions'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vehicles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserVehicleInteraction[];

      // Filter by status if specified
      const filteredVehicles = statusFilter
        ? vehicles.filter(v => v.status === statusFilter)
        : vehicles;

      setTrackedVehicles(filteredVehicles);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching tracked vehicles:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, statusFilter]);

  return { trackedVehicles, loading };
}

export function useVehicleAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    // Skip if Firebase is not configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn('Firebase not configured, skipping vehicle alerts');
      setLoading(false);
      return;
    }

    const db = getFirestore();
    const q = query(
      collection(db, 'alerts'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Sort by timestamp desc
      alertsData.sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(0);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setAlerts(alertsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching vehicle alerts:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { alerts, loading };
}

// New hook for the actual tracked vehicles collection
export function useTrackedVehiclesFromCollection(statusFilter?: VehicleStatus) {
  const { user } = useAuth();
  const [trackedVehicles, setTrackedVehicles] = useState<TrackedVehicleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTrackedVehicles([]);
      setLoading(false);
      return;
    }

    // Skip if Firebase is not configured
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      console.warn('Firebase not configured, skipping tracked vehicles from collection');
      setLoading(false);
      return;
    }

    const db = getFirestore();

    // Simple query without orderBy to avoid index issues
    let q = query(
      collection(db, 'trackedVehicles'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('📊 Tracked vehicles query result:', snapshot.size, 'documents');

      let vehicles = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('🚗 Vehicle data:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data
        };
      }) as TrackedVehicleData[];

      // Sort by updatedAt in memory (client-side)
      vehicles = vehicles.sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.() || a.updatedAt || new Date(0);
        const bTime = b.updatedAt?.toDate?.() || b.updatedAt || new Date(0);
        return bTime.getTime() - aTime.getTime();
      });

      // Filter by status if specified
      const filteredVehicles = statusFilter
        ? vehicles.filter(v => v.status === statusFilter)
        : vehicles;

      console.log('✅ Final tracked vehicles:', filteredVehicles.length);
      setTrackedVehicles(filteredVehicles);
      setLoading(false);
    }, (error) => {
      console.error('❌ Error fetching tracked vehicles:', error);
      console.error('Error details:', error.code, error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, statusFilter]);

  return { trackedVehicles, loading };
}