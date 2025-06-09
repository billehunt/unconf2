import { User, Session } from '@supabase/supabase-js';

// Auth user types
export interface AuthUser extends User {
  isAnonymous?: boolean;
}

export interface AuthSession extends Session {
  user: AuthUser;
}

// User roles for the application
export type UserRole = 'attendee' | 'organizer';

// Auth state interface
export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  isAnonymous: boolean;
  role: UserRole;
}

// Anonymous user structure
export interface AnonymousUser {
  id: string;
  isAnonymous: true;
  email?: string;
  user_metadata?: {
    name?: string;
    interests?: string[];
    eventId?: string;
  };
}

// Auth actions
export type AuthAction = 
  | { type: 'SET_SESSION'; session: AuthSession | null }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ANONYMOUS_USER'; user: AnonymousUser }
  | { type: 'CLEAR_SESSION' };

// Generate anonymous user ID
export const generateAnonymousId = (): string => {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Check if user is organizer based on session/role
export const isOrganizer = (session: AuthSession | null): boolean => {
  if (!session?.user) return false;
  
  // Check if user has organizer role in metadata or is authenticated
  return (
    session.user.user_metadata?.role === 'organizer' ||
    (!session.user.isAnonymous && !!session.user.email)
  );
};

// Check if session is anonymous
export const isAnonymousSession = (session: AuthSession | null): boolean => {
  return !session || !!session.user.isAnonymous;
};

// Get user role from session
export const getUserRole = (session: AuthSession | null): UserRole => {
  return isOrganizer(session) ? 'organizer' : 'attendee';
};

// Storage keys for anonymous users
export const STORAGE_KEYS = {
  ANONYMOUS_USER: 'unconf2_anonymous_user',
  ATTENDEE_DATA: 'unconf2_attendee_data',
} as const; 

// Admin authentication constants and functions
export const ADMIN_PASSWORD = '1106';
export const ADMIN_STORAGE_KEY = 'unconf2-admin-session';
export const validateAdminPassword = (password: string): boolean => password === ADMIN_PASSWORD;

// Server-side admin validation for API routes
export const validateAdminSession = (request: Request): boolean => {
  const adminHeader = request.headers.get('x-admin-session');
  if (!adminHeader) return false;
  
  try {
    const session = JSON.parse(adminHeader);
    return session.isAdmin && session.timestamp && Date.now() - session.timestamp < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};
