import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Target, Zap, Shield, TrendingUp, ArrowRight, Brain, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 md:space-y-24 py-4 md:py-8">
      {/* Hero Section */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900">
            About AutoHunter Pro
          </h1>
          <p className="text-2xl md:text-3xl text-brand-red-600 font-bold">
            We're redefining how automotive professionals source vehicles.
          </p>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
            Our AI-powered platform is built for dealers, wholesalers, and car flippers who demand speed, accuracy, and better margins.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="p-10 md:p-14 border-2 border-brand-red-600 bg-gradient-to-br from-brand-red-50 to-white shadow-xl">
            <CardContent className="pt-4 space-y-6 text-center">
              <div className="w-16 h-16 bg-brand-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">Our Mission</h2>
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-semibold">
                AutoHunter Pro is an AI-powered vehicle sourcing platform unlike any other.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Its advanced AI automation helps you get to the deal faster — before your competition. It delivers smarter sourcing, faster deals, and saves you valuable time so you can focus on growing your business, not chasing listings.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                Whether you're managing a dealership, building inventory for resale, or flipping cars for profit, AutoHunter Pro is your intelligent partner for maximizing efficiency and profitability in every transaction.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What We Do */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 text-center mb-12">What We Do</h2>
          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <Card className="p-8 border-2 border-gray-200 bg-white">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Brain className="w-6 h-6 text-brand-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Data Aggregation</h3>
                    <p className="text-gray-700">
                      At AutoHunter Pro, we gather data from all over the internet, filter it, and place it on one platform. Users are then able to search clean and up-to-date data quickly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 border-gray-200 bg-white">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-6 h-6 text-brand-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Filtration & Notifications</h3>
                    <p className="text-gray-700">
                      Auto Hunter Pro's AI powered filtration, notification, and search services will empower you to be first to the deal while uncovering deals you would never have seen before!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 border-2 border-gray-200 bg-white">
              <CardContent className="pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-6 h-6 text-brand-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Purpose-Built for Professionals</h3>
                    <p className="text-gray-700">
                      Unlike generic car listing sites, we're built specifically for dealers, wholesalers, and car flippers who need professional-grade tools to stay ahead of the market.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Our Promise */}
      <div className="bg-gray-900 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8">Our Promise to You</h2>
            <p className="text-2xl md:text-3xl text-brand-red-400 font-bold">
              Smarter. Faster. Better Deals.
            </p>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              We're committed to providing the most advanced vehicle sourcing platform on the market, helping you find profitable inventory before anyone else does.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Why AutoHunter Pro?</h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            We combine cutting-edge AI technology with deep automotive industry expertise to give you an unbeatable competitive advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          <Card className="p-8 border-2 border-gray-200 hover:border-brand-red-600 hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="pt-4 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Speed</h3>
              <p className="text-base text-gray-700">
                In this business, seconds matter. Our platform delivers real-time alerts and instant analytics so you can act before anyone else.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 border-2 border-gray-200 hover:border-brand-red-600 hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="pt-4 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Precision</h3>
              <p className="text-base text-gray-700">
                We don't just aggregate listings — we score them. Using AI-powered analysis, we surface only the opportunities worth your time.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 border-2 border-gray-200 hover:border-brand-red-600 hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="pt-4 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Transparency</h3>
              <p className="text-base text-gray-700">
                No hidden fees. No locked features. No surprise charges. You get full visibility into everything.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 border-2 border-gray-200 hover:border-brand-red-600 hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="pt-4 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Results</h3>
              <p className="text-base text-gray-700">
                Our users consistently find better deals, faster — resulting in improved margins and increased profitability.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 border-2 border-gray-200 hover:border-brand-red-600 hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="pt-4 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-7 h-7 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Intelligence</h3>
              <p className="text-base text-gray-700">
                Advanced AI continuously learns and improves, getting better at finding exactly what you're looking for.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 border-2 border-gray-200 hover:border-brand-red-600 hover:shadow-xl transition-all duration-300 bg-white">
            <CardContent className="pt-4 text-center space-y-4">
              <div className="w-14 h-14 bg-brand-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-7 h-7 text-brand-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Scalability</h3>
              <p className="text-base text-gray-700">
                Whether you're buying 1 car or 100 cars a month, our platform scales with your business needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gray-50 p-12 rounded-3xl border-2 border-gray-200">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900">
            Ready to Let the AI Hunt for You?
          </h2>
          <p className="text-xl md:text-2xl text-gray-700">
            Join automotive professionals who trust AutoHunter Pro to find their next winning deal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="font-semibold text-lg px-10 py-7 rounded-xl w-full sm:w-auto bg-brand-red-600 hover:bg-brand-red-700 text-white shadow-lg hover:shadow-xl transition-all">
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-semibold text-lg px-10 py-7 rounded-xl w-full sm:w-auto border-2 border-brand-red-600 text-brand-red-600 hover:bg-brand-red-50">
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
