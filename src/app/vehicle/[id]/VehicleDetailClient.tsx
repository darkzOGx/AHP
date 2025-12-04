'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SubscriptionGuard from "@/components/auth/SubscriptionGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  MapPin,
  Gauge,
  Calendar,
  Palette,
  Car,
  User,
  Globe,
  FileText,
  Loader2,
  ExternalLink,
  DollarSign,
  Clock,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle2,
  Eye
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import Link from "next/link";
import VehicleReport from "@/components/VehicleReport";
import { ImageGalleryModal } from "@/components/ImageGalleryModal";
import VehicleTracking from "@/components/VehicleTracking";
import { getDataSourceInfo, getDataSourceButtonText, getDataSourceUrl } from "@/lib/dataSource";
import { DataSourceIcon } from "@/components/DataSourceIcon";

interface VehicleData {
  objectID: string;
  product_title: string;
  product_price?: number;
  product_description?: string;
  images?: string[];
  vehicle_info?: {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    exterior_color?: string;
    interior_color?: string;
    transmission?: string;
    fuel_type?: string;
    drive_type?: string;
    body_style?: string;
    engine?: string;
    doors?: number;
  };
  publication_info?: {
    publication_id?: number;
    location?: string;
    listing_time?: number;
    publication_link?: string;
    seller_name?: string;
    seller_description?: string;
    contact_phone?: string;
    contact_email?: string;
  };
  _geoloc?: {
    lat: number;
    lng: number;
  };
  vinData?: {
    plate?: string;
    confidence?: number;
    vin?: string;
    nhtsaData?: any;
    notes?: string[];
    retrievedAt?: string;
    marketCheckData?: {
      market_price?: number;
      market_price_source?: string;
      msrp?: number;
      inventory_type?: string;
      confidence_score?: number;
      data_points?: number;
      last_updated?: string;
    };
  };
}

interface VehicleReportState {
  isLoading: boolean;
  data: any;
  error: string | null;
}

