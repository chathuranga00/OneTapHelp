import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';
import { AppHeader } from '@/components/AppHeader';

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-brand-black">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Sign in</h1>
          <p className="mt-2 text-sm text-brand-muted">
            Use the same mobile number as the One Tap Help app.
          </p>
        </div>
        <Suspense fallback={<p className="text-brand-muted">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
