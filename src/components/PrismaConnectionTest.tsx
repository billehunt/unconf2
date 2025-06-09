'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatus {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
  details?: string;
}

export function PrismaConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'idle',
    message: 'Click "Test Database Connection" to verify Prisma setup',
  });

  const [envVars, setEnvVars] = useState({
    databaseUrl: '',
    directUrl: '',
  });

  useEffect(() => {
    // Check environment variables on mount (only client-side env vars)
    const databaseUrl = process.env.DATABASE_URL || 'Not set';
    const directUrl = process.env.DIRECT_URL || 'Not set';

    setEnvVars({
      databaseUrl:
        databaseUrl !== 'Not set'
          ? `${databaseUrl.slice(0, 30)}...`
          : 'Not set',
      directUrl:
        directUrl !== 'Not set' ? `${directUrl.slice(0, 30)}...` : 'Not set',
    });
  }, []);

  const testConnection = async () => {
    setConnectionStatus({
      status: 'testing',
      message: 'Testing database connection...',
    });

    try {
      // Test Prisma connection via API route
      const response = await fetch('/api/test-prisma');
      const result = await response.json();

      if (result.success) {
        setConnectionStatus({
          status: 'success',
          message: 'Database connection successful!',
          details:
            result.details ||
            'Prisma client is properly configured and connected.',
        });
      } else {
        setConnectionStatus({
          status: 'error',
          message: 'Database connection failed',
          details: result.message || 'Unknown error occurred',
        });
      }
    } catch (error: unknown) {
      setConnectionStatus({
        status: 'error',
        message: 'Connection test failed',
        details:
          error instanceof Error
            ? error.message
            : 'Failed to reach test endpoint',
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus.status) {
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Database className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus.status) {
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Prisma Database Connection
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environment Variables Check */}
        <div>
          <h4 className="text-sm font-medium mb-3">Database Configuration</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>DATABASE_URL:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {envVars.databaseUrl}
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span>DIRECT_URL:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {envVars.directUrl}
              </code>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div>
          <h4 className="text-sm font-medium mb-3">Connection Test</h4>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium">{connectionStatus.message}</p>
            {connectionStatus.details && (
              <p className="text-xs text-muted-foreground mt-1">
                {connectionStatus.details}
              </p>
            )}
          </div>
        </div>

        {/* Test Button */}
        <Button
          onClick={testConnection}
          disabled={connectionStatus.status === 'testing'}
          className="w-full"
        >
          {connectionStatus.status === 'testing' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Test Database Connection
            </>
          )}
        </Button>

        {/* Setup Instructions */}
        {connectionStatus.status === 'error' && (
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <h5 className="text-sm font-medium text-destructive mb-2">
              Database Setup Required
            </h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1. Ensure your Supabase project is created</li>
              <li>2. Add DATABASE_URL and DIRECT_URL to .env.local</li>
              <li>3. Get database password from Supabase settings</li>
              <li>4. Run npx prisma generate to update client</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              See docs/supabase-setup.md for database connection details.
            </p>
          </div>
        )}

        {/* Success Info */}
        {connectionStatus.status === 'success' && (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h5 className="text-sm font-medium text-green-800 mb-2">
              ✅ Database Ready
            </h5>
            <p className="text-xs text-green-700">
              Prisma is connected to your Supabase PostgreSQL database. You can
              now define your data models and run migrations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
