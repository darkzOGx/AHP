'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrackedVehicles, useVehicleAlerts } from '@/hooks/useVehicleInteraction';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';
import { ResponsiveChartWrapper } from './ResponsiveChart';
import { 
  TrendingUp, 
  TrendingDown, 
  Car, 
  Bell, 
  Eye,
  MessageCircle,
  ShoppingCart,
  Target,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { useMemo } from 'react';
import { format, subDays, startOfDay, parseISO } from 'date-fns';

const COLORS = {
  primary: '#ef4444',
  secondary: '#3b82f6', 
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

function MetricCard({ title, value, change, icon, color = COLORS.primary }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs font-medium ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          <div 
            className="h-12 w-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: color + '20' }}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardAnalytics() {
  const { trackedVehicles, loading: vehiclesLoading } = useTrackedVehicles();
  const { alerts, loading: alertsLoading } = useVehicleAlerts();

  const analytics = useMemo(() => {
    if (vehiclesLoading || alertsLoading) return null;

    // Status distribution
    const statusCounts = trackedVehicles.reduce((acc: any, vehicle) => {
      const status = vehicle.status || 'tracked';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusData = [
      { name: 'Tracked', value: statusCounts.tracked || 0, color: COLORS.secondary },
      { name: 'Messaged', value: statusCounts.messaged_owner || 0, color: COLORS.warning },
      { name: 'In Progress', value: statusCounts.purchase_in_progress || 0, color: COLORS.success },
    ].filter(item => item.value > 0);

    // Activity timeline (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      return {
        date: format(date, 'MMM dd'),
        dateObj: date,
        tracked: 0,
        alerts: 0
      };
    });

    // Count tracked vehicles by day
    trackedVehicles.forEach(vehicle => {
      if (vehicle.createdAt) {
        const vehicleDate = vehicle.createdAt.toDate ? 
          startOfDay(vehicle.createdAt.toDate()) : 
          startOfDay(parseISO(vehicle.createdAt as any));
        
        const dayData = last7Days.find(day => 
          day.dateObj.getTime() === vehicleDate.getTime()
        );
        if (dayData) {
          dayData.tracked += 1;
        }
      }
    });

    // Count alerts by day  
    alerts.forEach(alert => {
      if (alert.timestamp) {
        const alertDate = alert.timestamp.toDate ? 
          startOfDay(alert.timestamp.toDate()) : 
          startOfDay(parseISO(alert.timestamp as any));
        
        const dayData = last7Days.find(day => 
          day.dateObj.getTime() === alertDate.getTime()
        );
        if (dayData) {
          dayData.alerts += 1;
        }
      }
    });

    // Price distribution
    const priceRanges = {
      'Under $10k': 0,
      '$10k-25k': 0,
      '$25k-50k': 0,
      '$50k-100k': 0,
      'Over $100k': 0
    };

    trackedVehicles.forEach(vehicle => {
      const price = vehicle.vehicleData?.price;
      if (price) {
        if (price < 10000) priceRanges['Under $10k']++;
        else if (price < 25000) priceRanges['$10k-25k']++;
        else if (price < 50000) priceRanges['$25k-50k']++;
        else if (price < 100000) priceRanges['$50k-100k']++;
        else priceRanges['Over $100k']++;
      }
    });

    const priceData = Object.entries(priceRanges)
      .filter(([_, value]) => value > 0)
      .map(([name, value], index) => ({
        name,
        value,
        color: [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.purple][index]
      }));

    // Recent activity (last 30 days)
    const recentActivity = Array.from({ length: 30 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 29 - i));
      return {
        date: format(date, 'MMM dd'),
        day: format(date, 'dd'),
        dateObj: date,
        activity: 0
      };
    });

    [...trackedVehicles, ...alerts].forEach(item => {
      const timestamp = item.createdAt || item.timestamp || item.updatedAt;
      if (timestamp) {
        const itemDate = timestamp.toDate ? 
          startOfDay(timestamp.toDate()) : 
          startOfDay(parseISO(timestamp as any));
        
        const dayData = recentActivity.find(day => 
          day.dateObj.getTime() === itemDate.getTime()
        );
        if (dayData) {
          dayData.activity += 1;
        }
      }
    });

    return {
      totalTracked: trackedVehicles.length,
      totalAlerts: alerts.length,
      messaged: statusCounts.messaged_owner || 0,
      inProgress: statusCounts.purchase_in_progress || 0,
      statusData,
      activityData: last7Days,
      priceData,
      recentActivity,
      avgPrice: trackedVehicles.length > 0 ? 
        Math.round(trackedVehicles.reduce((sum, v) => sum + (v.vehicleData?.price || 0), 0) / trackedVehicles.length) : 0
    };
  }, [trackedVehicles, alerts, vehiclesLoading, alertsLoading]);

  if (vehiclesLoading || alertsLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
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
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tracked Vehicles"
          value={analytics.totalTracked}
          icon={<Car className="h-6 w-6" style={{ color: COLORS.primary }} />}
          color={COLORS.primary}
        />
        <MetricCard
          title="Active Alerts"
          value={analytics.totalAlerts}
          icon={<Bell className="h-6 w-6" style={{ color: COLORS.secondary }} />}
          color={COLORS.secondary}
        />
        <MetricCard
          title="Messaged Owners"
          value={analytics.messaged}
          icon={<MessageCircle className="h-6 w-6" style={{ color: COLORS.warning }} />}
          color={COLORS.warning}
        />
        <MetricCard
          title="In Progress"
          value={analytics.inProgress}
          icon={<ShoppingCart className="h-6 w-6" style={{ color: COLORS.success }} />}
          color={COLORS.success}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Vehicle Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.statusData.length > 0 ? (
              <ResponsiveChartWrapper height={256}>
                <PieChart>
                  <Pie
                    data={analytics.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveChartWrapper>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No data available
              </div>
            )}
            <div className="flex flex-wrap gap-4 mt-4">
              {analytics.statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Weekly Activity Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChartWrapper height={256}>
              <AreaChart data={analytics.activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="tracked"
                  stackId="1"
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  name="Tracked"
                />
                <Area
                  type="monotone"
                  dataKey="alerts"
                  stackId="1"
                  stroke={COLORS.secondary}
                  fill={COLORS.secondary}
                  name="Alerts"
                />
              </AreaChart>
            </ResponsiveChartWrapper>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Price Range Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Price Range Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.priceData.length > 0 ? (
              <ResponsiveChartWrapper height={256}>
                <BarChart data={analytics.priceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" fill={COLORS.primary} />
                </BarChart>
              </ResponsiveChartWrapper>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No price data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* 30-Day Activity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              30-Day Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChartWrapper height={256}>
              <LineChart data={analytics.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day"
                  interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label, payload) => {
                    const data = payload?.[0]?.payload;
                    return data ? data.date : label;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke={COLORS.purple}
                  strokeWidth={2}
                  dot={{ fill: COLORS.purple, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveChartWrapper>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold" style={{ color: COLORS.success }}>
              ${analytics.avgPrice.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Average Price</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold" style={{ color: COLORS.purple }}>
              {analytics.totalTracked > 0 ? Math.round((analytics.messaged / analytics.totalTracked) * 100) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Contact Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-2xl font-bold" style={{ color: COLORS.warning }}>
              {analytics.messaged > 0 ? Math.round((analytics.inProgress / analytics.messaged) * 100) : 0}%
            </p>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}