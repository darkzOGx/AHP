import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

// This endpoint should only be called internally (from webhooks)
// It requires an internal secret to prevent abuse
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Verify internal secret for security
    const authHeader = request.headers.get('x-internal-secret');
    if (!INTERNAL_SECRET || authHeader !== INTERNAL_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, name, plan, organizationName, isTrialing, trialEndsAt } = await request.json();

    if (!email || !plan) {
      return NextResponse.json({
        error: 'Email and plan are required'
      }, { status: 400 });
    }

    // Send welcome email
    const result = await sendWelcomeEmail({
      email,
      name,
      plan,
      organizationName,
      isTrialing,
      trialEndsAt: trialEndsAt ? new Date(trialEndsAt) : undefined
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        messageId: result.messageId
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to send welcome email'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in send-welcome-email API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}