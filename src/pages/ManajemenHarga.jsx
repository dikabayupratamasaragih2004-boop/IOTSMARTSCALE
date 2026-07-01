import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useManajemenHarga } from '../hooks/useManajemenHarga';
import { useDialog } from '../context/DialogContext';

/* ── Add/Edit Modal ── */
function PriceModal({ record, onClose, onSave, loading }) {
  const isEdit = !!record;
  const [form, setForm] = useState({
    komoditas:    record?.komoditas    ?? '',
    grade:        record?.grade        ?? '',
    harga_per_kg: record?.harga_per_kg ?? '',
    keterangan:   record?.keterangan   ?? '',
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-[fadeScale_0.2s_ease-out] pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isEdit ? 'edit' : 'add_circle'}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-text-main text-base">
                  {isEdit ? 'Edit Tarif Karet' : 'Tambah Tarif Karet'}
                </h3>
                {isEdit && <p className="text-text-secondary text-xs font-mono">{record.id}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-text-secondary text-xl">close</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">
                Jenis Karet / Komoditas
              </label>
              <input
                type="text"
                value={form.komoditas}
                onChange={(e) => set('komoditas', e.target.value)}
                required
                placeholder="Contoh: Karet Lateks, Karet Slab, Lump"
                className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent
                           focus:border-primary focus:bg-white rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">
                Grade / Kualitas
              </label>
              <input
                type="text"
                value={form.grade}
                onChange={(e) => set('grade', e.target.value)}
                required
                placeholder="Contoh: Grade A, Grade B, Kualitas 1"
                className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent
                           focus:border-primary focus:bg-white rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">
                Harga per Kg (Rp)
              </label>
              <input
                type="number"
                min="0"
                value={form.harga_per_kg}
                onChange={(e) => set('harga_per_kg', e.target.value)}
                required
                placeholder="Contoh: 12500"
                className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent
                           focus:border-primary focus:bg-white rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">
                Keterangan (Opsional)
              </label>
              <textarea
                value={form.keterangan}
                onChange={(e) => set('keterangan', e.target.value)}
                placeholder="Catatan tambahan mengenai tarif ini..."
                rows="3"
                className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent
                           focus:border-primary focus:bg-white rounded-xl text-sm transition-all outline-none resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border-2 border-surface-container text-text-secondary
                           rounded-xl font-bold text-sm hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm
                           hover:bg-[#005a3e] transition-colors flex items-center justify-center gap-2
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base"
                          style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                    Simpan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Main Page ── */
export default function ManajemenHarga() {
  const dialog = useDialog();
  const {
    loading,
    filtered,
    search,
    setSearch,
    editingPrice,
    setEditingPrice,
    actionLoading,
    addPrice,
    updatePrice,
    deletePrice,
    totalKomoditas,
    highestPrice,
    lowestPrice,
  } = useManajemenHarga();

  const [isAddOpen, setIsAddOpen] = useState(false);

  async function handleDelete(priceItem) {
    const confirmed = await dialog.confirm({
      title: 'Hapus Tarif Karet?',
      message: `Tarif untuk "${priceItem.komoditas} (${priceItem.grade})" sebesar Rp ${priceItem.harga_per_kg.toLocaleString('id-ID')}/Kg akan dihapus permanen.`,
      confirmLabel: 'Hapus',
      cancelLabel: 'Batal',
      confirmStyle: 'danger',
    });
    if (confirmed) {
      deletePrice(priceItem.id);
    }
  }

  async function handleAddSave(formData) {
    const success = await addPrice(formData);
    if (success) setIsAddOpen(false);
  }

  async function handleEditSave(formData) {
    const success = await updatePrice(editingPrice.id, formData);
    if (success) setEditingPrice(null);
  }

  return (
    <div className="space-y-4">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-4 text-center">
          <p className="text-text-secondary text-xs font-medium mb-1">Total Jenis Karet</p>
          <p className="text-text-main text-xl sm:text-2xl font-bold truncate">
            {totalKomoditas} Jenis
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-4 text-center">
          <p className="text-text-secondary text-xs font-medium mb-1">Tarif Tertinggi</p>
          <p className="text-primary text-xl sm:text-2xl font-bold tabular-nums truncate">
            Rp {highestPrice.toLocaleString('id-ID')}/Kg
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-4 text-center">
          <p className="text-text-secondary text-xs font-medium mb-1">Tarif Terendah</p>
          <p className="text-text-main text-xl sm:text-2xl font-bold tabular-nums truncate">
            Rp {lowestPrice.toLocaleString('id-ID')}/Kg
          </p>
        </div>
      </div>

      {/* ── Table & Actions Card ── */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center
                        justify-between border-b border-surface-container">
          <div>
            <h4 className="text-text-main font-bold">Daftar Tarif Karet</h4>
            <p className="text-text-secondary text-xs mt-0.5">Kelola acuan harga per kg berdasarkan kualitas/grade karet.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                               text-text-secondary text-lg">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari jenis karet atau grade..."
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-full text-sm
                           focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            {/* Tambah Button */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-5 py-2.5 bg-primary hover:bg-[#005a3e] text-white font-bold rounded-xl text-sm
                         transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Tambah Tarif
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-text-secondary text-sm">
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            Memuat data harga...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30 block mb-3">payments</span>
            <p className="text-text-secondary text-sm">
              {search ? 'Tidak ada data sesuai pencarian' : 'Belum ada data tarif karet'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="md:hidden divide-y divide-surface-container">
              {filtered.map((item) => (
                <div key={item.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-text-main text-sm">{item.komoditas}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-container text-text-secondary rounded-full">
                          {item.grade}
                        </span>
                      </div>
                      {item.keterangan && (
                        <p className="text-text-secondary text-xs mt-1 leading-relaxed truncate">{item.keterangan}</p>
                      )}
                      <p className="text-text-secondary text-[10px] font-mono mt-1">{item.id}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-primary text-sm tabular-nums">
                        Rp {item.harga_per_kg?.toLocaleString('id-ID')}/Kg
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditingPrice(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                                 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                                 bg-red-50 text-status-error text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-container bg-surface-container/40">
                    {['ID Tarif', 'Jenis Karet / Komoditas', 'Grade', 'Harga / Kg', 'Keterangan', 'Aksi'].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-5 py-3.5 text-text-secondary text-xs font-mono">{item.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-sm">payments</span>
                          </div>
                          <span className="font-bold text-text-main text-sm">{item.komoditas}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold px-2.5 py-1 bg-surface-container text-text-secondary rounded-full">
                          {item.grade}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-primary tabular-nums text-sm">
                        Rp {item.harga_per_kg?.toLocaleString('id-ID')}
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary text-xs max-w-xs truncate" title={item.keterangan}>
                        {item.keterangan || '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingPrice(item)}
                            title="Edit data"
                            className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center
                                       text-primary hover:bg-primary/20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base"
                                  style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            title="Hapus data"
                            className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center
                                       text-status-error hover:bg-red-100 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base"
                                  style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* ── Add Modal ── */}
      {isAddOpen && (
        <PriceModal
          onClose={() => setIsAddOpen(false)}
          onSave={handleAddSave}
          loading={actionLoading}
        />
      )}

      {/* ── Edit Modal ── */}
      {editingPrice && (
        <PriceModal
          record={editingPrice}
          onClose={() => setEditingPrice(null)}
          onSave={handleEditSave}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
