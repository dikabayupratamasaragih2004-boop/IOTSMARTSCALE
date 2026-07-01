import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard',       icon: 'dashboard', label: 'Dashboard' },
  { to: '/input-timbangan', icon: 'scale',     label: 'Input Timbangan' },
  { to: '/riwayat',         icon: 'history',   label: 'Riwayat Data' },
  { to: '/harga',             icon: 'payments',  label: 'Manajemen Harga' },
];

export default function Sidebar({ onClose }) {

  return (
    <aside className="h-full flex flex-col bg-surface-container-lowest shadow-sidebar overflow-y-auto">

      {/* Brand */}
      <div className="px-6 py-7 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-primary text-xl">scale</span>
          </div>
          <div>
            <h1 className="font-bold text-base text-text-main leading-tight">AgriWeight</h1>
            <p className="text-text-secondary text-xs">Management System</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden text-text-secondary hover:text-primary p-1 rounded-lg
                       hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="px-4 pt-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">
          Menu
        </p>
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-95 text-sm font-medium
               ${isActive
                 ? 'bg-primary/10 text-primary font-semibold'
                 : 'text-text-secondary hover:bg-surface-container-low hover:text-text-main'
               }`
            }
          >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

    </aside>
  );
}
