'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, getDoc, onSnapshot, getFirestore, collection, query, where } from 'firebase/firestore';
import { Organization, OrganizationMember, ORGANIZATION_PERMISSIONS } from '@/lib/types';

interface OrganizationContextType {
  organization: Organization | null;
  organizationMember: OrganizationMember | null;
  userRole: 'owner' | 'admin' | 'member' | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  loading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isMember: boolean;
  refetch: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationMember, setOrganizationMember] = useState<OrganizationMember | null>(null);
  const [loading, setLoading] = useState(true);

  const userRole = organizationMember?.role || null;
  const permissions = userRole ? ORGANIZATION_PERMISSIONS[userRole] : [];
  const isOwner = userRole === 'owner';
  const isAdmin = userRole === 'admin';
  const isMember = userRole === 'member';

  const hasPermission = (permission: string): boolean => {
    if (!userRole) return false;
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  };

  const refetch = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (!user) {
      setOrganization(null);
      setOrganizationMember(null);
      setLoading(false);
      return;
    }

    const db = getFirestore();
    
    // First, get the user's organization membership
    const memberQuery = query(
      collection(db, 'organizationMembers'),
      where('userId', '==', user.uid)
    );

    const unsubscribeMember = onSnapshot(memberQuery, async (memberSnapshot) => {
      try {
        if (memberSnapshot.empty) {
          setOrganizationMember(null);
          setOrganization(null);
          setLoading(false);
          return;
        }

        const memberDoc = memberSnapshot.docs[0];
        const memberData = memberDoc.data() as OrganizationMember;
        setOrganizationMember({ ...memberData, id: memberDoc.id });

        // Now get the organization details
        const orgDoc = await getDoc(doc(db, 'organizations', memberData.organizationId));
        if (orgDoc.exists()) {
          setOrganization({ ...orgDoc.data() as Organization, id: orgDoc.id });
        } else {
          setOrganization(null);
        }
      } catch (error) {
        console.error('Error fetching organization data:', error);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeMember();
    };
  }, [user]);

  const value: OrganizationContextType = {
    organization,
    organizationMember,
    userRole,
    permissions,
    hasPermission,
    loading,
    isOwner,
    isAdmin,
    isMember,
    refetch,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}