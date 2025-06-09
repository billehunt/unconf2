import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, ExternalLink } from 'lucide-react';
import { DeleteEventButton } from '@/components/delete-event-button';
import { EventEditForm } from '@/components/event-edit-form';
import Link from 'next/link';
import { logger } from '@/lib/logger';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface EventEditPageProps {
  params: { slug: string };
}

async function getEventForEdit(slug: string) {
  try {
    // First try to find by friendly slug in settings
    const eventBySlug = await prisma.event.findFirst({
      where: {
        settings: {
          path: ['friendlySlug'],
          equals: slug,
        },
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

    if (eventBySlug) {
      return eventBySlug;
    }

    // Fallback to UUID lookup for backward compatibility
    const eventById = await prisma.event.findUnique({
      where: { id: slug },
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

    return eventById;
  } catch (error) {
    logger.error('Failed to fetch event for editing', error as Error, {
      component: 'event-edit-page',
      slug,
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

export default async function EventEditPage({ params }: EventEditPageProps) {
  const event = await getEventForEdit(params.slug);

  if (!event) {
    notFound();
  }

  const eventDate = formatDateTime(event.startsAt);
  const startTime = formatTime(event.startsAt);
  const endTime = formatTime(event.endsAt);
  
  // Get friendly slug from settings
  const settings = event.settings as any;
  const friendlySlug = settings?.friendlySlug;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Edit Event
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your event details, rooms, and time blocks
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href={`/e/${friendlySlug || event.id}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Event Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {event.title}
                  </h2>
                  {friendlySlug && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Event ID: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{friendlySlug}</code>
                    </p>
                  )}
                </div>

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
                        {event.rooms.length} space{event.rooms.length !== 1 ? 's' : ''}
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
              </div>
            </CardContent>
          </Card>

          {/* Event Edit Form */}
          <EventEditForm event={event} />
          
          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-100">
                Danger Zone
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Once you delete an event, there is no going back. Please be certain.
              </p>
              <DeleteEventButton
                eventId={event.id}
                eventTitle={event.title}
                attendeeCount={event._count.attendees}
                topicCount={event._count.topics}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: EventEditPageProps) {
  const event = await getEventForEdit(params.slug);
  
  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }
  
  return {
    title: `Edit ${event.title} - Organiser`,
    description: `Edit event details, rooms, and time blocks for ${event.title}`,
  };
} 