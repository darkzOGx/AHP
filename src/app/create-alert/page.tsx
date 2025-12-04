'use client';
import { Suspense } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SubscriptionGuard from '@/components/auth/SubscriptionGuard';
import { CreateAlertForm } from '@/components/alerts/CreateAlertForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function CreateAlertPageContent() {
  const { user } = useAuth();
  const isAlertsDisabled = user?.alertPreferences?.disableAll ?? false;

  return (
    <ProtectedRoute>
      <SubscriptionGuard>
        <div className="max-w-2xl mx-auto space-y-6">
            {isAlertsDisabled && (
              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-800">All alerts are currently disabled</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    You can still create alerts, but you won't receive notifications until you re-enable them in settings.
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
            <Card className="shadow-xl">
                <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <AlertTriangle className="h-8 w-8 text-brand-gray-400" />
                        <CardTitle className="text-3xl font-headline">Create a New Alert</CardTitle>
                    </div>
                    <CardDescription>
                        Fill out the details below to get notified about vehicles that match your criteria.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateAlertForm />
                </CardContent>
            </Card>
        </div>
      </SubscriptionGuard>
    </ProtectedRoute>
  );
}

export default function CreateAlertPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateAlertPageContent />
        </Suspense>
    );
}
