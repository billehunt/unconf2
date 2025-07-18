'use client';

import { useState, useEffect } from 'react';
import { AttendeeJoinForm } from '@/components/attendee-join-form';
import { AttendeeInterestsForm } from '@/components/attendee-interests-form';
import { EventMainView } from '@/components/event-main-view';

interface EventLandingProps {
  event: {
    id: string;
    title: string;
    startsAt: Date;
    endsAt: Date;
    rooms: Array<{
      id: string;
      name: string;
      capacity: number;
      sortOrder: number;
    }>;
    timeBlocks: Array<{
      id: string;
      startsAt: Date;
      endsAt: Date;
      sortOrder: number;
    }>;
    _count: {
      topics: number;
      attendees: number;
    };
  };
  friendlySlug: string;
}

export function EventLanding({ event, friendlySlug }: EventLandingProps) {
  const [attendeeId, setAttendeeId] = useState<string | null>(null);
  const [hasCompletedInterests, setHasCompletedInterests] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has already joined this event
    const storedAttendeeId = localStorage.getItem(`attendee_${event.id}`);
    const completedInterests = localStorage.getItem(`interests_completed_${event.id}`);
    setAttendeeId(storedAttendeeId);
    setHasCompletedInterests(!!completedInterests);
    setIsLoading(false);
  }, [event.id]);

  const handleJoin = (newAttendeeId: string) => {
    setAttendeeId(newAttendeeId);
  };

  const handleInterestsComplete = () => {
    // Mark interests as completed in localStorage
    localStorage.setItem(`interests_completed_${event.id}`, 'true');
    setHasCompletedInterests(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Loading event...</p>
        </div>
      </div>
    );
  }

  // If user hasn't joined yet, show the join form
  if (!attendeeId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Event Header */}
            <div className="text-center mb-8 space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {event.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(event.startsAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} at {new Date(event.startsAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
              {friendlySlug && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Event ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{friendlySlug}</code>
                </p>
              )}
            </div>

            {/* Join Form */}
            <AttendeeJoinForm
              eventId={event.id}
              eventTitle={event.title}
              onJoin={handleJoin}
            />

            {/* Event Preview */}
            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>{event._count.attendees} attendee{event._count.attendees !== 1 ? 's' : ''} joined</p>
              <p>{event.rooms.length} room{event.rooms.length !== 1 ? 's' : ''} • {event.timeBlocks.length} time slot{event.timeBlocks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user has joined but hasn't completed interests form, show interests form
  if (attendeeId && !hasCompletedInterests) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Event Header */}
            <div className="text-center mb-8 space-y-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {event.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Step 2 of 2: Share your interests
              </p>
            </div>

            {/* Interests Form */}
            <AttendeeInterestsForm
              eventId={event.id}
              attendeeId={attendeeId}
              eventTitle={event.title}
              onComplete={handleInterestsComplete}
              onSkip={handleInterestsComplete}
            />
          </div>
        </div>
      </div>
    );
  }

  // User has completed both steps, show the main event view
  return (
    <EventMainView 
      event={event} 
      friendlySlug={friendlySlug}
    />
  );
} 