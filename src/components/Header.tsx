'use client';

import Link from "next/link";
import Image from "next/image";
import { Menu, List, BarChart3, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useOrganization } from "@/contexts/OrganizationContext";
import { UserNav } from "./UserNav";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Header() {
  const { user } = useAuth();
  const { isSubscribed } = useSubscription();
  const { organization, hasPermission } = useOrganization();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 md:h-20 items-center px-4">
        <Link href="/dashboard" className="flex items-center mr-4 md:mr-8">
          <Image
            src="/logo.png"
            alt="AutohunterPro Logo"
            width={767}
            height={135}
            className="h-8 w-auto md:h-12 object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
          {!isSubscribed && (
            <>
              <Link
                href="/why"
                className="transition-colors hover:text-brand-red-600 whitespace-nowrap text-gray-700"
              >
                Why
              </Link>
              <Link
                href="/pricing"
                className="transition-colors hover:text-brand-red-600 whitespace-nowrap text-gray-700"
              >
                Pricing
              </Link>
              <Link
                href="/signup"
                className="transition-colors hover:text-brand-red-600 whitespace-nowrap text-gray-700"
              >
                Join Now
              </Link>
            </>
          )}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-brand-red-50 hover:text-brand-red-600 font-semibold text-gray-700"
          >
            <List className="h-4 w-4" />
            Listings
          </Link>
          {user && (
            <>
              <Link
                href="/analytics"
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-brand-red-50 hover:text-brand-red-600 font-semibold text-gray-700"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Link>
              {organization && hasPermission('manage_users') && (
                <Link
                  href="/organization/members"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-brand-red-50 hover:text-brand-red-600 font-semibold text-gray-700"
                >
                  <Users className="h-4 w-4" />
                  Team
                </Link>
              )}
              <Link
                href="/create-alert"
                className="transition-colors hover:text-brand-red-600 whitespace-nowrap text-gray-700"
              >
                Create Alert
              </Link>
              <Link
                href="/my-alerts"
                className="transition-colors hover:text-brand-red-600 whitespace-nowrap text-gray-700"
              >
                My Alerts
              </Link>
            </>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <UserNav />
          
          {/* Mobile Nav */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 sm:w-80 px-6 bg-white border-gray-200">
                <Link href="/" className="flex items-center mb-8 pt-2">
                  <Image
                    src="/logo.png"
                    alt="AutohunterPro Logo"
                    width={767}
                    height={135}
                    className="h-10 w-auto object-contain"
                  />
                </Link>
                <nav className="flex flex-col gap-4 text-base font-medium">
                  {!isSubscribed && (
                    <>
                      <Link
                        href="/why"
                        className="transition-colors hover:text-brand-red-600 p-4 rounded-lg hover:bg-brand-red-50 text-gray-700"
                      >
                        Why
                      </Link>
                      <Link
                        href="/pricing"
                        className="transition-colors hover:text-brand-red-600 p-4 rounded-lg hover:bg-brand-red-50 text-gray-700"
                      >
                        Pricing
                      </Link>
                      <Link
                        href="/signup"
                        className="transition-colors hover:text-brand-red-600 p-4 rounded-lg hover:bg-brand-red-50 text-gray-700"
                      >
                        Join Now
                      </Link>
                    </>
                  )}
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 p-4 rounded-xl transition-all hover:bg-brand-red-50 hover:text-brand-red-600 font-semibold border-2 border-transparent hover:border-brand-red-600 text-gray-700"
                  >
                    <List className="h-5 w-5" />
                    Listings
                  </Link>
                  {user && (
                    <>
                      <Link
                        href="/analytics"
                        className="flex items-center gap-3 p-4 rounded-xl transition-all hover:bg-brand-red-50 hover:text-brand-red-600 font-semibold border-2 border-transparent hover:border-brand-red-600 text-gray-700"
                      >
                        <BarChart3 className="h-5 w-5" />
                        Analytics
                      </Link>
                      {organization && hasPermission('manage_users') && (
                        <Link
                          href="/organization/members"
                          className="flex items-center gap-3 p-4 rounded-xl transition-all hover:bg-brand-red-50 hover:text-brand-red-600 font-semibold border-2 border-transparent hover:border-brand-red-600 text-gray-700"
                        >
                          <Users className="h-5 w-5" />
                          Team
                        </Link>
                      )}
                      <Link
                        href="/create-alert"
                        className="transition-colors hover:text-brand-red-600 p-4 rounded-lg hover:bg-brand-red-50 text-gray-700"
                      >
                        Create Alert
                      </Link>
                      <Link
                        href="/my-alerts"
                        className="transition-colors hover:text-brand-red-600 p-4 rounded-lg hover:bg-brand-red-50 text-gray-700"
                      >
                        My Alerts
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
