'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import PortalHeader from '@/components/PortalHeader';
import AdminMenuExplorer from '@/components/AdminMenuExplorer';
import DishFormModal from '@/components/DishFormModal';
import { getAllDishes, createDish, updateDish, deleteDish } from '@/lib/api';
import { getToken, clearSession } from '@/lib/auth';

function AdminBoard() {
  const router = useRouter();
  const [dishes, setDishes] = useState([]);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState(null);

  const fetchDishes = useCallback(async () => {
    try {
      const data = await getAllDishes(getToken());
      setDishes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  function handleLogout() {
    clearSession();
    router.push('/login');
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
    <main className="min-h-screen bg-neutral-50 pb-16">
      <PortalHeader
        eyebrow="Administració"
        title="Gestió del menú"
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
