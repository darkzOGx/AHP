import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// This is important for Stripe webhooks - we need the raw body
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  let body: string;
  let signature: string | null;

  try {
    // Get the raw body - this is crucial for Stripe webhook signature verification
    body = await request.text();
    signature = request.headers.get('stripe-signature');

    console.log('Webhook received - Body length:', body.length);
    console.log('Signature present:', !!signature);

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    if (!endpointSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

  } catch (err) {
    console.error('Error reading request:', err);
    return NextResponse.json({ error: 'Error reading request' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature with the raw body
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log('✅ Webhook signature verified successfully');
    console.log('Event type:', event.type, 'Event ID:', event.id);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    console.error('Body preview (first 100 chars):', body.substring(0, 100));
    console.error('Signature:', signature);
    console.error('Webhook secret configured:', !!endpointSecret);
    return NextResponse.json({
      error: 'Webhook signature verification failed',
      details: (err as Error).message
    }, { status: 400 });
  }

  // Dynamic import to avoid build-time issues
  const { getAdminFirestore } = await import('@/lib/firebase-admin');
  const { Timestamp } = await import('firebase-admin/firestore');
  const db = getAdminFirestore();

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const firebaseUID = subscription.metadata.firebaseUID;
        const plan = subscription.metadata.plan;

        if (!firebaseUID) {
          console.error('No Firebase UID found in subscription metadata');
          return NextResponse.json({ error: 'No Firebase UID' }, { status: 400 });
        }

        // For updates, get the previous plan from metadata
        let oldPlan = null;
        let isNewSubscription = event.type === 'customer.subscription.created';
        
        if (!isNewSubscription) {
          // Check metadata for previous plan (set during upgrade)
          oldPlan = subscription.metadata.previousPlan || subscription.metadata.upgradeFrom || null;
          console.log(`🔍 Webhook plan change detection - Firebase UID: ${firebaseUID}, Previous plan: ${oldPlan}, New plan: ${plan}`);
          
          // Fallback: get from database if metadata doesn't have it
          if (!oldPlan) {
            try {
              const userDoc = await db.collection('users').doc(firebaseUID).get();
              const userData = userDoc.data();
              oldPlan = userData?.subscription?.plan || null;
              console.log(`📋 Fallback: Got old plan from database: ${oldPlan}`);
            } catch (error) {
              console.error('Error fetching old plan from database:', error);
            }
          }
        }

        // Prepare update data with proper timestamp validation
        const updateData: any = {
          'subscription.status': subscription.status,
          'subscription.plan': plan,
          'subscription.stripeCustomerId': subscription.customer,
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

        // Handle Enterprise subscription creation
        if (plan === 'enterprise' && event.type === 'customer.subscription.created') {
          const organizationName = subscription.metadata.organizationName || 'My Organization';
          
          // Create organization
          const organizationRef = await db.collection('organizations').add({
            name: organizationName,
            ownerId: firebaseUID,
            plan: 'enterprise',
            stripeCustomerId: subscription.customer,
            stripeSubscriptionId: subscription.id,
            settings: {
              maxUsers: 3, // Base plan includes 3 users
              additionalUsers: 0,
            },
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });

          // Create organization member record for the owner
          await db.collection('organizationMembers').add({
            organizationId: organizationRef.id,
            userId: firebaseUID,
            role: 'owner',
            permissions: ['*'], // Full permissions for owner
            invitedBy: firebaseUID,
            joinedAt: Timestamp.now(),
            personalizations: {
              theme: 'default',
              dashboardLayout: 'default'
            }
          });

          // Update user profile with organization info
          updateData.organizationId = organizationRef.id;
          updateData.organizationRole = 'owner';
        }

        console.log(`Updating subscription for user ${firebaseUID}:`, updateData);
        await db.collection('users').doc(firebaseUID).update(updateData);

        // Send appropriate email based on subscription change
        if (isNewSubscription) {
          // Send welcome email for new subscriptions
          try {
            // Get user details for welcome email
            const userDoc = await db.collection('users').doc(firebaseUID).get();
            const userData = userDoc.data();
            
            if (userData && userData.email) {
              const { sendWelcomeEmail } = await import('@/lib/email');
              
              const welcomeEmailData = {
                email: userData.email,
                name: userData.displayName || undefined,
                plan: plan as 'lite' | 'dealer' | 'enterprise',
                organizationName: plan === 'enterprise' ? (subscription.metadata.organizationName || 'My Organization') : undefined,
                isTrialing: subscription.status === 'trialing',
                trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000) : undefined
              };
              
              console.log('📧 Sending welcome email to:', userData.email);
              const emailResult = await sendWelcomeEmail(welcomeEmailData);
              
              if (emailResult.success) {
                console.log('✅ Welcome email sent successfully');
              } else {
                console.error('❌ Failed to send welcome email:', emailResult.error);
              }
            }
          } catch (emailError) {
            console.error('❌ Error sending welcome email:', emailError);
            // Don't fail the webhook if email fails
          }
        } else if (oldPlan && oldPlan !== plan) {
          // Send subscription change email for plan updates
          console.log(`📧 Plan change detected! Sending email for: ${oldPlan} → ${plan}`);
          try {
            // Get user details for change email
            const userDoc = await db.collection('users').doc(firebaseUID).get();
            const userData = userDoc.data();
            
            if (userData && userData.email) {
              const { sendSubscriptionChangeEmail } = await import('@/lib/email');
              
              // Determine if it's an upgrade or downgrade
              const planHierarchy = { 'lite': 1, 'dealer': 2, 'enterprise': 3 };
              const isUpgrade = planHierarchy[plan as keyof typeof planHierarchy] > planHierarchy[oldPlan as keyof typeof planHierarchy];
              
              const changeEmailData = {
                email: userData.email,
                name: userData.displayName || undefined,
                oldPlan: oldPlan as 'lite' | 'dealer' | 'enterprise',
                newPlan: plan as 'lite' | 'dealer' | 'enterprise',
                organizationName: plan === 'enterprise' ? (subscription.metadata.organizationName || 'My Organization') : undefined,
                isUpgrade,
                effectiveDate: subscription.current_period_start ? new Date(subscription.current_period_start * 1000) : undefined
              };
              
              console.log(`📧 Sending subscription change email to: ${userData.email} (${oldPlan} → ${plan})`);
              const emailResult = await sendSubscriptionChangeEmail(changeEmailData);
              
              if (emailResult.success) {
                console.log('✅ Subscription change email sent successfully');
              } else {
                console.error('❌ Failed to send subscription change email:', emailResult.error);
              }
            }
          } catch (emailError) {
            console.error('❌ Error sending subscription change email:', emailError);
            // Don't fail the webhook if email fails
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const firebaseUID = subscription.metadata.firebaseUID;

        if (firebaseUID) {
          await db.collection('users').doc(firebaseUID).update({
            'subscription.status': 'canceled',
            'subscription.updatedAt': Timestamp.now(),
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (!(invoice as any).subscription) break;
        const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
        const firebaseUID = subscription.metadata.firebaseUID;

        if (firebaseUID) {
          await db.collection('users').doc(firebaseUID).update({
            'subscription.status': subscription.status,
            'subscription.updatedAt': Timestamp.now(),
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
          const firebaseUID = subscription.metadata.firebaseUID;

          if (firebaseUID) {
            const updateData: any = {
              'subscription.status': subscription.status,
              'subscription.updatedAt': Timestamp.now(),
            };

            // Only add timestamp if it's a valid number
            const currentPeriodEnd = (subscription as any).current_period_end;
            if (currentPeriodEnd && typeof currentPeriodEnd === 'number') {
              updateData['subscription.currentPeriodEnd'] = Timestamp.fromMillis(currentPeriodEnd * 1000);
            }

            await db.collection('users').doc(firebaseUID).update(updateData);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}