import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, QrCode, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { logger } from '@/lib/logger';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
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

    return events;
  } catch (error) {
    logger.error('Failed to fetch events', error as Error, {
      component: 'events-listing',
    });
    return [];
  }
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
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

function getEventStatus(event: { startsAt: Date; endsAt: Date }) {
  const now = new Date();
  const starts = event.startsAt;
  const ends = event.endsAt;
  
  if (now < starts) {
    return { label: 'Upcoming', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
  } else if (now >= starts && now <= ends) {
    return { label: 'Live Now', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
  } else {
    return { label: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
  }
}

function getFriendlySlug(settings: any): string {
  if (typeof settings === 'object' && settings?.friendlySlug) {
    return settings.friendlySlug;
  }
  return '';
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                All Events
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Browse and join unconference events from around the community
              </p>
            </div>
            <Link href="/organiser">
              <Button className="flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                Create Event
              </Button>
            </Link>
          </div>

          {/* Events List */}
          {events.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Events Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to create an unconference event!
                </p>
                <Link href="/organiser">
                  <Button>Create Your First Event</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => {
                const status = getEventStatus(event);
                const friendlySlug = getFriendlySlug(event.settings);
                
                return (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Event Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {event.title}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                            {friendlySlug && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {friendlySlug}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatDateTime(event.startsAt)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {formatTime(event.startsAt)} - {formatTime(event.endsAt)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {event.rooms.length} room{event.rooms.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {event._count.attendees} attendee{event._count.attendees !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {/* Rooms Preview */}
                        {event.rooms.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Rooms:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {event.rooms.slice(0, 3).map((room) => (
                                <span
                                  key={room.id}
                                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                                >
                                  {room.name} ({room.capacity})
                                </span>
                              ))}
                              {event.rooms.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded">
                                  +{event.rooms.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Topics Info */}
                        {event._count.topics > 0 && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            💡 {event._count.topics} topic{event._count.topics !== 1 ? 's' : ''} proposed
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Link href={`/e/${event.id}`} className="flex-1">
                            <Button variant="outline" className="w-full flex items-center gap-2">
                              <ExternalLink className="w-4 h-4" />
                              View Event
                            </Button>
                          </Link>
                          {status.label !== 'Completed' && (
                            <Link href={`/e/${event.id}`} className="flex-1">
                              <Button className="w-full">
                                Join Event
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                What&apos;s an Unconference?
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm max-w-2xl mx-auto">
                An unconference is a participant-driven event where attendees collaboratively create the agenda. 
                Topics are proposed, voted on, and sessions are scheduled based on collective interest. 
                No presentations, just conversations!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata() {
  const events = await getEvents();
  
  return {
    title: `All Events (${events.length}) - Unconference Platform`,
    description: 'Browse and join unconference events from around the community. Create collaborative agendas and participate in participant-driven discussions.',
  };
} 