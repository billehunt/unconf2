"use client"

import React, { useState } from 'react';
import { useAuth, useUser, useIsAuthenticated, useIsOrganizer } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut, UserPlus, Edit3 } from 'lucide-react';

export function AuthDebug() {
  const { state, signInAnonymously, signOut, updateAnonymousUser } = useAuth();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isOrganizer = useIsOrganizer();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
  });

  // Update edit data when user changes
  React.useEffect(() => {
    setEditData({
      name: user?.user_metadata?.name || '',
      email: user?.email || '',
    });
  }, [user]);

  const handleSaveEdit = () => {
    if (state.isAnonymous) {
      updateAnonymousUser({ 
        name: editData.name,
      });
    }
    setIsEditing(false);
  };

  const handleJoinEvent = () => {
    signInAnonymously({ 
      name: editData.name || "New Attendee",
      email: editData.email || undefined
    });
  };

  if (state.loading) {
    return (
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading authentication...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-600">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Authentication Status</h3>
              <p className="text-sm text-muted-foreground">Manage your session for this demo</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={isAuthenticated ? "default" : "secondary"} className="text-xs">
              {isAuthenticated ? "Authenticated" : "Anonymous"}
            </Badge>
            <Badge variant={isOrganizer ? "default" : "outline"} className="text-xs">
              {isOrganizer ? "Organizer" : "Attendee"}
            </Badge>
          </div>
        </div>

        {/* User Info Display/Edit */}
        {user ? (
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Settings className="h-4 w-4" />
                User Information
              </h4>
              {state.isAnonymous && (
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="mt-1 h-8 text-sm"
                  />
                ) : (
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {user.user_metadata?.name || "No name set"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {user.email || "No email"}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User ID</label>
                <p className="mt-1 text-sm font-mono text-muted-foreground break-all">
                  {user.id}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</label>
                <p className="mt-1 text-sm font-medium text-foreground capitalize">
                  {state.role}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSaveEdit} size="sm" className="h-8">
                  Save Changes
                </Button>
                <Button 
                  onClick={() => setIsEditing(false)} 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                >
                  Cancel
                </Button>
              </div>
            )}

            {user.user_metadata?.interests && user.user_metadata.interests.length > 0 && (
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Interests</label>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {user.user_metadata.interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Join Event Form */
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-foreground flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Join Event as Attendee
            </h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your Name</label>
                <Input
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  placeholder="Enter your name (optional)"
                  className="mt-1 h-8 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email (Optional)</label>
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  placeholder="your@email.com"
                  type="email"
                  className="mt-1 h-8 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          {!user ? (
            <Button onClick={handleJoinEvent} className="flex items-center gap-2 h-9">
              <UserPlus className="h-4 w-4" />
              Join Event
            </Button>
          ) : (
            <Button 
              onClick={signOut}
              variant="destructive"
              className="flex items-center gap-2 h-9"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
} 