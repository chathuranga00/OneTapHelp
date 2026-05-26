'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LocationUpdatePayload, SosStatus, TrackingEvent } from '@/lib/types';
import { fetchTrackingEvent } from '@/lib/tracking';
import { formatTriggeredAt, formatStatus } from '@/lib/format';
import { LiveMap } from '@/components/LiveMap';
import { SafeBanner } from '@/components/SafeBanner';
import { StatusBadge } from '@/components/StatusBadge';
import { AppHeader } from '@/components/AppHeader';

type TrackPageClientProps = {
  eventId: string;
  initialLat?: number;
  initialLng?: number;
};

export function TrackPageClient({ eventId, initialLat, initialLng }: TrackPageClientProps) {
  const [event, setEvent] = useState<TrackingEvent | null>(null);
  const [latitude, setLatitude] = useState<number | null>(initialLat ?? null);
  const [longitude, setLongitude] = useState<number | null>(initialLng ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);

  const applyCoords = useCallback((lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    setLive(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      const row = await fetchTrackingEvent(eventId);
      if (cancelled) return;

      if (!row) {
        setError('SOS event not found or tracking is unavailable.');
        setLoading(false);
        return;
      }

      setEvent(row);
      if (row.latitude != null && row.longitude != null) {
        applyCoords(row.latitude, row.longitude);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [applyCoords, eventId]);

  useEffect(() => {
    const supabase = createClient();
    const channelName = `sos:${eventId}`;
    const channel = supabase.channel(channelName);

    channel.on('broadcast', { event: 'location_update' }, ({ payload }) => {
      const data = payload as LocationUpdatePayload;
      if (data.latitude != null && data.longitude != null) {
        applyCoords(data.latitude, data.longitude);
      }
    });

    channel.subscribe();

    const poll = setInterval(() => {
      void fetchTrackingEvent(eventId).then((row) => {
        if (!row) return;
        setEvent(row);
        if (row.latitude != null && row.longitude != null) {
          applyCoords(row.latitude, row.longitude);
        }
      });
    }, 30_000);

    return () => {
      clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [applyCoords, eventId]);

  const status = (event?.status ?? 'active') as SosStatus;
  const hasCoords = latitude != null && longitude != null;

  return (
    <div className="flex min-h-dvh flex-col bg-brand-black">
      <AppHeader title="Live tracking" />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-center text-brand-muted">Loading SOS event…</p>
        ) : error ? (
          <p className="rounded-xl border border-brand-red/40 bg-brand-red/10 px-4 py-6 text-center text-brand-red-glow">
            {error}
          </p>
        ) : event ? (
          <>
            {status === 'resolved' ? <SafeBanner /> : null}

            <section className="rounded-xl border border-brand-border bg-brand-card p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                    Person in distress
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    {event.full_name}
                  </h1>
                </div>
                <StatusBadge status={status} />
              </div>

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-brand-muted">SOS triggered</dt>
                  <dd className="mt-0.5 font-medium text-white">
                    {formatTriggeredAt(event.triggered_at)}
                  </dd>
                </div>
                <div>
                  <dt className="text-brand-muted">Status</dt>
                  <dd className="mt-0.5 font-medium text-white">{formatStatus(status)}</dd>
                </div>
                {live ? (
                  <div className="sm:col-span-2">
                    <span className="inline-flex items-center gap-2 text-brand-red-glow">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-brand-red" />
                      Live location updates
                    </span>
                  </div>
                ) : null}
              </dl>
            </section>

            <section className="relative min-h-[min(55vh,420px)] flex-1 overflow-hidden rounded-xl border border-brand-border">
              {hasCoords ? (
                <LiveMap latitude={latitude!} longitude={longitude!} />
              ) : (
                <div className="flex h-full min-h-[280px] items-center justify-center bg-brand-card p-6 text-center text-brand-muted">
                  Waiting for GPS coordinates…
                </div>
              )}
            </section>

            {hasCoords ? (
              <p className="text-center text-xs text-brand-muted">
                {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
              </p>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
}
