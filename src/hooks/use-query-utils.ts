import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { logger } from '@/lib/logger';

/**
 * Hook to provide common query utilities and invalidation helpers
 */
export function useQueryUtils() {
  const queryClient = useQueryClient();

  /**
   * Invalidate all queries for a specific event
   */
  const invalidateEventQueries = (eventId: string) => {
    logger.debug('Invalidating event queries', { eventId });
    queryClient.invalidateQueries({ queryKey: queryKeys.events.byId(eventId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.rooms.byEventId(eventId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.topics.byEventId(eventId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.topics.withVotes(eventId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byEventId(eventId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.attendees.byEventId(eventId) });
  };

  /**
   * Invalidate voting-related queries
   */
  const invalidateVotingQueries = (eventId?: string) => {
    logger.debug('Invalidating voting queries', { eventId });
    queryClient.invalidateQueries({ queryKey: queryKeys.votes.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.topics.all });
    if (eventId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.byEventId(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.topics.withVotes(eventId) });
    }
  };

  /**
   * Invalidate session-related queries
   */
  const invalidateSessionQueries = (sessionId: string, eventId?: string) => {
    logger.debug('Invalidating session queries', { sessionId, eventId });
    queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byId(sessionId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.notes.bySessionId(sessionId) });
    if (eventId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.sessions.byEventId(eventId) });
    }
  };

  /**
   * Prefetch event data
   */
  const prefetchEvent = (eventId: string) => {
    logger.debug('Prefetching event data', { eventId });
    // This would typically prefetch common queries for an event
    // Implementation depends on the actual query functions that will be created
  };

  /**
   * Clear all cached data (useful for logout or switching events)
   */
  const clearAllCache = () => {
    logger.info('Clearing all React Query cache');
    queryClient.clear();
  };

  /**
   * Get cached data without triggering a fetch
   */
  const getCachedData = <T>(queryKey: readonly unknown[]): T | undefined => {
    return queryClient.getQueryData<T>(queryKey);
  };

  /**
   * Set cached data manually
   */
  const setCachedData = <T>(queryKey: readonly unknown[], data: T) => {
    queryClient.setQueryData(queryKey, data);
  };

  return {
    queryClient,
    invalidateEventQueries,
    invalidateVotingQueries,
    invalidateSessionQueries,
    prefetchEvent,
    clearAllCache,
    getCachedData,
    setCachedData,
  };
}

/**
 * Hook to get the current connection status
 */
export function useConnectionStatus() {
  // This could be expanded to include actual network status monitoring
  // For now, it's a placeholder for future implementation
  return {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isConnected: true, // This would be determined by Supabase connection status
  };
} 