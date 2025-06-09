import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean up existing data in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('🧹 Cleaning up existing data...');
    await prisma.user.deleteMany();
  }

  // Create sample users for development
  console.log('👥 Creating sample users...');
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'organizer@unconf.example',
        name: 'Demo Organizer',
      },
    }),
    prisma.user.create({
      data: {
        email: 'attendee1@unconf.example',
        name: 'Demo Attendee 1',
      },
    }),
    prisma.user.create({
      data: {
        email: 'attendee2@unconf.example',
        name: 'Demo Attendee 2',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Anonymous User',
        // No email for anonymous users
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} sample users`);

  // Log the created users for verification
  users.forEach((user, index) => {
    console.log(`   ${index + 1}. ${user.name} (${user.email || 'anonymous'})`);
  });

  console.log('🎉 Database seed completed successfully!');
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