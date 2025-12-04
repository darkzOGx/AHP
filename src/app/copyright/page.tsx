import { Card, CardContent } from '@/components/ui/card';

export default function CopyrightPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-gray-400">
            Copyright & Intellectual Property
          </h1>
          <p className="text-base md:text-lg text-brand-gray-300">
            Last Updated: January 2025
          </p>
        </div>

        {/* Content */}
        <Card className="border-2 border-brand-gray-100">
          <CardContent className="p-6 md:p-8 space-y-6 text-brand-gray-300">
            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">1. Copyright Notice</h2>
              <p>
                © 2025 AutoHunterPro, Inc. All rights reserved.
              </p>
              <p>
                All content, materials, features, and functionality available on the AutoHunterPro platform, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, software, and the compilation thereof (collectively, the "Content"), are the exclusive property of AutoHunterPro, Inc., its licensors, or other content suppliers and are protected by United States and international copyright laws.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">2. Trademarks</h2>
              <p>
                AutoHunterPro™, the AutoHunterPro logo, and all related names, logos, product and service names, designs, and slogans are trademarks of AutoHunterPro, Inc. or its affiliates or licensors. You must not use such marks without the prior written permission of AutoHunterPro, Inc.
              </p>
              <p className="mt-3">
                All other names, logos, product and service names, designs, and slogans mentioned on this platform are the trademarks of their respective owners.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">3. Ownership of Platform and Content</h2>
              <p>
                The AutoHunterPro platform, including its design, structure, selection, coordination, expression, look and feel, and arrangement of content, is owned, controlled, or licensed by AutoHunterPro, Inc. and is protected by copyright, patent, and trademark laws, and various other intellectual property rights and unfair competition laws.
              </p>
              <p className="mt-3">
                This includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proprietary AI algorithms and scoring models</li>
                <li>Data aggregation and analysis systems</li>
                <li>User interface designs and layouts</li>
                <li>Software code and architecture</li>
                <li>Documentation and training materials</li>
                <li>Marketing materials and brand assets</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">4. Limited License to Users</h2>
              <p>
                Subject to these terms, AutoHunterPro grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the platform and Content for your personal or internal business use only.
              </p>
              <p className="mt-3">This license does not include any right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any Content</li>
                <li>Use any data mining, robots, scraping, or similar data gathering or extraction methods</li>
                <li>Reverse engineer, decompile, or disassemble any software or algorithms</li>
                <li>Remove or modify any copyright, trademark, or other proprietary notices</li>
                <li>Transfer, sell, license, or commercialize the platform or Content</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">5. User-Generated Content</h2>
              <p>
                When you create, upload, post, or otherwise make available content through the platform (including saved searches, alerts, notes, or feedback), you retain ownership of your content. However, by submitting content, you grant AutoHunterPro a worldwide, non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.
              </p>
              <p className="mt-3">
                You represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You own or have the necessary rights to the content you submit</li>
                <li>Your content does not infringe any third-party rights</li>
                <li>Your content complies with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">6. Third-Party Content</h2>
              <p>
                Vehicle listings and related information displayed on AutoHunterPro are aggregated from third-party sources. While we make reasonable efforts to ensure accuracy, we do not claim ownership of this third-party content. All rights in such content belong to their respective owners.
              </p>
              <p className="mt-3">
                Our proprietary AI scoring, analytics, and presentation of this data constitute original works protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">7. DMCA Copyright Policy</h2>
              <p>
                AutoHunterPro respects the intellectual property rights of others. If you believe that any content on our platform infringes your copyright, please notify us in accordance with the Digital Millennium Copyright Act (DMCA).
              </p>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">7.1 Filing a DMCA Notice</h3>
              <p>To file a DMCA notice, please provide our Copyright Agent with the following information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>A physical or electronic signature of the copyright owner or authorized representative</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the infringing material and its location on our platform</li>
                <li>Your contact information (address, telephone number, email address)</li>
                <li>A statement that you have a good faith belief that the use is not authorized</li>
                <li>A statement under penalty of perjury that the information is accurate and you are authorized to act on behalf of the copyright owner</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">7.2 Copyright Agent Contact</h3>
              <div className="mt-3 space-y-1">
                <p><strong>Email:</strong> copyright@autohunterpro.com</p>
                <p><strong>Subject Line:</strong> DMCA Takedown Notice</p>
                <p><strong>Mailing Address:</strong> AutoHunterPro, Inc., DMCA Agent, [Your Business Address]</p>
              </div>

              <h3 className="text-xl font-semibold text-brand-gray-400 mt-4">7.3 Counter-Notification</h3>
              <p>
                If you believe your content was removed in error, you may file a counter-notification with the same information requirements as outlined above, plus a statement consenting to the jurisdiction of federal court.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">8. Prohibited Uses</h2>
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Copy, reproduce, or create derivative works from our proprietary algorithms or AI models</li>
                <li>Scrape, crawl, or systematically extract data from the platform</li>
                <li>Use automated tools to access the platform without authorization</li>
                <li>Circumvent any technical protection measures</li>
                <li>Use the platform to build a competing product or service</li>
                <li>Reverse engineer any aspect of the platform or attempt to discover source code</li>
                <li>Remove, obscure, or alter any legal notices displayed on the platform</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">9. API and Integration License</h2>
              <p>
                If you are granted access to our API (available to Pro plan subscribers), you are granted a limited license to use the API solely for the purpose of integrating AutoHunterPro functionality into your internal systems. This license does not permit you to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Redistribute API access to third parties</li>
                <li>Use the API to create a competing service</li>
                <li>Exceed rate limits or abuse API endpoints</li>
                <li>Store or cache data beyond reasonable operational needs</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">10. Enforcement and Remedies</h2>
              <p>
                Unauthorized use of the platform or Content may violate copyright, trademark, and other laws. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Terminate or suspend accounts that violate intellectual property rights</li>
                <li>Remove infringing content without notice</li>
                <li>Pursue legal action and monetary damages for violations</li>
                <li>Cooperate with law enforcement in investigating violations</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">11. Attribution Requirements</h2>
              <p>
                If you are permitted to share or reference AutoHunterPro data (subject to your subscription terms), you must:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide clear attribution to AutoHunterPro</li>
                <li>Include a link back to autohunterpro.com when shared online</li>
                <li>Not imply endorsement or affiliation without written permission</li>
                <li>Maintain accuracy and context of the original information</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">12. Licensing Inquiries</h2>
              <p>
                If you wish to use AutoHunterPro content, trademarks, or technology in ways not covered by the standard user license, please contact us to discuss licensing opportunities:
              </p>
              <div className="mt-3 space-y-1">
                <p><strong>Email:</strong> licensing@autohunterpro.com</p>
                <p><strong>Subject:</strong> Licensing Inquiry</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">13. Modifications</h2>
              <p>
                We reserve the right to modify this Copyright and Intellectual Property policy at any time. Material changes will be communicated via email or prominent notice on our platform. Continued use of the platform after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-brand-gray-400">14. Contact Information</h2>
              <p>
                For questions about copyright, intellectual property, or licensing:
              </p>
              <div className="mt-3 space-y-1">
                <p><strong>General Inquiries:</strong> legal@autohunterpro.com</p>
                <p><strong>DMCA Notices:</strong> copyright@autohunterpro.com</p>
                <p><strong>Licensing:</strong> licensing@autohunterpro.com</p>
                <p><strong>Mailing Address:</strong> AutoHunterPro, Inc., Legal Department, [Your Business Address]</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
