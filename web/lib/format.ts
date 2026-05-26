import { format, formatDistanceToNow } from 'date-fns';

export function formatTriggeredAt(iso: string): string {
  try {
    return format(new Date(iso), 'PPpp');
  } catch {
    return iso;
  }
}

export function formatRelative(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return '';
  }
}

export function formatStatus(status: string): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'resolved':
      return 'Resolved';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export function formatCoords(lat: number | null, lng: number | null): string {
  if (lat == null || lng == null) return 'Location unavailable';
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}
