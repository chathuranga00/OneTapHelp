'use client';

import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/LiveMap').then((m) => m.LiveMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-brand-card">
      <span className="text-sm text-brand-muted">Loading map…</span>
    </div>
  ),
});

type HistoryMapProps = {
  latitude: number;
  longitude: number;
};

export function HistoryMap({ latitude, longitude }: HistoryMapProps) {
  return (
    <div className="h-full min-h-[280px]">
      <LiveMap latitude={latitude} longitude={longitude} />
    </div>
  );
}
