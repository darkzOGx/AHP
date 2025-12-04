const { sendWelcomeEmail, sendSubscriptionChangeEmail, sendInvitationEmail } = require('./src/lib/email.ts');

async function testAllEmails() {
  const testEmail = 'prottoyrudra7777@gmail.com';
  
  console.log('🔥 Testing all email templates...\n');

  // Test 1: Welcome Email - Dealer Plan
  console.log('1️⃣ Sending welcome email (Dealer plan)...');
  try {
    const welcomeResult = await sendWelcomeEmail({
      email: testEmail,
      name: 'Test User', 
      plan: 'dealer',
      isTrialing: true,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
    });
    console.log('✅ Welcome email result:', welcomeResult);
  } catch (error) {
    console.log('❌ Welcome email error:', error.message);
  }

  // Wait a bit between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Welcome Email - Enterprise Plan
  console.log('\n2️⃣ Sending welcome email (Enterprise plan)...');
  try {
    const enterpriseWelcomeResult = await sendWelcomeEmail({
      email: testEmail,
      name: 'Enterprise Test User', 
      plan: 'enterprise',
      organizationName: 'Test Motors Inc',
      isTrialing: true,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });
    console.log('✅ Enterprise welcome email result:', enterpriseWelcomeResult);
  } catch (error) {
    console.log('❌ Enterprise welcome email error:', error.message);
  }

  // Wait a bit between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 3: Subscription Upgrade Email
  console.log('\n3️⃣ Sending subscription upgrade email...');
  try {
    const upgradeResult = await sendSubscriptionChangeEmail({
      email: testEmail,
      name: 'Upgrade Test User',
      oldPlan: 'dealer',
      newPlan: 'enterprise',
      organizationName: 'Upgraded Motors LLC',
      isUpgrade: true,
      effectiveDate: new Date()
    });
    console.log('✅ Upgrade email result:', upgradeResult);
  } catch (error) {
    console.log('❌ Upgrade email error:', error.message);
  }

  // Wait a bit between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 4: Subscription Downgrade Email
  console.log('\n4️⃣ Sending subscription downgrade email...');
  try {
    const downgradeResult = await sendSubscriptionChangeEmail({
      email: testEmail,
      name: 'Downgrade Test User',
      oldPlan: 'enterprise',
      newPlan: 'dealer',
      isUpgrade: false,
      effectiveDate: new Date()
    });
    console.log('✅ Downgrade email result:', downgradeResult);
  } catch (error) {
    console.log('❌ Downgrade email error:', error.message);
  }

  // Wait a bit between emails
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 5: Invitation Email
  console.log('\n5️⃣ Sending invitation email...');
  try {
    const inviteResult = await sendInvitationEmail({
      email: testEmail,
      organizationName: 'Test Dealership Group',
      role: 'admin',
      inviteToken: 'test-token-123',
      inviterName: 'John Doe'
    });
    console.log('✅ Invitation email result:', inviteResult);
  } catch (error) {
    console.log('❌ Invitation email error:', error.message);
  }

  console.log('\n🎉 All email tests completed!');
  console.log('📧 Check your inbox at prottoyrudra7777@gmail.com');
}

testAllEmails().catch(console.error);