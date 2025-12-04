import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  Mail,
  MessageCircle,
  Phone,
  HelpCircle,
  BookOpen,
  Video,
  Clock,
  CheckCircle2,
  Zap,
  Users,
  FileText
} from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="space-y-12 md:space-y-20 py-4 md:py-8">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm md:text-base font-bold shadow-lg">
              <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
              Support Center
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-brand-gray-400">
            We're Here to Help
          </h1>
          <p className="text-lg md:text-xl text-brand-gray-300 leading-relaxed">
            Get answers fast. Our dedicated support team is ready to assist you with any questions or issues.
          </p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-400">Get in Touch</h2>
            <p className="text-base md:text-lg text-brand-gray-300 max-w-3xl mx-auto">
              Choose the support channel that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 md:p-8 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="pt-4 text-center space-y-4">
                <div className="w-14 h-14 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-7 h-7 text-brand-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-brand-gray-400">Email Support</h3>
                <p className="text-sm text-brand-gray-300">
                  Send us an email and we'll respond within 24 hours.
                </p>
                <div className="pt-2">
                  <a href="mailto:support@autohunterpro.com" className="text-brand-gray-400 font-semibold hover:underline">
                    support@autohunterpro.com
                  </a>
                </div>
                <Button className="w-full bg-brand-gray-400 hover:bg-brand-gray-300">
                  Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-4 text-center space-y-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-brand-gray-400">Live Chat</h3>
                <p className="text-sm text-brand-gray-300">
                  Chat with our support team in real-time.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-brand-gray-300" />
                  <span className="text-sm text-brand-gray-300">Mon-Fri, 9am-6pm EST</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="pt-4 text-center space-y-4">
                <div className="w-14 h-14 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Phone className="w-7 h-7 text-brand-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-brand-gray-400">Phone Support</h3>
                <p className="text-sm text-brand-gray-300">
                  Speak directly with a support specialist.
                </p>
                <div className="pt-2">
                  <a href="tel:+18005551234" className="text-brand-gray-400 font-semibold hover:underline">
                    1-800-555-1234
                  </a>
                </div>
                <Button variant="outline" className="w-full border-brand-gray-300 text-brand-gray-400 hover:bg-brand-gray-100">
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Support Resources */}
      <div className="bg-brand-gray-100/30 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-400">Self-Service Resources</h2>
              <p className="text-base md:text-lg text-brand-gray-300 max-w-3xl mx-auto">
                Find quick answers in our comprehensive knowledge base.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
                <CardContent className="pt-4 text-center space-y-3">
                  <div className="w-12 h-12 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="w-6 h-6 text-brand-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-gray-400">Knowledge Base</h3>
                  <p className="text-sm text-brand-gray-300">
                    Browse articles and guides
                  </p>
                  <Button variant="link" className="text-brand-gray-400 p-0">
                    Browse Articles →
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
                <CardContent className="pt-4 text-center space-y-3">
                  <div className="w-12 h-12 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Video className="w-6 h-6 text-brand-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-gray-400">Video Tutorials</h3>
                  <p className="text-sm text-brand-gray-300">
                    Watch step-by-step guides
                  </p>
                  <Button variant="link" className="text-brand-gray-400 p-0">
                    Watch Videos →
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
                <CardContent className="pt-4 text-center space-y-3">
                  <div className="w-12 h-12 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-brand-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-gray-400">Documentation</h3>
                  <p className="text-sm text-brand-gray-300">
                    API docs and technical guides
                  </p>
                  <Button variant="link" className="text-brand-gray-400 p-0">
                    View Docs →
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
                <CardContent className="pt-4 text-center space-y-3">
                  <div className="w-12 h-12 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6 text-brand-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-gray-400">Community Forum</h3>
                  <p className="text-sm text-brand-gray-300">
                    Connect with other users
                  </p>
                  <Button variant="link" className="text-brand-gray-400 p-0">
                    Join Forum →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-400">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            <Card className="border-2 border-brand-gray-100 hover:border-brand-gray-300 transition-colors">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-brand-gray-400 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  How do I get started with AutoHunterPro?
                </h3>
                <p className="text-sm md:text-base text-brand-gray-300 ml-7">
                  Simply sign up for a free trial, set your search criteria, and start receiving curated vehicle listings. Our onboarding wizard will guide you through the setup process in under 5 minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-brand-gray-100 hover:border-brand-gray-300 transition-colors">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-brand-gray-400 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  What sources does AutoHunterPro monitor?
                </h3>
                <p className="text-sm md:text-base text-brand-gray-300 ml-7">
                  We aggregate listings from major auction sites, dealer networks, private sellers, and wholesale platforms. Our AI continuously monitors over 50 different sources for new opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-brand-gray-100 hover:border-brand-gray-300 transition-colors">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-brand-gray-400 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-sm md:text-base text-brand-gray-300 ml-7">
                  Yes! You can cancel your subscription at any time with no penalties or fees. Your access will continue until the end of your current billing period.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-brand-gray-100 hover:border-brand-gray-300 transition-colors">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-brand-gray-400 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  How accurate is the AI scoring system?
                </h3>
                <p className="text-sm md:text-base text-brand-gray-300 ml-7">
                  Our AI scoring uses historical sales data, market trends, and comparative analysis to achieve 90%+ accuracy in identifying undervalued vehicles. The system continuously learns and improves over time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-brand-gray-100 hover:border-brand-gray-300 transition-colors">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-brand-gray-400 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  Do you offer training or onboarding?
                </h3>
                <p className="text-sm md:text-base text-brand-gray-300 ml-7">
                  Yes! All plans include access to our video tutorial library and knowledge base. Pro and Enterprise plans include personalized onboarding sessions with our team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enterprise Support */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 border-2 border-brand-gray-200 bg-gradient-to-br from-brand-gray-50 to-white">
            <CardContent className="pt-4 text-center space-y-6">
              <div className="w-16 h-16 bg-brand-gray-400 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-400">Enterprise Support</h2>
              <p className="text-base md:text-lg text-brand-gray-300 max-w-2xl mx-auto">
                Need priority support, dedicated account management, or custom integrations? Our Enterprise plan includes:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base text-brand-gray-300">Dedicated account manager</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base text-brand-gray-300">Priority 24/7 support</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base text-brand-gray-300">Custom API integrations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base text-brand-gray-300">Personalized training sessions</span>
                </div>
              </div>
              <Button asChild size="lg" className="font-semibold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl bg-brand-gray-400 hover:bg-brand-gray-300 text-white">
                <Link href="/pricing">
                  Learn About Enterprise
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-gray-100/30 py-12 md:py-16 border-y border-brand-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-brand-gray-400">
            Still Have Questions?
          </h2>
          <p className="text-lg md:text-xl text-brand-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
            Our support team is here to help. Reach out anytime — we typically respond within hours.
          </p>
          <Button asChild size="lg" className="font-semibold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl bg-brand-gray-400 hover:bg-brand-gray-300 text-white">
            <Link href="mailto:support@autohunterpro.com">
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
