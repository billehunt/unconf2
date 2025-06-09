import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

interface RouteContext {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params;
    const body = await request.json();
    const { rooms } = body;

    if (!Array.isArray(rooms)) {
      return NextResponse.json(
        { error: 'Rooms must be an array' },
        { status: 400 }
      );
    }

    // Validate rooms
    for (const room of rooms) {
      if (!room.name || typeof room.name !== 'string' || room.name.trim().length === 0) {
        return NextResponse.json(
          { error: 'All rooms must have a valid name' },
          { status: 400 }
        );
      }
      if (!room.capacity || typeof room.capacity !== 'number' || room.capacity < 1 || room.capacity > 1000) {
        return NextResponse.json(
          { error: 'All rooms must have a valid capacity (1-1000)' },
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

    // Use transaction to update rooms
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing rooms
      await tx.room.deleteMany({
        where: { eventId: id },
      });

      // Create new rooms
      const newRooms = rooms.map((room, index) => ({
        eventId: id,
        name: room.name.trim(),
        capacity: room.capacity,
        sortOrder: room.sortOrder !== undefined ? room.sortOrder : index,
      }));

      await tx.room.createMany({
        data: newRooms,
      });

      // Return updated rooms
      return await tx.room.findMany({
        where: { eventId: id },
        orderBy: { sortOrder: 'asc' },
      });
    });

    logger.info('Rooms updated successfully', {
      component: 'rooms-update-api',
      eventId: id,
      roomCount: rooms.length,
    });

    return NextResponse.json({
      success: true,
      rooms: result,
    });

  } catch (error) {
    logger.error('Failed to update rooms', error as Error, {
      component: 'rooms-update-api',
    });

    return NextResponse.json(
      { error: 'Failed to update rooms' },
      { status: 500 }
    );
  }
} 