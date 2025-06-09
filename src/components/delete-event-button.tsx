'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/logger';
import { AdminAuthModal } from '@/components/admin-auth-modal';
import { ADMIN_STORAGE_KEY } from '@/lib/auth';

interface DeleteEventButtonProps {
  eventId: string;
  eventTitle: string;
  attendeeCount: number;
  topicCount: number;
}

export function DeleteEventButton({ 
  eventId, 
  eventTitle, 
  attendeeCount, 
  topicCount 
}: DeleteEventButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    checkAdminStatus();
  }, []);

  const checkAdminStatus = () => {
    if (typeof window !== 'undefined') {
      const adminSession = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession);
          if (session.isAdmin && session.timestamp && Date.now() - session.timestamp < 24 * 60 * 60 * 1000) {
            setIsAdmin(true);
          } else {
            localStorage.removeItem(ADMIN_STORAGE_KEY);
          }
        } catch {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
        }
      }
    }
  };

  const handleDeleteClick = () => {
    if (!isAdmin) {
      setShowAdminAuth(true);
      return;
    }
    setShowConfirm(true);
  };

  const handleAdminSuccess = () => {
    setShowAdminAuth(false);
    setIsAdmin(true);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/events?eventId=${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }

      logger.info('Event deleted successfully', {
        component: 'delete-event-button',
        eventId,
        eventTitle,
      });

      // Redirect to events list
      router.push('/events');
    } catch (error) {
      logger.error('Failed to delete event', error as Error, {
        component: 'delete-event-button',
        eventId,
      });
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const hasActivity = attendeeCount > 0 || topicCount > 0;

  if (!mounted) {
    return (
      <Button variant="destructive" disabled className="flex items-center gap-2">
        <Trash2 className="w-4 h-4" />
        Delete Event
      </Button>
    );
  }

  if (!showConfirm) {
    return (
      <>
        <AdminAuthModal
          isOpen={showAdminAuth}
          onClose={() => setShowAdminAuth(false)}
          onSuccess={handleAdminSuccess}
          title="Delete Event"
          description="Deleting an event requires administrator privileges"
        />
        <Button
          variant="destructive"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Event
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
      <div className="space-y-2">
        <h4 className="font-semibold text-red-900 dark:text-red-100">
          ⚠️ Delete Event: &quot;{eventTitle}&quot;?
        </h4>
        <p className="text-sm text-red-800 dark:text-red-200">
          This action cannot be undone. All event data will be permanently deleted.
        </p>
        
        {hasActivity && (
          <div className="p-3 bg-red-100 dark:bg-red-900 rounded border border-red-300 dark:border-red-700">
            <p className="text-sm text-red-900 dark:text-red-100 font-medium">
              ⚠️ This event has activity:
            </p>
            <ul className="text-sm text-red-800 dark:text-red-200 mt-1 space-y-1">
              {attendeeCount > 0 && (
                <li>• {attendeeCount} attendee{attendeeCount !== 1 ? 's' : ''} will lose access</li>
              )}
              {topicCount > 0 && (
                <li>• {topicCount} topic{topicCount !== 1 ? 's' : ''} will be deleted</li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? 'Deleting...' : 'Yes, Delete Event'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
} 