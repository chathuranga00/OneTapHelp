import { AppHeader } from '@/components/AppHeader';
import { EventRow } from '@/components/EventRow';
import { createClient } from '@/lib/supabase/server';
import type { SosEventRow } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { count } = await supabase
    .from('sos_events')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { data: events, error } = await supabase
    .from('sos_events')
    .select('id, user_id, triggered_at, latitude, longitude, status, resolved_at, audio_url')
    .eq('user_id', user.id)
    .order('triggered_at', { ascending: false })
    .limit(20);

  const rows = (events ?? []) as SosEventRow[];

  return (
    <div className="flex min-h-dvh flex-col bg-brand-black">
      <AppHeader showNav />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-brand-muted">Your SOS alert history and statistics</p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-brand-border bg-brand-card p-5 sm:col-span-2 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
              Total SOS events
            </p>
            <p className="mt-2 text-4xl font-black text-brand-red sm:text-5xl">{count ?? 0}</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-white">Recent events</h2>
          {error ? (
            <p className="mt-4 text-sm text-brand-red-glow">Could not load events: {error.message}</p>
          ) : rows.length === 0 ? (
            <p className="mt-4 rounded-xl border border-brand-border bg-brand-card p-6 text-center text-brand-muted">
              No SOS events yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {rows.map((event) => (
                <li key={event.id}>
                  <EventRow event={event} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
