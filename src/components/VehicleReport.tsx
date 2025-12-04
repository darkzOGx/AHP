'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { 
  Car, 
  Shield, 
  Cog, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  MapPin,
  FileText,
  Settings,
  DollarSign
} from "lucide-react";

interface NHTSAData {
  Count: number;
  Message: string;
  Results: Array<{
    [key: string]: string;
  }>;
}

interface VinData {
  plate?: string;
  confidence?: number;
  vin?: string;
  nhtsaData?: NHTSAData;
  notes?: string[];
  retrievedAt?: string;
  state?: string;
  provider?: string;
  providerResponse?: any;
  marketCheckData?: {
    market_price?: number;
    market_price_source?: string;
    msrp?: number;
    inventory_type?: string;
    confidence_score?: number;
    data_points?: number;
    last_updated?: string;
  };
}

interface VehicleReportProps {
  vinData: VinData;
  listPrice?: number;
}

const VehicleReport: React.FC<VehicleReportProps> = ({ vinData, listPrice }) => {
  const [mounted, setMounted] = useState(false);
  const nhtsaResult = vinData.nhtsaData?.Results?.[0];
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!nhtsaResult) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-red-600" />
            Vehicle Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No NHTSA data available for this vehicle.</p>
        </CardContent>
      </Card>
    );
  }

  // Show loading state during hydration
  if (!mounted) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-red-600" />
            Vehicle Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Loading vehicle report data...</p>
        </CardContent>
      </Card>
    );
  }

  // Define priority fields in order of importance
  const priorityFields = ['VIN', 'ModelYear', 'Make', 'Trim'];
  
  // Get all data fields and create individual tabs for each non-empty field
  const allDataFields = Object.entries(nhtsaResult).filter(([key, value]) => 
    value && value !== '' && value !== 'Not Applicable'
  );

  // Separate priority fields and remaining fields
  const priorityData = priorityFields
    .map(field => allDataFields.find(([key]) => key === field))
    .filter(Boolean) as [string, string][];
  
  const remainingData = allDataFields.filter(([key]) => !priorityFields.includes(key));

  // Create tab data with proper formatting - priority fields first, then the rest
  const tabData = [...priorityData, ...remainingData].map(([key, value]) => ({
    key,
    displayName: key.replace(/([A-Z])/g, ' $1').trim(),
    value
  }));

  const formatFieldName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
  };

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header with basic VIN info */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-brand-red-600" />
            Vehicle Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vinData.plate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white rounded-lg border">
                <span className="text-sm font-medium text-gray-600">
                  License Plate {vinData.confidence === 100 ? '(Manually Entered)' : '(AI Detected)'}
                </span>
                <p className="font-mono text-xl font-bold text-gray-900">{vinData.plate}</p>
                {vinData.confidence && vinData.confidence !== 100 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {vinData.confidence}% Confidence
                    </Badge>
                  </div>
                )}
                {vinData.confidence === 100 && (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      User Input
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <span className="text-sm font-medium text-gray-600">VIN (Retrieved from API)</span>
                <p className="font-mono text-lg font-bold text-gray-900 break-all">{nhtsaResult.VIN}</p>
              </div>
            </div>
          )}
          
          {vinData.notes && vinData.notes.length > 0 && (
            <div className={`p-3 rounded-lg border ${
              vinData.notes.some(note => note.includes('overriding previous data')) 
                ? 'bg-blue-50 border-blue-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <span className={`text-sm font-medium ${
                vinData.notes.some(note => note.includes('overriding previous data'))
                  ? 'text-blue-800' 
                  : 'text-yellow-800'
              }`}>
                {vinData.notes.some(note => note.includes('overriding previous data')) 
                  ? 'Updated:' 
                  : 'Notes:'
                }
              </span>
              <ul className={`mt-1 text-sm space-y-1 ${
                vinData.notes.some(note => note.includes('overriding previous data'))
                  ? 'text-blue-700' 
                  : 'text-yellow-700'
              }`}>
                {vinData.notes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`mt-1 ${
                      vinData.notes.some(note => note.includes('overriding previous data'))
                        ? 'text-blue-600' 
                        : 'text-yellow-600'
                    }`}>•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MarketCheck Pricing Section */}
      {vinData.marketCheckData && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-brand-red-600" />
              Market Pricing Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Market Price */}
              {vinData.marketCheckData.market_price && (
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm font-medium text-gray-600 mb-1">Current Market Value</div>
                  <div className="text-3xl font-bold text-brand-red-600">
                    {formatPrice(vinData.marketCheckData.market_price)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <span>Source: {vinData.marketCheckData.market_price_source}</span>
                    {vinData.marketCheckData.confidence_score && (
                      <Badge variant="outline" className="text-xs">
                        {vinData.marketCheckData.confidence_score}% confidence
                      </Badge>
                    )}
                  </div>
                  {vinData.marketCheckData.data_points && (
                    <div className="text-xs text-gray-500 mt-1">
                      Based on {vinData.marketCheckData.data_points} data points
                    </div>
                  )}
                </div>
              )}

              {/* MSRP */}
              {vinData.marketCheckData.msrp && (
                <div className="p-4 bg-white rounded-lg border">
                  <div className="text-sm font-medium text-gray-600 mb-1">Original MSRP</div>
                  <div className="text-3xl font-bold text-gray-900">
                    {formatPrice(vinData.marketCheckData.msrp)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Manufacturer's Suggested Retail Price
                  </div>
                  {vinData.marketCheckData.inventory_type && (
                    <div className="text-xs text-gray-500 mt-1 capitalize">
                      {vinData.marketCheckData.inventory_type} vehicle
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Price Analysis */}
            {vinData.marketCheckData.market_price && listPrice && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-1">Price Analysis</div>
                <div className="text-sm text-blue-700">
                  Current vehicle has a list price of <span className="font-semibold">{formatPrice(listPrice)}</span> and the current market value according to MarketCheck is <span className="font-semibold">{formatPrice(vinData.marketCheckData.market_price)}</span>, a difference of <span className="font-semibold">{formatPrice(Math.abs(listPrice - vinData.marketCheckData.market_price))}</span>{listPrice < vinData.marketCheckData.market_price ? ' - with negotiation this could be your next flip!' : '.'}
                </div>
              </div>
            )}

            {/* Last Updated */}
            {vinData.marketCheckData.last_updated && mounted && (
              <div className="text-center text-sm text-gray-500 mt-4 pt-4 border-t">
                Pricing data updated on {new Date(vinData.marketCheckData.last_updated).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* NHTSA Data Table */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-brand-red-600" />
            Complete NHTSA Vehicle Data
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {tabData.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  {tabData.map((item, index) => (
                    <TableRow key={item.key} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <TableCell className="font-medium text-gray-700 py-3 px-6 border-r border-gray-200 w-1/3">
                        {formatFieldName(item.key)}
                      </TableCell>
                      <TableCell className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          {item.value === 'Standard' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          {item.value === 'Optional' && <Info className="h-4 w-4 text-blue-600" />}
                          {item.value && item.value.includes('Error') && <AlertTriangle className="h-4 w-4 text-red-600" />}
                          <span className={`font-medium ${
                            item.value === 'Standard' ? 'text-green-700' :
                            item.value === 'Optional' ? 'text-blue-700' :
                            item.value && item.value.includes('Error') ? 'text-red-700' :
                            'text-gray-900'
                          }`}>
                            {item.value}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-600">No NHTSA data fields available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional NHTSA Message */}
      {vinData.nhtsaData?.Message && (
        <Card className="shadow-lg border-0 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">NHTSA Information</p>             
                <p className="text-sm text-blue-700 mt-1">{vinData.nhtsaData.Message.substring(vinData.nhtsaData.Message.indexOf("NOTE"))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Retrieved timestamp - only show after hydration to prevent mismatch */}
      {mounted && vinData.retrievedAt && (
        <div className="text-center text-sm text-gray-500">
          Report generated on {new Date(vinData.retrievedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default VehicleReport;