// @ts-nocheck — Supabase Edge Function (Deno). Requires SUPABASE_SERVICE_ROLE_KEY (auto-injected).

import '@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

type TrackingRequest = {
  eventId: string;
  latitude: number;
  longitude: number;
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('NEXT_PUBLIC_SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({
        success: false,
        error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
      }, 500);
    }

    const payload = (await req.json()) as TrackingRequest;

    if (!payload.eventId || payload.latitude == null || payload.longitude == null) {
      return jsonResponse({
        success: false,
        error: 'eventId, latitude, and longitude are required',
      }, 400);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const updatedAt = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('sos_events')
      .update({
        latitude: payload.latitude,
        longitude: payload.longitude,
      })
      .eq('id', payload.eventId);

    if (updateError) {
      return jsonResponse({ success: false, error: updateError.message }, 500);
    }

    const channelName = `sos:${payload.eventId}`;
    const channel = supabase.channel(channelName);

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Realtime subscribe timeout')), 8000);

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          clearTimeout(timeout);
          resolve();
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          clearTimeout(timeout);
          reject(new Error(`Realtime channel error: ${status}`));
        }
      });
    });

    const broadcastPayload = {
      eventId: payload.eventId,
      latitude: payload.latitude,
      longitude: payload.longitude,
      updatedAt,
    };

    const sendStatus = await channel.send({
      type: 'broadcast',
      event: 'location_update',
      payload: broadcastPayload,
    });

    await supabase.removeChannel(channel);

    if (sendStatus !== 'ok') {
      return jsonResponse({
        success: false,
        error: `Realtime broadcast failed: ${sendStatus}`,
      }, 500);
    }

    return jsonResponse({
      success: true,
      channel: channelName,
      ...broadcastPayload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse({ success: false, error: message }, 500);
  }
});
