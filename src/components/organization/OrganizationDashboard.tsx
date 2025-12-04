'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Building2,
  Crown,
  Shield,
  User
} from 'lucide-react';

export default function OrganizationDashboard() {
  const { organization, userRole, loading } = useOrganization();
  const { user } = useAuth();

  if (loading || !organization) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization dashboard...</p>
        </div>
      </div>
    );
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          icon: Crown,
          label: 'Organization Owner',
          description: 'Full administrative control',
          color: 'text-purple-600 bg-purple-50 border-purple-200'
        };
      case 'admin':
        return {
          icon: Shield,
          label: 'Administrator',
          description: 'User & settings management',
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      case 'member':
        return {
          icon: User,
          label: 'Team Member',
          description: 'Standard access',
          color: 'text-green-600 bg-green-50 border-green-200'
        };
      default:
        return {
          icon: User,
          label: 'Unknown',
          description: '',
          color: 'text-gray-600 bg-gray-50 border-gray-200'
        };
    }
  };

  const roleInfo = getRoleInfo(userRole || '');
  const RoleIcon = roleInfo.icon;

  // Apply organization branding
  const primaryColor = organization.branding?.primaryColor || '#EF4444';
  const secondaryColor = organization.branding?.secondaryColor || '#64748B';
  
  const brandedCardStyle = {
    borderTopColor: primaryColor,
    borderTopWidth: '4px'
  };

  const brandedTextStyle = {
    color: primaryColor
  };

  return (
    <div className="space-y-8">
      {/* Organization Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 border-2 rounded-2xl p-8" 
           style={{borderColor: primaryColor + '20'}}>
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {organization.branding?.logo ? (
                <img 
                  src={organization.branding.logo} 
                  alt={`${organization.name} logo`}
                  className="w-16 h-16 object-contain rounded-xl border-2"
                  style={{borderColor: primaryColor + '30'}}
                />
              ) : (
                <div 
                  className="w-16 h-16 rounded-xl border-2 flex items-center justify-center"
                  style={{borderColor: primaryColor + '30', backgroundColor: primaryColor + '10'}}
                >
                  <Building2 className="w-8 h-8" style={{color: primaryColor}} />
                </div>
              )}
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to {organization.name}
                </h1>
                <p className="text-gray-600 text-lg">
                  Your enterprise vehicle hunting dashboard
                </p>
              </div>
            </div>

            {/* User Role Card */}
            <Card className={`${roleInfo.color} border-2`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RoleIcon className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">{roleInfo.label}</div>
                    <div className="text-sm opacity-75">{roleInfo.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" 
               style={{backgroundColor: primaryColor}}></div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden" style={brandedCardStyle}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={brandedTextStyle}>
              {organization.settings.maxUsers + organization.settings.additionalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              {organization.settings.additionalUsers > 0 
                ? `${organization.settings.maxUsers} base + ${organization.settings.additionalUsers} additional`
                : `${organization.settings.maxUsers} users included`
              }
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden" style={brandedCardStyle}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={brandedTextStyle}>
              ∞
            </div>
            <p className="text-xs text-muted-foreground">
              Unlimited alerts available
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden" style={brandedCardStyle}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plan Status
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={brandedTextStyle}>
              Enterprise
            </div>
            <p className="text-xs text-muted-foreground">
              Full access to all features
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Permission Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Your Access Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Role:</span>
              <Badge className={roleInfo.color}>
                <RoleIcon className="w-3 h-3 mr-1" />
                {roleInfo.label}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <span className="font-medium">Permissions:</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {userRole === 'owner' && (
                  <>
                    <div className="flex items-center text-green-600">✓ Full Organization Control</div>
                    <div className="flex items-center text-green-600">✓ Billing Management</div>
                    <div className="flex items-center text-green-600">✓ User Management</div>
                    <div className="flex items-center text-green-600">✓ Settings Control</div>
                    <div className="flex items-center text-green-600">✓ Branding Control</div>
                    <div className="flex items-center text-green-600">✓ All Features</div>
                  </>
                )}
                
                {userRole === 'admin' && (
                  <>
                    <div className="flex items-center text-green-600">✓ User Management</div>
                    <div className="flex items-center text-green-600">✓ Settings Control</div>
                    <div className="flex items-center text-green-600">✓ Branding Control</div>
                    <div className="flex items-center text-green-600">✓ Alert Management</div>
                    <div className="flex items-center text-orange-500">◗ View Billing</div>
                    <div className="flex items-center text-red-500">✗ Billing Changes</div>
                  </>
                )}
                
                {userRole === 'member' && (
                  <>
                    <div className="flex items-center text-green-600">✓ Create Alerts</div>
                    <div className="flex items-center text-green-600">✓ View Dashboard</div>
                    <div className="flex items-center text-green-600">✓ Profile Settings</div>
                    <div className="flex items-center text-red-500">✗ User Management</div>
                    <div className="flex items-center text-red-500">✗ Organization Settings</div>
                    <div className="flex items-center text-red-500">✗ Billing Access</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Basic Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{organization.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <Badge style={{backgroundColor: primaryColor + '20', color: primaryColor}}>
                    Enterprise
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {organization.createdAt.toDate().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Branding</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Logo:</span>
                  <span className="font-medium">
                    {organization.branding?.logo ? '✓ Custom' : '⚪ Default'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Theme:</span>
                  <span className="font-medium capitalize">
                    {organization.branding?.theme || 'Light'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Colors:</span>
                  <div className="flex gap-1">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{backgroundColor: primaryColor}}
                      title={`Primary: ${primaryColor}`}
                    ></div>
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{backgroundColor: secondaryColor}}
                      title={`Secondary: ${secondaryColor}`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}