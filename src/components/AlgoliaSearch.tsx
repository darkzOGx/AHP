"use client";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  useSearchBox,
  useInfiniteHits,
  Highlight,
  Configure,
  SortBy,
} from "react-instantsearch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Search,
  Car,
  Palette,
  MapPin,
  CircleDollarSign,
  Loader2,
  Navigation,
  AlertCircle,
  Gauge,
  ToggleLeft,
  ToggleRight,
  Calendar,
  DollarSign,
  Filter,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Alert, AlertDescription } from "./ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { ImageGalleryModal } from "./ImageGalleryModal";
import { DATA_SOURCE_INFO, DataSource } from "@/lib/dataSource";

// Initialize Typesense InstantSearch adapter using environment variables
const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY || "",
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || "",
        port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || "443"),
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "https",
      },
    ],
  },
  additionalSearchParameters: {
    query_by:
      "product_title,publication_info.vehicle_company,publication_info.vehicle_model",
  },
});

const searchClient = typesenseAdapter.searchClient;

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function LocationFilter({
  userLocation,
  radius,
  onRadiusChange,
  onLocationRequest,
  locationEnabled,
  onLocationToggle,
}: {
  userLocation: {
    latitude: number | null;
    longitude: number | null;
    loading: boolean;
    error: string | null;
  };
  radius: number;
  onRadiusChange: (radius: number) => void;
  onLocationRequest: () => void;
  locationEnabled: boolean;
  onLocationToggle: (enabled: boolean) => void;
}) {
  return (
    <Card className="p-4 md:p-6 mb-6 md:mb-8 border-2 mx-4 md:mx-0">
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-1">
              Location Filter
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Find vehicles near you
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onLocationToggle(!locationEnabled)}
              className="flex items-center gap-2 text-xs md:text-sm font-medium transition-colors hover:text-primary"
            >
              {locationEnabled ? (
                <>
                  <ToggleRight className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <span className="text-primary">On</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                  <span className="text-gray-600">Off</span>
                </>
              )}
            </button>
            {locationEnabled &&
              !userLocation.latitude &&
              !userLocation.loading && (
                <Button
                  onClick={onLocationRequest}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 rounded-full text-xs md:text-sm px-3 py-2 flex-shrink-0"
                >
                  <Navigation className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Enable Location</span>
                  <span className="sm:hidden">Location</span>
                </Button>
              )}
          </div>
        </div>

        {locationEnabled && userLocation.loading && (
          <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600 bg-gray-100 p-2 md:p-3 rounded-lg">
            <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
            <span>Getting your location...</span>
          </div>
        )}

        {locationEnabled && userLocation.error && (
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
            <AlertDescription className="text-xs md:text-sm">
              {userLocation.error}
            </AlertDescription>
          </Alert>
        )}

        {!locationEnabled && (
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 bg-gray-100 p-2 md:p-3 rounded-lg border-2 border-dashed border-gray-200">
            <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
            <span>
              Location filtering is disabled. All vehicles are shown regardless
              of distance.
            </span>
          </div>
        )}

        {locationEnabled && userLocation.latitude && userLocation.longitude && (
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 text-xs md:text-sm bg-primary/5 p-2 md:p-3 rounded-lg">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary flex-shrink-0" />
              <span className="font-medium">Location detected</span>
              <span className="text-gray-600 ml-auto font-mono text-xs hidden sm:inline">
                {userLocation.latitude.toFixed(3)},{" "}
                {userLocation.longitude.toFixed(3)}
              </span>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs md:text-sm font-medium">
                  Search radius
                </Label>
                <span className="text-xs md:text-sm font-bold text-primary">
                  {radius} miles
                </span>
              </div>
              <Slider
                value={[radius]}
                onValueChange={(value) => onRadiusChange(value[0])}
                max={2000}
                min={0}
                step={25}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Exact location</span>
                <span>Nationwide</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function DataSourceFilter({
  selectedDataSources,
  onDataSourceChange,
}: {
  selectedDataSources: DataSource[];
  onDataSourceChange: (dataSources: DataSource[]) => void;
}) {
  const toggleDataSource = (dataSource: DataSource) => {
    if (selectedDataSources.includes(dataSource)) {
      onDataSourceChange(selectedDataSources.filter(ds => ds !== dataSource));
    } else {
      onDataSourceChange([...selectedDataSources, dataSource]);
    }
  };

  return (
    <div className="px-4 md:px-0 mb-4">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span className="font-medium">Sources:</span>
        <div className="flex gap-2">
          {Object.entries(DATA_SOURCE_INFO).map(([key, info]) => {
            const dataSource = key as DataSource;
            const isSelected = selectedDataSources.includes(dataSource);

            return (
              <button
                key={dataSource}
                onClick={() => toggleDataSource(dataSource)}
                className={`px-2 py-1 rounded text-xs transition-colors ${isSelected
                    ? 'bg-gray-100 text-gray-900 border border-gray-300'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {info.displayName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PriceAndDateFilters({
  priceRange,
  onPriceRangeChange,
  indexName,
}: {
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  indexName: string;
}) {
  return (
    <Card className="p-4 md:p-6 mb-6 md:mb-8 border-2 mx-4 md:mx-0">
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          <h3 className="text-base md:text-lg font-semibold">
            Price & Sorting
          </h3>
        </div>

        {/* Date Sorting */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <Label className="text-xs md:text-sm font-medium">
              Sort by Date
            </Label>
          </div>
          <SortBy
            items={[
              { label: "Most Relevant", value: indexName },
              {
                label: "Newest First",
                value: `${indexName}/sort/publication_info.listing_time:desc`,
              },
              {
                label: "Oldest First",
                value: `${indexName}/sort/publication_info.listing_time:asc`,
              },
            ]}
            classNames={{
              root: "w-full",
              select:
                "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            }}
          />
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <Label className="text-xs md:text-sm font-medium">
              Price Range
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-gray-600">Min Price</Label>
              <Input
                type="number"
                placeholder="0"
                value={priceRange.min || ""}
                onChange={(e) =>
                  onPriceRangeChange({
                    ...priceRange,
                    min: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-600">Max Price</Label>
              <Input
                type="number"
                placeholder="No limit"
                value={priceRange.max || ""}
                onChange={(e) =>
                  onPriceRangeChange({
                    ...priceRange,
                    max: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-1"
              />
            </div>
          </div>

          {/* Quick Price Presets */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1"
              onClick={() => onPriceRangeChange({ min: 0, max: 10000 })}
            >
              Under $10k
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1"
              onClick={() => onPriceRangeChange({ min: 10000, max: 25000 })}
            >
              $10k-25k
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1"
              onClick={() => onPriceRangeChange({ min: 25000, max: 50000 })}
            >
              $25k-50k
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-3 py-1"
              onClick={() => onPriceRangeChange({ min: 50000, max: 0 })}
            >
              $50k+
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-3 py-1"
              onClick={() => onPriceRangeChange({ min: 0, max: 0 })}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function CustomSearchBox(props: any) {
  const { query, refine } = useSearchBox(props);

  return (
    <div className="sticky top-14 md:top-16 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 pb-4 md:pb-6 mb-6 md:mb-8">
      <div className="relative max-w-2xl mx-auto px-4">
        <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => refine(e.currentTarget.value)}
          placeholder="Search by make, model, year..."
          className="pl-10 md:pl-12 pr-10 md:pr-4 text-base md:text-lg py-4 md:py-7 rounded-xl md:rounded-2xl shadow-lg border-2 focus:shadow-xl transition-all duration-300 bg-white"
        />
        {query && (
          <button
            onClick={() => refine("")}
            className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-lg"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function Hit({
  hit,
  userLocation,
  searchState,
}: {
  hit: any;
  userLocation?: { lat: number; lng: number };
  searchState: {
    query: string;
    radius: number;
    selectedDataSources: DataSource[];
    priceRange: [number, number];
    yearRange: [number, number];
    maxMileage: number;
    locationEnabled: boolean;
  };
}) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const price = hit.product_price || hit.publication_info?.product_price;
  const formattedPrice =
    price > 0
      ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      : "Price not listed";
  const images =
    hit && hit.images && hit.images.length > 0
      ? hit.images
      : ["https://placehold.co/600x400.png"];
  // Extract publication ID from Facebook marketplace URL
  const extractPublicationIdFromUrl = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/\/item\/(\d+)\/?/);
    return match ? match[1] : null;
  };

  const publicationLink = hit["publication_info.publication_link"] || hit.publication_info?.publication_link;
  const extractedId = publicationLink ? extractPublicationIdFromUrl(publicationLink) : null;

  const publicationId = extractedId ||
    hit["publication_info.publication_id"] ||
    hit.publication_info?.publication_id ||
    hit.objectID;

  const marketplaceLink =
    hit["publication_info.publication_link"] ||
    hit.publication_info?.publication_link ||
    `https://www.facebook.com/marketplace/item/${publicationId}`;

  const mileage = hit["vehicle_info.mileage"] || hit.vehicle_info?.mileage;
  const formattedMileage = mileage
    ? new Intl.NumberFormat("en-US").format(mileage) + " mi"
    : "Mileage N/A";

  const cityName =
    hit["publication_info.location"] ||
    hit.publication_info?.location ||
    "Location not specified";

  const distance =
    userLocation && hit._geoloc
      ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        hit._geoloc.lat,
        hit._geoloc.lng
      )
      : null;

  // Calculate time ago from listing_time
  const getTimeAgo = () => {
    // Typesense flattens nested fields with dot notation
    const listingTime =
      hit["publication_info.listing_time"] ||
      hit.publication_info?.listing_time;
    if (!listingTime) return null;

    const now = Date.now();
    const diffMs = now - listingTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;

    // For older listings, show the actual date
    const date = new Date(listingTime);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const timeAgo = getTimeAgo();

  return (
    <Card className="relative group flex flex-col h-full overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 rounded-xl md:rounded-2xl border-2 hover:border-primary/20 bg-white cursor-pointer">
      <Link href={buildVehicleUrl(publicationId, searchState)}>
        <CardHeader className="p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img: string, index: number) => (
                <CarouselItem key={index}>
                  <div className="relative h-44 sm:h-48 md:h-52 lg:h-60 w-full">
                    <img
                      src={img.includes('storage.googleapis.com') ? `/api/proxy-image?url=${encodeURIComponent(img)}` : img}
                      alt={hit.product_title}
                      className="object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                      data-ai-hint="vehicle car"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.log("Image failed to load:", img);
                        e.currentTarget.src =
                          "https://placehold.co/600x400/png?text=Vehicle+Image";
                      }}
                    />
                    {price > 0 && (
                      <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/95 backdrop-blur px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold">
                        {formattedPrice}
                      </div>
                    )}
                    {distance && (
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-primary/90 text-primary-foreground px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                        {distance.toFixed(1)} mi
                      </div>
                    )}
                    {timeAgo && (
                      <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 bg-black/70 text-white px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium">
                        {timeAgo}
                      </div>
                    )}
                    {images.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImageIndex(index);
                          setIsGalleryOpen(true);
                        }}
                        className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/80 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-medium shadow-lg backdrop-blur-sm opacity-90 hover:opacity-100 transition-opacity z-20"
                      >
                        📸 Click for more pics
                      </button>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious
                  className="absolute left-2 md:left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 md:h-10 md:w-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
                <CarouselNext
                  className="absolute right-2 md:right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 md:h-10 md:w-10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </>
            )}
          </Carousel>
        </CardHeader>
      </Link>

      <Link href={buildVehicleUrl(publicationId, searchState)}>
        <CardContent className="p-3 md:p-5 flex-grow">
          <CardTitle className="text-lg md:text-xl font-bold leading-tight mb-2 md:mb-3 font-headline">
            <div className="hover:text-primary transition-colors line-clamp-2">
              <Highlight attribute="product_title" hit={hit} />
            </div>
          </CardTitle>
          <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <div className="flex items-center gap-1 md:gap-2 text-gray-700 min-w-0">
                <Gauge className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0 text-primary" />
                <span className="truncate font-medium text-xs md:text-sm">
                  {formattedMileage}
                </span>
              </div>

            </div>
            <div className="grid grid-cols-1 gap-2 md:gap-3">
              <div className="flex items-center gap-1 md:gap-2 text-gray-700 min-w-0">
                <Palette className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate text-xs md:text-sm">
                  {hit.vehicle_info?.exterior_color || "Various"}
                </span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-gray-700 min-w-0">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="truncate text-xs md:text-sm">
                  {cityName}
                  {distance && (
                    <span className="text-primary font-medium ml-1 hidden sm:inline">
                      ({distance.toFixed(1)} mi)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>

      <ImageGalleryModal
        images={images}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={selectedImageIndex}
        title={hit.product_title}
      />
    </Card>
  );
}

// Helper function to build vehicle URL with search state
function buildVehicleUrl(
  vehicleId: string,
  searchState: {
    query: string;
    radius: number;
    selectedDataSources: DataSource[];
    priceRange: [number, number];
    yearRange: [number, number];
    maxMileage: number;
    locationEnabled: boolean;
  }
): string {
  const params = new URLSearchParams();

  if (searchState.query) {
    params.set('q', searchState.query);
  }

  if (searchState.locationEnabled) {
    params.set('radius', searchState.radius.toString());
    params.set('locationEnabled', 'true');
  }

  if (searchState.selectedDataSources.length > 0) {
    params.set('dataSources', searchState.selectedDataSources.join(','));
  }

  const [minPrice, maxPrice] = searchState.priceRange;
  if (minPrice > 0 || maxPrice < 500000) {
    params.set('minPrice', minPrice.toString());
    params.set('maxPrice', maxPrice.toString());
  }

  const [minYear, maxYear] = searchState.yearRange;
  const currentYear = new Date().getFullYear();
  if (minYear > 1990 || maxYear < currentYear) {
    params.set('minYear', minYear.toString());
    params.set('maxYear', maxYear.toString());
  }

  if (searchState.maxMileage < 200000) {
    params.set('maxMileage', searchState.maxMileage.toString());
  }

  const queryString = params.toString();
  return `/vehicle/${vehicleId}${queryString ? `?${queryString}` : ''}`;
}

function CustomInfiniteHits({
  userLocation,
  searchState,
  ...props
}: {
  userLocation: { lat: number; lng: number } | null;
  searchState: {
    query: string;
    radius: number;
    selectedDataSources: DataSource[];
    priceRange: [number, number];
    yearRange: [number, number];
    maxMileage: number;
    locationEnabled: boolean;
  };
  [key: string]: any;
}) {
  const { hits, isLastPage, showMore, results } = useInfiniteHits(props);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Filter out duplicates by objectID
  const uniqueHits = useMemo(() => {
    const seen = new Set();
    return hits.filter((hit: any) => {
      if (seen.has(hit.objectID)) {
        return false;
      }
      seen.add(hit.objectID);
      return true;
    });
  }, [hits]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLastPage) {
        showMore();
      }
    },
    [isLastPage, showMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  if (results && results.nbHits === 0) {
    return (
      <p className="text-center text-gray-600 mt-8">
        No results found. Try a different search.
      </p>
    );
  }

  return (
    <div className="w-full">
      {results && results.nbHits > 0 && (
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">
            Found{" "}
            <span className="font-semibold text-gray-900">
              {results.nbHits.toLocaleString()}
            </span>{" "}
            vehicles
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {uniqueHits.map((hit) => (
          <Hit key={hit.objectID} hit={hit} userLocation={userLocation || undefined} searchState={searchState} />
        ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center mt-12">
        {!isLastPage && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <Button
              onClick={showMore}
              variant="outline"
              className="px-8 rounded-full"
            >
              Load More Vehicles
            </Button>
          </div>
        )}
      </div>

      {isLastPage && uniqueHits.length > 0 && (
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-600">
            You've seen all available vehicles
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Try adjusting your search or location filters for more results
          </p>
        </div>
      )}
    </div>
  );
}

function YearFilter({
  yearRange,
  onYearRangeChange
}: {
  yearRange: { min: number; max: number };
  onYearRangeChange: (range: { min: number; max: number }) => void;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-red-600" />
          Year Range
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minYear" className="text-sm font-medium text-gray-700 mb-2 block">
              Min Year
            </Label>
            <Input
              id="minYear"
              type="number"
              min={1980}
              max={currentYear}
              value={yearRange.min}
              onChange={(e) => onYearRangeChange({
                ...yearRange,
                min: Math.max(1980, Math.min(parseInt(e.target.value) || 1980, yearRange.max))
              })}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="maxYear" className="text-sm font-medium text-gray-700 mb-2 block">
              Max Year
            </Label>
            <Input
              id="maxYear"
              type="number"
              min={yearRange.min}
              max={currentYear}
              value={yearRange.max}
              onChange={(e) => onYearRangeChange({
                ...yearRange,
                max: Math.min(currentYear, Math.max(parseInt(e.target.value) || currentYear, yearRange.min))
              })}
              className="w-full"
            />
          </div>
        </div>
        <div className="text-sm text-gray-600 text-center">
          {yearRange.min === 1990 && yearRange.max === currentYear
            ? "All years"
            : `${yearRange.min} - ${yearRange.max}`
          }
        </div>
      </div>
    </Card>
  );
}

function MileageFilter({
  maxMileage,
  onMaxMileageChange
}: {
  maxMileage: number;
  onMaxMileageChange: (mileage: number) => void;
}) {
  const formatMileage = (mileage: number) => {
    if (mileage >= 200000) return "200k+ miles";
    if (mileage >= 1000) return `${Math.round(mileage / 1000)}k miles`;
    return `${mileage} miles`;
  };

  return (
    <Card className="p-4 md:p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Gauge className="w-5 h-5 text-brand-red-600" />
          Max Mileage
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        <div className="px-2">
          <Slider
            value={[maxMileage]}
            onValueChange={([value]) => onMaxMileageChange(value)}
            max={200000}
            min={0}
            step={5000}
            className="w-full"
          />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">
            {formatMileage(maxMileage)}
          </div>
          <div className="text-sm text-gray-600">
            {maxMileage >= 200000 ? "Any mileage" : "Maximum mileage"}
          </div>
        </div>
      </div>
    </Card>
  );
}

function SearchStateProvider({
  userLocation,
  radius,
  selectedDataSources,
  priceRange,
  yearRange,
  maxMileage,
  locationEnabled
}: {
  userLocation: { lat: number; lng: number } | null;
  radius: number;
  selectedDataSources: DataSource[];
  priceRange: [number, number];
  yearRange: [number, number];
  maxMileage: number;
  locationEnabled: boolean;
}) {
  const { query } = useSearchBox();

  const searchState = {
    query,
    radius,
    selectedDataSources,
    priceRange,
    yearRange,
    maxMileage,
    locationEnabled
  };

  return <CustomInfiniteHits userLocation={userLocation || null} searchState={searchState} />;
}

export default function AlgoliaSearch(props: any) {
  const { index } = props;
  const geolocation = useGeolocation();
  const searchParams = useSearchParams();

  // Initialize state from URL parameters if available
  const [radius, setRadius] = useState(() => {
    const paramRadius = searchParams.get('radius');
    return paramRadius ? parseInt(paramRadius) : 50;
  });

  const [locationEnabled, setLocationEnabled] = useState(() => {
    return searchParams.get('locationEnabled') === 'true';
  });

  const [priceRange, setPriceRange] = useState(() => {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    return {
      min: minPrice ? parseInt(minPrice) : 0,
      max: maxPrice ? parseInt(maxPrice) : 0
    };
  });

  const [selectedDataSources, setSelectedDataSources] = useState<DataSource[]>(() => {
    const paramSources = searchParams.get('dataSources');
    if (paramSources) {
      return paramSources.split(',') as DataSource[];
    }
    return Object.keys(DATA_SOURCE_INFO) as DataSource[]; // Default to all sources selected
  });

  const currentYear = new Date().getFullYear();
  const [yearRange, setYearRange] = useState(() => {
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    return {
      min: minYear ? parseInt(minYear) : 1990,
      max: maxYear ? parseInt(maxYear) : currentYear
    };
  });

  const [maxMileage, setMaxMileage] = useState(() => {
    const paramMileage = searchParams.get('maxMileage');
    return paramMileage ? parseInt(paramMileage) : 200000;
  });

  const handleLocationToggle = useCallback(
    (enabled: boolean) => {
      setLocationEnabled(enabled);
      if (enabled && !geolocation.latitude && !geolocation.longitude) {
        geolocation.requestLocation();
      }
    },
    [geolocation]
  );

  const buildFilters = useCallback(() => {
    let filters = [];

    // Typesense geolocation filter syntax: location:(lat, lon, radius km)
    if (
      locationEnabled &&
      geolocation.latitude &&
      geolocation.longitude &&
      radius > 0
    ) {
      const radiusKm = radius * 1.60934; // Convert miles to km
      const geoFilter = `location:(${geolocation.latitude}, ${geolocation.longitude}, ${radiusKm} km)`;
      filters.push(geoFilter);
    }

    // Data source filter
    // Data source filter
    /* 
    if (selectedDataSources.length > 0 && selectedDataSources.length < Object.keys(DATA_SOURCE_INFO).length) {
      // Only add filter if not all sources are selected (optimization)
      const dataSourceFilters = selectedDataSources.map(source => `dataSource:=${source}`);
      // For documents without dataSource field (legacy Facebook data), include them when Facebook is selected
      if (selectedDataSources.includes('facebook')) {
        dataSourceFilters.push('dataSource:=""'); // Empty string for documents without dataSource field
      }
      const combinedDataSourceFilter = `(${dataSourceFilters.join(' || ')})`;
      filters.push(combinedDataSourceFilter);
    }
    */

    if (priceRange.min > 0 || priceRange.max > 0) {
      let priceFilter = "";
      if (priceRange.min > 0 && priceRange.max > 0) {
        priceFilter = `product_price:>=${priceRange.min} && product_price:<=${priceRange.max}`;
      } else if (priceRange.min > 0) {
        priceFilter = `product_price:>=${priceRange.min}`;
      } else if (priceRange.max > 0) {
        priceFilter = `product_price:<=${priceRange.max}`;
      }
      if (priceFilter) filters.push(priceFilter);
    }

    // Year filter
    const currentYear = new Date().getFullYear();
    if (yearRange.min > 1990 || yearRange.max < currentYear) {
      let yearFilter = "";
      if (yearRange.min > 1990 && yearRange.max < currentYear) {
        yearFilter = `publication_info.vehicle_year:>=${yearRange.min} && publication_info.vehicle_year:<=${yearRange.max}`;
      } else if (yearRange.min > 1990) {
        yearFilter = `publication_info.vehicle_year:>=${yearRange.min}`;
      } else if (yearRange.max < currentYear) {
        yearFilter = `publication_info.vehicle_year:<=${yearRange.max}`;
      }
      if (yearFilter) filters.push(yearFilter);
    }

    // Mileage filter
    if (maxMileage < 200000) {
      filters.push(`vehicle_info.mileage:<=${maxMileage}`);
    }

    const filterString = filters.join(" && ");
    console.log("🔍 Typesense filters applied:", filterString);
    return filterString;
  }, [
    geolocation.latitude,
    geolocation.longitude,
    radius,
    locationEnabled,
    priceRange,
    selectedDataSources,
    yearRange,
    maxMileage,
  ]);

  const userLocation =
    locationEnabled && geolocation.latitude && geolocation.longitude
      ? {
        lat: geolocation.latitude,
        lng: geolocation.longitude,
      }
      : undefined;

  return (
    <div className="w-full">
      <InstantSearch
        searchClient={searchClient}
        indexName={index}
        future={{ preserveSharedStateOnUnmount: true }}
        initialUiState={{
          [index]: {
            query: searchParams.get('q') || ''
          }
        }}
      >
        <Configure filters={buildFilters()} hitsPerPage={20} />
        <CustomSearchBox />
        <LocationFilter
          userLocation={geolocation}
          radius={radius}
          onRadiusChange={setRadius}
          onLocationRequest={geolocation.requestLocation}
          locationEnabled={locationEnabled}
          onLocationToggle={handleLocationToggle}
        />
        <DataSourceFilter
          selectedDataSources={selectedDataSources}
          onDataSourceChange={setSelectedDataSources}
        />
        <PriceAndDateFilters
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          indexName={index}
        />
        <YearFilter
          yearRange={yearRange}
          onYearRangeChange={setYearRange}
        />
        <MileageFilter
          maxMileage={maxMileage}
          onMaxMileageChange={setMaxMileage}
        />
        <SearchStateProvider
          userLocation={userLocation}
          radius={radius}
          selectedDataSources={selectedDataSources}
          priceRange={[priceRange.min, priceRange.max]}
          yearRange={[yearRange.min, yearRange.max]}
          maxMileage={maxMileage}
          locationEnabled={locationEnabled}
        />
      </InstantSearch>
    </div>
  );
}
