import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, QrCode, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QRCode } from '@/components/qr-code';
import { EventUrlDisplay } from '@/components/event-url-display';
import Link from 'next/link';
import { logger } from '@/lib/logger';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface EventPageProps {
  params: { shortId: string };
}

async function getEvent(shortId: string) {
  try {
    // First try to find by friendly slug in settings
    const events = await prisma.event.findMany({
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

    // Look for event with matching friendly slug in settings
    let event = events.find(e => {
      const settings = e.settings as any;
      return settings?.friendlySlug === shortId;
    });

    // Fallback to UUID lookup for backwards compatibility
    if (!event) {
      event = events.find(e => e.id === shortId);
    }

    return event || null;
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
  
  // Get friendly slug from settings
  const settings = event.settings as any;
  const friendlySlug = settings?.friendlySlug || params.shortId;
  const eventUrl = `/e/${friendlySlug}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
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
              {friendlySlug && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Event ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{friendlySlug}</code>
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <Link href={`/organiser/edit/${event.id}`}>
                  <Edit className="w-4 h-4" />
                  Edit Event
                </Link>
              </Button>
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

          {/* QR Code & Sharing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex justify-center lg:justify-start">
              <QRCode
                value={eventUrl}
                title={event.title}
                size={220}
              />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    📢 Share This Event
                  </h3>
                  <div className="space-y-4">
                                         <div>
                       <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                         Event URL:
                       </p>
                       <EventUrlDisplay eventUrl={eventUrl} />
                     </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <p className="text-blue-900 dark:text-blue-100 text-sm">
                        <strong>💡 Share with attendees:</strong> Use the QR code or share the direct link. 
                        No app downloads required - works on any device!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

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