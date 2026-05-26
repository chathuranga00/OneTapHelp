import { TrackPageClient } from '@/components/TrackPageClient';

type PageProps = {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ lat?: string; lng?: string }>;
};

export default async function TrackPage({ params, searchParams }: PageProps) {
  const { eventId } = await params;
  const query = await searchParams;

  const initialLat = query.lat ? Number(query.lat) : undefined;
  const initialLng = query.lng ? Number(query.lng) : undefined;

  return (
    <TrackPageClient
      eventId={eventId}
      initialLat={Number.isFinite(initialLat) ? initialLat : undefined}
      initialLng={Number.isFinite(initialLng) ? initialLng : undefined}
    />
  );
}
