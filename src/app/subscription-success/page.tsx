'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { authenticatedPost } from '@/lib/api';

function SubscriptionSuccessContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [syncing, setSyncing] = useState(true);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !sessionId) {
      router.push('/dashboard');
      return;
    }

    // Auto-sync subscription status
    const syncSubscription = async () => {
      try {
        setSyncing(true);

        // Wait a bit for webhooks to process
        await new Promise(resolve => setTimeout(resolve, 3000));

        const response = await authenticatedPost('/api/sync-subscription', {
          userId: user.uid,
        });

        if (response.ok) {
          setSyncSuccess(true);
          toast({
            title: 'Success!',
            description: 'Your subscription has been activated.',
          });

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to sync subscription');
        }
      } catch (err) {
        setError('Network error occurred');
        console.error('Sync error:', err);
      } finally {
        setSyncing(false);
      }
    };

    syncSubscription();
  }, [user, sessionId, router]);

  const handleManualSync = async () => {
    if (!user) return;

    try {
      setSyncing(true);
      setError(null);

      const response = await authenticatedPost('/api/sync-subscription', {
        userId: user.uid,
      });

      if (response.ok) {
        setSyncSuccess(true);
        toast({
          title: 'Success!',
          description: 'Your subscription has been activated.',
        });

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to sync subscription');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Manual sync error:', err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          {syncing && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <CardTitle>Setting up your subscription...</CardTitle>
            </>
          )}

          {syncSuccess && !syncing && (
            <>
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle className="text-green-800">Subscription Activated!</CardTitle>
            </>
          )}

          {error && !syncing && (
            <>
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <CardTitle className="text-red-800">Activation Pending</CardTitle>
            </>
          )}
        </CardHeader>

        <CardContent className="text-center space-y-4">
          {syncing && (
            <p className="text-brand-gray-300">
              We're activating your subscription. This usually takes a few seconds...
            </p>
          )}

          {syncSuccess && (
            <div>
              <p className="text-green-700 mb-4">
                Welcome to AutoHunterPro! Your subscription is now active and you have full access to all features.
              </p>
              <p className="text-sm text-brand-gray-200">
                Redirecting to dashboard...
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <p className="text-red-700">
                Your payment was successful, but we're still activating your subscription.
              </p>
              <p className="text-sm text-brand-gray-200">
                This sometimes takes a few minutes. You can try syncing manually or wait for automatic activation.
              </p>
              <div className="space-y-2">
                <Button onClick={handleManualSync} disabled={syncing} className="w-full">
                  {syncing ? 'Syncing...' : 'Try Again'}
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')} className="w-full">
                  Continue to Dashboard
                </Button>
              </div>
              {error && (
                <p className="text-xs text-red-600">Error: {error}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}