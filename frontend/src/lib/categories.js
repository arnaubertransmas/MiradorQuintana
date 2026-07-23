export const CATEGORY_META = [
  { key: 'Tapes', label: 'Tapes', icon: '🍤', image: '/braves.png' },
  { key: 'Hamburgueses', label: 'Hamburgueses', icon: '🍔' },
  { key: 'Plats', label: 'Plats', icon: '🍽️' },
  { key: 'Entrepans calents', label: 'Entrepans calents', icon: '🥪' },
  { key: 'Entrepans freds', label: 'Entrepans freds', icon: '🥖' },
  { key: 'Begudes', label: 'Begudes', icon: '🥤' },
  { key: 'Especialitats', label: 'Especialitats', icon: '🍹' },
];

export function categoryIcon(category) {
  return CATEGORY_META.find((c) => c.key === category)?.icon ?? '🍴';
}

export function buildCategoryList(dishes) {
  const present = new Set(dishes.map((dish) => dish.category));
  const known = CATEGORY_META.filter((c) => present.has(c.key));
  const unknown = [...present]
    .filter((c) => !CATEGORY_META.some((k) => k.key === c))
    .map((c) => ({ key: c, label: c, icon: '🍴' }));
  return [...known, ...unknown];
}
