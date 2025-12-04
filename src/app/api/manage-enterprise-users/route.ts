import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PRICE_IDS } from '@/lib/stripe';
import { verifyAuth } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { action, organizationId, userId } = await request.json();

    if (!action || !organizationId) {
      return NextResponse.json({
        error: 'Missing required fields: action, organizationId'
      }, { status: 400 });
    }

    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Dynamic import to avoid build-time issues
    const { getAdminFirestore } = await import('@/lib/firebase-admin');
    const db = getAdminFirestore();

    // Verify the caller is an admin or owner of the organization
    const memberSnapshot = await db.collection('organizationMembers')
      .where('userId', '==', auth.user.uid)
      .where('organizationId', '==', organizationId)
      .get();

    if (memberSnapshot.empty) {
      return NextResponse.json({ error: 'You are not a member of this organization' }, { status: 403 });
    }

    const callerMemberData = memberSnapshot.docs[0].data();
    if (!['owner', 'admin'].includes(callerMemberData.role)) {
      return NextResponse.json({ error: 'Only admins and owners can manage enterprise users' }, { status: 403 });
    }

    // Get organization details
    const orgDoc = await db.collection('organizations').doc(organizationId).get();
    if (!orgDoc.exists) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const orgData = orgDoc.data();
    if (!orgData) {
      return NextResponse.json({ error: 'Organization data not found' }, { status: 404 });
    }

    // Get organization subscription details
    if (!orgData.subscription?.stripeSubscriptionId) {
      return NextResponse.json({ 
        error: 'Organization does not have an active subscription' 
      }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(orgData.subscription.stripeSubscriptionId);
    
    // Verify this is an enterprise subscription
    const enterpriseLineItem = subscription.items.data.find(
      item => item.price.id === PRICE_IDS.ENTERPRISE
    );
    
    if (!enterpriseLineItem) {
      return NextResponse.json({ 
        error: 'Organization does not have an Enterprise subscription' 
      }, { status: 400 });
    }

    // Count current organization members
    const membersSnapshot = await db.collection('organizationMembers')
      .where('organizationId', '==', organizationId)
      .get();
    
    const currentMemberCount = membersSnapshot.size;
    const baseUsers = 3; // Enterprise includes 3 users
    const additionalUsers = Math.max(0, currentMemberCount - baseUsers);
    
    if (action === 'add_user') {
      const newAdditionalUsers = Math.max(0, currentMemberCount + 1 - baseUsers);
      
      if (newAdditionalUsers > additionalUsers) {
        // Need to add additional user billing
        const additionalUserItem = subscription.items.data.find(
          item => item.price.id === PRICE_IDS.ENTERPRISE_ADDITIONAL_USER
        );

        if (additionalUserItem) {
          // Update existing additional user line item
          await stripe.subscriptionItems.update(additionalUserItem.id, {
            quantity: newAdditionalUsers,
            proration_behavior: 'create_prorations'
          });
        } else {
          // Add new additional user line item
          await stripe.subscriptionItems.create({
            subscription: subscription.id,
            price: PRICE_IDS.ENTERPRISE_ADDITIONAL_USER,
            quantity: newAdditionalUsers,
            proration_behavior: 'create_prorations'
          });
        }

        console.log(`✅ Added billing for additional user. Total additional users: ${newAdditionalUsers}`);
      }

    } else if (action === 'remove_user') {
      const newAdditionalUsers = Math.max(0, currentMemberCount - 1 - baseUsers);
      
      if (newAdditionalUsers < additionalUsers) {
        const additionalUserItem = subscription.items.data.find(
          item => item.price.id === PRICE_IDS.ENTERPRISE_ADDITIONAL_USER
        );

        if (additionalUserItem) {
          if (newAdditionalUsers === 0) {
            // Remove the additional user line item entirely
            await stripe.subscriptionItems.del(additionalUserItem.id, {
              proration_behavior: 'create_prorations'
            });
          } else {
            // Update quantity
            await stripe.subscriptionItems.update(additionalUserItem.id, {
              quantity: newAdditionalUsers,
              proration_behavior: 'create_prorations'
            });
          }

          console.log(`✅ Updated billing for user removal. Total additional users: ${newAdditionalUsers}`);
        }
      }
    }

    // Update organization settings with new user count
    await db.collection('organizations').doc(organizationId).update({
      'settings.currentUsers': action === 'add_user' ? currentMemberCount + 1 : currentMemberCount - 1,
      'settings.additionalUsers': action === 'add_user' 
        ? Math.max(0, currentMemberCount + 1 - baseUsers)
        : Math.max(0, currentMemberCount - 1 - baseUsers),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: `User ${action} processed successfully`,
      currentUsers: action === 'add_user' ? currentMemberCount + 1 : currentMemberCount - 1,
      additionalUsers: action === 'add_user' 
        ? Math.max(0, currentMemberCount + 1 - baseUsers)
        : Math.max(0, currentMemberCount - 1 - baseUsers)
    });

  } catch (error) {
    console.error('Error managing enterprise users:', error);
    return NextResponse.json(
      { error: 'Failed to manage enterprise users', details: (error as Error).message },
      { status: 500 }
    );
  }
}