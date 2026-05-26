import type { TrackingEvent } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export async function fetchTrackingEvent(eventId: string): Promise<TrackingEvent | null> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_sos_event_for_tracking', {
    p_event_id: eventId,
  });

  if (error) {
    console.error('[tracking] RPC error:', error.message);
    return null;
  }

  if (!data || typeof data !== 'object') return null;
  return data as TrackingEvent;
}
