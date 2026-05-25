export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',

  sosHoldDurationMs: 2000,
  locationUpdateIntervalMs: 10_000,
  sosLocationUpdateIntervalMs: 30_000,
  trackingBaseUrl: process.env.EXPO_PUBLIC_TRACKING_URL ?? '',
  emergencyPoliceNumber: '119',

  maxEmergencyContacts: 5,
} as const;
