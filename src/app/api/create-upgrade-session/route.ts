import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PRICE_IDS } from '@/lib/stripe';
import { verifyAuthAndOwnership } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { userId, newPlan, currentPlan } = await request.json();

    if (!userId || !newPlan || !currentPlan) {
      return NextResponse.json({
        error: 'User ID, new plan, and current plan are required'
      }, { status: 400 });
    }

    // Verify authentication and ownership
    const auth = await verifyAuthAndOwnership(request, userId);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Don't allow "upgrading" to the same plan
    if (newPlan === currentPlan) {
      return NextResponse.json({ 
        error: 'Cannot upgrade to the same plan' 
      }, { status: 400 });
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

    const subscriptionId = userData.subscription?.stripeSubscriptionId;
    if (!subscriptionId) {
      return NextResponse.json({ 
        error: 'No active subscription found. Please contact support.' 
      }, { status: 400 });
    }

    // Get the new price ID
    let newPriceId;
    switch (newPlan) {
      case 'lite':
        newPriceId = PRICE_IDS.LITE;
        break;
      case 'dealer':
        newPriceId = PRICE_IDS.DEALER;
        break;
      case 'enterprise':
        newPriceId = PRICE_IDS.ENTERPRISE;
        break;
      default:
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (!subscription.items.data[0]) {
      return NextResponse.json({ 
        error: 'Invalid subscription structure' 
      }, { status: 400 });
    }

    // For immediate plan changes (not trial), modify the existing subscription
    try {
      // Update the subscription immediately
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'always_invoice', // Charge/credit immediately
        metadata: {
          ...subscription.metadata,
          plan: newPlan,
          previousPlan: currentPlan,
          upgradeFrom: currentPlan,
          upgradeDate: new Date().toISOString(),
        }
      });

      console.log(`✅ Successfully updated subscription ${subscriptionId} from ${currentPlan} to ${newPlan}`);

      // Return success response - no need for checkout since we updated directly
      return NextResponse.json({ 
        success: true,
        message: `Plan successfully changed from ${currentPlan} to ${newPlan}`,
        subscriptionId: updatedSubscription.id
      });

    } catch (stripeError) {
      console.error('Stripe subscription update error:', stripeError);
      return NextResponse.json({ 
        error: 'Failed to update subscription. Please try again or contact support.' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Error creating upgrade session:', error);
    return NextResponse.json(
      { error: 'Error processing upgrade request' },
      { status: 500 }
    );
  }
}