import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';

const ALAT_COLORS = ['bg-primary', 'bg-accent-blue', 'bg-tertiary'];

export function useDashboard() {
  const [records, setRecords]   = useState([]);
  const [loading, setLoading]   = useState(true);

  // Gunakan onValue agar dashboard ikut update real-time
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

  /* ── Derived stats ── */
  const totalSesi   = records.length;
  const totalBerat  = records.reduce((s, r) => s + (r.hasil_timbangan ?? 0), 0);
  const totalPendapatan = records.reduce((s, r) => s + (r.total_harga ?? 0), 0);
  const rataRata    = totalSesi > 0 ? totalBerat / totalSesi : 0;
  const recentRecords = records.slice(0, 5);

  /* ── Hitung distribusi alat untuk progress bars ── */
  const alatMap = {};
  records.forEach((r) => {
    alatMap[r.nama_alat] = (alatMap[r.nama_alat] ?? 0) + 1;
  });
  const alatEntries = Object.entries(alatMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([nama, count], i) => ({
      nama,
      count,
      pct: Math.round((count / (totalSesi || 1)) * 100),
      color: ALAT_COLORS[i] ?? 'bg-primary',
    }));

  /* ── Data chart mingguan dari rekaman nyata ── */
  const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const weeklyMap = { Sen: 0, Sel: 0, Rab: 0, Kam: 0, Jum: 0, Sab: 0, Min: 0 };
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  records.forEach((r) => {
    const d = new Date(r.created_at);
    if (d >= sevenDaysAgo) {
      const dayName = DAYS_ID[d.getDay()];
      weeklyMap[dayName] = (weeklyMap[dayName] ?? 0) + (r.hasil_timbangan ?? 0);
    }
  });

  const maxWeekly = Math.max(...Object.values(weeklyMap), 1);
  const chartBars = Object.entries(weeklyMap).map(([day, total]) => ({
    day,
    heightPct: Math.round((total / maxWeekly) * 100),
    total,
  }));

  return {
    loading,
    records,
    recentRecords,
    /* stats */
    totalSesi,
    totalBerat,
    totalPendapatan,
    rataRata,
    /* alat */
    alatEntries,
    /* chart */
    chartBars,
  };
}
