'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

function TicketContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder');
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (String(parsed.id) === String(orderId)) {
      setOrder(parsed);
    }
  }, [orderId]);

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4 text-center">
        <p className="text-neutral-500">No s&apos;ha trobat cap comanda.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-16">
      <PageHero caption="Tiquet" subtitle="Ensenya aquesta pantalla al cambrer per pagar." />

      <div className="mx-auto mt-10 max-w-sm px-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <p className="text-sm text-neutral-500">Comanda</p>
            <p className="text-2xl font-bold text-neutral-900">#{orderId}</p>
          </div>

          {order && (
            <>
              <div className="mt-4 border-t border-neutral-200 pt-4 text-center text-sm text-neutral-600">
                {order.customerName}
                {order.createdAt && (
                  <span className="block text-xs text-neutral-400">
                    {new Date(order.createdAt).toLocaleDateString('ca-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>

              <ul className="mt-4 space-y-3 border-t border-neutral-200 pt-4">
                {order.items.map((item) => {
                  const extrasTotal = (item.extras || []).reduce(
                    (sum, extra) => sum + Number(extra.preu) * extra.quantitat,
                    0
                  );
                  const lineTotal = (Number(item.unitPrice) + extrasTotal) * item.quantity;
                  return (
                    <li key={item.key} className="flex items-start justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-neutral-900">
                          {item.quantity}× {item.name}
                        </p>
                        {item.extras?.length > 0 && (
                          <p className="mt-0.5 text-xs text-neutral-400">
                            {item.extras.map((extra) => `${extra.nom} x${extra.quantitat}`).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 font-medium text-neutral-700">{lineTotal.toFixed(2)} €</span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900">
                <span>Total</span>
                <span className="text-brand-600">{Number(order.total).toFixed(2)} €</span>
              </div>
            </>
          )}

          <p className="mt-6 rounded-lg bg-neutral-50 p-3 text-center text-xs text-neutral-500">
            Ensenya aquesta pantalla al cambrer quan vulguis pagar.
          </p>

          <Link
            href={order?.tableNumber ? `/?taula=${order.tableNumber}` : '/'}
            className="mt-6 block w-full rounded-lg border border-neutral-300 px-4 py-3 text-center text-sm font-semibold text-neutral-700 transition hover:border-brand-500 hover:text-brand-600"
          >
            Fer una altra comanda
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function TicketPage() {
  return (
    <Suspense fallback={null}>
      <TicketContent />
    </Suspense>
  );
}
