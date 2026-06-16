import { Link } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';

function StatCard({ icon, iconBg, label, value }) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-card flex items-center gap-4
                    hover:-translate-y-0.5 transition-transform duration-300">
      <div className={`h-12 w-12 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-text-secondary text-xs font-medium truncate">{label}</p>
        <h3 className="text-text-main text-xl font-bold tabular-nums truncate">{value}</h3>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="py-16 flex items-center justify-center gap-2 text-text-secondary text-sm">
      <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      Memuat data...
    </div>
  );
}

export default function Dashboard() {
  const {
    loading,
    recentRecords,
    totalSesi,
    totalBerat,
    rataRata,
    alatEntries,
    chartBars,
  } = useDashboard();

  return (
    <div className="space-y-5">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          icon="scale"
          iconBg="bg-surface-container-low text-primary"
          label="Total Sesi Timbang"
          value={`${totalSesi} Sesi`}
        />
        <StatCard
          icon="weight"
          iconBg="bg-primary/10 text-primary"
          label="Total Berat (Kg)"
          value={totalBerat.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        />
        <StatCard
          icon="avg_pace"
          iconBg="bg-accent-blue/10 text-accent-blue"
          label="Rata-rata / Sesi"
          value={`${rataRata.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kg`}
        />
      </div>

      {/* ── Chart + Alat panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Bar chart mingguan */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-card p-5 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-text-main font-bold">Weighing Trends</h4>
              <p className="text-text-secondary text-xs mt-0.5">
                Berat total per hari (7 hari terakhir, Kg)
              </p>
            </div>
            <span className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-low rounded-lg
                             text-xs font-bold text-primary whitespace-nowrap">
              <span className="material-symbols-outlined text-base">calendar_today</span>
              <span className="hidden sm:inline">7 Hari</span>
            </span>
          </div>

          {/* Bars */}
          <div className="relative flex-1 min-h-[160px] sm:min-h-[200px] flex items-end justify-between gap-1 px-2">
            {chartBars.map(({ day, heightPct, total }) => (
              <div
                key={day}
                title={`${day}: ${total.toLocaleString('id-ID')} Kg`}
                className="group flex-1 max-w-[36px] bg-primary/15 rounded-t-lg relative cursor-default"
                style={{ height: `${Math.max(heightPct, 4)}%` }}
              >
                <div
                  className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-700"
                  style={{ height: `${heightPct > 0 ? 100 : 0}%` }}
                />
                {/* Tooltip */}
                {total > 0 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-white
                                  text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap
                                  opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {total.toFixed(0)} Kg
                  </div>
                )}
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold
                                 text-text-secondary whitespace-nowrap">
                  {day}
                </span>
              </div>
            ))}
          </div>
          <div className="h-6" />
        </div>

        {/* Distribusi alat */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl shadow-card p-5">
          <h4 className="text-text-main font-bold mb-4">Penggunaan Alat</h4>
          {alatEntries.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-6">Belum ada data</p>
          ) : (
            <div className="space-y-4">
              {alatEntries.map(({ nama, pct, color }) => (
                <div key={nama}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-text-secondary truncate max-w-[75%] text-xs">{nama}</span>
                    <span className="font-bold text-text-main text-xs">{pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container-low rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-surface-container">
          <h4 className="text-text-main font-bold">Aktivitas Terbaru</h4>
          <Link
            to="/riwayat"
            className="text-primary text-sm font-bold hover:underline flex items-center gap-0.5"
          >
            Lihat Semua
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : recentRecords.length === 0 ? (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-text-secondary/30 block mb-3">inbox</span>
            <p className="text-text-secondary text-sm">Belum ada data timbangan</p>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="md:hidden divide-y divide-surface-container">
              {recentRecords.map((r) => (
                <div key={r.id} className="px-5 py-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-text-main text-sm truncate">{r.nama_petani}</p>
                    <p className="text-text-secondary text-xs truncate">{r.nama_alat}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-primary text-sm tabular-nums">
                      {r.hasil_timbangan?.toFixed(1)} Kg
                    </p>
                    <p className="text-text-secondary text-xs">
                      {new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-container">
                    {['Nama Petani', 'Nama Alat', 'Hasil (Kg)', 'Tanggal'].map((h) => (
                      <th key={h} className="px-5 py-3 text-xs font-bold text-text-secondary uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {recentRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-primary text-sm">person</span>
                          </div>
                          <span className="font-bold text-text-main text-sm">{r.nama_petani}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary text-sm">{r.nama_alat}</td>
                      <td className="px-5 py-3.5 font-bold text-text-main tabular-nums text-sm">
                        {r.hasil_timbangan?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary text-sm whitespace-nowrap">
                        {new Date(r.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
