import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Pricing tiers
export const PRICE_IDS = {
  LITE: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_LITE!,
  DEALER: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_DEALER!,
  ENTERPRISE: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE!,
  ENTERPRISE_ADDITIONAL_USER: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE_ADDITIONAL_USER!,
};

export const PRICING_PLANS = {
  LITE: {
    name: 'Lite',
    price: 169,
    maxAlerts: 3,
    alertLimit: '3 custom alerts',
    features: [
      'Real-time SMS notifications',
      'Access to 25+ vehicle sources',
      'AI-powered scam filtering (99% accuracy)',
      'Private party seller filtering',
      'Advanced search & filters',
      'Clean titles only',
      'Facebook, Craigslist, Cars.com, OfferUp & more',
      'Mobile-friendly dashboard',
      'Email support',
    ],
  },
  DEALER: {
    name: 'Dealer',
    price: 299,
    maxAlerts: null, // unlimited
    alertLimit: 'Unlimited custom alerts',
    features: [
      'Real-time SMS notifications',
      'Access to 25+ vehicle sources',
      'AI-powered scam filtering (99% accuracy)',
      'Private party seller filtering',
      'Advanced search & filters',
      'Clean titles only',
      'Facebook, Craigslist, Cars.com, OfferUp & more',
      'Mobile-friendly dashboard',
      'Priority email support',
    ],
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 699,
    baseUsers: 3,
    additionalUserPrice: 99,
    maxAlerts: null, // unlimited
    alertLimit: 'Unlimited custom alerts',
    features: [
      'Everything in Dealer plan',
      'Multi-user organization accounts',
      'Up to 3 users included (owner + 2 team members)',
      'Additional users at $99/month each',
      'Role-based access control (Owner, Admin, Member)',
      'Individual dashboard personalization',
      'Team collaboration features',
      'Organization-wide alert management',
      'Advanced user management',
      'Dedicated account manager',
      'Priority support with SLA',
      'Custom onboarding',
    ],
  },
} as const;

export const TRIAL_DAYS = 14;