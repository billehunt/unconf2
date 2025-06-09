import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.\n' +
      'Required variables:\n' +
      '- NEXT_PUBLIC_SUPABASE_URL\n' +
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n' +
      'See the setup instructions in docs/supabase-setup.md'
  );
}

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
});

// Server-side client with service role key (for admin operations)
export const createServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for server-side operations'
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
