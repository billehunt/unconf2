'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { logger } from '@/lib/logger';

const eventDetailsSchema = z.object({
  title: z.string()
    .min(3, 'Event title must be at least 3 characters')
    .max(100, 'Event title must be less than 100 characters'),
  date: z.string()
    .min(1, 'Event date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Event date must be today or in the future'),
  startTime: z.string()
    .min(1, 'Start time is required')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'),
  endTime: z.string()
    .min(1, 'End time is required')
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time format (HH:MM)'),
}).refine((data) => {
  if (data.date && data.startTime && data.endTime) {
    const startDateTime = new Date(`${data.date}T${data.startTime}`);
    const endDateTime = new Date(`${data.date}T${data.endTime}`);
    return endDateTime > startDateTime;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

type EventDetailsForm = z.infer<typeof eventDetailsSchema>;

interface EventDetailsStepProps {
  data: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  onDataChange: (data: EventDetailsStepProps['data']) => void;
  onNext: () => void;
  isLoading: boolean;
}

export function EventDetailsStep({ data, onDataChange, onNext, isLoading }: EventDetailsStepProps) {
  const form = useForm<EventDetailsForm>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: data,
    mode: 'onChange', // Validate on change for immediate feedback
  });

  const { register, handleSubmit, formState: { errors, isValid }, watch, trigger } = form;

  // Watch all form values for auto-saving
  const watchedValues = watch();

  // Trigger validation on mount to make the form valid with default values
  useEffect(() => {
    if (data.date && data.startTime && data.endTime) {
      trigger(); // Trigger validation for all fields
    }
  }, [data, trigger]);

  // Auto-save form data when values change (optimistic draft save)
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (watchedValues) {
        onDataChange(watchedValues);
        logger.debug('Auto-saved event details', {
          component: 'event-details-step',
          data: watchedValues,
        });
      }
    }, 500); // Debounce by 500ms

    return () => clearTimeout(debounceTimeout);
  }, [watchedValues, onDataChange]);

  const onSubmit = (formData: EventDetailsForm) => {
    logger.info('Event details form submitted', {
      component: 'event-details-step',
      data: formData,
    });
    onDataChange(formData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Event Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let&apos;s start with the basic information about your unconference event.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Event Title
          </Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="e.g., Tech Innovation Unconference 2024"
            className={errors.title ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Choose a clear, descriptive name that attendees will recognize.
          </p>
        </div>

        {/* Event Date */}
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Event Date
          </Label>
          <Input
            id="date"
            type="date"
            {...register('date')}
            min={new Date().toISOString().split('T')[0]}
            className={errors.date ? 'border-red-500' : ''}
            disabled={isLoading}
          />
          {errors.date && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Defaults to tomorrow - you can change this to any future date.
          </p>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Start Time
            </Label>
            <Input
              id="startTime"
              type="time"
              {...register('startTime')}
              className={errors.startTime ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.startTime && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.startTime.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime" className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              End Time
            </Label>
            <Input
              id="endTime"
              type="time"
              {...register('endTime')}
              className={errors.endTime ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.endTime && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.endTime.message}</p>
            )}
          </div>
        </div>

        {/* Quick Time Suggestions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            💡 Common unconference formats:
          </p>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <div>• Half-day morning: 9:00 AM - 1:00 PM</div>
            <div>• Half-day afternoon: 1:00 PM - 6:00 PM</div>
            <div>• Full day: 9:00 AM - 5:00 PM (default)</div>
            <div>• Evening session: 6:00 PM - 9:00 PM</div>
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          ✓ Changes are automatically saved as you type
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <div></div> {/* Spacer for step 1 */}
          <Button 
            type="submit" 
            disabled={!isValid || isLoading}
            className="flex items-center gap-2"
          >
            Continue to Rooms
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
            <div>Form valid: {isValid ? 'Yes' : 'No'}</div>
            <div>Errors: {Object.keys(errors).length > 0 ? 
              Object.entries(errors).map(([field, error]) => 
                `${field}: ${error?.message || 'Invalid'}`
              ).join(', ') : 'None'}</div>
          </div>
        )}
      </form>
    </div>
  );
} 