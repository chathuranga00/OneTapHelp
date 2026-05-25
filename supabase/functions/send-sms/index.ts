// @ts-nocheck — Edge Function runs on Deno in Supabase, not in the Expo TypeScript project.
// Deploy: supabase functions deploy send-sms

import '@supabase/functions-js/edge-runtime.d.ts';

type SmsPayload = {
  phone: string;
  message: string;
  eventId?: string;
  latitude?: number;
  longitude?: number;
  contactName?: string;
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const payload = (await req.json()) as SmsPayload;

    if (!payload.phone || !payload.message) {
      return new Response(JSON.stringify({ error: 'phone and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Integrate Twilio / MessageBird / local SMS gateway
    console.log('[send-sms]', payload.phone, payload.message);

    return new Response(JSON.stringify({ ok: true, phone: payload.phone }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
