'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

export default function ExtrasModal({ dish, onClose }) {
  const { dispatch } = useCart();
  const extras = Array.isArray(dish.extras) ? dish.extras : [];
  const [extraQuantities, setExtraQuantities] = useState({});
  const [quantity, setQuantity] = useState(1);

  function changeExtraQuantity(nom, delta) {
    setExtraQuantities((prev) => {
      const next = Math.max(0, (prev[nom] ?? 0) + delta);
      return { ...prev, [nom]: next };
    });
  }

  const selectedExtras = extras
    .filter((extra) => (extraQuantities[extra.nom] ?? 0) > 0)
    .map((extra) => ({ nom: extra.nom, preu: extra.preu, quantitat: extraQuantities[extra.nom] }));

  const unitTotal =
    Number(dish.price) + selectedExtras.reduce((sum, extra) => sum + Number(extra.preu) * extra.quantitat, 0);

  function handleAdd() {
    const extrasKey = selectedExtras
      .map((extra) => `${extra.nom}:${extra.quantitat}`)
      .sort()
      .join('|');
    dispatch({
      type: 'ADD_ITEM',
      item: {
        key: `${dish.id}-${extrasKey}`,
        dishId: dish.id,
        name: dish.dish,
        unitPrice: dish.price,
        quantity,
        extras: selectedExtras,
      },
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl bg-white p-6 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-neutral-900">{dish.dish}</h2>
        <p className="mt-1 text-sm text-neutral-500">{Number(dish.price).toFixed(2)} €</p>

        {extras.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-neutral-700">Suplements</p>
            {extras.map((extra) => {
              const extraQuantity = extraQuantities[extra.nom] ?? 0;
              return (
                <div
                  key={extra.nom}
                  className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                >
                  <div>
                    <p className="text-neutral-900">{extra.nom}</p>
                    <p className="text-xs text-neutral-400">+{Number(extra.preu).toFixed(2)} € cada un</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeExtraQuantity(extra.nom, -1)}
                      disabled={extraQuantity === 0}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm font-semibold">{extraQuantity}</span>
                    <button
                      type="button"
                      onClick={() => changeExtraQuantity(extra.nom, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:border-brand-500 hover:text-brand-600"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">Quantitat</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-500"
            >
              −
            </button>
            <span className="w-4 text-center text-sm font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-500"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Afegir · {(unitTotal * quantity).toFixed(2)} €
        </button>
      </div>
    </div>
  );
}
