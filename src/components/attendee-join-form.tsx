'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, ArrowRight, Lightbulb } from 'lucide-react';
import { logger } from '@/lib/logger';

const attendeeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

type AttendeeData = z.infer<typeof attendeeSchema>;

interface AttendeeJoinFormProps {
  eventId: string;
  eventTitle: string;
  onJoin: (attendeeId: string) => void;
}

export function AttendeeJoinForm({ eventId, eventTitle, onJoin }: AttendeeJoinFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const form = useForm<AttendeeData>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const handleJoin = async (data: AttendeeData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/events/${eventId}/attendees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join event');
      }

      const { attendee } = await response.json();
      
      // Store attendee ID in localStorage for reconnection
      localStorage.setItem('attendeeId', attendee.id);
      localStorage.setItem(`attendee_${eventId}`, attendee.id);
      
      logger.info('Attendee joined event', {
        component: 'attendee-join-form',
        eventId,
        attendeeId: attendee.id,
        hasEmail: !!data.email,
      });

      onJoin(attendee.id);
    } catch (error) {
      logger.error('Failed to join event', error as Error, {
        component: 'attendee-join-form',
        eventId,
      });
      alert('Failed to join event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Create anonymous attendee
    handleJoin({ name: `Anonymous ${Math.floor(Math.random() * 1000)}` });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center space-y-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Join {eventTitle}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Welcome! Let&apos;s get you connected to this unconference.
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleJoin)} className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="Enter your name"
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {showOptionalFields ? (
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                We&apos;ll only use this to send you event updates
              </p>
              {form.formState.errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowOptionalFields(true)}
              className="text-sm text-primary hover:text-primary/80 underline"
              disabled={isSubmitting}
            >
              + Add email (optional)
            </button>
          )}

          <div className="space-y-3 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting || !form.watch('name')}
              className="w-full flex items-center gap-2"
            >
              {isSubmitting ? (
                'Joining...'
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Join Event
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
              >
                Skip and join anonymously
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                What&apos;s next?
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                After joining, you&apos;ll be able to propose topics and vote on sessions you&apos;d like to attend.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 