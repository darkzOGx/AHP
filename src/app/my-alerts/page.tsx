'use client';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SubscriptionGuard from '@/components/auth/SubscriptionGuard';
import { MyAlertsList } from '@/components/alerts/MyAlertsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing } from 'lucide-react';
import { Suspense } from 'react';

function MyAlertsPageContent() {
  return (
    <ProtectedRoute>
      <SubscriptionGuard>
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <BellRing className="h-8 w-8 text-brand-gray-400" />
                <CardTitle className="text-3xl font-headline">My Alerts</CardTitle>
              </div>
              <CardDescription>
                View, edit, or delete your saved vehicle alerts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyAlertsList />
            </CardContent>
          </Card>
        </div>
      </SubscriptionGuard>
    </ProtectedRoute>
  );
}

export default function MyAlertsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyAlertsPageContent />
        </Suspense>
    );
}
