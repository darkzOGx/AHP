'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number with country code.' }),
});

interface PhoneNumberModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function PhoneNumberModal({ isOpen, setIsOpen }: PhoneNumberModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof phoneSchema>) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { phoneNumber: values.phoneNumber });
      toast({ title: 'Success', description: 'Phone number updated. You can now submit your alert.' });
      setIsOpen(false);
      // This is a bit of a hack to force re-render on the auth context
      // A better solution would be a dedicated function in the context to update the user
      // For now, this will require the user to re-submit the alert form.
      window.location.reload(); 
    } catch (error) {
      console.error('Error updating phone number:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update phone number.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Phone Number for SMS Alerts</DialogTitle>
          <DialogDescription>
            To receive SMS notifications, please provide your phone number including country code (e.g., +1 for US).
            <br />
            <span className="text-xs mt-2 block">
              By providing your number, you agree to our{' '}
              <Link href="/sms-consent" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                SMS consent policy
              </Link>.
            </span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Phone Number'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
