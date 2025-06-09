import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: { id: string; attendeeId: string };
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id, attendeeId } = params;
    const body = await request.json();
    const { interests } = body;

    // Validate interests if provided
    if (interests !== undefined) {
      if (!Array.isArray(interests)) {
        return NextResponse.json(
          { error: 'Interests must be an array' },
          { status: 400 }
        );
      }

      // Validate each interest
      for (const interest of interests) {
        if (typeof interest !== 'string' || interest.trim().length === 0) {
          return NextResponse.json(
            { error: 'All interests must be non-empty strings' },
            { status: 400 }
          );
        }
        if (interest.length > 50) {
          return NextResponse.json(
            { error: 'Interest too long (max 50 characters)' },
            { status: 400 }
          );
        }
      }

      if (interests.length > 20) {
        return NextResponse.json(
          { error: 'Too many interests (max 20)' },
          { status: 400 }
        );
      }
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

    // Check if attendee exists and belongs to this event
    const existingAttendee = await prisma.attendee.findFirst({
      where: { 
        id: attendeeId,
        eventId: id,
      },
    });

    if (!existingAttendee) {
      return NextResponse.json(
        { error: 'Attendee not found' },
        { status: 404 }
      );
    }

    // Update the attendee
    const updatedAttendee = await prisma.attendee.update({
      where: { id: attendeeId },
      data: {
        interests: interests ? interests.map((i: string) => i.trim()) : undefined,
        lastSeenAt: new Date(),
      },
    });

    logger.info('Attendee updated successfully', {
      component: 'attendee-update-api',
      eventId: id,
      attendeeId,
      interestCount: interests?.length || 0,
    });

    return NextResponse.json({
      success: true,
      attendee: {
        id: updatedAttendee.id,
        name: updatedAttendee.name,
        email: updatedAttendee.email,
        interests: updatedAttendee.interests,
        lastSeenAt: updatedAttendee.lastSeenAt,
      },
    });

  } catch (error) {
    logger.error('Failed to update attendee', error as Error, {
      component: 'attendee-update-api',
    });

    return NextResponse.json(
      { error: 'Failed to update attendee' },
      { status: 500 }
    );
  }
} 