export default function StatCard({ icon, label, value, iconBgClass, iconColorClass }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-card flex items-center gap-4
                    hover:-translate-y-1 transition-transform duration-300 cursor-default">
      <div className={`h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
        <span className={`material-symbols-outlined text-3xl ${iconColorClass}`}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-text-secondary text-xs font-bold uppercase tracking-wider truncate">{label}</p>
        <h3 className="text-text-main text-2xl font-bold mt-0.5">{value ?? '—'}</h3>
      </div>
    </div>
  );
}
