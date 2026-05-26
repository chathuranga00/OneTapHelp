import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-brand-black px-4 text-center">
      <h1 className="text-4xl font-black text-brand-red">404</h1>
      <p className="mt-2 text-brand-muted">Page not found</p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-red px-6 py-2 text-sm font-bold text-white hover:bg-brand-red-dark"
      >
        Go home
      </Link>
    </div>
  );
}
