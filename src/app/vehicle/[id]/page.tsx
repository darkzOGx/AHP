import { Metadata } from 'next';
import VehicleDetailClient from './VehicleDetailClient';

// Generate dynamic metadata for vehicle pages
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const vehicleId = id;
  
  // You could fetch vehicle data here for more specific metadata
  // For now, we'll use a generic vehicle page metadata with the default OG image
  
  return {
    title: `Vehicle Details - ${vehicleId.slice(-6)} | AutohunterPro`,
    description: 'View detailed information about this vehicle including pricing, specifications, and market data.',
    openGraph: {
      title: `Vehicle Details | AutohunterPro`,
      description: 'View detailed information about this vehicle including pricing, specifications, and market data.',
      url: `https://www.autohunterpro.com/vehicle/${vehicleId}`,
      siteName: 'AutohunterPro',
      images: [
        {
          url: '/og.jpeg', // Using your default OG image
          width: 1200,
          height: 630,
          alt: 'AutohunterPro - Vehicle Details',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Vehicle Details | AutohunterPro`,
      description: 'View detailed information about this vehicle including pricing, specifications, and market data.',
      images: ['/og.jpeg'],
    },
  };
}

export default function Page() {
  return <VehicleDetailClient />;
}