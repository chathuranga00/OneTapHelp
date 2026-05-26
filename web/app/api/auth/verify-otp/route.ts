import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getSupabaseEnv } from '@/lib/env';

export async function POST(request: Request) {
  const env = getSupabaseEnv();
  if (!env) {
    return NextResponse.json(
      { error: 'Supabase is not configured in web/.env.local' },
      { status: 500 },
    );
  }

  let phone: string;
  let token: string;
  try {
    const body = (await request.json()) as { phone?: string; token?: string };
    phone = body.phone?.trim() ?? '';
    token = body.token?.trim() ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!phone.startsWith('+') || token.length !== 6) {
    return NextResponse.json({ error: 'Invalid phone or OTP code' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
