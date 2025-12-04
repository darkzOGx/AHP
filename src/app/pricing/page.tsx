'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, Sparkles, Car, Zap, Shield, Bell, Globe, Target, Check, Star } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/stripe';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { useState } from 'react';
import { authenticatedPost } from '@/lib/api';

export default function PricingPage() {
  const { user } = useAuth();
  const { isSubscribed, getUserPlan } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  
  const currentPlan = getUserPlan();
  const isExistingUser = user && isSubscribed;

  const handleUpgrade = async (targetPlan: string) => {
    if (!user) {
      // Redirect to signup for new users
      window.location.href = `/signup?plan=${targetPlan}`;
      return;
    }

    if (!isSubscribed) {
      // Redirect to signup for users without subscription
      window.location.href = `/signup?plan=${targetPlan}`;
      return;
    }

    // Handle plan change for existing subscribers
    const planHierarchy = { 'lite': 1, 'dealer': 2, 'enterprise': 3 };
    const isDowngrade = planHierarchy[targetPlan as keyof typeof planHierarchy] < planHierarchy[currentPlan as keyof typeof planHierarchy];
    
    // Confirm downgrades
    if (isDowngrade) {
      const confirmMessage = targetPlan === 'enterprise' 
        ? `Are you sure you want to downgrade to ${targetPlan}? You may lose some team features.`
        : currentPlan === 'enterprise' 
        ? `Are you sure you want to downgrade from Enterprise to ${targetPlan}? You'll lose team collaboration, organization management, and your team members will lose access.`
        : `Are you sure you want to downgrade to ${targetPlan}? You may lose some features.`;
        
      if (!confirm(confirmMessage)) {
        return;
      }
    }
    
    setLoading(targetPlan);
    
    try {
      const response = await authenticatedPost('/api/create-upgrade-session', {
        userId: user.uid,
        newPlan: targetPlan,
        currentPlan
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process upgrade');
      }

      // Check if it's a direct subscription update (no checkout needed)
      if (data.success) {
        const actionText = isDowngrade ? 'downgraded' : 'upgraded';
        toast.success(`Successfully ${actionText} to ${targetPlan}! Redirecting to dashboard...`);
        
        // Wait a moment for the toast, then redirect
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else if (data.sessionId) {
        // Redirect to Stripe for checkout (if needed for some upgrades)
        const stripe = (await import('@stripe/stripe-js')).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        const stripeInstance = await stripe;
        
        if (stripeInstance) {
          await stripeInstance.redirectToCheckout({ sessionId: data.sessionId });
        }
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Failed to start upgrade process. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getButtonText = (plan: string) => {
    if (!isExistingUser) {
      return `Start ${plan.charAt(0).toUpperCase() + plan.slice(1)} Trial`;
    }
    
    if (currentPlan === plan) {
      return 'Current Plan';
    }
    
    const planHierarchy = { 'lite': 1, 'dealer': 2, 'enterprise': 3 };
    const isUpgrade = planHierarchy[plan as keyof typeof planHierarchy] > planHierarchy[currentPlan as keyof typeof planHierarchy];
    const isDowngrade = planHierarchy[plan as keyof typeof planHierarchy] < planHierarchy[currentPlan as keyof typeof planHierarchy];
    
    if (isUpgrade) {
      return `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
    } else if (isDowngrade) {
      return `Downgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
    } else {
      return `Switch to ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
    }
  };

  const isCurrentPlan = (plan: string) => isExistingUser && currentPlan === plan;

  return (
    <div className="space-y-12 md:space-y-20 py-4 md:py-8">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900">
            {isExistingUser ? 'Manage Your Plan' : 'Simple, Transparent Pricing'}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
            {isExistingUser 
              ? `You're currently on the ${currentPlan.toUpperCase()} plan. Upgrade or downgrade anytime.`
              : 'Same powerful features. Choose your alert limit.'
            }
          </p>
          {isExistingUser && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800 font-medium">
                💡 You can upgrade or downgrade your plan anytime. Changes take effect immediately with prorated billing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Three Pricing Tiers */}
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {/* Lite Plan */}
            <Card className="p-6 md:p-8 border-2 border-gray-200 shadow-lg bg-white relative">
              <CardHeader className="pb-6 text-center">
                <CardTitle className="text-2xl md:text-3xl font-black text-gray-900">Lite</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl md:text-5xl font-black text-gray-900">${PRICING_PLANS.LITE.price}</span>
                  <span className="text-gray-600 text-lg md:text-xl">/month</span>
                </div>
                <p className="text-base text-gray-600 mt-3 font-medium">
                  14-day free trial • Cancel anytime
                </p>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 text-center">
                  <div className="text-2xl font-black text-gray-900 mb-1">
                    {PRICING_PLANS.LITE.alertLimit}
                  </div>
                  <p className="text-sm text-gray-600">
                    Perfect for individual flippers
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {PRICING_PLANS.LITE.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleUpgrade('lite')}
                  disabled={loading === 'lite' || isCurrentPlan('lite')}
                  size="lg" 
                  className={`w-full font-semibold text-sm md:text-base py-4 md:py-6 rounded-xl border-2 shadow-md transition-all ${
                    isCurrentPlan('lite') 
                      ? 'border-green-300 bg-green-50 text-green-700 cursor-not-allowed' 
                      : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {loading === 'lite' ? 'Processing...' : getButtonText('lite')}
                  {!isCurrentPlan('lite') && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>

            {/* Dealer Plan */}
            <Card className="p-6 md:p-8 border-2 border-gray-200 shadow-lg bg-white relative">

              <CardHeader className="pb-6 text-center">
                <CardTitle className="text-2xl md:text-3xl font-black text-gray-900">Dealer</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl md:text-5xl font-black text-gray-900">${PRICING_PLANS.DEALER.price}</span>
                  <span className="text-gray-600 text-lg md:text-xl">/month</span>
                </div>
                <p className="text-base text-gray-600 mt-3 font-medium">
                  14-day free trial • Cancel anytime
                </p>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border-2 border-gray-200 text-center">
                  <div className="text-2xl font-black text-gray-900 mb-1">
                    {PRICING_PLANS.DEALER.alertLimit}
                  </div>
                  <p className="text-sm text-gray-600">
                    Scale without limits
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {PRICING_PLANS.DEALER.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleUpgrade('dealer')}
                  disabled={loading === 'dealer' || isCurrentPlan('dealer')}
                  size="lg" 
                  className={`w-full font-semibold text-sm md:text-base py-4 md:py-6 rounded-xl border-2 shadow-md transition-all ${
                    isCurrentPlan('dealer') 
                      ? 'border-green-300 bg-green-50 text-green-700 cursor-not-allowed' 
                      : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {loading === 'dealer' ? 'Processing...' : getButtonText('dealer')}
                  {!isCurrentPlan('dealer') && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan - Highlighted */}
            <Card className="p-6 md:p-8 border-2 border-brand-red-600 shadow-2xl bg-white relative transform lg:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-brand-red-600 text-white px-6 py-2 text-sm font-bold shadow-lg">
                  <Star className="w-4 h-4 mr-2 inline" />
                  ENTERPRISE
                </Badge>
              </div>

              <CardHeader className="pb-6 text-center">
                <CardTitle className="text-2xl md:text-3xl font-black text-gray-900">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl md:text-5xl font-black text-brand-red-600">${PRICING_PLANS.ENTERPRISE.price}</span>
                  <span className="text-gray-600 text-lg md:text-xl">/month</span>
                </div>
                <p className="text-base text-gray-600 mt-3 font-medium">
                  14-day free trial • Cancel anytime
                </p>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="mb-6 p-4 bg-brand-red-50 rounded-xl border-2 border-brand-red-200 text-center">
                  <div className="text-2xl font-black text-brand-red-600 mb-1">
                    {PRICING_PLANS.ENTERPRISE.alertLimit}
                  </div>
                  <p className="text-sm text-gray-600">
                    Multi-user organizations
                  </p>
                </div>

                <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-800">
                      {PRICING_PLANS.ENTERPRISE.baseUsers} users included
                    </div>
                    <div className="text-sm text-purple-600">
                      + ${PRICING_PLANS.ENTERPRISE.additionalUserPrice}/month per extra user
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {PRICING_PLANS.ENTERPRISE.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-brand-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-brand-red-600" />
                      </div>
                      <span className="text-sm text-gray-700 leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handleUpgrade('enterprise')}
                  disabled={loading === 'enterprise' || isCurrentPlan('enterprise')}
                  size="lg" 
                  className={`w-full font-bold text-sm md:text-base py-4 md:py-6 rounded-xl shadow-2xl transition-all transform hover:scale-105 ${
                    isCurrentPlan('enterprise') 
                      ? 'bg-green-600 text-white cursor-not-allowed' 
                      : 'bg-brand-red-600 hover:bg-brand-red-700 text-white hover:shadow-brand-red-600/50'
                  }`}
                >
                  {loading === 'enterprise' ? 'Processing...' : getButtonText('enterprise')}
                  {!isCurrentPlan('enterprise') && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Plan Comparison Callout */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-brand-red-50 p-8 rounded-3xl border-2 border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-3">
                Choose Your Plan
              </h3>
              <p className="text-lg text-gray-600">
                All plans include the same powerful features. Choose based on your needs.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-2xl border-2 border-gray-200">
                <div className="text-4xl font-black text-gray-900 mb-2">3</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">Custom Alerts</div>
                <div className="text-sm text-gray-600">Perfect for individual flippers tracking specific vehicles</div>
                <div className="text-2xl font-bold text-gray-900 mt-3">$169/month</div>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-2xl border-2 border-gray-200">
                <div className="text-4xl font-black text-gray-900 mb-2">∞</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">Unlimited Alerts</div>
                <div className="text-sm text-gray-600">Scale your operation - track dozens of vehicle types</div>
                <div className="text-2xl font-bold text-gray-900 mt-3">$299/month</div>
              </div>

              <div className="text-center p-6 bg-brand-red-50 rounded-2xl border-2 border-brand-red-200">
                <div className="text-4xl font-black text-brand-red-600 mb-2">👥</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">Multi-User Teams</div>
                <div className="text-sm text-gray-600">Organizations with 3 users + unlimited alerts + team features</div>
                <div className="text-2xl font-bold text-brand-red-600 mt-3">$699/month</div>
                <div className="text-xs text-gray-500 mt-1">+ $99/month per extra user</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
            Why AutoHunter Pro?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 md:p-8 bg-white rounded-3xl border-2 border-gray-200 hover:border-brand-red-600 transition-all">
              <div className="w-16 h-16 bg-brand-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">Save 95% of Your Time</h3>
              <p className="text-sm md:text-base text-gray-600">
                Stop wasting 6-8 hours daily browsing. Get only the best deals in 15 minutes.
              </p>
            </div>

            <div className="text-center p-6 md:p-8 bg-white rounded-3xl border-2 border-gray-200 hover:border-brand-red-600 transition-all">
              <div className="w-16 h-16 bg-brand-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">99% AI Accuracy</h3>
              <p className="text-sm md:text-base text-gray-600">
                Our AI automatically filters out scams, dealerships, and salvage titles.
              </p>
            </div>

            <div className="text-center p-6 md:p-8 bg-white rounded-3xl border-2 border-gray-200 hover:border-brand-red-600 transition-all">
              <div className="w-16 h-16 bg-brand-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">Never Miss a Deal</h3>
              <p className="text-sm md:text-base text-gray-600">
                Get instant alerts 24/7 the moment new listings match your criteria.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 md:mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <Card className="p-6 md:p-8 border-2 border-gray-100 bg-white hover:border-brand-red-600 transition-all">
              <CardContent className="pt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  Do you offer a free trial?
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Yes! Every new user gets a full 14-day free trial with complete access to all features. A credit card is required to start your trial, but you won't be charged until the trial period ends.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-gray-100 bg-white hover:border-brand-red-600 transition-all">
              <CardContent className="pt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  What's the difference between the plans?
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  All plans include the same core features. Lite ($169/month) allows 3 alerts, Dealer ($299/month) has unlimited alerts, and Enterprise ($699/month) adds multi-user organizations with 3 users included plus $99/month per additional user.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-gray-100 bg-white hover:border-brand-red-600 transition-all">
              <CardContent className="pt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  How does Enterprise billing work?
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Enterprise starts at $699/month for up to 3 users (owner + 2 team members). Each additional user costs $99/month. Billing is handled automatically when you invite new users or remove team members.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-gray-100 bg-white hover:border-brand-red-600 transition-all">
              <CardContent className="pt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  Can I cancel anytime?
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Absolutely. No contracts, no commitments. Cancel anytime with a single click. No penalties or hidden fees.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-gray-100 bg-white hover:border-brand-red-600 transition-all">
              <CardContent className="pt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  We accept all major credit cards (Visa, Mastercard, American Express, Discover) and process payments securely through Stripe.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-gray-100 bg-white hover:border-brand-red-600 transition-all">
              <CardContent className="pt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  Which sources does AutoHunterPro pull from?
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  We aggregate listings from 25+ major platforms including Facebook Marketplace, Craigslist, Cars.com, OfferUp, Autotrader, and many more — with new sources added regularly.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-gray-100 bg-white hover:border-brand-red-600 transition-all">
              <CardContent className="pt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  How does the AI filtering work?
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Our AI automatically analyzes every listing and filters out car dealerships, scams, salvage titles, and irrelevant posts. You only see high-quality private party listings with 99% accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-gray-100 bg-white hover:border-brand-red-600 transition-all">
              <CardContent className="pt-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                  What if I need help getting started?
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  We offer premium email support for all customers, plus comprehensive guides and video tutorials to get you up and running in minutes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6 text-white">
            Ready to Find Cars Before Everyone Else?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 md:mb-8 max-w-2xl mx-auto">
            Start your 14-day free trial today. Full access to all features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="font-semibold text-base md:text-lg px-8 md:px-10 py-6 md:py-8 rounded-2xl w-full sm:w-auto bg-brand-red-600 hover:bg-brand-red-700 text-white shadow-2xl hover:shadow-brand-red-600/50 transition-all transform hover:scale-105">
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-semibold text-base md:text-lg px-8 md:px-10 py-6 md:py-8 rounded-2xl w-full sm:w-auto border-2 border-white text-black hover:bg-white hover:text-gray-900">
              <Link href="/dashboard">
                View Demo Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
