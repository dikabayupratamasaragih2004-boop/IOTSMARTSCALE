import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();
  const dialog   = useDialog();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await dialog.success('Selamat datang kembali!', 'Berhasil Login');
      navigate('/dashboard');
    } catch (err) {
      if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'].includes(err.code)) {
        setError('Email atau kata sandi salah.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan. Coba lagi nanti.');
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Background gradient */}
      <div className="fixed inset-0 vibrant-gradient" />

      {/* Floating decorative icons — hidden on very small screens */}
      <div className="fixed top-8 left-8 float-animation opacity-15 hidden sm:block pointer-events-none">
        <span className="material-symbols-outlined text-white" style={{ fontSize: 100 }}>agriculture</span>
      </div>
      <div className="fixed bottom-16 right-10 float-animation delay-1 opacity-15 hidden sm:block pointer-events-none">
        <span className="material-symbols-outlined text-white" style={{ fontSize: 130 }}>monitoring</span>
      </div>
      <div className="fixed top-1/3 right-1/4 float-animation delay-2 opacity-10 hidden lg:block pointer-events-none">
        <span className="material-symbols-outlined text-white" style={{ fontSize: 70 }}>eco</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-5xl mx-4 sm:mx-6 lg:mx-auto flex flex-col lg:flex-row
                      bg-white rounded-3xl shadow-2xl overflow-hidden min-h-0 lg:min-h-[580px]">

        {/* Left brand panel — hidden on mobile */}
        <div className="hidden lg:flex lg:w-5/12 vibrant-gradient p-10 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-primary">scale</span>
              </div>
              <span className="font-bold text-white text-xl">AgriWeight</span>
            </div>
            <h2 className="text-white font-bold text-3xl leading-snug mb-4">
              Presisi Digital<br />untuk Hasil Bumi.
            </h2>
            <p className="text-white/75 text-sm leading-relaxed max-w-xs">
              Sistem manajemen timbangan pintar untuk efisiensi operasional pertanian modern.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 text-white/80 text-sm">
            <div className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">person</span>
                </div>
              ))}
            </div>
            <span>Bergabung dengan 500+ Fasilitas</span>
          </div>

          {/* Decorative icon */}
          <div className="absolute -bottom-16 -right-16 opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 240 }}>precision_manufacturing</span>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">

          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-xl">scale</span>
            </div>
            <span className="font-bold text-primary text-xl">AgriWeight</span>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-2xl text-text-main mb-1">Selamat Datang</h3>
            <p className="text-text-secondary text-sm">Masuk untuk mengelola data timbangan Anda.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl pointer-events-none">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="nama@perusahaan.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-low border-2 border-transparent
                             focus:border-primary focus:bg-white rounded-2xl text-sm transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-secondary" htmlFor="password">
                  Kata Sandi
                </label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">
                  Lupa?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl pointer-events-none">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-surface-container-low border-2 border-transparent
                             focus:border-primary focus:bg-white rounded-2xl text-sm transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <span className="material-symbols-outlined text-status-error text-lg flex-shrink-0">error</span>
                <p className="text-status-error text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-[#005a3e] text-white rounded-2xl
                         font-bold text-base shadow-[0_8px_32px_rgba(0,105,72,0.3)]
                         transition-all active:scale-95 flex items-center justify-center gap-2 group
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyinkronkan...
                </>
              ) : (
                <>
                  Masuk ke Sistem
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Belum punya akun?{' '}
            <span className="text-primary font-bold cursor-pointer hover:underline">
              Hubungi Admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
