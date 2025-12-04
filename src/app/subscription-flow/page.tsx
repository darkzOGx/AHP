'use client';

import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { stripePromise, PRICING_PLANS } from '@/lib/stripe';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Check, Star, Crown, Users } from 'lucide-react';
import { authenticatedPost } from '@/lib/api';

function SubscriptionFlowContent() {
  const { user, loading } = useAuth();
  const { isSubscribed, loading: subscriptionLoading } = useSubscription();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  
  const urlPlan = searchParams.get('plan');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    
    // Redirect already subscribed users to dashboard
    if (!loading && !subscriptionLoading && user && isSubscribed) {
      router.push('/dashboard');
      return;
    }

    // Set selected plan from URL or default to dealer
    if (urlPlan) {
      setSelectedPlan(urlPlan);
    } else {
      setSelectedPlan('dealer');
    }
  }, [user, loading, subscriptionLoading, isSubscribed, router, urlPlan]);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    // Update URL without reload
    window.history.replaceState({}, '', `/subscription-flow?plan=${plan}`);
  };

  const handleSubscribe = async (plan?: string) => {
    const planToSubscribe = plan || selectedPlan;
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await authenticatedPost('/api/create-checkout-session', {
        userId: user.uid,
        plan: planToSubscribe,
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
      setIsLoading(false);
    }
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-red-600"></div>
      </div>
    );
  }

  if (!user || isSubscribed) {
    return null;
  }

  // If URL has a specific plan, show single plan view
  if (urlPlan && PRICING_PLANS[urlPlan.toUpperCase() as keyof typeof PRICING_PLANS]) {
    const planConfig = PRICING_PLANS[urlPlan.toUpperCase() as keyof typeof PRICING_PLANS];
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Your Subscription
            </h1>
            <p className="text-lg text-gray-600">
              You're one step away from accessing AutoHunter Pro
            </p>
          </div>

          <Card className={`p-6 md:p-8 border-2 shadow-2xl bg-white relative ${
            urlPlan === 'dealer' ? 'border-brand-red-600' : 'border-gray-200'
          }`}>
            {urlPlan === 'dealer' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-brand-red-600 text-white px-6 py-2 text-sm font-bold shadow-lg">
                  <Star className="w-4 h-4 mr-2 inline" />
                  MOST POPULAR
                </Badge>
              </div>
            )}

            <CardHeader className="pb-6 text-center">
              <CardTitle className="text-2xl md:text-3xl font-black text-gray-900">
                {planConfig.name}
              </CardTitle>
              <div className="mt-4">
                <span className={`text-4xl md:text-5xl font-black ${
                  urlPlan === 'dealer' ? 'text-brand-red-600' : 'text-gray-900'
                }`}>
                  ${planConfig.price}
                </span>
                <span className="text-gray-600 text-lg md:text-xl">/month</span>
              </div>
              <p className="text-base text-gray-600 mt-3 font-medium">
                14-day free trial • Cancel anytime
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              <p className="text-sm md:text-base text-gray-700 mb-6 text-center">
                {urlPlan === 'lite' 
                  ? 'Perfect for individual flippers and small-scale operations.'
                  : urlPlan === 'enterprise'
                  ? 'Complete solution for teams and organizations.'
                  : 'Everything you need to dominate the market and find deals before competition.'
                }
              </p>

              <div className="space-y-3 mb-8">
                {planConfig.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      urlPlan === 'dealer' ? 'bg-brand-red-100' : 'bg-gray-100'
                    }`}>
                      <Check className={`w-4 h-4 ${
                        urlPlan === 'dealer' ? 'text-brand-red-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handleSubscribe(urlPlan)}
                disabled={isLoading}
                size="lg" 
                className={`w-full font-bold text-sm md:text-base py-4 md:py-6 rounded-xl transition-all transform hover:scale-105 ${
                  urlPlan === 'dealer'
                    ? 'bg-brand-red-600 hover:bg-brand-red-700 text-white shadow-2xl hover:shadow-brand-red-600/50'
                    : 'border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 shadow-md'
                }`}
              >
                {isLoading ? 'Processing...' : (
                  <>
                    <span>Start Your 14-Day Free Trial</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Full access during trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show all 3 plans if no specific plan in URL
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Select the perfect plan for your vehicle flipping business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Lite Plan */}
          <Card className={`relative border-2 transition-all duration-300 ${
            selectedPlan === 'lite' ? 'border-blue-500 shadow-lg transform scale-105' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Lite</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-black text-gray-900">${PRICING_PLANS.LITE.price}</span>
                <span className="text-gray-600 text-lg">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">Perfect for individual flippers</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">3 Custom Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Real-time SMS notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">25+ vehicle sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">AI-powered scam filtering</span>
                </div>
              </div>
              <Button 
                variant={selectedPlan === 'lite' ? 'default' : 'outline'}
                className="w-full mb-3"
                onClick={() => handlePlanSelect('lite')}
              >
                {selectedPlan === 'lite' ? 'Selected' : 'Select Lite'}
              </Button>
              {selectedPlan === 'lite' && (
                <Button 
                  onClick={() => handleSubscribe('lite')}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Processing...' : 'Start Free Trial'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Dealer Plan */}
          <Card className={`relative border-2 transition-all duration-300 ${
            selectedPlan === 'dealer' ? 'border-brand-red-600 shadow-lg transform scale-105' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-brand-red-600 text-white px-4 py-2 text-sm font-bold shadow-lg">
                <Star className="w-4 h-4 mr-1 inline" />
                MOST POPULAR
              </Badge>
            </div>
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Dealer</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-black text-brand-red-600">${PRICING_PLANS.DEALER.price}</span>
                <span className="text-gray-600 text-lg">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">For serious dealers and pros</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Unlimited Custom Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Real-time SMS notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">25+ vehicle sources</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Priority support</span>
                </div>
              </div>
              <Button 
                variant={selectedPlan === 'dealer' ? 'default' : 'outline'}
                className="w-full mb-3"
                onClick={() => handlePlanSelect('dealer')}
              >
                {selectedPlan === 'dealer' ? 'Selected' : 'Select Dealer'}
              </Button>
              {selectedPlan === 'dealer' && (
                <Button 
                  onClick={() => handleSubscribe('dealer')}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-brand-red-600 hover:bg-brand-red-700"
                >
                  {isLoading ? 'Processing...' : 'Start Free Trial'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className={`relative border-2 transition-all duration-300 ${
            selectedPlan === 'enterprise' ? 'border-purple-600 shadow-lg transform scale-105' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-2xl font-bold text-gray-900">Enterprise</CardTitle>
              </div>
              <div className="mt-4">
                <span className="text-4xl font-black text-purple-600">${PRICING_PLANS.ENTERPRISE.price}</span>
                <span className="text-gray-600 text-lg">/month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">For teams and organizations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Everything in Dealer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Up to 3 users included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Role-based access control</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Team collaboration</span>
                </div>
              </div>
              <Button 
                variant={selectedPlan === 'enterprise' ? 'default' : 'outline'}
                className="w-full mb-3"
                onClick={() => handlePlanSelect('enterprise')}
              >
                {selectedPlan === 'enterprise' ? 'Selected' : 'Select Enterprise'}
              </Button>
              {selectedPlan === 'enterprise' && (
                <Button 
                  onClick={() => handleSubscribe('enterprise')}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isLoading ? 'Processing...' : 'Start Free Trial'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            14-day free trial on all plans • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionFlowPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-red-600 mx-auto"></div>
        </div>
      </div>
    }>
      <SubscriptionFlowContent />
    </Suspense>
  );
}