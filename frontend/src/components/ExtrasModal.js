'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

export default function ExtrasModal({ dish, onClose }) {
  const { dispatch } = useCart();
  const extras = Array.isArray(dish.extras) ? dish.extras : [];
  const [selected, setSelected] = useState([]);
  const [quantity, setQuantity] = useState(1);

  function toggleExtra(extra) {
    setSelected((prev) =>
      prev.some((e) => e.nom === extra.nom) ? prev.filter((e) => e.nom !== extra.nom) : [...prev, extra]
    );
  }

  const unitTotal = Number(dish.price) + selected.reduce((sum, extra) => sum + Number(extra.preu), 0);

  function handleAdd() {
    const extrasKey = selected.map((e) => e.nom).sort().join('|');
    dispatch({
      type: 'ADD_ITEM',
      item: {
        key: `${dish.id}-${extrasKey}`,
        dishId: dish.id,
        name: dish.dish,
        unitPrice: dish.price,
        quantity,
        extras: selected,
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
              const isChecked = selected.some((e) => e.nom === extra.nom);
              return (
                <label
                  key={extra.nom}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleExtra(extra)}
                      className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                    />
                    {extra.nom}
                  </span>
                  <span className="text-neutral-400">+{Number(extra.preu).toFixed(2)} €</span>
                </label>
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
