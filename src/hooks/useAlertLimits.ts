'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useSubscription } from './useSubscription';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export function useAlertLimits() {
  const { user } = useAuth();
  const { isLitePlan, alertLimit } = useSubscription();
  const [currentAlertCount, setCurrentAlertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCurrentAlertCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'watchlist'), 
      where('userId', '==', user.uid),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setCurrentAlertCount(querySnapshot.size);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching alert count: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const canCreateAlert = () => {
    if (!isLitePlan || alertLimit === null) return true; // Unlimited for dealer plan
    return currentAlertCount < alertLimit;
  };

  const getRemainingAlerts = () => {
    if (!isLitePlan || alertLimit === null) return null; // Unlimited
    return Math.max(0, alertLimit - currentAlertCount);
  };

  const isAtLimit = () => {
    if (!isLitePlan || alertLimit === null) return false;
    return currentAlertCount >= alertLimit;
  };

  return {
    currentAlertCount,
    alertLimit,
    canCreateAlert: canCreateAlert(),
    remainingAlerts: getRemainingAlerts(),
    isAtLimit: isAtLimit(),
    isLitePlan,
    loading,
  };
}