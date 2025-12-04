# Stripe Subscription Integration

This document explains the Stripe subscription system integrated into AutoHunterPro.

## Overview

The integration provides:
- $300/month subscription with 14-day free trial
- Automatic subscription management via Stripe webhooks
- Complete subscription lifecycle handling
- Frontend components for checkout and billing management
- Subscription-based route protection

## Setup Instructions

### 1. Stripe Dashboard Configuration

1. **Create a Stripe account** and get your API keys
2. **Create a Product** in Stripe Dashboard:
   - Name: "AutoHunterPro Monthly"
   - Pricing: $300/month recurring
   - Copy the Price ID (starts with `price_`)

3. **Configure Webhooks**:
   - Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
     - `invoice.payment_succeeded`
   - Copy the webhook signing secret

### 2. Environment Variables

Add these variables to your `.env.local`:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
NEXT_PUBLIC_STRIPE_PRICE_ID=price_your_monthly_price_id
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Firestore Security Rules

Update your Firestore security rules to include subscription data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Architecture

### Backend API Routes

1. **`/api/create-checkout-session`**: Creates Stripe checkout session with 14-day trial
2. **`/api/create-portal-session`**: Creates Stripe billing portal session
3. **`/api/webhooks/stripe`**: Handles Stripe webhook events and syncs subscription status

### Frontend Components

1. **`SubscribeButton`**: Initiates subscription checkout
2. **`ManageSubscriptionButton`**: Opens Stripe billing portal
3. **`SubscriptionStatus`**: Displays current subscription status and trial info
4. **`SubscriptionGuard`**: Protects routes requiring active subscription

### Custom Hooks

1. **`useSubscription`**: Provides subscription status and user profile data
2. **`useAuth`**: Enhanced with subscription-aware user data

## User Flow

### New User Journey
1. User signs up and logs in
2. User tries to access protected feature (dashboard, alerts, etc.)
3. `SubscriptionGuard` detects no active subscription
4. User sees subscription required page with trial offer
5. User clicks "Start 14-Day Free Trial"
6. Redirected to Stripe Checkout with trial period
7. After successful checkout, user gets 14 days free access
8. At trial end, subscription auto-converts to paid

### Subscription Management
1. User goes to Settings page
2. Sees current subscription status and billing info
3. Can click "Manage Subscription" to:
   - Update payment methods
   - Download invoices
   - Cancel subscription
   - Reactivate if needed

## Database Schema

User documents in Firestore are extended with subscription data:

```typescript
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  alertPreferences?: {
    email: boolean;
    sms: boolean;
    disableAll: boolean;
  };
  subscription?: {
    status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'incomplete' | 'incomplete_expired';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Timestamp;
    trialEnd?: Timestamp;
    cancelAtPeriodEnd?: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };
}
```

## Protected Routes

The following routes are protected by `SubscriptionGuard`:
- `/dashboard` - Main vehicle search
- `/create-alert` - Create new alerts
- `/my-alerts` - Manage existing alerts

## Testing

### Test Mode Setup
1. Use Stripe test API keys (start with `pk_test_` and `sk_test_`)
2. Use test webhook endpoint during development
3. Test with Stripe test card numbers:
   - Success: `4242424242424242`
   - Decline: `4000000000000002`

### Trial Testing
1. Create subscription with trial
2. Verify user gets immediate access
3. Test trial expiration behavior
4. Test conversion to paid subscription

## Security Considerations

1. **API Keys**: Never expose secret keys in client-side code
2. **Webhooks**: Always verify webhook signatures
3. **User Data**: Subscription data is stored in user's Firestore document
4. **Route Protection**: Multiple layers of authentication and subscription checks

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**:
   - Check webhook URL is publicly accessible
   - Verify webhook secret matches environment variable
   - Check Stripe dashboard webhook logs

2. **Subscription status not updating**:
   - Check webhook events are being processed
   - Verify Firestore write permissions
   - Check console logs for errors

3. **Trial not working**:
   - Verify `trial_period_days: 14` in checkout session
   - Check subscription metadata includes Firebase UID
   - Ensure trial logic in `SubscriptionGuard` is working

## Support

For issues with the integration:
1. Check Stripe dashboard for subscription and payment details
2. Review webhook delivery logs
3. Check browser console and server logs
4. Verify environment variables are set correctly