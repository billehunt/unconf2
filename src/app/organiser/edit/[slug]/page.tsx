'use client';

import { useState, useEffect } from 'react';
import { AdminAuthModal } from '@/components/admin-auth-modal';
import { EventEditForm } from '@/components/event-edit-form';
import { DeleteEventButton } from '@/components/delete-event-button';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, ExternalLink } from 'lucide-react';
import { ADMIN_STORAGE_KEY } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EventEditPageProps {
  params: { slug: string };
}

interface Event {
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
  settings?: {
    friendlySlug?: string;
  };
}

export default function EventEditPage({ params }: EventEditPageProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (mounted && !isAdmin) {
      setShowAdminAuth(true);
    } else if (isAdmin) {
      loadEvent();
    }
  }, [mounted, isAdmin, params.slug]);

  const checkAdminStatus = () => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession);
          if (session.isAdmin && session.timestamp && Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
            setIsAdmin(true);
          } else {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
    }
  };

  const loadEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${params.slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setNotFound(true);
        }
        return;
      }
      const data = await response.json();
      if (data.success && data.event) {
        const eventData: Event = {
          ...data.event,
          startsAt: new Date(data.event.startsAt),
          endsAt: new Date(data.event.endsAt),
          timeBlocks: data.event.timeBlocks.map((block: any) => ({
            ...block,
            startsAt: new Date(block.startsAt),
            endsAt: new Date(block.endsAt),
          })),
        };
        setEvent(eventData);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Failed to load event:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSuccess = () => {
    setShowAdminAuth(false);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    setIsAdmin(false);
    router.push('/events');
  };

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <AdminAuthModal
        isOpen={showAdminAuth}
        onClose={() => router.push('/events')}
        onSuccess={handleAdminSuccess}
        title="Edit Event"
        description="Editing events requires administrator privileges"
      />
    );
  }

  if (loading) {
    return (
      <>
        <div className="bg-green-100 dark:bg-green-900 border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Loading Event...</span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (notFound || !event) {
    return (
      <>
        <div className="bg-green-100 dark:bg-green-900 border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">Admin Mode Active</span>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-4">The event does not exist or may have been deleted.</p>
            <Link href="/events" className="text-blue-600 hover:text-blue-800">← Back to Events</Link>
          </div>
        </div>
      </>
    );
  }

  const friendlySlug = event.settings?.friendlySlug;

  return (
    <>
      <div className="bg-green-100 dark:bg-green-900 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Admin Mode Active - Editing Event</span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
                <p className="text-gray-600 mt-2">Manage your event details, rooms, and time blocks</p>
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

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{event.title}</h2>
                {friendlySlug && (
                  <p className="text-sm text-gray-500">
                    Event ID: <code className="bg-gray-100 px-2 py-1 rounded">{friendlySlug}</code>
                  </p>
                )}
              </CardContent>
            </Card>

            <EventEditForm event={event} onUpdate={loadEvent} />
            
            <Card className="border-red-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-red-900">Danger Zone</h2>
                <p className="text-sm text-gray-600 mb-4">Once you delete an event, there is no going back. Please be certain.</p>
                <DeleteEventButton
                  eventId={event.id}
                  eventTitle={event.title}
                  attendeeCount={event._count.attendees}
                  topicCount={event._count.topics}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Link href="/events" className="text-blue-600 hover:text-blue-800">← Back to Events</Link>
              <Link href="/organiser" className="text-blue-600 hover:text-blue-800">Create New Event →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
