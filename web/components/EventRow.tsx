'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { SosEventRow, SosStatus } from '@/lib/types';
import { formatRelative, formatStatus } from '@/lib/format';
import { reverseGeocode } from '@/lib/geocode';
import { StatusBadge } from '@/components/StatusBadge';

type EventRowProps = {
  event: SosEventRow;
};

export function EventRow({ event }: EventRowProps) {
  const [locationName, setLocationName] = useState('Loading location…');

  useEffect(() => {
    if (event.latitude == null || event.longitude == null) {
      setLocationName('No location');
      return;
    }
    void reverseGeocode(event.latitude, event.longitude).then(setLocationName);
  }, [event.latitude, event.longitude]);

  return (
    <Link
      href={`/history/${event.id}`}
      className="block rounded-xl border border-brand-border bg-brand-card p-4 transition hover:border-brand-red/50 hover:bg-brand-surface sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-brand-muted">{formatRelative(event.triggered_at)}</p>
          <p className="mt-1 truncate font-medium text-white">{locationName}</p>
        </div>
        <StatusBadge status={event.status as SosStatus} />
      </div>
      <p className="mt-2 text-xs text-brand-muted">{formatStatus(event.status as SosStatus)}</p>
    </Link>
  );
}
