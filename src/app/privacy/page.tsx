import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-gray-400">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg text-brand-gray-300">
            Last Updated: January 2025
          </p>
        </div>

        {/* Content */}
        <Card className="border-2 border-brand-gray-100">
          <CardContent className="p-6 md:p-8 space-y-6 text-brand-gray-300">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">1. Introduction</h2>
              <p>
                AutoHunterPro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our vehicle sourcing platform and services.
              </p>
              <p>
                By using AutoHunterPro, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">2.1 Personal Information</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials (username, password)</li>
                <li>Payment and billing information</li>
                <li>Vehicle search preferences and saved alerts</li>
                <li>Communications with our support team</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">2.2 Automatically Collected Information</h3>
              <p>When you use our services, we automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, features used, search queries)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (if you enable location services)</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">2.3 Third-Party Information</h3>
              <p>We may receive information from third parties, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication providers (Google Sign-In)</li>
                <li>Payment processors (Stripe)</li>
                <li>Analytics services</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">3. How We Use Your Information</h2>
              <p>We use the collected information for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Providing and maintaining our services</li>
                <li>Processing your transactions and subscriptions</li>
                <li>Sending vehicle alerts and notifications based on your preferences</li>
                <li>Improving and personalizing your experience</li>
                <li>Communicating with you about updates, offers, and support</li>
                <li>Analyzing usage patterns and optimizing our platform</li>
                <li>Detecting and preventing fraud and security threats</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">4. Information Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information with:</p>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">4.1 Service Providers</h3>
              <p>
                We share information with third-party vendors who perform services on our behalf, including payment processing, data analysis, email delivery, hosting services, and customer service.
              </p>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">4.2 Legal Requirements</h3>
              <p>We may disclose your information if required to do so by law or in response to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Valid legal processes (subpoenas, court orders)</li>
                <li>Requests from government authorities</li>
                <li>Protection of our rights, property, or safety</li>
                <li>Prevention of fraud or illegal activities</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">4.3 Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure payment processing through PCI-compliant providers</li>
              </ul>
              <p className="mt-3">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">6. Your Privacy Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request limitation on how we use your data</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at privacy@autohunterpro.com
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">7. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
              <p className="mt-3">Types of cookies we use:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the platform to function</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">8. Third-Party Links</h2>
              <p>
                Our service may contain links to third-party websites and vehicle listings. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">9. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">10. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. When your account is closed or you request deletion, we will delete or anonymize your information within 90 days, unless we are required to retain it for legal or regulatory purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">11. International Data Transfers</h2>
              <p>
                Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using our services, you consent to the transfer of your information to the United States and other countries.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">12. California Privacy Rights</h2>
              <p>
                If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete your information, and the right to opt-out of the sale of your personal information (note: we do not sell personal information).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">13. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. For material changes, we will provide additional notice via email or prominent notice on our platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">14. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="mt-3 space-y-1">
                <p><strong>Email:</strong> privacy@autohunterpro.com</p>
                <p><strong>Email (General):</strong> support@autohunterpro.com</p>
                <p><strong>Mailing Address:</strong> AutoHunterPro, Inc., [Your Business Address]</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
