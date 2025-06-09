'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { logger, LogContext } from '@/lib/logger';

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showErrorDetails?: boolean;
  context?: LogContext;
  resetOnPropsChange?: boolean;
  level?: 'page' | 'section' | 'component';
}

/**
 * Main Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error with full context
    const context = {
      ...this.props.context,
      errorId: this.state.errorId,
      level: this.props.level || 'component',
      componentStack: errorInfo.componentStack,
      errorBoundary: errorInfo.errorBoundary,
    };

    logger.error('React Error Boundary caught an error', error, context);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      errorInfo,
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when props change (if enabled)
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = (): void => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

    logger.info('Error boundary reset', {
      ...this.props.context,
      level: this.props.level || 'component',
    });
  };

  handleRetry = (): void => {
    this.resetErrorBoundary();
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI based on level
      return this.renderDefaultErrorUI();
    }

    return this.props.children;
  }

  private renderDefaultErrorUI(): ReactNode {
    const { level = 'component', showErrorDetails = process.env.NODE_ENV === 'development' } = this.props;
    const { error, errorInfo, errorId } = this.state;

    // Page-level error
    if (level === 'page') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleReload} className="w-full">
                  Reload Page
                </Button>
                <Button variant="ghost" onClick={this.handleGoHome} className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>
              
              {showErrorDetails && error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    <Bug className="inline mr-1 h-3 w-3" />
                    Error Details (Development)
                  </summary>
                  <div className="mt-2 p-3 bg-muted rounded-lg text-xs font-mono">
                    <div className="text-red-600 font-semibold">Error ID: {errorId}</div>
                    <div className="mt-2">
                      <strong>Message:</strong> {error.message}
                    </div>
                    {error.stack && (
                      <div className="mt-2">
                        <strong>Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                      </div>
                    )}
                    {errorInfo?.componentStack && (
                      <div className="mt-2">
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">{errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Section-level error
    if (level === 'section') {
      return (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-medium text-red-900 dark:text-red-100">
                  Section Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                  This section encountered an error and could not load properly.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={this.handleRetry}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Retry
                  </Button>
                  {showErrorDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.error('Error Details:', { error, errorInfo, errorId })}
                      className="text-red-700 hover:bg-red-100"
                    >
                      <Bug className="mr-1 h-3 w-3" />
                      Log Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Component-level error (minimal)
    return (
      <div className="border border-red-200 bg-red-50 rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 text-red-800">
          <AlertTriangle className="h-4 w-4" />
          <span>Component error occurred</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={this.handleRetry}
            className="ml-auto h-6 px-2 text-xs"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
}

/**
 * Higher-order component for wrapping components with error boundaries
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for manually reporting errors to the logging system
 */
export function useErrorReporter() {
  const reportError = React.useCallback((error: Error, context?: LogContext) => {
    logger.error('Manual error report', error, {
      ...context,
      source: 'manual-report',
    });
  }, []);

  return { reportError };
}

/**
 * Page-level error boundary for wrapping entire pages
 */
export const PageErrorBoundary: React.FC<{
  children: ReactNode;
  context?: LogContext;
}> = ({ children, context }) => (
  <ErrorBoundary
    level="page"
    context={context}
    resetOnPropsChange
    showErrorDetails={process.env.NODE_ENV === 'development'}
  >
    {children}
  </ErrorBoundary>
);

/**
 * Section-level error boundary for wrapping page sections
 */
export const SectionErrorBoundary: React.FC<{
  children: ReactNode;
  context?: LogContext;
}> = ({ children, context }) => (
  <ErrorBoundary
    level="section"
    context={context}
    resetOnPropsChange
    showErrorDetails={process.env.NODE_ENV === 'development'}
  >
    {children}
  </ErrorBoundary>
);

/**
 * Component-level error boundary for wrapping individual components
 */
export const ComponentErrorBoundary: React.FC<{
  children: ReactNode;
  context?: LogContext;
}> = ({ children, context }) => (
  <ErrorBoundary
    level="component"
    context={context}
    resetOnPropsChange
    showErrorDetails={process.env.NODE_ENV === 'development'}
  >
    {children}
  </ErrorBoundary>
); 