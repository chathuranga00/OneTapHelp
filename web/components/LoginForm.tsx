'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { isSupabaseConfigured } from '@/lib/env';

async function postJson<T>(url: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await res.json()) as T & { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }

  return data;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/dashboard';

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const normalizedPhone = phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setError(
        'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to web/.env.local, then restart npm run dev.',
      );
      return;
    }

    setLoading(true);
    try {
      await postJson('/api/auth/send-otp', { phone: normalizedPhone });
      setOtpSent(true);
      setMessage(`Code sent to ${normalizedPhone}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await postJson('/api/auth/verify-otp', { phone: normalizedPhone, token: otp });
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={otpSent ? handleVerify : handleSendOtp} className="space-y-4">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-brand-muted">
            Mobile number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+94771234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading || (otpSent && otp.length > 0)}
            className="w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-white placeholder:text-brand-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
            required
          />
        </div>

        {otpSent ? (
          <div>
            <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-brand-muted">
              6-digit code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={loading}
              className="w-full rounded-lg border border-brand-border bg-brand-surface px-4 py-3 text-center text-lg tracking-[0.4em] text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
              required
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading || (otpSent && otp.length !== 6)}
          className="w-full rounded-lg bg-brand-red py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-red-dark disabled:opacity-50"
        >
          {loading ? 'Please wait…' : otpSent ? 'Verify & sign in' : 'Send OTP'}
        </button>

        {otpSent ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              setMessage(null);
            }}
            className="w-full text-sm text-brand-muted underline-offset-2 hover:text-white hover:underline"
          >
            Use a different number
          </button>
        ) : null}
      </form>

      {message ? <p className="mt-4 text-center text-sm text-emerald-400">{message}</p> : null}
      {error ? (
        <p className="mt-4 text-center text-sm text-brand-red-glow" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
