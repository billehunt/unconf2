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
    const { title, createdBy } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title too long (max 200 characters)' },
        { status: 400 }
      );
    }

    if (!createdBy || typeof createdBy !== 'string') {
      return NextResponse.json(
        { error: 'Created by is required' },
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

    // Create the topic
    const topic = await prisma.topic.create({
      data: {
        eventId: id,
        title: title.trim(),
        createdBy,
        isLocked: false,
      },
    });

    logger.info('Topic created successfully', {
      component: 'topics-api',
      eventId: id,
      topicId: topic.id,
      title: topic.title,
      createdBy,
    });

    return NextResponse.json({
      success: true,
      topic: {
        id: topic.id,
        title: topic.title,
        createdBy: topic.createdBy,
        isLocked: topic.isLocked,
        createdAt: topic.createdAt,
      },
    });

  } catch (error) {
    logger.error('Failed to create topic', error as Error, {
      component: 'topics-api',
    });

    return NextResponse.json(
      { error: 'Failed to create topic' },
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

    // Get all topics for the event (excluding soft-deleted ones)
    const topics = await prisma.topic.findMany({
      where: { 
        eventId: id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      topics,
    });

  } catch (error) {
    logger.error('Failed to fetch topics', error as Error, {
      component: 'topics-api',
    });

    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
} 