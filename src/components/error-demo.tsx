'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bug, Zap, AlertTriangle, Info } from 'lucide-react';
import { createComponentLogger } from '@/lib/logger';
import { useErrorReporter, SectionErrorBoundary, ComponentErrorBoundary } from '@/components/error-boundary';

const demoLogger = createComponentLogger('ErrorDemo');

/**
 * Component that throws an error when button is clicked
 */
function ErrorThrowingComponent() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Demo error thrown by ErrorThrowingComponent');
  }

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-2">Error Throwing Component</h4>
      <p className="text-sm text-muted-foreground mb-3">
        Click to throw an error and test the error boundary:
      </p>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShouldThrow(true)}
      >
        <Bug className="mr-2 h-4 w-4" />
        Throw Error
      </Button>
    </div>
  );
}

/**
 * Component for testing promise rejections
 */
function PromiseRejectionComponent() {
  const handleUnhandledRejection = () => {
    // Create an unhandled promise rejection
    Promise.reject(new Error('Demo unhandled promise rejection'));
  };

  const handleHandledRejection = async () => {
    try {
      await Promise.reject(new Error('Demo handled promise rejection'));
    } catch (error) {
      demoLogger.error('Caught promise rejection', error as Error);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-2">Promise Rejection Test</h4>
      <p className="text-sm text-muted-foreground mb-3">
        Test promise rejection handling:
      </p>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleUnhandledRejection}
        >
          <Zap className="mr-2 h-4 w-4" />
          Unhandled Rejection
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleHandledRejection}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Handled Rejection
        </Button>
      </div>
    </div>
  );
}

/**
 * Component for testing manual error reporting
 */
function ManualErrorReporting() {
  const { reportError } = useErrorReporter();

  const handleManualReport = () => {
    const error = new Error('Manually reported error for testing');
    reportError(error, {
      component: 'ErrorDemo',
      action: 'manual-report',
      userId: 'demo-user',
    });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-2">Manual Error Reporting</h4>
      <p className="text-sm text-muted-foreground mb-3">
        Test manual error reporting:
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleManualReport}
      >
        <Info className="mr-2 h-4 w-4" />
        Report Error
      </Button>
    </div>
  );
}

/**
 * Component for testing different log levels
 */
function LoggingDemo() {
  const testLogging = () => {
    demoLogger.debug('Debug message from demo component');
    demoLogger.info('Info message from demo component', { action: 'test-logging' });
    demoLogger.warn('Warning message from demo component');
    demoLogger.userAction('Test button clicked', { component: 'ErrorDemo' });
  };

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-medium mb-2">Logging Demo</h4>
      <p className="text-sm text-muted-foreground mb-3">
        Test different log levels (check console):
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={testLogging}
      >
        <Info className="mr-2 h-4 w-4" />
        Test Logging
      </Button>
    </div>
  );
}

/**
 * Main Error Demo Component
 * Only shown in development environment
 */
export function ErrorDemo() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Error Handling & Logging Demo
          <Badge variant="secondary">Development Only</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoggingDemo />
          <ManualErrorReporting />
          <PromiseRejectionComponent />
          
          {/* Component with error boundary */}
          <ComponentErrorBoundary context={{ component: 'ErrorDemo', section: 'error-throwing' }}>
            <ErrorThrowingComponent />
          </ComponentErrorBoundary>
        </div>
        
        {/* Section with error boundary */}
        <SectionErrorBoundary context={{ component: 'ErrorDemo', section: 'additional-tests' }}>
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2">Section Error Boundary Test</h4>
            <p className="text-sm text-muted-foreground">
              This section is wrapped with a section-level error boundary.
              Any error here will be contained to this section.
            </p>
          </div>
        </SectionErrorBoundary>

        <div className="text-xs text-muted-foreground">
          <p>
            <strong>Note:</strong> This demo component is only visible in development.
            Check your browser console to see the structured logs in action.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 