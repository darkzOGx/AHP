'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/hooks/useAuth';
import { PRICING_PLANS } from '@/lib/stripe';
import { CreditCard, Users, DollarSign, Calendar, AlertCircle, ExternalLink } from 'lucide-react';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { OrganizationMember } from '@/lib/types';
import { authenticatedPost } from '@/lib/api';

export default function OrganizationBillingPage() {
  const { organization, hasPermission, loading } = useOrganization();
  const { user } = useAuth();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const canViewBilling = hasPermission('view_billing');
  const isOwner = organization?.ownerId === user?.uid;

  useEffect(() => {
    if (!organization) return;

    fetchMembers();
  }, [organization]);

  const fetchMembers = async () => {
    if (!organization) return;

    const db = getFirestore();
    
    try {
      const membersQuery = query(
        collection(db, 'organizationMembers'),
        where('organizationId', '==', organization.id)
      );
      const membersSnapshot = await getDocs(membersQuery);
      const membersData = membersSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as OrganizationMember[];
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
    
    setLoadingMembers(false);
  };

  const calculateBilling = () => {
    const basePrice = PRICING_PLANS.ENTERPRISE.price;
    const basePlan = PRICING_PLANS.ENTERPRISE;
    const currentUsers = members.length;
    const additionalUsers = Math.max(0, currentUsers - basePlan.baseUsers);
    const additionalUsersCost = additionalUsers * basePlan.additionalUserPrice;
    const totalPrice = basePrice + additionalUsersCost;

    return {
      basePrice,
      basePlan,
      currentUsers,
      additionalUsers,
      additionalUsersCost,
      totalPrice
    };
  };

  const openCustomerPortal = async () => {
    if (!user) return;

    try {
      const response = await authenticatedPost('/api/create-portal-session', {
        userId: user.uid,
      });

      if (response.ok) {
        const { url } = await response.json();
        window.open(url, '_blank');
      } else {
        console.error('Failed to create portal session');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    }
  };

  if (loading || !organization) {
    return <div>Loading...</div>;
  }

  if (!canViewBilling) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to view billing information.</p>
        </div>
      </div>
    );
  }

  const billing = calculateBilling();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-gray-700" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
              <p className="text-gray-600 mt-1">
                Manage your organization's subscription and billing
              </p>
            </div>
          </div>

          {isOwner && (
            <Button onClick={openCustomerPortal}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Billing Portal
            </Button>
          )}
        </div>

        <div className="grid gap-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    Enterprise
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    Active
                  </Badge>
                </div>

                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${billing.totalPrice}
                  </div>
                  <p className="text-sm text-gray-600">Total Monthly Cost</p>
                </div>

                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {billing.currentUsers}
                  </div>
                  <p className="text-sm text-gray-600">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">Enterprise Base Plan</div>
                    <div className="text-sm text-gray-500">
                      Includes up to {billing.basePlan.baseUsers} users
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    ${billing.basePrice}/month
                  </div>
                </div>

                {billing.additionalUsers > 0 && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <div>
                      <div className="font-medium">Additional Users</div>
                      <div className="text-sm text-gray-500">
                        {billing.additionalUsers} users × ${billing.basePlan.additionalUserPrice}/month each
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      ${billing.additionalUsersCost}/month
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-t-2 border-gray-200">
                  <div className="text-lg font-bold">Total Monthly Cost</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${billing.totalPrice}/month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usage Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">User Count</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Included Users:</span>
                      <span className="font-medium">{billing.basePlan.baseUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Users:</span>
                      <span className="font-medium">{billing.additionalUsers}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total Active Users:</span>
                      <span className="font-bold">{billing.currentUsers}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Features Included</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Unlimited alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Multi-user organizations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Role-based access control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-1">
                        Automatic Billing Adjustments
                      </h3>
                      <p className="text-sm text-yellow-700">
                        When you add or remove team members, your bill will be automatically adjusted. 
                        New users are prorated for the current billing period, and removed users will 
                        receive credit on your next bill.
                      </p>
                    </div>
                  </div>
                </div>

                {isOwner && (
                  <div className="flex justify-center">
                    <Button onClick={openCustomerPortal} size="lg">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Payment Method & Invoices
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}