'use client';

import { useState } from 'react';
import {
  Calendar,
  Users,
  Vote,
  FileText,
  Settings,
  ChevronRight,
  Heart,
  Star,
  Download,
  Share,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function ComponentShowcase() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="space-y-8 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          ShadCN UI & Lucide Icons Showcase
        </h1>
        <p className="text-muted-foreground">
          Demonstrating component integration and tree-shaking verification
        </p>
      </div>

      {/* Button Variants Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Button Variants
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Primary Button
            </Button>
            <Button variant="secondary">
              <Users className="mr-2 h-4 w-4" />
              Secondary
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Outline
            </Button>
            <Button variant="ghost">
              <Vote className="mr-2 h-4 w-4" />
              Ghost
            </Button>
            <Button variant="link">
              <FileText className="mr-2 h-4 w-4" />
              Link Button
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm">
              <Download className="mr-2 h-3 w-3" />
              Small
            </Button>
            <Button size="default">
              <Share className="mr-2 h-4 w-4" />
              Default
            </Button>
            <Button size="lg">
              <ChevronRight className="mr-2 h-5 w-5" />
              Large
            </Button>
            <Button size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input and Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Input & Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="demo-input" className="text-sm font-medium">
              Demo Input Field
            </label>
            <Input
              id="demo-input"
              placeholder="Type something to test..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {inputValue && (
              <p className="text-sm text-muted-foreground">
                You typed: <strong>{inputValue}</strong>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Badge Examples</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Icon Grid Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Lucide Icons Tree-shaking Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {[
              { Icon: Calendar, name: 'Calendar' },
              { Icon: Users, name: 'Users' },
              { Icon: Vote, name: 'Vote' },
              { Icon: FileText, name: 'FileText' },
              { Icon: Settings, name: 'Settings' },
              { Icon: Heart, name: 'Heart' },
              { Icon: Star, name: 'Star' },
              { Icon: Download, name: 'Download' },
            ].map(({ Icon, name }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
              >
                <Icon className="h-6 w-6 text-foreground" />
                <span className="text-xs text-muted-foreground">{name}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Only the icons imported above should be included in the bundle
            (tree-shaking verification).
          </p>
        </CardContent>
      </Card>

      {/* Theme Integration Test */}
      <Card>
        <CardHeader>
          <CardTitle>Theme Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded bg-primary text-primary-foreground text-center text-sm">
              Primary
            </div>
            <div className="p-4 rounded bg-secondary text-secondary-foreground text-center text-sm">
              Secondary
            </div>
            <div className="p-4 rounded bg-accent text-accent-foreground text-center text-sm">
              Accent
            </div>
            <div className="p-4 rounded bg-muted text-muted-foreground text-center text-sm">
              Muted
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Colors should adapt seamlessly between light and dark themes using
            CSS custom properties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 