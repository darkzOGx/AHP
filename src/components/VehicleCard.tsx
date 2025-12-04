'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Gauge, Fuel, Calendar, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface VehicleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  location: string;
  fuelType: string;
  image: string;
  featured?: boolean;
}

export function VehicleCard({
  id,
  make,
  model,
  year,
  price,
  mileage,
  location,
  fuelType,
  image,
  featured = false,
}: VehicleCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white border-gray-200 hover:border-autohive-primary transition-all overflow-hidden group">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={image}
            alt={`${make} ${model}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {featured && (
            <Badge className="absolute top-4 left-4 bg-autohive-primary text-white">
              Featured
            </Badge>
          )}
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all">
            <Heart className="w-5 h-5 text-autohive-primary" />
          </button>
        </div>

        {/* Content */}
        <CardContent className="p-6">
          {/* Title */}
          <Link href={`/vehicle/${id}`}>
            <h3 className="text-xl font-bold text-autohive-text-dark mb-2 hover:text-autohive-primary transition-colors">
              {make} {model}
            </h3>
          </Link>

          {/* Price */}
          <p className="text-2xl font-bold text-autohive-primary mb-4">
            ${price.toLocaleString()}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{year}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Gauge className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{mileage.toLocaleString()} mi</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{fuelType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{location}</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            asChild
            className="w-full bg-gradient-to-r from-autohive-primary to-autohive-primary-light hover:opacity-90 text-white font-semibold"
          >
            <Link href={`/vehicle/${id}`}>
              View Details
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
