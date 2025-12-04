'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Zap, Clock, Bell, TrendingUp, DollarSign, Target, ArrowRight, Users, Shield, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WhyPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const reasons = [
    {
      number: 1,
      icon: Zap,
      title: 'Gain a Competitive Edge with AI-Powered Sourcing',
      description: [
        "In today's fast-moving used car market, speed and accuracy are everything. Auto Hunter Pro's AI technology scans thousands of listings across platforms like Facebook Marketplace, Craigslist, OfferUp, and Cars.com — and filters out the junk.",
        "That means you see only high-quality, relevant deals, often before your competitors even know they exist. This gives your dealership a significant first-mover advantage on the best inventory."
      ]
    },
    {
      number: 2,
      icon: Clock,
      title: 'Save Massive Amounts of Time',
      description: [
        "Traditional vehicle sourcing is tedious: browsing multiple platforms, sifting through irrelevant or outdated posts, and manually tracking prices.",
        "Auto Hunter Pro automates all that work — pulling everything into one clean, searchable dashboard. Instead of wasting hours on research, your buyers can focus on evaluating and closing deals."
      ]
    },
    {
      number: 3,
      icon: Bell,
      title: 'Never Miss a Deal Again',
      description: [
        "With AI-driven notifications, you'll get alerts the moment a vehicle that matches your buying criteria hits the market.",
        "That means no more missed opportunities because you weren't online at the right time — Auto Hunter Pro is watching the market 24/7 for you."
      ]
    },
    {
      number: 4,
      icon: TrendingUp,
      title: 'Scale Your Sourcing Efforts',
      description: [
        "Whether you're a small used car lot or a multi-location dealership, Auto Hunter Pro helps you source inventory at scale.",
        "The platform handles the heavy lifting — finding leads and filtering data — so your acquisition team can focus on what matters most: buying and selling cars profitably."
      ]
    },
    {
      number: 5,
      icon: DollarSign,
      title: 'Increase Profit Margins',
      description: [
        "Because Auto Hunter Pro exposes hidden or undervalued listings across multiple platforms, your dealership can consistently find cars below market value.",
        "That means better profit margins on every deal, helping your business stay competitive even in tight markets."
      ]
    },
    {
      number: 6,
      icon: Target,
      title: 'Built for Dealers, Wholesalers & Flippers',
      description: [
        "Unlike generic car listing sites, Auto Hunter Pro is purpose-built for professionals who live and breathe vehicle sourcing.",
        "It's designed to streamline your acquisition workflow — not to sell to retail buyers — making it an ideal tool for dealerships looking to scale efficiently."
      ]
    }
  ];

  return (
    <div className="space-y-16 md:space-y-24 py-8 md:py-12 overflow-hidden bg-white relative">
      {/* Animated Question Mark Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5 z-0">
        {/* Different styled question marks */}
        <div className="absolute top-10 left-10 text-9xl font-black text-brand-red-600 animate-float" style={{ animationDelay: '0s' }}>?</div>
        <div className="absolute top-1/4 right-20 text-7xl font-light text-black animate-float" style={{ animationDelay: '2s' }}>?</div>
        <div className="absolute top-1/2 left-1/4 text-8xl font-bold text-brand-red-600 animate-float" style={{ animationDelay: '4s' }}>?</div>
        <div className="absolute bottom-1/4 right-1/3 text-6xl font-black text-black animate-float" style={{ animationDelay: '1s' }}>?</div>
        <div className="absolute bottom-20 left-1/3 text-9xl font-thin text-brand-red-600 animate-float" style={{ animationDelay: '3s' }}>?</div>
        <div className="absolute top-1/3 right-10 text-7xl font-extrabold text-black animate-float" style={{ animationDelay: '5s' }}>?</div>
        <div className="absolute bottom-1/3 left-20 text-8xl font-semibold text-brand-red-600 animate-float" style={{ animationDelay: '6s' }}>?</div>
        <div className="absolute top-2/3 right-1/4 text-6xl font-black text-black animate-float" style={{ animationDelay: '2.5s' }}>?</div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <div className={`max-w-5xl mx-auto text-center space-y-6 md:space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black leading-[0.95] mb-6">
              Why Choose
              <br />
              <span className="relative inline-block mt-2">
                AutoHunter Pro
                <div className="absolute bottom-0 left-0 w-full h-3 md:h-4 bg-brand-red-600 -z-10"></div>
              </span>
              <span className="text-brand-red-600">?</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
              The competitive advantage automotive professionals need to dominate their market.
            </p>

            {/* Minimal Stats with Red Accents */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-8 md:pt-12 border-t-2 border-brand-red-600 max-w-3xl mx-auto">
              <div className="text-center group">
                <div className="text-3xl md:text-5xl font-black text-black group-hover:text-brand-red-600 transition-colors mb-1">95%</div>
                <div className="text-sm md:text-base text-gray-500 uppercase tracking-wider font-medium">Time Saved</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-5xl font-black text-black group-hover:text-brand-red-600 transition-colors mb-1">24/7</div>
                <div className="text-sm md:text-base text-gray-500 uppercase tracking-wider font-medium">Monitoring</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-5xl font-black text-black group-hover:text-brand-red-600 transition-colors mb-1">25+</div>
                <div className="text-sm md:text-base text-gray-500 uppercase tracking-wider font-medium">Sources</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reasons Section */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="group relative">
                  {/* Decorative Line - Red */}
                  <div className={`absolute top-0 ${isEven ? 'left-0' : 'right-0'} w-0 h-1 bg-brand-red-600 group-hover:w-20 transition-all duration-500`}></div>

                  <Card className="border-2 border-gray-200 hover:border-brand-red-600 transition-all duration-300 bg-white shadow-sm hover:shadow-xl">
                    <CardContent className="p-8 md:p-12">
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        {/* Number & Icon */}
                        <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-6 flex-shrink-0">
                          {/* Large Number with Red on Hover */}
                          <div className="relative">
                            <span className="text-6xl md:text-8xl font-black text-gray-100 group-hover:text-brand-red-50 transition-colors">
                              {reason.number}
                            </span>
                          </div>

                          {/* Icon - Red accent */}
                          <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-black flex items-center justify-center group-hover:bg-brand-red-600 group-hover:border-brand-red-600 transition-all duration-300">
                            <Icon className="w-8 h-8 md:w-10 md:h-10 text-black group-hover:text-white transition-colors" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4 md:space-y-6">
                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-black group-hover:text-brand-red-600 transition-colors leading-tight tracking-tight">
                            {reason.title}
                          </h2>

                          <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed">
                            {reason.description.map((paragraph, pIndex) => (
                              <p key={pIndex} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 bg-brand-red-600 rounded-full flex-shrink-0 mt-2.5"></span>
                                <span>{paragraph}</span>
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section with Red Accents */}
      <div className="bg-black py-16 md:py-24 relative overflow-hidden z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-12 md:mb-16 tracking-tight">
              The <span className="text-brand-red-600">Numbers</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: Users, value: '1000+', label: 'Professionals' },
                { icon: Globe, value: '25+', label: 'Platforms' },
                { icon: Shield, value: '99%', label: 'AI Accuracy' },
                { icon: Clock, value: '24/7', label: 'Monitoring' }
              ].map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="mb-4 md:mb-6 flex justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-white flex items-center justify-center group-hover:bg-brand-red-600 group-hover:border-brand-red-600 transition-all duration-300">
                        <StatIcon className="w-8 h-8 md:w-10 md:h-10 text-white transition-colors" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-sm md:text-base text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid with Red Accents */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black text-center mb-12 md:mb-16 tracking-tight">
            Everything You <span className="text-brand-red-600">Need</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Zap, text: 'AI-powered intelligence' },
              { icon: Clock, text: 'Save hours daily' },
              { icon: Bell, text: '24/7 automation' },
              { icon: TrendingUp, text: 'Scale effortlessly' },
              { icon: DollarSign, text: 'Better margins' },
              { icon: Target, text: 'Built for pros' }
            ].map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={index}
                  className="group p-6 md:p-8 border-2 border-gray-200 hover:border-brand-red-600 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 border-2 border-black group-hover:border-brand-red-600 flex items-center justify-center group-hover:bg-brand-red-600 transition-all duration-300">
                      <ItemIcon className="w-7 h-7 md:w-8 md:h-8 text-black group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base md:text-lg text-black font-bold leading-tight">{item.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section with Red Accents */}
      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-black p-8 md:p-16 relative overflow-hidden group hover:border-brand-red-600 transition-colors duration-500">
            {/* Animated Background - Red */}
            <div className="absolute inset-0 bg-brand-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>

            <div className="relative z-10 text-center space-y-6 md:space-y-8">
              <div className="inline-block px-4 py-2 border-2 border-black group-hover:border-white mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-black group-hover:text-white transition-colors">
                  14-Day Free Trial
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black group-hover:text-black transition-colors leading-tight tracking-tight">
                Ready to Get Started?
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 group-hover:text-white transition-colors max-w-2xl mx-auto">
                Join the automotive professionals who are already winning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Button asChild size="lg" className="font-bold text-base md:text-lg px-10 py-6 md:py-7 w-full sm:w-auto bg-black group-hover:bg-white text-white group-hover:text-black border-2 border-black group-hover:border-white transition-all">
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="font-bold text-base md:text-lg px-10 py-6 md:py-7 w-full sm:w-auto border-2 border-black text-black hover:bg-black hover:text-white group-hover:border-white group-hover:text-white group-hover:hover:bg-white group-hover:hover:text-brand-red-600 transition-all">
                  <Link href="/pricing">
                    View Pricing
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-40px) rotate(-5deg);
          }
          75% {
            transform: translateY(-20px) rotate(3deg);
          }
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