export default function VehicleDetailClient() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicleReport, setVehicleReport] = useState<VehicleReportState>({
    isLoading: false,
    data: null,
    error: null
  });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showManualPlateInput, setShowManualPlateInput] = useState(false);
  const [manualPlate, setManualPlate] = useState('');

  const vehicleId = params?.id as string;

  // Function to handle back navigation with search state
  const handleBackNavigation = () => {
    // Check if we have search parameters to restore
    const query = searchParams.get('q');
    const radius = searchParams.get('radius');
    const dataSources = searchParams.get('dataSources');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const maxMileage = searchParams.get('maxMileage');
    const locationEnabled = searchParams.get('locationEnabled');

    // If we have search parameters, reconstruct the dashboard URL with filters
    if (query || radius || dataSources || minPrice || maxPrice || minYear || maxYear || maxMileage || locationEnabled) {
      const dashboardParams = new URLSearchParams();
      
      if (query) dashboardParams.set('q', query);
      if (radius) dashboardParams.set('radius', radius);
      if (dataSources) dashboardParams.set('dataSources', dataSources);
      if (minPrice) dashboardParams.set('minPrice', minPrice);
      if (maxPrice) dashboardParams.set('maxPrice', maxPrice);
      if (minYear) dashboardParams.set('minYear', minYear);
      if (maxYear) dashboardParams.set('maxYear', maxYear);
      if (maxMileage) dashboardParams.set('maxMileage', maxMileage);
      if (locationEnabled) dashboardParams.set('locationEnabled', locationEnabled);
      
      const queryString = dashboardParams.toString();
      router.push(`/dashboard${queryString ? `?${queryString}` : ''}`);
    } else {
      // Fallback to browser back or dashboard
      router.back();
    }
  };

  useEffect(() => {
    console.log('Vehicle detail page mounted. Params:', params);
    console.log('Vehicle ID:', vehicleId);
    if (vehicleId) {
      console.log('Calling fetchVehicleData with ID:', vehicleId);
      fetchVehicleData(vehicleId);
    } else {
      console.log('No vehicle ID found in params');
      setError('No vehicle ID provided');
      setLoading(false);
    }
  }, [vehicleId]);

  const fetchVehicleData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Initialize Typesense client
      const TypesenseInstantSearchAdapter = (await import('typesense-instantsearch-adapter')).default;
      
      const typesenseAdapter = new TypesenseInstantSearchAdapter({
        server: {
          apiKey: "n6Nmu4xRARknOls0pq8ySXJYa3rnCgF0",
          nodes: [
            {
              host: "a0rbof7udni1qexkp-1.a1.typesense.net",
              port: 443,
              protocol: "https",
            },
          ],
        },
        additionalSearchParameters: {
          query_by: "product_title,publication_info.vehicle_company,publication_info.vehicle_model",
        },
      });

      // Search for the specific vehicle by ID
      const searchClient = typesenseAdapter.searchClient;
      console.log('Searching for vehicle ID:', id);
      
      // Test basic connection first
      try {
        const testResults = await searchClient.search([{
          indexName: 'vehicles',
          query: '',
          params: {
            hitsPerPage: 1,
          }
        }]);
        console.log('Basic search test successful:', testResults.results[0]?.nbHits, 'total results available');
      } catch (testErr) {
        console.error('Basic search test failed:', testErr);
        throw new Error('Unable to connect to search service');
      }
      
      // Try filter-based search first
      let results = await searchClient.search([{
        indexName: 'vehicles',
        query: '',
        params: {
          filters: `objectID:${id}`,
          hitsPerPage: 1,
        }
      }]);

      console.log('Filter search results:', results);

      // If filter search fails, try query-based search
      if (!results.results[0]?.hits?.length) {
        console.log('Filter search failed, trying query search...');
        results = await searchClient.search([{
          indexName: 'vehicles',
          query: id,
          params: {
            hitsPerPage: 20,
            query_by: 'objectID',
          }
        }]);
        
        console.log('Query search results:', results);
        
        // Find exact match in query results
        if (results.results[0]?.hits?.length > 0) {
          const exactMatch = results.results[0].hits.find((hit: any) => hit.objectID === id);
          if (exactMatch) {
            console.log('Found exact match:', exactMatch);
            setVehicle(exactMatch as VehicleData);
            return;
          }
        }
      }

      if (results.results[0]?.hits?.length > 0) {
        const vehicleData = results.results[0].hits[0] as VehicleData;
        console.log('Found vehicle:', vehicleData);
        console.log('Vehicle info structure:', vehicleData.vehicle_info);
        console.log('Publication info structure:', vehicleData.publication_info);
        console.log('All vehicle keys:', Object.keys(vehicleData));
        setVehicle(vehicleData);
      } else {
        console.log('No vehicle found with ID:', id);
        setError('Vehicle not found');
      }
    } catch (err) {
      console.error('Error fetching vehicle data:', err);
      setError('Failed to load vehicle data');
    } finally {
      setLoading(false);
    }
  };

  const handleGetVehicleReport = async () => {
    if (!vehicle || !vehicleId) return;
console.log(vehicle, "<<< .")
    
    // Extract publication ID from Facebook marketplace URL
    const extractPublicationIdFromUrl = (url: string): string | null => {
      if (!url) return null;
      const match = url.match(/\/item\/(\d+)\/?/);
      return match ? match[1] : null;
    };

    const publicationLink = (vehicle as any)["publication_info.publication_link"] || vehicle.publication_info?.publication_link;
    const extractedId = publicationLink ? extractPublicationIdFromUrl(publicationLink) : null;
    
    // Use extracted ID from URL, fallback to publication_id field, then vehicleId
    const publicationId = extractedId ||
                         vehicle.publication_info?.publication_id || 
                         (vehicle as any)["publication_info.publication_id"] || 
                         vehicleId;
                         
    console.log('Vehicle ID:', vehicleId);
    console.log('Publication ID:', publicationId);
    console.log('Vehicle object:', vehicle);
    
    setVehicleReport(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Call the vehicle report API route (proxies to Firebase function)
      const response = await fetch('/api/vehicle-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: publicationId,
          state: ((vehicle as any)["publication_info.location"] || vehicle.publication_info?.location)?.slice(-2), // Extract state from location if available
          manualPlate: manualPlate.trim() || undefined // Include manual plate if provided
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reportData = await response.json();
      setVehicleReport(prev => ({ 
        ...prev, 
        isLoading: false, 
        data: reportData,
        error: null 
      }));
      
      // Update vehicle data with new vinData if returned
      if (reportData.vinData) {
        setVehicle(prev => prev ? { ...prev, vinData: reportData.vinData } : null);
      }
      
      // Clear manual input state after successful generation
      setShowManualPlateInput(false);
      setManualPlate('');
    } catch (err) {
      console.error('Error getting vehicle report:', err);
      setVehicleReport(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to generate vehicle report. Please try again.' 
      }));
    }
  };

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return 'Price not listed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatMileage = (mileage?: number) => {
    if (!mileage) return 'Mileage N/A';
    return new Intl.NumberFormat('en-US').format(mileage) + ' miles';
  };

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return null;
    
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 30) return `${diffDays} days ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <SubscriptionGuard>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-red-600" />
              <p className="text-gray-600">Loading vehicle details...</p>
            </div>
          </div>
        </SubscriptionGuard>
      </ProtectedRoute>
    );
  }

  if (error || !vehicle) {
    return (
      <ProtectedRoute>
        <SubscriptionGuard>
          <div className="min-h-screen flex items-center justify-center p-4">
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || 'Vehicle not found'}</AlertDescription>
            </Alert>
          </div>
        </SubscriptionGuard>
      </ProtectedRoute>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images 
    : ["https://placehold.co/800x600.png"];

  const dataSourceInfo = getDataSourceInfo(vehicle);
  const marketplaceLink = getDataSourceUrl(vehicle);
  const buttonText = getDataSourceButtonText(dataSourceInfo.name as any);

  return (
    <ProtectedRoute>
      <SubscriptionGuard>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="space-y-3 md:space-y-0 md:flex md:items-center md:gap-4">
                {/* Back button - full width on mobile */}
                <div className="flex items-center justify-between md:block">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleBackNavigation}
                    className="hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Back to Search</span>
                    <span className="sm:hidden">Back</span>
                  </Button>
                  <Badge variant="outline" className="md:hidden text-xs">
                    ID: {vehicle.objectID.slice(-6)}
                  </Badge>
                </div>
                
                {/* Title section - full width on mobile */}
                <div className="md:flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
                      {vehicle.product_title}
                    </h1>
                    <div className={`${dataSourceInfo.bgColor} ${dataSourceInfo.color} px-3 py-1 rounded-full text-xs font-medium border border-gray-200 flex items-center gap-1`}>
                      <DataSourceIcon dataSourceInfo={dataSourceInfo} className="h-3 w-3" />
                      <span>{dataSourceInfo.displayName}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Listed {formatTimeAgo((vehicle as any)["publication_info.listing_time"] || vehicle.publication_info?.listing_time)}
                  </p>
                </div>
                
                {/* ID badge - hidden on mobile, shown on desktop */}
                <Badge variant="outline" className="hidden md:block flex-shrink-0">
                  ID: {vehicle.objectID}
                </Badge>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Images */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Carousel */}
                <Card className="overflow-hidden shadow-lg border-0 bg-white">
                  <CardContent className="p-0">
                    <Carousel className="w-full">
                      <CarouselContent>
                        {images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-64 md:h-80 lg:h-96 w-full bg-gray-100 cursor-pointer group"
                                 onClick={() => {
                                   setSelectedImageIndex(index);
                                   setIsGalleryOpen(true);
                                 }}>
                              <img
                                src={image.includes('storage.googleapis.com') ? `/api/proxy-image?url=${encodeURIComponent(image)}` : image}
                                alt={`${vehicle.product_title} - Image ${index + 1}`}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  e.currentTarget.src = "https://placehold.co/800x600/png?text=Vehicle+Image";
                                }}
                              />
                              {/* Zoom indicator overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                <div className="bg-black/60 text-white px-3 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                                  <Eye className="h-4 w-4" />
                                  View Full Size
                                </div>
                              </div>
                              {/* Price overlay */}
                              {index === 0 && vehicle.product_price && vehicle.product_price > 0 && (
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                                  <span className="text-lg md:text-xl font-bold text-gray-900">
                                    {formatPrice(vehicle.product_price)}
                                  </span>
                                </div>
                              )}
                              {/* Image counter */}
                              {images.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                  {index + 1} of {images.length}
                                </div>
                              )}
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {images.length > 1 && (
                        <>
                          <CarouselPrevious className="left-4" />
                          <CarouselNext className="right-4" />
                        </>
                      )}
                    </Carousel>
                  </CardContent>
                </Card>

                {/* Vehicle Description */}
                {vehicle.product_description && (
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-brand-red-600" />
                        Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {vehicle.product_description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Vehicle Report Section */}
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-brand-red-600" />
                      Vehicle Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Always show manual license plate option */}
                    <div className="text-center space-y-4">
                      {/* Show generate button only if no data exists */}
                      {!vehicleReport.data && !vehicle.vinData && (
                        <p className="text-gray-600">
                          Get detailed vehicle information including VIN lookup and NHTSA data
                        </p>
                      )}
                      
                      {/* Manual License Plate Input Section - Always Available */}
                      {!showManualPlateInput ? (
                        <div className="space-y-3">
                          {!vehicleReport.data && !vehicle.vinData && (
                            <Button 
                              onClick={handleGetVehicleReport}
                              disabled={vehicleReport.isLoading}
                              className="bg-brand-red-600 hover:bg-brand-red-700 text-white w-full"
                            >
                              {vehicleReport.isLoading ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Generating Report...
                                </>
                              ) : (
                                <>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Get Vehicle Report
                                </>
                              )}
                            </Button>
                          )}
                          <div className="text-center">
                            <Button 
                              variant="link"
                              size="sm"
                              onClick={() => setShowManualPlateInput(true)}
                              disabled={vehicleReport.isLoading}
                              className="text-xs text-blue-600 hover:text-blue-800 px-0"
                            >
                              {vehicle.vinData || vehicleReport.data ? 
                                "Update license plate & regenerate report" : 
                                "Got the license plate wrong? Enter it manually"
                              }
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border">
                          <h4 className="font-medium text-gray-900">
                            {vehicle.vinData || vehicleReport.data ? 
                              "Update License Plate" : 
                              "Enter License Plate Manually"
                            }
                          </h4>
                          <div className="space-y-3">
                            <Input
                              type="text"
                              placeholder="Enter license plate (e.g., ABC123)"
                              value={manualPlate}
                              onChange={(e) => setManualPlate(e.target.value.toUpperCase())}
                              className="text-center font-mono text-lg"
                              maxLength={10}
                            />
                            <div className="flex gap-2">
                              <Button 
                                onClick={handleGetVehicleReport}
                                disabled={vehicleReport.isLoading || !manualPlate.trim()}
                                className="flex-1 bg-brand-red-600 hover:bg-brand-red-700 text-white"
                              >
                                {vehicleReport.isLoading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <FileText className="h-4 w-4 mr-2" />
                                    {vehicle.vinData || vehicleReport.data ? "Update Report" : "Generate Report"}
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  setShowManualPlateInput(false);
                                  setManualPlate('');
                                }}
                                disabled={vehicleReport.isLoading}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {vehicleReport.error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {vehicleReport.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
                
                {/* Show Vehicle Report if data exists */}
                {(vehicleReport.data || vehicle.vinData) && (
                  <VehicleReport 
                    vinData={vehicle.vinData || vehicleReport.data?.vinData} 
                    listPrice={vehicle.product_price}
                  />
                )}
              </div>

              {/* Right Column - Details */}
              <div className="space-y-6">
                {/* Vehicle Tracking */}
                <VehicleTracking vehicle={vehicle} />
                
                {/* Basic Info */}
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-brand-red-600" />
                      Vehicle Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {((vehicle as any)["vehicle_info.make"] || vehicle.vehicle_info?.make) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Make</span>
                        <span className="font-medium">{(vehicle as any)["vehicle_info.make"] || vehicle.vehicle_info?.make}</span>
                      </div>
                    )}
                    {((vehicle as any)["vehicle_info.model"] || vehicle.vehicle_info?.model) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Model</span>
                        <span className="font-medium">{(vehicle as any)["vehicle_info.model"] || vehicle.vehicle_info?.model}</span>
                      </div>
                    )}
                    {((vehicle as any)["vehicle_info.year"] || vehicle.vehicle_info?.year) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Year</span>
                        <span className="font-medium">{(vehicle as any)["vehicle_info.year"] || vehicle.vehicle_info?.year}</span>
                      </div>
                    )}
                    {((vehicle as any)["vehicle_info.mileage"] || vehicle.vehicle_info?.mileage) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Gauge className="h-4 w-4" />
                          Mileage
                        </span>
                        <span className="font-medium">{formatMileage((vehicle as any)["vehicle_info.mileage"] || vehicle.vehicle_info?.mileage)}</span>
                      </div>
                    )}
                    {((vehicle as any)["vehicle_info.exterior_color"] || vehicle.vehicle_info?.exterior_color) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Palette className="h-4 w-4" />
                          Exterior
                        </span>
                        <span className="font-medium">{(vehicle as any)["vehicle_info.exterior_color"] || vehicle.vehicle_info?.exterior_color}</span>
                      </div>
                    )}
                    {((vehicle as any)["vehicle_info.transmission"] || vehicle.vehicle_info?.transmission) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transmission</span>
                        <span className="font-medium">{(vehicle as any)["vehicle_info.transmission"] || vehicle.vehicle_info?.transmission}</span>
                      </div>
                    )}
                    {((vehicle as any)["vehicle_info.fuel_type"] || vehicle.vehicle_info?.fuel_type) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Fuel Type</span>
                        <span className="font-medium">{(vehicle as any)["vehicle_info.fuel_type"] || vehicle.vehicle_info?.fuel_type}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Location & Time */}
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-brand-red-600" />
                      Location & Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {((vehicle as any)["publication_info.location"] || vehicle.publication_info?.location) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium">{(vehicle as any)["publication_info.location"] || vehicle.publication_info?.location}</span>
                      </div>
                    )}
                    {((vehicle as any)["publication_info.listing_time"] || vehicle.publication_info?.listing_time) && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Listed
                        </span>
                        <span className="font-medium">
                          {formatTimeAgo((vehicle as any)["publication_info.listing_time"] || vehicle.publication_info?.listing_time)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Seller Info */}
                {((vehicle as any)["publication_info.seller_name"] || vehicle.publication_info?.seller_name || (vehicle as any)["publication_info.seller_description"] || vehicle.publication_info?.seller_description) && (
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-brand-red-600" />
                        Seller Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {((vehicle as any)["publication_info.seller_name"] || vehicle.publication_info?.seller_name) && (
                        <div>
                          <span className="text-gray-600 block text-sm">Seller Name</span>
                          <span className="font-medium">{(vehicle as any)["publication_info.seller_name"] || vehicle.publication_info?.seller_name}</span>
                        </div>
                      )}
                      {((vehicle as any)["publication_info.seller_description"] || vehicle.publication_info?.seller_description) && (
                        <div>
                          <span className="text-gray-600 block text-sm">Description</span>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {(vehicle as any)["publication_info.seller_description"] || vehicle.publication_info?.seller_description}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    asChild
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  >
                    <Link 
                      href={marketplaceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DataSourceIcon dataSourceInfo={dataSourceInfo} className="h-4 w-4 mr-2" />
                      {buttonText}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>

                  <Button 
                    variant="outline"
                    className="w-full h-12 text-lg font-medium border-2 hover:bg-gray-50 transition-all duration-300"
                    onClick={handleGetVehicleReport}
                    disabled={vehicleReport.isLoading}
                  >
                    {vehicleReport.isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : vehicle.vinData || vehicleReport.data ? (
                      <>
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                        Report Generated
                      </>
                    ) : (
                      <>
                        <FileText className="h-5 w-5 mr-2" />
                        Get Vehicle Report
                      </>
                    )}
                  </Button>
                </div>

                {/* Price Summary */}
                {vehicle.product_price && vehicle.product_price > 0 && (
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-brand-red-50 to-white border-brand-red-200">
                    <CardContent className="p-6 text-center">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Asking Price</p>
                        <p className="text-3xl font-bold text-brand-red-600">
                          {formatPrice(vehicle.product_price)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Image Gallery Modal */}
          <ImageGalleryModal
            images={images}
            isOpen={isGalleryOpen}
            onClose={() => setIsGalleryOpen(false)}
            initialIndex={selectedImageIndex}
            title={vehicle.product_title}
          />
        </div>
      </SubscriptionGuard>
    </ProtectedRoute>
  );
}