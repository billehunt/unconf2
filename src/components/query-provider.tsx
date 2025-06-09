'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient, queryKeys } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { useEffect, useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => createQueryClient());

  useEffect(() => {
    // Set up Supabase Realtime listeners for automatic cache invalidation
    const setupRealtimeListeners = () => {
      logger.info('Setting up Supabase Realtime listeners for query invalidation');

      // Listen to all table changes and invalidate relevant queries
      const channel = supabase
        .channel('query-invalidation')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'Event' },
          (payload) => {
            logger.debug('Event table change detected', { payload });
            queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
          }
        )
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'Room' },
          (payload) => {
            logger.debug('Room table change detected', { payload });
            queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all });
            if (payload.new && typeof payload.new === 'object' && 'eventId' in payload.new) {
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.rooms.byEventId(payload.new.eventId as string) 
              });
            }
          }
        )
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'Topic' },
          (payload) => {
            logger.debug('Topic table change detected', { payload });
            queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
            if (payload.new && typeof payload.new === 'object' && 'eventId' in payload.new) {
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.topics.byEventId(payload.new.eventId as string) 
              });
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.topics.withVotes(payload.new.eventId as string) 
              });
            }
          }
        )
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'Vote' },
          (payload) => {
            logger.debug('Vote table change detected', { payload });
            queryClient.invalidateQueries({ queryKey: queryKeys.votes.all });
            if (payload.new && typeof payload.new === 'object' && 'topicId' in payload.new) {
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.votes.byTopicId(payload.new.topicId as string) 
              });
            }
            if (payload.new && typeof payload.new === 'object' && 'attendeeId' in payload.new) {
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.votes.byAttendeeId(payload.new.attendeeId as string) 
              });
            }
            // Also invalidate topic vote counts
            queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
          }
        )
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'Session' },
          (payload) => {
            logger.debug('Session table change detected', { payload });
            queryClient.invalidateQueries({ queryKey: queryKeys.sessions.all });
            if (payload.new && typeof payload.new === 'object' && 'eventId' in payload.new) {
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.sessions.byEventId(payload.new.eventId as string) 
              });
            }
          }
        )
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'Note' },
          (payload) => {
            logger.debug('Note table change detected', { payload });
            queryClient.invalidateQueries({ queryKey: queryKeys.notes.all });
            if (payload.new && typeof payload.new === 'object' && 'sessionId' in payload.new) {
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.notes.bySessionId(payload.new.sessionId as string) 
              });
            }
          }
        )
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'Attendee' },
          (payload) => {
            logger.debug('Attendee table change detected', { payload });
            queryClient.invalidateQueries({ queryKey: queryKeys.attendees.all });
            if (payload.new && typeof payload.new === 'object' && 'eventId' in payload.new) {
              queryClient.invalidateQueries({ 
                queryKey: queryKeys.attendees.byEventId(payload.new.eventId as string) 
              });
            }
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            logger.info('Successfully subscribed to Supabase Realtime for query invalidation');
          } else if (status === 'CHANNEL_ERROR') {
            logger.error('Error subscribing to Supabase Realtime channel', new Error('Channel error'), {
              component: 'query-provider',
            });
          } else if (status === 'TIMED_OUT') {
            logger.warn('Supabase Realtime subscription timed out', {
              component: 'query-provider',
            });
          } else if (status === 'CLOSED') {
            logger.warn('Supabase Realtime channel closed', {
              component: 'query-provider',
            });
          }
        });

      return channel;
    };

    const channel = setupRealtimeListeners();

    // Cleanup function
    return () => {
      logger.info('Cleaning up Supabase Realtime listeners');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
} 