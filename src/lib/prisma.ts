import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';

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
    logger.info('Testing Prisma connection', {
      databaseUrlPresent: !!databaseUrl,
      directUrlPresent: !!directUrl,
      component: 'prisma',
    });
    
    await prisma.$connect();
    logger.info('Prisma connected successfully', { component: 'prisma' });

    // Test with a simple query
    const start = Date.now();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    const duration = Date.now() - start;
    
    logger.query('SELECT 1 as test', [], duration);
    logger.debug('Query result', { result, component: 'prisma' });

    await prisma.$disconnect();
    logger.info('Prisma disconnected successfully', { component: 'prisma' });

    return {
      success: true,
      message: 'Prisma connection successful',
      details: `Database query returned: ${JSON.stringify(result)}`,
    };
  } catch (error) {
    const errorInstance = error instanceof Error ? error : new Error(String(error));
    
    logger.error('Prisma connection error', errorInstance, {
      component: 'prisma',
      databaseUrlPresent: !!databaseUrl,
      directUrlPresent: !!directUrl,
    });
    
    const errorMessage = errorInstance.message;
    
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
