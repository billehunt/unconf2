import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client for client-side operations (with fallback for missing env vars)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Server-side client with service role key (for admin operations)
export const createServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey || !supabaseUrl) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are required for server-side operations'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Type definitions for database schema (will be generated later by Prisma)
export type Database = {
  // This will be populated when we set up Prisma
  public: {
    Tables: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
};

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase error:', error);

  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }

  if (error && typeof error === 'object' && 'error_description' in error) {
    return (error as { error_description: string }).error_description;
  }

  return 'An unexpected error occurred';
};

// Connection test function
export const testSupabaseConnection = async () => {
  // First validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      message: 'Missing environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.',
    };
  }

  if (
    supabaseUrl === 'https://placeholder.supabase.co' ||
    supabaseAnonKey === 'placeholder-key'
  ) {
    return {
      success: false,
      message: 'Placeholder values detected. Please replace with your actual Supabase credentials.',
    };
  }

  try {
    const { error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means table doesn't exist, which is expected
      throw error;
    }

    return { success: true, message: 'Supabase connection successful' };
  } catch (error) {
    return {
      success: false,
      message: `Supabase connection failed: ${handleSupabaseError(error)}`,
    };
  }
};
