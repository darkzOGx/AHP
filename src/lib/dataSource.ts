export type DataSource = 'facebook' | 'craigslist' | 'offerup';

export interface DataSourceInfo {
  name: string;
  displayName: string;
  color: string;
  bgColor: string;
  iconName: string; // Lucide React icon name
}

export const DATA_SOURCE_INFO: Record<DataSource, DataSourceInfo> = {
  facebook: {
    name: 'facebook',
    displayName: 'Facebook Marketplace',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    iconName: 'Users' // Facebook-like social icon
  },
  craigslist: {
    name: 'craigslist',
    displayName: 'Craigslist',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    iconName: 'FileText' // Document/listing icon
  },
  offerup: {
    name: 'offerup',
    displayName: 'OfferUp',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    iconName: 'ShoppingCart' // Shopping/marketplace icon
  }
};

export function getDataSource(vehicle: any): DataSource {
  // Check if vehicle has explicit dataSource property
  if (vehicle.dataSource && DATA_SOURCE_INFO[vehicle.dataSource as DataSource]) {
    return vehicle.dataSource as DataSource;
  }

  // Fall back to URL-based detection for existing data
  const url = vehicle["publication_info.publication_link"] || 
             vehicle.publication_info?.publication_link ||
             '';

  if (url.includes('craigslist.org')) {
    return 'craigslist';
  }
  
  if (url.includes('offerup.com')) {
    return 'offerup';
  }

  // Default to facebook (backward compatibility)
  return 'facebook';
}

export function getDataSourceInfo(vehicle: any): DataSourceInfo {
  const dataSource = getDataSource(vehicle);
  return DATA_SOURCE_INFO[dataSource];
}

export function getDataSourceButtonText(dataSource: DataSource): string {
  switch (dataSource) {
    case 'facebook':
      return 'See on Facebook';
    case 'craigslist':
      return 'See on Craigslist';
    case 'offerup':
      return 'See on OfferUp';
    default:
      return 'View Listing';
  }
}

export function getDataSourceUrl(vehicle: any): string {
  const dataSource = getDataSource(vehicle);
  const url = vehicle["publication_info.publication_link"] || 
             vehicle.publication_info?.publication_link;

  if (url) {
    return url;
  }

  // Generate fallback URLs based on data source
  const vehicleId = vehicle.objectID;
  switch (dataSource) {
    case 'facebook':
      return `https://www.facebook.com/marketplace/item/${vehicleId}`;
    case 'craigslist':
      return `https://craigslist.org/${vehicleId}`;
    case 'offerup':
      return `https://offerup.com/item/detail/${vehicleId}`;
    default:
      return '#';
  }
}