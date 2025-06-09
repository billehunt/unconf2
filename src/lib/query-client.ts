import { QueryClient } from '@tanstack/react-query';

// Default configuration for React Query
export const queryClientDefaults = {
  queries: {
    // Data is considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache data for 10 minutes before garbage collection
    gcTime: 10 * 60 * 1000,
    // Retry failed requests 3 times with exponential backoff
    retry: (failureCount: number, error: unknown) => {
      // Don't retry on 4xx client errors (except 408 timeout)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as { status: number }).status;
        if (status >= 400 && status < 500 && status !== 408) {
          return false;
        }
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Refetch on window focus for important data
    refetchOnWindowFocus: true,
    // Don't refetch on reconnect by default (Supabase handles this)
    refetchOnReconnect: false,
  },
  mutations: {
    // Retry mutations once on network errors
    retry: (failureCount: number, error: unknown) => {
      if (failureCount >= 1) return false;
      // Only retry on network errors
      if (error && typeof error === 'object') {
        const hasMessage = 'message' in error && typeof error.message === 'string';
        const hasCode = 'code' in error && typeof error.code === 'string';
        return (hasMessage && (error.message as string).includes('fetch')) || (hasCode && (error.code as string) === 'NETWORK_ERROR');
      }
      return false;
    },
  },
};

// Create the query client instance
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: queryClientDefaults,
  });
};

// Query keys factory for consistent key management
export const queryKeys = {
  // Event-related queries
  events: {
    all: ['events'] as const,
    byId: (id: string) => ['events', id] as const,
    bySlug: (slug: string) => ['events', 'slug', slug] as const,
  },
  // Room-related queries
  rooms: {
    all: ['rooms'] as const,
    byEventId: (eventId: string) => ['rooms', 'event', eventId] as const,
  },
  // Topic-related queries
  topics: {
    all: ['topics'] as const,
    byEventId: (eventId: string) => ['topics', 'event', eventId] as const,
    withVotes: (eventId: string) => ['topics', 'event', eventId, 'votes'] as const,
  },
  // Vote-related queries
  votes: {
    all: ['votes'] as const,
    byTopicId: (topicId: string) => ['votes', 'topic', topicId] as const,
    byAttendeeId: (attendeeId: string) => ['votes', 'attendee', attendeeId] as const,
  },
  // Session-related queries
  sessions: {
    all: ['sessions'] as const,
    byEventId: (eventId: string) => ['sessions', 'event', eventId] as const,
    byId: (id: string) => ['sessions', id] as const,
  },
  // Note-related queries
  notes: {
    all: ['notes'] as const,
    bySessionId: (sessionId: string) => ['notes', 'session', sessionId] as const,
  },
  // Attendee-related queries
  attendees: {
    all: ['attendees'] as const,
    byEventId: (eventId: string) => ['attendees', 'event', eventId] as const,
    byId: (id: string) => ['attendees', id] as const,
  },
} as const; 