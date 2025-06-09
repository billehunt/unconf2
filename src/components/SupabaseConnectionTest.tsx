'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatus {
  status: 'idle' | 'testing' | 'success' | 'error';
  message: string;
  details?: string;
}

export function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'idle',
    message: 'Click "Test Connection" to verify Supabase setup',
  });

  const [envVars, setEnvVars] = useState({
    url: '',
    anonKey: '',
    hasServiceKey: false,
  });

  useEffect(() => {
    // Check environment variables on mount
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    setEnvVars({
      url: url ? `${url.slice(0, 30)}...` : 'Not set',
      anonKey: anonKey ? `${anonKey.slice(0, 20)}...` : 'Not set',
      hasServiceKey,
    });

    // Auto-test if all env vars are present
    if (url && anonKey) {
      testConnection();
    }
  }, []);

  const testConnection = async () => {
    setConnectionStatus({
      status: 'testing',
      message: 'Testing connection...',
    });

    try {
      // Import dynamically to avoid SSR issues
      const { testSupabaseConnection } = await import('@/lib/supabase');
      const result = await testSupabaseConnection();

      if (result.success) {
        setConnectionStatus({
          status: 'success',
          message: 'Connection successful!',
          details: 'Supabase client is properly configured and connected.',
        });
      } else {
        setConnectionStatus({
          status: 'error',
          message: 'Connection failed',
          details: result.message,
        });
      }
    } catch (error: unknown) {
      setConnectionStatus({
        status: 'error',
        message: 'Configuration error',
        details:
          error instanceof Error ? error.message : 'Unknown error occurred',
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
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
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
          Supabase Connection Status
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environment Variables Check */}
        <div>
          <h4 className="text-sm font-medium mb-3">Environment Variables</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span>NEXT_PUBLIC_SUPABASE_URL:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {envVars.url}
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {envVars.anonKey}
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span>SUPABASE_SERVICE_ROLE_KEY:</span>
              <Badge variant={envVars.hasServiceKey ? 'default' : 'secondary'}>
                {envVars.hasServiceKey ? 'Set' : 'Not Set'}
              </Badge>
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
            'Test Connection'
          )}
        </Button>

        {/* Setup Instructions */}
        {connectionStatus.status === 'error' && (
          <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
            <h5 className="text-sm font-medium text-destructive mb-2">
              Setup Required
            </h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1. Create a Supabase project at supabase.com</li>
              <li>2. Copy env.local.template to .env.local</li>
              <li>3. Fill in your Supabase URL and API keys</li>
              <li>4. Restart your development server</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              See docs/supabase-setup.md for detailed instructions.
            </p>
          </div>
        )}

        {/* Success Info */}
        {connectionStatus.status === 'success' && (
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h5 className="text-sm font-medium text-green-800 mb-2">
              ✅ Ready for Development
            </h5>
            <p className="text-xs text-green-700">
              Your Supabase connection is working! You can now proceed with
              setting up Prisma and defining your database schema.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
