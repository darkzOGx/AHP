'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Edit3, Save, X, Loader2 } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .refine((value) => isValidPhoneNumber(value), {
      message: 'Please enter a valid phone number with country code'
    }),
});

export function PhoneNumberSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (values: z.infer<typeof phoneSchema>) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { phoneNumber: values.phoneNumber });
      
      toast({ 
        title: 'Success', 
        description: 'Phone number updated successfully!' 
      });
      
      setIsEditing(false);
      
      // Force a page refresh to update the auth context
      // In a production app, you'd want to update the auth context directly
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: 'Failed to update phone number. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset({ phoneNumber: user?.phoneNumber || '' });
    setIsEditing(false);
  };

  return (
    <Card className="relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center rounded-lg">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-3 shadow-2xl">
            <Loader2 className="h-10 w-10 text-black animate-spin" />
            <p className="text-base font-semibold text-black">Saving changes...</p>
          </div>
        </div>
      )}

      <CardHeader>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-black" />
          <CardTitle className="text-black">Phone Number</CardTitle>
        </div>
        <CardDescription className="text-black">
          Update your phone number to receive SMS alerts when vehicles matching your criteria are found.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black font-medium">Current phone number:</p>
              <p className="font-semibold text-black">
                {user?.phoneNumber || 'No phone number set'}
              </p>
              {!user?.phoneNumber && (
                <p className="text-xs text-black mt-1">
                  Add a phone number to enable SMS alerts
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="border-2 border-black text-black hover:bg-black hover:text-white"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {user?.phoneNumber ? 'Edit' : 'Add Phone'}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-semibold">Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="US"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        className="phone-input-custom"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-black">
                      Select your country and enter your phone number
                    </p>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  size="sm"
                  className="border-2 border-black text-black hover:bg-black hover:text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}