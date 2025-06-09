import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EventLanding } from '@/components/event-landing';
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

export default async function EventPage({ params }: EventPageProps) {
  const event = await getEvent(params.shortId);

  if (!event) {
    notFound();
  }

  // Get friendly slug from settings
  const settings = event.settings as any;
  const friendlySlug = settings?.friendlySlug || params.shortId;

  return (
    <EventLanding 
      event={event} 
      friendlySlug={friendlySlug}
    />
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