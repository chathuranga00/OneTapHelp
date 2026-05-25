import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { config } from '../constants';
import type { Database } from '../types/database';

export const isSupabaseConfigured = Boolean(
  config.supabaseUrl.length > 0 && config.supabaseAnonKey.length > 0,
);

/**
 * Singleton Supabase client for auth and database access.
 * Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  config.supabaseUrl,
  config.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!isSupabaseConfigured) {
    console.warn(
      '[supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. API calls will fail.',
    );
  }
  return supabase;
}
