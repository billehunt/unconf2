import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, email } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name too long (max 100 characters)' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email && (typeof email !== 'string' || !email.includes('@'))) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    // Create the attendee
    const attendee = await prisma.attendee.create({
      data: {
        eventId: id,
        name: name.trim(),
        email: email?.trim() || null,
        lastSeenAt: new Date(),
        interests: [], // Empty array initially
      },
    });

    logger.info('Attendee created successfully', {
      component: 'attendees-api',
      eventId: id,
      attendeeId: attendee.id,
      hasEmail: !!email,
    });

    return NextResponse.json({
      success: true,
      attendee: {
        id: attendee.id,
        name: attendee.name,
        email: attendee.email,
        createdAt: attendee.createdAt,
      },
    });

  } catch (error) {
    logger.error('Failed to create attendee', error as Error, {
      component: 'attendees-api',
    });

    return NextResponse.json(
      { error: 'Failed to create attendee' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;

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

    // Get all attendees for the event
    const attendees = await prisma.attendee.findMany({
      where: { eventId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        lastSeenAt: true,
        interests: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      attendees,
    });

  } catch (error) {
    logger.error('Failed to fetch attendees', error as Error, {
      component: 'attendees-api',
    });

    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    );
  }
} 