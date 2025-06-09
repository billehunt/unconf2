import { NextResponse } from 'next/server';
import { testPrismaConnection } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function GET() {
  const start = Date.now();
  
  try {
    logger.apiRequest('GET', '/api/test-prisma');
    
    const result = await testPrismaConnection();
    const duration = Date.now() - start;

    if (result.success) {
      logger.apiRequest('GET', '/api/test-prisma', 200, duration);
      
      return NextResponse.json({
        success: true,
        message: result.message,
        details: result.details,
        timestamp: new Date().toISOString(),
      });
    } else {
      logger.apiRequest('GET', '/api/test-prisma', 500, duration);
      
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          details: result.details,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const duration = Date.now() - start;
    const errorInstance = error instanceof Error ? error : new Error(String(error));
    
    logger.error('API route error', errorInstance, {
      route: '/api/test-prisma',
      method: 'GET',
      duration,
    });
    
    logger.apiRequest('GET', '/api/test-prisma', 500, duration);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to test database connection',
        details: errorInstance.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
