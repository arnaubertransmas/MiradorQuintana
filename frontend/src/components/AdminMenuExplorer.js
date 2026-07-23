'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildCategoryList } from '@/lib/categories';
import CategoryNav from './CategoryNav';
import AdminDishRow from './AdminDishRow';

export default function AdminMenuExplorer({ dishes, onCreate, onEdit, onDelete }) {
  const categories = useMemo(() => buildCategoryList(dishes), [dishes]);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.key ?? null);

  useEffect(() => {
    if (categories.length > 0 && !categories.some((category) => category.key === activeCategory)) {
      setActiveCategory(categories[0].key);
    }
  }, [categories, activeCategory]);

  const visibleDishes = dishes.filter((dish) => dish.category === activeCategory);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      {categories.length > 0 && (
        <CategoryNav categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onCreate}
          className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          + Nou plat
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {visibleDishes.map((dish) => (
          <AdminDishRow key={dish.id} dish={dish} onEdit={onEdit} onDelete={onDelete} />
        ))}
        {visibleDishes.length === 0 && (
          <p className="py-12 text-center text-neutral-400">No hi ha plats en aquesta categoria.</p>
        )}
      </div>
    </div>
  );
}
