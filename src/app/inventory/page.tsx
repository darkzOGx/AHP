'use client';

import { useState } from 'react';
import { VehicleCard } from '@/components/VehicleCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for demonstration
const vehicles = [
  {
    id: '1',
    make: 'Mercedes-Benz',
    model: 'S-Class',
    year: 2023,
    price: 89999,
    mileage: 12000,
    location: 'Los Angeles, CA',
    fuelType: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    featured: true,
  },
  {
    id: '2',
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 67500,
    mileage: 18500,
    location: 'San Francisco, CA',
    fuelType: 'Diesel',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    featured: false,
  },
  {
    id: '3',
    make: 'Audi',
    model: 'A8',
    year: 2023,
    price: 79900,
    mileage: 8200,
    location: 'San Diego, CA',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    featured: true,
  },
  {
    id: '4',
    make: 'Porsche',
    model: '911',
    year: 2024,
    price: 124999,
    mileage: 3500,
    location: 'Beverly Hills, CA',
    fuelType: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop',
    featured: true,
  },
  {
    id: '5',
    make: 'Tesla',
    model: 'Model S',
    year: 2023,
    price: 74990,
    mileage: 15000,
    location: 'Palo Alto, CA',
    fuelType: 'Electric',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
    featured: false,
  },
  {
    id: '6',
    make: 'Lexus',
    model: 'LS 500',
    year: 2022,
    price: 68500,
    mileage: 22000,
    location: 'Sacramento, CA',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop',
    featured: false,
  },
];

export default function InventoryPage() {
  const [priceRange, setPriceRange] = useState([0, 150000]);
  const [mileageRange, setMileageRange] = useState([0, 100000]);

  return (
    <div className="bg-autohive-bg-light min-h-screen">
      {/* Hero Banner */}
      <section className="bg-white border-b border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-autohive-text-dark mb-4">
              Browse Our <span className="text-autohive-primary">Premium Inventory</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover unbeatable deals on luxury and performance vehicles from top brands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-gray-50 border-b border-gray-200 py-6 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Make */}
            <Select>
              <SelectTrigger className="bg-white border-gray-300 text-autohive-text-dark">
                <SelectValue placeholder="Make" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-autohive-text-dark">All Makes</SelectItem>
                <SelectItem value="mercedes" className="text-autohive-text-dark">Mercedes-Benz</SelectItem>
                <SelectItem value="bmw" className="text-autohive-text-dark">BMW</SelectItem>
                <SelectItem value="audi" className="text-autohive-text-dark">Audi</SelectItem>
                <SelectItem value="porsche" className="text-autohive-text-dark">Porsche</SelectItem>
                <SelectItem value="tesla" className="text-autohive-text-dark">Tesla</SelectItem>
                <SelectItem value="lexus" className="text-autohive-text-dark">Lexus</SelectItem>
              </SelectContent>
            </Select>

            {/* Body Type */}
            <Select>
              <SelectTrigger className="bg-white border-gray-300 text-autohive-text-dark">
                <SelectValue placeholder="Body Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-autohive-text-dark">All Types</SelectItem>
                <SelectItem value="sedan" className="text-autohive-text-dark">Sedan</SelectItem>
                <SelectItem value="suv" className="text-autohive-text-dark">SUV</SelectItem>
                <SelectItem value="coupe" className="text-autohive-text-dark">Coupe</SelectItem>
                <SelectItem value="convertible" className="text-autohive-text-dark">Convertible</SelectItem>
              </SelectContent>
            </Select>

            {/* Fuel Type */}
            <Select>
              <SelectTrigger className="bg-white border-gray-300 text-autohive-text-dark">
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-autohive-text-dark">All Fuel Types</SelectItem>
                <SelectItem value="gasoline" className="text-autohive-text-dark">Gasoline</SelectItem>
                <SelectItem value="diesel" className="text-autohive-text-dark">Diesel</SelectItem>
                <SelectItem value="electric" className="text-autohive-text-dark">Electric</SelectItem>
                <SelectItem value="hybrid" className="text-autohive-text-dark">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            {/* Year Range */}
            <Select>
              <SelectTrigger className="bg-white border-gray-300 text-autohive-text-dark">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all" className="text-autohive-text-dark">All Years</SelectItem>
                <SelectItem value="2024" className="text-autohive-text-dark">2024</SelectItem>
                <SelectItem value="2023" className="text-autohive-text-dark">2023</SelectItem>
                <SelectItem value="2022" className="text-autohive-text-dark">2022</SelectItem>
                <SelectItem value="2021" className="text-autohive-text-dark">2021</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select defaultValue="featured">
              <SelectTrigger className="bg-white border-gray-300 text-autohive-text-dark">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="featured" className="text-autohive-text-dark">Featured</SelectItem>
                <SelectItem value="price-low" className="text-autohive-text-dark">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="text-autohive-text-dark">Price: High to Low</SelectItem>
                <SelectItem value="year-new" className="text-autohive-text-dark">Year: Newest</SelectItem>
                <SelectItem value="mileage-low" className="text-autohive-text-dark">Mileage: Low to High</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button className="bg-gradient-to-r from-autohive-primary to-autohive-primary-light hover:opacity-90 text-white font-semibold">
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
          </div>

          {/* Price Range Slider */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-autohive-text-dark mb-2 block">
                Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </label>
              <Slider
                min={0}
                max={150000}
                step={5000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-autohive-text-dark mb-2 block">
                Mileage Range: {mileageRange[0].toLocaleString()} - {mileageRange[1].toLocaleString()} mi
              </label>
              <Slider
                min={0}
                max={100000}
                step={5000}
                value={mileageRange}
                onValueChange={setMileageRange}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="text-autohive-text-dark font-semibold">{vehicles.length}</span> vehicles
          </p>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <VehicleCard {...vehicle} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pagination */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-gray-300 text-autohive-text-dark hover:bg-gray-50"
            disabled
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="bg-autohive-primary text-white"
          >
            1
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-300 text-autohive-text-dark hover:bg-gray-50"
          >
            2
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-300 text-autohive-text-dark hover:bg-gray-50"
          >
            3
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-300 text-autohive-text-dark hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
