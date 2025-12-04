import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AlgoliaSearch from "@/components/AlgoliaSearch";
import { Building, Sparkles } from "lucide-react";

export default function DealershipVehiclesPage() {
  return (
    <ProtectedRoute>
      <div className="w-full space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3 md:space-y-4 py-6 md:py-8 px-4">
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4">
            <Building className="h-6 w-6 md:h-8 md:w-8 text-brand-gray-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Dealership Vehicles
            </h1>
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-brand-gray-400" />
          </div>
          <p className="text-base md:text-lg text-brand-gray-300 max-w-2xl mx-auto px-4">
            Browse our curated selection of vehicles from verified dealerships.
            Find your perfect match with professional warranties and dealership support.
          </p>
        </div>
        
        {/* Search Interface */}
        <AlgoliaSearch index="vehicles_dealership" />
      </div>
    </ProtectedRoute>
  );
}
