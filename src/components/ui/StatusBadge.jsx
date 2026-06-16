const config = {
  selesai:   { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500',  label: 'Selesai' },
  menimbang: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Menimbang' },
  idle:      { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400',   label: 'Standby' },
};

export default function StatusBadge({ status = 'idle' }) {
  const c = config[status] ?? config.idle;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
