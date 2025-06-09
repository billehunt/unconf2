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
    const { timeBlocks } = body;

    if (!Array.isArray(timeBlocks)) {
      return NextResponse.json(
        { error: 'Time blocks must be an array' },
        { status: 400 }
      );
    }

    // Validate time blocks
    for (const block of timeBlocks) {
      if (!block.startsAt || !block.endsAt) {
        return NextResponse.json(
          { error: 'All time blocks must have start and end times' },
          { status: 400 }
        );
      }

      const start = new Date(block.startsAt);
      const end = new Date(block.endsAt);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json(
          { error: 'All time blocks must have valid dates' },
          { status: 400 }
        );
      }

      if (end <= start) {
        return NextResponse.json(
          { error: 'All time blocks must have end time after start time' },
          { status: 400 }
        );
      }
    }

    // Check for overlapping time blocks
    const sortedBlocks = timeBlocks
      .map((block, index) => ({ ...block, originalIndex: index }))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    for (let i = 0; i < sortedBlocks.length - 1; i++) {
      const current = sortedBlocks[i];
      const next = sortedBlocks[i + 1];
      
      if (new Date(current.endsAt) > new Date(next.startsAt)) {
        return NextResponse.json(
          { error: 'Time blocks cannot overlap' },
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

    // Use transaction to update time blocks
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing time blocks
      await tx.timeBlock.deleteMany({
        where: { eventId: id },
      });

      // Create new time blocks
      const newTimeBlocks = timeBlocks.map((block, index) => ({
        eventId: id,
        startsAt: new Date(block.startsAt),
        endsAt: new Date(block.endsAt),
        sortOrder: block.sortOrder !== undefined ? block.sortOrder : index,
      }));

      await tx.timeBlock.createMany({
        data: newTimeBlocks,
      });

      // Return updated time blocks
      return await tx.timeBlock.findMany({
        where: { eventId: id },
        orderBy: { sortOrder: 'asc' },
      });
    });

    logger.info('Time blocks updated successfully', {
      component: 'time-blocks-update-api',
      eventId: id,
      blockCount: timeBlocks.length,
    });

    return NextResponse.json({
      success: true,
      timeBlocks: result,
    });

  } catch (error) {
    logger.error('Failed to update time blocks', error as Error, {
      component: 'time-blocks-update-api',
    });

    return NextResponse.json(
      { error: 'Failed to update time blocks' },
      { status: 500 }
    );
  }
} 