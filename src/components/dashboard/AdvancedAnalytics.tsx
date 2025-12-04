'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrackedVehicles, useVehicleAlerts } from '@/hooks/useVehicleInteraction';
import { 
  ResponsiveContainer, 
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import { ResponsiveChartWrapper } from './ResponsiveChart';
import { 
  Map, 
  Clock, 
  Zap,
  Globe,
  TrendingUp,
  Filter,
  Database,
  Gauge
} from 'lucide-react';
import { useMemo } from 'react';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

const COLORS = {
  primary: '#ef4444',
  secondary: '#3b82f6', 
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  teal: '#14b8a6'
};

interface PerformanceMetricProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  description: string;
}

function PerformanceMetric({ title, value, unit, trend, description }: PerformanceMetricProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600', 
    stable: 'text-gray-600'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        {trend && (
          <Badge variant="outline" className={trendColors[trend]}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↙' : '→'}
          </Badge>
        )}
      </div>
      <p className="text-2xl font-bold">
        {value}{unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
      </p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default function AdvancedAnalytics() {
  const { trackedVehicles, loading: vehiclesLoading } = useTrackedVehicles();
  const { alerts, loading: alertsLoading } = useVehicleAlerts();

  const advancedMetrics = useMemo(() => {
    if (vehiclesLoading || alertsLoading) return null;

    // Brand distribution analysis
    const brandDistribution = trackedVehicles.reduce((acc: any, vehicle) => {
      const title = vehicle.vehicleData?.title || '';
      const brand = title.split(' ')[0]?.toLowerCase() || 'unknown';
      acc[brand] = (acc[brand] || 0) + 1;
      return acc;
    }, {});

    const topBrands = Object.entries(brandDistribution)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 8)
      .map(([brand, count], index) => ({
        name: brand.charAt(0).toUpperCase() + brand.slice(1),
        value: count as number,
        color: Object.values(COLORS)[index % Object.values(COLORS).length]
      }));

    // Time-based activity patterns
    const activityByHour = Array.from({ length: 24 }, (_, hour) => ({
      hour: hour.toString().padStart(2, '0') + ':00',
      activity: 0
    }));

    [...trackedVehicles, ...alerts].forEach(item => {
      const timestamp = item.createdAt || item.timestamp || item.updatedAt;
      if (timestamp) {
        const date = timestamp.toDate ? timestamp.toDate() : parseISO(timestamp as any);
        const hour = date.getHours();
        activityByHour[hour].activity += 1;
      }
    });

    // Geographic distribution (mock data for demo)
    const locationData = [
      { region: 'West Coast', vehicles: Math.floor(trackedVehicles.length * 0.35), lat: 37, lng: -120 },
      { region: 'East Coast', vehicles: Math.floor(trackedVehicles.length * 0.25), lat: 40, lng: -75 },
      { region: 'South', vehicles: Math.floor(trackedVehicles.length * 0.20), lat: 32, lng: -95 },
      { region: 'Midwest', vehicles: Math.floor(trackedVehicles.length * 0.15), lat: 41, lng: -87 },
      { region: 'Southwest', vehicles: Math.floor(trackedVehicles.length * 0.05), lat: 34, lng: -106 }
    ].filter(location => location.vehicles > 0);

    // Performance radar data
    const performanceData = [
      {
        metric: 'Discovery',
        score: Math.min(100, (trackedVehicles.length / 20) * 100),
        fullMark: 100
      },
      {
        metric: 'Engagement', 
        score: trackedVehicles.length > 0 ? 
          Math.min(100, ((trackedVehicles.filter(v => v.status === 'messaged_owner').length / trackedVehicles.length) * 100)) : 0,
        fullMark: 100
      },
      {
        metric: 'Conversion',
        score: trackedVehicles.length > 0 ? 
          Math.min(100, ((trackedVehicles.filter(v => v.status === 'purchase_in_progress').length / trackedVehicles.length) * 100)) : 0,
        fullMark: 100
      },
      {
        metric: 'Alerts',
        score: Math.min(100, (alerts.length / 50) * 100),
        fullMark: 100
      },
      {
        metric: 'Activity',
        score: Math.min(100, ([...trackedVehicles, ...alerts].filter(item => {
          const timestamp = item.createdAt || item.timestamp || item.updatedAt;
          if (!timestamp) return false;
          const date = timestamp.toDate ? timestamp.toDate() : parseISO(timestamp as any);
          return isThisWeek(date);
        }).length / 10) * 100),
        fullMark: 100
      }
    ];

    // Price vs Response correlation
    const priceResponseData = trackedVehicles
      .filter(v => v.vehicleData?.price && v.status)
      .map(v => ({
        price: v.vehicleData!.price,
        responded: v.status === 'messaged_owner' ? 1 : 0,
        inProgress: v.status === 'purchase_in_progress' ? 2 : v.status === 'messaged_owner' ? 1 : 0
      }));

    // Recent activity summary
    const recentActivity = {
      today: [...trackedVehicles, ...alerts].filter(item => {
        const timestamp = item.createdAt || item.timestamp || item.updatedAt;
        if (!timestamp) return false;
        const date = timestamp.toDate ? timestamp.toDate() : parseISO(timestamp as any);
        return isToday(date);
      }).length,
      yesterday: [...trackedVehicles, ...alerts].filter(item => {
        const timestamp = item.createdAt || item.timestamp || item.updatedAt;
        if (!timestamp) return false;
        const date = timestamp.toDate ? timestamp.toDate() : parseISO(timestamp as any);
        return isYesterday(date);
      }).length,
      thisWeek: [...trackedVehicles, ...alerts].filter(item => {
        const timestamp = item.createdAt || item.timestamp || item.updatedAt;
        if (!timestamp) return false;
        const date = timestamp.toDate ? timestamp.toDate() : parseISO(timestamp as any);
        return isThisWeek(date);
      }).length
    };

    return {
      topBrands,
      activityByHour: activityByHour.filter(hour => hour.activity > 0),
      locationData,
      performanceData,
      priceResponseData,
      recentActivity,
      totalSources: 25, // Mock data
      avgResponseTime: '2.4h', // Mock data
      effectiveAlerts: alerts.length > 0 ? Math.round((alerts.length * 0.85)) : 0 // Mock effectiveness
    };
  }, [trackedVehicles, alerts, vehiclesLoading, alertsLoading]);

  if (vehiclesLoading || alertsLoading || !advancedMetrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <PerformanceMetric
              title="Today's Activity"
              value={advancedMetrics.recentActivity.today}
              trend={advancedMetrics.recentActivity.today > advancedMetrics.recentActivity.yesterday ? 'up' : 
                     advancedMetrics.recentActivity.today < advancedMetrics.recentActivity.yesterday ? 'down' : 'stable'}
              description="Actions completed today"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <PerformanceMetric
              title="Data Sources"
              value={advancedMetrics.totalSources}
              unit="active"
              trend="stable"
              description="Monitoring platforms"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <PerformanceMetric
              title="Avg Response"
              value={advancedMetrics.avgResponseTime}
              trend="up"
              description="Alert to action time"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <PerformanceMetric
              title="Alert Efficiency"
              value={advancedMetrics.effectiveAlerts}
              unit={`/${alerts.length}`}
              trend="up"
              description="Actionable alerts received"
            />
          </CardContent>
        </Card>
      </div>

      {/* Advanced Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChartWrapper height={256}>
              <RadarChart data={advancedMetrics.performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={18} domain={[0, 100]} />
                <Radar
                  name="Performance"
                  dataKey="score"
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveChartWrapper>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advancedMetrics.locationData.map((location, index) => (
                <div key={location.region} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: Object.values(COLORS)[index] }}
                    ></div>
                    <span className="font-medium">{location.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{location.vehicles} vehicles</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          backgroundColor: Object.values(COLORS)[index],
                          width: `${(location.vehicles / Math.max(...advancedMetrics.locationData.map(l => l.vehicles))) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Analysis & Activity Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Brands */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Top Vehicle Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {advancedMetrics.topBrands.slice(0, 6).map((brand, index) => (
                <div key={brand.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-muted-foreground w-6">
                      {index + 1}.
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: brand.color }}
                    ></div>
                    <span className="font-medium">{brand.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{brand.value as number}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          backgroundColor: brand.color,
                          width: `${((brand.value as number) / Math.max(...advancedMetrics.topBrands.map(b => b.value as number))) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Response Correlation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Price vs Response Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            {advancedMetrics.priceResponseData.length > 0 ? (
              <ResponsiveChartWrapper height={192}>
                <ScatterChart data={advancedMetrics.priceResponseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="price" 
                    type="number" 
                    domain={['dataMin', 'dataMax']}
                    tickFormatter={(value) => `$${Math.round(value/1000)}k`}
                  />
                  <YAxis dataKey="inProgress" domain={[0, 2]} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'inProgress' ? 
                        (value === 2 ? 'Purchase in Progress' : 
                         value === 1 ? 'Owner Contacted' : 'Just Tracked') : 
                        value,
                      name
                    ]}
                    labelFormatter={(label) => `$${Number(label).toLocaleString()}`}
                  />
                  <Scatter dataKey="inProgress" fill={COLORS.primary} />
                </ScatterChart>
              </ResponsiveChartWrapper>
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <div className="text-center">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Not enough data for correlation analysis</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}