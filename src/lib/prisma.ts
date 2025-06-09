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
  // First check if environment variables are set
  const databaseUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  
  if (!databaseUrl) {
    return {
      success: false,
      message: 'DATABASE_URL not configured',
      details: 'Please add DATABASE_URL to your .env.local file',
    };
  }
  
  if (!directUrl) {
    return {
      success: false,
      message: 'DIRECT_URL not configured', 
      details: 'Please add DIRECT_URL to your .env.local file',
    };
  }

  try {
    console.log('Testing Prisma connection...');
    console.log('DATABASE_URL present:', !!databaseUrl);
    console.log('DIRECT_URL present:', !!directUrl);
    
    await prisma.$connect();
    console.log('Prisma connected successfully');

    // Test with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Query result:', result);

    await prisma.$disconnect();
    console.log('Prisma disconnected successfully');

    return {
      success: true,
      message: 'Prisma connection successful',
      details: `Database query returned: ${JSON.stringify(result)}`,
    };
  } catch (error) {
    console.error('Prisma connection error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for common connection issues and provide helpful messages
    if (errorMessage.includes('ENOTFOUND')) {
      return {
        success: false,
        message: 'Database host not found',
        details: 'Check your Supabase project ID in DATABASE_URL and DIRECT_URL',
      };
    }
    
    if (errorMessage.includes('authentication failed')) {
      return {
        success: false,
        message: 'Authentication failed',
        details: 'Check your database password in DATABASE_URL and DIRECT_URL',
      };
    }
    
    if (errorMessage.includes('timeout')) {
      return {
        success: false,
        message: 'Connection timeout',
        details: 'Database connection timed out. Check if your Supabase project is active.',
      };
    }

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
