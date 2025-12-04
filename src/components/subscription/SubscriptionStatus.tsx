'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/lib/types';
import { formatDate } from 'date-fns';
import { PRICING_PLANS, TRIAL_DAYS } from '@/lib/stripe';
import SubscribeButton from './SubscribeButton';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import Link from 'next/link';

interface SubscriptionStatusProps {
  userProfile?: UserProfile;
}

export default function SubscriptionStatus({ userProfile }: SubscriptionStatusProps) {
  const { user } = useAuth();
  const subscription = userProfile?.subscription;
  
  // Get the user's plan price, default to Dealer plan if not specified
  const userPlan = subscription?.plan || 'dealer';
  const planKey = userPlan.toUpperCase() as keyof typeof PRICING_PLANS;
  const currentPrice = PRICING_PLANS[planKey]?.price || PRICING_PLANS.DEALER.price;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
      case 'incomplete':
      case 'incomplete_expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Free Trial';
      case 'past_due':
        return 'Past Due';
      case 'unpaid':
        return 'Payment Failed';
      case 'canceled':
        return 'Canceled';
      case 'incomplete':
        return 'Incomplete';
      case 'incomplete_expired':
        return 'Expired';
      default:
        return 'No Subscription';
    }
  };

  const isSubscribed = subscription?.status === 'active' || subscription?.status === 'trialing';
  const isTrialing = subscription?.status === 'trialing';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <Badge className={getStatusColor(subscription?.status)}>
            {getStatusText(subscription?.status)}
          </Badge>
        </div>

        {subscription?.status && (
          <>
            {subscription.currentPeriodEnd && (
              <div className="flex items-center justify-between">
                <span>
                  {subscription.cancelAtPeriodEnd ? 'Ends on:' : 'Renews on:'}
                </span>
                <span className="font-medium">
                  {formatDate(subscription.currentPeriodEnd.toDate(), 'MMM d, yyyy')}
                </span>
              </div>
            )}

            {isTrialing && subscription.trialEnd && (
              <div className="flex items-center justify-between">
                <span>Trial ends:</span>
                <span className="font-medium">
                  {formatDate(subscription.trialEnd.toDate(), 'MMM d, yyyy')}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>Price:</span>
              <span className="font-medium">${currentPrice}/month ({userPlan} plan)</span>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Your subscription will not renew and will end on{' '}
                  {subscription.currentPeriodEnd &&
                    formatDate(subscription.currentPeriodEnd.toDate(), 'MMM d, yyyy')
                  }.
                </p>
              </div>
            )}
          </>
        )}

        <div className="pt-4 space-y-3">
          {!isSubscribed ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Start Your {TRIAL_DAYS}-Day Free Trial
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Get full access to AutoHunterPro for {TRIAL_DAYS} days. Choose your plan after trial.
                  Cancel anytime during your trial.
                </p>
                <SubscribeButton />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ManageSubscriptionButton className="w-full" />
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pricing">
                    Choose Different Plan
                  </Link>
                </Button>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Subscription Management</h4>
                <p className="text-sm text-green-700 mb-2">
                  Manage your subscription:
                </p>
                <ul className="text-xs text-green-600 space-y-1">
                  <li>• <strong>Choose Different Plan</strong> - Upgrade or downgrade instantly</li>
                  <li>• <strong>Manage Subscription</strong> - Update payment methods & billing</li>
                  <li>• Download invoices & receipts</li>
                  <li>• Cancel or pause subscription</li>
                  <li>• View payment history</li>
                </ul>
              </div>

              {subscription?.cancelAtPeriodEnd && (
                <div className="flex gap-2">
                  <ManageSubscriptionButton
                    className="flex-1"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => window.open('https://billing.stripe.com', '_blank')}
                  >
                    Reactivate
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}