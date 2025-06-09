import { NextResponse } from 'next/server';
import { testPrismaConnection } from '@/lib/prisma';

export async function GET() {
  try {
    const result = await testPrismaConnection();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        details: result.details,
        timestamp: new Date().toISOString(),
      });
    } else {
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
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to test database connection',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
