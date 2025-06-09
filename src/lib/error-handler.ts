/**
 * Global Error Handler for Unconf2
 * 
 * Handles unhandled promise rejections and uncaught exceptions
 * that aren't caught by React error boundaries.
 */

import { logger } from './logger';

interface GlobalErrorHandler {
  initialize(): void;
  handleUnhandledRejection(event: PromiseRejectionEvent): void;
  handleError(event: ErrorEvent): void;
}

class ErrorHandler implements GlobalErrorHandler {
  private initialized = false;

  initialize(): void {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // Handle uncaught JavaScript errors
    window.addEventListener('error', this.handleError);

    // Handle unhandled errors in async functions
    window.addEventListener('rejectionhandled', (event) => {
      logger.info('Promise rejection was handled late', {
        component: 'global-error-handler',
        reason: event.reason,
      });
    });

    this.initialized = true;
    
    logger.info('Global error handler initialized', {
      component: 'global-error-handler',
    });
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    // Log the unhandled promise rejection
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason));

    logger.error('Unhandled Promise Rejection', error, {
      component: 'global-error-handler',
      type: 'unhandled-promise-rejection',
      reason: event.reason,
    });

    // Prevent the default browser behavior (logging to console)
    // We want our logger to handle this
    event.preventDefault();
  };

  handleError = (event: ErrorEvent): void => {
    // Create error instance from ErrorEvent
    const error = event.error instanceof Error 
      ? event.error 
      : new Error(event.message || 'Unknown error');

    logger.error('Uncaught JavaScript Error', error, {
      component: 'global-error-handler',
      type: 'uncaught-exception',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      message: event.message,
    });

    // Don't prevent default behavior for uncaught errors
    // as they indicate serious issues
  };
}

// Export singleton instance
export const globalErrorHandler = new ErrorHandler();

// Initialize on module load (client-side only)
if (typeof window !== 'undefined') {
  globalErrorHandler.initialize();
}

export default globalErrorHandler; 