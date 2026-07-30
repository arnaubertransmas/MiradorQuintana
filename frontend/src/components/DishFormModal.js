'use client';

import { useState } from 'react';
import { CATEGORY_META } from '@/lib/categories';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export default function DishFormModal({ initialDish, onClose, onSubmit }) {
  const isEdit = Boolean(initialDish);
  const [plat, setPlat] = useState(initialDish?.dish ?? '');
  const [categoria, setCategoria] = useState(initialDish?.category ?? CATEGORY_META[0].key);
  const [preu, setPreu] = useState(initialDish ? String(initialDish.price) : '');
  const [imatge, setImatge] = useState(initialDish?.image ?? '');
  const [descripcio, setDescripcio] = useState(initialDish?.description ?? '');
  const [disponibilitat, setDisponibilitat] = useState(initialDish?.available ?? true);
  const [extres, setExtres] = useState(
    Array.isArray(initialDish?.extras)
      ? initialDish.extras.map((extra) => ({ nom: extra.nom, preu: String(extra.preu) }))
      : []
  );
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setImatge(url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function addExtraRow() {
    setExtres((prev) => [...prev, { nom: '', preu: '' }]);
  }

  function updateExtraRow(index, field, value) {
    setExtres((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }

  function removeExtraRow(index) {
    setExtres((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    const preuNumber = Number(preu);
    if (!plat.trim() || !categoria.trim() || Number.isNaN(preuNumber) || preuNumber <= 0) {
      setError('Omple el nom, la categoria i un preu vàlid.');
      return;
    }

    const cleanExtras = extres
      .filter((row) => row.nom.trim() !== '')
      .map((row) => ({ nom: row.nom.trim(), preu: Number(row.preu) || 0 }));

    setSaving(true);
    try {
      await onSubmit({
        plat: plat.trim(),
        categoria: categoria.trim(),
        preu: preuNumber,
        extres: cleanExtras.length > 0 ? cleanExtras : null,
        imatge: imatge.trim() || null,
        descripcio: descripcio.trim() || null,
        disponibilitat,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-neutral-900">{isEdit ? 'Editar plat' : 'Nou plat'}</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Nom</label>
            <input
              value={plat}
              onChange={(event) => setPlat(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">Categoria</label>
            <input
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
              list="category-options"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <datalist id="category-options">
              {CATEGORY_META.map((category) => (
                <option key={category.key} value={category.key} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">Preu (€)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={preu}
              onChange={(event) => setPreu(event.target.value)}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">Imatge del plat</label>
            <div className="mt-1 flex items-center gap-3">
              {imatge && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imatge}
                  alt=""
                  className="h-16 w-16 rounded-lg border border-neutral-200 object-cover"
                />
              )}
              <label className="cursor-pointer rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50">
                {uploading ? 'Pujant…' : imatge ? 'Canviar imatge' : 'Puja una imatge'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {uploadError && <p className="mt-1 text-xs text-red-600">{uploadError}</p>}
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-neutral-400">O enganxa una URL manualment</summary>
              <input
                value={imatge}
                onChange={(event) => setImatge(event.target.value)}
                placeholder="https://…"
                className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </details>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700">Descripció</label>
            <textarea
              value={descripcio}
              onChange={(event) => setDescripcio(event.target.value)}
              rows={2}
              placeholder="Breu descripció del plat…"
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-700">Suplements</label>
              <button
                type="button"
                onClick={addExtraRow}
                className="text-xs font-medium text-brand-600 hover:text-brand-700"
              >
                + Afegir suplement
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {extres.map((row, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    placeholder="Nom"
                    value={row.nom}
                    onChange={(event) => updateExtraRow(index, 'nom', event.target.value)}
                    className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Preu"
                    value={row.preu}
                    onChange={(event) => updateExtraRow(index, 'preu', event.target.value)}
                    className="w-24 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeExtraRow(index)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={disponibilitat}
              onChange={(event) => setDisponibilitat(event.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
            />
            Disponible al menú
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? 'Desant…' : 'Desar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
