"use client"

import React from 'react';
import { useAuth, useUser, useIsAuthenticated, useIsOrganizer } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AuthDebug() {
  const { state, signInAnonymously, signOut, updateAnonymousUser } = useAuth();
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isOrganizer = useIsOrganizer();

  if (state.loading) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Loading auth state...</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Auth Debug</h3>
        <div className="flex gap-2">
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Authenticated" : "Anonymous"}
          </Badge>
          <Badge variant={isOrganizer ? "default" : "outline"}>
            {isOrganizer ? "Organizer" : "Attendee"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <strong>User ID:</strong> {user?.id || "No user"}
        </div>
        <div>
          <strong>Email:</strong> {user?.email || "No email"}
        </div>
        <div>
          <strong>Name:</strong> {user?.user_metadata?.name || "No name"}
        </div>
        <div>
          <strong>Role:</strong> {state.role}
        </div>
        <div>
          <strong>Is Anonymous:</strong> {state.isAnonymous ? "Yes" : "No"}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {!user && (
          <Button 
            onClick={() => signInAnonymously({ name: "Demo Attendee" })}
            size="sm"
          >
            Sign In Anonymously
          </Button>
        )}
        
        {state.isAnonymous && (
          <Button 
            onClick={() => updateAnonymousUser({ 
              name: "Updated Attendee",
              interests: ["React", "TypeScript"] 
            })}
            variant="outline"
            size="sm"
          >
            Update Anonymous User
          </Button>
        )}

        {user && (
          <Button 
            onClick={signOut}
            variant="destructive"
            size="sm"
          >
            Sign Out
          </Button>
        )}
      </div>

      {user?.user_metadata?.interests && user.user_metadata.interests.length > 0 && (
        <div>
          <strong className="text-sm">Interests:</strong>
          <div className="flex gap-1 mt-1">
            {user.user_metadata.interests.map((interest: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
} 