export function SafeBanner() {
  return (
    <div
      role="status"
      className="rounded-xl border border-emerald-500/50 bg-emerald-500/15 px-4 py-4 text-center sm:px-6"
    >
      <p className="text-lg font-bold text-emerald-400 sm:text-xl">This person is now safe.</p>
      <p className="mt-1 text-sm text-emerald-300/80">The SOS alert has been resolved.</p>
    </div>
  );
}
