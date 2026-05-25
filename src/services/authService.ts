import type { AuthError, Session } from '@supabase/supabase-js';

import { supabase } from './supabase';

export function formatPhoneE164(dialCode: string, phone: string): string {
  const dialDigits = dialCode.replace(/\D/g, '');
  let local = phone.replace(/\D/g, '');
  if (local.startsWith('0')) {
    local = local.slice(1);
  }
  // Avoid +9494... when user already typed country code (e.g. 94771234567)
  if (local.startsWith(dialDigits)) {
    local = local.slice(dialDigits.length);
  }
  return `+${dialDigits}${local}`;
}

export function getAuthErrorMessage(
  error: unknown,
  phase: 'send' | 'verify' = 'send',
): string {
  const authError = error as AuthError | null;
  const message = authError?.message ?? '';
  const lower = message.toLowerCase();
  const code = authError?.code ?? '';

  if (code === 'otp_expired' || lower.includes('expired')) {
    return 'This code has expired. Tap Send OTP to get a new one.';
  }

  if (lower.includes('rate limit') || code === 'over_sms_send_rate_limit') {
    return 'Too many attempts. Wait a moment and try again.';
  }

  if (
    lower.includes('phone provider') ||
    lower.includes('sms') ||
    code === 'sms_send_failed'
  ) {
    return 'SMS could not be sent. Enable Phone auth and add a test number or SMS provider in Supabase.';
  }

  if (lower.includes('signups disabled') || lower.includes('not enabled')) {
    return 'Phone sign-in is disabled in Supabase. Enable it under Authentication → Providers → Phone.';
  }

  if (lower.includes('invalid api key') || lower.includes('api key')) {
    return 'Invalid Supabase API key. Check EXPO_PUBLIC_SUPABASE_ANON_KEY in .env and restart the app.';
  }

  if (
    lower.includes('phone') &&
    (lower.includes('invalid') || lower.includes('format') || code === 'validation_failed')
  ) {
    return 'Invalid phone number. Use 9 digits only (no leading 0), e.g. 771234567 with +94.';
  }

  // Only show "wrong OTP" when verifying — not when sending SMS
  if (
    phase === 'verify' &&
    (code === 'otp_invalid' ||
      lower.includes('otp') ||
      lower.includes('token') ||
      lower.includes('incorrect'))
  ) {
    return 'Incorrect code. Check the 6 digits and try again.';
  }

  if (authError?.message) {
    return authError.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

export async function sendPhoneOtp(phoneE164: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phoneE164,
    options: { channel: 'sms' },
  });
  if (error) throw error;
  return data;
}

export async function verifyPhoneOtp(phoneE164: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneE164,
    token,
    type: 'sms',
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}
