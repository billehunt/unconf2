import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Cleaning up existing data...');
    await prisma.note.deleteMany();
    await prisma.session.deleteMany();
    await prisma.vote.deleteMany();
    await prisma.topic.deleteMany();
    await prisma.attendee.deleteMany();
    await prisma.timeBlock.deleteMany();
    await prisma.room.deleteMany();
    await prisma.event.deleteMany();
  }

  // Create demo event
  console.log('🎪 Creating demo event...');
  const event = await prisma.event.create({
    data: {
      title: 'Demo Unconference 2024',
      startsAt: new Date('2024-12-15T09:00:00Z'),
      endsAt: new Date('2024-12-15T17:00:00Z'),
      createdBy: 'demo-organizer',
      wizardStage: 3, // Completed wizard
      settings: {
        evaluationTimeMinutes: 10,
        allowAnonymousAttendees: true,
        maxTopicsPerAttendee: 3,
      },
    },
  });

  console.log(`✅ Created event: ${event.title}`);

  // Create two rooms
  console.log('🏠 Creating rooms...');
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        eventId: event.id,
        name: 'Main Conference Room',
        capacity: 50,
        sortOrder: 1,
      },
    }),
    prisma.room.create({
      data: {
        eventId: event.id,
        name: 'Breakout Room',
        capacity: 20,
        sortOrder: 2,
      },
    }),
  ]);

  console.log(`✅ Created ${rooms.length} rooms`);

  // Create three time blocks
  console.log('⏰ Creating time blocks...');
  const timeBlocks = await Promise.all([
    prisma.timeBlock.create({
      data: {
        eventId: event.id,
        startsAt: new Date('2024-12-15T10:00:00Z'),
        endsAt: new Date('2024-12-15T11:00:00Z'),
        sortOrder: 1,
      },
    }),
    prisma.timeBlock.create({
      data: {
        eventId: event.id,
        startsAt: new Date('2024-12-15T11:30:00Z'),
        endsAt: new Date('2024-12-15T12:30:00Z'),
        sortOrder: 2,
      },
    }),
    prisma.timeBlock.create({
      data: {
        eventId: event.id,
        startsAt: new Date('2024-12-15T14:00:00Z'),
        endsAt: new Date('2024-12-15T15:00:00Z'),
        sortOrder: 3,
      },
    }),
  ]);

  console.log(`✅ Created ${timeBlocks.length} time blocks`);

  // Create test attendee
  console.log('👤 Creating test attendee...');
  const attendee = await prisma.attendee.create({
    data: {
      eventId: event.id,
      name: 'Demo Attendee',
      email: 'demo@example.com',
      lastSeenAt: new Date(),
      interests: ['JavaScript', 'React', 'AI', 'Web Development'],
    },
  });

  console.log(`✅ Created attendee: ${attendee.name}`);

  // Create sample topics
  console.log('💡 Creating sample topics...');
  const topics = await Promise.all([
    prisma.topic.create({
      data: {
        eventId: event.id,
        title: 'Building Modern Web Apps with React',
        createdBy: attendee.id,
        isLocked: false,
      },
    }),
    prisma.topic.create({
      data: {
        eventId: event.id,
        title: 'AI-Powered Development Tools',
        createdBy: 'ai-system',
        isLocked: false,
      },
    }),
    prisma.topic.create({
      data: {
        eventId: event.id,
        title: 'Database Design Best Practices',
        createdBy: attendee.id,
        isLocked: false,
      },
    }),
    prisma.topic.create({
      data: {
        eventId: event.id,
        title: 'TypeScript Tips and Tricks',
        createdBy: 'demo-organizer',
        isLocked: false,
      },
    }),
  ]);

  console.log(`✅ Created ${topics.length} sample topics`);

  // Create sample votes
  console.log('🗳️ Creating sample votes...');
  const votes = await Promise.all([
    prisma.vote.create({
      data: {
        topicId: topics[0].id,
        attendeeId: attendee.id,
      },
    }),
    prisma.vote.create({
      data: {
        topicId: topics[1].id,
        attendeeId: attendee.id,
      },
    }),
  ]);

  console.log(`✅ Created ${votes.length} sample votes`);

  // Log summary
  console.log('\n📊 Seed summary:');
  console.log(`   • 1 demo event: "${event.title}"`);
  console.log(`   • ${rooms.length} rooms: ${rooms.map(r => `"${r.name}"`).join(', ')}`);
  console.log(`   • ${timeBlocks.length} time blocks`);
  console.log(`   • 1 test attendee: "${attendee.name}"`);
  console.log(`   • ${topics.length} sample topics`);
  console.log(`   • ${votes.length} sample votes`);

  console.log('\n🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 