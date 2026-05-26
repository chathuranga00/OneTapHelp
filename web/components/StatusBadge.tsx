import type { SosStatus } from '@/lib/types';

const styles: Record<SosStatus, string> = {
  active: 'bg-brand-red/20 text-brand-red-glow border-brand-red/50',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
  cancelled: 'bg-brand-muted/20 text-brand-muted border-brand-border',
};

export function StatusBadge({ status }: { status: SosStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${styles[status] ?? styles.cancelled}`}
    >
      {status}
    </span>
  );
}
