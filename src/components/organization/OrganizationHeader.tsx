'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Building2, ChevronDown, Settings, Users, CreditCard, Palette } from 'lucide-react';
import Link from 'next/link';

export default function OrganizationHeader() {
  const { organization, userRole, loading } = useOrganization();

  if (loading || !organization) {
    return null;
  }

  const getRoleColor = (role: string) => {
    const baseColor = organization.branding?.primaryColor || '#6B7280';
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'member':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return '👑 Organization Owner';
      case 'admin':
        return '🛡️ Administrator';
      case 'member':
        return '👤 Team Member';
      default:
        return 'Unknown';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return '👑';
      case 'admin':
        return '🛡️';
      case 'member':
        return '👤';
      default:
        return '❓';
    }
  };

  const headerStyle = organization.branding?.primaryColor ? {
    borderBottomColor: organization.branding.primaryColor + '20',
    backgroundColor: organization.branding.primaryColor + '05'
  } : {};

  const logoStyle = organization.branding?.primaryColor ? {
    color: organization.branding.primaryColor
  } : {};

  return (
    <div className="bg-white border-b-2 px-4 py-4 shadow-sm" style={headerStyle}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          {/* Organization Logo & Name */}
          <div className="flex items-center space-x-3">
            {organization.branding?.logo ? (
              <img 
                src={organization.branding.logo} 
                alt={`${organization.name} logo`}
                className="w-8 h-8 object-contain rounded"
              />
            ) : (
              <Building2 className="w-8 h-8" style={logoStyle} />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{organization.name}</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                Enterprise Dashboard
              </p>
            </div>
          </div>

          {/* User Role Badge */}
          {userRole && (
            <div className="flex items-center space-x-2">
              <Badge className={`${getRoleColor(userRole)} font-medium px-3 py-1 border`}>
                <span className="mr-1">{getRoleIcon(userRole)}</span>
                {getRoleLabel(userRole)}
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {(userRole === 'owner' || userRole === 'admin') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Manage Organization
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/organization/members" className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Team Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/organization/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/organization/branding" className="flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Branding
                  </Link>
                </DropdownMenuItem>
                {userRole === 'owner' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/organization/billing" className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Billing & Subscription
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}