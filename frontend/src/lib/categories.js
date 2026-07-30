export const CATEGORY_META = [
  { key: 'Tapes', label: 'Tapes', icon: '🥘', image: '/braves.png' },
  { key: 'Hamburgueses', label: 'Hamburgueses', icon: '🍔' },
  { key: 'Plats', label: 'Plats', icon: '🍽️' },
  { key: 'Entrepans calents', label: 'Entrepans calents', icon: '🥪' },
  { key: 'Entrepans freds', label: 'Entrepans freds', icon: '🥖' },
  { key: 'Begudes', label: 'Begudes', icon: '🥤' },
  { key: 'Especialitats', label: 'Especialitats', icon: '🍹', image: '/mojiclara.jpg' },
];

// Thumbnails shown on the category tabs — independent from CATEGORY_META.image
// (which is only used for the big banner above the dish list).
export const CATEGORY_TAB_IMAGES = {
  // Tapes: '/braves.png',
  // Especialitats: '/mojiclara.jpg',
};

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
