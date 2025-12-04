'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BellOff, Bell, AlertTriangle, Loader2 } from 'lucide-react';

export function GlobalAlertSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlertsDisabled = user?.alertPreferences?.disableAll ?? false;

  const handleToggleDisableAll = async (disabled: boolean) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { 
        'alertPreferences.disableAll': disabled 
      });
      
      toast({ 
        title: 'Success', 
        description: disabled 
          ? 'All alerts have been disabled' 
          : 'Alerts have been re-enabled'
      });
      
      // Force a page refresh to update the auth context
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating alert preferences:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to update alert preferences. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center rounded-lg">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-2xl">
            <Loader2 className="h-10 w-10 text-black animate-spin" />
            <p className="text-base font-semibold text-black">Saving changes...</p>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-2">
          {isAlertsDisabled ? (
            <BellOff className="h-5 w-5 text-black" />
          ) : (
            <Bell className="h-5 w-5 text-black" />
          )}
          <CardTitle className="text-black">Global Alert Settings</CardTitle>
        </div>
        <CardDescription className="text-black">
          Control all your alert notifications at once
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="disable-all-alerts" className="text-base text-black font-semibold">
              Disable all alerts
            </Label>
            <p className="text-sm text-black">
              When enabled, you won't receive any email or SMS notifications for any of your alerts
            </p>
          </div>
          <Switch
            id="disable-all-alerts"
            checked={isAlertsDisabled}
            onCheckedChange={handleToggleDisableAll}
            disabled={isSubmitting}
          />
        </div>

        {isAlertsDisabled && (
          <div className="flex items-start gap-2 p-3 bg-black border-2 border-black rounded-md">
            <AlertTriangle className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-white">All alerts are currently disabled</p>
              <p className="text-white">
                You won't receive any notifications until you re-enable alerts above.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}