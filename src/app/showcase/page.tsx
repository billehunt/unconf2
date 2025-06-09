import { AuthDebug } from '@/components/auth-debug';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Eye, 
  Palette, 
  User, 
  Settings, 
  Calendar, 
  Vote, 
  FileText,
  Lightbulb,
  Clock,
  MapPin,
  Users
} from 'lucide-react';

export default function ShowcasePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Eye className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Component Showcase
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interactive preview of all components and features in the unconference platform
          </p>
        </div>

        {/* Authentication Demo */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Authentication System</h2>
          </div>
          <AuthDebug />
        </section>

        {/* UI Components */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">UI Components</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Buttons</h3>
              <div className="space-y-3">
                <Button className="w-full">Primary Button</Button>
                <Button variant="secondary" className="w-full">Secondary Button</Button>
                <Button variant="outline" className="w-full">Outline Button</Button>
                <Button variant="ghost" className="w-full">Ghost Button</Button>
                <Button variant="destructive" className="w-full">Destructive Button</Button>
              </div>
            </Card>

            {/* Badges */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Badges</h3>
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                </div>
              </div>
            </Card>

            {/* Form Inputs */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Form Inputs</h3>
              <div className="space-y-3">
                <Input placeholder="Text input" />
                <Input type="email" placeholder="Email input" />
                <Input type="password" placeholder="Password input" />
                <Input placeholder="Multi-line input" />
              </div>
            </Card>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Feature Cards</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Events</h3>
                  <p className="text-sm text-muted-foreground">Manage events</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-muted-foreground">Active events</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Lightbulb className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Topics</h3>
                  <p className="text-sm text-muted-foreground">Session ideas</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-600">48</div>
              <p className="text-sm text-muted-foreground">Proposed topics</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Vote className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Votes</h3>
                  <p className="text-sm text-muted-foreground">Community voting</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">156</div>
              <p className="text-sm text-muted-foreground">Total votes cast</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Attendees</h3>
                  <p className="text-sm text-muted-foreground">Registered users</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">89</div>
              <p className="text-sm text-muted-foreground">Active attendees</p>
            </Card>
          </div>
        </section>

        {/* Session Cards */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Session Examples</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Modern React Patterns</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Exploring the latest React patterns including hooks, context, and concurrent features
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>45 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Room A</span>
                </div>
                <div className="flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  <span>23 votes</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">AI in Web Development</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    How AI tools are transforming the way we build web applications
                  </p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Trending</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>60 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Room B</span>
                </div>
                <div className="flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  <span>31 votes</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Theme & Styling */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Palette className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Theme & Styling</h2>
          </div>
          
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="text-xl font-bold mb-4">Design System</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Color Palette</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-secondary rounded"></div>
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-accent rounded"></div>
                    <span className="text-sm">Accent</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Typography</h4>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">Heading 1</p>
                  <p className="text-lg font-semibold">Heading 2</p>
                  <p className="text-base">Body text</p>
                  <p className="text-sm text-muted-foreground">Muted text</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Spacing</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-white rounded border">Small padding</div>
                  <div className="p-4 bg-white rounded border">Medium padding</div>
                  <div className="p-6 bg-white rounded border">Large padding</div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
