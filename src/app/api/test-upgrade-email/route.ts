import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, oldPlan, newPlan, name } = await request.json();

    if (!email || !oldPlan || !newPlan) {
      return NextResponse.json({ 
        error: 'Email, oldPlan, and newPlan are required' 
      }, { status: 400 });
    }

    const { sendSubscriptionChangeEmail } = await import('@/lib/email');
    
    // Determine if it's an upgrade or downgrade
    const planHierarchy = { 'lite': 1, 'dealer': 2, 'enterprise': 3 };
    const isUpgrade = planHierarchy[newPlan as keyof typeof planHierarchy] > planHierarchy[oldPlan as keyof typeof planHierarchy];
    
    const changeEmailData = {
      email,
      name: name || undefined,
      oldPlan: oldPlan as 'lite' | 'dealer' | 'enterprise',
      newPlan: newPlan as 'lite' | 'dealer' | 'enterprise',
      organizationName: newPlan === 'enterprise' ? 'Test Organization' : undefined,
      isUpgrade,
      effectiveDate: new Date()
    };
    
    console.log(`📧 Manually sending subscription change email to: ${email} (${oldPlan} → ${newPlan})`);
    const emailResult = await sendSubscriptionChangeEmail(changeEmailData);
    
    if (emailResult.success) {
      console.log('✅ Test subscription change email sent successfully');
      return NextResponse.json({ 
        success: true, 
        message: 'Subscription change email sent successfully',
        messageId: emailResult.messageId 
      });
    } else {
      console.error('❌ Failed to send test subscription change email:', emailResult.error);
      return NextResponse.json({ 
        error: 'Failed to send email', 
        details: emailResult.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error in test upgrade email:', error);
    return NextResponse.json(
      { error: 'Error sending test email', details: (error as Error).message },
      { status: 500 }
    );
  }
}