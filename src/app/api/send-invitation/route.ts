import { NextRequest, NextResponse } from 'next/server';
import { sendInvitationEmail } from '@/lib/email';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, organizationName, organizationId, role, inviteToken, inviterName } = await request.json();

    if (!email || !organizationName || !organizationId || !role || !inviteToken) {
      return NextResponse.json({
        error: 'Missing required fields: email, organizationName, organizationId, role, inviteToken'
      }, { status: 400 });
    }

    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Verify the caller is an admin or owner of the organization
    const { getAdminFirestore } = await import('@/lib/firebase-admin');
    const db = getAdminFirestore();

    const memberSnapshot = await db.collection('organizationMembers')
      .where('userId', '==', auth.user.uid)
      .where('organizationId', '==', organizationId)
      .get();

    if (memberSnapshot.empty) {
      return NextResponse.json({ error: 'You are not a member of this organization' }, { status: 403 });
    }

    const memberData = memberSnapshot.docs[0].data();
    if (!['owner', 'admin'].includes(memberData.role)) {
      return NextResponse.json({ error: 'Only admins and owners can send invitations' }, { status: 403 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 });
    }

    // Validate role
    if (!['admin', 'member'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be admin or member' 
      }, { status: 400 });
    }

    console.log(`📧 Sending invitation email to ${email} for ${organizationName}`);

    const result = await sendInvitationEmail({
      email,
      organizationName,
      role,
      inviteToken,
      inviterName
    });

    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: 'Invitation email sent successfully',
        messageId: result.messageId 
      });
    } else {
      throw new Error('Failed to send email');
    }

  } catch (error) {
    console.error('Error sending invitation email:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation email', details: (error as Error).message },
      { status: 500 }
    );
  }
}