import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit during development.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Connection test function
export const testPrismaConnection = async () => {
  try {
    await prisma.$connect();

    // Test with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;

    await prisma.$disconnect();

    return {
      success: true,
      message: 'Prisma connection successful',
      details: `Database query returned: ${JSON.stringify(result)}`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';

    return {
      success: false,
      message: 'Prisma connection failed',
      details: errorMessage,
    };
  }
};

// Utility function to safely disconnect Prisma
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

// Health check function for API routes
export const healthCheck = async () => {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const duration = Date.now() - start;

    return {
      status: 'healthy',
      database: 'connected',
      responseTime: `${duration}ms`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
};

// Export types for use in components
export type PrismaUser = {
  id: string;
  email: string | null;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};
