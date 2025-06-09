import { SupabaseConnectionTest } from '@/components/SupabaseConnectionTest';
import { Database, Settings, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Unconf2 Setup & Configuration
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Verify your development environment setup and test integrations
            before starting development.
          </p>
        </div>

        {/* Setup Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Database Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Supabase PostgreSQL database with real-time features
              </p>
              <ul className="text-xs space-y-1">
                <li>✅ Connection setup</li>
                <li>🔄 Schema definition (next)</li>
                <li>🔄 Migrations (next)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Row Level Security and authentication policies
              </p>
              <ul className="text-xs space-y-1">
                <li>✅ RLS enabled</li>
                <li>🔄 Auth policies (next)</li>
                <li>🔄 API keys secured</li>
              </ul>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-purple-500" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Environment variables and development setup
              </p>
              <ul className="text-xs space-y-1">
                <li>✅ Next.js 14 + TypeScript</li>
                <li>✅ Tailwind + ShadCN UI</li>
                <li>🔄 Environment variables</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Supabase Connection Test */}
        <SupabaseConnectionTest />

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">After Supabase Setup:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>1. ✅ Install and configure Prisma</li>
                <li>2. ✅ Define database schema models</li>
                <li>3. ✅ Set up automated migrations</li>
                <li>4. ✅ Create seed data for development</li>
                <li>5. ✅ Implement authentication wrapper</li>
              </ol>
            </div>

            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h5 className="text-sm font-medium text-blue-800 mb-2">
                📚 Documentation
              </h5>
              <p className="text-xs text-blue-700">
                Detailed setup instructions are available in{' '}
                <code className="bg-blue-100 px-1 rounded">
                  docs/supabase-setup.md
                </code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
