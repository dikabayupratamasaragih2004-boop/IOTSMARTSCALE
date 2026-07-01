import { useState, useEffect, useMemo, useCallback } from 'react';
import { ref, onValue, remove, update, set } from 'firebase/database';
import { db } from '../lib/firebase';
import { useDialog } from '../context/DialogContext';
import { useToast } from '../context/ToastContext';

export function useManajemenHarga() {
  const dialog = useDialog();
  const toast = useToast();

  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingPrice, setEditingPrice] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Mendengarkan data di node 'prices' secara real-time
  useEffect(() => {
    const unsub = onValue(ref(db, 'prices'), (snap) => {
      if (snap.exists()) {
        const arr = Object.values(snap.val())
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPrices(arr);
      } else {
        setPrices([]);
      }
      setLoading(false);
    }, () => setLoading(false));

    return () => unsub();
  }, []);

  // Tambah harga komoditas karet baru
  const addPrice = useCallback(async (data) => {
    setActionLoading(true);
    const id = `PRC-${Date.now()}`;
    const now = new Date().toISOString();
    try {
      await set(ref(db, `prices/${id}`), {
        id,
        komoditas: data.komoditas.trim(),
        grade: data.grade.trim(),
        harga_per_kg: parseFloat(data.harga_per_kg),
        keterangan: data.keterangan?.trim() || '',
        created_at: now,
        updated_at: now,
      });
      toast.success('Harga komoditas berhasil ditambahkan.', 'Berhasil');
      return true;
    } catch (err) {
      console.error('[useManajemenHarga] Gagal tambah:', err);
      dialog.error('Gagal menambahkan harga. Silakan coba lagi.', 'Gagal');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [dialog, toast]);

  // Edit harga komoditas karet
  const updatePrice = useCallback(async (id, data) => {
    setActionLoading(true);
    const now = new Date().toISOString();
    try {
      await update(ref(db, `prices/${id}`), {
        komoditas: data.komoditas.trim(),
        grade: data.grade.trim(),
        harga_per_kg: parseFloat(data.harga_per_kg),
        keterangan: data.keterangan?.trim() || '',
        updated_at: now,
      });
      setEditingPrice(null);
      toast.success('Harga komoditas berhasil diperbarui.', 'Berhasil');
      return true;
    } catch (err) {
      console.error('[useManajemenHarga] Gagal update:', err);
      dialog.error('Gagal memperbarui harga. Silakan coba lagi.', 'Gagal');
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [dialog, toast]);

  // Hapus harga komoditas karet
  const deletePrice = useCallback(async (id) => {
    setActionLoading(true);
    try {
      await remove(ref(db, `prices/${id}`));
      toast.success('Harga komoditas berhasil dihapus.', 'Berhasil');
    } catch (err) {
      console.error('[useManajemenHarga] Gagal hapus:', err);
      dialog.error('Gagal menghapus harga. Silakan coba lagi.', 'Gagal');
    } finally {
      setActionLoading(false);
    }
  }, [dialog, toast]);

  // Filter pencarian
  const filtered = useMemo(() => {
    if (!search.trim()) return prices;
    const q = search.toLowerCase();
    return prices.filter((p) =>
      p.komoditas?.toLowerCase().includes(q) ||
      p.grade?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q)
    );
  }, [prices, search]);

  // Statistik ringkasan
  const totalKomoditas = prices.length;
  const highestPrice = prices.length > 0 ? Math.max(...prices.map(p => p.harga_per_kg ?? 0)) : 0;
  const lowestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.harga_per_kg ?? 0)) : 0;

  return {
    loading,
    prices,
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
  };
}
