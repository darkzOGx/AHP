'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAlertLimits } from '@/hooks/useAlertLimits';
import { PhoneNumberModal } from './PhoneNumberModal';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Combobox } from '@/components/ui/combobox';
import { TOP_MANUFACTURERS, getModelsForManufacturer, VEHICLE_TYPES } from '@/lib/vehicle-models';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Lock } from 'lucide-react';
import { convertZipToCoordinates } from '@/lib/utils';

const currentYear = new Date().getFullYear();


// Helper function to get model options based on selected manufacturer
const getModelOptions = (selectedManufacturer: string) => {
  const baseOptions = [{ value: 'any', label: 'Any Model' }];

  if (!selectedManufacturer || selectedManufacturer === 'any') {
    // Show vehicle types when no manufacturer is selected
    return [
      ...baseOptions,
      ...VEHICLE_TYPES.map(type => ({
        value: type.toLowerCase(),
        label: type
      }))
    ];
  }

  // Find the proper manufacturer name (case-insensitive)
  const manufacturerName = TOP_MANUFACTURERS.find(
    m => m.toLowerCase() === selectedManufacturer.toLowerCase()
  );

  if (manufacturerName) {
    const models = getModelsForManufacturer(manufacturerName);
    return [
      ...baseOptions,
      ...models.map(model => ({
        value: model.toLowerCase(),
        label: model
      }))
    ];
  }

  return baseOptions;
};

// Prepare options for Combobox components
const manufacturerOptions = [
  { value: 'any', label: 'Any Manufacturer' },
  ...TOP_MANUFACTURERS.map(manufacturer => ({
    value: manufacturer.toLowerCase(),
    label: manufacturer
  }))
];

const alertFormSchema = z.object({
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  priceRange: z.array(z.number()).optional(),
  yearRange: z.array(z.number()).optional(),
  mileageRange: z.array(z.number()).optional(),
  zipCode: z.string().min(1, "Zip code is required"),
  radiusMiles: z.number().min(25, "Radius must be at least 25 miles"),
  name: z.string().min(1, "Alert name is required"),
  alertEmail: z.boolean().default(true),
  alertSms: z.boolean().default(false),
});
// s

