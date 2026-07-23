'use client';

import { useMemo, useState } from 'react';
import { CartProvider } from '@/lib/cart-context';
import { buildCategoryList } from '@/lib/categories';
import CategoryNav from './CategoryNav';
import DishListItem from './DishListItem';
import CartPanel from './CartPanel';

export default function MenuExplorer({ dishes }) {
  const categories = useMemo(() => buildCategoryList(dishes), [dishes]);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.key ?? null);

  const visibleDishes = dishes.filter((dish) => dish.category === activeCategory);

  return (
    <CartProvider>
      <div className="mx-auto max-w-6xl px-4 pb-24 lg:pb-12">
        <CategoryNav categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {visibleDishes.map((dish) => (
              <DishListItem key={dish.id} dish={dish} />
            ))}
            {visibleDishes.length === 0 && (
              <p className="py-12 text-center text-neutral-400">No hi ha plats en aquesta categoria.</p>
            )}
          </div>
          <CartPanel />
        </div>
      </div>
    </CartProvider>
  );
}
