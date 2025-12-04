"use client";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  useSearchBox,
  useInfiniteHits,
  Highlight,
  Configure,
} from "react-instantsearch";
import { Card, CardContent, CardHeader } from "./ui/card";
import Image from "next/image";
import { Input } from "./ui/input";
import { Search, DollarSign, MapPin, Gauge, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useRef, useCallback, useState, useMemo } from "react";

// Initialize Typesense InstantSearch adapter
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
    query_by:
      "product_title,publication_info.vehicle_company,publication_info.vehicle_model",
  },
});

const searchClient = typesenseAdapter.searchClient;

function PreviewSearchBox(props: any) {
  const { query, refine } = useSearchBox(props);

  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        value={query}
        onChange={(e) => refine(e.currentTarget.value)}
        placeholder="Try searching for 'Honda Accord' or 'BMW'"
        className="pl-12 pr-4 text-lg py-6 rounded-2xl shadow-lg border-2 focus:shadow-xl transition-all duration-300 bg-white"
      />
    </div>
  );
}

function PreviewVehicleCard({ hit }: { hit: any }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const price = hit.product_price || hit.publication_info?.product_price;
  const formattedPrice =
    price && price > 0
      ? `$${price.toLocaleString()}`
      : "Contact for Price";

  const images = hit.images || [];
  const publicationId = hit.objectID;
  const mileage = hit["vehicle_info.mileage"] || hit.vehicle_info?.mileage;
  const location = hit["publication_info.location"] || hit.publication_info?.location;
  const listingTime = hit["publication_info.listing_time"] || hit.publication_info?.listing_time;

  // Format mileage
  const formatMileage = (mileage: number) => {
    if (!mileage) return null;
    return mileage.toLocaleString();
  };

  // Calculate time ago
  const getTimeAgo = () => {
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

    const date = new Date(listingTime);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const timeAgo = getTimeAgo();
  const formattedMileage = formatMileage(mileage);

  return (
    <Card className="relative group flex flex-col h-full overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 rounded-xl border-2 hover:border-brand-red-200 bg-white">
      <CardHeader className="p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((img: string, index: number) => (
              <CarouselItem key={index}>
                <div className="relative h-48 w-full">
                  <img
                    src={img.includes('storage.googleapis.com') ? `/api/proxy-image?url=${encodeURIComponent(img)}` : img}
                    alt={`Vehicle image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image";
                    }}
                  />
                  {/* Price badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-brand-red-600" />
                      <span className="font-bold text-gray-900">{formattedPrice}</span>
                    </div>
                  </div>
                  {/* Time ago badge */}
                  {timeAgo && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeAgo}
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {images.length > 1 && (
            <>
              <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
              <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
            </>
          )}
        </Carousel>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="text-lg font-bold leading-tight mb-3 line-clamp-2">
          <Highlight attribute="product_title" hit={hit} />
        </div>
        
        <div className="space-y-2 mb-4 flex-grow">
          {/* <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>{hit.publication_info?.vehicle_company}</span>
              <span>•</span>
              <span>{hit.publication_info?.vehicle_model}</span>
              {hit.publication_info?.vehicle_year && (
                <>
                  <span>•</span>
                  <span>{hit.publication_info?.vehicle_year}</span>
                </>
              )}
            </div>
          </div> */}

          {/* Mileage and Location */}
          <div className="space-y-1.5">
            {formattedMileage && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Gauge className="h-4 w-4 text-gray-400" />
                <span>{formattedMileage} miles</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Get More Details Button */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full mt-auto border-brand-red-200 text-brand-red-600 hover:bg-brand-red-50 hover:border-brand-red-300 transition-colors"
        >
          <Link href="/signup">
            Get More Details
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function PreviewInfiniteHits({ ...props }) {
  const { hits, isLastPage, showMore, results } = useInfiniteHits(props);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter out duplicates by objectID
  const uniqueHits = useMemo(() => {
    const seen = new Set();
    return hits.filter((hit) => {
      if (seen.has(hit.objectID)) {
        return false;
      }
      seen.add(hit.objectID);
      return true;
    });
  }, [hits]);

  // Set vehicle limits based on device type
  const vehicleLimit = isMobile ? 5 : 12;

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLastPage && uniqueHits.length < vehicleLimit) {
        showMore();
      }
    },
    [isLastPage, showMore, uniqueHits.length, vehicleLimit]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (loadMoreRef.current && uniqueHits.length < vehicleLimit) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver, uniqueHits.length, vehicleLimit]);

  if (results && results.nbHits === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          No vehicles found. Try a different search.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Try searching for 'Honda Accord', 'BMW', or 'Toyota'
        </p>
      </div>
    );
  }

  // Limit vehicles based on device type (5 for mobile, 12 for desktop)
  const limitedHits = uniqueHits.slice(0, vehicleLimit);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {limitedHits.map((hit) => (
          <PreviewVehicleCard key={hit.objectID} hit={hit} />
        ))}
      </div>

      {limitedHits.length > 0 && (
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-brand-red-50 to-orange-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">LIVE DATA</span>
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              See More Vehicles & Get Instant Alerts
            </h4>
            <p className="text-gray-600 mb-4">
              {results?.nbHits 
                ? `Showing ${limitedHits.length} of ${results.nbHits.toLocaleString()}+ live vehicles` 
                : `${limitedHits.length} vehicles found`
              } Join thousands of dealers getting deals before the competition.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-red-600 hover:bg-brand-red-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Link href="/signup">
                  Start Free Trial - See All Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-brand-red-200 text-brand-red-600 hover:bg-brand-red-50 px-8 py-3 rounded-xl"
              >
                <Link href="/dashboard">
                  View Full Dashboard
                </Link>
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            ✓ 14-day free trial • ✓ Cancel anytime
          </div>
        </div>
      )}

      <div ref={loadMoreRef} className="h-4" />
    </div>
  );
}

export default function AlgoliaSearchPreview() {
  return (
    <div className="w-full">
      <InstantSearch
        searchClient={searchClient}
        indexName="vehicles"
        future={{ preserveSharedStateOnUnmount: true }}
        initialUiState={{
          vehicles: {
            query: ""
          }
        }}
      >
        <Configure hitsPerPage={20} />
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-600">LIVE VEHICLE DATA</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <PreviewSearchBox />
        <PreviewInfiniteHits />
      </InstantSearch>
    </div>
  );
}