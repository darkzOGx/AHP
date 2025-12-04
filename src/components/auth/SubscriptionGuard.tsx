'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TRIAL_DAYS, PRICING_PLANS, stripePromise } from '@/lib/stripe';
import { Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { authenticatedPost } from '@/lib/api';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SubscriptionGuard({ children, fallback }: SubscriptionGuardProps) {
  const { isSubscribed, loading, isTrialing, trialDaysRemaining } = useSubscription();
  const { user } = useAuth();
  const router = useRouter();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: 'lite' | 'dealer' | 'enterprise') => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessingPlan(plan);

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
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Checking subscription status...</p>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 mb-6">
            You need an active subscription to access this feature. Start your {TRIAL_DAYS}-day free trial with any plan.
          </p>
          <div className="inline-flex items-center bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Check className="h-4 w-4 mr-2" />
            {TRIAL_DAYS}-day free trial • Cancel anytime
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Lite Plan */}
          <Card className="relative border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {PRICING_PLANS.LITE.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">${PRICING_PLANS.LITE.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mt-2">{PRICING_PLANS.LITE.alertLimit}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {PRICING_PLANS.LITE.features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscribe('lite')}
                disabled={processingPlan === 'lite'}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
              >
                {processingPlan === 'lite' ? 'Processing...' : 'Start Free Trial'}
              </Button>
            </CardContent>
          </Card>

          {/* Dealer Plan */}
          <Card className="relative border-2 border-blue-500 hover:border-blue-600 transition-colors shadow-lg">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            </div>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {PRICING_PLANS.DEALER.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">${PRICING_PLANS.DEALER.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mt-2">{PRICING_PLANS.DEALER.alertLimit}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {PRICING_PLANS.DEALER.features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscribe('dealer')}
                disabled={processingPlan === 'dealer'}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
              >
                {processingPlan === 'dealer' ? 'Processing...' : 'Start Free Trial'}
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="relative border-2 border-gray-200 hover:border-purple-300 transition-colors">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {PRICING_PLANS.ENTERPRISE.name}
              </CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">${PRICING_PLANS.ENTERPRISE.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mt-2">Up to {PRICING_PLANS.ENTERPRISE.baseUsers} users</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {PRICING_PLANS.ENTERPRISE.features.slice(0, 6).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscribe('enterprise')}
                disabled={processingPlan === 'enterprise'}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700"
              >
                {processingPlan === 'enterprise' ? 'Processing...' : 'Start Free Trial'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          All plans include a {TRIAL_DAYS}-day free trial.
        </div>
      </div>
    );
  }

  // Show trial warning if in trial period
  if (isTrialing && trialDaysRemaining <= 3) {
    return (
      <>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Trial
              </Badge>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your free trial expires in {trialDaysRemaining} day{trialDaysRemaining !== 1 ? 's' : ''}.
                Subscribe now to continue using AutoHunterPro without interruption.
              </p>
            </div>
          </div>
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}