export function CreateAlertForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentAlertCount, alertLimit, canCreateAlert, remainingAlerts, isAtLimit, isLitePlan } = useAlertLimits();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isGeocodingZip, setIsGeocodingZip] = useState(false);
  
  const [usePriceRange, setUsePriceRange] = useState(false);
  const [useYearRange, setUseYearRange] = useState(false);
  const [useMileageRange, setUseMileageRange] = useState(false);
  const [useRadiusFilter, setUseRadiusFilter] = useState(true);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');

  const form = useForm<z.infer<typeof alertFormSchema>>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      name: '',
      zipCode: '',
      radiusMiles: 100,
      alertEmail: user?.alertPreferences?.email ?? true,
      alertSms: user?.alertPreferences?.sms ?? false,
    },
  });

  const onSubmit = async (values: z.infer<typeof alertFormSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to create an alert.' });
      return;
    }

    // Check alert limit for Lite plan users
    if (!canCreateAlert) {
      toast({
        variant: 'destructive',
        title: 'Alert Limit Reached',
        description: `You've reached your limit of ${alertLimit} alerts. Upgrade to Dealer plan for unlimited alerts or delete an existing alert.`,
      });
      return;
    }

    // Location filtering is now mandatory, no need to validate other filters
    // The form schema already validates zipCode and radiusMiles as required

    if (values.alertSms && !user.phoneNumber) {
      setIsPhoneModalOpen(true);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const watchlistData: any = {
        userId: user.uid,
        userEmail: user.email || '',
        createdAt: serverTimestamp() as Timestamp,
        isActive: true,
      };

      // Add optional name field
      if (values.name?.trim()) {
        watchlistData.name = values.name.trim();
      }

      // Add manufacturer if specified
      if (values.manufacturer?.trim() && values.manufacturer !== 'any') {
        watchlistData.manufacturer = values.manufacturer.toLowerCase().trim();
      }

      // Add model if specified
      if (values.model?.trim() && values.model !== 'any') {
        watchlistData.model = values.model.toLowerCase().trim();
      }

      // Add price range if specified
      if (values.priceRange) {
        watchlistData.minPrice = values.priceRange[0];
        watchlistData.maxPrice = values.priceRange[1];
      }

      // Add year range if specified
      if (values.yearRange) {
        watchlistData.minYear = values.yearRange[0];
        watchlistData.maxYear = values.yearRange[1];
      }

      // Add mileage range if specified
      if (values.mileageRange) {
        watchlistData.minMileage = values.mileageRange[0];
        watchlistData.maxMileage = values.mileageRange[1];
      }

      // Add radius filter (now mandatory) and convert zip to coordinates
      watchlistData.zipCode = values.zipCode.trim();
      watchlistData.radiusMiles = values.radiusMiles;
      
      // Convert zip code to coordinates
      setIsGeocodingZip(true);
      const coordinates = await convertZipToCoordinates(values.zipCode.trim());
      setIsGeocodingZip(false);
      
      if (coordinates) {
        watchlistData.latitude = coordinates.lat;
        watchlistData.longitude = coordinates.lon;
      } else {
        toast({ 
          variant: 'destructive', 
          title: 'Invalid Zip Code', 
          description: 'Could not find coordinates for the provided zip code. Please check the zip code and try again.' 
        });
        setIsSubmitting(false);
        return;
      }
      
      await addDoc(collection(db, 'watchlist'), watchlistData);
      
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        alertPreferences: {
          email: values.alertEmail,
          sms: values.alertSms,
        }
      });
      
      toast({ title: 'Success!', description: 'Your alert has been created.' });
      form.reset();
      setUsePriceRange(false);
      setUseYearRange(false);
      setUseMileageRange(false);
      // Don't reset useRadiusFilter since location is now mandatory

    } catch (error) {
      console.error('Error creating alert:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create alert. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Alert Limit Warning */}
      {isLitePlan && (
        <div className="mb-6">
          {isAtLimit ? (
            <Alert className="border-red-200 bg-red-50">
              <Lock className="h-4 w-4" />
              <AlertDescription className="text-red-800">
                <strong>Alert limit reached!</strong> You're using {currentAlertCount}/{alertLimit} alerts on the Lite plan. 
                Delete an existing alert or <a href="/pricing" className="underline font-medium">upgrade to Dealer plan</a> for unlimited alerts.
              </AlertDescription>
            </Alert>
          ) : remainingAlerts !== null && remainingAlerts <= 1 ? (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-orange-800">
                <strong>Almost at your limit!</strong> You have {remainingAlerts} alert{remainingAlerts === 1 ? '' : 's'} remaining ({currentAlertCount}/{alertLimit} used). 
                <a href="/pricing" className="underline font-medium">Upgrade to Dealer plan</a> for unlimited alerts.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Lite plan: {currentAlertCount}/{alertLimit} alerts used. 
                <a href="/pricing" className="underline font-medium">Upgrade to Dealer plan</a> for unlimited alerts.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <PhoneNumberModal isOpen={isPhoneModalOpen} setIsOpen={setIsPhoneModalOpen} />
      
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alert Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Ford Trucks Under 20k" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 rounded-lg border p-4 bg-blue-50 border-blue-200">
            <div className="flex flex-col gap-2">
              <FormLabel className="text-blue-800">Location Filter (Required)</FormLabel>
              <p className="text-sm text-blue-700">All alerts must include location-based filtering to ensure relevant results.</p>
            </div>
            <div className="space-y-4">{/* Always show location fields since they're required */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 90210, 10001" 
                          {...field}
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="radiusMiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Search Radius: {field.value} miles</FormLabel>
                      <FormControl>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-black">25 miles</span>
                            <span className="text-black">500 miles</span>
                          </div>
                          <Slider
                            min={25}
                            max={500}
                            step={25}
                            value={field.value ? [field.value] : [100]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer (Optional)</FormLabel>
                <FormControl>
                  <Combobox
                    options={manufacturerOptions}
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedManufacturer(value || '');
                      // Reset model when manufacturer changes
                      form.setValue('model', '');
                    }}
                    placeholder="Select a manufacturer"
                    searchPlaceholder="Search manufacturers..."
                    emptyText="No manufacturer found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model (Optional)</FormLabel>
                <FormControl>
                  <Combobox
                    options={getModelOptions(selectedManufacturer)}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select a model"
                    searchPlaceholder="Search models..."
                    emptyText="No model found."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <FormLabel>Filter by Price Range</FormLabel>
              <Switch checked={usePriceRange} onCheckedChange={(c) => { setUsePriceRange(c); if(c) form.setValue('priceRange', [0, 50000]); else form.setValue('priceRange', undefined); }}/>
            </div>
            {usePriceRange && (
              <FormField control={form.control} name="priceRange" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-black">${field.value?.[0]?.toLocaleString()}</span>
                        <span className="text-black">${field.value?.[1]?.toLocaleString()}</span>
                      </div>
                      <Slider min={0} max={100000} step={1000} value={field.value} onValueChange={field.onChange} className="w-full"/>
                    </div>
                  </FormControl>
                </FormItem>
              )}/>
            )}
          </div>


          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <FormLabel>Filter by Year Range</FormLabel>
              <Switch checked={useYearRange} onCheckedChange={(c) => { setUseYearRange(c); if(c) form.setValue('yearRange', [1980, currentYear + 1]); else form.setValue('yearRange', undefined); }}/>
            </div>
            {useYearRange && (<FormField control={form.control} name="yearRange" render={({ field }) => (<FormItem><FormControl><div><div className="flex justify-between mb-2"><span className="text-black">{field.value?.[0]}</span><span className="text-black">{field.value?.[1]}</span></div><Slider min={1980} max={currentYear + 1} step={1} value={field.value} onValueChange={field.onChange} className="w-full"/></div></FormControl></FormItem>)}/>)}
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <FormLabel>Filter by Mileage Range</FormLabel>
              <Switch checked={useMileageRange} onCheckedChange={(c) => { setUseMileageRange(c); if(c) form.setValue('mileageRange', [0, 50000]); else form.setValue('mileageRange', undefined); }}/>
            </div>
            {useMileageRange && (<FormField control={form.control} name="mileageRange" render={({ field }) => (<FormItem><FormControl><div><div className="flex justify-between mb-2"><span className="text-black">{field.value?.[0].toLocaleString()} mi</span><span className="text-black">{field.value?.[1].toLocaleString()} mi</span></div><Slider min={0} max={300000} step={1000} value={field.value} onValueChange={field.onChange} className="w-full"/></div></FormControl></FormItem>)}/>)}
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            
            {/* Alert Destinations Display */}
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium text-black">Alert Destinations:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-black">Email:</span>
                  <span className="font-medium">{user?.email || 'Not available'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-black">SMS:</span>
                  <span className="font-medium">
                    {user?.phoneNumber ? user.phoneNumber : 'Not set - SMS alerts disabled'}
                  </span>
                </div>
              </div>
            </div>

            <FormField control={form.control} name="alertEmail" render={({ field }) => (<FormItem className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><FormLabel>Receive alerts via Email</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)}/>
            <FormField control={form.control} name="alertSms" render={({ field }) => (<FormItem className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><FormLabel>Receive alerts via SMS</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={!user?.phoneNumber} /></FormControl></FormItem>)}/>
            
            {!user?.phoneNumber && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-amber-600">📱</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-800">SMS alerts require a phone number</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Add your phone number in Settings to receive SMS notifications for your alerts.
                    </p>
                    <button
                      type="button"
                      onClick={() => window.location.href = '/settings'}
                      className="mt-2 text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded transition-colors"
                    >
                      Go to Settings →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting || isAtLimit || isGeocodingZip} className="w-full">
            {isAtLimit 
              ? 'Alert Limit Reached' 
              : isGeocodingZip
                ? 'Looking up zip code...'
                : isSubmitting 
                  ? 'Creating Alert...' 
                  : 'Create Alert'
            }
          </Button>
        </form>
      </Form>
    </>
  );
}
