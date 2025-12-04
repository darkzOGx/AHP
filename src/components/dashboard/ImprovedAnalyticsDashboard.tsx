'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useTrackedVehiclesFromCollection, useVehicleAlerts } from '@/hooks/useVehicleInteraction';
import { PRICING_PLANS } from '@/lib/stripe';
import { 
  BarChart3,
  Activity,
  Car, 
  MessageCircle,
  ShoppingCart,
  TrendingUp,
  Bell,
  ArrowRight,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import DashboardAnalytics from './DashboardAnalytics';
import AdvancedAnalytics from './AdvancedAnalytics';

export default function ImprovedAnalyticsDashboard() {
  const { 
    getUserPlan, 
    getAlertLimit, 
    isLitePlan, 
    isEnterprisePlan,
    trialDaysRemaining,
    isTrialing 
  } = useSubscription();
  const { trackedVehicles, loading: trackedLoading } = useTrackedVehiclesFromCollection();
  const { alerts } = useVehicleAlerts();

  const userPlan = getUserPlan();
  const alertLimit = getAlertLimit();
  const planData = PRICING_PLANS[userPlan.toUpperCase() as keyof typeof PRICING_PLANS];

  // Analytics calculations
  const totalTracked = trackedVehicles.length;
  const messaged = trackedVehicles.filter(v => v.status === 'messaged_owner').length;
  const inProgress = trackedVehicles.filter(v => v.status === 'purchase_in_progress').length;
  const totalAlerts = alerts.length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header Section */}
      <div className="border rounded-lg p-4 md:p-6 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
            </div>
            
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                Analytics
              </h1>
              <p className="text-sm text-gray-600">
                Vehicle tracking insights
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {planData?.name} Plan
            </Badge>
            {isTrialing && (
              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                {trialDaysRemaining} days left
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border">
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <Car className="w-5 h-5 mx-auto mb-2 text-gray-900" />
              <p className="text-xs font-medium text-gray-600 mb-1">Tracked</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalTracked}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <MessageCircle className="w-5 h-5 mx-auto mb-2 text-gray-900" />
              <p className="text-xs font-medium text-gray-600 mb-1">Messaged</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{messaged}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <ShoppingCart className="w-5 h-5 mx-auto mb-2 text-red-600" />
              <p className="text-xs font-medium text-gray-600 mb-1">In Progress</p>
              <p className="text-xl md:text-2xl font-bold text-red-600">{inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-3 md:p-4">
            <div className="text-center">
              <Bell className="w-5 h-5 mx-auto mb-2 text-gray-900" />
              <p className="text-xs font-medium text-gray-600 mb-1">Alerts</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{totalAlerts}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Accordion */}
      <Accordion type="multiple" defaultValue={["tracked-vehicles"]} className="space-y-3">
        {/* Tracked Vehicles Section */}
        <AccordionItem value="tracked-vehicles" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 md:px-6 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Car className="w-4 h-4 text-gray-900" />
              <span className="text-sm md:text-base font-medium">Tracked Vehicles ({totalTracked})</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 md:px-6 pb-6">
            <TrackedVehiclesSection trackedVehicles={trackedVehicles} loading={trackedLoading} />
          </AccordionContent>
        </AccordionItem>

        {/* Analytics Charts */}
        <AccordionItem value="charts" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 md:px-6 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-gray-900" />
              <span className="text-sm md:text-base font-medium">Analytics Charts</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 md:px-6 pb-6">
            <DashboardAnalytics />
          </AccordionContent>
        </AccordionItem>

        {/* Advanced Analytics */}
        <AccordionItem value="advanced" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 md:px-6 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-gray-900" />
              <span className="text-sm md:text-base font-medium">Advanced Analytics</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 md:px-6 pb-6">
            <AdvancedAnalytics />
          </AccordionContent>
        </AccordionItem>

        {/* Plan Details */}
        <AccordionItem value="plan" className="border rounded-lg bg-white">
          <AccordionTrigger className="px-4 md:px-6 py-3 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-gray-900" />
              <span className="text-sm md:text-base font-medium">Plan Details</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 md:px-6 pb-6">
            <PlanFeaturesSection planData={planData} alertLimit={alertLimit} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Upgrade Section */}
      {!isEnterprisePlan && (
        <Card className="border bg-red-50">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold mb-1 text-gray-900">
                  {isLitePlan ? 'Need More Alerts?' : 'Ready for Team Features?'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isLitePlan 
                    ? 'Upgrade to Dealer plan for unlimited alerts'
                    : 'Upgrade to Enterprise for team collaboration'
                  }
                </p>
              </div>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap">
                <Link href="/pricing">
                  Upgrade
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Tracked Vehicles Section Component
function TrackedVehiclesSection({ trackedVehicles, loading }: { trackedVehicles: any[], loading: boolean }) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (trackedVehicles.length === 0) {
    return (
      <div className="text-center py-8">
        <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No tracked vehicles yet</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start tracking vehicles by visiting vehicle details and adding notes or status updates
        </p>
        <Button asChild>
          <Link href="/dashboard">
            Browse Vehicles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    );
  }

  const getStatusInfo = (status?: string) => {
    switch (status) {
      case 'messaged_owner':
        return {
          icon: <MessageCircle className="w-3 h-3" />,
          label: 'Messaged',
          color: 'bg-gray-100 text-gray-800 border-gray-300'
        };
      case 'purchase_in_progress':
        return {
          icon: <ShoppingCart className="w-3 h-3" />,
          label: 'In Progress',
          color: 'bg-red-100 text-red-800 border-red-300'
        };
      default:
        return {
          icon: <Eye className="w-3 h-3" />,
          label: 'Tracking',
          color: 'bg-gray-100 text-gray-800 border-gray-300'
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {trackedVehicles.slice(0, 12).map((vehicle) => {
          const statusInfo = getStatusInfo(vehicle.status);
          const vehicleData = vehicle.vehicleData;

          return (
            <Card key={vehicle.id} className="border hover:shadow-md transition-shadow">
              <CardContent className="p-3">
                {/* Vehicle Image */}
                {vehicleData?.imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-3">
                    <img
                      src={vehicleData.imageUrl}
                      alt={vehicleData.title || 'Vehicle'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Vehicle Title */}
                <h4 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
                  {vehicleData?.title || 'Untitled Vehicle'}
                </h4>

                {/* Status & Price */}
                <div className="flex items-center justify-between mb-3">
                  <Badge className={statusInfo.color} variant="outline">
                    {statusInfo.icon}
                    <span className="ml-1 text-xs">{statusInfo.label}</span>
                  </Badge>
                  {vehicleData?.price && (
                    <span className="text-sm font-medium text-red-600">
                      ${vehicleData.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Note Preview */}
                {vehicle.note && (
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3 bg-gray-50 p-2 rounded">
                    {vehicle.note}
                  </p>
                )}

                {/* Action */}
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link 
                    href={`/vehicle/${vehicle.vehicleId}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Eye className="w-3 h-3" />
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View All Button */}
      {trackedVehicles.length > 12 && (
        <div className="text-center pt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/tracked-vehicles">
              View All {trackedVehicles.length} Vehicles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

// Plan Features Section Component
function PlanFeaturesSection({ planData, alertLimit }: { planData: any, alertLimit: any }) {
  const features = planData?.features || [];
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border">
          <CardContent className="p-4 text-center">
            <h4 className="font-medium mb-1 text-gray-900">Monthly Cost</h4>
            <p className="text-xl font-bold text-red-600">${planData?.price}</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-4 text-center">
            <h4 className="font-medium mb-1 text-gray-900">Alert Capacity</h4>
            <p className="text-xl font-bold text-gray-900">
              {alertLimit === null ? '∞' : alertLimit}
            </p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-4 text-center">
            <h4 className="font-medium mb-1 text-gray-900">Data Sources</h4>
            <p className="text-xl font-bold text-gray-900">25+</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.slice(0, 8).map((feature: string, index: number) => (
          <div key={index} className="flex items-start gap-2 p-3 border rounded">
            <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
            <span className="text-sm text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

