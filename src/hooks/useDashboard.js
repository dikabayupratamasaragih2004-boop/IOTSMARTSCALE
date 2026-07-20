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
      try {
        if (snap.exists()) {
          const val = snap.val();
          if (val) {
            const arr = Object.values(val)
              .filter((r) => r && typeof r === 'object')
              .sort((a, b) => {
                const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
              });
            setRecords(arr);
          } else {
            setRecords([]);
          }
        } else {
          setRecords([]);
        }
      } catch (err) {
        console.error('[useDashboard] Error processing snapshot:', err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error('[useDashboard] Database listener error:', err);
      setLoading(false);
    });

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

  /* ── Data chart tahunan dari rekaman nyata ── */
  const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const yearlyMap = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    Mei: 0,
    Jun: 0,
    Jul: 0,
    Agu: 0,
    Sep: 0,
    Okt: 0,
    Nov: 0,
    Des: 0
  };
  const now = new Date();
  const currentYear = now.getFullYear();

  records.forEach((r) => {
    const d = new Date(r.created_at);
    if (d.getFullYear() === currentYear) {
      const monthName = MONTHS_ID[d.getMonth()];
      yearlyMap[monthName] = (yearlyMap[monthName] ?? 0) + (r.hasil_timbangan ?? 0);
    }
  });

  const maxYearly = Math.max(...Object.values(yearlyMap), 1);
  const chartBars = Object.entries(yearlyMap).map(([day, total]) => ({
    day,
    heightPct: Math.round((total / maxYearly) * 100),
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
