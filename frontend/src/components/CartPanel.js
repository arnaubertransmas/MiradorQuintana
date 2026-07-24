'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { createOrder } from '@/lib/api';

function CartContents({ onClose }) {
  const router = useRouter();
  const { items, total, tableNumber, customerName, dispatch } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function updateQuantity(key, quantity) {
    dispatch({ type: 'SET_QUANTITY', key, quantity });
  }

  function removeItem(key) {
    dispatch({ type: 'REMOVE_ITEM', key });
  }

  function handleCustomerNameChange(event) {
    dispatch({ type: 'SET_CUSTOMER_NAME', customerName: event.target.value });
  }

  function handleTableNumberChange(event) {
    dispatch({ type: 'SET_TABLE_NUMBER', tableNumber: event.target.value });
  }

  const isCustomerNameValid = customerName.trim() !== '';
  const tableNumberValue = Number(tableNumber);
  const isTableNumberValid = tableNumber !== '' && tableNumberValue >= 1 && tableNumberValue <= 100;
  const canCheckout = items.length > 0 && isCustomerNameValid && isTableNumberValid && !submitting;

  async function handleCheckout() {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        nom_client: customerName.trim(),
        num_taula: tableNumberValue,
        items: items.map((item) => ({
          plat_id: item.dishId,
          quantitat: item.quantity,
          extres: (item.extras || []).map((extra) => ({ nom: extra.nom })),
        })),
      };
      const order = await createOrder(payload);
      sessionStorage.setItem(
        'pendingOrder',
        JSON.stringify({
          id: order.id,
          total: order.preu_total,
          tableNumber: order.num_taula,
          customerName: order.nom_client,
          itemCount: items.length,
        })
      );
      dispatch({ type: 'CLEAR' });
      router.push(`/pay?orderId=${order.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">La teva comanda</h2>
        {onClose && (
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            ✕
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-6 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-400">
          Encara no has afegit cap plat.
        </div>
      ) : (
        <div className="mt-4 max-h-80 flex-1 space-y-3 overflow-y-auto">
          {items.map((item) => {
            const extrasTotal = (item.extras || []).reduce((sum, extra) => sum + Number(extra.preu), 0);
            const lineTotal = (Number(item.unitPrice) + extrasTotal) * item.quantity;
            return (
              <div key={item.key} className="rounded-xl border border-neutral-200 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{item.name}</p>
                    {item.extras?.length > 0 && (
                      <p className="mt-0.5 text-xs text-neutral-400">
                        {item.extras.map((extra) => extra.nom).join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-xs text-neutral-400 hover:text-red-500"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-brand-600">{lineTotal.toFixed(2)} €</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 space-y-3 border-t border-neutral-200 pt-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700" htmlFor="customer-name">
            El teu nom
          </label>
          <input
            id="customer-name"
            type="text"
            value={customerName}
            onChange={handleCustomerNameChange}
            placeholder="p. ex. Anna"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <label className="block text-sm font-medium text-neutral-700" htmlFor="table-number">
          Número de taula
        </label>
        <input
          id="table-number"
          type="number"
          min={1}
          max={100}
          value={tableNumber}
          onChange={handleTableNumberChange}
          placeholder="p. ex. 12"
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-base font-semibold text-neutral-900">
        <span>Total</span>
        <span>{total.toFixed(2)} €</span>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={!canCheckout}
        className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {submitting ? 'Enviant comanda…' : 'Continuar al pagament'}
      </button>
    </div>
  );
}

export default function CartPanel() {
  const { items, total } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit lg:rounded-2xl lg:border lg:border-neutral-200 lg:bg-white lg:p-5 lg:shadow-sm">
        <CartContents />
      </aside>

      {items.length > 0 && (
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="fixed inset-x-4 bottom-4 z-10 flex items-center justify-between rounded-2xl bg-brand-600 px-5 py-4 text-white shadow-lg lg:hidden"
        >
          <span className="text-sm font-medium">
            {items.length} article{items.length > 1 ? 's' : ''}
          </span>
          <span className="text-sm font-semibold">{total.toFixed(2)} € · Veure comanda</span>
        </button>
      )}

      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <CartContents onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
