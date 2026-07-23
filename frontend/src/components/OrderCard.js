const STATUS_STYLES = {
  pending: { border: 'border-l-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Pendent' },
  preparing: { border: 'border-l-blue-400', badge: 'bg-blue-100 text-blue-700', label: 'En preparació' },
};

function minutesAgo(dateString) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(dateString).getTime()) / 60000));
  if (minutes < 1) return 'ara mateix';
  if (minutes === 1) return 'fa 1 min';
  return `fa ${minutes} min`;
}

export default function OrderCard({ order, onAdvance, onCancel }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const style = STATUS_STYLES[order.estat] ?? STATUS_STYLES.pending;

  return (
    <div className={`rounded-2xl border border-l-4 border-neutral-200 bg-white p-4 shadow-sm ${style.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">Taula {order.num_taula}</p>
          <p className="text-xs text-neutral-400">{minutesAgo(order.created_at)}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>{style.label}</span>
          <span className="text-sm font-semibold text-brand-600">{Number(order.preu_total).toFixed(2)} €</span>
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-sm text-neutral-700">
        {items.map((item) => (
          <li key={item.id}>
            <span className="font-medium">{item.quantitat}×</span> {item.plat_nom}
            {Array.isArray(item.extres) && item.extres.length > 0 && (
              <span className="text-neutral-400"> ({item.extres.map((extra) => extra.nom).join(', ')})</span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAdvance(order)}
          className="flex-1 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          {order.estat === 'pending' ? '👨‍🍳 Marcar en preparació' : '✅ Marcar completat'}
        </button>
        <button
          type="button"
          onClick={() => onCancel(order)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-500 transition hover:border-red-400 hover:text-red-500"
        >
          Cancel·lar
        </button>
      </div>
    </div>
  );
}
