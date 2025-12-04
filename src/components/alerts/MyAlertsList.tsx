'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAlertLimits } from '@/hooks/useAlertLimits';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, doc, deleteDoc, orderBy, where } from 'firebase/firestore';
import type { Watchlist } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit, Loader2, AlertTriangle, Settings, Crown } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { EditAlertForm } from './EditAlertForm';
import { useToast } from '@/hooks/use-toast';

export function MyAlertsList() {
  const { user } = useAuth();
  const { currentAlertCount, alertLimit, isLitePlan, isAtLimit } = useAlertLimits();
  const [alerts, setAlerts] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAlert, setEditingAlert] = useState<Watchlist | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, 'watchlist'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const alertsData: Watchlist[] = [];
      querySnapshot.forEach((doc) => {
        alertsData.push({ id: doc.id, ...doc.data() } as Watchlist);
      });
      setAlerts(alertsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching alerts: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your alerts.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleDelete = async (alertId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'watchlist', alertId));
      toast({ title: 'Success', description: 'Alert deleted successfully.' });
    } catch (error) {
      console.error("Error deleting alert: ", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete alert.' });
    }
  };

  const getAlertDescription = (alert: Watchlist) => {
    const criteria: string[] = [];
    if (alert.manufacturer) {
      criteria.push(`Manufacturer: ${alert.manufacturer}`);
    }
    if (alert.model) {
      criteria.push(`Model: ${alert.model}`);
    }
    if (alert.minPrice != null && alert.maxPrice != null) {
      criteria.push(`Price: $${alert.minPrice.toLocaleString()}-$${alert.maxPrice.toLocaleString()}`);
    }
    if (alert.minYear && alert.maxYear) {
      criteria.push(`Year: ${alert.minYear}-${alert.maxYear}`);
    }
    if (alert.minMileage != null && alert.maxMileage != null) {
      criteria.push(`Mileage: ${alert.minMileage.toLocaleString()}-${alert.maxMileage.toLocaleString()}`);
    }
    if (alert.zipCode && alert.radiusMiles) {
      criteria.push(`Location: ${alert.radiusMiles} miles from ${alert.zipCode}`);
    }
    return criteria.length > 0 ? criteria.join(' | ') : 'No specific criteria';
  }

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (alerts.length === 0) {
    return <p className="text-center text-black">You have no active alerts.</p>;
  }

  const isAlertsDisabled = user?.alertPreferences?.disableAll ?? false;

  return (
    <div className="space-y-4">
      {!user?.phoneNumber && !isAlertsDisabled && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-amber-600 mt-0.5">📱</span>
          <div className="flex-1">
            <h4 className="font-medium text-amber-800">Enable SMS notifications</h4>
            <p className="text-sm text-amber-700 mt-1">
              Add your phone number to receive SMS alerts for your watchlisted vehicles in addition to email.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100"
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="h-4 w-4 mr-2" />
              Add Phone Number
            </Button>
          </div>
        </div>
      )}

      {isAlertsDisabled && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-orange-800">All alerts are currently disabled</h4>
            <p className="text-sm text-orange-700 mt-1">
              You won't receive any notifications for your alerts until you re-enable them in settings.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 border-orange-300 text-orange-700 hover:bg-orange-100"
              onClick={() => window.location.href = '/settings'}
            >
              <Settings className="h-4 w-4 mr-2" />
              Go to Settings
            </Button>
          </div>
        </div>
      )}

      {/* Alert Limit Information for Lite Plan */}
      {isLitePlan && (
        <Alert className={`${isAtLimit ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
          <Crown className="h-4 w-4" />
          <AlertDescription className={isAtLimit ? 'text-red-800' : 'text-blue-800'}>
            {isAtLimit ? (
              <>
                <strong>Alert limit reached!</strong> You're using {currentAlertCount}/{alertLimit} alerts on the Lite plan. 
                <a href="/pricing" className="underline font-medium ml-1">Upgrade to Dealer plan</a> for unlimited alerts.
              </>
            ) : (
              <>
                Lite plan: {currentAlertCount}/{alertLimit} alerts used. 
                <a href="/pricing" className="underline font-medium ml-1">Upgrade to Dealer plan</a> for unlimited alerts.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}

      {alerts.map((alert) => (
        <Card key={alert.id}>
          <CardHeader>
            <CardTitle>{alert.name || 'Unnamed Alert'}</CardTitle>
            <CardDescription>
              {getAlertDescription(alert)}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setEditingAlert(alert)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your alert.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(alert.id!)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
      {editingAlert && (
        <EditAlertForm
          alert={editingAlert}
          isOpen={!!editingAlert}
          setIsOpen={(isOpen) => {
            if (!isOpen) setEditingAlert(null);
          }}
        />
      )}
    </div>
  );
}
