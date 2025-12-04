'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { Settings, Building2, Save, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function OrganizationSettingsPage() {
  const { organization, hasPermission, loading, refetch } = useOrganization();
  const { user } = useAuth();
  const [organizationName, setOrganizationName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const canManageSettings = hasPermission('manage_settings');

  useEffect(() => {
    if (organization) {
      setOrganizationName(organization.name);
    }
  }, [organization]);

  const handleSaveSettings = async () => {
    if (!organization || !user || !organizationName.trim()) return;

    setIsSaving(true);
    const db = getFirestore();

    try {
      await updateDoc(doc(db, 'organizations', organization.id), {
        name: organizationName.trim(),
        updatedAt: new Date(),
      });

      toast.success('Organization settings updated successfully');
      refetch();
    } catch (error) {
      console.error('Error updating organization settings:', error);
      toast.error('Failed to update organization settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !organization) {
    return <div>Loading...</div>;
  }

  if (!canManageSettings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to manage organization settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organization Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your organization's basic information and settings
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder="Enter organization name"
                />
                <p className="text-sm text-gray-500">
                  This name will be displayed to all members of your organization.
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Organization ID</Label>
                <Input
                  value={organization.id}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">
                  This is your unique organization identifier.
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Created</Label>
                <Input
                  value={organization.createdAt.toDate().toLocaleDateString()}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={isSaving || organizationName === organization.name}
                >
                  {isSaving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Plan Information */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan</Label>
                  <div className="text-lg font-semibold text-blue-600 capitalize">
                    {organization.plan}
                  </div>
                </div>
                <div>
                  <Label>Base Users Included</Label>
                  <div className="text-lg font-semibold">
                    {organization.settings.maxUsers}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Additional Users</Label>
                  <div className="text-lg font-semibold">
                    {organization.settings.additionalUsers}
                  </div>
                </div>
                <div>
                  <Label>Total Users Allowed</Label>
                  <div className="text-lg font-semibold">
                    {organization.settings.maxUsers + organization.settings.additionalUsers}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  To modify your subscription or billing details, please visit the billing section.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {organization.ownerId === user?.uid && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Delete Organization</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your organization, there is no going back. This will cancel your subscription
                    and permanently delete all organization data, members, and alerts.
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Organization
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}