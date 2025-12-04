'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/hooks/useAuth';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { OrganizationMember, Invitation } from '@/lib/types';
import { Users, Plus, Mail, MoreHorizontal, UserMinus, Shield, Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function OrganizationMembersPage() {
  const { organization, hasPermission, userRole, loading } = useOrganization();
  const { user } = useAuth();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const canManageUsers = hasPermission('manage_users');
  const canInviteUsers = hasPermission('invite_users');

  useEffect(() => {
    if (!organization) return;

    fetchMembersAndInvitations();
  }, [organization]);

  const fetchMembersAndInvitations = async () => {
    if (!organization) return;

    const db = getFirestore();
    
    try {
      // Fetch members
      const membersQuery = query(
        collection(db, 'organizationMembers'),
        where('organizationId', '==', organization.id)
      );
      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as OrganizationMember[];
      setMembers(membersData);

      // Fetch pending invitations
      const invitationsQuery = query(
        collection(db, 'invitations'),
        where('organizationId', '==', organization.id),
        where('status', '==', 'pending')
      );
      const invitationsSnapshot = await getDocs(invitationsQuery);
      const invitationsData = invitationsSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Invitation[];
      setInvitations(invitationsData);
    } catch (error) {
      console.error('Error fetching members and invitations:', error);
      toast.error('Failed to load team members');
    }
    
    setLoadingMembers(false);
  };

  const handleInviteUser = async () => {
    if (!organization || !user || !inviteEmail.trim()) return;

    const db = getFirestore();
    
    try {
      // Check if user is already invited or a member
      const existingMember = members.find(m => m.userId === inviteEmail);
      const existingInvite = invitations.find(i => i.email === inviteEmail);
      
      if (existingMember || existingInvite) {
        toast.error('User is already a member or has a pending invitation');
        return;
      }

      // Check user limits for Enterprise organizations
      const currentTotalUsers = members.length + invitations.length;
      const isEnterprise = organization.subscription?.plan === 'enterprise';
      
      if (isEnterprise) {
        // Enterprise: 3 base users + unlimited additional (but check billing)
        const maxUsers = (organization.settings?.maxUsers || 3) + (organization.settings?.additionalUsers || 0);
        
        if (currentTotalUsers >= maxUsers && maxUsers > 3) {
          // For enterprise, we allow going over but will add billing
          const additionalUserCost = 99; // $99/month per additional user
          
          if (!confirm(`Adding this user will increase your monthly bill by $${additionalUserCost}. Continue?`)) {
            return;
          }
        }
      } else {
        // Non-enterprise plans have strict limits
        const planLimits = {
          lite: 1,
          dealer: 1
        };
        const maxUsers = planLimits[organization.subscription?.plan as keyof typeof planLimits] || 1;
        
        if (currentTotalUsers >= maxUsers) {
          toast.error(`Your ${organization.subscription?.plan || 'current'} plan supports up to ${maxUsers} user(s). Upgrade to Enterprise for team collaboration.`);
          return;
        }
      }

      // Generate invitation token
      const token = Math.random().toString(36).substr(2, 32);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

      // Create invitation
      const invitationDoc = await addDoc(collection(db, 'invitations'), {
        organizationId: organization.id,
        email: inviteEmail.toLowerCase(),
        role: inviteRole,
        invitedBy: user.uid,
        token,
        status: 'pending',
        expiresAt,
        createdAt: serverTimestamp(),
      });

      // Send invitation email
      try {
        const emailResponse = await fetch('/api/send-invitation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: inviteEmail.toLowerCase(),
            organizationName: organization.name,
            role: inviteRole,
            inviteToken: token,
            inviterName: user.displayName || user.email
          }),
        });

        if (!emailResponse.ok) {
          throw new Error('Failed to send invitation email');
        }

        toast.success(`Invitation sent to ${inviteEmail}`);
      } catch (emailError) {
        console.error('Error sending invitation email:', emailError);
        toast.error('Invitation created but email failed to send. Please share the invitation link manually.');
        
        // Show the invitation link for manual sharing
        const inviteUrl = `${window.location.origin}/invite/${token}`;
        navigator.clipboard.writeText(inviteUrl).then(() => {
          toast.success('Invitation link copied to clipboard');
        });
      }

      setInviteEmail('');
      setIsInviteModalOpen(false);
      fetchMembersAndInvitations();
      
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error('Failed to create invitation');
    }
  };

  const handleRemoveInvitation = async (invitationId: string) => {
    const db = getFirestore();
    
    try {
      await deleteDoc(doc(db, 'invitations', invitationId));
      toast.success('Invitation cancelled');
      fetchMembersAndInvitations();
    } catch (error) {
      console.error('Error removing invitation:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member? This will immediately adjust your billing.')) return;

    const db = getFirestore();
    
    try {
      // Remove the member
      await deleteDoc(doc(db, 'organizationMembers', memberId));
      
      // Update billing for Enterprise organizations
      if (organization?.subscription?.plan === 'enterprise') {
        try {
          const billingResponse = await fetch('/api/manage-enterprise-users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'remove_user',
              organizationId: organization.id,
              userId: memberId
            }),
          });

          if (!billingResponse.ok) {
            console.error('Failed to update billing after member removal');
            toast.error('Member removed but billing update failed. Please contact support.');
          } else {
            toast.success('Team member removed and billing updated');
          }
        } catch (billingError) {
          console.error('Billing update error:', billingError);
          toast.error('Member removed but billing update failed. Please contact support.');
        }
      } else {
        toast.success('Team member removed');
      }
      
      fetchMembersAndInvitations();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove team member');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !organization) {
    return <div>Loading...</div>;
  }

  if (!canManageUsers && !canInviteUsers) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to view team members.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{organization.name} Team</h1>
            <p className="text-gray-600 mt-2">
              Manage your organization members and invitations
            </p>
          </div>

          {canInviteUsers && (
            <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={(value: 'admin' | 'member') => setInviteRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteUser}>
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid gap-6">
          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members ({members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMembers ? (
                <div>Loading members...</div>
              ) : members.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No team members yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {getRoleIcon(member.role)}
                        </div>
                        <div>
                          <div className="font-medium">{member.userId}</div>
                          <div className="text-sm text-gray-500">
                            Joined {member.joinedAt.toDate().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleColor(member.role)}>
                          {member.role}
                        </Badge>
                        {canManageUsers && member.role !== 'owner' && member.userId !== user?.uid && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Pending Invitations ({invitations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium">{invitation.email}</div>
                          <div className="text-sm text-gray-500">
                            Invited {invitation.createdAt.toDate().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleColor(invitation.role)}>
                          {invitation.role}
                        </Badge>
                        <Badge variant="outline">
                          Pending
                        </Badge>
                        {canManageUsers && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveInvitation(invitation.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}