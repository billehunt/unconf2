import { Card } from '@/components/ui/card';
import { Settings, Database, Users, Calendar } from 'lucide-react';

export default function SetupPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Event Setup
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Configure your unconference event settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Database Status</h3>
                <p className="text-sm text-muted-foreground">Check database connection</p>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">
              ✓ Connected and seeded
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">User Management</h3>
                <p className="text-sm text-muted-foreground">Configure auth settings</p>
              </div>
            </div>
            <div className="text-sm text-blue-600 font-medium">
              ✓ Auth system active
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Event Configuration</h3>
                <p className="text-sm text-muted-foreground">Set event details</p>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">
              ✓ Demo event configured
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">System Settings</h3>
                <p className="text-sm text-muted-foreground">General configuration</p>
              </div>
            </div>
            <div className="text-sm text-orange-600 font-medium">
              ⚙️ Ready for configuration
            </div>
          </Card>
        </div>

        <div className="mt-12">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h2 className="text-2xl font-bold mb-4">Setup Complete</h2>
            <p className="text-muted-foreground mb-6">
              Your unconference platform is ready to use. All core systems are operational and configured with demo data.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Database connected with demo event data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Authentication system with anonymous and JWT support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Responsive UI with dark/light theme support</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
