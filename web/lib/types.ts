export type SosStatus = 'active' | 'resolved' | 'cancelled';

export type TrackingEvent = {
  id: string;
  user_id: string;
  triggered_at: string;
  latitude: number | null;
  longitude: number | null;
  status: SosStatus;
  resolved_at: string | null;
  full_name: string;
};

export type SosEventRow = {
  id: string;
  user_id: string;
  triggered_at: string;
  latitude: number | null;
  longitude: number | null;
  status: SosStatus;
  resolved_at: string | null;
  audio_url: string | null;
};

export type LocationUpdatePayload = {
  eventId?: string;
  latitude: number;
  longitude: number;
  updatedAt?: string;
};
