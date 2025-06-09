import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

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
      return settings?.friendlySlug === id;
    });

    // Fallback to UUID lookup for backwards compatibility
    if (!event) {
      event = events.find(e => e.id === id);
    }

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    logger.info('Event fetched successfully', {
      component: 'event-get-api',
      eventId: event.id,
    });

    return NextResponse.json({
      success: true,
      event,
    });

  } catch (error) {
    logger.error('Failed to fetch event', error as Error, {
      component: 'event-get-api',
    });

    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, startsAt, endsAt } = body;

    // Validate required fields
    if (!title || !startsAt || !endsAt) {
      return NextResponse.json(
        { error: 'Title, start time, and end time are required' },
        { status: 400 }
      );
    }

    // Validate time range
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (end <= start) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        startsAt: start,
        endsAt: end,
      },
    });

    logger.info('Event updated successfully', {
      component: 'event-update-api',
      eventId: id,
      title,
    });

    return NextResponse.json({
      success: true,
      event: updatedEvent,
    });

  } catch (error) {
    logger.error('Failed to update event', error as Error, {
      component: 'event-update-api',
    });

    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}