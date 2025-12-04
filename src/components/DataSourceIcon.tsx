import { Users, FileText, ShoppingCart, LucideIcon } from 'lucide-react';
import { DataSourceInfo } from '@/lib/dataSource';

interface DataSourceIconProps {
  dataSourceInfo: DataSourceInfo;
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Users,
  FileText, 
  ShoppingCart,
};

export function DataSourceIcon({ dataSourceInfo, className = "h-4 w-4" }: DataSourceIconProps) {
  const IconComponent = iconMap[dataSourceInfo.iconName];
  
  if (!IconComponent) {
    return null;
  }
  
  return <IconComponent className={className} />;
}