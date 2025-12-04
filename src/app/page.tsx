"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Car,
  ArrowRight,
  Zap,
  Bell,
  Target,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Brain,
  Filter,
  Search,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowDown,
  Users,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Database,
  Rocket,
  Eye,
  MessageSquare,
  Facebook,
  Mail,
  Smartphone,
  FocusIcon,
  WorkflowIcon,
  LayoutDashboard
} from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

// Dynamically import ThreeBackground to avoid SSR issues
const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), {
  ssr: false,
});

// Dynamically import AlgoliaSearchPreview to avoid SSR issues
const AlgoliaSearchPreview = dynamic(() => import("@/components/AlgoliaSearchPreview"), {
  ssr: false,
});

export default function Home() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const showDashboardButton = user && isSubscribed;

  return (
    <div className="overflow-hidden relative">
      {/* 3D Background Animation */}
      <ThreeBackground />
      {/* Hero Section with Search Preview */}
      <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-brand-red-50/50 via-transparent to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-50/50 via-transparent to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-12">
          {/* Header Content */}
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red-600 text-white rounded-full text-sm font-semibold shadow-lg mb-6">
              <Sparkles className="w-4 h-4" />
              #1 AI Vehicle Discovery Platform
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.1] mb-6">
              Find Winning Deals
              <br />
              <span className="text-brand-red-600">Before Anyone Else</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto font-light leading-relaxed mb-8">
              AI-powered platform that scans 25+ marketplaces and filters out junk.
              <br className="hidden sm:block" />
              Try searching below to see live vehicle data.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {showDashboardButton ? (
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-10 py-6 rounded-2xl bg-brand-red-600 hover:bg-brand-red-700 text-white shadow-xl hover:shadow-brand-red-600/50 transition-all transform hover:scale-105"
                >
                  <Link href="/dashboard">
                    Dashboard
                    <LayoutDashboard className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="text-lg px-10 py-6 rounded-2xl bg-brand-red-600 hover:bg-brand-red-700 text-white shadow-xl hover:shadow-brand-red-600/50 transition-all transform hover:scale-105"
                  >
                    <Link href="/signup">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="text-lg px-10 py-6 rounded-2xl border-2 border-gray-300 hover:border-brand-red-600 hover:bg-brand-red-50 transition-all"
                  >
                    <Link href="/dashboard">
                      See Live Demo
                      <Eye className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Live Search Preview */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Live Vehicle Search Preview
              </h3>
              <p className="text-gray-600">
                Search through thousands of real vehicles from Facebook, Craigslist, Cars.com and more
              </p>
            </div>
            
            <AlgoliaSearchPreview />
            
            {!showDashboardButton && (
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600 mb-4">
                  Ready to access all features and get instant alerts?
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-red-600 hover:bg-brand-red-700 text-white px-8 py-3 rounded-xl transition-all transform hover:scale-105"
                >
                  <Link href="/signup">
                    Sign Up Now - Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Trust badges */}
          {!showDashboardButton && (
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-red-600" />
                <span>14-Day Free Trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-red-600" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-red-600" />
                <span>Setup in 60 Seconds</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-12 md:py-20 lg:py-32 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black px-2">
              Why are you still manually hunting for cars?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto px-2">
              Every hour you spend searching is an hour your competitors are closing deals.
            </p>
          </div>

          {/* Problem cards */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <div className="p-6 md:p-8 bg-gray-800 rounded-3xl border border-gray-700 hover:border-brand-red-600 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-red-900/50 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                <Clock className="w-6 h-6 md:w-7 md:h-7 text-brand-red-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">6+ Hours Wasted Daily</h3>
              <p className="text-sm md:text-base text-gray-400">
                Manual hunting across Facebook, Craigslist, Cars.com means endless scrolling through 
                scams, overpriced dealers, and salvage titles. Time that should be spent closing deals.
              </p>
            </div>

            <div className="p-6 md:p-8 bg-gray-800 rounded-3xl border border-gray-700 hover:border-brand-red-600 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-red-900/50 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                <Filter className="w-6 h-6 md:w-7 md:h-7 text-brand-red-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Always Too Late</h3>
              <p className="text-sm md:text-base text-gray-400">
                By the time you manually filter through the noise and spot a real deal, 
                5 other dealers already called. The best opportunities disappear in minutes.
              </p>
            </div>
            <div className="p-6 md:p-8 bg-gray-800 rounded-3xl border border-gray-700 hover:border-brand-red-600 transition-all">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-red-900/50 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-brand-red-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Deals You'll Never See</h3>
              <p className="text-sm md:text-base text-gray-400">
                Every day, profitable cars get listed on platforms you don't check, 
                in cities you don't monitor, at times you're not online. Money left on the table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Visual Process */}
      <section className="py-12 md:py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 md:space-y-6 mb-12 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 px-2">
              Your AI-powered car hunting machine
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto px-2">
              While you sleep, eat, or work deals – our AI never stops hunting for profits.
            </p>
          </div>

          {/* Step 1 - Gathering */}
          <div className="mb-16 md:mb-32">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-red-100 text-brand-red-600 rounded-full text-xs md:text-sm font-bold">
                  Step 1
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                  25+ platforms. 24/7 scanning.
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Our AI crawls every major marketplace – Facebook, Craigslist, 
                  Cars.com, OfferUp, AutoTrader, and 20+ more – collecting 
                  thousands of new listings every hour while you focus on your business.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Multiple Platforms
                      </p>
                      <p className="text-gray-600">
                        Facebook, Craigslist, Cars.com, OfferUp & more
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Up-to date Data
                      </p>
                      <p className="text-gray-600">
                        Always watching for new deals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        All Listings in One Place
                      </p>
                      <p className="text-gray-600">
                        Its all in one searchable platform
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual representation */}
              <div className="relative">
                <div className="bg-gradient-to-br from-brand-red-50 to-white p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl border-2 border-brand-red-200 shadow-2xl">
                  {/* Animated platform icons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {[
                      { name: "Facebook", icon: Facebook, delay: "0s" },
                      { name: "Craigslist", icon: Globe, delay: "0.2s" },
                      { name: "Cars.com", icon: Car, delay: "0.4s" },
                      { name: "OfferUp", icon: MessageSquare, delay: "0.6s" },
                      { name: "More Sites", icon: Globe, delay: "0.8s" },
                      { name: "AI Scanning", icon: Brain, delay: "1s" },
                    ].map((platform, idx) => (
                      <div
                        key={idx}
                        className="p-3 sm:p-4 md:p-6 bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-gray-100"
                        style={{
                          animation: `pulse 2s infinite ${platform.delay}`,
                        }}
                      >
                        <platform.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-brand-red-600 mx-auto mb-1 sm:mb-2" />
                        <p className="text-xs sm:text-xs md:text-sm font-semibold text-center text-gray-700">
                          {platform.name}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Arrow down to database */}
                  <div className="flex justify-center my-4 md:my-6">
                    <ArrowDown className="w-8 h-8 md:w-10 md:h-10 text-brand-red-600 animate-bounce" />
                  </div>

                  {/* Database visualization */}
                  <div className="p-4 md:p-6 bg-brand-red-600 rounded-xl md:rounded-2xl text-white text-center">
                    <Database className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3" />
                    <p className="font-bold text-base md:text-lg">Your Private Database</p>
                    <p className="text-xs md:text-sm text-brand-red-100">
                      All vehicles in one place
                    </p>
                  </div>
                </div>

                {/* Floating animation elements */}
                <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-16 h-16 md:w-20 md:h-20 bg-brand-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-2xl animate-pulse text-sm md:text-base">
                  24/7
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 - Filtering */}
          <div className="mb-16 md:mb-32">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Visual first on mobile, second on desktop */}
              <div className="order-2 md:order-1 relative">
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border-2 border-gray-200 shadow-2xl">
                  {/* Before filtering */}
                  <div className="mb-6">
                    <p className="text-sm font-bold text-gray-500 mb-3">
                      BEFORE AI FILTERING
                    </p>
                    <div className="space-y-2">
                      {[
                        "Car Dealerships ❌",
                        "Salvaged Titles ❌",
                        "Scams ❌",
                        "Irrelevant Listings ❌",
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm line-through opacity-60"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Filtering */}
                  <div className="flex justify-center my-4">
                    <div className="px-4 py-2 bg-brand-red-600 text-white rounded-full font-bold flex items-center gap-2 shadow-lg">
                      <Brain className="w-5 h-5 animate-pulse" />
                      AI Filtering
                    </div>
                  </div>

                  {/* After filtering */}
                  <div>
                    <p className="text-sm font-bold text-green-600 mb-3">
                      AFTER AI FILTERING ✓
                    </p>
                    <div className="space-y-2">
                      {[
                        "Private Party Listings ✓",
                        "Clean Data ✓",
                        "High quality, relevant deals ✓",
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-green-50 border-2 border-green-500 rounded-lg text-sm font-semibold"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white font-bold shadow-2xl">
                  <div className="text-center">
                    <p className="text-2xl">99%</p>
                    <p className="text-xs">Filtered</p>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2 space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-red-100 text-brand-red-600 rounded-full text-xs md:text-sm font-bold">
                  Step 2
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                  99% of junk filtered instantly.
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Our AI instantly removes scams, dealers, salvage titles, and overpriced junk. 
                  Only legitimate private party deals with profit potential make it to your dashboard.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Scam Detection
                      </p>
                      <p className="text-gray-600">
                        Removes scam listings automatically
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Private Sales Only
                      </p>
                      <p className="text-gray-600">
                        Filters out car dealership & salvaged title
                        automatically
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FocusIcon className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                     Accuracy
                      </p>
                      <p className="text-gray-600">Autohunterpro's AI Filteration is 99% accurate</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                       Speed
                      </p>
                      <p className="text-gray-600">
                    Our AI is instant, saving you time while you scale
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 - Your Dashboard */}
          <div className="mb-16 md:mb-32">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-red-100 text-brand-red-600 rounded-full text-xs md:text-sm font-bold">
                  Step 3
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                  One dashboard. Every deal.
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  No more juggling tabs or missing platforms. Everything organized, searchable, 
                  and ready to contact – so you can move from "found it" to "bought it" in seconds.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Search className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Powerful Search
                      </p>
                      <p className="text-gray-600">
                        Find exactly what you need in seconds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Filter className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Advanced Filters
                      </p>
                      <p className="text-gray-600">
                        Make, model, price, mileage, location
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Market Analytics
                      </p>
                      <p className="text-gray-600">
                        See trends and price history
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Dashboard preview */}
              <div className="relative">
                <div className="bg-white p-4 rounded-3xl border-2 border-gray-200 shadow-2xl">
                  {/* Mock dashboard header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-brand-red-600 rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold">Private Sales</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">Live</span>
                    </div>
                  </div>

                  {/* Mock search bar */}
                  <div className="mb-4">
                    <div className="p-3 bg-gray-100 rounded-xl flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Search for vehicles...
                      </span>
                    </div>
                  </div>

                  {/* Mock listings */}
                  <div className="space-y-3">
                    {[
                      {
                        car: "2020 Honda Accord",
                        price: "$18,500",
                        status: "Listed 24 minutes ago",
                      },
                      {
                        car: "2021 Chevrolet Silverado 1500",
                        price: "$24,300",
                        status: "Listed 7 minutes ago",
                      },
                      {
                        car: "2021 Mazda CX-5",
                        price: "$22,900",
                        status: "Listed 32 minutes ago",
                      },
                    ].map((listing, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-brand-red-600 transition-all hover:shadow-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">
                              {listing.car}
                            </p>
                            <p className="text-sm text-gray-600">
                              Low mileage • Clean title
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-brand-red-600">
                              {listing.price}
                            </p>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                              {listing.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time badge */}
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-green-500 text-white rounded-full font-bold shadow-xl flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  Real-time
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 - Alerts */}
          <div className="mb-16 md:mb-32">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Visual first on mobile, second on desktop */}
              <div className="order-2 md:order-1 relative">
                <div className="bg-gradient-to-br from-brand-red-600 to-brand-red-700 p-8 rounded-3xl shadow-2xl text-white">
                  {/* Phone mockup with notifications */}
                  <div className="max-w-sm mx-auto">
                    <div className="bg-white rounded-3xl p-6 text-gray-900 shadow-2xl">
                      {/* Phone header */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-semibold">
                          Notifications
                        </span>
                        <div className="w-6 h-6 bg-brand-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          3
                        </div>
                      </div>

                      {/* Notifications */}
                      <div className="space-y-4">
                        {[
                          {
                            title: "2020 Honda Accord",
                            message: "New listing matching your criteria",
                            time: "Just now",
                            icon: Car,
                          },
                          {
                            title: "2021 Chevrolet Silverado 1500",
                            message: "New listing matching your criteria",
                            time: "5 min ago",
                            icon: Car,
                          },
                          {
                            title: "2021 Mazda CX-5 below market value",
                            message: "Hot Deal Found",
                            time: "12 min ago",
                            icon: Car,
                          },
                        ].map((notif, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-brand-red-50 rounded-2xl border-2 border-brand-red-200 animate-pulse"
                            style={{
                              animationDelay: `${idx * 0.3}s`,
                              animationDuration: "2s",
                            }}
                          >
                            <div className="flex gap-3">
                              <div className="w-10 h-10 bg-brand-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <notif.icon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="font-bold text-sm">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notif.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Delivery methods */}
                  <div className="flex justify-center gap-4 mt-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Bell className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Smartphone className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2 space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-red-100 text-brand-red-600 rounded-full text-xs md:text-sm font-bold">
                  Step 4
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                  Beat everyone to the deal.
                </h3>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Lightning-fast SMS alerts the second a profitable car hits any marketplace. 
                  While competitors are still searching, you're already calling the seller.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Instant Notifications
                      </p>
                      <p className="text-gray-600">
                        Get alerted the moment new listings appear
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Custom Criteria
                      </p>
                      <p className="text-gray-600">
                        Set exactly what you're looking for
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Multiple Channels
                      </p>
                      <p className="text-gray-600">
                        SMS notifications
                      </p>
                    </div>
                  </div>
                   <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <WorkflowIcon className="w-5 h-5 text-brand-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                         No Missed Opportunities
                      </p>
                      <p className="text-gray-600">
                  You don't miss an opportunity because you weren't online, the AI works for you 24 hours a day.
                      </p>
                    </div>
                  </div>
               


                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Time Savings Comparison */}
      <section className="py-12 md:py-20 lg:py-32 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 md:mb-6 px-2">
              Get 95% of your time back.
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 px-2">
              Time is money. See exactly how much you'll save every single day.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Without AutoHunter Pro */}
            <div className="p-6 md:p-8 bg-red-50 rounded-3xl border-2 border-red-200">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-full font-bold mb-3 md:mb-4 text-xs md:text-sm">
                  Without AutoHunter Pro
                </div>
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-red-600 mb-2">
                  6-8 hours
                </p>
                <p className="text-sm md:text-base text-gray-600 px-2">Daily manual hunting (and missing deals)</p>
              </div>

              <div className="space-y-3">
                {[
                  { task: "Checking Facebook Marketplace", time: "2 hours" },
                  { task: "Browsing Craigslist", time: "60 min" },
                  { task: "Checking OfferUp", time: "30 min" },
                  { task: "Browsing other platforms", time: "60 min" },
                  { task: "Filtering scams & junk", time: "90 min" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-xl flex justify-between items-center"
                  >
                    <span className="font-semibold text-gray-900">
                      {item.task}
                    </span>
                    <span className="text-red-600 font-bold">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* With AutoHunter Pro */}
            <div className="p-6 md:p-8 bg-green-50 rounded-3xl border-2 border-green-500 relative">
              <div className="absolute -top-3 md:-top-4 right-4 md:right-8 px-3 py-1.5 md:px-4 md:py-2 bg-green-500 text-white rounded-full font-bold shadow-xl text-xs md:text-sm">
                💰 More deals, less work
              </div>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded-full font-bold mb-3 md:mb-4 text-xs md:text-sm">
                  With AutoHunter Pro
                </div>
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-green-600 mb-2">
                  15 min
                </p>
                <p className="text-sm md:text-base text-gray-600">Per day, fully automated + better results</p>
              </div>

              <div className="space-y-3">
                {[
                  { task: "Log into dashboard", time: "30 sec" },
                  { task: "Review AI-filtered deals", time: "5 min" },
                  { task: "Set up new alerts", time: "2 min" },
                  { task: "Check notifications", time: "3 min" },
                  { task: "Contact sellers", time: "5 min" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-xl flex justify-between items-center border-2 border-green-200"
                  >
                    <span className="font-semibold text-gray-900">
                      {item.task}
                    </span>
                    <span className="text-green-600 font-bold">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/signup" className="block mt-6">
                <div className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-center transition-all transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                  <p className="font-bold text-lg">
                    Get Your Time Back + Find Better Deals →
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 md:py-20 lg:py-32 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-4 md:mb-6 px-2">
              Smart dealers already switched.
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 px-2">
              While you're manually hunting, they're using AI to find more deals in less time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                metric: "Thousands",
                label: "Vehicles Scanned Daily",
                icon: Car,
              },
              {
                metric: "24/7",
                label: "AI Running Non-Stop",
                icon: RefreshCw,
              },
              {
                metric: "Instant",
                label: "Alert Speed",
                icon: Zap,
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 md:p-8 bg-gradient-to-br from-brand-red-50 to-white rounded-3xl border-2 border-brand-red-200 hover:shadow-2xl transition-all"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <p className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2">
                  {stat.metric}
                </p>
                <p className="text-sm md:text-base text-gray-600 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 lg:py-32 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black px-2">
            Stop losing money to
            <br />
            <span className="text-brand-red-400">faster competitors</span>
          </h2>

          {!showDashboardButton && (
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-2xl mx-auto px-2">
              Join the AI revolution. 14-day free trial.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-6 md:pt-8">
            {showDashboardButton ? (
              <Button
                asChild
                size="lg"
                className="text-base md:text-lg px-10 py-6 md:px-12 md:py-8 rounded-2xl bg-brand-red-600 hover:bg-brand-red-700 text-white shadow-2xl hover:shadow-brand-red-600/50 transition-all transform hover:scale-105"
              >
                <Link href="/dashboard">
                  Dashboard
                  <LayoutDashboard className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="text-base md:text-lg px-10 py-6 md:px-12 md:py-8 rounded-2xl bg-brand-red-600 hover:bg-brand-red-700 text-white shadow-2xl hover:shadow-brand-red-600/50 transition-all transform hover:scale-105"
              >
                <Link href="/signup">
                  Start My Free Trial
                  <Rocket className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Link>
              </Button>
            )}
          </div>

          {!showDashboardButton && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-6 md:pt-8 text-xs md:text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
