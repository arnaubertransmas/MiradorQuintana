'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { CartProvider } from '@/lib/cart-context';
import { buildCategoryList } from '@/lib/categories';
import CategoryNav from './CategoryNav';
import DishListItem from './DishListItem';
import CartPanel from './CartPanel';

export default function MenuExplorer({ dishes }) {
  const categories = useMemo(() => buildCategoryList(dishes), [dishes]);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.key ?? null);

  const visibleDishes = dishes.filter((dish) => dish.category === activeCategory);
  const activeCategoryMeta = categories.find((category) => category.key === activeCategory);

  return (
    <CartProvider>
      <div className="mx-auto max-w-6xl px-4 pb-24 lg:pb-12">
        <CategoryNav categories={categories} active={activeCategory} onSelect={setActiveCategory} />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {activeCategoryMeta?.image && (
              <div className="relative mb-2 h-56 w-full overflow-hidden rounded-2xl">
                <Image
                  src={activeCategoryMeta.image}
                  alt={activeCategoryMeta.label}
                  fill
                  className="object-cover object-center"
                />
              </div>
            )}
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
