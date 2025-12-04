'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useTrackedVehicles } from '@/hooks/useVehicleInteraction';
import { PRICING_PLANS } from '@/lib/stripe';
import { 
  Car, 
  Sparkles, 
  Bell, 
  TrendingUp, 
  Users,
  Crown,
  Zap,
  AlertTriangle,
  Building2,
  ArrowRight,
  MessageCircle,
  ShoppingCart,
  StickyNote,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import DashboardAnalytics from './DashboardAnalytics';
import AdvancedAnalytics from './AdvancedAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PlanBasedDashboard() {
  const { user } = useAuth();
  const { 
    getUserPlan, 
    getAlertLimit, 
    isLitePlan, 
    isEnterprisePlan,
    subscription,
    trialDaysRemaining,
    isTrialing 
  } = useSubscription();
  const { organization, userRole } = useOrganization();

  const userPlan = getUserPlan();
  const alertLimit = getAlertLimit();
  const planData = PRICING_PLANS[userPlan.toUpperCase() as keyof typeof PRICING_PLANS];

  // Different dashboard experiences based on plan
  if (isEnterprisePlan && organization) {
    return <EnterpriseDashboard organization={organization} userRole={userRole} user={user} />;
  } else if (isLitePlan) {
    return <LiteDashboard user={user} planData={planData} alertLimit={alertLimit} isTrialing={isTrialing} trialDaysRemaining={trialDaysRemaining} />;
  } else {
    return <DealerDashboard user={user} planData={planData} alertLimit={alertLimit} isTrialing={isTrialing} trialDaysRemaining={trialDaysRemaining} />;
  }
}

