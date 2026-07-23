'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { setSession, dashboardPathForRole } from '@/lib/auth';
import PortalHeader from '@/components/PortalHeader';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, role } = await login(email, password);
      setSession(token, role);
      router.push(dashboardPathForRole(role));
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 pb-16">
      <PortalHeader
        title="El Mirador de la Quintana"
        align="center"
      />

      <div className="mx-auto mt-10 max-w-sm px-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <Link href="/" className="text-sm text-neutral-400 hover:text-neutral-600">
            ← Tornar a la carta
          </Link>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="text"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700" htmlFor="password">
                Contrasenya
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {loading ? 'Iniciant sessió…' : 'Iniciar sessió'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
