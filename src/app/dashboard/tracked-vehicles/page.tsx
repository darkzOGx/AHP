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
import { useTrackedVehicles } from '@/hooks/useVehicleInteraction';
import { VehicleStatus, UserVehicleInteraction } from '@/lib/types';
import { 
  Car, 
  MessageCircle, 
  ShoppingCart, 
  Search, 
  Filter,
  ExternalLink,
  StickyNote,
  Calendar,
  DollarSign,
  MapPin
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { getDataSourceUrl } from '@/lib/dataSource';

export default function TrackedVehiclesPage() {
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { trackedVehicles, loading } = useTrackedVehicles(
    statusFilter === 'all' ? undefined : statusFilter
  );

  // Additional client-side filtering for search
  const filteredVehicles = trackedVehicles.filter(vehicle => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const vehicleData = vehicle.vehicleData;
    
    return (
      vehicleData?.title?.toLowerCase().includes(searchLower) ||
      vehicleData?.make?.toLowerCase().includes(searchLower) ||
      vehicleData?.model?.toLowerCase().includes(searchLower) ||
      vehicleData?.location?.toLowerCase().includes(searchLower) ||
      vehicle.note?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusInfo = (status: VehicleStatus) => {
    switch (status) {
      case 'messaged_owner':
        return {
          label: 'Messaged Owner',
          icon: <MessageCircle className="w-4 h-4" />,
          color: 'bg-blue-100 text-blue-800 border-blue-300'
        };
      case 'purchase_in_progress':
        return {
          label: 'Purchase in Progress',
          icon: <ShoppingCart className="w-4 h-4" />,
          color: 'bg-green-100 text-green-800 border-green-300'
        };
      default:
        return {
          label: 'No Status',
          icon: <Car className="w-4 h-4" />,
          color: 'bg-gray-100 text-gray-800 border-gray-300'
        };
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusCounts = () => {
    const counts = {
      all: trackedVehicles.length,
      messaged_owner: trackedVehicles.filter(v => v.status === 'messaged_owner').length,
      purchase_in_progress: trackedVehicles.filter(v => v.status === 'purchase_in_progress').length,
      notes_only: trackedVehicles.filter(v => !v.status && v.note).length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
              <Car className="w-8 h-8 text-blue-600" />
              Tracked Vehicles
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all vehicles you've interacted with
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">Total Tracked</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.messaged_owner}</div>
              <div className="text-sm text-gray-600">Messaged Owner</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{statusCounts.purchase_in_progress}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.notes_only}</div>
              <div className="text-sm text-gray-600">Notes Only</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search vehicles, notes, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles ({statusCounts.all})</SelectItem>
                  <SelectItem value="messaged_owner">
                    Messaged Owner ({statusCounts.messaged_owner})
                  </SelectItem>
                  <SelectItem value="purchase_in_progress">
                    Purchase in Progress ({statusCounts.purchase_in_progress})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {trackedVehicles.length === 0 ? 'No tracked vehicles yet' : 'No vehicles match your filters'}
              </h3>
              <p className="text-gray-600 mb-4">
                {trackedVehicles.length === 0 
                  ? 'Start tracking vehicles by adding notes or status on vehicle pages'
                  : 'Try adjusting your search terms or filters'
                }
              </p>
              {trackedVehicles.length === 0 && (
                <Button asChild>
                  <Link href="/dashboard">
                    Browse Vehicles
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: UserVehicleInteraction }) {
  const statusInfo = vehicle.status ? getStatusInfo(vehicle.status) : null;
  const vehicleData = vehicle.vehicleData;

  const formatPrice = (price?: number) => {
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusInfo = (status: VehicleStatus) => {
    switch (status) {
      case 'messaged_owner':
        return {
          label: 'Messaged Owner',
          icon: <MessageCircle className="w-4 h-4" />,
          color: 'bg-blue-100 text-blue-800 border-blue-300'
        };
      case 'purchase_in_progress':
        return {
          label: 'Purchase in Progress',
          icon: <ShoppingCart className="w-4 h-4" />,
          color: 'bg-green-100 text-green-800 border-green-300'
        };
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-6">
        {/* Vehicle Image */}
        {vehicleData?.imageUrl && (
          <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
            <img
              src={vehicleData.imageUrl}
              alt={vehicleData.title || 'Vehicle'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}

        {/* Vehicle Title */}
        <div className="mb-3">
          <div className="mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {vehicleData?.title || 'Untitled Vehicle'}
            </h3>
          </div>
          
          {vehicleData?.year && vehicleData?.make && vehicleData?.model && (
            <p className="text-sm text-gray-600">
              {vehicleData.year} {vehicleData.make} {vehicleData.model}
            </p>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="space-y-2 mb-4">
          {vehicleData?.price && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-700">
                {formatPrice(vehicleData.price)}
              </span>
            </div>
          )}
          
          {vehicleData?.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{vehicleData.location}</span>
            </div>
          )}
          
          {vehicleData?.mileage && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Car className="w-4 h-4" />
              <span>{vehicleData.mileage.toLocaleString()} miles</span>
            </div>
          )}
        </div>

        {/* Status */}
        {statusInfo && (
          <div className="mb-3">
            <Badge className={statusInfo.color}>
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
            </Badge>
          </div>
        )}

        {/* Note Preview */}
        {vehicle.note && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <StickyNote className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Your Note:</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">
              {vehicle.note}
            </p>
          </div>
        )}

        {/* Timestamp */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Calendar className="w-3 h-3" />
          <span>
            Updated {formatDistanceToNow(vehicle.updatedAt.toDate(), { addSuffix: true })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {vehicleData?.url && (
            <Button asChild variant="outline" size="sm" className="flex-1">
              <a 
                href={getDataSourceUrl(vehicleData)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                View Listing
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}