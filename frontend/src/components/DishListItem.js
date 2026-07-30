'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { categoryIcon } from '@/lib/categories';
import ExtrasModal from './ExtrasModal';

export default function DishListItem({ dish }) {
  const { items, dispatch } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  const extras = Array.isArray(dish.extras) ? dish.extras : [];
  const hasExtras = extras.length > 0;

  const simpleKey = `${dish.id}`;
  const simpleItem = items.find((item) => item.key === simpleKey);
  const dishQuantityInCart = items
    .filter((item) => item.dishId === dish.id)
    .reduce((sum, item) => sum + item.quantity, 0);

  function addSimple() {
    dispatch({
      type: 'ADD_ITEM',
      item: { key: simpleKey, dishId: dish.id, name: dish.dish, unitPrice: dish.price, quantity: 1, extras: [] },
    });
  }

  function changeSimpleQuantity(delta) {
    dispatch({ type: 'SET_QUANTITY', key: simpleKey, quantity: (simpleItem?.quantity ?? 0) + delta });
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-100 to-brand-200">
        {dish.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dish.image} alt={dish.dish} className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl">
            {categoryIcon(dish.category)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-neutral-900 sm:text-base">{dish.dish}</h3>
        {dish.description ? (
          <p className="mt-0.5 truncate text-xs text-neutral-400">{dish.description}</p>
        ) : (
          hasExtras && <p className="mt-0.5 text-xs text-neutral-400">Personalitzable amb suplements</p>
        )}
        <p className="mt-1 text-sm font-semibold text-brand-600">{Number(dish.price).toFixed(2)} €</p>
      </div>

      {hasExtras ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg leading-none text-white transition hover:bg-brand-700"
        >
          +
          {dishQuantityInCart > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs text-white">
              {dishQuantityInCart}
            </span>
          )}
        </button>
      ) : simpleItem ? (
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => changeSimpleQuantity(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:border-brand-500 hover:text-brand-600"
          >
            −
          </button>
          <span className="w-4 text-center text-sm font-semibold">{simpleItem.quantity}</span>
          <button
            type="button"
            onClick={() => changeSimpleQuantity(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 hover:border-brand-500 hover:text-brand-600"
          >
            +
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={addSimple}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-lg leading-none text-white transition hover:bg-brand-700"
        >
          +
        </button>
      )}

      {modalOpen && <ExtrasModal dish={dish} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
