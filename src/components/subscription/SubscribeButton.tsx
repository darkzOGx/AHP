'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { stripePromise, PRICING_PLANS } from '@/lib/stripe';
import { toast } from '@/hooks/use-toast';
import { authenticatedPost } from '@/lib/api';

interface SubscribeButtonProps {
  className?: string;
  plan?: 'lite' | 'dealer';
}

export default function SubscribeButton({ className, plan = 'dealer' }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await authenticatedPost('/api/create-checkout-session', {
        userId: user.uid,
        plan,
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription Error',
        description: 'Failed to start subscription process',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const planConfig = PRICING_PLANS[plan.toUpperCase() as keyof typeof PRICING_PLANS];

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      className={className}
    >
      {loading ? 'Processing...' : `Subscribe - $${planConfig.price}/month`}
    </Button>
  );
}