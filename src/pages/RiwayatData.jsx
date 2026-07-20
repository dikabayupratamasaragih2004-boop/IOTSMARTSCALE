import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRiwayatData } from '../hooks/useRiwayatData';
import { useDialog } from '../context/DialogContext';

/* ── Edit Modal ── */
function EditModal({ record, onClose, onSave, loading }) {
  const [form, setForm] = useState({
    nama_petani:     record.nama_petani     ?? '',
    nama_alat:       record.nama_alat       ?? '',
    hasil_timbangan: record.hasil_timbangan ?? '',
    komoditas:       record.komoditas       ?? '',
    harga_per_kg:    record.harga_per_kg    ?? '',
  });

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(record.id, form);
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      {/* Konten */}
      <div className="relative z-10 h-full flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-[fadeScale_0.2s_ease-out] pointer-events-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-container">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
              </div>
              <div>
                <h3 className="font-bold text-text-main text-base">Edit Data</h3>
                <p className="text-text-secondary text-xs font-mono">{record.id}</p>
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
                Nama Petani
              </label>
              <input
                type="text"
                value={form.nama_petani}
                onChange={(e) => set('nama_petani', e.target.value)}
                required
                placeholder="Masukkan nama petani"
                className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent
                           focus:border-primary focus:bg-white rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">
                Nama Alat
              </label>
              <input
                type="text"
                value={form.nama_alat}
                onChange={(e) => set('nama_alat', e.target.value)}
                required
                placeholder="Masukkan nama alat"
                className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent
                           focus:border-primary focus:bg-white rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">
                Jenis Karet / Komoditas
              </label>
              <input
                type="text"
                value={form.komoditas}
                onChange={(e) => set('komoditas', e.target.value)}
                required
                placeholder="Contoh: Karet Lateks, Karet Slab"
                className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent
                           focus:border-primary focus:bg-white rounded-xl text-sm transition-all outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">
                Tarif per Kg (Rp)
              </label>
              <input
                type="number"
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
                Hasil Timbangan (Kg)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.hasil_timbangan}
                onChange={(e) => set('hasil_timbangan', e.target.value)}
                required
                placeholder="0.00"
                className="w-full px-4 py-3 bg-surface-container-low border-2 border-transparent
                           focus:border-primary focus:bg-white rounded-xl text-sm transition-all outline-none"
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
export default function RiwayatData() {
  const dialog = useDialog();

  const {
    loading,
    filtered,
    pageRecords,
    totalBerat,
    totalPendapatan,
    search, handleSearch,
    page, setPage,
    totalPages,
    pageNumbers,
    startRow, endRow,
    ROWS_PER_PAGE,
    deleteRecord,
    updateRecord,
    actionLoading,
    editingRecord, setEditingRecord,
  } = useRiwayatData();

  async function handleDelete(r) {
    const confirmed = await dialog.confirm({
      title:        'Hapus Data?',
      message:      `Data timbangan atas nama "${r.nama_petani}" akan dihapus permanen dan tidak dapat dikembalikan.`,
      confirmLabel: 'Hapus',
      cancelLabel:  'Batal',
      confirmStyle: 'danger',
    });
    if (confirmed) deleteRecord(r.id);
  }

  return (
    <div className="space-y-4">

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-4 text-center">
          <p className="text-text-secondary text-xs font-medium mb-1">Rekaman</p>
          <p className="text-text-main text-xl sm:text-2xl font-bold truncate">
            {filtered.length} Sesi
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-4 text-center">
          <p className="text-text-secondary text-xs font-medium mb-1">Total Berat (Kg)</p>
          <p className="text-primary text-xl sm:text-2xl font-bold tabular-nums truncate" title={totalBerat.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}>
            {totalBerat.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl shadow-card p-4 text-center">
          <p className="text-text-secondary text-xs font-medium mb-1">Total Pendapatan</p>
          <p className="text-primary text-xl sm:text-2xl font-bold tabular-nums truncate" title={`Rp ${totalPendapatan.toLocaleString('id-ID')}`}>
            Rp {totalPendapatan.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* ── Table / List card ── */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center
                        justify-between border-b border-surface-container">
          <h4 className="text-text-main font-bold">Riwayat Penimbangan Karet</h4>
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
                             text-text-secondary text-lg">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari petani, jenis karet, ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-full text-sm
                         focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-text-secondary text-sm">
            <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            Memuat data...
          </div>
        ) : pageRecords.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30 block mb-3">inbox</span>
            <p className="text-text-secondary text-sm">
              {search ? 'Tidak ada data sesuai pencarian' : 'Belum ada data timbangan'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="md:hidden divide-y divide-surface-container">
              {pageRecords.map((r, i) => (
                <div key={r.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center
                                      flex-shrink-0 text-xs font-bold text-primary">
                        {(page - 1) * ROWS_PER_PAGE + i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-text-main text-sm truncate">{r.nama_petani}</p>
                        <p className="text-text-secondary text-xs truncate">
                          {r.nama_alat} • {r.komoditas || '—'}
                        </p>
                        {r.harga_per_kg > 0 && (
                          <p className="text-text-secondary text-[10px] truncate">
                            Tarif: Rp {r.harga_per_kg.toLocaleString('id-ID')}/Kg
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-primary tabular-nums text-sm">
                        {r.hasil_timbangan?.toFixed(2)} Kg
                      </p>
                      <p className="font-bold text-primary tabular-nums text-xs mt-0.5">
                        Rp {(r.total_harga ?? 0).toLocaleString('id-ID')}
                      </p>
                      <p className="text-text-secondary text-[10px] mt-0.5">
                        {r.created_at && !isNaN(new Date(r.created_at).getTime())
                          ? new Date(r.created_at).toLocaleDateString('id-ID', {
                              day: '2-digit', month: 'short', year: '2-digit',
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>
                  <p className="text-text-secondary text-[10px] font-mono mt-1.5 truncate">{r.id}</p>

                  {/* Mobile action buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditingRecord(r)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                                 bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r)}
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
                    {[
                      '#', 'ID Rekam', 'Nama Petani', 'Nama Alat',
                      'Jenis Karet', 'Tarif / Kg', 'Berat (Kg)',
                      'Total Harga (Rp)', 'Tanggal', 'Aksi'
                    ].map((h) => (
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
                  {pageRecords.map((r, i) => (
                    <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-5 py-3.5 text-text-secondary text-sm">
                        {(page - 1) * ROWS_PER_PAGE + i + 1}
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary text-xs font-mono">{r.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-sm">person</span>
                          </div>
                          <span className="font-bold text-text-main text-sm">{r.nama_petani}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary text-sm">{r.nama_alat}</td>
                      <td className="px-5 py-3.5">
                        {r.komoditas ? (
                          <span className="text-xs font-bold px-2 py-0.5 bg-surface-container text-text-main rounded-full">
                            {r.komoditas}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-text-secondary tabular-nums text-sm">
                        {r.harga_per_kg ? `Rp ${r.harga_per_kg.toLocaleString('id-ID')}` : '—'}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-text-main tabular-nums text-sm">
                        {r.hasil_timbangan?.toFixed(2)} Kg
                      </td>
                      <td className="px-5 py-3.5 font-bold text-primary tabular-nums text-sm">
                        {r.total_harga ? `Rp ${r.total_harga.toLocaleString('id-ID')}` : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary text-sm whitespace-nowrap">
                        {r.created_at && !isNaN(new Date(r.created_at).getTime())
                          ? new Date(r.created_at).toLocaleString('id-ID', {
                              dateStyle: 'short', timeStyle: 'short',
                            })
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingRecord(r)}
                            title="Edit data"
                            className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center
                                       text-primary hover:bg-primary/20 transition-colors"
                          >
                            <span className="material-symbols-outlined text-base"
                                  style={{ fontVariationSettings: "'FILL' 1" }}>edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-surface-container flex items-center justify-between gap-4">
            <p className="text-text-secondary text-xs hidden sm:block">
              {startRow}–{endRow} dari {filtered.length}
            </p>
            <div className="flex items-center gap-1 mx-auto sm:mx-0">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 rounded-full flex items-center justify-center text-text-secondary
                           hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              {pageNumbers().map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${
                    n === page
                      ? 'bg-primary text-on-primary'
                      : 'text-text-secondary hover:bg-surface-container'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 rounded-full flex items-center justify-center text-text-secondary
                           hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editingRecord && (
        <EditModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSave={updateRecord}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
