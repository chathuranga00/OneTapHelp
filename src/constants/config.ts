export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',

  sosHoldDurationMs: 2000,
  locationUpdateIntervalMs: 10_000,

  maxEmergencyContacts: 5,
} as const;
