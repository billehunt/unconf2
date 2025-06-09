import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, QrCode } from 'lucide-react';
import { logger } from '@/lib/logger';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface EventPageProps {
  params: { shortId: string };
}

async function getEvent(shortId: string) {
  try {
    // TODO: Update to use shortId once migration is applied
    // For now, using id field as a temporary workaround
    const event = await prisma.event.findFirst({
      where: { 
        OR: [
          { id: shortId },
          // { shortId: shortId }, // Uncomment once migration is applied
        ]
      },
      include: {
        rooms: {
          orderBy: { sortOrder: 'asc' },
        },
        timeBlocks: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            topics: true,
            attendees: true,
          },
        },
      },
    });

    return event;
  } catch (error) {
    logger.error('Failed to fetch event', error as Error, {
      component: 'event-page',
      shortId,
    });
    return null;
  }
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.shortId);

  if (!event) {
    notFound();
  }

  const eventDate = formatDateTime(event.startsAt);
  const startTime = formatTime(event.startsAt);
  const endTime = formatTime(event.endsAt);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {event.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Welcome to this unconference event
              </p>
            </div>
          </div>

          {/* Event Details */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{eventDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {startTime} - {endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Rooms</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event.rooms.length} space{event.rooms.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Attendees</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {event._count.attendees} joined
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rooms */}
          {event.rooms.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Available Rooms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {event.rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Capacity: {room.capacity} people
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Time Blocks */}
          {event.timeBlocks.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Session Time Slots
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.timeBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        Session {index + 1}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(block.startsAt)} - {formatTime(block.endsAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Join Instructions */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Ready to Join?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This unconference is about to begin! Sessions will be proposed and voted on by attendees like you.
                </p>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-blue-900 dark:text-blue-100 font-medium mb-2">
                    🚀 Coming Soon
                  </p>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Attendee onboarding, topic submission, and voting board features will be available here soon.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEvent(params.shortId);
  
  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }
  
  return {
    title: `${event.title} - Unconference`,
    description: `Join ${event.title}, an unconference event where attendees collaborate to create the agenda.`,
  };
} 