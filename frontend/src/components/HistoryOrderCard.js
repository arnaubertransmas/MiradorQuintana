const STATUS_STYLES = {
  pending: { border: 'border-l-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Pendent' },
  preparing: { border: 'border-l-blue-400', badge: 'bg-blue-100 text-blue-700', label: 'En preparació' },
  completed: { border: 'border-l-emerald-400', badge: 'bg-emerald-100 text-emerald-700', label: 'Completada' },
  cancelled: { border: 'border-l-neutral-300', badge: 'bg-neutral-100 text-neutral-500', label: 'Cancel·lada' },
};

export default function HistoryOrderCard({ order, onTogglePaid }) {
  const items = Array.isArray(order.items) ? order.items : [];
  const style = STATUS_STYLES[order.estat] ?? STATUS_STYLES.pending;
  const createdAt = new Date(order.created_at);
  const canMarkPaid = order.estat === 'completed' || order.estat === 'cancelled';
  const isButtonDisabled = !order.pagat && !canMarkPaid;

  return (
    <div className={`rounded-2xl border border-l-4 border-neutral-200 bg-white p-4 shadow-sm ${style.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">
            {order.nom_client} · Taula {order.num_taula}
          </p>
          <p className="text-xs text-neutral-400">
            {createdAt.toLocaleDateString('ca-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}{' '}
            {createdAt.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })}
          </p>
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
              <span className="text-neutral-400">
                {' '}
                ({item.extres.map((extra) => `${extra.nom} x${extra.quantitat}`).join(', ')})
              </span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
        {order.pagat ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
            ✓ Pagat
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400">
            ○ Pendent de pagament
          </span>
        )}
        <button
          type="button"
          onClick={() => onTogglePaid(order)}
          disabled={isButtonDisabled}
          title={isButtonDisabled ? 'Només es pot marcar com a pagada una comanda completada o cancel·lada' : undefined}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            isButtonDisabled
              ? 'cursor-not-allowed border-neutral-200 text-neutral-300'
              : order.pagat
                ? 'border-neutral-300 text-neutral-500 hover:border-red-400 hover:text-red-500'
                : 'border-brand-300 text-brand-700 hover:bg-brand-50'
          }`}
        >
          {order.pagat ? 'Marcar com a no pagat' : 'Marcar com a pagat'}
        </button>
      </div>

      {isButtonDisabled && (
        <p className="mt-1.5 text-right text-xs text-neutral-400">
          Espera que la comanda estigui completada o cancel·lada.
        </p>
      )}
    </div>
  );
}
