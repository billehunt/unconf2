'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Lightbulb, ArrowRight } from 'lucide-react';
import { logger } from '@/lib/logger';

const interestsSchema = z.object({
  newInterest: z.string().max(50, 'Interest too long').optional(),
  topicTitle: z.string().max(200, 'Topic title too long').optional(),
});

type InterestsData = z.infer<typeof interestsSchema>;

interface AttendeeInterestsFormProps {
  eventId: string;
  attendeeId: string;
  eventTitle: string;
  onComplete: () => void;
  onSkip?: () => void;
}

export function AttendeeInterestsForm({ 
  eventId, 
  attendeeId, 
  eventTitle, 
  onComplete,
  onSkip 
}: AttendeeInterestsFormProps) {
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InterestsData>({
    resolver: zodResolver(interestsSchema),
    defaultValues: {
      newInterest: '',
      topicTitle: '',
    },
  });

  const addInterest = () => {
    const newInterest = form.getValues('newInterest')?.trim();
    if (newInterest && newInterest.length > 0 && !interests.includes(newInterest)) {
      if (interests.length >= 20) {
        alert('Maximum 20 interests allowed');
        return;
      }
      setInterests([...interests, newInterest]);
      form.setValue('newInterest', '');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInterest();
    }
  };

  const handleSubmit = async (data: InterestsData) => {
    setIsSubmitting(true);
    
    try {
      // Update attendee interests
      if (interests.length > 0) {
        const response = await fetch(`/api/events/${eventId}/attendees/${attendeeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            interests,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update interests');
        }
      }

      // Create topic if provided
      if (data.topicTitle?.trim()) {
        const topicResponse = await fetch(`/api/events/${eventId}/topics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.topicTitle.trim(),
            createdBy: attendeeId,
          }),
        });

        if (!topicResponse.ok) {
          const errorData = await topicResponse.json();
          throw new Error(errorData.error || 'Failed to create topic');
        }
      }
      
      logger.info('Attendee interests and topic submitted', {
        component: 'attendee-interests-form',
        eventId,
        attendeeId,
        interestCount: interests.length,
        hasProposedTopic: !!data.topicTitle?.trim(),
      });

      onComplete();
    } catch (error) {
      logger.error('Failed to submit interests and topic', error as Error, {
        component: 'attendee-interests-form',
        eventId,
        attendeeId,
      });
      alert(`Failed to submit. Please try again. ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center space-y-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Share Your Interests
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Help us create the perfect agenda for {eventTitle}
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Interests Section */}
          <div>
            <Label htmlFor="interests" className="text-base font-medium">
              Your Interests
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Add topics you&apos;re interested in (press Enter to add each one)
            </p>
            
            <div className="flex gap-2 mb-3">
              <Input
                id="interests"
                {...form.register('newInterest')}
                placeholder="e.g., React, AI, Database Design"
                onKeyPress={handleKeyPress}
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addInterest}
                disabled={isSubmitting || !form.watch('newInterest')?.trim()}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Interest Chips */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    <span className="mr-2">{interest}</span>
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      disabled={isSubmitting}
                      className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {form.formState.errors.newInterest && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.newInterest.message}
              </p>
            )}
          </div>

          {/* Topic Proposal Section */}
          <div>
            <Label htmlFor="topicTitle" className="text-base font-medium">
              Propose a Topic (Optional)
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Suggest a session topic you&apos;d like to discuss or lead
            </p>
            
            <textarea
              id="topicTitle"
              {...form.register('topicTitle')}
              placeholder="e.g., Building Real-time Apps with React and WebSockets"
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            
            {form.formState.errors.topicTitle && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.topicTitle.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center gap-2"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Continue to Event
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
                Skip for now
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                What happens next?
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                You&apos;ll be able to vote on topics and see the final schedule once the voting period ends.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 