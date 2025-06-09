'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, QrCode, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QRCode } from '@/components/qr-code';
import { EventUrlDisplay } from '@/components/event-url-display';
import Link from 'next/link';

interface EventMainViewProps {
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

export function EventMainView({ event, friendlySlug }: EventMainViewProps) {
  const eventDate = formatDateTime(event.startsAt);
  const startTime = formatTime(event.startsAt);
  const endTime = formatTime(event.endsAt);
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
                <Link href={`/organiser/edit/${friendlySlug}`}>
                  <Edit className="w-4 h-4" />
                  Edit Event
                </Link>
              </Button>
            </div>
          </div>

          {/* Attendee Status */}
          <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Users className="w-5 h-5" />
                <p className="font-medium">
                  You&apos;re all set! Ready to participate in this unconference.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  What&apos;s Next?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Great! You&apos;ve joined the event. Here&apos;s what you can do:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      🗳️ Vote on Topics
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      Help shape the agenda by voting on session topics proposed by attendees.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                      💡 Propose Topics
                    </h3>
                    <p className="text-purple-800 dark:text-purple-200 text-sm">
                      Have an idea? Submit your own topic for discussion during the event.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg mt-4">
                  <p className="text-yellow-900 dark:text-yellow-100 font-medium mb-2">
                    🚀 Coming Soon
                  </p>
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    Topic submission and voting features will be available here soon. 
                    For now, you can explore the event details below.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
        </div>
      </div>
    </div>
  );
} 