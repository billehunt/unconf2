import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { generateEventSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, startTime, endTime, rooms, timeBlocks } = body;
    
    // Validate required fields
    if (!title || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date, startTime, endTime' },
        { status: 400 }
      );
    }
    
    // Parse dates
    const startsAt = new Date(`${date}T${startTime}`);
    const endsAt = new Date(`${date}T${endTime}`);
    
    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date or time format' },
        { status: 400 }
      );
    }
    
    if (endsAt <= startsAt) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      );
    }
    
    // Generate memorable slug for future use (store in settings for now)
    const friendlySlug = generateEventSlug();
    
    // Create event with relations
    const event = await prisma.event.create({
      data: {
        title,
        startsAt,
        endsAt,
        createdBy: 'organiser', // TODO: Use actual user ID from auth
        wizardStage: 3, // Completed wizard
        settings: {
          friendlySlug, // Store the memorable slug in settings for now
        },
        rooms: {
          create: rooms?.map((room: any, index: number) => ({
            name: room.name,
            capacity: room.capacity,
            sortOrder: index,
          })) || [],
        },
        timeBlocks: {
          create: timeBlocks?.map((block: any, index: number) => ({
            startsAt: new Date(`${date}T${block.startTime}`),
            endsAt: new Date(`${date}T${block.endTime}`),
            sortOrder: index,
          })) || [],
        },
      },
      include: {
        rooms: true,
        timeBlocks: true,
      },
    });
    
    logger.info('Event created successfully', {
      component: 'events-api',
      eventId: event.id,
      friendlySlug,
      title: event.title,
    });
    
    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        shortId: friendlySlug, // Return the friendly slug for display
        title: event.title,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        accessUrl: `/e/${friendlySlug}`, // Use friendly slug in URLs now
        qrUrl: `/e/${friendlySlug}`,
      },
    });
    
  } catch (error) {
    logger.error('Failed to create event', error as Error, {
      component: 'events-api',
    });
    
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rooms: true,
        timeBlocks: true,
        _count: {
          select: {
            topics: true,
            attendees: true,
          },
        },
      },
    });
    
    return NextResponse.json({ events });
  } catch (error) {
    logger.error('Failed to fetch events', error as Error, {
      component: 'events-api',
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }
    
    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            attendees: true,
            topics: true,
          },
        },
      },
    });
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Delete the event (cascade delete will handle related records)
    await prisma.event.delete({
      where: { id: eventId },
    });
    
    logger.info('Event deleted successfully', {
      component: 'events-api',
      eventId,
      title: event.title,
      attendeeCount: event._count.attendees,
      topicCount: event._count.topics,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
    
  } catch (error) {
    logger.error('Failed to delete event', error as Error, {
      component: 'events-api',
    });
    
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
} 