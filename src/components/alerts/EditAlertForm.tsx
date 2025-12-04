'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { Watchlist } from '@/lib/types';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { TOP_MANUFACTURERS, getModelsForManufacturer, VEHICLE_TYPES } from '@/lib/vehicle-models';
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
  product_title: z.string().optional(),
  yearRange: z.array(z.number()).optional(),
  mileageRange: z.array(z.number()).optional(),
  zipCode: z.string().min(1, "Zip code is required"),
  radiusMiles: z.number().min(25, "Radius must be at least 25 miles"),
});


interface EditAlertFormProps {
  alert: Watchlist;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EditAlertForm({ alert, isOpen, setIsOpen }: EditAlertFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocodingZip, setIsGeocodingZip] = useState(false);
  
  const [useYearRange, setUseYearRange] = useState(!!alert.minYear || !!alert.maxYear);
  const [useMileageRange, setUseMileageRange] = useState(!!alert.minMileage || !!alert.maxMileage);
  // Location filter is now mandatory, so always true
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>(alert.manufacturer || '');

  const form = useForm<z.infer<typeof alertFormSchema>>({
    resolver: zodResolver(alertFormSchema),
  });

  useEffect(() => {
    if (alert) {
      const hasYear = !!alert.minYear || !!alert.maxYear;
      const hasMileage = !!alert.minMileage || !!alert.maxMileage;

      setUseYearRange(hasYear);
      setUseMileageRange(hasMileage);

      form.reset({
        manufacturer: alert.manufacturer || '',
        model: alert.model || '',
        product_title: alert.product_title || '',
        yearRange: hasYear ? [alert.minYear!, alert.maxYear!] : undefined,
        mileageRange: hasMileage ? [alert.minMileage!, alert.maxMileage!] : undefined,
        zipCode: alert.zipCode || '',
        radiusMiles: alert.radiusMiles || 100,
      });
    }
  }, [alert, form]);

  const onSubmit = async (values: z.infer<typeof alertFormSchema>) => {
    if (!user || !alert.id) return;
    
    setIsSubmitting(true);

    try {
      const watchlistRef = doc(db, 'users', user.uid, 'watchlist', alert.id);
      
      const watchlistData: any = {
        updatedAt: serverTimestamp(),
        manufacturer: values.manufacturer && values.manufacturer !== 'any' ? values.manufacturer.toLowerCase().trim() : null,
        model: values.model && values.model !== 'any' ? values.model.toLowerCase().trim() : null,
        product_title: values.product_title || null,
        minYear: values.yearRange ? values.yearRange[0] : null,
        maxYear: values.yearRange ? values.yearRange[1] : null,
        minMileage: values.mileageRange ? values.mileageRange[0] : null,
        maxMileage: values.mileageRange ? values.mileageRange[1] : null,
        zipCode: values.zipCode.trim(),
        radiusMiles: values.radiusMiles,
      };

      // Convert zip code to coordinates (now mandatory)
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
      
      await updateDoc(watchlistRef, watchlistData);
      
      toast({ title: 'Success!', description: 'Your alert has been updated.' });
      setIsOpen(false);

    } catch (error) {
      console.error('Error updating alert:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update alert. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Alert</DialogTitle>
          <DialogDescription>
            Make changes to your vehicle alert here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
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

            <FormField
              control={form.control}
              name="product_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name/Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Ford F-150 (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 rounded-lg border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><FormLabel>Filter by Year Range</FormLabel><Switch checked={useYearRange} onCheckedChange={(c) => { setUseYearRange(c); if(c) form.setValue('yearRange', [alert.minYear || 1980, alert.maxYear || currentYear + 1]); else form.setValue('yearRange', undefined, { shouldValidate: true }); }}/></div>
                {useYearRange && (<FormField control={form.control} name="yearRange" render={({ field }) => (<FormItem><FormControl><div><div className="flex justify-between mb-2"><span className="text-black">{field.value?.[0]}</span><span className="text-black">{field.value?.[1]}</span></div><Slider min={1980} max={currentYear + 1} step={1} value={field.value} onValueChange={field.onChange} className="w-full"/></div></FormControl></FormItem>)}/>)}
            </div>

            <div className="space-y-4 rounded-lg border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><FormLabel>Filter by Mileage Range</FormLabel><Switch checked={useMileageRange} onCheckedChange={(c) => { setUseMileageRange(c); if(c) form.setValue('mileageRange', [alert.minMileage || 0, alert.maxMileage || 50000]); else form.setValue('mileageRange', undefined, { shouldValidate: true }); }}/></div>
                {useMileageRange && (<FormField control={form.control} name="mileageRange" render={({ field }) => (<FormItem><FormControl><div><div className="flex justify-between mb-2"><span className="text-black">{field.value?.[0].toLocaleString()} mi</span><span className="text-black">{field.value?.[1].toLocaleString()} mi</span></div><Slider min={0} max={300000} step={1000} value={field.value} onValueChange={field.onChange} className="w-full"/></div></FormControl></FormItem>)}/>)}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting || isGeocodingZip}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isGeocodingZip}>
                {isGeocodingZip
                  ? 'Looking up zip code...'
                  : isSubmitting 
                    ? 'Saving...' 
                    : 'Save Changes'
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
