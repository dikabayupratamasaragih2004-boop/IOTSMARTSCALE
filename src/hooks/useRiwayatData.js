import { useState, useEffect, useMemo, useCallback } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { db } from '../lib/firebase';
import { useDialog } from '../context/DialogContext';

const ROWS_PER_PAGE = 10;

export function useRiwayatData() {
  const dialog = useDialog();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);

  // Edit modal state
  const [editingRecord, setEditingRecord] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Real-time listener
  useEffect(() => {
    const unsub = onValue(ref(db, 'weight_records'), (snap) => {
      if (snap.exists()) {
        const arr = Object.values(snap.val())
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecords(arr);
      } else {
        setRecords([]);
      }
      setLoading(false);
    }, () => setLoading(false));

    return () => unsub();
  }, []);

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  /* ── Delete ── */
  const deleteRecord = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await remove(ref(db, `weight_records/${id}`));
      await dialog.success('Data timbangan berhasil dihapus.', 'Berhasil Hapus');
    } catch (err) {
      console.error('[useRiwayatData] Gagal hapus:', err);
      await dialog.error('Gagal menghapus data. Silakan coba lagi.', 'Gagal Hapus');
    } finally {
      setActionLoading(false);
    }
  }, [dialog]);

  /* ── Update ── */
  const updateRecord = useCallback(async (id, data) => {
    setActionLoading(true);
    try {
      const weight = parseFloat(data.hasil_timbangan);
      const price = parseFloat(data.harga_per_kg ?? 0);
      await update(ref(db, `weight_records/${id}`), {
        nama_petani: data.nama_petani.trim(),
        nama_alat: data.nama_alat.trim(),
        komoditas: data.komoditas?.trim() || '',
        harga_per_kg: price,
        hasil_timbangan: weight,
        total_harga: weight * price,
        updated_at: new Date().toISOString(),
      });
      setEditingRecord(null);
      await dialog.success('Data timbangan berhasil diperbarui.', 'Berhasil Edit');
    } catch (err) {
      console.error('[useRiwayatData] Gagal update:', err);
      await dialog.error('Gagal memperbarui data. Silakan coba lagi.', 'Gagal Edit');
    } finally {
      setActionLoading(false);
    }
  }, [dialog]);

  /* ── Derived: filter ── */
  const filtered = useMemo(() => {
    if (!search.trim()) return records;
    const q = search.toLowerCase();
    return records.filter((r) =>
      r.nama_petani?.toLowerCase().includes(q) ||
      r.nama_alat?.toLowerCase().includes(q)   ||
      r.komoditas?.toLowerCase().includes(q)   ||
      r.id?.toLowerCase().includes(q)
    );
  }, [records, search]);

  /* ── Derived: pagination ── */
  const totalPages  = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageRecords = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  /* ── Derived: summary stats ── */
  const totalBerat = filtered.reduce((s, r) => s + (r.hasil_timbangan ?? 0), 0);
  const rataRata   = filtered.length > 0 ? totalBerat / filtered.length : 0;
  const totalPendapatan = filtered.reduce((s, r) => s + (r.total_harga ?? 0), 0);

  /* ── Pagination sliding window (maks 5 tombol) ── */
  function pageNumbers() {
    const half  = 2;
    let start = Math.max(1, page - half);
    let end   = Math.min(totalPages, page + half);
    if (end - start < 4) {
      if (start === 1) end   = Math.min(totalPages, 5);
      else             start = Math.max(1, end - 4);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  const startRow = (page - 1) * ROWS_PER_PAGE + 1;
  const endRow   = Math.min(page * ROWS_PER_PAGE, filtered.length);

  return {
    loading,
    filtered,
    pageRecords,
    totalBerat,
    rataRata,
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
  };
}
