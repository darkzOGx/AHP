import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import {
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  ArrowRight,
  Mail,
  Share2,
  Megaphone,
  CheckCircle2
} from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="space-y-12 md:space-y-20 py-4 md:py-8">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm md:text-base font-bold shadow-lg">
              <Megaphone className="w-4 h-4 md:w-5 md:h-5" />
              Marketing Resources
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-brand-gray-400">
            Supercharge Your Automotive Business with AutoHunterPro
          </h1>
          <p className="text-lg md:text-xl text-brand-gray-300 leading-relaxed">
            Access marketing materials, brand assets, and partnership opportunities to grow your business alongside ours.
          </p>
        </div>
      </div>

      {/* Brand Assets Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-400">Brand Assets & Guidelines</h2>
            <p className="text-base md:text-lg text-brand-gray-300 max-w-3xl mx-auto">
              Download our official logos, color palettes, and brand guidelines for marketing materials, presentations, and partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card className="p-6 md:p-8 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-center w-full h-32 bg-brand-gray-100 rounded-lg mb-4">
                  <Image
                    src="/logo.jpeg"
                    alt="AutoHunterPro Logo"
                    width={120}
                    height={120}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-brand-gray-400">Logo Package</h3>
                <p className="text-sm md:text-base text-brand-gray-300">
                  High-resolution logos in multiple formats (PNG, SVG, JPG) for print and digital use.
                </p>
                <Button className="w-full bg-brand-gray-400 hover:bg-brand-gray-300">
                  Download Logos
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 md:p-8 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center justify-center w-full h-32 bg-gradient-to-r from-brand-gray-400 via-brand-gray-300 to-brand-gray-200 rounded-lg mb-4">
                  <div className="text-white text-2xl font-bold">Color Palette</div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-brand-gray-400">Brand Colors</h3>
                <p className="text-sm md:text-base text-brand-gray-300">
                  Official color codes and usage guidelines for maintaining brand consistency.
                </p>
                <Button className="w-full bg-brand-gray-400 hover:bg-brand-gray-300">
                  View Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Marketing Tools */}
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-400">Marketing Tools & Resources</h2>
            <p className="text-base md:text-lg text-brand-gray-300 max-w-3xl mx-auto">
              Everything you need to promote AutoHunterPro to your network, clients, and partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="p-6 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="pt-4 text-center space-y-4">
                <div className="w-12 h-12 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6 text-brand-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-brand-gray-400">Email Templates</h3>
                <p className="text-sm text-brand-gray-300">
                  Pre-written email campaigns to introduce AutoHunterPro to your contacts.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="pt-4 text-center space-y-4">
                <div className="w-12 h-12 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Share2 className="w-6 h-6 text-brand-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-brand-gray-400">Social Media Kit</h3>
                <p className="text-sm text-brand-gray-300">
                  Ready-to-post graphics and captions for Instagram, LinkedIn, and Facebook.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 border-brand-gray-100 hover:border-brand-gray-300 hover:shadow-lg transition-all duration-300 bg-white">
              <CardContent className="pt-4 text-center space-y-4">
                <div className="w-12 h-12 bg-brand-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6 text-brand-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-brand-gray-400">Case Studies</h3>
                <p className="text-sm text-brand-gray-300">
                  Real success stories and ROI metrics from AutoHunterPro users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Partnership Opportunities */}
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-12 md:py-16 border-y-2 border-orange-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                Partnership Opportunities
              </h2>
              <p className="text-base md:text-lg text-gray-700">
                Join forces with AutoHunterPro to expand your reach and earn revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 md:p-8 border-2 border-orange-200 bg-white shadow-lg">
                <CardContent className="pt-4 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-gray-400">Affiliate Program</h3>
                  <p className="text-base text-brand-gray-300">
                    Earn up to 30% commission by referring new users to AutoHunterPro.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-brand-gray-300">Recurring monthly commissions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-brand-gray-300">Dedicated affiliate dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-brand-gray-300">Marketing materials provided</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Link href="/signup">
                      Join Affiliate Program
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6 md:p-8 border-2 border-orange-200 bg-white shadow-lg">
                <CardContent className="pt-4 space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-gray-400">Strategic Partnerships</h3>
                  <p className="text-base text-brand-gray-300">
                    Co-marketing, integration, and white-label opportunities for enterprises.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-brand-gray-300">Custom API integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-brand-gray-300">Co-branded solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-brand-gray-300">Revenue sharing models</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="w-full border-brand-gray-300 text-brand-gray-400 hover:bg-brand-gray-100">
                    <Link href="/support">
                      Contact Partnerships Team
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-400 mb-4">Why Market AutoHunterPro?</h2>
            <p className="text-base md:text-lg text-brand-gray-300 max-w-3xl mx-auto">
              Join a growing platform trusted by automotive professionals nationwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-black text-brand-gray-400">10K+</div>
              <p className="text-sm md:text-base text-brand-gray-300">Active Users</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-black text-brand-gray-400">$50M+</div>
              <p className="text-sm md:text-base text-brand-gray-300">In Deals Tracked</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-black text-brand-gray-400">98%</div>
              <p className="text-sm md:text-base text-brand-gray-300">Customer Satisfaction</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl md:text-5xl font-black text-brand-gray-400">24/7</div>
              <p className="text-sm md:text-base text-brand-gray-300">AI Monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-gray-100/30 py-12 md:py-16 border-y border-brand-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-brand-gray-400">
            Ready to Grow Together?
          </h2>
          <p className="text-lg md:text-xl text-brand-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
            Whether you're looking to partner, promote, or collaborate — we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="font-semibold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl w-full sm:w-auto bg-brand-gray-400 hover:bg-brand-gray-300 text-white">
              <Link href="/support">
                Contact Marketing Team
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-semibold text-base md:text-lg px-6 md:px-8 py-4 md:py-6 rounded-xl w-full sm:w-auto border-brand-gray-300 text-brand-gray-400 hover:bg-brand-gray-100">
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
