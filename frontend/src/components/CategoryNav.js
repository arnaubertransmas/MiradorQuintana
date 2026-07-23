'use client';

export default function CategoryNav({ categories, active, onSelect }) {
  return (
    <div className="sticky top-0 z-[5] -mx-4 border-b border-neutral-200 bg-neutral-50/95 px-4 py-3 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((category) => {
          const isActive = category.key === active;
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => onSelect(category.key)}
              className={`flex shrink-0 flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs font-medium transition ${
                isActive
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-neutral-500 hover:bg-neutral-100'
              }`}
            >
              <span className="text-lg leading-none">{category.icon}</span>
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
