'use client';

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SubscriptionGuard from "@/components/auth/SubscriptionGuard";
import AlgoliaSearch from "@/components/AlgoliaSearch";
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { Car, Sparkles, Search, Zap, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SubscriptionGuard>
        <OrganizationProvider>
          <div className="w-full space-y-8">
            {/* Compact Header */}
            {/* <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Vehicle Discovery</h1>
                    <p className="text-sm text-red-700">Find deals before the competition</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">25+</div>
                    <div className="text-xs text-gray-600">Sources</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">99%</div>
                    <div className="text-xs text-gray-600">Accurate</div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                    <Link href="/analytics">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Analytics
                    </Link>
                  </Button>
                </div>
              </div>
            </div> */}

            {/* Search Section */}
            <div className="space-y-6">
              <div className="text-center space-y-3 px-4">
                <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <Search className="h-6 w-6 md:h-7 md:w-7 text-brand-red-600" />
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-gray-900">
                    Start Your Search
                  </h2>
                  <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-brand-red-600" />
                </div>
                <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto font-medium">
                  Search through thousands of private party listings updated in real-time from Facebook, Craigslist, Cars.com, and more.
                </p>
              </div>

              {/* Search Interface */}
              <AlgoliaSearch index="vehicles" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">Track your performance and insights</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/analytics">View Analytics</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Create Alert</h3>
                  <p className="text-sm text-gray-600 mb-4">Set up automated vehicle notifications</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/create-alert">Create Alert</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tracked Vehicles</h3>
                  <p className="text-sm text-gray-600 mb-4">View vehicles you've saved</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/dashboard/tracked-vehicles">View Tracked</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">My Alerts</h3>
                  <p className="text-sm text-gray-600 mb-4">Manage your alert settings</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/my-alerts">Manage Alerts</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </OrganizationProvider>
      </SubscriptionGuard>
    </ProtectedRoute>
  );
}
