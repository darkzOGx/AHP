'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SubscriptionGuard from "@/components/auth/SubscriptionGuard";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import ImprovedAnalyticsDashboard from "@/components/dashboard/ImprovedAnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <SubscriptionGuard>
        <OrganizationProvider>
          <ImprovedAnalyticsDashboard />
        </OrganizationProvider>
      </SubscriptionGuard>
    </ProtectedRoute>
  );
}