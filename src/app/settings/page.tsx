'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { PhoneNumberSettings } from '@/components/settings/PhoneNumberSettings';
import { GlobalAlertSettings } from '@/components/settings/GlobalAlertSettings';
import SubscriptionStatus from '@/components/subscription/SubscriptionStatus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { Settings, User, Bell, Loader2 } from 'lucide-react';
import { Suspense, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

function SettingsPageContent() {
  const { user } = useAuth();
  const { userProfile } = useSubscription();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleSMS = async (enabled: boolean) => {
    if (!user) return;

    // Check if phone number is set before enabling SMS
    if (enabled && !user.phoneNumber) {
      toast({
        variant: 'destructive',
        title: 'Phone Number Required',
        description: 'Please add a phone number below before enabling SMS alerts.'
      });
      return;
    }

    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'alertPreferences.sms': enabled
      });

      toast({
        title: 'Success',
        description: enabled
          ? 'SMS alerts have been enabled'
          : 'SMS alerts have been disabled'
      });

      window.location.reload();

    } catch (error) {
      console.error('Error updating SMS preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update SMS preferences. Please try again.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleEmail = async (enabled: boolean) => {
    if (!user) return;

    setIsUpdating(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        'alertPreferences.email': enabled
      });

      toast({
        title: 'Success',
        description: enabled
          ? 'Email alerts have been enabled'
          : 'Email alerts have been disabled'
      });

      window.location.reload();

    } catch (error) {
      console.error('Error updating email preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update email preferences. Please try again.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto space-y-6 relative">
        {/* Loading Overlay */}
        {isUpdating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
              <Loader2 className="h-12 w-12 text-black animate-spin" />
              <p className="text-lg font-semibold text-black">Saving your changes...</p>
              <p className="text-sm text-black">Please wait</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Settings className="h-8 w-8 text-black" />
          <div>
            <h1 className="text-3xl font-headline font-bold text-black">Settings</h1>
            <p className="text-black">Manage your account and notification preferences</p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Subscription Status */}
          <SubscriptionStatus userProfile={userProfile || undefined} />

          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-black" />
                <CardTitle className="text-black">Profile Information</CardTitle>
              </div>
              <CardDescription className="text-black">
                Your basic account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-black font-medium">Name</p>
                  <p className="font-semibold text-black">{user?.displayName || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Email</p>
                  <p className="font-semibold text-black">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Global Alert Settings */}
          <GlobalAlertSettings />

          {/* Phone Number Settings */}
          <PhoneNumberSettings />

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-black" />
                <CardTitle className="text-black">Notification Preferences</CardTitle>
              </div>
              <CardDescription className="text-black">
                {user?.alertPreferences?.disableAll
                  ? 'All notifications are currently disabled globally. Enable alerts above to use these settings.'
                  : 'Control how you receive notifications for your vehicle alerts.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Email Alerts Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-alerts" className="text-base text-black font-semibold">
                      Email Alerts
                    </Label>
                    <p className="text-sm text-black">
                      Receive alert notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={user?.alertPreferences?.email ?? false}
                    onCheckedChange={handleToggleEmail}
                    disabled={isUpdating || user?.alertPreferences?.disableAll}
                  />
                </div>

                {/* SMS Alerts Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-alerts" className="text-base text-black font-semibold">
                      SMS Alerts
                    </Label>
                    <p className="text-sm text-black">
                      Receive alert notifications via text message
                      {!user?.phoneNumber && ' (Add phone number below to enable)'}
                    </p>
                  </div>
                  <Switch
                    id="sms-alerts"
                    checked={user?.alertPreferences?.sms ?? false}
                    onCheckedChange={handleToggleSMS}
                    disabled={isUpdating || user?.alertPreferences?.disableAll}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsPageContent />
    </Suspense>
  );
}