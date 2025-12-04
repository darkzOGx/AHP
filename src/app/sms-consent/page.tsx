'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquareText } from 'lucide-react';
import Link from 'next/link';

export default function SmsConsentPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <MessageSquareText className="h-8 w-8 text-brand-gray-400" />
            <CardTitle className="text-3xl font-headline">SMS Messaging Consent</CardTitle>
          </div>
          <CardDescription>
            Information regarding our SMS alert service.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-brand-gray-300 leading-relaxed">
          <p>
            By providing your phone number and opting in to receive SMS alerts from AutohunterPro, you expressly consent to receive automated text messages from us at the phone number you provide.
          </p>
          <p>
            These messages will be related to vehicle alerts that match the criteria you have set in your account. The frequency of messages will vary depending on the number of matching vehicles found.
          </p>
          <p>
            <strong>Message and data rates may apply.</strong> Please consult your mobile carrier for details on your specific plan.
          </p>
          <p>
            You can opt-out of receiving SMS messages at any time. To do so, you can disable the "Receive alerts via SMS" option on the{' '}
            <Link href="/create-alert" className="underline hover:text-brand-gray-400">
              Create Alert
            </Link>
            {' '}page. You can also reply "STOP" to any message you receive from us to unsubscribe.
          </p>
          <p>
            Your consent to receive SMS messages is not a condition of any purchase. Your privacy is important to us, and we will not share your phone number with third parties for marketing purposes.
          </p>
          <p>
            If you have any questions, please contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
