// @ts-nocheck — Edge Function runs on Deno in Supabase, not in the Expo TypeScript project.
// Deploy: supabase functions deploy send-sms

import '@supabase/functions-js/edge-runtime.d.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

type SmsRequest = {
  to: string;
  message: string;
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed' }, 405);
  }

  try {
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      return jsonResponse({
        success: false,
        error: 'Missing Twilio configuration (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER)',
      }, 500);
    }

    const payload = (await req.json()) as SmsRequest;

    if (!payload.to || !payload.message) {
      return jsonResponse({ success: false, error: 'to and message are required' }, 400);
    }

    const twilioUrl =
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const credentials = btoa(`${accountSid}:${authToken}`);
    const body = new URLSearchParams({
      To: payload.to,
      From: fromNumber,
      Body: payload.message,
    });

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      const errorMessage =
        typeof twilioData?.message === 'string'
          ? twilioData.message
          : `Twilio request failed (${twilioResponse.status})`;
      return jsonResponse({ success: false, error: errorMessage }, twilioResponse.status);
    }

    const messageId = typeof twilioData?.sid === 'string' ? twilioData.sid : '';

    return jsonResponse({ success: true, sid: messageId });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ success: false, error: message }, 500);
  }
});
