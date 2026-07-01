import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useDialog } from '../../context/DialogContext';

const pageTitles = {
  '/dashboard':       { section: 'Dashboard',       title: 'Main Dashboard' },
  '/input-timbangan': { section: 'Input Timbangan', title: 'Input Timbangan Real-time' },
  '/riwayat':         { section: 'Riwayat Data',    title: 'Riwayat Penimbangan' },
  '/harga':           { section: 'Harga Karet',     title: 'Manajemen Harga Karet' },
};

const mobileNav = [
  { to: '/dashboard', icon: 'dashboard', label: 'Beranda' },
  { to: '/riwayat',   icon: 'history',   label: 'Riwayat' },
];

export default function AppLayout() {
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);

  const location  = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const dialog = useDialog();

  async function handleLogout() {
    setProfileOpen(false);
    const confirmed = await dialog.confirm({
      title:        'Konfirmasi Keluar',
      message:      'Apakah Anda yakin ingin keluar dari sistem?',
      confirmLabel: 'Ya, Keluar',
      cancelLabel:  'Batal',
      confirmStyle: 'danger',
    });
    if (confirmed) await logout();
  }

  const pageInfo    = pageTitles[location.pathname] ?? { section: 'AgriWeight', title: 'AgriWeight' };
  const isInputPage = location.pathname === '/input-timbangan';

  return (
    <div className="bg-surface text-on-surface min-h-screen">

      {/* ── Desktop Sidebar (fixed) ── */}
      <aside className="fixed left-0 top-0 h-screen z-40 w-72 hidden lg:flex flex-col
                        bg-surface-container-lowest shadow-sidebar">
        <Sidebar />
      </aside>

      {/* ── Mobile Sidebar Drawer ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 shadow-2xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main area (offset by sidebar on desktop) ── */}
      <div className="lg:ml-72 flex flex-col min-h-screen">

        {/* ── Sticky Header ── */}
        <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md
                           border-b border-surface-container flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">

            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">

              {/* Hamburger — mobile only */}
              <button
                className="lg:hidden p-2 -ml-2 rounded-xl text-text-secondary
                           hover:bg-surface-container transition-colors flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka menu"
              >
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>

              {/* Mobile logo */}
              <div className="lg:hidden flex items-center gap-2 min-w-0">
                <div className="h-7 w-7 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-primary text-base">scale</span>
                </div>
                <span className="font-bold text-primary text-base truncate">AgriWeight</span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">

              {/* Search */}
              {searchOpen ? (
                <div className="flex items-center bg-surface-container-low rounded-full
                                px-3 py-2 gap-2 w-44 sm:w-60 transition-all">
                  <span className="material-symbols-outlined text-text-secondary text-lg flex-shrink-0">
                    search
                  </span>
                  <input
                    autoFocus
                    type="text"
                    placeholder="Cari..."
                    className="bg-transparent text-sm outline-none w-full text-text-main"
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="h-9 w-9 rounded-full flex items-center justify-center
                             text-text-secondary hover:bg-surface-container transition-colors"
                  aria-label="Cari"
                >
                  <span className="material-symbols-outlined text-xl">search</span>
                </button>
              )}

              {/* Notifications */}
              <button
                className="h-9 w-9 rounded-full flex items-center justify-center relative
                           text-text-secondary hover:bg-surface-container transition-colors"
                aria-label="Notifikasi"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-status-error rounded-full" />
              </button>

              {/* Avatar + Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="h-9 w-9 rounded-full bg-primary flex items-center justify-center
                             hover:opacity-90 active:scale-95 transition-all"
                  aria-label="Profil"
                >
                  <span className="material-symbols-outlined text-on-primary text-xl">person</span>
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 z-50
                                    bg-surface-container-lowest rounded-2xl
                                    shadow-[0_8px_32px_rgba(0,0,0,0.12)]
                                    border border-surface-container overflow-hidden">
                      {/* User info */}
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-container">
                        <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-on-primary text-lg">person</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-text-main text-sm font-bold truncate">Admin</p>
                          <p className="text-text-secondary text-xs truncate">{user?.email}</p>
                        </div>
                      </div>
                      {/* Logout */}
                      <div className="p-1.5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                     text-sm font-medium text-status-error
                                     hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">logout</span>
                          Keluar
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile page subtitle */}
          <div className="lg:hidden px-4 pb-2 -mt-1">
            <p className="text-text-secondary text-xs font-medium">{pageInfo.title}</p>
          </div>
        </header>

        {/* ── Page Content ── */}
        <div className={`flex-1 px-4 lg:px-8 pt-6 max-w-[1600px] w-full mx-auto
                        ${isInputPage ? 'pb-28 lg:pb-6' : 'pb-28 lg:pb-10'}`}>
          <Outlet />
        </div>
      </div>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
                      bg-surface-container-lowest
                      shadow-[0_-1px_0_rgba(0,0,0,0.06),0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around h-16 px-2">

          {/* Beranda */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-5 py-1 rounded-xl transition-colors min-w-0
               ${isActive ? 'text-primary' : 'text-text-secondary'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined text-2xl transition-all
                  ${isActive ? 'text-primary' : ''}`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  dashboard
                </span>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : ''}`}>
                  Beranda
                </span>
              </>
            )}
          </NavLink>

          {/* FAB — Input Timbangan */}
          <div className="flex flex-col items-center -mt-5 flex-shrink-0">
            <button
              onClick={() => navigate('/input-timbangan')}
              className={`h-14 w-14 rounded-full flex items-center justify-center
                         shadow-[0_4px_20px_rgba(0,105,72,0.35)] active:scale-95 transition-all
                         border-4 border-surface
                         ${isInputPage ? 'bg-[#047857]' : 'bg-primary'}`}
              aria-label="Input Timbangan"
            >
              <span className="material-symbols-outlined text-on-primary text-2xl">scale</span>
            </button>
            <span className={`text-[10px] font-semibold mt-0.5
              ${isInputPage ? 'text-primary' : 'text-text-secondary'}`}>
              Timbang
            </span>
          </div>

          {/* Riwayat */}
          <NavLink
            to="/riwayat"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-5 py-1 rounded-xl transition-colors min-w-0
               ${isActive ? 'text-primary' : 'text-text-secondary'}`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  history
                </span>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-primary' : ''}`}>
                  Riwayat
                </span>
              </>
            )}
          </NavLink>
        </div>

        {/* Safe area spacer for phones with home indicator */}
        <div className="h-safe-area-inset-bottom bg-surface-container-lowest" />
      </nav>
    </div>
  );
}
