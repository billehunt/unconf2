/**
 * Centralized Logging System for Unconf2
 * 
 * Provides structured logging with levels, timestamps, and context.
 * Designed to be enhanced with external services (Sentry, LogRocket, etc.) later.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
  userId?: string;
  eventId?: string;
  sessionId?: string;
  action?: string;
  component?: string;
  route?: string;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private minLogLevel: LogLevel = this.isDevelopment ? 'debug' : 'info';

  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.minLogLevel];
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: this.formatTimestamp(),
      context,
      error,
      stack: error?.stack,
    };
  }

  private outputLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    // Format for development console
    if (this.isDevelopment) {
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[entry.level];

      const color = {
        debug: '#6b7280', // gray-500
        info: '#3b82f6',  // blue-500
        warn: '#f59e0b',  // amber-500
        error: '#ef4444', // red-500
      }[entry.level];

      const prefix = `${emoji} [${entry.timestamp}] ${entry.level.toUpperCase()}`;
      
      if (entry.level === 'error') {
        console.error(
          `%c${prefix}`,
          `color: ${color}; font-weight: bold;`,
          entry.message,
          entry.context ? '\nContext:' : '',
          entry.context || '',
          entry.error || '',
          entry.stack ? '\nStack:' : '',
          entry.stack || ''
        );
      } else if (entry.level === 'warn') {
        console.warn(
          `%c${prefix}`,
          `color: ${color}; font-weight: bold;`,
          entry.message,
          entry.context || ''
        );
      } else if (entry.level === 'info') {
        console.info(
          `%c${prefix}`,
          `color: ${color}; font-weight: bold;`,
          entry.message,
          entry.context || ''
        );
      } else {
        console.debug(
          `%c${prefix}`,
          `color: ${color}; font-weight: bold;`,
          entry.message,
          entry.context || ''
        );
      }
    } else {
      // Structured JSON logging for production
      const logOutput = JSON.stringify(entry);
      
      if (entry.level === 'error') {
        console.error(logOutput);
      } else if (entry.level === 'warn') {
        console.warn(logOutput);
      } else {
        console.log(logOutput);
      }
    }
  }

  /**
   * Log debug information (development only)
   */
  debug(message: string, context?: LogContext): void {
    const entry = this.createLogEntry('debug', message, context);
    this.outputLog(entry);
  }

  /**
   * Log general information
   */
  info(message: string, context?: LogContext): void {
    const entry = this.createLogEntry('info', message, context);
    this.outputLog(entry);
  }

  /**
   * Log warnings that need attention
   */
  warn(message: string, context?: LogContext): void {
    const entry = this.createLogEntry('warn', message, context);
    this.outputLog(entry);
  }

  /**
   * Log errors that require immediate attention
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const entry = this.createLogEntry('error', message, context, error);
    this.outputLog(entry);
    
    // In production, this is where we'd send to error tracking service
    if (!this.isDevelopment) {
      this.reportError(entry);
    }
  }

  /**
   * Report error to external service (placeholder for future integration)
   */
  private reportError(entry: LogEntry): void {
    // TODO: Integrate with Sentry, LogRocket, or other error tracking
    // For now, just ensure it's captured in console.error
    console.error('ERROR_TRACKING:', JSON.stringify(entry));
  }

  /**
   * Create a child logger with default context
   */
  withContext(defaultContext: LogContext): ContextLogger {
    return new ContextLogger(this, defaultContext);
  }

  /**
   * Log database queries (debug level)
   */
  query(query: string, params?: unknown[], duration?: number): void {
    this.debug(`Database Query: ${query}`, {
      params,
      duration: duration ? `${duration}ms` : undefined,
      component: 'database',
    });
  }

  /**
   * Log API requests
   */
  apiRequest(method: string, url: string, status?: number, duration?: number): void {
    const level = status && status >= 400 ? 'warn' : 'info';
    const message = `${method} ${url}`;
    
    const entry = this.createLogEntry(level, message, {
      method,
      url,
      status,
      duration: duration ? `${duration}ms` : undefined,
      component: 'api',
    });
    
    this.outputLog(entry);
  }

  /**
   * Log user actions for analytics
   */
  userAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      action,
      component: 'user-interaction',
    });
  }
}

/**
 * Context logger that automatically includes default context
 */
class ContextLogger {
  constructor(
    private logger: Logger,
    private defaultContext: LogContext
  ) {}

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, { ...this.defaultContext, ...context });
  }

  info(message: string, context?: LogContext): void {
    this.logger.info(message, { ...this.defaultContext, ...context });
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, { ...this.defaultContext, ...context });
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(message, error, { ...this.defaultContext, ...context });
  }

  userAction(action: string, context?: LogContext): void {
    this.logger.userAction(action, { ...this.defaultContext, ...context });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in components
export type { ContextLogger };

// Convenience function for component logging
export const createComponentLogger = (componentName: string) =>
  logger.withContext({ component: componentName });

export default logger; 