import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppHeader } from '@/components/AppHeader';
import { SafeBanner } from '@/components/SafeBanner';
import { StatusBadge } from '@/components/StatusBadge';
import { HistoryMap } from '@/components/HistoryMap';
import { createClient } from '@/lib/supabase/server';
import { formatCoords, formatTriggeredAt, formatStatus } from '@/lib/format';
import type { SosEventRow, SosStatus } from '@/lib/types';

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function HistoryDetailPage({ params }: PageProps) {
  const { eventId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: event, error } = await supabase
    .from('sos_events')
    .select('id, user_id, triggered_at, latitude, longitude, status, resolved_at, audio_url')
    .eq('id', eventId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !event) {
    notFound();
  }

  const row = event as SosEventRow;
  const status = row.status as SosStatus;

  return (
    <div className="flex min-h-dvh flex-col bg-brand-black">
      <AppHeader showNav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/dashboard"
          className="text-sm text-brand-muted transition hover:text-brand-red-glow"
        >
          ← Back to dashboard
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Event details</h1>
          <StatusBadge status={status} />
        </div>

        {status === 'resolved' ? (
          <div className="mt-4">
            <SafeBanner />
          </div>
        ) : null}

        <section className="mt-6 space-y-4 rounded-xl border border-brand-border bg-brand-card p-4 sm:p-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-brand-muted">Triggered</dt>
              <dd className="mt-1 font-medium text-white">{formatTriggeredAt(row.triggered_at)}</dd>
            </div>
            <div>
              <dt className="text-brand-muted">Status</dt>
              <dd className="mt-1 font-medium text-white">{formatStatus(status)}</dd>
            </div>
            <div>
              <dt className="text-brand-muted">Coordinates</dt>
              <dd className="mt-1 font-medium text-white">
                {formatCoords(row.latitude, row.longitude)}
              </dd>
            </div>
            {row.resolved_at ? (
              <div>
                <dt className="text-brand-muted">Resolved</dt>
                <dd className="mt-1 font-medium text-white">
                  {formatTriggeredAt(row.resolved_at)}
                </dd>
              </div>
            ) : null}
            {row.audio_url ? (
              <div className="sm:col-span-2">
                <dt className="text-brand-muted">Audio recording</dt>
                <dd className="mt-2">
                  <audio controls className="w-full max-w-md" src={row.audio_url}>
                    Your browser does not support audio playback.
                  </audio>
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        {row.latitude != null && row.longitude != null ? (
          <section className="mt-6 min-h-[min(50vh,360px)] overflow-hidden rounded-xl border border-brand-border">
            <HistoryMap latitude={row.latitude} longitude={row.longitude} />
          </section>
        ) : null}

        <p className="mt-4 font-mono text-xs text-brand-muted">ID: {row.id}</p>
      </main>
    </div>
  );
}
