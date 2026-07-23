export default function AdminDishRow({ dish, onEdit, onDelete }) {
  const extras = Array.isArray(dish.extras) ? dish.extras : [];

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-4 shadow-sm ${
        dish.available ? 'border-neutral-200 bg-white' : 'border-neutral-200 bg-neutral-100 opacity-70'
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-neutral-900 sm:text-base">{dish.dish}</h3>
          {!dish.available && (
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-500">No disponible</span>
          )}
        </div>
        <p className="text-xs text-neutral-400">{dish.category}</p>
        {extras.length > 0 && (
          <p className="mt-1 text-xs text-neutral-400">
            Suplements: {extras.map((extra) => `${extra.nom} (+${Number(extra.preu).toFixed(2)}€)`).join(', ')}
          </p>
        )}
        <p className="mt-1 text-sm font-semibold text-brand-600">{Number(dish.price).toFixed(2)} €</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(dish)}
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-brand-500 hover:text-brand-600"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(dish)}
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-red-400 hover:text-red-500"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
