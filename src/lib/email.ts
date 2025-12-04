import { Resend } from 'resend';

interface InvitationEmailData {
  email: string;
  organizationName: string;
  role: 'admin' | 'member';
  inviteToken: string;
  inviterName?: string;
}

interface WelcomeEmailData {
  email: string;
  name?: string;
  plan: 'lite' | 'dealer' | 'enterprise';
  organizationName?: string;
  isTrialing?: boolean;
  trialEndsAt?: Date;
}

interface SubscriptionChangeEmailData {
  email: string;
  name?: string;
  oldPlan: 'lite' | 'dealer' | 'enterprise';
  newPlan: 'lite' | 'dealer' | 'enterprise';
  organizationName?: string;
  isUpgrade: boolean;
  effectiveDate?: Date;
}

export async function sendInvitationEmail(data: InvitationEmailData) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${data.inviteToken}`;
  
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured. Email will not be sent.');
    console.log('📧 Would send invitation email to:', data.email);
    console.log('📋 Invitation URL:', inviteUrl);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const emailResult = await resend.emails.send({
      from: 'AutoHunterPro <noreply@notifications.autohunterpro.com>',
      to: [data.email],
      subject: `You're invited to join ${data.organizationName} on AutoHunterPro`,
      html: generateInvitationEmailHtml(data, inviteUrl),
      text: generateInvitationEmailText(data, inviteUrl)
    });

    console.log('✅ Invitation email sent successfully:', emailResult.data?.id);
    return { success: true, messageId: emailResult.data?.id };
    
  } catch (error) {
    console.error('❌ Failed to send invitation email:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured. Welcome email will not be sent.');
    console.log('📧 Would send welcome email to:', data.email);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const subject = data.organizationName 
      ? `Welcome to AutoHunterPro Enterprise! ${data.organizationName} is ready`
      : `Welcome to AutoHunterPro ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}!`;

    const emailResult = await resend.emails.send({
      from: 'AutoHunterPro <noreply@notifications.autohunterpro.com>',
      to: [data.email],
      subject,
      html: generateWelcomeEmailHtml(data),
      text: generateWelcomeEmailText(data)
    });

    console.log('✅ Welcome email sent successfully:', emailResult.data?.id);
    return { success: true, messageId: emailResult.data?.id };
    
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendSubscriptionChangeEmail(data: SubscriptionChangeEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured. Subscription change email will not be sent.');
    console.log('📧 Would send subscription change email to:', data.email);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const changeType = data.isUpgrade ? 'upgraded' : 'changed';
    const subject = `Your AutoHunterPro plan has been ${changeType} to ${data.newPlan.charAt(0).toUpperCase() + data.newPlan.slice(1)}!`;

    const emailResult = await resend.emails.send({
      from: 'AutoHunterPro <noreply@notifications.autohunterpro.com>',
      to: [data.email],
      subject,
      html: generateSubscriptionChangeEmailHtml(data),
      text: generateSubscriptionChangeEmailText(data)
    });

    console.log('✅ Subscription change email sent successfully:', emailResult.data?.id);
    return { success: true, messageId: emailResult.data?.id };
    
  } catch (error) {
    console.error('❌ Failed to send subscription change email:', error);
    return { success: false, error: (error as Error).message };
  }
}

