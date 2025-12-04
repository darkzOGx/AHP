'use client';

export const dynamic = 'force-dynamic';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SubscriptionGuard from "@/components/auth/SubscriptionGuard";
import { OrganizationProvider } from "@/contexts/OrganizationContext";

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SubscriptionGuard>
        <OrganizationProvider>
          {children}
        </OrganizationProvider>
      </SubscriptionGuard>
    </ProtectedRoute>
  );
}