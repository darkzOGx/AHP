'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { authenticatedPost } from '@/lib/api';

interface ManageSubscriptionButtonProps {
  className?: string;
}

export default function ManageSubscriptionButton({ className }: ManageSubscriptionButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleManageSubscription = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to manage subscription',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await authenticatedPost('/api/create-portal-session', {
        userId: user.uid,
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal session error:', error);
      toast({
        title: 'Management Error',
        description: 'Failed to open subscription management portal',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={loading}
      variant="outline"
      className={className}
    >
      {loading ? 'Loading...' : 'Manage Subscription'}
    </Button>
  );
}