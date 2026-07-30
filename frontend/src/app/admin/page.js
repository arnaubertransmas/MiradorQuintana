'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import PageHero from '@/components/PageHero';
import AdminMenuExplorer from '@/components/AdminMenuExplorer';
import DishFormModal from '@/components/DishFormModal';
import HistoryOrderCard from '@/components/HistoryOrderCard';
import { getAllDishes, createDish, updateDish, deleteDish, getOrderHistory } from '@/lib/api';
import { getToken, clearSession } from '@/lib/auth';

function AdminBoard() {
  const router = useRouter();
  const [view, setView] = useState('menu');
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState(null);

  const fetchDishes = useCallback(async () => {
    try {
      const data = await getAllDishes(getToken());
      setDishes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await getOrderHistory(getToken());
      setHistory(data);
      setHistoryError(null);
    } catch (err) {
      setHistoryError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
    fetchHistory();
  }, [fetchDishes, fetchHistory]);

  function handleLogout() {
    clearSession();
    router.push('/');
  }

  async function handleSave(payload) {
    const token = getToken();
    if (modalState?.mode === 'edit') {
      await updateDish(token, modalState.dish.id, payload);
    } else {
      await createDish(token, payload);
    }
    await fetchDishes();
  }

  async function handleDelete(dish) {
    if (!window.confirm(`Segur que vols eliminar "${dish.dish}"?`)) return;
    try {
      await deleteDish(getToken(), dish.id);
      await fetchDishes();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen bg-white pb-16">
      <PageHero
        caption="Administració"
        subtitle="Afegeix, edita o elimina plats de la carta."
        action={
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm text-neutral-500 transition hover:border-red-400 hover:text-red-500"
          >
            Tancar sessió
          </button>
        }
      />

      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="inline-flex rounded-full border border-neutral-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setView('menu')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              view === 'menu' ? 'bg-brand-600 text-white' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Gestió del menú
          </button>
          <button
            type="button"
            onClick={() => setView('history')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              view === 'history' ? 'bg-brand-600 text-white' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Historial d&apos;avui
          </button>
        </div>
      </div>

      {view === 'menu' ? (
        <div className="pt-8">
          {error && (
            <div className="mx-auto mb-4 max-w-4xl px-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
            </div>
          )}

          <AdminMenuExplorer
            dishes={dishes}
            onCreate={() => setModalState({ mode: 'create' })}
            onEdit={(dish) => setModalState({ mode: 'edit', dish })}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-4 pt-6">
          {historyError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {historyError}
            </div>
          )}

          <div className="space-y-3">
            {history.map((order) => (
              <HistoryOrderCard key={order.id} order={order} />
            ))}
            {history.length === 0 && !historyError && (
              <p className="py-12 text-center text-neutral-400">No hi ha comandes en les últimes 24 hores.</p>
            )}
          </div>
        </div>
      )}

      {modalState && (
        <DishFormModal
          initialDish={modalState.mode === 'edit' ? modalState.dish : null}
          onClose={() => setModalState(null)}
          onSubmit={handleSave}
        />
      )}
    </main>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth role="admin">
      <AdminBoard />
    </RequireAuth>
  );
}
