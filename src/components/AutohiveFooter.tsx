'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function AutohiveFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="AutoHunterPro"
                width={800}
                height={200}
                className="object-contain"
                style={{ width: '280px', height: 'auto' }}
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              AI-powered vehicle sourcing and analytics that help dealers, wholesalers, and investors uncover undervalued listings in seconds.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-autohive-primary hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-autohive-primary hover:text-white transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-autohive-primary hover:text-white transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-autohive-primary hover:text-white transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-autohive-text-dark font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/dealerships" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  Dealerships
                </Link>
              </li>
              <li>
                <Link href="/service" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  Service
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-autohive-text-dark font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-600 hover:text-autohive-primary transition-colors text-sm">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-autohive-text-dark font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-autohive-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  123 Auto Street<br />
                  California, USA 90210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-autohive-primary flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-autohive-primary flex-shrink-0" />
                <span className="text-gray-600 text-sm">
                  info@autohunterpro.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 AutoHunterPro. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-autohive-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-autohive-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/copyright" className="text-gray-600 hover:text-autohive-primary transition-colors">
                Copyright
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