// Enterprise Dashboard (when user is in an organization)
function EnterpriseDashboard({ organization, userRole, user }: any) {
  return (
    <div className="space-y-8">
      {/* Organization Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {organization.branding?.logo ? (
              <img 
                src={organization.branding.logo} 
                alt={`${organization.name} logo`}
                className="w-16 h-16 object-contain rounded-xl border-2 border-purple-200"
              />
            ) : (
              <div className="w-16 h-16 bg-purple-100 border-2 border-purple-200 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
            )}
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {organization.name} Dashboard
              </h1>
              <p className="text-purple-700 text-lg font-medium">
                Enterprise Vehicle Discovery Platform
              </p>
            </div>
          </div>

          <Badge className="bg-purple-100 text-purple-800 border-purple-300 px-4 py-2 text-lg">
            <Crown className="w-4 h-4 mr-2" />
            Enterprise Plan
          </Badge>
        </div>
      </div>

      {/* Enterprise Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-t-4 border-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Team Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {organization.settings.maxUsers + organization.settings.additionalUsers}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active members</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alert Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">∞</div>
            <p className="text-xs text-gray-500 mt-1">Unlimited alerts</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-600 capitalize">{userRole}</div>
            <p className="text-xs text-gray-500 mt-1">Access level</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">25+</div>
            <p className="text-xs text-gray-500 mt-1">Data sources</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6 mt-6">
            <DashboardAnalytics />
          </TabsContent>
          <TabsContent value="advanced" className="space-y-6 mt-6">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>

      <EnterpriseFeatures userRole={userRole} />
      <TrackedVehiclesSection />
    </div>
  );
}

// Lite Plan Dashboard ($169)
function LiteDashboard({ user, planData, alertLimit, isTrialing, trialDaysRemaining }: any) {
  return (
    <div className="space-y-8">
      {/* Lite Plan Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-300 rounded-2xl p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center">
              <Car className="w-8 h-8 text-gray-600" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.displayName || 'Pro'}!
              </h1>
              <p className="text-gray-700 text-lg">
                Your focused vehicle discovery dashboard
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge className="bg-gray-100 text-gray-800 border-gray-300 px-4 py-2 text-lg mb-2">
              Lite Plan
            </Badge>
            {isTrialing && (
              <div className="text-sm text-orange-600 font-medium">
                {trialDaysRemaining} days left in trial
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lite Plan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alert Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{alertLimit}</div>
            <p className="text-xs text-gray-500 mt-1">Custom alerts</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Plan Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${planData?.price}</div>
            <p className="text-xs text-gray-500 mt-1">Per month</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">25+</div>
            <p className="text-xs text-gray-500 mt-1">Data sources</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6 mt-6">
            <DashboardAnalytics />
          </TabsContent>
          <TabsContent value="advanced" className="space-y-6 mt-6">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>

      <LiteFeatures />
      <TrackedVehiclesSection />
      
      {/* Upgrade Suggestion */}
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-orange-800 mb-2">Need More Alerts?</h3>
              <p className="text-orange-700">Upgrade to Dealer plan for unlimited alerts at $299/month</p>
            </div>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/pricing">
                Upgrade Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Dealer Plan Dashboard ($299)
function DealerDashboard({ user, planData, alertLimit, isTrialing, trialDaysRemaining }: any) {
  return (
    <div className="space-y-8">
      {/* Dealer Plan Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-100 border-2 border-red-300 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.displayName || 'Pro'}!
              </h1>
              <p className="text-red-700 text-lg font-medium">
                Your unlimited vehicle discovery platform
              </p>
            </div>
          </div>

          <div className="text-right">
            <Badge className="bg-red-100 text-red-800 border-red-300 px-4 py-2 text-lg mb-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Dealer Plan
            </Badge>
            {isTrialing && (
              <div className="text-sm text-orange-600 font-medium">
                {trialDaysRemaining} days left in trial
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dealer Plan Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Alert Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">∞</div>
            <p className="text-xs text-gray-500 mt-1">Unlimited alerts</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Plan Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">${planData?.price}</div>
            <p className="text-xs text-gray-500 mt-1">Per month</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">25+</div>
            <p className="text-xs text-gray-500 mt-1">Data sources</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6 mt-6">
            <DashboardAnalytics />
          </TabsContent>
          <TabsContent value="advanced" className="space-y-6 mt-6">
            <AdvancedAnalytics />
          </TabsContent>
        </Tabs>
      </div>

      <DealerFeatures />
      <TrackedVehiclesSection />

      {/* Enterprise Upgrade Suggestion */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-800 mb-2">Ready for Team Collaboration?</h3>
              <p className="text-purple-700">Upgrade to Enterprise for multi-user organizations and advanced features</p>
            </div>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/pricing">
                Upgrade to Enterprise
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Plan-specific feature sections
function LiteFeatures() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Lite Plan Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">3 Custom Alerts</h4>
              <p className="text-sm text-gray-600">Perfect for tracking specific vehicles</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Real-time Notifications</h4>
              <p className="text-sm text-gray-600">SMS & email alerts</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Car className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold">25+ Sources</h4>
              <p className="text-sm text-gray-600">Facebook, Craigslist, Cars.com & more</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold">AI Filtering</h4>
              <p className="text-sm text-gray-600">99% accurate scam detection</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DealerFeatures() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Dealer Plan Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">Unlimited Alerts</h4>
              <p className="text-sm text-gray-600">Scale your operation without limits</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Priority Support</h4>
              <p className="text-sm text-gray-600">Faster response times</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Car className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold">Advanced Filtering</h4>
              <p className="text-sm text-gray-600">Complex search criteria</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold">Bulk Operations</h4>
              <p className="text-sm text-gray-600">Manage multiple alerts efficiently</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EnterpriseFeatures({ userRole }: { userRole: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enterprise Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Team Collaboration</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" />
                Multi-user access
              </li>
              <li className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-purple-500" />
                Role-based permissions
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                Organization branding
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Advanced Management</h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-green-500" />
                Unlimited alerts
              </li>
              <li className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Usage analytics
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Priority support
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Your Access</h4>
            <div className="space-y-2">
              <Badge className={
                userRole === 'owner' ? 'bg-purple-100 text-purple-800' :
                userRole === 'admin' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }>
                {userRole === 'owner' && '👑 Organization Owner'}
                {userRole === 'admin' && '🛡️ Administrator'}
                {userRole === 'member' && '👤 Team Member'}
              </Badge>
              <p className="text-sm text-gray-600">
                {userRole === 'owner' && 'Full organization control'}
                {userRole === 'admin' && 'Management capabilities'}
                {userRole === 'member' && 'Standard team access'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Tracked Vehicles Section - Shows in all dashboards
function TrackedVehiclesSection() {
  const { trackedVehicles, loading } = useTrackedVehicles();
  
  // Show only the most recent 6 tracked vehicles
  const recentTracked = trackedVehicles.slice(0, 6);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentTracked.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Tracked Vehicles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tracked vehicles yet</h3>
            <p className="text-gray-600 mb-4">
              Start tracking vehicles by adding notes or status updates on vehicle pages
            </p>
            <Button asChild>
              <Link href="/dashboard">Browse Vehicles</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'messaged_owner':
        return {
          icon: <MessageCircle className="w-3 h-3" />,
          label: 'Messaged',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'purchase_in_progress':
        return {
          icon: <ShoppingCart className="w-3 h-3" />,
          label: 'In Progress',
          color: 'bg-green-100 text-green-800'
        };
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Tracked Vehicles ({trackedVehicles.length})
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/tracked-vehicles">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentTracked.map((vehicle) => {
            const statusInfo = vehicle.status ? getStatusInfo(vehicle.status) : null;
            const vehicleData = vehicle.vehicleData;

            return (
              <div key={vehicle.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                {/* Vehicle Image */}
                {vehicleData?.imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <img
                      src={vehicleData.imageUrl}
                      alt={vehicleData.title || 'Vehicle'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Vehicle Title */}
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {vehicleData?.title || 'Untitled Vehicle'}
                </h4>

                {/* Status & Price */}
                <div className="flex items-center justify-between mb-2">
                  {statusInfo && (
                    <Badge className={statusInfo.color} variant="outline">
                      {statusInfo.icon}
                      <span className="ml-1">{statusInfo.label}</span>
                    </Badge>
                  )}
                  {vehicleData?.price && (
                    <span className="text-sm font-medium text-green-600">
                      ${vehicleData.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Note Preview */}
                {vehicle.note && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {vehicle.note}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  {vehicleData?.url && (
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <a 
                        href={vehicleData.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More Link */}
        {trackedVehicles.length > 6 && (
          <div className="mt-6 text-center">
            <Button asChild variant="outline">
              <Link href="/dashboard/tracked-vehicles">
                View All {trackedVehicles.length} Tracked Vehicles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}