import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Generate a collision-safe 6-character short ID
function generateShortId(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Check if short ID is unique, retry if collision
async function getUniqueShortId(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortId = generateShortId();
    
    try {
      // TODO: Update to use shortId once migration is applied
      // For now, checking against id field as workaround
      const existing = await prisma.event.findFirst({
        where: { 
          OR: [
            { id: shortId },
            // { shortId: shortId }, // Uncomment once migration is applied
          ]
        },
      });
      
      if (!existing) {
        return shortId;
      }
      
      attempts++;
      logger.warn('ShortId collision detected, retrying', {
        component: 'events-api',
        shortId,
        attempt: attempts,
      });
    } catch (error) {
      logger.error('Error checking shortId uniqueness', error as Error, {
        component: 'events-api',
        shortId,
      });
      attempts++;
    }
  }
  
  // Fallback to UUID if all attempts fail
  throw new Error('Failed to generate unique shortId after maximum attempts');
}

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
    
    // Generate unique short ID
    const shortId = await getUniqueShortId();
    
    // Create event with relations
    const event = await prisma.event.create({
      data: {
        // shortId, // TODO: Uncomment once migration is applied
        title,
        startsAt,
        endsAt,
        createdBy: 'organiser', // TODO: Use actual user ID from auth
        wizardStage: 3, // Completed wizard
        settings: {},
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
      shortId: shortId, // Using generated shortId temporarily
      title: event.title,
    });
    
    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        shortId: shortId, // TODO: Use event.shortId once migration is applied
        title: event.title,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        accessUrl: `/e/${event.id}`, // TODO: Use shortId once migration is applied
        qrUrl: `/e/${event.id}`, // TODO: Use shortId once migration is applied
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