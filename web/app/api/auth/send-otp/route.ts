import { createClient } from '@supabase/supabase-js';
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
  try {
    const body = (await request.json()) as { phone?: string };
    phone = body.phone?.trim() ?? '';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!phone.startsWith('+')) {
    return NextResponse.json({ error: 'Phone must be in E.164 format (+94771234567)' }, { status: 400 });
  }

  const supabase = createClient(env.url, env.anonKey);
  const { error } = await supabase.auth.signInWithOtp({
    phone,
    options: { channel: 'sms' },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
