'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import PortalHeader from '@/components/PortalHeader';
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
      const data = await getOrders(getToken());
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
    const nextStatus = order.estat === 'pending' ? 'preparing' : 'completed';
    try {
      await updateOrderStatus(getToken(), order.id, nextStatus);
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
    router.push('/login');
  }

  const pending = orders.filter((order) => order.estat === 'pending');
  const preparing = orders.filter((order) => order.estat === 'preparing');

  return (
    <main className="min-h-screen bg-neutral-50 pb-16">
      <PortalHeader
        eyebrow="Cuina"
        title="Comandes en directe"
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

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              ⏳ Pendents <span className="text-neutral-400">({pending.length})</span>
            </h2>
            <div className="space-y-3">
              {pending.map((order) => (
                <OrderCard key={order.id} order={order} onAdvance={handleAdvance} onCancel={handleCancel} />
              ))}
              {pending.length === 0 && <EmptyColumn message="Sense comandes pendents." />}
            </div>
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              👨‍🍳 En preparació <span className="text-neutral-400">({preparing.length})</span>
            </h2>
            <div className="space-y-3">
              {preparing.map((order) => (
                <OrderCard key={order.id} order={order} onAdvance={handleAdvance} onCancel={handleCancel} />
              ))}
              {preparing.length === 0 && <EmptyColumn message="Res en preparació." />}
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
