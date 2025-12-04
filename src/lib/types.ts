import type { User as FirebaseUser } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  firstName?: string | null;
  lastName?: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  organizationId?: string;
  organizationRole?: 'owner' | 'admin' | 'member';
  alertPreferences?: {
    email: boolean;
    sms: boolean;
    disableAll: boolean;
  };
  subscription?: {
    status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'incomplete' | 'incomplete_expired';
    plan?: 'lite' | 'dealer' | 'enterprise';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Timestamp;
    trialEnd?: Timestamp;
    cancelAtPeriodEnd?: boolean;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  };
  personalizations?: {
    dashboardLayout?: any;
    alertPreferences?: any;
    theme?: string;
  };
}

export type AppUser = FirebaseUser & UserProfile;

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  plan: 'enterprise';
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  branding?: {
    logo?: string; // URL to uploaded logo
    primaryColor?: string; // Hex color for primary brand color
    secondaryColor?: string; // Hex color for secondary brand color
    theme?: 'light' | 'dark' | 'auto';
    customDomain?: string; // Optional custom subdomain
    favicon?: string; // URL to custom favicon
  };
  settings: {
    maxUsers: number;
    additionalUsers: number;
    billingAddress?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member';
  permissions: string[];
  invitedBy: string;
  joinedAt: Timestamp;
  personalizations?: {
    dashboardLayout?: any;
    alertPreferences?: any;
    theme?: string;
  };
}

export interface Invitation {
  id: string;
  organizationId: string;
  email: string;
  role: 'admin' | 'member';
  invitedBy: string;
  token: string;
  status: 'pending' | 'accepted' | 'expired';
  expiresAt: Timestamp;
  createdAt: Timestamp;
}

export type OrganizationRole = 'owner' | 'admin' | 'member';

export const ORGANIZATION_PERMISSIONS = {
  owner: ['*'],
  admin: [
    'invite_users',
    'manage_users',
    'view_billing',
    'manage_alerts',
    'view_analytics',
    'export_data',
    'manage_settings'
  ],
  member: [
    'create_alerts',
    'view_alerts',
    'manage_own_profile',
    'view_dashboard'
  ]
} as const;

export interface Watchlist {
  id?: string;
  userId: string;
  organizationId?: string;
  userEmail?: string;
  product_title: string;
  manufacturer?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  minYear?: number;
  maxYear?: number;
  transmission?: string;
  exterior_color?: string;
  interior_color?: string;
  location?: string;
  keywords?: string[];
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  isActive?: boolean;
  name?: string;
  zipCode?: string;
  radiusMiles?: number;
  latitude?: number;
  longitude?: number;
}

export type VehicleStatus = 'messaged_owner' | 'purchase_in_progress';

export interface UserVehicleInteraction {
  id?: string;
  userId: string;
  vehicleId: string;
  status?: VehicleStatus;
  note?: string;
  vehicleData?: {
    title?: string;
    price?: number;
    location?: string;
    imageUrl?: string;
    url?: string;
    year?: number;
    make?: string;
    model?: string;
    mileage?: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VehicleAlert {
  id?: string;
  userId: string;
  vehicleId: string;
  watchlistId: string;
  message: string;
  vehicleData: any;
  timestamp: Timestamp;
}
