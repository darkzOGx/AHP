import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PRICE_IDS } from '@/lib/stripe';
import { verifyAuthAndOwnership } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { userId, plan = 'dealer', organizationName } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Verify authentication and ownership
    const auth = await verifyAuthAndOwnership(request, userId);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Determine the correct price ID based on the plan
    let priceId;
    switch (plan) {
      case 'lite':
        priceId = PRICE_IDS.LITE;
        break;
      case 'enterprise':
        priceId = PRICE_IDS.ENTERPRISE;
        break;
      default:
        priceId = PRICE_IDS.DEALER;
    }

    // Dynamic import to avoid build-time issues
    const { getAdminFirestore } = await import('@/lib/firebase-admin');
    const db = getAdminFirestore();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (!userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    let customerId = userData.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          firebaseUID: userId,
        },
      });
      customerId = customer.id;
    }

    // For enterprise plan, we need additional setup
    let sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          firebaseUID: userId,
          plan: plan,
          ...(plan === 'enterprise' && organizationName && { organizationName }),
        },
      },
      allow_promotion_codes: true,
    };

    // For enterprise plans, collect billing address
    if (plan === 'enterprise') {
      sessionConfig.billing_address_collection = 'required';
      sessionConfig.custom_fields = [
        {
          key: 'organization_name',
          label: {
            type: 'custom',
            custom: 'Organization Name',
          },
          type: 'text',
          text: {
            minimum_length: 1,
            maximum_length: 100,
          },
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}