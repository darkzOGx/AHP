'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useVehicleInteraction } from '@/hooks/useVehicleInteraction';
import { VehicleStatus } from '@/lib/types';
import { 
  MessageCircle, 
  ShoppingCart, 
  StickyNote, 
  Save, 
  X,
  Check,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface VehicleStatusTrackerProps {
  vehicleId: string;
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
}

export default function VehicleStatusTracker({ vehicleId, vehicleData }: VehicleStatusTrackerProps) {
  const { 
    interaction, 
    loading, 
    saving, 
    saveInteraction, 
    updateStatus, 
    updateNote, 
    clearStatus 
  } = useVehicleInteraction(vehicleId);

  const [selectedStatus, setSelectedStatus] = useState<VehicleStatus | ''>('');
  const [note, setNote] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (interaction) {
      setSelectedStatus(interaction.status || '');
      setNote(interaction.note || '');
      setHasUnsavedChanges(false);
    }
  }, [interaction]);

  const handleStatusChange = async (newStatus: VehicleStatus | '') => {
    setSelectedStatus(newStatus);
    setHasUnsavedChanges(true);

    try {
      if (newStatus === '') {
        await clearStatus();
        toast.success('Status cleared');
      } else {
        await saveInteraction(newStatus, undefined, vehicleData);
        toast.success(`Status updated to "${getStatusLabel(newStatus)}"`);
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleNoteChange = (newNote: string) => {
    setNote(newNote);
    setHasUnsavedChanges(true);
  };

  const handleSaveNote = async () => {
    try {
      await saveInteraction(undefined, note, vehicleData);
      toast.success('Note saved');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const getStatusLabel = (status: VehicleStatus) => {
    switch (status) {
      case 'messaged_owner':
        return 'Messaged Owner';
      case 'purchase_in_progress':
        return 'Purchase in Progress';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case 'messaged_owner':
        return <MessageCircle className="w-4 h-4" />;
      case 'purchase_in_progress':
        return <ShoppingCart className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case 'messaged_owner':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'purchase_in_progress':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="w-5 h-5" />
          Vehicle Tracking
          {interaction && (
            <Badge variant="outline" className="ml-auto">
              <Clock className="w-3 h-3 mr-1" />
              Tracked
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Your Status for this Vehicle
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* No Status */}
            <Button
              variant={selectedStatus === '' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('')}
              disabled={saving}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <X className="w-5 h-5" />
              <span className="text-sm">No Status</span>
            </Button>

            {/* Messaged Owner */}
            <Button
              variant={selectedStatus === 'messaged_owner' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('messaged_owner')}
              disabled={saving}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">Messaged Owner</span>
            </Button>

            {/* Purchase in Progress */}
            <Button
              variant={selectedStatus === 'purchase_in_progress' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('purchase_in_progress')}
              disabled={saving}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-sm">Purchase in Progress</span>
            </Button>
          </div>

          {/* Current Status Display */}
          {selectedStatus && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Current status:</span>
              <Badge className={getStatusColor(selectedStatus)}>
                {getStatusIcon(selectedStatus)}
                <span className="ml-1">{getStatusLabel(selectedStatus)}</span>
              </Badge>
            </div>
          )}
        </div>

        {/* Note Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Personal Notes
          </label>
          
          <Textarea
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Add any personal notes about this vehicle..."
            className="min-h-[100px] resize-none"
          />

          {/* Save Note Button */}
          {hasUnsavedChanges && note !== (interaction?.note || '') && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSaveNote}
                disabled={saving}
                size="sm"
                className="flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    Save Note
                  </>
                )}
              </Button>
              
              <span className="text-xs text-gray-500">
                Unsaved changes
              </span>
            </div>
          )}

          {/* Auto-save indicator */}
          {!hasUnsavedChanges && (interaction?.note || interaction?.status) && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Check className="w-3 h-3" />
              <span>Auto-saved</span>
            </div>
          )}
        </div>

        {/* Tracking Summary */}
        {(interaction?.status || interaction?.note) && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                This vehicle is now being tracked
              </span>
            </div>
            <p className="text-xs text-blue-700">
              You can view all your tracked vehicles in the dashboard under "Tracked Vehicles"
            </p>
          </div>
        )}

        {/* Loading state overlay */}
        {saving && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Saving...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}