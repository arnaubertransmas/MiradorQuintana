'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PortalHeader from '@/components/PortalHeader';
import { simulatePayment } from '@/lib/api';

function PayContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | processing | paid | error
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('pendingOrder');
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (String(parsed.id) === String(orderId)) {
      setSummary(parsed);
    }
  }, [orderId]);

  async function handleConfirm() {
    setStatus('processing');
    setError(null);
    try {
      await simulatePayment(orderId);
      setStatus('paid');
      sessionStorage.removeItem('pendingOrder');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 text-center">
        <p className="text-neutral-500">No s&apos;ha trobat cap comanda per pagar.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 pb-16">
      <PortalHeader eyebrow="Pagament" title="Confirma el pagament" align="center" />

      <div className="mx-auto mt-10 max-w-sm px-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          {status === 'paid' ? (
            <>
              <p className="text-4xl">✅</p>
              <h2 className="mt-3 text-lg font-semibold text-neutral-900">Pagament confirmat!</h2>
              <p className="mt-1 text-sm text-neutral-500">La cuina ja té la teva comanda #{orderId}.</p>
              <Link
                href="/"
                className="mt-6 inline-block w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Tornar a la carta
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-neutral-500">Comanda</p>
              <p className="text-2xl font-bold text-neutral-900">#{orderId}</p>

              {summary && (
                <div className="mt-4 space-y-1 text-sm text-neutral-600">
                  <p>
                    {summary.customerName} · Taula {summary.tableNumber}
                  </p>
                  <p>
                    {summary.itemCount} article{summary.itemCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-lg font-semibold text-brand-600">{Number(summary.total).toFixed(2)} €</p>
                </div>
              )}

              <p className="mt-4 text-xs text-neutral-400">
                Simulació de pagament — aquí aniria Stripe Checkout.
              </p>

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <button
                type="button"
                onClick={handleConfirm}
                disabled={status === 'processing'}
                className="mt-6 w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {status === 'processing' ? 'Confirmant…' : 'Confirmar pagament (simulat)'}
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function PayPage() {
  return (
    <Suspense fallback={null}>
      <PayContent />
    </Suspense>
  );
}
