'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { 
  addTrackedVehicle, 
  updateTrackedVehicle, 
  getTrackedVehicle,
  removeTrackedVehicle,
  TrackedVehicleData 
} from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';
import { 
  StickyNote, 
  MessageCircle, 
  ShoppingCart, 
  Car, 
  Save,
  Loader2,
  CheckCircle2,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface VehicleData {
  objectID: string;
  product_title: string;
  product_price?: number;
  images?: string[];
  publication_info?: {
    publication_link?: string;
    location?: string;
  };
}

// Remove local interface since we're importing from firebase.ts

interface VehicleTrackingProps {
  vehicle: VehicleData;
}

const STATUS_OPTIONS = [
  { value: 'tracked', label: 'Just Tracked', icon: Car, color: 'bg-gray-100 text-gray-800' },
  { value: 'messaged_owner', label: 'Messaged Owner', icon: MessageCircle, color: 'bg-blue-100 text-blue-800' },
  { value: 'purchase_in_progress', label: 'Purchase in Progress', icon: ShoppingCart, color: 'bg-green-100 text-green-800' },
];

export default function VehicleTracking({ vehicle }: VehicleTrackingProps) {
  const { user } = useAuth();
  const [trackedData, setTrackedData] = useState<TrackedVehicleData | null>(null);
  const [isTracked, setIsTracked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<string>('tracked');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // Load existing tracking data
  useEffect(() => {
    if (user && vehicle) {
      loadTrackingData();
    }
  }, [user, vehicle]);

  const loadTrackingData = async () => {
    try {
      setLoading(true);
      const data = await getTrackedVehicle(user!.uid, vehicle.objectID);
      if (data) {
        setTrackedData(data);
        setIsTracked(true);
        setNote(data.note || '');
        setStatus(data.status || 'tracked');
      } else {
        setIsTracked(false);
        setNote('');
        setStatus('tracked');
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!isTracked || saving || !user) return;
    
    try {
      setSaving(true);
      await updateTrackedVehicle(trackedData!.id!, {
        note: note.trim(),
        status: status as 'tracked' | 'messaged_owner' | 'purchase_in_progress'
      });
      setLastSaved(new Date());
      toast.success('Auto-saved', { duration: 1500 });
    } catch (error) {
      console.error('Auto-save error:', error);
      toast.error('Auto-save failed');
    } finally {
      setSaving(false);
    }
  }, [isTracked, saving, user, trackedData, note, status]);

  // Set up auto-save timer when note or status changes
  useEffect(() => {
    if (isTracked && (note !== (trackedData?.note || '') || status !== (trackedData?.status || 'tracked'))) {
      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set new timer for 2 seconds after user stops typing
      const timer = setTimeout(() => {
        autoSave();
      }, 2000);
      
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [note, status, isTracked, trackedData, autoSave]);

  const handleStartTracking = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const vehicleData = {
        title: vehicle.product_title,
        price: vehicle.product_price,
        imageUrl: vehicle.images?.[0],
        url: (vehicle as any)["publication_info.publication_link"] || vehicle.publication_info?.publication_link,
        location: (vehicle as any)["publication_info.location"] || vehicle.publication_info?.location,
      };

      console.log('🚗 Starting vehicle tracking:', {
        userId: user.uid,
        vehicleId: vehicle.objectID,
        vehicleData,
        status,
        note: note.trim()
      });

      const newTrackedVehicle = await addTrackedVehicle(
        user.uid,
        vehicle.objectID,
        vehicleData,
        status,
        note.trim()
      );

      console.log('✅ Vehicle tracking successful:', newTrackedVehicle);

      setTrackedData(newTrackedVehicle);
      setIsTracked(true);
      setLastSaved(new Date());
      toast.success('Vehicle tracking started!');
    } catch (error) {
      console.error('Error starting tracking:', error);
      toast.error('Failed to start tracking');
    } finally {
      setSaving(false);
    }
  };

  const handleStopTracking = async () => {
    if (!trackedData) return;

    try {
      setSaving(true);
      await removeTrackedVehicle(trackedData.id!);
      setTrackedData(null);
      setIsTracked(false);
      setNote('');
      setStatus('tracked');
      setLastSaved(null);
      toast.success('Stopped tracking vehicle');
    } catch (error) {
      console.error('Error stopping tracking:', error);
      toast.error('Failed to stop tracking');
    } finally {
      setSaving(false);
    }
  };

  const manualSave = async () => {
    if (!isTracked || !trackedData) return;
    
    try {
      setSaving(true);
      await updateTrackedVehicle(trackedData.id!, {
        note: note.trim(),
        status: status as 'tracked' | 'messaged_owner' | 'purchase_in_progress'
      });
      setLastSaved(new Date());
      toast.success('Saved successfully!');
    } catch (error) {
      console.error('Manual save error:', error);
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const getStatusInfo = (statusValue: string) => {
    return STATUS_OPTIONS.find(opt => opt.value === statusValue) || STATUS_OPTIONS[0];
  };

  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-brand-red-600" />
            Vehicle Tracking
          </CardTitle>
          {isTracked && (
            <div className="flex items-center gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              {!saving && lastSaved && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isTracked ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Track this vehicle to add notes and update status
            </p>
            <Button 
              onClick={handleStartTracking}
              disabled={saving}
              className="bg-brand-red-600 hover:bg-brand-red-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Tracking
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4" />
                      <span>{statusInfo.label}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge className={statusInfo.color} variant="outline">
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </Badge>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your notes about this vehicle..."
                className="min-h-[100px] resize-y"
              />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Auto-saves after 2 seconds of no typing</span>
                <span>{note.length} characters</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={manualSave}
                disabled={saving}
                size="sm"
                variant="outline"
                className="flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Now
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleStopTracking}
                disabled={saving}
                size="sm"
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            </div>

            {/* Tracking Info */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p>Started tracking: {trackedData?.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</p>
              {trackedData?.updatedAt && (
                <p>Last updated: {trackedData.updatedAt.toDate?.()?.toLocaleString() || 'Recently'}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}