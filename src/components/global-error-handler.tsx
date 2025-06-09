'use client';

import { useEffect } from 'react';
import { globalErrorHandler } from '@/lib/error-handler';
import { logger } from '@/lib/logger';

/**
 * Global Error Handler Component
 * 
 * This component initializes the global error handlers for unhandled
 * promise rejections and uncaught exceptions on the client side.
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Initialize global error handlers
    globalErrorHandler.initialize();
    
    // Log app initialization
    logger.info('Application initialized', {
      component: 'app',
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    });
    
    return () => {
      // Cleanup would go here if needed
      logger.debug('Global error handler cleanup', {
        component: 'global-error-handler',
      });
    };
  }, []);

  // This component doesn't render anything
  return null;
} 