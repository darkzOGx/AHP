'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AutohiveHeader() {
  return (
    <header className="w-full sticky top-0 z-50 shadow-sm">
      {/* Top Strip */}
      <div className="bg-autohive-top-strip py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <span className="text-autohive-text-secondary">
            Welcome! Proof of Quality is Only on AutoHunterPro
          </span>
          <div className="flex items-center gap-6 text-autohive-text-secondary">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>California, USA</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@autohunterpro.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white py-4 px-4 border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="AutoHunterPro - Intelligent AI Vehicle Sourcing"
              width={1200}
              height={300}
              priority
              className="object-contain"
              style={{ width: '320px', height: 'auto' }}
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-autohive-text-dark hover:text-autohive-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-autohive-primary transition-colors font-medium"
            >
              About Us
            </Link>
            <Link
              href="/inventory"
              className="text-gray-600 hover:text-autohive-primary transition-colors font-medium"
            >
              Inventory
            </Link>
            <Link
              href="/dealerships"
              className="text-gray-600 hover:text-autohive-primary transition-colors font-medium"
            >
              Dealerships
            </Link>
            <Link
              href="/service"
              className="text-gray-600 hover:text-autohive-primary transition-colors font-medium"
            >
              Service
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 hover:text-autohive-primary transition-colors font-medium"
            >
              Contact Us
            </Link>
          </div>

          {/* CTA Button */}
          <Button
            asChild
            className="bg-gradient-to-r from-autohive-primary to-autohive-primary-light hover:opacity-90 text-white font-semibold px-6 py-2 rounded-lg transition-all"
          >
            <Link href="/add-listing">
              Add Listing
            </Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
