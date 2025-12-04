'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { doc, getDoc, onSnapshot, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { UserProfile, Organization, OrganizationMember } from '@/lib/types';
import { PRICING_PLANS } from '@/lib/stripe';

export function useSubscription() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationMember, setOrganizationMember] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setOrganization(null);
      setOrganizationMember(null);
      setLoading(false);
      return;
    }

    const db = getFirestore();
    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, async (doc) => {
      try {
        if (doc.exists()) {
          const userData = doc.data() as UserProfile;
          setUserProfile(userData);

          // If user is part of an organization, fetch organization details
          if (userData.organizationId) {
            // Get organization member details
            const memberQuery = query(
              collection(db, 'organizationMembers'),
              where('userId', '==', user.uid),
              where('organizationId', '==', userData.organizationId)
            );
            const memberSnapshot = await getDocs(memberQuery);
            
            if (!memberSnapshot.empty) {
              const memberData = memberSnapshot.docs[0].data() as OrganizationMember;
              setOrganizationMember({ ...memberData, id: memberSnapshot.docs[0].id });

              // Get organization details
              const orgDoc = await getDoc(doc(db, 'organizations', userData.organizationId));
              if (orgDoc.exists()) {
                setOrganization({ ...orgDoc.data() as Organization, id: orgDoc.id });
              } else {
                setOrganization(null);
              }
            } else {
              setOrganizationMember(null);
              setOrganization(null);
            }
          } else {
            setOrganizationMember(null);
            setOrganization(null);
          }
        } else {
          setUserProfile(null);
          setOrganizationMember(null);
          setOrganization(null);
        }
      } catch (error) {
        console.error('Error fetching user profile and organization:', error);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isSubscribed = () => {
    // Check individual subscription first
    const hasIndividualSub = userProfile?.subscription?.status === 'active' ||
                            userProfile?.subscription?.status === 'trialing';
    
    // If user has individual subscription, they're subscribed
    if (hasIndividualSub) return true;
    
    // Check organization subscription if user is member of an organization
    if (organization && organizationMember) {
      // Organization subscriptions are always enterprise plan and should be active
      return organization.plan === 'enterprise' && !!organization.stripeSubscriptionId;
    }
    
    return false;
  };

  const isTrialing = () => {
    return userProfile?.subscription?.status === 'trialing';
  };

  const hasActiveSubscription = () => {
    return userProfile?.subscription?.status === 'active';
  };

  const isSubscriptionExpired = () => {
    if (!userProfile?.subscription?.currentPeriodEnd) return false;
    return new Date() > userProfile.subscription.currentPeriodEnd.toDate();
  };

  const getTrialDaysRemaining = () => {
    if (!isTrialing() || !userProfile?.subscription?.trialEnd) return 0;

    const trialEnd = userProfile.subscription.trialEnd.toDate();
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, diffDays);
  };

  const getUserPlan = () => {
    // If user is part of an organization, return organization plan
    if (organization && organizationMember) {
      return organization.plan;
    }
    
    // Otherwise return individual subscription plan or default to dealer
    const plan = userProfile?.subscription?.plan || 'dealer';
    return plan as 'lite' | 'dealer' | 'enterprise';
  };

  const getAlertLimit = () => {
    const userPlan = getUserPlan();
    const planKey = userPlan.toUpperCase() as keyof typeof PRICING_PLANS;
    return PRICING_PLANS[planKey]?.maxAlerts || null; // null means unlimited
  };

  const isLitePlan = () => {
    return getUserPlan() === 'lite';
  };

  const isEnterprisePlan = () => {
    return getUserPlan() === 'enterprise';
  };

  const isInOrganization = () => {
    return !!userProfile?.organizationId;
  };

  return {
    userProfile,
    organization,
    organizationMember,
    loading,
    isSubscribed: isSubscribed(),
    isTrialing: isTrialing(),
    hasActiveSubscription: hasActiveSubscription(),
    isSubscriptionExpired: isSubscriptionExpired(),
    trialDaysRemaining: getTrialDaysRemaining(),
    subscription: userProfile?.subscription,
    getUserPlan,
    getAlertLimit,
    isLitePlan: isLitePlan(),
    isEnterprisePlan: isEnterprisePlan(),
    isInOrganization: isInOrganization(),
    alertLimit: getAlertLimit(),
  };
}