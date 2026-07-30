'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import PageHero from '@/components/PageHero';
import OrderCard from '@/components/OrderCard';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { getToken, clearSession } from '@/lib/auth';

const POLL_INTERVAL_MS = 30000;

function EmptyColumn({ message }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 p-8 text-center text-sm text-neutral-400">
      {message}
    </div>
  );
}

function KitchenBoard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getOrders(getToken(), 'preparing');
      setOrders(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function handleAdvance(order) {
    try {
      await updateOrderStatus(getToken(), order.id, 'completed');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCancel(order) {
    try {
      await updateOrderStatus(getToken(), order.id, 'cancelled');
      fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    clearSession();
    router.push('/');
  }

  return (
    <main className="min-h-screen bg-white pb-16">
      <PageHero
        caption="Cuina"
        subtitle={
          lastUpdated ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Actualitzat a les{' '}
              {lastUpdated.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          ) : (
            'Carregant comandes…'
          )
        }
        action={
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-500 transition hover:border-red-400 hover:text-red-500"
          >
            Tancar sessió
          </button>
        }
      />

      <div className="mx-auto max-w-5xl px-4 pt-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}

        <div className="grid gap-6">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              👨‍🍳 En preparació <span className="text-neutral-400">({orders.length})</span>
            </h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} onAdvance={handleAdvance} onCancel={handleCancel} />
              ))}
              {orders.length === 0 && <EmptyColumn message="Res en preparació." />}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function KitchenPage() {
  return (
    <RequireAuth role="cuina">
      <KitchenBoard />
    </RequireAuth>
  );
}
