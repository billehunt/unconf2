"use client"

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  AuthState, 
  AuthAction, 
  AuthSession, 
  AuthUser, 
  AnonymousUser,
  generateAnonymousId,
  isAnonymousSession,
  getUserRole,
  STORAGE_KEYS 
} from '@/lib/auth';

// Auth context
const AuthContext = createContext<{
  state: AuthState;
  signInAnonymously: (userData?: { name?: string; email?: string; eventId?: string }) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: unknown }>;
  signUp: (email: string, password: string, userData?: { name?: string }) => Promise<{ error?: unknown }>;
  signOut: () => Promise<void>;
  updateAnonymousUser: (userData: Partial<AnonymousUser['user_metadata']>) => void;
} | undefined>(undefined);

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_SESSION':
      const session = action.session;
      return {
        ...state,
        user: session?.user || null,
        session,
        loading: false,
        isAnonymous: isAnonymousSession(session),
        role: getUserRole(session),
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };
    
    case 'SET_ANONYMOUS_USER':
      const anonUser = action.user as AuthUser;
      const anonSession: AuthSession = {
        access_token: '',
        refresh_token: '',
        expires_in: 0,
        token_type: 'bearer',
        user: anonUser,
      };
      return {
        ...state,
        user: anonUser,
        session: anonSession,
        loading: false,
        isAnonymous: true,
        role: 'attendee',
      };
    
    case 'CLEAR_SESSION':
      return {
        ...state,
        user: null,
        session: null,
        loading: false,
        isAnonymous: false,
        role: 'attendee',
      };
    
    default:
      return state;
  }
};

// Initial auth state
const initialAuthState: AuthState = {
  user: null,
  session: null,
  loading: true,
  isAnonymous: false,
  role: 'attendee',
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Load anonymous user from localStorage
  const loadAnonymousUser = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANONYMOUS_USER);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load anonymous user:', error);
      localStorage.removeItem(STORAGE_KEYS.ANONYMOUS_USER);
      return null;
    }
  }, []);

  // Save anonymous user to localStorage
  const saveAnonymousUser = useCallback((user: AnonymousUser) => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.ANONYMOUS_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save anonymous user:', error);
    }
  }, []);

  // Sign in anonymously
  const signInAnonymously = useCallback(async (userData?: { 
    name?: string; 
    email?: string; 
    eventId?: string;
  }) => {
    // Check if we already have an anonymous user
    let anonUser = loadAnonymousUser();
    
    if (!anonUser) {
      anonUser = {
        id: generateAnonymousId(),
        isAnonymous: true,
        email: userData?.email,
        user_metadata: {
          name: userData?.name,
          interests: [],
          eventId: userData?.eventId,
        },
      };
      saveAnonymousUser(anonUser);
    } else if (userData) {
      // Update existing anonymous user
      anonUser = {
        ...anonUser,
        email: userData.email || anonUser.email,
        user_metadata: {
          ...anonUser.user_metadata,
          ...userData,
        },
      };
      saveAnonymousUser(anonUser);
    }

    dispatch({ type: 'SET_ANONYMOUS_USER', user: anonUser });
  }, [loadAnonymousUser, saveAnonymousUser]);

  // Sign in with email/password
  const signInWithEmail = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      dispatch({ type: 'SET_LOADING', loading: false });
      return { error };
    }

    // Clear any anonymous user data when signing in
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ANONYMOUS_USER);
    }

    return { error: null };
  }, []);

  // Sign up with email/password
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    userData?: { name?: string }
  ) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData?.name,
          role: 'organizer', // Default to organizer for sign-ups
        },
      },
    });

    if (error) {
      dispatch({ type: 'SET_LOADING', loading: false });
      return { error };
    }

    // Clear any anonymous user data when signing up
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ANONYMOUS_USER);
    }

    return { error: null };
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', loading: true });
    
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ANONYMOUS_USER);
      localStorage.removeItem(STORAGE_KEYS.ATTENDEE_DATA);
    }

    // Sign out from Supabase if authenticated
    if (!state.isAnonymous) {
      await supabase.auth.signOut();
    }

    dispatch({ type: 'CLEAR_SESSION' });
  }, [state.isAnonymous]);

  // Update anonymous user data
  const updateAnonymousUser = useCallback((userData: Partial<AnonymousUser['user_metadata']>) => {
    if (!state.isAnonymous || !state.user) return;

    const updatedUser = {
      ...state.user,
      user_metadata: {
        ...state.user.user_metadata,
        ...userData,
      },
    } as AnonymousUser;

    saveAnonymousUser(updatedUser);
    dispatch({ type: 'SET_ANONYMOUS_USER', user: updatedUser });
  }, [state.isAnonymous, state.user, saveAnonymousUser]);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        // If no authenticated session, try to load anonymous user
        const anonUser = loadAnonymousUser();
        if (anonUser) {
          dispatch({ type: 'SET_ANONYMOUS_USER', user: anonUser });
        } else {
          dispatch({ type: 'SET_LOADING', loading: false });
        }
      } else if (session) {
        // Clear any anonymous user data when we have a real session
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.ANONYMOUS_USER);
        }
        dispatch({ type: 'SET_SESSION', session: session as AuthSession });
      } else {
        // No authenticated session, try to load anonymous user
        const anonUser = loadAnonymousUser();
        if (anonUser) {
          dispatch({ type: 'SET_ANONYMOUS_USER', user: anonUser });
        } else {
          dispatch({ type: 'SET_LOADING', loading: false });
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Clear anonymous user when signing in
          if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEYS.ANONYMOUS_USER);
          }
          dispatch({ type: 'SET_SESSION', session: session as AuthSession });
        } else if (event === 'SIGNED_OUT') {
          dispatch({ type: 'CLEAR_SESSION' });
        } else if (event === 'TOKEN_REFRESHED' && session) {
          dispatch({ type: 'SET_SESSION', session: session as AuthSession });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadAnonymousUser]);

  const value = {
    state,
    signInAnonymously,
    signInWithEmail,
    signUp,
    signOut,
    updateAnonymousUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Convenience hooks
export function useUser() {
  const { state } = useAuth();
  return state.user;
}

export function useSession() {
  const { state } = useAuth();
  return state.session;
}

export function useIsAuthenticated() {
  const { state } = useAuth();
  return !!state.session && !state.isAnonymous;
}

export function useIsOrganizer() {
  const { state } = useAuth();
  return state.role === 'organizer';
} 