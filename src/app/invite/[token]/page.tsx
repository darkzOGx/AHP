'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  getFirestore, 
  serverTimestamp 
} from 'firebase/firestore';
import { Invitation, Organization } from '@/lib/types';
import { Building2, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AcceptInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = params.token as string;

  useEffect(() => {
    if (!token) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    const db = getFirestore();
    
    try {
      // Find invitation by token
      const invitationsQuery = query(
        collection(db, 'invitations'),
        where('token', '==', token),
        where('status', '==', 'pending')
      );
      const invitationsSnapshot = await getDocs(invitationsQuery);

      if (invitationsSnapshot.empty) {
        setError('Invitation not found or already used');
        setLoading(false);
        return;
      }

      const invitationDoc = invitationsSnapshot.docs[0];
      const invitationData = { ...invitationDoc.data(), id: invitationDoc.id } as Invitation;

      // Check if invitation is expired
      if (invitationData.expiresAt.toDate() < new Date()) {
        setError('This invitation has expired');
        setLoading(false);
        return;
      }

      setInvitation(invitationData);

      // Fetch organization details
      const orgDoc = await getDoc(doc(db, 'organizations', invitationData.organizationId));
      if (orgDoc.exists()) {
        setOrganization({ ...orgDoc.data(), id: orgDoc.id } as Organization);
      }
    } catch (error) {
      console.error('Error fetching invitation:', error);
      setError('Failed to load invitation details');
    }
    
    setLoading(false);
  };

  const handleAcceptInvitation = async () => {
    if (!invitation || !organization || !user) return;

    setAccepting(true);
    const db = getFirestore();

    try {
      // Check if user's email matches invitation email
      if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
        toast.error('You must be signed in with the invited email address');
        setAccepting(false);
        return;
      }

      // Check if user is already a member of any organization
      const existingMemberQuery = query(
        collection(db, 'organizationMembers'),
        where('userId', '==', user.uid)
      );
      const existingMemberSnapshot = await getDocs(existingMemberQuery);

      if (!existingMemberSnapshot.empty) {
        toast.error('You are already a member of an organization');
        setAccepting(false);
        return;
      }

      // Add user as organization member
      await addDoc(collection(db, 'organizationMembers'), {
        organizationId: invitation.organizationId,
        userId: user.uid,
        role: invitation.role,
        permissions: [], // Will be set based on role
        invitedBy: invitation.invitedBy,
        joinedAt: serverTimestamp(),
        personalizations: {
          theme: 'default',
          dashboardLayout: 'default'
        }
      });

      // Update user profile with organization info
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        organizationId: invitation.organizationId,
        organizationRole: invitation.role,
        updatedAt: serverTimestamp(),
      });

      // Mark invitation as accepted
      await updateDoc(doc(db, 'invitations', invitation.id), {
        status: 'accepted',
        updatedAt: serverTimestamp(),
      });

      // Update billing for Enterprise organizations
      if (organization.subscription?.plan === 'enterprise') {
        try {
          const billingResponse = await fetch('/api/manage-enterprise-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add_user',
              organizationId: invitation.organizationId,
              userId: user.uid
            }),
          });

          if (!billingResponse.ok) {
            console.error('Failed to update billing after user joined');
            // Don't block the user from joining, just log the error
          }
        } catch (billingError) {
          console.error('Billing update error:', billingError);
          // Don't block the user from joining, just log the error
        }
      }

      toast.success(`Welcome to ${organization.name}!`);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!invitation) return;

    const db = getFirestore();

    try {
      await updateDoc(doc(db, 'invitations', invitation.id), {
        status: 'expired',
        updatedAt: serverTimestamp(),
      });

      toast.success('Invitation declined');
      router.push('/');
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error('Failed to decline invitation');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-700">Invitation Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <UserPlus className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              You need to sign in to accept this invitation.
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push('/signup')} className="w-full">
                Create Account
              </Button>
              <Button variant="outline" onClick={() => router.push('/login')} className="w-full">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitation || !organization) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Invitation not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Building2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <CardTitle className="text-2xl">You're Invited!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {organization.name}
            </p>
            <p className="text-gray-600">
              You've been invited to join this organization as a{' '}
              <Badge className={getRoleColor(invitation.role)}>
                {invitation.role}
              </Badge>
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">What you'll get access to:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Shared organization dashboard</li>
              <li>• Collaborative vehicle alerts</li>
              <li>• Team-based search and filtering</li>
              {invitation.role === 'admin' && (
                <>
                  <li>• User management capabilities</li>
                  <li>• Organization settings access</li>
                </>
              )}
            </ul>
          </div>

          <div className="grid gap-3">
            <Button
              onClick={handleAcceptInvitation}
              disabled={accepting}
              className="w-full"
            >
              {accepting ? (
                'Joining...'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Invitation
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDeclineInvitation}
              disabled={accepting}
              className="w-full"
            >
              Decline
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              This invitation will expire on{' '}
              {invitation.expiresAt.toDate().toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}