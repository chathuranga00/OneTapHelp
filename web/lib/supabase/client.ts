import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseEnv } from '@/lib/env';

export function createClient() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      'Supabase is not configured. Copy your project URL and anon key into web/.env.local (see web/.env.example).',
    );
  }
  return createBrowserClient(env.url, env.anonKey);
}
