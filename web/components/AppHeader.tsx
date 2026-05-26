import Link from 'next/link';

type AppHeaderProps = {
  title?: string;
  showNav?: boolean;
};

export function AppHeader({ title = 'One Tap Help', showNav = false }: AppHeaderProps) {
  return (
    <header className="border-b border-brand-border bg-brand-black/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red text-xs font-black tracking-wider text-white">
            SOS
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-white sm:text-base">
            {title}
          </span>
        </Link>
        {showNav ? (
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-1.5 text-brand-muted transition hover:bg-brand-surface hover:text-white"
            >
              Dashboard
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-md border border-brand-border px-3 py-1.5 text-brand-muted transition hover:border-brand-red hover:text-white"
              >
                Sign out
              </button>
            </form>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
