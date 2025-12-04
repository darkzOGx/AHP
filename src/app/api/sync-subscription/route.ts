import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyAuthAndOwnership } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Verify authentication and ownership
    const auth = await verifyAuthAndOwnership(request, userId);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Dynamic import to avoid build-time issues
    const { getAdminFirestore } = await import('@/lib/firebase-admin');
    const { Timestamp } = await import('firebase-admin/firestore');
    const db = getAdminFirestore();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (!userData) {
      return NextResponse.json({ error: 'User data not found' }, { status: 404 });
    }

    // Find customer in Stripe by email
    const customers = await stripe.customers.list({
      email: userData.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const customer = customers.data[0];

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        message: 'No subscriptions found',
        customerExists: true,
        customerId: customer.id
      });
    }

    // Get the most recent subscription
    const subscription = subscriptions.data[0];

    // Prepare update data with proper timestamp validation
    const updateData: any = {
      'subscription.status': subscription.status,
      'subscription.stripeCustomerId': customer.id,
      'subscription.stripeSubscriptionId': subscription.id,
      'subscription.cancelAtPeriodEnd': (subscription as any).cancel_at_period_end ?? false,
      'subscription.updatedAt': Timestamp.now(),
    };

    // Only add timestamps if they're valid numbers
    const currentPeriodEnd = (subscription as any).current_period_end;
    if (currentPeriodEnd && typeof currentPeriodEnd === 'number') {
      updateData['subscription.currentPeriodEnd'] = Timestamp.fromMillis(currentPeriodEnd * 1000);
    } else {
      console.warn('Invalid or missing current_period_end:', currentPeriodEnd);
    }

    const trialEnd = (subscription as any).trial_end;
    if (trialEnd && typeof trialEnd === 'number') {
      updateData['subscription.trialEnd'] = Timestamp.fromMillis(trialEnd * 1000);
    } else if (trialEnd === null) {
      updateData['subscription.trialEnd'] = null;
    }

    console.log(`Syncing subscription for user ${userId}:`, updateData);

    // Update Firestore with subscription data
    await db.collection('users').doc(userId).update(updateData);

    return NextResponse.json({
      message: 'Subscription synced successfully',
      subscription: {
        id: subscription.id,
        status: subscription.status,
        customerId: customer.id,
      }
    });

  } catch (error) {
    console.error('Sync subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to sync subscription', details: (error as Error).message },
      { status: 500 }
    );
  }
}