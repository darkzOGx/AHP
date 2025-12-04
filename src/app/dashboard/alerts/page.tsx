'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVehicleAlerts } from '@/hooks/useVehicleInteraction';
import { 
  Bell, 
  Search, 
  Calendar, 
  Car,
  ExternalLink,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';

export default function AlertsDashboardPage() {
  const { alerts, loading } = useVehicleAlerts();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  
  // Filter alerts based on search and time
  const filteredAlerts = alerts.filter(alert => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = (
        alert.message?.toLowerCase().includes(searchLower) ||
        alert.vehicleData?.title?.toLowerCase().includes(searchLower) ||
        alert.vehicleData?.location?.toLowerCase().includes(searchLower) ||
        alert.vehicleData?.make?.toLowerCase().includes(searchLower) ||
        alert.vehicleData?.model?.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // Time filter
    if (timeFilter !== 'all') {
      const alertDate = alert.timestamp?.toDate();
      if (!alertDate) return false;
      
      const now = new Date();
      const diffTime = now.getTime() - alertDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      switch (timeFilter) {
        case '24h':
          return diffDays <= 1;
        case '7d':
          return diffDays <= 7;
        case '30d':
          return diffDays <= 30;
        default:
          return true;
      }
    }

    return true;
  });

  // Get alert statistics
  const getAlertStats = () => {
    const now = new Date();
    const last24h = alerts.filter(alert => {
      const alertDate = alert.timestamp?.toDate();
      return alertDate && (now.getTime() - alertDate.getTime()) <= (24 * 60 * 60 * 1000);
    }).length;

    const last7d = alerts.filter(alert => {
      const alertDate = alert.timestamp?.toDate();
      return alertDate && (now.getTime() - alertDate.getTime()) <= (7 * 24 * 60 * 60 * 1000);
    }).length;

    return { total: alerts.length, last24h, last7d };
  };

  const stats = getAlertStats();

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="w-8 h-8 text-orange-600" />
              Alert History
            </h1>
            <p className="text-gray-600 mt-2">
              View all vehicle alerts generated from your watchlists
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Alerts</div>
                </div>
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.last24h}</div>
                  <div className="text-sm text-gray-600">Last 24 Hours</div>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.last7d}</div>
                  <div className="text-sm text-gray-600">Last 7 Days</div>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Search Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search alerts by vehicle, location, or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {alerts.length === 0 ? 'No alerts yet' : 'No alerts match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {alerts.length === 0 
                  ? 'Create some watchlists to start receiving vehicle alerts'
                  : 'Try adjusting your search terms or time filter'
                }
              </p>
              {alerts.length === 0 && (
                <Button asChild>
                  <Link href="/dashboard">
                    Create Watchlist
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AlertCard({ alert }: { alert: any }) {
  const alertDate = alert.timestamp?.toDate();
  const vehicleData = alert.vehicleData;

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not listed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Vehicle Image */}
          {vehicleData?.imageUrl && (
            <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={vehicleData.imageUrl}
                alt={vehicleData.title || 'Vehicle'}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Alert Content */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {vehicleData?.title || 'Vehicle Alert'}
                </h3>
                
                {vehicleData?.year && vehicleData?.make && vehicleData?.model && (
                  <p className="text-sm text-gray-600 mb-2">
                    {vehicleData.year} {vehicleData.make} {vehicleData.model}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">
                    <Bell className="w-3 h-3 mr-1" />
                    Alert
                  </Badge>
                  {alertDate && (
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(alertDate, { addSuffix: true })}
                    </span>
                  )}
                </div>
              </div>

              {vehicleData?.url && (
                <Button asChild variant="outline" size="sm">
                  <a 
                    href={vehicleData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </a>
                </Button>
              )}
            </div>

            {/* Alert Message */}
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Alert:</strong> {alert.message}
              </p>
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {vehicleData?.price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-700">
                    {formatPrice(vehicleData.price)}
                  </span>
                </div>
              )}
              
              {vehicleData?.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{vehicleData.location}</span>
                </div>
              )}
              
              {vehicleData?.mileage && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Car className="w-4 h-4" />
                  <span>{vehicleData.mileage?.toLocaleString()} miles</span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {alertDate ? format(alertDate, 'MMM d, yyyy \'at\' h:mm a') : 'Unknown date'}
                </span>
              </div>
              
              {alert.watchlistId && (
                <div className="flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  <span>Watchlist ID: {alert.watchlistId.slice(-8)}</span>
                </div>
              )}

              {alert.vehicleId && (
                <div className="flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  <span>Vehicle ID: {alert.vehicleId.slice(-8)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}