function generateInvitationEmailHtml(data: InvitationEmailData, inviteUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're invited to ${data.organizationName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body { 
      font-family: 'Inter', Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000; 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
      padding: 20px;
    }
    .email-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid #000000;
    }
    .header { 
      background: #dc2626; 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content { 
      padding: 40px 30px; 
      background: white;
    }
    .content h2 {
      color: #000000;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 24px 0;
      line-height: 1.3;
    }
    .content p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.6;
    }
    .button { 
      display: inline-block; 
      background: #dc2626;
      color: white; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 4px; 
      font-weight: 600; 
      font-size: 16px;
      margin: 24px 0;
      border: 2px solid #000000;
    }
    .button:hover {
      transform: translateY(-1px);
    }
    .role-badge { 
      background: #000000; 
      color: white; 
      padding: 6px 16px; 
      border-radius: 4px; 
      font-size: 14px; 
      font-weight: 600;
      display: inline-block;
      border: 1px solid #dc2626;
    }
    .features-box {
      background: #ffffff;
      border: 2px solid #000000;
      border-radius: 4px;
      padding: 24px;
      margin: 24px 0;
    }
    .features-box h3 {
      margin: 0 0 16px 0;
      color: #000000;
      font-size: 18px;
      font-weight: 600;
    }
    .features-box ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .features-box li {
      margin: 8px 0;
      padding-left: 24px;
      position: relative;
      font-size: 15px;
    }
    .features-box li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #dc2626;
      font-weight: bold;
    }
    .expiry-notice {
      background: #ffffff;
      border-left: 4px solid #dc2626;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 0 4px 4px 0;
      border: 1px solid #000000;
    }
    .expiry-notice p {
      margin: 0;
      font-weight: 500;
      color: #000000;
    }
    .footer { 
      background: #000000; 
      padding: 30px; 
      text-align: center; 
      border-top: 2px solid #dc2626;
    }
    .footer p {
      margin: 8px 0;
      font-size: 14px;
      color: #ffffff;
    }
    .footer-brand {
      font-weight: 600;
      color: #ffffff;
    }
    .url-fallback {
      background: #ffffff;
      padding: 16px;
      border-radius: 4px;
      margin: 20px 0;
      border: 1px solid #000000;
    }
    .url-fallback p {
      margin: 4px 0;
      font-size: 14px;
      color: #000000;
    }
    .url-fallback code {
      word-break: break-all;
      color: #000000;
      font-size: 12px;
      background: white;
      padding: 8px;
      border-radius: 4px;
      display: block;
      margin-top: 8px;
      border: 1px solid #dc2626;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>AutoHunterPro</h1>
      <p>Professional Vehicle Intelligence Platform</p>
    </div>
    
    <div class="content">
      <h2>You're invited to join ${data.organizationName}</h2>
      
      <p>Hello,</p>
      
      <p>You've been invited to join <strong>${data.organizationName}</strong> on AutoHunterPro as a <span class="role-badge">${data.role.charAt(0).toUpperCase() + data.role.slice(1)}</span>.</p>
      
      <div class="features-box">
        <h3>What you'll get access to:</h3>
        <ul>
          <li>Unlimited vehicle alerts and searches</li>
          <li>Shared organization dashboard</li>
          <li>Collaborative vehicle tracking</li>
          <li>AI-powered scam detection</li>
          <li>Real-time SMS and email notifications</li>
          ${data.role === 'admin' ? '<li>Team and organization management</li>' : ''}
        </ul>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${inviteUrl}" class="button">Accept Invitation</a>
      </div>
      
      <div class="expiry-notice">
        <p><strong>Important:</strong> This invitation expires in 7 days.</p>
      </div>
      
      <p>If you don't have an AutoHunterPro account yet, you'll be prompted to create one using this email address.</p>
      
      <div class="url-fallback">
        <p><em>If you're having trouble clicking the button, copy and paste this URL into your browser:</em></p>
        <code>${inviteUrl}</code>
      </div>
    </div>
    
    <div class="footer">
      <p class="footer-brand">AutoHunterPro</p>
      <p>AI-powered vehicle deal discovery</p>
      <p>This email was sent because you were invited to join an organization. If you believe this was sent in error, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>`;
}

function generateInvitationEmailText(data: InvitationEmailData, inviteUrl: string): string {
  return `
You're invited to join ${data.organizationName} on AutoHunterPro!

Hello,

You've been invited to join ${data.organizationName} on AutoHunterPro as a ${data.role.charAt(0).toUpperCase() + data.role.slice(1)}.

What you'll get access to:
- Unlimited vehicle alerts and searches
- Shared organization dashboard  
- Collaborative vehicle tracking
- AI-powered scam detection
- Real-time SMS and email notifications
${data.role === 'admin' ? '- Team and organization management' : ''}

Accept your invitation: ${inviteUrl}

IMPORTANT: This invitation expires in 7 days.

If you don't have an AutoHunterPro account yet, you'll be prompted to create one using this email address.

---

AutoHunterPro - AI-powered vehicle deal discovery
This email was sent because you were invited to join an organization. If you believe this was sent in error, you can safely ignore this email.
`.trim();
}

function generateWelcomeEmailHtml(data: WelcomeEmailData): string {
  const planFeatures = getPlanFeatures(data.plan);
  const isEnterprise = data.plan === 'enterprise';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AutoHunterPro ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)}!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body { 
      font-family: 'Inter', Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000; 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
      padding: 20px;
    }
    .email-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid #000000;
    }
    .header { 
      background: #dc2626; 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 {
      margin: 0 0 16px 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .plan-badge {
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 8px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      margin: 16px 0 8px 0;
      border: 2px solid rgba(255,255,255,0.8);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .content { 
      padding: 40px 30px; 
      background: white;
    }
    .content h2 {
      color: #111827;
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 24px 0;
      line-height: 1.3;
    }
    .content h3 {
      color: #000000;
      font-size: 20px;
      font-weight: 600;
      margin: 32px 0 16px 0;
      line-height: 1.4;
    }
    .content p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.6;
    }
    .button { 
      display: inline-block; 
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: white; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      font-size: 16px;
      margin: 32px 0;
      transition: transform 0.2s;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    }
    .button:hover {
      transform: translateY(-1px);
    }
    .feature-list { 
      background: #ffffff; 
      padding: 32px; 
      border-radius: 4px; 
      margin: 32px 0; 
      border: 2px solid #000000;
    }
    .feature-list h3 {
      margin: 0 0 20px 0;
      color: #000000;
      font-size: 18px;
      font-weight: 600;
    }
    .feature-list ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .feature-list li {
      margin: 12px 0;
      padding-left: 28px;
      position: relative;
      font-size: 15px;
      line-height: 1.5;
    }
    .feature-list li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #dc2626;
      font-weight: bold;
      font-size: 16px;
    }
    .trial-notice { 
      background: #ffffff; 
      border-left: 4px solid #dc2626; 
      padding: 24px 28px; 
      border-radius: 0 4px 4px 0; 
      margin: 32px 0;
      border: 1px solid #000000;
    }
    .trial-notice p {
      margin: 0;
      font-weight: 500;
      color: #000000;
      font-size: 16px;
    }
    .enterprise-box {
      background: #ffffff;
      border: 2px solid #dc2626;
      border-radius: 4px;
      padding: 32px;
      margin: 32px 0;
    }
    .enterprise-box h3 {
      margin: 0 0 16px 0;
      color: #000000;
      font-size: 20px;
    }
    .enterprise-box p {
      color: #000000;
      margin: 12px 0;
    }
    .enterprise-box ul {
      color: #000000;
      margin: 16px 0;
      padding-left: 20px;
    }
    .enterprise-box li {
      margin: 8px 0;
      line-height: 1.5;
    }
    .quick-start {
      background: #ffffff;
      border-radius: 4px;
      padding: 32px;
      margin: 32px 0;
      border: 1px solid #000000;
    }
    .quick-start ol {
      margin: 0;
      padding-left: 24px;
    }
    .quick-start li {
      margin: 16px 0;
      line-height: 1.6;
      font-size: 15px;
    }
    .footer { 
      background: #f9fafb; 
      padding: 32px 30px; 
      text-align: center; 
      border-top: 1px solid #e5e7eb;
    }
    .footer p {
      margin: 8px 0;
      font-size: 14px;
      color: #6b7280;
    }
    .footer-brand {
      font-weight: 600;
      color: #374151;
      font-size: 16px;
    }
    .footer a {
      color: #dc2626;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to AutoHunterPro</h1>
      <div class="plan-badge">${data.plan.toUpperCase()} Plan</div>
      ${isEnterprise && data.organizationName ? `<p style="margin: 16px 0 8px 0; font-size: 18px; font-weight: 500;">${data.organizationName}</p>` : ''}
      <p>Professional Vehicle Intelligence Platform</p>
    </div>
    
    <div class="content">
      <h2>You're all set to find exceptional vehicle deals</h2>
      
      <p>Hello ${data.name ? data.name.split(' ')[0] : 'there'},</p>
      
      <p>Welcome to AutoHunterPro! Your ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)} subscription is now active and you have access to all our powerful features:</p>
      
      <div class="feature-list">
        <h3>Your ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)} Plan includes:</h3>
        <ul>
          ${planFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>

      ${data.isTrialing && data.trialEndsAt ? `
      <div class="trial-notice">
        <p><strong>Free Trial Active:</strong> Your trial ends on ${data.trialEndsAt.toLocaleDateString()}. No charges until then.</p>
      </div>
      ` : ''}

      ${isEnterprise ? `
      <div class="enterprise-box">
        <h3>Enterprise Organization Setup</h3>
        <p>Your organization <strong>${data.organizationName || 'Enterprise Account'}</strong> is ready! You can now:</p>
        <ul>
          <li>Invite team members to collaborate</li>
          <li>Share alerts and searches across your team</li>
          <li>Manage user permissions and roles</li>
          <li>Track team performance and analytics</li>
        </ul>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://autohunterpro.com'}/dashboard" class="button">Get Started Now</a>
      </div>

      <div class="quick-start">
        <h3>Quick Start Guide</h3>
        <ol>
          <li><strong>Create your first alert:</strong> Set up search criteria for vehicles you're interested in</li>
          <li><strong>Configure notifications:</strong> Choose email, SMS, or both for instant alerts</li>
          <li><strong>Browse active listings:</strong> See what's currently available in your area</li>
          ${isEnterprise ? '<li><strong>Invite your team:</strong> Add team members to collaborate on searches</li>' : ''}
          <li><strong>Track your finds:</strong> Mark vehicles as "contacted" or "purchase in progress"</li>
        </ol>
      </div>

      <p>Questions? Simply reply to this email - we're here to help!</p>

      <p>Best regards,<br><strong>The AutoHunterPro Team</strong></p>
    </div>
    
    <div class="footer">
      <p class="footer-brand">AutoHunterPro</p>
      <p>AI-powered vehicle deal discovery</p>
      <p>This email was sent because you subscribed to AutoHunterPro. Manage your subscription in your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://autohunterpro.com'}/dashboard">dashboard</a>.</p>
    </div>
  </div>
</body>
</html>`;
}

function generateWelcomeEmailText(data: WelcomeEmailData): string {
  const planFeatures = getPlanFeatures(data.plan);
  const isEnterprise = data.plan === 'enterprise';
  
  return `
Welcome to AutoHunterPro ${data.plan.toUpperCase()} Plan!
${isEnterprise && data.organizationName ? `Organization: ${data.organizationName}` : ''}

Hello ${data.name ? data.name.split(' ')[0] : 'there'},

Welcome to AutoHunterPro! Your ${data.plan.charAt(0).toUpperCase() + data.plan.slice(1)} subscription is now active.

Your ${data.plan.toUpperCase()} Plan includes:
${planFeatures.map(feature => `• ${feature}`).join('\n')}

${data.isTrialing && data.trialEndsAt ? `
FREE TRIAL ACTIVE
Your trial ends on ${data.trialEndsAt.toLocaleDateString()}. No charges until then.
` : ''}

${isEnterprise ? `
Enterprise Organization: ${data.organizationName || 'Enterprise Account'}
Your organization is ready! You can now invite team members, share alerts, manage permissions, and track team analytics.
` : ''}

Quick Start Guide:
1. Create your first vehicle alert
2. Configure email/SMS notifications  
3. Browse active listings in your area
${isEnterprise ? '4. Invite team members to collaborate\n5. Track your team\'s finds and performance' : '4. Track vehicles as "contacted" or "purchase in progress"'}

Get started: ${process.env.NEXT_PUBLIC_APP_URL || 'https://autohunterpro.com'}/dashboard

Questions? Simply reply to this email - we're here to help!

Best regards,
The AutoHunterPro Team

---
AutoHunterPro - AI-powered vehicle deal discovery
Manage your subscription: ${process.env.NEXT_PUBLIC_APP_URL || 'https://autohunterpro.com'}/dashboard
`.trim();
}

function getPlanFeatures(plan: 'lite' | 'dealer' | 'enterprise'): string[] {
  const features = {
    lite: [
      'Up to 5 active vehicle alerts',
      'Real-time email notifications', 
      'Basic search filtering',
      'Mobile-responsive dashboard',
      'Customer support'
    ],
    dealer: [
      'Unlimited vehicle alerts',
      'Real-time email & SMS notifications',
      'Advanced search filters',
      'AI-powered scam detection',
      'Vehicle tracking and notes',
      'Export capabilities',
      'Priority customer support'
    ],
    enterprise: [
      'Everything in Dealer plan',
      'Team collaboration features',
      'Organization management',
      'User roles and permissions', 
      'Team analytics and reporting',
      'Shared alerts and searches',
      'Custom branding options',
      'Dedicated account manager',
      'Advanced API access'
    ]
  };
  
  return features[plan];
}

function generateSubscriptionChangeEmailHtml(data: SubscriptionChangeEmailData): string {
  const newPlanFeatures = getPlanFeatures(data.newPlan);
  const isUpgrade = data.isUpgrade;
  const isEnterprise = data.newPlan === 'enterprise';
  const wasEnterprise = data.oldPlan === 'enterprise';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AutoHunterPro plan has been ${isUpgrade ? 'upgraded' : 'updated'}!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    body { 
      font-family: 'Inter', Arial, sans-serif; 
      line-height: 1.6; 
      color: #000000; 
      max-width: 600px; 
      margin: 0 auto; 
      background-color: #ffffff;
      padding: 20px;
    }
    .email-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid #000000;
    }
    .header { 
      background: #dc2626; 
      color: white; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 {
      margin: 0 0 16px 0;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header p {
      margin: 8px 0;
      font-size: 16px;
      opacity: 0.9;
    }
    .content { 
      padding: 40px 30px; 
      background: white;
    }
    .content h2 {
      color: #000000;
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 24px 0;
      line-height: 1.3;
    }
    .content h3 {
      color: #000000;
      font-size: 20px;
      font-weight: 600;
      margin: 32px 0 16px 0;
      line-height: 1.4;
    }
    .content p {
      margin: 16px 0;
      font-size: 16px;
      line-height: 1.6;
    }
    .button { 
      display: inline-block; 
      background: #dc2626;
      color: white; 
      padding: 16px 32px; 
      text-decoration: none; 
      border-radius: 4px; 
      font-weight: 600; 
      font-size: 16px;
      margin: 32px 0;
      border: 2px solid #000000;
    }
    .button:hover {
      transform: translateY(-1px);
    }
    .plan-comparison { 
      display: flex; 
      gap: 20px; 
      margin: 32px 0; 
    }
    @media (max-width: 480px) {
      .plan-comparison {
        flex-direction: column;
        gap: 16px;
      }
    }
    .plan-box { 
      flex: 1; 
      padding: 24px; 
      border-radius: 12px; 
      text-align: center; 
    }
    .old-plan { 
      background: #ffffff; 
      border: 2px solid #000000; 
      opacity: 0.7; 
    }
    .new-plan { 
      background: #ffffff; 
      border: 2px solid #dc2626; 
    }
    .plan-badge {
      background: #dc2626;
      color: white;
      padding: 8px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
      display: inline-block;
      margin: 16px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .feature-list { 
      background: #ffffff; 
      padding: 32px; 
      border-radius: 4px; 
      margin: 32px 0; 
      border: 2px solid #000000;
    }
    .feature-list h3 {
      margin: 0 0 20px 0;
      color: #000000;
      font-size: 18px;
      font-weight: 600;
    }
    .feature-list ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .feature-list li {
      margin: 12px 0;
      padding-left: 28px;
      position: relative;
      font-size: 15px;
      line-height: 1.5;
    }
    .feature-list li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #dc2626;
      font-weight: bold;
      font-size: 16px;
    }
    .upgrade-notice { 
      background: #ffffff; 
      border-left: 4px solid #dc2626; 
      padding: 24px 28px; 
      border-radius: 0 4px 4px 0; 
      margin: 32px 0;
      border: 1px solid #000000;
    }
    .upgrade-notice p {
      margin: 0;
      font-weight: 500;
      color: #000000;
      font-size: 16px;
    }
    .change-notice { 
      background: #ffffff; 
      border-left: 4px solid #dc2626; 
      padding: 24px 28px; 
      border-radius: 0 4px 4px 0; 
      margin: 32px 0;
      border: 1px solid #000000;
    }
    .change-notice p {
      margin: 0;
      font-weight: 500;
      color: #000000;
      font-size: 16px;
    }
    .enterprise-box {
      background: #ffffff;
      border: 2px solid #dc2626;
      border-radius: 4px;
      padding: 32px;
      margin: 32px 0;
    }
    .enterprise-box h3 {
      margin: 0 0 16px 0;
      color: #000000;
      font-size: 20px;
    }
    .enterprise-box p {
      color: #000000;
      margin: 12px 0;
    }
    .enterprise-box ul {
      color: #000000;
      margin: 16px 0;
      padding-left: 20px;
    }
    .enterprise-box li {
      margin: 8px 0;
      line-height: 1.5;
    }
    .important-changes {
      background: #ffffff;
      border: 2px solid #dc2626;
      border-radius: 4px;
      padding: 32px;
      margin: 32px 0;
    }
    .important-changes h3 {
      margin: 0 0 16px 0;
      color: #000000;
      font-size: 20px;
    }
    .important-changes p {
      color: #000000;
      margin: 12px 0;
    }
    .important-changes ul {
      color: #000000;
      margin: 16px 0;
      padding-left: 20px;
    }
    .important-changes li {
      margin: 8px 0;
      line-height: 1.5;
    }
    .footer { 
      background: #000000; 
      padding: 32px 30px; 
      text-align: center; 
      border-top: 2px solid #dc2626;
    }
    .footer p {
      margin: 8px 0;
      font-size: 14px;
      color: #ffffff;
    }
    .footer-brand {
      font-weight: 600;
      color: #ffffff;
      font-size: 16px;
    }
    .footer a {
      color: #dc2626;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Plan ${isUpgrade ? 'Upgraded' : 'Updated'} Successfully</h1>
      <p>Welcome to ${data.newPlan.toUpperCase()} Plan</p>
      ${isEnterprise && data.organizationName ? `<p style="margin: 16px 0 8px 0; font-size: 18px; font-weight: 500;">${data.organizationName}</p>` : ''}
    </div>
    
    <div class="content">
      <h2>${isUpgrade ? 'You\'ve unlocked enhanced capabilities' : 'Your plan has been updated'}</h2>
      
      <p>Hello ${data.name ? data.name.split(' ')[0] : 'there'},</p>
      
      <p>Your AutoHunterPro subscription has been ${isUpgrade ? 'successfully upgraded' : 'updated'}! Here's what changed:</p>

      <div class="plan-comparison">
        <div class="plan-box old-plan">
          <h3>Previous Plan</h3>
          <div style="background: #000000; color: white; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-weight: 600; display: inline-block; margin: 16px 0; text-transform: uppercase; letter-spacing: 1px; border: 1px solid #dc2626;">${data.oldPlan}</div>
        </div>
        <div class="plan-box new-plan">
          <h3>Current Plan</h3>
          <div class="plan-badge">${data.newPlan}</div>
        </div>
      </div>

      ${isUpgrade ? `
      <div class="upgrade-notice">
        <p><strong>Congratulations on your upgrade!</strong><br>
        You now have access to all the enhanced features below.
        ${data.effectiveDate ? `Changes are effective ${data.effectiveDate.toLocaleDateString()}.` : 'Changes are effective immediately.'}</p>
      </div>
      ` : `
      <div class="change-notice">
        <p><strong>Plan Updated</strong><br>
        Your plan has been changed to better fit your needs.
        ${data.effectiveDate ? `Changes are effective ${data.effectiveDate.toLocaleDateString()}.` : 'Changes are effective immediately.'}</p>
      </div>
      `}

      <div class="feature-list">
        <h3>Your ${data.newPlan.charAt(0).toUpperCase() + data.newPlan.slice(1)} Plan now includes:</h3>
        <ul>
          ${newPlanFeatures.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
      </div>

      ${isEnterprise && !wasEnterprise ? `
      <div class="enterprise-box">
        <h3>Enterprise Organization Features</h3>
        <p>Your organization <strong>${data.organizationName || 'Enterprise Account'}</strong> now has access to:</p>
        <ul>
          <li>Team collaboration and member management</li>
          <li>Shared alerts and searches across your organization</li>
          <li>Advanced user permissions and roles</li>
          <li>Organization-wide analytics and reporting</li>
          <li>Custom branding options</li>
        </ul>
      </div>
      ` : ''}

      ${!isEnterprise && wasEnterprise ? `
      <div class="important-changes">
        <h3>Important Changes</h3>
        <p>Since you've moved from Enterprise to ${data.newPlan.charAt(0).toUpperCase() + data.newPlan.slice(1)}, please note:</p>
        <ul>
          <li>Organization features are no longer available</li>
          <li>Team members will lose access to shared features</li>
          <li>Your account is now individual-focused</li>
        </ul>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://autohunterpro.com'}/dashboard" class="button">Explore Your New Features</a>
      </div>

      <h3>Getting the most from your ${data.newPlan.charAt(0).toUpperCase() + data.newPlan.slice(1)} plan:</h3>
      <ul>
        <li>Review your dashboard for new features and options</li>
        ${isUpgrade ? '<li>Set up additional alerts to take advantage of your enhanced limits</li>' : ''}
        ${isEnterprise ? '<li>Invite team members to start collaborating</li>' : ''}
        <li>Update your notification preferences if needed</li>
        ${isUpgrade ? '<li>Explore advanced filtering and AI-powered features</li>' : ''}
      </ul>

      <p>Questions about your new plan? Simply reply to this email - we're here to help!</p>

      <p>Best regards,<br><strong>The AutoHunterPro Team</strong></p>
    </div>
    
    <div class="footer">
      <p class="footer-brand">AutoHunterPro</p>
      <p>AI-powered vehicle deal discovery</p>
      <p>Manage your subscription: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://autohunterpro.com'}/dashboard">Dashboard</a> | <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://autohunterpro.com'}/settings">Billing Portal</a></p>
    </div>
  </div>
</body>
</html>`;
}

function generateSubscriptionChangeEmailText(data: SubscriptionChangeEmailData): string {
  const newPlanFeatures = getPlanFeatures(data.newPlan);
  const isUpgrade = data.isUpgrade;
  const isEnterprise = data.newPlan === 'enterprise';
  const wasEnterprise = data.oldPlan === 'enterprise';
  
  return `
${isUpgrade ? '🎉 Plan Upgraded!' : '📝 Plan Changed'} - Welcome to AutoHunterPro ${data.newPlan.toUpperCase()}!
${isEnterprise && data.organizationName ? `Organization: ${data.organizationName}` : ''}

Hi ${data.name ? data.name.split(' ')[0] : 'there'},

Your AutoHunterPro subscription has been ${isUpgrade ? 'upgraded' : 'updated'}!

Plan Change: ${data.oldPlan.toUpperCase()} → ${data.newPlan.toUpperCase()}

${isUpgrade ? `
✨ Congratulations on your upgrade!
You now have access to all the premium features below.
` : `
📋 Plan Updated
Your plan has been changed to better fit your needs.
`}

${data.effectiveDate ? `Changes are effective ${data.effectiveDate.toLocaleDateString()}.` : 'Changes are effective immediately.'}

✨ Your ${data.newPlan.toUpperCase()} Plan now includes:
${newPlanFeatures.map(feature => `✅ ${feature}`).join('\n')}

${isEnterprise && !wasEnterprise ? `
🏢 Enterprise Organization Features:
• Team collaboration and member management
• Shared alerts and searches across your organization  
• Advanced user permissions and roles
• Organization-wide analytics and reporting
• Custom branding options
` : ''}

${!isEnterprise && wasEnterprise ? `
📋 Important Changes:
Since you've moved from Enterprise to ${data.newPlan}, please note:
• Organization features are no longer available
• Team members will lose access to shared features
• Your account is now individual-focused
` : ''}

💡 Getting the most from your ${data.newPlan} plan:
• Review your dashboard for new features and options
${isUpgrade ? '• Set up additional alerts to take advantage of your enhanced limits' : ''}
${isEnterprise ? '• Invite team members to start collaborating' : ''}
• Update your notification preferences if needed
${isUpgrade ? '• Explore advanced filtering and AI-powered features' : ''}

Explore your new features: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Questions about your new plan? Just reply to this email - we're here to help!

Happy hunting with your ${isUpgrade ? 'upgraded' : 'updated'} features! 🎯
The AutoHunterPro Team

---
AutoHunterPro - AI-powered vehicle deal discovery
Manage your subscription: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
Billing Portal: ${process.env.NEXT_PUBLIC_APP_URL}/billing
`.trim();
}